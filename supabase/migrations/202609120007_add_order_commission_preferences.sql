-- Retain the commission decision made during order review. Invoice setup uses
-- these values as its starting point while still allowing an invoice-specific override.
alter table public.sales_order
  add column if not exists commission_payable boolean not null default true,
  add column if not exists commission_rate_percent numeric(5,2);

alter table public.sales_order
  drop constraint if exists sales_order_commission_rate_percent_check;

alter table public.sales_order
  add constraint sales_order_commission_rate_percent_check
  check (
    commission_rate_percent is null
    or (commission_rate_percent >= 0 and commission_rate_percent <= 100)
  );

notify pgrst, 'reload schema';
