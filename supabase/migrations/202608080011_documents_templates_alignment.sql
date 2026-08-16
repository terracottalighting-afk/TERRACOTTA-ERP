create type document_output_format as enum ('pdf', 'xlsx', 'csv', 'html');
create type document_action_type as enum ('preview', 'download', 'email', 'regenerate');
create type document_template_scope as enum ('brand_specific', 'combined_brand', 'brand_neutral');
create type document_recipient_source as enum ('billing_email', 'order_contact_snapshot', 'vendor_contact', 'showroom_contact', 'manual_entry');
create type document_audience as enum ('customer', 'vendor', 'internal', 'rep');

alter table email_template
  add column if not exists template_type text,
  add column if not exists available_merge_fields_json jsonb not null default '[]'::jsonb,
  add column if not exists default_from_identity text,
  add column if not exists created_by_user_id uuid references user_account(id),
  add column if not exists updated_by_user_id uuid references user_account(id),
  add column if not exists created_at timestamptz not null default now();

update email_template
set template_type = coalesce(template_type, entity_type)
where template_type is null;

alter table email_template
  alter column template_type set not null;

alter table document_template
  add column if not exists template_scope document_template_scope,
  add column if not exists output_format document_output_format not null default 'pdf',
  add column if not exists template_file_name text,
  add column if not exists template_file_path text,
  add column if not exists header_asset_file_id uuid references attachment(id) on delete set null,
  add column if not exists footer_asset_file_id uuid references attachment(id) on delete set null,
  add column if not exists combined_logo_file_id uuid references attachment(id) on delete set null,
  add column if not exists show_logo boolean not null default true,
  add column if not exists include_header_on_internal_pdf boolean not null default false,
  add column if not exists audience document_audience not null default 'customer',
  add column if not exists available_merge_fields_json jsonb not null default '[]'::jsonb,
  add column if not exists render_options_json jsonb not null default '{}'::jsonb,
  add column if not exists created_by_user_id uuid references user_account(id),
  add column if not exists updated_by_user_id uuid references user_account(id),
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update document_template
set template_scope = case
  when template_variant in ('combined_brand', 'combined brand') then 'combined_brand'::document_template_scope
  when brand_id is not null then 'brand_specific'::document_template_scope
  else 'brand_neutral'::document_template_scope
end
where template_scope is null;

alter table document_template
  alter column template_scope set not null;

create unique index if not exists document_template_one_default_active
  on document_template(document_type, coalesce(brand_id, '00000000-0000-0000-0000-000000000000'::uuid), template_scope, output_format)
  where is_default and is_active;

alter table email_send_history
  add column if not exists from_identity_snapshot text,
  add column if not exists recipient_source document_recipient_source,
  add column if not exists manual_recipient_override boolean not null default false,
  add column if not exists related_generated_document_event_id uuid references generated_document_event(id) on delete set null,
  add column if not exists created_at timestamptz not null default now();

alter table generated_document_event
  add column if not exists action_type_normalized document_action_type,
  add column if not exists output_format_normalized document_output_format,
  add column if not exists audience document_audience,
  add column if not exists brand_id uuid references brand(id) on delete set null,
  add column if not exists render_parameters_json jsonb not null default '{}'::jsonb,
  add column if not exists source_snapshot_refs_json jsonb not null default '{}'::jsonb,
  add column if not exists metadata_json jsonb not null default '{}'::jsonb;

update generated_document_event
set
  action_type_normalized = case lower(action_type)
    when 'preview' then 'preview'::document_action_type
    when 'previewed' then 'preview'::document_action_type
    when 'download' then 'download'::document_action_type
    when 'downloaded' then 'download'::document_action_type
    when 'email' then 'email'::document_action_type
    when 'emailed' then 'email'::document_action_type
    when 'regenerate' then 'regenerate'::document_action_type
    when 'regenerated' then 'regenerate'::document_action_type
    else null
  end,
  output_format_normalized = case lower(output_format)
    when 'pdf' then 'pdf'::document_output_format
    when 'xlsx' then 'xlsx'::document_output_format
    when 'excel' then 'xlsx'::document_output_format
    when 'csv' then 'csv'::document_output_format
    when 'html' then 'html'::document_output_format
    else null
  end
where action_type_normalized is null
   or output_format_normalized is null;

create table document_generation_policy (
  id uuid primary key default gen_random_uuid(),
  document_type text not null,
  audience document_audience not null,
  brand_id uuid references brand(id) on delete cascade,
  template_scope document_template_scope not null,
  default_output_format document_output_format not null default 'pdf',
  default_document_template_id uuid references document_template(id) on delete set null,
  default_email_template_id uuid references email_template(id) on delete set null,
  logo_scope document_template_scope not null default 'brand_specific',
  combined_logo_file_id uuid references attachment(id) on delete set null,
  include_logo_header boolean not null default true,
  store_generated_file_copy boolean not null default false,
  allow_download boolean not null default true,
  allow_email boolean not null default true,
  allow_preview boolean not null default true,
  is_active boolean not null default true,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint document_generation_policy_type_not_blank check (btrim(document_type) <> ''),
  constraint document_generation_policy_no_generated_copy check (store_generated_file_copy = false),
  unique(document_type, audience, brand_id)
);

create index document_generation_policy_type_idx on document_generation_policy(document_type, audience);

create table document_recipient_rule (
  id uuid primary key default gen_random_uuid(),
  document_type text not null,
  entity_type text not null,
  brand_id uuid references brand(id) on delete cascade,
  primary_recipient_source document_recipient_source not null,
  cc_recipient_sources document_recipient_source[] not null default '{}'::document_recipient_source[],
  allow_manual_override boolean not null default true,
  fallback_to_manual_entry boolean not null default true,
  is_active boolean not null default true,
  notes text,
  created_by_user_id uuid references user_account(id),
  updated_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint document_recipient_rule_type_not_blank check (btrim(document_type) <> ''),
  constraint document_recipient_rule_entity_not_blank check (btrim(entity_type) <> ''),
  unique(document_type, entity_type, brand_id)
);

create index document_recipient_rule_type_idx on document_recipient_rule(document_type, entity_type);

create table document_template_version (
  id uuid primary key default gen_random_uuid(),
  document_template_id uuid not null references document_template(id) on delete cascade,
  version_label text not null,
  template_file_id uuid references attachment(id) on delete set null,
  template_file_name text,
  template_file_path text,
  render_options_json jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  effective_from timestamptz not null default now(),
  effective_to timestamptz,
  created_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  notes text,
  constraint document_template_version_label_not_blank check (btrim(version_label) <> ''),
  constraint document_template_version_effective_order check (effective_to is null or effective_to > effective_from),
  unique(document_template_id, version_label)
);

create index document_template_version_template_idx on document_template_version(document_template_id);
create index document_template_version_active_idx on document_template_version(document_template_id) where is_active;

create table document_merge_field_definition (
  id uuid primary key default gen_random_uuid(),
  merge_field_code text not null unique,
  label text not null,
  entity_type text not null,
  data_path text not null,
  description text,
  sample_value text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint document_merge_field_code_not_blank check (btrim(merge_field_code) <> ''),
  constraint document_merge_field_label_not_blank check (btrim(label) <> ''),
  constraint document_merge_field_data_path_not_blank check (btrim(data_path) <> '')
);

create index document_merge_field_entity_idx on document_merge_field_definition(entity_type);

create or replace view generated_document_event_metadata as
select
  gde.id,
  gde.entity_type,
  gde.entity_id,
  gde.document_type,
  gde.document_number,
  gde.document_template_id,
  dt.template_code,
  dt.template_name,
  gde.output_format,
  coalesce(gde.output_format_normalized::text, lower(gde.output_format)) as normalized_output_format,
  gde.action_type,
  coalesce(gde.action_type_normalized::text, lower(gde.action_type)) as normalized_action_type,
  gde.audience,
  gde.brand_id,
  gde.generated_by_user_id,
  gde.generated_at,
  gde.email_send_history_id,
  gde.render_parameters_json,
  gde.source_snapshot_refs_json,
  gde.metadata_json
from generated_document_event gde
left join document_template dt on dt.id = gde.document_template_id;

create or replace function set_generated_document_event_normalized_fields()
returns trigger
language plpgsql
as $$
begin
  new.action_type_normalized := coalesce(new.action_type_normalized, case lower(new.action_type)
    when 'preview' then 'preview'::document_action_type
    when 'previewed' then 'preview'::document_action_type
    when 'download' then 'download'::document_action_type
    when 'downloaded' then 'download'::document_action_type
    when 'email' then 'email'::document_action_type
    when 'emailed' then 'email'::document_action_type
    when 'regenerate' then 'regenerate'::document_action_type
    when 'regenerated' then 'regenerate'::document_action_type
    else null
  end);

  new.output_format_normalized := coalesce(new.output_format_normalized, case lower(new.output_format)
    when 'pdf' then 'pdf'::document_output_format
    when 'xlsx' then 'xlsx'::document_output_format
    when 'excel' then 'xlsx'::document_output_format
    when 'csv' then 'csv'::document_output_format
    when 'html' then 'html'::document_output_format
    else null
  end);

  if new.document_template_id is not null and new.audience is null then
    select audience into new.audience
    from document_template
    where id = new.document_template_id;
  end if;

  return new;
end;
$$;

create trigger set_generated_document_event_normalized_fields_before_insert_update
  before insert or update of action_type, output_format, document_template_id
  on generated_document_event
  for each row execute function set_generated_document_event_normalized_fields();

create trigger set_email_template_updated_at
  before update on email_template
  for each row execute function set_updated_at();

create trigger set_document_template_updated_at
  before update on document_template
  for each row execute function set_updated_at();

create trigger set_document_generation_policy_updated_at
  before update on document_generation_policy
  for each row execute function set_updated_at();

create trigger set_document_recipient_rule_updated_at
  before update on document_recipient_rule
  for each row execute function set_updated_at();

create trigger set_document_merge_field_definition_updated_at
  before update on document_merge_field_definition
  for each row execute function set_updated_at();

insert into permission (permission_code, permission_area, name, description)
values
  ('document.template.view', 'document', 'Document Template View', 'View document and email template settings.'),
  ('document.template.manage', 'document', 'Document Template Manage', 'Create and edit document/email templates, versions, and render settings.'),
  ('document.policy.manage', 'document', 'Document Policy Manage', 'Manage document generation policies and default recipient rules.'),
  ('document.history.view', 'document', 'Document History View', 'View generated document and email event metadata.')
on conflict (permission_code) do nothing;

insert into document_generation_policy (
  document_type,
  audience,
  template_scope,
  default_output_format,
  logo_scope,
  include_logo_header,
  store_generated_file_copy,
  allow_download,
  allow_email,
  allow_preview,
  notes
)
values
  ('invoice', 'customer', 'brand_specific', 'pdf', 'brand_specific', true, false, true, true, true, 'Brand-specific invoice PDF; generated from invoice data on demand.'),
  ('credit_memo', 'customer', 'brand_specific', 'pdf', 'brand_specific', true, false, true, true, true, 'Brand-specific credit memo PDF; generated from credit memo data on demand.'),
  ('customer_statement', 'customer', 'combined_brand', 'pdf', 'combined_brand', true, false, true, true, true, 'Combined account statement across brands by default.'),
  ('packing_list', 'customer', 'combined_brand', 'pdf', 'combined_brand', true, false, true, false, true, 'Final customer-facing packing list uses combined-brand header by default.'),
  ('shipping_preparation_packing_list', 'internal', 'brand_neutral', 'pdf', 'brand_neutral', false, false, true, false, true, 'Warehouse preparation packing list; internal one-time generated document.'),
  ('order_acknowledgement', 'customer', 'combined_brand', 'pdf', 'combined_brand', true, false, true, true, true, 'Customer order acknowledgement for the full PO with brand information at line level.'),
  ('pro_forma_invoice', 'customer', 'combined_brand', 'pdf', 'combined_brand', true, false, true, true, true, 'Credit-hold order acknowledgement sent as pro forma invoice.'),
  ('rga_approval_sheet', 'customer', 'combined_brand', 'pdf', 'combined_brand', true, false, true, true, true, 'Combined-brand RGA approval acknowledgement even when multiple brands are involved.'),
  ('vendor_purchase_order', 'vendor', 'brand_neutral', 'pdf', 'brand_neutral', true, false, true, true, true, 'Vendor PO includes ERP SKU, vendor item number, and product brand.'),
  ('payment_reminder', 'customer', 'brand_specific', 'pdf', 'brand_specific', true, false, true, true, true, 'Payment reminders are sent by individual brand identity.'),
  ('internal_report', 'internal', 'brand_neutral', 'pdf', 'brand_neutral', false, false, true, false, true, 'Internal report PDFs do not include company logo/header by default.')
on conflict (document_type, audience, brand_id) do nothing;

insert into document_recipient_rule (
  document_type,
  entity_type,
  primary_recipient_source,
  cc_recipient_sources,
  allow_manual_override,
  fallback_to_manual_entry,
  notes
)
values
  ('invoice', 'customer_invoice', 'billing_email', '{}'::document_recipient_source[], true, true, 'Invoice email defaults to billing email; users may override manually.'),
  ('credit_memo', 'credit_memo', 'billing_email', '{}'::document_recipient_source[], true, true, 'Credit memo email defaults to billing email; users may override manually.'),
  ('customer_statement', 'customer_statement', 'billing_email', '{}'::document_recipient_source[], true, true, 'Statements default to billing email.'),
  ('order_acknowledgement', 'sales_order', 'order_contact_snapshot', '{}'::document_recipient_source[], true, true, 'Order-related emails default to the order contact snapshot.'),
  ('pro_forma_invoice', 'sales_order', 'order_contact_snapshot', '{}'::document_recipient_source[], true, true, 'Credit-hold pro forma order emails default to order contact snapshot.'),
  ('rga_approval_sheet', 'rga', 'order_contact_snapshot', '{}'::document_recipient_source[], true, true, 'RGA approval sheet defaults to the original order contact snapshot.'),
  ('vendor_purchase_order', 'vendor_purchase_order', 'vendor_contact', '{}'::document_recipient_source[], true, true, 'Vendor PO emails default to selected vendor contact.'),
  ('primary_showroom_renewal_notice', 'primary_showroom_enrollment', 'showroom_contact', '{}'::document_recipient_source[], true, true, 'Primary showroom renewal notices default to configured showroom contact.')
on conflict (document_type, entity_type, brand_id) do nothing;

insert into document_merge_field_definition (merge_field_code, label, entity_type, data_path, description, sample_value)
values
  ('customer.current_account_number', 'Current Account Number', 'customer_account', 'customer_account.account_number', 'Displayed as Current Account No. on customer-facing documents.', '1234567890'),
  ('customer.legacy_account_number', 'Legacy Account Number', 'customer_account', 'customer_account.legacy_account_id', 'Displayed under the current account number when available.', 'C12345'),
  ('sales_order.customer_po_number', 'Customer PO Number', 'sales_order', 'sales_order.customer_po_number', 'Customer-entered or system-generated PO number.', 'PO-10025'),
  ('sales_order.sales_order_number', 'Sales Order Number', 'sales_order', 'sales_order.sales_order_number', 'ERP generated sales order number.', 'SO20260808-000123'),
  ('invoice.invoice_number', 'Invoice Number', 'customer_invoice', 'customer_invoice.invoice_number', 'Brand-specific invoice number.', 'TD-INV20260808-000123'),
  ('credit_memo.credit_memo_number', 'Credit Memo Number', 'credit_memo', 'credit_memo.credit_memo_number', 'Brand-specific credit memo number.', 'TD-CM20260808-000045'),
  ('rga.rga_number', 'RGA Number', 'rga', 'rga.rga_number', 'Shared RGA number across brands.', 'RGA20260808-000012'),
  ('brand.name', 'Brand Name', 'brand', 'brand.brand_name', 'Brand/company name for document header.', 'Terracotta Designs'),
  ('document.generated_at', 'Generated At', 'generated_document_event', 'generated_document_event.generated_at', 'Document generation timestamp.', '2026-08-08 15:30')
on conflict (merge_field_code) do nothing;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'
from role r
join permission p on p.permission_code in (
  'document.template.view',
  'document.template.manage',
  'document.policy.manage',
  'document.history.view'
)
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in ('document.template.manage', 'document.policy.manage') then 'view'::permission_level
    else 'edit'::permission_level
  end
from role r
join permission p on p.permission_code in (
  'document.template.view',
  'document.template.manage',
  'document.policy.manage',
  'document.history.view'
)
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update set permission_level = excluded.permission_level;
