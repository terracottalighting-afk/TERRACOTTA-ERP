-- Confirming a prepared shipment is the inventory-posting event. Allocate each
-- required product box from available regular inventory, then use the existing
-- release function to update inventory, packing lists, and order shipping status.
create or replace function confirm_freight_shipment(
  p_freight_shipment_id uuid,
  p_released_by_user_id uuid default null,
  p_ship_date date default current_date
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  shipment_row freight_shipment%rowtype;
  packing_row packing_list%rowtype;
  line_row packing_list_line%rowtype;
  box_row product_packing_box%rowtype;
  balance_row inventory_balance%rowtype;
  has_required_box boolean;
begin
  select * into shipment_row
  from freight_shipment
  where id = p_freight_shipment_id
  for update;

  if not found then
    raise exception 'Freight shipment % does not exist', p_freight_shipment_id;
  end if;

  if shipment_row.status in ('shipped', 'delivered') then
    raise exception 'Freight shipment % has already been released', p_freight_shipment_id;
  end if;

  for packing_row in
    select * from packing_list
    where freight_shipment_id = p_freight_shipment_id
    for update
  loop
    for line_row in
      select * from packing_list_line
      where packing_list_id = packing_row.id
      for update
    loop
      if exists (select 1 from packing_list_line_box where packing_list_line_id = line_row.id) then
        continue;
      end if;

      has_required_box := false;
      for box_row in
        select * from product_packing_box
        where product_id = line_row.product_id
          and is_active
          and is_required_for_sale
        order by box_sequence
      loop
        has_required_box := true;
        select * into balance_row
        from inventory_balance
        where product_id = line_row.product_id
          and product_packing_box_id = box_row.id
          and inventory_condition = 'regular'
          and quantity_available >= line_row.quantity_shipped
        order by quantity_available desc, updated_at
        limit 1
        for update;

        if not found then
          raise exception 'Insufficient box inventory for SKU % / Box %', line_row.product_sku_snapshot, box_row.box_sequence;
        end if;

        insert into packing_list_line_box (
          packing_list_line_id,
          product_id,
          product_packing_box_id,
          box_sequence_snapshot,
          box_label_snapshot,
          box_length_snapshot,
          box_width_snapshot,
          box_height_snapshot,
          net_weight_snapshot,
          gross_weight_snapshot,
          warehouse_id,
          warehouse_location_id,
          box_quantity_shipped,
          inventory_balance_id
        ) values (
          line_row.id,
          line_row.product_id,
          box_row.id,
          box_row.box_sequence,
          box_row.box_label,
          box_row.box_length,
          box_row.box_width,
          box_row.box_height,
          box_row.net_weight,
          box_row.gross_weight,
          balance_row.warehouse_id,
          balance_row.warehouse_location_id,
          line_row.quantity_shipped,
          balance_row.id
        );
      end loop;

      if not has_required_box then
        raise exception 'SKU % has no required packing box. Add a packing box before confirming shipment.', line_row.product_sku_snapshot;
      end if;
    end loop;
  end loop;

  perform release_freight_shipment(p_freight_shipment_id, p_released_by_user_id, p_ship_date);
end;
$$;

grant execute on function public.confirm_freight_shipment(uuid, uuid, date) to service_role;
