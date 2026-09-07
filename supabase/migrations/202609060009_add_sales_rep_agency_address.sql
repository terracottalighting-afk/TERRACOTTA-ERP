alter table sales_rep_agency
  add column if not exists address_line_1 text,
  add column if not exists address_line_2 text,
  add column if not exists city text,
  add column if not exists state_province text,
  add column if not exists postal_code text,
  add column if not exists country text not null default 'United States';
