alter table public.vendor_purchase_order_line
  add column if not exists cancellation_reason text;

alter table public.vendor_purchase_order_line
  drop constraint if exists vendor_po_line_cancelled_reason_required;

alter table public.vendor_purchase_order_line
  add constraint vendor_po_line_cancelled_reason_required
  check (
    production_status <> 'cancelled'
    or nullif(btrim(cancellation_reason), '') is not null
  );

create or replace function public.reject_cancelled_vendor_po_line_container_load()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.vendor_purchase_order_line line
    where line.id = new.vendor_purchase_order_line_id
      and line.production_status = 'cancelled'
  ) then
    raise exception 'Cancelled purchase-order lines cannot be added to a container.';
  end if;

  return new;
end;
$$;

drop trigger if exists reject_cancelled_vendor_po_line_container_load on public.import_container_line;
create trigger reject_cancelled_vendor_po_line_container_load
before insert or update of vendor_purchase_order_line_id on public.import_container_line
for each row execute function public.reject_cancelled_vendor_po_line_container_load();

create or replace function public.close_completed_vendor_purchase_order()
returns trigger
language plpgsql
as $$
begin
  if not exists (
    select 1
    from public.vendor_purchase_order_line line
    where line.vendor_purchase_order_id = new.vendor_purchase_order_id
      and line.production_status <> 'cancelled'
      and line.quantity_exited_factory < line.quantity_ordered
  ) then
    update public.vendor_purchase_order
    set status = 'closed'
    where id = new.vendor_purchase_order_id
      and status in ('in_production', 'open');
  end if;

  return new;
end;
$$;

drop trigger if exists close_completed_vendor_purchase_order on public.vendor_purchase_order_line;
create trigger close_completed_vendor_purchase_order
after update of production_status, quantity_exited_factory on public.vendor_purchase_order_line
for each row execute function public.close_completed_vendor_purchase_order();
