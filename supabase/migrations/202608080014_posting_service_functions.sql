alter table commission_ar_offset
  add column if not exists ar_adjustment_id uuid references ar_adjustment(id) on delete set null,
  add column if not exists posted_at timestamptz;

create or replace function apply_inventory_movement(
  p_product_id uuid,
  p_product_packing_box_id uuid,
  p_warehouse_id uuid,
  p_from_location_id uuid,
  p_to_location_id uuid,
  p_from_condition inventory_condition,
  p_to_condition inventory_condition,
  p_movement_type inventory_movement_type,
  p_quantity numeric,
  p_source_entity_type text,
  p_source_entity_id uuid,
  p_performed_by_user_id uuid,
  p_reason_code text default null,
  p_notes text default null
)
returns uuid
language plpgsql
as $$
declare
  movement_id uuid;
  from_balance_id uuid;
  to_balance_id uuid;
  from_available numeric(14,3);
begin
  if p_quantity <= 0 then
    raise exception 'Inventory movement quantity must be positive';
  end if;

  if p_from_location_id is null and p_to_location_id is null then
    raise exception 'Inventory movement requires a from or to location';
  end if;

  if p_from_location_id is not null then
    select id, quantity_available
    into from_balance_id, from_available
    from inventory_balance
    where product_id = p_product_id
      and coalesce(product_packing_box_id, '00000000-0000-0000-0000-000000000000'::uuid) = coalesce(p_product_packing_box_id, '00000000-0000-0000-0000-000000000000'::uuid)
      and warehouse_location_id = p_from_location_id
      and inventory_condition = p_from_condition
    for update;

    if from_balance_id is null then
      raise exception 'No inventory balance exists for product %, box %, location %, condition %',
        p_product_id, p_product_packing_box_id, p_from_location_id, p_from_condition;
    end if;

    if from_available < p_quantity then
      raise exception 'Inventory available % is less than required movement quantity %', from_available, p_quantity;
    end if;

    update inventory_balance
    set quantity_on_hand = quantity_on_hand - p_quantity,
        last_movement_at = now(),
        updated_at = now()
    where id = from_balance_id;
  end if;

  if p_to_location_id is not null then
    select id
    into to_balance_id
    from inventory_balance
    where product_id = p_product_id
      and coalesce(product_packing_box_id, '00000000-0000-0000-0000-000000000000'::uuid) = coalesce(p_product_packing_box_id, '00000000-0000-0000-0000-000000000000'::uuid)
      and warehouse_location_id = p_to_location_id
      and inventory_condition = p_to_condition
    for update;

    if to_balance_id is null then
      insert into inventory_balance (
        product_id,
        product_packing_box_id,
        warehouse_id,
        warehouse_location_id,
        inventory_condition,
        quantity_on_hand,
        quantity_allocated,
        last_movement_at
      )
      values (
        p_product_id,
        p_product_packing_box_id,
        p_warehouse_id,
        p_to_location_id,
        p_to_condition,
        p_quantity,
        0,
        now()
      )
      returning id into to_balance_id;
    else
      update inventory_balance
      set quantity_on_hand = quantity_on_hand + p_quantity,
          last_movement_at = now(),
          updated_at = now()
      where id = to_balance_id;
    end if;
  end if;

  insert into inventory_movement (
    product_id,
    product_packing_box_id,
    warehouse_id,
    from_location_id,
    to_location_id,
    from_condition,
    to_condition,
    movement_type,
    quantity,
    source_entity_type,
    source_entity_id,
    performed_by_user_id,
    reason_code,
    notes
  )
  values (
    p_product_id,
    p_product_packing_box_id,
    p_warehouse_id,
    p_from_location_id,
    p_to_location_id,
    p_from_condition,
    p_to_condition,
    p_movement_type,
    p_quantity,
    p_source_entity_type,
    p_source_entity_id,
    p_performed_by_user_id,
    p_reason_code,
    p_notes
  )
  returning id into movement_id;

  return movement_id;
end;
$$;

create or replace function validate_receiving_record_line()
returns trigger
language plpgsql
as $$
declare
  source_product_id uuid;
  ordered_or_packed_qty numeric(14,3);
  already_receipted_qty numeric(14,3);
begin
  if new.source_line_type = 'vendor_po_line' then
    select product_id, quantity_ordered
    into source_product_id, ordered_or_packed_qty
    from vendor_purchase_order_line
    where id = new.source_line_id;
  elsif new.source_line_type = 'container_line' then
    select product_id, quantity_packed
    into source_product_id, ordered_or_packed_qty
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
    and rr.status = 'posted';

  if already_receipted_qty + new.quantity_received > ordered_or_packed_qty then
    raise exception 'Over-receiving is blocked in Phase 1';
  end if;

  return new;
end;
$$;

create or replace function post_receiving_record(
  p_receiving_record_id uuid,
  p_posted_by_user_id uuid default null
)
returns void
language plpgsql
as $$
declare
  receiving_record_row receiving_record%rowtype;
  line_row receiving_record_line%rowtype;
  movement_id uuid;
begin
  select * into receiving_record_row
  from receiving_record
  where id = p_receiving_record_id
  for update;

  if not found then
    raise exception 'Receiving record % does not exist', p_receiving_record_id;
  end if;

  if receiving_record_row.status = 'posted' then
    raise exception 'Receiving record % is already posted', p_receiving_record_id;
  end if;

  if receiving_record_row.status = 'cancelled' then
    raise exception 'Cancelled receiving record % cannot be posted', p_receiving_record_id;
  end if;

  for line_row in
    select * from receiving_record_line
    where receiving_record_id = p_receiving_record_id
    for update
  loop
    movement_id := apply_inventory_movement(
      line_row.product_id,
      line_row.product_packing_box_id,
      receiving_record_row.warehouse_id,
      null,
      line_row.warehouse_location_id,
      null,
      line_row.inventory_condition,
      'receive',
      line_row.quantity_received,
      'receiving_record_line',
      line_row.id,
      coalesce(p_posted_by_user_id, receiving_record_row.received_by_user_id),
      'receiving_post',
      line_row.notes
    );

    update receiving_record_line
    set inventory_movement_id = movement_id,
        updated_at = now()
    where id = line_row.id;

    if line_row.source_line_type = 'vendor_po_line' then
      update vendor_purchase_order_line
      set quantity_received = quantity_received + line_row.quantity_received,
          line_status = case
            when quantity_received + line_row.quantity_received >= quantity_ordered then 'received'::vendor_purchase_order_line_status
            else 'partially_received'::vendor_purchase_order_line_status
          end,
          updated_at = now()
      where id = line_row.source_line_id;
    elsif line_row.source_line_type = 'container_line' then
      update import_container_line
      set quantity_received = quantity_received + line_row.quantity_received,
          updated_at = now()
      where id = line_row.source_line_id;
    elsif line_row.source_line_type = 'rga_line' then
      update rga_line
      set quantity_received = quantity_received + line_row.quantity_received,
          return_inventory_movement_id = movement_id,
          status = case
            when quantity_received + line_row.quantity_received >= quantity_authorized then 'received'::rga_line_status
            else status
          end,
          updated_at = now()
      where id = line_row.source_line_id;
    end if;
  end loop;

  update receiving_record
  set status = 'posted',
      posted_at = now(),
      received_by_user_id = coalesce(received_by_user_id, p_posted_by_user_id),
      updated_at = now()
  where id = p_receiving_record_id;

  update vendor_purchase_order vpo
  set status = case
      when not exists (
        select 1 from vendor_purchase_order_line vpol
        where vpol.vendor_purchase_order_id = vpo.id
          and vpol.line_status not in ('received', 'closed', 'cancelled')
      ) then 'received'::vendor_purchase_order_status
      else 'partially_received'::vendor_purchase_order_status
    end,
    updated_at = now()
  where vpo.id = receiving_record_row.source_id
    and receiving_record_row.source_type = 'vendor_po';
end;
$$;

create or replace function refresh_sales_order_after_shipping(target_sales_order_id uuid)
returns void
language plpgsql
as $$
begin
  update sales_order_line sol
  set line_status = case
      when quantity_cancelled + quantity_cleared + quantity_shipped >= quantity_ordered then 'shipped'::sales_order_line_status
      when quantity_shipped > 0 then 'partial'::sales_order_line_status
      else line_status
    end,
    updated_at = now()
  where sol.sales_order_id = target_sales_order_id;

  update sales_order so
  set status = case
      when not exists (
        select 1 from sales_order_line sol
        where sol.sales_order_id = so.id
          and sol.quantity_shipped + sol.quantity_cancelled + sol.quantity_cleared < sol.quantity_ordered
      ) then 'closed'::sales_order_status
      when exists (
        select 1 from sales_order_line sol
        where sol.sales_order_id = so.id
          and sol.quantity_shipped > 0
      ) then 'partially_shipped'::sales_order_status
      else so.status
    end,
    closed_at = case
      when not exists (
        select 1 from sales_order_line sol
        where sol.sales_order_id = so.id
          and sol.quantity_shipped + sol.quantity_cancelled + sol.quantity_cleared < sol.quantity_ordered
      ) then coalesce(so.closed_at, now())
      else so.closed_at
    end,
    updated_at = now()
  where so.id = target_sales_order_id;
end;
$$;

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
      actual_ship_date = coalesce(actual_ship_date, p_ship_date),
      updated_at = now()
  where id = p_freight_shipment_id;
end;
$$;

create or replace function post_shipment_adjustment(
  p_shipment_adjustment_id uuid
)
returns void
language plpgsql
as $$
declare
  adjustment_row shipment_adjustment%rowtype;
  current_qty numeric(14,3);
  movement_id uuid;
  movement_quantity numeric(14,3);
begin
  select * into adjustment_row
  from shipment_adjustment
  where id = p_shipment_adjustment_id
  for update;

  if not found then
    raise exception 'Shipment adjustment % does not exist', p_shipment_adjustment_id;
  end if;

  if adjustment_row.inventory_movement_id is not null then
    raise exception 'Shipment adjustment % is already posted', p_shipment_adjustment_id;
  end if;

  select quantity_shipped into current_qty
  from packing_list_line
  where id = adjustment_row.packing_list_line_id
  for update;

  if current_qty <> adjustment_row.original_quantity_shipped then
    raise exception 'Packing list line quantity changed after adjustment was prepared';
  end if;

  movement_quantity := abs(adjustment_row.adjusted_quantity_shipped - adjustment_row.original_quantity_shipped);

  if movement_quantity > 0 then
    if adjustment_row.adjusted_quantity_shipped > adjustment_row.original_quantity_shipped then
      movement_id := apply_inventory_movement(
        adjustment_row.product_id,
        adjustment_row.product_packing_box_id,
        adjustment_row.warehouse_id,
        adjustment_row.warehouse_location_id,
        null,
        'regular',
        null,
        'ship',
        movement_quantity,
        'shipment_adjustment',
        adjustment_row.id,
        adjustment_row.adjusted_by_user_id,
        'shipment_adjustment_increase',
        adjustment_row.reason
      );
    else
      movement_id := apply_inventory_movement(
        adjustment_row.product_id,
        adjustment_row.product_packing_box_id,
        adjustment_row.warehouse_id,
        null,
        adjustment_row.warehouse_location_id,
        null,
        'regular',
        'adjust',
        movement_quantity,
        'shipment_adjustment',
        adjustment_row.id,
        adjustment_row.adjusted_by_user_id,
        'shipment_adjustment_decrease',
        adjustment_row.reason
      );
    end if;
  end if;

  update packing_list_line
  set quantity_shipped = adjustment_row.adjusted_quantity_shipped,
      updated_at = now()
  where id = adjustment_row.packing_list_line_id;

  update sales_order_line
  set quantity_shipped = quantity_shipped + (adjustment_row.adjusted_quantity_shipped - adjustment_row.original_quantity_shipped),
      updated_at = now()
  where id = adjustment_row.sales_order_line_id;

  update shipment_adjustment
  set inventory_movement_id = movement_id
  where id = adjustment_row.id;

  perform refresh_sales_order_after_shipping(adjustment_row.sales_order_id);
end;
$$;

create or replace function receive_rga_return(
  p_rga_line_id uuid,
  p_quantity_received numeric,
  p_warehouse_id uuid,
  p_warehouse_location_id uuid,
  p_received_by_user_id uuid default null,
  p_product_packing_box_id uuid default null,
  p_inventory_condition inventory_condition default 'hold',
  p_notes text default null
)
returns uuid
language plpgsql
as $$
declare
  rga_line_row rga_line%rowtype;
  movement_id uuid;
begin
  if p_quantity_received <= 0 then
    raise exception 'RGA return quantity must be positive';
  end if;

  select * into rga_line_row
  from rga_line
  where id = p_rga_line_id
  for update;

  if not found then
    raise exception 'RGA line % does not exist', p_rga_line_id;
  end if;

  if rga_line_row.quantity_received + p_quantity_received > rga_line_row.quantity_authorized then
    raise exception 'RGA return receipt cannot exceed authorized quantity';
  end if;

  movement_id := apply_inventory_movement(
    rga_line_row.product_id,
    p_product_packing_box_id,
    p_warehouse_id,
    null,
    p_warehouse_location_id,
    null,
    p_inventory_condition,
    'rga_return',
    p_quantity_received,
    'rga_line',
    p_rga_line_id,
    p_received_by_user_id,
    'rga_return',
    p_notes
  );

  update rga_line
  set quantity_received = quantity_received + p_quantity_received,
      return_inventory_movement_id = movement_id,
      received_inventory_condition = p_inventory_condition,
      status = case
        when quantity_received + p_quantity_received >= quantity_authorized then 'received'::rga_line_status
        else 'awaiting_return'::rga_line_status
      end,
      updated_at = now()
  where id = p_rga_line_id;

  update rga
  set status = case
      when not exists (
        select 1 from rga_line rl
        where rl.rga_id = rga.id
          and rl.quantity_received < rl.quantity_authorized
      ) then case
        when requested_resolution_type = 'credit' then 'awaiting_credit_memo'::rga_status
        else 'received'::rga_status
      end
      else status
    end,
    received_date = coalesce(received_date, current_date),
    updated_at = now()
  where id = rga_line_row.rga_id;

  return movement_id;
end;
$$;

create or replace function create_invoices_from_packing_list(
  p_packing_list_id uuid,
  p_invoice_date date default current_date,
  p_created_by_user_id uuid default null,
  p_brand_freight_allocations jsonb default '{}'::jsonb,
  p_brand_dropship_allocations jsonb default '{}'::jsonb,
  p_brand_tax_allocations jsonb default '{}'::jsonb
)
returns setof uuid
language plpgsql
as $$
declare
  packing_row packing_list%rowtype;
  order_row sales_order%rowtype;
  brand_count integer;
  brand_row record;
  invoice_id uuid;
  freight_amount numeric(14,2);
  dropship_amount numeric(14,2);
  tax_amount numeric(14,2);
  allocation_total numeric(14,2);
begin
  select * into packing_row
  from packing_list
  where id = p_packing_list_id
  for update;

  if not found then
    raise exception 'Packing list % does not exist', p_packing_list_id;
  end if;

  if not packing_row.invoice_required then
    update packing_list
    set invoice_generation_status_snapshot = 'not_required',
        updated_at = now()
    where id = p_packing_list_id;
    return;
  end if;

  if packing_row.invoice_generation_status_snapshot = 'fully_invoiced_by_brand' then
    raise exception 'Packing list % is already fully invoiced', packing_row.packing_list_number;
  end if;

  select * into order_row
  from sales_order
  where id = packing_row.sales_order_id;

  select count(distinct brand_id_snapshot)
  into brand_count
  from packing_list_line
  where packing_list_id = p_packing_list_id;

  if brand_count = 0 then
    raise exception 'Packing list % has no lines to invoice', packing_row.packing_list_number;
  end if;

  if brand_count > 1 and packing_row.shipping_fee > 0 then
    select coalesce(sum(value::text::numeric), 0)
    into allocation_total
    from jsonb_each(p_brand_freight_allocations);
    if allocation_total <> packing_row.shipping_fee then
      raise exception 'Manual brand freight allocations must equal packing list shipping fee %', packing_row.shipping_fee;
    end if;
  end if;

  if brand_count > 1 and packing_row.dropship_fee_amount > 0 then
    select coalesce(sum(value::text::numeric), 0)
    into allocation_total
    from jsonb_each(p_brand_dropship_allocations);
    if allocation_total <> packing_row.dropship_fee_amount then
      raise exception 'Manual brand dropship allocations must equal packing list dropship fee %', packing_row.dropship_fee_amount;
    end if;
  end if;

  for brand_row in
    select
      pll.brand_id_snapshot as brand_id,
      max(pll.brand_name_snapshot) as brand_name,
      sum(pll.line_total) as subtotal_amount
    from packing_list_line pll
    where pll.packing_list_id = p_packing_list_id
    group by pll.brand_id_snapshot
  loop
    if exists (
      select 1 from customer_invoice
      where packing_list_id = p_packing_list_id
        and brand_id = brand_row.brand_id
        and invoice_status <> 'void'
    ) then
      continue;
    end if;

    freight_amount := case
      when brand_count = 1 then packing_row.shipping_fee
      else coalesce((p_brand_freight_allocations ->> brand_row.brand_id::text)::numeric, 0)
    end;

    dropship_amount := case
      when brand_count = 1 then packing_row.dropship_fee_amount
      else coalesce((p_brand_dropship_allocations ->> brand_row.brand_id::text)::numeric, 0)
    end;

    tax_amount := coalesce((p_brand_tax_allocations ->> brand_row.brand_id::text)::numeric, 0);

    insert into customer_invoice (
      invoice_number,
      packing_list_id,
      brand_id,
      sales_order_id,
      customer_account_id,
      customer_location_id,
      ship_to_type,
      is_dropship,
      invoice_date,
      invoice_status,
      payment_status,
      commission_payable,
      commission_status,
      currency,
      customer_name_snapshot,
      customer_account_number_snapshot,
      legacy_account_id_snapshot,
      brand_name_snapshot,
      bill_to_snapshot_json,
      ship_to_snapshot_json,
      payment_terms_snapshot,
      sales_rep_agency_id_snapshot,
      sales_rep_id_snapshot,
      territory_id_snapshot,
      subtotal_amount,
      freight_amount,
      dropship_fee_amount,
      tax_amount,
      created_by_user_id
    )
    values (
      '',
      p_packing_list_id,
      brand_row.brand_id,
      packing_row.sales_order_id,
      packing_row.customer_account_id,
      packing_row.customer_location_id,
      packing_row.ship_to_type,
      packing_row.is_dropship,
      p_invoice_date,
      'open',
      'unpaid',
      order_row.order_type <> 'rga_replacement',
      case when order_row.order_type = 'rga_replacement' then 'no_commission'::commission_status else 'not_ready'::commission_status end,
      order_row.currency,
      order_row.customer_name_snapshot,
      order_row.customer_account_number_snapshot,
      order_row.legacy_account_id_snapshot,
      brand_row.brand_name,
      order_row.bill_to_snapshot_json,
      packing_row.ship_to_snapshot_json,
      order_row.payment_terms_snapshot,
      order_row.sales_rep_agency_id_snapshot,
      order_row.sales_rep_id_snapshot,
      order_row.territory_id_snapshot,
      brand_row.subtotal_amount,
      freight_amount,
      dropship_amount,
      tax_amount,
      p_created_by_user_id
    )
    returning id into invoice_id;

    insert into customer_invoice_line (
      customer_invoice_id,
      packing_list_line_id,
      sales_order_line_id,
      product_id,
      brand_id_snapshot,
      brand_name_snapshot,
      product_sku_snapshot,
      product_name_snapshot,
      quantity_invoiced,
      unit_price,
      discount_percent
    )
    select
      invoice_id,
      pll.id,
      pll.sales_order_line_id,
      pll.product_id,
      pll.brand_id_snapshot,
      pll.brand_name_snapshot,
      pll.product_sku_snapshot,
      pll.product_name_snapshot,
      pll.quantity_shipped,
      pll.unit_price_snapshot,
      pll.discount_percent_snapshot
    from packing_list_line pll
    where pll.packing_list_id = p_packing_list_id
      and pll.brand_id_snapshot = brand_row.brand_id;

    if order_row.sales_rep_agency_id_snapshot is not null and order_row.order_type <> 'rga_replacement' then
      insert into commission_snapshot (
        customer_invoice_id,
        customer_invoice_line_id,
        sales_order_id,
        sales_order_line_id,
        sales_rep_agency_id,
        sales_rep_id,
        territory_id,
        commission_percent,
        commission_base_amount,
        ownership_rule,
        snapshot_date,
        commission_status,
        created_by_user_id
      )
      select
        invoice_id,
        cil.id,
        packing_row.sales_order_id,
        cil.sales_order_line_id,
        order_row.sales_rep_agency_id_snapshot,
        order_row.sales_rep_id_snapshot,
        order_row.territory_id_snapshot,
        coalesce(sra.commission_default_percent, 0),
        cil.line_total,
        'customer_location',
        p_invoice_date,
        'not_ready',
        p_created_by_user_id
      from customer_invoice_line cil
      join sales_rep_agency sra on sra.id = order_row.sales_rep_agency_id_snapshot
      where cil.customer_invoice_id = invoice_id;
    end if;

    return next invoice_id;
  end loop;

  update packing_list
  set invoice_generation_status_snapshot = case
      when not exists (
        select 1
        from (
          select distinct brand_id_snapshot from packing_list_line where packing_list_id = p_packing_list_id
        ) brands
        where not exists (
          select 1 from customer_invoice ci
          where ci.packing_list_id = p_packing_list_id
            and ci.brand_id = brands.brand_id_snapshot
            and ci.invoice_status <> 'void'
        )
      ) then 'fully_invoiced_by_brand'::invoice_generation_status
      else 'partially_invoiced_by_brand'::invoice_generation_status
    end,
    status = case
      when status = 'shipped' then 'invoiced'::packing_list_status
      else status
    end,
    updated_at = now()
  where id = p_packing_list_id;
end;
$$;

create or replace function post_commission_ar_offset(
  p_commission_ar_offset_id uuid
)
returns void
language plpgsql
as $$
declare
  offset_row commission_ar_offset%rowtype;
  adjustment_id uuid;
begin
  select * into offset_row
  from commission_ar_offset
  where id = p_commission_ar_offset_id
  for update;

  if not found then
    raise exception 'Commission AR offset % does not exist', p_commission_ar_offset_id;
  end if;

  if offset_row.ar_adjustment_id is not null then
    raise exception 'Commission AR offset % is already posted', p_commission_ar_offset_id;
  end if;

  insert into ar_adjustment (
    adjustment_number,
    customer_account_id,
    customer_invoice_id,
    adjustment_type,
    reason_code,
    amount,
    adjustment_date,
    created_by_user_id,
    notes,
    status
  )
  values (
    '',
    offset_row.customer_account_id,
    offset_row.customer_invoice_id,
    'other',
    'commission_ar_offset',
    offset_row.amount_applied,
    offset_row.applied_date,
    offset_row.applied_by_user_id,
    offset_row.notes,
    'posted'
  )
  returning id into adjustment_id;

  update commission_ar_offset
  set ar_adjustment_id = adjustment_id,
      posted_at = now()
  where id = p_commission_ar_offset_id;

  perform refresh_invoice_ar_totals(offset_row.customer_invoice_id);
end;
$$;
