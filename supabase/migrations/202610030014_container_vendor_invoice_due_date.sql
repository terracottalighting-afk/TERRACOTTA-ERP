alter table public.container_vendor_invoice
  add column if not exists due_date date;
