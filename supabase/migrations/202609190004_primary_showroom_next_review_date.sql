begin;

alter table public.primary_showroom_enrollment
  add column if not exists next_review_date date;

commit;
