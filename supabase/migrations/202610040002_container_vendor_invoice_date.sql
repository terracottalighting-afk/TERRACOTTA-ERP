update public.container_vendor_invoice
set invoice_date = (created_at at time zone 'UTC')::date
where invoice_date is null;

alter table public.container_vendor_invoice
  alter column invoice_date set default current_date,
  alter column invoice_date set not null;
