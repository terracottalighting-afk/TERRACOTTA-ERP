-- Catalog and marketing-material orders are fulfilled but never invoiced.
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

  if order_record.order_type in ('rga_replacement', 'catalog_marketing') or not order_record.invoice_required then
    new.invoice_required := false;
    new.invoice_generation_status_snapshot := 'not_required';
  end if;

  return new;
end;
$$;
