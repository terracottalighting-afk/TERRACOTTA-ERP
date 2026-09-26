begin;

grant select, insert, update, delete on table public.vendor to service_role;
grant select, insert, update, delete on table public.vendor_contact to service_role;
grant select, insert, update, delete on table public.vendor_product to service_role;
grant select, insert, update, delete on table public.vendor_purchase_order to service_role;
grant select, insert, update, delete on table public.vendor_purchase_order_line to service_role;
grant select, insert, update, delete on table public.vendor_po_invoice to service_role;
grant select, insert, update, delete on table public.vendor_po_submission_history to service_role;
grant select, insert, update, delete on table public.import_container to service_role;
grant select, insert, update, delete on table public.import_container_line to service_role;
grant select, insert, update, delete on table public.container_document to service_role;
grant select, insert, update, delete on table public.factory_inspection to service_role;
grant select, insert, update, delete on table public.factory_inspection_line to service_role;
grant select, insert, update, delete on table public.incoming_inventory to service_role;

commit;
