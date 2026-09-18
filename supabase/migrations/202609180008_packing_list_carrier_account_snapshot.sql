begin;

alter table public.packing_list
  add column if not exists carrier_account_number_snapshot text;

commit;
