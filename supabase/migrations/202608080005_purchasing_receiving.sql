create type vendor_status as enum ('active', 'inactive');
create type vendor_purchase_order_status as enum ('draft', 'submitted', 'confirmed', 'in_production', 'inspected', 'shipped', 'partially_received', 'received', 'closed', 'cancelled');
create type vendor_purchase_order_line_status as enum ('open', 'partially_received', 'received', 'closed', 'cancelled');
create type vendor_po_submission_status as enum ('sent', 'failed', 'printed');
create type vendor_po_invoice_payment_status as enum ('to_be_paid', 'partially_paid', 'paid', 'void');
create type vendor_payment_method as enum ('check', 'ach', 'wire', 'credit_card', 'cash', 'other');
create type factory_inspection_status as enum ('draft', 'passed', 'failed', 'partial', 'needs_review');
create type inspection_result_status as enum ('pass', 'fail', 'na');
create type container_customs_status as enum ('pending', 'filed', 'released', 'hold');
create type import_container_status as enum ('draft', 'booked', 'on_water', 'arrived', 'delivered', 'partially_received', 'received', 'closed', 'cancelled');
create type receiving_source_type as enum ('vendor_po', 'container', 'rga_return');
create type receiving_status as enum ('draft', 'posted', 'cancelled');
create type receiving_line_source_type as enum ('vendor_po_line', 'container_line', 'rga_line');

create table vendor (
  id uuid primary key default gen_random_uuid(),
  vendor_number text not null unique,
  name text not null,
  legal_name text,
  contact_name text,
  email text,
  phone text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state_province text,
  postal_code text,
  country text not null,
  country_code text not null,
  payment_terms text,
  currency text not null default 'USD',
  status vendor_status not null default 'active',
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendor_number_not_blank check (btrim(vendor_number) <> ''),
  constraint vendor_country_code_check check (country_code ~ '^[A-Z]{2,3}$'),
  constraint vendor_currency_code_check check (currency ~ '^[A-Z]{3}$'),
  constraint vendor_email_format_check
    check (email is null or email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

create index vendor_name_idx on vendor using gin (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(legal_name, '')));
create index vendor_status_idx on vendor(status);

alter table product
  add constraint product_default_vendor_fkey
  foreign key (default_vendor_id) references vendor(id) on delete set null;

create table vendor_contact (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendor(id) on delete cascade,
  name text not null,
  title text,
  email text,
  phone text,
  is_primary boolean not null default false,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendor_contact_email_format_check
    check (email is null or email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

create index vendor_contact_vendor_idx on vendor_contact(vendor_id);
create unique index vendor_contact_one_primary
  on vendor_contact(vendor_id)
  where is_primary and is_active;

create table vendor_product (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendor(id) on delete cascade,
  product_id uuid not null references product(id) on delete restrict,
  vendor_item_number text not null,
  vendor_item_name text,
  unit_cost numeric(12,4) not null default 0,
  currency text not null default 'USD',
  lead_time_days integer,
  minimum_order_quantity numeric(14,3),
  is_primary_vendor boolean not null default false,
  is_active boolean not null default true,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendor_product_item_number_not_blank check (btrim(vendor_item_number) <> ''),
  constraint vendor_product_unit_cost_nonnegative check (unit_cost >= 0),
  constraint vendor_product_currency_code_check check (currency ~ '^[A-Z]{3}$'),
  constraint vendor_product_lead_time_nonnegative check (lead_time_days is null or lead_time_days >= 0),
  constraint vendor_product_moq_positive check (minimum_order_quantity is null or minimum_order_quantity > 0),
  unique(id, vendor_id),
  unique(id, product_id)
);

create index vendor_product_vendor_idx on vendor_product(vendor_id);
create index vendor_product_product_idx on vendor_product(product_id);
create unique index vendor_product_active_item_unique
  on vendor_product(vendor_id, product_id, vendor_item_number)
  where is_active;
create unique index vendor_product_one_primary_per_product
  on vendor_product(product_id)
  where is_primary_vendor and is_active;

create table vendor_purchase_order (
  id uuid primary key default gen_random_uuid(),
  vendor_po_number text not null unique,
  vendor_id uuid not null references vendor(id) on delete restrict,
  po_date date not null default current_date,
  expected_ready_date date,
  expected_ship_date date,
  status vendor_purchase_order_status not null default 'draft',
  currency text not null default 'USD',
  subtotal_amount numeric(14,2) not null default 0,
  freight_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) generated always as (subtotal_amount + freight_amount) stored,
  submitted_at timestamptz,
  submitted_by_user_id uuid references user_account(id),
  vendor_name_snapshot text not null,
  vendor_address_snapshot_json jsonb,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendor_po_currency_code_check check (currency ~ '^[A-Z]{3}$'),
  constraint vendor_po_amount_nonnegative check (subtotal_amount >= 0 and freight_amount >= 0)
);

create index vendor_purchase_order_vendor_idx on vendor_purchase_order(vendor_id);
create index vendor_purchase_order_status_idx on vendor_purchase_order(status);
create index vendor_purchase_order_expected_ready_idx on vendor_purchase_order(expected_ready_date);
create index vendor_purchase_order_expected_ship_idx on vendor_purchase_order(expected_ship_date);

create table vendor_purchase_order_line (
  id uuid primary key default gen_random_uuid(),
  vendor_purchase_order_id uuid not null references vendor_purchase_order(id) on delete cascade,
  product_id uuid not null references product(id) on delete restrict,
  vendor_product_id uuid not null,
  vendor_item_number_snapshot text not null,
  vendor_item_name_snapshot text,
  brand_id_snapshot uuid references brand(id),
  brand_name_snapshot text,
  product_sku_snapshot text not null,
  product_name_snapshot text not null,
  quantity_ordered numeric(14,3) not null,
  quantity_received numeric(14,3) not null default 0,
  unit_cost numeric(12,4) not null,
  line_total numeric(14,2) generated always as (round((quantity_ordered * unit_cost)::numeric, 2)) stored,
  expected_ready_date date,
  line_status vendor_purchase_order_line_status not null default 'open',
  cost_overridden boolean not null default false,
  cost_override_reason text,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendor_po_line_quantity_positive check (quantity_ordered > 0),
  constraint vendor_po_line_received_nonnegative check (quantity_received >= 0),
  constraint vendor_po_line_received_not_above_ordered check (quantity_received <= quantity_ordered),
  constraint vendor_po_line_unit_cost_nonnegative check (unit_cost >= 0),
  constraint vendor_po_line_cost_override_reason_check check (not cost_overridden or cost_override_reason is not null)
);

create index vendor_po_line_po_idx on vendor_purchase_order_line(vendor_purchase_order_id);
create index vendor_po_line_product_idx on vendor_purchase_order_line(product_id);
create index vendor_po_line_vendor_product_idx on vendor_purchase_order_line(vendor_product_id);
create index vendor_po_line_status_idx on vendor_purchase_order_line(line_status);

create table vendor_po_submission_history (
  id uuid primary key default gen_random_uuid(),
  vendor_purchase_order_id uuid not null references vendor_purchase_order(id) on delete cascade,
  email_send_history_id uuid references email_send_history(id) on delete set null,
  submitted_by_user_id uuid references user_account(id),
  submitted_at timestamptz not null default now(),
  submission_status vendor_po_submission_status not null,
  notes text
);

create index vendor_po_submission_history_po_idx on vendor_po_submission_history(vendor_purchase_order_id);

create table vendor_po_invoice (
  id uuid primary key default gen_random_uuid(),
  vendor_purchase_order_id uuid not null references vendor_purchase_order(id) on delete restrict,
  vendor_id uuid not null references vendor(id) on delete restrict,
  vendor_invoice_number text not null,
  invoice_date date,
  due_date date,
  currency text not null default 'USD',
  invoice_amount numeric(14,2) not null,
  amount_paid numeric(14,2) not null default 0,
  balance_due numeric(14,2) generated always as (invoice_amount - amount_paid) stored,
  payment_status vendor_po_invoice_payment_status not null default 'to_be_paid',
  payment_method vendor_payment_method,
  paid_date date,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  notes text,
  constraint vendor_po_invoice_currency_code_check check (currency ~ '^[A-Z]{3}$'),
  constraint vendor_po_invoice_amount_nonnegative check (invoice_amount >= 0 and amount_paid >= 0),
  constraint vendor_po_invoice_paid_not_above_invoice check (amount_paid <= invoice_amount),
  constraint vendor_po_invoice_paid_fields_check check (payment_status <> 'paid' or paid_date is not null),
  unique(vendor_id, vendor_invoice_number)
);

create index vendor_po_invoice_po_idx on vendor_po_invoice(vendor_purchase_order_id);
create index vendor_po_invoice_vendor_idx on vendor_po_invoice(vendor_id);
create index vendor_po_invoice_payment_status_idx on vendor_po_invoice(payment_status);
create index vendor_po_invoice_due_date_idx on vendor_po_invoice(due_date);

create table factory_inspection (
  id uuid primary key default gen_random_uuid(),
  vendor_purchase_order_id uuid not null references vendor_purchase_order(id) on delete cascade,
  inspection_number text not null unique,
  inspection_date date not null default current_date,
  inspector_user_id uuid references user_account(id),
  inspection_status factory_inspection_status not null default 'draft',
  summary text,
  report_file_id uuid references attachment(id) on delete set null,
  emailed_at timestamptz,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index factory_inspection_po_idx on factory_inspection(vendor_purchase_order_id);
create index factory_inspection_status_idx on factory_inspection(inspection_status);

create table factory_inspection_line (
  id uuid primary key default gen_random_uuid(),
  factory_inspection_id uuid not null references factory_inspection(id) on delete cascade,
  vendor_purchase_order_line_id uuid references vendor_purchase_order_line(id) on delete set null,
  product_id uuid references product(id) on delete set null,
  checkpoint_name text not null,
  expected_result text,
  actual_result text,
  pass_fail_status inspection_result_status not null default 'na',
  photo_required boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create index factory_inspection_line_inspection_idx on factory_inspection_line(factory_inspection_id);
create index factory_inspection_line_po_line_idx on factory_inspection_line(vendor_purchase_order_line_id);

create table import_container (
  id uuid primary key default gen_random_uuid(),
  container_number text not null unique,
  booking_number text,
  seal_number text,
  carrier text,
  shipping_agency text,
  vessel_name text,
  voyage_number text,
  etd date,
  eta date,
  arrival_date date,
  customs_status container_customs_status not null default 'pending',
  container_status import_container_status not null default 'draft',
  destination_warehouse_id uuid references warehouse(id) on delete set null,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint import_container_number_not_blank check (btrim(container_number) <> '')
);

create index import_container_status_idx on import_container(container_status);
create index import_container_eta_idx on import_container(eta);
create index import_container_destination_warehouse_idx on import_container(destination_warehouse_id);

create table import_container_line (
  id uuid primary key default gen_random_uuid(),
  import_container_id uuid not null references import_container(id) on delete cascade,
  vendor_purchase_order_line_id uuid not null references vendor_purchase_order_line(id) on delete restrict,
  product_id uuid not null references product(id) on delete restrict,
  quantity_packed numeric(14,3) not null,
  quantity_received numeric(14,3) not null default 0,
  carton_count integer,
  cbm numeric(18,6),
  gross_weight numeric(14,3),
  is_active boolean not null default true,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint import_container_line_quantity_positive check (quantity_packed > 0),
  constraint import_container_line_received_nonnegative check (quantity_received >= 0),
  constraint import_container_line_received_not_above_packed check (quantity_received <= quantity_packed),
  constraint import_container_line_carton_count_positive check (carton_count is null or carton_count > 0),
  constraint import_container_line_cbm_nonnegative check (cbm is null or cbm >= 0),
  constraint import_container_line_gross_weight_nonnegative check (gross_weight is null or gross_weight >= 0)
);

create index import_container_line_container_idx on import_container_line(import_container_id);
create index import_container_line_po_line_idx on import_container_line(vendor_purchase_order_line_id);
create index import_container_line_product_idx on import_container_line(product_id);

create table container_document (
  id uuid primary key default gen_random_uuid(),
  import_container_id uuid not null references import_container(id) on delete cascade,
  file_id uuid not null references attachment(id) on delete restrict,
  document_type text not null,
  display_name text,
  is_active boolean not null default true,
  uploaded_by_user_id uuid references user_account(id),
  uploaded_at timestamptz not null default now()
);

create index container_document_container_idx on container_document(import_container_id);

create table receiving_record (
  id uuid primary key default gen_random_uuid(),
  receiving_number text not null unique,
  source_type receiving_source_type not null,
  source_id uuid not null,
  warehouse_id uuid not null references warehouse(id) on delete restrict,
  received_date date not null default current_date,
  received_by_user_id uuid references user_account(id),
  status receiving_status not null default 'draft',
  posted_at timestamptz,
  cancelled_at timestamptz,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint receiving_record_posted_fields_check
    check (status <> 'posted' or (posted_at is not null and received_by_user_id is not null)),
  constraint receiving_record_cancelled_fields_check
    check (status <> 'cancelled' or cancelled_at is not null)
);

create index receiving_record_source_idx on receiving_record(source_type, source_id);
create index receiving_record_warehouse_idx on receiving_record(warehouse_id);
create index receiving_record_status_idx on receiving_record(status);
create index receiving_record_received_date_idx on receiving_record(received_date);

create table receiving_record_line (
  id uuid primary key default gen_random_uuid(),
  receiving_record_id uuid not null references receiving_record(id) on delete cascade,
  product_id uuid not null references product(id) on delete restrict,
  product_packing_box_id uuid references product_packing_box(id) on delete restrict,
  source_line_type receiving_line_source_type not null,
  source_line_id uuid not null,
  quantity_received numeric(14,3) not null,
  warehouse_location_id uuid not null references warehouse_location(id) on delete restrict,
  inventory_condition inventory_condition not null default 'regular',
  inventory_movement_id uuid references inventory_movement(id) on delete set null,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint receiving_line_quantity_positive check (quantity_received > 0),
  constraint receiving_line_phase1_condition_check
    check (inventory_condition in ('regular', 'to_be_inspected', 'damaged', 'hold'))
);

create index receiving_record_line_record_idx on receiving_record_line(receiving_record_id);
create index receiving_record_line_product_idx on receiving_record_line(product_id);
create index receiving_record_line_source_idx on receiving_record_line(source_line_type, source_line_id);
create index receiving_record_line_location_idx on receiving_record_line(warehouse_location_id);

alter table incoming_inventory
  add constraint incoming_inventory_vendor_po_line_fkey
  foreign key (vendor_purchase_order_line_id) references vendor_purchase_order_line(id) on delete set null;

alter table incoming_inventory
  add constraint incoming_inventory_container_line_fkey
  foreign key (import_container_line_id) references import_container_line(id) on delete set null;

create or replace function generate_prefixed_daily_number(prefix text, target_table text, target_column text)
returns text
language plpgsql
as $$
declare
  candidate text;
  exists_sql text;
  found_existing boolean;
begin
  loop
    candidate := prefix || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::integer::text, 4, '0');
    exists_sql := format('select exists (select 1 from %I where %I = $1)', target_table, target_column);
    execute exists_sql into found_existing using candidate;
    exit when not found_existing;
  end loop;

  return candidate;
end;
$$;

create or replace function generate_vendor_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('VEN', 'vendor', 'vendor_number');
end;
$$;

create or replace function generate_vendor_po_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('VPO', 'vendor_purchase_order', 'vendor_po_number');
end;
$$;

create or replace function generate_factory_inspection_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('INS', 'factory_inspection', 'inspection_number');
end;
$$;

create or replace function generate_receiving_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('REC', 'receiving_record', 'receiving_number');
end;
$$;

create or replace function set_vendor_number()
returns trigger
language plpgsql
as $$
begin
  if new.vendor_number is null or new.vendor_number = '' then
    new.vendor_number := generate_vendor_number();
  end if;

  return new;
end;
$$;

create or replace function set_vendor_po_number()
returns trigger
language plpgsql
as $$
begin
  if new.vendor_po_number is null or new.vendor_po_number = '' then
    new.vendor_po_number := generate_vendor_po_number();
  end if;

  return new;
end;
$$;

create or replace function set_factory_inspection_number()
returns trigger
language plpgsql
as $$
begin
  if new.inspection_number is null or new.inspection_number = '' then
    new.inspection_number := generate_factory_inspection_number();
  end if;

  return new;
end;
$$;

create or replace function set_receiving_number()
returns trigger
language plpgsql
as $$
begin
  if new.receiving_number is null or new.receiving_number = '' then
    new.receiving_number := generate_receiving_number();
  end if;

  return new;
end;
$$;

create or replace function set_vendor_po_vendor_snapshot()
returns trigger
language plpgsql
as $$
declare
  vendor_record vendor%rowtype;
begin
  select * into vendor_record
  from vendor
  where id = new.vendor_id;

  if not found then
    raise exception 'Vendor % does not exist', new.vendor_id;
  end if;

  if new.vendor_name_snapshot is null or new.vendor_name_snapshot = '' then
    new.vendor_name_snapshot := vendor_record.name;
  end if;

  if new.vendor_address_snapshot_json is null then
    new.vendor_address_snapshot_json := jsonb_build_object(
      'address_line_1', vendor_record.address_line_1,
      'address_line_2', vendor_record.address_line_2,
      'city', vendor_record.city,
      'state_province', vendor_record.state_province,
      'postal_code', vendor_record.postal_code,
      'country', vendor_record.country,
      'country_code', vendor_record.country_code,
      'phone', vendor_record.phone,
      'email', vendor_record.email
    );
  end if;

  if new.currency is null or new.currency = '' then
    new.currency := vendor_record.currency;
  end if;

  return new;
end;
$$;

create or replace function set_vendor_po_line_snapshots()
returns trigger
language plpgsql
as $$
declare
  po_vendor_id uuid;
  vp record;
  prod record;
begin
  select vendor_id into po_vendor_id
  from vendor_purchase_order
  where id = new.vendor_purchase_order_id;

  select
    vendor_product.vendor_id,
    vendor_product.product_id,
    vendor_product.vendor_item_number,
    vendor_product.vendor_item_name,
    vendor_product.unit_cost,
    vendor_product.currency,
    vendor_product.lead_time_days
  into vp
  from vendor_product
  where vendor_product.id = new.vendor_product_id;

  if vp.vendor_id is null then
    raise exception 'Vendor product % does not exist', new.vendor_product_id;
  end if;

  if vp.vendor_id <> po_vendor_id then
    raise exception 'Vendor product % does not belong to the vendor purchase order vendor', new.vendor_product_id;
  end if;

  select
    product.id,
    product.sku,
    product.name,
    product.brand_id,
    brand.name as brand_name
  into prod
  from product
  join brand on brand.id = product.brand_id
  where product.id = vp.product_id;

  new.product_id := prod.id;
  new.vendor_item_number_snapshot := coalesce(nullif(new.vendor_item_number_snapshot, ''), vp.vendor_item_number);
  new.vendor_item_name_snapshot := coalesce(nullif(new.vendor_item_name_snapshot, ''), vp.vendor_item_name);
  new.brand_id_snapshot := coalesce(new.brand_id_snapshot, prod.brand_id);
  new.brand_name_snapshot := coalesce(nullif(new.brand_name_snapshot, ''), prod.brand_name);
  new.product_sku_snapshot := coalesce(nullif(new.product_sku_snapshot, ''), prod.sku);
  new.product_name_snapshot := coalesce(nullif(new.product_name_snapshot, ''), prod.name);
  new.unit_cost := coalesce(new.unit_cost, vp.unit_cost);
  new.expected_ready_date := coalesce(new.expected_ready_date, current_date + coalesce(vp.lead_time_days, 0));

  return new;
end;
$$;

create or replace function validate_import_container_line()
returns trigger
language plpgsql
as $$
declare
  po_product_id uuid;
  ordered_qty numeric(14,3);
  total_packed numeric(14,3);
begin
  select product_id, quantity_ordered
  into po_product_id, ordered_qty
  from vendor_purchase_order_line
  where id = new.vendor_purchase_order_line_id;

  if po_product_id is null then
    raise exception 'Vendor PO line % does not exist', new.vendor_purchase_order_line_id;
  end if;

  if new.product_id <> po_product_id then
    raise exception 'Container line product must match vendor PO line product';
  end if;

  select coalesce(sum(quantity_packed), 0)
  into total_packed
  from import_container_line
  where vendor_purchase_order_line_id = new.vendor_purchase_order_line_id
    and is_active
    and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);

  if total_packed + new.quantity_packed > ordered_qty then
    raise exception 'Total packed quantity across containers cannot exceed vendor PO ordered quantity';
  end if;

  return new;
end;
$$;

create or replace function validate_receiving_record_line()
returns trigger
language plpgsql
as $$
declare
  source_product_id uuid;
  source_box_id uuid;
  ordered_or_packed_qty numeric(14,3);
  received_qty numeric(14,3);
  already_receipted_qty numeric(14,3);
begin
  if new.source_line_type = 'vendor_po_line' then
    select product_id, quantity_ordered, quantity_received
    into source_product_id, ordered_or_packed_qty, received_qty
    from vendor_purchase_order_line
    where id = new.source_line_id;
  elsif new.source_line_type = 'container_line' then
    select product_id, quantity_packed, quantity_received
    into source_product_id, ordered_or_packed_qty, received_qty
    from import_container_line
    where id = new.source_line_id;
  else
    return new;
  end if;

  if source_product_id is null then
    raise exception 'Receiving source line % does not exist', new.source_line_id;
  end if;

  if new.product_id <> source_product_id then
    raise exception 'Receiving line product must match source line product';
  end if;

  select coalesce(sum(quantity_received), 0)
  into already_receipted_qty
  from receiving_record_line rrl
  join receiving_record rr on rr.id = rrl.receiving_record_id
  where rrl.source_line_type = new.source_line_type
    and rrl.source_line_id = new.source_line_id
    and rrl.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
    and rr.status <> 'cancelled';

  if received_qty + already_receipted_qty + new.quantity_received > ordered_or_packed_qty then
    raise exception 'Over-receiving is blocked in Phase 1';
  end if;

  return new;
end;
$$;

create trigger set_vendor_number_before_insert
  before insert on vendor
  for each row execute function set_vendor_number();

alter table vendor
  alter column vendor_number set default generate_vendor_number();

create trigger set_vendor_po_number_before_insert
  before insert on vendor_purchase_order
  for each row execute function set_vendor_po_number();

alter table vendor_purchase_order
  alter column vendor_po_number set default generate_vendor_po_number();

create trigger set_vendor_po_vendor_snapshot_before_insert_update
  before insert or update of vendor_id, vendor_name_snapshot, vendor_address_snapshot_json, currency
  on vendor_purchase_order
  for each row execute function set_vendor_po_vendor_snapshot();

create trigger set_vendor_po_line_snapshots_before_insert_update
  before insert or update of vendor_purchase_order_id, vendor_product_id
  on vendor_purchase_order_line
  for each row execute function set_vendor_po_line_snapshots();

create trigger set_factory_inspection_number_before_insert
  before insert on factory_inspection
  for each row execute function set_factory_inspection_number();

alter table factory_inspection
  alter column inspection_number set default generate_factory_inspection_number();

create trigger validate_import_container_line_before_insert_update
  before insert or update of vendor_purchase_order_line_id, product_id, quantity_packed, is_active
  on import_container_line
  for each row execute function validate_import_container_line();

create trigger set_receiving_number_before_insert
  before insert on receiving_record
  for each row execute function set_receiving_number();

alter table receiving_record
  alter column receiving_number set default generate_receiving_number();

create trigger validate_receiving_record_line_before_insert_update
  before insert or update of source_line_type, source_line_id, product_id, quantity_received
  on receiving_record_line
  for each row execute function validate_receiving_record_line();

create trigger set_vendor_updated_at
  before update on vendor
  for each row execute function set_updated_at();

create trigger set_vendor_contact_updated_at
  before update on vendor_contact
  for each row execute function set_updated_at();

create trigger set_vendor_product_updated_at
  before update on vendor_product
  for each row execute function set_updated_at();

create trigger set_vendor_purchase_order_updated_at
  before update on vendor_purchase_order
  for each row execute function set_updated_at();

create trigger set_vendor_purchase_order_line_updated_at
  before update on vendor_purchase_order_line
  for each row execute function set_updated_at();

create trigger set_vendor_po_invoice_updated_at
  before update on vendor_po_invoice
  for each row execute function set_updated_at();

create trigger set_factory_inspection_updated_at
  before update on factory_inspection
  for each row execute function set_updated_at();

create trigger set_import_container_updated_at
  before update on import_container
  for each row execute function set_updated_at();

create trigger set_import_container_line_updated_at
  before update on import_container_line
  for each row execute function set_updated_at();

create trigger set_receiving_record_updated_at
  before update on receiving_record
  for each row execute function set_updated_at();

create trigger set_receiving_record_line_updated_at
  before update on receiving_record_line
  for each row execute function set_updated_at();

insert into document_number_sequence (sequence_code, document_type, prefix, next_number, padding_length)
values
  ('vendor_po_shared', 'vendor_purchase_order', 'VPO', 1, 6),
  ('receiving_shared', 'receiving_record', 'REC', 1, 6),
  ('factory_inspection_shared', 'factory_inspection', 'INS', 1, 6)
on conflict (sequence_code) do update
set document_type = excluded.document_type,
    prefix = excluded.prefix,
    padding_length = excluded.padding_length,
    updated_at = now();

insert into permission (permission_code, permission_area, name, description)
values
  ('purchasing.dashboard.view', 'purchasing', 'Purchasing / Receiving Dashboard View', 'View the purchasing and receiving dashboard.'),
  ('purchasing.vendor.view', 'purchasing', 'Vendor View', 'View vendor profiles and contacts.'),
  ('purchasing.vendor.edit', 'purchasing', 'Vendor Create/Edit', 'Create and edit vendor profiles.'),
  ('purchasing.vendor_product.view', 'purchasing', 'Vendor Product View', 'View vendor product references.'),
  ('purchasing.vendor_product.edit', 'purchasing', 'Vendor Product Create/Edit', 'Create and edit vendor product references.'),
  ('purchasing.vendor_po.view', 'purchasing', 'Vendor PO View', 'View vendor purchase orders.'),
  ('purchasing.vendor_po.create', 'purchasing', 'Vendor PO Create', 'Create vendor purchase orders.'),
  ('purchasing.vendor_po.edit_draft', 'purchasing', 'Vendor PO Draft Edit', 'Edit draft vendor purchase orders.'),
  ('purchasing.vendor_po.submit', 'purchasing', 'Vendor PO Submit', 'Submit vendor purchase orders.'),
  ('purchasing.vendor_po.cancel', 'purchasing', 'Vendor PO Cancel', 'Cancel vendor purchase orders.'),
  ('purchasing.vendor_po.cost_override', 'purchasing', 'Vendor PO Cost Override', 'Override vendor PO line unit cost.'),
  ('purchasing.vendor_po.email', 'purchasing', 'Vendor PO Email', 'Email vendor PO documents.'),
  ('purchasing.factory_inspection.view', 'purchasing', 'Factory Inspection View', 'View factory inspection records.'),
  ('purchasing.factory_inspection.create', 'purchasing', 'Factory Inspection Create', 'Create factory inspection records.'),
  ('purchasing.factory_inspection.edit', 'purchasing', 'Factory Inspection Edit', 'Edit factory inspection records.'),
  ('purchasing.container.view', 'purchasing', 'Container View', 'View import containers.'),
  ('purchasing.container.edit', 'purchasing', 'Container Create/Edit', 'Create and edit import containers.'),
  ('purchasing.receive_vendor_po', 'purchasing', 'Receive Vendor PO', 'Create receiving records from vendor purchase orders.'),
  ('purchasing.receive_container', 'purchasing', 'Receive Container', 'Create receiving records from import containers.'),
  ('purchasing.receiving.post', 'purchasing', 'Post Receiving', 'Post receiving and create inventory movements.'),
  ('purchasing.receiving.cancel_draft', 'purchasing', 'Cancel Draft Receiving', 'Cancel draft receiving records.'),
  ('purchasing.receiving.reverse_posted', 'purchasing', 'Reverse Posted Receiving', 'Reverse posted receiving through correcting movements.'),
  ('purchasing.putaway', 'purchasing', 'Putaway Inventory', 'Perform putaway for received inventory.'),
  ('purchasing.incoming_inventory.view', 'purchasing', 'Incoming Inventory View', 'View incoming inventory and ETA records.'),
  ('purchasing.vendor_invoice.view', 'purchasing', 'Vendor PO Invoice View', 'View lightweight vendor PO invoice/payable tracking.'),
  ('purchasing.vendor_invoice.edit', 'purchasing', 'Vendor PO Invoice Edit', 'Edit lightweight vendor PO invoice/payable tracking.')
on conflict (permission_code) do update
set
  permission_area = excluded.permission_area,
  name = excluded.name,
  description = excluded.description;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'::permission_level
from role r
join permission p on p.permission_area = 'purchasing'
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in (
      'purchasing.dashboard.view',
      'purchasing.vendor.view',
      'purchasing.vendor.edit',
      'purchasing.vendor_product.view',
      'purchasing.vendor_product.edit',
      'purchasing.vendor_po.view',
      'purchasing.vendor_po.create',
      'purchasing.vendor_po.edit_draft',
      'purchasing.vendor_po.submit',
      'purchasing.vendor_po.email',
      'purchasing.factory_inspection.view',
      'purchasing.factory_inspection.create',
      'purchasing.factory_inspection.edit',
      'purchasing.container.view',
      'purchasing.container.edit',
      'purchasing.receive_vendor_po',
      'purchasing.receive_container',
      'purchasing.receiving.post',
      'purchasing.receiving.cancel_draft',
      'purchasing.putaway',
      'purchasing.incoming_inventory.view'
    ) then 'edit'::permission_level
    when p.permission_code in (
      'purchasing.vendor_invoice.view'
    ) then 'view'::permission_level
    else 'none'::permission_level
  end
from role r
join permission p on p.permission_area = 'purchasing'
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;
