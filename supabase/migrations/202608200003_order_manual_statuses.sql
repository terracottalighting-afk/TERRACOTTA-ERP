alter type sales_order_status add value if not exists 'pending';
alter type sales_order_status add value if not exists 'hold';
alter type sales_order_status add value if not exists 'void';
