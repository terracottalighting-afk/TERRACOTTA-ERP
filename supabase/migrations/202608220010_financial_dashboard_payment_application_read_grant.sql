-- Allow the Financial dashboard and payment detail page to read posted invoice applications.
grant select on table public.customer_payment_application to service_role;
