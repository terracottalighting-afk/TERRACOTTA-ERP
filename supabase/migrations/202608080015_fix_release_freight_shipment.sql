create or replace function release_freight_shipment(
  p_freight_shipment_id uuid,
  p_released_by_user_id uuid default null,
  p_ship_date date default current_date
)
returns void
language plpgsql
as $$
declare
  shipment_row freight_shipment%rowtype;
  packing_row packing_list%rowtype;
  box_row packing_list_line_box%rowtype;
  line_row packing_list_line%rowtype;
  movement_id uuid;
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
    if packing_row.status in ('shipped', 'invoiced') then
      raise exception 'Packing list % has already been shipped', packing_row.packing_list_number;
    end if;

    for line_row in
      select * from packing_list_line
      where packing_list_id = packing_row.id
    loop
      if not exists (
        select 1 from packing_list_line_box
        where packing_list_line_id = line_row.id
      ) then
        raise exception 'Packing list line % has no box allocation; final release requires box/bin detail', line_row.id;
      end if;
    end loop;

    for box_row in
      select * from packing_list_line_box
      where packing_list_line_id in (
        select id from packing_list_line where packing_list_id = packing_row.id
      )
      for update
    loop
      movement_id := apply_inventory_movement(
        box_row.product_id,
        box_row.product_packing_box_id,
        box_row.warehouse_id,
        box_row.warehouse_location_id,
        null,
        'regular',
        null,
        'ship',
        box_row.box_quantity_shipped,
        'packing_list_line_box',
        box_row.id,
        p_released_by_user_id,
        'shipment_release',
        'Released freight shipment.'
      );

      update packing_list_line_box
      set inventory_movement_id = movement_id
      where id = box_row.id;
    end loop;

    update sales_order_line sol
    set quantity_shipped = quantity_shipped + shipped.ship_qty,
        updated_at = now()
    from (
      select sales_order_line_id, sum(quantity_shipped) as ship_qty
      from packing_list_line
      where packing_list_id = packing_row.id
      group by sales_order_line_id
    ) shipped
    where sol.id = shipped.sales_order_line_id;

    update packing_list
    set status = 'shipped',
        ship_date = coalesce(ship_date, p_ship_date),
        packed_by_user_id = coalesce(packed_by_user_id, p_released_by_user_id),
        updated_at = now()
    where id = packing_row.id;

    perform refresh_sales_order_after_shipping(packing_row.sales_order_id);
  end loop;

  update freight_shipment
  set status = 'shipped',
      ship_date = coalesce(ship_date, p_ship_date),
      shipped_by_user_id = coalesce(shipped_by_user_id, p_released_by_user_id),
      updated_at = now()
  where id = p_freight_shipment_id;
end;
$$;
