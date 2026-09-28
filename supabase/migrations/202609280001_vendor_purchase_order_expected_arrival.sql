alter table public.vendor_purchase_order
  add column if not exists expected_arrival_date date;

grant select, insert, update on table public.vendor_purchase_order to service_role;
