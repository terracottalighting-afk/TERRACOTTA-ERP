-- A pending shipment may be created before carrier details are available.
-- Posting it, however, always requires a carrier and master tracking number.
create or replace function public.enforce_freight_shipment_release_details()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.status = 'shipped'
    and old.status is distinct from 'shipped'
    and (nullif(btrim(new.carrier), '') is null or nullif(btrim(new.master_tracking_number), '') is null) then
    raise exception 'Carrier and master tracking number are required before a shipment can be posted.';
  end if;
  return new;
end;
$$;

drop trigger if exists freight_shipment_release_details_check on public.freight_shipment;
create trigger freight_shipment_release_details_check
before update of status on public.freight_shipment
for each row execute function public.enforce_freight_shipment_release_details();
