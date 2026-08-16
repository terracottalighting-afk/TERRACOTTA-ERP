grant select, insert, update, delete on table public.product_image to service_role;
grant select, insert, update on table public.attachment to service_role;

insert into storage.buckets (
  id,
  name,
  public,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  false,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff'
  ]
)
on conflict (id) do nothing;
