alter table public.import_container
  add column if not exists consolidation_loading_vendor_id uuid references public.vendor(id) on delete set null,
  add column if not exists consolidation_loading_site text,
  add column if not exists consolidation_loading_address text;

create index if not exists import_container_consolidation_loading_vendor_idx
  on public.import_container(consolidation_loading_vendor_id);
