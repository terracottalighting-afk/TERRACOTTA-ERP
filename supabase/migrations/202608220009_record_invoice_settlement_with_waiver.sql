-- Record an optional credit memo, documented waiver, and remaining customer payment atomically.
-- The posted AR adjustment trigger refreshes the invoice balance and payment status.
create or replace function public.record_invoice_settlement_with_waiver(
  p_customer_invoice_id uuid,
  p_payment_date date,
  p_payment_method customer_payment_method,
  p_customer_payment_amount numeric default 0,
  p_credit_memo_id uuid default null,
  p_credit_memo_amount numeric default 0,
  p_waiver_amount numeric default 0,
  p_waiver_reason text default null,
  p_reference_number text default null,
  p_memo text default null,
  p_recorded_by_user_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  invoice_row customer_invoice%rowtype;
  credit_memo_row credit_memo%rowtype;
  acting_user_id uuid;
  payment_id uuid;
  payment_application_id uuid;
  credit_application_id uuid;
  waiver_adjustment_id uuid;
  available_credit numeric(14,2);
  settlement_total numeric(14,2);
begin
  select * into invoice_row
  from customer_invoice
  where id = p_customer_invoice_id
  for update;

  if not found then
    raise exception 'Invoice % does not exist', p_customer_invoice_id;
  end if;
  if invoice_row.invoice_status = 'void' then
    raise exception 'A void invoice cannot receive a settlement';
  end if;
  if coalesce(invoice_row.balance_due, 0) <= 0 then
    raise exception 'This invoice does not have a balance due';
  end if;

  p_customer_payment_amount := coalesce(p_customer_payment_amount, 0);
  p_credit_memo_amount := coalesce(p_credit_memo_amount, 0);
  p_waiver_amount := coalesce(p_waiver_amount, 0);
  settlement_total := p_customer_payment_amount + p_credit_memo_amount + p_waiver_amount;

  if p_customer_payment_amount < 0 or p_credit_memo_amount < 0 or p_waiver_amount < 0 then
    raise exception 'Payment, credit memo, and waiver amounts cannot be negative';
  end if;
  if settlement_total <= 0 then
    raise exception 'Apply a credit memo, waiver, customer payment, or a combination';
  end if;
  if settlement_total > invoice_row.balance_due then
    raise exception 'The total settlement cannot exceed the invoice balance due';
  end if;
  if p_waiver_amount > 0 and nullif(btrim(coalesce(p_waiver_reason, '')), '') is null then
    raise exception 'A reason is required when waiving an amount';
  end if;
  if p_credit_memo_amount > 0 and p_credit_memo_id is null then
    raise exception 'Choose a credit memo before applying credit';
  end if;

  select id into acting_user_id from user_account
  where id = p_recorded_by_user_id and is_active;
  if acting_user_id is null then
    select id into acting_user_id from user_account
    where is_active and user_type in ('internal', 'system')
    order by created_at limit 1;
  end if;
  if acting_user_id is null then
    raise exception 'No active internal user is available to record the settlement';
  end if;

  if p_credit_memo_id is not null then
    select * into credit_memo_row from credit_memo where id = p_credit_memo_id for update;
    if not found then raise exception 'The selected credit memo does not exist'; end if;
    if credit_memo_row.status not in ('posted', 'partially_applied') then
      raise exception 'Only posted credit memos with an available balance can be applied';
    end if;
    if credit_memo_row.customer_account_id <> invoice_row.customer_account_id
      or credit_memo_row.brand_id <> invoice_row.brand_id then
      raise exception 'The credit memo must belong to the same customer and brand as the invoice';
    end if;
    select coalesce(credit_memo_row.total_credit_amount - sum(amount_applied), credit_memo_row.total_credit_amount)
      into available_credit
      from credit_memo_application
      where credit_memo_id = credit_memo_row.id and application_status = 'posted';
    if p_credit_memo_amount > available_credit then
      raise exception 'The credit memo amount exceeds its available credit';
    end if;
  elsif p_credit_memo_amount > 0 then
    raise exception 'Choose a credit memo before applying credit';
  end if;

  if p_customer_payment_amount > 0 then
    insert into customer_payment (
      payment_number, brand_id, customer_account_id, payment_date, payment_method,
      reference_number, amount_received, amount_applied, memo, status, posted_at,
      posted_by_user_id, created_by_user_id, updated_by_user_id
    ) values (
      '', invoice_row.brand_id, invoice_row.customer_account_id, coalesce(p_payment_date, current_date),
      p_payment_method, nullif(btrim(coalesce(p_reference_number, '')), ''), p_customer_payment_amount,
      0, nullif(btrim(coalesce(p_memo, '')), ''), 'posted', now(), acting_user_id, acting_user_id, acting_user_id
    ) returning id into payment_id;

    insert into customer_payment_application (
      customer_payment_id, customer_invoice_id, amount_applied, applied_date, applied_by_user_id, application_status
    ) values (
      payment_id, invoice_row.id, p_customer_payment_amount, coalesce(p_payment_date, current_date), acting_user_id, 'posted'
    ) returning id into payment_application_id;
  end if;

  if p_credit_memo_amount > 0 then
    insert into credit_memo_application (
      credit_memo_id, customer_invoice_id, customer_payment_id, customer_payment_application_id,
      amount_applied, source_transaction_type, source_transaction_id, applied_date,
      applied_by_user_id, application_status, notes
    ) values (
      p_credit_memo_id, invoice_row.id, payment_id, payment_application_id, p_credit_memo_amount,
      'payment_entry', payment_id, coalesce(p_payment_date, current_date), acting_user_id,
      'posted', nullif(btrim(coalesce(p_memo, '')), '')
    ) returning id into credit_application_id;
  end if;

  if p_waiver_amount > 0 then
    insert into ar_adjustment (
      adjustment_number, customer_account_id, brand_id, customer_invoice_id, adjustment_type,
      reason_code, amount, adjustment_date, approved_by_user_id, created_by_user_id, notes, status
    ) values (
      '', invoice_row.customer_account_id, invoice_row.brand_id, invoice_row.id, 'waive',
      'payment_settlement_waiver', p_waiver_amount, coalesce(p_payment_date, current_date),
      acting_user_id, acting_user_id, nullif(btrim(coalesce(p_waiver_reason, '')), ''), 'posted'
    ) returning id into waiver_adjustment_id;
  end if;

  return jsonb_build_object(
    'payment_id', payment_id,
    'credit_memo_application_id', credit_application_id,
    'waiver_adjustment_id', waiver_adjustment_id,
    'customer_payment_amount', p_customer_payment_amount,
    'credit_memo_amount', p_credit_memo_amount,
    'waiver_amount', p_waiver_amount
  );
end;
$$;

grant execute on function public.record_invoice_settlement_with_waiver(uuid, date, customer_payment_method, numeric, uuid, numeric, numeric, text, text, text, uuid) to service_role;
