create table if not exists public.report_definition (
  id uuid primary key default gen_random_uuid(),
  report_code text not null unique,
  report_type text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint report_definition_type_not_blank check (btrim(report_type) <> ''),
  constraint report_definition_name_not_blank check (btrim(name) <> '')
);

alter table public.report_definition
  alter column report_type type text using report_type::text,
  add column if not exists report_code text,
  add column if not exists description text,
  add column if not exists sort_order integer not null default 100,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.report_definition
set report_code = report_type
where report_code is null or btrim(report_code) = '';

insert into public.report_definition (report_code, report_type, name, description, sort_order)
select definition.report_code, definition.report_type, definition.name, definition.description, definition.sort_order
from (
  values
    ('container_invoice', 'container_invoice', 'Container Invoice', 'Commercial vendor invoice generated from the products loaded in a container.', 10),
    ('container_packing_list', 'container_packing_list', 'Container Packing List', 'Container and vendor packing lists used for loading, shipping, and customs.', 20)
) as definition(report_code, report_type, name, description, sort_order)
where not exists (
  select 1 from public.report_definition existing where existing.report_type = definition.report_type
)
and not exists (
  select 1 from public.report_definition existing where existing.report_code = definition.report_code
);

alter table public.report_field_mapping
  drop constraint if exists report_field_mapping_report_type_check;

grant select, insert, update, delete on table public.report_definition to service_role;
