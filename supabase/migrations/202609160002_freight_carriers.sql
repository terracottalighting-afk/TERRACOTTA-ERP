begin;

alter type public.shipping_type add value if not exists 'sea_freight';

create table public.freight_carrier (
  id uuid primary key default gen_random_uuid(),
  carrier_name text not null unique,
  freight_type text not null,
  contact_name text,
  contact_email text,
  website text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint freight_carrier_name_not_blank check (btrim(carrier_name) <> ''),
  constraint freight_carrier_type_valid check (freight_type in ('small_parcel_ground', 'ltl', 'sea_freight'))
);

create trigger set_freight_carrier_updated_at
  before update on public.freight_carrier
  for each row execute function public.set_updated_at();

grant select, insert, update, delete on table public.freight_carrier to service_role;

commit;
