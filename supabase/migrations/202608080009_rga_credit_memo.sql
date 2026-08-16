create type credit_memo_status as enum ('draft', 'pending_approval', 'posted', 'partially_applied', 'fully_applied', 'void');
create type credit_memo_reason_code as enum ('return', 'defect', 'freight', 'adjustment', 'other');
create type credit_memo_application_source_type as enum ('payment_entry', 'manual_apply', 'statement_adjustment');
create type rga_reason_category as enum ('buy_remorse', 'product_defect', 'freight_damage', 'wrong_item', 'shipping_error', 'other');
create type rga_resolution_type as enum ('credit', 'replacement');
create type rga_status as enum ('draft', 'pending_review', 'authorized', 'awaiting_return', 'received', 'awaiting_credit_memo', 'resolved', 'closed', 'cancelled', 'rejected');
create type rga_line_status as enum ('open', 'authorized', 'awaiting_return', 'received', 'credited', 'replaced', 'closed', 'cancelled');
create type rga_defective_item_disposition as enum ('return_back', 'field_demolish', 'customer_keeps', 'hold');
create type rga_inventory_disposition as enum ('restock', 'hold', 'damaged', 'scrap', 'vendor_claim');
create type rga_replacement_order_status as enum ('pending', 'ordered', 'partially_shipped', 'shipped', 'closed', 'cancelled');
create type rga_replacement_freight_policy as enum ('company_paid', 'customer_paid', 'no_charge', 'case_by_case');

create table rga_policy (
  id uuid primary key default gen_random_uuid(),
  policy_name text not null,
  rga_reason_category rga_reason_category not null,
  requires_customer_images boolean not null default false,
  default_customer_pays_return_freight boolean not null default false,
  default_restocking_fee_percent numeric(5,2) not null default 0,
  allow_restocking_fee_override boolean not null default true,
  requires_return boolean not null default true,
  requires_inspection_before_credit boolean not null default true,
  default_return_inventory_condition inventory_condition not null default 'hold',
  is_active boolean not null default true,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rga_policy_name_not_blank check (btrim(policy_name) <> ''),
  constraint rga_policy_restocking_fee_nonnegative check (default_restocking_fee_percent >= 0)
);

create unique index rga_policy_active_reason_unique
  on rga_policy(rga_reason_category)
  where is_active;

create table rga (
  id uuid primary key default gen_random_uuid(),
  rga_number text not null unique,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  customer_location_id uuid references customer_location(id) on delete restrict,
  sales_order_id uuid references sales_order(id) on delete restrict,
  original_customer_po_number_snapshot text,
  customer_invoice_id uuid references customer_invoice(id) on delete restrict,
  request_date date not null default current_date,
  authorized_date date,
  received_date date,
  closed_date date,
  rga_reason_category rga_reason_category not null,
  status rga_status not null default 'draft',
  requested_resolution_type rga_resolution_type not null,
  approved_resolution_type rga_resolution_type,
  defective_item_disposition rga_defective_item_disposition not null default 'hold',
  customer_pays_return_freight boolean not null default false,
  requires_customer_images boolean not null default false,
  customer_images_received boolean not null default false,
  return_required boolean not null default true,
  issue_description text,
  resolution_notes text,
  customer_name_snapshot text not null,
  customer_account_number_snapshot text,
  legacy_account_id_snapshot text,
  order_contact_snapshot_json jsonb,
  approval_email_to_snapshot text,
  approval_sheet_document_event_id uuid references generated_document_event(id) on delete set null,
  approval_email_send_history_id uuid references email_send_history(id) on delete set null,
  created_by_user_id uuid references user_account(id),
  authorized_by_user_id uuid references user_account(id),
  rejected_by_user_id uuid references user_account(id),
  cancelled_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  rejected_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rga_number_not_blank check (btrim(rga_number) <> ''),
  constraint rga_approved_resolution_matches_requested check (
    approved_resolution_type is null or approved_resolution_type = requested_resolution_type
  ),
  constraint rga_authorized_fields_check check (
    status not in ('authorized', 'awaiting_return', 'received', 'awaiting_credit_memo', 'resolved', 'closed')
    or (authorized_by_user_id is not null and authorized_date is not null and approved_resolution_type is not null)
  ),
  constraint rga_rejected_fields_check check (status <> 'rejected' or (rejected_by_user_id is not null and rejected_at is not null)),
  constraint rga_cancelled_fields_check check (status <> 'cancelled' or (cancelled_by_user_id is not null and cancelled_at is not null)),
  constraint rga_closed_date_check check (status <> 'closed' or closed_date is not null)
);

create index rga_customer_idx on rga(customer_account_id);
create index rga_location_idx on rga(customer_location_id);
create index rga_sales_order_idx on rga(sales_order_id);
create index rga_invoice_idx on rga(customer_invoice_id);
create index rga_status_idx on rga(status);
create index rga_request_date_idx on rga(request_date);

alter table sales_order
  add constraint sales_order_rga_fkey
  foreign key (rga_id) references rga(id) on delete set null;

create table rga_line (
  id uuid primary key default gen_random_uuid(),
  rga_id uuid not null references rga(id) on delete cascade,
  customer_invoice_line_id uuid references customer_invoice_line(id) on delete restrict,
  sales_order_line_id uuid not null references sales_order_line(id) on delete restrict,
  brand_id_snapshot uuid not null references brand(id),
  brand_name_snapshot text not null,
  product_id uuid not null references product(id) on delete restrict,
  product_sku_snapshot text not null,
  product_name_snapshot text not null,
  quantity_shipped_snapshot numeric(14,3) not null,
  previous_rga_quantity_snapshot numeric(14,3) not null default 0,
  available_rga_quantity_snapshot numeric(14,3) not null,
  quantity_requested numeric(14,3) not null,
  quantity_authorized numeric(14,3) not null default 0,
  quantity_received numeric(14,3) not null default 0,
  quantity_credited numeric(14,3) not null default 0,
  quantity_replaced numeric(14,3) not null default 0,
  return_reason text,
  defect_description text,
  received_condition text,
  inventory_disposition rga_inventory_disposition not null default 'hold',
  received_inventory_condition inventory_condition not null default 'hold',
  field_demolish_required boolean not null default false,
  field_demolish_proof_file_id uuid references attachment(id) on delete set null,
  credit_required boolean not null default false,
  replacement_required boolean not null default false,
  return_inventory_movement_id uuid references inventory_movement(id) on delete set null,
  status rga_line_status not null default 'open',
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rga_line_quantities_positive check (
    quantity_requested > 0
    and quantity_authorized >= 0
    and quantity_received >= 0
    and quantity_credited >= 0
    and quantity_replaced >= 0
  ),
  constraint rga_line_quantity_limits check (
    quantity_requested <= available_rga_quantity_snapshot
    and quantity_authorized <= quantity_requested
    and quantity_received <= quantity_authorized
    and quantity_credited <= quantity_authorized
    and quantity_replaced <= quantity_authorized
  ),
  constraint rga_line_solution_flags_check check (
    (credit_required and not replacement_required)
    or (replacement_required and not credit_required)
    or (not credit_required and not replacement_required)
  ),
  constraint rga_line_field_demolish_proof_optional check (
    true
  )
);

create index rga_line_rga_idx on rga_line(rga_id);
create index rga_line_sales_order_line_idx on rga_line(sales_order_line_id);
create index rga_line_invoice_line_idx on rga_line(customer_invoice_line_id);
create index rga_line_product_idx on rga_line(product_id);
create index rga_line_brand_idx on rga_line(brand_id_snapshot);
create index rga_line_status_idx on rga_line(status);

create table rga_replacement_order (
  id uuid primary key default gen_random_uuid(),
  rga_id uuid not null references rga(id) on delete cascade,
  sales_order_id uuid not null references sales_order(id) on delete restrict,
  packing_list_id uuid references packing_list(id) on delete set null,
  replacement_order_number_snapshot text,
  replacement_customer_po_number_snapshot text,
  tracking_number text,
  shipped_date date,
  replacement_reason text,
  freight_charge_policy rga_replacement_freight_policy not null default 'no_charge',
  status rga_replacement_order_status not null default 'pending',
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(rga_id, sales_order_id)
);

create index rga_replacement_order_rga_idx on rga_replacement_order(rga_id);
create index rga_replacement_order_sales_order_idx on rga_replacement_order(sales_order_id);
create index rga_replacement_order_status_idx on rga_replacement_order(status);

create table rga_status_history (
  id uuid primary key default gen_random_uuid(),
  rga_id uuid not null references rga(id) on delete cascade,
  old_status rga_status,
  new_status rga_status not null,
  changed_by_user_id uuid references user_account(id),
  changed_at timestamptz not null default now(),
  reason text,
  notes text
);

create index rga_status_history_rga_idx on rga_status_history(rga_id);
create index rga_status_history_changed_at_idx on rga_status_history(changed_at);

create table credit_memo (
  id uuid primary key default gen_random_uuid(),
  credit_memo_number text not null,
  brand_id uuid not null references brand(id) on delete restrict,
  customer_account_id uuid not null references customer_account(id) on delete restrict,
  rga_id uuid references rga(id) on delete set null,
  customer_invoice_id uuid references customer_invoice(id) on delete restrict,
  issue_date date not null default current_date,
  status credit_memo_status not null default 'draft',
  reason_code credit_memo_reason_code not null default 'other',
  product_credit_amount numeric(14,2) not null default 0,
  shipping_refund_amount numeric(14,2) not null default 0,
  additional_credit_amount numeric(14,2) not null default 0,
  tax_credit_amount numeric(14,2) not null default 0,
  restocking_fee_percent numeric(5,2) not null default 0,
  restocking_fee_amount numeric(14,2) not null default 0,
  total_credit_amount numeric(14,2) generated always as (
    product_credit_amount + shipping_refund_amount + additional_credit_amount + tax_credit_amount - restocking_fee_amount
  ) stored,
  amount_applied numeric(14,2) not null default 0,
  amount_remaining numeric(14,2) generated always as (
    product_credit_amount + shipping_refund_amount + additional_credit_amount + tax_credit_amount - restocking_fee_amount - amount_applied
  ) stored,
  customer_name_snapshot text not null,
  customer_account_number_snapshot text,
  legacy_account_id_snapshot text,
  brand_name_snapshot text not null,
  emailed_at timestamptz,
  posted_by_user_id uuid references user_account(id),
  posted_at timestamptz,
  voided_by_user_id uuid references user_account(id),
  voided_at timestamptz,
  void_reason text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint credit_memo_number_not_blank check (btrim(credit_memo_number) <> ''),
  constraint credit_memo_amounts_nonnegative check (
    product_credit_amount >= 0
    and shipping_refund_amount >= 0
    and additional_credit_amount >= 0
    and tax_credit_amount >= 0
    and restocking_fee_percent >= 0
    and restocking_fee_amount >= 0
    and amount_applied >= 0
  ),
  constraint credit_memo_total_positive check (
    product_credit_amount + shipping_refund_amount + additional_credit_amount + tax_credit_amount - restocking_fee_amount >= 0
  ),
  constraint credit_memo_amount_applied_limit check (
    amount_applied <= product_credit_amount + shipping_refund_amount + additional_credit_amount + tax_credit_amount - restocking_fee_amount
  ),
  constraint credit_memo_posted_fields_check check (status <> 'posted' or (posted_by_user_id is not null and posted_at is not null)),
  constraint credit_memo_void_fields_check check (status <> 'void' or (voided_by_user_id is not null and voided_at is not null and void_reason is not null)),
  unique(brand_id, credit_memo_number)
);

create index credit_memo_brand_idx on credit_memo(brand_id);
create index credit_memo_customer_idx on credit_memo(customer_account_id);
create index credit_memo_rga_idx on credit_memo(rga_id);
create index credit_memo_invoice_idx on credit_memo(customer_invoice_id);
create index credit_memo_status_idx on credit_memo(status);
create index credit_memo_issue_date_idx on credit_memo(issue_date);

create table credit_memo_line (
  id uuid primary key default gen_random_uuid(),
  credit_memo_id uuid not null references credit_memo(id) on delete cascade,
  rga_line_id uuid references rga_line(id) on delete set null,
  customer_invoice_line_id uuid references customer_invoice_line(id) on delete restrict,
  product_id uuid references product(id) on delete restrict,
  description text not null,
  quantity numeric(14,3) not null default 1,
  unit_amount numeric(12,2) not null,
  restocking_fee_amount numeric(14,2) not null default 0,
  line_total numeric(14,2) generated always as (round((quantity * unit_amount - restocking_fee_amount)::numeric, 2)) stored,
  created_at timestamptz not null default now(),
  constraint credit_memo_line_description_not_blank check (btrim(description) <> ''),
  constraint credit_memo_line_amounts_check check (quantity > 0 and unit_amount >= 0 and restocking_fee_amount >= 0),
  constraint credit_memo_line_total_nonnegative check (quantity * unit_amount - restocking_fee_amount >= 0)
);

create index credit_memo_line_credit_memo_idx on credit_memo_line(credit_memo_id);
create index credit_memo_line_rga_line_idx on credit_memo_line(rga_line_id);
create index credit_memo_line_invoice_line_idx on credit_memo_line(customer_invoice_line_id);
create index credit_memo_line_product_idx on credit_memo_line(product_id);

create table credit_memo_application (
  id uuid primary key default gen_random_uuid(),
  credit_memo_id uuid not null references credit_memo(id) on delete restrict,
  customer_invoice_id uuid not null references customer_invoice(id) on delete restrict,
  customer_payment_id uuid references customer_payment(id) on delete set null,
  customer_payment_application_id uuid references customer_payment_application(id) on delete set null,
  amount_applied numeric(14,2) not null,
  source_transaction_type credit_memo_application_source_type not null default 'manual_apply',
  source_transaction_id uuid,
  applied_date date not null default current_date,
  applied_by_user_id uuid references user_account(id),
  application_status payment_application_status not null default 'posted',
  reversed_by_user_id uuid references user_account(id),
  reversed_at timestamptz,
  reversal_reason text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint credit_memo_application_amount_positive check (amount_applied > 0),
  constraint credit_memo_application_reversal_check check (
    application_status <> 'reversed'
    or (reversed_by_user_id is not null and reversed_at is not null and reversal_reason is not null)
  )
);

create index credit_memo_application_credit_memo_idx on credit_memo_application(credit_memo_id);
create index credit_memo_application_invoice_idx on credit_memo_application(customer_invoice_id);
create index credit_memo_application_payment_idx on credit_memo_application(customer_payment_id);
create index credit_memo_application_status_idx on credit_memo_application(application_status);

create view rga_available_sales_order_lines as
select
  sol.id as sales_order_line_id,
  sol.sales_order_id,
  so.customer_account_id,
  so.customer_location_id,
  so.customer_po_number,
  sol.product_id,
  sol.product_sku_snapshot,
  sol.product_name_snapshot,
  sol.brand_id_snapshot,
  sol.brand_name_snapshot,
  sol.quantity_shipped,
  coalesce(sum(rl.quantity_requested) filter (where r.status not in ('cancelled', 'rejected') and rl.status <> 'cancelled'), 0) as previous_rga_quantity,
  sol.quantity_shipped - coalesce(sum(rl.quantity_requested) filter (where r.status not in ('cancelled', 'rejected') and rl.status <> 'cancelled'), 0) as available_rga_quantity
from sales_order_line sol
join sales_order so on so.id = sol.sales_order_id
left join rga_line rl on rl.sales_order_line_id = sol.id
left join rga r on r.id = rl.rga_id
where sol.quantity_shipped > 0
group by
  sol.id,
  sol.sales_order_id,
  so.customer_account_id,
  so.customer_location_id,
  so.customer_po_number,
  sol.product_id,
  sol.product_sku_snapshot,
  sol.product_name_snapshot,
  sol.brand_id_snapshot,
  sol.brand_name_snapshot,
  sol.quantity_shipped
having sol.quantity_shipped - coalesce(sum(rl.quantity_requested) filter (where r.status not in ('cancelled', 'rejected') and rl.status <> 'cancelled'), 0) > 0;

create or replace view ar_aging_open_items as
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
  and cp.amount_unapplied > 0
union all
select
  'credit_memo'::text as row_type,
  cm.id as source_entity_id,
  cm.customer_account_id,
  cm.brand_id,
  cm.credit_memo_number as reference_number,
  cm.issue_date as transaction_date,
  null::date as due_date,
  -cm.amount_remaining as balance_due,
  'credit_unapplied'::text as aging_bucket,
  0 as days_past_due,
  null::text as payment_terms_snapshot,
  null::uuid as sales_rep_agency_id_snapshot,
  null::uuid as sales_rep_id_snapshot,
  null::uuid as territory_id_snapshot
from credit_memo cm
where cm.status in ('posted', 'partially_applied')
  and cm.amount_remaining > 0;

create or replace function generate_rga_number()
returns text
language plpgsql
as $$
begin
  return generate_prefixed_daily_number('RGA', 'rga', 'rga_number');
end;
$$;

create or replace function generate_credit_memo_number_for_brand(target_brand_id uuid)
returns text
language plpgsql
as $$
declare
  brand_code_value text;
begin
  select brand_code into brand_code_value from brand where id = target_brand_id;
  if brand_code_value is null then
    raise exception 'Brand % does not exist', target_brand_id;
  end if;
  return generate_prefixed_daily_number(brand_code_value || '-CM', 'credit_memo', 'credit_memo_number');
end;
$$;

create or replace function set_rga_number()
returns trigger
language plpgsql
as $$
begin
  if new.rga_number is null or new.rga_number = '' then
    new.rga_number := generate_rga_number();
  end if;
  return new;
end;
$$;

create or replace function set_credit_memo_number()
returns trigger
language plpgsql
as $$
begin
  if new.credit_memo_number is null or new.credit_memo_number = '' then
    new.credit_memo_number := generate_credit_memo_number_for_brand(new.brand_id);
  end if;
  return new;
end;
$$;

create or replace function set_rga_snapshots()
returns trigger
language plpgsql
as $$
declare
  account_record customer_account%rowtype;
  order_record sales_order%rowtype;
  invoice_record customer_invoice%rowtype;
begin
  select * into account_record from customer_account where id = new.customer_account_id;
  if not found then
    raise exception 'Customer account % does not exist', new.customer_account_id;
  end if;

  if new.sales_order_id is not null then
    select * into order_record from sales_order where id = new.sales_order_id;
    if not found then
      raise exception 'Sales order % does not exist', new.sales_order_id;
    end if;
    if order_record.customer_account_id <> new.customer_account_id then
      raise exception 'RGA sales order customer does not match RGA customer';
    end if;
    new.original_customer_po_number_snapshot := coalesce(nullif(new.original_customer_po_number_snapshot, ''), order_record.customer_po_number);
    new.customer_location_id := coalesce(new.customer_location_id, order_record.customer_location_id);
    new.order_contact_snapshot_json := coalesce(new.order_contact_snapshot_json, order_record.order_contact_snapshot_json);
    new.approval_email_to_snapshot := coalesce(nullif(new.approval_email_to_snapshot, ''), order_record.order_contact_snapshot_json ->> 'email');
  end if;

  if new.customer_invoice_id is not null then
    select * into invoice_record from customer_invoice where id = new.customer_invoice_id;
    if not found then
      raise exception 'Customer invoice % does not exist', new.customer_invoice_id;
    end if;
    if invoice_record.customer_account_id <> new.customer_account_id then
      raise exception 'RGA invoice customer does not match RGA customer';
    end if;
  end if;

  new.customer_name_snapshot := coalesce(nullif(new.customer_name_snapshot, ''), account_record.account_name);
  new.customer_account_number_snapshot := coalesce(nullif(new.customer_account_number_snapshot, ''), account_record.account_number);
  new.legacy_account_id_snapshot := coalesce(nullif(new.legacy_account_id_snapshot, ''), account_record.legacy_account_id);

  if new.approved_resolution_type is null and new.status in ('authorized', 'awaiting_return', 'received', 'awaiting_credit_memo', 'resolved', 'closed') then
    new.approved_resolution_type := new.requested_resolution_type;
  end if;

  if new.authorized_date is null and new.status in ('authorized', 'awaiting_return', 'received', 'awaiting_credit_memo', 'resolved', 'closed') then
    new.authorized_date := current_date;
  end if;

  if new.received_date is null and new.status in ('received', 'awaiting_credit_memo', 'resolved', 'closed') then
    new.received_date := current_date;
  end if;

  if new.closed_date is null and new.status = 'closed' then
    new.closed_date := current_date;
  end if;

  return new;
end;
$$;

create or replace function set_rga_line_snapshots_and_validate()
returns trigger
language plpgsql
as $$
declare
  line_record sales_order_line%rowtype;
  product_record product%rowtype;
  brand_record brand%rowtype;
  rga_record rga%rowtype;
  prior_quantity numeric(14,3);
begin
  select * into rga_record from rga where id = new.rga_id;
  if not found then
    raise exception 'RGA % does not exist', new.rga_id;
  end if;

  select * into line_record from sales_order_line where id = new.sales_order_line_id;
  if not found then
    raise exception 'Sales order line % does not exist', new.sales_order_line_id;
  end if;

  if rga_record.sales_order_id is not null and line_record.sales_order_id <> rga_record.sales_order_id then
    raise exception 'RGA line must belong to the original sales order selected on the RGA';
  end if;

  if line_record.quantity_shipped <= 0 then
    raise exception 'Only shipped sales order lines are available for RGA';
  end if;

  select * into product_record from product where id = line_record.product_id;
  select * into brand_record from brand where id = line_record.brand_id_snapshot;

  select coalesce(sum(existing.quantity_requested), 0)
  into prior_quantity
  from rga_line existing
  join rga existing_rga on existing_rga.id = existing.rga_id
  where existing.sales_order_line_id = new.sales_order_line_id
    and existing.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
    and existing.status <> 'cancelled'
    and existing_rga.status not in ('cancelled', 'rejected');

  new.product_id := coalesce(new.product_id, line_record.product_id);
  new.brand_id_snapshot := coalesce(new.brand_id_snapshot, line_record.brand_id_snapshot);
  new.brand_name_snapshot := coalesce(nullif(new.brand_name_snapshot, ''), line_record.brand_name_snapshot);
  new.product_sku_snapshot := coalesce(nullif(new.product_sku_snapshot, ''), line_record.product_sku_snapshot, product_record.sku);
  new.product_name_snapshot := coalesce(nullif(new.product_name_snapshot, ''), line_record.product_name_snapshot, product_record.product_name);
  new.quantity_shipped_snapshot := coalesce(nullif(new.quantity_shipped_snapshot, 0), line_record.quantity_shipped);
  new.previous_rga_quantity_snapshot := prior_quantity;
  new.available_rga_quantity_snapshot := line_record.quantity_shipped - prior_quantity;

  if new.product_id <> line_record.product_id then
    raise exception 'RGA line product must match the original sales order line product';
  end if;

  if new.quantity_requested > new.available_rga_quantity_snapshot then
    raise exception 'RGA quantity % exceeds available RGA quantity % for sales order line %',
      new.quantity_requested, new.available_rga_quantity_snapshot, new.sales_order_line_id;
  end if;

  if rga_record.requested_resolution_type = 'credit' then
    new.credit_required := true;
    new.replacement_required := false;
  elsif rga_record.requested_resolution_type = 'replacement' then
    new.credit_required := false;
    new.replacement_required := true;
  end if;

  if brand_record.id is null then
    raise exception 'Brand snapshot is required for RGA line %', new.sales_order_line_id;
  end if;

  return new;
end;
$$;

create or replace function set_rga_replacement_order_snapshots()
returns trigger
language plpgsql
as $$
declare
  order_record sales_order%rowtype;
  rga_record rga%rowtype;
begin
  select * into rga_record from rga where id = new.rga_id;
  if not found then
    raise exception 'RGA % does not exist', new.rga_id;
  end if;

  if rga_record.requested_resolution_type <> 'replacement' then
    raise exception 'Replacement order links are only allowed for replacement RGAs';
  end if;

  select * into order_record from sales_order where id = new.sales_order_id;
  if not found then
    raise exception 'Sales order % does not exist', new.sales_order_id;
  end if;

  if order_record.order_type <> 'rga_replacement' then
    raise exception 'Linked sales order must be an RGA replacement order';
  end if;

  if order_record.customer_account_id <> rga_record.customer_account_id then
    raise exception 'Replacement order customer must match RGA customer';
  end if;

  new.replacement_order_number_snapshot := coalesce(nullif(new.replacement_order_number_snapshot, ''), order_record.sales_order_number);
  new.replacement_customer_po_number_snapshot := coalesce(nullif(new.replacement_customer_po_number_snapshot, ''), order_record.customer_po_number);

  if order_record.status in ('partially_shipped', 'shipped') and new.status = 'ordered' then
    new.status := 'partially_shipped';
  end if;
  if order_record.status in ('closed', 'shipped') then
    new.status := 'shipped';
  end if;

  return new;
end;
$$;

create or replace function set_credit_memo_snapshots_and_validate()
returns trigger
language plpgsql
as $$
declare
  account_record customer_account%rowtype;
  brand_record brand%rowtype;
  invoice_record customer_invoice%rowtype;
begin
  select * into account_record from customer_account where id = new.customer_account_id;
  if not found then
    raise exception 'Customer account % does not exist', new.customer_account_id;
  end if;

  select * into brand_record from brand where id = new.brand_id;
  if not found then
    raise exception 'Brand % does not exist', new.brand_id;
  end if;

  if new.customer_invoice_id is not null then
    select * into invoice_record from customer_invoice where id = new.customer_invoice_id;
    if not found then
      raise exception 'Customer invoice % does not exist', new.customer_invoice_id;
    end if;
    if invoice_record.customer_account_id <> new.customer_account_id then
      raise exception 'Credit memo invoice customer does not match credit memo customer';
    end if;
    if invoice_record.brand_id <> new.brand_id then
      raise exception 'Credit memo brand must match original invoice brand';
    end if;
  end if;

  if new.status in ('posted', 'partially_applied', 'fully_applied') and new.posted_at is null then
    new.posted_at := now();
  end if;

  new.customer_name_snapshot := coalesce(nullif(new.customer_name_snapshot, ''), account_record.account_name);
  new.customer_account_number_snapshot := coalesce(nullif(new.customer_account_number_snapshot, ''), account_record.account_number);
  new.legacy_account_id_snapshot := coalesce(nullif(new.legacy_account_id_snapshot, ''), account_record.legacy_account_id);
  new.brand_name_snapshot := coalesce(nullif(new.brand_name_snapshot, ''), brand_record.brand_name);

  return new;
end;
$$;

create or replace function validate_credit_memo_application()
returns trigger
language plpgsql
as $$
declare
  memo_record credit_memo%rowtype;
  invoice_record customer_invoice%rowtype;
  other_applied numeric(14,2);
begin
  select * into memo_record from credit_memo where id = new.credit_memo_id;
  if not found then
    raise exception 'Credit memo % does not exist', new.credit_memo_id;
  end if;

  if memo_record.status not in ('posted', 'partially_applied', 'fully_applied') then
    raise exception 'Only posted credit memos can be applied';
  end if;

  select * into invoice_record from customer_invoice where id = new.customer_invoice_id;
  if not found then
    raise exception 'Customer invoice % does not exist', new.customer_invoice_id;
  end if;

  if invoice_record.customer_account_id <> memo_record.customer_account_id then
    raise exception 'Credit memo and invoice customers must match';
  end if;

  if invoice_record.brand_id <> memo_record.brand_id then
    raise exception 'Credit memo and invoice brands must match';
  end if;

  select coalesce(sum(amount_applied), 0)
  into other_applied
  from credit_memo_application
  where credit_memo_id = new.credit_memo_id
    and id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
    and application_status = 'posted';

  if new.application_status = 'posted' and other_applied + new.amount_applied > memo_record.total_credit_amount then
    raise exception 'Credit memo application exceeds available credit';
  end if;

  return new;
end;
$$;

create or replace function refresh_credit_memo_amount_applied(target_credit_memo_id uuid)
returns void
language plpgsql
as $$
begin
  update credit_memo
  set
    amount_applied = coalesce((
      select sum(amount_applied)
      from credit_memo_application
      where credit_memo_id = target_credit_memo_id
        and application_status = 'posted'
    ), 0),
    status = case
      when status = 'void' then status
      when status = 'draft' then status
      when status = 'pending_approval' then status
      when coalesce((
        select sum(amount_applied)
        from credit_memo_application
        where credit_memo_id = target_credit_memo_id
          and application_status = 'posted'
      ), 0) <= 0 then 'posted'::credit_memo_status
      when coalesce((
        select sum(amount_applied)
        from credit_memo_application
        where credit_memo_id = target_credit_memo_id
          and application_status = 'posted'
      ), 0) < total_credit_amount then 'partially_applied'::credit_memo_status
      else 'fully_applied'::credit_memo_status
    end,
    updated_at = now()
  where id = target_credit_memo_id;
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
    credit_applied_amount = coalesce((
      select sum(amount_applied)
      from credit_memo_application
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
      ), 0) - coalesce((
        select sum(amount_applied)
        from credit_memo_application
        where customer_invoice_id = target_invoice_id
          and application_status = 'posted'
      ), 0) - coalesce((
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
      ), 0) + coalesce((
        select sum(amount_applied)
        from credit_memo_application
        where customer_invoice_id = target_invoice_id
          and application_status = 'posted'
      ), 0) + coalesce((
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
      ), 0) - coalesce((
        select sum(amount_applied)
        from credit_memo_application
        where customer_invoice_id = target_invoice_id
          and application_status = 'posted'
      ), 0) - coalesce((
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
      ), 0) - coalesce((
        select sum(amount_applied)
        from credit_memo_application
        where customer_invoice_id = target_invoice_id
          and application_status = 'posted'
      ), 0) - coalesce((
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

create or replace function refresh_ar_after_credit_memo_application()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'DELETE' then
    perform refresh_credit_memo_amount_applied(old.credit_memo_id);
    perform refresh_invoice_ar_totals(old.customer_invoice_id);
    return old;
  end if;

  perform refresh_credit_memo_amount_applied(new.credit_memo_id);
  perform refresh_invoice_ar_totals(new.customer_invoice_id);

  if tg_op = 'UPDATE' then
    if old.credit_memo_id <> new.credit_memo_id then
      perform refresh_credit_memo_amount_applied(old.credit_memo_id);
    end if;
    if old.customer_invoice_id <> new.customer_invoice_id then
      perform refresh_invoice_ar_totals(old.customer_invoice_id);
    end if;
  end if;

  return new;
end;
$$;

create trigger set_rga_number_before_insert
  before insert on rga
  for each row execute function set_rga_number();

alter table rga
  alter column rga_number set default generate_rga_number();

create trigger set_rga_snapshots_before_insert_update
  before insert or update of customer_account_id, customer_location_id, sales_order_id, customer_invoice_id, status, requested_resolution_type, approved_resolution_type
  on rga
  for each row execute function set_rga_snapshots();

create trigger set_rga_line_snapshots_before_insert_update
  before insert or update of rga_id, sales_order_line_id, quantity_requested
  on rga_line
  for each row execute function set_rga_line_snapshots_and_validate();

create trigger set_rga_replacement_order_snapshots_before_insert_update
  before insert or update of rga_id, sales_order_id, status
  on rga_replacement_order
  for each row execute function set_rga_replacement_order_snapshots();

create trigger set_credit_memo_number_before_insert
  before insert on credit_memo
  for each row execute function set_credit_memo_number();

create trigger set_credit_memo_snapshots_before_insert_update
  before insert or update of brand_id, customer_account_id, customer_invoice_id, status
  on credit_memo
  for each row execute function set_credit_memo_snapshots_and_validate();

create trigger validate_credit_memo_application_before_insert_update
  before insert or update of credit_memo_id, customer_invoice_id, amount_applied, application_status
  on credit_memo_application
  for each row execute function validate_credit_memo_application();

create trigger refresh_ar_after_credit_memo_application_change
  after insert or update of credit_memo_id, customer_invoice_id, amount_applied, application_status or delete
  on credit_memo_application
  for each row execute function refresh_ar_after_credit_memo_application();

create trigger set_rga_policy_updated_at
  before update on rga_policy
  for each row execute function set_updated_at();

create trigger set_rga_updated_at
  before update on rga
  for each row execute function set_updated_at();

create trigger set_rga_line_updated_at
  before update on rga_line
  for each row execute function set_updated_at();

create trigger set_rga_replacement_order_updated_at
  before update on rga_replacement_order
  for each row execute function set_updated_at();

create trigger set_credit_memo_updated_at
  before update on credit_memo
  for each row execute function set_updated_at();

create trigger set_credit_memo_application_updated_at
  before update on credit_memo_application
  for each row execute function set_updated_at();

insert into document_number_sequence (sequence_code, document_type, prefix, next_number, padding_length)
values ('rga_shared', 'rga', 'RGA', 1, 6)
on conflict (sequence_code) do nothing;

insert into document_number_sequence (sequence_code, document_type, brand_id, prefix, next_number, padding_length)
select 'credit_memo_' || lower(brand_code), 'credit_memo', id, brand_code || '-CM', 1, 6
from brand
on conflict (sequence_code) do nothing;

insert into rga_policy (
  policy_name,
  rga_reason_category,
  requires_customer_images,
  default_customer_pays_return_freight,
  default_restocking_fee_percent,
  allow_restocking_fee_override,
  requires_return,
  requires_inspection_before_credit,
  default_return_inventory_condition
)
values
  ('Buy Remorse', 'buy_remorse', false, true, 25, true, true, true, 'hold'),
  ('Product Defect', 'product_defect', true, false, 0, true, true, true, 'hold'),
  ('Freight Damage', 'freight_damage', true, false, 0, true, true, true, 'hold'),
  ('Wrong Item', 'wrong_item', false, false, 0, true, true, true, 'hold'),
  ('Shipping Error', 'shipping_error', false, false, 0, true, true, true, 'hold'),
  ('Other', 'other', false, false, 0, true, true, true, 'hold')
on conflict do nothing;

insert into permission (permission_code, permission_area, name, description)
values
  ('rga.view', 'rga', 'RGA View', 'View RGA requests, lines, approval status, and return history.'),
  ('rga.create', 'rga', 'RGA Create', 'Create RGA records from customer orders.'),
  ('rga.approve', 'rga', 'RGA Approve', 'Approve or reject RGA requests without a manager step.'),
  ('rga.receive_return', 'rga', 'RGA Return Receive', 'Record returned RGA items into hold inventory.'),
  ('rga.replacement_order.create', 'rga', 'RGA Replacement Order Create', 'Create and link RGA replacement orders.'),
  ('credit_memo.view', 'ar', 'Credit Memo View', 'View brand-specific credit memos and applications.'),
  ('credit_memo.create', 'ar', 'Credit Memo Create', 'Create brand-specific credit memos from RGA or manual adjustments.'),
  ('credit_memo.post', 'ar', 'Credit Memo Post', 'Post credit memos to AR.'),
  ('credit_memo.apply', 'ar', 'Credit Memo Apply', 'Apply credit memo balances to invoices.'),
  ('credit_memo.void', 'ar', 'Credit Memo Void', 'Void posted or draft credit memos with audit reason.')
on conflict (permission_code) do nothing;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'
from role r
join permission p on p.permission_code in (
  'rga.view',
  'rga.create',
  'rga.approve',
  'rga.receive_return',
  'rga.replacement_order.create',
  'credit_memo.view',
  'credit_memo.create',
  'credit_memo.post',
  'credit_memo.apply',
  'credit_memo.void'
)
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in ('credit_memo.post', 'credit_memo.apply', 'credit_memo.void') then 'view'::permission_level
    else 'edit'::permission_level
  end
from role r
join permission p on p.permission_code in (
  'rga.view',
  'rga.create',
  'rga.approve',
  'rga.receive_return',
  'rga.replacement_order.create',
  'credit_memo.view',
  'credit_memo.create',
  'credit_memo.post',
  'credit_memo.apply',
  'credit_memo.void'
)
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update set permission_level = excluded.permission_level;
