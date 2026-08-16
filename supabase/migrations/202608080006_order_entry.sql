create type sales_order_ship_to_type as enum ('saved_location', 'dropship');
create type sales_order_source as enum ('email', 'fax', 'phone', 'manual', 'portal', 'ecommerce', 'rep_submitted');
create type sales_order_type as enum ('regular', 'display', 'rga_replacement', 'catalog_marketing', 'other');
create type display_order_type as enum ('primary_showroom_display', 'non_primary_display', 'other_display');
create type sales_order_status as enum ('draft', 'open', 'partially_shipped', 'shipped', 'closed', 'cancelled', 'deleted');
create type shipping_readiness_status as enum ('not_ready', 'ready', 'partially_ready', 'hold');
create type credit_hold_status as enum ('none', 'on_credit_hold', 'released');
create type credit_hold_reason as enum ('credit_limit_exceeded', 'manual_release_after_prepay', 'paid_down', 'other');
create type sales_order_document_type as enum ('order_acknowledgement', 'pro_forma_invoice');
create type sales_order_line_status as enum ('open', 'partial', 'shipped', 'backordered', 'cancelled');
create type sales_order_document_action as enum ('previewed', 'downloaded', 'emailed');

create table sales_order (
  id uuid primary key default gen_random_uuid(),
  sales_order_number text not null unique,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  customer_location_id uuid references customer_location(id) on delete restrict,
  ship_to_type sales_order_ship_to_type not null default 'saved_location',
  is_dropship boolean not null default false,
  dropship_fee_amount numeric(12,2) not null default 0,
  dropship_fee_override boolean not null default false,
  dropship_fee_override_reason text,
  customer_po_number text not null,
  order_date date not null default current_date,
  requested_ship_date date,
  order_source sales_order_source not null default 'manual',
  order_type sales_order_type not null default 'regular',
  display_order_type display_order_type,
  primary_showroom_enrollment_id uuid references primary_showroom_enrollment(id) on delete set null,
  display_tracking_required boolean not null default false,
  rga_id uuid,
  invoice_required boolean not null default true,
  status sales_order_status not null default 'draft',
  shipping_readiness_status shipping_readiness_status not null default 'not_ready',
  credit_hold_status credit_hold_status not null default 'none',
  credit_hold_reason credit_hold_reason,
  credit_limit_snapshot numeric(12,2),
  balance_at_order_entry_snapshot numeric(14,2),
  acknowledgement_document_type sales_order_document_type not null default 'order_acknowledgement',
  currency text not null default 'USD',
  payment_terms_snapshot text,
  discount_percent_snapshot numeric(5,2) not null default 0,
  bill_to_snapshot_json jsonb,
  ship_to_snapshot_json jsonb not null,
  ship_to_display_name_snapshot text not null,
  customer_name_snapshot text not null,
  customer_account_number_snapshot text,
  legacy_account_id_snapshot text,
  order_contact_snapshot_json jsonb,
  sales_rep_agency_id_snapshot uuid,
  sales_rep_id_snapshot uuid,
  territory_id_snapshot uuid,
  subtotal_amount numeric(14,2) not null default 0,
  ltl_freight_terms_snapshot freight_terms not null default 'prepaid',
  ground_freight_terms_snapshot freight_terms not null default 'prepaid',
  ltl_carrier_snapshot text,
  ltl_carrier_account_number_snapshot text,
  ground_carrier_snapshot text,
  ground_carrier_account_number_snapshot text,
  freight_review_required boolean not null default false,
  freight_amount numeric(14,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) generated always as (subtotal_amount + dropship_fee_amount + freight_amount + tax_amount) stored,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  deleted_by_user_id uuid references user_account(id),
  deleted_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_order_number_not_blank check (btrim(sales_order_number) <> ''),
  constraint sales_order_customer_po_not_blank check (btrim(customer_po_number) <> ''),
  constraint sales_order_currency_code_check check (currency ~ '^[A-Z]{3}$'),
  constraint sales_order_amounts_nonnegative check (
    dropship_fee_amount >= 0
    and discount_percent_snapshot >= 0
    and subtotal_amount >= 0
    and freight_amount >= 0
    and tax_amount >= 0
  ),
  constraint sales_order_dropship_check check (
    (ship_to_type = 'dropship' and is_dropship)
    or (ship_to_type = 'saved_location')
  ),
  constraint sales_order_saved_location_check
    check (ship_to_type = 'dropship' or customer_location_id is not null),
  constraint sales_order_dropship_override_reason_check
    check (not dropship_fee_override or dropship_fee_override_reason is not null),
  constraint sales_order_display_type_check
    check (
      (order_type = 'display' and display_order_type is not null)
      or (order_type <> 'display' and display_order_type is null)
    ),
  constraint sales_order_rga_replacement_invoice_check
    check (order_type <> 'rga_replacement' or invoice_required = false),
  constraint sales_order_credit_hold_reason_check
    check (credit_hold_status <> 'on_credit_hold' or credit_hold_reason is not null),
  constraint sales_order_credit_document_check
    check (credit_hold_status <> 'on_credit_hold' or acknowledgement_document_type = 'pro_forma_invoice')
);

create index sales_order_customer_account_idx on sales_order(customer_account_id);
create index sales_order_customer_location_idx on sales_order(customer_location_id);
create index sales_order_customer_po_idx on sales_order(customer_po_number);
create index sales_order_status_idx on sales_order(status);
create index sales_order_order_date_idx on sales_order(order_date);
create index sales_order_requested_ship_date_idx on sales_order(requested_ship_date);
create index sales_order_type_idx on sales_order(order_type);
create index sales_order_credit_hold_idx on sales_order(credit_hold_status);
create index sales_order_readiness_idx on sales_order(shipping_readiness_status);
create unique index sales_order_customer_po_active_unique
  on sales_order(customer_account_id, lower(customer_po_number))
  where status <> 'deleted';

create table sales_order_line (
  id uuid primary key default gen_random_uuid(),
  sales_order_id uuid not null references sales_order(id) on delete cascade,
  line_number integer not null,
  product_id uuid not null references product(id) on delete restrict,
  brand_id_snapshot uuid references brand(id),
  brand_name_snapshot text not null,
  product_sku_snapshot text not null,
  product_name_snapshot text not null,
  product_eligibility_snapshot product_customer_eligibility_tag,
  product_status_snapshot product_lifecycle_status,
  product_sellability_snapshot product_sellability_status,
  quantity_ordered numeric(14,3) not null,
  quantity_allocated numeric(14,3) not null default 0,
  quantity_shipped numeric(14,3) not null default 0,
  quantity_cancelled numeric(14,3) not null default 0,
  quantity_cleared numeric(14,3) not null default 0,
  unit_price numeric(12,2) not null,
  discount_percent numeric(5,2) not null default 0,
  line_total numeric(14,2) generated always as (round((quantity_ordered * unit_price * (1 - discount_percent / 100))::numeric, 2)) stored,
  requested_ship_date date,
  estimated_ship_date date,
  line_status sales_order_line_status not null default 'open',
  price_overridden boolean not null default false,
  price_override_reason text,
  discount_overridden boolean not null default false,
  discount_override_reason text,
  restricted_product_override boolean not null default false,
  restricted_product_override_reason text,
  display_discount_percent_snapshot numeric(5,2),
  display_counts_toward_primary_showroom boolean,
  display_exclusion_reason text,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_order_line_line_number_positive check (line_number > 0),
  constraint sales_order_line_quantity_positive check (quantity_ordered > 0),
  constraint sales_order_line_quantities_nonnegative check (
    quantity_allocated >= 0
    and quantity_shipped >= 0
    and quantity_cancelled >= 0
    and quantity_cleared >= 0
  ),
  constraint sales_order_line_quantity_not_over_closed check (
    quantity_shipped + quantity_cancelled + quantity_cleared <= quantity_ordered
  ),
  constraint sales_order_line_price_nonnegative check (unit_price >= 0),
  constraint sales_order_line_discount_nonnegative check (
    discount_percent >= 0
    and (display_discount_percent_snapshot is null or display_discount_percent_snapshot >= 0)
  ),
  constraint sales_order_line_price_override_reason_check
    check (not price_overridden or price_override_reason is not null),
  constraint sales_order_line_discount_override_reason_check
    check (not discount_overridden or discount_override_reason is not null),
  constraint sales_order_line_restricted_override_reason_check
    check (not restricted_product_override or restricted_product_override_reason is not null)
);

create index sales_order_line_order_idx on sales_order_line(sales_order_id);
create index sales_order_line_product_idx on sales_order_line(product_id);
create index sales_order_line_brand_idx on sales_order_line(brand_id_snapshot);
create index sales_order_line_status_idx on sales_order_line(line_status);
create unique index sales_order_line_number_unique on sales_order_line(sales_order_id, line_number);

create table sales_order_document (
  id uuid primary key default gen_random_uuid(),
  sales_order_id uuid not null references sales_order(id) on delete cascade,
  document_type sales_order_document_type not null,
  document_number text,
  document_template_id uuid references document_template(id) on delete set null,
  generated_document_event_id uuid references generated_document_event(id) on delete set null,
  email_send_history_id uuid references email_send_history(id) on delete set null,
  action sales_order_document_action not null,
  output_format text not null default 'pdf',
  generated_by_user_id uuid references user_account(id),
  generated_at timestamptz not null default now(),
  notes text
);

create index sales_order_document_order_idx on sales_order_document(sales_order_id);
create index sales_order_document_type_idx on sales_order_document(document_type);

alter table inventory_allocation
  add constraint inventory_allocation_sales_order_line_fkey
  foreign key (sales_order_line_id) references sales_order_line(id) on delete set null;

alter table showroom_display
  add constraint showroom_display_sales_order_fkey
  foreign key (sales_order_id) references sales_order(id) on delete set null;

alter table showroom_display
  add constraint showroom_display_sales_order_line_fkey
  foreign key (sales_order_line_id) references sales_order_line(id) on delete set null;

create or replace function generate_sales_order_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('SO', 'sales_order', 'sales_order_number');
end;
$$;

create or replace function set_sales_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.sales_order_number is null or new.sales_order_number = '' then
    new.sales_order_number := generate_sales_order_number();
  end if;

  return new;
end;
$$;

create or replace function set_sales_order_customer_snapshots()
returns trigger
language plpgsql
as $$
declare
  account_record customer_account%rowtype;
  location_record customer_location%rowtype;
begin
  select * into account_record
  from customer_account
  where id = new.customer_account_id;

  if not found then
    raise exception 'Customer account % does not exist', new.customer_account_id;
  end if;

  new.customer_name_snapshot := coalesce(nullif(new.customer_name_snapshot, ''), account_record.name);
  new.customer_account_number_snapshot := coalesce(nullif(new.customer_account_number_snapshot, ''), account_record.account_number);
  new.legacy_account_id_snapshot := coalesce(nullif(new.legacy_account_id_snapshot, ''), account_record.legacy_account_id);
  new.currency := coalesce(nullif(new.currency, ''), account_record.currency);
  new.discount_percent_snapshot := coalesce(new.discount_percent_snapshot, account_record.default_discount_percent, 0);

  if new.bill_to_snapshot_json is null then
    new.bill_to_snapshot_json := jsonb_build_object(
      'account_name', account_record.name,
      'legal_name', account_record.legal_name,
      'billing_contact_name', account_record.billing_contact_name,
      'billing_phone', account_record.billing_phone,
      'billing_email', account_record.billing_email
    );
  end if;

  if new.ship_to_type = 'saved_location' then
    select * into location_record
    from customer_location
    where id = new.customer_location_id
      and customer_account_id = new.customer_account_id;

    if not found then
      raise exception 'Saved ship-to location must belong to the order customer account';
    end if;

    new.is_dropship := false;
    new.ship_to_display_name_snapshot := coalesce(nullif(new.ship_to_display_name_snapshot, ''), location_record.location_name);

    if new.ship_to_snapshot_json is null then
      new.ship_to_snapshot_json := jsonb_build_object(
        'ship_to_display_name', location_record.location_name,
        'address_line_1', location_record.address_line_1,
        'address_line_2', location_record.address_line_2,
        'city', location_record.city,
        'state_province', location_record.state_province,
        'postal_code', location_record.postal_code,
        'country', location_record.country,
        'country_code', location_record.country_code,
        'phone', location_record.phone,
        'email', location_record.email,
        'receiver_name', location_record.receiver_name
      );
    end if;
  else
    new.is_dropship := true;
  end if;

  return new;
end;
$$;

create or replace function set_sales_order_line_snapshots()
returns trigger
language plpgsql
as $$
declare
  product_record record;
begin
  select
    p.id,
    p.sku,
    p.name,
    p.brand_id,
    b.name as brand_name,
    p.customer_eligibility_tag,
    p.status,
    p.sellability_status,
    p.default_price
  into product_record
  from product p
  join brand b on b.id = p.brand_id
  where p.id = new.product_id;

  if product_record.id is null then
    raise exception 'Product % does not exist', new.product_id;
  end if;

  new.brand_id_snapshot := coalesce(new.brand_id_snapshot, product_record.brand_id);
  new.brand_name_snapshot := coalesce(nullif(new.brand_name_snapshot, ''), product_record.brand_name);
  new.product_sku_snapshot := coalesce(nullif(new.product_sku_snapshot, ''), product_record.sku);
  new.product_name_snapshot := coalesce(nullif(new.product_name_snapshot, ''), product_record.name);
  new.product_eligibility_snapshot := coalesce(new.product_eligibility_snapshot, product_record.customer_eligibility_tag);
  new.product_status_snapshot := coalesce(new.product_status_snapshot, product_record.status);
  new.product_sellability_snapshot := coalesce(new.product_sellability_snapshot, product_record.sellability_status);
  new.unit_price := coalesce(new.unit_price, product_record.default_price, 0);

  return new;
end;
$$;

create or replace function refresh_sales_order_subtotal(target_sales_order_id uuid)
returns void
language plpgsql
as $$
begin
  update sales_order
  set subtotal_amount = coalesce((
    select sum(line_total)
    from sales_order_line
    where sales_order_id = target_sales_order_id
      and line_status <> 'cancelled'
  ), 0),
  updated_at = now()
  where id = target_sales_order_id;
end;
$$;

create or replace function refresh_sales_order_subtotal_trigger()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform refresh_sales_order_subtotal(old.sales_order_id);
    return old;
  end if;

  perform refresh_sales_order_subtotal(new.sales_order_id);

  if tg_op = 'UPDATE' and old.sales_order_id <> new.sales_order_id then
    perform refresh_sales_order_subtotal(old.sales_order_id);
  end if;

  return new;
end;
$$;

create trigger set_sales_order_number_before_insert
  before insert on sales_order
  for each row execute function set_sales_order_number();

alter table sales_order
  alter column sales_order_number set default generate_sales_order_number();

create trigger set_sales_order_customer_snapshots_before_insert_update
  before insert or update of customer_account_id, customer_location_id, ship_to_type, bill_to_snapshot_json, ship_to_snapshot_json
  on sales_order
  for each row execute function set_sales_order_customer_snapshots();

create trigger set_sales_order_line_snapshots_before_insert_update
  before insert or update of product_id
  on sales_order_line
  for each row execute function set_sales_order_line_snapshots();

create trigger refresh_sales_order_subtotal_after_line_change
  after insert or update of quantity_ordered, unit_price, discount_percent, line_status or delete
  on sales_order_line
  for each row execute function refresh_sales_order_subtotal_trigger();

create trigger set_sales_order_updated_at
  before update on sales_order
  for each row execute function set_updated_at();

create trigger set_sales_order_line_updated_at
  before update on sales_order_line
  for each row execute function set_updated_at();

insert into document_number_sequence (sequence_code, document_type, prefix, next_number, padding_length)
values
  ('sales_order_shared', 'sales_order', 'SO', 1, 6)
on conflict (sequence_code) do update
set document_type = excluded.document_type,
    prefix = excluded.prefix,
    padding_length = excluded.padding_length,
    updated_at = now();

insert into system_setting (setting_key, setting_value, value_type, description)
values
  (
    'default_dropship_fee',
    '0'::jsonb,
    'number',
    'Default dropship/manual Ship To fee applied to eligible orders unless overridden.'
  )
on conflict (setting_key) do update
set setting_value = excluded.setting_value,
    value_type = excluded.value_type,
    description = excluded.description,
    updated_at = now();

insert into permission (permission_code, permission_area, name, description)
values
  ('order.view', 'order', 'Order View', 'View sales orders and order lines.'),
  ('order.create', 'order', 'Order Create', 'Create sales orders from customer account pages.'),
  ('order.edit', 'order', 'Order Edit', 'Edit open sales orders.'),
  ('order.cancel', 'order', 'Order Cancel', 'Cancel sales orders.'),
  ('order.delete_unshipped', 'order', 'Order Delete Unshipped', 'Fully delete unshipped orders with no downstream dependency.'),
  ('order.soft_delete_shipped', 'order', 'Order Soft-delete Shipped', 'Soft-delete shipped/released orders while preserving history.'),
  ('order.closed_edit_reopen', 'order', 'Closed Order Edit/Reopen', 'Reopen or edit closed orders with audit reason.'),
  ('order.line.add', 'order', 'Order Line Add', 'Add lines to open orders.'),
  ('order.line.delete_unshipped', 'order', 'Order Line Delete Unshipped', 'Delete unshipped order lines.'),
  ('order.line.quantity_edit_unshipped', 'order', 'Order Line Quantity Edit Unshipped', 'Edit quantity for unshipped order lines.'),
  ('order.line.price_edit', 'order', 'Order Line Price Edit', 'Edit or override order line unit price.'),
  ('order.discount.edit', 'order', 'Order Discount Edit', 'Edit order line or order discount.'),
  ('order.restricted_product_search', 'order', 'Restricted Product Search', 'Search hidden/inactive/discontinued/blocked products.'),
  ('order.restricted_product_add', 'order', 'Restricted Product Add', 'Add restricted products to orders with reason.'),
  ('order.display.create_edit', 'order', 'Display Order Create/Edit', 'Create and edit display orders.'),
  ('order.rga_replacement.create', 'order', 'RGA Replacement Order Create', 'Create replacement orders from approved RGA replacement solution.'),
  ('order.credit_hold.view', 'order', 'Credit Hold View', 'View order credit hold status.'),
  ('order.credit_hold.release', 'order', 'Credit Hold Release', 'Release order credit holds with reason.'),
  ('order.dropship_fee.override', 'order', 'Dropship Fee Override', 'Override dropship fee with reason.'),
  ('order.freight_terms.override', 'order', 'Freight Terms Override', 'Override freight terms, carrier, or account snapshots.'),
  ('order.acknowledgement.send', 'order', 'Order Acknowledgement Generate/Send', 'Generate, download, or email order acknowledgement.'),
  ('order.pro_forma.send', 'order', 'Pro Forma Invoice Generate/Send', 'Generate, download, or email pro forma invoice for credit-held orders.')
on conflict (permission_code) do update
set permission_area = excluded.permission_area,
    name = excluded.name,
    description = excluded.description;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'::permission_level
from role r
join permission p on p.permission_area = 'order'
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in (
      'order.view',
      'order.create',
      'order.edit',
      'order.cancel',
      'order.line.add',
      'order.line.delete_unshipped',
      'order.line.quantity_edit_unshipped',
      'order.line.price_edit',
      'order.discount.edit',
      'order.display.create_edit',
      'order.credit_hold.view',
      'order.acknowledgement.send',
      'order.pro_forma.send'
    ) then 'edit'::permission_level
    else 'none'::permission_level
  end
from role r
join permission p on p.permission_area = 'order'
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;
