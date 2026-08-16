grant select, insert, update, delete on table public.product_document to service_role;
grant select, insert on table public.attachment to service_role;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-documents',
  'product-documents',
  false,
  104857600,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'text/plain',
    'application/acad',
    'application/x-acad',
    'application/autocad_dwg',
    'image/vnd.dwg',
    'application/dxf',
    'image/vnd.dxf',
    'application/octet-stream'
  ]
)
on conflict (id) do nothing;
