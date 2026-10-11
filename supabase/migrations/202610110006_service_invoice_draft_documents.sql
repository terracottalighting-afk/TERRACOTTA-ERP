create table if not exists public.container_service_invoice_draft_document (
  id uuid primary key default gen_random_uuid(),
  import_container_id uuid not null references public.import_container(id) on delete cascade,
  service_type text not null check (service_type in ('shipping_agency', 'tariff_broker')),
  file_id uuid not null references public.attachment(id) on delete restrict,
  uploaded_at timestamptz not null default now()
);

create index if not exists container_service_invoice_draft_document_lookup_idx
  on public.container_service_invoice_draft_document(import_container_id, service_type, uploaded_at desc);

grant select, insert, update, delete on table public.container_service_invoice_draft_document to service_role;
