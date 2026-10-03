create table container_vendor_invoice (
  id uuid primary key default gen_random_uuid(),
  import_container_id uuid not null references import_container(id) on delete cascade,
  vendor_id uuid not null references vendor(id) on delete restrict,
  vendor_name_snapshot text not null,
  vendor_email_snapshot text,
  vendor_invoice_number text,
  invoice_date date,
  currency text not null default 'USD',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(import_container_id, vendor_id)
);

create index container_vendor_invoice_container_idx on container_vendor_invoice(import_container_id);

create table container_vendor_invoice_line (
  id uuid primary key default gen_random_uuid(),
  container_vendor_invoice_id uuid not null references container_vendor_invoice(id) on delete cascade,
  import_container_line_id uuid references import_container_line(id) on delete set null,
  line_type text not null check (line_type in ('product', 'misc')),
  sku text,
  description text not null,
  quantity numeric(14,3) not null default 1 check (quantity > 0),
  unit_price numeric(14,2) not null default 0 check (unit_price >= 0),
  notes text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint container_vendor_invoice_misc_notes_required check (line_type <> 'misc' or nullif(btrim(coalesce(notes, '')), '') is not null)
);

create index container_vendor_invoice_line_invoice_idx on container_vendor_invoice_line(container_vendor_invoice_id, sort_order);
