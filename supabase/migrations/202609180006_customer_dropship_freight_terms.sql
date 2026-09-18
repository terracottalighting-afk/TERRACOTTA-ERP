begin;

alter table public.customer_freight_policy
  add column if not exists dropship_freight_terms public.freight_terms;

commit;
