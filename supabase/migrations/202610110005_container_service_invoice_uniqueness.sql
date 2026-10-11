do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'container_service_invoice_container_service_key'
      and conrelid = 'public.container_service_invoice'::regclass
  ) then
    alter table public.container_service_invoice
      add constraint container_service_invoice_container_service_key
      unique (import_container_id, service_type);
  end if;
end;
$$;
