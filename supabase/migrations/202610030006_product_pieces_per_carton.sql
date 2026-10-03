alter table public.product
  add column if not exists pieces_per_carton numeric(14,3) not null default 1;

alter table public.product
  drop constraint if exists product_pieces_per_carton_positive;

alter table public.product
  add constraint product_pieces_per_carton_positive
  check (pieces_per_carton > 0);

grant update (pieces_per_carton) on table public.product to service_role;
