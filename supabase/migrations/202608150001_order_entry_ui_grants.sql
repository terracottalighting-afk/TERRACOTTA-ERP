-- Order Entry UI uses the server-side service role client. Keep browser access behind
-- server actions while granting the application role only the required order tables.
grant select, insert, update, delete on table public.sales_order to service_role;
grant select, insert, update, delete on table public.sales_order_line to service_role;
