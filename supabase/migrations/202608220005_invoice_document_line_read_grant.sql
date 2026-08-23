-- Allow the server-rendered invoice document to read its posted line items.
grant select on table public.customer_invoice_line to service_role;
