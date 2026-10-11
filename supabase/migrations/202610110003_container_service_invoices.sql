create table if not exists public.container_service_invoice (
  id uuid primary key default gen_random_uuid(),
  import_container_id uuid not null references public.import_container(id) on delete cascade,
  purchasing_agency_id uuid references public.purchasing_agency(id) on delete set null,
  service_type text not null check (service_type in ('shipping_agency', 'tariff_broker')),
  agency_name_snapshot text not null check (btrim(agency_name_snapshot) <> ''),
  erp_invoice_number text not null,
  agency_invoice_number text not null check (btrim(agency_invoice_number) <> ''),
  invoice_date date not null default current_date,
  due_date date not null,
  total_amount numeric(14, 2) not null check (total_amount >= 0),
  container_number_snapshot text not null,
  booking_number_snapshot text,
  vessel_name_snapshot text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (erp_invoice_number)
);

create index if not exists container_service_invoice_container_idx
  on public.container_service_invoice(import_container_id, service_type);

create index if not exists container_service_invoice_agency_idx
  on public.container_service_invoice(purchasing_agency_id, invoice_date desc);

create or replace function public.generate_container_service_invoice_number(target_service_type text)
returns text
language plpgsql
as $$
begin
  if target_service_type = 'shipping_agency' then
    return public.generate_prefixed_daily_number('SAI', 'container_service_invoice', 'erp_invoice_number');
  end if;
  return public.generate_prefixed_daily_number('BRI', 'container_service_invoice', 'erp_invoice_number');
end;
$$;

create or replace function public.set_container_service_invoice_number()
returns trigger
language plpgsql
as $$
begin
  if new.erp_invoice_number is null or btrim(new.erp_invoice_number) = '' then
    new.erp_invoice_number := public.generate_container_service_invoice_number(new.service_type);
  end if;
  return new;
end;
$$;

drop trigger if exists set_container_service_invoice_number on public.container_service_invoice;
create trigger set_container_service_invoice_number
  before insert on public.container_service_invoice
  for each row execute function public.set_container_service_invoice_number();

grant select, insert, update, delete on table public.container_service_invoice to service_role;
