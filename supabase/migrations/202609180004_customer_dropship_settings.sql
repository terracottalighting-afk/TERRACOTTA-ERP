begin;

alter table public.customer_freight_policy
  add column if not exists dropship_rate_percent numeric(5,2),
  add column if not exists dropship_is_active boolean,
  add column if not exists residential_surcharge_rate_percent numeric(5,2),
  add column if not exists residential_surcharge_is_active boolean,
  add column if not exists dropship_freight_level_id uuid references public.freight_level(id) on delete set null;

commit;
