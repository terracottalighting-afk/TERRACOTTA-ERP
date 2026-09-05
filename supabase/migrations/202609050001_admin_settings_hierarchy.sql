-- Admin-maintained warehouse hierarchy and product part-role catalog.
-- Existing inventory locations remain the lowest physical level (Section).

create table public.warehouse_aisle (
  id uuid primary key default gen_random_uuid(),
  warehouse_zone_id uuid not null references public.warehouse_zone(id) on delete restrict,
  aisle_code text not null,
  name text not null,
  description text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint warehouse_aisle_code_not_blank check (btrim(aisle_code) <> ''),
  constraint warehouse_aisle_name_not_blank check (btrim(name) <> ''),
  unique (warehouse_zone_id, aisle_code)
);

alter table public.warehouse_location
  add column warehouse_aisle_id uuid references public.warehouse_aisle(id) on delete restrict;

create index warehouse_aisle_zone_idx on public.warehouse_aisle(warehouse_zone_id);
create index warehouse_location_aisle_idx on public.warehouse_location(warehouse_aisle_id);

-- Legacy bins were direct children of a warehouse. Preserve them as Sections
-- beneath a matching Zone and a Legacy Aisle, without touching inventory ids.
insert into public.warehouse_zone (warehouse_id, zone_code, name, description)
select distinct
  location.warehouse_id,
  location.location_code,
  coalesce(location.location_name, location.location_code),
  'Created from legacy bin/location during warehouse hierarchy migration.'
from public.warehouse_location location
where location.warehouse_zone_id is null
on conflict (warehouse_id, zone_code) do nothing;

update public.warehouse_location location
set warehouse_zone_id = zone.id
from public.warehouse_zone zone
where location.warehouse_zone_id is null
  and zone.warehouse_id = location.warehouse_id
  and zone.zone_code = location.location_code;

insert into public.warehouse_aisle (warehouse_zone_id, aisle_code, name, description)
select distinct
  location.warehouse_zone_id,
  'LEGACY',
  'Legacy Aisle',
  'Created from existing bin/location records during warehouse hierarchy migration.'
from public.warehouse_location location
where location.warehouse_zone_id is not null
on conflict (warehouse_zone_id, aisle_code) do nothing;

update public.warehouse_location location
set warehouse_aisle_id = aisle.id
from public.warehouse_aisle aisle
where location.warehouse_aisle_id is null
  and aisle.warehouse_zone_id = location.warehouse_zone_id
  and aisle.aisle_code = 'LEGACY';

create table public.product_part_role_setting (
  id uuid primary key default gen_random_uuid(),
  role_code text not null unique,
  name text not null,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_part_role_setting_code_not_blank check (btrim(role_code) <> ''),
  constraint product_part_role_setting_name_not_blank check (btrim(name) <> '')
);

insert into public.product_part_role_setting (role_code, name, sort_order)
values
  ('CHAIN', 'Chain', 10),
  ('ROD', 'Rod', 20),
  ('DECOR_GLASS', 'Decor Glass', 30),
  ('GLASS_SHADE', 'Glass Shade', 40),
  ('STONE_SHADE', 'Stone Shade', 50),
  ('OTHER_DECOR', 'Other Decor', 60),
  ('FABRIC_SHADE', 'Fabric Shade', 70),
  ('DECOR_NUT', 'Decor Nut', 80),
  ('CANOPY', 'Canopy', 90),
  ('OTHERS', 'Others', 100)
on conflict (role_code) do update set name = excluded.name, sort_order = excluded.sort_order;

grant select, insert, update on table
  public.brand,
  public.product_signature_suite,
  public.product_category,
  public.warehouse,
  public.warehouse_zone,
  public.warehouse_aisle,
  public.warehouse_location,
  public.product_part_role_setting
to service_role;
