-- Fix the local variable/table-column ambiguity in the commission-aware invoice function.
create or replace function public.create_invoices_from_packing_list_with_terms(
  p_packing_list_id uuid,
  p_invoice_date date,
  p_brand_freight_allocations jsonb,
  p_brand_dropship_allocations jsonb,
  p_brand_tax_allocations jsonb,
  p_payment_terms text,
  p_payment_days integer,
  p_customer_freight_charge numeric,
  p_commission_overrides jsonb default '{}'::jsonb
)
returns setof uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  packing_row packing_list%rowtype;
  invoice_id uuid;
  invoice_brand_id uuid;
  commission_override jsonb;
  commission_payable boolean;
  commission_percent numeric;
  calculated_due_date date;
begin
  if p_payment_days < 0 then
    raise exception 'Payment days must be zero or greater';
  end if;

  if p_customer_freight_charge < 0 then
    raise exception 'Customer freight charge must be zero or greater';
  end if;

  select * into packing_row
  from packing_list
  where id = p_packing_list_id
  for update;

  if not found then
    raise exception 'Packing list % does not exist', p_packing_list_id;
  end if;

  if packing_row.invoice_generation_status_snapshot <> 'not_invoiced' then
    raise exception 'Customer freight charge can only be changed before invoice creation';
  end if;

  update packing_list
  set shipping_fee = p_customer_freight_charge,
      updated_at = now()
  where id = p_packing_list_id;

  calculated_due_date := coalesce(packing_row.ship_date, p_invoice_date) + p_payment_days;

  for invoice_id in
    select public.create_invoices_from_packing_list(
      p_packing_list_id,
      p_invoice_date,
      null,
      coalesce(p_brand_freight_allocations, '{}'::jsonb),
      coalesce(p_brand_dropship_allocations, '{}'::jsonb),
      coalesce(p_brand_tax_allocations, '{}'::jsonb)
    )
  loop
    update customer_invoice
    set payment_terms_snapshot = nullif(btrim(p_payment_terms), ''),
        due_date = calculated_due_date,
        updated_at = now()
    where id = invoice_id
    returning customer_invoice.brand_id into invoice_brand_id;

    commission_override := coalesce(p_commission_overrides -> invoice_brand_id::text, '{}'::jsonb);
    commission_payable := coalesce((commission_override ->> 'payable')::boolean, true);
    commission_percent := nullif(commission_override ->> 'percent', '')::numeric;

    perform public.apply_invoice_commission(
      invoice_id,
      commission_payable,
      commission_percent
    );

    return next invoice_id;
  end loop;
end;
$$;

grant execute on function public.create_invoices_from_packing_list_with_terms(uuid, date, jsonb, jsonb, jsonb, text, integer, numeric, jsonb) to service_role;
notify pgrst, 'reload schema';
