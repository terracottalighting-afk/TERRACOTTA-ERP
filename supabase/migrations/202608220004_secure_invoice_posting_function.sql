-- The terms wrapper delegates invoice creation to the original posting function.
-- It must use the database-owner role so invoice rows and lines can be posted
-- without relying on direct API table privileges.
alter function public.create_invoices_from_packing_list(uuid, date, uuid, jsonb, jsonb, jsonb)
  security definer
  set search_path = public;

grant execute on function public.create_invoices_from_packing_list(uuid, date, uuid, jsonb, jsonb, jsonb) to service_role;
