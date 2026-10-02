alter type public.vendor_purchase_order_production_status
  add value if not exists 'pending_approval' before 'in_production';
