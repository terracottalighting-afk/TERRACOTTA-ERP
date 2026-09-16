begin;

create table public.freight_level (
  id uuid primary key default gen_random_uuid(),
  level_name text not null unique,
  free_freight_allowance numeric(14,2) not null,
  freight_rate_percent numeric(7,4) not null,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint freight_level_name_not_blank check (btrim(level_name) <> ''),
  constraint freight_level_allowance_nonnegative check (free_freight_allowance >= 0),
  constraint freight_level_rate_nonnegative check (freight_rate_percent >= 0)
);

create table public.freight_level_customer_group (
  id uuid primary key default gen_random_uuid(),
  freight_level_id uuid not null references public.freight_level(id) on delete cascade,
  account_type_id uuid not null references public.customer_account_type(id) on delete restrict,
  primary_showroom_requirement boolean,
  created_at timestamptz not null default now()
);

create unique index freight_level_customer_group_unique_rule
  on public.freight_level_customer_group (
    freight_level_id,
    account_type_id,
    coalesce(primary_showroom_requirement, false),
    (primary_showroom_requirement is null)
  );

create index freight_level_customer_group_account_type_idx
  on public.freight_level_customer_group(account_type_id);

create trigger set_freight_level_updated_at
  before update on public.freight_level
  for each row execute function public.set_updated_at();

grant select, insert, update, delete on table public.freight_level to service_role;
grant select, insert, update, delete on table public.freight_level_customer_group to service_role;

commit;
