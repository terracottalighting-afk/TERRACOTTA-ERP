alter table public.container_service_invoice
  drop constraint if exists container_service_invoice_service_type_check;

alter table public.container_service_invoice
  add constraint container_service_invoice_service_type_check
  check (service_type in ('shipping_agency', 'tariff_broker', 'container_trucking'));

alter table public.container_service_invoice_draft_document
  drop constraint if exists container_service_invoice_draft_document_service_type_check;

alter table public.container_service_invoice_draft_document
  add constraint container_service_invoice_draft_document_service_type_check
  check (service_type in ('shipping_agency', 'tariff_broker', 'container_trucking'));

create or replace function public.generate_container_service_invoice_number(target_service_type text)
returns text
language plpgsql
as $$
begin
  if target_service_type = 'shipping_agency' then
    return public.generate_prefixed_daily_number('SAI', 'container_service_invoice', 'erp_invoice_number');
  elsif target_service_type = 'tariff_broker' then
    return public.generate_prefixed_daily_number('BRI', 'container_service_invoice', 'erp_invoice_number');
  end if;

  return public.generate_prefixed_daily_number('CTI', 'container_service_invoice', 'erp_invoice_number');
end;
$$;
