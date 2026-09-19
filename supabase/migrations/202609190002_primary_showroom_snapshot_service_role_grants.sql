begin;

grant select, insert, delete on table public.primary_showroom_display_snapshot to service_role;
grant select, insert on table public.primary_showroom_display_snapshot_item to service_role;

commit;
