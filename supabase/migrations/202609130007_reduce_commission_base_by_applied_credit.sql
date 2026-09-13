begin;

alter table public.commission_snapshot
  add column if not exists original_commission_base_amount numeric(14,2) not null default 0;

update public.commission_snapshot
set original_commission_base_amount = commission_base_amount
where original_commission_base_amount = 0;

create or replace function public.set_original_commission_base_amount()
returns trigger
language plpgsql
as $$
begin
  if new.original_commission_base_amount = 0 then
    new.original_commission_base_amount := new.commission_base_amount;
  end if;
  return new;
end;
$$;

drop trigger if exists set_original_commission_base_amount_before_insert on public.commission_snapshot;
create trigger set_original_commission_base_amount_before_insert
before insert on public.commission_snapshot
for each row execute function public.set_original_commission_base_amount();

create or replace function public.refresh_invoice_commission_credit_bases(
  p_customer_invoice_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  credit_amount numeric(14,2);
  original_base_total numeric(14,2);
  adjusted_base_total numeric(14,2);
  remaining_base numeric(14,2);
  snapshot_count integer;
  snapshot_index integer := 0;
  adjusted_line_base numeric(14,2);
  snapshot_record record;
begin
  select coalesce(credit_applied_amount, 0)
    into credit_amount
  from customer_invoice
  where id = p_customer_invoice_id;

  if not found then
    return;
  end if;

  -- Existing commission statements are immutable. Credit may only change a
  -- commission basis before its snapshots have been placed on a statement.
  if exists (
    select 1
    from commission_snapshot cs
    join commission_payment_line cpl on cpl.commission_snapshot_id = cs.id
    where cs.customer_invoice_id = p_customer_invoice_id
  ) then
    return;
  end if;

  select
    coalesce(sum(original_commission_base_amount), 0),
    count(*)
  into original_base_total, snapshot_count
  from commission_snapshot
  where customer_invoice_id = p_customer_invoice_id;

  if snapshot_count = 0 or original_base_total <= 0 then
    return;
  end if;

  adjusted_base_total := greatest(original_base_total - credit_amount, 0);
  remaining_base := adjusted_base_total;

  for snapshot_record in
    select id, original_commission_base_amount
    from commission_snapshot
    where customer_invoice_id = p_customer_invoice_id
    order by id
  loop
    snapshot_index := snapshot_index + 1;
    if snapshot_index = snapshot_count then
      adjusted_line_base := remaining_base;
    else
      adjusted_line_base := round(
        snapshot_record.original_commission_base_amount
          / original_base_total
          * adjusted_base_total,
        2
      );
      remaining_base := remaining_base - adjusted_line_base;
    end if;

    update commission_snapshot
    set commission_base_amount = adjusted_line_base,
        updated_at = now()
    where id = snapshot_record.id;
  end loop;
end;
$$;

create or replace function public.refresh_commission_credit_base_after_invoice_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.credit_applied_amount is distinct from new.credit_applied_amount then
    perform public.refresh_invoice_commission_credit_bases(new.id);
  end if;
  return new;
end;
$$;

drop trigger if exists refresh_commission_credit_base_after_invoice_update on public.customer_invoice;
create trigger refresh_commission_credit_base_after_invoice_update
after update of credit_applied_amount on public.customer_invoice
for each row execute function public.refresh_commission_credit_base_after_invoice_update();

do $$
declare
  invoice_id uuid;
begin
  for invoice_id in
    select distinct cs.customer_invoice_id
    from public.commission_snapshot cs
    where not exists (
      select 1
      from public.commission_payment_line cpl
      where cpl.commission_snapshot_id = cs.id
    )
  loop
    perform public.refresh_invoice_commission_credit_bases(invoice_id);
  end loop;
end;
$$;

grant select on table public.credit_memo_application to service_role;
grant execute on function public.refresh_invoice_commission_credit_bases(uuid) to service_role;

notify pgrst, 'reload schema';

commit;
