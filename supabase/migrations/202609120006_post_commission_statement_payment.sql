create or replace function public.post_commission_statement_payment(
  p_commission_payment_id uuid,
  p_payment_date date,
  p_payment_type commission_payment_type,
  p_payment_reference text default null,
  p_posted_by_user_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  payment_row commission_payment%rowtype;
  acting_user_id uuid;
  statement_total numeric(14,2);
begin
  select * into payment_row from commission_payment where id = p_commission_payment_id for update;
  if not found then raise exception 'Commission statement does not exist'; end if;
  if payment_row.status <> 'draft' then raise exception 'Only draft commission statements can be paid'; end if;

  select coalesce(sum(amount_paid), 0) into statement_total
  from commission_payment_line
  where commission_payment_id = payment_row.id;
  if statement_total <= 0 then raise exception 'A commission statement must include at least one commission item'; end if;

  select id into acting_user_id from user_account where id = p_posted_by_user_id and is_active;
  if acting_user_id is null then
    select id into acting_user_id from user_account where is_active and user_type in ('internal', 'system') order by created_at limit 1;
  end if;
  if acting_user_id is null then raise exception 'No active internal user is available to post the commission payment'; end if;

  update commission_payment
  set payment_date = coalesce(p_payment_date, current_date),
      payment_type = coalesce(p_payment_type, 'ach'),
      payment_reference = nullif(btrim(coalesce(p_payment_reference, '')), ''),
      payment_amount = statement_total,
      cash_paid_amount = statement_total,
      ar_offset_amount = 0,
      status = 'posted',
      posted_at = now(),
      posted_by_user_id = acting_user_id,
      updated_by_user_id = acting_user_id,
      updated_at = now()
  where id = payment_row.id;
end;
$$;

grant execute on function public.post_commission_statement_payment(uuid, date, commission_payment_type, text, uuid) to service_role;
notify pgrst, 'reload schema';
