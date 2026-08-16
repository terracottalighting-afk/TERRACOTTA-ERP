create type warehouse_location_type as enum ('bin', 'receiving', 'hold', 'damaged', 'shipping', 'temporary');
create type inventory_condition as enum ('regular', 'to_be_inspected', 'damaged', 'hold', 'demolished_trash');
create type inventory_movement_type as enum ('receive', 'putaway', 'ship', 'transfer', 'adjust', 'rga_return', 'rga_disposition', 'scrap');
create type inventory_allocation_type as enum ('on_hand', 'incoming');
create type inventory_allocation_status as enum ('active', 'picked', 'shipped', 'released', 'cancelled');
create type inventory_adjustment_status as enum ('draft', 'posted', 'cancelled');
create type incoming_inventory_status as enum ('expected', 'in_transit', 'received', 'closed', 'cancelled');

create table warehouse (
  id uuid primary key default gen_random_uuid(),
  warehouse_code text not null unique,
  name text not null,
  address_line_1 text,
  address_line_2 text,
  city text,
  state_province text,
  postal_code text,
  country text not null default 'United States',
  country_code text not null default 'USA',
  is_active boolean not null default true,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint warehouse_code_not_blank check (btrim(warehouse_code) <> ''),
  constraint warehouse_country_code_check check (country_code ~ '^[A-Z]{2,3}$')
);

create table warehouse_zone (
  id uuid primary key default gen_random_uuid(),
  warehouse_id uuid not null references warehouse(id) on delete cascade,
  zone_code text not null,
  name text not null,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint warehouse_zone_code_not_blank check (btrim(zone_code) <> ''),
  unique(warehouse_id, zone_code)
);

create table warehouse_location (
  id uuid primary key default gen_random_uuid(),
  warehouse_id uuid not null references warehouse(id) on delete cascade,
  warehouse_zone_id uuid references warehouse_zone(id) on delete set null,
  location_code text not null,
  location_name text,
  location_type warehouse_location_type not null default 'bin',
  is_pickable boolean not null default false,
  is_receiving_location boolean not null default false,
  is_hold_location boolean not null default false,
  is_damaged_location boolean not null default false,
  is_shipping_location boolean not null default false,
  is_temporary_location boolean not null default false,
  is_active boolean not null default true,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint warehouse_location_code_not_blank check (btrim(location_code) <> ''),
  unique(warehouse_id, location_code)
);

create index warehouse_location_warehouse_idx on warehouse_location(warehouse_id);
create index warehouse_location_zone_idx on warehouse_location(warehouse_zone_id);
create index warehouse_location_type_idx on warehouse_location(location_type);
create index warehouse_location_pickable_idx on warehouse_location(warehouse_id) where is_active and is_pickable;

alter table product_packing_box
  add constraint product_packing_box_default_warehouse_fkey
  foreign key (default_warehouse_id) references warehouse(id) on delete set null;

alter table product_packing_box
  add constraint product_packing_box_default_location_fkey
  foreign key (default_warehouse_location_id) references warehouse_location(id) on delete set null;

create table inventory_balance (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete restrict,
  product_packing_box_id uuid references product_packing_box(id) on delete restrict,
  warehouse_id uuid not null references warehouse(id) on delete restrict,
  warehouse_location_id uuid not null references warehouse_location(id) on delete restrict,
  inventory_condition inventory_condition not null default 'regular',
  quantity_on_hand numeric(14,3) not null default 0,
  quantity_allocated numeric(14,3) not null default 0,
  quantity_available numeric(14,3) not null default 0,
  last_movement_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inventory_balance_quantity_nonnegative check (
    quantity_on_hand >= 0
    and quantity_allocated >= 0
    and quantity_available >= 0
  ),
  constraint inventory_balance_allocated_not_above_on_hand check (quantity_allocated <= quantity_on_hand)
);

create index inventory_balance_product_idx on inventory_balance(product_id);
create index inventory_balance_box_idx on inventory_balance(product_packing_box_id);
create index inventory_balance_warehouse_idx on inventory_balance(warehouse_id);
create index inventory_balance_location_idx on inventory_balance(warehouse_location_id);
create index inventory_balance_condition_idx on inventory_balance(inventory_condition);
create unique index inventory_balance_unique_scope
  on inventory_balance(
    product_id,
    coalesce(product_packing_box_id, '00000000-0000-0000-0000-000000000000'::uuid),
    warehouse_location_id,
    inventory_condition
  );

create table inventory_movement (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete restrict,
  product_packing_box_id uuid references product_packing_box(id) on delete restrict,
  warehouse_id uuid not null references warehouse(id) on delete restrict,
  from_location_id uuid references warehouse_location(id) on delete restrict,
  to_location_id uuid references warehouse_location(id) on delete restrict,
  from_condition inventory_condition,
  to_condition inventory_condition,
  movement_type inventory_movement_type not null,
  quantity numeric(14,3) not null,
  source_entity_type text,
  source_entity_id uuid,
  performed_by_user_id uuid references user_account(id),
  performed_at timestamptz not null default now(),
  reason_code text,
  notes text,
  created_at timestamptz not null default now(),
  constraint inventory_movement_quantity_positive check (quantity > 0),
  constraint inventory_movement_location_present check (from_location_id is not null or to_location_id is not null),
  constraint inventory_movement_condition_present check (from_condition is not null or to_condition is not null)
);

create index inventory_movement_product_idx on inventory_movement(product_id);
create index inventory_movement_box_idx on inventory_movement(product_packing_box_id);
create index inventory_movement_warehouse_idx on inventory_movement(warehouse_id);
create index inventory_movement_source_idx on inventory_movement(source_entity_type, source_entity_id);
create index inventory_movement_performed_at_idx on inventory_movement(performed_at);

create table incoming_inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete restrict,
  product_packing_box_id uuid references product_packing_box(id) on delete restrict,
  vendor_purchase_order_line_id uuid,
  import_container_line_id uuid,
  warehouse_id uuid references warehouse(id) on delete set null,
  expected_quantity numeric(14,3) not null,
  received_quantity numeric(14,3) not null default 0,
  pre_allocated_quantity numeric(14,3) not null default 0,
  expected_date date,
  status incoming_inventory_status not null default 'expected',
  source_reference text,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint incoming_inventory_quantities_nonnegative check (
    expected_quantity >= 0
    and received_quantity >= 0
    and pre_allocated_quantity >= 0
  ),
  constraint incoming_inventory_received_not_above_expected check (received_quantity <= expected_quantity),
  constraint incoming_inventory_preallocated_not_above_expected check (pre_allocated_quantity <= expected_quantity)
);

create index incoming_inventory_product_idx on incoming_inventory(product_id);
create index incoming_inventory_box_idx on incoming_inventory(product_packing_box_id);
create index incoming_inventory_warehouse_idx on incoming_inventory(warehouse_id);
create index incoming_inventory_expected_date_idx on incoming_inventory(expected_date);
create index incoming_inventory_status_idx on incoming_inventory(status);

create table inventory_allocation (
  id uuid primary key default gen_random_uuid(),
  sales_order_line_id uuid,
  product_id uuid not null references product(id) on delete restrict,
  product_packing_box_id uuid references product_packing_box(id) on delete restrict,
  warehouse_id uuid references warehouse(id) on delete set null,
  warehouse_location_id uuid references warehouse_location(id) on delete set null,
  inventory_balance_id uuid references inventory_balance(id) on delete set null,
  incoming_inventory_id uuid references incoming_inventory(id) on delete set null,
  allocation_type inventory_allocation_type not null,
  quantity_allocated numeric(14,3) not null,
  allocation_status inventory_allocation_status not null default 'active',
  allocated_by_user_id uuid references user_account(id),
  allocated_at timestamptz not null default now(),
  released_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inventory_allocation_quantity_positive check (quantity_allocated > 0),
  constraint inventory_allocation_source_check check (
    (allocation_type = 'on_hand' and (inventory_balance_id is not null or warehouse_location_id is not null))
    or (allocation_type = 'incoming' and incoming_inventory_id is not null)
  )
);

create index inventory_allocation_sales_order_line_idx on inventory_allocation(sales_order_line_id);
create index inventory_allocation_product_idx on inventory_allocation(product_id);
create index inventory_allocation_balance_idx on inventory_allocation(inventory_balance_id);
create index inventory_allocation_incoming_idx on inventory_allocation(incoming_inventory_id);
create index inventory_allocation_status_idx on inventory_allocation(allocation_status);

create table inventory_adjustment_reason (
  id uuid primary key default gen_random_uuid(),
  reason_code text not null unique,
  name text not null,
  description text,
  requires_notes boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table inventory_adjustment (
  id uuid primary key default gen_random_uuid(),
  adjustment_number text not null unique,
  product_id uuid not null references product(id) on delete restrict,
  product_packing_box_id uuid references product_packing_box(id) on delete restrict,
  warehouse_id uuid not null references warehouse(id) on delete restrict,
  warehouse_location_id uuid not null references warehouse_location(id) on delete restrict,
  inventory_condition inventory_condition not null,
  adjustment_quantity numeric(14,3) not null,
  inventory_adjustment_reason_id uuid not null references inventory_adjustment_reason(id) on delete restrict,
  inventory_movement_id uuid references inventory_movement(id) on delete set null,
  status inventory_adjustment_status not null default 'draft',
  adjusted_by_user_id uuid references user_account(id),
  adjusted_at timestamptz,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inventory_adjustment_quantity_not_zero check (adjustment_quantity <> 0),
  constraint inventory_adjustment_posted_fields_check
    check (status <> 'posted' or (adjusted_by_user_id is not null and adjusted_at is not null))
);

create index inventory_adjustment_product_idx on inventory_adjustment(product_id);
create index inventory_adjustment_location_idx on inventory_adjustment(warehouse_location_id);
create index inventory_adjustment_status_idx on inventory_adjustment(status);

create or replace function generate_inventory_adjustment_number()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := 'ADJ' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::integer::text, 4, '0');
    exit when not exists (
      select 1 from inventory_adjustment where adjustment_number = candidate
    );
  end loop;

  return candidate;
end;
$$;

create or replace function set_inventory_adjustment_number()
returns trigger
language plpgsql
as $$
begin
  if new.adjustment_number is null or new.adjustment_number = '' then
    new.adjustment_number := generate_inventory_adjustment_number();
  end if;

  return new;
end;
$$;

create or replace function set_inventory_balance_available()
returns trigger
language plpgsql
as $$
declare
  location_pickable boolean;
  location_active boolean;
begin
  select is_pickable, is_active
  into location_pickable, location_active
  from warehouse_location
  where id = new.warehouse_location_id;

  if new.inventory_condition = 'regular' and coalesce(location_pickable, false) and coalesce(location_active, false) then
    new.quantity_available := greatest(new.quantity_on_hand - new.quantity_allocated, 0);
  else
    new.quantity_available := 0;
  end if;

  return new;
end;
$$;

create trigger set_inventory_balance_available_before_insert_update
  before insert or update of quantity_on_hand, quantity_allocated, inventory_condition, warehouse_location_id
  on inventory_balance
  for each row
  execute function set_inventory_balance_available();

create trigger set_inventory_adjustment_number_before_insert
  before insert on inventory_adjustment
  for each row
  execute function set_inventory_adjustment_number();

alter table inventory_adjustment
  alter column adjustment_number set default generate_inventory_adjustment_number();

create view inventory_sku_summary as
select
  p.id as product_id,
  p.sku,
  p.name as product_name,
  p.brand_id,
  sum(ib.quantity_on_hand) as total_quantity_on_hand,
  sum(ib.quantity_allocated) as total_quantity_allocated,
  sum(ib.quantity_available) as total_quantity_available,
  sum(case when ib.inventory_condition = 'regular' then ib.quantity_available else 0 end) as sellable_quantity,
  sum(case when ib.inventory_condition <> 'regular' then ib.quantity_on_hand else 0 end) as non_sellable_quantity,
  max(ib.last_movement_at) as last_movement_at,
  min(ii.expected_date) filter (
    where ii.status in ('expected', 'in_transit')
      and ii.expected_quantity > ii.received_quantity
  ) as next_incoming_eta,
  sum(ii.expected_quantity - ii.received_quantity) filter (
    where ii.status in ('expected', 'in_transit')
      and ii.expected_quantity > ii.received_quantity
  ) as incoming_quantity
from product p
left join inventory_balance ib on ib.product_id = p.id
left join incoming_inventory ii on ii.product_id = p.id
group by p.id, p.sku, p.name, p.brand_id;

create view product_required_box_availability as
select
  p.id as product_id,
  p.sku,
  ppb.id as product_packing_box_id,
  ppb.box_sequence,
  ppb.box_label,
  coalesce(sum(ib.quantity_available), 0) as available_box_quantity
from product p
join product_packing_box ppb
  on ppb.product_id = p.id
  and ppb.is_active
  and ppb.is_required_for_sale
left join inventory_balance ib
  on ib.product_id = p.id
  and ib.product_packing_box_id = ppb.id
group by p.id, p.sku, ppb.id, ppb.box_sequence, ppb.box_label;

create view product_sellable_availability as
select
  p.id as product_id,
  p.sku,
  p.name as product_name,
  p.brand_id,
  case
    when p.no_box_needed then coalesce(sum(ib.quantity_available), 0)
    when exists (
      select 1
      from product_packing_box ppb
      where ppb.product_id = p.id
        and ppb.is_active
        and ppb.is_required_for_sale
    ) then (
      select min(rba.available_box_quantity)
      from product_required_box_availability rba
      where rba.product_id = p.id
    )
    else 0
  end as sellable_quantity
from product p
left join inventory_balance ib
  on ib.product_id = p.id
  and ib.product_packing_box_id is null
group by p.id, p.sku, p.name, p.brand_id, p.no_box_needed;

create trigger set_warehouse_updated_at
  before update on warehouse
  for each row execute function set_updated_at();

create trigger set_warehouse_zone_updated_at
  before update on warehouse_zone
  for each row execute function set_updated_at();

create trigger set_warehouse_location_updated_at
  before update on warehouse_location
  for each row execute function set_updated_at();

create trigger set_inventory_balance_updated_at
  before update on inventory_balance
  for each row execute function set_updated_at();

create trigger set_incoming_inventory_updated_at
  before update on incoming_inventory
  for each row execute function set_updated_at();

create trigger set_inventory_allocation_updated_at
  before update on inventory_allocation
  for each row execute function set_updated_at();

create trigger set_inventory_adjustment_reason_updated_at
  before update on inventory_adjustment_reason
  for each row execute function set_updated_at();

create trigger set_inventory_adjustment_updated_at
  before update on inventory_adjustment
  for each row execute function set_updated_at();

insert into warehouse (warehouse_code, name, country, country_code, is_active, notes)
values ('MAIN', 'Main Warehouse', 'United States', 'USA', true, 'Default shared warehouse for Phase 1 setup.')
on conflict (warehouse_code) do update
set name = excluded.name,
    country = excluded.country,
    country_code = excluded.country_code,
    is_active = excluded.is_active,
    notes = excluded.notes,
    updated_at = now();

insert into warehouse_zone (warehouse_id, zone_code, name, description, sort_order)
select w.id, seed.zone_code, seed.name, seed.description, seed.sort_order
from warehouse w
cross join (
  values
    ('RECV', 'Receiving', 'Receiving and temporary inbound area.', 10),
    ('PICK', 'Pickable Stock', 'Regular pickable inventory locations.', 20),
    ('HOLD', 'Hold / Inspection', 'Hold, inspection, and RGA return area.', 30),
    ('DMG', 'Damaged', 'Damaged or non-sellable goods area.', 40),
    ('SHIP', 'Shipping Staging', 'Shipping staging and outbound preparation area.', 50)
) as seed(zone_code, name, description, sort_order)
where w.warehouse_code = 'MAIN'
on conflict (warehouse_id, zone_code) do update
set name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into warehouse_location (
  warehouse_id,
  warehouse_zone_id,
  location_code,
  location_name,
  location_type,
  is_pickable,
  is_receiving_location,
  is_hold_location,
  is_damaged_location,
  is_shipping_location,
  is_temporary_location,
  notes
)
select
  w.id,
  z.id,
  seed.location_code,
  seed.location_name,
  seed.location_type::warehouse_location_type,
  seed.is_pickable,
  seed.is_receiving_location,
  seed.is_hold_location,
  seed.is_damaged_location,
  seed.is_shipping_location,
  seed.is_temporary_location,
  seed.notes
from warehouse w
join warehouse_zone z
  on z.warehouse_id = w.id
join (
  values
    ('RECV', 'RECEIVING-TEMP', 'Receiving Temporary', 'receiving', false, true, false, false, false, true, 'Default receiving temp location.'),
    ('PICK', 'PICK-DEFAULT', 'Default Pickable Stock', 'bin', true, false, false, false, false, false, 'Default pickable stock location for initial setup/import.'),
    ('HOLD', 'HOLD-RGA', 'RGA / Inspection Hold', 'hold', false, false, true, false, false, false, 'Default RGA return hold location.'),
    ('DMG', 'DAMAGED', 'Damaged Goods', 'damaged', false, false, false, true, false, false, 'Default damaged goods location.'),
    ('SHIP', 'SHIP-STAGE', 'Shipping Staging', 'shipping', false, false, false, false, true, true, 'Default shipping staging location.')
) as seed(zone_code, location_code, location_name, location_type, is_pickable, is_receiving_location, is_hold_location, is_damaged_location, is_shipping_location, is_temporary_location, notes)
  on z.zone_code = seed.zone_code
where w.warehouse_code = 'MAIN'
on conflict (warehouse_id, location_code) do update
set location_name = excluded.location_name,
    location_type = excluded.location_type,
    is_pickable = excluded.is_pickable,
    is_receiving_location = excluded.is_receiving_location,
    is_hold_location = excluded.is_hold_location,
    is_damaged_location = excluded.is_damaged_location,
    is_shipping_location = excluded.is_shipping_location,
    is_temporary_location = excluded.is_temporary_location,
    notes = excluded.notes,
    updated_at = now();

insert into inventory_adjustment_reason (reason_code, name, description, requires_notes, sort_order)
values
  ('opening_balance', 'Opening Balance', 'Initial inventory balance loaded during migration or setup.', false, 10),
  ('physical_count_correction', 'Physical Count Correction', 'Correction based on physical warehouse count.', true, 20),
  ('damage_found', 'Damage Found', 'Inventory adjusted due to damage found in warehouse.', true, 30),
  ('lost_missing', 'Lost / Missing', 'Inventory adjusted due to missing or lost goods.', true, 40),
  ('data_correction', 'Data Correction', 'Administrative correction of inventory data.', true, 50),
  ('rga_disposition', 'RGA Disposition', 'Inventory adjusted during RGA inspection or disposition.', true, 60),
  ('scrap_demolish', 'Scrap / Demolish', 'Inventory removed due to scrap, field demolish, or trash disposition.', true, 70),
  ('other', 'Other', 'Other approved inventory adjustment reason.', true, 100)
on conflict (reason_code) do update
set name = excluded.name,
    description = excluded.description,
    requires_notes = excluded.requires_notes,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into permission (permission_code, permission_area, name, description)
values
  ('inventory.view', 'inventory', 'Inventory View', 'View inventory search, balances, and warehouse summaries.'),
  ('inventory.export', 'inventory', 'Inventory Export', 'Export inventory search and balance data.'),
  ('inventory.warehouse_setup.manage', 'inventory', 'Warehouse Setup Manage', 'Create and edit warehouses and zones.'),
  ('inventory.warehouse_location.manage', 'inventory', 'Warehouse Location Manage', 'Create and edit warehouse/bin locations.'),
  ('inventory.putaway.perform', 'inventory', 'Putaway Perform', 'Perform putaway from receiving, temporary, hold, or inspection locations.'),
  ('inventory.transfer', 'inventory', 'Transfer Inventory', 'Transfer inventory between warehouse/bin locations.'),
  ('inventory.adjust', 'inventory', 'Adjust Inventory', 'Create and post inventory adjustments.'),
  ('inventory.condition.change', 'inventory', 'Change Inventory Condition', 'Move inventory between Regular, Hold, Damaged, To Be Inspected, and other conditions.'),
  ('inventory.scrap_demolish', 'inventory', 'Scrap/Demolish Inventory', 'Move inventory to demolished/trash or scrap condition.'),
  ('inventory.movement_history.view', 'inventory', 'Movement History View', 'View inventory movement ledger.'),
  ('inventory.allocation.override', 'inventory', 'Inventory Allocation Override', 'Override inventory allocation or availability warnings with audit.')
on conflict (permission_code) do update
set
  permission_area = excluded.permission_area,
  name = excluded.name,
  description = excluded.description;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'::permission_level
from role r
join permission p on p.permission_area = 'inventory'
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in (
      'inventory.view',
      'inventory.export',
      'inventory.putaway.perform',
      'inventory.transfer',
      'inventory.adjust',
      'inventory.condition.change',
      'inventory.movement_history.view'
    ) then 'edit'::permission_level
    else 'none'::permission_level
  end
from role r
join permission p on p.permission_area = 'inventory'
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;
