alter table public.vendor
  add column if not exists price_terms text,
  add column if not exists price_currency text,
  add column if not exists default_lead_time_days integer,
  add column if not exists default_minimum_order_quantity numeric(14,3),
  add column if not exists prototype_sample_discount_percent numeric(5,2),
  add column if not exists terms_notes text,
  add column if not exists bank_name text,
  add column if not exists bank_address text,
  add column if not exists bank_city text,
  add column if not exists bank_country text,
  add column if not exists bank_swift_code text,
  add column if not exists bank_ach_routing_code text,
  add column if not exists bank_account_number text;

alter table public.vendor_product
  add column if not exists product_type text,
  add column if not exists hs_code text,
  add column if not exists box_width_inches numeric(12,3),
  add column if not exists box_depth_inches numeric(12,3),
  add column if not exists box_height_inches numeric(12,3),
  add column if not exists net_weight_lbs numeric(12,3),
  add column if not exists gross_weight_lbs numeric(12,3);

alter table public.vendor
  add constraint vendor_default_lead_time_nonnegative check (default_lead_time_days is null or default_lead_time_days >= 0),
  add constraint vendor_default_moq_positive check (default_minimum_order_quantity is null or default_minimum_order_quantity > 0),
  add constraint vendor_prototype_discount_range check (prototype_sample_discount_percent is null or prototype_sample_discount_percent between 0 and 100);

grant select, insert, update on table public.vendor to service_role;
grant select, insert, update on table public.vendor_product to service_role;
