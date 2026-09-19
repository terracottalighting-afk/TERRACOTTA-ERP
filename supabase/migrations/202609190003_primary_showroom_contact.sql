begin;

alter table public.customer_contact
  add column if not exists is_primary_showroom_contact boolean not null default false;

create unique index customer_contact_one_primary_showroom_contact_per_location
  on public.customer_contact(customer_location_id)
  where is_primary_showroom_contact and customer_location_id is not null;

commit;
