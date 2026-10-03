create table if not exists public.report_mapping_object_source (
  id uuid primary key default gen_random_uuid(),
  object_code text not null check (object_code in ('product', 'vendor', 'purchase_order', 'container', 'container_line')),
  source_code text not null,
  source_label text not null,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint report_mapping_object_source_label_not_blank check (btrim(source_label) <> ''),
  unique (object_code, source_code)
);

create index if not exists report_mapping_object_source_object_idx
  on public.report_mapping_object_source (object_code, sort_order, source_label);

insert into public.report_mapping_object_source (object_code, source_code, source_label, sort_order)
values
  ('product', 'product_hs_code', 'HS Code', 10),
  ('product', 'product_category_name', 'Category', 20),
  ('product', 'product_sku', 'SKU', 30)
on conflict (object_code, source_code) do nothing;

grant select, insert, update, delete on table public.report_mapping_object_source to service_role;
