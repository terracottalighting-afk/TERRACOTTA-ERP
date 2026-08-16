create type freight_shipment_status as enum ('pending', 'in_progress', 'shipped', 'delivered', 'cancelled');
create type shipping_type as enum ('ltl', 'truck_freight', 'parcel', 'will_call', 'drop_ship');
create type packing_list_status as enum ('draft', 'released', 'shipped', 'invoiced', 'cancelled');
create type invoice_generation_status as enum ('not_invoiced', 'partially_invoiced_by_brand', 'fully_invoiced_by_brand', 'not_required');
create type shipment_adjustment_status as enum ('posted', 'reversed');
create type customer_invoice_generation_mode as enum ('brand_specific_invoice');
create type customer_invoice_status as enum ('draft', 'open', 'closed', 'void', 'written_off');
create type customer_invoice_payment_status as enum ('unpaid', 'partially_paid', 'paid');
create type commission_status as enum ('no_commission', 'not_ready', 'commission_ready', 'paid');
create type invoice_email_status as enum ('not_sent', 'sent', 'failed');

create table freight_shipment (
  id uuid primary key default gen_random_uuid(),
  freight_shipment_number text not null unique,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  ship_to_location_id uuid references customer_location(id) on delete restrict,
  ship_to_type sales_order_ship_to_type not null,
  is_dropship boolean not null default false,
  ship_to_snapshot_json jsonb not null,
  ship_to_hash text generated always as (md5(ship_to_snapshot_json::text)) stored,
  carrier text,
  shipping_type shipping_type,
  freight_terms_snapshot freight_terms not null default 'prepaid',
  carrier_account_number_snapshot text,
  bol_number text,
  bol_document_file_id uuid references attachment(id) on delete set null,
  master_tracking_number text,
  pro_number text,
  total_gross_weight numeric(14,3) not null default 0,
  total_inch_volume numeric(18,3) not null default 0,
  total_cbm numeric(18,6),
  freight_class text,
  pallet_count integer,
  carton_count integer not null default 0,
  freight_cost numeric(14,2) not null default 0,
  pickup_date date,
  ship_date date,
  estimated_delivery_date date,
  actual_delivery_date date,
  shipped_by_user_id uuid references user_account(id),
  status freight_shipment_status not null default 'pending',
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint freight_shipment_number_not_blank check (btrim(freight_shipment_number) <> ''),
  constraint freight_shipment_dropship_check check (
    (ship_to_type = 'dropship' and is_dropship)
    or (ship_to_type = 'saved_location' and not is_dropship)
  ),
  constraint freight_shipment_saved_location_check
    check (ship_to_type = 'dropship' or ship_to_location_id is not null),
  constraint freight_shipment_amounts_nonnegative check (
    total_gross_weight >= 0
    and total_inch_volume >= 0
    and (total_cbm is null or total_cbm >= 0)
    and freight_cost >= 0
    and carton_count >= 0
    and (pallet_count is null or pallet_count >= 0)
  ),
  constraint freight_shipment_shipped_fields_check
    check (status <> 'shipped' or (ship_date is not null and shipped_by_user_id is not null))
);

create index freight_shipment_customer_idx on freight_shipment(customer_account_id);
create index freight_shipment_ship_to_idx on freight_shipment(ship_to_location_id);
create index freight_shipment_ship_to_hash_idx on freight_shipment(customer_account_id, ship_to_hash);
create index freight_shipment_status_idx on freight_shipment(status);
create index freight_shipment_ship_date_idx on freight_shipment(ship_date);

create table packing_list (
  id uuid primary key default gen_random_uuid(),
  packing_list_number text not null unique,
  freight_shipment_id uuid references freight_shipment(id) on delete set null,
  sales_order_id uuid not null references sales_order(id) on delete restrict,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  customer_location_id uuid references customer_location(id) on delete restrict,
  ship_to_type sales_order_ship_to_type not null,
  is_dropship boolean not null default false,
  customer_po_number_snapshot text not null,
  sales_order_number_snapshot text,
  ship_to_snapshot_json jsonb not null,
  ship_to_hash text generated always as (md5(ship_to_snapshot_json::text)) stored,
  carrier_snapshot text,
  shipping_type_snapshot shipping_type,
  tracking_number text,
  ship_date date,
  shipping_fee numeric(14,2) not null default 0,
  allocated_freight_cost numeric(14,2) not null default 0,
  dropship_fee_amount numeric(14,2) not null default 0,
  packed_by_user_id uuid references user_account(id),
  status packing_list_status not null default 'draft',
  invoice_generation_status_snapshot invoice_generation_status not null default 'not_invoiced',
  invoice_required boolean not null default true,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint packing_list_number_not_blank check (btrim(packing_list_number) <> ''),
  constraint packing_list_amounts_nonnegative check (
    shipping_fee >= 0
    and allocated_freight_cost >= 0
    and dropship_fee_amount >= 0
  ),
  constraint packing_list_no_invoice_status_check
    check (invoice_required or invoice_generation_status_snapshot = 'not_required')
);

create index packing_list_freight_shipment_idx on packing_list(freight_shipment_id);
create index packing_list_sales_order_idx on packing_list(sales_order_id);
create index packing_list_customer_idx on packing_list(customer_account_id);
create index packing_list_status_idx on packing_list(status);
create index packing_list_invoice_queue_idx on packing_list(invoice_required, invoice_generation_status_snapshot, status);
create index packing_list_ship_date_idx on packing_list(ship_date);

create table packing_list_line (
  id uuid primary key default gen_random_uuid(),
  packing_list_id uuid not null references packing_list(id) on delete cascade,
  sales_order_line_id uuid not null references sales_order_line(id) on delete restrict,
  product_id uuid not null references product(id) on delete restrict,
  brand_id_snapshot uuid not null references brand(id),
  brand_name_snapshot text not null,
  product_sku_snapshot text not null,
  product_name_snapshot text not null,
  warehouse_id uuid references warehouse(id) on delete restrict,
  warehouse_location_id uuid references warehouse_location(id) on delete restrict,
  quantity_ordered_snapshot numeric(14,3) not null,
  quantity_previously_shipped_snapshot numeric(14,3) not null default 0,
  quantity_shipped numeric(14,3) not null,
  unit_price_snapshot numeric(12,2) not null,
  discount_percent_snapshot numeric(5,2) not null default 0,
  line_total numeric(14,2) generated always as (round((quantity_shipped * unit_price_snapshot * (1 - discount_percent_snapshot / 100))::numeric, 2)) stored,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint packing_list_line_quantities_positive check (quantity_shipped > 0),
  constraint packing_list_line_snapshots_nonnegative check (
    quantity_ordered_snapshot >= 0
    and quantity_previously_shipped_snapshot >= 0
    and unit_price_snapshot >= 0
    and discount_percent_snapshot >= 0
  ),
  constraint packing_list_line_not_over_ordered check (
    quantity_previously_shipped_snapshot + quantity_shipped <= quantity_ordered_snapshot
  )
);

create index packing_list_line_packing_list_idx on packing_list_line(packing_list_id);
create index packing_list_line_sales_order_line_idx on packing_list_line(sales_order_line_id);
create index packing_list_line_product_idx on packing_list_line(product_id);
create index packing_list_line_brand_idx on packing_list_line(brand_id_snapshot);

create table packing_list_line_box (
  id uuid primary key default gen_random_uuid(),
  packing_list_line_id uuid not null references packing_list_line(id) on delete cascade,
  product_id uuid not null references product(id) on delete restrict,
  product_packing_box_id uuid not null references product_packing_box(id) on delete restrict,
  box_sequence_snapshot integer not null,
  box_label_snapshot text,
  box_length_snapshot numeric(12,3),
  box_width_snapshot numeric(12,3),
  box_height_snapshot numeric(12,3),
  net_weight_snapshot numeric(12,3),
  gross_weight_snapshot numeric(12,3),
  warehouse_id uuid not null references warehouse(id) on delete restrict,
  warehouse_location_id uuid not null references warehouse_location(id) on delete restrict,
  box_quantity_shipped numeric(14,3) not null,
  inventory_balance_id uuid references inventory_balance(id) on delete set null,
  inventory_movement_id uuid references inventory_movement(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint packing_list_line_box_sequence_positive check (box_sequence_snapshot > 0),
  constraint packing_list_line_box_quantity_positive check (box_quantity_shipped > 0),
  constraint packing_list_line_box_measure_nonnegative check (
    (box_length_snapshot is null or box_length_snapshot >= 0)
    and (box_width_snapshot is null or box_width_snapshot >= 0)
    and (box_height_snapshot is null or box_height_snapshot >= 0)
    and (net_weight_snapshot is null or net_weight_snapshot >= 0)
    and (gross_weight_snapshot is null or gross_weight_snapshot >= 0)
  )
);

create index packing_list_line_box_line_idx on packing_list_line_box(packing_list_line_id);
create index packing_list_line_box_product_box_idx on packing_list_line_box(product_packing_box_id);
create index packing_list_line_box_location_idx on packing_list_line_box(warehouse_location_id);

create table shipment_adjustment (
  id uuid primary key default gen_random_uuid(),
  freight_shipment_id uuid references freight_shipment(id) on delete set null,
  packing_list_id uuid not null references packing_list(id) on delete restrict,
  packing_list_line_id uuid not null references packing_list_line(id) on delete restrict,
  packing_list_line_box_id uuid references packing_list_line_box(id) on delete restrict,
  sales_order_id uuid not null references sales_order(id) on delete restrict,
  sales_order_line_id uuid not null references sales_order_line(id) on delete restrict,
  product_id uuid not null references product(id) on delete restrict,
  product_packing_box_id uuid references product_packing_box(id) on delete restrict,
  warehouse_id uuid references warehouse(id) on delete restrict,
  warehouse_location_id uuid references warehouse_location(id) on delete restrict,
  original_quantity_shipped numeric(14,3) not null,
  adjusted_quantity_shipped numeric(14,3) not null,
  adjustment_quantity numeric(14,3) generated always as (adjusted_quantity_shipped - original_quantity_shipped) stored,
  inventory_movement_id uuid references inventory_movement(id) on delete set null,
  reason text not null,
  notes text,
  adjusted_by_user_id uuid not null references user_account(id),
  adjusted_at timestamptz not null default now(),
  status shipment_adjustment_status not null default 'posted',
  created_at timestamptz not null default now(),
  constraint shipment_adjustment_quantities_nonnegative check (
    original_quantity_shipped >= 0
    and adjusted_quantity_shipped >= 0
  ),
  constraint shipment_adjustment_reason_not_blank check (btrim(reason) <> '')
);

create index shipment_adjustment_packing_list_idx on shipment_adjustment(packing_list_id);
create index shipment_adjustment_line_idx on shipment_adjustment(packing_list_line_id);
create index shipment_adjustment_sales_order_line_idx on shipment_adjustment(sales_order_line_id);
create index shipment_adjustment_product_idx on shipment_adjustment(product_id);

create table customer_invoice (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null,
  packing_list_id uuid not null references packing_list(id) on delete restrict,
  brand_id uuid not null references brand(id) on delete restrict,
  invoice_template_id uuid references document_template(id) on delete set null,
  invoice_generation_mode customer_invoice_generation_mode not null default 'brand_specific_invoice',
  sales_order_id uuid not null references sales_order(id) on delete restrict,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  customer_location_id uuid references customer_location(id) on delete restrict,
  ship_to_type sales_order_ship_to_type not null,
  is_dropship boolean not null default false,
  invoice_date date not null default current_date,
  due_date date,
  invoice_status customer_invoice_status not null default 'draft',
  payment_status customer_invoice_payment_status not null default 'unpaid',
  commission_payable boolean not null default true,
  commission_status commission_status not null default 'not_ready',
  commission_exclusion_reason text,
  email_status invoice_email_status not null default 'not_sent',
  currency text not null default 'USD',
  customer_name_snapshot text not null,
  customer_account_number_snapshot text,
  legacy_account_id_snapshot text,
  brand_name_snapshot text not null,
  brand_logo_file_id_snapshot uuid references attachment(id) on delete set null,
  bill_to_snapshot_json jsonb,
  ship_to_snapshot_json jsonb not null,
  payment_terms_snapshot text,
  sales_rep_agency_id_snapshot uuid,
  sales_rep_id_snapshot uuid,
  territory_id_snapshot uuid,
  subtotal_amount numeric(14,2) not null default 0,
  freight_amount numeric(14,2) not null default 0,
  dropship_fee_amount numeric(14,2) not null default 0,
  tax_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) generated always as (subtotal_amount + freight_amount + dropship_fee_amount + tax_amount) stored,
  payment_applied_amount numeric(14,2) not null default 0,
  credit_applied_amount numeric(14,2) not null default 0,
  waived_amount numeric(14,2) not null default 0,
  balance_due numeric(14,2) generated always as (
    subtotal_amount + freight_amount + dropship_fee_amount + tax_amount
    - payment_applied_amount - credit_applied_amount - waived_amount
  ) stored,
  emailed_at timestamptz,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  voided_by_user_id uuid references user_account(id),
  voided_at timestamptz,
  void_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_invoice_number_not_blank check (btrim(invoice_number) <> ''),
  constraint customer_invoice_currency_code_check check (currency ~ '^[A-Z]{3}$'),
  constraint customer_invoice_amounts_nonnegative check (
    subtotal_amount >= 0
    and freight_amount >= 0
    and dropship_fee_amount >= 0
    and tax_amount >= 0
    and payment_applied_amount >= 0
    and credit_applied_amount >= 0
    and waived_amount >= 0
  ),
  constraint customer_invoice_commission_check
    check ((commission_payable and commission_status <> 'no_commission') or (not commission_payable and commission_status = 'no_commission' and commission_exclusion_reason is not null)),
  constraint customer_invoice_void_check
    check (invoice_status <> 'void' or (voided_by_user_id is not null and voided_at is not null and void_reason is not null)),
  unique(brand_id, invoice_number)
);

create unique index customer_invoice_active_packing_brand_unique
  on customer_invoice(packing_list_id, brand_id)
  where invoice_status <> 'void';
create index customer_invoice_packing_list_idx on customer_invoice(packing_list_id);
create index customer_invoice_sales_order_idx on customer_invoice(sales_order_id);
create index customer_invoice_customer_idx on customer_invoice(customer_account_id);
create index customer_invoice_brand_idx on customer_invoice(brand_id);
create index customer_invoice_due_date_idx on customer_invoice(due_date);
create index customer_invoice_status_idx on customer_invoice(invoice_status);
create index customer_invoice_payment_status_idx on customer_invoice(payment_status);

create table customer_invoice_line (
  id uuid primary key default gen_random_uuid(),
  customer_invoice_id uuid not null references customer_invoice(id) on delete cascade,
  packing_list_line_id uuid not null references packing_list_line(id) on delete restrict,
  sales_order_line_id uuid not null references sales_order_line(id) on delete restrict,
  product_id uuid not null references product(id) on delete restrict,
  brand_id_snapshot uuid not null references brand(id),
  brand_name_snapshot text not null,
  product_sku_snapshot text not null,
  product_name_snapshot text not null,
  quantity_invoiced numeric(14,3) not null,
  unit_price numeric(12,2) not null,
  discount_percent numeric(5,2) not null default 0,
  line_total numeric(14,2) generated always as (round((quantity_invoiced * unit_price * (1 - discount_percent / 100))::numeric, 2)) stored,
  created_at timestamptz not null default now(),
  constraint customer_invoice_line_quantity_positive check (quantity_invoiced > 0),
  constraint customer_invoice_line_amounts_nonnegative check (unit_price >= 0 and discount_percent >= 0)
);

create index customer_invoice_line_invoice_idx on customer_invoice_line(customer_invoice_id);
create index customer_invoice_line_packing_line_idx on customer_invoice_line(packing_list_line_id);
create index customer_invoice_line_sales_order_line_idx on customer_invoice_line(sales_order_line_id);
create index customer_invoice_line_product_idx on customer_invoice_line(product_id);

create or replace function generate_freight_shipment_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('FS', 'freight_shipment', 'freight_shipment_number');
end;
$$;

create or replace function generate_packing_list_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('PL', 'packing_list', 'packing_list_number');
end;
$$;

create or replace function generate_invoice_number_for_brand(target_brand_id uuid)
returns text
language plpgsql
as $$
declare
  brand_code_value text;
  candidate text;
begin
  select brand_code into brand_code_value from brand where id = target_brand_id;
  if brand_code_value is null then
    raise exception 'Brand % does not exist', target_brand_id;
  end if;

  loop
    candidate := brand_code_value || '-INV' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::integer::text, 4, '0');
    exit when not exists (
      select 1 from customer_invoice
      where brand_id = target_brand_id
        and invoice_number = candidate
    );
  end loop;

  return candidate;
end;
$$;

create or replace function set_freight_shipment_number()
returns trigger
language plpgsql
as $$
begin
  if new.freight_shipment_number is null or new.freight_shipment_number = '' then
    new.freight_shipment_number := generate_freight_shipment_number();
  end if;
  return new;
end;
$$;

create or replace function set_packing_list_number()
returns trigger
language plpgsql
as $$
begin
  if new.packing_list_number is null or new.packing_list_number = '' then
    new.packing_list_number := generate_packing_list_number();
  end if;
  return new;
end;
$$;

create or replace function set_customer_invoice_number()
returns trigger
language plpgsql
as $$
begin
  if new.invoice_number is null or new.invoice_number = '' then
    new.invoice_number := generate_invoice_number_for_brand(new.brand_id);
  end if;
  return new;
end;
$$;

create or replace function set_packing_list_order_snapshots()
returns trigger
language plpgsql
as $$
declare
  order_record sales_order%rowtype;
begin
  select * into order_record from sales_order where id = new.sales_order_id;
  if not found then
    raise exception 'Sales order % does not exist', new.sales_order_id;
  end if;

  new.customer_account_id := order_record.customer_account_id;
  new.customer_location_id := order_record.customer_location_id;
  new.ship_to_type := order_record.ship_to_type;
  new.is_dropship := order_record.is_dropship;
  new.customer_po_number_snapshot := coalesce(nullif(new.customer_po_number_snapshot, ''), order_record.customer_po_number);
  new.sales_order_number_snapshot := coalesce(nullif(new.sales_order_number_snapshot, ''), order_record.sales_order_number);
  new.ship_to_snapshot_json := coalesce(new.ship_to_snapshot_json, order_record.ship_to_snapshot_json);
  new.dropship_fee_amount := coalesce(new.dropship_fee_amount, order_record.dropship_fee_amount, 0);

  if order_record.order_type = 'rga_replacement' then
    new.invoice_required := false;
    new.invoice_generation_status_snapshot := 'not_required';
  end if;

  return new;
end;
$$;

create or replace function validate_packing_list_freight_shipment()
returns trigger
language plpgsql
as $$
declare
  shipment_record freight_shipment%rowtype;
begin
  if new.freight_shipment_id is null then
    return new;
  end if;

  select * into shipment_record from freight_shipment where id = new.freight_shipment_id;

  if shipment_record.customer_account_id <> new.customer_account_id then
    raise exception 'Packing list customer must match freight shipment customer';
  end if;

  if shipment_record.ship_to_hash <> md5(new.ship_to_snapshot_json::text) then
    raise exception 'Packing list ship-to snapshot must match freight shipment ship-to snapshot';
  end if;

  return new;
end;
$$;

create or replace function set_packing_list_line_snapshots()
returns trigger
language plpgsql
as $$
declare
  line_record sales_order_line%rowtype;
begin
  select * into line_record from sales_order_line where id = new.sales_order_line_id;
  if not found then
    raise exception 'Sales order line % does not exist', new.sales_order_line_id;
  end if;

  new.product_id := line_record.product_id;
  new.brand_id_snapshot := coalesce(new.brand_id_snapshot, line_record.brand_id_snapshot);
  new.brand_name_snapshot := coalesce(nullif(new.brand_name_snapshot, ''), line_record.brand_name_snapshot);
  new.product_sku_snapshot := coalesce(nullif(new.product_sku_snapshot, ''), line_record.product_sku_snapshot);
  new.product_name_snapshot := coalesce(nullif(new.product_name_snapshot, ''), line_record.product_name_snapshot);
  new.quantity_ordered_snapshot := coalesce(new.quantity_ordered_snapshot, line_record.quantity_ordered);
  new.quantity_previously_shipped_snapshot := coalesce(new.quantity_previously_shipped_snapshot, line_record.quantity_shipped);
  new.unit_price_snapshot := coalesce(new.unit_price_snapshot, line_record.unit_price);
  new.discount_percent_snapshot := coalesce(new.discount_percent_snapshot, line_record.discount_percent);

  return new;
end;
$$;

create or replace function set_packing_list_line_box_snapshots()
returns trigger
language plpgsql
as $$
declare
  box_record product_packing_box%rowtype;
begin
  select * into box_record from product_packing_box where id = new.product_packing_box_id;
  if not found then
    raise exception 'Product packing box % does not exist', new.product_packing_box_id;
  end if;

  new.product_id := box_record.product_id;
  new.box_sequence_snapshot := coalesce(new.box_sequence_snapshot, box_record.box_sequence);
  new.box_label_snapshot := coalesce(nullif(new.box_label_snapshot, ''), box_record.box_label);
  new.box_length_snapshot := coalesce(new.box_length_snapshot, box_record.box_length);
  new.box_width_snapshot := coalesce(new.box_width_snapshot, box_record.box_width);
  new.box_height_snapshot := coalesce(new.box_height_snapshot, box_record.box_height);
  new.net_weight_snapshot := coalesce(new.net_weight_snapshot, box_record.net_weight);
  new.gross_weight_snapshot := coalesce(new.gross_weight_snapshot, box_record.gross_weight);

  return new;
end;
$$;

create or replace function refresh_customer_invoice_subtotal(target_invoice_id uuid)
returns void
language plpgsql
as $$
begin
  update customer_invoice
  set subtotal_amount = coalesce((
    select sum(line_total)
    from customer_invoice_line
    where customer_invoice_id = target_invoice_id
  ), 0),
  updated_at = now()
  where id = target_invoice_id;
end;
$$;

create or replace function refresh_customer_invoice_subtotal_trigger()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform refresh_customer_invoice_subtotal(old.customer_invoice_id);
    return old;
  end if;

  perform refresh_customer_invoice_subtotal(new.customer_invoice_id);

  if tg_op = 'UPDATE' and old.customer_invoice_id <> new.customer_invoice_id then
    perform refresh_customer_invoice_subtotal(old.customer_invoice_id);
  end if;

  return new;
end;
$$;

create trigger set_freight_shipment_number_before_insert
  before insert on freight_shipment
  for each row execute function set_freight_shipment_number();
alter table freight_shipment
  alter column freight_shipment_number set default generate_freight_shipment_number();

create trigger set_packing_list_number_before_insert
  before insert on packing_list
  for each row execute function set_packing_list_number();
alter table packing_list
  alter column packing_list_number set default generate_packing_list_number();

create trigger set_customer_invoice_number_before_insert
  before insert on customer_invoice
  for each row execute function set_customer_invoice_number();

create trigger set_packing_list_order_snapshots_before_insert_update
  before insert or update of sales_order_id
  on packing_list
  for each row execute function set_packing_list_order_snapshots();

create trigger validate_packing_list_freight_shipment_before_insert_update
  before insert or update of freight_shipment_id, customer_account_id, ship_to_snapshot_json
  on packing_list
  for each row execute function validate_packing_list_freight_shipment();

create trigger set_packing_list_line_snapshots_before_insert_update
  before insert or update of sales_order_line_id
  on packing_list_line
  for each row execute function set_packing_list_line_snapshots();

create trigger set_packing_list_line_box_snapshots_before_insert_update
  before insert or update of product_packing_box_id
  on packing_list_line_box
  for each row execute function set_packing_list_line_box_snapshots();

create trigger refresh_customer_invoice_subtotal_after_line_change
  after insert or update of quantity_invoiced, unit_price, discount_percent or delete
  on customer_invoice_line
  for each row execute function refresh_customer_invoice_subtotal_trigger();

create trigger set_freight_shipment_updated_at
  before update on freight_shipment
  for each row execute function set_updated_at();

create trigger set_packing_list_updated_at
  before update on packing_list
  for each row execute function set_updated_at();

create trigger set_packing_list_line_updated_at
  before update on packing_list_line
  for each row execute function set_updated_at();

create trigger set_customer_invoice_updated_at
  before update on customer_invoice
  for each row execute function set_updated_at();

insert into document_number_sequence (sequence_code, document_type, brand_id, prefix, next_number, padding_length)
select 'invoice_' || lower(brand_code), 'customer_invoice', id, brand_code || '-INV', 1, 6
from brand
on conflict (sequence_code) do update
set document_type = excluded.document_type,
    brand_id = excluded.brand_id,
    prefix = excluded.prefix,
    padding_length = excluded.padding_length,
    updated_at = now();

insert into document_number_sequence (sequence_code, document_type, prefix, next_number, padding_length)
values
  ('freight_shipment_shared', 'freight_shipment', 'FS', 1, 6),
  ('packing_list_shared', 'packing_list', 'PL', 1, 6)
on conflict (sequence_code) do update
set document_type = excluded.document_type,
    prefix = excluded.prefix,
    padding_length = excluded.padding_length,
    updated_at = now();

insert into permission (permission_code, permission_area, name, description)
values
  ('shipping.queue.view', 'shipping', 'Shipping Queue View', 'View shipping-ready order queue.'),
  ('shipping.shipment.create_pending', 'shipping', 'Create Pending Shipment', 'Create pending shipment/load plans.'),
  ('shipping.shipment.edit_pending', 'shipping', 'Edit Pending Shipment', 'Edit pending shipments.'),
  ('shipping.shipment.edit_in_progress', 'shipping', 'Edit In Progress Shipment', 'Edit in-progress shipments.'),
  ('shipping.packing_list.create', 'shipping', 'Create Packing List', 'Create invoice-creation packing lists.'),
  ('shipping.packing_list.edit_draft', 'shipping', 'Edit Draft Packing List', 'Edit draft packing lists.'),
  ('shipping.packing_list.release', 'shipping', 'Release Packing List', 'Release/ship packing lists and reduce inventory.'),
  ('shipping.hold.override', 'shipping', 'Override Shipping Hold', 'Override shipment release hold with reason.'),
  ('shipping.credit_hold.override', 'shipping', 'Override Credit Hold For Shipping', 'Override credit hold for shipping with reason.'),
  ('shipping.tracking.edit', 'shipping', 'Edit Shipment Tracking', 'Enter or edit carrier, tracking, BOL, PRO, and delivery data.'),
  ('shipping.freight_cost.enter', 'shipping', 'Enter Freight Cost', 'Enter shipment/load freight cost.'),
  ('shipping.freight_allocation.override', 'shipping', 'Override Freight Allocation', 'Override packing-list or brand invoice freight allocation.'),
  ('shipping.packing_list.cancel_released', 'shipping', 'Cancel Released Packing List', 'Cancel or correct released packing list records.'),
  ('invoice.queue.view', 'invoice', 'Invoice Queue View', 'View open packing lists waiting for invoice.'),
  ('invoice.generate', 'invoice', 'Generate Invoice', 'Generate brand-specific invoices from packing lists.'),
  ('invoice.void', 'invoice', 'Void Invoice', 'Void unpaid invoices with audit reason.'),
  ('invoice.commission_override', 'invoice', 'Override Commission Payable Flag', 'Override invoice commission payable flag.'),
  ('document.download', 'document', 'Download Documents', 'Download generated documents on demand.'),
  ('document.email', 'document', 'Email Documents', 'Email generated documents from ERP.')
on conflict (permission_code) do update
set permission_area = excluded.permission_area,
    name = excluded.name,
    description = excluded.description;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'::permission_level
from role r
join permission p on p.permission_area in ('shipping', 'invoice', 'document')
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in (
      'shipping.queue.view',
      'shipping.shipment.create_pending',
      'shipping.shipment.edit_pending',
      'shipping.shipment.edit_in_progress',
      'shipping.packing_list.create',
      'shipping.packing_list.edit_draft',
      'shipping.packing_list.release',
      'shipping.tracking.edit',
      'shipping.freight_cost.enter',
      'invoice.queue.view',
      'document.download',
      'document.email'
    ) then 'edit'::permission_level
    else 'none'::permission_level
  end
from role r
join permission p on p.permission_area in ('shipping', 'invoice', 'document')
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;
