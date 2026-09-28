create table if not exists public.vendor_product_packing_box (
  id uuid primary key default gen_random_uuid(),
  vendor_product_id uuid not null references public.vendor_product(id) on delete cascade,
  catalog_product_packing_box_id uuid references public.product_packing_box(id) on delete set null,
  box_sequence integer not null,
  box_label text,
  net_weight_lbs numeric(12,3),
  gross_weight_lbs numeric(12,3),
  box_depth_inches numeric(12,3),
  box_width_inches numeric(12,3),
  box_height_inches numeric(12,3),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vendor_product_packing_box_sequence_positive check (box_sequence > 0),
  constraint vendor_product_packing_box_measurements_nonnegative check (
    (net_weight_lbs is null or net_weight_lbs >= 0)
    and (gross_weight_lbs is null or gross_weight_lbs >= 0)
    and (box_depth_inches is null or box_depth_inches >= 0)
    and (box_width_inches is null or box_width_inches >= 0)
    and (box_height_inches is null or box_height_inches >= 0)
  )
);

create unique index if not exists vendor_product_packing_box_sequence_unique
  on public.vendor_product_packing_box(vendor_product_id, box_sequence)
  where is_active;

create index if not exists vendor_product_packing_box_vendor_product_idx
  on public.vendor_product_packing_box(vendor_product_id);

insert into public.vendor_product_packing_box (
  vendor_product_id,
  box_sequence,
  box_width_inches,
  box_depth_inches,
  box_height_inches,
  net_weight_lbs,
  gross_weight_lbs
)
select
  vp.id,
  1,
  vp.box_width_inches,
  vp.box_depth_inches,
  vp.box_height_inches,
  vp.net_weight_lbs,
  vp.gross_weight_lbs
from public.vendor_product vp
where not exists (
  select 1
  from public.vendor_product_packing_box vpb
  where vpb.vendor_product_id = vp.id
)
and (
  vp.box_width_inches is not null
  or vp.box_depth_inches is not null
  or vp.box_height_inches is not null
  or vp.net_weight_lbs is not null
  or vp.gross_weight_lbs is not null
);

drop trigger if exists set_vendor_product_packing_box_updated_at on public.vendor_product_packing_box;
create trigger set_vendor_product_packing_box_updated_at
before update on public.vendor_product_packing_box
for each row execute function public.set_updated_at();

grant select, insert, update, delete on table public.vendor_product_packing_box to service_role;
