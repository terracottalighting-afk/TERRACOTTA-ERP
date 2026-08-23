create type shipping_priority as enum ('normal', 'highest');

alter table sales_order
  add column shipping_priority shipping_priority not null default 'normal';

create index sales_order_shipping_queue_idx
  on sales_order(shipping_priority, created_at, order_date)
  where status in ('open', 'partially_shipped');

create or replace function reset_sales_order_shipping_priority_after_shipment()
returns trigger
language plpgsql
as $$
begin
  if new.quantity_shipped > old.quantity_shipped then
    update sales_order
    set shipping_priority = 'normal',
        updated_at = now()
    where id = new.sales_order_id
      and shipping_priority = 'highest';
  end if;

  return new;
end;
$$;

create trigger reset_sales_order_shipping_priority_after_shipment
after update of quantity_shipped on sales_order_line
for each row
when (new.quantity_shipped is distinct from old.quantity_shipped)
execute function reset_sales_order_shipping_priority_after_shipment();
