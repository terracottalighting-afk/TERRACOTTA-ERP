alter table public.container_vendor_invoice
  add column if not exists invoice_status text not null default 'open',
  add column if not exists paid_date date,
  add column if not exists paid_amount numeric(14,2),
  add column if not exists payment_method text,
  add column if not exists payment_reference text,
  add column if not exists payment_notes text;

alter table public.container_vendor_invoice
  drop constraint if exists container_vendor_invoice_status_check,
  add constraint container_vendor_invoice_status_check check (invoice_status in ('open', 'paid')),
  drop constraint if exists container_vendor_invoice_paid_details_check,
  add constraint container_vendor_invoice_paid_details_check check (invoice_status <> 'paid' or paid_date is not null);

create index if not exists container_vendor_invoice_status_idx
  on public.container_vendor_invoice(invoice_status);
