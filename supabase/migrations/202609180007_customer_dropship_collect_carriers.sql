begin;

alter table public.customer_freight_policy
  add column if not exists dropship_default_ground_carrier text,
  add column if not exists dropship_default_ground_carrier_account_number text,
  add column if not exists dropship_default_ltl_carrier text,
  add column if not exists dropship_default_ltl_carrier_account_number text;

commit;
