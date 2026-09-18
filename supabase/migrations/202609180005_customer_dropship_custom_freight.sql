begin;

alter table public.customer_freight_policy
  add column if not exists dropship_freight_allowance_amount numeric(12,2),
  add column if not exists dropship_freight_rate_percent numeric(5,2);

commit;
