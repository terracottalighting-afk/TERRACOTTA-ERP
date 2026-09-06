-- Sections are addressed within an aisle, so the same section code may be
-- reused under another aisle in the same warehouse.

alter table public.warehouse_location
  drop constraint if exists warehouse_location_warehouse_id_location_code_key;

alter table public.warehouse_location
  add constraint warehouse_location_warehouse_aisle_id_location_code_key
  unique (warehouse_aisle_id, location_code);
