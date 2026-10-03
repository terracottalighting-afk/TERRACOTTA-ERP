create table if not exists public.report_definition (
  id uuid primary key default gen_random_uuid(),
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
  add column if not exists description text,
  add column if not exists sort_order integer not null default 100,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

insert into public.report_definition (report_type, name, description, sort_order)
values
  ('container_invoice', 'Container Invoice', 'Commercial vendor invoice generated from the products loaded in a container.', 10),
  ('container_packing_list', 'Container Packing List', 'Container and vendor packing lists used for loading, shipping, and customs.', 20)
on conflict (report_type) do nothing;

alter table public.report_field_mapping
  drop constraint if exists report_field_mapping_report_type_check;

grant select, insert, update, delete on table public.report_definition to service_role;
