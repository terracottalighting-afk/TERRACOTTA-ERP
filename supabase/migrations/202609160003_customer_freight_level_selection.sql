begin;

alter table public.customer_freight_policy
  add column if not exists freight_level_id uuid references public.freight_level(id) on delete set null;

create index if not exists customer_freight_policy_freight_level_idx
  on public.customer_freight_policy(freight_level_id);

grant select, insert, update on table public.customer_freight_policy to service_role;

commit;
