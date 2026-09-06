create table territory_zip_coverage (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid not null references territory(id) on delete cascade,
  postal_code text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint territory_zip_coverage_postal_code_check
    check (postal_code ~ '^[0-9]{5}(-[0-9]{4})?$'),
  unique (territory_id, postal_code)
);

create index territory_zip_coverage_territory_idx on territory_zip_coverage(territory_id);
create index territory_zip_coverage_postal_code_idx on territory_zip_coverage(postal_code);

create trigger set_territory_zip_coverage_updated_at
  before update on territory_zip_coverage
  for each row execute function set_updated_at();

grant select, insert, update, delete on table territory_zip_coverage to service_role;
