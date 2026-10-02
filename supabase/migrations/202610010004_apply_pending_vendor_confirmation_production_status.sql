update public.vendor_purchase_order_line as line
set
  production_status = 'pending_vendor_confirmation',
  production_status_changed_at = now()
from public.vendor_purchase_order as purchase_order
where purchase_order.id = line.vendor_purchase_order_id
  and purchase_order.status = 'for_vendor_confirmation'
  and line.production_status = 'pending_approval';
