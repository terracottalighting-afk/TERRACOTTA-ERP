create table public.container_vendor_invoice_document (
  id uuid primary key default gen_random_uuid(),
  container_vendor_invoice_id uuid not null references public.container_vendor_invoice(id) on delete cascade,
  file_id uuid not null references public.attachment(id) on delete restrict,
  display_name text,
  uploaded_at timestamptz not null default now()
);

create index container_vendor_invoice_document_invoice_idx
  on public.container_vendor_invoice_document(container_vendor_invoice_id, uploaded_at desc);

grant select, insert, update, delete on table public.container_vendor_invoice_document to service_role;
