create type customer_account_status as enum ('pending', 'active', 'inactive', 'credit_hold');
create type customer_location_status as enum ('active', 'inactive');
create type customer_location_type as enum ('ship_to', 'showroom', 'ecommerce_platform', 'billing', 'warehouse', 'job_site', 'other');
create type credit_limit_source as enum ('system_default', 'customer_override');
create type delivery_method as enum ('email', 'print', 'both');
create type freight_terms as enum ('prepaid', 'collect', 'customer_pickup', 'free_freight', 'manual_review');
create type primary_showroom_status as enum ('pending', 'active', 'pending_renew', 'expired', 'cancelled', 'suspended');
create type showroom_display_status as enum ('active', 'sold', 'swapped', 'removed', 'needs_refresh', 'expired');

create table customer_account_type (
  id uuid primary key default gen_random_uuid(),
  type_code text not null unique,
  name text not null,
  description text,
  default_credit_limit numeric(12,2) not null default 0,
  default_discount_percent numeric(5,2) not null default 0,
  is_rep_type boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_account_type_credit_limit_nonnegative check (default_credit_limit >= 0),
  constraint customer_account_type_discount_nonnegative check (default_discount_percent >= 0)
);

create table customer_business_type (
  id uuid primary key default gen_random_uuid(),
  type_code text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table customer_account (
  id uuid primary key default gen_random_uuid(),
  account_number text not null unique,
  name text not null,
  legal_name text,
  account_type_id uuid not null references customer_account_type(id),
  business_type_id uuid not null references customer_business_type(id),
  status customer_account_status not null default 'pending',
  currency text not null default 'USD',
  default_discount_percent numeric(5,2) not null default 0,
  tax_code text,
  state_resale_certificate_number text,
  is_sales_tax_exempt boolean not null default false,
  website text,
  main_phone text,
  main_email text,
  purchase_contact_name text,
  purchase_phone text,
  purchase_email text,
  billing_contact_name text,
  billing_phone text,
  billing_email text,
  linked_sales_rep_agency_id uuid,
  legacy_account_id text,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_account_number_10_digits check (account_number ~ '^[0-9]{10}$'),
  constraint customer_default_discount_nonnegative check (default_discount_percent >= 0),
  constraint customer_currency_code_check check (currency ~ '^[A-Z]{3}$')
);

create index customer_account_name_idx on customer_account using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(legal_name, '')));
create index customer_account_legacy_account_id_idx on customer_account(legacy_account_id) where legacy_account_id is not null;
create index customer_account_status_idx on customer_account(status);
create index customer_account_type_idx on customer_account(account_type_id);
create index customer_account_business_type_idx on customer_account(business_type_id);

create table customer_location (
  id uuid primary key default gen_random_uuid(),
  customer_account_id uuid not null references customer_account(id) on delete cascade,
  location_code text,
  location_name text not null,
  location_type customer_location_type not null default 'ship_to',
  address_line_1 text,
  address_line_2 text,
  city text,
  state_province text,
  postal_code text,
  country text not null default 'United States',
  country_code text not null default 'USA',
  phone text,
  email text,
  receiver_name text,
  is_shipping_address boolean not null default false,
  is_default_ship_to boolean not null default false,
  default_ship_to_order_channel text,
  is_showroom boolean not null default false,
  is_ecommerce_platform boolean not null default false,
  territory_id uuid,
  freight_policy_id uuid,
  status customer_location_status not null default 'active',
  shipping_instructions text,
  legacy_location_code text,
  showroom_location_code text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_location_country_code_check check (country_code ~ '^[A-Z]{2,3}$'),
  constraint customer_location_ecommerce_default_ship_to_check
    check (not is_default_ship_to or coalesce(default_ship_to_order_channel, '') <> 'ecommerce')
);

create index customer_location_account_idx on customer_location(customer_account_id);
create index customer_location_shipping_idx on customer_location(customer_account_id, status) where is_shipping_address;
create index customer_location_status_idx on customer_location(status);
create unique index customer_location_code_unique
  on customer_location(customer_account_id, location_code)
  where location_code is not null;
create unique index customer_location_default_ship_to_unique
  on customer_location(customer_account_id, coalesce(default_ship_to_order_channel, 'manual'))
  where is_default_ship_to and status = 'active';

create table customer_contact (
  id uuid primary key default gen_random_uuid(),
  customer_account_id uuid not null references customer_account(id) on delete cascade,
  customer_location_id uuid references customer_location(id) on delete set null,
  name text not null,
  title text,
  department text,
  phone text,
  mobile text,
  email text,
  fax text,
  is_primary boolean not null default false,
  is_billing_contact boolean not null default false,
  is_purchasing_contact boolean not null default false,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_contact_email_format_check
    check (email is null or email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

create index customer_contact_account_idx on customer_contact(customer_account_id);
create index customer_contact_location_idx on customer_contact(customer_location_id);
create index customer_contact_email_idx on customer_contact(lower(email)) where email is not null;

create table customer_billing_profile (
  id uuid primary key default gen_random_uuid(),
  customer_account_id uuid not null references customer_account(id) on delete cascade,
  payment_terms text not null default 'Due on Receipt',
  payment_days integer not null default 0,
  credit_limit numeric(12,2),
  credit_limit_source credit_limit_source not null default 'system_default',
  statement_delivery_method delivery_method not null default 'email',
  default_statement_email text,
  invoice_delivery_method delivery_method not null default 'email',
  billing_notes text,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_billing_payment_days_nonnegative check (payment_days >= 0),
  constraint customer_billing_credit_limit_nonnegative check (credit_limit is null or credit_limit >= 0),
  constraint customer_billing_credit_source_check
    check (
      (credit_limit_source = 'system_default' and credit_limit is null)
      or (credit_limit_source = 'customer_override' and credit_limit is not null)
    ),
  constraint customer_billing_statement_email_check
    check (statement_delivery_method = 'print' or default_statement_email is not null),
  constraint customer_billing_invoice_email_check
    check (invoice_delivery_method = 'print' or default_statement_email is not null)
);

create unique index customer_billing_one_active_profile
  on customer_billing_profile(customer_account_id)
  where is_active;

create table customer_freight_policy (
  id uuid primary key default gen_random_uuid(),
  customer_account_id uuid not null references customer_account(id) on delete cascade,
  customer_location_id uuid references customer_location(id) on delete cascade,
  policy_name text not null,
  ltl_freight_terms freight_terms not null default 'prepaid',
  ground_freight_terms freight_terms not null default 'prepaid',
  free_freight_threshold numeric(12,2),
  default_ltl_carrier text,
  default_ltl_carrier_account_number text,
  default_ground_carrier text,
  default_ground_carrier_account_number text,
  preferred_shipping_type text,
  special_instructions text,
  is_default boolean not null default false,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_freight_threshold_nonnegative check (free_freight_threshold is null or free_freight_threshold >= 0)
);

create index customer_freight_policy_account_idx on customer_freight_policy(customer_account_id);
create index customer_freight_policy_location_idx on customer_freight_policy(customer_location_id);
create unique index customer_freight_one_default_account_policy
  on customer_freight_policy(customer_account_id)
  where is_default and is_active and customer_location_id is null;
create unique index customer_freight_one_default_location_policy
  on customer_freight_policy(customer_location_id)
  where is_default and is_active and customer_location_id is not null;

alter table customer_location
  add constraint customer_location_freight_policy_fkey
  foreign key (freight_policy_id) references customer_freight_policy(id) on delete set null;

create table primary_showroom_enrollment (
  id uuid primary key default gen_random_uuid(),
  customer_account_id uuid not null references customer_account(id) on delete cascade,
  customer_location_id uuid not null references customer_location(id) on delete cascade,
  program_status primary_showroom_status not null default 'pending',
  enrollment_date date not null default current_date,
  approved_date date,
  renewal_date date,
  expiration_date date,
  pending_renew_date date,
  renewal_notice_days_snapshot integer,
  showroom_notification_email text,
  renewal_notification_sent_at timestamptz,
  renewal_notification_email_history_id uuid references email_send_history(id),
  showroom_size_classification text,
  required_display_count integer not null default 0,
  current_display_count integer not null default 0,
  discount_percent numeric(5,2) not null default 0,
  free_freight_threshold numeric(12,2),
  approved_by_user_id uuid references user_account(id),
  agreement_attachment_id uuid references attachment(id),
  last_review_date date,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint primary_showroom_required_count_nonnegative check (required_display_count >= 0),
  constraint primary_showroom_current_count_nonnegative check (current_display_count >= 0),
  constraint primary_showroom_discount_nonnegative check (discount_percent >= 0),
  constraint primary_showroom_free_freight_nonnegative check (free_freight_threshold is null or free_freight_threshold >= 0),
  constraint primary_showroom_notice_days_nonnegative check (renewal_notice_days_snapshot is null or renewal_notice_days_snapshot >= 0),
  constraint primary_showroom_email_format_check
    check (showroom_notification_email is null or showroom_notification_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

create index primary_showroom_account_idx on primary_showroom_enrollment(customer_account_id);
create index primary_showroom_location_idx on primary_showroom_enrollment(customer_location_id);
create index primary_showroom_status_idx on primary_showroom_enrollment(program_status);
create unique index primary_showroom_one_active_enrollment
  on primary_showroom_enrollment(customer_location_id)
  where program_status in ('pending', 'active', 'pending_renew', 'suspended');

create table showroom_display (
  id uuid primary key default gen_random_uuid(),
  primary_showroom_enrollment_id uuid references primary_showroom_enrollment(id) on delete set null,
  customer_location_id uuid not null references customer_location(id) on delete cascade,
  product_id uuid,
  sku_snapshot text not null,
  product_name_snapshot text,
  brand_id uuid references brand(id),
  sales_order_id uuid,
  sales_order_line_id uuid,
  customer_po_number_snapshot text,
  display_order_date date,
  display_shipped_date_snapshot date,
  display_status showroom_display_status not null default 'active',
  installed_date date,
  counts_toward_primary_showroom boolean not null default false,
  primary_showroom_exclusion_reason text,
  minimum_floor_through_date date,
  display_discount_percent_snapshot numeric(5,2),
  last_verified_date date,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint showroom_display_discount_nonnegative
    check (display_discount_percent_snapshot is null or display_discount_percent_snapshot >= 0),
  constraint showroom_display_counting_requires_enrollment
    check (not counts_toward_primary_showroom or primary_showroom_enrollment_id is not null)
);

create index showroom_display_location_idx on showroom_display(customer_location_id);
create index showroom_display_enrollment_idx on showroom_display(primary_showroom_enrollment_id);
create index showroom_display_product_idx on showroom_display(product_id);
create index showroom_display_sku_idx on showroom_display(sku_snapshot);
create index showroom_display_status_idx on showroom_display(display_status);
create index showroom_display_active_primary_count_idx
  on showroom_display(primary_showroom_enrollment_id)
  where display_status = 'active' and counts_toward_primary_showroom;

create or replace function generate_customer_account_number()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := lpad(floor(random() * 10000000000)::bigint::text, 10, '0');
    exit when not exists (
      select 1
      from customer_account
      where account_number = candidate
    );
  end loop;

  return candidate;
end;
$$;

create or replace function set_customer_account_number()
returns trigger
language plpgsql
as $$
begin
  if new.account_number is null or new.account_number = '' then
    new.account_number := generate_customer_account_number();
  end if;

  return new;
end;
$$;

create trigger set_customer_account_number_before_insert
  before insert on customer_account
  for each row
  execute function set_customer_account_number();

alter table customer_account
  alter column account_number set default generate_customer_account_number();

create trigger set_customer_account_type_updated_at
  before update on customer_account_type
  for each row execute function set_updated_at();

create trigger set_customer_business_type_updated_at
  before update on customer_business_type
  for each row execute function set_updated_at();

create trigger set_customer_account_updated_at
  before update on customer_account
  for each row execute function set_updated_at();

create trigger set_customer_location_updated_at
  before update on customer_location
  for each row execute function set_updated_at();

create trigger set_customer_contact_updated_at
  before update on customer_contact
  for each row execute function set_updated_at();

create trigger set_customer_billing_profile_updated_at
  before update on customer_billing_profile
  for each row execute function set_updated_at();

create trigger set_customer_freight_policy_updated_at
  before update on customer_freight_policy
  for each row execute function set_updated_at();

create trigger set_primary_showroom_enrollment_updated_at
  before update on primary_showroom_enrollment
  for each row execute function set_updated_at();

create trigger set_showroom_display_updated_at
  before update on showroom_display
  for each row execute function set_updated_at();

insert into customer_account_type (type_code, name, description, default_credit_limit, sort_order, is_rep_type)
values
  ('stocking_dealer', 'Stocking Dealer', 'Dealer that stocks or regularly displays products.', 0, 10, false),
  ('non_stocking_dealer', 'Non-stocking Dealer', 'Dealer that orders without stocking commitment.', 0, 20, false),
  ('rep', 'Rep', 'Sales rep agency account that can place charged orders.', 0, 30, true),
  ('retail_end_user', 'Retail / End User', 'Retail or end-user customer account.', 0, 40, false),
  ('other', 'Other', 'Other customer account type.', 0, 100, false);

insert into customer_business_type (type_code, name, description, sort_order)
values
  ('lighting_showroom', 'Lighting Showroom', 'Lighting showroom or showroom dealer.', 10),
  ('furniture_home_decor', 'Furniture and Home Decor Store', 'Furniture, home decor, or lifestyle retail store.', 20),
  ('gift_shop', 'Gift Shop', 'Gift shop or boutique retail store.', 30),
  ('interior_designer', 'Interior Designer', 'Interior designer or design firm.', 40),
  ('ecommerce_platform', 'Ecommerce Platform', 'Online marketplace, ecommerce dealer, or platform customer.', 50),
  ('end_user', 'End User', 'End customer or consumer account.', 60),
  ('other', 'Other', 'Other business type.', 100);

insert into system_setting (setting_key, setting_value, value_type, description)
values
  (
    'default_credit_limit_by_account_type_json',
    '{"stocking_dealer": 5000, "non_stocking_dealer": 0, "rep": 0, "retail_end_user": 0, "other": 0}'::jsonb,
    'json',
    'Default customer credit limits by account type. Customer-specific billing profile overrides take precedence.'
  ),
  (
    'customer_dashboard_order_summary_period_months',
    '12'::jsonb,
    'number',
    'Default period for customer dashboard regular/display order summaries.'
  ),
  (
    'customer_sales_performance_default_period_months',
    '12'::jsonb,
    'number',
    'Default period for customer sales performance analysis.'
  ),
  (
    'primary_showroom_renewal_notice_days',
    '60'::jsonb,
    'number',
    'Number of days before expiration when a Primary Showroom enters Pending Renew.'
  ),
  (
    'default_primary_showroom_free_freight_threshold',
    '250'::jsonb,
    'number',
    'Top-level Primary Showroom free freight threshold. Individual showroom enrollment can override.'
  )
on conflict (setting_key) do update
set
  setting_value = excluded.setting_value,
  value_type = excluded.value_type,
  description = excluded.description,
  updated_at = now();

insert into permission (permission_code, permission_area, name, description)
values
  ('customer.view', 'customer', 'Customer View', 'View customer accounts, locations, contacts, and non-financial dashboard sections.'),
  ('customer.create', 'customer', 'Customer Create', 'Create customer accounts.'),
  ('customer.edit', 'customer', 'Customer Edit', 'Edit customer account profile fields.'),
  ('customer.deactivate', 'customer', 'Customer Deactivate', 'Deactivate customer accounts and locations.'),
  ('customer.export', 'customer', 'Customer Export', 'Export customer account, location, and contact lists.'),
  ('customer.import', 'customer', 'Customer Import', 'Import customer master data from legacy CRM or templates.'),
  ('customer.contact.edit', 'customer', 'Customer Contact Edit', 'Create and edit customer contacts.'),
  ('customer.location.edit', 'customer', 'Customer Location Edit', 'Create and edit customer locations and ship-to flags.'),
  ('customer.billing.view', 'customer', 'Billing Profile View', 'View customer billing profiles and financial terms.'),
  ('customer.billing.edit', 'customer', 'Billing Profile Edit', 'Edit customer billing profiles.'),
  ('customer.payment_terms.edit', 'customer', 'Payment Terms Edit', 'Edit customer payment terms.'),
  ('customer.credit_limit.edit', 'customer', 'Credit Limit Edit', 'Edit customer credit limits.'),
  ('customer.default_credit_limit_settings.edit', 'customer', 'Default Credit Limit Settings Edit', 'Edit system default credit limits by customer account type.'),
  ('customer.freight_policy.edit', 'customer', 'Freight Policy Edit', 'Create and edit customer freight policies.'),
  ('customer.primary_showroom.view', 'customer', 'Primary Showroom View', 'View Primary Showroom enrollment and display data.'),
  ('customer.primary_showroom.edit', 'customer', 'Primary Showroom Edit', 'Create and edit Primary Showroom enrollments.'),
  ('customer.primary_showroom.approve', 'customer', 'Primary Showroom Approve', 'Approve, renew, suspend, or cancel Primary Showroom enrollments.'),
  ('customer.showroom_display.edit', 'customer', 'Showroom Display Edit', 'Create and edit showroom display tracking records.'),
  ('customer.financial_dashboard.view', 'customer', 'Customer Financial Dashboard View', 'View customer AR, invoice, open balance, and overdue summary sections.'),
  ('customer.credit_hold.edit', 'customer', 'Credit Hold Edit', 'Place, release, or override customer credit hold status.')
on conflict (permission_code) do update
set
  permission_area = excluded.permission_area,
  name = excluded.name,
  description = excluded.description;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'::permission_level
from role r
join permission p on p.permission_area = 'customer'
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in (
      'customer.view',
      'customer.create',
      'customer.edit',
      'customer.deactivate',
      'customer.contact.edit',
      'customer.location.edit',
      'customer.freight_policy.edit',
      'customer.primary_showroom.view',
      'customer.primary_showroom.edit',
      'customer.showroom_display.edit'
    ) then 'edit'::permission_level
    when p.permission_code in (
      'customer.billing.view',
      'customer.financial_dashboard.view'
    ) then 'view'::permission_level
    else 'none'::permission_level
  end
from role r
join permission p on p.permission_area = 'customer'
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;
