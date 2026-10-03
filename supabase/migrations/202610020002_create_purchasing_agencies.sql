create table if not exists public.purchasing_agency (
  id uuid primary key default gen_random_uuid(),
  business_type text not null check (business_type in ('shipping', 'customs_broker')),
  agency_name text not null check (btrim(agency_name) <> ''),
  address text,
  contact_name text,
  contact_email text,
  contact_phone text,
  bank_name text,
  bank_swift_code text,
  bank_ach_routing_number text,
  bank_account_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_type, agency_name)
);

create index if not exists purchasing_agency_business_type_idx
  on public.purchasing_agency(business_type, agency_name);

grant select, insert, update, delete on table public.purchasing_agency to service_role;
