create type product_lifecycle_status as enum ('pending', 'active', 'inactive', 'discontinued', 'deleted');
create type product_sellability_status as enum ('sellable', 'hidden', 'blocked', 'override_required');
create type product_customer_eligibility_tag as enum ('all', 'ecommerce_only', 'non_ecommerce_only', 'exclusive');
create type product_image_category as enum ('stock', 'detail', 'lifestyle', 'drawing', 'other');
create type product_document_type as enum ('spec_sheet', 'installation_instruction', 'manual', 'other');
create type product_eligibility_rule_type as enum ('include', 'exclude', 'exclusive');
create type partner_datasheet_file_format as enum ('xlsx', 'csv');

create table product_signature_suite (
  id uuid primary key default gen_random_uuid(),
  suite_code text not null unique,
  name text not null,
  brand_id uuid references brand(id) on delete set null,
  description text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_category (
  id uuid primary key default gen_random_uuid(),
  category_code text not null unique,
  name text not null,
  parent_category_id uuid references product_category(id) on delete set null,
  counts_toward_primary_showroom_default boolean not null default true,
  primary_showroom_exclusion_reason text,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_category_exclusion_reason_check
    check (counts_toward_primary_showroom_default or primary_showroom_exclusion_reason is not null)
);

create table finish (
  id uuid primary key default gen_random_uuid(),
  finish_name text not null unique,
  finish_image_file_id uuid references attachment(id) on delete set null,
  description text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  deleted_at timestamptz,
  deleted_by_user_id uuid references user_account(id),
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  brand_id uuid not null references brand(id),
  name text not null,
  description text,
  description_word_count integer,
  description_last_reviewed_at timestamptz,
  description_last_reviewed_by_user_id uuid references user_account(id),
  signature_suite_id uuid references product_signature_suite(id) on delete set null,
  product_category_id uuid references product_category(id) on delete set null,
  collection text,
  status product_lifecycle_status not null default 'pending',
  sellability_status product_sellability_status not null default 'hidden',
  customer_eligibility_tag product_customer_eligibility_tag not null default 'all',
  counts_toward_primary_showroom_default boolean,
  primary_showroom_exclusion_reason text,
  default_price numeric(12,2),
  currency text not null default 'USD',
  default_vendor_id uuid,
  default_vendor_item_number text,
  no_box_needed boolean not null default false,
  legacy_product_id text,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_sku_not_blank check (btrim(sku) <> ''),
  constraint product_default_price_nonnegative check (default_price is null or default_price >= 0),
  constraint product_currency_code_check check (currency ~ '^[A-Z]{3}$'),
  constraint product_description_word_count_nonnegative check (description_word_count is null or description_word_count >= 0),
  constraint product_primary_showroom_exclusion_reason_check
    check (coalesce(counts_toward_primary_showroom_default, true) or primary_showroom_exclusion_reason is not null)
);

create index product_brand_idx on product(brand_id);
create index product_signature_suite_idx on product(signature_suite_id);
create index product_category_idx on product(product_category_id);
create index product_status_idx on product(status);
create index product_sellability_status_idx on product(sellability_status);
create index product_customer_eligibility_idx on product(customer_eligibility_tag);
create index product_legacy_product_id_idx on product(legacy_product_id) where legacy_product_id is not null;
create index product_search_idx on product using gin (to_tsvector('simple', coalesce(sku, '') || ' ' || coalesce(name, '') || ' ' || coalesce(collection, '')));

create table product_finish (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete cascade,
  finish_id uuid not null references finish(id) on delete restrict,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_finish_product_idx on product_finish(product_id);
create index product_finish_finish_idx on product_finish(finish_id);
create unique index product_finish_active_unique
  on product_finish(product_id, finish_id)
  where is_active;

create table product_image (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete cascade,
  file_id uuid not null references attachment(id) on delete restrict,
  image_category product_image_category not null default 'stock',
  display_name text,
  sort_order integer not null default 100,
  is_default_thumbnail boolean not null default false,
  is_active boolean not null default true,
  deleted_at timestamptz,
  deleted_by_user_id uuid references user_account(id),
  uploaded_by_user_id uuid references user_account(id),
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_image_default_thumbnail_stock_check
    check (not is_default_thumbnail or image_category = 'stock')
);

create index product_image_product_idx on product_image(product_id);
create index product_image_category_idx on product_image(product_id, image_category, sort_order);
create unique index product_image_one_default_thumbnail
  on product_image(product_id)
  where is_active and is_default_thumbnail;

create table product_document (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete cascade,
  file_id uuid not null references attachment(id) on delete restrict,
  document_type product_document_type not null default 'other',
  display_name text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  deleted_at timestamptz,
  deleted_by_user_id uuid references user_account(id),
  uploaded_by_user_id uuid references user_account(id),
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_document_product_idx on product_document(product_id);
create index product_document_type_idx on product_document(product_id, document_type);

create table product_packing_box (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete cascade,
  box_sequence integer not null,
  box_label text,
  net_weight numeric(12,3),
  gross_weight numeric(12,3),
  box_length numeric(12,3),
  box_width numeric(12,3),
  box_height numeric(12,3),
  inch_volume numeric(18,3) generated always as (
    case
      when box_length is not null and box_width is not null and box_height is not null
      then box_length * box_width * box_height
      else null
    end
  ) stored,
  cbm numeric(18,6),
  default_warehouse_id uuid,
  default_warehouse_location_id uuid,
  is_required_for_sale boolean not null default true,
  is_active boolean not null default true,
  pallet_quantity integer,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_box_sequence_positive check (box_sequence > 0),
  constraint product_box_weight_nonnegative check (
    (net_weight is null or net_weight >= 0)
    and (gross_weight is null or gross_weight >= 0)
  ),
  constraint product_box_dimension_nonnegative check (
    (box_length is null or box_length >= 0)
    and (box_width is null or box_width >= 0)
    and (box_height is null or box_height >= 0)
  ),
  constraint product_box_cbm_nonnegative check (cbm is null or cbm >= 0),
  constraint product_box_pallet_quantity_positive check (pallet_quantity is null or pallet_quantity > 0)
);

create index product_packing_box_product_idx on product_packing_box(product_id);
create unique index product_packing_box_active_sequence_unique
  on product_packing_box(product_id, box_sequence)
  where is_active;

create table product_spec_attribute (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete cascade,
  attribute_name text not null,
  attribute_value text not null,
  unit text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_spec_attribute_product_idx on product_spec_attribute(product_id);

create table product_hanging_config (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete cascade,
  mounting_type text,
  chain_length text,
  rod_length text,
  wire_length text,
  canopy_detail text,
  notes text,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index product_hanging_config_one_active
  on product_hanging_config(product_id)
  where is_active;

create table product_part (
  id uuid primary key default gen_random_uuid(),
  parent_product_id uuid not null references product(id) on delete cascade,
  component_product_id uuid not null references product(id) on delete restrict,
  quantity_required numeric(12,3) not null default 1,
  part_role text,
  is_required boolean not null default true,
  is_active boolean not null default true,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_part_quantity_positive check (quantity_required > 0),
  constraint product_part_no_self_reference check (parent_product_id <> component_product_id)
);

create index product_part_parent_idx on product_part(parent_product_id);
create index product_part_component_idx on product_part(component_product_id);
create unique index product_part_active_unique
  on product_part(parent_product_id, component_product_id, coalesce(part_role, ''))
  where is_active;

create table product_customer_eligibility (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete cascade,
  customer_account_id uuid references customer_account(id) on delete cascade,
  customer_location_id uuid references customer_location(id) on delete cascade,
  eligibility_type product_eligibility_rule_type not null,
  start_date date,
  end_date date,
  is_active boolean not null default true,
  reason text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_eligibility_scope_required
    check (customer_account_id is not null or customer_location_id is not null),
  constraint product_eligibility_date_order
    check (end_date is null or start_date is null or end_date >= start_date)
);

create index product_customer_eligibility_product_idx on product_customer_eligibility(product_id);
create index product_customer_eligibility_account_idx on product_customer_eligibility(customer_account_id);
create index product_customer_eligibility_location_idx on product_customer_eligibility(customer_location_id);
create unique index product_customer_eligibility_active_unique
  on product_customer_eligibility(
    product_id,
    eligibility_type,
    coalesce(customer_account_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(customer_location_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  where is_active;

create table partner_product_datasheet_template (
  id uuid primary key default gen_random_uuid(),
  template_code text not null unique,
  template_name text not null,
  partner_name text not null,
  template_file_id uuid references attachment(id) on delete set null,
  template_file_name text not null,
  template_file_path text,
  file_format partner_datasheet_file_format not null,
  header_mapping_rule text not null default '{ERP Attribute}:{Datasheet Column Name}',
  approved_export_aliases_json jsonb,
  version_label text,
  is_default boolean not null default false,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint partner_datasheet_extension_matches_format check (
    (file_format = 'xlsx' and lower(template_file_name) like '%.xlsx')
    or (file_format = 'csv' and lower(template_file_name) like '%.csv')
  )
);

create index partner_datasheet_template_partner_idx on partner_product_datasheet_template(partner_name);
create unique index partner_datasheet_one_default_active
  on partner_product_datasheet_template(partner_name)
  where is_default and is_active;

alter table showroom_display
  add constraint showroom_display_product_fkey
  foreign key (product_id) references product(id) on delete set null;

create or replace function set_product_description_word_count()
returns trigger
language plpgsql
as $$
begin
  if new.description is null or btrim(new.description) = '' then
    new.description_word_count := null;
  else
    new.description_word_count := cardinality(regexp_split_to_array(btrim(new.description), '\s+'));
  end if;

  return new;
end;
$$;

create trigger set_product_description_word_count_before_insert_update
  before insert or update of description on product
  for each row
  execute function set_product_description_word_count();

create trigger set_product_signature_suite_updated_at
  before update on product_signature_suite
  for each row execute function set_updated_at();

create trigger set_product_category_updated_at
  before update on product_category
  for each row execute function set_updated_at();

create trigger set_finish_updated_at
  before update on finish
  for each row execute function set_updated_at();

create trigger set_product_updated_at
  before update on product
  for each row execute function set_updated_at();

create trigger set_product_finish_updated_at
  before update on product_finish
  for each row execute function set_updated_at();

create trigger set_product_image_updated_at
  before update on product_image
  for each row execute function set_updated_at();

create trigger set_product_document_updated_at
  before update on product_document
  for each row execute function set_updated_at();

create trigger set_product_packing_box_updated_at
  before update on product_packing_box
  for each row execute function set_updated_at();

create trigger set_product_spec_attribute_updated_at
  before update on product_spec_attribute
  for each row execute function set_updated_at();

create trigger set_product_hanging_config_updated_at
  before update on product_hanging_config
  for each row execute function set_updated_at();

create trigger set_product_part_updated_at
  before update on product_part
  for each row execute function set_updated_at();

create trigger set_product_customer_eligibility_updated_at
  before update on product_customer_eligibility
  for each row execute function set_updated_at();

create trigger set_partner_datasheet_template_updated_at
  before update on partner_product_datasheet_template
  for each row execute function set_updated_at();

insert into product_category (category_code, name, counts_toward_primary_showroom_default, primary_showroom_exclusion_reason, sort_order)
values
  ('chandelier', 'Chandelier', true, null, 10),
  ('pendant', 'Pendant', true, null, 20),
  ('sconce', 'Sconce', false, 'Sconce', 30),
  ('lamp', 'Lamp', true, null, 40),
  ('mirror', 'Mirror', true, null, 50),
  ('furniture', 'Furniture', true, null, 60),
  ('accessory', 'Accessory', true, null, 70),
  ('other', 'Other', true, null, 100);

insert into system_setting (setting_key, setting_value, value_type, description)
values
  (
    'Partner_Datasheet_Template_Files',
    '[]'::jsonb,
    'json',
    'Registered partner product datasheet template files. Each template can map ERP attributes to partner column names.'
  ),
  (
    'product_performance_audit_default_period_months',
    '12'::jsonb,
    'number',
    'Default period for internal Product Performance Audit reports.'
  ),
  (
    'best_seller_report_default_period_months',
    '12'::jsonb,
    'number',
    'Default period for external-safe Best Seller List reports.'
  ),
  (
    'best_seller_report_default_rank_size',
    '10'::jsonb,
    'number',
    'Default number of products in Best Seller List reports.'
  ),
  (
    'best_seller_report_default_ranking_basis',
    '"sold_pieces"'::jsonb,
    'string',
    'Default ranking basis for Best Seller List reports: sold_pieces or sold_amount.'
  )
on conflict (setting_key) do update
set
  setting_value = excluded.setting_value,
  value_type = excluded.value_type,
  description = excluded.description,
  updated_at = now();

insert into permission (permission_code, permission_area, name, description)
values
  ('product.view', 'product', 'Product View', 'View product master records and non-sensitive product details.'),
  ('product.create', 'product', 'Product Create', 'Create product master records.'),
  ('product.edit', 'product', 'Product Edit', 'Edit product master records.'),
  ('product.status.edit', 'product', 'Product Status Edit', 'Edit product lifecycle and sellability status.'),
  ('product.eligibility.edit', 'product', 'Product Eligibility Edit', 'Edit customer/channel eligibility and exclusive access rules.'),
  ('product.import', 'product', 'Product Import', 'Import product master, images, boxes, and related product data.'),
  ('product.export', 'product', 'Product Export', 'Export product lists and product master data.'),
  ('product.finish.view', 'product', 'Finish Library View', 'View finish library records.'),
  ('product.finish.manage', 'product', 'Finish Library Manage', 'Create, edit, deactivate, and manage finishes.'),
  ('product.partner_datasheet.export', 'product', 'Partner Product Data Sheet Export', 'Generate partner product data sheets from registered templates.'),
  ('product.partner_datasheet.template_manage', 'product', 'Partner Product Data Sheet Template Manage', 'Manage partner data sheet template registrations.'),
  ('product.cost_vendor.view', 'product', 'Product Cost/Vendor View', 'View vendor and cost-related product fields.'),
  ('product.performance_audit.view', 'product', 'Product Performance Audit View', 'View internal product performance audit reports.'),
  ('product.performance_audit.export', 'product', 'Product Performance Audit Export', 'Export internal product performance audit reports.'),
  ('product.best_seller.view', 'product', 'Best Seller List View', 'View external-safe best seller reports.'),
  ('product.best_seller.export', 'product', 'Best Seller List Export', 'Export external-safe best seller reports.'),
  ('product.external_safe_report.generate', 'product', 'External-Safe Report Generate', 'Generate product reports designed for reps or customers.')
on conflict (permission_code) do update
set
  permission_area = excluded.permission_area,
  name = excluded.name,
  description = excluded.description;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'::permission_level
from role r
join permission p on p.permission_area = 'product'
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in (
      'product.view',
      'product.create',
      'product.edit',
      'product.status.edit',
      'product.eligibility.edit',
      'product.export',
      'product.finish.view',
      'product.finish.manage',
      'product.partner_datasheet.export',
      'product.best_seller.view',
      'product.best_seller.export',
      'product.external_safe_report.generate'
    ) then 'edit'::permission_level
    when p.permission_code in (
      'product.performance_audit.view',
      'product.cost_vendor.view'
    ) then 'view'::permission_level
    else 'none'::permission_level
  end
from role r
join permission p on p.permission_area = 'product'
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;
