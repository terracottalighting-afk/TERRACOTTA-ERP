begin;

alter table public.primary_showroom_display_snapshot
  add column if not exists snapshot_name text,
  add column if not exists primary_showroom_contact_name_snapshot text,
  add column if not exists sales_agency_name_snapshot text,
  add column if not exists sales_rep_name_snapshot text;

update public.primary_showroom_display_snapshot
set snapshot_name = concat('Snapshot - ', snapshot_date)
where snapshot_name is null or btrim(snapshot_name) = '';

alter table public.primary_showroom_display_snapshot
  alter column snapshot_name set not null;

commit;
