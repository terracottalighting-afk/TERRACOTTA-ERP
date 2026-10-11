alter table public.container_service_invoice
  add column if not exists invoice_status text not null default 'open' check (invoice_status in ('open', 'paid')),
  add column if not exists paid_date date,
  add column if not exists paid_amount numeric(14, 2),
  add column if not exists payment_method text,
  add column if not exists payment_reference text,
  add column if not exists payment_notes text;
