create table public.product_style (
  id uuid primary key default gen_random_uuid(),
  style_code text not null unique,
  name text not null,
  signature_suite_id uuid references public.product_signature_suite(id) on delete set null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_style_code_not_blank check (btrim(style_code) <> ''),
  constraint product_style_name_not_blank check (btrim(name) <> '')
);

create index product_style_signature_suite_idx
  on public.product_style(signature_suite_id);

create trigger set_product_style_updated_at
  before update on public.product_style
  for each row execute function set_updated_at();

grant select, insert, update on table public.product_style to service_role;
