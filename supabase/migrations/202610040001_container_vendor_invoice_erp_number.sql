alter table public.container_vendor_invoice
  add column if not exists erp_invoice_number text;

with numbered_invoices as (
  select
    id,
    'CVI' || to_char(created_at at time zone 'UTC', 'YYYYMMDD') || '-' ||
      lpad(row_number() over (partition by (created_at at time zone 'UTC')::date order by created_at, id)::text, 4, '0') as generated_number
  from public.container_vendor_invoice
  where erp_invoice_number is null or btrim(erp_invoice_number) = ''
)
update public.container_vendor_invoice as invoice
set erp_invoice_number = numbered_invoices.generated_number
from numbered_invoices
where invoice.id = numbered_invoices.id;

alter table public.container_vendor_invoice
  alter column erp_invoice_number set not null,
  add constraint container_vendor_invoice_erp_invoice_number_key unique (erp_invoice_number);

create or replace function public.generate_container_vendor_invoice_number()
returns text
language plpgsql
as $$
begin
  return public.generate_prefixed_daily_number('CVI', 'container_vendor_invoice', 'erp_invoice_number');
end;
$$;

create or replace function public.set_container_vendor_invoice_number()
returns trigger
language plpgsql
as $$
begin
  if new.erp_invoice_number is null or btrim(new.erp_invoice_number) = '' then
    new.erp_invoice_number := public.generate_container_vendor_invoice_number();
  end if;

  return new;
end;
$$;

drop trigger if exists set_container_vendor_invoice_number on public.container_vendor_invoice;
create trigger set_container_vendor_invoice_number
  before insert on public.container_vendor_invoice
  for each row execute function public.set_container_vendor_invoice_number();

alter table public.container_vendor_invoice
  alter column erp_invoice_number set default public.generate_container_vendor_invoice_number();
