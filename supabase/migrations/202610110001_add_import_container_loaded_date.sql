alter table public.import_container
  add column if not exists loaded_date date;

update public.import_container
set loaded_date = updated_at::date
where loaded_date is null
  and container_status in ('loaded', 'in_transit', 'arrived', 'delivered', 'closed');
