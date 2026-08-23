alter type sales_order_source add value if not exists 'converted';
alter type sales_order_status add value if not exists 'converted';

alter table sales_order
  add column if not exists converted_from_quote_id uuid references sales_order(id) on delete set null;
