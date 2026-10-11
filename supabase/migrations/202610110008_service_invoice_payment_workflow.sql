alter table public.container_service_invoice
  add column if not exists payment_bank_source text check (payment_bank_source in ('custom', 'check', 'saved_agency_bank')),
  add column if not exists payment_bank_name text,
  add column if not exists payment_bank_account_number text,
  add column if not exists payment_routing_number text;

alter table public.container_service_invoice_document
  add column if not exists document_scope text not null default 'invoice' check (document_scope in ('invoice', 'payment')),
  add column if not exists display_name text;
