grant usage on schema public to service_role;

grant select on table
  customer_account,
  customer_account_type,
  customer_business_type,
  customer_location,
  customer_contact,
  customer_billing_profile,
  customer_freight_policy,
  sales_order,
  customer_invoice,
  packing_list,
  rga
to service_role;
