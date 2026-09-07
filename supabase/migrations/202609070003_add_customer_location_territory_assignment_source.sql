alter table customer_location
  add column territory_assignment_source text not null default 'auto'
  check (territory_assignment_source in ('auto', 'manual_unassigned'));

notify pgrst, 'reload schema';
