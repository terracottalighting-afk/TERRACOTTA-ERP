create table if not exists sales_rep_territory_assignment (
  id uuid primary key default gen_random_uuid(),
  sales_rep_id uuid not null references sales_rep(id) on delete cascade,
  territory_id uuid not null references territory(id) on delete cascade,
  start_date date not null default current_date,
  end_date date,
  status rep_assignment_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_rep_territory_assignment_date_order check (end_date is null or end_date >= start_date)
);

create index if not exists sales_rep_territory_assignment_rep_idx on sales_rep_territory_assignment(sales_rep_id);
create index if not exists sales_rep_territory_assignment_territory_idx on sales_rep_territory_assignment(territory_id);
create unique index if not exists sales_rep_territory_assignment_active_unique
  on sales_rep_territory_assignment(sales_rep_id, territory_id)
  where status = 'active' and end_date is null;

grant select, insert, update, delete on table sales_rep_territory_assignment to service_role;

notify pgrst, 'reload schema';
