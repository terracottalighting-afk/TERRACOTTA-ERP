do $$
declare
  test_user_id uuid;
  td_brand_id uuid;
  kc_brand_id uuid;
  account_type_id uuid;
  business_type_id uuid;
  customer_id uuid;
  location_id uuid;
  billing_profile_id uuid;
  freight_policy_id_value uuid;
  territory_id_value uuid;
  agency_id uuid;
  rep_id uuid;
  suite_id uuid;
  pendant_category_id uuid;
  chandelier_category_id uuid;
  brass_finish_id uuid;
  bronze_finish_id uuid;
  warehouse_id_value uuid;
  zone_id uuid;
  bin_a_id uuid;
  bin_b_id uuid;
  hold_location_id uuid;
  td_product_id uuid;
  kc_product_id uuid;
  td_box_id uuid;
  kc_box_id uuid;
  td_attachment_id uuid;
  kc_attachment_id uuid;
  sales_order_id_value uuid;
  sales_order_line_1_id uuid;
  sales_order_line_2_id uuid;
  freight_shipment_id_value uuid;
  packing_list_id_value uuid;
  packing_line_1_id uuid;
  packing_line_2_id uuid;
begin
  insert into user_account (
    email,
    display_name,
    user_type,
    department,
    default_landing_dashboard,
    internal_employee_code,
    is_active,
    mfa_enabled
  )
  values (
    'test.admin@terracotta.local',
    'TEST Admin User',
    'internal',
    'Operations',
    'customer_account',
    'TEST-ADMIN',
    true,
    true
  )
  on conflict (email) do update
  set display_name = excluded.display_name,
      mfa_enabled = true,
      is_active = true
  returning id into test_user_id;

  select id into td_brand_id from brand where brand_code = 'TD';
  select id into kc_brand_id from brand where brand_code = 'KC';
  select id into account_type_id from customer_account_type where type_code = 'stocking_dealer';
  select id into business_type_id from customer_business_type where type_code = 'lighting_showroom';

  insert into territory (
    territory_code,
    name,
    description,
    state_codes_json,
    map_color,
    map_sort_order,
    created_by_user_id
  )
  values (
    'TEST-SW',
    'TEST Southwest Territory',
    'Test territory covering Texas, Oklahoma, and New Mexico.',
    '["TX","OK","NM"]'::jsonb,
    '#2f6f9f',
    10,
    test_user_id
  )
  on conflict (territory_code) do update
  set name = excluded.name
  returning id into territory_id_value;

  insert into sales_rep_agency (
    agency_code,
    name,
    main_contact_name,
    email,
    phone,
    ach_payment_status,
    commission_default_percent,
    portal_access_enabled,
    created_by_user_id
  )
  values (
    'TEST-SW-REP',
    'TEST Southwest Rep Agency',
    'Taylor Test',
    'test.rep.agency@example.com',
    '512-555-0100',
    'active',
    10.00,
    false,
    test_user_id
  )
  on conflict (agency_code) do update
  set name = excluded.name,
      commission_default_percent = excluded.commission_default_percent
  returning id into agency_id;

  insert into sales_rep (
    sales_rep_agency_id,
    name,
    email,
    phone,
    role_title,
    is_principal,
    created_by_user_id
  )
  values (
    agency_id,
    'TEST Riley Sales Rep',
    'test.rep@example.com',
    '512-555-0110',
    'Rep',
    false,
    test_user_id
  )
  returning id into rep_id;

  insert into territory_assignment (
    territory_id,
    sales_rep_agency_id,
    start_date,
    status,
    created_by_user_id
  )
  values (
    territory_id_value,
    agency_id,
    current_date,
    'active',
    test_user_id
  );

  insert into customer_account (
    name,
    legal_name,
    account_type_id,
    business_type_id,
    status,
    default_discount_percent,
    is_sales_tax_exempt,
    main_phone,
    main_email,
    purchase_contact_name,
    purchase_email,
    billing_contact_name,
    billing_phone,
    billing_email,
    legacy_account_id,
    notes,
    created_by_user_id
  )
  values (
    'TEST Austin Lighting Showroom',
    'TEST Austin Lighting Showroom LLC',
    account_type_id,
    business_type_id,
    'active',
    10.00,
    false,
    '512-555-0200',
    'info@test-austin-lighting.example',
    'Jordan Buyer',
    'orders@test-austin-lighting.example',
    'Morgan Billing',
    '512-555-0201',
    'billing@test-austin-lighting.example',
    'LEGACY-TEST-AUSTIN',
    'Seed customer for Phase 1 workflow testing.',
    test_user_id
  )
  returning id into customer_id;

  insert into customer_location (
    customer_account_id,
    location_code,
    location_name,
    location_type,
    address_line_1,
    city,
    state_province,
    postal_code,
    country,
    country_code,
    phone,
    email,
    receiver_name,
    is_shipping_address,
    is_default_ship_to,
    default_ship_to_order_channel,
    is_showroom,
    territory_id,
    status,
    created_by_user_id
  )
  values (
    customer_id,
    'TEST-AUS-SHOWROOM',
    'TEST Austin Main Showroom',
    'showroom',
    '100 Test Lighting Ave',
    'Austin',
    'TX',
    '78701',
    'United States',
    'USA',
    '512-555-0202',
    'showroom@test-austin-lighting.example',
    'Receiving Team',
    true,
    true,
    'manual',
    true,
    territory_id_value,
    'active',
    test_user_id
  )
  returning id into location_id;

  insert into customer_contact (
    customer_account_id,
    customer_location_id,
    name,
    title,
    department,
    phone,
    email,
    is_primary,
    is_billing_contact,
    is_purchasing_contact,
    created_by_user_id
  )
  values (
    customer_id,
    location_id,
    'TEST Jordan Buyer',
    'Purchasing Manager',
    'Purchasing',
    '512-555-0203',
    'orders@test-austin-lighting.example',
    true,
    false,
    true,
    test_user_id
  );

  insert into customer_billing_profile (
    customer_account_id,
    payment_terms,
    payment_days,
    credit_limit,
    credit_limit_source,
    statement_delivery_method,
    default_statement_email,
    invoice_delivery_method,
    billing_notes,
    created_by_user_id
  )
  values (
    customer_id,
    'Net 30',
    30,
    5000,
    'customer_override',
    'email',
    'billing@test-austin-lighting.example',
    'email',
    'Seed billing profile.',
    test_user_id
  )
  returning id into billing_profile_id;

  insert into customer_freight_policy (
    customer_account_id,
    customer_location_id,
    policy_name,
    ltl_freight_terms,
    ground_freight_terms,
    preferred_shipping_type,
    special_instructions,
    is_default,
    created_by_user_id
  )
  values (
    customer_id,
    location_id,
    'TEST Default Prepaid Freight',
    'prepaid',
    'prepaid',
    'parcel',
    'Seed freight policy for workflow testing.',
    true,
    test_user_id
  )
  returning id into freight_policy_id_value;

  update customer_location
  set freight_policy_id = freight_policy_id_value
  where id = location_id;

  insert into customer_location_rep_assignment (
    customer_location_id,
    territory_id,
    sales_rep_agency_id,
    sales_rep_id,
    coverage_role,
    start_date,
    assignment_source,
    status,
    created_by_user_id
  )
  values (
    location_id,
    territory_id_value,
    agency_id,
    rep_id,
    'primary',
    current_date,
    'manual',
    'active',
    test_user_id
  );

  insert into product_signature_suite (
    suite_code,
    name,
    brand_id,
    description,
    sort_order,
    created_by_user_id
  )
  values (
    'TEST-MODERN',
    'TEST Modern Signature Suite',
    td_brand_id,
    'Seed signature suite.',
    10,
    test_user_id
  )
  on conflict (suite_code) do update
  set name = excluded.name
  returning id into suite_id;

  insert into product_category (
    category_code,
    name,
    counts_toward_primary_showroom_default,
    sort_order,
    created_by_user_id
  )
  values
    ('TEST-PENDANT', 'TEST Pendant', true, 10, test_user_id),
    ('TEST-CHANDELIER', 'TEST Chandelier', true, 20, test_user_id)
  on conflict (category_code) do update
  set name = excluded.name;

  select id into pendant_category_id from product_category where category_code = 'TEST-PENDANT';
  select id into chandelier_category_id from product_category where category_code = 'TEST-CHANDELIER';

  insert into finish (
    finish_name,
    description,
    sort_order,
    created_by_user_id
  )
  values
    ('TEST Aged Brass', 'Seed finish: aged brass.', 10, test_user_id),
    ('TEST Dark Bronze', 'Seed finish: dark bronze.', 20, test_user_id)
  on conflict (finish_name) do update
  set description = excluded.description;

  select id into brass_finish_id from finish where finish_name = 'TEST Aged Brass';
  select id into bronze_finish_id from finish where finish_name = 'TEST Dark Bronze';

  insert into warehouse (
    warehouse_code,
    name,
    address_line_1,
    city,
    state_province,
    postal_code,
    country,
    country_code,
    is_active,
    notes,
    created_by_user_id
  )
  values (
    'TEST-MAIN',
    'TEST Main Warehouse',
    '200 Test Warehouse Dr',
    'Austin',
    'TX',
    '78702',
    'United States',
    'USA',
    true,
    'Seed warehouse.',
    test_user_id
  )
  on conflict (warehouse_code) do update
  set name = excluded.name
  returning id into warehouse_id_value;

  insert into warehouse_zone (
    warehouse_id,
    zone_code,
    name,
    sort_order,
    created_by_user_id
  )
  values (
    warehouse_id_value,
    'TEST-A',
    'TEST Pick Zone A',
    10,
    test_user_id
  )
  on conflict (warehouse_id, zone_code) do update
  set name = excluded.name
  returning id into zone_id;

  insert into warehouse_location (
    warehouse_id,
    warehouse_zone_id,
    location_code,
    location_name,
    location_type,
    is_pickable,
    created_by_user_id
  )
  values
    (warehouse_id_value, zone_id, 'TEST-A-01', 'TEST Bin A-01', 'bin', true, test_user_id),
    (warehouse_id_value, zone_id, 'TEST-A-02', 'TEST Bin A-02', 'bin', true, test_user_id),
    (warehouse_id_value, zone_id, 'TEST-HOLD', 'TEST Hold Location', 'hold', false, test_user_id)
  on conflict (warehouse_id, location_code) do update
  set location_name = excluded.location_name;

  select id into bin_a_id from warehouse_location where warehouse_id = warehouse_id_value and location_code = 'TEST-A-01';
  select id into bin_b_id from warehouse_location where warehouse_id = warehouse_id_value and location_code = 'TEST-A-02';
  select id into hold_location_id from warehouse_location where warehouse_id = warehouse_id_value and location_code = 'TEST-HOLD';

  insert into product (
    sku,
    brand_id,
    name,
    description,
    description_word_count,
    signature_suite_id,
    product_category_id,
    collection,
    status,
    sellability_status,
    customer_eligibility_tag,
    counts_toward_primary_showroom_default,
    default_price,
    currency,
    notes,
    created_by_user_id
  )
  values (
    'TEST-TD-PENDANT-01',
    td_brand_id,
    'TEST Terracotta Pendant',
    'A seed Terracotta Designs pendant for ERP workflow testing.',
    10,
    suite_id,
    pendant_category_id,
    'TEST Collection',
    'active',
    'sellable',
    'all',
    true,
    250.00,
    'USD',
    'Seed product.',
    test_user_id
  )
  on conflict (sku) do update
  set name = excluded.name,
      default_price = excluded.default_price
  returning id into td_product_id;

  insert into product (
    sku,
    brand_id,
    name,
    description,
    description_word_count,
    signature_suite_id,
    product_category_id,
    collection,
    status,
    sellability_status,
    customer_eligibility_tag,
    counts_toward_primary_showroom_default,
    default_price,
    currency,
    notes,
    created_by_user_id
  )
  values (
    'TEST-KC-CHANDELIER-01',
    kc_brand_id,
    'TEST Kanova Chandelier',
    'A seed Kanova chandelier for ERP workflow testing.',
    10,
    suite_id,
    chandelier_category_id,
    'TEST Collection',
    'active',
    'sellable',
    'all',
    true,
    450.00,
    'USD',
    'Seed product.',
    test_user_id
  )
  on conflict (sku) do update
  set name = excluded.name,
      default_price = excluded.default_price
  returning id into kc_product_id;

  insert into product_finish (product_id, finish_id, sort_order, created_by_user_id)
  values
    (td_product_id, brass_finish_id, 10, test_user_id),
    (kc_product_id, bronze_finish_id, 10, test_user_id)
  on conflict do nothing;

  insert into attachment (
    entity_type,
    entity_id,
    category,
    original_file_name,
    content_type,
    file_size,
    storage_bucket,
    storage_path,
    uploaded_by_user_id
  )
  values
    ('product', td_product_id, 'stock_image', 'TEST-TD-PENDANT-01.jpg', 'image/jpeg', 0, 'test-assets', 'products/TEST-TD-PENDANT-01.jpg', test_user_id),
    ('product', kc_product_id, 'stock_image', 'TEST-KC-CHANDELIER-01.jpg', 'image/jpeg', 0, 'test-assets', 'products/TEST-KC-CHANDELIER-01.jpg', test_user_id);

  select id into td_attachment_id from attachment where storage_bucket = 'test-assets' and storage_path = 'products/TEST-TD-PENDANT-01.jpg' limit 1;
  select id into kc_attachment_id from attachment where storage_bucket = 'test-assets' and storage_path = 'products/TEST-KC-CHANDELIER-01.jpg' limit 1;

  insert into product_image (
    product_id,
    file_id,
    image_category,
    display_name,
    sort_order,
    is_default_thumbnail,
    uploaded_by_user_id
  )
  values
    (td_product_id, td_attachment_id, 'stock', 'TEST TD Pendant Stock Image', 10, true, test_user_id),
    (kc_product_id, kc_attachment_id, 'stock', 'TEST KC Chandelier Stock Image', 10, true, test_user_id)
  on conflict do nothing;

  insert into product_packing_box (
    product_id,
    box_sequence,
    box_label,
    net_weight,
    gross_weight,
    box_length,
    box_width,
    box_height,
    cbm,
    default_warehouse_id,
    default_warehouse_location_id,
    is_required_for_sale,
    created_by_user_id
  )
  values (
    td_product_id,
    1,
    'TEST TD Pendant Box',
    8.000,
    10.000,
    20.000,
    18.000,
    14.000,
    0.083000,
    warehouse_id_value,
    bin_a_id,
    true,
    test_user_id
  )
  on conflict do nothing;

  insert into product_packing_box (
    product_id,
    box_sequence,
    box_label,
    net_weight,
    gross_weight,
    box_length,
    box_width,
    box_height,
    cbm,
    default_warehouse_id,
    default_warehouse_location_id,
    is_required_for_sale,
    created_by_user_id
  )
  values (
    kc_product_id,
    1,
    'TEST KC Chandelier Box',
    18.000,
    22.000,
    30.000,
    28.000,
    24.000,
    0.330000,
    warehouse_id_value,
    bin_b_id,
    true,
    test_user_id
  )
  on conflict do nothing;

  select id into td_box_id from product_packing_box where product_id = td_product_id and box_sequence = 1 and is_active limit 1;
  select id into kc_box_id from product_packing_box where product_id = kc_product_id and box_sequence = 1 and is_active limit 1;

  insert into inventory_balance (
    product_id,
    product_packing_box_id,
    warehouse_id,
    warehouse_location_id,
    inventory_condition,
    quantity_on_hand,
    quantity_allocated,
    last_movement_at
  )
  values
    (td_product_id, td_box_id, warehouse_id_value, bin_a_id, 'regular', 12, 0, now()),
    (kc_product_id, kc_box_id, warehouse_id_value, bin_b_id, 'regular', 8, 0, now())
  on conflict do nothing;

  insert into sales_order (
    customer_account_id,
    customer_location_id,
    ship_to_type,
    customer_po_number,
    order_date,
    order_source,
    order_type,
    status,
    shipping_readiness_status,
    credit_hold_status,
    acknowledgement_document_type,
    payment_terms_snapshot,
    freight_amount,
    tax_amount,
    sales_rep_agency_id_snapshot,
    sales_rep_id_snapshot,
    territory_id_snapshot,
    notes,
    created_by_user_id
  )
  values (
    customer_id,
    location_id,
    'saved_location',
    'TEST-PO-1001',
    current_date,
    'manual',
    'regular',
    'open',
    'ready',
    'none',
    'order_acknowledgement',
    'Net 30',
    0,
    0,
    agency_id,
    rep_id,
    territory_id_value,
    'Seed order ready for shipment release and invoice creation testing.',
    test_user_id
  )
  returning id into sales_order_id_value;

  insert into sales_order_line (
    sales_order_id,
    line_number,
    product_id,
    quantity_ordered,
    unit_price,
    discount_percent,
    requested_ship_date,
    line_status,
    created_by_user_id
  )
  values (
    sales_order_id_value,
    1,
    td_product_id,
    2,
    250.00,
    10.00,
    current_date,
    'open',
    test_user_id
  )
  returning id into sales_order_line_1_id;

  insert into sales_order_line (
    sales_order_id,
    line_number,
    product_id,
    quantity_ordered,
    unit_price,
    discount_percent,
    requested_ship_date,
    line_status,
    created_by_user_id
  )
  values (
    sales_order_id_value,
    2,
    kc_product_id,
    1,
    450.00,
    10.00,
    current_date,
    'open',
    test_user_id
  )
  returning id into sales_order_line_2_id;

  insert into freight_shipment (
    customer_account_id,
    ship_to_location_id,
    ship_to_type,
    is_dropship,
    ship_to_snapshot_json,
    carrier,
    shipping_type,
    freight_terms_snapshot,
    total_gross_weight,
    total_inch_volume,
    total_cbm,
    carton_count,
    freight_cost,
    status,
    notes,
    created_by_user_id
  )
  values (
    customer_id,
    location_id,
    'saved_location',
    false,
    (select ship_to_snapshot_json from sales_order where id = sales_order_id_value),
    'TEST UPS Ground',
    'parcel',
    'prepaid',
    42.000,
    40320.000,
    0.496000,
    3,
    125.00,
    'pending',
    'Seed shipment ready for release testing.',
    test_user_id
  )
  returning id into freight_shipment_id_value;

  insert into packing_list (
    freight_shipment_id,
    sales_order_id,
    carrier_snapshot,
    shipping_type_snapshot,
    shipping_fee,
    allocated_freight_cost,
    status,
    invoice_generation_status_snapshot,
    invoice_required,
    created_by_user_id
  )
  values (
    freight_shipment_id_value,
    sales_order_id_value,
    'TEST UPS Ground',
    'parcel',
    125.00,
    125.00,
    'draft',
    'not_invoiced',
    true,
    test_user_id
  )
  returning id into packing_list_id_value;

  insert into packing_list_line (
    packing_list_id,
    sales_order_line_id,
    warehouse_id,
    warehouse_location_id,
    quantity_shipped,
    created_by_user_id
  )
  values (
    packing_list_id_value,
    sales_order_line_1_id,
    warehouse_id_value,
    bin_a_id,
    2,
    test_user_id
  )
  returning id into packing_line_1_id;

  insert into packing_list_line (
    packing_list_id,
    sales_order_line_id,
    warehouse_id,
    warehouse_location_id,
    quantity_shipped,
    created_by_user_id
  )
  values (
    packing_list_id_value,
    sales_order_line_2_id,
    warehouse_id_value,
    bin_b_id,
    1,
    test_user_id
  )
  returning id into packing_line_2_id;

  insert into packing_list_line_box (
    packing_list_line_id,
    product_id,
    product_packing_box_id,
    warehouse_id,
    warehouse_location_id,
    box_quantity_shipped
  )
  values
    (packing_line_1_id, td_product_id, td_box_id, warehouse_id_value, bin_a_id, 2),
    (packing_line_2_id, kc_product_id, kc_box_id, warehouse_id_value, bin_b_id, 1);

  raise notice 'Phase 1 seed data created. Test user id: %, test sales order id: %, test freight shipment id: %, test packing list id: %',
    test_user_id, sales_order_id_value, freight_shipment_id_value, packing_list_id_value;
end;
$$;
