alter type public.vendor_purchase_order_status add value if not exists 'open';

create type public.vendor_purchase_order_production_status as enum (
  'in_production',
  'complete',
  'qa_pass',
  'qa_failed',
  'exit_factory'
);

alter table public.vendor_purchase_order_line
  add column if not exists production_status public.vendor_purchase_order_production_status not null default 'in_production',
  add column if not exists production_status_changed_at timestamptz not null default now(),
  add column if not exists quantity_exited_factory numeric(14,3) not null default 0,
  add constraint vendor_po_line_exited_factory_nonnegative check (quantity_exited_factory >= 0),
  add constraint vendor_po_line_exited_factory_not_above_ordered check (quantity_exited_factory <= quantity_ordered);

create index if not exists vendor_po_line_production_status_idx
  on public.vendor_purchase_order_line(production_status);

create table if not exists public.vendor_purchase_order_line_production_event (
  id uuid primary key default gen_random_uuid(),
  vendor_purchase_order_line_id uuid not null references public.vendor_purchase_order_line(id) on delete cascade,
  production_status public.vendor_purchase_order_production_status not null,
  changed_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists vendor_po_line_production_event_line_idx
  on public.vendor_purchase_order_line_production_event(vendor_purchase_order_line_id, changed_at desc);

grant select, insert, update on table public.vendor_purchase_order_line to service_role;
grant select, insert on table public.vendor_purchase_order_line_production_event to service_role;
