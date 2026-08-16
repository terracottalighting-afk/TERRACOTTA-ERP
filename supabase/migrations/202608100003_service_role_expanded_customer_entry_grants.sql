grant select on table
  territory,
  sales_rep,
  sales_rep_agency
to service_role;

grant insert on table
  customer_location,
  customer_contact,
  customer_billing_profile,
  customer_freight_policy,
  customer_location_rep_assignment
to service_role;
