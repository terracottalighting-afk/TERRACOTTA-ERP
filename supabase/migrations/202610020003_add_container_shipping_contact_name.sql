alter table public.import_container
  add column if not exists shipping_agent_contact_name text;
