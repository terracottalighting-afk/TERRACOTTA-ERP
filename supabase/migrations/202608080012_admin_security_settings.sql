create type permission_override_status as enum ('active', 'expired', 'revoked');
create type system_setting_category as enum (
  'security',
  'customer',
  'product',
  'order',
  'shipping',
  'inventory',
  'purchasing',
  'ar',
  'rga',
  'reports',
  'documents',
  'integration',
  'migration',
  'general'
);
create type admin_security_event_type as enum (
  'login',
  'logout',
  'mfa_challenge',
  'mfa_enrolled',
  'mfa_disabled',
  'impersonation_started',
  'impersonation_ended',
  'permission_override_created',
  'permission_override_reviewed',
  'permission_override_revoked',
  'setting_changed',
  'role_changed',
  'user_disabled',
  'user_enabled'
);

alter table user_account
  add column if not exists customer_account_id uuid references customer_account(id) on delete set null,
  add column if not exists default_customer_location_id uuid references customer_location(id) on delete set null,
  add column if not exists portal_scope_entity_id uuid,
  add column if not exists mfa_required boolean not null default false,
  add column if not exists mfa_enforced_at timestamptz,
  add column if not exists mfa_last_verified_at timestamptz,
  add column if not exists disabled_at timestamptz,
  add column if not exists disabled_by_user_id uuid references user_account(id),
  add column if not exists disabled_reason text;

create index if not exists user_account_customer_idx on user_account(customer_account_id);
create index if not exists user_account_mfa_required_idx on user_account(mfa_required) where is_active;

alter table user_account
  add constraint user_account_customer_portal_scope_check
  check (
    user_type <> 'customer_portal'
    or customer_account_id is not null
  );

alter table user_account
  add constraint user_account_disabled_check
  check (
    is_active
    or (disabled_at is not null and disabled_reason is not null)
  );

alter table permission
  add column if not exists permission_action text,
  add column if not exists is_sensitive boolean not null default false,
  add column if not exists updated_at timestamptz not null default now();

update permission
set permission_action = coalesce(permission_action, split_part(permission_code, '.', array_length(string_to_array(permission_code, '.'), 1)))
where permission_action is null;

alter table permission
  alter column permission_action set not null;

alter table role_permission
  add column if not exists created_by_user_id uuid references user_account(id),
  add column if not exists updated_by_user_id uuid references user_account(id),
  add column if not exists updated_at timestamptz not null default now();

alter table user_role
  add column if not exists removed_at timestamptz,
  add column if not exists removed_by_user_id uuid references user_account(id),
  add column if not exists removal_reason text,
  add column if not exists updated_at timestamptz not null default now();

alter table user_permission_override
  add column if not exists status permission_override_status not null default 'active',
  add column if not exists approved_by_user_id uuid references user_account(id),
  add column if not exists approved_at timestamptz,
  add column if not exists revoked_by_user_id uuid references user_account(id),
  add column if not exists revoked_at timestamptz,
  add column if not exists revoke_reason text,
  add column if not exists updated_at timestamptz not null default now();

alter table user_permission_override
  add constraint user_permission_override_temporary_expiration_check
  check (is_permanent or expires_at is not null);

alter table user_permission_override
  add constraint user_permission_override_revoked_check
  check (
    status <> 'revoked'
    or (revoked_by_user_id is not null and revoked_at is not null and revoke_reason is not null)
  );

create index if not exists user_permission_override_user_idx on user_permission_override(user_id);
create index if not exists user_permission_override_permission_idx on user_permission_override(permission_id);
create index if not exists user_permission_override_review_idx on user_permission_override(review_due_at) where status = 'active' and is_permanent;
create index if not exists user_permission_override_expiration_idx on user_permission_override(expires_at) where status = 'active' and not is_permanent;

alter table user_impersonation_session
  add column if not exists max_duration_minutes integer not null default 60,
  add column if not exists last_activity_at timestamptz not null default now(),
  add column if not exists ended_reason text;

alter table user_impersonation_session
  add constraint user_impersonation_no_self_check check (admin_user_id <> impersonated_user_id);

alter table user_impersonation_session
  add constraint user_impersonation_duration_positive check (max_duration_minutes > 0);

alter table user_impersonation_session
  add constraint user_impersonation_end_check
  check (
    status = 'active'
    or (ended_at is not null and ended_by_user_id is not null)
  );

create unique index if not exists user_impersonation_one_active_admin
  on user_impersonation_session(admin_user_id)
  where status = 'active';

create index if not exists user_impersonation_impersonated_idx on user_impersonation_session(impersonated_user_id);
create index if not exists user_impersonation_status_idx on user_impersonation_session(status);

alter table system_setting
  add column if not exists category system_setting_category not null default 'general',
  add column if not exists setting_label text,
  add column if not exists is_sensitive boolean not null default false,
  add column if not exists is_user_editable boolean not null default true,
  add column if not exists validation_json jsonb not null default '{}'::jsonb,
  add column if not exists default_value_json jsonb,
  add column if not exists created_by_user_id uuid references user_account(id),
  add column if not exists created_at timestamptz not null default now();

update system_setting
set setting_label = coalesce(setting_label, initcap(replace(setting_key, '_', ' ')))
where setting_label is null;

alter table system_setting
  alter column setting_label set not null;

create index if not exists system_setting_category_idx on system_setting(category);

create table system_setting_change_history (
  id uuid primary key default gen_random_uuid(),
  system_setting_id uuid references system_setting(id) on delete set null,
  setting_key text not null,
  old_value jsonb,
  new_value jsonb,
  changed_by_user_id uuid references user_account(id),
  changed_at timestamptz not null default now(),
  change_reason text,
  impersonation_session_id uuid references user_impersonation_session(id),
  constraint system_setting_change_key_not_blank check (btrim(setting_key) <> '')
);

create index system_setting_change_history_setting_idx on system_setting_change_history(setting_key);
create index system_setting_change_history_changed_at_idx on system_setting_change_history(changed_at);

create table admin_security_event (
  id uuid primary key default gen_random_uuid(),
  event_type admin_security_event_type not null,
  actor_user_id uuid references user_account(id),
  target_user_id uuid references user_account(id),
  permission_id uuid references permission(id),
  role_id uuid references role(id),
  system_setting_id uuid references system_setting(id),
  impersonation_session_id uuid references user_impersonation_session(id),
  ip_address inet,
  user_agent text,
  event_payload_json jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index admin_security_event_type_idx on admin_security_event(event_type);
create index admin_security_event_actor_idx on admin_security_event(actor_user_id);
create index admin_security_event_target_idx on admin_security_event(target_user_id);
create index admin_security_event_occurred_idx on admin_security_event(occurred_at);

create or replace view active_permission_overrides as
select
  upo.id,
  upo.user_id,
  ua.email,
  ua.display_name,
  upo.permission_id,
  p.permission_code,
  p.permission_area,
  upo.permission_level,
  upo.override_type,
  upo.reason,
  upo.is_permanent,
  upo.expires_at,
  upo.review_due_at,
  upo.last_reviewed_at,
  upo.created_by_user_id,
  upo.created_at,
  case
    when upo.status <> 'active' then upo.status::text
    when not upo.is_permanent and upo.expires_at <= now() then 'expired'
    when upo.is_permanent and upo.review_due_at <= now() then 'review_due'
    else 'active'
  end as effective_status
from user_permission_override upo
join user_account ua on ua.id = upo.user_id
join permission p on p.id = upo.permission_id
where upo.status = 'active';

create or replace view users_missing_required_mfa as
select
  ua.id as user_id,
  ua.email,
  ua.display_name,
  ua.user_type,
  ua.department,
  ua.mfa_required,
  ua.mfa_enabled,
  ua.mfa_enforced_at
from user_account ua
where ua.is_active
  and ua.mfa_required
  and not ua.mfa_enabled;

create or replace view active_impersonation_sessions as
select
  uis.id,
  uis.admin_user_id,
  admin.email as admin_email,
  admin.display_name as admin_display_name,
  uis.impersonated_user_id,
  target.email as impersonated_email,
  target.display_name as impersonated_display_name,
  uis.reason,
  uis.started_at,
  uis.last_activity_at,
  uis.max_duration_minutes,
  uis.started_at + make_interval(mins => uis.max_duration_minutes) as expires_at,
  case
    when now() >= uis.started_at + make_interval(mins => uis.max_duration_minutes) then true
    else false
  end as should_expire
from user_impersonation_session uis
join user_account admin on admin.id = uis.admin_user_id
join user_account target on target.id = uis.impersonated_user_id
where uis.status = 'active';

create or replace function set_internal_user_mfa_required()
returns trigger
language plpgsql
as $$
begin
  if new.user_type = 'internal' and new.mfa_required = false then
    new.mfa_required := true;
  end if;
  if new.mfa_required and new.mfa_enforced_at is null then
    new.mfa_enforced_at := now();
  end if;
  if new.is_active = false and new.disabled_at is null then
    new.disabled_at := now();
  end if;
  return new;
end;
$$;

create or replace function expire_permission_override_status()
returns trigger
language plpgsql
as $$
begin
  if not new.is_permanent and new.expires_at <= now() and new.status = 'active' then
    new.status := 'expired';
  end if;
  return new;
end;
$$;

create or replace function log_system_setting_change()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'UPDATE' and old.setting_value is distinct from new.setting_value then
    insert into system_setting_change_history (
      system_setting_id,
      setting_key,
      old_value,
      new_value,
      changed_by_user_id
    )
    values (
      new.id,
      new.setting_key,
      old.setting_value,
      new.setting_value,
      new.updated_by_user_id
    );
  end if;
  return new;
end;
$$;

create or replace function log_impersonation_event()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    insert into admin_security_event (
      event_type,
      actor_user_id,
      target_user_id,
      impersonation_session_id,
      ip_address,
      user_agent,
      event_payload_json
    )
    values (
      'impersonation_started',
      new.admin_user_id,
      new.impersonated_user_id,
      new.id,
      new.ip_address,
      new.user_agent,
      jsonb_build_object('reason', new.reason, 'max_duration_minutes', new.max_duration_minutes)
    );
  elsif tg_op = 'UPDATE' and old.status = 'active' and new.status <> 'active' then
    insert into admin_security_event (
      event_type,
      actor_user_id,
      target_user_id,
      impersonation_session_id,
      ip_address,
      user_agent,
      event_payload_json
    )
    values (
      'impersonation_ended',
      coalesce(new.ended_by_user_id, new.admin_user_id),
      new.impersonated_user_id,
      new.id,
      new.ip_address,
      new.user_agent,
      jsonb_build_object('ended_reason', new.ended_reason, 'status', new.status)
    );
  end if;
  return new;
end;
$$;

create trigger set_internal_user_mfa_required_before_insert_update
  before insert or update of user_type, mfa_required, is_active
  on user_account
  for each row execute function set_internal_user_mfa_required();

create trigger expire_permission_override_status_before_insert_update
  before insert or update of expires_at, is_permanent, status
  on user_permission_override
  for each row execute function expire_permission_override_status();

create trigger log_system_setting_change_after_update
  after update of setting_value
  on system_setting
  for each row execute function log_system_setting_change();

create trigger log_impersonation_event_after_insert_update
  after insert or update of status
  on user_impersonation_session
  for each row execute function log_impersonation_event();

create trigger permission_updated_at
  before update on permission
  for each row execute function set_updated_at();

create trigger role_permission_updated_at
  before update on role_permission
  for each row execute function set_updated_at();

create trigger user_role_updated_at
  before update on user_role
  for each row execute function set_updated_at();

create trigger user_permission_override_updated_at
  before update on user_permission_override
  for each row execute function set_updated_at();

update user_account
set
  mfa_required = true,
  mfa_enforced_at = coalesce(mfa_enforced_at, now())
where user_type = 'internal'
  and mfa_required = false;

insert into system_setting (
  setting_key,
  setting_value,
  value_type,
  category,
  setting_label,
  description,
  default_value_json,
  validation_json
)
values
  ('security_mfa_required_for_internal_users', 'true'::jsonb, 'boolean', 'security', 'Require MFA For Internal Users', 'MFA is required for all internal users at Phase 1 go-live.', 'true'::jsonb, '{"type":"boolean"}'),
  ('security_impersonation_enabled', 'true'::jsonb, 'boolean', 'security', 'Allow Admin Impersonation', 'Admin users may impersonate users for troubleshooting with full audit trail.', 'true'::jsonb, '{"type":"boolean"}'),
  ('security_impersonation_max_duration_minutes', '60'::jsonb, 'number', 'security', 'Impersonation Session Duration Minutes', 'Default maximum duration for an admin impersonation session.', '60'::jsonb, '{"type":"integer","minimum":5,"maximum":240}'),
  ('security_permission_override_review_days', '180'::jsonb, 'number', 'security', 'Permission Override Review Days', 'Permanent permission overrides are allowed but should be reviewed on this cadence.', '180'::jsonb, '{"type":"integer","minimum":30,"maximum":730}'),
  ('security_audit_retention_months', '84'::jsonb, 'number', 'security', 'Audit Retention Months', 'Retention target for sensitive audit/security history.', '84'::jsonb, '{"type":"integer","minimum":12}'),
  ('customer_account_type_options_json', '["Lighting Showroom","Online Retailer","Designer","Builder","Rep","Other"]'::jsonb, 'json', 'customer', 'Customer Account Type Options', 'Admin-managed customer account type lookup list.', '["Lighting Showroom","Online Retailer","Designer","Builder","Rep","Other"]'::jsonb, '{"type":"array"}'),
  ('customer_business_type_options_json', '["Retail","Wholesale","Ecommerce","Design Trade","Construction","Other"]'::jsonb, 'json', 'customer', 'Customer Business Type Options', 'Admin-managed customer business type lookup list.', '["Retail","Wholesale","Ecommerce","Design Trade","Construction","Other"]'::jsonb, '{"type":"array"}')
on conflict (setting_key) do update
set
  setting_value = excluded.setting_value,
  value_type = excluded.value_type,
  category = excluded.category,
  setting_label = excluded.setting_label,
  description = excluded.description,
  default_value_json = excluded.default_value_json,
  validation_json = excluded.validation_json,
  updated_at = now();

insert into permission (permission_code, permission_area, name, description, permission_action, is_sensitive)
values
  ('admin.security.view', 'admin', 'Security View', 'View MFA, impersonation, permission overrides, and security event dashboards.', 'view', true),
  ('admin.security.manage', 'admin', 'Security Manage', 'Manage MFA requirements, security settings, and sensitive admin controls.', 'manage', true),
  ('admin.permission_override.manage', 'admin', 'Permission Override Manage', 'Create, review, and revoke permission overrides.', 'manage', true),
  ('admin.permission_override.review', 'admin', 'Permission Override Review', 'Review permanent permission overrides.', 'review', true),
  ('admin.impersonation.end', 'admin', 'End Impersonation', 'End active impersonation sessions.', 'end', true),
  ('settings.view', 'admin', 'View Settings', 'View system-level ERP settings.', 'view', false),
  ('settings.security.manage', 'admin', 'Manage Security Settings', 'Edit security-related system settings.', 'manage', true)
on conflict (permission_code) do update
set
  permission_area = excluded.permission_area,
  name = excluded.name,
  description = excluded.description,
  permission_action = excluded.permission_action,
  is_sensitive = excluded.is_sensitive;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id, 'admin'::permission_level
from role r
join permission p on p.permission_area = 'admin'
where r.role_code = 'system_admin'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

insert into role_permission (role_id, permission_id, permission_level)
select r.id, p.id,
  case
    when p.permission_code in ('admin.security.view', 'settings.view', 'audit.view') then 'view'::permission_level
    when p.permission_code in ('admin.permission_override.review', 'admin.impersonation.end') then 'edit'::permission_level
    else 'none'::permission_level
  end
from role r
join permission p on p.permission_area = 'admin'
where r.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;
