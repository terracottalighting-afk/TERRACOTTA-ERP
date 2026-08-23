-- Record and apply a single customer payment directly to one brand-specific invoice.
-- The payment/application triggers maintain the invoice balance and payment status.
create or replace function public.record_customer_payment_for_invoice(
  p_customer_invoice_id uuid,
  p_payment_date date,
  p_payment_method customer_payment_method,
  p_amount numeric,
  p_reference_number text default null,
  p_memo text default null,
  p_recorded_by_user_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  invoice_row customer_invoice%rowtype;
  acting_user_id uuid;
  payment_id uuid;
begin
  select * into invoice_row
  from customer_invoice
  where id = p_customer_invoice_id
  for update;

  if not found then
    raise exception 'Invoice % does not exist', p_customer_invoice_id;
  end if;

  if invoice_row.invoice_status = 'void' then
    raise exception 'A void invoice cannot receive a payment';
  end if;

  if coalesce(invoice_row.balance_due, 0) <= 0 then
    raise exception 'This invoice does not have a balance due';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Payment amount must be greater than zero';
  end if;

  if p_amount > invoice_row.balance_due then
    raise exception 'Payment amount cannot exceed the invoice balance due';
  end if;

  select id into acting_user_id
  from user_account
  where id = p_recorded_by_user_id
    and is_active;

  if acting_user_id is null then
    select id into acting_user_id
    from user_account
    where is_active
      and user_type in ('internal', 'system')
    order by created_at
    limit 1;
  end if;

  if acting_user_id is null then
    raise exception 'No active internal user is available to record the payment';
  end if;

  insert into customer_payment (
    payment_number,
    brand_id,
    customer_account_id,
    payment_date,
    payment_method,
    reference_number,
    amount_received,
    amount_applied,
    memo,
    status,
    posted_at,
    posted_by_user_id,
    created_by_user_id,
    updated_by_user_id
  ) values (
    '',
    invoice_row.brand_id,
    invoice_row.customer_account_id,
    coalesce(p_payment_date, current_date),
    p_payment_method,
    nullif(btrim(coalesce(p_reference_number, '')), ''),
    p_amount,
    0,
    nullif(btrim(coalesce(p_memo, '')), ''),
    'posted',
    now(),
    acting_user_id,
    acting_user_id,
    acting_user_id
  ) returning id into payment_id;

  insert into customer_payment_application (
    customer_payment_id,
    customer_invoice_id,
    amount_applied,
    applied_date,
    applied_by_user_id,
    application_status
  ) values (
    payment_id,
    invoice_row.id,
    p_amount,
    coalesce(p_payment_date, current_date),
    acting_user_id,
    'posted'
  );

  return payment_id;
end;
$$;

grant execute on function public.record_customer_payment_for_invoice(uuid, date, customer_payment_method, numeric, text, text, uuid) to service_role;
