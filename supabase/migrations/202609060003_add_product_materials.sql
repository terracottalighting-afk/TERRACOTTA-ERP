create table material (
  id uuid primary key default gen_random_uuid(),
  material_name text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_material (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references product(id) on delete cascade,
  material_id uuid not null references material(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, material_id)
);

create index product_material_product_idx on product_material(product_id);
create index product_material_material_idx on product_material(material_id);

create trigger set_material_updated_at
  before update on material
  for each row execute function set_updated_at();

create trigger set_product_material_updated_at
  before update on product_material
  for each row execute function set_updated_at();

grant select, insert, update, delete on table material, product_material to service_role;
