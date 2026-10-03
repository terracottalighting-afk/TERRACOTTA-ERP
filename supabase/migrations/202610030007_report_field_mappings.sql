create table if not exists public.report_field_mapping (
  id uuid primary key default gen_random_uuid(),
  report_type text not null check (report_type in ('container_invoice', 'container_packing_list')),
  field_code text not null,
  display_label text not null,
  data_source text not null,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint report_field_mapping_label_not_blank check (btrim(display_label) <> ''),
  unique (report_type, field_code)
);

insert into public.report_field_mapping (report_type, field_code, display_label, data_source, sort_order)
values
  ('container_invoice', 'hs_code', 'HS', 'product_hs_code', 10),
  ('container_invoice', 'description', 'Description', 'product_category_name', 20),
  ('container_packing_list', 'hs_code', 'HS', 'product_hs_code', 10)
on conflict (report_type, field_code) do nothing;

grant select, insert, update on table public.report_field_mapping to service_role;
