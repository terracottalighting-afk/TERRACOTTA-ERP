create table if not exists public.report_setting_type (
  id uuid primary key default gen_random_uuid(),
  type_code text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint report_setting_type_code_not_blank check (btrim(type_code) <> ''),
  constraint report_setting_type_name_not_blank check (btrim(name) <> '')
);

insert into public.report_setting_type (type_code, name, description, sort_order)
values
  ('container_documents', 'Container Documents', 'Container invoices, packing lists, loading sheets, and related shipping documents.', 10),
  ('operational_reports', 'Operational Reports', 'Operational reports used by purchasing, warehouse, and customer-service teams.', 20),
  ('dashboards', 'Dashboards', 'Dashboard reports and performance summaries.', 30)
on conflict (type_code) do nothing;

alter table public.report_definition
  add column if not exists setting_type_code text;

update public.report_definition
set setting_type_code = case
  when report_type in ('container_invoice', 'container_packing_list') then 'container_documents'
  when name ilike '%dashboard%' then 'dashboards'
  else 'operational_reports'
end
where setting_type_code is null or btrim(setting_type_code) = '';

create index if not exists report_definition_setting_type_idx
  on public.report_definition(setting_type_code);

grant select, insert, update, delete on table public.report_setting_type to service_role;
