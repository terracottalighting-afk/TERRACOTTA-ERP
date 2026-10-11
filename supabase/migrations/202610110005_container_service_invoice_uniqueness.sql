alter table public.container_service_invoice
  add constraint container_service_invoice_container_service_key
  unique (import_container_id, service_type);
