begin;

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
  'dropship_settings',
  '{"isActive": true, "ratePercent": 0}'::jsonb,
  'json',
  'shipping',
  'Dropship Settings',
  'Controls the percentage fee applied to manual Ship-to / Drop Ship orders.',
  '{"isActive": true, "ratePercent": 0}'::jsonb,
  '{"type":"object"}'::jsonb
)
on conflict (setting_key) do nothing;

commit;
