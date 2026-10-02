alter table public.import_container
  add column if not exists shipping_agent_contact_email text,
  add column if not exists expected_loading_date date,
  add column if not exists actual_loading_date date,
  add column if not exists actual_vessel_departure_date date,
  add column if not exists arrival_port text,
  add column if not exists tariff_broker_agency text,
  add column if not exists broker_contact_name text,
  add column if not exists broker_contact_email text;
