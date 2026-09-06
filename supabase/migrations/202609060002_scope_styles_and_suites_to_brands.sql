alter table public.product_style
  add column brand_id uuid references public.brand(id) on delete restrict;

update public.product_style style
set brand_id = suite.brand_id
from public.product_signature_suite suite
where style.signature_suite_id = suite.id
  and style.brand_id is null;

alter table public.product_signature_suite
  drop constraint if exists product_signature_suite_suite_code_key;

alter table public.product_signature_suite
  add constraint product_signature_suite_brand_code_key unique (brand_id, suite_code);

alter table public.product_style
  drop constraint if exists product_style_style_code_key;

alter table public.product_style
  add constraint product_style_brand_code_key unique (brand_id, style_code);

create index product_style_brand_idx on public.product_style(brand_id);

grant select, insert, update on table public.product_style to service_role;
