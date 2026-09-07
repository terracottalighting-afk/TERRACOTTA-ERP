alter table sales_rep
  alter column sales_rep_agency_id drop not null;

notify pgrst, 'reload schema';
