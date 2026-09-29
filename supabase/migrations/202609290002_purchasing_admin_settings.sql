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
values
  (
    'purchasing_import_tariff_rate_percent',
    '39'::jsonb,
    'number',
    'purchasing',
    'Import Tariff Rate',
    'Default expected import tariff rate used for purchase-order cost planning.',
    '39'::jsonb,
    '{"minimum": 0, "maximum": 100, "type": "number"}'::jsonb
  ),
  (
    'purchasing_vendor_production_commitment',
    '"By accepting this purchase order, the vendor confirms its commitment to complete production by the stated Expected Ready Date. Delays may be subject to a late-performance charge of up to 1% of the applicable purchase-order value for each day of delay, subject to the agreed terms between Terracotta Designs / Kanova & Co. and the vendor."'::jsonb,
    'string',
    'purchasing',
    'Vendor Production Commitment',
    'Vendor-facing production commitment displayed at the bottom of purchase-order sheets.',
    '"By accepting this purchase order, the vendor confirms its commitment to complete production by the stated Expected Ready Date. Delays may be subject to a late-performance charge of up to 1% of the applicable purchase-order value for each day of delay, subject to the agreed terms between Terracotta Designs / Kanova & Co. and the vendor."'::jsonb,
    '{"minLength": 1, "type": "string"}'::jsonb
  )
on conflict (setting_key) do update
set
  category = excluded.category,
  setting_label = excluded.setting_label,
  description = excluded.description,
  default_value_json = excluded.default_value_json,
  validation_json = excluded.validation_json,
  value_type = excluded.value_type;

grant select, insert, update on table public.system_setting to service_role;

commit;
