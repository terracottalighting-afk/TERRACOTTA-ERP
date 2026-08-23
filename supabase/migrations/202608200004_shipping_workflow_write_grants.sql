-- Shipment creation is handled by server actions using the application service role.
-- Grant only the shipping workflow tables required to create and maintain a draft shipment.
grant select, insert, update, delete on table public.freight_shipment to service_role;
grant select, insert, update, delete on table public.packing_list to service_role;
grant select, insert, update, delete on table public.packing_list_line to service_role;
