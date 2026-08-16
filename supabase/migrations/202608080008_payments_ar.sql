create type customer_payment_method as enum ('check', 'ach', 'wire', 'credit_card', 'cash', 'other');
create type customer_payment_status as enum ('draft', 'posted', 'partially_applied', 'fully_applied', 'voided');
create type payment_application_status as enum ('posted', 'reversed');
create type ar_adjustment_type as enum ('waive', 'write_off', 'rounding', 'dispute', 'other');
create type ar_adjustment_status as enum ('draft', 'posted', 'reversed');
create type customer_statement_type as enum ('open_only', 'full_activity');
create type customer_statement_brand_scope as enum ('all_brands', 'single_brand');
create type customer_statement_line_type as enum ('invoice', 'payment', 'credit_memo', 'adjustment', 'unapplied_payment');
create type payment_reminder_status as enum ('draft', 'sent', 'failed');

create table customer_payment (
  id uuid primary key default gen_random_uuid(),
  payment_number text not null unique,
  brand_id uuid not null references brand(id) on delete restrict,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  payment_date date not null default current_date,
  payment_method customer_payment_method not null,
  reference_number text,
  amount_received numeric(14,2) not null,
  amount_applied numeric(14,2) not null default 0,
  amount_unapplied numeric(14,2) generated always as (amount_received - amount_applied) stored,
  currency text not null default 'USD',
  deposit_account text,
  memo text,
  status customer_payment_status not null default 'draft',
  posted_at timestamptz,
  posted_by_user_id uuid references user_account(id),
  voided_at timestamptz,
  voided_by_user_id uuid references user_account(id),
  void_reason text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customer_payment_number_not_blank check (btrim(payment_number) <> ''),
  constraint customer_payment_amounts_check check (amount_received > 0 and amount_applied >= 0 and amount_applied <= amount_received),
  constraint customer_payment_currency_code_check check (currency ~ '^[A-Z]{3}$'),
  constraint customer_payment_posted_fields_check
    check (status not in ('posted', 'partially_applied', 'fully_applied') or (posted_at is not null and posted_by_user_id is not null)),
  constraint customer_payment_void_fields_check
    check (status <> 'voided' or (voided_at is not null and voided_by_user_id is not null and void_reason is not null))
);

create index customer_payment_brand_idx on customer_payment(brand_id);
create index customer_payment_customer_idx on customer_payment(customer_account_id);
create index customer_payment_date_idx on customer_payment(payment_date);
create index customer_payment_status_idx on customer_payment(status);
create index customer_payment_unapplied_idx on customer_payment(brand_id, customer_account_id) where status <> 'voided';

create table customer_payment_application (
  id uuid primary key default gen_random_uuid(),
  customer_payment_id uuid not null references customer_payment(id) on delete restrict,
  customer_invoice_id uuid not null references customer_invoice(id) on delete restrict,
  amount_applied numeric(14,2) not null default 0,
  line_waive_amount numeric(14,2) not null default 0,
  applied_date date not null default current_date,
  applied_by_user_id uuid references user_account(id),
  application_status payment_application_status not null default 'posted',
  reversal_of_application_id uuid references customer_payment_application(id) on delete set null,
  reversed_at timestamptz,
  reversed_by_user_id uuid references user_account(id),
  notes text,
  created_at timestamptz not null default now(),
  constraint customer_payment_application_amount_check
    check (amount_applied >= 0 and line_waive_amount >= 0 and (amount_applied + line_waive_amount) > 0),
  constraint customer_payment_application_reversal_fields_check
    check (application_status <> 'reversed' or (reversed_at is not null and reversed_by_user_id is not null))
);

create index customer_payment_application_payment_idx on customer_payment_application(customer_payment_id);
create index customer_payment_application_invoice_idx on customer_payment_application(customer_invoice_id);
create index customer_payment_application_status_idx on customer_payment_application(application_status);

create table ar_adjustment (
  id uuid primary key default gen_random_uuid(),
  adjustment_number text not null unique,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  brand_id uuid not null references brand(id) on delete restrict,
  customer_invoice_id uuid not null references customer_invoice(id) on delete restrict,
  customer_payment_application_id uuid references customer_payment_application(id) on delete set null,
  adjustment_type ar_adjustment_type not null,
  reason_code text not null,
  amount numeric(14,2) not null,
  adjustment_date date not null default current_date,
  approved_by_user_id uuid references user_account(id),
  created_by_user_id uuid references user_account(id),
  reversed_adjustment_id uuid references ar_adjustment(id) on delete set null,
  reversed_at timestamptz,
  reversed_by_user_id uuid references user_account(id),
  notes text,
  status ar_adjustment_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ar_adjustment_number_not_blank check (btrim(adjustment_number) <> ''),
  constraint ar_adjustment_reason_not_blank check (btrim(reason_code) <> ''),
  constraint ar_adjustment_amount_positive check (amount > 0),
  constraint ar_adjustment_posted_fields_check
    check (status <> 'posted' or created_by_user_id is not null),
  constraint ar_adjustment_reversed_fields_check
    check (status <> 'reversed' or (reversed_at is not null and reversed_by_user_id is not null))
);

create index ar_adjustment_customer_idx on ar_adjustment(customer_account_id);
create index ar_adjustment_brand_idx on ar_adjustment(brand_id);
create index ar_adjustment_invoice_idx on ar_adjustment(customer_invoice_id);
create index ar_adjustment_status_idx on ar_adjustment(status);
create index ar_adjustment_date_idx on ar_adjustment(adjustment_date);

create table customer_statement (
  id uuid primary key default gen_random_uuid(),
  statement_number text not null unique,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  statement_date date not null default current_date,
  date_from date,
  date_to date,
  statement_type customer_statement_type not null default 'open_only',
  brand_scope customer_statement_brand_scope not null default 'all_brands',
  brand_id uuid references brand(id) on delete restrict,
  total_open_balance numeric(14,2) not null default 0,
  total_current_balance numeric(14,2) not null default 0,
  total_past_due_balance numeric(14,2) not null default 0,
  brand_subtotals_json jsonb,
  last_generated_document_event_id uuid references generated_document_event(id) on delete set null,
  email_send_history_id uuid references email_send_history(id) on delete set null,
  created_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  constraint customer_statement_number_not_blank check (btrim(statement_number) <> ''),
  constraint customer_statement_date_range_check check (date_to is null or date_from is null or date_to >= date_from),
  constraint customer_statement_single_brand_check
    check ((brand_scope = 'single_brand' and brand_id is not null) or (brand_scope = 'all_brands' and brand_id is null)),
  constraint customer_statement_amounts_nonnegative check (
    total_open_balance >= 0
    and total_current_balance >= 0
    and total_past_due_balance >= 0
  )
);

create index customer_statement_customer_idx on customer_statement(customer_account_id);
create index customer_statement_date_idx on customer_statement(statement_date);
create index customer_statement_brand_idx on customer_statement(brand_id);

create table customer_statement_line (
  id uuid primary key default gen_random_uuid(),
  customer_statement_id uuid not null references customer_statement(id) on delete cascade,
  line_type customer_statement_line_type not null,
  brand_id uuid references brand(id) on delete restrict,
  source_entity_type text not null,
  source_entity_id uuid not null,
  transaction_date date not null,
  due_date date,
  description text not null,
  debit_amount numeric(14,2) not null default 0,
  credit_amount numeric(14,2) not null default 0,
  balance_amount numeric(14,2) not null default 0,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  constraint customer_statement_line_amounts_nonnegative check (
    debit_amount >= 0
    and credit_amount >= 0
  )
);

create index customer_statement_line_statement_idx on customer_statement_line(customer_statement_id);
create index customer_statement_line_source_idx on customer_statement_line(source_entity_type, source_entity_id);
create index customer_statement_line_brand_idx on customer_statement_line(brand_id);

create table payment_reminder (
  id uuid primary key default gen_random_uuid(),
  reminder_number text not null unique,
  brand_id uuid not null references brand(id) on delete restrict,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  reminder_date date not null default current_date,
  invoice_ids_json jsonb not null default '[]',
  total_open_amount numeric(14,2) not null default 0,
  total_overdue_amount numeric(14,2) not null default 0,
  email_send_history_id uuid references email_send_history(id) on delete set null,
  status payment_reminder_status not null default 'draft',
  sent_by_user_id uuid references user_account(id),
  sent_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  constraint payment_reminder_number_not_blank check (btrim(reminder_number) <> ''),
  constraint payment_reminder_amounts_nonnegative check (total_open_amount >= 0 and total_overdue_amount >= 0),
  constraint payment_reminder_sent_fields_check
    check (status <> 'sent' or (sent_by_user_id is not null and sent_at is not null))
);

create index payment_reminder_brand_customer_idx on payment_reminder(brand_id, customer_account_id);
create index payment_reminder_status_idx on payment_reminder(status);

create view ar_aging_open_items as
select
  'invoice'::text as row_type,
  ci.id as source_entity_id,
  ci.customer_account_id,
  ci.brand_id,
  ci.invoice_number as reference_number,
  ci.invoice_date as transaction_date,
  ci.due_date,
  ci.balance_due,
  case
    when ci.due_date is null or ci.due_date >= current_date then 'current'
    when current_date - ci.due_date between 1 and 30 then '1_30'
    when current_date - ci.due_date between 31 and 60 then '31_60'
    when current_date - ci.due_date between 61 and 90 then '61_90'
    else 'over_90'
  end as aging_bucket,
  case
    when ci.due_date is null then 0
    else greatest(current_date - ci.due_date, 0)
  end as days_past_due,
  ci.payment_terms_snapshot,
  ci.sales_rep_agency_id_snapshot,
  ci.sales_rep_id_snapshot,
  ci.territory_id_snapshot
from customer_invoice ci
where ci.invoice_status not in ('void', 'closed')
  and ci.payment_status <> 'paid'
  and ci.balance_due > 0
union all
select
  'unapplied_payment'::text as row_type,
  cp.id as source_entity_id,
  cp.customer_account_id,
  cp.brand_id,
  cp.payment_number as reference_number,
  cp.payment_date as transaction_date,
  null::date as due_date,
  -cp.amount_unapplied as balance_due,
  'credit_unapplied'::text as aging_bucket,
  0 as days_past_due,
  null::text as payment_terms_snapshot,
  null::uuid as sales_rep_agency_id_snapshot,
  null::uuid as sales_rep_id_snapshot,
  null::uuid as territory_id_snapshot
from customer_payment cp
where cp.status in ('posted', 'partially_applied')
  and cp.amount_unapplied > 0;

create or replace function generate_payment_number_for_brand(target_brand_id uuid)
returns text
language plpgsql
as $$
declare
  brand_code_value text;
  candidate text;
begin
  select brand_code into brand_code_value from brand where id = target_brand_id;
  if brand_code_value is null then
    raise exception 'Brand % does not exist', target_brand_id;
  end if;

  loop
    candidate := brand_code_value || '-PAY' || to_char(now(), 'YYYYMMDD') || '-' || lpad(floor(random() * 10000)::integer::text, 4, '0');
    exit when not exists (select 1 from customer_payment where payment_number = candidate);
  end loop;

  return candidate;
end;
$$;

create or replace function generate_statement_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('ST', 'customer_statement', 'statement_number');
end;
$$;

create or replace function generate_ar_adjustment_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('ARADJ', 'ar_adjustment', 'adjustment_number');
end;
$$;

create or replace function generate_payment_reminder_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('REM', 'payment_reminder', 'reminder_number');
end;
$$;

create or replace function set_customer_payment_number()
returns trigger
language plpgsql
as $$
begin
  if new.payment_number is null or new.payment_number = '' then
    new.payment_number := generate_payment_number_for_brand(new.brand_id);
  end if;
  return new;
end;
$$;

create or replace function set_ar_adjustment_number()
returns trigger
language plpgsql
as $$
begin
  if new.adjustment_number is null or new.adjustment_number = '' then
    new.adjustment_number := generate_ar_adjustment_number();
  end if;
  return new;
end;
$$;

create or replace function set_statement_number()
returns trigger
language plpgsql
as $$
begin
  if new.statement_number is null or new.statement_number = '' then
    new.statement_number := generate_statement_number();
  end if;
  return new;
end;
$$;

create or replace function set_payment_reminder_number()
returns trigger
language plpgsql
as $$
begin
  if new.reminder_number is null or new.reminder_number = '' then
    new.reminder_number := generate_payment_reminder_number();
  end if;
  return new;
end;
$$;

create or replace function validate_payment_application_brand_customer()
returns trigger
language plpgsql
as $$
declare
  payment_record customer_payment%rowtype;
  invoice_record customer_invoice%rowtype;
begin
  select * into payment_record from customer_payment where id = new.customer_payment_id;
  select * into invoice_record from customer_invoice where id = new.customer_invoice_id;

  if payment_record.brand_id <> invoice_record.brand_id then
    raise exception 'Payment and invoice brand must match';
  end if;

  if payment_record.customer_account_id <> invoice_record.customer_account_id then
    raise exception 'Payment and invoice customer account must match';
  end if;

  if new.amount_applied > invoice_record.balance_due then
    raise exception 'Payment application cannot exceed invoice balance due';
  end if;

  return new;
end;
$$;

create or replace function validate_ar_adjustment_brand_customer()
returns trigger
language plpgsql
as $$
declare
  invoice_record customer_invoice%rowtype;
begin
  select * into invoice_record from customer_invoice where id = new.customer_invoice_id;

  if new.brand_id <> invoice_record.brand_id then
    raise exception 'AR adjustment brand must match invoice brand';
  end if;

  if new.customer_account_id <> invoice_record.customer_account_id then
    raise exception 'AR adjustment customer account must match invoice customer account';
  end if;

  if new.amount > invoice_record.balance_due then
    raise exception 'AR adjustment cannot exceed invoice balance due';
  end if;

  return new;
end;
$$;

create or replace function refresh_payment_amount_applied(target_payment_id uuid)
returns void
language plpgsql
as $$
begin
  update customer_payment
  set amount_applied = coalesce((
    select sum(amount_applied)
    from customer_payment_application
    where customer_payment_id = target_payment_id
      and application_status = 'posted'
  ), 0),
  status = case
    when status = 'voided' then status
    when coalesce((
      select sum(amount_applied)
      from customer_payment_application
      where customer_payment_id = target_payment_id
        and application_status = 'posted'
    ), 0) = 0 then 'posted'::customer_payment_status
    when coalesce((
      select sum(amount_applied)
      from customer_payment_application
      where customer_payment_id = target_payment_id
        and application_status = 'posted'
    ), 0) < amount_received then 'partially_applied'::customer_payment_status
    else 'fully_applied'::customer_payment_status
  end,
  updated_at = now()
  where id = target_payment_id;
end;
$$;

create or replace function refresh_invoice_ar_totals(target_invoice_id uuid)
returns void
language plpgsql
as $$
begin
  update customer_invoice
  set
    payment_applied_amount = coalesce((
      select sum(amount_applied)
      from customer_payment_application
      where customer_invoice_id = target_invoice_id
        and application_status = 'posted'
    ), 0),
    waived_amount = coalesce((
      select sum(amount)
      from ar_adjustment
      where customer_invoice_id = target_invoice_id
        and status = 'posted'
    ), 0),
    payment_status = case
      when total_amount - coalesce((
        select sum(amount_applied)
        from customer_payment_application
        where customer_invoice_id = target_invoice_id
          and application_status = 'posted'
      ), 0) - credit_applied_amount - coalesce((
        select sum(amount)
        from ar_adjustment
        where customer_invoice_id = target_invoice_id
          and status = 'posted'
      ), 0) <= 0 then 'paid'::customer_invoice_payment_status
      when coalesce((
        select sum(amount_applied)
        from customer_payment_application
        where customer_invoice_id = target_invoice_id
          and application_status = 'posted'
      ), 0) + credit_applied_amount + coalesce((
        select sum(amount)
        from ar_adjustment
        where customer_invoice_id = target_invoice_id
          and status = 'posted'
      ), 0) > 0 then 'partially_paid'::customer_invoice_payment_status
      else 'unpaid'::customer_invoice_payment_status
    end,
    invoice_status = case
      when invoice_status = 'void' then invoice_status
      when total_amount - coalesce((
        select sum(amount_applied)
        from customer_payment_application
        where customer_invoice_id = target_invoice_id
          and application_status = 'posted'
      ), 0) - credit_applied_amount - coalesce((
        select sum(amount)
        from ar_adjustment
        where customer_invoice_id = target_invoice_id
          and status = 'posted'
      ), 0) <= 0 then 'closed'::customer_invoice_status
      else 'open'::customer_invoice_status
    end,
    commission_status = case
      when not commission_payable then 'no_commission'::commission_status
      when total_amount - coalesce((
        select sum(amount_applied)
        from customer_payment_application
        where customer_invoice_id = target_invoice_id
          and application_status = 'posted'
      ), 0) - credit_applied_amount - coalesce((
        select sum(amount)
        from ar_adjustment
        where customer_invoice_id = target_invoice_id
          and status = 'posted'
      ), 0) <= 0 then 'commission_ready'::commission_status
      else 'not_ready'::commission_status
    end,
    updated_at = now()
  where id = target_invoice_id;
end;
$$;

create or replace function refresh_ar_after_payment_application()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform refresh_payment_amount_applied(old.customer_payment_id);
    perform refresh_invoice_ar_totals(old.customer_invoice_id);
    return old;
  end if;

  perform refresh_payment_amount_applied(new.customer_payment_id);
  perform refresh_invoice_ar_totals(new.customer_invoice_id);

  if tg_op = 'UPDATE' then
    if old.customer_payment_id <> new.customer_payment_id then
      perform refresh_payment_amount_applied(old.customer_payment_id);
    end if;
    if old.customer_invoice_id <> new.customer_invoice_id then
      perform refresh_invoice_ar_totals(old.customer_invoice_id);
    end if;
  end if;

  return new;
end;
$$;

create or replace function refresh_ar_after_adjustment()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform refresh_invoice_ar_totals(old.customer_invoice_id);
    return old;
  end if;

  perform refresh_invoice_ar_totals(new.customer_invoice_id);
  if tg_op = 'UPDATE' and old.customer_invoice_id <> new.customer_invoice_id then
    perform refresh_invoice_ar_totals(old.customer_invoice_id);
  end if;

  return new;
end;
$$;

create trigger set_customer_payment_number_before_insert
  before insert on customer_payment
  for each row execute function set_customer_payment_number();

create trigger validate_payment_application_before_insert_update
  before insert or update of customer_payment_id, customer_invoice_id, amount_applied
  on customer_payment_application
  for each row execute function validate_payment_application_brand_customer();

create trigger refresh_ar_after_payment_application_change
  after insert or update of amount_applied, application_status, customer_payment_id, customer_invoice_id or delete
  on customer_payment_application
  for each row execute function refresh_ar_after_payment_application();

create trigger set_ar_adjustment_number_before_insert
  before insert on ar_adjustment
  for each row execute function set_ar_adjustment_number();

create trigger validate_ar_adjustment_before_insert_update
  before insert or update of brand_id, customer_account_id, customer_invoice_id, amount
  on ar_adjustment
  for each row execute function validate_ar_adjustment_brand_customer();

create trigger refresh_ar_after_adjustment_change
  after insert or update of amount, status, customer_invoice_id or delete
  on ar_adjustment
  for each row execute function refresh_ar_after_adjustment();

create trigger set_statement_number_before_insert
  before insert on customer_statement
  for each row execute function set_statement_number();

create trigger set_payment_reminder_number_before_insert
  before insert on payment_reminder
  for each row execute function set_payment_reminder_number();

create trigger set_customer_payment_updated_at
  before update on customer_payment
  for each row execute function set_updated_at();

create trigger set_ar_adjustment_updated_at
  before update on ar_adjustment
  for each row execute function set_updated_at();

insert into document_number_sequence (sequence_code, document_type, brand_id, prefix, next_number, padding_length)
select 'payment_' || lower(brand_code), 'customer_payment', id, brand_code || '-PAY', 1, 6
from brand
on conflict (sequence_code) do update
set document_type = excluded.document_type,
    brand_id = excluded.brand_id,
    prefix = excluded.prefix,
    padding_length = excluded.padding_length,
    updated_at = now();

insert into document_number_sequence (sequence_code, document_type, prefix, next_number, padding_length)
values
  ('customer_statement_shared', 'customer_statement', 'ST', 1, 6),
  ('ar_adjustment_shared', 'ar_adjustment', 'ARADJ', 1, 6),
  ('payment_reminder_shared', 'payment_reminder', 'REM', 1, 6)
on conflict (sequence_code) do update
set document_type = excluded.document_type,
    prefix = excluded.prefix,
    padding_length = excluded.padding_length,
    updated_at = now();

insert into permission (permission_code, permission_area, name, description)
values
  ('ar.financial_dashboard.view', 'ar', 'Financial Dashboard View', 'View company and customer financial dashboards.'),
  ('ar.open_invoices.view', 'ar', 'Open Invoices View', 'View open invoice list and AR balances.'),
  ('ar.payment.enter', 'ar', 'Enter Payment', 'Create customer payment records.'),
  ('ar.payment.post', 'ar', 'Post Payment', 'Post customer payments and applications.'),
  ('ar.payment_application.reverse', 'ar', 'Reverse Payment Application', 'Reverse posted payment application rows.'),
  ('ar.credit_memo.apply', 'ar', 'Apply Credit Memo', 'Apply posted credit memos to invoices.'),
  ('ar.credit_memo_application.reverse', 'ar', 'Reverse Credit Application', 'Reverse credit memo applications.'),
  ('ar.adjustment.enter', 'ar', 'Enter Waive/Write-Off', 'Enter AR waive, write-off, rounding, dispute, or other adjustments.'),
  ('ar.adjustment.approve', 'ar', 'Approve Waive/Write-Off', 'Approve AR adjustments if approval thresholds are added later.'),
  ('ar.adjustment.reverse', 'ar', 'Reverse AR Adjustment', 'Reverse posted AR adjustments.'),
  ('ar.aging.view', 'ar', 'AR Aging View', 'View AR aging reports.'),
  ('ar.statement.generate', 'ar', 'Generate Statement', 'Generate customer statements.'),
  ('ar.statement.email', 'ar', 'Email Statement', 'Email customer statements.'),
  ('ar.payment_reminder.send', 'ar', 'Send Payment Reminder', 'Send brand-specific payment reminder emails.'),
  ('ar.unapplied_payments.view', 'ar', 'View Unapplied Payments', 'View unapplied customer payment balances.'),
  ('ar.unapplied_payments.apply', 'ar', 'Apply Unapplied Payment', 'Manually apply unapplied payments to invoices.')
on conflict (permission_code) do update
set permission_area = excluded.permission_area,
    name = excluded.name,
    description = excluded.description;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'::permission_level
from role r
join permission p on p.permission_area = 'ar'
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in (
      'ar.financial_dashboard.view',
      'ar.open_invoices.view',
      'ar.aging.view',
      'ar.statement.generate',
      'ar.statement.email',
      'ar.unapplied_payments.view'
    ) then 'view'::permission_level
    else 'none'::permission_level
  end
from role r
join permission p on p.permission_area = 'ar'
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;
