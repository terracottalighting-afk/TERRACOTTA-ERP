begin;

insert into public.freight_level (
  level_name,
  free_freight_allowance,
  freight_rate_percent,
  sort_order,
  is_active
)
select 'Level 0', 0, 0, 0, true
where not exists (
  select 1 from public.freight_level where level_name = 'Level 0'
);

commit;
