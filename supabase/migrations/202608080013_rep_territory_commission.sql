create type territory_status as enum ('active', 'inactive');
create type sales_rep_agency_status as enum ('active', 'inactive');
create type sales_rep_status as enum ('active', 'inactive');
create type rep_ach_payment_status as enum ('not_set', 'pending', 'active');
create type rep_assignment_status as enum ('active', 'inactive');
create type rep_coverage_role as enum ('primary', 'secondary', 'support', 'manager');
create type rep_assignment_source as enum ('territory', 'manual', 'override');
create type commission_snapshot_status as enum ('not_ready', 'commission_ready', 'paid', 'void');
create type commission_payment_status as enum ('draft', 'posted', 'voided');
create type commission_payment_type as enum ('ach', 'check', 'cash', 'other');
create type commission_ownership_rule as enum ('territory', 'manual', 'customer_location');

create table territory (
  id uuid primary key default gen_random_uuid(),
  territory_code text not null unique,
  name text not null,
  description text,
  state_codes_json jsonb not null default '[]'::jsonb,
  map_color text,
  map_sort_order integer,
  status territory_status not null default 'active',
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint territory_code_not_blank check (btrim(territory_code) <> ''),
  constraint territory_name_not_blank check (btrim(name) <> '')
);

create index territory_status_idx on territory(status);
create index territory_sort_idx on territory(map_sort_order);

create table sales_rep_agency (
  id uuid primary key default gen_random_uuid(),
  agency_code text not null unique,
  name text not null,
  main_contact_name text,
  email text,
  phone text,
  ach_payment_status rep_ach_payment_status not null default 'not_set',
  commission_default_percent numeric(5,2) not null default 0,
  customer_account_id uuid references customer_account(id) on delete set null,
  portal_access_enabled boolean not null default false,
  status sales_rep_agency_status not null default 'active',
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_rep_agency_code_not_blank check (btrim(agency_code) <> ''),
  constraint sales_rep_agency_name_not_blank check (btrim(name) <> ''),
  constraint sales_rep_agency_commission_nonnegative check (commission_default_percent >= 0)
);

create index sales_rep_agency_customer_account_idx on sales_rep_agency(customer_account_id);
create index sales_rep_agency_status_idx on sales_rep_agency(status);

alter table customer_account
  add constraint customer_account_linked_sales_rep_agency_fkey
  foreign key (linked_sales_rep_agency_id) references sales_rep_agency(id) on delete set null;

create table sales_rep (
  id uuid primary key default gen_random_uuid(),
  sales_rep_agency_id uuid not null references sales_rep_agency(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  role_title text,
  is_principal boolean not null default false,
  portal_user_id uuid references user_account(id) on delete set null,
  rep_customer_location_id uuid references customer_location(id) on delete set null,
  status sales_rep_status not null default 'active',
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sales_rep_name_not_blank check (btrim(name) <> '')
);

create index sales_rep_agency_idx on sales_rep(sales_rep_agency_id);
create index sales_rep_portal_user_idx on sales_rep(portal_user_id);
create unique index sales_rep_active_portal_user_unique
  on sales_rep(portal_user_id)
  where portal_user_id is not null and status = 'active';

alter table user_account
  add constraint user_account_rep_portal_scope_check
  check (
    user_type <> 'rep_portal'
    or portal_scope_entity_id is not null
  );

create table territory_assignment (
  id uuid primary key default gen_random_uuid(),
  territory_id uuid not null references territory(id) on delete cascade,
  sales_rep_agency_id uuid not null references sales_rep_agency(id) on delete cascade,
  start_date date not null default current_date,
  end_date date,
  status rep_assignment_status not null default 'active',
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint territory_assignment_date_order check (end_date is null or end_date >= start_date)
);

create index territory_assignment_territory_idx on territory_assignment(territory_id);
create index territory_assignment_agency_idx on territory_assignment(sales_rep_agency_id);
create unique index territory_assignment_active_unique
  on territory_assignment(territory_id, sales_rep_agency_id)
  where status = 'active' and end_date is null;

alter table customer_location
  add constraint customer_location_territory_fkey
  foreign key (territory_id) references territory(id) on delete set null;

create table customer_location_rep_assignment (
  id uuid primary key default gen_random_uuid(),
  customer_location_id uuid not null references customer_location(id) on delete cascade,
  territory_id uuid references territory(id) on delete set null,
  sales_rep_agency_id uuid not null references sales_rep_agency(id) on delete cascade,
  sales_rep_id uuid references sales_rep(id) on delete set null,
  coverage_role rep_coverage_role not null default 'primary',
  start_date date not null default current_date,
  end_date date,
  assignment_source rep_assignment_source not null default 'territory',
  status rep_assignment_status not null default 'active',
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_rep_assignment_date_order check (end_date is null or end_date >= start_date)
);

create index customer_rep_assignment_location_idx on customer_location_rep_assignment(customer_location_id);
create index customer_rep_assignment_territory_idx on customer_location_rep_assignment(territory_id);
create index customer_rep_assignment_agency_idx on customer_location_rep_assignment(sales_rep_agency_id);
create index customer_rep_assignment_rep_idx on customer_location_rep_assignment(sales_rep_id);
create unique index customer_rep_assignment_active_primary_unique
  on customer_location_rep_assignment(customer_location_id)
  where coverage_role = 'primary' and status = 'active' and end_date is null;

alter table sales_order
  add constraint sales_order_sales_rep_agency_snapshot_fkey
  foreign key (sales_rep_agency_id_snapshot) references sales_rep_agency(id) on delete set null,
  add constraint sales_order_sales_rep_snapshot_fkey
  foreign key (sales_rep_id_snapshot) references sales_rep(id) on delete set null,
  add constraint sales_order_territory_snapshot_fkey
  foreign key (territory_id_snapshot) references territory(id) on delete set null;

alter table customer_invoice
  add constraint customer_invoice_sales_rep_agency_snapshot_fkey
  foreign key (sales_rep_agency_id_snapshot) references sales_rep_agency(id) on delete set null,
  add constraint customer_invoice_sales_rep_snapshot_fkey
  foreign key (sales_rep_id_snapshot) references sales_rep(id) on delete set null,
  add constraint customer_invoice_territory_snapshot_fkey
  foreign key (territory_id_snapshot) references territory(id) on delete set null;

create table commission_snapshot (
  id uuid primary key default gen_random_uuid(),
  customer_invoice_id uuid not null references customer_invoice(id) on delete cascade,
  customer_invoice_line_id uuid references customer_invoice_line(id) on delete cascade,
  sales_order_id uuid not null references sales_order(id) on delete restrict,
  sales_order_line_id uuid references sales_order_line(id) on delete restrict,
  sales_rep_agency_id uuid not null references sales_rep_agency(id) on delete restrict,
  sales_rep_id uuid references sales_rep(id) on delete set null,
  territory_id uuid references territory(id) on delete set null,
  commission_percent numeric(5,2) not null default 0,
  commission_base_amount numeric(14,2) not null default 0,
  commission_amount numeric(14,2) generated always as (round((commission_base_amount * commission_percent / 100)::numeric, 2)) stored,
  ownership_rule commission_ownership_rule not null default 'customer_location',
  snapshot_date date not null default current_date,
  commission_status commission_snapshot_status not null default 'not_ready',
  paid_amount numeric(14,2) not null default 0,
  voided_by_user_id uuid references user_account(id),
  voided_at timestamptz,
  void_reason text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commission_snapshot_amounts_nonnegative check (
    commission_percent >= 0
    and commission_base_amount >= 0
    and paid_amount >= 0
  ),
  constraint commission_snapshot_paid_limit check (paid_amount <= round((commission_base_amount * commission_percent / 100)::numeric, 2)),
  constraint commission_snapshot_void_check check (
    commission_status <> 'void'
    or (voided_by_user_id is not null and voided_at is not null and void_reason is not null)
  )
);

create index commission_snapshot_invoice_idx on commission_snapshot(customer_invoice_id);
create index commission_snapshot_invoice_line_idx on commission_snapshot(customer_invoice_line_id);
create index commission_snapshot_order_idx on commission_snapshot(sales_order_id);
create index commission_snapshot_agency_idx on commission_snapshot(sales_rep_agency_id);
create index commission_snapshot_rep_idx on commission_snapshot(sales_rep_id);
create index commission_snapshot_territory_idx on commission_snapshot(territory_id);
create index commission_snapshot_status_idx on commission_snapshot(commission_status);

create table commission_payment (
  id uuid primary key default gen_random_uuid(),
  commission_payment_number text not null unique,
  sales_rep_agency_id uuid not null references sales_rep_agency(id) on delete restrict,
  payment_date date not null default current_date,
  payment_amount numeric(14,2) not null default 0,
  payment_type commission_payment_type not null default 'ach',
  payment_reference text,
  cash_paid_amount numeric(14,2) not null default 0,
  ar_offset_amount numeric(14,2) not null default 0,
  total_amount numeric(14,2) generated always as (cash_paid_amount + ar_offset_amount) stored,
  status commission_payment_status not null default 'draft',
  posted_by_user_id uuid references user_account(id),
  posted_at timestamptz,
  voided_by_user_id uuid references user_account(id),
  voided_at timestamptz,
  void_reason text,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commission_payment_number_not_blank check (btrim(commission_payment_number) <> ''),
  constraint commission_payment_amounts_nonnegative check (
    payment_amount >= 0
    and cash_paid_amount >= 0
    and ar_offset_amount >= 0
  ),
  constraint commission_payment_total_matches check (payment_amount = cash_paid_amount + ar_offset_amount),
  constraint commission_payment_posted_check check (status <> 'posted' or (posted_by_user_id is not null and posted_at is not null)),
  constraint commission_payment_void_check check (status <> 'voided' or (voided_by_user_id is not null and voided_at is not null and void_reason is not null))
);

create index commission_payment_agency_idx on commission_payment(sales_rep_agency_id);
create index commission_payment_status_idx on commission_payment(status);
create index commission_payment_date_idx on commission_payment(payment_date);

create table commission_payment_line (
  id uuid primary key default gen_random_uuid(),
  commission_payment_id uuid not null references commission_payment(id) on delete cascade,
  commission_snapshot_id uuid not null references commission_snapshot(id) on delete restrict,
  amount_paid numeric(14,2) not null,
  notes text,
  created_at timestamptz not null default now(),
  constraint commission_payment_line_amount_positive check (amount_paid > 0),
  unique(commission_payment_id, commission_snapshot_id)
);

create index commission_payment_line_payment_idx on commission_payment_line(commission_payment_id);
create index commission_payment_line_snapshot_idx on commission_payment_line(commission_snapshot_id);

create table commission_ar_offset (
  id uuid primary key default gen_random_uuid(),
  commission_payment_id uuid not null references commission_payment(id) on delete cascade,
  sales_rep_agency_id uuid not null references sales_rep_agency(id) on delete restrict,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  customer_invoice_id uuid not null references customer_invoice(id) on delete restrict,
  amount_applied numeric(14,2) not null,
  applied_date date not null default current_date,
  applied_by_user_id uuid references user_account(id),
  notes text,
  created_at timestamptz not null default now(),
  constraint commission_ar_offset_amount_positive check (amount_applied > 0)
);

create index commission_ar_offset_payment_idx on commission_ar_offset(commission_payment_id);
create index commission_ar_offset_agency_idx on commission_ar_offset(sales_rep_agency_id);
create index commission_ar_offset_invoice_idx on commission_ar_offset(customer_invoice_id);

create view active_customer_rep_assignments as
select
  clra.id,
  clra.customer_location_id,
  cl.customer_account_id,
  ca.name as customer_name,
  cl.location_name,
  clra.territory_id,
  t.territory_code,
  t.name as territory_name,
  clra.sales_rep_agency_id,
  sra.name as agency_name,
  clra.sales_rep_id,
  sr.name as sales_rep_name,
  clra.coverage_role,
  clra.assignment_source,
  clra.start_date
from customer_location_rep_assignment clra
join customer_location cl on cl.id = clra.customer_location_id
join customer_account ca on ca.id = cl.customer_account_id
left join territory t on t.id = clra.territory_id
join sales_rep_agency sra on sra.id = clra.sales_rep_agency_id
left join sales_rep sr on sr.id = clra.sales_rep_id
where clra.status = 'active'
  and (clra.end_date is null or clra.end_date >= current_date);

create view commission_ready_report as
select
  cs.id as commission_snapshot_id,
  cs.customer_invoice_id,
  ci.invoice_number,
  ci.invoice_date,
  ci.customer_account_id,
  ci.customer_name_snapshot,
  ci.brand_id,
  ci.brand_name_snapshot,
  cs.sales_rep_agency_id,
  sra.name as agency_name,
  cs.sales_rep_id,
  sr.name as sales_rep_name,
  cs.territory_id,
  t.name as territory_name,
  cs.commission_percent,
  cs.commission_base_amount,
  cs.commission_amount,
  cs.paid_amount,
  cs.commission_amount - cs.paid_amount as amount_available_to_pay,
  cs.commission_status
from commission_snapshot cs
join customer_invoice ci on ci.id = cs.customer_invoice_id
join sales_rep_agency sra on sra.id = cs.sales_rep_agency_id
left join sales_rep sr on sr.id = cs.sales_rep_id
left join territory t on t.id = cs.territory_id
where cs.commission_status = 'commission_ready'
  and cs.commission_amount > cs.paid_amount;

create or replace function generate_commission_payment_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('COM', 'commission_payment', 'commission_payment_number');
end;
$$;

create or replace function set_commission_payment_number()
returns trigger
language plpgsql
as $$
begin
  if new.commission_payment_number is null or new.commission_payment_number = '' then
    new.commission_payment_number := generate_commission_payment_number();
  end if;
  if new.status = 'posted' and new.posted_at is null then
    new.posted_at := now();
  end if;
  return new;
end;
$$;

create or replace function validate_sales_rep_agency_customer_account()
returns trigger
language plpgsql
as $$
declare
  account_type_record customer_account_type%rowtype;
begin
  if new.customer_account_id is null then
    return new;
  end if;

  select cat.* into account_type_record
  from customer_account ca
  join customer_account_type cat on cat.id = ca.account_type_id
  where ca.id = new.customer_account_id;

  if not found then
    raise exception 'Linked customer account % does not exist', new.customer_account_id;
  end if;

  if not account_type_record.is_rep_type then
    raise exception 'Linked customer account for sales rep agency must use a Rep account type';
  end if;

  return new;
end;
$$;

create or replace function validate_customer_rep_assignment()
returns trigger
language plpgsql
as $$
declare
  rep_agency_id uuid;
begin
  if new.sales_rep_id is not null then
    select sales_rep_agency_id into rep_agency_id from sales_rep where id = new.sales_rep_id;
    if rep_agency_id is null then
      raise exception 'Sales rep % does not exist', new.sales_rep_id;
    end if;
    if rep_agency_id <> new.sales_rep_agency_id then
      raise exception 'Sales rep must belong to the selected sales rep agency';
    end if;
  end if;
  return new;
end;
$$;

create or replace function validate_commission_snapshot()
returns trigger
language plpgsql
as $$
declare
  invoice_record customer_invoice%rowtype;
  order_record sales_order%rowtype;
  invoice_line_record customer_invoice_line%rowtype;
begin
  select * into invoice_record from customer_invoice where id = new.customer_invoice_id;
  if not found then
    raise exception 'Customer invoice % does not exist', new.customer_invoice_id;
  end if;

  select * into order_record from sales_order where id = new.sales_order_id;
  if not found then
    raise exception 'Sales order % does not exist', new.sales_order_id;
  end if;

  if invoice_record.sales_order_id <> new.sales_order_id then
    raise exception 'Commission snapshot sales order must match invoice sales order';
  end if;

  if new.customer_invoice_line_id is not null then
    select * into invoice_line_record from customer_invoice_line where id = new.customer_invoice_line_id;
    if not found or invoice_line_record.customer_invoice_id <> new.customer_invoice_id then
      raise exception 'Commission snapshot invoice line must belong to the selected invoice';
    end if;
  end if;

  if new.sales_rep_id is not null and not exists (
    select 1 from sales_rep
    where id = new.sales_rep_id
      and sales_rep_agency_id = new.sales_rep_agency_id
  ) then
    raise exception 'Commission sales rep must belong to commission agency';
  end if;

  return new;
end;
$$;

create or replace function validate_commission_payment_line()
returns trigger
language plpgsql
as $$
declare
  payment_agency_id uuid;
  snapshot_record commission_snapshot%rowtype;
  other_paid numeric(14,2);
begin
  select sales_rep_agency_id into payment_agency_id
  from commission_payment
  where id = new.commission_payment_id;

  select * into snapshot_record
  from commission_snapshot
  where id = new.commission_snapshot_id;

  if snapshot_record.id is null then
    raise exception 'Commission snapshot % does not exist', new.commission_snapshot_id;
  end if;

  if payment_agency_id <> snapshot_record.sales_rep_agency_id then
    raise exception 'Commission payment agency must match commission snapshot agency';
  end if;

  select coalesce(sum(cpl.amount_paid), 0)
  into other_paid
  from commission_payment_line cpl
  join commission_payment cp on cp.id = cpl.commission_payment_id
  where cpl.commission_snapshot_id = new.commission_snapshot_id
    and cpl.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
    and cp.status <> 'voided';

  if other_paid + new.amount_paid > snapshot_record.commission_amount then
    raise exception 'Commission payment exceeds remaining commission amount';
  end if;

  return new;
end;
$$;

create or replace function validate_commission_ar_offset()
returns trigger
language plpgsql
as $$
declare
  agency_record sales_rep_agency%rowtype;
  invoice_record customer_invoice%rowtype;
  payment_record commission_payment%rowtype;
  other_offset numeric(14,2);
begin
  select * into agency_record from sales_rep_agency where id = new.sales_rep_agency_id;
  if not found then
    raise exception 'Sales rep agency % does not exist', new.sales_rep_agency_id;
  end if;

  if agency_record.customer_account_id is null or agency_record.customer_account_id <> new.customer_account_id then
    raise exception 'Commission AR offset customer account must match agency linked Rep customer account';
  end if;

  select * into invoice_record from customer_invoice where id = new.customer_invoice_id;
  if not found then
    raise exception 'Customer invoice % does not exist', new.customer_invoice_id;
  end if;

  if invoice_record.customer_account_id <> new.customer_account_id then
    raise exception 'Commission AR offset invoice must belong to linked Rep customer account';
  end if;

  if new.amount_applied > invoice_record.balance_due then
    raise exception 'Commission AR offset cannot exceed invoice balance due';
  end if;

  select * into payment_record from commission_payment where id = new.commission_payment_id;
  if not found then
    raise exception 'Commission payment % does not exist', new.commission_payment_id;
  end if;

  if payment_record.sales_rep_agency_id <> new.sales_rep_agency_id then
    raise exception 'Commission payment agency must match offset agency';
  end if;

  select coalesce(sum(amount_applied), 0)
  into other_offset
  from commission_ar_offset
  where commission_payment_id = new.commission_payment_id
    and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid);

  if other_offset + new.amount_applied > payment_record.payment_amount then
    raise exception 'Commission AR offsets cannot exceed commission payment amount';
  end if;

  return new;
end;
$$;

create or replace function refresh_commission_snapshot_paid_amount(target_commission_snapshot_id uuid)
returns void
language plpgsql
as $$
begin
  update commission_snapshot
  set
    paid_amount = coalesce((
      select sum(cpl.amount_paid)
      from commission_payment_line cpl
      join commission_payment cp on cp.id = cpl.commission_payment_id
      where cpl.commission_snapshot_id = target_commission_snapshot_id
        and cp.status = 'posted'
    ), 0),
    commission_status = case
      when commission_status = 'void' then commission_status
      when coalesce((
        select sum(cpl.amount_paid)
        from commission_payment_line cpl
        join commission_payment cp on cp.id = cpl.commission_payment_id
        where cpl.commission_snapshot_id = target_commission_snapshot_id
          and cp.status = 'posted'
      ), 0) >= commission_amount then 'paid'::commission_snapshot_status
      when commission_status = 'paid' then 'commission_ready'::commission_snapshot_status
      else commission_status
    end,
    updated_at = now()
  where id = target_commission_snapshot_id;
end;
$$;

create or replace function refresh_commission_after_payment_line()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform refresh_commission_snapshot_paid_amount(old.commission_snapshot_id);
    return old;
  end if;

  perform refresh_commission_snapshot_paid_amount(new.commission_snapshot_id);
  if tg_op = 'UPDATE' and old.commission_snapshot_id <> new.commission_snapshot_id then
    perform refresh_commission_snapshot_paid_amount(old.commission_snapshot_id);
  end if;
  return new;
end;
$$;

create or replace function refresh_commission_snapshots_for_invoice()
returns trigger
language plpgsql
as $$
begin
  if new.commission_status = 'commission_ready' then
    update commission_snapshot
    set commission_status = 'commission_ready',
        updated_at = now()
    where customer_invoice_id = new.id
      and commission_status = 'not_ready';
  elsif new.commission_status = 'no_commission' then
    update commission_snapshot
    set commission_status = 'void',
        void_reason = coalesce(void_reason, 'Invoice marked no commission.'),
        updated_at = now()
    where customer_invoice_id = new.id
      and commission_status in ('not_ready', 'commission_ready');
  end if;
  return new;
end;
$$;

create trigger set_commission_payment_number_before_insert
  before insert on commission_payment
  for each row execute function set_commission_payment_number();

alter table commission_payment
  alter column commission_payment_number set default generate_commission_payment_number();

create trigger validate_sales_rep_agency_customer_account_before_insert_update
  before insert or update of customer_account_id
  on sales_rep_agency
  for each row execute function validate_sales_rep_agency_customer_account();

create trigger validate_customer_rep_assignment_before_insert_update
  before insert or update of sales_rep_agency_id, sales_rep_id
  on customer_location_rep_assignment
  for each row execute function validate_customer_rep_assignment();

create trigger validate_commission_snapshot_before_insert_update
  before insert or update of customer_invoice_id, customer_invoice_line_id, sales_order_id, sales_rep_agency_id, sales_rep_id
  on commission_snapshot
  for each row execute function validate_commission_snapshot();

create trigger validate_commission_payment_line_before_insert_update
  before insert or update of commission_payment_id, commission_snapshot_id, amount_paid
  on commission_payment_line
  for each row execute function validate_commission_payment_line();

create trigger refresh_commission_after_payment_line_change
  after insert or update of commission_snapshot_id, amount_paid or delete
  on commission_payment_line
  for each row execute function refresh_commission_after_payment_line();

create trigger validate_commission_ar_offset_before_insert_update
  before insert or update of commission_payment_id, sales_rep_agency_id, customer_account_id, customer_invoice_id, amount_applied
  on commission_ar_offset
  for each row execute function validate_commission_ar_offset();

create trigger refresh_commission_snapshots_after_invoice_commission_status_change
  after update of commission_status
  on customer_invoice
  for each row execute function refresh_commission_snapshots_for_invoice();

create trigger territory_updated_at
  before update on territory
  for each row execute function set_updated_at();

create trigger sales_rep_agency_updated_at
  before update on sales_rep_agency
  for each row execute function set_updated_at();

create trigger sales_rep_updated_at
  before update on sales_rep
  for each row execute function set_updated_at();

create trigger territory_assignment_updated_at
  before update on territory_assignment
  for each row execute function set_updated_at();

create trigger customer_location_rep_assignment_updated_at
  before update on customer_location_rep_assignment
  for each row execute function set_updated_at();

create trigger commission_snapshot_updated_at
  before update on commission_snapshot
  for each row execute function set_updated_at();

create trigger commission_payment_updated_at
  before update on commission_payment
  for each row execute function set_updated_at();

insert into document_number_sequence (sequence_code, document_type, prefix, next_number, padding_length)
values ('commission_payment_shared', 'commission_payment', 'COM', 1, 6)
on conflict (sequence_code) do nothing;

insert into permission (permission_code, permission_area, name, description, permission_action, is_sensitive)
values
  ('rep.view', 'rep', 'Rep View', 'View sales rep agencies, reps, territories, and customer assignments.', 'view', false),
  ('rep.manage', 'rep', 'Rep Manage', 'Create and edit sales rep agencies, reps, territories, and customer assignments.', 'manage', false),
  ('rep.territory.manage', 'rep', 'Territory Manage', 'Create and edit territories and territory assignments.', 'manage', false),
  ('commission.view', 'commission', 'Commission View', 'View commission snapshots, ready commissions, and commission history.', 'view', true),
  ('commission.snapshot.manage', 'commission', 'Commission Snapshot Manage', 'Create and adjust commission snapshots.', 'manage', true),
  ('commission.payment.create', 'commission', 'Commission Payment Create', 'Create commission payments.', 'create', true),
  ('commission.payment.post', 'commission', 'Commission Payment Post', 'Post commission payments.', 'post', true),
  ('commission.payment.void', 'commission', 'Commission Payment Void', 'Void commission payments.', 'void', true),
  ('commission.ar_offset.create', 'commission', 'Commission AR Offset Create', 'Apply earned commission against linked Rep customer invoices.', 'create', true)
on conflict (permission_code) do update
set
  permission_area = excluded.permission_area,
  name = excluded.name,
  description = excluded.description,
  permission_action = excluded.permission_action,
  is_sensitive = excluded.is_sensitive;

insert into report_definition (
  report_code,
  name,
  report_type,
  description,
  default_filters_json,
  available_filters_json,
  available_columns_json,
  default_columns_json,
  supported_output_formats,
  supports_brand_filter,
  permission_code,
  is_external_safe
)
values
  (
    'commission.ready',
    'Commission Ready Report',
    'commission',
    'Commission snapshots that are ready to be paid by agency, rep, territory, customer, invoice, and brand.',
    '{"status":"commission_ready"}',
    '{"agency":true,"rep":true,"territory":true,"brand":true,"period":true}',
    '["agency","rep","territory","invoice_number","customer","brand","commission_base_amount","commission_percent","commission_amount","paid_amount","amount_available_to_pay"]',
    '["agency","rep","territory","invoice_number","customer","brand","commission_amount","amount_available_to_pay"]',
    array['screen','pdf','xlsx']::report_output_format[],
    true,
    'commission.view',
    false
  )
on conflict (report_code) do nothing;

insert into dashboard_widget_definition (dashboard_definition_id, widget_code, name, widget_type, display_order, data_source_name, drilldown_report_definition_id)
select dd.id, 'commission_ready', 'Commission Ready', 'table'::dashboard_widget_type, 10, 'commission_ready_report', rd.id
from dashboard_definition dd
left join report_definition rd on rd.report_code = 'commission.ready'
where dd.dashboard_code = 'reps_commissions'
on conflict (dashboard_definition_id, widget_code) do nothing;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'::permission_level
from role r
join permission p on p.permission_area in ('rep', 'commission')
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in ('rep.view', 'commission.view') then 'view'::permission_level
    when p.permission_code in ('rep.manage', 'rep.territory.manage', 'commission.snapshot.manage', 'commission.payment.create') then 'edit'::permission_level
    else 'none'::permission_level
  end
from role r
join permission p on p.permission_area in ('rep', 'commission')
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;
