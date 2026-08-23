-- Inventory must always have a warehouse/bin record. This system-managed bin
-- keeps inventory pickable when the physical location is not known yet.
create or replace function public.ensure_unspecified_pick_location_for_warehouse(
  target_warehouse_id uuid
)
returns void
language plpgsql
as $$
begin
  insert into public.warehouse_location (
    warehouse_id,
    location_code,
    location_name,
    location_type,
    is_pickable,
    is_active,
    notes
  )
  values (
    target_warehouse_id,
    'UNSPECIFIED-PICK',
    'Unspecified Pick Location',
    'bin',
    true,
    true,
    'System fallback for inventory whose physical warehouse/bin location has not yet been recorded.'
  )
  on conflict (warehouse_id, location_code) do update
  set location_name = excluded.location_name,
      location_type = 'bin',
      is_pickable = true,
      is_active = true,
      is_hold_location = false,
      is_damaged_location = false,
      notes = excluded.notes;
end;
$$;

do $$
declare
  warehouse_row record;
begin
  for warehouse_row in
    select id from public.warehouse where is_active = true
  loop
    perform public.ensure_unspecified_pick_location_for_warehouse(warehouse_row.id);
  end loop;
end;
$$;

create or replace function public.ensure_unspecified_pick_location_after_warehouse_change()
returns trigger
language plpgsql
as $$
begin
  if new.is_active then
    perform public.ensure_unspecified_pick_location_for_warehouse(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists warehouse_ensure_unspecified_pick_location on public.warehouse;
create trigger warehouse_ensure_unspecified_pick_location
after insert or update of is_active on public.warehouse
for each row
execute function public.ensure_unspecified_pick_location_after_warehouse_change();
