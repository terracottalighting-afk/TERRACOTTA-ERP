begin;

alter table public.import_container
  alter column container_status drop default;

alter table public.import_container
  alter column container_status type text using container_status::text;

alter table public.import_container
  alter column container_status set default 'draft';

insert into public.system_setting (
  setting_key,
  setting_value,
  value_type,
  category,
  setting_label,
  description,
  default_value_json,
  validation_json
)
values (
  'purchasing_container_statuses',
  '["Draft", "Booked", "Loaded", "On Water", "Customs Cleared", "Delivered", "Cancelled"]'::jsonb,
  'json',
  'purchasing',
  'Container Statuses',
  'Comma-separated statuses available when updating a container.',
  '["Draft", "Booked", "Loaded", "On Water", "Customs Cleared", "Delivered", "Cancelled"]'::jsonb,
  '{"type": "array", "items": {"type": "string"}, "minItems": 1}'::jsonb
)
on conflict (setting_key) do update
set
  category = excluded.category,
  setting_label = excluded.setting_label,
  description = excluded.description,
  default_value_json = excluded.default_value_json,
  validation_json = excluded.validation_json,
  value_type = excluded.value_type;

commit;
