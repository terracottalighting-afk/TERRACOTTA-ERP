-- Quotes use the existing order header/line structure, but remain outside order and shipping queues.
alter type sales_order_type add value if not exists 'quote';
