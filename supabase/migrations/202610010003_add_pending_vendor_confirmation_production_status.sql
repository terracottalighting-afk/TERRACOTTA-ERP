alter type public.vendor_purchase_order_production_status
  add value if not exists 'pending_vendor_confirmation' before 'in_production';
