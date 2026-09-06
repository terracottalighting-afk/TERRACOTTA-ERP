-- The final territory lookup remains territory_zip_coverage. These tables retain
-- the admin's state, county, and ZIP decisions used to produce that lookup.
create table county_reference (
  county_geoid text primary key,
  state_code text not null,
  county_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint county_reference_geoid_check check (county_geoid ~ '^[0-9]{5}$'),
  constraint county_reference_state_code_check check (state_code ~ '^[A-Z]{2}$')
);

create index county_reference_state_idx on county_reference(state_code, county_name);

create table zip_county_reference (
  postal_code text not null,
  county_geoid text not null references county_reference(county_geoid) on delete cascade,
  state_code text not null,
  residential_ratio numeric,
  business_ratio numeric,
  other_ratio numeric,
  total_ratio numeric,
  source_year integer,
  source_quarter text,
  updated_at timestamptz not null default now(),
  primary key (postal_code, county_geoid),
  constraint zip_county_reference_postal_code_check check (postal_code ~ '^[0-9]{5}$'),
  constraint zip_county_reference_state_code_check check (state_code ~ '^[A-Z]{2}$')
);

create index zip_county_reference_county_idx on zip_county_reference(county_geoid);
create index zip_county_reference_state_idx on zip_county_reference(state_code, postal_code);

create table territory_county_coverage_rule (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid not null references territory(id) on delete cascade,
  county_geoid text not null references county_reference(county_geoid),
  coverage_mode text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (territory_id, county_geoid),
  constraint territory_county_coverage_rule_mode_check check (coverage_mode in ('include', 'exclude'))
);

create index territory_county_coverage_rule_territory_idx on territory_county_coverage_rule(territory_id);

create table territory_zip_override (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid not null references territory(id) on delete cascade,
  postal_code text not null,
  coverage_mode text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (territory_id, postal_code),
  constraint territory_zip_override_postal_code_check check (postal_code ~ '^[0-9]{5}$'),
  constraint territory_zip_override_mode_check check (coverage_mode in ('include', 'exclude'))
);

create index territory_zip_override_territory_idx on territory_zip_override(territory_id);

create trigger set_county_reference_updated_at
  before update on county_reference
  for each row execute function set_updated_at();

create trigger set_zip_county_reference_updated_at
  before update on zip_county_reference
  for each row execute function set_updated_at();

create trigger set_territory_county_coverage_rule_updated_at
  before update on territory_county_coverage_rule
  for each row execute function set_updated_at();

create trigger set_territory_zip_override_updated_at
  before update on territory_zip_override
  for each row execute function set_updated_at();

-- Preserve existing manually entered ZIP coverage when this migration is applied.
insert into territory_zip_override (territory_id, postal_code, coverage_mode)
select territory_id, postal_code, 'include'
from territory_zip_coverage
on conflict (territory_id, postal_code) do nothing;

grant select, insert, update, delete on table county_reference to service_role;
grant select, insert, update, delete on table zip_county_reference to service_role;
grant select, insert, update, delete on table territory_county_coverage_rule to service_role;
grant select, insert, update, delete on table territory_zip_override to service_role;
