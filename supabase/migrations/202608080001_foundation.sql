create extension if not exists pgcrypto;

create type user_type as enum ('internal', 'customer_portal', 'rep_portal', 'system');
create type permission_level as enum ('none', 'view', 'create', 'edit', 'approve_post', 'void', 'admin');
create type permission_override_type as enum ('add', 'restrict', 'deny');
create type impersonation_status as enum ('active', 'ended', 'expired');
create type import_status as enum ('draft', 'running', 'completed_with_errors', 'completed', 'approved', 'cancelled');
create type record_import_status as enum ('success', 'warning', 'failed', 'skipped');
create type qa_status as enum ('planned', 'in_progress', 'passed', 'failed', 'accepted');
create type defect_severity as enum ('emergency', 'critical', 'high', 'medium', 'low');
create type defect_status as enum ('open', 'in_progress', 'ready_for_retest', 'closed', 'deferred');

create table brand (
  id uuid primary key default gen_random_uuid(),
  brand_code text not null unique,
  name text not null,
  legal_company_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table user_account (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text not null unique,
  display_name text not null,
  user_type user_type not null default 'internal',
  department text,
  default_landing_dashboard text,
  internal_employee_code text,
  is_active boolean not null default true,
  mfa_enabled boolean not null default false,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table role (
  id uuid primary key default gen_random_uuid(),
  role_code text not null unique,
  name text not null,
  user_type user_type not null default 'internal',
  description text,
  is_system_role boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table permission (
  id uuid primary key default gen_random_uuid(),
  permission_code text not null unique,
  permission_area text not null,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table user_role (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_account(id) on delete cascade,
  role_id uuid not null references role(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  assigned_by_user_id uuid references user_account(id),
  is_active boolean not null default true
);

create unique index user_role_active_unique
  on user_role(user_id, role_id)
  where is_active;

create table role_permission (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references role(id) on delete cascade,
  permission_id uuid not null references permission(id) on delete cascade,
  permission_level permission_level not null default 'none',
  created_at timestamptz not null default now(),
  unique(role_id, permission_id)
);

create table user_permission_override (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_account(id) on delete cascade,
  permission_id uuid not null references permission(id) on delete cascade,
  permission_level permission_level not null,
  override_type permission_override_type not null,
  reason text not null,
  expires_at timestamptz,
  is_permanent boolean not null default false,
  review_due_at timestamptz,
  last_reviewed_at timestamptz,
  last_reviewed_by_user_id uuid references user_account(id),
  created_by_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  constraint permanent_override_review_due_check
    check (not is_permanent or review_due_at is not null)
);

create table user_impersonation_session (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references user_account(id),
  impersonated_user_id uuid not null references user_account(id),
  reason text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  ended_by_user_id uuid references user_account(id),
  status impersonation_status not null default 'active',
  ip_address inet,
  user_agent text
);

create table user_data_scope (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_account(id) on delete cascade,
  scope_type text not null,
  scope_entity_id uuid,
  is_primary boolean not null default false,
  is_active boolean not null default true
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  action text not null,
  old_values_json jsonb,
  new_values_json jsonb,
  changed_by_user_id uuid references user_account(id),
  impersonated_user_id uuid references user_account(id),
  impersonation_session_id uuid references user_impersonation_session(id),
  changed_at timestamptz not null default now(),
  ip_address inet,
  user_agent text
);

create table system_setting (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value jsonb,
  value_type text not null default 'json',
  description text,
  updated_by_user_id uuid references user_account(id),
  updated_at timestamptz not null default now()
);

create table document_number_sequence (
  id uuid primary key default gen_random_uuid(),
  sequence_code text not null,
  document_type text not null,
  brand_id uuid references brand(id),
  prefix text,
  next_number bigint not null default 1,
  padding_length integer not null default 6,
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  unique(sequence_code),
  unique(document_type, brand_id)
);

create table attachment (
  id uuid primary key default gen_random_uuid(),
  entity_type text,
  entity_id uuid,
  category text,
  original_file_name text not null,
  content_type text,
  file_size bigint,
  storage_bucket text not null,
  storage_path text not null,
  uploaded_by_user_id uuid references user_account(id),
  uploaded_at timestamptz not null default now(),
  is_active boolean not null default true
);

create table email_template (
  id uuid primary key default gen_random_uuid(),
  template_code text not null unique,
  name text not null,
  entity_type text not null,
  brand_id uuid references brand(id),
  subject_template text not null,
  body_template text not null,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table document_template (
  id uuid primary key default gen_random_uuid(),
  template_code text not null unique,
  document_type text not null,
  brand_id uuid references brand(id),
  template_variant text not null default 'standard',
  template_name text not null,
  template_file_id uuid references attachment(id),
  is_default boolean not null default false,
  is_active boolean not null default true
);

create table email_send_history (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  email_template_id uuid references email_template(id),
  to_addresses text[] not null default '{}',
  cc_addresses text[] not null default '{}',
  bcc_addresses text[] not null default '{}',
  subject_snapshot text not null,
  body_snapshot text not null,
  attachment_ids_json jsonb,
  generated_document_refs_json jsonb,
  send_status text not null default 'draft',
  error_message text,
  sent_by_user_id uuid references user_account(id),
  sent_at timestamptz
);

create table generated_document_event (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  document_type text not null,
  document_number text,
  document_template_id uuid references document_template(id),
  output_format text not null,
  action_type text not null,
  generated_by_user_id uuid references user_account(id),
  generated_at timestamptz not null default now(),
  email_send_history_id uuid references email_send_history(id)
);

create table data_import_batch (
  id uuid primary key default gen_random_uuid(),
  batch_number text not null unique,
  source_system text not null,
  import_type text not null,
  source_file_name text,
  environment text not null default 'development',
  status import_status not null default 'draft',
  started_at timestamptz,
  completed_at timestamptz,
  total_rows integer not null default 0,
  success_rows integer not null default 0,
  warning_rows integer not null default 0,
  failed_rows integer not null default 0,
  created_by_user_id uuid references user_account(id),
  approved_by_user_id uuid references user_account(id),
  approved_at timestamptz,
  notes text
);

create table data_import_record (
  id uuid primary key default gen_random_uuid(),
  data_import_batch_id uuid not null references data_import_batch(id) on delete cascade,
  source_row_number integer,
  source_entity_type text not null,
  source_entity_id text,
  erp_entity_type text,
  erp_entity_id uuid,
  status record_import_status not null,
  message text,
  source_payload_json jsonb,
  created_at timestamptz not null default now()
);

create table legacy_id_map (
  id uuid primary key default gen_random_uuid(),
  source_system text not null,
  source_entity_type text not null,
  source_entity_id text not null,
  erp_entity_type text not null,
  erp_entity_id uuid not null,
  data_import_batch_id uuid references data_import_batch(id),
  created_at timestamptz not null default now(),
  unique(source_system, source_entity_type, source_entity_id)
);

create index legacy_id_map_erp_entity_idx on legacy_id_map(erp_entity_type, erp_entity_id);

create table qa_defect (
  id uuid primary key default gen_random_uuid(),
  defect_number text not null unique,
  module_area text not null,
  title text not null,
  description text,
  severity defect_severity not null,
  status defect_status not null default 'open',
  workaround text,
  owner_approved_workaround boolean not null default false,
  reported_by_user_id uuid references user_account(id),
  assigned_to_user_id uuid references user_account(id),
  reported_at timestamptz not null default now(),
  closed_at timestamptz
);

create table training_feedback (
  id uuid primary key default gen_random_uuid(),
  submitted_by_user_id uuid references user_account(id),
  department text,
  feedback_type text not null,
  description text not null,
  status text not null default 'open',
  assigned_to_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table go_live_issue (
  id uuid primary key default gen_random_uuid(),
  issue_number text not null unique,
  reported_by_user_id uuid references user_account(id),
  department text,
  module_area text not null,
  severity defect_severity not null,
  issue_type text not null,
  title text not null,
  description text,
  business_impact text,
  related_entity_type text,
  related_entity_id uuid,
  workaround text,
  status defect_status not null default 'open',
  assigned_to_user_id uuid references user_account(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolution_notes text
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger brand_updated_at before update on brand
  for each row execute function set_updated_at();

create trigger user_account_updated_at before update on user_account
  for each row execute function set_updated_at();

create trigger role_updated_at before update on role
  for each row execute function set_updated_at();

insert into brand (brand_code, name, legal_company_name)
values
  ('TD', 'Terracotta Designs', 'Terracotta Designs'),
  ('KC', 'Kanova & Co.', 'Kanova & Co.')
on conflict (brand_code) do nothing;

insert into permission (permission_code, permission_area, name, description)
values
  ('admin.users.view', 'admin', 'View users', 'View ERP user accounts'),
  ('admin.users.manage', 'admin', 'Manage users', 'Create and edit ERP user accounts'),
  ('admin.roles.manage', 'admin', 'Manage roles', 'Create and edit roles and permissions'),
  ('admin.impersonation.start', 'admin', 'Start impersonation', 'Start an audited troubleshooting impersonation session'),
  ('settings.manage', 'admin', 'Manage settings', 'Edit system settings'),
  ('audit.view', 'admin', 'View audit log', 'View sensitive action history')
on conflict (permission_code) do nothing;

insert into role (role_code, name, user_type, description, is_system_role)
values
  ('system_admin', 'System Admin', 'internal', 'Full ERP administration role', true),
  ('operations_manager', 'Operations Manager', 'internal', 'Operations and launch support leadership role', true)
on conflict (role_code) do nothing;
