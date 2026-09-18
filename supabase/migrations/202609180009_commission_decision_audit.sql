begin;

alter table public.packing_list
  add column if not exists commission_payable_snapshot boolean not null default true,
  add column if not exists commission_rate_percent_snapshot numeric(5,2);

update public.packing_list packing
set
  commission_payable_snapshot = orders.commission_payable,
  commission_rate_percent_snapshot = orders.commission_rate_percent
from public.sales_order orders
where orders.id = packing.sales_order_id;

create table if not exists public.sales_order_commission_decision_change (
  id uuid primary key default gen_random_uuid(),
  sales_order_id uuid not null references public.sales_order(id),
  packing_list_id uuid not null references public.packing_list(id),
  brand_id uuid not null references public.brand(id),
  previous_payable boolean not null,
  new_payable boolean not null,
  reason text not null check (btrim(reason) <> ''),
  created_at timestamptz not null default now(),
  created_by_user_id uuid references public.user_account(id)
);

create index if not exists sales_order_commission_decision_change_order_idx
  on public.sales_order_commission_decision_change(sales_order_id, created_at desc);

create or replace function public.create_invoices_from_packing_list_with_terms(
  p_packing_list_id uuid,
  p_invoice_date date,
  p_brand_freight_allocations jsonb,
  p_brand_dropship_allocations jsonb,
  p_brand_tax_allocations jsonb,
  p_payment_terms text,
  p_payment_days integer,
  p_customer_freight_charge numeric,
  p_commission_overrides jsonb default '{}'::jsonb,
  p_commission_override_reasons jsonb default '{}'::jsonb
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
  commission_reason text;
  calculated_due_date date;
begin
  if p_payment_days < 0 or p_customer_freight_charge < 0 then
    raise exception 'Payment days and customer freight charge must be zero or greater';
  end if;

  select * into packing_row from packing_list where id = p_packing_list_id for update;
  if not found then raise exception 'Packing list % does not exist', p_packing_list_id; end if;
  if packing_row.invoice_generation_status_snapshot <> 'not_invoiced' then
    raise exception 'Invoices can only be created from an uninvoiced packing list';
  end if;

  update packing_list set shipping_fee = p_customer_freight_charge, updated_at = now()
  where id = p_packing_list_id;
  calculated_due_date := coalesce(packing_row.ship_date, p_invoice_date) + p_payment_days;

  for invoice_id in
    select public.create_invoices_from_packing_list(
      p_packing_list_id, p_invoice_date, null,
      coalesce(p_brand_freight_allocations, '{}'::jsonb),
      coalesce(p_brand_dropship_allocations, '{}'::jsonb),
      coalesce(p_brand_tax_allocations, '{}'::jsonb)
    )
  loop
    update customer_invoice
    set payment_terms_snapshot = nullif(btrim(p_payment_terms), ''), due_date = calculated_due_date, updated_at = now()
    where id = invoice_id returning customer_invoice.brand_id into invoice_brand_id;

    commission_override := coalesce(p_commission_overrides -> invoice_brand_id::text, '{}'::jsonb);
    commission_payable := coalesce((commission_override ->> 'payable')::boolean, packing_row.commission_payable_snapshot);
    commission_percent := nullif(commission_override ->> 'percent', '')::numeric;
    commission_reason := nullif(btrim(coalesce(p_commission_override_reasons ->> invoice_brand_id::text, '')), '');

    if commission_payable is distinct from packing_row.commission_payable_snapshot then
      if commission_reason is null then
        raise exception 'A commission decision-change note is required';
      end if;
      insert into sales_order_commission_decision_change (
        sales_order_id, packing_list_id, brand_id, previous_payable, new_payable, reason
      ) values (
        packing_row.sales_order_id, packing_row.id, invoice_brand_id,
        packing_row.commission_payable_snapshot, commission_payable, commission_reason
      );
    end if;

    perform public.apply_invoice_commission(invoice_id, commission_payable, commission_percent);
    return next invoice_id;
  end loop;
end;
$$;

grant execute on function public.create_invoices_from_packing_list_with_terms(uuid, date, jsonb, jsonb, jsonb, text, integer, numeric, jsonb, jsonb) to service_role;
notify pgrst, 'reload schema';

commit;
