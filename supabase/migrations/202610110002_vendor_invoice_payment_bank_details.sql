alter table public.container_vendor_invoice
  add column if not exists payment_bank_source text,
  add column if not exists payment_bank_name text,
  add column if not exists payment_bank_account_number text,
  add column if not exists payment_routing_number text;

alter table public.container_vendor_invoice
  drop constraint if exists container_vendor_invoice_payment_bank_source_check,
  add constraint container_vendor_invoice_payment_bank_source_check
    check (payment_bank_source is null or payment_bank_source in ('custom', 'check', 'saved_vendor_bank'));
