-- Fix the output-column/table-column ambiguity when generating a statement number.
create or replace function public.create_draft_commission_statement(
  p_sales_rep_agency_id uuid,
  p_customer_invoice_ids uuid[]
)
returns table (commission_payment_id uuid, commission_payment_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  new_payment_id uuid;
  new_payment_number text;
  selected_invoice_count integer;
  eligible_invoice_count integer;
  attempts integer := 0;
begin
  select count(distinct value::uuid)
  into selected_invoice_count
  from unnest(p_customer_invoice_ids) as value;

  if selected_invoice_count = 0 then
    raise exception 'Select at least one ready invoice.';
  end if;

  select count(distinct cs.customer_invoice_id)
  into eligible_invoice_count
  from commission_snapshot cs
  where cs.sales_rep_agency_id = p_sales_rep_agency_id
    and cs.customer_invoice_id = any(p_customer_invoice_ids)
    and cs.commission_status = 'commission_ready'
    and not exists (
      select 1 from commission_payment_line cpl where cpl.commission_snapshot_id = cs.id
    );

  if eligible_invoice_count <> selected_invoice_count then
    raise exception 'One or more selected invoices are no longer ready for a new commission statement.';
  end if;

  loop
    attempts := attempts + 1;
    new_payment_number := 'CMS' || to_char(current_date, 'YYMM') || (floor(random() * 900 + 100)::integer)::text;
    exit when not exists (
      select 1 from commission_payment cp where cp.commission_payment_number = new_payment_number
    );
    if attempts >= 20 then
      raise exception 'Unable to generate a unique commission statement number.';
    end if;
  end loop;

  insert into commission_payment (
    commission_payment_number, sales_rep_agency_id, payment_date, payment_amount,
    cash_paid_amount, ar_offset_amount, status, notes
  ) values (
    new_payment_number, p_sales_rep_agency_id, current_date, 0, 0, 0, 'draft',
    'Created from commission-ready invoices.'
  ) returning id into new_payment_id;

  insert into commission_payment_line (
    commission_payment_id, commission_snapshot_id, amount_paid
  )
  select new_payment_id, cs.id, cs.commission_amount - cs.paid_amount
  from commission_snapshot cs
  where cs.sales_rep_agency_id = p_sales_rep_agency_id
    and cs.customer_invoice_id = any(p_customer_invoice_ids)
    and cs.commission_status = 'commission_ready'
    and not exists (
      select 1 from commission_payment_line cpl where cpl.commission_snapshot_id = cs.id
    );

  return query select new_payment_id, new_payment_number;
end;
$$;

grant execute on function public.create_draft_commission_statement(uuid, uuid[]) to service_role;
notify pgrst, 'reload schema';
