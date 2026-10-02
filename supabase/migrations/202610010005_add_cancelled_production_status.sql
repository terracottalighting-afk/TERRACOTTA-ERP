alter type public.vendor_purchase_order_production_status
  add value if not exists 'cancelled' after 'exit_factory';
