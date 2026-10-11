create table if not exists public.container_service_invoice_document (
  id uuid primary key default gen_random_uuid(),
  container_service_invoice_id uuid not null references public.container_service_invoice(id) on delete cascade,
  file_id uuid not null references public.attachment(id) on delete restrict,
  uploaded_at timestamptz not null default now()
);

create index if not exists container_service_invoice_document_invoice_idx
  on public.container_service_invoice_document(container_service_invoice_id, uploaded_at desc);

grant select, insert, update, delete on table public.container_service_invoice_document to service_role;
