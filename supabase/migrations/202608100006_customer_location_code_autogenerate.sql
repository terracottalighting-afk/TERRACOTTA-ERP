create or replace function generate_customer_location_code()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  loop
    candidate := 'LOC-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    exit when not exists (
      select 1
      from customer_location
      where location_code = candidate
    );
  end loop;

  return candidate;
end;
$$;

create or replace function set_customer_location_code()
returns trigger
language plpgsql
as $$
begin
  if new.location_code is null or btrim(new.location_code) = '' then
    new.location_code := generate_customer_location_code();
  end if;

  return new;
end;
$$;

drop trigger if exists set_customer_location_code_before_insert on customer_location;

create trigger set_customer_location_code_before_insert
  before insert on customer_location
  for each row
  execute function set_customer_location_code();
