begin;

create or replace function public.set_credit_memo_snapshots_and_validate()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  account_record public.customer_account%rowtype;
  brand_record public.brand%rowtype;
  invoice_record public.customer_invoice%rowtype;
begin
  select * into account_record from public.customer_account where id = new.customer_account_id;
  if not found then
    raise exception 'Customer account % does not exist', new.customer_account_id;
  end if;

  select * into brand_record from public.brand where id = new.brand_id;
  if not found then
    raise exception 'Brand % does not exist', new.brand_id;
  end if;

  if new.customer_invoice_id is not null then
    select * into invoice_record from public.customer_invoice where id = new.customer_invoice_id;
    if not found then
      raise exception 'Customer invoice % does not exist', new.customer_invoice_id;
    end if;
    if invoice_record.customer_account_id <> new.customer_account_id then
      raise exception 'Credit memo invoice customer does not match credit memo customer';
    end if;
    if invoice_record.brand_id <> new.brand_id then
      raise exception 'Credit memo brand must match original invoice brand';
    end if;
  end if;

  if new.status in ('posted', 'partially_applied', 'fully_applied') and new.posted_at is null then
    new.posted_at := now();
  end if;

  new.customer_name_snapshot := coalesce(nullif(new.customer_name_snapshot, ''), account_record.name);
  new.customer_account_number_snapshot := coalesce(nullif(new.customer_account_number_snapshot, ''), account_record.account_number);
  new.legacy_account_id_snapshot := coalesce(nullif(new.legacy_account_id_snapshot, ''), account_record.legacy_account_id);
  new.brand_name_snapshot := coalesce(nullif(new.brand_name_snapshot, ''), brand_record.name);

  return new;
end;
$$;

commit;
