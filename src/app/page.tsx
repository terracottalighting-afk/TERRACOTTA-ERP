import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { FreightTermsFields, PaymentTermsCreditFields } from "./customer-terms-fields";
import { LocationRegionFields } from "./location-region-fields";
import { LocationRoleFields } from "./location-role-fields";
import { ProductDetailPartsTable } from "./product-detail-parts-table";
import { ProductLedSpecFields } from "./product-led-spec-fields";
import { ProductListRows } from "./product-list-rows";
import { ProductPartsEditRows } from "./product-parts-edit-rows";
import { PartParentProductPicker } from "./part-parent-product-picker";
import { ProductVendorRows } from "./product-vendor-rows";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type SearchParams = Promise<{
  advanced?: string;
  agency?: string;
  contact?: string;
  customer?: string;
  error?: string;
  location?: string;
  module?: string;
  notice?: string;
  product_brand?: string;
  product_category?: string;
  product_eligibility?: string;
  product_finish?: string;
  product_lights?: string;
  product_page?: string;
  product_page_size?: string;
  product_status?: string;
  product_style?: string;
  product?: string;
  return_module?: string;
  part?: string;
  image_category?: string;
  part_action?: string;
  selected_parts?: string;
  selected_vendor_products?: string;
  product_tab?: string;
  spec_section?: string;
  vendor_action?: string;
  q?: string;
  tab?: string;
}>;

type CustomerAccount = {
  id: string;
  account_number: string;
  legacy_account_id: string | null;
  name: string;
  legal_name: string | null;
  status: string;
  default_discount_percent: number;
  is_sales_tax_exempt: boolean;
  state_resale_certificate_number?: string | null;
  billing_contact_name: string | null;
  billing_email: string | null;
  purchase_contact_name: string | null;
  purchase_email: string | null;
  account_type_id: string;
  business_type_id: string;
};

type CustomerLocation = {
  id: string;
  location_code: string | null;
  location_name: string;
  location_type: string;
  city: string | null;
  state_province: string | null;
  country_code: string;
  is_shipping_address: boolean;
  is_default_ship_to: boolean;
  is_billing_address?: boolean;
  is_showroom: boolean;
  status: string;
};

type PrimaryShowroomEnrollment = {
  current_display_count?: number;
  customer_location_id: string;
  discount_percent?: number;
  enrollment_date?: string;
  expiration_date?: string | null;
  free_freight_threshold?: number | null;
  id?: string;
  pending_renew_date?: string | null;
  program_status: string;
  required_display_count?: number;
  showroom_notification_email?: string | null;
  showroom_size_classification?: string | null;
};

type ShowroomDisplay = {
  id: string;
  sku_snapshot: string;
  product_name_snapshot: string | null;
  display_status: string;
  display_shipped_date_snapshot: string | null;
  customer_po_number_snapshot: string | null;
  display_discount_percent_snapshot: number | null;
  counts_toward_primary_showroom: boolean;
};

type LocationEditRecord = CustomerLocation & {
  address_line_1: string | null;
  address_line_2: string | null;
  country: string;
  postal_code: string | null;
};

type CustomerContact = {
  id: string;
  customer_location_id?: string | null;
  name: string;
  title: string | null;
  department: string | null;
  email: string | null;
  phone?: string | null;
  mobile?: string | null;
  fax?: string | null;
  is_active?: boolean;
  is_primary: boolean;
  is_billing_contact: boolean;
  is_purchasing_contact: boolean;
  is_showroom_floor_sales?: boolean;
  is_showroom_manager?: boolean;
  is_warehouse_receiver?: boolean;
};

type SalesOrder = {
  id: string;
  sales_order_number: string;
  customer_po_number: string;
  order_date: string;
  order_source: string;
  order_type: string;
  status: string;
  shipping_readiness_status: string;
  credit_hold_status: string;
  total_amount: number;
};

type CustomerInvoice = {
  id: string;
  invoice_number: string;
  brand_name_snapshot: string;
  invoice_date: string;
  due_date: string | null;
  invoice_status: string;
  payment_status: string;
  total_amount: number;
  balance_due: number;
};

type CreditMemo = {
  amount_applied: number;
  amount_remaining: number | null;
  brand_name_snapshot: string;
  credit_memo_number: string;
  id: string;
  issue_date: string;
  reason_code: string;
  status: string;
  total_credit_amount: number | null;
};

type PackingList = {
  id: string;
  packing_list_number: string;
  customer_po_number_snapshot: string;
  status: string;
  invoice_generation_status_snapshot: string;
  shipping_fee: number;
  ship_date: string | null;
};

type Rga = {
  id: string;
  rga_number: string;
  status: string;
  requested_resolution_type: string;
  request_date: string;
};

type BillingProfile = {
  id: string;
  payment_terms: string;
  payment_days: number;
  credit_limit: number | null;
  credit_limit_source: string;
  default_statement_email: string | null;
};

type FreightPolicy = {
  default_ground_carrier?: string | null;
  default_ground_carrier_account_number?: string | null;
  default_ltl_carrier?: string | null;
  default_ltl_carrier_account_number?: string | null;
  flat_rate_percent?: number | null;
  freight_allowance_amount?: number | null;
  freight_terms?: string;
  id?: string;
  policy_name: string;
  ltl_freight_terms: string;
  ground_freight_terms: string;
  preferred_shipping_type: string | null;
};

type CustomerSalesRepAssignment = {
  agency_name: string;
  coverage_role: string;
  id: string;
  location_name: string;
  sales_rep_agency_id: string;
  sales_rep_name: string | null;
  territory_name: string | null;
};

type SalesRepAgency = {
  agency_code: string;
  commission_default_percent: number;
  email: string | null;
  main_contact_name: string | null;
  name: string;
  phone: string | null;
  status: string;
};

type CustomerAttachment = {
  category: string | null;
  content_type: string | null;
  file_size: number | null;
  id: string;
  original_file_name: string;
  storage_bucket: string;
  storage_path: string;
  uploaded_at: string;
};

type ProductListItem = {
  brand_name: string;
  category_name: string | null;
  collection: string | null;
  customer_eligibility_tag: string;
  default_price: number | null;
  id: string;
  incoming_quantity: number | null;
  name: string;
  next_incoming_eta: string | null;
  sellability_status: string;
  sellable_quantity: number | null;
  signature_suite_name: string | null;
  sku: string;
  status: string;
  parts: ProductComponentPartItem[];
};

type ProductComponentPartItem = {
  component_name: string;
  component_product_id: string;
  component_sellability_status: string;
  component_sku: string;
  component_status: string;
  id: string;
  incoming_quantity: number | null;
  next_incoming_eta: string | null;
  parent_name: string;
  parent_product_id: string;
  parent_sku: string;
  notes: string | null;
  part_name: string | null;
  part_role: string | null;
  quantity_required: number;
  is_required: boolean;
  sellable_quantity: number | null;
};

type AccessoryPartListItem = {
  brand_name: string;
  default_price: number | null;
  id: string;
  incoming_quantity: number | null;
  name: string;
  next_incoming_eta: string | null;
  parent_products: {
    id: string;
    name: string;
    part_name: string | null;
    part_role: string | null;
    quantity_required: number;
    sku: string;
  }[];
  sellability_status: string;
  sellable_quantity: number | null;
  sku: string;
  status: string;
};

type Lookup = Record<string, string>;

type SelectOption = {
  id: string;
  name: string;
};

type WarehouseLocationOption = SelectOption & {
  warehouse_id: string;
  warehouse_name: string;
};

type RepOption = SelectOption & {
  agency_id: string;
  agency_name: string;
};

type ProductSearchFilters = {
  brandId?: string;
  categoryId?: string;
  eligibility?: string;
  finishId?: string;
  lightCount?: string;
  status?: string;
  styleId?: string;
};

type ProductSearchResult = {
  items: ProductListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

type ProductPartSearchResult = {
  items: AccessoryPartListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

type ProductDetail = {
  brand_id: string;
  brand_name: string;
  category_id: string | null;
  category_name: string | null;
  collection: string | null;
  counts_toward_primary_showroom_default: boolean | null;
  currency: string;
  customer_eligibility_tag: string;
  default_price: number | null;
  default_vendor_item_number: string | null;
  description: string | null;
  documents: ProductDocumentDetail[];
  finishes: string[];
  id: string;
  images: ProductImageDetail[];
  incoming_quantity: number | null;
  inventoryBalances: ProductInventoryBalance[];
  name: string;
  next_incoming_eta: string | null;
  no_box_needed: boolean;
  packingBoxes: ProductPackingBoxDetail[];
  parts: ProductComponentPartItem[];
  primary_showroom_exclusion_reason: string | null;
  sellability_status: string;
  sellable_quantity: number | null;
  signature_suite_id: string | null;
  signature_suite_name: string | null;
  sku: string;
  specAttributes: ProductSpecAttributeDetail[];
  status: string;
  hangingConfig: ProductHangingConfigDetail | null;
  usedInParents: ProductComponentPartItem[];
  vendors: ProductVendorDetail[];
};

type ProductVendorDetail = {
  id: string;
  lead_time_days: number | null;
  minimum_order_quantity: number | null;
  unit_cost: number;
  updated_at: string;
  vendor_id: string;
  vendor_item_number: string;
  vendor_name: string;
};

type ProductPackingBoxDetail = {
  box_height: number | null;
  box_label: string | null;
  box_length: number | null;
  box_sequence: number;
  box_width: number | null;
  cbm: number | null;
  default_warehouse_id: string | null;
  default_warehouse_location_code: string | null;
  default_warehouse_location_id: string | null;
  default_warehouse_location_name: string | null;
  default_warehouse_name: string | null;
  gross_weight: number | null;
  id: string;
  inch_volume: number | null;
  is_required_for_sale: boolean;
  net_weight: number | null;
  notes: string | null;
  pallet_quantity: number | null;
};

type ProductInventoryBalance = {
  box_label: string | null;
  product_packing_box_id: string | null;
  box_sequence: number | null;
  id: string;
  inventory_condition: string;
  location_code: string;
  quantity_allocated: number;
  quantity_available: number;
  quantity_on_hand: number;
  warehouse_id: string;
  warehouse_location_id: string;
  warehouse_name: string;
};

type ProductImageCategory = "stock" | "detail" | "lifestyle" | "drawing" | "other";

type ProductImageDetail = {
  content_type: string | null;
  display_name: string | null;
  file_size: number | null;
  id: string;
  image_category: ProductImageCategory;
  is_default_thumbnail: boolean;
  original_file_name: string;
  public_url: string;
  sort_order: number;
  storage_bucket: string;
  storage_path: string;
  uploaded_at: string;
};

type ProductDocumentType = "spec_sheet" | "installation_instruction" | "manual" | "box_label" | "cad_drawing" | "other";

type ProductDocumentDetail = {
  content_type: string | null;
  display_name: string | null;
  document_type: ProductDocumentType;
  file_size: number | null;
  id: string;
  original_file_name: string;
  signed_url: string | null;
  storage_bucket: string;
  storage_path: string;
  uploaded_at: string;
};

type ProductSpecAttributeDetail = {
  attribute_name: string;
  attribute_value: string;
  id: string;
  unit: string | null;
};

type ProductHangingConfigDetail = {
  canopy_detail: string | null;
  chain_length: string | null;
  mounting_type: string | null;
  notes: string | null;
  rod_length: string | null;
  wire_length: string | null;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency"
});

const numberFormatter = new Intl.NumberFormat("en-US");

const productPartRoleOptions = [
  "Chain",
  "Rod",
  "Decor Glass",
  "Glass Shade",
  "Stone Shade",
  "Other Decor",
  "Fabric Shade",
  "Decor Nut",
  "Canopy",
  "Others"
];

const countryOptions = [
  { code: "USA", name: "United States" },
  { code: "CAN", name: "Canada" },
  { code: "MEX", name: "Mexico" },
  { code: "CHN", name: "China" }
];

function money(value: number | null | undefined) {
  return currencyFormatter.format(Number(value ?? 0));
}

function label(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function dateLabel(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function fileSizeLabel(value: number | null | undefined) {
  const size = Number(value ?? 0);

  if (!size) {
    return "Size not set";
  }

  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

async function getCustomerOptions(table: "customer_account_type" | "customer_business_type") {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from(table).select("id, name").order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SelectOption[];
}

async function getTerritoryOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("territory").select("id, name").eq("status", "active").order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SelectOption[];
}

async function getSalesRepOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sales_rep")
    .select("id, name, sales_rep_agency_id, sales_rep_agency(name)")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((rep) => ({
    agency_id: rep.sales_rep_agency_id,
    agency_name: rep.sales_rep_agency?.name ?? "Rep Agency",
    id: rep.id,
    name: rep.name
  })) as RepOption[];
}

async function getProductBrandOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("brand").select("id, name").eq("is_active", true).order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SelectOption[];
}

async function getProductStyleOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("product_signature_suite")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SelectOption[];
}

async function getProductCategoryOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("product_category")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SelectOption[];
}

async function getFinishOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("finish")
    .select("id, finish_name")
    .eq("is_active", true)
    .order("finish_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((finish) => ({
    id: finish.id,
    name: finish.finish_name
  })) as SelectOption[];
}

async function getWarehouseOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("warehouse").select("id, name").eq("is_active", true).order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SelectOption[];
}

async function getWarehouseLocationOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("warehouse_location")
    .select("id, location_code, location_name, warehouse_id, warehouse(name)")
    .eq("is_active", true)
    .order("location_code", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((location) => ({
    id: location.id,
    name: `${location.location_code}${location.location_name ? ` / ${location.location_name}` : ""}`,
    warehouse_id: location.warehouse_id,
    warehouse_name: location.warehouse?.name ?? "Warehouse"
  })) as WarehouseLocationOption[];
}

function toLookup(options: SelectOption[]) {
  return Object.fromEntries(options.map((item) => [item.id, item.name])) as Lookup;
}

async function createCustomerAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const name = String(formData.get("name") ?? "").trim();
  const accountTypeId = String(formData.get("account_type_id") ?? "").trim();
  const businessTypeId = String(formData.get("business_type_id") ?? "").trim();
  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const mainLocationContactName = optionalText("main_location_contact_name");
  const billingContactName = optionalText("billing_contact_name");

  if (!name || !accountTypeId || !businessTypeId || !mainLocationContactName || !billingContactName) {
    redirect("/?module=add-customer&error=missing_required");
  }

  const defaultDiscount = Number(formData.get("default_discount_percent") ?? 0);
  const creditLimitRaw = optionalText("credit_limit");
  const creditLimit = creditLimitRaw ? Number(creditLimitRaw) : null;
  const locationName = optionalText("location_name");
  const territoryId = optionalText("territory_id");
  const salesRepSelection = optionalText("sales_rep_selection");
  const [salesRepId, salesRepAgencyId] = salesRepSelection ? salesRepSelection.split("|") : [null, null];
  const countryCode = optionalText("country_code") ?? "USA";
  const country = countryOptions.find((option) => option.code === countryCode)?.name ?? "United States";
  const statusValue = String(formData.get("status") ?? "active");
  const status = ["pending", "active", "inactive", "credit_hold"].includes(statusValue)
    ? (statusValue as "pending" | "active" | "inactive" | "credit_hold")
    : "active";
  const freightTerm = (value: FormDataEntryValue | null) => {
    const text = String(value ?? "prepaid");
    return ["prepaid", "collect", "customer_pickup", "free_freight", "flat_rate", "manual_review"].includes(text)
      ? (text as "prepaid" | "collect" | "customer_pickup" | "free_freight" | "flat_rate" | "manual_review")
      : "prepaid";
  };
  const freightTerms = freightTerm(formData.get("freight_terms"));
  const freightAllowanceRaw = optionalText("freight_allowance_amount");
  const flatRateRaw = optionalText("flat_rate_percent");

  const { data, error } = await supabase
    .from("customer_account")
    .insert({
      account_type_id: accountTypeId,
      billing_contact_name: billingContactName,
      billing_email: optionalText("billing_contact_email"),
      business_type_id: businessTypeId,
      default_discount_percent: Number.isFinite(defaultDiscount) ? defaultDiscount : 0,
      is_sales_tax_exempt: formData.get("is_sales_tax_exempt") === "on",
      legacy_account_id: optionalText("legacy_account_id"),
      legal_name: optionalText("legal_name"),
      state_resale_certificate_number: optionalText("state_resale_certificate_number"),
      name,
      purchase_contact_name: formData.get("main_contact_is_purchasing") === "on" ? mainLocationContactName : null,
      purchase_email: formData.get("main_contact_is_purchasing") === "on" ? optionalText("main_location_contact_email") : null,
      status
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/?module=add-customer&error=${encodeURIComponent(error.message)}`);
  }

  const customerId = data.id;

  const { error: billingError } = await supabase.from("customer_billing_profile").insert({
    credit_limit: creditLimit,
    credit_limit_source: creditLimit === null ? "system_default" : "customer_override",
    customer_account_id: customerId,
    default_statement_email: optionalText("billing_contact_email"),
    invoice_delivery_method: optionalText("billing_contact_email") ? "email" : "print",
    payment_days: Number(formData.get("payment_days") ?? 0),
    payment_terms: optionalText("payment_terms") ?? "Due on Receipt",
    statement_delivery_method: optionalText("billing_contact_email") ? "email" : "print"
  });

  if (billingError) {
    redirect(`/?module=add-customer&error=${encodeURIComponent(billingError.message)}`);
  }

  let locationId: string | null = null;
  const isShowroom = formData.get("is_showroom") === "on";
  const isPrimaryShowroom = isShowroom && formData.get("is_primary_showroom") === "on";

  if (locationName) {
    const { data: locationData, error: locationError } = await supabase
      .from("customer_location")
      .insert({
        address_line_1: optionalText("address_line_1"),
        address_line_2: optionalText("address_line_2"),
        city: optionalText("city"),
        country,
        country_code: countryCode,
        customer_account_id: customerId,
        default_ship_to_order_channel: formData.get("is_default_ship_to") === "on" ? "manual" : null,
        email: null,
        is_default_ship_to: formData.get("is_default_ship_to") === "on",
        is_billing_address: formData.get("is_billing_address") === "on",
        is_shipping_address: formData.get("is_shipping_address") === "on",
        is_showroom: isShowroom,
        location_name: locationName,
        location_type: isShowroom ? "showroom" : "ship_to",
        phone: null,
        postal_code: optionalText("postal_code"),
        receiver_name: null,
        state_province: optionalText("state_province"),
        status: "active",
        territory_id: territoryId
      })
      .select("id")
      .single();

    if (locationError) {
      redirect(`/?module=add-customer&error=${encodeURIComponent(locationError.message)}`);
    }

    locationId = locationData.id;

    if (isPrimaryShowroom) {
      const { error: showroomError } = await supabase.from("primary_showroom_enrollment").insert({
        customer_account_id: customerId,
        customer_location_id: locationId,
        program_status: "pending",
        required_display_count: 0,
        current_display_count: 0,
        discount_percent: 0
      });

      if (showroomError) {
        redirect(`/?module=add-customer&error=${encodeURIComponent(showroomError.message)}`);
      }
    }

    const { error: freightError } = await supabase.from("customer_freight_policy").insert({
      customer_account_id: customerId,
      customer_location_id: locationId,
      default_ground_carrier: freightTerms === "collect" ? optionalText("ground_customer_collect_carrier") : null,
      default_ground_carrier_account_number: freightTerms === "collect" ? optionalText("ground_customer_collect_account_number") : null,
      default_ltl_carrier: freightTerms === "collect" ? optionalText("ltl_customer_collect_carrier") : null,
      default_ltl_carrier_account_number: freightTerms === "collect" ? optionalText("ltl_customer_collect_account_number") : null,
      flat_rate_percent: flatRateRaw && freightTerms === "flat_rate" ? Number(flatRateRaw) : null,
      freight_allowance_amount: freightAllowanceRaw ? Number(freightAllowanceRaw) : null,
      freight_terms: freightTerms,
      ground_freight_terms: freightTerms,
      is_default: true,
      ltl_freight_terms: freightTerms,
      policy_name: "Default Freight Policy",
      preferred_shipping_type: null
    });

    if (freightError) {
      redirect(`/?module=add-customer&error=${encodeURIComponent(freightError.message)}`);
    }

    if (salesRepAgencyId) {
      const { error: repAssignmentError } = await supabase.from("customer_location_rep_assignment").insert({
        assignment_source: "manual",
        coverage_role: "primary",
        customer_location_id: locationId,
        sales_rep_agency_id: salesRepAgencyId,
        sales_rep_id: salesRepId,
        status: "active",
        territory_id: territoryId
      });

      if (repAssignmentError) {
        redirect(`/?module=add-customer&error=${encodeURIComponent(repAssignmentError.message)}`);
      }
    }
  }

  if (mainLocationContactName) {
    const { error: mainContactError } = await supabase.from("customer_contact").insert({
      customer_account_id: customerId,
      customer_location_id: locationId,
      department: optionalText("main_location_contact_department"),
      email: optionalText("main_location_contact_email"),
      is_billing_contact: false,
      is_primary: true,
      is_purchasing_contact: formData.get("main_contact_is_purchasing") === "on",
      is_showroom_floor_sales: formData.get("main_contact_is_showroom_floor_sales") === "on",
      is_showroom_manager: formData.get("main_contact_is_showroom_manager") === "on",
      is_warehouse_receiver: formData.get("main_contact_is_warehouse_receiver") === "on",
      mobile: optionalText("main_location_contact_mobile"),
      name: mainLocationContactName,
      phone: optionalText("main_location_contact_phone"),
      title: optionalText("main_location_contact_title")
    });

    if (mainContactError) {
      redirect(`/?module=add-customer&error=${encodeURIComponent(mainContactError.message)}`);
    }
  }

  if (billingContactName) {
    const { error: billingContactError } = await supabase.from("customer_contact").insert({
      customer_account_id: customerId,
      customer_location_id: null,
      department: optionalText("billing_contact_department"),
      email: optionalText("billing_contact_email"),
      is_billing_contact: true,
      is_primary: !mainLocationContactName,
      is_purchasing_contact: false,
      mobile: optionalText("billing_contact_mobile"),
      name: billingContactName,
      phone: optionalText("billing_contact_phone"),
      title: optionalText("billing_contact_title")
    });

    if (billingContactError) {
      redirect(`/?module=add-customer&error=${encodeURIComponent(billingContactError.message)}`);
    }
  }

  redirect(`/?customer=${customerId}`);
}

async function deleteCustomersAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerIds = formData
    .getAll("customer_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const query = String(formData.get("q") ?? "").trim();
  const returnModule = String(formData.get("return_module") ?? "").trim();
  const modulePrefix = returnModule === "obsolete-customers" ? "/?module=obsolete-customers" : "/";
  const querySuffix = query ? `${returnModule === "obsolete-customers" ? "&" : "?"}q=${encodeURIComponent(query)}` : "";
  const messagePrefix = `${modulePrefix}${querySuffix ? querySuffix : ""}${querySuffix ? "&" : modulePrefix.includes("?") ? "&" : "?"}`;

  if (customerIds.length === 0) {
    redirect(`${messagePrefix}error=${encodeURIComponent("Please select at least one customer to delete.")}`);
  }

  const { error } = await supabase.from("customer_account").update({ status: "obsolete" as "inactive" }).in("id", customerIds);

  if (error) {
    redirect(`${messagePrefix}error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `${messagePrefix}notice=${encodeURIComponent(
      `${customerIds.length} customer record${customerIds.length === 1 ? "" : "s"} moved to Obsolete Accounts.`
    )}`
  );
}

async function deleteProductsAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productIds = formData
    .getAll("product_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const returnModule = String(formData.get("return_module") ?? "products").trim();
  const returnParams = new URLSearchParams({
    module: returnModule === "discontinued-products" ? "discontinued-products" : "products"
  });
  const preserveKeys = [
    "q",
    "advanced",
    "product_brand",
    "product_category",
    "product_eligibility",
    "product_finish",
    "product_lights",
    "product_page",
    "product_page_size",
    "product_status",
    "product_style"
  ];

  preserveKeys.forEach((key) => {
    const value = String(formData.get(key) ?? "").trim();

    if (value) {
      returnParams.set(key, value);
    }
  });

  if (productIds.length === 0) {
    returnParams.set("error", "Please select at least one product to delete.");
    redirect(`/?${returnParams.toString()}`);
  }

  const { error } = await supabase.from("product").update({ status: "deleted" }).in("id", productIds);

  if (error) {
    returnParams.set("error", error.message);
    redirect(`/?${returnParams.toString()}`);
  }

  returnParams.set(
    "notice",
    `${productIds.length} product record${productIds.length === 1 ? "" : "s"} moved to Deleted Products.`
  );
  redirect(`/?${returnParams.toString()}`);
}

async function uploadCustomerAttachmentAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || "account_document";
  const attachmentFile = formData.get("attachment_file");

  if (!customerId || !(attachmentFile instanceof File) || attachmentFile.size === 0) {
    redirect(`/?customer=${customerId}&tab=attachments&error=${encodeURIComponent("Please select a document to upload.")}`);
  }

  const safeName = attachmentFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `customer-account/${customerId}/${Date.now()}-${safeName}`;
  const fileBody = new Uint8Array(await attachmentFile.arrayBuffer());
  const bucketName = "customer-attachments";

  const { error: uploadError } = await supabase.storage.from(bucketName).upload(storagePath, fileBody, {
    contentType: attachmentFile.type || "application/octet-stream",
    upsert: false
  });

  if (uploadError) {
    redirect(`/?customer=${customerId}&tab=attachments&error=${encodeURIComponent(uploadError.message)}`);
  }

  const { error: attachmentError } = await supabase.from("attachment").insert({
    category,
    content_type: attachmentFile.type || null,
    entity_id: customerId,
    entity_type: "customer_account",
    file_size: attachmentFile.size,
    original_file_name: attachmentFile.name,
    storage_bucket: bucketName,
    storage_path: storagePath
  });

  if (attachmentError) {
    redirect(`/?customer=${customerId}&tab=attachments&error=${encodeURIComponent(attachmentError.message)}`);
  }

  redirect(`/?customer=${customerId}&tab=attachments&notice=${encodeURIComponent("Attachment uploaded.")}`);
}

async function uploadProductDocumentAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const requestedType = String(formData.get("document_type") ?? "other").trim();
  const documentTypes: ProductDocumentType[] = ["spec_sheet", "installation_instruction", "manual", "box_label", "cad_drawing", "other"];
  const documentType: ProductDocumentType = documentTypes.includes(requestedType as ProductDocumentType)
    ? (requestedType as ProductDocumentType)
    : "other";
  const documentFile = formData.get("document_file");
  const baseUrl = `/?module=products&product=${productId}&product_tab=documents`;

  if (!productId || !(documentFile instanceof File) || documentFile.size === 0) {
    redirect(`${baseUrl}&error=${encodeURIComponent("Please select a product document to upload.")}`);
  }

  const safeName = documentFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `product/${productId}/${Date.now()}-${safeName}`;
  const fileBody = new Uint8Array(await documentFile.arrayBuffer());
  const bucketName = "product-documents";

  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

  if (bucketsError) {
    redirect(`${baseUrl}&error=${encodeURIComponent(bucketsError.message)}`);
  }

  if (!buckets?.some((bucket) => bucket.name === bucketName)) {
    const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
      public: false
    });

    if (createBucketError) {
      redirect(`${baseUrl}&error=${encodeURIComponent(createBucketError.message)}`);
    }
  }

  const { data: uploadedFile, error: uploadError } = await supabase.storage.from(bucketName).upload(storagePath, fileBody, {
    contentType: documentFile.type || "application/octet-stream",
    upsert: false
  });

  if (uploadError) {
    redirect(`${baseUrl}&error=${encodeURIComponent(uploadError.message)}`);
  }

  const { data: attachment, error: attachmentError } = await supabase
    .from("attachment")
    .insert({
      category: documentType,
      content_type: documentFile.type || null,
      entity_id: productId,
      entity_type: "product",
      file_size: documentFile.size,
      original_file_name: documentFile.name,
      storage_bucket: bucketName,
      storage_path: storagePath
    })
    .select("id")
    .single();

  if (attachmentError || !attachment) {
    redirect(`${baseUrl}&error=${encodeURIComponent(attachmentError?.message ?? "Unable to save product document file record.")}`);
  }

  if (["spec_sheet", "installation_instruction", "manual", "other"].includes(documentType)) {
    await supabase.from("product_document").insert({
      display_name: displayName || documentFile.name,
      document_type: documentType as "spec_sheet" | "installation_instruction" | "manual" | "other",
      file_id: attachment.id,
      product_id: productId
    });
  }

  redirect(`${baseUrl}&notice=${encodeURIComponent(`Product document uploaded: ${uploadedFile?.path ?? documentFile.name}`)}`);
}

async function uploadProductImageAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const returnModule = String(formData.get("return_module") ?? "").trim();
  const returnToPart = returnModule === "product-parts";
  const displayName = String(formData.get("display_name") ?? "").trim();
  const requestedCategory = String(formData.get("image_category") ?? "stock").trim();
  const imageCategories: ProductImageCategory[] = ["stock", "detail", "lifestyle", "drawing", "other"];
  const imageCategory: ProductImageCategory = imageCategories.includes(requestedCategory as ProductImageCategory)
    ? (requestedCategory as ProductImageCategory)
    : "stock";
  const imageFile = formData.get("image_file");
  const baseUrl = `/?module=edit-product-images&product=${productId}&image_category=${imageCategory}${returnToPart ? "&return_module=product-parts" : ""}`;

  if (!productId || !(imageFile instanceof File) || imageFile.size === 0) {
    redirect(`${baseUrl}&error=${encodeURIComponent("Please select an image to upload.")}`);
  }

  if (imageFile.size > 25 * 1024 * 1024) {
    redirect(`${baseUrl}&error=${encodeURIComponent("Image file is too large. Please upload an image smaller than 25 MB.")}`);
  }

  const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff"]);

  if (imageFile.type && !allowedImageTypes.has(imageFile.type)) {
    redirect(`${baseUrl}&error=${encodeURIComponent("Please upload a major image format such as JPG, PNG, WEBP, GIF, BMP, or TIFF.")}`);
  }

  const bucketName = "product-images";
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

  if (bucketsError) {
    redirect(`${baseUrl}&error=${encodeURIComponent(bucketsError.message)}`);
  }

  if (!buckets?.some((bucket) => bucket.name === bucketName)) {
    const { error: createBucketError } = await supabase.storage.createBucket(bucketName, { public: false });

    if (createBucketError) {
      redirect(`${baseUrl}&error=${encodeURIComponent(createBucketError.message)}`);
    }
  }

  const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `product/${productId}/${Date.now()}-${safeName}`;
  const fileBody = new Uint8Array(await imageFile.arrayBuffer());
  const { data: uploadedFile, error: uploadError } = await supabase.storage.from(bucketName).upload(storagePath, fileBody, {
    contentType: imageFile.type || "application/octet-stream",
    upsert: false
  });

  if (uploadError) {
    redirect(`${baseUrl}&error=${encodeURIComponent(uploadError.message)}`);
  }

  const { data: attachment, error: attachmentError } = await supabase
    .from("attachment")
    .insert({
      category: `product_image:${imageCategory}`,
      content_type: imageFile.type || null,
      entity_id: productId,
      entity_type: "product",
      file_size: imageFile.size,
      original_file_name: imageFile.name,
      storage_bucket: bucketName,
      storage_path: storagePath
    })
    .select("id")
    .single();

  if (attachmentError || !attachment) {
    redirect(`${baseUrl}&error=${encodeURIComponent(attachmentError?.message ?? "Unable to save image file record.")}`);
  }

  const { count, error: countError } = await supabase
    .from("product_image")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId)
    .eq("is_active", true);

  if (countError) {
    redirect(`${baseUrl}&error=${encodeURIComponent(countError.message)}`);
  }

  const shouldBeDefault = imageCategory === "stock" && (formData.get("is_default_thumbnail") === "on" || (count ?? 0) === 0);

  if (shouldBeDefault) {
    await supabase.from("product_image").update({ is_default_thumbnail: false }).eq("product_id", productId);
  }

  const { error: imageError } = await supabase.from("product_image").insert({
    display_name: displayName || imageFile.name,
    file_id: attachment.id,
    image_category: imageCategory,
    is_default_thumbnail: shouldBeDefault,
    product_id: productId,
    sort_order: ((count ?? 0) + 1) * 10
  });

  if (imageError) {
    redirect(`${baseUrl}&error=${encodeURIComponent(imageError.message)}`);
  }

  redirect(`${baseUrl}&notice=${encodeURIComponent(`Product image uploaded: ${uploadedFile?.path ?? imageFile.name}`)}`);
}

async function updateProductImagesAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const returnCategory = String(formData.get("return_image_category") ?? "stock").trim();
  const returnModule = String(formData.get("return_module") ?? "").trim();
  const returnToPart = returnModule === "product-parts";
  const baseUrl = `/?module=edit-product-images&product=${productId}&image_category=${returnCategory}${returnToPart ? "&return_module=product-parts" : ""}`;

  if (!productId) {
    redirect(`${baseUrl}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const imageCategories: ProductImageCategory[] = ["stock", "detail", "lifestyle", "drawing", "other"];
  const imageCategoryValue = (key: string): ProductImageCategory => {
    const value = optionalText(key);
    return imageCategories.includes(value as ProductImageCategory) ? (value as ProductImageCategory) : "stock";
  };
  const imageIds = formData.getAll("image_ids").map((value) => String(value).trim()).filter(Boolean);
  const deletedImageIds = new Set(formData.getAll("delete_image_ids").map((value) => String(value).trim()).filter(Boolean));
  const defaultImageId = optionalText("default_thumbnail_image_id");

  if (defaultImageId && !deletedImageIds.has(defaultImageId)) {
    const defaultCategory = imageCategoryValue(`image_category_${defaultImageId}`);

    if (defaultCategory !== "stock") {
      redirect(`${baseUrl}&error=${encodeURIComponent("Default thumbnail must be a stock image.")}`);
    }

    const { error } = await supabase.from("product_image").update({ is_default_thumbnail: false }).eq("product_id", productId);

    if (error) {
      redirect(`${baseUrl}&error=${encodeURIComponent(error.message)}`);
    }
  }

  for (const imageId of imageIds) {
    if (deletedImageIds.has(imageId)) {
      const { error } = await supabase
        .from("product_image")
        .update({ deleted_at: new Date().toISOString(), is_active: false, is_default_thumbnail: false })
        .eq("id", imageId)
        .eq("product_id", productId);

      if (error) {
        redirect(`${baseUrl}&error=${encodeURIComponent(error.message)}`);
      }

      continue;
    }

    const category = imageCategoryValue(`image_category_${imageId}`);
    const isDefaultThumbnail = defaultImageId === imageId && category === "stock";
    const sortOrderRaw = optionalText(`sort_order_${imageId}`);
    const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : 100;
    const { error } = await supabase
      .from("product_image")
      .update({
        display_name: optionalText(`display_name_${imageId}`),
        image_category: category,
        is_default_thumbnail: isDefaultThumbnail,
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 100
      })
      .eq("id", imageId)
      .eq("product_id", productId);

    if (error) {
      redirect(`${baseUrl}&error=${encodeURIComponent(error.message)}`);
    }
  }

  redirect(`${baseUrl}&notice=${encodeURIComponent("Product images updated.")}`);
}

async function updateAccountProfileAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const accountTypeId = String(formData.get("account_type_id") ?? "").trim();
  const businessTypeId = String(formData.get("business_type_id") ?? "").trim();

  if (!customerId || !name || !accountTypeId || !businessTypeId) {
    redirect(`/?module=edit-account-profile&customer=${customerId}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const defaultDiscount = Number(formData.get("default_discount_percent") ?? 0);
  const statusValue = String(formData.get("status") ?? "active");
  const status = ["pending", "active", "inactive", "credit_hold", "obsolete"].includes(statusValue)
    ? (statusValue as "pending" | "active" | "inactive" | "credit_hold")
    : "active";

  const { error } = await supabase
    .from("customer_account")
    .update({
      account_type_id: accountTypeId,
      business_type_id: businessTypeId,
      default_discount_percent: Number.isFinite(defaultDiscount) ? defaultDiscount : 0,
      is_sales_tax_exempt: formData.get("is_sales_tax_exempt") === "on",
      legal_name: optionalText("legal_name"),
      name,
      state_resale_certificate_number: optionalText("state_resale_certificate_number"),
      status
    })
    .eq("id", customerId);

  if (error) {
    redirect(`/?module=edit-account-profile&customer=${customerId}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/?customer=${customerId}`);
}

async function updateProductProfileAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const brandId = String(formData.get("brand_id") ?? "").trim();

  if (!productId || !sku || !name || !brandId) {
    redirect(`/?module=edit-product-profile&product=${productId}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const statusValue = String(formData.get("status") ?? "pending");
  const status = ["pending", "active", "inactive", "discontinued", "deleted"].includes(statusValue)
    ? (statusValue as "pending" | "active" | "inactive" | "discontinued" | "deleted")
    : "pending";
  const sellabilityValue = String(formData.get("sellability_status") ?? "hidden");
  const sellabilityStatus = ["hidden", "sellable", "blocked", "override_required"].includes(sellabilityValue)
    ? (sellabilityValue as "hidden" | "sellable" | "blocked" | "override_required")
    : "hidden";
  const eligibilityValue = String(formData.get("customer_eligibility_tag") ?? "all");
  const customerEligibilityTag = ["all", "ecommerce_only", "non_ecommerce_only", "exclusive"].includes(eligibilityValue)
    ? (eligibilityValue as "all" | "ecommerce_only" | "non_ecommerce_only" | "exclusive")
    : "all";
  const priceRaw = optionalText("default_price");
  const defaultPrice = priceRaw ? Number(priceRaw) : null;
  const description = optionalText("description");

  const { error } = await supabase
    .from("product")
    .update({
      brand_id: brandId,
      collection: optionalText("collection"),
      counts_toward_primary_showroom_default: formData.get("counts_toward_primary_showroom_default") === "yes",
      customer_eligibility_tag: customerEligibilityTag,
      default_price: defaultPrice !== null && Number.isFinite(defaultPrice) ? defaultPrice : null,
      default_vendor_item_number: optionalText("default_vendor_item_number"),
      description,
      description_word_count: description ? description.split(/\s+/).filter(Boolean).length : null,
      name,
      no_box_needed: formData.get("no_box_needed") === "on",
      primary_showroom_exclusion_reason:
        formData.get("counts_toward_primary_showroom_default") === "no" ? optionalText("primary_showroom_exclusion_reason") : null,
      product_category_id: optionalText("product_category_id"),
      sellability_status: sellabilityStatus,
      signature_suite_id: optionalText("signature_suite_id"),
      sku,
      status
    })
    .eq("id", productId);

  if (error) {
    redirect(`/?module=edit-product-profile&product=${productId}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/?module=products&product=${productId}`);
}

async function updateProductSpecsAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const specSection = String(formData.get("spec_section") ?? "dimensions").trim();

  if (!productId) {
    redirect(`/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const specFields = formData.getAll("spec_fields").map((field) => String(field));

  for (const encodedField of specFields) {
    const [fieldKey, labelText] = encodedField.split("|");
    const attributeName = labelText?.trim();

    if (!fieldKey || !attributeName) {
      continue;
    }

    const specId = optionalText(`spec_id_${fieldKey}`);
    const attributeValue = optionalText(`spec_value_${fieldKey}`);
    const unit = optionalText(`spec_unit_${fieldKey}`);

    if (specId && !attributeValue) {
      const { error } = await supabase.from("product_spec_attribute").delete().eq("id", specId).eq("product_id", productId);

      if (error) {
        redirect(`/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(error.message)}`);
      }

      continue;
    }

    if (specId && attributeValue) {
      const { error } = await supabase
        .from("product_spec_attribute")
        .update({
          attribute_name: attributeName,
          attribute_value: attributeValue,
          unit
        })
        .eq("id", specId)
        .eq("product_id", productId);

      if (error) {
        redirect(`/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(error.message)}`);
      }

      continue;
    }

    if (attributeValue) {
      const { error } = await supabase.from("product_spec_attribute").insert({
        attribute_name: attributeName,
        attribute_value: attributeValue,
        product_id: productId,
        unit
      });

      if (error) {
        redirect(`/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(error.message)}`);
      }
    }
  }

  const customRows = [1, 2, 3];

  for (const rowNumber of customRows) {
    const attributeName = optionalText(`custom_spec_name_${rowNumber}`);
    const attributeValue = optionalText(`custom_spec_value_${rowNumber}`);
    const unit = optionalText(`custom_spec_unit_${rowNumber}`);

    if (!attributeName || !attributeValue) {
      continue;
    }

    const { error } = await supabase.from("product_spec_attribute").insert({
      attribute_name: attributeName,
      attribute_value: attributeValue,
      product_id: productId,
      unit
    });

    if (error) {
      redirect(`/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(error.message)}`);
    }
  }

  if (formData.get("include_hanging_config") === "yes") {
    const hangingConfig = {
      canopy_detail: optionalText("hanging_canopy_detail"),
      chain_length: optionalText("hanging_chain_length"),
      mounting_type: optionalText("hanging_mounting_type"),
      notes: optionalText("hanging_notes"),
      product_id: productId,
      rod_length: optionalText("hanging_rod_length"),
      wire_length: optionalText("hanging_wire_length")
    };
    const { data: existingHangingConfig, error: existingHangingError } = await supabase
      .from("product_hanging_config")
      .select("id")
      .eq("product_id", productId)
      .eq("is_active", true)
      .maybeSingle();

    if (existingHangingError) {
      redirect(`/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(existingHangingError.message)}`);
    }

    const result = existingHangingConfig
      ? await supabase.from("product_hanging_config").update(hangingConfig).eq("id", existingHangingConfig.id)
      : await supabase.from("product_hanging_config").insert(hangingConfig);

    if (result.error) {
      redirect(`/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(result.error.message)}`);
    }
  }

  redirect(`/?module=products&product=${productId}&product_tab=specs`);
}

async function updateProductBoxesAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();

  if (!productId) {
    redirect(`/?module=edit-product-boxes&product=${productId}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const optionalNumber = (key: string) => {
    const value = optionalText(key);
    const parsed = value === null ? null : Number(value);
    return parsed !== null && Number.isFinite(parsed) ? parsed : null;
  };
  const optionalInventoryInteger = (key: string) => {
    const value = optionalNumber(key);
    return value !== null && Number.isInteger(value) ? value : value === null ? null : Number.NaN;
  };
  const cbmFromInches = (length: number | null, width: number | null, height: number | null) =>
    length !== null && width !== null && height !== null ? (length * width * height) / 61023.744095 : null;
  const redirectWithError = (message: string) =>
    redirect(`/?module=edit-product-boxes&product=${productId}&error=${encodeURIComponent(message)}`);
  const upsertPackingSpec = async (attributeName: string, attributeValue: string | null) => {
    const { data: existingSpec, error: existingSpecError } = await supabase
      .from("product_spec_attribute")
      .select("id")
      .eq("product_id", productId)
      .eq("attribute_name", attributeName)
      .eq("is_active", true)
      .maybeSingle();

    if (existingSpecError) {
      redirectWithError(existingSpecError.message);
    }

    if (!attributeValue) {
      if (existingSpec) {
        const { error } = await supabase.from("product_spec_attribute").delete().eq("id", existingSpec.id);

        if (error) {
          redirectWithError(error.message);
        }
      }

      return;
    }

    const payload = {
      attribute_name: attributeName,
      attribute_value: attributeValue,
      product_id: productId,
      unit: null
    };
    const result = existingSpec
      ? await supabase.from("product_spec_attribute").update(payload).eq("id", existingSpec.id)
      : await supabase.from("product_spec_attribute").insert(payload);

    if (result.error) {
      redirectWithError(result.error.message);
    }
  };
  const deletedBoxIds = new Set(formData.getAll("delete_box_ids").map((value) => String(value).trim()).filter(Boolean));
  const boxIds = formData.getAll("box_ids").map((value) => String(value).trim()).filter(Boolean);

  await upsertPackingSpec("Cardboard Spec", optionalText("cardboard_spec"));
  await upsertPackingSpec("Foam Density", optionalText("foam_density"));

  if (deletedBoxIds.size > 0) {
    const { error } = await supabase
      .from("product_packing_box")
      .update({ is_active: false })
      .eq("product_id", productId)
      .in("id", [...deletedBoxIds]);

    if (error) {
      redirectWithError(error.message);
    }
  }

  for (const boxId of boxIds) {
    if (deletedBoxIds.has(boxId)) {
      continue;
    }

    const boxLength = optionalNumber(`box_length_${boxId}`);
    const boxWidth = optionalNumber(`box_width_${boxId}`);
    const boxHeight = optionalNumber(`box_height_${boxId}`);

    const { error } = await supabase
      .from("product_packing_box")
      .update({
        box_height: boxHeight,
        box_label: optionalText(`box_label_${boxId}`),
        box_length: boxLength,
        box_width: boxWidth,
        cbm: cbmFromInches(boxLength, boxWidth, boxHeight),
        gross_weight: optionalNumber(`gross_weight_${boxId}`),
        is_required_for_sale: formData.get(`is_required_for_sale_${boxId}`) === "on",
        net_weight: optionalNumber(`net_weight_${boxId}`),
        notes: optionalText(`notes_${boxId}`)
      })
      .eq("id", boxId)
      .eq("product_id", productId);

    if (error) {
      redirectWithError(error.message);
    }

  }

  redirect(`/?module=products&product=${productId}&product_tab=packing`);
}

async function addProductBoxAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();

  if (!productId) {
    redirect(`/?module=add-product-box&product=${productId}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const optionalNumber = (key: string) => {
    const value = optionalText(key);
    const parsed = value === null ? null : Number(value);
    return parsed !== null && Number.isFinite(parsed) ? parsed : null;
  };
  const cbmFromInches = (length: number | null, width: number | null, height: number | null) =>
    length !== null && width !== null && height !== null ? (length * width * height) / 61023.744095 : null;
  const redirectWithError = (message: string) =>
    redirect(`/?module=add-product-box&product=${productId}&error=${encodeURIComponent(message)}`);

  const { data: existingBoxes, error: existingBoxesError } = await supabase
    .from("product_packing_box")
    .select("box_sequence")
    .eq("product_id", productId)
    .eq("is_active", true);

  if (existingBoxesError) {
    redirectWithError(existingBoxesError.message);
  }

  const newSequence = Math.max(0, ...(existingBoxes ?? []).map((box) => box.box_sequence)) + 1;

  if (newSequence) {
    const newLength = optionalNumber("new_box_length");
    const newWidth = optionalNumber("new_box_width");
    const newHeight = optionalNumber("new_box_height");
    const { error } = await supabase.from("product_packing_box").insert({
      box_height: newHeight,
      box_label: optionalText("new_box_label"),
      box_length: newLength,
      box_sequence: newSequence,
      box_width: newWidth,
      cbm: cbmFromInches(newLength, newWidth, newHeight),
      gross_weight: optionalNumber("new_gross_weight"),
      is_required_for_sale: formData.get("new_is_required_for_sale") === "on",
      net_weight: optionalNumber("new_net_weight"),
      notes: optionalText("new_notes"),
      product_id: productId
    });

    if (error) {
      redirectWithError(error?.message ?? "Unable to save the new product box.");
    }
  }

  redirect(`/?module=products&product=${productId}&product_tab=packing`);
}

async function updateProductInventoryAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const returnModule = String(formData.get("return_module") ?? "").trim();
  const returnToPart = returnModule === "product-parts";
  const returnUrl = returnToPart
    ? `/?module=product-parts&part=${productId}&product_tab=inventory`
    : `/?module=products&product=${productId}&product_tab=inventory`;
  const editUrl = returnToPart
    ? `/?module=edit-product-inventory&product=${productId}&return_module=product-parts`
    : `/?module=edit-product-inventory&product=${productId}`;

  if (!productId) {
    redirect(`${editUrl}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const optionalNumber = (key: string) => {
    const value = optionalText(key);
    const parsed = value === null ? null : Number(value);
    return parsed !== null && Number.isFinite(parsed) ? parsed : null;
  };
  const optionalInventoryInteger = (key: string) => {
    const value = optionalNumber(key);
    return value !== null && Number.isInteger(value) ? value : value === null ? null : Number.NaN;
  };
  const inventoryConditions = ["regular", "to_be_inspected", "hold", "damaged", "demolished_trash"] as const;
  const inventoryConditionValue = (key: string): (typeof inventoryConditions)[number] => {
    const value = optionalText(key);
    return inventoryConditions.includes(value as (typeof inventoryConditions)[number]) ? (value as (typeof inventoryConditions)[number]) : "regular";
  };
  const redirectWithError = (message: string) => redirect(`${editUrl}&error=${encodeURIComponent(message)}`);
  const resolveLocation = async (rawCode: string | null, warehouseId: string | null) => {
    const locationCode = rawCode?.split("/")[0]?.trim() ?? "";

    if (!locationCode) {
      return { locationId: null, warehouseId };
    }

    let request = supabase
      .from("warehouse_location")
      .select("id, warehouse_id")
      .eq("is_active", true)
      .eq("location_code", locationCode);

    if (warehouseId) {
      request = request.eq("warehouse_id", warehouseId);
    }

    const { data, error } = await request.maybeSingle();

    if (error || !data) {
      redirectWithError(`Inventory location "${locationCode}" was not found. Please enter an active warehouse/bin location code.`);
    }

    return { locationId: data!.id, warehouseId: warehouseId ?? data!.warehouse_id };
  };

  const deletedBalanceIds = new Set(formData.getAll("delete_balance_ids").map((value) => String(value).trim()).filter(Boolean));
  const balanceIds = formData.getAll("balance_ids").map((value) => String(value).trim()).filter(Boolean);

  for (const balanceId of balanceIds) {
    const quantityOnHand = optionalInventoryInteger(`quantity_on_hand_${balanceId}`);
    const quantityAllocated = optionalInventoryInteger(`quantity_allocated_${balanceId}`);

    if (
      quantityOnHand === null ||
      !Number.isFinite(quantityOnHand) ||
      quantityOnHand < 0 ||
      quantityAllocated === null ||
      !Number.isFinite(quantityAllocated) ||
      quantityAllocated < 0
    ) {
      redirectWithError("Inventory quantities must be whole numbers zero or higher.");
    }

    if (deletedBalanceIds.has(balanceId)) {
      if (quantityOnHand !== 0 || quantityAllocated !== 0) {
        redirectWithError("Only inventory balance rows with zero on-hand and zero allocated quantity can be deleted.");
      }

      const { error } = await supabase.from("inventory_balance").delete().eq("id", balanceId).eq("product_id", productId);

      if (error) {
        redirectWithError(error.message);
      }

      continue;
    }

    const warehouseId = optionalText(`warehouse_id_${balanceId}`);
    const location = await resolveLocation(optionalText(`location_code_${balanceId}`), warehouseId);

    if (!location.warehouseId || !location.locationId) {
      redirectWithError("Each inventory balance needs a warehouse and bin/location.");
    }

    const activeQuantityOnHand = quantityOnHand ?? 0;
    const activeQuantityAllocated = quantityAllocated ?? 0;
    const activeWarehouseId = location.warehouseId!;
    const activeLocationId = location.locationId!;
    const { error } = await supabase
      .from("inventory_balance")
      .update({
        inventory_condition: inventoryConditionValue(`inventory_condition_${balanceId}`),
        quantity_allocated: activeQuantityAllocated,
        quantity_on_hand: activeQuantityOnHand,
        warehouse_id: activeWarehouseId,
        warehouse_location_id: activeLocationId
      })
      .eq("id", balanceId)
      .eq("product_id", productId);

    if (error) {
      redirectWithError(error.message);
    }
  }

  const newLocationCode = optionalText("new_location_code");
  const newQuantityOnHand = optionalInventoryInteger("new_quantity_on_hand");

  if (newLocationCode || newQuantityOnHand !== null) {
    const newWarehouseId = optionalText("new_warehouse_id");
    const newLocation = await resolveLocation(newLocationCode, newWarehouseId);
    const newAllocatedQuantity = optionalInventoryInteger("new_quantity_allocated") ?? 0;
    const newPackingBoxId = optionalText("new_product_packing_box_id");

    if (
      newQuantityOnHand === null ||
      !Number.isFinite(newQuantityOnHand) ||
      newQuantityOnHand < 0 ||
      !Number.isFinite(newAllocatedQuantity) ||
      newAllocatedQuantity < 0
    ) {
      redirectWithError("New inventory quantities must be whole numbers zero or higher.");
    }

    if (!newLocation.warehouseId || !newLocation.locationId) {
      redirectWithError("New inventory location needs a warehouse and bin/location.");
    }

    if (newQuantityOnHand === 0 && newAllocatedQuantity === 0) {
      redirectWithError("New inventory location must have a positive on-hand or allocated quantity.");
    }

    const { error } = await supabase.from("inventory_balance").insert({
      inventory_condition: inventoryConditionValue("new_inventory_condition"),
      product_id: productId,
      product_packing_box_id: newPackingBoxId,
      quantity_allocated: newAllocatedQuantity,
      quantity_on_hand: newQuantityOnHand!,
      warehouse_id: newLocation.warehouseId!,
      warehouse_location_id: newLocation.locationId!
    });

    if (error) {
      redirectWithError(error.message);
    }
  }

  const targetQuantity = optionalInventoryInteger("target_sellable_quantity");

  if (targetQuantity !== null) {
    if (!Number.isFinite(targetQuantity) || targetQuantity < 0) {
      redirectWithError("Target sellable quantity must be a whole number zero or higher.");
    }

    const { data: product, error: productError } = await supabase.from("product").select("no_box_needed").eq("id", productId).maybeSingle();

    if (productError || !product) {
      redirectWithError(productError?.message ?? "Product was not found.");
    }

    const productRecord = product!;
    const { data: requiredBoxes, error: requiredBoxesError } = await supabase
      .from("product_packing_box")
      .select("id, default_warehouse_id, default_warehouse_location_id")
      .eq("product_id", productId)
      .eq("is_active", true)
      .eq("is_required_for_sale", true);

    if (requiredBoxesError) {
      redirectWithError(requiredBoxesError.message);
    }

    const targetRows = productRecord.no_box_needed
      ? [{ id: null, default_warehouse_id: null, default_warehouse_location_id: null }]
      : requiredBoxes ?? [];

    for (const target of targetRows) {
      let warehouseId = target.default_warehouse_id;
      let locationId = target.default_warehouse_location_id;

      if (!warehouseId || !locationId) {
        const { data: fallbackLocation, error: fallbackLocationError } = await supabase
          .from("warehouse_location")
          .select("id, warehouse_id")
          .eq("is_active", true)
          .eq("is_pickable", true)
          .order("location_code", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (fallbackLocationError || !fallbackLocation) {
          redirectWithError("No active pickable warehouse/bin location was found for inventory update.");
        }

        warehouseId = warehouseId ?? fallbackLocation!.warehouse_id;
        locationId = locationId ?? fallbackLocation!.id;
      }

      let existingBalanceQuery = supabase
        .from("inventory_balance")
        .select("id")
        .eq("product_id", productId)
        .eq("warehouse_location_id", locationId)
        .eq("inventory_condition", "regular");

      existingBalanceQuery = target.id
        ? existingBalanceQuery.eq("product_packing_box_id", target.id)
        : existingBalanceQuery.is("product_packing_box_id", null);

      const { data: existingBalance, error: existingBalanceError } = await existingBalanceQuery.maybeSingle();

      if (existingBalanceError) {
        redirectWithError(existingBalanceError.message);
      }

      const payload = {
        inventory_condition: "regular" as const,
        product_id: productId,
        product_packing_box_id: target.id,
        quantity_allocated: 0,
        quantity_on_hand: targetQuantity,
        warehouse_id: warehouseId,
        warehouse_location_id: locationId
      };
      const result = existingBalance
        ? await supabase.from("inventory_balance").update(payload).eq("id", existingBalance.id)
        : await supabase.from("inventory_balance").insert(payload);

      if (result.error) {
        redirectWithError(result.error.message);
      }
    }
  }

  redirect(returnUrl);
}

async function updateProductPartsAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const initialProductId = String(formData.get("product_id") ?? "").trim();
  const selectedParentProductId = String(formData.get("parent_product_id") ?? "").trim();
  const productId = initialProductId || selectedParentProductId;

  if (!productId) {
    redirect(`/?module=edit-product-parts&part_action=add&error=Please%20select%20a%20parent%20product.`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const optionalQuantity = (key: string) => {
    const value = optionalText(key);
    const parsed = value === null ? null : Number(value);
    return parsed !== null && Number.isFinite(parsed) ? parsed : null;
  };
  const optionalInventoryInteger = (key: string) => {
    const value = optionalQuantity(key);
    return value !== null && Number.isInteger(value) ? value : value === null ? null : Number.NaN;
  };
  const redirectWithError = (message: string) =>
    redirect(
      `/?module=edit-product-parts${initialProductId ? `&product=${initialProductId}` : "&part_action=add"}&error=${encodeURIComponent(message)}`
    );

  const partSaveAction = optionalText("part_save_action");
  const selectedPartIds = formData.getAll("selected_part_ids").map((value) => String(value).trim()).filter(Boolean);

  if ((partSaveAction === "edit" || partSaveAction === "delete" || partSaveAction === "add_parent") && selectedPartIds.length === 0) {
    redirectWithError("Please select at least one part line first.");
  }

  if (partSaveAction === "add_parent") {
    const additionalParentProductId = optionalText("additional_parent_product_id");

    if (!additionalParentProductId) {
      redirectWithError("Please select the additional parent product SKU.");
    }

    const activeAdditionalParentProductId = additionalParentProductId ?? "";

    const { data: sourcePartLinks, error: sourcePartLinksError } = await supabase
      .from("product_part")
      .select("id, component_product_id")
      .eq("parent_product_id", productId)
      .eq("is_active", true)
      .in("id", selectedPartIds);

    if (sourcePartLinksError) {
      redirectWithError(sourcePartLinksError.message);
    }

    if (!sourcePartLinks || sourcePartLinks.length === 0) {
      redirectWithError("No selected active part links were found.");
    }

    const activeSourcePartLinks = sourcePartLinks ?? [];

    for (const sourcePartLink of activeSourcePartLinks) {
      if (activeAdditionalParentProductId === sourcePartLink.component_product_id) {
        redirectWithError("A part cannot be linked to itself as a parent product.");
      }

      const partRole = optionalText(`part_role_${sourcePartLink.id}`);
      let existingParentLinkQuery = supabase
        .from("product_part")
        .select("id, is_active")
        .eq("parent_product_id", activeAdditionalParentProductId)
        .eq("component_product_id", sourcePartLink.component_product_id);

      existingParentLinkQuery = partRole ? existingParentLinkQuery.eq("part_role", partRole) : existingParentLinkQuery.is("part_role", null);

      const { data: existingParentLink, error: existingParentLinkError } = await existingParentLinkQuery.limit(1).maybeSingle();

      if (existingParentLinkError) {
        redirectWithError(existingParentLinkError.message);
      }

      const payload = {
        component_product_id: sourcePartLink.component_product_id,
        is_active: true,
        is_required: formData.get(`is_required_${sourcePartLink.id}`) === "on",
        notes: optionalText(`notes_${sourcePartLink.id}`),
        parent_product_id: activeAdditionalParentProductId,
        part_name: optionalText(`part_name_${sourcePartLink.id}`),
        part_role: partRole,
        quantity_required: 1
      };

      const result = existingParentLink
        ? await supabase.from("product_part").update(payload).eq("id", existingParentLink.id)
        : await supabase.from("product_part").insert(payload);

      if (result.error) {
        redirectWithError(result.error.message);
      }
    }

    redirect(`/?module=products&product=${productId}&product_tab=parts`);
  }

  if (partSaveAction === "delete" && selectedPartIds.length > 0) {
    const { error } = await supabase
      .from("product_part")
      .update({ is_active: false })
      .eq("parent_product_id", productId)
      .in("id", selectedPartIds);

    if (error) {
      redirectWithError(error.message);
    }
  }

  if (partSaveAction === "edit") {
  for (const partId of selectedPartIds) {
    const { error } = await supabase
      .from("product_part")
      .update({
        is_required: formData.get(`is_required_${partId}`) === "on",
        notes: optionalText(`notes_${partId}`),
        part_name: optionalText(`part_name_${partId}`),
        part_role: optionalText(`part_role_${partId}`)
      })
      .eq("id", partId)
      .eq("parent_product_id", productId);

    if (error) {
      redirectWithError(error.message);
    }
  }
  }

  const generatePartSku = async (role: string | null) => {
    const roleWord = (role ?? "General").split(/\s+/).filter(Boolean).at(-1) ?? "General";
    const roleSegment = (roleWord.replace(/[^a-z0-9]/gi, "") || "GENERAL").toUpperCase();

    for (let attempt = 0; attempt < 25; attempt += 1) {
      const randomDigits = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
      const sku = `PT ${roleSegment}-${randomDigits}`;
      const { data: existingProduct, error: existingProductError } = await supabase
        .from("product")
        .select("id")
        .eq("sku", sku)
        .maybeSingle();

      if (existingProductError) {
        redirectWithError(existingProductError.message);
      }

      if (!existingProduct) {
        return sku;
      }
    }

    redirectWithError("Unable to generate a unique part SKU. Please try saving again.");
    throw new Error("Unable to generate a unique part SKU.");
  };
  const newPartProductName = optionalText("new_part_product_name");
  const newPartRole = optionalText("new_part_role");
  const newPartImageFiles = formData
    .getAll("new_part_images")
    .filter((file): file is File => file instanceof File && file.size > 0);

  if (newPartProductName) {
    const newPartSku = await generatePartSku(newPartRole);
    const newPartName = newPartProductName;

    if (!newPartProductName || !newPartName) {
      redirectWithError("Part name is required.");
    }

    const initialInventory = optionalInventoryInteger("new_part_initial_inventory");

    if (initialInventory !== null && (!Number.isFinite(initialInventory) || initialInventory < 0)) {
      redirectWithError("Initial inventory must be a whole number zero or higher.");
    }

    const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff"]);

    for (const imageFile of newPartImageFiles) {
      if (imageFile.size > 25 * 1024 * 1024) {
        redirectWithError("Part image file is too large. Please upload images smaller than 25 MB.");
      }

      if (imageFile.type && !allowedImageTypes.has(imageFile.type)) {
        redirectWithError("Please upload major image formats such as JPG, PNG, WEBP, GIF, BMP, or TIFF.");
      }
    }

    const { data: parentProduct, error: parentProductError } = await supabase
      .from("product")
      .select("brand_id")
      .eq("id", productId)
      .maybeSingle();

    if (parentProductError || !parentProduct) {
      redirectWithError(parentProductError?.message ?? "Parent product was not found.");
    }

    const { data: accessoryCategory, error: accessoryCategoryError } = await supabase
      .from("product_category")
      .select("id")
      .or("category_code.eq.accessory,name.ilike.Accessory")
      .limit(1)
      .maybeSingle();

    if (accessoryCategoryError || !accessoryCategory) {
      redirectWithError(accessoryCategoryError?.message ?? "Accessory product category was not found.");
    }

    const activeParentProduct = parentProduct!;
    const activeAccessoryCategory = accessoryCategory!;
    const activePartProductName = newPartProductName ?? newPartSku;
    const activePartName = newPartName ?? activePartProductName;

    const { data: newPartProduct, error: productInsertError } = await supabase
      .from("product")
      .insert({
        brand_id: activeParentProduct.brand_id,
        customer_eligibility_tag: "all",
        name: activePartProductName,
        no_box_needed: true,
        product_category_id: activeAccessoryCategory.id,
        sellability_status: "sellable",
        sku: newPartSku,
        status: "active"
      })
      .select("id")
      .single();

    if (productInsertError || !newPartProduct) {
      redirectWithError(productInsertError?.message ?? "Unable to create the new part SKU.");
    }

    const activeNewPartProduct = newPartProduct!;

    const { error } = await supabase.from("product_part").insert({
      component_product_id: activeNewPartProduct.id,
      is_required: formData.get("new_is_required") === "on",
      notes: optionalText("new_notes"),
      parent_product_id: productId,
      part_name: activePartName,
      part_role: newPartRole,
      quantity_required: 1
    });

    if (error) {
      redirectWithError(error.message);
    }

    if (initialInventory !== null && initialInventory > 0) {
      const { data: fallbackLocation, error: fallbackLocationError } = await supabase
        .from("warehouse_location")
        .select("id, warehouse_id")
        .eq("is_active", true)
        .eq("is_pickable", true)
        .order("location_code", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (fallbackLocationError || !fallbackLocation) {
        redirectWithError("No active pickable warehouse/bin location was found for the initial part inventory.");
      }

      const activeFallbackLocation = fallbackLocation!;
      const { error: inventoryError } = await supabase.from("inventory_balance").insert({
        inventory_condition: "regular",
        product_id: activeNewPartProduct.id,
        product_packing_box_id: null,
        quantity_allocated: 0,
        quantity_on_hand: initialInventory,
        warehouse_id: activeFallbackLocation.warehouse_id,
        warehouse_location_id: activeFallbackLocation.id
      });

      if (inventoryError) {
        redirectWithError(inventoryError.message);
      }
    }

    if (newPartImageFiles.length > 0) {
      const bucketName = "product-images";
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

      if (bucketsError) {
        redirectWithError(bucketsError.message);
      }

      if (!buckets?.some((bucket) => bucket.name === bucketName)) {
        const { error: createBucketError } = await supabase.storage.createBucket(bucketName, { public: false });

        if (createBucketError) {
          redirectWithError(createBucketError.message);
        }
      }

      for (const [index, imageFile] of newPartImageFiles.entries()) {
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `product/${activeNewPartProduct.id}/${Date.now()}-${index}-${safeName}`;
        const fileBody = new Uint8Array(await imageFile.arrayBuffer());
        const { error: uploadError } = await supabase.storage.from(bucketName).upload(storagePath, fileBody, {
          contentType: imageFile.type || "application/octet-stream",
          upsert: false
        });

        if (uploadError) {
          redirectWithError(uploadError.message);
        }

        const { data: attachment, error: attachmentError } = await supabase
          .from("attachment")
          .insert({
            category: "product_image:stock",
            content_type: imageFile.type || null,
            entity_id: activeNewPartProduct.id,
            entity_type: "product",
            file_size: imageFile.size,
            original_file_name: imageFile.name,
            storage_bucket: bucketName,
            storage_path: storagePath
          })
          .select("id")
          .single();

        if (attachmentError || !attachment) {
          redirectWithError(attachmentError?.message ?? "Unable to save part image file record.");
        }

        const activeAttachment = attachment!;

        const { error: imageError } = await supabase.from("product_image").insert({
          display_name: imageFile.name,
          file_id: activeAttachment.id,
          image_category: "stock",
          is_default_thumbnail: index === 0,
          product_id: activeNewPartProduct.id,
          sort_order: (index + 1) * 10
        });

        if (imageError) {
          redirectWithError(imageError.message);
        }
      }
    }
  }

  redirect(`/?module=products&product=${productId}&product_tab=parts`);
}

async function deletePartParentLinkAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const partId = String(formData.get("part_id") ?? "").trim();
  const parentLinkId = String(formData.get("parent_link_id") ?? "").trim();

  if (!partId || !parentLinkId) {
    redirect("/?module=product-parts&error=Missing%20part%20parent%20link.");
  }

  const { error } = await supabase
    .from("product_part")
    .update({ is_active: false })
    .eq("id", parentLinkId)
    .eq("component_product_id", partId);

  if (error) {
    redirect(`/?module=product-parts&part=${partId}&product_tab=parents&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/?module=product-parts&part=${partId}&product_tab=parents`);
}

async function updateProductVendorsAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const action = String(formData.get("vendor_action") ?? "edit").trim();
  const selectedIds = formData.getAll("selected_vendor_product_ids").map((value) => String(value).trim()).filter(Boolean);
  const returnToVendors = () => redirect(`/?module=products&product=${productId}&product_tab=vendors`);
  const redirectWithError = (message: string) =>
    redirect(`/?module=edit-product-vendors&product=${productId}&vendor_action=${action}&selected_vendor_products=${selectedIds.join(",")}&error=${encodeURIComponent(message)}`);
  const optionalNumber = (key: string) => {
    const raw = String(formData.get(key) ?? "").trim();
    return raw ? Number(raw) : null;
  };

  if (!productId) {
    redirect("/?module=products&error=Missing%20product.");
  }

  if (action === "delete") {
    if (selectedIds.length === 0) redirectWithError("Select at least one vendor line.");
    const { error } = await supabase.from("vendor_product").update({ is_active: false }).eq("product_id", productId).in("id", selectedIds);
    if (error) redirectWithError(error.message);
    returnToVendors();
  }

  if (action === "add") {
    const vendorId = String(formData.get("vendor_id") ?? "").trim();
    const vendorItemNumber = String(formData.get("vendor_item_number") ?? "").trim();
    const unitCost = optionalNumber("unit_cost");
    const moq = optionalNumber("minimum_order_quantity");
    const leadTime = optionalNumber("lead_time_days");

    if (!vendorId || !vendorItemNumber || unitCost === null || unitCost < 0 || (moq !== null && moq <= 0) || (leadTime !== null && (!Number.isInteger(leadTime) || leadTime < 0))) {
      redirectWithError("Vendor, vendor item number, non-negative price, and valid MOQ/lead time are required.");
    }

    const { error } = await supabase.from("vendor_product").insert({
      lead_time_days: leadTime,
      minimum_order_quantity: moq,
      product_id: productId,
      unit_cost: unitCost!,
      vendor_id: vendorId,
      vendor_item_name: String(formData.get("vendor_item_name") ?? "").trim() || null,
      vendor_item_number: vendorItemNumber
    });
    if (error) redirectWithError(error.message);
    returnToVendors();
  }

  if (selectedIds.length === 0) redirectWithError("Select at least one vendor line.");

  for (const id of selectedIds) {
    const unitCost = optionalNumber(`unit_cost_${id}`);
    const moq = optionalNumber(`minimum_order_quantity_${id}`);
    const leadTime = optionalNumber(`lead_time_days_${id}`);
    const vendorItemNumber = String(formData.get(`vendor_item_number_${id}`) ?? "").trim();

    if (!vendorItemNumber || unitCost === null || unitCost < 0 || (moq !== null && moq <= 0) || (leadTime !== null && (!Number.isInteger(leadTime) || leadTime < 0))) {
      redirectWithError("Vendor item number, non-negative price, and valid MOQ/lead time are required.");
    }

    const { error } = await supabase
      .from("vendor_product")
      .update({ lead_time_days: leadTime, minimum_order_quantity: moq, unit_cost: unitCost!, vendor_item_number: vendorItemNumber })
      .eq("id", id)
      .eq("product_id", productId);
    if (error) redirectWithError(error.message);
  }

  returnToVendors();
}

async function addPartParentProductsAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const partId = String(formData.get("part_id") ?? "").trim();
  const parentProductIds = formData.getAll("parent_product_ids").map((value) => String(value).trim()).filter(Boolean);
  const partRoleValue = String(formData.get("part_role") ?? "").trim();
  const notesValue = String(formData.get("notes") ?? "").trim();
  const redirectWithError = (message: string) =>
    redirect(`/?module=edit-part-parents&part=${partId}&error=${encodeURIComponent(message)}`);

  if (!partId) {
    redirect("/?module=product-parts&error=Missing%20part.");
  }

  if (parentProductIds.length === 0) {
    redirectWithError("Select at least one parent product.");
  }

  const { data: partProduct, error: partProductError } = await supabase
    .from("product")
    .select("id")
    .eq("id", partId)
    .maybeSingle();

  if (partProductError || !partProduct) {
    redirectWithError(partProductError?.message ?? "Part was not found.");
  }

  const selectedParentIds = [...new Set(parentProductIds)].filter((parentId) => parentId !== partId);

  if (selectedParentIds.length === 0) {
    redirectWithError("A part cannot be linked to itself as a parent product.");
  }

  for (const parentProductId of selectedParentIds) {
    const { data: existingLink, error: existingLinkError } = await supabase
      .from("product_part")
      .select("id")
      .eq("parent_product_id", parentProductId)
      .eq("component_product_id", partId)
      .limit(1)
      .maybeSingle();

    if (existingLinkError) {
      redirectWithError(existingLinkError.message);
    }

    const payload = {
      component_product_id: partId,
      is_active: true,
      is_required: formData.get("is_required") === "on",
      notes: notesValue || null,
      parent_product_id: parentProductId,
      part_name: null,
      part_role: partRoleValue || null,
      quantity_required: 1
    };
    const result = existingLink
      ? await supabase.from("product_part").update(payload).eq("id", existingLink.id)
      : await supabase.from("product_part").insert(payload);

    if (result.error) {
      redirectWithError(result.error.message);
    }
  }

  redirect(`/?module=product-parts&part=${partId}&product_tab=parents`);
}

async function updateBillingCreditAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const billingProfileId = String(formData.get("billing_profile_id") ?? "").trim();

  if (!customerId) {
    redirect(`/?module=edit-billing-credit&customer=${customerId}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const creditLimitRaw = optionalText("credit_limit");
  const creditLimit = creditLimitRaw ? Number(creditLimitRaw) : null;
  const paymentDays = Number(formData.get("payment_days") ?? 0);
  const paymentTerms = optionalText("payment_terms") ?? "Prepaid / No Credit";
  const defaultStatementEmail = optionalText("default_statement_email");
  const profile = {
    credit_limit: creditLimit,
    credit_limit_source: creditLimit === null ? "system_default" : "customer_override",
    customer_account_id: customerId,
    default_statement_email: defaultStatementEmail,
    invoice_delivery_method: defaultStatementEmail ? "email" : "print",
    payment_days: Number.isFinite(paymentDays) ? paymentDays : 0,
    payment_terms: paymentTerms,
    statement_delivery_method: defaultStatementEmail ? "email" : "print"
  } as const;

  const result = billingProfileId
    ? await supabase.from("customer_billing_profile").update(profile).eq("id", billingProfileId).eq("customer_account_id", customerId)
    : await supabase.from("customer_billing_profile").insert(profile);

  if (result.error) {
    redirect(`/?module=edit-billing-credit&customer=${customerId}&error=${encodeURIComponent(result.error.message)}`);
  }

  const { error: customerError } = await supabase
    .from("customer_account")
    .update({
      billing_email: defaultStatementEmail
    })
    .eq("id", customerId);

  if (customerError) {
    redirect(`/?module=edit-billing-credit&customer=${customerId}&error=${encodeURIComponent(customerError.message)}`);
  }

  redirect(`/?customer=${customerId}`);
}

async function addLocationAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const locationName = String(formData.get("location_name") ?? "").trim();

  if (!customerId || !locationName) {
    redirect(`/?module=add-location&customer=${customerId}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const countryCode = optionalText("country_code") ?? "USA";
  const country = countryOptions.find((option) => option.code === countryCode)?.name ?? "United States";
  const isShowroom = formData.get("is_showroom") === "on";
  const isPrimaryShowroom = isShowroom && formData.get("is_primary_showroom") === "on";

  const { data, error } = await supabase
    .from("customer_location")
    .insert({
      address_line_1: optionalText("address_line_1"),
      address_line_2: optionalText("address_line_2"),
      city: optionalText("city"),
      country,
      country_code: countryCode,
      customer_account_id: customerId,
      default_ship_to_order_channel: formData.get("is_default_ship_to") === "on" ? "manual" : null,
      is_billing_address: formData.get("is_billing_address") === "on",
      is_default_ship_to: formData.get("is_default_ship_to") === "on",
      is_shipping_address: formData.get("is_shipping_address") === "on",
      is_showroom: isShowroom,
      location_name: locationName,
      location_type: isShowroom ? "showroom" : "ship_to",
      postal_code: optionalText("postal_code"),
      state_province: optionalText("state_province"),
      status: "active"
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/?module=add-location&customer=${customerId}&error=${encodeURIComponent(error.message)}`);
  }

  if (isPrimaryShowroom) {
    const { error: showroomError } = await supabase.from("primary_showroom_enrollment").insert({
      customer_account_id: customerId,
      customer_location_id: data.id,
      program_status: "pending",
      required_display_count: 0,
      current_display_count: 0,
      discount_percent: 0
    });

    if (showroomError) {
      redirect(`/?module=add-location&customer=${customerId}&error=${encodeURIComponent(showroomError.message)}`);
    }
  }

  redirect(`/?module=view-location&customer=${customerId}&location=${data.id}`);
}

async function updateLocationAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const locationId = String(formData.get("location_id") ?? "").trim();
  const locationName = String(formData.get("location_name") ?? "").trim();

  if (!customerId || !locationId || !locationName) {
    redirect(`/?module=edit-location&customer=${customerId}&location=${locationId}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const countryCode = optionalText("country_code") ?? "USA";
  const country = countryOptions.find((option) => option.code === countryCode)?.name ?? "United States";
  const isShowroom = formData.get("is_showroom") === "on";
  const isPrimaryShowroom = isShowroom && formData.get("is_primary_showroom") === "on";

  const { error } = await supabase
    .from("customer_location")
    .update({
      address_line_1: optionalText("address_line_1"),
      address_line_2: optionalText("address_line_2"),
      city: optionalText("city"),
      country,
      country_code: countryCode,
      default_ship_to_order_channel: formData.get("is_default_ship_to") === "on" ? "manual" : null,
      is_billing_address: formData.get("is_billing_address") === "on",
      is_default_ship_to: formData.get("is_default_ship_to") === "on",
      is_shipping_address: formData.get("is_shipping_address") === "on",
      is_showroom: isShowroom,
      location_name: locationName,
      location_type: isShowroom ? "showroom" : "ship_to",
      postal_code: optionalText("postal_code"),
      state_province: optionalText("state_province"),
      status: String(formData.get("status") ?? "active") === "inactive" ? "inactive" : "active"
    })
    .eq("id", locationId)
    .eq("customer_account_id", customerId);

  if (error) {
    redirect(`/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(error.message)}`);
  }

  const { data: existingEnrollment, error: existingError } = await supabase
    .from("primary_showroom_enrollment")
    .select("id, program_status")
    .eq("customer_location_id", locationId)
    .in("program_status", ["pending", "active", "pending_renew", "suspended"])
    .maybeSingle();

  if (existingError) {
    redirect(`/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(existingError.message)}`);
  }

  if (isPrimaryShowroom && !existingEnrollment) {
    const { error: showroomError } = await supabase.from("primary_showroom_enrollment").insert({
      customer_account_id: customerId,
      customer_location_id: locationId,
      program_status: "pending",
      required_display_count: 0,
      current_display_count: 0,
      discount_percent: 0
    });

    if (showroomError) {
      redirect(`/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(showroomError.message)}`);
    }
  }

  if (!isPrimaryShowroom && existingEnrollment) {
    const { error: showroomUpdateError } = await supabase
      .from("primary_showroom_enrollment")
      .update({ program_status: "cancelled" })
      .eq("id", existingEnrollment.id);

    if (showroomUpdateError) {
      redirect(`/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(showroomUpdateError.message)}`);
    }
  }

  redirect(`/?module=view-location&customer=${customerId}&location=${locationId}`);
}

async function updateContactAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const contactId = String(formData.get("contact_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!customerId || !contactId || !name) {
    redirect(`/?module=edit-contact&customer=${customerId}&contact=${contactId}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };

  const { error } = await supabase
    .from("customer_contact")
    .update({
      customer_location_id: optionalText("customer_location_id"),
      department: optionalText("department"),
      email: optionalText("email"),
      fax: optionalText("fax"),
      is_active: String(formData.get("status") ?? "active") === "active",
      is_billing_contact: formData.get("is_billing_contact") === "on",
      is_primary: formData.get("is_primary") === "on",
      is_purchasing_contact: formData.get("is_purchasing_contact") === "on",
      is_showroom_floor_sales: formData.get("is_showroom_floor_sales") === "on",
      is_showroom_manager: formData.get("is_showroom_manager") === "on",
      is_warehouse_receiver: formData.get("is_warehouse_receiver") === "on",
      mobile: optionalText("mobile"),
      name,
      phone: optionalText("phone"),
      title: optionalText("title")
    })
    .eq("id", contactId)
    .eq("customer_account_id", customerId);

  if (error) {
    redirect(`/?module=edit-contact&customer=${customerId}&contact=${contactId}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/?module=view-contact&customer=${customerId}&contact=${contactId}`);
}

async function addContactAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!customerId || !name) {
    redirect(`/?module=add-contact&customer=${customerId}&error=missing_required`);
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };

  const { data, error } = await supabase
    .from("customer_contact")
    .insert({
      customer_account_id: customerId,
      customer_location_id: optionalText("customer_location_id"),
      department: optionalText("department"),
      email: optionalText("email"),
      fax: optionalText("fax"),
      is_active: true,
      is_billing_contact: formData.get("is_billing_contact") === "on",
      is_primary: formData.get("is_primary") === "on",
      is_purchasing_contact: formData.get("is_purchasing_contact") === "on",
      is_showroom_floor_sales: formData.get("is_showroom_floor_sales") === "on",
      is_showroom_manager: formData.get("is_showroom_manager") === "on",
      is_warehouse_receiver: formData.get("is_warehouse_receiver") === "on",
      mobile: optionalText("mobile"),
      name,
      phone: optionalText("phone"),
      title: optionalText("title")
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/?module=add-contact&customer=${customerId}&error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/?module=view-contact&customer=${customerId}&contact=${data.id}`);
}

async function updateFreightPolicyAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const policyId = String(formData.get("freight_policy_id") ?? "").trim();

  if (!customerId) {
    redirect("/?module=customers");
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const freightTerm = (value: FormDataEntryValue | null) => {
    const text = String(value ?? "prepaid");
    return ["prepaid", "collect", "customer_pickup", "free_freight", "flat_rate", "manual_review"].includes(text)
      ? (text as "prepaid" | "collect" | "customer_pickup" | "free_freight" | "flat_rate" | "manual_review")
      : "prepaid";
  };
  const freightTerms = freightTerm(formData.get("freight_terms"));
  const freightAllowanceRaw = optionalText("freight_allowance_amount");
  const flatRateRaw = optionalText("flat_rate_percent");
  const policy = {
    customer_account_id: customerId,
    customer_location_id: null,
    default_ground_carrier: freightTerms === "collect" ? optionalText("ground_customer_collect_carrier") : null,
    default_ground_carrier_account_number: freightTerms === "collect" ? optionalText("ground_customer_collect_account_number") : null,
    default_ltl_carrier: freightTerms === "collect" ? optionalText("ltl_customer_collect_carrier") : null,
    default_ltl_carrier_account_number: freightTerms === "collect" ? optionalText("ltl_customer_collect_account_number") : null,
    flat_rate_percent: flatRateRaw && freightTerms === "flat_rate" ? Number(flatRateRaw) : null,
    freight_allowance_amount: freightAllowanceRaw ? Number(freightAllowanceRaw) : null,
    freight_terms: freightTerms,
    ground_freight_terms: freightTerms,
    is_default: true,
    ltl_freight_terms: freightTerms,
    policy_name: "Default Freight Policy",
    preferred_shipping_type: null
  };

  const result = policyId
    ? await supabase.from("customer_freight_policy").update(policy).eq("id", policyId)
    : await supabase.from("customer_freight_policy").insert(policy);

  if (result.error) {
    redirect(`/?module=edit-freight&customer=${customerId}&error=${encodeURIComponent(result.error.message)}`);
  }

  redirect(`/?customer=${customerId}#freight`);
}

async function searchCustomers(query: string, mode: "active" | "obsolete" = "active") {
  const supabase = createSupabaseAdminClient();
  const cleanQuery = query.trim();
  let request = supabase
    .from("customer_account")
    .select(
      "id, account_number, legacy_account_id, name, legal_name, status, default_discount_percent, is_sales_tax_exempt, billing_contact_name, billing_email, purchase_contact_name, purchase_email, account_type_id, business_type_id"
    )
    .order("name", { ascending: true })
    .limit(20);

  if (mode === "obsolete") {
    request = request.eq("status", "obsolete" as "inactive");
  } else {
    request = request.not("status", "in", "(inactive,obsolete)");
  }

  if (cleanQuery) {
    const escaped = cleanQuery.replaceAll("%", "\\%").replaceAll("_", "\\_");
    request = request.or(
      `name.ilike.%${escaped}%,legal_name.ilike.%${escaped}%,account_number.ilike.%${escaped}%,legacy_account_id.ilike.%${escaped}%`
    );
  }

  const { data, error } = await request;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CustomerAccount[];
}

async function searchProducts(
  query: string,
  filters: ProductSearchFilters = {},
  page = 1,
  pageSize = 10,
  mode: "active" | "discontinued" = "active"
): Promise<ProductSearchResult> {
  const supabase = createSupabaseAdminClient();
  const cleanQuery = query.trim();
  let constrainedProductIds: Set<string> | null = null;

  // Parts use the Accessory category but are maintained separately from sellable products.
  const { data: accessoryCategories, error: accessoryCategoryError } = await supabase
    .from("product_category")
    .select("id")
    .or("category_code.eq.accessory,name.ilike.Accessory");

  if (accessoryCategoryError) {
    throw new Error(accessoryCategoryError.message);
  }

  const accessoryCategoryIds = (accessoryCategories ?? []).map((category) => category.id);

  const intersectProductIds = (productIds: string[]) => {
    const next = new Set(productIds);
    constrainedProductIds = constrainedProductIds
      ? new Set([...constrainedProductIds].filter((productId) => next.has(productId)))
      : next;
  };

  if (filters.finishId) {
    const { data: finishData, error: finishError } = await supabase
      .from("product_finish")
      .select("product_id")
      .eq("finish_id", filters.finishId)
      .eq("is_active", true);

    if (finishError) {
      throw new Error(finishError.message);
    }

    intersectProductIds((finishData ?? []).map((finish) => finish.product_id));
  }

  if (filters.lightCount) {
    const { data: lightData, error: lightError } = await supabase
      .from("product_spec_attribute")
      .select("product_id")
      .ilike("attribute_name", "%light%")
      .eq("attribute_value", filters.lightCount)
      .eq("is_active", true);

    if (lightError) {
      throw new Error(lightError.message);
    }

    intersectProductIds((lightData ?? []).map((spec) => spec.product_id));
  }

  const constrainedIds = constrainedProductIds as Set<string> | null;

  if (constrainedIds !== null && constrainedIds.size === 0) {
    return {
      items: [],
      page,
      pageSize,
      totalCount: 0,
      totalPages: 1
    };
  }

  const offset = (page - 1) * pageSize;
  let request = supabase
    .from("product")
    .select(
      "id, sku, name, collection, status, sellability_status, customer_eligibility_tag, default_price, brand(name), product_category(name), product_signature_suite(name)",
      { count: "exact" }
    )
    .order("sku", { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (mode === "discontinued") {
    request = request.in("status", ["discontinued", "deleted"]);
  } else {
    request = request.neq("status", "deleted").neq("status", "discontinued");
  }

  if (accessoryCategoryIds.length > 0) {
    request = request.not("product_category_id", "in", `(${accessoryCategoryIds.join(",")})`);
  }

  if (filters.brandId) {
    request = request.eq("brand_id", filters.brandId);
  }

  if (filters.styleId) {
    request = request.eq("signature_suite_id", filters.styleId);
  }

  if (filters.categoryId) {
    request = request.eq("product_category_id", filters.categoryId);
  }

  if (filters.eligibility) {
    request = request.eq("customer_eligibility_tag", filters.eligibility as "all");
  }

  if (filters.status && mode !== "discontinued") {
    request = request.eq("status", filters.status as "active");
  }

  if (constrainedIds) {
    request = request.in("id", [...constrainedIds]);
  }

  if (cleanQuery) {
    const escaped = cleanQuery.replaceAll("%", "\\%").replaceAll("_", "\\_");
    request = request.or(`sku.ilike.%${escaped}%,name.ilike.%${escaped}%,collection.ilike.%${escaped}%`);
  }

  const { count, data, error } = await request;

  if (error) {
    throw new Error(error.message);
  }

  const rows = data ?? [];
  const productIds = rows.map((product) => product.id);
  const { data: inventoryData, error: inventoryError } = productIds.length
    ? await supabase
        .from("inventory_sku_summary")
        .select("product_id, sellable_quantity, incoming_quantity, next_incoming_eta")
        .in("product_id", productIds)
    : { data: [], error: null };

  if (inventoryError) {
    throw new Error(inventoryError.message);
  }

  const inventoryByProductId = new Map((inventoryData ?? []).map((item) => [item.product_id, item]));
  const { data: productPartData, error: productPartError } = productIds.length
    ? await supabase
        .from("product_part")
        .select("id, parent_product_id, component_product_id, quantity_required, part_name, part_role, is_required, notes")
        .eq("is_active", true)
        .in("parent_product_id", productIds)
    : { data: [], error: null };

  if (productPartError) {
    throw new Error(productPartError.message);
  }

  const componentProductIds = [...new Set((productPartData ?? []).map((part) => part.component_product_id))];
  const { data: componentProductData, error: componentProductError } = componentProductIds.length
    ? await supabase
        .from("product")
        .select("id, sku, name, status, sellability_status")
        .in("id", componentProductIds)
    : { data: [], error: null };

  if (componentProductError) {
    throw new Error(componentProductError.message);
  }

  const { data: componentInventoryData, error: componentInventoryError } = componentProductIds.length
    ? await supabase
        .from("inventory_sku_summary")
        .select("product_id, sellable_quantity, incoming_quantity, next_incoming_eta")
        .in("product_id", componentProductIds)
    : { data: [], error: null };

  if (componentInventoryError) {
    throw new Error(componentInventoryError.message);
  }

  const productById = new Map(
    rows.map((product) => [
      product.id,
      {
        name: product.name,
        sku: product.sku
      }
    ])
  );
  const componentProductById = new Map((componentProductData ?? []).map((product) => [product.id, product]));
  const componentInventoryByProductId = new Map((componentInventoryData ?? []).map((item) => [item.product_id, item]));
  const partsByParentProductId = new Map<string, ProductComponentPartItem[]>();

  (productPartData ?? []).forEach((part) => {
    const parentProduct = productById.get(part.parent_product_id);
    const componentProduct = componentProductById.get(part.component_product_id);

    if (!parentProduct || !componentProduct) {
      return;
    }

    const inventory = componentInventoryByProductId.get(part.component_product_id);
    const partItem: ProductComponentPartItem = {
      component_name: componentProduct.name,
      component_product_id: part.component_product_id,
      component_sellability_status: componentProduct.sellability_status,
      component_sku: componentProduct.sku,
      component_status: componentProduct.status,
      id: part.id,
      incoming_quantity: inventory?.incoming_quantity ?? null,
      next_incoming_eta: inventory?.next_incoming_eta ?? null,
      parent_name: parentProduct.name,
      parent_product_id: part.parent_product_id,
      parent_sku: parentProduct.sku,
      is_required: part.is_required,
      notes: part.notes,
      part_name: part.part_name,
      part_role: part.part_role,
      quantity_required: Number(part.quantity_required),
      sellable_quantity: inventory?.sellable_quantity ?? 0
    };

    partsByParentProductId.set(part.parent_product_id, [...(partsByParentProductId.get(part.parent_product_id) ?? []), partItem]);
  });

  const items = rows.map((product) => {
    const inventory = inventoryByProductId.get(product.id);

    return {
      brand_name: product.brand?.name ?? "Not set",
      category_name: product.product_category?.name ?? null,
      collection: product.collection,
      customer_eligibility_tag: product.customer_eligibility_tag,
      default_price: product.default_price,
      id: product.id,
      incoming_quantity: inventory?.incoming_quantity ?? null,
      name: product.name,
      next_incoming_eta: inventory?.next_incoming_eta ?? null,
      sellability_status: product.sellability_status,
      sellable_quantity: inventory?.sellable_quantity ?? 0,
      signature_suite_name: product.product_signature_suite?.name ?? null,
      sku: product.sku,
      status: product.status,
      parts: partsByParentProductId.get(product.id) ?? []
    };
  }) as ProductListItem[];

  return {
    items,
    page,
    pageSize,
    totalCount: count ?? items.length,
    totalPages: Math.max(1, Math.ceil((count ?? items.length) / pageSize))
  };
}

async function searchProductParts(query: string, page = 1, pageSize = 10): Promise<ProductPartSearchResult> {
  const supabase = createSupabaseAdminClient();
  const cleanQuery = query.trim();
  const offset = (page - 1) * pageSize;
  const escaped = cleanQuery.replaceAll("%", "\\%").replaceAll("_", "\\_");

  const { data: accessoryCategories, error: accessoryCategoryError } = await supabase
    .from("product_category")
    .select("id")
    .or("category_code.eq.accessory,name.ilike.Accessory");

  if (accessoryCategoryError) {
    throw new Error(accessoryCategoryError.message);
  }

  const accessoryCategoryIds = (accessoryCategories ?? []).map((category) => category.id);

  if (accessoryCategoryIds.length === 0) {
    return {
      items: [],
      page,
      pageSize,
      totalCount: 0,
      totalPages: 1
    };
  }

  let componentIdsLinkedToMatchingParents: string[] = [];

  if (cleanQuery) {
    const { data: matchingProducts, error: matchingProductsError } = await supabase
      .from("product")
      .select("id")
      .or(`sku.ilike.%${escaped}%,name.ilike.%${escaped}%`)
      .limit(500);

    if (matchingProductsError) {
      throw new Error(matchingProductsError.message);
    }

    const matchingProductIds = (matchingProducts ?? []).map((product) => product.id);

    if (matchingProductIds.length > 0) {
      const { data: matchingParentParts, error: matchingParentPartsError } = await supabase
        .from("product_part")
        .select("component_product_id")
        .eq("is_active", true)
        .in("parent_product_id", matchingProductIds);

      if (matchingParentPartsError) {
        throw new Error(matchingParentPartsError.message);
      }

      componentIdsLinkedToMatchingParents = [
        ...new Set((matchingParentParts ?? []).map((part) => part.component_product_id))
      ];
    }
  }

  let request = supabase
    .from("product")
    .select("id, sku, name, status, sellability_status, default_price, brand(name)", { count: "exact" })
    .in("product_category_id", accessoryCategoryIds)
    .neq("status", "deleted")
    .order("sku", { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (cleanQuery) {
    const searchClauses = [`sku.ilike.%${escaped}%`, `name.ilike.%${escaped}%`];

    if (componentIdsLinkedToMatchingParents.length > 0) {
      searchClauses.push(`id.in.(${componentIdsLinkedToMatchingParents.join(",")})`);
    }

    request = request.or(searchClauses.join(","));
  }

  const { count, data, error } = await request;

  if (error) {
    throw new Error(error.message);
  }

  const partProducts = data ?? [];
  const partProductIds = partProducts.map((product) => product.id);
  const { data: inventoryData, error: inventoryError } = partProductIds.length
    ? await supabase
        .from("inventory_sku_summary")
        .select("product_id, sellable_quantity, incoming_quantity, next_incoming_eta")
        .in("product_id", partProductIds)
    : { data: [], error: null };

  if (inventoryError) {
    throw new Error(inventoryError.message);
  }

  const { data: parentPartRows, error: parentPartError } = partProductIds.length
    ? await supabase
        .from("product_part")
        .select("parent_product_id, component_product_id, quantity_required, part_name, part_role")
        .eq("is_active", true)
        .in("component_product_id", partProductIds)
    : { data: [], error: null };

  if (parentPartError) {
    throw new Error(parentPartError.message);
  }

  const parentProductIds = [...new Set((parentPartRows ?? []).map((part) => part.parent_product_id))];
  const { data: parentProductData, error: parentProductError } = parentProductIds.length
    ? await supabase
        .from("product")
        .select("id, sku, name")
        .in("id", parentProductIds)
    : { data: [], error: null };

  if (parentProductError) {
    throw new Error(parentProductError.message);
  }

  const parentProductById = new Map((parentProductData ?? []).map((product) => [product.id, product]));
  const inventoryByProductId = new Map((inventoryData ?? []).map((item) => [item.product_id, item]));
  const parentsByPartProductId = new Map<string, AccessoryPartListItem["parent_products"]>();

  (parentPartRows ?? []).forEach((part) => {
    const parentProduct = parentProductById.get(part.parent_product_id);

    if (!parentProduct) {
      return;
    }

    parentsByPartProductId.set(part.component_product_id, [
      ...(parentsByPartProductId.get(part.component_product_id) ?? []),
      {
        id: parentProduct.id,
        name: parentProduct.name,
        part_name: part.part_name,
        sku: parentProduct.sku,
        quantity_required: Number(part.quantity_required),
        part_role: part.part_role
      }
    ]);
  });

  const items: AccessoryPartListItem[] = partProducts.map((product) => {
    const inventory = inventoryByProductId.get(product.id);

    return {
      brand_name: product.brand?.name ?? "Not set",
      default_price: product.default_price,
      id: product.id,
      incoming_quantity: inventory?.incoming_quantity ?? null,
      name: product.name,
      next_incoming_eta: inventory?.next_incoming_eta ?? null,
      parent_products: parentsByPartProductId.get(product.id) ?? [],
      sellability_status: product.sellability_status,
      sellable_quantity: inventory?.sellable_quantity ?? 0,
      sku: product.sku,
      status: product.status
    };
  });

  return {
    items,
    page,
    pageSize,
    totalCount: count ?? items.length,
    totalPages: Math.max(1, Math.ceil((count ?? items.length) / pageSize))
  };
}

async function getProductDetail(productId: string): Promise<ProductDetail | null> {
  const supabase = createSupabaseAdminClient();
  const { data: product, error: productError } = await supabase
    .from("product")
    .select(
      "id, sku, name, description, collection, status, sellability_status, customer_eligibility_tag, counts_toward_primary_showroom_default, primary_showroom_exclusion_reason, default_price, currency, default_vendor_item_number, no_box_needed, brand_id, product_category_id, signature_suite_id, brand(name), product_category(name), product_signature_suite(name)"
    )
    .eq("id", productId)
    .maybeSingle();

  if (productError) {
    throw new Error(productError.message);
  }

  if (!product) {
    return null;
  }

  const [
    finishesResult,
    summaryResult,
    boxesResult,
    inventoryResult,
    partsResult,
    usedInResult,
    imagesResult,
    documentsResult,
    productDocumentAttachmentsResult,
    specsResult,
    hangingResult,
    vendorProductsResult
  ] = await Promise.all([
    supabase
      .from("product_finish")
      .select("finish(finish_name)")
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("inventory_sku_summary")
      .select("sellable_quantity, incoming_quantity, next_incoming_eta")
      .eq("product_id", productId)
      .maybeSingle(),
    supabase
      .from("product_packing_box")
      .select(
        "id, box_sequence, box_label, net_weight, gross_weight, box_length, box_width, box_height, inch_volume, cbm, default_warehouse_id, default_warehouse_location_id, is_required_for_sale, pallet_quantity, notes"
      )
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("box_sequence", { ascending: true }),
    supabase
      .from("inventory_balance")
      .select("id, product_packing_box_id, warehouse_id, warehouse_location_id, inventory_condition, quantity_on_hand, quantity_allocated, quantity_available")
      .eq("product_id", productId)
      .order("inventory_condition", { ascending: true }),
    supabase
      .from("product_part")
      .select("id, parent_product_id, component_product_id, quantity_required, part_name, part_role, is_required, notes")
      .eq("parent_product_id", productId)
      .eq("is_active", true),
    supabase
      .from("product_part")
      .select("id, parent_product_id, component_product_id, quantity_required, part_name, part_role, is_required, notes")
      .eq("component_product_id", productId)
      .eq("is_active", true),
    supabase
      .from("product_image")
      .select("id, file_id, image_category, display_name, sort_order, is_default_thumbnail, uploaded_at")
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("image_category", { ascending: true })
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_document")
      .select("id, file_id, document_type, display_name, sort_order, uploaded_at")
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("document_type", { ascending: true })
      .order("sort_order", { ascending: true }),
    supabase
      .from("attachment")
      .select("id, category, original_file_name, content_type, file_size, storage_bucket, storage_path, uploaded_at")
      .eq("entity_type", "product")
      .eq("entity_id", productId)
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false }),
    supabase
      .from("product_spec_attribute")
      .select("id, attribute_name, attribute_value, unit")
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_hanging_config")
      .select("mounting_type, chain_length, rod_length, wire_length, canopy_detail, notes")
      .eq("product_id", productId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("vendor_product")
      .select("id, vendor_id, vendor_item_number, unit_cost, minimum_order_quantity, lead_time_days, updated_at, vendor(name)")
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
  ]);

  const firstError = [
    finishesResult.error,
    summaryResult.error,
    boxesResult.error,
    inventoryResult.error,
    partsResult.error,
    usedInResult.error,
    imagesResult.error,
    productDocumentAttachmentsResult.error,
    specsResult.error,
    hangingResult.error,
    vendorProductsResult.error
  ].find(Boolean);

  if (firstError) {
    throw new Error(firstError.message);
  }

  const componentIds = [...new Set((partsResult.data ?? []).map((part) => part.component_product_id))];
  const usedInParentIds = [...new Set((usedInResult.data ?? []).map((part) => part.parent_product_id))];
  const relatedProductIds = [...new Set([...componentIds, ...usedInParentIds])];
  const productDocuments = documentsResult.error ? [] : (documentsResult.data ?? []);
  const boxIds = (inventoryResult.data ?? []).map((balance) => balance.product_packing_box_id).filter((id): id is string => Boolean(id));
  const imageFileIds = (imagesResult.data ?? []).map((image) => image.file_id);
  const attachmentDocumentIds = new Set((productDocumentAttachmentsResult.data ?? []).map((attachment) => attachment.id));
  const documentFileIds = productDocuments.map((document) => document.file_id).filter((fileId) => !attachmentDocumentIds.has(fileId));
  const attachmentFileIds = [...new Set([...imageFileIds, ...documentFileIds])];
  const warehouseIds = [
    ...new Set([
      ...(inventoryResult.data ?? []).map((balance) => balance.warehouse_id),
      ...(boxesResult.data ?? []).map((box) => box.default_warehouse_id).filter((id): id is string => Boolean(id))
    ])
  ];
  const locationIds = [
    ...new Set([
      ...(inventoryResult.data ?? []).map((balance) => balance.warehouse_location_id),
      ...(boxesResult.data ?? []).map((box) => box.default_warehouse_location_id).filter((id): id is string => Boolean(id))
    ])
  ];

  const [
    relatedProductsResult,
    componentInventoryResult,
    inventoryBoxesResult,
    attachmentsResult,
    warehousesResult,
    locationsResult
  ] = await Promise.all([
    relatedProductIds.length
      ? supabase
          .from("product")
          .select("id, sku, name, status, sellability_status")
          .in("id", relatedProductIds)
      : Promise.resolve({ data: [], error: null }),
    componentIds.length
      ? supabase
          .from("inventory_sku_summary")
          .select("product_id, sellable_quantity, incoming_quantity, next_incoming_eta")
          .in("product_id", componentIds)
      : Promise.resolve({ data: [], error: null }),
    boxIds.length
      ? supabase
          .from("product_packing_box")
          .select("id, box_sequence, box_label")
          .in("id", boxIds)
      : Promise.resolve({ data: [], error: null }),
    attachmentFileIds.length
      ? supabase
          .from("attachment")
          .select("id, original_file_name, content_type, file_size, storage_bucket, storage_path")
          .in("id", attachmentFileIds)
      : Promise.resolve({ data: [], error: null }),
    warehouseIds.length
      ? supabase
          .from("warehouse")
          .select("id, name")
          .in("id", warehouseIds)
      : Promise.resolve({ data: [], error: null }),
    locationIds.length
      ? supabase
          .from("warehouse_location")
          .select("id, location_code, location_name")
          .in("id", locationIds)
      : Promise.resolve({ data: [], error: null })
  ]);

  const secondError = [
    relatedProductsResult.error,
    componentInventoryResult.error,
    inventoryBoxesResult.error,
    attachmentsResult.error,
    warehousesResult.error,
    locationsResult.error
  ].find(Boolean);

  if (secondError) {
    throw new Error(secondError.message);
  }

  const relatedProductById = new Map((relatedProductsResult.data ?? []).map((item) => [item.id, item]));
  const componentInventoryByProductId = new Map((componentInventoryResult.data ?? []).map((item) => [item.product_id, item]));
  const inventoryBoxById = new Map((inventoryBoxesResult.data ?? []).map((item) => [item.id, item]));
  const attachmentById = new Map((attachmentsResult.data ?? []).map((item) => [item.id, item]));
  const warehouseById = new Map((warehousesResult.data ?? []).map((item) => [item.id, item]));
  const locationById = new Map((locationsResult.data ?? []).map((item) => [item.id, item]));

  const parts: ProductComponentPartItem[] = (partsResult.data ?? []).flatMap((part) => {
    const componentProduct = relatedProductById.get(part.component_product_id);

    if (!componentProduct) {
      return [];
    }

    const inventory = componentInventoryByProductId.get(part.component_product_id);

    return [
      {
        component_name: componentProduct.name,
        component_product_id: part.component_product_id,
        component_sellability_status: componentProduct.sellability_status,
        component_sku: componentProduct.sku,
        component_status: componentProduct.status,
        id: part.id,
        incoming_quantity: inventory?.incoming_quantity ?? null,
        next_incoming_eta: inventory?.next_incoming_eta ?? null,
        parent_name: product.name,
        parent_product_id: product.id,
        parent_sku: product.sku,
        is_required: part.is_required,
        notes: part.notes,
        part_name: part.part_name,
        part_role: part.part_role,
        quantity_required: Number(part.quantity_required),
        sellable_quantity: inventory?.sellable_quantity ?? 0
      }
    ];
  });

  const usedInParents: ProductComponentPartItem[] = (usedInResult.data ?? []).flatMap((part) => {
    const parentProduct = relatedProductById.get(part.parent_product_id);

    if (!parentProduct) {
      return [];
    }

    return [
      {
        component_name: product.name,
        component_product_id: product.id,
        component_sellability_status: product.sellability_status,
        component_sku: product.sku,
        component_status: product.status,
        id: part.id,
        incoming_quantity: summaryResult.data?.incoming_quantity ?? null,
        next_incoming_eta: summaryResult.data?.next_incoming_eta ?? null,
        parent_name: parentProduct.name,
        parent_product_id: part.parent_product_id,
        parent_sku: parentProduct.sku,
        is_required: part.is_required,
        notes: part.notes,
        part_name: part.part_name,
        part_role: part.part_role,
        quantity_required: Number(part.quantity_required),
        sellable_quantity: summaryResult.data?.sellable_quantity ?? 0
      }
    ];
  });

  const linkedDocumentDetails = await Promise.all(
    productDocuments.map(async (document) => {
      const attachment = attachmentById.get(document.file_id);

      if (!attachment) {
        return null;
      }

      const { data: signedUrlData } = await supabase.storage
        .from(attachment.storage_bucket)
        .createSignedUrl(attachment.storage_path, 60 * 60);

      return {
        content_type: attachment.content_type,
        display_name: document.display_name,
        document_type: document.document_type as ProductDocumentType,
        file_size: attachment.file_size === null ? null : Number(attachment.file_size),
        id: document.id,
        original_file_name: attachment.original_file_name,
        signed_url: signedUrlData?.signedUrl ?? null,
        storage_bucket: attachment.storage_bucket,
        storage_path: attachment.storage_path,
        uploaded_at: document.uploaded_at
      } satisfies ProductDocumentDetail;
    })
  );
  const normalizeProductDocumentType = (value: string | null): ProductDocumentType =>
    ["spec_sheet", "installation_instruction", "manual", "box_label", "cad_drawing", "other"].includes(value ?? "")
      ? (value as ProductDocumentType)
      : "other";
  const attachmentDocumentDetails = await Promise.all(
    (productDocumentAttachmentsResult.data ?? []).map(async (attachment) => {
      const { data: signedUrlData } = await supabase.storage
        .from(attachment.storage_bucket)
        .createSignedUrl(attachment.storage_path, 60 * 60);

      return {
        content_type: attachment.content_type,
        display_name: null,
        document_type: normalizeProductDocumentType(attachment.category),
        file_size: attachment.file_size === null ? null : Number(attachment.file_size),
        id: attachment.id,
        original_file_name: attachment.original_file_name,
        signed_url: signedUrlData?.signedUrl ?? null,
        storage_bucket: attachment.storage_bucket,
        storage_path: attachment.storage_path,
        uploaded_at: attachment.uploaded_at
      } satisfies ProductDocumentDetail;
    })
  );
  const documentDetails = [
    ...attachmentDocumentDetails,
    ...linkedDocumentDetails.filter((document): document is NonNullable<typeof document> => Boolean(document))
  ];
  const imageDetails = await Promise.all(
    (imagesResult.data ?? []).map(async (image) => {
      const attachment = attachmentById.get(image.file_id);

      if (!attachment) {
        return null;
      }

      const { data: signedUrlData } = await supabase.storage
        .from(attachment.storage_bucket)
        .createSignedUrl(attachment.storage_path, 60 * 60);
      const publicUrl = supabase.storage.from(attachment.storage_bucket).getPublicUrl(attachment.storage_path).data.publicUrl;

      return {
        content_type: attachment.content_type,
        display_name: image.display_name,
        file_size: attachment.file_size === null ? null : Number(attachment.file_size),
        id: image.id,
        image_category: image.image_category,
        is_default_thumbnail: image.is_default_thumbnail,
        original_file_name: attachment.original_file_name,
        public_url: signedUrlData?.signedUrl ?? publicUrl,
        sort_order: image.sort_order,
        storage_bucket: attachment.storage_bucket,
        storage_path: attachment.storage_path,
        uploaded_at: image.uploaded_at
      } satisfies ProductImageDetail;
    })
  );
  const inventoryBalances: ProductInventoryBalance[] = (inventoryResult.data ?? []).map((balance) => {
    const box = balance.product_packing_box_id ? inventoryBoxById.get(balance.product_packing_box_id) : null;
    const warehouse = warehouseById.get(balance.warehouse_id);
    const location = locationById.get(balance.warehouse_location_id);
    const quantityOnHand = Number(balance.quantity_on_hand);
    const quantityAllocated = Number(balance.quantity_allocated);

    return {
      box_label: box?.box_label ?? null,
      box_sequence: box?.box_sequence ?? null,
      id: balance.id,
      inventory_condition: balance.inventory_condition,
      location_code: location?.location_code ?? "Not set",
      product_packing_box_id: balance.product_packing_box_id,
      quantity_allocated: quantityAllocated,
      quantity_available: Math.max(quantityOnHand - quantityAllocated, 0),
      quantity_on_hand: quantityOnHand,
      warehouse_id: balance.warehouse_id,
      warehouse_location_id: balance.warehouse_location_id,
      warehouse_name: warehouse?.name ?? "Not set"
    };
  });
  const packingBoxes: ProductPackingBoxDetail[] = (boxesResult.data ?? []).map((box) => {
    const warehouse = box.default_warehouse_id ? warehouseById.get(box.default_warehouse_id) : null;
    const location = box.default_warehouse_location_id ? locationById.get(box.default_warehouse_location_id) : null;

    return {
      box_height: box.box_height === null ? null : Number(box.box_height),
      box_label: box.box_label,
      box_length: box.box_length === null ? null : Number(box.box_length),
      box_sequence: box.box_sequence,
      box_width: box.box_width === null ? null : Number(box.box_width),
      cbm: box.cbm === null ? null : Number(box.cbm),
      default_warehouse_id: box.default_warehouse_id,
      default_warehouse_location_code: location?.location_code ?? null,
      default_warehouse_location_id: box.default_warehouse_location_id,
      default_warehouse_location_name: location
        ? `${location.location_code}${location.location_name ? ` / ${location.location_name}` : ""}`
        : null,
      default_warehouse_name: warehouse?.name ?? null,
      gross_weight: box.gross_weight === null ? null : Number(box.gross_weight),
      id: box.id,
      inch_volume: box.inch_volume === null ? null : Number(box.inch_volume),
      is_required_for_sale: box.is_required_for_sale,
      net_weight: box.net_weight === null ? null : Number(box.net_weight),
      notes: box.notes,
      pallet_quantity: box.pallet_quantity
    };
  });
  const regularBalances = inventoryBalances.filter((balance) => balance.inventory_condition === "regular");
  const requiredBoxes = packingBoxes.filter((box) => box.is_required_for_sale);
  const calculatedSellableQuantity = product.no_box_needed
    ? regularBalances
        .filter((balance) => balance.product_packing_box_id === null)
        .reduce((sum, balance) => sum + balance.quantity_available, 0)
    : requiredBoxes.length > 0
      ? Math.min(
          ...requiredBoxes.map((box) =>
            regularBalances
              .filter((balance) => balance.product_packing_box_id === box.id)
              .reduce((sum, balance) => sum + balance.quantity_available, 0)
          )
        )
      : Number(summaryResult.data?.sellable_quantity ?? 0);

  return {
    brand_id: product.brand_id,
    brand_name: product.brand?.name ?? "Not set",
    category_id: product.product_category_id,
    category_name: product.product_category?.name ?? null,
    collection: product.collection,
    counts_toward_primary_showroom_default: product.counts_toward_primary_showroom_default,
    currency: product.currency,
    customer_eligibility_tag: product.customer_eligibility_tag,
    default_price: product.default_price,
    default_vendor_item_number: product.default_vendor_item_number,
    description: product.description,
    documents: documentDetails,
    finishes: (finishesResult.data ?? []).map((finish) => finish.finish?.finish_name).filter((finish): finish is string => Boolean(finish)),
    id: product.id,
    images: imageDetails.filter((image): image is ProductImageDetail => Boolean(image)),
    incoming_quantity: summaryResult.data?.incoming_quantity ?? null,
    inventoryBalances,
    name: product.name,
    next_incoming_eta: summaryResult.data?.next_incoming_eta ?? null,
    no_box_needed: product.no_box_needed,
    packingBoxes,
    parts,
    primary_showroom_exclusion_reason: product.primary_showroom_exclusion_reason,
    sellability_status: product.sellability_status,
    sellable_quantity: calculatedSellableQuantity,
    signature_suite_id: product.signature_suite_id,
    signature_suite_name: product.product_signature_suite?.name ?? null,
    sku: product.sku,
    specAttributes: (specsResult.data ?? []) as ProductSpecAttributeDetail[],
    status: product.status,
    hangingConfig: hangingResult.data
      ? {
          canopy_detail: hangingResult.data.canopy_detail,
          chain_length: hangingResult.data.chain_length,
          mounting_type: hangingResult.data.mounting_type,
          notes: hangingResult.data.notes,
          rod_length: hangingResult.data.rod_length,
          wire_length: hangingResult.data.wire_length
        }
      : null,
    usedInParents
    ,
    vendors: (vendorProductsResult.data ?? []).map((vendorProduct) => ({
      id: vendorProduct.id,
      lead_time_days: vendorProduct.lead_time_days,
      minimum_order_quantity: vendorProduct.minimum_order_quantity,
      unit_cost: Number(vendorProduct.unit_cost),
      updated_at: vendorProduct.updated_at,
      vendor_id: vendorProduct.vendor_id,
      vendor_item_number: vendorProduct.vendor_item_number,
      vendor_name: vendorProduct.vendor?.name ?? "Not set"
    }))
  };
}

async function getCustomerDashboard(customerId: string) {
  const supabase = createSupabaseAdminClient();

  const [
    customerResult,
    locationsResult,
    contactsResult,
    ordersResult,
    invoicesResult,
    creditMemosResult,
    packingListsResult,
    primaryShowroomsResult,
    rgasResult,
    billingResult,
    freightResult,
    salesRepAssignmentsResult,
    attachmentsResult
  ] = await Promise.all([
    supabase
      .from("customer_account")
      .select(
        "id, account_number, legacy_account_id, name, legal_name, status, default_discount_percent, is_sales_tax_exempt, state_resale_certificate_number, billing_contact_name, billing_email, purchase_contact_name, purchase_email, account_type_id, business_type_id"
      )
      .eq("id", customerId)
      .single(),
    supabase
      .from("customer_location")
      .select(
        "id, location_code, location_name, location_type, city, state_province, country_code, is_shipping_address, is_default_ship_to, is_billing_address, is_showroom, status"
      )
      .eq("customer_account_id", customerId)
      .order("location_name", { ascending: true }),
    supabase
      .from("customer_contact")
      .select(
        "id, name, title, department, email, is_primary, is_billing_contact, is_purchasing_contact, is_warehouse_receiver, is_showroom_floor_sales, is_showroom_manager"
      )
      .eq("customer_account_id", customerId)
      .order("is_primary", { ascending: false })
      .order("name", { ascending: true }),
    supabase
      .from("sales_order")
      .select(
        "id, sales_order_number, customer_po_number, order_date, order_source, order_type, status, shipping_readiness_status, credit_hold_status, total_amount"
      )
      .eq("customer_account_id", customerId)
      .order("order_date", { ascending: false })
      .limit(8),
    supabase
      .from("customer_invoice")
      .select(
        "id, invoice_number, brand_name_snapshot, invoice_date, due_date, invoice_status, payment_status, total_amount, balance_due"
      )
      .eq("customer_account_id", customerId)
      .order("invoice_date", { ascending: false })
      .limit(8),
    supabase
      .from("credit_memo")
      .select("id, credit_memo_number, brand_name_snapshot, issue_date, reason_code, status, total_credit_amount, amount_applied, amount_remaining")
      .eq("customer_account_id", customerId)
      .order("issue_date", { ascending: false })
      .limit(8),
    supabase
      .from("packing_list")
      .select("id, packing_list_number, customer_po_number_snapshot, status, invoice_generation_status_snapshot, shipping_fee, ship_date")
      .eq("customer_account_id", customerId)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("primary_showroom_enrollment")
      .select("customer_location_id, program_status")
      .eq("customer_account_id", customerId)
      .in("program_status", ["pending", "active", "pending_renew", "suspended"]),
    supabase
      .from("rga")
      .select("id, rga_number, status, requested_resolution_type, request_date")
      .eq("customer_account_id", customerId)
      .order("request_date", { ascending: false })
      .limit(8),
    supabase
      .from("customer_billing_profile")
      .select("id, payment_terms, payment_days, credit_limit, credit_limit_source, default_statement_email")
      .eq("customer_account_id", customerId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("customer_freight_policy")
      .select(
        "policy_name, freight_terms, ltl_freight_terms, ground_freight_terms, preferred_shipping_type, freight_allowance_amount, flat_rate_percent"
      )
      .eq("customer_account_id", customerId)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .limit(3),
    supabase
      .from("active_customer_rep_assignments")
      .select("id, location_name, sales_rep_agency_id, agency_name, sales_rep_name, territory_name, coverage_role")
      .eq("customer_account_id", customerId)
      .order("location_name", { ascending: true }),
    supabase
      .from("attachment")
      .select("id, original_file_name, category, content_type, file_size, storage_bucket, storage_path, uploaded_at")
      .eq("entity_type", "customer_account")
      .eq("entity_id", customerId)
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false })
  ]);

  const results = [
    customerResult,
    locationsResult,
    contactsResult,
    ordersResult,
    invoicesResult,
    creditMemosResult,
    packingListsResult,
    primaryShowroomsResult,
    rgasResult,
    billingResult,
    freightResult,
    salesRepAssignmentsResult,
    attachmentsResult
  ];
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    throw new Error(failed.error.message);
  }

  return {
    billing: billingResult.data as BillingProfile | null,
    attachments: (attachmentsResult.data ?? []) as CustomerAttachment[],
    contacts: (contactsResult.data ?? []) as CustomerContact[],
    creditMemos: (creditMemosResult.data ?? []) as CreditMemo[],
    customer: customerResult.data as CustomerAccount,
    freightPolicies: (freightResult.data ?? []) as FreightPolicy[],
    invoices: (invoicesResult.data ?? []) as CustomerInvoice[],
    locations: (locationsResult.data ?? []) as CustomerLocation[],
    orders: (ordersResult.data ?? []) as SalesOrder[],
    packingLists: (packingListsResult.data ?? []) as PackingList[],
    primaryShowrooms: (primaryShowroomsResult.data ?? []) as PrimaryShowroomEnrollment[],
    rgas: (rgasResult.data ?? []) as Rga[],
    salesRepAssignments: (salesRepAssignmentsResult.data ?? []) as CustomerSalesRepAssignment[]
  };
}

function StatusBadge({ tone = "neutral", value }: { tone?: "good" | "neutral" | "primary" | "warn"; value: string }) {
  return <span className={`status-badge status-badge--${tone}`}>{label(value)}</span>;
}

function Metric({ labelText, value }: { labelText: string; value: string }) {
  return (
    <div className="metric">
      <span>{labelText}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="empty-state">{text}</p>;
}

function ModulePlaceholder({ moduleName }: { moduleName: string }) {
  return (
    <section className="dashboard-panel">
      <div className="placeholder-panel">
        <span className="eyebrow">Phase 1 UI Buildout</span>
        <h2>{moduleName}</h2>
        <p>
          This module is already represented in the database design, but its working screen has not been built yet. The first active
          vertical slice is Customer Search / Account Dashboard.
        </p>
        <Link className="secondary-action" href="/">
          Back to Customer Search
        </Link>
      </div>
    </section>
  );
}

async function SalesRepAgencyPage({ agencyId }: { agencyId?: string }) {
  if (!agencyId) {
    return <ModulePlaceholder moduleName="Sales Rep Agency" />;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sales_rep_agency")
    .select("agency_code, commission_default_percent, email, main_contact_name, name, phone, status")
    .eq("id", agencyId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return (
      <section className="dashboard-panel">
        <div className="placeholder-panel">
          <span className="eyebrow">Sales Rep Agency</span>
          <h2>Agency not found</h2>
          <p>The selected sales rep agency could not be found.</p>
          <Link className="secondary-action" href="/">
            Back to Customer Search
          </Link>
        </div>
      </section>
    );
  }

  const agency = data as SalesRepAgency;

  return (
    <section className="dashboard-panel">
      <section className="account-header">
        <div>
          <span className="eyebrow">Sales Rep Agency</span>
          <div className="header-line">
            <h2>{agency.name}</h2>
            <StatusBadge tone={agency.status === "active" ? "good" : "warn"} value={agency.status} />
          </div>
          <Link className="text-action" href="/">
            Back to Customer List
          </Link>
        </div>
        <div className="account-numbers">
          <span>Agency Code {agency.agency_code}</span>
        </div>
      </section>

      <section className="detail-grid">
        <article className="info-panel">
          <h3>Agency Profile</h3>
          <dl>
            <div>
              <dt>Main Contact</dt>
              <dd>{agency.main_contact_name ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{agency.email ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{agency.phone ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Default Commission</dt>
              <dd>{agency.commission_default_percent}%</dd>
            </div>
          </dl>
        </article>
      </section>
    </section>
  );
}

function AddCustomerForm({
  accountTypeOptions,
  businessTypeOptions,
  error,
  salesRepOptions,
  territoryOptions
}: {
  accountTypeOptions: SelectOption[];
  businessTypeOptions: SelectOption[];
  error?: string;
  salesRepOptions: RepOption[];
  territoryOptions: SelectOption[];
}) {
  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Master</span>
          <h2>Add Customer</h2>
          <p>The ERP will generate the 10-digit Account No. after save.</p>
        </div>
        <Link className="secondary-action secondary-action--light" href="/">
          Back to List
        </Link>
      </section>

      {error ? (
        <div className="form-alert">
          {error === "missing_required" ? "Customer name, account type, and business type are required." : decodeURIComponent(error)}
        </div>
      ) : null}

      <form action={createCustomerAction} className="customer-form">
        <fieldset>
          <legend>Account</legend>
          <div className="form-grid">
            <label>
              Customer Name
              <input name="name" required />
            </label>
            <label>
              Legal Name
              <input name="legal_name" />
            </label>
            <label>
              Account Type
              <select name="account_type_id" required>
                <option value="">Select account type</option>
                {accountTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Business Type
              <select name="business_type_id" required>
                <option value="">Select business type</option>
                {businessTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue="active">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="credit_hold">Credit Hold</option>
              </select>
            </label>
            <label>
              Default Discount %
              <input defaultValue="0" min="0" name="default_discount_percent" step="0.01" type="number" />
            </label>
            <label>
              Legacy Account No.
              <input name="legacy_account_id" />
            </label>
            <label>
              State Resale Certificate No.
              <input name="state_resale_certificate_number" />
            </label>
            <label className="checkbox-label">
              <input name="is_sales_tax_exempt" type="checkbox" />
              Sales tax exempt
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Main Location / Address</legend>
          <p className="fieldset-note">Additional locations can be added from the customer Locations tab later.</p>
          <div className="form-grid">
            <label>
              Location Name
              <input name="location_name" placeholder="Main showroom, warehouse, billing office..." />
            </label>
            <label>
              Address Line 1
              <input name="address_line_1" />
            </label>
            <label>
              Address Line 2
              <input name="address_line_2" />
            </label>
            <label>
              City
              <input name="city" />
            </label>
            <LocationRegionFields />
            <label>
              Postal Code
              <input name="postal_code" />
            </label>
            <LocationRoleFields defaultBillingAddress defaultDefaultShipTo />
          </div>
        </fieldset>

        <fieldset>
          <legend>Contacts</legend>
          <div className="form-subsection">
            <h3>Main Location Contact</h3>
            <p>Additional location-specific contacts can be added from the customer Contacts tab later.</p>
          </div>
          <div className="form-grid">
            <label>
              Contact Name
              <input name="main_location_contact_name" required />
            </label>
            <label>
              Title
              <input name="main_location_contact_title" />
            </label>
            <label>
              Department
              <input name="main_location_contact_department" />
            </label>
            <label>
              Email
              <input name="main_location_contact_email" required type="email" />
            </label>
            <label>
              Phone
              <input name="main_location_contact_phone" required />
            </label>
            <label>
              Mobile
              <input name="main_location_contact_mobile" />
            </label>
            <div className="checkbox-cluster">
              <label className="checkbox-label">
                <input name="main_contact_is_purchasing" type="checkbox" />
                Purchasing Contact
              </label>
              <label className="checkbox-label">
                <input name="main_contact_is_warehouse_receiver" type="checkbox" />
                Warehouse receiver
              </label>
              <label className="checkbox-label">
                <input name="main_contact_is_showroom_floor_sales" type="checkbox" />
                Showroom floor sales
              </label>
              <label className="checkbox-label">
                <input name="main_contact_is_showroom_manager" type="checkbox" />
                Showroom manager
              </label>
            </div>
          </div>

          <div className="form-subsection">
            <h3>Billing Contact</h3>
            <p>This is the account-level billing contact used for invoice and AR email defaults.</p>
          </div>
          <div className="form-grid">
            <label>
              Contact Name
              <input name="billing_contact_name" required />
            </label>
            <label>
              Title
              <input name="billing_contact_title" />
            </label>
            <label>
              Department
              <input defaultValue="Accounting" name="billing_contact_department" />
            </label>
            <label>
              Email
              <input name="billing_contact_email" required type="email" />
            </label>
            <label>
              Phone
              <input name="billing_contact_phone" required />
            </label>
            <label>
              Mobile
              <input name="billing_contact_mobile" />
            </label>
          </div>
        </fieldset>

        <PaymentTermsCreditFields />

        <FreightTermsFields />

        <fieldset>
          <legend>Sales Rep / Territory</legend>
          <div className="form-grid">
            <label>
              Territory
              <select defaultValue="" name="territory_id">
                <option value="">Not assigned</option>
                {territoryOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sales Rep
              <select defaultValue="" name="sales_rep_selection">
                <option value="">Not assigned</option>
                {salesRepOptions.map((option) => (
                  <option data-agency-id={option.agency_id} key={option.id} value={`${option.id}|${option.agency_id}`}>
                    {option.name} / {option.agency_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Customer
          </button>
          <Link className="secondary-action secondary-action--light" href="/">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function getCustomerName(customerId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("customer_account").select("id, name").eq("id", customerId).single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

async function getDefaultFreightPolicy(customerId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("customer_freight_policy")
    .select(
      "id, policy_name, freight_terms, ltl_freight_terms, ground_freight_terms, preferred_shipping_type, freight_allowance_amount, flat_rate_percent, default_ltl_carrier, default_ltl_carrier_account_number, default_ground_carrier, default_ground_carrier_account_number"
    )
    .eq("customer_account_id", customerId)
    .eq("is_active", true)
    .order("is_default", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as FreightPolicy | null;
}

async function EditAccountProfileForm({
  accountTypeOptions,
  businessTypeOptions,
  customerId,
  error
}: {
  accountTypeOptions: SelectOption[];
  businessTypeOptions: SelectOption[];
  customerId?: string;
  error?: string;
}) {
  if (!customerId) {
    return <ModulePlaceholder moduleName="Edit Account Profile requires a selected customer" />;
  }

  const dashboard = await getCustomerDashboard(customerId);
  const customer = dashboard.customer;

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Account</span>
          <h2>Edit Account Profile</h2>
          <p>{customer.name}</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}`}>
          Back to Account
        </Link>
      </section>

      {error ? (
        <div className="form-alert">
          {error === "missing_required" ? "Customer name, account type, and business type are required." : decodeURIComponent(error)}
        </div>
      ) : null}

      <form action={updateAccountProfileAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <fieldset>
          <legend>Account Profile</legend>
          <div className="form-grid">
            <label>
              Customer Name
              <input defaultValue={customer.name} name="name" required />
            </label>
            <label>
              Legal Name
              <input defaultValue={customer.legal_name ?? ""} name="legal_name" />
            </label>
            <label>
              Status
              <select defaultValue={customer.status} name="status">
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="credit_hold">Credit Hold</option>
                <option value="obsolete">Obsolete</option>
              </select>
            </label>
            <label>
              Account Type
              <select defaultValue={customer.account_type_id} name="account_type_id" required>
                {accountTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Business Type
              <select defaultValue={customer.business_type_id} name="business_type_id" required>
                {businessTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Default Discount %
              <input defaultValue={customer.default_discount_percent} min="0" name="default_discount_percent" step="0.01" type="number" />
            </label>
            <label>
              State Resale Certificate No.
              <input defaultValue={customer.state_resale_certificate_number ?? ""} name="state_resale_certificate_number" />
            </label>
            <label className="checkbox-label">
              <input defaultChecked={customer.is_sales_tax_exempt} name="is_sales_tax_exempt" type="checkbox" />
              Sales tax exempt
            </label>
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Account Profile
          </button>
          <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function EditBillingCreditForm({ customerId, error }: { customerId?: string; error?: string }) {
  if (!customerId) {
    return <ModulePlaceholder moduleName="Edit Billing / Credit requires a selected customer" />;
  }

  const dashboard = await getCustomerDashboard(customerId);
  const customer = dashboard.customer;
  const billing = dashboard.billing;

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Account</span>
          <h2>Edit Billing / Credit</h2>
          <p>{customer.name}</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}`}>
          Back to Account
        </Link>
      </section>

      {error ? <div className="form-alert">{error === "missing_required" ? "Customer is required." : decodeURIComponent(error)}</div> : null}

      <form action={updateBillingCreditAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <input name="billing_profile_id" type="hidden" value={billing?.id ?? ""} />
        <fieldset>
          <legend>Billing / Credit</legend>
          <div className="form-grid">
            <label>
              Payment Terms
              <select defaultValue={billing?.payment_terms ?? "Prepaid / No Credit"} name="payment_terms">
                <option value="Prepaid / No Credit">Prepaid / No Credit</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 60 Days">Net 60 Days</option>
                <option value="Net 90">Net 90</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Payment Days
              <input defaultValue={billing?.payment_days ?? 0} min="0" name="payment_days" step="1" type="number" />
            </label>
            <label>
              Credit Limit
              <input defaultValue={billing?.credit_limit ?? ""} min="0" name="credit_limit" placeholder="Blank uses system default" step="0.01" type="number" />
            </label>
            <label>
              Invoice Email
              <input defaultValue={billing?.default_statement_email ?? customer.billing_email ?? ""} name="default_statement_email" type="email" />
            </label>
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Billing / Credit
          </button>
          <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function AddLocationForm({ customerId, error }: { customerId?: string; error?: string }) {
  if (!customerId) {
    return <ModulePlaceholder moduleName="Add Location requires a selected customer" />;
  }

  const customer = await getCustomerName(customerId);

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Locations</span>
          <h2>Add Location</h2>
          <p>{customer.name}</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}#locations`}>
          Back to Account
        </Link>
      </section>

      {error ? <div className="form-alert">{error === "missing_required" ? "Location name is required." : decodeURIComponent(error)}</div> : null}

      <form action={addLocationAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <fieldset>
          <legend>Location / Address</legend>
          <div className="form-grid">
            <label>
              Location Name
              <input name="location_name" required />
            </label>
            <label>
              Address Line 1
              <input name="address_line_1" />
            </label>
            <label>
              Address Line 2
              <input name="address_line_2" />
            </label>
            <label>
              City
              <input name="city" />
            </label>
            <LocationRegionFields />
            <label>
              Postal Code
              <input name="postal_code" />
            </label>
            <LocationRoleFields />
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Location
          </button>
          <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}#locations`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function getLocationForEdit(locationId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: location, error: locationError } = await supabase
    .from("customer_location")
    .select(
      "id, customer_account_id, location_code, location_name, location_type, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, is_shipping_address, is_default_ship_to, is_billing_address, is_showroom, status"
    )
    .eq("id", locationId)
    .single();

  if (locationError) {
    throw new Error(locationError.message);
  }

  const { data: showroom, error: showroomError } = await supabase
    .from("primary_showroom_enrollment")
    .select(
      "id, customer_location_id, program_status, enrollment_date, expiration_date, pending_renew_date, required_display_count, current_display_count, discount_percent, free_freight_threshold, showroom_size_classification, showroom_notification_email"
    )
    .eq("customer_location_id", locationId)
    .in("program_status", ["pending", "active", "pending_renew", "suspended"])
    .maybeSingle();

  if (showroomError) {
    throw new Error(showroomError.message);
  }

  return {
    location: location as LocationEditRecord,
    primaryShowroom: showroom as PrimaryShowroomEnrollment | null
  };
}

async function getLocationDashboard(customerId: string, locationId: string) {
  const supabase = createSupabaseAdminClient();

  const [
    locationData,
    contactsResult,
    ordersResult,
    packingListsResult,
    invoicesResult,
    rgasResult,
    displaysResult
  ] = await Promise.all([
    getLocationForEdit(locationId),
    supabase
      .from("customer_contact")
      .select(
        "id, customer_location_id, name, title, department, email, phone, mobile, fax, is_active, is_primary, is_billing_contact, is_purchasing_contact, is_warehouse_receiver, is_showroom_floor_sales, is_showroom_manager"
      )
      .eq("customer_account_id", customerId)
      .eq("customer_location_id", locationId)
      .order("is_primary", { ascending: false })
      .order("name", { ascending: true }),
    supabase
      .from("sales_order")
      .select(
        "id, sales_order_number, customer_po_number, order_date, order_source, order_type, status, shipping_readiness_status, credit_hold_status, total_amount"
      )
      .eq("customer_account_id", customerId)
      .eq("customer_location_id", locationId)
      .order("order_date", { ascending: false })
      .limit(12),
    supabase
      .from("packing_list")
      .select("id, packing_list_number, customer_po_number_snapshot, status, invoice_generation_status_snapshot, shipping_fee, ship_date")
      .eq("customer_account_id", customerId)
      .eq("customer_location_id", locationId)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("customer_invoice")
      .select("id, invoice_number, brand_name_snapshot, invoice_date, due_date, invoice_status, payment_status, total_amount, balance_due")
      .eq("customer_account_id", customerId)
      .eq("customer_location_id", locationId)
      .order("invoice_date", { ascending: false })
      .limit(12),
    supabase
      .from("rga")
      .select("id, rga_number, status, requested_resolution_type, request_date")
      .eq("customer_account_id", customerId)
      .eq("customer_location_id", locationId)
      .order("request_date", { ascending: false })
      .limit(12),
    supabase
      .from("showroom_display")
      .select(
        "id, sku_snapshot, product_name_snapshot, display_status, display_shipped_date_snapshot, customer_po_number_snapshot, display_discount_percent_snapshot, counts_toward_primary_showroom"
      )
      .eq("customer_location_id", locationId)
      .order("display_shipped_date_snapshot", { ascending: false })
      .limit(24)
  ]);

  const results = [contactsResult, ordersResult, packingListsResult, invoicesResult, rgasResult, displaysResult];
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    throw new Error(failed.error.message);
  }

  return {
    ...locationData,
    contacts: (contactsResult.data ?? []) as CustomerContact[],
    displays: (displaysResult.data ?? []) as ShowroomDisplay[],
    invoices: (invoicesResult.data ?? []) as CustomerInvoice[],
    orders: (ordersResult.data ?? []) as SalesOrder[],
    packingLists: (packingListsResult.data ?? []) as PackingList[],
    rgas: (rgasResult.data ?? []) as Rga[]
  };
}

async function LocationInfoPage({ customerId, locationId }: { customerId?: string; locationId?: string }) {
  if (!customerId || !locationId) {
    return <ModulePlaceholder moduleName="Location page requires a selected customer and location" />;
  }

  const [customer, dashboard] = await Promise.all([getCustomerName(customerId), getLocationDashboard(customerId, locationId)]);
  const { contacts, displays, invoices, location, orders, packingLists, primaryShowroom, rgas } = dashboard;
  const locationTabs = ["Profile", "Contacts", "Orders", "Shipments", "RGA", "Invoices"];

  if (primaryShowroom) {
    locationTabs.push("Primary Showroom");
  }

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Location</span>
          <Link className="context-parent-link" href={`/?customer=${customerId}`}>
            {customer.name}
          </Link>
          <h2>{location.location_name}</h2>
        </div>
        <div className="header-actions">
          <button className="primary-action" type="button">
            Enter New Order
          </button>
        </div>
      </section>

      <section className="metric-grid">
        <Metric labelText="Contacts" value={numberFormatter.format(contacts.length)} />
        <Metric labelText="Open Orders" value={numberFormatter.format(orders.filter((order) => order.status !== "closed").length)} />
        <Metric labelText="Shipments" value={numberFormatter.format(packingLists.length)} />
        <Metric labelText="Open Invoices" value={numberFormatter.format(invoices.filter((invoice) => invoice.invoice_status !== "void").length)} />
        <Metric labelText="RGA" value={numberFormatter.format(rgas.length)} />
      </section>

      <section className="tab-strip" aria-label="Location dashboard sections">
        {locationTabs.map((item, index) => (
          <a aria-current={index === 0 ? "page" : undefined} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} key={item}>
            {item}
          </a>
        ))}
      </section>

      <section className="section-stack">
        <article className="data-section" id="profile">
          <div className="section-title">
            <h3>Profile</h3>
            <Link className="text-action" href={`/?module=edit-location&customer=${customerId}&location=${locationId}`}>
              Edit
            </Link>
          </div>
          <section className="detail-grid detail-grid--inside">
            <article className="info-panel">
              <h3>Location Profile</h3>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{label(location.status)}</dd>
                </div>
                <div>
                  <dt>Location Type</dt>
                  <dd>{label(location.location_type)}</dd>
                </div>
                <div>
                  <dt>Location Code</dt>
                  <dd>{location.location_code ?? "System generated"}</dd>
                </div>
                <div>
                  <dt>Primary Showroom</dt>
                  <dd>{primaryShowroom ? label(primaryShowroom.program_status) : "No"}</dd>
                </div>
              </dl>
            </article>

            <article className="info-panel">
              <h3>Address</h3>
              <dl>
                <div>
                  <dt>Address Line 1</dt>
                  <dd>{location.address_line_1 ?? "Not set"}</dd>
                </div>
                <div>
                  <dt>Address Line 2</dt>
                  <dd>{location.address_line_2 ?? "Not set"}</dd>
                </div>
                <div>
                  <dt>City / State</dt>
                  <dd>{[location.city, location.state_province].filter(Boolean).join(", ") || "Not set"}</dd>
                </div>
                <div>
                  <dt>Country / Postal Code</dt>
                  <dd>{[location.country, location.postal_code].filter(Boolean).join(" ") || "Not set"}</dd>
                </div>
              </dl>
            </article>
          </section>
          <div className="badge-row badge-row--left">
            {location.is_default_ship_to ? <StatusBadge tone="good" value="Default Ship-to" /> : null}
            {primaryShowroom ? <StatusBadge tone="primary" value="Primary Showroom" /> : null}
            {location.is_shipping_address ? <StatusBadge value="Shipping Address" /> : null}
            {location.is_billing_address ? <StatusBadge value="Billing Address" /> : null}
            {location.is_showroom ? <StatusBadge value="Showroom" /> : null}
          </div>
        </article>

        <article className="data-section" id="contacts">
          <div className="section-title">
            <h3>Contacts</h3>
            <div className="section-actions">
              <span>{contacts.length}</span>
              <Link className="small-action" href={`/?module=add-contact&customer=${customerId}`}>
                Add Contact
              </Link>
            </div>
          </div>
          <div className="compact-list">
            {contacts.length === 0 ? <EmptyState text="No contacts are assigned to this location." /> : null}
            {contacts.map((contact) => (
              <div className="compact-row" key={contact.id}>
                <div>
                  <Link className="record-link" href={`/?module=view-contact&customer=${customerId}&contact=${contact.id}`}>
                    {contact.name}
                  </Link>
                  <span>{[contact.title, contact.department].filter(Boolean).join(" / ") || "Contact"}</span>
                </div>
                <span>{contact.email ?? "No email"}</span>
                <ContactRoleBadges contact={contact} />
              </div>
            ))}
          </div>
        </article>

        <article className="data-section" id="orders">
          <div className="section-title">
            <h3>Orders</h3>
            <span>{orders.length}</span>
          </div>
          <div className="table-wrap">
            {orders.length === 0 ? <EmptyState text="No orders are linked to this location." /> : null}
            {orders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>SO No.</th>
                    <th>Customer PO</th>
                    <th>Date</th>
                    <th>Source</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.sales_order_number}</td>
                      <td>{order.customer_po_number}</td>
                      <td>{dateLabel(order.order_date)}</td>
                      <td>{label(order.order_source)}</td>
                      <td>{label(order.order_type)}</td>
                      <td>
                        <StatusBadge tone={order.credit_hold_status === "none" ? "good" : "warn"} value={order.status} />
                      </td>
                      <td>{money(order.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </article>

        <article className="data-section" id="shipments">
          <div className="section-title">
            <h3>Shipments</h3>
            <span>{packingLists.length}</span>
          </div>
          <div className="compact-list">
            {packingLists.length === 0 ? <EmptyState text="No packing lists are linked to this location." /> : null}
            {packingLists.map((packingList) => (
              <div className="compact-row" key={packingList.id}>
                <div>
                  <strong>{packingList.packing_list_number}</strong>
                  <span>PO {packingList.customer_po_number_snapshot}</span>
                </div>
                <span>{dateLabel(packingList.ship_date)}</span>
                <StatusBadge value={packingList.status} />
              </div>
            ))}
          </div>
        </article>

        <article className="data-section" id="rga">
          <div className="section-title">
            <h3>RGA</h3>
            <span>{rgas.length}</span>
          </div>
          <div className="compact-list">
            {rgas.length === 0 ? <EmptyState text="No RGA activity is linked to this location." /> : null}
            {rgas.map((rga) => (
              <div className="compact-row" key={rga.id}>
                <div>
                  <strong>{rga.rga_number}</strong>
                  <span>{dateLabel(rga.request_date)}</span>
                </div>
                <span>{label(rga.requested_resolution_type)}</span>
                <StatusBadge value={rga.status} />
              </div>
            ))}
          </div>
        </article>

        <article className="data-section" id="invoices">
          <div className="section-title">
            <h3>Invoices</h3>
            <span>{invoices.length}</span>
          </div>
          <div className="compact-list">
            {invoices.length === 0 ? <EmptyState text="No invoices are linked to this location." /> : null}
            {invoices.map((invoice) => (
              <div className="compact-row" key={invoice.id}>
                <div>
                  <strong>{invoice.invoice_number}</strong>
                  <span>{invoice.brand_name_snapshot}</span>
                </div>
                <span>{dateLabel(invoice.invoice_date)}</span>
                <span>{money(invoice.balance_due)}</span>
              </div>
            ))}
          </div>
        </article>

        {primaryShowroom ? (
          <article className="data-section" id="primary-showroom">
            <div className="section-title">
              <h3>Primary Showroom</h3>
              <span>{displays.length}</span>
            </div>
            <section className="detail-grid detail-grid--inside">
              <article className="info-panel">
                <h3>Enrollment</h3>
                <dl>
                  <div>
                    <dt>Status</dt>
                    <dd>{label(primaryShowroom.program_status)}</dd>
                  </div>
                  <div>
                    <dt>Enrollment Date</dt>
                    <dd>{dateLabel(primaryShowroom.enrollment_date)}</dd>
                  </div>
                  <div>
                    <dt>Pending Renew Date</dt>
                    <dd>{dateLabel(primaryShowroom.pending_renew_date)}</dd>
                  </div>
                  <div>
                    <dt>Expiration Date</dt>
                    <dd>{dateLabel(primaryShowroom.expiration_date)}</dd>
                  </div>
                </dl>
              </article>
              <article className="info-panel">
                <h3>Program Terms</h3>
                <dl>
                  <div>
                    <dt>Display Count</dt>
                    <dd>
                      {numberFormatter.format(primaryShowroom.current_display_count ?? 0)} /{" "}
                      {numberFormatter.format(primaryShowroom.required_display_count ?? 0)}
                    </dd>
                  </div>
                  <div>
                    <dt>Discount</dt>
                    <dd>{primaryShowroom.discount_percent ?? 0}%</dd>
                  </div>
                  <div>
                    <dt>Free Freight Threshold</dt>
                    <dd>{primaryShowroom.free_freight_threshold ? money(primaryShowroom.free_freight_threshold) : "Not set"}</dd>
                  </div>
                  <div>
                    <dt>Notification Email</dt>
                    <dd>{primaryShowroom.showroom_notification_email ?? "Not set"}</dd>
                  </div>
                </dl>
              </article>
            </section>
            <div className="compact-list">
              {displays.length === 0 ? <EmptyState text="No display items are linked to this primary showroom yet." /> : null}
              {displays.map((display) => (
                <div className="compact-row" key={display.id}>
                  <div>
                    <strong>{display.sku_snapshot}</strong>
                    <span>{display.product_name_snapshot ?? "Display item"}</span>
                  </div>
                  <span>{dateLabel(display.display_shipped_date_snapshot)}</span>
                  <StatusBadge tone={display.counts_toward_primary_showroom ? "good" : "neutral"} value={display.display_status} />
                </div>
              ))}
            </div>
          </article>
        ) : null}
      </section>
    </section>
  );
}

async function EditLocationForm({ customerId, error, locationId }: { customerId?: string; error?: string; locationId?: string }) {
  if (!customerId || !locationId) {
    return <ModulePlaceholder moduleName="Edit Location requires a selected customer and location" />;
  }

  const [customer, locationData] = await Promise.all([getCustomerName(customerId), getLocationForEdit(locationId)]);
  const { location, primaryShowroom } = locationData;

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Location</span>
          <h2>{location.location_name}</h2>
          <p>{customer.name}</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}#locations`}>
          Back to Account
        </Link>
      </section>

      {error ? <div className="form-alert">{error === "missing_required" ? "Location name is required." : decodeURIComponent(error)}</div> : null}

      <form action={updateLocationAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <input name="location_id" type="hidden" value={locationId} />
        <fieldset>
          <legend>Location / Address</legend>
          <div className="form-grid">
            <label>
              Location Name
              <input defaultValue={location.location_name} name="location_name" required />
            </label>
            <label>
              Status
              <select defaultValue={location.status} name="status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label>
              Address Line 1
              <input defaultValue={location.address_line_1 ?? ""} name="address_line_1" />
            </label>
            <label>
              Address Line 2
              <input defaultValue={location.address_line_2 ?? ""} name="address_line_2" />
            </label>
            <label>
              City
              <input defaultValue={location.city ?? ""} name="city" />
            </label>
            <LocationRegionFields defaultCountryCode={location.country_code} defaultStateProvince={location.state_province ?? ""} />
            <label>
              Postal Code
              <input defaultValue={location.postal_code ?? ""} name="postal_code" />
            </label>
            <LocationRoleFields
              defaultBillingAddress={Boolean(location.is_billing_address)}
              defaultDefaultShipTo={location.is_default_ship_to}
              defaultPrimaryShowroom={Boolean(primaryShowroom)}
              defaultShippingAddress={location.is_shipping_address}
              defaultShowroom={location.is_showroom}
            />
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Location
          </button>
          <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}#locations`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function getContactForEdit(contactId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("customer_contact")
    .select(
      "id, customer_account_id, customer_location_id, name, title, department, email, phone, mobile, fax, is_active, is_primary, is_billing_contact, is_purchasing_contact, is_warehouse_receiver, is_showroom_floor_sales, is_showroom_manager"
    )
    .eq("id", contactId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CustomerContact & { customer_account_id: string };
}

async function getContactLocationOptions(customerId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("customer_location")
    .select("id, location_name")
    .eq("customer_account_id", customerId)
    .order("location_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as { id: string; location_name: string }[];
}

function ContactRoleBadges({ contact }: { contact: CustomerContact }) {
  const hasRoles =
    contact.is_primary ||
    contact.is_billing_contact ||
    contact.is_purchasing_contact ||
    contact.is_warehouse_receiver ||
    contact.is_showroom_floor_sales ||
    contact.is_showroom_manager;

  return (
    <div className="badge-row badge-row--left">
      {contact.is_primary ? <StatusBadge tone="good" value="Primary" /> : null}
      {contact.is_purchasing_contact ? <StatusBadge value="Purchasing" /> : null}
      {contact.is_billing_contact ? <StatusBadge value="Billing" /> : null}
      {contact.is_warehouse_receiver ? <StatusBadge value="Warehouse Receiver" /> : null}
      {contact.is_showroom_floor_sales ? <StatusBadge value="Showroom Floor Sales" /> : null}
      {contact.is_showroom_manager ? <StatusBadge value="Showroom Manager" /> : null}
      {!hasRoles ? <EmptyState text="No contact roles are selected." /> : null}
    </div>
  );
}

async function ContactInfoPage({ contactId, customerId }: { contactId?: string; customerId?: string }) {
  if (!customerId || !contactId) {
    return <ModulePlaceholder moduleName="Contact page requires a selected customer and contact" />;
  }

  const [customer, contact, locations] = await Promise.all([
    getCustomerName(customerId),
    getContactForEdit(contactId),
    getContactLocationOptions(customerId)
  ]);
  const locationName = locations.find((location) => location.id === contact.customer_location_id)?.location_name ?? "Account-level contact";

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Contact</span>
          <h2>{contact.name}</h2>
          <Link className="context-child-link" href={`/?customer=${customerId}`}>
            {customer.name}
          </Link>
        </div>
        <div className="header-actions">
          <Link className="primary-action" href={`/?module=edit-contact&customer=${customerId}&contact=${contactId}`}>
            Edit Contact
          </Link>
        </div>
      </section>

      <section className="detail-grid">
        <article className="info-panel">
          <h3>Contact Profile</h3>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{contact.is_active === false ? "Inactive" : "Active"}</dd>
            </div>
            <div>
              <dt>Title</dt>
              <dd>{contact.title ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{contact.department ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{locationName}</dd>
            </div>
          </dl>
        </article>

        <article className="info-panel">
          <h3>Contact Details</h3>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{contact.email ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{contact.phone ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Mobile</dt>
              <dd>{contact.mobile ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Fax</dt>
              <dd>{contact.fax ?? "Not set"}</dd>
            </div>
          </dl>
        </article>
      </section>

      <article className="data-section">
        <div className="section-title">
          <h3>Contact Roles</h3>
        </div>
        <ContactRoleBadges contact={contact} />
      </article>
    </section>
  );
}

async function AddContactForm({ customerId, error }: { customerId?: string; error?: string }) {
  if (!customerId) {
    return <ModulePlaceholder moduleName="Add Contact requires a selected customer" />;
  }

  const [customer, locations] = await Promise.all([getCustomerName(customerId), getContactLocationOptions(customerId)]);

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Contact</span>
          <h2>Add Contact</h2>
          <p>{customer.name}</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}#contacts`}>
          Back to Account
        </Link>
      </section>

      {error ? <div className="form-alert">{error === "missing_required" ? "Contact name is required." : decodeURIComponent(error)}</div> : null}

      <form action={addContactAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <fieldset>
          <legend>Contact Information</legend>
          <div className="form-grid">
            <label>
              Contact Name
              <input name="name" required />
            </label>
            <label>
              Title
              <input name="title" />
            </label>
            <label>
              Department
              <input name="department" />
            </label>
            <label>
              Location
              <select name="customer_location_id">
                <option value="">Account-level contact</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.location_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Email
              <input name="email" type="email" />
            </label>
            <label>
              Phone
              <input name="phone" />
            </label>
            <label>
              Mobile
              <input name="mobile" />
            </label>
            <label>
              Fax
              <input name="fax" />
            </label>
            <div className="checkbox-cluster">
              <label className="checkbox-label">
                <input name="is_primary" type="checkbox" />
                Primary contact
              </label>
              <label className="checkbox-label">
                <input name="is_purchasing_contact" type="checkbox" />
                Purchasing contact
              </label>
              <label className="checkbox-label">
                <input name="is_billing_contact" type="checkbox" />
                Billing contact
              </label>
              <label className="checkbox-label">
                <input name="is_warehouse_receiver" type="checkbox" />
                Warehouse receiver
              </label>
              <label className="checkbox-label">
                <input name="is_showroom_floor_sales" type="checkbox" />
                Showroom floor sales
              </label>
              <label className="checkbox-label">
                <input name="is_showroom_manager" type="checkbox" />
                Showroom manager
              </label>
            </div>
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Contact
          </button>
          <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}#contacts`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function EditContactForm({ contactId, customerId, error }: { contactId?: string; customerId?: string; error?: string }) {
  if (!customerId || !contactId) {
    return <ModulePlaceholder moduleName="Edit Contact requires a selected customer and contact" />;
  }

  const [customer, contact, locations] = await Promise.all([
    getCustomerName(customerId),
    getContactForEdit(contactId),
    getContactLocationOptions(customerId)
  ]);

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Contact</span>
          <h2>{contact.name}</h2>
          <p>{customer.name}</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={`/?module=view-contact&customer=${customerId}&contact=${contactId}`}>
          Back to Contact
        </Link>
      </section>

      {error ? <div className="form-alert">{error === "missing_required" ? "Contact name is required." : decodeURIComponent(error)}</div> : null}

      <form action={updateContactAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <input name="contact_id" type="hidden" value={contactId} />
        <fieldset>
          <legend>Contact Information</legend>
          <div className="form-grid">
            <label>
              Contact Name
              <input defaultValue={contact.name} name="name" required />
            </label>
            <label>
              Status
              <select defaultValue={contact.is_active === false ? "inactive" : "active"} name="status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label>
              Title
              <input defaultValue={contact.title ?? ""} name="title" />
            </label>
            <label>
              Department
              <input defaultValue={contact.department ?? ""} name="department" />
            </label>
            <label>
              Location
              <select defaultValue={contact.customer_location_id ?? ""} name="customer_location_id">
                <option value="">Account-level contact</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.location_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Email
              <input defaultValue={contact.email ?? ""} name="email" type="email" />
            </label>
            <label>
              Phone
              <input defaultValue={contact.phone ?? ""} name="phone" />
            </label>
            <label>
              Mobile
              <input defaultValue={contact.mobile ?? ""} name="mobile" />
            </label>
            <label>
              Fax
              <input defaultValue={contact.fax ?? ""} name="fax" />
            </label>
            <div className="checkbox-cluster">
              <label className="checkbox-label">
                <input defaultChecked={contact.is_primary} name="is_primary" type="checkbox" />
                Primary contact
              </label>
              <label className="checkbox-label">
                <input defaultChecked={contact.is_purchasing_contact} name="is_purchasing_contact" type="checkbox" />
                Purchasing contact
              </label>
              <label className="checkbox-label">
                <input defaultChecked={contact.is_billing_contact} name="is_billing_contact" type="checkbox" />
                Billing contact
              </label>
              <label className="checkbox-label">
                <input defaultChecked={contact.is_warehouse_receiver} name="is_warehouse_receiver" type="checkbox" />
                Warehouse receiver
              </label>
              <label className="checkbox-label">
                <input defaultChecked={contact.is_showroom_floor_sales} name="is_showroom_floor_sales" type="checkbox" />
                Showroom floor sales
              </label>
              <label className="checkbox-label">
                <input defaultChecked={contact.is_showroom_manager} name="is_showroom_manager" type="checkbox" />
                Showroom manager
              </label>
            </div>
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Contact
          </button>
          <Link className="secondary-action secondary-action--light" href={`/?module=view-contact&customer=${customerId}&contact=${contactId}`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function EditFreightForm({ customerId, error }: { customerId?: string; error?: string }) {
  if (!customerId) {
    return <ModulePlaceholder moduleName="Edit Freight requires a selected customer" />;
  }

  const [customer, freightPolicy] = await Promise.all([getCustomerName(customerId), getDefaultFreightPolicy(customerId)]);
  const freightTerms = freightPolicy?.freight_terms ?? freightPolicy?.ltl_freight_terms ?? "prepaid";

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Freight</span>
          <h2>Edit Freight Terms</h2>
          <p>{customer.name}</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}#freight`}>
          Back to Account
        </Link>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={updateFreightPolicyAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <input name="freight_policy_id" type="hidden" value={freightPolicy?.id ?? ""} />
        <FreightTermsFields
          defaultFlatRatePercent={freightPolicy?.flat_rate_percent?.toString() ?? ""}
          defaultFreightAllowance={freightPolicy?.freight_allowance_amount?.toString() ?? ""}
          defaultFreightTerms={freightTerms}
          defaultGroundCollectAccount={freightPolicy?.default_ground_carrier_account_number ?? ""}
          defaultGroundCollectCarrier={freightPolicy?.default_ground_carrier ?? ""}
          defaultLtlCollectAccount={freightPolicy?.default_ltl_carrier_account_number ?? ""}
          defaultLtlCollectCarrier={freightPolicy?.default_ltl_carrier ?? ""}
        />
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Freight Terms
          </button>
          <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}#freight`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

function CustomerListOverview({
  accountTypes,
  businessTypes,
  customers,
  error,
  listMode = "active",
  notice,
  query
}: {
  accountTypes: Lookup;
  businessTypes: Lookup;
  customers: CustomerAccount[];
  error?: string;
  listMode?: "active" | "obsolete";
  notice?: string;
  query: string;
}) {
  const isObsoleteList = listMode === "obsolete";

  return (
    <section className="dashboard-panel">
      <section className="list-header">
        <div>
          <span className="eyebrow">{isObsoleteList ? "Customer History" : "Customer List"}</span>
          <h2>{query ? `Search Results for "${query}"` : isObsoleteList ? "Obsolete Accounts" : "All Active Customers"}</h2>
        </div>
        <div className="list-actions">
          <span>{customers.length} shown</span>
          {!isObsoleteList ? (
            <button className="danger-action" form="customer-delete-form" type="submit">
              Delete Selected
            </button>
          ) : null}
          {!isObsoleteList ? (
            <Link className="primary-action" href="/?module=add-customer">
              Add Customer
            </Link>
          ) : null}
        </div>
      </section>
      <form className="list-search-form">
        {isObsoleteList ? <input name="module" type="hidden" value="obsolete-customers" /> : null}
        <label htmlFor="customer-list-search">Search customers</label>
        <div className="list-search-row">
          <input
            defaultValue={query}
            id="customer-list-search"
            name="q"
            placeholder="Name, account no., or legacy no."
            type="search"
          />
          <button type="submit">Search</button>
          <a className="advanced-search-link" href="#advanced-search">
            Advanced Search
          </a>
        </div>
      </form>

      {notice ? <div className="form-alert form-alert--success">{decodeURIComponent(notice)}</div> : null}
      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      {customers.length === 0 ? (
        <EmptyState text={isObsoleteList ? "No obsolete customer accounts match this search." : "No customers match this search."} />
      ) : (
        <form action={deleteCustomersAction} id="customer-delete-form">
          <input name="q" type="hidden" value={query} />
          <input name="return_module" type="hidden" value={isObsoleteList ? "obsolete-customers" : "customers"} />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {!isObsoleteList ? <th className="select-column">Select</th> : null}
                  <th>Customer</th>
                  <th>Account No.</th>
                  <th>Legacy Account No.</th>
                  <th>Account Type</th>
                  <th>Business Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    {!isObsoleteList ? (
                      <td className="select-column">
                        <input aria-label={`Select ${customer.name}`} name="customer_ids" type="checkbox" value={customer.id} />
                      </td>
                    ) : null}
                    <td>
                      <Link className="table-link" href={`/?customer=${customer.id}${query ? `&q=${encodeURIComponent(query)}` : ""}`}>
                        {customer.name}
                      </Link>
                    </td>
                    <td>{customer.account_number}</td>
                    <td>{customer.legacy_account_id ?? "Not set"}</td>
                    <td>{accountTypes[customer.account_type_id] ?? "Not set"}</td>
                    <td>{businessTypes[customer.business_type_id] ?? "Not set"}</td>
                    <td>
                      <StatusBadge tone={customer.status === "active" ? "good" : "warn"} value={customer.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      )}
    </section>
  );
}

function ProductListOverview({
  brandOptions,
  categoryOptions,
  filters,
  finishOptions,
  listMode = "active",
  page,
  pageSize,
  products,
  query,
  error,
  notice,
  showAdvanced,
  styleOptions,
  totalCount,
  totalPages
}: {
  brandOptions: SelectOption[];
  categoryOptions: SelectOption[];
  filters: ProductSearchFilters;
  finishOptions: SelectOption[];
  listMode?: "active" | "discontinued";
  page: number;
  pageSize: number;
  products: ProductListItem[];
  query: string;
  error?: string;
  notice?: string;
  showAdvanced: boolean;
  styleOptions: SelectOption[];
  totalCount: number;
  totalPages: number;
}) {
  const regularCategoryOptions = categoryOptions.filter((category) => category.name.toLowerCase() !== "accessory");
  const buildProductListParams = (overrides: Record<string, string | number | undefined> = {}) => {
    const searchParams = new URLSearchParams({ module: listMode === "discontinued" ? "discontinued-products" : "products" });

    if (query) {
      searchParams.set("q", query);
    }

    if (filters.brandId) {
      searchParams.set("product_brand", filters.brandId);
    }

  if (filters.styleId) {
    searchParams.set("product_style", filters.styleId);
  }

    if (filters.categoryId) {
      searchParams.set("product_category", filters.categoryId);
    }

    if (filters.eligibility) {
      searchParams.set("product_eligibility", filters.eligibility);
    }

    if (filters.status) {
      searchParams.set("product_status", filters.status);
    }

    if (filters.finishId) {
      searchParams.set("product_finish", filters.finishId);
    }

    if (filters.lightCount) {
      searchParams.set("product_lights", filters.lightCount);
    }

    if (showAdvanced) {
      searchParams.set("advanced", "1");
    }

    searchParams.set("product_page", String(page));
    searchParams.set("product_page_size", String(pageSize));

    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        searchParams.delete(key);
      } else {
        searchParams.set(key, String(value));
      }
    });

    return `/?${searchParams.toString()}`;
  };

  const advancedSearchHref = buildProductListParams({
    advanced: showAdvanced ? undefined : "1",
    product_page: 1
  });
  const startRow = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalCount);
  const visiblePageNumbers = Array.from(
    new Set([1, 2, 3, page - 1, page, page + 1, totalPages].filter((value) => value >= 1 && value <= totalPages))
  ).sort((a, b) => a - b);

  return (
    <section className="dashboard-panel">
      <section className="list-header-panel">
        <span>{numberFormatter.format(totalCount)} total products</span>
        <div className="list-actions">
          <button className="danger-action" form="product-delete-form" type="submit">
            Delete Selected
          </button>
          <button className="primary-action" type="button">
            Add Product
          </button>
        </div>
      </section>

      <form action="/" className="list-search-form">
        <input name="module" type="hidden" value={listMode === "discontinued" ? "discontinued-products" : "products"} />
        <input name="product_page" type="hidden" value="1" />
        {!showAdvanced && filters.brandId ? <input name="product_brand" type="hidden" value={filters.brandId} /> : null}
        {!showAdvanced && filters.styleId ? <input name="product_style" type="hidden" value={filters.styleId} /> : null}
        {!showAdvanced && filters.categoryId ? <input name="product_category" type="hidden" value={filters.categoryId} /> : null}
        {!showAdvanced && filters.eligibility ? <input name="product_eligibility" type="hidden" value={filters.eligibility} /> : null}
        {!showAdvanced && filters.status ? <input name="product_status" type="hidden" value={filters.status} /> : null}
        {!showAdvanced && filters.finishId ? <input name="product_finish" type="hidden" value={filters.finishId} /> : null}
        {!showAdvanced && filters.lightCount ? <input name="product_lights" type="hidden" value={filters.lightCount} /> : null}
        {showAdvanced ? <input name="advanced" type="hidden" value="1" /> : null}
        {showAdvanced ? (
          <section className="advanced-filter-panel">
            <div className="advanced-filter-title">
              <h3>Advanced Search</h3>
            </div>
            <div className="advanced-filter-grid">
              <label>
                Brand
                <select defaultValue={filters.brandId ?? ""} name="product_brand">
                  <option value="">All brands</option>
                  {brandOptions.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Style / Suite
                <select defaultValue={filters.styleId ?? ""} name="product_style">
                  <option value="">All styles</option>
                  {styleOptions.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select defaultValue={filters.categoryId ?? ""} name="product_category">
                  <option value="">All categories</option>
                  {regularCategoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Eligibility
                <select defaultValue={filters.eligibility ?? ""} name="product_eligibility">
                  <option value="">All eligibility</option>
                  <option value="all">All</option>
                  <option value="ecommerce_only">Ecommerce Only</option>
                  <option value="non_ecommerce_only">Non-ecommerce Only</option>
                  <option value="exclusive">Exclusive</option>
                </select>
              </label>
              <label>
                Status
                <select defaultValue={filters.status ?? ""} name="product_status">
                  <option value="">All status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </label>
              <label>
                Finish
                <select defaultValue={filters.finishId ?? ""} name="product_finish">
                  <option value="">All finishes</option>
                  {finishOptions.map((finish) => (
                    <option key={finish.id} value={finish.id}>
                      {finish.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Number of Lights
                <input defaultValue={filters.lightCount ?? ""} min="0" name="product_lights" placeholder="Any" type="number" />
              </label>
            </div>
            <div className="advanced-filter-actions">
              <button className="primary-action" type="submit">
                Apply Filters
              </button>
              <Link className="secondary-action secondary-action--light" href={listMode === "discontinued" ? "/?module=discontinued-products" : "/?module=products"}>
                Clear Filters
              </Link>
            </div>
          </section>
        ) : null}
        <label htmlFor="product-search">Search products</label>
        <div className="product-list-controls">
          <label className="inline-select-label">
            Per Page
            <select defaultValue={pageSize} name="product_page_size">
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <div className="list-search-row">
            <input
              autoComplete="off"
              defaultValue={query}
              id="product-search"
              name="q"
              placeholder="SKU, product name, collection"
              type="search"
            />
            <button type="submit">Search</button>
            <Link className="advanced-search-link" href={advancedSearchHref}>
              {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}
            </Link>
          </div>
        </div>
      </form>

      {notice ? <div className="form-alert form-alert--success">{decodeURIComponent(notice)}</div> : null}
      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={deleteProductsAction} id="product-delete-form">
        <input name="q" type="hidden" value={query} />
        <input name="return_module" type="hidden" value={listMode === "discontinued" ? "discontinued-products" : "products"} />
        <input name="advanced" type="hidden" value={showAdvanced ? "1" : ""} />
        <input name="product_brand" type="hidden" value={filters.brandId ?? ""} />
        <input name="product_category" type="hidden" value={filters.categoryId ?? ""} />
        <input name="product_eligibility" type="hidden" value={filters.eligibility ?? ""} />
        <input name="product_finish" type="hidden" value={filters.finishId ?? ""} />
        <input name="product_lights" type="hidden" value={filters.lightCount ?? ""} />
        <input name="product_page" type="hidden" value={page} />
        <input name="product_page_size" type="hidden" value={pageSize} />
        <input name="product_status" type="hidden" value={filters.status ?? ""} />
        <input name="product_style" type="hidden" value={filters.styleId ?? ""} />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="expand-column">Parts</th>
                <th>SKU</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Eligibility</th>
                <th>Inventory</th>
                <th>ETA</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <ProductListRows products={products} />
            </tbody>
            <tfoot>
            <tr>
              <td colSpan={10}>
                <div className="pagination-footer">
                  <span>
                    Showing {numberFormatter.format(startRow)}-{numberFormatter.format(endRow)} of {numberFormatter.format(totalCount)} products
                  </span>
                  <nav className="pagination-nav" aria-label="Product list pages">
                    <Link
                      aria-disabled={page <= 1}
                      className="pagination-link"
                      href={buildProductListParams({ product_page: 1 })}
                    >
                      First
                    </Link>
                    <Link
                      aria-disabled={page <= 1}
                      className="pagination-link"
                      href={buildProductListParams({ product_page: Math.max(1, page - 1) })}
                    >
                      Previous
                    </Link>
                    {visiblePageNumbers.map((pageNumber, index) => (
                      <span className="pagination-page-wrap" key={pageNumber}>
                        {index > 0 && pageNumber - visiblePageNumbers[index - 1] > 1 ? <span className="pagination-ellipsis">...</span> : null}
                        {pageNumber === page ? (
                          <span aria-current="page" className="pagination-current">
                            {pageNumber}
                          </span>
                        ) : (
                          <Link className="pagination-link" href={buildProductListParams({ product_page: pageNumber })}>
                            {pageNumber}
                          </Link>
                        )}
                      </span>
                    ))}
                    <Link
                      aria-disabled={page >= totalPages}
                      className="pagination-link"
                      href={buildProductListParams({ product_page: Math.min(totalPages, page + 1) })}
                    >
                      Next
                    </Link>
                    <Link
                      aria-disabled={page >= totalPages}
                      className="pagination-link"
                      href={buildProductListParams({ product_page: totalPages })}
                    >
                      Last
                    </Link>
                  </nav>
                </div>
              </td>
            </tr>
            </tfoot>
          </table>
        </div>
      </form>
    </section>
  );
}

function PartDetailDashboard({ part, selectedTab }: { part: ProductDetail | null; selectedTab: string }) {
  if (!part) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Part was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=product-parts">
          Back to Parts List
        </Link>
      </section>
    );
  }

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "images", label: "Images" },
    { key: "inventory", label: "Inventory / Locations" },
    { key: "parents", label: "Parent Products" }
  ];
  const activeTab = tabs.some((tab) => tab.key === selectedTab) ? selectedTab : "profile";
  const partTabHref = (tabKey: string) => `/?module=product-parts&part=${part.id}&product_tab=${tabKey}`;
  const etaLabel =
    Number(part.sellable_quantity ?? 0) > 0
      ? "In stock"
      : part.next_incoming_eta
        ? `${dateLabel(part.next_incoming_eta)} (${numberFormatter.format(Number(part.incoming_quantity ?? 0))})`
        : "No ETA";

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href="/?module=product-parts">
            Parts List
          </Link>
          <div className="record-title-row">
            <h2>{part.sku}</h2>
            <StatusBadge tone={part.status === "active" ? "good" : "warn"} value={part.status} />
          </div>
          <p>{part.name}</p>
        </div>
      </section>

      <section className="metric-grid">
        <div className="metric-card">
          <span>Brand</span>
          <strong>{part.brand_name}</strong>
        </div>
        <div className="metric-card">
          <span>Inventory</span>
          <strong>{numberFormatter.format(Number(part.sellable_quantity ?? 0))}</strong>
        </div>
        <div className="metric-card">
          <span>ETA</span>
          <strong>{etaLabel}</strong>
        </div>
      </section>

      <nav className="tab-nav" aria-label="Part detail tabs">
        {tabs.map((tab) => (
          <Link aria-current={activeTab === tab.key ? "page" : undefined} href={partTabHref(tab.key)} key={tab.key}>
            {tab.label}
          </Link>
        ))}
      </nav>

      {activeTab === "profile" ? (
        <section className="detail-section">
          <div className="two-column-grid">
            <div className="info-card">
              <div className="card-heading">
                <h3>Part Profile</h3>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Part SKU</dt>
                  <dd>{part.sku}</dd>
                </div>
                <div>
                  <dt>Part Name</dt>
                  <dd>{part.name}</dd>
                </div>
                <div>
                  <dt>Brand</dt>
                  <dd>{part.brand_name}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{label(part.status)}</dd>
                </div>
              </dl>
            </div>
            <div className="info-card">
              <div className="card-heading">
                <h3>Parent Product Summary</h3>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Linked Products</dt>
                  <dd>{numberFormatter.format(part.usedInParents.length)}</dd>
                </div>
                <div>
                  <dt>Link Type</dt>
                  <dd>{part.usedInParents.length === 0 ? "Generic part" : "Product-specific part"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "images" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>{numberFormatter.format(part.images.length)} part images</span>
            <div className="list-actions">
              <Link className="text-action" href={`/?module=edit-product-images&product=${part.id}&return_module=product-parts`}>
                Edit Images
              </Link>
            </div>
          </section>
          {part.images.length === 0 ? (
            <div className="info-card">No images have been uploaded for this part.</div>
          ) : (
            <div className="image-gallery-grid">
              {part.images.map((image) => (
                <article className="image-tile" key={image.id}>
                  <div className="image-preview-frame">
                    <img alt={image.display_name ?? image.original_file_name} src={image.public_url} />
                  </div>
                  <div className="image-tile-body">
                    <strong>{image.display_name ?? image.original_file_name}</strong>
                    <span>{label(image.image_category)}</span>
                    <a className="table-link" href={image.public_url} rel="noreferrer" target="_blank">
                      Open image
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {activeTab === "inventory" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>{numberFormatter.format(part.inventoryBalances.length)} inventory balances</span>
            <div className="list-actions">
              <Link className="text-action" href={`/?module=edit-product-inventory&product=${part.id}&return_module=product-parts`}>
                Edit Inventory
              </Link>
            </div>
          </section>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Box</th>
                  <th>Warehouse</th>
                  <th>Bin / Location</th>
                  <th>Condition</th>
                  <th>On Hand</th>
                  <th>Allocated</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {part.inventoryBalances.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No inventory balances found.</td>
                  </tr>
                ) : (
                  part.inventoryBalances.map((balance) => (
                    <tr key={balance.id}>
                      <td>{balance.box_sequence ? `Box ${balance.box_sequence}${balance.box_label ? ` / ${balance.box_label}` : ""}` : "SKU balance"}</td>
                      <td>{balance.warehouse_name}</td>
                      <td>{balance.location_code}</td>
                      <td>{label(balance.inventory_condition)}</td>
                      <td>{numberFormatter.format(balance.quantity_on_hand)}</td>
                      <td>{numberFormatter.format(balance.quantity_allocated)}</td>
                      <td>{numberFormatter.format(balance.quantity_available)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {activeTab === "parents" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>{numberFormatter.format(part.usedInParents.length)} linked parent products</span>
            <div className="list-actions">
              <Link className="text-action" href={`/?module=edit-part-parents&part=${part.id}`}>
                Add Parent Products
              </Link>
            </div>
          </section>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Parent SKU</th>
                  <th>Parent Product</th>
                  <th>Role</th>
                  <th>Required</th>
                  <th>Notes</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {part.usedInParents.length === 0 ? (
                  <tr>
                    <td colSpan={6}>This is a generic part. It is not linked to a parent product yet.</td>
                  </tr>
                ) : (
                  part.usedInParents.map((parent) => (
                    <tr key={parent.id}>
                      <td>
                        <Link className="table-link" href={`/?module=products&product=${parent.parent_product_id}`}>
                          {parent.parent_sku}
                        </Link>
                      </td>
                      <td>{parent.parent_name}</td>
                      <td>{label(parent.part_role)}</td>
                      <td>{parent.is_required ? "Yes" : "No"}</td>
                      <td>{parent.notes ?? "Not set"}</td>
                      <td>
                        <form action={deletePartParentLinkAction}>
                          <input name="part_id" type="hidden" value={part.id} />
                          <input name="parent_link_id" type="hidden" value={parent.id} />
                          <button className="text-action text-action--button text-action--danger" type="submit">
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </section>
  );
}

function ProductDetailDashboard({ product, selectedTab }: { product: ProductDetail | null; selectedTab: string }) {
  if (!product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=products">
          Back to Product List
        </Link>
      </section>
    );
  }

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "specs", label: "Specs" },
    { key: "images", label: "Images" },
    { key: "inventory", label: "Inventory / Locations" },
    { key: "parts", label: "Parts" },
    { key: "packing", label: "Packing / Boxes" },
    { key: "documents", label: "Documents" },
    { key: "vendors", label: "Vendors" }
  ];
  const activeTab = tabs.some((tab) => tab.key === selectedTab) ? selectedTab : "profile";
  const productTabHref = (tabKey: string) => `/?module=products&product=${product.id}&product_tab=${tabKey}`;
  const dimensionLabel = (box: ProductPackingBoxDetail) =>
    box.box_length !== null && box.box_width !== null && box.box_height !== null
      ? `${numberFormatter.format(box.box_length)} x ${numberFormatter.format(box.box_width)} x ${numberFormatter.format(box.box_height)} in`
      : "Not set";
  const etaLabel =
    Number(product.sellable_quantity ?? 0) > 0
      ? "In stock"
      : product.next_incoming_eta
        ? `${dateLabel(product.next_incoming_eta)} (${numberFormatter.format(Number(product.incoming_quantity ?? 0))})`
        : "No ETA";
  const imageCategories = ["stock", "detail", "lifestyle", "drawing", "other"];
  const normalizeSpecName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const specValue = (...names: string[]) => {
    const wantedNames = new Set(names.map(normalizeSpecName));
    const match = product.specAttributes.find((spec) => wantedNames.has(normalizeSpecName(spec.attribute_name)));

    if (!match) {
      return "Not set";
    }

    return match.unit ? `${match.attribute_value} ${match.unit}` : match.attribute_value;
  };
  const specRows = (rows: { label: string; names: string[] }[]) =>
    rows.map((row) => ({
      label: row.label,
      value: specValue(...row.names)
    }));
  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href="/?module=products">
            Product List
          </Link>
          <div className="record-title-row">
            <h2>{product.sku}</h2>
            <StatusBadge tone={product.status === "active" ? "good" : "warn"} value={product.status} />
            <StatusBadge value={product.sellability_status} />
          </div>
          <p>{product.name}</p>
        </div>
      </section>

      <section className="metric-grid">
        <div className="metric-card">
          <span>Brand</span>
          <strong>{product.brand_name}</strong>
        </div>
        <div className="metric-card">
          <span>Inventory</span>
          <strong>{numberFormatter.format(Number(product.sellable_quantity ?? 0))}</strong>
        </div>
        <div className="metric-card">
          <span>ETA</span>
          <strong>{etaLabel}</strong>
        </div>
        <div className="metric-card">
          <span>Default Price</span>
          <strong>{money(product.default_price)}</strong>
        </div>
      </section>

      <nav className="tab-nav" aria-label="Product detail tabs">
        {tabs.map((tab) => (
          <Link aria-current={activeTab === tab.key ? "page" : undefined} href={productTabHref(tab.key)} key={tab.key}>
            {tab.label}
          </Link>
        ))}
      </nav>

      {activeTab === "profile" ? (
        <section className="detail-section">
          <div className="two-column-grid">
            <div className="info-card">
              <div className="card-heading">
                <h3>Product Profile</h3>
                <Link className="text-action" href={`/?module=edit-product-profile&product=${product.id}`}>
                  Edit
                </Link>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Name</dt>
                  <dd>{product.name}</dd>
                </div>
                <div>
                  <dt>Brand</dt>
                  <dd>{product.brand_name}</dd>
                </div>
                <div>
                  <dt>Style / Suite</dt>
                  <dd>{product.signature_suite_name ?? "Not set"}</dd>
                </div>
                <div>
                  <dt>Collection / Family</dt>
                  <dd>{product.collection ?? "Not set"}</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd>{product.category_name ?? "Not set"}</dd>
                </div>
                <div>
                  <dt>Eligibility</dt>
                  <dd>{label(product.customer_eligibility_tag)}</dd>
                </div>
                <div>
                  <dt>Primary Showroom Count</dt>
                  <dd>{product.counts_toward_primary_showroom_default === false ? "Excluded" : "Included"}</dd>
                </div>
              </dl>
            </div>
            <div className="info-card">
              <div className="card-heading">
                <h3>Pricing / Finish</h3>
                <Link className="text-action" href={`/?module=edit-product-pricing-finishes&product=${product.id}`}>
                  Edit
                </Link>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Default Price</dt>
                  <dd>{money(product.default_price)}</dd>
                </div>
                <div>
                  <dt>Currency</dt>
                  <dd>{product.currency}</dd>
                </div>
                <div>
                  <dt>Default Vendor Item No.</dt>
                  <dd>{product.default_vendor_item_number ?? "Not set"}</dd>
                </div>
                <div>
                  <dt>Finishes</dt>
                  <dd>{product.finishes.length > 0 ? product.finishes.join(", ") : "Not set"}</dd>
                </div>
                <div>
                  <dt>Box Required</dt>
                  <dd>{product.no_box_needed ? "No box needed" : "Packing box required"}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="info-card">
            <div className="card-heading">
              <h3>Description</h3>
              <Link className="text-action" href={`/?module=edit-product-description&product=${product.id}`}>
                Edit
              </Link>
            </div>
            <p className="long-text">{product.description ?? "No product description saved yet."}</p>
          </div>
        </section>
      ) : null}

      {activeTab === "specs" ? (
        <section className="detail-section">
          <div className="two-column-grid">
            <div className="info-card">
              <div className="card-heading">
                <h3>Dimensions and Weight</h3>
                <Link className="text-action" href={`/?module=edit-product-specs&product=${product.id}&spec_section=dimensions`}>
                  Edit
                </Link>
              </div>
              <dl className="detail-list">
                {specRows([
                  { label: "Body Dimension", names: ["body dimension", "body dimensions", "body size"] },
                  { label: "Shade Dimension", names: ["shade dimension", "shade dimensions", "shade size"] },
                  { label: "Canopy Shape / Size", names: ["canopy shape / size", "canopy shape and size", "canopy detail", "canopy shape", "canopy size"] },
                  { label: "Net Weight", names: ["net weight", "product net weight"] }
                ]).map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="info-card">
              <div className="card-heading">
                <h3>Electrical / Bulbs</h3>
                <Link className="text-action" href={`/?module=edit-product-specs&product=${product.id}&spec_section=electrical`}>
                  Edit
                </Link>
              </div>
              <dl className="detail-list">
                {specRows([
                  { label: "Max Wattage", names: ["max wattage", "maximum wattage"] },
                  { label: "Voltage", names: ["voltage"] },
                  { label: "Socket Type", names: ["socket type"] },
                  { label: "Number of Bulbs", names: ["number of bulbs", "bulb count"] },
                  { label: "Bulb Type", names: ["bulb type", "bulb types"] },
                  {
                    label: "Max Bulbs Wattage",
                    names: ["max bulbs wattage", "max bulb wattage", "maximum bulbs wattage", "max bulb voltage", "maximum bulb voltage"]
                  },
                  { label: "Bulbs Included", names: ["bulbs included", "bulb included"] }
                ]).map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="two-column-grid">
            <div className="info-card">
              <div className="card-heading">
                <h3>Hanging / Suspension</h3>
                <Link className="text-action" href={`/?module=edit-product-specs&product=${product.id}&spec_section=hanging`}>
                  Edit
                </Link>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Mounting Type</dt>
                  <dd>{product.hangingConfig?.mounting_type ?? "Not set"}</dd>
                </div>
                <div>
                  <dt>Wire Length</dt>
                  <dd>{product.hangingConfig?.wire_length ?? specValue("wire length")}</dd>
                </div>
                <div>
                  <dt>Chain Length</dt>
                  <dd>{product.hangingConfig?.chain_length ?? specValue("chain length")}</dd>
                </div>
                <div>
                  <dt>Rod Length / Sizes</dt>
                  <dd>{product.hangingConfig?.rod_length ?? specValue("rod sizes", "rod pieces", "rods included")}</dd>
                </div>
                <div>
                  <dt>Canopy Detail</dt>
                  <dd>{product.hangingConfig?.canopy_detail ?? specValue("canopy shape / size", "canopy shape and size", "canopy detail")}</dd>
                </div>
                <div>
                  <dt>Suspension System</dt>
                  <dd>{specValue("suspension system", "suspension type")}</dd>
                </div>
                <div>
                  <dt>Hanging Notes</dt>
                  <dd>{product.hangingConfig?.notes ?? "Not set"}</dd>
                </div>
              </dl>
            </div>
            <div className="info-card">
              <div className="card-heading">
                <h3>Integrated LED</h3>
                <Link className="text-action" href={`/?module=edit-product-specs&product=${product.id}&spec_section=led`}>
                  Edit
                </Link>
              </div>
              <dl className="detail-list">
                {specRows([
                  { label: "Integrated LED", names: ["integrated led", "integrated led fixture"] },
                  { label: "Dimmable", names: ["dimmable"] },
                  { label: "Dimmer Type", names: ["dimmer type"] },
                  { label: "Color Temperature", names: ["color temperature", "kelvin"] },
                  { label: "Lumen", names: ["lumen", "lumens"] }
                ]).map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="info-card">
            <div className="card-heading">
              <h3>Safety / Identifiers</h3>
              <Link className="text-action" href={`/?module=edit-product-specs&product=${product.id}&spec_section=safety`}>
                Edit
              </Link>
            </div>
            <dl className="detail-list">
              {specRows([
                { label: "Safety Rating", names: ["safety rating", "safety rate", "ul etl"] },
                { label: "UPC Code", names: ["upc", "upc code"] }
              ]).map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {activeTab === "images" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>{numberFormatter.format(product.images.length)} product images</span>
            <div className="list-actions">
              <Link className="primary-action" href={`/?module=edit-product-images&product=${product.id}`}>
                Add Image
              </Link>
            </div>
          </section>
          {product.images.length === 0 ? <div className="empty-state">No product images uploaded yet.</div> : null}
          {imageCategories.map((category) => {
            const categoryImages = product.images.filter((image) => image.image_category === category);

            if (categoryImages.length === 0) {
              return null;
            }

            return (
              <div className="info-card" key={category}>
                <div className="section-title section-title--plain">
                  <strong>{label(category)} Images</strong>
                  <div className="section-title-actions">
                    <span>{categoryImages.length}</span>
                    <Link className="text-action" href={`/?module=edit-product-images&product=${product.id}&image_category=${category}`}>
                      Edit
                    </Link>
                  </div>
                </div>
                <div className="image-gallery-grid">
                  {categoryImages.map((image) => (
                    <article className="image-tile" key={image.id}>
                      <div className="image-preview-frame">
                        <img alt={image.display_name ?? image.original_file_name} src={image.public_url} />
                      </div>
                      <div className="image-tile-body">
                        <div className="image-tile-title">
                          <strong>{image.display_name ?? image.original_file_name}</strong>
                          {image.is_default_thumbnail ? <StatusBadge tone="primary" value="Default Thumbnail" /> : null}
                        </div>
                        <span>{image.original_file_name}</span>
                        <span>{fileSizeLabel(image.file_size)}</span>
                        <span>{dateLabel(image.uploaded_at.slice(0, 10))}</span>
                        <a className="table-link" href={image.public_url} rel="noreferrer" target="_blank">
                          Open image
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      {activeTab === "documents" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>{numberFormatter.format(product.documents.length)} product documents</span>
          </section>
          <div className="info-card">
            <div className="section-title section-title--plain">
              <strong>Upload Product Document</strong>
            </div>
            <form action={uploadProductDocumentAction} className="attachment-upload-form attachment-upload-form--product">
              <input name="product_id" type="hidden" value={product.id} />
              <label>
                Document
                <input name="document_file" required type="file" />
              </label>
              <label>
                Type
                <select name="document_type" defaultValue="spec_sheet">
                  <option value="spec_sheet">Product Spec Tear Sheet</option>
                  <option value="installation_instruction">Installation Instructions</option>
                  <option value="manual">Manual</option>
                  <option value="box_label">Box Label / White Label</option>
                  <option value="cad_drawing">CAD Drawing</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Display Name
                <input name="display_name" placeholder="Optional display name" />
              </label>
              <button className="small-action" type="submit">
                Upload
              </button>
            </form>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>File Name</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                  <th>Open</th>
                </tr>
              </thead>
              <tbody>
                {product.documents.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No product documents uploaded yet.</td>
                  </tr>
                ) : (
                  product.documents.map((document) => (
                    <tr key={document.id}>
                      <td>{document.display_name ?? document.original_file_name}</td>
                      <td>{label(document.document_type)}</td>
                      <td>{document.original_file_name}</td>
                      <td>{fileSizeLabel(document.file_size)}</td>
                      <td>{dateLabel(document.uploaded_at.slice(0, 10))}</td>
                      <td>
                        {document.signed_url ? (
                          <a className="table-link" href={document.signed_url} rel="noreferrer" target="_blank">
                            Open
                          </a>
                        ) : (
                          "Not available"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {activeTab === "vendors" ? <ProductVendorRows productId={product.id} vendors={product.vendors} /> : null}

      {activeTab === "inventory" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>{numberFormatter.format(product.inventoryBalances.length)} inventory balances</span>
            <div className="list-actions">
              <Link className="text-action" href={`/?module=edit-product-inventory&product=${product.id}`}>
                Edit Inventory
              </Link>
            </div>
          </section>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Box</th>
                  <th>Warehouse</th>
                  <th>Bin / Location</th>
                  <th>Condition</th>
                  <th>On Hand</th>
                  <th>Allocated</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {product.inventoryBalances.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No inventory balances found.</td>
                  </tr>
                ) : (
                  product.inventoryBalances.map((balance) => (
                    <tr key={balance.id}>
                      <td>{balance.box_sequence ? `Box ${balance.box_sequence}${balance.box_label ? ` / ${balance.box_label}` : ""}` : "SKU balance"}</td>
                      <td>{balance.warehouse_name}</td>
                      <td>{balance.location_code}</td>
                      <td>{label(balance.inventory_condition)}</td>
                      <td>{numberFormatter.format(balance.quantity_on_hand)}</td>
                      <td>{numberFormatter.format(balance.quantity_allocated)}</td>
                      <td>{numberFormatter.format(balance.quantity_available)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {activeTab === "parts" ? (
        <section className="detail-section">
          <ProductDetailPartsTable parts={product.parts} productId={product.id} />
          {product.usedInParents.length > 0 ? (
            <div className="info-card">
              <div className="card-heading">
                <h3>This Part Is Used In</h3>
                <Link className="text-action" href={`/?module=edit-product-parts&product=${product.id}`}>
                  Edit Links
                </Link>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Parent SKU</th>
                      <th>Parent Product</th>
                      <th>Part Name</th>
                      <th>Role</th>
                      <th>Required</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.usedInParents.map((part) => (
                      <tr key={part.id}>
                        <td>
                          <Link className="table-link" href={`/?module=products&product=${part.parent_product_id}`}>
                            {part.parent_sku}
                          </Link>
                        </td>
                        <td>{part.parent_name}</td>
                        <td>{part.part_name ?? part.component_name}</td>
                        <td>{label(part.part_role)}</td>
                        <td>{part.is_required ? "Yes" : "No"}</td>
                        <td>{part.notes ?? "Not set"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {activeTab === "packing" ? (
        <section className="detail-section">
          <div className="info-card">
            <div className="card-heading">
              <h3>Packing Specification</h3>
              <Link className="text-action" href={`/?module=edit-product-boxes&product=${product.id}`}>
                Edit
              </Link>
            </div>
            <dl className="detail-list">
              {specRows([
                { label: "Cardboard Spec", names: ["cardboard spec", "cardboard specification"] },
                { label: "Foam Density", names: ["foam density"] }
              ]).map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <section className="list-header-panel list-header-panel--compact">
            <span>{numberFormatter.format(product.packingBoxes.length)} packing boxes</span>
            <div className="list-actions">
              <Link className="text-action" href={`/?module=add-product-box&product=${product.id}`}>
                Add Box
              </Link>
              <Link className="text-action" href={`/?module=edit-product-boxes&product=${product.id}`}>
                Edit Boxes
              </Link>
            </div>
          </section>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Box</th>
                  <th>Label</th>
                  <th>Dimensions</th>
                  <th>Net Weight</th>
                  <th>Gross Weight</th>
                  <th>Inch Volume</th>
                  <th>CBM</th>
                  <th>Required Box</th>
                </tr>
              </thead>
              <tbody>
                {product.packingBoxes.length === 0 ? (
                  <tr>
                    <td colSpan={8}>No packing boxes found.</td>
                  </tr>
                ) : (
                  product.packingBoxes.map((box) => (
                    <tr key={box.id}>
                      <td>Box {box.box_sequence}</td>
                      <td>{box.box_label ?? "Not set"}</td>
                      <td>{dimensionLabel(box)}</td>
                      <td>{box.net_weight === null ? "Not set" : `${numberFormatter.format(box.net_weight)} lb`}</td>
                      <td>{box.gross_weight === null ? "Not set" : `${numberFormatter.format(box.gross_weight)} lb`}</td>
                      <td>{box.inch_volume === null ? "Not set" : numberFormatter.format(box.inch_volume)}</td>
                      <td>{box.cbm === null ? "Not set" : numberFormatter.format(box.cbm)}</td>
                      <td>{box.is_required_for_sale ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </section>
  );
}

function ProductEditPlaceholder({ moduleName, productId }: { moduleName: string; productId?: string }) {
  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={productId ? `/?module=products&product=${productId}` : "/?module=products"}>
            Product Detail
          </Link>
          <div className="record-title-row">
            <h2>{moduleName}</h2>
          </div>
          <p>This focused edit page will be built as a separate small form instead of one long product edit screen.</p>
        </div>
      </section>
      <div className="empty-state">Form coming in the next product edit slice.</div>
    </section>
  );
}

async function EditProductImagesForm({
  error,
  imageCategory,
  notice,
  productId,
  returnModule
}: {
  error?: string;
  imageCategory?: string;
  notice?: string;
  productId?: string;
  returnModule?: string;
}) {
  const product = productId ? await getProductDetail(productId) : null;
  const returnToPart = returnModule === "product-parts";
  const imagesHref = returnToPart
    ? `/?module=product-parts&part=${productId}&product_tab=images`
    : `/?module=products&product=${productId}&product_tab=images`;
  const editImagesHref = (category: ProductImageCategory) =>
    `/?module=edit-product-images&product=${productId}&image_category=${category}${returnToPart ? "&return_module=product-parts" : ""}`;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=products">
          Back to Product List
        </Link>
      </section>
    );
  }

  const imageCategories: { key: ProductImageCategory; label: string }[] = [
    { key: "stock", label: "Stock Images" },
    { key: "detail", label: "Detail Images" },
    { key: "lifestyle", label: "Lifestyle Images" },
    { key: "drawing", label: "Drawing Images" },
    { key: "other", label: "Other Images" }
  ];
  const activeCategory = imageCategories.some((category) => category.key === imageCategory) ? (imageCategory as ProductImageCategory) : "stock";
  const visibleImages = product.images.filter((image) => image.image_category === activeCategory);

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={imagesHref}>
            {returnToPart ? "Part Images" : "Product Images"}
          </Link>
          <div className="record-title-row">
            <h2>{returnToPart ? "Edit Part Images" : "Edit Product Images"}</h2>
          </div>
          <p>{product.sku} / {product.name}</p>
        </div>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}
      {notice ? <div className="form-notice">{decodeURIComponent(notice)}</div> : null}

      <nav className="tab-nav" aria-label="Image edit categories">
        {imageCategories.map((category) => (
          <Link
            aria-current={activeCategory === category.key ? "page" : undefined}
            href={editImagesHref(category.key)}
            key={category.key}
          >
            {category.label}
          </Link>
        ))}
      </nav>

      <form action={uploadProductImageAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        {returnToPart ? <input name="return_module" type="hidden" value="product-parts" /> : null}
        <fieldset>
          <legend>Upload Image</legend>
          <div className="form-grid">
            <label>
              Image File
              <input accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff" name="image_file" required type="file" />
            </label>
            <label>
              Image Category
              <select defaultValue={activeCategory} name="image_category">
                {imageCategories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Image Name / Description
              <input name="display_name" placeholder="Optional image name or short description" />
            </label>
            <label className="checkbox-label">
              <input disabled={activeCategory !== "stock"} name="is_default_thumbnail" type="checkbox" />
              Set as default thumbnail
            </label>
          </div>
          <p className="fieldset-note">Supported image formats include JPG, PNG, WEBP, GIF, BMP, and TIFF.</p>
        </fieldset>
        <div className="form-actions">
          <button type="submit">Upload Image</button>
        </div>
      </form>

      <form action={updateProductImagesAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        <input name="return_image_category" type="hidden" value={activeCategory} />
        {returnToPart ? <input name="return_module" type="hidden" value="product-parts" /> : null}
        <fieldset>
          <legend>Existing Images</legend>
          {visibleImages.length === 0 ? <p className="fieldset-note">No images uploaded in this category yet.</p> : null}
          <div className="image-edit-list">
            {visibleImages.map((image) => (
              <section className="image-edit-panel" key={image.id}>
                <input name="image_ids" type="hidden" value={image.id} />
                <div className="image-edit-preview">
                  <img alt={image.display_name ?? image.original_file_name} src={image.public_url} />
                </div>
                <div className="form-grid image-edit-grid">
                  <label>
                    Image Name / Description
                    <input defaultValue={image.display_name ?? ""} name={`display_name_${image.id}`} />
                  </label>
                  <label>
                    Category
                    <select defaultValue={image.image_category} name={`image_category_${image.id}`}>
                      {imageCategories.map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Sort Order
                    <input defaultValue={image.sort_order} min={0} name={`sort_order_${image.id}`} step={1} type="number" />
                  </label>
                  <label className="checkbox-label">
                    <input
                      defaultChecked={image.is_default_thumbnail}
                      disabled={image.image_category !== "stock"}
                      name="default_thumbnail_image_id"
                      type="radio"
                      value={image.id}
                    />
                    Default thumbnail
                  </label>
                  <label className="checkbox-label">
                    <input name="delete_image_ids" type="checkbox" value={image.id} />
                    Delete image
                  </label>
                  <div className="image-edit-meta">
                    <span>{image.original_file_name}</span>
                    <span>{fileSizeLabel(image.file_size)}</span>
                    <span>{dateLabel(image.uploaded_at.slice(0, 10))}</span>
                    <a className="table-link" href={image.public_url} rel="noreferrer" target="_blank">
                      Open image
                    </a>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </fieldset>
        <div className="form-actions">
          <button type="submit">Save Image Changes</button>
          <Link className="secondary-action secondary-action--light" href={imagesHref}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function EditProductPartsForm({
  error,
  partAction,
  productId,
  selectedParts
}: {
  error?: string;
  partAction?: string;
  productId?: string;
  selectedParts?: string;
}) {
  const product = productId ? await getProductDetail(productId) : null;

  const supabase = createSupabaseAdminClient();
  const { data: candidateProducts, error: candidateError } = await supabase
    .from("product")
    .select("id, sku, name, status, brand(name), product_category(name)")
    .neq("status", "deleted")
    .order("sku", { ascending: true })
    .limit(500);

  if (candidateError) {
    throw new Error(candidateError.message);
  }

  if (productId && !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=products">
          Back to Product List
        </Link>
      </section>
    );
  }

  const activeAction: "add" | "delete" | "edit" = product
    ? partAction === "add" || partAction === "delete"
      ? partAction
      : "edit"
    : "add";
  const productOptions = candidateProducts ?? [];
  const initialSelectedPartIds = (selectedParts ?? "")
    .split(",")
    .map((partId) => partId.trim())
    .filter(Boolean);
  const cancelHref = product ? `/?module=products&product=${product.id}&product_tab=parts` : "/?module=product-parts";
  const pageTitle = activeAction === "add" ? "Add Product Part" : activeAction === "delete" ? "Delete Product Parts" : "Edit Product Parts";
  const submitLabel = activeAction === "add" ? "Save New Part" : activeAction === "delete" ? "Save Part Deletions" : "Save Part Changes";
  const optionLabel = (candidate: (typeof productOptions)[number]) => {
    const brandName = Array.isArray(candidate.brand) ? candidate.brand[0]?.name : candidate.brand?.name;
    const categoryName = Array.isArray(candidate.product_category) ? candidate.product_category[0]?.name : candidate.product_category?.name;

    return `${candidate.sku} / ${candidate.name} / ${brandName ?? "No brand"} / ${categoryName ?? "No category"}`;
  };

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={cancelHref}>
            {product ? "Product Parts" : "Parts List"}
          </Link>
          <div className="record-title-row">
            <h2>{pageTitle}</h2>
          </div>
          <p>{product ? `${product.sku} / ${product.name}` : "Select the parent product, then enter the new part."}</p>
        </div>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={updateProductPartsAction} className="customer-form">
        <input name="product_id" type="hidden" value={product?.id ?? ""} />

        <fieldset>
          <legend>Parent Product</legend>
          {product ? (
            <div className="readonly-summary">
              <strong>{product.sku}</strong>
              <span>{product.name}</span>
              <span>Parent product is set from the current product page.</span>
            </div>
          ) : (
            <div className="form-grid">
              <label className="full-width-field">
                Parent Product
                <select name="parent_product_id" required>
                  <option value="">Select a parent product</option>
                  {productOptions.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {optionLabel(candidate)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </fieldset>

        {product && activeAction !== "add" ? (
          <fieldset>
            <legend>Existing Parts</legend>
            <ProductPartsEditRows
              activeAction={activeAction}
              initialSelectedPartIds={initialSelectedPartIds}
              parentProductId={product.id}
              parts={product.parts}
              productOptions={productOptions.map((candidate) => ({
                id: candidate.id,
                name: candidate.name,
                sku: candidate.sku
              }))}
              roleOptions={productPartRoleOptions}
            />
          </fieldset>
        ) : null}

        {activeAction === "add" ? (
        <fieldset className="highlight-panel">
          <legend>Add Part</legend>
          <div className="form-grid">
            <label>
              Part Name
              <input name="new_part_product_name" placeholder="Example: H23107 Glass Shade" />
            </label>
            <label>
              Initial Inventory
              <input min={0} name="new_part_initial_inventory" step={1} type="number" />
            </label>
            <label>
              Role
              <select name="new_part_role">
                <option value="">Not set</option>
                {productPartRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <label className="checkbox-label">
              <input defaultChecked name="new_is_required" type="checkbox" />
              Required part
            </label>
            <label className="full-width-field">
              Notes
              <textarea name="new_notes" placeholder="Optional internal notes" rows={3} />
            </label>
            <label className="full-width-field">
              Part Images
              <input accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff" multiple name="new_part_images" type="file" />
            </label>
          </div>
          <p className="fieldset-note">
            The system will create this as a new Accessory product SKU, using the format PT [ROLE]-[5 random digits], and link it to the parent product above. Uploaded images are saved as stock images for the new part.
          </p>
        </fieldset>
        ) : null}

        <div className="form-actions">
          {activeAction === "add" ? <button type="submit">{submitLabel}</button> : null}
          <Link className="secondary-action secondary-action--light" href={cancelHref}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function AddPartParentProductsForm({ error, partId }: { error?: string; partId?: string }) {
  const part = partId ? await getProductDetail(partId) : null;
  const supabase = createSupabaseAdminClient();
  const { data: candidates, error: candidatesError } = await supabase
    .from("product")
    .select("id, sku, name, brand(name), product_category(name, category_code)")
    .neq("status", "deleted")
    .order("sku", { ascending: true })
    .limit(500);

  if (candidatesError) {
    throw new Error(candidatesError.message);
  }

  if (!part) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Part was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=product-parts">
          Back to Parts List
        </Link>
      </section>
    );
  }

  const { data: originalPartLink, error: originalPartLinkError } = await supabase
    .from("product_part")
    .select("part_role")
    .eq("component_product_id", part.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (originalPartLinkError) {
    throw new Error(originalPartLinkError.message);
  }

  const existingParentIds = new Set(part.usedInParents.map((parent) => parent.parent_product_id));
  const parentCandidates = (candidates ?? []).filter((candidate) => {
    const category = Array.isArray(candidate.product_category) ? candidate.product_category[0] : candidate.product_category;
    const isAccessory = category?.category_code === "accessory" || category?.name?.toLowerCase() === "accessory";

    return candidate.id !== part.id && !isAccessory && !existingParentIds.has(candidate.id);
  });

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={`/?module=product-parts&part=${part.id}&product_tab=parents`}>
            Parent Products
          </Link>
          <div className="record-title-row">
            <h2>Add Parent Products</h2>
          </div>
          <p>
            {part.sku} / {part.name}
          </p>
        </div>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={addPartParentProductsAction} className="customer-form">
        <input name="part_id" type="hidden" value={part.id} />
        <fieldset>
          <legend>Products to Link</legend>
          <p className="fieldset-note">Select one or more regular products that can use this part.</p>
          {parentCandidates.length === 0 ? (
            <p className="fieldset-note">All available regular products are already linked, or no regular products are available.</p>
          ) : (
            <PartParentProductPicker
              products={parentCandidates.map((candidate) => ({
                brandName: (Array.isArray(candidate.brand) ? candidate.brand[0]?.name : candidate.brand?.name) ?? "No brand",
                id: candidate.id,
                name: candidate.name,
                sku: candidate.sku
              }))}
            />
          )}
        </fieldset>

        <fieldset>
          <legend>Link Details</legend>
          <div className="form-grid">
            <label>
              Role
              <select name="part_role" defaultValue={originalPartLink?.part_role ?? ""}>
                <option value="">Not set</option>
                {productPartRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {label(role)}
                  </option>
                ))}
              </select>
            </label>
            <label className="checkbox-label">
              <input defaultChecked name="is_required" type="checkbox" />
              Required part
            </label>
            <label className="full-width-field">
              Notes
              <textarea name="notes" placeholder="Optional internal notes for these parent-product links" rows={3} />
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button disabled={parentCandidates.length === 0} type="submit">
            Add Parent Products
          </button>
          <Link className="secondary-action secondary-action--light" href={`/?module=product-parts&part=${part.id}&product_tab=parents`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function EditProductVendorsForm({
  error,
  productId,
  selectedVendorProducts,
  vendorAction
}: {
  error?: string;
  productId?: string;
  selectedVendorProducts?: string;
  vendorAction?: string;
}) {
  const product = productId ? await getProductDetail(productId) : null;
  const supabase = createSupabaseAdminClient();
  const { data: vendors, error: vendorsError } = await supabase
    .from("vendor")
    .select("id, name")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (vendorsError) throw new Error(vendorsError.message);

  if (!product) {
    return <section className="dashboard-panel"><div className="form-alert">Product was not found.</div></section>;
  }

  const selectedIds = (selectedVendorProducts ?? "").split(",").map((id) => id.trim()).filter(Boolean);
  const action = vendorAction === "add" || vendorAction === "delete" ? vendorAction : "edit";
  const selectedVendors = product.vendors.filter((vendor) => selectedIds.includes(vendor.id));
  const cancelHref = `/?module=products&product=${product.id}&product_tab=vendors`;

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={cancelHref}>Product Vendors</Link>
          <div className="record-title-row"><h2>{action === "add" ? "Add Vendor" : action === "delete" ? "Delete Product Vendors" : "Edit Product Vendors"}</h2></div>
          <p>{product.sku} / {product.name}</p>
        </div>
      </section>
      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}
      <form action={updateProductVendorsAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        <input name="vendor_action" type="hidden" value={action} />
        {selectedIds.map((id) => <input key={id} name="selected_vendor_product_ids" type="hidden" value={id} />)}
        {action === "add" ? (
          <fieldset>
            <legend>Vendor Product Details</legend>
            <div className="form-grid">
              <label>Vendor<select name="vendor_id" required><option value="">Select vendor</option>{(vendors ?? []).map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name}</option>)}</select></label>
              <label>Vendor Item No.<input name="vendor_item_number" required /></label>
              <label>Vendor Item Name<input name="vendor_item_name" /></label>
              <label>Vendor Price<input min={0} name="unit_cost" required step="0.0001" type="number" /></label>
              <label>MOQ<input min={0.001} name="minimum_order_quantity" step="0.001" type="number" /></label>
              <label>Lead Time (days)<input min={0} name="lead_time_days" step={1} type="number" /></label>
            </div>
          </fieldset>
        ) : action === "delete" ? (
          <fieldset><legend>Confirm Deletion</legend><p className="fieldset-note">The selected vendor links will be removed from this product. Vendor master records are not deleted.</p><ul>{selectedVendors.map((vendor) => <li key={vendor.id}>{vendor.vendor_name}</li>)}</ul></fieldset>
        ) : (
          <fieldset>
            <legend>Selected Vendor Lines</legend>
            {selectedVendors.length === 0 ? <p className="fieldset-note">No vendor lines were selected.</p> : selectedVendors.map((vendor) => (
              <section className="info-card" key={vendor.id}>
                <h3>{vendor.vendor_name}</h3>
                <div className="form-grid">
                  <label>Vendor Item No.<input defaultValue={vendor.vendor_item_number} name={`vendor_item_number_${vendor.id}`} required /></label>
                  <label>Vendor Price<input defaultValue={vendor.unit_cost} min={0} name={`unit_cost_${vendor.id}`} required step="0.0001" type="number" /></label>
                  <label>MOQ<input defaultValue={vendor.minimum_order_quantity ?? ""} min={0.001} name={`minimum_order_quantity_${vendor.id}`} step="0.001" type="number" /></label>
                  <label>Lead Time (days)<input defaultValue={vendor.lead_time_days ?? ""} min={0} name={`lead_time_days_${vendor.id}`} step={1} type="number" /></label>
                </div>
              </section>
            ))}
          </fieldset>
        )}
        <div className="form-actions">
          <button className={action === "delete" ? "danger-action" : undefined} disabled={action !== "add" && selectedVendors.length === 0} type="submit">{action === "add" ? "Add Vendor" : action === "delete" ? "Delete Selected" : "Save Vendor Changes"}</button>
          <Link className="secondary-action secondary-action--light" href={cancelHref}>Cancel</Link>
        </div>
      </form>
    </section>
  );
}

async function EditProductProfileForm({
  brandOptions,
  categoryOptions,
  error,
  productId,
  styleOptions
}: {
  brandOptions: SelectOption[];
  categoryOptions: SelectOption[];
  error?: string;
  productId?: string;
  styleOptions: SelectOption[];
}) {
  const product = productId ? await getProductDetail(productId) : null;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=products">
          Back to Product List
        </Link>
      </section>
    );
  }

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={`/?module=products&product=${product.id}`}>
            Product Detail
          </Link>
          <div className="record-title-row">
            <h2>Edit Product Profile</h2>
          </div>
          <p>{product.sku} / {product.name}</p>
        </div>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={updateProductProfileAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />

        <fieldset>
          <legend>Core Product</legend>
          <div className="form-grid">
            <label>
              SKU
              <input defaultValue={product.sku} name="sku" required />
            </label>
            <label>
              Product Name
              <input defaultValue={product.name} name="name" required />
            </label>
            <label>
              Brand
              <select defaultValue={product.brand_id} name="brand_id" required>
                {brandOptions.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select defaultValue={product.category_id ?? ""} name="product_category_id">
                <option value="">Not set</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Style / Suite
              <select defaultValue={product.signature_suite_id ?? ""} name="signature_suite_id">
                <option value="">Not set</option>
                {styleOptions.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Collection / Family
              <input defaultValue={product.collection ?? ""} name="collection" />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Status / Eligibility</legend>
          <div className="form-grid">
            <label>
              Lifecycle Status
              <select defaultValue={product.status} name="status">
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
                <option value="deleted">Deleted</option>
              </select>
            </label>
            <label>
              Sellability
              <select defaultValue={product.sellability_status} name="sellability_status">
                <option value="hidden">Hidden</option>
                <option value="sellable">Sellable</option>
                <option value="blocked">Blocked</option>
                <option value="override_required">Override Required</option>
              </select>
            </label>
            <label>
              Customer Eligibility
              <select defaultValue={product.customer_eligibility_tag} name="customer_eligibility_tag">
                <option value="all">All</option>
                <option value="ecommerce_only">Ecommerce Only</option>
                <option value="non_ecommerce_only">Non-ecommerce Only</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </label>
            <label>
              Primary Showroom Count
              <select
                defaultValue={product.counts_toward_primary_showroom_default === false ? "no" : "yes"}
                name="counts_toward_primary_showroom_default"
              >
                <option value="yes">Included</option>
                <option value="no">Excluded</option>
              </select>
            </label>
            <label className="full-width-field">
              Exclusion Reason
              <input defaultValue={product.primary_showroom_exclusion_reason ?? ""} name="primary_showroom_exclusion_reason" />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Pricing / Description</legend>
          <div className="form-grid">
            <label>
              Default Price
              <input defaultValue={product.default_price ?? ""} min="0" name="default_price" step="0.01" type="number" />
            </label>
            <label>
              Default Vendor Item No.
              <input defaultValue={product.default_vendor_item_number ?? ""} name="default_vendor_item_number" />
            </label>
            <label className="checkbox-label">
              <input defaultChecked={product.no_box_needed} name="no_box_needed" type="checkbox" />
              No box needed
            </label>
            <label className="full-width-field">
              Product Description
              <textarea defaultValue={product.description ?? ""} maxLength={3500} name="description" rows={7} />
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Save Product Profile</button>
          <Link className="secondary-action secondary-action--light" href={`/?module=products&product=${product.id}`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function EditProductSpecsForm({
  error,
  productId,
  specSection = "dimensions"
}: {
  error?: string;
  productId?: string;
  specSection?: string;
}) {
  const product = productId ? await getProductDetail(productId) : null;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=products">
          Back to Product List
        </Link>
      </section>
    );
  }

  const normalizeSpecName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const findSpec = (names: string[]) => {
    const wantedNames = new Set(names.map(normalizeSpecName));
    return product.specAttributes.find((spec) => wantedNames.has(normalizeSpecName(spec.attribute_name))) ?? null;
  };
  const fieldGroups: Record<
    string,
    {
      label: string;
      fields: { key: string; label: string; names: string[]; unit?: string; inputType?: "checkbox"; showUnit?: boolean }[];
    }
  > = {
    dimensions: {
      label: "Dimensions and Weight",
      fields: [
        { key: "body_dimension", label: "Body Dimension", names: ["body dimension", "body dimensions", "body size"], unit: "in" },
        { key: "shade_dimension", label: "Shade Dimension", names: ["shade dimension", "shade dimensions", "shade size"], unit: "in" },
        { key: "canopy_shape_size", label: "Canopy Shape / Size", names: ["canopy shape / size", "canopy shape and size", "canopy detail", "canopy shape", "canopy size"], unit: "in" },
        { key: "net_weight", label: "Net Weight", names: ["net weight", "product net weight"], unit: "lb" }
      ]
    },
    electrical: {
      label: "Electrical / Bulbs",
      fields: [
        { key: "max_wattage", label: "Max Wattage", names: ["max wattage", "maximum wattage"], unit: "W" },
        { key: "voltage", label: "Voltage", names: ["voltage"], unit: "V" },
        { key: "socket_type", label: "Socket Type", names: ["socket type"], showUnit: false },
        { key: "number_of_bulbs", label: "Number of Bulbs", names: ["number of bulbs", "bulb count"], showUnit: false },
        { key: "bulb_type", label: "Bulb Type", names: ["bulb type", "bulb types"], showUnit: false },
        {
          key: "max_bulbs_wattage",
          label: "Max Bulbs Wattage",
          names: ["max bulbs wattage", "max bulb wattage", "maximum bulbs wattage", "max bulb voltage", "maximum bulb voltage"],
          unit: "W"
        },
        { key: "bulbs_included", label: "Bulbs Included", names: ["bulbs included", "bulb included"], inputType: "checkbox", showUnit: false }
      ]
    },
    hanging: {
      label: "Hanging / Suspension",
      fields: [
        {
          key: "suspension_system",
          label: "Suspension System",
          names: ["suspension system", "suspension type"],
          showUnit: false
        }
      ]
    },
    led: {
      label: "Integrated LED",
      fields: [
        { key: "integrated_led", label: "Integrated LED", names: ["integrated led", "integrated led fixture"], inputType: "checkbox", showUnit: false },
        { key: "dimmable", label: "Dimmable", names: ["dimmable"], inputType: "checkbox", showUnit: false },
        { key: "dimmer_type", label: "Dimmer Type", names: ["dimmer type"], showUnit: false },
        { key: "color_temperature", label: "Color Temperature", names: ["color temperature", "kelvin"], unit: "K" },
        { key: "lumen", label: "Lumen", names: ["lumen", "lumens"], unit: "lm" }
      ]
    },
    safety: {
      label: "Safety / Identifiers",
      fields: [
        { key: "safety_rating", label: "Safety Rating", names: ["safety rating", "safety rate", "ul etl"] },
        { key: "upc_code", label: "UPC Code", names: ["upc", "upc code"] }
      ]
    },
    packing: {
      label: "Packing Specification",
      fields: [
        { key: "cardboard_spec", label: "Cardboard Spec", names: ["cardboard spec", "cardboard specification"], showUnit: false },
        { key: "foam_density", label: "Foam Density", names: ["foam density"], showUnit: false }
      ]
    }
  };
  const sectionKey = Object.keys(fieldGroups).includes(specSection) ? specSection : "dimensions";
  const section = fieldGroups[sectionKey];
  const knownSpecNames = new Set(Object.values(fieldGroups).flatMap((group) => group.fields.flatMap((field) => field.names.map(normalizeSpecName))));
  const otherSpecs = product.specAttributes.filter((spec) => !knownSpecNames.has(normalizeSpecName(spec.attribute_name)));

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={`/?module=products&product=${product.id}&product_tab=specs`}>
            Product Specs
          </Link>
          <div className="record-title-row">
            <h2>Edit Product Specs</h2>
          </div>
          <p>{product.sku} / {product.name}</p>
        </div>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <nav className="tab-nav" aria-label="Spec edit sections">
        {[
          ...Object.entries(fieldGroups).map(([key, group]) => ({ key, label: group.label })),
          { key: "other", label: "Other Specs" }
        ].map((tab) => (
          <Link
            aria-current={(specSection === "other" ? "other" : sectionKey) === tab.key ? "page" : undefined}
            href={`/?module=edit-product-specs&product=${product.id}&spec_section=${tab.key}`}
            key={tab.key}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <form action={updateProductSpecsAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        <input name="spec_section" type="hidden" value={specSection === "other" ? "other" : sectionKey} />

        {specSection === "other" ? (
          <fieldset>
            <legend>Other Saved Specs</legend>
            {otherSpecs.length === 0 ? <p className="fieldset-note">No other specs saved yet. Add custom specs below.</p> : null}
            <div className="form-grid">
              {otherSpecs.map((spec) => (
                <Fragment key={spec.id}>
                  <input name="spec_fields" type="hidden" value={`${spec.id}|${spec.attribute_name}`} />
                  <input name={`spec_id_${spec.id}`} type="hidden" value={spec.id} />
                  <label>
                    {spec.attribute_name}
                    <input defaultValue={spec.attribute_value} name={`spec_value_${spec.id}`} />
                  </label>
                  <label>
                    Unit
                    <input defaultValue={spec.unit ?? ""} name={`spec_unit_${spec.id}`} />
                  </label>
                </Fragment>
              ))}
            </div>
            <div className="form-subsection">
              <h3>Add Custom Specs</h3>
              <div className="form-grid">
                {[1, 2, 3].map((rowNumber) => (
                  <Fragment key={rowNumber}>
                    <label>
                      Spec Name
                      <input name={`custom_spec_name_${rowNumber}`} placeholder="Example: Backplate Material" />
                    </label>
                    <label>
                      Spec Value
                      <input name={`custom_spec_value_${rowNumber}`} placeholder="Example: Steel" />
                    </label>
                    <label>
                      Unit
                      <input name={`custom_spec_unit_${rowNumber}`} placeholder="Optional" />
                    </label>
                  </Fragment>
                ))}
              </div>
            </div>
          </fieldset>
        ) : section.fields.length > 0 ? (
          <fieldset>
            <legend>{section.label}</legend>
            {sectionKey === "led" ? (
              <ProductLedSpecFields
                fields={section.fields.map((field) => {
                  const existingSpec = findSpec(field.names);

                  return {
                    existingId: existingSpec?.id ?? null,
                    inputType: field.inputType,
                    key: field.key,
                    label: field.label,
                    showUnit: field.showUnit,
                    unit: existingSpec?.unit ?? field.unit ?? "",
                    value: existingSpec?.attribute_value ?? ""
                  };
                })}
              />
            ) : (
              <div className="form-grid">
                {section.fields.map((field) => {
                  const existingSpec = findSpec(field.names);
                  const isChecked = ["yes", "true", "included", "1"].includes((existingSpec?.attribute_value ?? "").toLowerCase());

                  return (
                    <Fragment key={field.key}>
                      <input name="spec_fields" type="hidden" value={`${field.key}|${field.label}`} />
                      {existingSpec ? <input name={`spec_id_${field.key}`} type="hidden" value={existingSpec.id} /> : null}
                      {field.inputType === "checkbox" ? (
                        <label className="checkbox-label">
                          <input defaultChecked={isChecked} name={`spec_value_${field.key}`} type="checkbox" value="Yes" />
                          {field.label}
                        </label>
                      ) : field.showUnit !== false ? (
                        <label className="full-width-field">
                          {field.label}
                          <span className="spec-input-row">
                            <input defaultValue={existingSpec?.attribute_value ?? ""} name={`spec_value_${field.key}`} />
                            <input aria-label={`${field.label} unit`} defaultValue={existingSpec?.unit ?? field.unit ?? ""} name={`spec_unit_${field.key}`} />
                          </span>
                        </label>
                      ) : field.key === "suspension_system" ? (
                        <label>
                          {field.label}
                          <select defaultValue={existingSpec?.attribute_value ?? ""} name={`spec_value_${field.key}`}>
                            <option value="">Not set</option>
                            <option value="Standard">Standard - installed onto ceiling box</option>
                            <option value="Heavy Duty">Heavy Duty - mounted to building structure</option>
                          </select>
                        </label>
                      ) : (
                        <label>
                          {field.label}
                          <input defaultValue={existingSpec?.attribute_value ?? ""} name={`spec_value_${field.key}`} />
                        </label>
                      )}
                      {field.showUnit === false ? (
                        <input name={`spec_unit_${field.key}`} type="hidden" value="" />
                      ) : null}
                    </Fragment>
                  );
                })}
              </div>
            )}
          </fieldset>
        ) : null}

        {sectionKey === "hanging" && specSection !== "other" ? (
          <fieldset>
            <legend>Hanging Configuration</legend>
            <input name="include_hanging_config" type="hidden" value="yes" />
            <div className="form-grid">
              <label>
                Mounting Type
                <select defaultValue={product.hangingConfig?.mounting_type ?? ""} name="hanging_mounting_type">
                  <option value="">Not set</option>
                  <option value="Ceiling Mounted / Hardwired">Ceiling Mounted / Hardwired</option>
                  <option value="Chain Hung">Chain Hung</option>
                  <option value="Rod Hung">Rod Hung</option>
                  <option value="Cable Hung">Cable Hung</option>
                  <option value="Semi-Flush Mounted">Semi-Flush Mounted</option>
                  <option value="Flush Mounted">Flush Mounted</option>
                  <option value="Others">Others</option>
                </select>
              </label>
              <label>
                Wire Length
                <input defaultValue={product.hangingConfig?.wire_length ?? ""} name="hanging_wire_length" />
              </label>
              <label>
                Chain Length
                <input defaultValue={product.hangingConfig?.chain_length ?? ""} name="hanging_chain_length" />
              </label>
              <label>
                Rod Length / Sizes
                <input defaultValue={product.hangingConfig?.rod_length ?? ""} name="hanging_rod_length" />
              </label>
              <label>
                Canopy Detail
                <input defaultValue={product.hangingConfig?.canopy_detail ?? ""} name="hanging_canopy_detail" />
              </label>
              <label className="full-width-field">
                Hanging Notes
                <textarea defaultValue={product.hangingConfig?.notes ?? ""} name="hanging_notes" rows={4} />
              </label>
            </div>
          </fieldset>
        ) : null}

        <div className="form-actions">
          <button type="submit">Save Product Specs</button>
          <Link className="secondary-action secondary-action--light" href={`/?module=products&product=${product.id}&product_tab=specs`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function EditProductBoxesForm({
  error,
  productId
}: {
  error?: string;
  productId?: string;
}) {
  const product = productId ? await getProductDetail(productId) : null;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=products">
          Back to Product List
        </Link>
      </section>
    );
  }

  const normalizePackingSpecName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const packingSpecValue = (...names: string[]) => {
    const wantedNames = new Set(names.map(normalizePackingSpecName));
    const spec = product.specAttributes.find((item) => wantedNames.has(normalizePackingSpecName(item.attribute_name)));

    return spec?.attribute_value ?? "";
  };

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={`/?module=products&product=${product.id}&product_tab=packing`}>
            Packing / Boxes
          </Link>
          <div className="record-title-row">
            <h2>Edit Product Boxes</h2>
          </div>
          <p>{product.sku} / {product.name}</p>
        </div>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={updateProductBoxesAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />

        <fieldset>
          <legend>Packing Specification</legend>
          <div className="form-grid">
            <label>
              Cardboard Spec
              <input defaultValue={packingSpecValue("cardboard spec", "cardboard specification")} name="cardboard_spec" placeholder="Example: 150 LBS or 200 LBS" />
            </label>
            <label>
              Foam Density
              <input defaultValue={packingSpecValue("foam density")} name="foam_density" placeholder="Example: 8 kg or 12 kg" />
            </label>
          </div>
          <p className="fieldset-note">These packing standards can be provided to vendors/factories for production and packaging requirements.</p>
        </fieldset>

        <fieldset>
          <legend>Existing Boxes</legend>
          <div className="box-edit-list">
            {product.packingBoxes.length === 0 ? (
              <p className="fieldset-note">No active boxes yet. Use Add Box from the Packing / Boxes page.</p>
            ) : (
              product.packingBoxes.map((box) => (
                <section className="box-edit-panel" key={box.id}>
                  <div className="box-edit-header">
                    <div className="box-edit-title-row">
                      <strong>Box {box.box_sequence}</strong>
                      <label className="checkbox-label checkbox-label--box-header">
                        <input defaultChecked={box.is_required_for_sale} name={`is_required_for_sale_${box.id}`} type="checkbox" />
                        Required Box
                      </label>
                    </div>
                    <label className="checkbox-label checkbox-label--compact">
                      <input name="delete_box_ids" type="checkbox" value={box.id} />
                      Delete
                    </label>
                    <input name="box_ids" type="hidden" value={box.id} />
                  </div>
                  <div className="form-grid box-edit-grid">
                    <label className="box-field--label">
                      Label
                      <input defaultValue={box.box_label ?? ""} name={`box_label_${box.id}`} />
                    </label>
                    <label className="box-field--number">
                      L
                      <input defaultValue={box.box_length ?? ""} min={0} name={`box_length_${box.id}`} step="0.001" type="number" />
                    </label>
                    <label className="box-field--number">
                      W
                      <input defaultValue={box.box_width ?? ""} min={0} name={`box_width_${box.id}`} step="0.001" type="number" />
                    </label>
                    <label className="box-field--number">
                      H
                      <input defaultValue={box.box_height ?? ""} min={0} name={`box_height_${box.id}`} step="0.001" type="number" />
                    </label>
                    <label className="box-field--number">
                      Net lb
                      <input defaultValue={box.net_weight ?? ""} min={0} name={`net_weight_${box.id}`} step="0.001" type="number" />
                    </label>
                    <label className="box-field--number">
                      Gross lb
                      <input defaultValue={box.gross_weight ?? ""} min={0} name={`gross_weight_${box.id}`} step="0.001" type="number" />
                    </label>
                    <label className="box-field--notes">
                      Notes
                      <input defaultValue={box.notes ?? ""} name={`notes_${box.id}`} />
                    </label>
                  </div>
                </section>
              ))
            )}
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Save Product Boxes</button>
          <Link className="secondary-action secondary-action--light" href={`/?module=products&product=${product.id}&product_tab=packing`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function AddProductBoxForm({
  error,
  productId
}: {
  error?: string;
  productId?: string;
}) {
  const product = productId ? await getProductDetail(productId) : null;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=products">
          Back to Product List
        </Link>
      </section>
    );
  }

  const nextBoxSequence = product.packingBoxes.reduce((max, box) => Math.max(max, box.box_sequence), 0) + 1;

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={`/?module=products&product=${product.id}&product_tab=packing`}>
            Packing / Boxes
          </Link>
          <div className="record-title-row">
            <h2>Add Product Box</h2>
          </div>
          <p>{product.sku} / {product.name}</p>
        </div>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={addProductBoxAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />

        <fieldset>
          <legend>Box Information</legend>
          <div className="form-grid">
            <label>
              Box No.
              <input readOnly value={`Box ${nextBoxSequence} - generated by system`} />
            </label>
            <label>
              Label
              <input name="new_box_label" placeholder="Optional box label" />
            </label>
            <label>
              Length
              <input min={0} name="new_box_length" step="0.001" type="number" />
            </label>
            <label>
              Width
              <input min={0} name="new_box_width" step="0.001" type="number" />
            </label>
            <label>
              Height
              <input min={0} name="new_box_height" step="0.001" type="number" />
            </label>
            <label>
              Net lb
              <input min={0} name="new_net_weight" step="0.001" type="number" />
            </label>
            <label>
              Gross lb
              <input min={0} name="new_gross_weight" step="0.001" type="number" />
            </label>
            <label className="checkbox-label">
              <input defaultChecked name="new_is_required_for_sale" type="checkbox" />
              Required Box
            </label>
            <label className="full-width-field">
              Notes
              <textarea name="new_notes" rows={3} />
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Add Product Box</button>
          <Link className="secondary-action secondary-action--light" href={`/?module=products&product=${product.id}&product_tab=packing`}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function EditProductInventoryForm({
  error,
  productId,
  returnModule,
  warehouseLocationOptions,
  warehouseOptions
}: {
  error?: string;
  productId?: string;
  returnModule?: string;
  warehouseLocationOptions: WarehouseLocationOption[];
  warehouseOptions: SelectOption[];
}) {
  const product = productId ? await getProductDetail(productId) : null;
  const returnToPart = returnModule === "product-parts";
  const inventoryHref = returnToPart
    ? `/?module=product-parts&part=${productId}&product_tab=inventory`
    : `/?module=products&product=${productId}&product_tab=inventory`;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=products">
          Back to Product List
        </Link>
      </section>
    );
  }

  const warehouseSelect = (name: string, defaultValue?: string | null) => (
    <select defaultValue={defaultValue ?? ""} name={name}>
      <option value="">Not set</option>
      {warehouseOptions.map((warehouse) => (
        <option key={warehouse.id} value={warehouse.id}>
          {warehouse.name}
        </option>
      ))}
    </select>
  );

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={inventoryHref}>
            Inventory / Locations
          </Link>
          <div className="record-title-row">
            <h2>Edit Inventory / Locations</h2>
          </div>
          <p>{product.sku} / {product.name}</p>
        </div>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={updateProductInventoryAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        {returnToPart ? <input name="return_module" type="hidden" value="product-parts" /> : null}

        <fieldset>
          <legend>Top-Level Sellable Quantity</legend>
          <div className="form-grid">
            <label>
              Current Sellable Quantity
              <input readOnly value={numberFormatter.format(Number(product.sellable_quantity ?? 0))} />
            </label>
            <label>
              Set Sellable Quantity
              <input min={0} name="target_sellable_quantity" step={1} type="number" />
            </label>
          </div>
          <p className="fieldset-note">
            For products with required boxes, this updates each required box balance to the same quantity. Product-level inventory is recalculated from box balances.
          </p>
        </fieldset>

        <fieldset>
          <legend>Inventory Balances</legend>
          <div className="table-wrap">
            <table className="editable-table">
              <thead>
                <tr>
                  <th>Delete</th>
                  <th>Box</th>
                  <th>Warehouse</th>
                  <th>Bin</th>
                  <th>Condition</th>
                  <th>On Hand</th>
                  <th>Allocated</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {product.inventoryBalances.length === 0 ? (
                  <tr>
                    <td colSpan={8}>No inventory balances found. Use Set Sellable Quantity to create balances for required boxes.</td>
                  </tr>
                ) : (
                  product.inventoryBalances.map((balance) => {
                    const canDeleteBalance = balance.quantity_on_hand === 0 && balance.quantity_allocated === 0;

                    return (
                      <tr key={balance.id}>
                        <td>
                          {canDeleteBalance ? (
                            <label className="checkbox-label checkbox-label--compact">
                              <input name="delete_balance_ids" type="checkbox" value={balance.id} />
                              Delete
                            </label>
                          ) : (
                            "Locked"
                          )}
                        </td>
                        <td>
                          {balance.box_sequence ? `Box ${balance.box_sequence}${balance.box_label ? ` / ${balance.box_label}` : ""}` : "SKU balance"}
                          <input name="balance_ids" type="hidden" value={balance.id} />
                        </td>
                        <td>{warehouseSelect(`warehouse_id_${balance.id}`, balance.warehouse_id)}</td>
                        <td>
                          <input defaultValue={balance.location_code} list="inventory-location-codes" name={`location_code_${balance.id}`} />
                        </td>
                        <td>
                          <select defaultValue={balance.inventory_condition} name={`inventory_condition_${balance.id}`}>
                            <option value="regular">Regular</option>
                            <option value="to_be_inspected">To Be Inspected</option>
                            <option value="hold">Hold</option>
                            <option value="damaged">Damaged</option>
                            <option value="demolished_trash">Demolished / Trash</option>
                          </select>
                        </td>
                        <td>
                          <input defaultValue={Math.trunc(balance.quantity_on_hand)} min={0} name={`quantity_on_hand_${balance.id}`} step={1} type="number" />
                        </td>
                        <td>
                          <input defaultValue={Math.trunc(balance.quantity_allocated)} min={0} name={`quantity_allocated_${balance.id}`} step={1} type="number" />
                        </td>
                        <td>{numberFormatter.format(balance.quantity_available)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <datalist id="inventory-location-codes">
              {warehouseLocationOptions.map((location) => (
                <option key={location.id} value={location.name.split(" / ")[0]}>
                  {location.warehouse_name} / {location.name}
                </option>
              ))}
            </datalist>
          </div>
        </fieldset>

        <fieldset>
          <legend>Add Inventory Location</legend>
          <div className="form-grid">
            <label>
              Box
              <select name="new_product_packing_box_id">
                <option value="">SKU balance / no specific box</option>
                {product.packingBoxes.map((box) => (
                  <option key={box.id} value={box.id}>
                    Box {box.box_sequence}
                    {box.box_label ? ` / ${box.box_label}` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Warehouse
              {warehouseSelect("new_warehouse_id")}
            </label>
            <label>
              Bin
              <input list="inventory-location-codes" name="new_location_code" placeholder="Bin code" />
            </label>
            <label>
              Condition
              <select defaultValue="regular" name="new_inventory_condition">
                <option value="regular">Regular</option>
                <option value="to_be_inspected">To Be Inspected</option>
                <option value="hold">Hold</option>
                <option value="damaged">Damaged</option>
                <option value="demolished_trash">Demolished / Trash</option>
              </select>
            </label>
            <label>
              On Hand
              <input min={0} name="new_quantity_on_hand" step={1} type="number" />
            </label>
            <label>
              Allocated
              <input defaultValue={0} min={0} name="new_quantity_allocated" step={1} type="number" />
            </label>
          </div>
          <p className="fieldset-note">
            Use this when restocked inventory is stored in an additional warehouse/bin location after receiving or putaway.
          </p>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Save Inventory / Locations</button>
          <Link className="secondary-action secondary-action--light" href={inventoryHref}>
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

function ProductPartsListOverview({
  page,
  pageSize,
  parts,
  query,
  totalCount,
  totalPages
}: {
  page: number;
  pageSize: number;
  parts: AccessoryPartListItem[];
  query: string;
  totalCount: number;
  totalPages: number;
}) {
  const buildProductPartsParams = (overrides: Record<string, string | number | undefined> = {}) => {
    const searchParams = new URLSearchParams({ module: "product-parts" });

    if (query) {
      searchParams.set("q", query);
    }

    searchParams.set("product_page", String(page));
    searchParams.set("product_page_size", String(pageSize));

    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        searchParams.delete(key);
      } else {
        searchParams.set(key, String(value));
      }
    });

    return `/?${searchParams.toString()}`;
  };

  const startRow = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalCount);
  const visiblePageNumbers = Array.from(
    new Set([1, 2, 3, page - 1, page, page + 1, totalPages].filter((value) => value >= 1 && value <= totalPages))
  ).sort((a, b) => a - b);

  return (
    <section className="dashboard-panel">
      <section className="list-header-panel">
        <span>{numberFormatter.format(totalCount)} parts</span>
        <div className="list-actions">
          <Link className="primary-action" href="/?module=edit-product-parts&part_action=add">
            Add Part
          </Link>
        </div>
      </section>

      <form action="/" className="list-search-form">
        <input name="module" type="hidden" value="product-parts" />
        <input name="product_page" type="hidden" value="1" />
        <label htmlFor="product-part-search">Search parts</label>
        <div className="product-list-controls">
          <label className="inline-select-label">
            Per Page
            <select defaultValue={pageSize} name="product_page_size">
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <div className="list-search-row">
            <input
              autoComplete="off"
              defaultValue={query}
              id="product-part-search"
              name="q"
              placeholder="Part SKU, part name, parent SKU"
              type="search"
            />
            <button type="submit">Search</button>
          </div>
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Part SKU</th>
              <th>Part Name</th>
              <th>Brand</th>
              <th>Parent SKU(s)</th>
              <th>Parent Product(s)</th>
              <th>Inventory</th>
              <th>ETA</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {parts.length === 0 ? (
              <tr>
                <td colSpan={9}>No parts found.</td>
              </tr>
            ) : (
              parts.map((part) => (
                <tr key={part.id}>
                  <td>
                    <Link className="table-link" href={`/?module=product-parts&part=${part.id}`}>
                      {part.sku}
                    </Link>
                  </td>
                  <td>{part.name}</td>
                  <td>{part.brand_name}</td>
                  <td>
                    {part.parent_products.length === 0
                      ? "Generic"
                      : part.parent_products.map((parent, index) => (
                          <span key={parent.id}>
                            {index > 0 ? ", " : null}
                            <Link className="table-link" href={`/?module=products&product=${parent.id}`}>
                              {parent.sku}
                            </Link>
                          </span>
                        ))}
                  </td>
                  <td>
                    {part.parent_products.length === 0
                      ? "Generic part"
                      : part.parent_products.map((parent) => (
                          <div className="stacked-detail" key={parent.id}>
                            <span>{parent.name}</span>
                            <small>
                              {parent.part_name ? `${parent.part_name} / ` : ""}
                              {parent.part_role ? label(parent.part_role) : "Role not set"}
                            </small>
                          </div>
                        ))}
                  </td>
                  <td>
                    <div className="inventory-cell">
                      <strong>{numberFormatter.format(Number(part.sellable_quantity ?? 0))}</strong>
                      <span>{Number(part.sellable_quantity ?? 0) > 0 ? "Available" : "Out of stock"}</span>
                    </div>
                  </td>
                  <td>
                    {Number(part.sellable_quantity ?? 0) > 0
                      ? "In stock"
                      : part.next_incoming_eta
                        ? `${dateLabel(part.next_incoming_eta)} (${numberFormatter.format(Number(part.incoming_quantity ?? 0))})`
                        : "No ETA"}
                  </td>
                  <td>{money(part.default_price)}</td>
                  <td>
                    <div className="badge-row">
                      <StatusBadge tone={part.status === "active" ? "good" : "warn"} value={part.status} />
                      <StatusBadge value={part.sellability_status} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={9}>
                <div className="pagination-footer">
                  <span>
                    Showing {numberFormatter.format(startRow)}-{numberFormatter.format(endRow)} of {numberFormatter.format(totalCount)} parts
                  </span>
                  <nav className="pagination-nav" aria-label="Product parts pages">
                    <Link aria-disabled={page <= 1} className="pagination-link" href={buildProductPartsParams({ product_page: 1 })}>
                      First
                    </Link>
                    <Link
                      aria-disabled={page <= 1}
                      className="pagination-link"
                      href={buildProductPartsParams({ product_page: Math.max(1, page - 1) })}
                    >
                      Previous
                    </Link>
                    {visiblePageNumbers.map((pageNumber, index) => (
                      <span className="pagination-page-wrap" key={pageNumber}>
                        {index > 0 && pageNumber - visiblePageNumbers[index - 1] > 1 ? <span className="pagination-ellipsis">...</span> : null}
                        {pageNumber === page ? (
                          <span aria-current="page" className="pagination-current">
                            {pageNumber}
                          </span>
                        ) : (
                          <Link className="pagination-link" href={buildProductPartsParams({ product_page: pageNumber })}>
                            {pageNumber}
                          </Link>
                        )}
                      </span>
                    ))}
                    <Link
                      aria-disabled={page >= totalPages}
                      className="pagination-link"
                      href={buildProductPartsParams({ product_page: Math.min(totalPages, page + 1) })}
                    >
                      Next
                    </Link>
                    <Link
                      aria-disabled={page >= totalPages}
                      className="pagination-link"
                      href={buildProductPartsParams({ product_page: totalPages })}
                    >
                      Last
                    </Link>
                  </nav>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}

export default async function Home({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const activeModule = params.module ?? "customers";
  const query = params.q ?? "";
  const productFilters: ProductSearchFilters = {
    brandId: params.product_brand,
    categoryId: params.product_category,
    eligibility: params.product_eligibility,
    finishId: params.product_finish,
    lightCount: params.product_lights,
    status: params.product_status,
    styleId: params.product_style
  };
  const requestedProductPage = Math.max(1, Number(params.product_page ?? 1) || 1);
  const requestedProductPageSize = [10, 25, 50, 100].includes(Number(params.product_page_size))
    ? Number(params.product_page_size)
    : 10;
  const customerListMode = activeModule === "obsolete-customers" ? "obsolete" : "active";
  const customers = await searchCustomers(query, customerListMode);
  const selectedProductId = activeModule === "products" ? params.product : undefined;
  const selectedPartId = activeModule === "product-parts" ? params.part : undefined;
  const productListMode = activeModule === "discontinued-products" ? "discontinued" : "active";
  const productSearchResult =
    (activeModule === "products" && !selectedProductId) || activeModule === "discontinued-products"
      ? await searchProducts(query, productFilters, requestedProductPage, requestedProductPageSize, productListMode)
      : { items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 1 };
  const productDetail = selectedProductId ? await getProductDetail(selectedProductId) : null;
  const partDetail = selectedPartId ? await getProductDetail(selectedPartId) : null;
  const productPartSearchResult =
    activeModule === "product-parts" && !selectedPartId
      ? await searchProductParts(query, requestedProductPage, requestedProductPageSize)
      : { items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 1 };
  const selectedCustomerId = activeModule === "customers" ? params.customer : undefined;
  const [
    accountTypeOptions,
    businessTypeOptions,
    territoryOptions,
    salesRepOptions,
    productBrandOptions,
    productStyleOptions,
    productCategoryOptions,
    finishOptions,
    warehouseOptions,
    warehouseLocationOptions
  ] = await Promise.all([
      getCustomerOptions("customer_account_type"),
      getCustomerOptions("customer_business_type"),
      getTerritoryOptions(),
      getSalesRepOptions(),
      getProductBrandOptions(),
      getProductStyleOptions(),
      getProductCategoryOptions(),
      getFinishOptions(),
      getWarehouseOptions(),
      getWarehouseLocationOptions()
    ]);
  const accountTypes = toLookup(accountTypeOptions);
  const businessTypes = toLookup(businessTypeOptions);
  const dashboard = selectedCustomerId ? await getCustomerDashboard(selectedCustomerId) : null;
  const moduleLabels: Record<string, string> = {
    admin: "Admin",
    "add-contact": "Add Contact",
    "add-customer": "Add Customer",
    "add-location": "Add Location",
    "add-product-box": "Add Product Box",
    ar: "Payments / AR",
    customers: "Customers",
    "discontinued-products": "Discontinued Products",
    "edit-account-profile": "Edit Account Profile",
    "edit-billing-credit": "Edit Billing / Credit",
    "edit-contact": "Edit Contact",
    "edit-freight": "Edit Freight",
    "edit-location": "Edit Location",
    "edit-product-boxes": "Edit Product Boxes",
    "edit-product-description": "Edit Product Description",
    "edit-product-images": "Edit Product Images",
    "edit-product-inventory": "Edit Inventory / Locations",
    "edit-product-parts": "Edit Product Parts",
    "edit-product-vendors": "Edit Product Vendors",
    "edit-part-parents": "Add Parent Products",
    "edit-product-pricing-finishes": "Edit Product Pricing / Finishes",
    "edit-product-profile": "Edit Product Profile",
    "edit-product-specs": "Edit Product Specs",
    inventory: "Inventory / Locations",
    invoices: "Invoices",
    orders: "Orders",
    "obsolete-customers": "Obsolete Accounts",
    "product-parts": "Parts",
    products: "Products",
    purchasing: "Purchasing",
    reports: "Reports",
    rga: "RGA",
    "sales-rep-agency": "Sales Rep Agency",
    shipping: "Shipping",
    "view-contact": "Contact",
    "view-location": "Location"
  };
  const moduleNavEntries = Object.entries(moduleLabels).filter(
    ([moduleKey]) =>
      ![
        "add-customer",
        "add-contact",
        "add-location",
        "add-product-box",
        "edit-account-profile",
        "edit-billing-credit",
        "edit-contact",
        "edit-freight",
        "edit-location",
        "edit-product-boxes",
        "edit-product-description",
        "edit-product-images",
        "edit-product-inventory",
        "edit-product-parts",
        "edit-product-vendors",
        "edit-part-parents",
        "edit-product-pricing-finishes",
        "edit-product-profile",
        "edit-product-specs",
        "discontinued-products",
        "obsolete-customers",
        "product-parts",
        "sales-rep-agency",
        "view-contact",
        "view-location"
      ].includes(moduleKey)
  );
  const workspaceHeader =
    activeModule === "discontinued-products"
      ? { eyebrow: "Product Master", title: "Discontinued / Deleted Products" }
    : selectedPartId
      ? { eyebrow: "Product Master", title: "Part Detail" }
      : activeModule === "product-parts"
      ? { eyebrow: "Product Master", title: "Parts Search / Parts List" }
      : selectedProductId
      ? { eyebrow: "Product Master", title: "Product Detail" }
      : activeModule === "products"
      ? { eyebrow: "Product Master", title: "Product Search / Product List" }
      : activeModule === "customers" || activeModule === "obsolete-customers"
        ? { eyebrow: "Customer Master", title: "Customer Search / Account Dashboard" }
        : { eyebrow: "Lighting ERP", title: moduleLabels[activeModule] ?? label(activeModule) };

  const openOrders = dashboard?.orders.filter((order) => order.status !== "closed" && order.status !== "deleted") ?? [];
  const ordersTotal = dashboard?.orders.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0) ?? 0;
  const openInvoiceCount = dashboard?.invoices.filter((invoice) => invoice.invoice_status !== "void").length ?? 0;
  const openBalance = dashboard?.invoices.reduce((sum, invoice) => sum + Number(invoice.balance_due ?? 0), 0) ?? 0;
  const uninvoicedPackingLists =
    dashboard?.packingLists.filter((packingList) => packingList.invoice_generation_status_snapshot === "not_invoiced").length ?? 0;
  const primaryShowroomLocationIds = new Set(dashboard?.primaryShowrooms.map((showroom) => showroom.customer_location_id) ?? []);
  const customerDashboardTabs = [
    { key: "overview", label: "Overview" },
    { key: "locations", label: "Locations" },
    { key: "contacts", label: "Contacts" },
    { key: "sales-rep", label: "Sales Rep" },
    { key: "freight", label: "Freight" },
    { key: "orders", label: "Orders" },
    { key: "shipments", label: "Shipments" },
    { key: "invoices", label: "Invoices" },
    { key: "credit-memo", label: "Credit Memo" },
    { key: "rga", label: "RGA" },
    { key: "attachments", label: "Attachments" },
    { key: "performance", label: "Performance" }
  ];
  const selectedCustomerTab = customerDashboardTabs.some((tab) => tab.key === params.tab) ? params.tab : "overview";
  const customerTabHref = (tabKey: string) => {
    const search = new URLSearchParams({ customer: dashboard?.customer.id ?? "", tab: tabKey });

    if (query) {
      search.set("q", query);
    }

    return `/?${search.toString()}`;
  };

  return (
    <main className="erp-shell">
      <aside className="erp-sidebar">
        <div className="brand-lockup">
          <span className="brand-mark">TD</span>
          <div>
            <strong>Lighting ERP</strong>
            <span>Phase 1</span>
          </div>
        </div>

        <nav className="module-nav" aria-label="ERP modules">
          {moduleNavEntries.map(([moduleKey, moduleLabel]) => (
            <div className="nav-group" key={moduleKey}>
              <Link
                aria-current={activeModule === moduleKey ? "page" : undefined}
                href={moduleKey === "customers" ? "/" : `/?module=${moduleKey}`}
              >
                {moduleLabel}
              </Link>
              {moduleKey === "customers" ? (
                <div className="submenu-block">
                  <Link aria-current={activeModule === "add-customer" ? "page" : undefined} href="/?module=add-customer">
                    Add Customer
                  </Link>
                  <Link
                    aria-current={activeModule === "obsolete-customers" ? "page" : undefined}
                    href="/?module=obsolete-customers"
                  >
                    Obsolete Accounts
                  </Link>
                </div>
              ) : null}
              {moduleKey === "products" ? (
                <div className="submenu-block">
                  <Link aria-current={activeModule === "products" && !params.product_brand ? "page" : undefined} href="/?module=products">
                    All Products
                  </Link>
                  {productBrandOptions.map((brand) => (
                    <Link
                      aria-current={activeModule === "products" && params.product_brand === brand.id ? "page" : undefined}
                      href={`/?module=products&product_brand=${brand.id}`}
                      key={brand.id}
                    >
                      {brand.name}
                    </Link>
                  ))}
                  <Link aria-current={activeModule === "product-parts" ? "page" : undefined} href="/?module=product-parts">
                    Parts
                  </Link>
                  <Link
                    aria-current={activeModule === "discontinued-products" ? "page" : undefined}
                    href="/?module=discontinued-products"
                  >
                    Discontinued
                  </Link>
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </aside>

      <section className="erp-workspace" id="customers">
        <header className="workspace-header">
          <div>
            <span className="eyebrow">{workspaceHeader.eyebrow}</span>
            <h1>{workspaceHeader.title}</h1>
          </div>
        </header>

        {activeModule === "add-customer" ? (
          <AddCustomerForm
            accountTypeOptions={accountTypeOptions}
            businessTypeOptions={businessTypeOptions}
            error={params.error}
            salesRepOptions={salesRepOptions}
            territoryOptions={territoryOptions}
          />
        ) : activeModule === "edit-account-profile" ? (
          <EditAccountProfileForm
            accountTypeOptions={accountTypeOptions}
            businessTypeOptions={businessTypeOptions}
            customerId={params.customer}
            error={params.error}
          />
        ) : activeModule === "edit-billing-credit" ? (
          <EditBillingCreditForm customerId={params.customer} error={params.error} />
        ) : activeModule === "add-contact" ? (
          <AddContactForm customerId={params.customer} error={params.error} />
        ) : activeModule === "add-location" ? (
          <AddLocationForm customerId={params.customer} error={params.error} />
        ) : activeModule === "view-contact" ? (
          <ContactInfoPage contactId={params.contact} customerId={params.customer} />
        ) : activeModule === "edit-contact" ? (
          <EditContactForm contactId={params.contact} customerId={params.customer} error={params.error} />
        ) : activeModule === "view-location" ? (
          <LocationInfoPage customerId={params.customer} locationId={params.location} />
        ) : activeModule === "edit-location" ? (
          <EditLocationForm customerId={params.customer} error={params.error} locationId={params.location} />
        ) : activeModule === "edit-freight" ? (
          <EditFreightForm customerId={params.customer} error={params.error} />
        ) : activeModule === "sales-rep-agency" ? (
          <SalesRepAgencyPage agencyId={params.agency} />
        ) : selectedPartId ? (
          <PartDetailDashboard part={partDetail} selectedTab={params.product_tab ?? "profile"} />
        ) : selectedProductId ? (
          <ProductDetailDashboard product={productDetail} selectedTab={params.product_tab ?? "profile"} />
        ) : activeModule === "edit-product-profile" ? (
          <EditProductProfileForm
            brandOptions={productBrandOptions}
            categoryOptions={productCategoryOptions}
            error={params.error}
            productId={params.product}
            styleOptions={productStyleOptions}
          />
        ) : activeModule === "edit-product-specs" ? (
          <EditProductSpecsForm error={params.error} productId={params.product} specSection={params.spec_section ?? "dimensions"} />
        ) : activeModule === "edit-product-boxes" ? (
          <EditProductBoxesForm error={params.error} productId={params.product} />
        ) : activeModule === "add-product-box" ? (
          <AddProductBoxForm error={params.error} productId={params.product} />
        ) : activeModule === "edit-product-inventory" ? (
          <EditProductInventoryForm
            error={params.error}
            productId={params.product}
            returnModule={params.return_module}
            warehouseLocationOptions={warehouseLocationOptions}
            warehouseOptions={warehouseOptions}
          />
        ) : activeModule === "edit-product-images" ? (
          <EditProductImagesForm
            error={params.error}
            imageCategory={params.image_category}
            notice={params.notice}
            productId={params.product}
            returnModule={params.return_module}
          />
        ) : activeModule === "edit-product-parts" ? (
          <EditProductPartsForm
            error={params.error}
            partAction={params.part_action}
            productId={params.product}
            selectedParts={params.selected_parts}
          />
        ) : activeModule === "edit-product-vendors" ? (
          <EditProductVendorsForm
            error={params.error}
            productId={params.product}
            selectedVendorProducts={params.selected_vendor_products}
            vendorAction={params.vendor_action}
          />
        ) : activeModule === "edit-part-parents" ? (
          <AddPartParentProductsForm error={params.error} partId={params.part} />
        ) : activeModule.startsWith("edit-product-") ? (
          <ProductEditPlaceholder moduleName={moduleLabels[activeModule] ?? label(activeModule)} productId={params.product} />
        ) : activeModule === "products" || activeModule === "discontinued-products" ? (
          <ProductListOverview
            brandOptions={productBrandOptions}
            categoryOptions={productCategoryOptions}
            error={params.error}
            filters={productFilters}
            finishOptions={finishOptions}
            listMode={productListMode}
            notice={params.notice}
            page={productSearchResult.page}
            pageSize={productSearchResult.pageSize}
            products={productSearchResult.items}
            query={query}
            showAdvanced={params.advanced === "1"}
            styleOptions={productStyleOptions}
            totalCount={productSearchResult.totalCount}
            totalPages={productSearchResult.totalPages}
          />
        ) : activeModule === "product-parts" ? (
          <ProductPartsListOverview
            page={productPartSearchResult.page}
            pageSize={productPartSearchResult.pageSize}
            parts={productPartSearchResult.items}
            query={query}
            totalCount={productPartSearchResult.totalCount}
            totalPages={productPartSearchResult.totalPages}
          />
        ) : activeModule !== "customers" && activeModule !== "obsolete-customers" ? (
          <ModulePlaceholder moduleName={moduleLabels[activeModule] ?? label(activeModule)} />
        ) : (
          <section className="customer-layout">
            {!dashboard ? (
              <CustomerListOverview
                accountTypes={accountTypes}
                businessTypes={businessTypes}
                customers={customers}
                error={params.error}
                listMode={customerListMode}
                notice={params.notice}
                query={query}
              />
            ) : (
              <section className="dashboard-panel">
                <section className="account-header">
                  <div>
                    <div className="header-line">
                      <h2>{dashboard.customer.name}</h2>
                      <StatusBadge tone={dashboard.customer.status === "active" ? "good" : "warn"} value={dashboard.customer.status} />
                    </div>
                    <Link className="text-action" href={query ? `/?q=${encodeURIComponent(query)}` : "/"}>
                      Back to Customer List
                    </Link>
                  </div>
                  <div className="account-header-side">
                    <button className="primary-action" type="button">
                      Enter New Order
                    </button>
                    <div className="account-numbers">
                      <span>Account No. {dashboard.customer.account_number}</span>
                      {dashboard.customer.legacy_account_id ? (
                        <span className="legacy-account-number">Legacy Account No. {dashboard.customer.legacy_account_id}</span>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section className="metric-grid">
                  <Metric labelText="Open Orders" value={numberFormatter.format(openOrders.length)} />
                  <Metric labelText="Recent Order Total" value={money(ordersTotal)} />
                  <Metric labelText="Open Invoices" value={numberFormatter.format(openInvoiceCount)} />
                  <Metric labelText="Open Balance" value={money(openBalance)} />
                  <Metric labelText="Un-invoiced Packing Lists" value={numberFormatter.format(uninvoicedPackingLists)} />
                </section>

                <section className="tab-strip" aria-label="Customer dashboard sections">
                  {customerDashboardTabs.map((tab) => (
                    <Link
                      aria-current={selectedCustomerTab === tab.key ? "page" : undefined}
                      href={customerTabHref(tab.key)}
                      key={tab.key}
                    >
                      {tab.label}
                    </Link>
                  ))}
                </section>

                <section className="section-stack">
                  <article className={selectedCustomerTab === "overview" ? "data-section" : "data-section tab-panel-hidden"} id="overview">
                    <div className="section-title">
                      <h3>Overview</h3>
                    </div>
                    <section className="detail-grid detail-grid--inside">
                      <article className="info-panel">
                        <div className="panel-title-row">
                          <h3>Account Profile</h3>
                          <Link className="text-action" href={`/?module=edit-account-profile&customer=${dashboard.customer.id}`}>
                            Edit
                          </Link>
                        </div>
                        <dl>
                          <div>
                            <dt>Account Type</dt>
                            <dd>{accountTypes[dashboard.customer.account_type_id] ?? "Not set"}</dd>
                          </div>
                          <div>
                            <dt>Business Type</dt>
                            <dd>{businessTypes[dashboard.customer.business_type_id] ?? "Not set"}</dd>
                          </div>
                          <div>
                            <dt>Default Discount</dt>
                            <dd>{dashboard.customer.default_discount_percent}%</dd>
                          </div>
                          <div>
                            <dt>Sales Tax</dt>
                            <dd>{dashboard.customer.is_sales_tax_exempt ? "Exempt" : "Taxable"}</dd>
                          </div>
                        </dl>
                      </article>

                      <article className="info-panel">
                        <div className="panel-title-row">
                          <h3>Billing / Credit</h3>
                          <Link className="text-action" href={`/?module=edit-billing-credit&customer=${dashboard.customer.id}`}>
                            Edit
                          </Link>
                        </div>
                        <dl>
                          <div>
                            <dt>Payment Terms</dt>
                            <dd>{dashboard.billing?.payment_terms ?? "Not set"}</dd>
                          </div>
                          <div>
                            <dt>Credit Limit</dt>
                            <dd>{dashboard.billing?.credit_limit ? money(dashboard.billing.credit_limit) : "System default"}</dd>
                          </div>
                          <div>
                            <dt>Limit Source</dt>
                            <dd>{label(dashboard.billing?.credit_limit_source)}</dd>
                          </div>
                          <div>
                            <dt>Invoice Email</dt>
                            <dd>{dashboard.billing?.default_statement_email ?? dashboard.customer.billing_email ?? "Not set"}</dd>
                          </div>
                        </dl>
                      </article>
                    </section>
                  </article>

                  <article className={selectedCustomerTab === "locations" ? "data-section" : "data-section tab-panel-hidden"} id="locations">
                    <div className="section-title">
                      <h3>Locations</h3>
                      <div className="section-actions">
                        <span>{dashboard.locations.length}</span>
                        <Link className="small-action" href={`/?module=add-location&customer=${dashboard.customer.id}`}>
                          Add Location
                        </Link>
                      </div>
                    </div>
                    <div className="location-grid">
                      {dashboard.locations.map((location) => (
                        <div className="location-row" key={location.id}>
                          <div>
                            <Link
                              className="location-link"
                              href={`/?module=view-location&customer=${dashboard.customer.id}&location=${location.id}`}
                            >
                              {location.location_name}
                            </Link>
                            <span>
                              {[location.city, location.state_province, location.country_code].filter(Boolean).join(", ")}
                            </span>
                          </div>
                          <div className="badge-row">
                            {location.is_default_ship_to ? <StatusBadge tone="good" value="Default Ship-to" /> : null}
                            {primaryShowroomLocationIds.has(location.id) ? (
                              <StatusBadge tone="primary" value="Primary Showroom" />
                            ) : null}
                            {location.is_shipping_address ? <StatusBadge value="Shipping Address" /> : null}
                            {location.is_billing_address ? <StatusBadge value="Billing Address" /> : null}
                            {location.is_showroom ? <StatusBadge value="Showroom" /> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className={selectedCustomerTab === "contacts" ? "data-section" : "data-section tab-panel-hidden"} id="contacts">
                    <div className="section-title">
                      <h3>Contacts</h3>
                      <div className="section-actions">
                        <span>{dashboard.contacts.length}</span>
                        <Link className="small-action" href={`/?module=add-contact&customer=${dashboard.customer.id}`}>
                          Add Contact
                        </Link>
                      </div>
                    </div>
                    <div className="compact-list">
                      {dashboard.contacts.length === 0 ? <EmptyState text="No contacts on this account yet." /> : null}
                      {dashboard.contacts.map((contact) => (
                        <div className="compact-row" key={contact.id}>
                          <div>
                            <Link
                              className="record-link"
                              href={`/?module=view-contact&customer=${dashboard.customer.id}&contact=${contact.id}`}
                            >
                              {contact.name}
                            </Link>
                            <span>{[contact.title, contact.department].filter(Boolean).join(" / ") || "Contact"}</span>
                          </div>
                          <span>{contact.email ?? "No email"}</span>
                          <div className="badge-row">
                            {contact.is_purchasing_contact ? <StatusBadge value="Purchasing" /> : null}
                            {contact.is_billing_contact ? <StatusBadge value="Billing" /> : null}
                            {contact.is_warehouse_receiver ? <StatusBadge value="Warehouse Receiver" /> : null}
                            {contact.is_showroom_floor_sales ? <StatusBadge value="Showroom Floor Sales" /> : null}
                            {contact.is_showroom_manager ? <StatusBadge value="Showroom Manager" /> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className={selectedCustomerTab === "sales-rep" ? "data-section" : "data-section tab-panel-hidden"} id="sales-rep">
                    <div className="section-title">
                      <h3>Sales Rep</h3>
                      <span>{dashboard.salesRepAssignments.length}</span>
                    </div>
                    <div className="compact-list">
                      {dashboard.salesRepAssignments.length === 0 ? (
                        <EmptyState text="No sales rep agency or rep assignment for this customer yet." />
                      ) : null}
                      {dashboard.salesRepAssignments.map((assignment) => (
                        <div className="compact-row" key={assignment.id}>
                          <div>
                            <Link
                              className="record-link"
                              href={`/?module=sales-rep-agency&agency=${assignment.sales_rep_agency_id}`}
                            >
                              {assignment.agency_name}
                            </Link>
                            <span>{assignment.location_name}</span>
                          </div>
                          <span>{assignment.sales_rep_name ?? "No individual rep assigned"}</span>
                          <div className="badge-row">
                            {assignment.territory_name ? <StatusBadge value={assignment.territory_name} /> : null}
                            <StatusBadge value={assignment.coverage_role} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className={selectedCustomerTab === "orders" ? "data-section" : "data-section tab-panel-hidden"} id="orders">
                    <div className="section-title">
                      <h3>Recent Orders</h3>
                      <span>{dashboard.orders.length}</span>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>SO No.</th>
                            <th>Customer PO</th>
                            <th>Date</th>
                            <th>Source</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboard.orders.map((order) => (
                            <tr key={order.id}>
                              <td>{order.sales_order_number}</td>
                              <td>{order.customer_po_number}</td>
                              <td>{dateLabel(order.order_date)}</td>
                              <td>{label(order.order_source)}</td>
                              <td>{label(order.order_type)}</td>
                              <td>
                                <StatusBadge tone={order.credit_hold_status === "none" ? "good" : "warn"} value={order.status} />
                              </td>
                              <td>{money(order.total_amount)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>

                  <article className={selectedCustomerTab === "shipments" ? "data-section" : "data-section tab-panel-hidden"} id="shipments">
                    <div className="section-title">
                      <h3>Packing Lists / Shipment Work</h3>
                      <span>{dashboard.packingLists.length}</span>
                    </div>
                    <div className="compact-list">
                      {dashboard.packingLists.length === 0 ? <EmptyState text="No packing lists for this customer yet." /> : null}
                      {dashboard.packingLists.map((packingList) => (
                        <div className="compact-row" key={packingList.id}>
                          <div>
                            <strong>{packingList.packing_list_number}</strong>
                            <span>PO {packingList.customer_po_number_snapshot}</span>
                          </div>
                          <span>{label(packingList.invoice_generation_status_snapshot)}</span>
                          <span>{money(packingList.shipping_fee)}</span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className={selectedCustomerTab === "invoices" ? "data-section" : "data-section tab-panel-hidden"} id="invoices">
                    <div className="section-title">
                      <h3>Invoices</h3>
                      <span>{dashboard.invoices.length}</span>
                    </div>
                    <div className="compact-list">
                      {dashboard.invoices.length === 0 ? <EmptyState text="No invoices have been generated for this customer yet." /> : null}
                      {dashboard.invoices.map((invoice) => (
                        <div className="compact-row" key={invoice.id}>
                          <div>
                            <strong>{invoice.invoice_number}</strong>
                            <span>{invoice.brand_name_snapshot}</span>
                          </div>
                          <span>{dateLabel(invoice.invoice_date)}</span>
                          <span>{money(invoice.balance_due)}</span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className={selectedCustomerTab === "credit-memo" ? "data-section" : "data-section tab-panel-hidden"} id="credit-memo">
                    <div className="section-title">
                      <h3>Credit Memo</h3>
                      <span>{dashboard.creditMemos.length}</span>
                    </div>
                    <div className="table-wrap">
                      {dashboard.creditMemos.length === 0 ? <EmptyState text="No credit memos for this customer yet." /> : null}
                      {dashboard.creditMemos.length > 0 ? (
                        <table>
                          <thead>
                            <tr>
                              <th>Credit Memo No.</th>
                              <th>Brand</th>
                              <th>Issue Date</th>
                              <th>Reason</th>
                              <th>Status</th>
                              <th>Total</th>
                              <th>Remaining</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboard.creditMemos.map((creditMemo) => (
                              <tr key={creditMemo.id}>
                                <td>{creditMemo.credit_memo_number}</td>
                                <td>{creditMemo.brand_name_snapshot}</td>
                                <td>{dateLabel(creditMemo.issue_date)}</td>
                                <td>{label(creditMemo.reason_code)}</td>
                                <td>
                                  <StatusBadge value={creditMemo.status} />
                                </td>
                                <td>{money(creditMemo.total_credit_amount)}</td>
                                <td>{money(creditMemo.amount_remaining)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : null}
                    </div>
                  </article>

                  <article className={selectedCustomerTab === "rga" ? "data-section" : "data-section tab-panel-hidden"} id="rga">
                    <div className="section-title">
                      <h3>RGA</h3>
                      <span>{dashboard.rgas.length}</span>
                    </div>
                    <div className="compact-list">
                      {dashboard.rgas.length === 0 ? <EmptyState text="No RGA activity for this customer yet." /> : null}
                      {dashboard.rgas.map((rga) => (
                        <div className="compact-row" key={rga.id}>
                          <div>
                            <strong>{rga.rga_number}</strong>
                            <span>{dateLabel(rga.request_date)}</span>
                          </div>
                          <span>{label(rga.requested_resolution_type)}</span>
                          <StatusBadge value={rga.status} />
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className={selectedCustomerTab === "attachments" ? "data-section" : "data-section tab-panel-hidden"} id="attachments">
                    <div className="section-title">
                      <h3>Attachments</h3>
                      <span>{dashboard.attachments.length}</span>
                    </div>
                    <form action={uploadCustomerAttachmentAction} className="attachment-upload-form">
                      <input name="customer_id" type="hidden" value={dashboard.customer.id} />
                      <label>
                        Document
                        <input name="attachment_file" required type="file" />
                      </label>
                      <label>
                        Category
                        <select name="category" defaultValue="account_document">
                          <option value="account_document">Account Document</option>
                          <option value="resale_certificate">Resale Certificate</option>
                          <option value="agreement">Agreement</option>
                          <option value="credit_application">Credit Application</option>
                          <option value="other">Other</option>
                        </select>
                      </label>
                      <button className="small-action" type="submit">
                        Upload
                      </button>
                    </form>
                    <div className="compact-list">
                      {dashboard.attachments.length === 0 ? <EmptyState text="No account attachments uploaded yet." /> : null}
                      {dashboard.attachments.map((attachment) => (
                        <div className="compact-row" key={attachment.id}>
                          <div>
                            <strong>{attachment.original_file_name}</strong>
                            <span>{label(attachment.category)}</span>
                          </div>
                          <span>{fileSizeLabel(attachment.file_size)}</span>
                          <span>{dateLabel(attachment.uploaded_at.slice(0, 10))}</span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className={selectedCustomerTab === "freight" ? "data-section" : "data-section tab-panel-hidden"} id="freight">
                    <div className="section-title">
                      <h3>Freight</h3>
                      <div className="section-actions">
                        <span>{dashboard.freightPolicies.length}</span>
                        <Link className="small-action" href={`/?module=edit-freight&customer=${dashboard.customer.id}`}>
                          Edit Freight
                        </Link>
                      </div>
                    </div>
                    <div className="compact-list">
                      {dashboard.freightPolicies.map((policy) => (
                        <div className="compact-row" key={`${policy.policy_name}-${policy.freight_terms ?? policy.ltl_freight_terms}`}>
                          <div>
                            <strong>{policy.policy_name}</strong>
                            <span>{label(policy.freight_terms ?? policy.ltl_freight_terms)}</span>
                          </div>
                          <span>FFA {policy.freight_allowance_amount ? money(policy.freight_allowance_amount) : "Not set"}</span>
                          <span>{policy.flat_rate_percent ? `${policy.flat_rate_percent}% Flat Rate` : "No flat rate"}</span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article
                    className={selectedCustomerTab === "performance" ? "data-section" : "data-section tab-panel-hidden"}
                    id="performance"
                  >
                    <div className="section-title">
                      <h3>Performance</h3>
                    </div>
                    <EmptyState text="Customer performance reporting will be built as a dedicated tab page in a later vertical slice." />
                  </article>
                </section>
              </section>
            )}
          </section>
        )}
      </section>
    </main>
  );
}
