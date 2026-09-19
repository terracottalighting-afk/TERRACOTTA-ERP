begin;

-- The invoice for this order was created with Pay Commission unchecked before
-- the form submitted an explicit false value. Apply the confirmed decision.
update public.sales_order
set commission_payable = false
where sales_order_number = 'SO20260919-3587';

update public.packing_list packing
set commission_payable_snapshot = false
from public.sales_order orders
where orders.id = packing.sales_order_id
  and orders.sales_order_number = 'SO20260919-3587';

update public.customer_invoice invoices
set
  commission_payable = false,
  commission_status = 'no_commission',
  commission_exclusion_reason = 'Commission disabled during invoice creation.',
  sales_rep_agency_id_snapshot = null,
  sales_rep_id_snapshot = null,
  updated_at = now()
from public.sales_order orders
where orders.id = invoices.sales_order_id
  and orders.sales_order_number = 'SO20260919-3587'
  and invoices.invoice_status <> 'void';

delete from public.commission_snapshot snapshots
using public.customer_invoice invoices,
      public.sales_order orders
where invoices.id = snapshots.customer_invoice_id
  and orders.id = invoices.sales_order_id
  and orders.sales_order_number = 'SO20260919-3587';

commit;
