alter type freight_terms add value if not exists 'flat_rate';

alter table customer_freight_policy
  add column if not exists freight_terms freight_terms not null default 'prepaid',
  add column if not exists freight_allowance_amount numeric(12,2),
  add column if not exists flat_rate_percent numeric(5,2),
  add constraint customer_freight_allowance_nonnegative
    check (freight_allowance_amount is null or freight_allowance_amount >= 0),
  add constraint customer_freight_flat_rate_percent_check
    check (flat_rate_percent is null or flat_rate_percent >= 0);
