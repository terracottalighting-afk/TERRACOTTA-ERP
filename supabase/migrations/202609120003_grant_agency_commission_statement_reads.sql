-- The agency dashboard reads existing commission statements and their included invoice lines.
grant select on table public.commission_payment to service_role;
grant select on table public.commission_payment_line to service_role;
notify pgrst, 'reload schema';
