begin;

create or replace function public.refresh_commission_snapshots_for_invoice()
returns trigger
language plpgsql
as $$
begin
  if new.commission_status = 'commission_ready' then
    update public.commission_snapshot
    set commission_status = 'commission_ready',
        updated_at = now()
    where customer_invoice_id = new.id
      and commission_status = 'not_ready';
  elsif new.commission_status = 'no_commission' then
    delete from public.commission_snapshot
    where customer_invoice_id = new.id
      and commission_status in ('not_ready', 'commission_ready');
  end if;
  return new;
end;
$$;

commit;
