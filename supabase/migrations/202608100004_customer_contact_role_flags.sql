alter table customer_contact
  add column if not exists is_warehouse_receiver boolean not null default false,
  add column if not exists is_showroom_floor_sales boolean not null default false,
  add column if not exists is_showroom_manager boolean not null default false;
