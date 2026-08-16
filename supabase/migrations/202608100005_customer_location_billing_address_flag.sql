alter table customer_location
  add column if not exists is_billing_address boolean not null default false;
