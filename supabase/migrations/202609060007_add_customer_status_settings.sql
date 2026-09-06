create table customer_status_setting (
  id uuid primary key default gen_random_uuid(),
  status_code text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_status_setting_code_check check (status_code ~ '^[a-z][a-z0-9_]*$')
);

create index customer_status_setting_active_idx on customer_status_setting(is_active, sort_order, name);

create trigger set_customer_status_setting_updated_at
  before update on customer_status_setting
  for each row execute function set_updated_at();

insert into customer_status_setting (status_code, name, description, sort_order)
values
  ('pending', 'Pending', 'Account is awaiting review or activation.', 10),
  ('active', 'Active', 'Account is available for normal business activity.', 20),
  ('credit_hold', 'Credit Hold', 'Account requires credit review before new activity.', 30),
  ('inactive', 'Inactive', 'Account is retained for history but is not active.', 40),
  ('obsolete', 'Obsolete', 'Legacy account retained only for history.', 50)
on conflict (status_code) do nothing;

alter table customer_account alter column status drop default;
alter table customer_account alter column status type text using status::text;
alter table customer_account alter column status set default 'pending';
alter table customer_account
  add constraint customer_account_status_setting_fkey
  foreign key (status) references customer_status_setting(status_code);

grant select, insert, update, delete on table customer_account_type to service_role;
grant select, insert, update, delete on table customer_business_type to service_role;
grant select, insert, update, delete on table customer_status_setting to service_role;
