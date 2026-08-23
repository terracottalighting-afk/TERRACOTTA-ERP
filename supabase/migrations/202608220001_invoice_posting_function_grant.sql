-- Allows the ERP server to create brand-specific invoices from a shipped packing list.
grant execute on function public.create_invoices_from_packing_list(uuid, date, uuid, jsonb, jsonb, jsonb) to service_role;
