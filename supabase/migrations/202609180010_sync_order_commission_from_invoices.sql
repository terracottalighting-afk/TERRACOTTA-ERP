begin;

update public.sales_order orders
set commission_payable = false
where commission_payable = true
  and exists (
    select 1
    from public.customer_invoice invoices
    where invoices.sales_order_id = orders.id
      and invoices.commission_payable = false
      and invoices.invoice_status <> 'void'
  );

update public.packing_list packing
set commission_payable_snapshot = false
from public.sales_order orders
where orders.id = packing.sales_order_id
  and orders.commission_payable = false
  and packing.invoice_generation_status_snapshot = 'not_invoiced';

commit;
