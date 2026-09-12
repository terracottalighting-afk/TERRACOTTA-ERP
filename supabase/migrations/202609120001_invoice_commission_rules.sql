-- Applies the sales-agency commission rule at invoice posting time. Commission
-- is paid only when one active agency owns the invoice territory.
create or replace function public.apply_invoice_commission(
  p_customer_invoice_id uuid,
  p_commission_payable boolean default true,
  p_commission_percent numeric default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  invoice_row customer_invoice%rowtype;
  order_row sales_order%rowtype;
  agency_ids uuid[];
  resolved_agency_id uuid;
  resolved_rep_id uuid;
  resolved_percent numeric(5,2);
  exclusion_reason text;
begin
  select * into invoice_row
  from customer_invoice
  where id = p_customer_invoice_id
  for update;

  if not found then
    raise exception 'Customer invoice % does not exist', p_customer_invoice_id;
  end if;

  select * into order_row
  from sales_order
  where id = invoice_row.sales_order_id;

  if not found then
    raise exception 'Sales order % does not exist', invoice_row.sales_order_id;
  end if;

  if order_row.order_type = 'rga_replacement' then
    p_commission_payable := false;
    exclusion_reason := 'RGA replacement invoices do not earn commission.';
  elsif not p_commission_payable then
    exclusion_reason := 'Commission disabled during invoice creation.';
  elsif invoice_row.territory_id_snapshot is null then
    p_commission_payable := false;
    exclusion_reason := 'No territory is assigned to the invoice or its sales order.';
  else
    select array_agg(distinct ta.sales_rep_agency_id)
    into agency_ids
    from territory_assignment ta
    join sales_rep_agency sra on sra.id = ta.sales_rep_agency_id
    where ta.territory_id = invoice_row.territory_id_snapshot
      and ta.status = 'active'
      and ta.end_date is null
      and sra.status = 'active';

    if coalesce(cardinality(agency_ids), 0) = 0 then
      p_commission_payable := false;
      exclusion_reason := 'No active sales agency is assigned to the invoice territory.';
    elsif cardinality(agency_ids) <> 1 then
      p_commission_payable := false;
      exclusion_reason := 'More than one active sales agency is assigned to the invoice territory.';
    else
      resolved_agency_id := agency_ids[1];
      select commission_default_percent
      into resolved_percent
      from sales_rep_agency
      where id = resolved_agency_id;

      resolved_percent := coalesce(p_commission_percent, resolved_percent, 0);
      if resolved_percent < 0 or resolved_percent > 100 then
        raise exception 'Commission rate must be between 0 and 100 percent';
      end if;

      select srta.sales_rep_id
      into resolved_rep_id
      from sales_rep_territory_assignment srta
      join sales_rep sr on sr.id = srta.sales_rep_id
      where srta.territory_id = invoice_row.territory_id_snapshot
        and srta.status = 'active'
        and srta.end_date is null
        and sr.status = 'active'
        and sr.sales_rep_agency_id = resolved_agency_id
      order by srta.start_date desc, srta.created_at desc
      limit 1;
    end if;
  end if;

  delete from commission_snapshot
  where customer_invoice_id = invoice_row.id;

  if not p_commission_payable then
    update customer_invoice
    set commission_payable = false,
        commission_status = 'no_commission',
        commission_exclusion_reason = exclusion_reason,
        sales_rep_agency_id_snapshot = null,
        sales_rep_id_snapshot = null,
        updated_at = now()
    where id = invoice_row.id;
    return;
  end if;

  update customer_invoice
  set commission_payable = true,
      commission_status = 'not_ready',
      commission_exclusion_reason = null,
      sales_rep_agency_id_snapshot = resolved_agency_id,
      sales_rep_id_snapshot = resolved_rep_id,
      updated_at = now()
  where id = invoice_row.id;

  insert into commission_snapshot (
    customer_invoice_id,
    customer_invoice_line_id,
    sales_order_id,
    sales_order_line_id,
    sales_rep_agency_id,
    sales_rep_id,
    territory_id,
    commission_percent,
    commission_base_amount,
    ownership_rule,
    snapshot_date,
    commission_status
  )
  select
    invoice_row.id,
    cil.id,
    invoice_row.sales_order_id,
    cil.sales_order_line_id,
    resolved_agency_id,
    resolved_rep_id,
    invoice_row.territory_id_snapshot,
    resolved_percent,
    cil.line_total,
    'territory',
    invoice_row.invoice_date,
    'not_ready'
  from customer_invoice_line cil
  where cil.customer_invoice_id = invoice_row.id;
end;
$$;

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

grant execute on function public.apply_invoice_commission(uuid, boolean, numeric) to service_role;
grant execute on function public.create_invoices_from_packing_list_with_terms(uuid, date, jsonb, jsonb, jsonb, text, integer, numeric, jsonb) to service_role;
grant select, insert, update, delete on table public.commission_snapshot to service_role;
grant select on table public.commission_payment to service_role;
grant select on table public.commission_payment_line to service_role;
notify pgrst, 'reload schema';
