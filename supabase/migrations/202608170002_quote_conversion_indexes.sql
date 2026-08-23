drop index if exists sales_order_customer_po_active_unique;

create unique index sales_order_customer_po_active_unique
  on sales_order(customer_account_id, lower(customer_po_number))
  where status not in ('deleted', 'converted');

create index if not exists sales_order_converted_from_quote_idx
  on sales_order(converted_from_quote_id)
  where converted_from_quote_id is not null;
