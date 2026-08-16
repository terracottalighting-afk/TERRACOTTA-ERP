grant update (
  brand_id,
  collection,
  counts_toward_primary_showroom_default,
  customer_eligibility_tag,
  default_price,
  default_vendor_item_number,
  description,
  description_word_count,
  name,
  no_box_needed,
  primary_showroom_exclusion_reason,
  product_category_id,
  sellability_status,
  signature_suite_id,
  sku,
  status
) on table product to service_role;
