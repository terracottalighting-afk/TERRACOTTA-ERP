alter table public.vendor_purchase_order_line
  alter column production_status set default 'pending_approval';

update public.vendor_purchase_order_line as line
set
  production_status = 'pending_approval',
  production_status_changed_at = now()
from public.vendor_purchase_order as purchase_order
where purchase_order.id = line.vendor_purchase_order_id
  and purchase_order.status in ('draft', 'ready_for_review', 'for_vendor_confirmation')
  and line.production_status = 'in_production';
