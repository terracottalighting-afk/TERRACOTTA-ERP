create type report_type as enum (
  'customer',
  'order',
  'shipping',
  'inventory',
  'purchasing',
  'receiving',
  'invoice',
  'ar',
  'credit_memo',
  'rga',
  'product_performance',
  'market_analysis',
  'commission',
  'migration',
  'admin'
);

create type report_output_format as enum ('screen', 'pdf', 'xlsx', 'csv');
create type report_shared_scope as enum ('personal', 'role', 'department', 'global');
create type report_export_status as enum ('queued', 'running', 'completed', 'failed', 'cancelled');
create type scheduled_report_frequency as enum ('daily', 'weekly', 'monthly');
create type scheduled_report_status as enum ('active', 'paused', 'error', 'disabled');
create type dashboard_code as enum (
  'customer_account',
  'primary_showroom',
  'warehouse_shipping',
  'financial',
  'rga',
  'purchasing_receiving',
  'reps_commissions',
  'product_market_analysis'
);
create type dashboard_widget_type as enum ('metric', 'queue', 'table', 'chart', 'alert', 'link_list');

create table report_definition (
  id uuid primary key default gen_random_uuid(),
  report_code text not null unique,
  name text not null,
  report_type report_type not null,
  description text,
  default_filters_json jsonb not null default '{}'::jsonb,
  available_filters_json jsonb not null default '{}'::jsonb,
  available_columns_json jsonb not null default '[]'::jsonb,
  default_columns_json jsonb not null default '[]'::jsonb,
  supported_output_formats report_output_format[] not null default array['screen']::report_output_format[],
  supports_brand_filter boolean not null default false,
  permission_code text references permission(permission_code) on delete set null,
  is_external_safe boolean not null default false,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint report_definition_code_not_blank check (btrim(report_code) <> ''),
  constraint report_definition_name_not_blank check (btrim(name) <> '')
);

create index report_definition_type_idx on report_definition(report_type);
create index report_definition_active_idx on report_definition(is_active);
create index report_definition_permission_idx on report_definition(permission_code);

create table saved_report_configuration (
  id uuid primary key default gen_random_uuid(),
  report_definition_id uuid not null references report_definition(id) on delete cascade,
  customer_account_id uuid references customer_account(id) on delete cascade,
  customer_location_id uuid references customer_location(id) on delete cascade,
  owner_user_id uuid references user_account(id) on delete cascade,
  shared_scope report_shared_scope not null default 'personal',
  shared_role_id uuid references role(id) on delete cascade,
  shared_department text,
  name text not null,
  filters_json jsonb not null default '{}'::jsonb,
  brand_filter_id uuid references brand(id) on delete set null,
  selected_columns_json jsonb not null default '[]'::jsonb,
  column_mapping_json jsonb not null default '{}'::jsonb,
  file_format report_output_format not null default 'screen',
  is_default boolean not null default false,
  is_active boolean not null default true,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saved_report_name_not_blank check (btrim(name) <> ''),
  constraint saved_report_scope_required_fields check (
    (shared_scope = 'personal' and owner_user_id is not null and shared_role_id is null and shared_department is null)
    or (shared_scope = 'role' and shared_role_id is not null and owner_user_id is null)
    or (shared_scope = 'department' and shared_department is not null and owner_user_id is null and shared_role_id is null)
    or (shared_scope = 'global' and owner_user_id is null and shared_role_id is null and shared_department is null)
  )
);

create index saved_report_definition_idx on saved_report_configuration(report_definition_id);
create index saved_report_owner_idx on saved_report_configuration(owner_user_id);
create index saved_report_role_idx on saved_report_configuration(shared_role_id);
create index saved_report_department_idx on saved_report_configuration(shared_department);
create index saved_report_customer_idx on saved_report_configuration(customer_account_id, customer_location_id);
create index saved_report_brand_idx on saved_report_configuration(brand_filter_id);

create table report_export_run (
  id uuid primary key default gen_random_uuid(),
  report_definition_id uuid not null references report_definition(id) on delete restrict,
  saved_report_configuration_id uuid references saved_report_configuration(id) on delete set null,
  requested_output_format report_output_format not null,
  requested_filters_json jsonb not null default '{}'::jsonb,
  selected_columns_json jsonb not null default '[]'::jsonb,
  brand_filter_id uuid references brand(id) on delete set null,
  customer_account_id uuid references customer_account(id) on delete set null,
  customer_location_id uuid references customer_location(id) on delete set null,
  export_status report_export_status not null default 'queued',
  generated_file_id uuid references attachment(id) on delete set null,
  generated_document_event_id uuid references generated_document_event(id) on delete set null,
  record_count integer,
  error_message text,
  requested_by_user_id uuid references user_account(id),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint report_export_record_count_nonnegative check (record_count is null or record_count >= 0),
  constraint report_export_time_order check (completed_at is null or started_at is null or completed_at >= started_at)
);

create index report_export_definition_idx on report_export_run(report_definition_id);
create index report_export_saved_config_idx on report_export_run(saved_report_configuration_id);
create index report_export_status_idx on report_export_run(export_status);
create index report_export_created_at_idx on report_export_run(created_at);

create table scheduled_report (
  id uuid primary key default gen_random_uuid(),
  saved_report_configuration_id uuid not null references saved_report_configuration(id) on delete cascade,
  email_template_id uuid references email_template(id) on delete set null,
  report_name text not null,
  to_addresses text[] not null default '{}',
  cc_addresses text[] not null default '{}',
  bcc_addresses text[] not null default '{}',
  schedule_frequency scheduled_report_frequency not null,
  schedule_days integer[] not null default '{}',
  schedule_time time not null,
  time_zone text not null default 'America/Chicago',
  last_run_at timestamptz,
  next_run_at timestamptz,
  status scheduled_report_status not null default 'active',
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scheduled_report_name_not_blank check (btrim(report_name) <> ''),
  constraint scheduled_report_recipients_present check (cardinality(to_addresses) > 0)
);

create index scheduled_report_config_idx on scheduled_report(saved_report_configuration_id);
create index scheduled_report_next_run_idx on scheduled_report(next_run_at) where status = 'active';
create index scheduled_report_status_idx on scheduled_report(status);

create table scheduled_report_run (
  id uuid primary key default gen_random_uuid(),
  scheduled_report_id uuid not null references scheduled_report(id) on delete cascade,
  report_export_run_id uuid references report_export_run(id) on delete set null,
  run_started_at timestamptz not null default now(),
  run_finished_at timestamptz,
  generated_file_id uuid references attachment(id) on delete set null,
  recipient_snapshot jsonb not null default '{}'::jsonb,
  email_subject_snapshot text,
  email_body_snapshot text,
  send_status text not null default 'draft',
  error_message text,
  record_count integer,
  created_at timestamptz not null default now(),
  constraint scheduled_report_run_record_count_nonnegative check (record_count is null or record_count >= 0),
  constraint scheduled_report_run_time_order check (run_finished_at is null or run_finished_at >= run_started_at)
);

create index scheduled_report_run_schedule_idx on scheduled_report_run(scheduled_report_id);
create index scheduled_report_run_started_idx on scheduled_report_run(run_started_at);

create table dashboard_definition (
  id uuid primary key default gen_random_uuid(),
  dashboard_code dashboard_code not null unique,
  name text not null,
  department text,
  description text,
  default_filters_json jsonb not null default '{}'::jsonb,
  permission_code text references permission(permission_code) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dashboard_definition_name_not_blank check (btrim(name) <> '')
);

create table dashboard_widget_definition (
  id uuid primary key default gen_random_uuid(),
  dashboard_definition_id uuid not null references dashboard_definition(id) on delete cascade,
  widget_code text not null,
  name text not null,
  widget_type dashboard_widget_type not null,
  display_order integer not null default 0,
  data_source_name text,
  default_filters_json jsonb not null default '{}'::jsonb,
  drilldown_report_definition_id uuid references report_definition(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dashboard_widget_code_not_blank check (btrim(widget_code) <> ''),
  constraint dashboard_widget_name_not_blank check (btrim(name) <> ''),
  unique(dashboard_definition_id, widget_code)
);

create index dashboard_widget_dashboard_idx on dashboard_widget_definition(dashboard_definition_id);

create table dashboard_snapshot (
  id uuid primary key default gen_random_uuid(),
  dashboard_definition_id uuid not null references dashboard_definition(id) on delete cascade,
  snapshot_scope text not null default 'company',
  customer_account_id uuid references customer_account(id) on delete cascade,
  customer_location_id uuid references customer_location(id) on delete cascade,
  brand_id uuid references brand(id) on delete set null,
  date_from date,
  date_to date,
  filters_json jsonb not null default '{}'::jsonb,
  summary_json jsonb not null default '{}'::jsonb,
  generated_by_user_id uuid references user_account(id),
  generated_at timestamptz not null default now(),
  expires_at timestamptz,
  constraint dashboard_snapshot_date_order check (date_to is null or date_from is null or date_to >= date_from)
);

create index dashboard_snapshot_dashboard_idx on dashboard_snapshot(dashboard_definition_id);
create index dashboard_snapshot_customer_idx on dashboard_snapshot(customer_account_id, customer_location_id);
create index dashboard_snapshot_generated_idx on dashboard_snapshot(generated_at);

create table dashboard_snapshot_item (
  id uuid primary key default gen_random_uuid(),
  dashboard_snapshot_id uuid not null references dashboard_snapshot(id) on delete cascade,
  widget_code text not null,
  item_type text not null,
  source_entity_type text,
  source_entity_id uuid,
  label text,
  metric_value numeric(18,4),
  amount_value numeric(14,2),
  count_value integer,
  sort_order integer not null default 0,
  item_payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index dashboard_snapshot_item_snapshot_idx on dashboard_snapshot_item(dashboard_snapshot_id);
create index dashboard_snapshot_item_source_idx on dashboard_snapshot_item(source_entity_type, source_entity_id);
create index dashboard_snapshot_item_widget_idx on dashboard_snapshot_item(widget_code);

create table partner_product_datasheet_export_run (
  id uuid primary key default gen_random_uuid(),
  partner_product_datasheet_template_id uuid not null references partner_product_datasheet_template(id) on delete restrict,
  report_export_run_id uuid references report_export_run(id) on delete set null,
  filters_json jsonb not null default '{}'::jsonb,
  product_count integer not null default 0,
  output_format report_output_format not null,
  generated_file_id uuid references attachment(id) on delete set null,
  export_status report_export_status not null default 'queued',
  validation_messages_json jsonb not null default '[]'::jsonb,
  requested_by_user_id uuid references user_account(id),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint partner_datasheet_export_product_count_nonnegative check (product_count >= 0),
  constraint partner_datasheet_export_format_check check (output_format in ('xlsx', 'csv')),
  constraint partner_datasheet_export_time_order check (completed_at is null or started_at is null or completed_at >= started_at)
);

create index partner_datasheet_export_template_idx on partner_product_datasheet_export_run(partner_product_datasheet_template_id);
create index partner_datasheet_export_status_idx on partner_product_datasheet_export_run(export_status);
create index partner_datasheet_export_created_idx on partner_product_datasheet_export_run(created_at);

create view shipping_dashboard_open_queue as
select
  so.id as sales_order_id,
  so.sales_order_number,
  so.customer_po_number,
  so.customer_account_id,
  so.customer_location_id,
  so.customer_name_snapshot,
  so.ship_to_display_name_snapshot,
  so.order_date,
  so.order_type,
  so.order_source,
  so.shipping_readiness_status,
  so.credit_hold_status,
  sum(greatest(sol.quantity_ordered - sol.quantity_shipped - sol.quantity_cancelled - sol.quantity_cleared, 0)) as open_quantity,
  count(*) filter (where sol.quantity_shipped < sol.quantity_ordered - sol.quantity_cancelled - sol.quantity_cleared) as open_line_count
from sales_order so
join sales_order_line sol on sol.sales_order_id = so.id
where so.status in ('open', 'partially_shipped')
  and so.shipping_readiness_status = 'ready'
  and so.credit_hold_status <> 'on_credit_hold'
group by
  so.id,
  so.sales_order_number,
  so.customer_po_number,
  so.customer_account_id,
  so.customer_location_id,
  so.customer_name_snapshot,
  so.ship_to_display_name_snapshot,
  so.order_date,
  so.order_type,
  so.order_source,
  so.shipping_readiness_status,
  so.credit_hold_status
having sum(greatest(sol.quantity_ordered - sol.quantity_shipped - sol.quantity_cancelled - sol.quantity_cleared, 0)) > 0;

create view backordered_item_report as
select
  sol.product_id,
  sol.product_sku_snapshot,
  sol.product_name_snapshot,
  sol.brand_id_snapshot,
  sol.brand_name_snapshot,
  sum(greatest(sol.quantity_ordered - sol.quantity_shipped - sol.quantity_cancelled - sol.quantity_cleared, 0)) as total_backordered_quantity,
  count(distinct sol.sales_order_id) as order_count,
  count(distinct so.customer_account_id) as customer_count,
  coalesce((
    select sum(ib.quantity_available)
    from inventory_balance ib
    where ib.product_id = sol.product_id
      and ib.inventory_condition = 'regular'
  ), 0) as quantity_on_hand,
  coalesce((
    select sum(ii.expected_quantity - ii.received_quantity)
    from incoming_inventory ii
    where ii.product_id = sol.product_id
      and ii.status in ('expected', 'in_transit')
  ), 0) as incoming_quantity,
  (
    select min(ii.expected_date)
    from incoming_inventory ii
    where ii.product_id = sol.product_id
      and ii.status in ('expected', 'in_transit')
      and ii.expected_date is not null
  ) as next_eta
from sales_order_line sol
join sales_order so on so.id = sol.sales_order_id
where so.status in ('open', 'partially_shipped')
  and sol.line_status in ('open', 'partial', 'backordered')
  and greatest(sol.quantity_ordered - sol.quantity_shipped - sol.quantity_cancelled - sol.quantity_cleared, 0) > 0
group by
  sol.product_id,
  sol.product_sku_snapshot,
  sol.product_name_snapshot,
  sol.brand_id_snapshot,
  sol.brand_name_snapshot;

create view financial_dashboard_current_snapshot as
select
  current_date as snapshot_date,
  count(*) filter (where ci.invoice_date >= date_trunc('year', current_date)::date) as ytd_invoice_count,
  coalesce(sum(ci.total_amount) filter (where ci.invoice_date >= date_trunc('year', current_date)::date), 0) as ytd_invoice_amount,
  count(*) filter (where ci.payment_status = 'paid' and ci.invoice_date >= date_trunc('year', current_date)::date) as ytd_paid_invoice_count,
  coalesce(sum(ci.balance_due) filter (where ci.balance_due > 0), 0) as open_invoice_balance,
  count(*) filter (where ci.balance_due > 0) as open_invoice_count,
  count(*) filter (where ci.balance_due > 0 and ci.due_date < current_date) as overdue_invoice_count,
  coalesce(sum(ci.balance_due) filter (where ci.balance_due > 0 and ci.due_date < current_date), 0) as overdue_invoice_balance,
  coalesce((select count(*) from packing_list pl where pl.invoice_required and pl.invoice_generation_status_snapshot <> 'fully_invoiced_by_brand'), 0) as un_invoiced_packing_list_count,
  coalesce((select count(*) from credit_memo cm where cm.issue_date >= date_trunc('year', current_date)::date), 0) as ytd_credit_memo_count,
  coalesce((select sum(cm.total_credit_amount) from credit_memo cm where cm.issue_date >= date_trunc('year', current_date)::date), 0) as ytd_credit_memo_amount,
  coalesce((select sum(cm.amount_remaining) from credit_memo cm where cm.status in ('posted', 'partially_applied')), 0) as outstanding_credit_memo_amount
from customer_invoice ci;

create view rga_dashboard_action_queue as
select
  r.id as rga_id,
  r.rga_number,
  r.customer_account_id,
  r.customer_location_id,
  r.customer_name_snapshot,
  r.original_customer_po_number_snapshot,
  r.request_date,
  r.status,
  r.requested_resolution_type,
  case
    when r.status in ('draft', 'pending_review') then 'open_rga'
    when r.status = 'authorized' and r.return_required then 'approved_awaiting_return'
    when r.status in ('received', 'awaiting_credit_memo') and r.requested_resolution_type = 'credit' then 'awaiting_credit_memo'
    when r.requested_resolution_type = 'replacement'
      and exists (
        select 1 from rga_replacement_order rro
        where rro.rga_id = r.id
          and rro.status in ('pending', 'ordered', 'partially_shipped')
      ) then 'replacement_order_to_ship'
    else 'other'
  end as action_bucket
from rga r
where r.status not in ('closed', 'cancelled', 'rejected');

create view purchasing_dashboard_open_items as
select
  vpo.id as vendor_purchase_order_id,
  vpo.vendor_po_number,
  vpo.vendor_id,
  vpo.vendor_name_snapshot,
  vpo.po_date,
  vpo.status,
  count(vpol.id) as line_count,
  coalesce(sum(greatest(vpol.quantity_ordered - vpol.quantity_received, 0)), 0) as open_quantity,
  min(vpol.expected_ready_date) as next_expected_ready_date
from vendor_purchase_order vpo
left join vendor_purchase_order_line vpol on vpol.vendor_purchase_order_id = vpo.id
where vpo.status not in ('closed', 'cancelled')
group by vpo.id, vpo.vendor_po_number, vpo.vendor_id, vpo.vendor_name_snapshot, vpo.po_date, vpo.status;

create or replace function set_report_export_started_completed()
returns trigger
language plpgsql
as $$
begin
  if new.export_status = 'running' and new.started_at is null then
    new.started_at := now();
  end if;
  if new.export_status in ('completed', 'failed', 'cancelled') and new.completed_at is null then
    new.completed_at := now();
  end if;
  return new;
end;
$$;

create trigger set_report_export_started_completed_before_insert_update
  before insert or update of export_status
  on report_export_run
  for each row execute function set_report_export_started_completed();

create trigger set_partner_datasheet_export_started_completed_before_insert_update
  before insert or update of export_status
  on partner_product_datasheet_export_run
  for each row execute function set_report_export_started_completed();

create trigger set_report_definition_updated_at
  before update on report_definition
  for each row execute function set_updated_at();

create trigger set_saved_report_configuration_updated_at
  before update on saved_report_configuration
  for each row execute function set_updated_at();

create trigger set_scheduled_report_updated_at
  before update on scheduled_report
  for each row execute function set_updated_at();

create trigger set_dashboard_definition_updated_at
  before update on dashboard_definition
  for each row execute function set_updated_at();

create trigger set_dashboard_widget_definition_updated_at
  before update on dashboard_widget_definition
  for each row execute function set_updated_at();

insert into permission (permission_code, permission_area, name, description)
values
  ('reports.view', 'reports', 'Reports View', 'View report definitions, dashboards, and report results.'),
  ('reports.export', 'reports', 'Reports Export', 'Export reports as PDF, Excel, or CSV.'),
  ('reports.configuration.manage_own', 'reports', 'Manage Own Report Configurations', 'Create and edit personal saved report configurations.'),
  ('reports.configuration.share', 'reports', 'Share Report Configurations', 'Create role, department, or global saved report configurations.'),
  ('reports.schedule.manage', 'reports', 'Manage Scheduled Reports', 'Create and maintain scheduled report emails.'),
  ('dashboard.warehouse_shipping.view', 'reports', 'Warehouse / Shipping Dashboard View', 'View warehouse and shipping dashboard queues and summaries.'),
  ('dashboard.rga.view', 'reports', 'RGA Dashboard View', 'View RGA action dashboard and RGA report links.'),
  ('dashboard.reps_commissions.view', 'reports', 'Reps / Commissions Dashboard View', 'View reps, territories, commission summaries, and map-ready assignments.')
on conflict (permission_code) do nothing;

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
    'shipping.backordered_items',
    'Backordered Item Report',
    'shipping',
    'Snapshot of backordered items with drilldown to POs/customers plus on-hand, incoming, and ETA.',
    '{"period":"open"}',
    '{"brand":true,"sku":true,"territory":true,"customer":true}',
    '["sku","name","brand","total_backordered_quantity","order_count","customer_count","quantity_on_hand","incoming_quantity","next_eta"]',
    '["sku","name","brand","total_backordered_quantity","quantity_on_hand","incoming_quantity","next_eta"]',
    array['screen','pdf','xlsx']::report_output_format[],
    true,
    'dashboard.warehouse_shipping.view',
    false
  ),
  (
    'finance.company_dashboard',
    'Company Financial Dashboard',
    'ar',
    'Top-level company financial snapshot with invoices, payments, overdue invoices, open packing lists, credit memos, and vendor payables.',
    '{"period":"year_to_date"}',
    '{"brand":true,"period":true}',
    '["invoice_count","invoice_amount","paid_invoice_count","open_invoice_balance","overdue_invoice_count","credit_memo_amount","vendor_po_payables"]',
    '["invoice_count","invoice_amount","open_invoice_balance","overdue_invoice_count","credit_memo_amount"]',
    array['screen','pdf','xlsx']::report_output_format[],
    true,
    'ar.financial_dashboard.view',
    false
  ),
  (
    'rga.action_dashboard',
    'RGA Action Dashboard',
    'rga',
    'Top-level RGA work queue for open RGA, approved awaiting return, awaiting credit memo, and replacement orders to ship.',
    '{"status":"open"}',
    '{"status":true,"reason":true,"customer":true,"period":true}',
    '["rga_number","customer","original_po","request_date","status","solution","action_bucket"]',
    '["rga_number","customer","original_po","request_date","status","solution","action_bucket"]',
    array['screen','pdf','xlsx']::report_output_format[],
    false,
    'dashboard.rga.view',
    false
  ),
  (
    'product.performance_audit',
    'Product Performance Audit',
    'product_performance',
    'Internal product performance report using order date, reducing returns/credit memos and excluding display orders by default.',
    '{"period_months":12,"date_basis":"order_date","exclude_display_orders":true}',
    '{"brand":true,"eligibility":true,"sku":true,"customer_type":true,"territory":true,"period":true}',
    '["sku","name","brand","eligibility","sold_pieces","sold_amount","pieces_by_customer_type","top_territories","return_quantity","return_amount"]',
    '["sku","name","brand","sold_pieces","sold_amount","pieces_by_customer_type","top_territories"]',
    array['screen','pdf','xlsx']::report_output_format[],
    true,
    'product.performance_audit.view',
    false
  ),
  (
    'product.best_seller',
    'Best Seller List',
    'market_analysis',
    'External-safe best seller list filtered by territory and ranked by sold pieces or sold amount, with images but no sales details.',
    '{"period_months":12,"rank_size":20,"ranking_basis":"sold_pieces","include_images":true}',
    '{"brand":true,"territory":true,"period":true,"rank_size":true,"ranking_basis":true}',
    '["rank","sku","name","brand","thumbnail"]',
    '["rank","sku","name","brand","thumbnail"]',
    array['screen','pdf','xlsx']::report_output_format[],
    true,
    'product.best_seller.view',
    true
  ),
  (
    'primary_showroom.display_performance',
    'Primary Showroom Display Performance',
    'customer',
    'Account-level active display performance by location with annualized sold pieces and amount; original display order quantity excluded.',
    '{"period_months":24}',
    '{"customer":true,"location":true,"period":true}',
    '["location","sku","shipped_date","discount_rate","display_po","sold_pieces","sold_amount","annualized_pieces"]',
    '["location","sku","shipped_date","discount_rate","display_po","sold_pieces","sold_amount","annualized_pieces"]',
    array['screen','pdf','xlsx']::report_output_format[],
    true,
    'customer.view',
    false
  ),
  (
    'purchasing.open_vendor_pos',
    'Open Vendor PO Dashboard',
    'purchasing',
    'Purchasing and receiving dashboard source for open vendor POs, container status, receiving, and putaway work.',
    '{"status":"open"}',
    '{"vendor":true,"brand":true,"status":true,"period":true}',
    '["vendor_po_number","vendor","po_date","status","line_count","open_quantity","next_expected_ready_date"]',
    '["vendor_po_number","vendor","po_date","status","open_quantity","next_expected_ready_date"]',
    array['screen','pdf','xlsx']::report_output_format[],
    true,
    'purchasing.dashboard.view',
    false
  )
on conflict (report_code) do nothing;

insert into dashboard_definition (dashboard_code, name, department, description, default_filters_json, permission_code)
values
  ('warehouse_shipping', 'Warehouse / Shipping Dashboard', 'Warehouse', 'Daily warehouse work surface for shipping queue, backorders, RGA returns, inspections, and incoming containers.', '{"period":"open"}', 'dashboard.warehouse_shipping.view'),
  ('financial', 'Financial Dashboard', 'Accounting', 'Company financial snapshot for invoices, payments, overdue balances, credit memos, un-invoiced packing lists, and vendor payables.', '{"period":"year_to_date"}', 'ar.financial_dashboard.view'),
  ('rga', 'RGA Dashboard', 'Customer Service', 'Top-level RGA action dashboard and RGA reports.', '{"status":"open"}', 'dashboard.rga.view'),
  ('purchasing_receiving', 'Purchasing / Receiving Dashboard', 'Purchasing', 'Purchasing, receiving, container, vendor, and putaway snapshot.', '{"status":"open"}', 'purchasing.dashboard.view'),
  ('reps_commissions', 'Reps / Commissions Dashboard', 'Sales', 'Rep, territory, commission history, and map-ready territory assignment work surface.', '{"period":"year_to_date"}', 'dashboard.reps_commissions.view'),
  ('product_market_analysis', 'Product / Market Analysis Dashboard', 'Product', 'Product performance audit, best seller list, and partner datasheet export work surface.', '{"period_months":12}', 'product.performance_audit.view'),
  ('primary_showroom', 'Primary Showroom Dashboard', 'Sales', 'Account-level active display performance dashboard grouped by location.', '{"period_months":24}', 'customer.view'),
  ('customer_account', 'Customer Account Dashboard', 'Customer Service', 'Customer account dashboard summary by location for orders, display orders, shipments, invoices, RGA, and performance.', '{"period_months":12}', 'customer.view')
on conflict (dashboard_code) do nothing;

insert into dashboard_widget_definition (dashboard_definition_id, widget_code, name, widget_type, display_order, data_source_name, drilldown_report_definition_id)
select dd.id, widget_code, widget_name, widget_type::dashboard_widget_type, display_order, data_source_name, rd.id
from dashboard_definition dd
join (
  values
    ('warehouse_shipping'::dashboard_code, 'shipping_queue', 'Shipping Queue', 'queue', 10, 'shipping_dashboard_open_queue', null),
    ('warehouse_shipping'::dashboard_code, 'backorders', 'Backorders', 'table', 20, 'backordered_item_report', 'shipping.backordered_items'),
    ('financial'::dashboard_code, 'financial_snapshot', 'Financial Snapshot', 'metric', 10, 'financial_dashboard_current_snapshot', 'finance.company_dashboard'),
    ('rga'::dashboard_code, 'rga_action_queue', 'RGA Action Queue', 'queue', 10, 'rga_dashboard_action_queue', 'rga.action_dashboard'),
    ('purchasing_receiving'::dashboard_code, 'open_vendor_pos', 'Open Vendor POs', 'table', 10, 'purchasing_dashboard_open_items', 'purchasing.open_vendor_pos'),
    ('product_market_analysis'::dashboard_code, 'product_performance_audit', 'Product Performance Audit', 'table', 10, 'report_definition', 'product.performance_audit'),
    ('product_market_analysis'::dashboard_code, 'best_seller_list', 'Best Seller List', 'table', 20, 'report_definition', 'product.best_seller'),
    ('primary_showroom'::dashboard_code, 'display_performance', 'Display Performance', 'chart', 10, 'report_definition', 'primary_showroom.display_performance')
) as seed(dashboard_code, widget_code, widget_name, widget_type, display_order, data_source_name, drilldown_report_code)
  on seed.dashboard_code = dd.dashboard_code
left join report_definition rd on rd.report_code = seed.drilldown_report_code
on conflict (dashboard_definition_id, widget_code) do nothing;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'
from role r
join permission p on p.permission_code in (
  'reports.view',
  'reports.export',
  'reports.configuration.manage_own',
  'reports.configuration.share',
  'reports.schedule.manage',
  'dashboard.warehouse_shipping.view',
  'dashboard.rga.view',
  'dashboard.reps_commissions.view'
)
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in ('reports.configuration.share', 'reports.schedule.manage') then 'view'::permission_level
    else 'edit'::permission_level
  end
from role r
join permission p on p.permission_code in (
  'reports.view',
  'reports.export',
  'reports.configuration.manage_own',
  'reports.configuration.share',
  'reports.schedule.manage',
  'dashboard.warehouse_shipping.view',
  'dashboard.rga.view',
  'dashboard.reps_commissions.view'
)
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update set permission_level = excluded.permission_level;
