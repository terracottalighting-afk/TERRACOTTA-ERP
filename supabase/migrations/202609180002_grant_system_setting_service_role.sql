begin;

grant select, insert, update on table public.system_setting to service_role;

commit;
