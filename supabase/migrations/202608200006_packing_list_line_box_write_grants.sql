-- Allow the ERP server-side workflow to save the warehouse/bin allocations
-- chosen while a draft packing list is created.
grant select, insert, update, delete on table public.packing_list_line_box to service_role;
