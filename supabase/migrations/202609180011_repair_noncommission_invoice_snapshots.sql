begin;

-- A commission-free invoice makes the order commission-free. Repair any
-- existing invoice snapshots created before that decision was fully enforced.
update public.customer_invoice invoices
set
  commission_payable = false,
  commission_status = 'no_commission',
  commission_exclusion_reason = coalesce(
    invoices.commission_exclusion_reason,
    'Commission disabled during invoice creation.'
  ),
  sales_rep_agency_id_snapshot = null,
  sales_rep_id_snapshot = null,
  updated_at = now()
from public.sales_order orders
where orders.id = invoices.sales_order_id
  and orders.commission_payable = false
  and invoices.invoice_status <> 'void';

delete from public.commission_snapshot snapshots
using public.customer_invoice invoices
where invoices.id = snapshots.customer_invoice_id
  and invoices.commission_payable = false;

commit;
