begin;

alter table public.primary_showroom_enrollment
  add column if not exists minimum_annual_sales_target numeric(12,2),
  add constraint primary_showroom_minimum_annual_sales_target_nonnegative
    check (minimum_annual_sales_target is null or minimum_annual_sales_target >= 0);

alter table public.showroom_display
  add column if not exists off_floor_date date,
  add column if not exists replacement_required boolean not null default false;

create table public.primary_showroom_display_snapshot (
  id uuid primary key default gen_random_uuid(),
  primary_showroom_enrollment_id uuid not null references public.primary_showroom_enrollment(id) on delete cascade,
  snapshot_date date not null default current_date,
  display_count integer not null default 0,
  created_at timestamptz not null default now(),
  constraint primary_showroom_display_snapshot_count_nonnegative
    check (display_count >= 0)
);

create index primary_showroom_display_snapshot_enrollment_idx
  on public.primary_showroom_display_snapshot(primary_showroom_enrollment_id, snapshot_date desc);

create table public.primary_showroom_display_snapshot_item (
  id uuid primary key default gen_random_uuid(),
  primary_showroom_display_snapshot_id uuid not null references public.primary_showroom_display_snapshot(id) on delete cascade,
  showroom_display_id uuid references public.showroom_display(id) on delete set null,
  sku_snapshot text not null,
  product_name_snapshot text,
  customer_po_number_snapshot text,
  display_discount_percent_snapshot numeric(5,2),
  display_shipped_date_snapshot date,
  minimum_floor_through_date date,
  off_floor_date date,
  replacement_required boolean not null default false,
  display_status_snapshot public.showroom_display_status not null,
  created_at timestamptz not null default now(),
  constraint primary_showroom_display_snapshot_item_discount_nonnegative
    check (display_discount_percent_snapshot is null or display_discount_percent_snapshot >= 0)
);

create index primary_showroom_display_snapshot_item_snapshot_idx
  on public.primary_showroom_display_snapshot_item(primary_showroom_display_snapshot_id);

commit;
