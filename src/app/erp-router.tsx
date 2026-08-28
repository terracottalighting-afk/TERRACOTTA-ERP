import Link from "next/link";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { LocationRegionFields } from "@/components/customers/location-region-fields";
import { LocationRoleFields } from "@/components/customers/location-role-fields";
import { CustomerOrderControls } from "@/components/customers/customer-order-controls";
import { CustomerInvoiceControls } from "@/components/customers/customer-invoice-controls";
import { CustomerListOverview } from "@/components/customers/customer-list-overview";
import { AddContactForm } from "@/components/customers/add-contact-form";
import { AddCustomerForm } from "@/components/customers/add-customer-form";
import { AddLocationForm } from "@/components/customers/add-location-form";
import { ContactInfoPage } from "@/components/customers/contact-info-page";
import { ContactRoleBadges } from "@/components/customers/contact-role-badges";
import { EditAccountProfileForm } from "@/components/customers/edit-account-profile-form";
import { EditBillingCreditForm } from "@/components/customers/edit-billing-credit-form";
import { EditContactForm } from "@/components/customers/edit-contact-form";
import { EditFreightForm } from "@/components/customers/edit-freight-form";
import { EditLocationForm } from "@/components/customers/edit-location-form";
import { LocationInfoPage } from "@/components/customers/location-info-page";
import { SalesRepAgencyPage } from "@/components/customers/sales-rep-agency-page";
import { FinancialDashboardTabs } from "@/components/financial/financial-dashboard-tabs";
import { InvoiceConfirmationPage } from "@/components/financial/invoice-confirmation-page";
import { InvoiceCreatePage } from "@/components/financial/invoice-create-page";
import { InvoiceCreatedPage } from "@/components/financial/invoice-created-page";
import { InvoiceDocumentPage } from "@/components/financial/invoice-document-page";
import { PaymentEntryPage } from "@/components/financial/payment-entry-page";
import { PaymentDetailPage } from "@/components/financial/payment-detail-page";
import { ProductDetailPartsTable } from "@/components/products/product-detail-parts-table";
import { ProductLedSpecFields } from "@/components/products/product-led-spec-fields";
import { ProductEditPlaceholder } from "@/components/products/product-edit-placeholder";
import { ProductListOverview } from "@/components/products/product-list-overview";
import { ProductPartsListOverview } from "@/components/products/product-parts-list-overview";
import { ProductPartsEditRows } from "@/components/products/product-parts-edit-rows";
import { PartParentProductPicker } from "@/components/products/part-parent-product-picker";
import { ProductVendorRows } from "@/components/products/product-vendor-rows";
import { OrdersOverviewControls } from "@/components/orders/orders-overview-controls";
import {
  OrderEntryForm,
  type OrderPartOption,
  type OrderProductOption,
  type OrderShipToOption,
} from "@/components/orders/order-entry-form";
import { OrderEntryPartsInitializer } from "@/components/orders/order-entry-parts-initializer";
import { QuoteDocumentControls } from "@/components/orders/quote-document-controls";
import { PackingListDocumentControls } from "@/components/shipping/packing-list-document-controls";
import { ShipmentSubmitButton } from "@/components/shipping/shipment-submit-button";
import { ShipmentFreightFields } from "@/components/shipping/shipment-freight-fields";
import { PackingListFreightEditor } from "@/components/shipping/packing-list-freight-editor";
import { ModuleNav } from "./module-nav";
import { EditOrderAddresses } from "@/components/orders/edit-order-addresses";
import {
  addressSnapshotLines,
  dateLabel,
  fileSizeLabel,
  label,
  money,
  numberFormatter,
  timestampLabel,
} from "@/lib/formatters";
import {
  EmptyState,
  Metric,
  MetricLink,
  ModulePlaceholder,
  StatusBadge,
} from "@/components/ui";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/supabase";

export type SearchParams = Promise<{
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
  quote?: string;
  order?: string;
  order_action?: string;
  order_page?: string;
  order_page_size?: string;
  order_q?: string;
  order_advanced?: string;
  order_date_from?: string;
  order_date_to?: string;
  order_customer_name?: string;
  order_sku?: string;
  order_territory?: string;
  order_rep?: string;
  order_sort?: string;
  order_dir?: string;
  order_status?: string;
  order_ready?: string;
  order_customer?: string;
  order_mode?: string;
  invoice_page?: string;
  invoice_page_size?: string;
  invoice_q?: string;
  invoice_advanced?: string;
  invoice_date_from?: string;
  invoice_date_to?: string;
  invoice_status?: string;
  invoice_skus?: string;
  financial_page?: string;
  financial_page_size?: string;
  financial_q?: string;
  financial_advanced?: string;
  financial_date_from?: string;
  financial_date_to?: string;
  financial_status?: string;
  financial_customer?: string;
  financial_skus?: string;
  packing_freight_edit?: string;
  packing_invoice_status?: string;
  shipping_tab?: string;
  shipment?: string;
  shipment_edit?: string;
  packing_list?: string;
  payment?: string;
  invoice?: string;
  invoice_ids?: string;
  invoice_date?: string;
  invoice_payment_terms?: string;
  invoice_payment_days?: string;
  invoice_customer_freight?: string;
  invoice_freight_allocations?: string;
  invoice_dropship_allocations?: string;
  invoice_tax_allocations?: string;
  financial_tab?: string;
  rga?: string;
  rga_tab?: string;
  rga_order?: string;
  preparation_packing_list?: string;
  return_customer?: string;
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
  email: string | null;
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
  created_at: string;
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
  converted_order?: { id: string; sales_order_number: string } | null;
  shipping_in_progress?: boolean;
  shipping_quantity?: { shipped: number; total: number };
};

type SalesOrderDetail = SalesOrder & {
  customer_account_id: string;
  customer_location_id: string | null;
  customer_name_snapshot: string;
  bill_to_snapshot_json: Record<string, unknown> | null;
  is_dropship: boolean;
  order_source: string;
  order_type: string;
  requested_ship_date: string | null;
  ship_to_display_name_snapshot: string;
  ship_to_snapshot_json: Record<string, unknown>;
  ship_to_type: string;
  shipping_priority: string;
  sales_rep_agency_id_snapshot: string | null;
  sales_rep_id_snapshot: string | null;
  territory_id_snapshot: string | null;
  subtotal_amount: number;
  tax_amount: number;
  freight_amount: number;
  notes: string | null;
  lines: {
    brand_name_snapshot: string;
    available_inventory: number;
    discount_percent: number;
    id: string;
    line_number: number;
    line_status: string;
    product_id: string;
    product_name_snapshot: string;
    product_sku_snapshot: string;
    quantity_cancelled: number;
    quantity_cleared: number;
    quantity_ordered: number;
    quantity_shipped: number;
    unit_price: number;
    line_total: number;
  }[];
};

type OrderAddressOption = OrderShipToOption & {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  email: string | null;
  postalCode: string | null;
  stateProvince: string | null;
};

type CustomerInvoice = {
  id: string;
  invoice_number: string;
  sales_order: { customer_po_number: string } | null;
  sales_order_id: string;
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
  allocated_freight_cost: number;
  freight_shipment_id: string | null;
  id: string;
  packing_list_number: string;
  sales_order_id: string;
  customer_po_number_snapshot: string;
  status: string;
  invoice_generation_status_snapshot: string;
  shipping_fee: number;
  ship_date: string | null;
};

type InvoiceQueuePackingList = PackingList & {
  customer_account_id: string;
  customer_name: string;
  created_at: string;
  dropship_fee_amount: number;
  sales_order_number_snapshot: string | null;
};

type InvoiceBrandSummary = {
  brand_id: string;
  brand_name: string;
  subtotal_amount: number;
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

type ProductImageCategory =
  | "stock"
  | "detail"
  | "lifestyle"
  | "drawing"
  | "other";

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

type ProductDocumentType =
  | "spec_sheet"
  | "installation_instruction"
  | "manual"
  | "box_label"
  | "cad_drawing"
  | "other";

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
  "Others",
];

const countryOptions = [
  { code: "USA", name: "United States" },
  { code: "CAN", name: "Canada" },
  { code: "MEX", name: "Mexico" },
  { code: "CHN", name: "China" },
];

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function invoiceDueDate(
  shipDate: string | null | undefined,
  paymentDays: number,
  fallbackDate: string,
) {
  const sourceDate = shipDate?.slice(0, 10) || fallbackDate;
  const date = new Date(`${sourceDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return fallbackDate;
  date.setDate(date.getDate() + paymentDays);
  return date.toISOString().slice(0, 10);
}

function parseInvoiceAllocations(value: string | undefined) {
  try {
    const parsed = JSON.parse(value ?? "{}") as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).map(([key, amount]) => [key, Number(amount)]),
    ) as Record<string, number>;
  } catch {
    return null;
  }
}

function shippingQuantityTone(value: SalesOrder["shipping_quantity"]) {
  const shipped = Number(value?.shipped ?? 0);
  const total = Number(value?.total ?? 0);
  if (total > 0 && shipped >= total) return "good";
  if (shipped > 0) return "warn";
  return "danger";
}

function shippingStatus(
  value: SalesOrder["shipping_quantity"],
  shipmentInProgress = false,
) {
  const shipped = Number(value?.shipped ?? 0);
  const total = Number(value?.total ?? 0);
  if (total > 0 && shipped >= total)
    return { tone: "good" as const, value: "Closed" };
  if (shipmentInProgress)
    return { tone: "warn" as const, value: "In Progress" };
  if (shipped > 0) return { tone: "warn" as const, value: "Partial" };
  return { tone: "danger" as const, value: "Open" };
}

function orderLifecycleStatus(status: string) {
  if (status === "open" || status === "partially_shipped")
    return { tone: "neutral" as const, value: "Active" };
  if (status === "closed") return { tone: "good" as const, value: "Closed" };
  if (status === "hold") return { tone: "warn" as const, value: "Hold" };
  if (status === "void" || status === "deleted")
    return { tone: "danger" as const, value: label(status) };
  return { tone: "neutral" as const, value: label(status) };
}

async function getCustomerOptions(
  table: "customer_account_type" | "customer_business_type",
) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from(table)
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SelectOption[];
}

async function getTerritoryOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("territory")
    .select("id, name")
    .eq("status", "active")
    .order("name", { ascending: true });

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
    name: rep.name,
  })) as RepOption[];
}

async function getProductBrandOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("brand")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

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
    name: finish.finish_name,
  })) as SelectOption[];
}

async function getWarehouseOptions() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("warehouse")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

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
    warehouse_name: location.warehouse?.name ?? "Warehouse",
  })) as WarehouseLocationOption[];
}

function toLookup(options: SelectOption[]) {
  return Object.fromEntries(
    options.map((item) => [item.id, item.name]),
  ) as Lookup;
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

  if (
    !name ||
    !accountTypeId ||
    !businessTypeId ||
    !mainLocationContactName ||
    !billingContactName
  ) {
    redirect("/?module=add-customer&error=missing_required");
  }

  const defaultDiscount = Number(formData.get("default_discount_percent") ?? 0);
  const creditLimitRaw = optionalText("credit_limit");
  const creditLimit = creditLimitRaw ? Number(creditLimitRaw) : null;
  const locationName = optionalText("location_name");
  const territoryId = optionalText("territory_id");
  const salesRepSelection = optionalText("sales_rep_selection");
  const [salesRepId, salesRepAgencyId] = salesRepSelection
    ? salesRepSelection.split("|")
    : [null, null];
  const countryCode = optionalText("country_code") ?? "USA";
  const country =
    countryOptions.find((option) => option.code === countryCode)?.name ??
    "United States";
  const statusValue = String(formData.get("status") ?? "active");
  const status = ["pending", "active", "inactive", "credit_hold"].includes(
    statusValue,
  )
    ? (statusValue as "pending" | "active" | "inactive" | "credit_hold")
    : "active";
  const freightTerm = (value: FormDataEntryValue | null) => {
    const text = String(value ?? "prepaid");
    return [
      "prepaid",
      "collect",
      "customer_pickup",
      "free_freight",
      "flat_rate",
      "manual_review",
    ].includes(text)
      ? (text as
          | "prepaid"
          | "collect"
          | "customer_pickup"
          | "free_freight"
          | "flat_rate"
          | "manual_review")
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
      default_discount_percent: Number.isFinite(defaultDiscount)
        ? defaultDiscount
        : 0,
      is_sales_tax_exempt: formData.get("is_sales_tax_exempt") === "on",
      legacy_account_id: optionalText("legacy_account_id"),
      legal_name: optionalText("legal_name"),
      state_resale_certificate_number: optionalText(
        "state_resale_certificate_number",
      ),
      name,
      purchase_contact_name:
        formData.get("main_contact_is_purchasing") === "on"
          ? mainLocationContactName
          : null,
      purchase_email:
        formData.get("main_contact_is_purchasing") === "on"
          ? optionalText("main_location_contact_email")
          : null,
      status,
    })
    .select("id")
    .single();

  if (error) {
    redirect(
      `/?module=add-customer&error=${encodeURIComponent(error.message)}`,
    );
  }

  const customerId = data.id;

  const { error: billingError } = await supabase
    .from("customer_billing_profile")
    .insert({
      credit_limit: creditLimit,
      credit_limit_source:
        creditLimit === null ? "system_default" : "customer_override",
      customer_account_id: customerId,
      default_statement_email: optionalText("billing_contact_email"),
      invoice_delivery_method: optionalText("billing_contact_email")
        ? "email"
        : "print",
      payment_days: Number(formData.get("payment_days") ?? 0),
      payment_terms: optionalText("payment_terms") ?? "Due on Receipt",
      statement_delivery_method: optionalText("billing_contact_email")
        ? "email"
        : "print",
    });

  if (billingError) {
    redirect(
      `/?module=add-customer&error=${encodeURIComponent(billingError.message)}`,
    );
  }

  let locationId: string | null = null;
  const isShowroom = formData.get("is_showroom") === "on";
  const isPrimaryShowroom =
    isShowroom && formData.get("is_primary_showroom") === "on";

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
        default_ship_to_order_channel:
          formData.get("is_default_ship_to") === "on" ? "manual" : null,
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
        territory_id: territoryId,
      })
      .select("id")
      .single();

    if (locationError) {
      redirect(
        `/?module=add-customer&error=${encodeURIComponent(locationError.message)}`,
      );
    }

    locationId = locationData.id;

    if (isPrimaryShowroom) {
      const { error: showroomError } = await supabase
        .from("primary_showroom_enrollment")
        .insert({
          customer_account_id: customerId,
          customer_location_id: locationId,
          program_status: "pending",
          required_display_count: 0,
          current_display_count: 0,
          discount_percent: 0,
        });

      if (showroomError) {
        redirect(
          `/?module=add-customer&error=${encodeURIComponent(showroomError.message)}`,
        );
      }
    }

    const { error: freightError } = await supabase
      .from("customer_freight_policy")
      .insert({
        customer_account_id: customerId,
        customer_location_id: locationId,
        default_ground_carrier:
          freightTerms === "collect"
            ? optionalText("ground_customer_collect_carrier")
            : null,
        default_ground_carrier_account_number:
          freightTerms === "collect"
            ? optionalText("ground_customer_collect_account_number")
            : null,
        default_ltl_carrier:
          freightTerms === "collect"
            ? optionalText("ltl_customer_collect_carrier")
            : null,
        default_ltl_carrier_account_number:
          freightTerms === "collect"
            ? optionalText("ltl_customer_collect_account_number")
            : null,
        flat_rate_percent:
          flatRateRaw && freightTerms === "flat_rate"
            ? Number(flatRateRaw)
            : null,
        freight_allowance_amount: freightAllowanceRaw
          ? Number(freightAllowanceRaw)
          : null,
        freight_terms: freightTerms,
        ground_freight_terms: freightTerms,
        is_default: true,
        ltl_freight_terms: freightTerms,
        policy_name: "Default Freight Policy",
        preferred_shipping_type: null,
      });

    if (freightError) {
      redirect(
        `/?module=add-customer&error=${encodeURIComponent(freightError.message)}`,
      );
    }

    if (salesRepAgencyId) {
      const { error: repAssignmentError } = await supabase
        .from("customer_location_rep_assignment")
        .insert({
          assignment_source: "manual",
          coverage_role: "primary",
          customer_location_id: locationId,
          sales_rep_agency_id: salesRepAgencyId,
          sales_rep_id: salesRepId,
          status: "active",
          territory_id: territoryId,
        });

      if (repAssignmentError) {
        redirect(
          `/?module=add-customer&error=${encodeURIComponent(repAssignmentError.message)}`,
        );
      }
    }
  }

  if (mainLocationContactName) {
    const { error: mainContactError } = await supabase
      .from("customer_contact")
      .insert({
        customer_account_id: customerId,
        customer_location_id: locationId,
        department: optionalText("main_location_contact_department"),
        email: optionalText("main_location_contact_email"),
        is_billing_contact: false,
        is_primary: true,
        is_purchasing_contact:
          formData.get("main_contact_is_purchasing") === "on",
        is_showroom_floor_sales:
          formData.get("main_contact_is_showroom_floor_sales") === "on",
        is_showroom_manager:
          formData.get("main_contact_is_showroom_manager") === "on",
        is_warehouse_receiver:
          formData.get("main_contact_is_warehouse_receiver") === "on",
        mobile: optionalText("main_location_contact_mobile"),
        name: mainLocationContactName,
        phone: optionalText("main_location_contact_phone"),
        title: optionalText("main_location_contact_title"),
      });

    if (mainContactError) {
      redirect(
        `/?module=add-customer&error=${encodeURIComponent(mainContactError.message)}`,
      );
    }
  }

  if (billingContactName) {
    const { error: billingContactError } = await supabase
      .from("customer_contact")
      .insert({
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
        title: optionalText("billing_contact_title"),
      });

    if (billingContactError) {
      redirect(
        `/?module=add-customer&error=${encodeURIComponent(billingContactError.message)}`,
      );
    }
  }

  redirect(`/?customer=${customerId}`);
}

async function createSalesOrderAction(formData: FormData) {
  "use server";

  const customerId = textValue(formData, "customer_id");
  const customerPoNumber = textValue(formData, "customer_po_number");
  const orderDate = textValue(formData, "order_date");
  const orderSource = textValue(formData, "order_source") || "manual";
  const orderType = textValue(formData, "order_type") || "regular";
  const displayOrderType = textValue(formData, "display_order_type") || null;
  const isDropship = formData.get("is_dropship") === "on";
  const locationId = textValue(formData, "customer_location_id") || null;
  const notes = textValue(formData, "notes") || null;
  const productSearch = textValue(formData, "product_search");
  const fallbackUrl = `/?module=new-order&customer=${customerId}`;

  let requestedLines: {
    discountPercent: number;
    productId: string;
    quantity: number;
    unitPrice: number;
  }[] = [];
  try {
    requestedLines = JSON.parse(
      textValue(formData, "order_lines") || "[]",
    ) as typeof requestedLines;
  } catch {
    redirect(`${fallbackUrl}&error=Order%20lines%20could%20not%20be%20read.`);
  }

  const validLines = requestedLines.filter(
    (line) =>
      line.productId &&
      Number.isInteger(line.quantity) &&
      line.quantity > 0 &&
      line.unitPrice >= 0 &&
      line.discountPercent >= 0,
  );

  if (
    !customerId ||
    !customerPoNumber ||
    !orderDate ||
    (validLines.length === 0 && !productSearch) ||
    validLines.length !== requestedLines.length
  ) {
    redirect(
      `${fallbackUrl}&error=Enter%20a%20PO%20number,%20order%20date,%20and%20at%20least%20one%20valid%20product%20line.`,
    );
  }

  if (!isDropship && !locationId) {
    redirect(
      `${fallbackUrl}&error=Select%20a%20saved%20shipping%20address%20or%20use%20Manual%20Ship-to.`,
    );
  }

  const supabase = createSupabaseAdminClient();
  const quoteDate = orderDate.replaceAll("-", "");
  const quoteNumber =
    orderType === "quote"
      ? `QT${quoteDate.slice(4, 8)}${quoteDate.slice(0, 4)}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`
      : undefined;
  const [
    accountResult,
    billingResult,
    invoiceResult,
    freightResult,
    locationResult,
    productsResult,
  ] = await Promise.all([
    supabase
      .from("customer_account")
      .select(
        "id, name, account_number, legacy_account_id, default_discount_percent, is_sales_tax_exempt, purchase_email",
      )
      .eq("id", customerId)
      .single(),
    supabase
      .from("customer_billing_profile")
      .select("payment_terms, credit_limit")
      .eq("customer_account_id", customerId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("customer_invoice")
      .select("balance_due")
      .eq("customer_account_id", customerId)
      .neq("invoice_status", "void"),
    supabase
      .from("customer_freight_policy")
      .select(
        "ltl_freight_terms, ground_freight_terms, default_ltl_carrier, default_ltl_carrier_account_number, default_ground_carrier, default_ground_carrier_account_number",
      )
      .eq("customer_account_id", customerId)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .limit(1)
      .maybeSingle(),
    locationId
      ? supabase
          .from("customer_location")
          .select(
            "id, location_name, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, email",
          )
          .eq("id", locationId)
          .eq("customer_account_id", customerId)
          .eq("is_shipping_address", true)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    validLines.length > 0
      ? supabase
          .from("product")
          .select("id, sku, name, default_price, brand_id, brand(name)")
          .in(
            "id",
            validLines.map((line) => line.productId),
          )
      : supabase
          .from("product")
          .select("id, sku, name, default_price, brand_id, brand(name)")
          .eq("sku", productSearch)
          .limit(1),
  ]);

  const failure = [
    accountResult,
    billingResult,
    invoiceResult,
    freightResult,
    locationResult,
    productsResult,
  ].find((result) => result.error);
  if (failure?.error) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(failure.error.message)}`,
    );
  }

  if (!accountResult.data || (!isDropship && !locationResult.data)) {
    redirect(
      `${fallbackUrl}&error=The%20customer%20or%20selected%20shipping%20address%20is%20not%20available.`,
    );
  }

  const productById = new Map(
    (productsResult.data ?? []).map((product) => [product.id, product]),
  );
  const effectiveLines =
    validLines.length > 0
      ? validLines
      : productsResult.data?.length === 1
        ? [
            {
              discountPercent: Number(
                accountResult.data.default_discount_percent ?? 0,
              ),
              productId: productsResult.data[0].id,
              quantity: 1,
              unitPrice: Number(productsResult.data[0].default_price ?? 0),
            },
          ]
        : [];

  if (
    effectiveLines.length === 0 ||
    productById.size !== effectiveLines.length
  ) {
    redirect(
      `${fallbackUrl}&error=One%20or%20more%20selected%20products%20are%20no%20longer%20available.`,
    );
  }

  const account = accountResult.data;
  const savedLocation = locationResult.data;
  const dropshipName = textValue(formData, "dropship_name");
  const dropshipAddressLine1 = textValue(formData, "dropship_address_line_1");
  const dropshipCity = textValue(formData, "dropship_city");
  const dropshipStateProvince = textValue(formData, "dropship_state_province");
  const dropshipPostalCode = textValue(formData, "dropship_postal_code");
  const dropshipCountry =
    textValue(formData, "dropship_country") || "United States";
  const shippingContactEmail = textValue(formData, "shipping_contact_email");

  if (
    isDropship &&
    (!dropshipName ||
      !dropshipAddressLine1 ||
      !dropshipCity ||
      !dropshipStateProvince ||
      !dropshipPostalCode)
  ) {
    redirect(
      `${fallbackUrl}&error=Complete%20the%20manual%20Ship-to%20address.`,
    );
  }

  const currentBalance = (invoiceResult.data ?? []).reduce(
    (sum, invoice) => sum + Number(invoice.balance_due ?? 0),
    0,
  );
  const creditLimit =
    billingResult.data?.credit_limit === null ||
    billingResult.data?.credit_limit === undefined
      ? 0
      : Number(billingResult.data.credit_limit);
  const onCreditHold = currentBalance > creditLimit;
  const freight = freightResult.data;
  const shipToSnapshot = isDropship
    ? {
        ship_to_display_name: dropshipName,
        address_line_1: dropshipAddressLine1,
        address_line_2: textValue(formData, "dropship_address_line_2") || null,
        city: dropshipCity,
        state_province: dropshipStateProvince,
        postal_code: dropshipPostalCode,
        country: dropshipCountry,
        country_code: dropshipCountry === "United States" ? "US" : null,
        shipping_contact_email:
          textValue(formData, "dropship_email") ||
          account.purchase_email ||
          null,
      }
    : {
        ship_to_display_name: savedLocation!.location_name,
        address_line_1: savedLocation!.address_line_1,
        address_line_2: savedLocation!.address_line_2,
        city: savedLocation!.city,
        state_province: savedLocation!.state_province,
        postal_code: savedLocation!.postal_code,
        country: savedLocation!.country,
        country_code: savedLocation!.country_code,
        shipping_contact_email:
          shippingContactEmail ||
          savedLocation!.email ||
          account.purchase_email ||
          null,
      };

  const { data: order, error: orderError } = await supabase
    .from("sales_order")
    .insert({
      acknowledgement_document_type:
        orderType === "quote"
          ? "order_acknowledgement"
          : onCreditHold
            ? "pro_forma_invoice"
            : "order_acknowledgement",
      balance_at_order_entry_snapshot: currentBalance,
      credit_hold_reason: onCreditHold ? "credit_limit_exceeded" : null,
      credit_hold_status: onCreditHold ? "on_credit_hold" : "none",
      credit_limit_snapshot: creditLimit,
      customer_account_id: customerId,
      customer_account_number_snapshot: account.account_number,
      customer_location_id: isDropship ? null : locationId,
      customer_name_snapshot: account.name,
      customer_po_number: customerPoNumber,
      invoice_required: orderType !== "quote",
      sales_order_number: quoteNumber,
      display_order_type:
        orderType === "display"
          ? (displayOrderType as
              | "primary_showroom_display"
              | "non_primary_display"
              | "other_display")
          : null,
      display_tracking_required: orderType === "display",
      ground_carrier_account_number_snapshot:
        freight?.default_ground_carrier_account_number ?? null,
      ground_carrier_snapshot: freight?.default_ground_carrier ?? null,
      ground_freight_terms_snapshot: freight?.ground_freight_terms ?? "prepaid",
      is_dropship: isDropship,
      legacy_account_id_snapshot: account.legacy_account_id,
      ltl_carrier_account_number_snapshot:
        freight?.default_ltl_carrier_account_number ?? null,
      ltl_carrier_snapshot: freight?.default_ltl_carrier ?? null,
      ltl_freight_terms_snapshot: freight?.ltl_freight_terms ?? "prepaid",
      notes,
      order_date: orderDate,
      order_source: orderSource as "manual",
      order_type: orderType as "regular" | "display" | "quote",
      payment_terms_snapshot: billingResult.data?.payment_terms ?? null,
      ship_to_display_name_snapshot: isDropship
        ? dropshipName
        : savedLocation!.location_name,
      ship_to_snapshot_json: shipToSnapshot,
      ship_to_type: isDropship ? "dropship" : "saved_location",
      status: "open",
      shipping_readiness_status: "not_ready",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(orderError?.message ?? "Order could not be created.")}`,
    );
  }

  const lineRows = effectiveLines.map((line, index) => {
    const product = productById.get(line.productId)!;
    const unitPrice = Number(line.unitPrice);
    const discountPercent = Number(line.discountPercent);
    const defaultPrice = Number(product.default_price ?? 0);
    const defaultDiscount = Number(account.default_discount_percent ?? 0);
    const priceOverridden = Math.abs(unitPrice - defaultPrice) > 0.001;
    const discountOverridden =
      Math.abs(discountPercent - defaultDiscount) > 0.001;

    return {
      brand_id_snapshot: product.brand_id,
      brand_name_snapshot: product.brand?.name ?? "Not set",
      discount_override_reason: discountOverridden
        ? "Order-entry override"
        : null,
      discount_overridden: discountOverridden,
      discount_percent: discountPercent,
      line_number: index + 1,
      price_override_reason: priceOverridden ? "Order-entry override" : null,
      price_overridden: priceOverridden,
      product_id: line.productId,
      product_name_snapshot: product.name,
      product_sku_snapshot: product.sku,
      quantity_ordered: Number(line.quantity),
      sales_order_id: order.id,
      unit_price: unitPrice,
    };
  });

  const { error: linesError } = await supabase
    .from("sales_order_line")
    .insert(lineRows);
  if (linesError) {
    await supabase.from("sales_order").delete().eq("id", order.id);
    redirect(`${fallbackUrl}&error=${encodeURIComponent(linesError.message)}`);
  }

  redirect(
    `/?module=orders&order=${order.id}&notice=${encodeURIComponent(orderType === "quote" ? "Quote created." : "Order created.")}`,
  );
}

async function updateSalesOrderAction(formData: FormData) {
  "use server";

  const orderId = textValue(formData, "order_id");
  const customerId = textValue(formData, "customer_id");
  const fallbackUrl = `/?module=orders&order=${orderId}&order_action=edit`;

  if (!orderId || !customerId) {
    redirect(
      `/?module=orders&error=${encodeURIComponent("The order could not be identified.")}`,
    );
  }

  const customerPoNumber = textValue(formData, "customer_po_number");
  const requestedStatus = textValue(formData, "order_status");
  let requestedNewLines: {
    discountPercent: number;
    productId: string;
    quantity: number;
    unitPrice: number;
  }[] = [];
  try {
    requestedNewLines = JSON.parse(
      textValue(formData, "new_order_lines") || "[]",
    ) as typeof requestedNewLines;
  } catch {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("New order lines could not be read.")}`,
    );
  }
  if (!customerPoNumber) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Enter a customer PO number.")}`,
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: currentOrder, error: orderReadError } = await supabase
    .from("sales_order")
    .select(
      "id, status, bill_to_snapshot_json, customer_location_id, is_dropship",
    )
    .eq("id", orderId)
    .eq("customer_account_id", customerId)
    .maybeSingle();

  if (orderReadError || !currentOrder) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(orderReadError?.message ?? "Order not found.")}`,
    );
  }
  if (
    !["open", "partially_shipped", "pending", "hold"].includes(
      currentOrder.status,
    )
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Only open, partially shipped, pending, or held orders can be edited.")}`,
    );
  }
  if (!["open", "pending", "hold", "void"].includes(requestedStatus)) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Select a valid order status.")}`,
    );
  }
  if (
    currentOrder.status === "partially_shipped" &&
    requestedStatus === "void"
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("A partially shipped order cannot be voided.")}`,
    );
  }

  const shippingAddressSelection = textValue(
    formData,
    "shipping_address_selection",
  );
  const shipToMode =
    shippingAddressSelection === "current"
      ? currentOrder.is_dropship
        ? "dropship"
        : "saved_location"
      : "saved_location";
  const selectedLocationId =
    shippingAddressSelection === "current"
      ? (currentOrder.customer_location_id ?? "")
      : shippingAddressSelection;
  const billingAddressSelection = textValue(
    formData,
    "billing_address_selection",
  );
  const selectedBillingLocationId =
    billingAddressSelection === "current" ? "" : billingAddressSelection;
  const dropshipName = textValue(formData, "dropship_name");
  const dropshipAddressLine1 = textValue(formData, "dropship_address_line_1");
  const dropshipCity = textValue(formData, "dropship_city");
  const dropshipStateProvince = textValue(formData, "dropship_state_province");
  const dropshipPostalCode = textValue(formData, "dropship_postal_code");
  const dropshipEmail = textValue(formData, "dropship_email") || null;
  let orderAddressUpdate: Database["public"]["Tables"]["sales_order"]["Update"] =
    {};

  if (shipToMode === "dropship") {
    const manualShipToBlank =
      !dropshipName &&
      !dropshipAddressLine1 &&
      !dropshipCity &&
      !dropshipStateProvince &&
      !dropshipPostalCode;
    if (manualShipToBlank && currentOrder.is_dropship) {
      orderAddressUpdate = {};
    } else if (
      !dropshipName ||
      !dropshipAddressLine1 ||
      !dropshipCity ||
      !dropshipStateProvince ||
      !dropshipPostalCode
    ) {
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent("Complete the current Ship-to address.")}`,
      );
    } else {
      orderAddressUpdate = {
        customer_location_id: null,
        is_dropship: true,
        ship_to_display_name_snapshot: dropshipName,
        ship_to_snapshot_json: {
          address_line_1: dropshipAddressLine1,
          address_line_2:
            textValue(formData, "dropship_address_line_2") || null,
          city: dropshipCity,
          country: textValue(formData, "dropship_country") || "United States",
          country_code: null,
          postal_code: dropshipPostalCode,
          shipping_contact_email: dropshipEmail,
          ship_to_display_name: dropshipName,
          state_province: dropshipStateProvince,
        },
        ship_to_type: "dropship",
      };
    }
  } else {
    if (!selectedLocationId)
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent("Select a saved shipping address.")}`,
      );
    const { data: savedLocation, error: savedLocationError } = await supabase
      .from("customer_location")
      .select(
        "id, location_name, address_line_1, address_line_2, city, state_province, postal_code, country, country_code",
      )
      .eq("id", selectedLocationId)
      .eq("customer_account_id", customerId)
      .eq("is_shipping_address", true)
      .eq("status", "active")
      .maybeSingle();
    if (savedLocationError || !savedLocation)
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent(savedLocationError?.message ?? "The saved shipping address is not available.")}`,
      );
    if (
      !dropshipName ||
      !dropshipAddressLine1 ||
      !dropshipCity ||
      !dropshipStateProvince ||
      !dropshipPostalCode
    ) {
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent("Complete the selected shipping address details.")}`,
      );
    }
    orderAddressUpdate = {
      customer_location_id: savedLocation.id,
      is_dropship: false,
      ship_to_display_name_snapshot: dropshipName,
      ship_to_snapshot_json: {
        address_line_1: dropshipAddressLine1,
        address_line_2: textValue(formData, "dropship_address_line_2") || null,
        city: dropshipCity,
        country: textValue(formData, "dropship_country") || "United States",
        country_code: savedLocation.country_code,
        postal_code: dropshipPostalCode,
        shipping_contact_email: dropshipEmail,
        ship_to_display_name: dropshipName,
        state_province: dropshipStateProvince,
      },
      ship_to_type: "saved_location",
    };
  }

  const billingAddressMode =
    billingAddressSelection === "current" ? "current" : "saved";
  if (billingAddressMode === "current") {
    const billingName = textValue(formData, "billing_name");
    const billingAddressLine1 = textValue(formData, "billing_address_line_1");
    const billingCity = textValue(formData, "billing_city");
    const billingStateProvince = textValue(formData, "billing_state_province");
    const billingPostalCode = textValue(formData, "billing_postal_code");
    const manualBillingBlank =
      !billingName &&
      !billingAddressLine1 &&
      !billingCity &&
      !billingStateProvince &&
      !billingPostalCode;
    if (manualBillingBlank) {
      orderAddressUpdate.bill_to_snapshot_json =
        currentOrder.bill_to_snapshot_json;
    } else if (
      !billingName ||
      !billingAddressLine1 ||
      !billingCity ||
      !billingStateProvince ||
      !billingPostalCode
    ) {
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent("Complete the current billing address.")}`,
      );
    } else {
      orderAddressUpdate.bill_to_snapshot_json = {
        address_line_1: billingAddressLine1,
        address_line_2: textValue(formData, "billing_address_line_2") || null,
        bill_to_display_name: billingName,
        billing_email: textValue(formData, "billing_email") || null,
        city: billingCity,
        country: textValue(formData, "billing_country") || "United States",
        country_code: null,
        postal_code: billingPostalCode,
        state_province: billingStateProvince,
      };
    }
  } else if (selectedBillingLocationId) {
    const { data: billingLocation, error: billingLocationError } =
      await supabase
        .from("customer_location")
        .select(
          "location_name, address_line_1, address_line_2, city, state_province, postal_code, country, country_code",
        )
        .eq("id", selectedBillingLocationId)
        .eq("customer_account_id", customerId)
        .eq("is_billing_address", true)
        .eq("status", "active")
        .maybeSingle();
    if (billingLocationError || !billingLocation)
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent(billingLocationError?.message ?? "The billing address is not available.")}`,
      );
    const billingName = textValue(formData, "billing_name");
    const billingAddressLine1 = textValue(formData, "billing_address_line_1");
    const billingCity = textValue(formData, "billing_city");
    const billingStateProvince = textValue(formData, "billing_state_province");
    const billingPostalCode = textValue(formData, "billing_postal_code");
    if (
      !billingName ||
      !billingAddressLine1 ||
      !billingCity ||
      !billingStateProvince ||
      !billingPostalCode
    ) {
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent("Complete the selected billing address details.")}`,
      );
    }
    orderAddressUpdate.bill_to_snapshot_json = {
      address_line_1: billingAddressLine1,
      address_line_2: textValue(formData, "billing_address_line_2") || null,
      bill_to_display_name: billingName,
      billing_email: textValue(formData, "billing_email") || null,
      city: billingCity,
      country: textValue(formData, "billing_country") || "United States",
      country_code: billingLocation.country_code,
      postal_code: billingPostalCode,
      state_province: billingStateProvince,
    };
  }

  const { data: currentLines, error: linesReadError } = await supabase
    .from("sales_order_line")
    .select("id, line_number, quantity_shipped")
    .eq("sales_order_id", orderId)
    .order("line_number", { ascending: true });

  if (linesReadError) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(linesReadError.message)}`,
    );
  }

  const lineIds = formData
    .getAll("line_id")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const currentLineById = new Map(
    (currentLines ?? []).map((line) => [line.id, line]),
  );
  const deleteLineIds = new Set(
    formData
      .getAll("delete_line_id")
      .map((value) => String(value).trim())
      .filter(Boolean),
  );

  if (
    lineIds.length === 0 ||
    lineIds.some((lineId) => !currentLineById.has(lineId))
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("One or more order lines could not be found.")}`,
    );
  }

  if (deleteLineIds.size === lineIds.length) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("An order must keep at least one line.")}`,
    );
  }

  for (const lineId of lineIds) {
    const currentLine = currentLineById.get(lineId)!;
    const quantityShipped = Number(currentLine.quantity_shipped ?? 0);

    if (deleteLineIds.has(lineId)) {
      if (quantityShipped > 0) {
        redirect(
          `${fallbackUrl}&error=${encodeURIComponent("A shipped line cannot be removed.")}`,
        );
      }
      const { error } = await supabase
        .from("sales_order_line")
        .delete()
        .eq("id", lineId)
        .eq("sales_order_id", orderId);
      if (error)
        redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
      continue;
    }

    if (quantityShipped > 0) continue;

    const quantity = Number(textValue(formData, `quantity_${lineId}`));
    const unitPrice = Number(textValue(formData, `unit_price_${lineId}`));
    const discountPercent = Number(
      textValue(formData, `discount_percent_${lineId}`),
    );
    if (
      !Number.isInteger(quantity) ||
      quantity < quantityShipped ||
      quantity <= 0 ||
      !Number.isFinite(unitPrice) ||
      unitPrice < 0 ||
      !Number.isFinite(discountPercent) ||
      discountPercent < 0 ||
      discountPercent > 100
    ) {
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent("Use a whole quantity, a non-negative price, and a discount between 0% and 100%.")}`,
      );
    }

    const { error } = await supabase
      .from("sales_order_line")
      .update({
        discount_override_reason: "Order edit override",
        discount_overridden: true,
        discount_percent: discountPercent,
        price_override_reason: "Order edit override",
        price_overridden: true,
        quantity_ordered: quantity,
        unit_price: unitPrice,
      })
      .eq("id", lineId)
      .eq("sales_order_id", orderId);
    if (error)
      redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
  }

  const validNewLines = requestedNewLines.filter(
    (line) =>
      line.productId &&
      Number.isInteger(line.quantity) &&
      line.quantity > 0 &&
      Number.isFinite(line.unitPrice) &&
      line.unitPrice >= 0 &&
      Number.isFinite(line.discountPercent) &&
      line.discountPercent >= 0 &&
      line.discountPercent <= 100,
  );
  if (validNewLines.length !== requestedNewLines.length) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Each new item needs a whole quantity, a non-negative price, and a discount between 0% and 100%.")}`,
    );
  }

  if (validNewLines.length > 0) {
    const { data: products, error: productsError } = await supabase
      .from("product")
      .select("id, sku, name, default_price, brand_id, brand(name)")
      .in(
        "id",
        validNewLines.map((line) => line.productId),
      );
    if (productsError || (products ?? []).length !== validNewLines.length) {
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent(productsError?.message ?? "One or more new items are not available.")}`,
      );
    }

    const productById = new Map(
      (products ?? []).map((product) => [product.id, product]),
    );
    const nextLineNumber =
      Math.max(
        0,
        ...(currentLines ?? []).map((line) => Number(line.line_number)),
      ) + 1;
    const newLineRows = validNewLines.map((line, index) => {
      const product = productById.get(line.productId)!;
      return {
        brand_id_snapshot: product.brand_id,
        brand_name_snapshot: product.brand?.name ?? "Not set",
        discount_override_reason: "Order edit override",
        discount_overridden: true,
        discount_percent: line.discountPercent,
        line_number: nextLineNumber + index,
        price_override_reason: "Order edit override",
        price_overridden: true,
        product_id: product.id,
        product_name_snapshot: product.name,
        product_sku_snapshot: product.sku,
        quantity_ordered: line.quantity,
        sales_order_id: orderId,
        unit_price: line.unitPrice,
      };
    });
    const { error: insertLinesError } = await supabase
      .from("sales_order_line")
      .insert(newLineRows);
    if (insertLinesError)
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent(insertLinesError.message)}`,
      );
  }

  const salesRepSelection = textValue(formData, "sales_rep_selection");
  const [salesRepId, salesRepAgencyId] = salesRepSelection
    ? salesRepSelection.split("|")
    : [null, null];
  if (salesRepId && salesRepAgencyId) {
    const { data: salesRep, error: salesRepError } = await supabase
      .from("sales_rep")
      .select("id")
      .eq("id", salesRepId)
      .eq("sales_rep_agency_id", salesRepAgencyId)
      .eq("status", "active")
      .maybeSingle();
    if (salesRepError || !salesRep)
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent(salesRepError?.message ?? "The selected sales rep is not available.")}`,
      );
  }

  const territoryId = textValue(formData, "territory_id") || null;
  const shippingPriority =
    textValue(formData, "shipping_priority") === "highest"
      ? "highest"
      : "normal";
  const orderUpdate: Database["public"]["Tables"]["sales_order"]["Update"] = {
    ...orderAddressUpdate,
    customer_po_number: customerPoNumber,
    notes: textValue(formData, "notes") || null,
    status:
      requestedStatus as Database["public"]["Enums"]["sales_order_status"],
    sales_rep_agency_id_snapshot: salesRepAgencyId,
    sales_rep_id_snapshot: salesRepId,
    shipping_priority: shippingPriority,
    territory_id_snapshot: territoryId,
  };

  const { error: orderUpdateError } = await supabase
    .from("sales_order")
    .update(orderUpdate)
    .eq("id", orderId)
    .eq("customer_account_id", customerId);
  if (orderUpdateError) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(orderUpdateError.message)}`,
    );
  }

  redirect(
    `/?module=orders&order=${orderId}&notice=${encodeURIComponent("Order updated.")}`,
  );
}

async function convertQuoteToOrderAction(formData: FormData) {
  "use server";

  const orderId = textValue(formData, "order_id");
  const fallbackUrl = `/?module=orders&order=${orderId}`;
  if (!orderId) {
    redirect(
      `/?module=orders&error=${encodeURIComponent("The quote could not be identified.")}`,
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: quote, error: quoteError } = await supabase
    .from("sales_order")
    .select(
      "id, acknowledgement_document_type, balance_at_order_entry_snapshot, bill_to_snapshot_json, credit_hold_reason, credit_hold_status, credit_limit_snapshot, currency, customer_account_id, customer_account_number_snapshot, customer_location_id, customer_name_snapshot, customer_po_number, discount_percent_snapshot, display_order_type, display_tracking_required, dropship_fee_amount, dropship_fee_override, dropship_fee_override_reason, freight_amount, freight_review_required, ground_carrier_account_number_snapshot, ground_carrier_snapshot, ground_freight_terms_snapshot, is_dropship, legacy_account_id_snapshot, ltl_carrier_account_number_snapshot, ltl_carrier_snapshot, ltl_freight_terms_snapshot, notes, order_contact_snapshot_json, order_date, order_type, payment_terms_snapshot, primary_showroom_enrollment_id, requested_ship_date, sales_rep_agency_id_snapshot, sales_rep_id_snapshot, ship_to_display_name_snapshot, ship_to_snapshot_json, ship_to_type, status, tax_amount, territory_id_snapshot",
    )
    .eq("id", orderId)
    .maybeSingle();
  if (quoteError || !quote) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(quoteError?.message ?? "Quote not found.")}`,
    );
  }
  if (quote.order_type !== "quote" || quote.status !== "open") {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Only an open quote can be converted to an order.")}`,
    );
  }

  const dateToken = String(
    quote.order_date ?? new Date().toISOString().slice(0, 10),
  ).replaceAll("-", "");
  let salesOrderNumber = "";
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = `SO${dateToken}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`;
    const { data: existing, error: existingError } = await supabase
      .from("sales_order")
      .select("id")
      .eq("sales_order_number", candidate)
      .maybeSingle();
    if (existingError) {
      redirect(
        `${fallbackUrl}&error=${encodeURIComponent(existingError.message)}`,
      );
    }
    if (!existing) {
      salesOrderNumber = candidate;
      break;
    }
  }
  if (!salesOrderNumber) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("A unique sales order number could not be generated. Please try again.")}`,
    );
  }

  const { data: quoteLines, error: quoteLinesError } = await supabase
    .from("sales_order_line")
    .select(
      "brand_id_snapshot, brand_name_snapshot, discount_override_reason, discount_overridden, discount_percent, display_counts_toward_primary_showroom, display_discount_percent_snapshot, display_exclusion_reason, estimated_ship_date, line_number, notes, price_override_reason, price_overridden, product_eligibility_snapshot, product_id, product_name_snapshot, product_sellability_snapshot, product_sku_snapshot, product_status_snapshot, quantity_ordered, requested_ship_date, restricted_product_override, restricted_product_override_reason, unit_price",
    )
    .eq("sales_order_id", quote.id)
    .order("line_number");
  if (quoteLinesError || !quoteLines?.length) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(quoteLinesError?.message ?? "The quote has no lines to convert.")}`,
    );
  }

  // Mark the quote first so its customer PO number is released for the new active order.
  const { data: convertedQuote, error: quoteUpdateError } = await supabase
    .from("sales_order")
    .update({ status: "converted", shipping_readiness_status: "not_ready" })
    .eq("id", quote.id)
    .eq("order_type", "quote")
    .eq("status", "open")
    .select("id")
    .maybeSingle();
  if (quoteUpdateError || !convertedQuote) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(quoteUpdateError?.message ?? "The quote was already converted or is no longer open.")}`,
    );
  }

  const { data: convertedOrder, error: convertedOrderError } = await supabase
    .from("sales_order")
    .insert({
      acknowledgement_document_type: "order_acknowledgement",
      balance_at_order_entry_snapshot: quote.balance_at_order_entry_snapshot,
      bill_to_snapshot_json: quote.bill_to_snapshot_json,
      credit_hold_reason:
        quote.credit_hold_status === "on_credit_hold"
          ? quote.credit_hold_reason
          : null,
      credit_hold_status: quote.credit_hold_status,
      credit_limit_snapshot: quote.credit_limit_snapshot,
      converted_from_quote_id: quote.id,
      currency: quote.currency,
      customer_account_id: quote.customer_account_id,
      customer_account_number_snapshot: quote.customer_account_number_snapshot,
      customer_location_id: quote.customer_location_id,
      customer_name_snapshot: quote.customer_name_snapshot,
      customer_po_number: quote.customer_po_number,
      discount_percent_snapshot: quote.discount_percent_snapshot,
      display_order_type: null,
      display_tracking_required: false,
      dropship_fee_amount: quote.dropship_fee_amount,
      dropship_fee_override: quote.dropship_fee_override,
      dropship_fee_override_reason: quote.dropship_fee_override_reason,
      freight_amount: quote.freight_amount,
      freight_review_required: quote.freight_review_required,
      ground_carrier_account_number_snapshot:
        quote.ground_carrier_account_number_snapshot,
      ground_carrier_snapshot: quote.ground_carrier_snapshot,
      ground_freight_terms_snapshot: quote.ground_freight_terms_snapshot,
      invoice_required: true,
      is_dropship: quote.is_dropship,
      legacy_account_id_snapshot: quote.legacy_account_id_snapshot,
      ltl_carrier_account_number_snapshot:
        quote.ltl_carrier_account_number_snapshot,
      ltl_carrier_snapshot: quote.ltl_carrier_snapshot,
      ltl_freight_terms_snapshot: quote.ltl_freight_terms_snapshot,
      notes: quote.notes,
      order_contact_snapshot_json: quote.order_contact_snapshot_json,
      order_date: quote.order_date,
      order_source: "converted",
      order_type: "regular",
      payment_terms_snapshot: quote.payment_terms_snapshot,
      primary_showroom_enrollment_id: null,
      sales_order_number: salesOrderNumber,
      sales_rep_agency_id_snapshot: quote.sales_rep_agency_id_snapshot,
      sales_rep_id_snapshot: quote.sales_rep_id_snapshot,
      ship_to_display_name_snapshot: quote.ship_to_display_name_snapshot,
      ship_to_snapshot_json: quote.ship_to_snapshot_json,
      ship_to_type: quote.ship_to_type,
      status: "open",
      shipping_readiness_status: "not_ready",
      tax_amount: quote.tax_amount,
      territory_id_snapshot: quote.territory_id_snapshot,
    })
    .select("id")
    .single();
  if (convertedOrderError || !convertedOrder) {
    await supabase
      .from("sales_order")
      .update({ status: "open" })
      .eq("id", quote.id);
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(convertedOrderError?.message ?? "The sales order could not be created.")}`,
    );
  }

  const { error: lineCopyError } = await supabase
    .from("sales_order_line")
    .insert(
      quoteLines.map((line) => ({
        ...line,
        sales_order_id: convertedOrder.id,
      })),
    );
  if (lineCopyError) {
    await supabase.from("sales_order").delete().eq("id", convertedOrder.id);
    await supabase
      .from("sales_order")
      .update({ status: "open" })
      .eq("id", quote.id);
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(lineCopyError.message)}`,
    );
  }

  redirect(
    `/?module=orders&order=${convertedOrder.id}&notice=${encodeURIComponent(`Quote converted to sales order ${salesOrderNumber}.`)}`,
  );
}

async function setShippingPriorityAction(formData: FormData) {
  "use server";

  const orderId = textValue(formData, "order_id");
  const priority =
    textValue(formData, "shipping_priority") === "highest"
      ? "highest"
      : "normal";
  if (!orderId)
    redirect(
      "/?module=shipping&error=The%20order%20could%20not%20be%20identified.",
    );

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("sales_order")
    .update({ shipping_priority: priority })
    .eq("id", orderId)
    .in("status", ["open", "partially_shipped"]);
  if (error)
    redirect(`/?module=shipping&error=${encodeURIComponent(error.message)}`);

  redirect(
    `/?module=shipping&notice=${encodeURIComponent(priority === "highest" ? "Order moved to Highest shipping priority." : "Order returned to Normal shipping priority.")}`,
  );
}

async function createPendingShipmentAction(formData: FormData) {
  "use server";

  const orderId = textValue(formData, "order_id");
  const fallbackUrl = `/?module=shipment-create&order=${orderId}`;
  if (!orderId)
    redirect(
      "/?module=shipping&error=The%20order%20could%20not%20be%20identified.",
    );

  const supabase = createSupabaseAdminClient();
  const [orderResult, linesResult] = await Promise.all([
    supabase
      .from("sales_order")
      .select(
        "id, customer_account_id, customer_location_id, sales_order_number, customer_po_number, order_type, status, credit_hold_status, is_dropship, ship_to_type, ship_to_snapshot_json",
      )
      .eq("id", orderId)
      .maybeSingle(),
    supabase
      .from("sales_order_line")
      .select(
        "id, product_id, brand_id_snapshot, brand_name_snapshot, product_sku_snapshot, product_name_snapshot, quantity_ordered, quantity_shipped, quantity_cancelled, unit_price, discount_percent",
      )
      .eq("sales_order_id", orderId),
  ]);

  const failure = [orderResult, linesResult].find((result) => result.error);
  if (failure?.error)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(failure.error.message)}`,
    );
  const order = orderResult.data;
  if (
    !order ||
    order.order_type === "quote" ||
    !["open", "partially_shipped"].includes(order.status) ||
    order.credit_hold_status === "on_credit_hold"
  ) {
    redirect(
      `${fallbackUrl}&error=This%20order%20is%20not%20eligible%20to%20ship.`,
    );
  }

  const orderLines = linesResult.data ?? [];
  const productIds = [...new Set(orderLines.map((line) => line.product_id))];
  const [inventoryResult, boxesResult] = productIds.length
    ? await Promise.all([
        supabase
          .from("inventory_balance")
          .select(
            "id, product_id, product_packing_box_id, warehouse_id, warehouse_location_id, quantity_available",
          )
          .in("product_id", productIds)
          .eq("inventory_condition", "regular")
          .gt("quantity_available", 0),
        supabase
          .from("product_packing_box")
          .select(
            "id, product_id, box_sequence, box_label, box_length, box_width, box_height, net_weight, gross_weight",
          )
          .in("product_id", productIds)
          .eq("is_active", true)
          .eq("is_required_for_sale", true),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
      ];
  const inventoryError = inventoryResult.error ?? boxesResult.error;
  if (inventoryError)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(inventoryError.message)}`,
    );

  const inventoryByProduct = new Map<string, typeof inventoryResult.data>();
  for (const inventory of inventoryResult.data ?? []) {
    const rows = inventoryByProduct.get(inventory.product_id) ?? [];
    rows.push(inventory);
    inventoryByProduct.set(inventory.product_id, rows);
  }
  const boxesByProduct = new Map<string, typeof boxesResult.data>();
  for (const box of boxesResult.data ?? []) {
    const rows = boxesByProduct.get(box.product_id) ?? [];
    rows.push(box);
    boxesByProduct.set(box.product_id, rows);
  }

  const selectedLines = orderLines.flatMap((line) => {
    const requiredBoxes = boxesByProduct.get(line.product_id) ?? [];
    const allocations = (inventoryByProduct.get(line.product_id) ?? []).flatMap(
      (inventory) => {
        const usesRequiredBoxes = requiredBoxes.length > 0;
        if (
          usesRequiredBoxes &&
          (!inventory.product_packing_box_id ||
            !requiredBoxes.some(
              (box) => box.id === inventory.product_packing_box_id,
            ))
        )
          return [];
        if (!usesRequiredBoxes && inventory.product_packing_box_id) return [];
        const quantity = Number(
          textValue(formData, `shipment_balance_${line.id}_${inventory.id}`) ||
            0,
        );
        return quantity > 0 ? [{ ...inventory, quantity }] : [];
      },
    );
    if (!allocations.length) return [];

    const quantityByBox = new Map<string, number>();
    for (const allocation of allocations) {
      quantityByBox.set(
        allocation.product_packing_box_id!,
        (quantityByBox.get(allocation.product_packing_box_id!) ?? 0) +
          allocation.quantity,
      );
    }
    const requestedQuantity = requiredBoxes.length
      ? (quantityByBox.get(requiredBoxes[0].id) ?? 0)
      : allocations.reduce((sum, allocation) => sum + allocation.quantity, 0);
    const remainingQuantity = Math.max(
      0,
      Number(line.quantity_ordered) -
        Number(line.quantity_shipped) -
        Number(line.quantity_cancelled ?? 0),
    );
    return [
      {
        ...line,
        allocations,
        requiredBoxes,
        requestedQuantity,
        remainingQuantity,
        quantityByBox,
      },
    ];
  });

  if (!selectedLines.length)
    redirect(
      `${fallbackUrl}&error=Choose%20a%20warehouse%20location%20and%20quantity%20for%20at%20least%20one%20item.`,
    );
  const invalidLine = selectedLines.find(
    (line) =>
      !line.brand_id_snapshot ||
      !Number.isInteger(line.requestedQuantity) ||
      line.requestedQuantity <= 0 ||
      line.requestedQuantity > line.remainingQuantity ||
      line.allocations.some(
        (allocation) =>
          !Number.isInteger(allocation.quantity) ||
          allocation.quantity > Number(allocation.quantity_available),
      ) ||
      (line.requiredBoxes.length > 0 &&
        line.requiredBoxes.some(
          (box) =>
            (line.quantityByBox.get(box.id) ?? 0) !== line.requestedQuantity,
        )),
  );
  if (invalidLine)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(`Check the box/location quantities for ${invalidLine.product_sku_snapshot}. Every required box must have the same shipment quantity.`)}`,
    );

  const shippingType = textValue(formData, "shipping_type");
  const carrier = textValue(formData, "carrier") || null;
  const masterTrackingNumber =
    textValue(formData, "master_tracking_number") || null;
  const notes = textValue(formData, "shipment_notes") || null;
  const freightCostText = textValue(formData, "freight_cost");
  const freightChargeText = textValue(formData, "shipping_fee");
  const freightCost = freightCostText === "" ? 0 : Number(freightCostText);
  const isFreeFreight = formData.get("is_free_freight") === "on";
  const shippingFee = isFreeFreight
    ? 0
    : freightChargeText === ""
      ? freightCost
      : Number(freightChargeText);
  if (
    !Number.isFinite(freightCost) ||
    freightCost < 0 ||
    !Number.isFinite(shippingFee) ||
    shippingFee < 0
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Freight cost and customer freight charge must be valid non-negative amounts.")}`,
    );
  }
  const { data: shipment, error: shipmentError } = await supabase
    .from("freight_shipment")
    .insert({
      carrier,
      customer_account_id: order.customer_account_id,
      freight_cost: freightCost,
      is_dropship: order.is_dropship,
      master_tracking_number: masterTrackingNumber,
      notes,
      ship_to_location_id: order.customer_location_id,
      ship_to_snapshot_json: order.ship_to_snapshot_json,
      ship_to_type:
        order.ship_to_type as Database["public"]["Enums"]["sales_order_ship_to_type"],
      shipping_type: shippingType
        ? (shippingType as Database["public"]["Enums"]["shipping_type"])
        : null,
      status: "pending",
    })
    .select("id, freight_shipment_number")
    .single();
  if (shipmentError || !shipment)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(shipmentError?.message ?? "The shipment could not be created.")}`,
    );

  const { data: packingList, error: packingListError } = await supabase
    .from("packing_list")
    .insert({
      customer_account_id: order.customer_account_id,
      customer_location_id: order.customer_location_id,
      customer_po_number_snapshot: order.customer_po_number,
      allocated_freight_cost: freightCost,
      freight_shipment_id: shipment.id,
      is_dropship: order.is_dropship,
      notes,
      sales_order_id: order.id,
      sales_order_number_snapshot: order.sales_order_number,
      ship_to_snapshot_json: order.ship_to_snapshot_json,
      ship_to_type:
        order.ship_to_type as Database["public"]["Enums"]["sales_order_ship_to_type"],
      shipping_type_snapshot: shippingType
        ? (shippingType as Database["public"]["Enums"]["shipping_type"])
        : null,
      shipping_fee: shippingFee,
      status: "draft",
    })
    .select("id, packing_list_number")
    .single();
  if (packingListError || !packingList) {
    await supabase.from("freight_shipment").delete().eq("id", shipment.id);
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(packingListError?.message ?? "The packing list could not be created.")}`,
    );
  }

  const { data: packingLines, error: packingLinesError } = await supabase
    .from("packing_list_line")
    .insert(
      selectedLines.map((line) => ({
        brand_id_snapshot: String(line.brand_id_snapshot),
        brand_name_snapshot: line.brand_name_snapshot,
        discount_percent_snapshot: Number(line.discount_percent),
        packing_list_id: packingList.id,
        product_id: line.product_id,
        product_name_snapshot: line.product_name_snapshot,
        product_sku_snapshot: line.product_sku_snapshot,
        quantity_ordered_snapshot: Number(line.quantity_ordered),
        quantity_previously_shipped_snapshot: Number(line.quantity_shipped),
        quantity_shipped: line.requestedQuantity,
        sales_order_line_id: line.id,
        unit_price_snapshot: Number(line.unit_price),
      })),
    )
    .select("id, sales_order_line_id");
  if (packingLinesError) {
    await supabase.from("packing_list").delete().eq("id", packingList.id);
    await supabase.from("freight_shipment").delete().eq("id", shipment.id);
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(packingLinesError.message)}`,
    );
  }

  const packingLineIdByOrderLine = new Map(
    (packingLines ?? []).map((line) => [line.sales_order_line_id, line.id]),
  );
  const boxById = new Map((boxesResult.data ?? []).map((box) => [box.id, box]));
  const boxAllocationRows = selectedLines.flatMap((line) =>
    line.allocations.flatMap((allocation) => {
      const packingListLineId = packingLineIdByOrderLine.get(line.id);
      const productPackingBoxId = allocation.product_packing_box_id;
      if (!packingListLineId) return [];
      const box = productPackingBoxId ? boxById.get(productPackingBoxId) : null;
      return [
        {
          box_height_snapshot: box?.box_height ?? null,
          box_label_snapshot: box?.box_label ?? "No packing box",
          box_length_snapshot: box?.box_length ?? null,
          box_quantity_shipped: allocation.quantity,
          box_sequence_snapshot: box?.box_sequence ?? 1,
          box_width_snapshot: box?.box_width ?? null,
          gross_weight_snapshot: box?.gross_weight ?? null,
          inventory_balance_id: allocation.id,
          net_weight_snapshot: box?.net_weight ?? null,
          packing_list_line_id: packingListLineId,
          product_id: line.product_id,
          product_packing_box_id: productPackingBoxId,
          warehouse_id: allocation.warehouse_id,
          warehouse_location_id: allocation.warehouse_location_id,
        },
      ];
    }),
  );
  const { error: boxAllocationError } = await supabase
    .from("packing_list_line_box")
    .insert(boxAllocationRows);
  if (boxAllocationError) {
    await supabase.from("packing_list").delete().eq("id", packingList.id);
    await supabase.from("freight_shipment").delete().eq("id", shipment.id);
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(boxAllocationError.message)}`,
    );
  }

  const shipmentDocuments = formData
    .getAll("shipping_document_files")
    .filter((value): value is File => value instanceof File && value.size > 0);
  const shipmentDocumentType =
    textValue(formData, "shipping_document_type") || "other";
  for (const shipmentDocument of shipmentDocuments) {
    const safeName = shipmentDocument.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageBucket = "customer-attachments";
    const storagePath = `shipping/${shipment.id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(
        storagePath,
        new Uint8Array(await shipmentDocument.arrayBuffer()),
        {
          contentType: shipmentDocument.type || "application/octet-stream",
          upsert: false,
        },
      );
    if (uploadError)
      redirect(
        `${fallbackUrl}&shipment=${shipment.id}&error=${encodeURIComponent(`Shipment was created, but ${shipmentDocument.name} could not be uploaded: ${uploadError.message}`)}`,
      );

    const { data: attachment, error: attachmentError } = await supabase
      .from("attachment")
      .insert({
        category: `shipping_${shipmentDocumentType}`,
        content_type: shipmentDocument.type || null,
        entity_id: shipment.id,
        entity_type: "freight_shipment",
        file_size: shipmentDocument.size,
        original_file_name: shipmentDocument.name,
        storage_bucket: storageBucket,
        storage_path: storagePath,
      })
      .select("id")
      .single();
    if (attachmentError || !attachment)
      redirect(
        `${fallbackUrl}&shipment=${shipment.id}&error=${encodeURIComponent(attachmentError?.message ?? `Shipment was created, but ${shipmentDocument.name} could not be recorded.`)}`,
      );

    if (shipmentDocumentType === "bol") {
      const { error: bolError } = await supabase
        .from("freight_shipment")
        .update({ bol_document_file_id: attachment.id })
        .eq("id", shipment.id);
      if (bolError)
        redirect(
          `${fallbackUrl}&shipment=${shipment.id}&error=${encodeURIComponent(bolError.message)}`,
        );
    }
  }

  redirect(
    `${fallbackUrl}&shipment=${shipment.id}&notice=${encodeURIComponent(`Pending shipment ${shipment.freight_shipment_number} and draft packing list ${packingList.packing_list_number} were created.`)}`,
  );
}

async function confirmPendingShipmentAction(formData: FormData) {
  "use server";

  const orderId = textValue(formData, "order_id");
  const shipmentId = textValue(formData, "shipment_id");
  const fallbackUrl = `/?module=shipment-create&order=${orderId}&shipment=${shipmentId}`;
  if (!orderId || !shipmentId)
    redirect(
      "/?module=shipping&error=The%20shipment%20could%20not%20be%20identified.",
    );
  const supabase = createSupabaseAdminClient();
  const { data: shipment, error: shipmentError } = await supabase
    .from("freight_shipment")
    .select("carrier, master_tracking_number")
    .eq("id", shipmentId)
    .maybeSingle();
  if (shipmentError || !shipment)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(shipmentError?.message ?? "The shipment could not be found.")}`,
    );
  if (!shipment.carrier?.trim() || !shipment.master_tracking_number?.trim()) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Enter both Carrier and Master Tracking No. in Shipment Header before confirming the shipment.")}`,
    );
  }
  const { error } = await supabase.rpc("confirm_freight_shipment", {
    p_freight_shipment_id: shipmentId,
    p_ship_date: new Date().toISOString().slice(0, 10),
  });
  if (error)
    redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
  redirect(
    `/?module=shipment-detail&shipment=${shipmentId}&notice=${encodeURIComponent("Shipment posted. Inventory and shipped quantities were updated.")}`,
  );
}

async function createInvoicesFromPackingListAction(formData: FormData) {
  "use server";

  const packingListId = textValue(formData, "packing_list_id");
  const invoiceDate =
    textValue(formData, "invoice_date") ||
    new Date().toISOString().slice(0, 10);
  const paymentTerms = textValue(formData, "payment_terms") || "Upon Receipt";
  const paymentDays = Number(textValue(formData, "payment_days"));
  const customerFreightCharge = Number(
    textValue(formData, "customer_freight_charge"),
  );
  const fallbackUrl = `/?module=invoice-create&packing_list=${packingListId}`;
  if (!packingListId)
    redirect(
      "/?module=invoices&error=The%20packing%20list%20could%20not%20be%20identified.",
    );
  if (!Number.isInteger(paymentDays) || paymentDays < 0) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Payment days must be a whole number of zero or greater.")}`,
    );
  }
  if (!Number.isFinite(customerFreightCharge) || customerFreightCharge < 0) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Customer freight charge must be zero or greater.")}`,
    );
  }

  const brandIds = formData.getAll("brand_id").map(String).filter(Boolean);
  const freightAllocations = Object.fromEntries(
    brandIds.map((brandId) => [
      brandId,
      Number(textValue(formData, `freight_${brandId}`) || 0),
    ]),
  ) as Record<string, number>;
  const dropshipAllocations = Object.fromEntries(
    brandIds.map((brandId) => [
      brandId,
      Number(textValue(formData, `dropship_${brandId}`) || 0),
    ]),
  );
  const taxAllocations = Object.fromEntries(
    brandIds.map((brandId) => [
      brandId,
      Number(textValue(formData, `tax_${brandId}`) || 0),
    ]),
  );
  if (brandIds.length === 1)
    freightAllocations[brandIds[0]] = customerFreightCharge;

  if (
    [
      ...Object.values(freightAllocations),
      ...Object.values(dropshipAllocations),
      ...Object.values(taxAllocations),
    ].some((amount) => !Number.isFinite(amount) || amount < 0)
  ) {
    redirect(
      `${fallbackUrl}&error=Freight%2C%20drop-ship%2C%20and%20tax%20amounts%20must%20be%20zero%20or%20greater.`,
    );
  }
  if (
    brandIds.length > 1 &&
    Object.values(freightAllocations).reduce(
      (total, amount) => total + amount,
      0,
    ) !== customerFreightCharge
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Manual brand freight allocations must equal the customer freight charge.")}`,
    );
  }

  const { data, error } = await createSupabaseAdminClient().rpc(
    "create_invoices_from_packing_list_with_terms",
    {
      p_packing_list_id: packingListId,
      p_invoice_date: invoiceDate,
      p_brand_freight_allocations: freightAllocations,
      p_brand_dropship_allocations: dropshipAllocations,
      p_brand_tax_allocations: taxAllocations,
      p_payment_terms: paymentTerms,
      p_payment_days: paymentDays,
      p_customer_freight_charge: customerFreightCharge,
    },
  );
  if (error)
    redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);

  const invoiceIds = Array.isArray(data)
    ? data.map(String).filter(Boolean)
    : [];
  if (invoiceIds.length === 0) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("No invoices were created from this packing list.")}`,
    );
  }
  redirect(
    `/?module=invoice-created&invoice_ids=${encodeURIComponent(invoiceIds.join(","))}`,
  );
}

async function recordInvoicePaymentAction(formData: FormData) {
  "use server";

  const invoiceId = textValue(formData, "invoice_id");
  const fallbackUrl = `/?module=ar&invoice=${invoiceId}`;
  const paymentDate =
    textValue(formData, "payment_date") ||
    new Date().toISOString().slice(0, 10);
  const paymentMethod = (textValue(formData, "payment_method") ||
    "check") as Database["public"]["Enums"]["customer_payment_method"];
  const customerPaymentAmount = Number(
    textValue(formData, "customer_payment_amount") || 0,
  );
  const creditMemoId = textValue(formData, "credit_memo_id") || undefined;
  const creditMemoAmount = Number(
    textValue(formData, "credit_memo_amount") || 0,
  );
  const waiverAmount = Number(textValue(formData, "waiver_amount") || 0);
  const waiverReason = textValue(formData, "waiver_reason") || undefined;
  const referenceNumber = textValue(formData, "reference_number") || undefined;
  const memo = textValue(formData, "memo") || undefined;
  const paymentDocuments = formData
    .getAll("payment_document_files")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (!invoiceId)
    redirect(
      "/?module=invoices&financial_tab=active&error=The%20invoice%20could%20not%20be%20identified.",
    );
  if (
    !Number.isFinite(customerPaymentAmount) ||
    customerPaymentAmount < 0 ||
    !Number.isFinite(creditMemoAmount) ||
    creditMemoAmount < 0 ||
    !Number.isFinite(waiverAmount) ||
    waiverAmount < 0 ||
    customerPaymentAmount + creditMemoAmount + waiverAmount <= 0
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Enter a customer payment, credit memo, waiver amount, or a combination.")}`,
    );
  }
  if (waiverAmount > 0 && !waiverReason?.trim()) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Enter a reason for the waived amount.")}`,
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: settlement, error } = await supabase.rpc(
    "record_invoice_settlement_with_waiver",
    {
      p_credit_memo_amount: creditMemoAmount,
      p_credit_memo_id: creditMemoId,
      p_customer_payment_amount: customerPaymentAmount,
      p_customer_invoice_id: invoiceId,
      p_memo: memo,
      p_payment_date: paymentDate,
      p_payment_method: paymentMethod,
      p_reference_number: referenceNumber,
      p_waiver_amount: waiverAmount,
      p_waiver_reason: waiverReason,
    },
  );

  if (error)
    redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
  const settlementResult = settlement as { payment_id?: string | null } | null;
  const paymentId = settlementResult?.payment_id ?? null;
  if (paymentDocuments.length > 0 && !paymentId) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Supporting documents can be attached only when a customer payment amount is due.")}`,
    );
  }
  if (paymentId) {
    for (const [index, paymentDocument] of paymentDocuments.entries()) {
      const safeName = paymentDocument.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storageBucket = "customer-attachments";
      const storagePath = `payments/${paymentId}/${Date.now()}-${index}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from(storageBucket)
        .upload(
          storagePath,
          new Uint8Array(await paymentDocument.arrayBuffer()),
          {
            contentType: paymentDocument.type || "application/octet-stream",
            upsert: false,
          },
        );

      if (uploadError) {
        redirect(
          `${fallbackUrl}&error=${encodeURIComponent(`Payment was recorded, but ${paymentDocument.name} could not be uploaded: ${uploadError.message}`)}`,
        );
      }

      const { error: attachmentError } = await supabase
        .from("attachment")
        .insert({
          category: "payment_supporting_document",
          content_type: paymentDocument.type || null,
          entity_id: paymentId,
          entity_type: "customer_payment",
          file_size: paymentDocument.size,
          original_file_name: paymentDocument.name,
          storage_bucket: storageBucket,
          storage_path: storagePath,
        });
      if (attachmentError) {
        redirect(
          `${fallbackUrl}&error=${encodeURIComponent(`Payment was recorded, but ${paymentDocument.name} could not be linked: ${attachmentError.message}`)}`,
        );
      }
    }
  }
  redirect(
    `/?module=invoices&financial_tab=active&notice=${encodeURIComponent(`Settlement recorded and applied to invoice ${invoiceId}.`)}`,
  );
}

async function createRgaFromOrderAction(formData: FormData) {
  "use server";

  const orderId = textValue(formData, "order_id");
  const fallbackUrl = `/?module=create-rga&order=${orderId}`;
  const resolution = textValue(formData, "requested_resolution_type");
  const reason = textValue(formData, "rga_reason_category");
  const selectedLineIds = formData
    .getAll("rga_line_id")
    .map(String)
    .filter(Boolean);
  const supportingDocuments = formData
    .getAll("rga_supporting_documents")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const validResolutions = ["credit", "replacement"] as const;
  const validReasons = [
    "buy_remorse",
    "product_defect",
    "freight_damage",
    "wrong_item",
    "shipping_error",
    "other",
  ] as const;

  if (
    !orderId ||
    !validResolutions.includes(
      resolution as (typeof validResolutions)[number],
    ) ||
    !validReasons.includes(reason as (typeof validReasons)[number])
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Select an RGA reason, one resolution, and at least one affected shipped item.")}`,
    );
  }
  if (selectedLineIds.length === 0) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Select at least one affected shipped item.")}`,
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: availableLines, error: availableLinesError } = await supabase
    .from("rga_available_sales_order_lines")
    .select(
      "sales_order_line_id, product_id, product_sku_snapshot, product_name_snapshot, brand_id_snapshot, brand_name_snapshot, quantity_shipped, previous_rga_quantity, available_rga_quantity",
    )
    .eq("sales_order_id", orderId);
  if (availableLinesError)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(availableLinesError.message)}`,
    );

  const availableByLineId = new Map(
    (availableLines ?? [])
      .filter((line) => line.sales_order_line_id)
      .map((line) => [line.sales_order_line_id!, line]),
  );
  const selectedLines = selectedLineIds.map((lineId) => {
    const line = availableByLineId.get(lineId);
    const quantity = Number(
      textValue(formData, `quantity_requested_${lineId}`),
    );
    return { line, quantity };
  });
  const invalidSelection = selectedLines.find(
    ({ line, quantity }) =>
      !line ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      quantity > Number(line.available_rga_quantity ?? 0),
  );
  if (invalidSelection) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Each selected line needs a requested quantity greater than zero and no greater than the available RGA quantity.")}`,
    );
  }

  const { data: rgaRows, error: rgaError } = await supabase.rpc(
    "create_order_rga_request" as never,
    {
      p_sales_order_id: orderId,
      p_rga_reason_category: reason,
      p_requested_resolution_type: resolution,
      p_return_required: formData.get("return_required") === "on",
      p_customer_pays_return_freight:
        formData.get("customer_pays_return_freight") === "on",
      p_issue_description: textValue(formData, "issue_description") || null,
      p_lines: selectedLines.map(({ line, quantity }) => ({
        sales_order_line_id: line!.sales_order_line_id,
        quantity_requested: quantity,
      })),
    } as never,
  );
  const rga = (rgaRows as { rga_id: string; rga_number: string }[] | null)?.[0];
  if (rgaError || !rga)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(rgaError?.message ?? "The RGA could not be created.")}`,
    );

  for (const [index, supportingDocument] of supportingDocuments.entries()) {
    const safeName = supportingDocument.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageBucket = "customer-attachments";
    const storagePath = `rga/${rga.rga_id}/${Date.now()}-${index}-${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from(storageBucket)
      .upload(
        storagePath,
        new Uint8Array(await supportingDocument.arrayBuffer()),
        {
          contentType: supportingDocument.type || "application/octet-stream",
          upsert: false,
        },
      );
    if (uploadError) {
      redirect(
        `/?module=rga&error=${encodeURIComponent(`RGA ${rga.rga_number} was created, but ${supportingDocument.name} could not be uploaded: ${uploadError.message}`)}`,
      );
    }

    const { error: attachmentError } = await supabase
      .from("attachment")
      .insert({
        category: "rga_supporting_document",
        content_type: supportingDocument.type || null,
        entity_id: rga.rga_id,
        entity_type: "rga",
        file_size: supportingDocument.size,
        original_file_name: supportingDocument.name,
        storage_bucket: storageBucket,
        storage_path: storagePath,
      });
    if (attachmentError) {
      redirect(
        `/?module=rga&error=${encodeURIComponent(`RGA ${rga.rga_number} was created, but ${supportingDocument.name} could not be linked: ${attachmentError.message}`)}`,
      );
    }
  }

  const documentNotice =
    supportingDocuments.length > 0
      ? ` ${supportingDocuments.length} supporting file${supportingDocuments.length === 1 ? " was" : "s were"} attached.`
      : "";
  redirect(
    `/?module=rga&notice=${encodeURIComponent(`RGA ${rga.rga_number} was created and is pending review.${documentNotice}`)}`,
  );
}

async function reviewRgaAction(formData: FormData) {
  "use server";

  const rgaId = textValue(formData, "rga_id");
  const decision = textValue(formData, "review_decision");
  const approvedResolutionType = textValue(
    formData,
    "approved_resolution_type",
  );
  const reviewNotes = textValue(formData, "review_notes");
  const fallbackUrl = `/?module=rga-solution&rga=${rgaId}`;

  if (!rgaId || !["approve", "reject"].includes(decision)) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Choose Approve or Reject to complete the review.")}`,
    );
  }
  if (decision === "reject" && !reviewNotes) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Enter a review note when rejecting an RGA.")}`,
    );
  }
  if (
    decision === "approve" &&
    !["credit", "replacement"].includes(approvedResolutionType)
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Choose Credit or Replacement before approving an RGA.")}`,
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc(
    "review_rga_request" as never,
    {
      p_rga_id: rgaId,
      p_decision: decision,
      p_approved_resolution_type:
        decision === "approve" ? approvedResolutionType : null,
      p_review_notes: reviewNotes || null,
      p_reviewed_by_user_id: null,
    } as never,
  );
  const updatedRga = (data as { rga_number: string }[] | null)?.[0];
  if (error || !updatedRga) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(error?.message ?? "The RGA review could not be saved.")}`,
    );
  }

  const message =
    decision === "approve"
      ? `RGA ${updatedRga.rga_number} was approved for ${label(approvedResolutionType)}.`
      : `RGA ${updatedRga.rga_number} was rejected and its quantities are available for a future request.`;
  redirect(`${fallbackUrl}&notice=${encodeURIComponent(message)}`);
}

async function issueRgaCreditMemoAction(formData: FormData) {
  "use server";

  const rgaId = textValue(formData, "rga_id");
  const fallbackUrl = `/?module=rga-solution&rga=${rgaId}`;
  if (!rgaId) {
    redirect(
      "/?module=rga&error=Select an approved RGA before issuing a credit memo.",
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc(
    "issue_rga_credit_memos" as never,
    {
      p_rga_id: rgaId,
    } as never,
  );
  const createdMemos = (data as { credit_memo_number: string }[] | null) ?? [];

  if (error || createdMemos.length === 0) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(error?.message ?? "Unable to issue the RGA credit memo.")}`,
    );
  }

  redirect(
    `${fallbackUrl}&notice=${encodeURIComponent(`${createdMemos.length} brand-specific credit memo${createdMemos.length === 1 ? " was" : "s were"} issued.`)}`,
  );
}

async function createRgaReplacementOrderAction(formData: FormData) {
  "use server";

  const rgaId = textValue(formData, "rga_id");
  const fallbackUrl = `/?module=rga-detail&rga=${rgaId}`;
  if (!rgaId) {
    redirect(
      "/?module=rga&error=Select an approved RGA before creating a replacement order.",
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc(
    "create_rga_replacement_order" as never,
    {
      p_rga_id: rgaId,
    } as never,
  );
  const replacementOrder = (
    data as { sales_order_id: string; sales_order_number: string }[] | null
  )?.[0];

  if (error || !replacementOrder) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(error?.message ?? "Unable to create the RGA replacement order.")}`,
    );
  }

  redirect(
    `/?module=orders&order=${encodeURIComponent(replacementOrder.sales_order_id)}&notice=${encodeURIComponent(`Replacement order ${replacementOrder.sales_order_number} was created from RGA ${rgaId}.`)}`,
  );
}

async function prepareInvoiceConfirmationAction(formData: FormData) {
  "use server";

  const packingListId = textValue(formData, "packing_list_id");
  const invoiceDate =
    textValue(formData, "invoice_date") ||
    new Date().toISOString().slice(0, 10);
  const paymentTerms = textValue(formData, "payment_terms") || "Upon Receipt";
  const paymentDays = Number(textValue(formData, "payment_days"));
  const customerFreightCharge = Number(
    textValue(formData, "customer_freight_charge"),
  );
  const fallbackUrl = `/?module=invoice-create&packing_list=${packingListId}`;
  if (
    !packingListId ||
    !Number.isInteger(paymentDays) ||
    paymentDays < 0 ||
    !Number.isFinite(customerFreightCharge) ||
    customerFreightCharge < 0
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Enter valid payment terms and a non-negative customer freight charge.")}`,
    );
  }

  const brandIds = formData.getAll("brand_id").map(String).filter(Boolean);
  const freightAllocations = Object.fromEntries(
    brandIds.map((brandId) => [
      brandId,
      Number(textValue(formData, `freight_${brandId}`) || 0),
    ]),
  ) as Record<string, number>;
  const dropshipAllocations = Object.fromEntries(
    brandIds.map((brandId) => [
      brandId,
      Number(textValue(formData, `dropship_${brandId}`) || 0),
    ]),
  ) as Record<string, number>;
  const taxAllocations = Object.fromEntries(
    brandIds.map((brandId) => [
      brandId,
      Number(textValue(formData, `tax_${brandId}`) || 0),
    ]),
  ) as Record<string, number>;
  if (brandIds.length === 1)
    freightAllocations[brandIds[0]] = customerFreightCharge;
  const allAmounts = [
    ...Object.values(freightAllocations),
    ...Object.values(dropshipAllocations),
    ...Object.values(taxAllocations),
  ];
  if (allAmounts.some((amount) => !Number.isFinite(amount) || amount < 0)) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Freight, drop-ship, and tax amounts must be zero or greater.")}`,
    );
  }
  if (
    brandIds.length > 1 &&
    Object.values(freightAllocations).reduce(
      (total, amount) => total + amount,
      0,
    ) !== customerFreightCharge
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Manual brand freight allocations must equal the customer freight charge.")}`,
    );
  }

  const params = new URLSearchParams({
    module: "invoice-confirm",
    packing_list: packingListId,
    invoice_date: invoiceDate,
    invoice_payment_terms: paymentTerms,
    invoice_payment_days: String(paymentDays),
    invoice_customer_freight: String(customerFreightCharge),
    invoice_freight_allocations: JSON.stringify(freightAllocations),
    invoice_dropship_allocations: JSON.stringify(dropshipAllocations),
    invoice_tax_allocations: JSON.stringify(taxAllocations),
  });
  redirect(`/?${params.toString()}`);
}

async function updatePackingListFreightChargeAction(formData: FormData) {
  "use server";

  const packingListId = textValue(formData, "packing_list_id");
  const customerId = textValue(formData, "customer_id");
  const isFreeFreight = formData.get("is_free_freight") === "on";
  const freightCharge = isFreeFreight
    ? 0
    : Number(textValue(formData, "shipping_fee"));
  const returnUrl = `/?customer=${customerId}&tab=shipments`;
  if (
    !packingListId ||
    !customerId ||
    !Number.isFinite(freightCharge) ||
    freightCharge < 0
  ) {
    redirect(
      `${returnUrl}&error=${encodeURIComponent("Enter a valid non-negative freight charge.")}`,
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: packingList, error: packingListError } = await supabase
    .from("packing_list")
    .select("id, invoice_generation_status_snapshot")
    .eq("id", packingListId)
    .eq("customer_account_id", customerId)
    .maybeSingle();
  if (packingListError || !packingList)
    redirect(
      `${returnUrl}&error=${encodeURIComponent(packingListError?.message ?? "Packing list not found.")}`,
    );
  if (packingList.invoice_generation_status_snapshot !== "not_invoiced") {
    redirect(
      `${returnUrl}&error=${encodeURIComponent("Freight charge can only be changed before invoice creation.")}`,
    );
  }

  const { error } = await supabase
    .from("packing_list")
    .update({ shipping_fee: freightCharge })
    .eq("id", packingListId);
  if (error)
    redirect(`${returnUrl}&error=${encodeURIComponent(error.message)}`);
  redirect(
    `${returnUrl}&notice=${encodeURIComponent("Customer freight charge updated.")}`,
  );
}

async function updatePendingPackingListLinesAction(formData: FormData) {
  "use server";

  const orderId = textValue(formData, "order_id");
  const shipmentId = textValue(formData, "shipment_id");
  const packingListId = textValue(formData, "packing_list_id");
  const fallbackUrl = `/?module=shipment-create&order=${orderId}&shipment=${shipmentId}`;
  if (!orderId || !shipmentId || !packingListId)
    redirect(
      "/?module=shipping&error=The%20packing%20list%20could%20not%20be%20identified.",
    );

  const supabase = createSupabaseAdminClient();
  const [
    { data: packingList, error: packingListError },
    { data: shipment, error: shipmentError },
    { data: packingLines, error: packingLinesError },
    { data: orderLines, error: orderLinesError },
  ] = await Promise.all([
    supabase
      .from("packing_list")
      .select("id, status")
      .eq("id", packingListId)
      .eq("freight_shipment_id", shipmentId)
      .maybeSingle(),
    supabase
      .from("freight_shipment")
      .select("id, status")
      .eq("id", shipmentId)
      .maybeSingle(),
    supabase
      .from("packing_list_line")
      .select("id, sales_order_line_id, product_id, product_sku_snapshot")
      .eq("packing_list_id", packingListId),
    supabase
      .from("sales_order_line")
      .select(
        "id, product_id, quantity_ordered, quantity_shipped, quantity_cancelled",
      )
      .eq("sales_order_id", orderId),
  ]);
  const failure = [
    packingListError,
    shipmentError,
    packingLinesError,
    orderLinesError,
  ].find(Boolean);
  if (failure)
    redirect(`${fallbackUrl}&error=${encodeURIComponent(failure.message)}`);
  if (
    !packingList ||
    packingList.status !== "draft" ||
    !shipment ||
    !["pending", "in_progress"].includes(shipment.status)
  )
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Only a pending shipment with a draft packing list can be adjusted.")}`,
    );

  const orderLineById = new Map(
    (orderLines ?? []).map((line) => [line.id, line]),
  );
  const productIds = [
    ...new Set((packingLines ?? []).map((line) => line.product_id)),
  ];
  const packingLineIds = (packingLines ?? []).map((line) => line.id);
  const [inventoryResult, boxesResult, allocationsResult] = productIds.length
    ? await Promise.all([
        supabase
          .from("inventory_balance")
          .select(
            "id, product_id, product_packing_box_id, warehouse_id, warehouse_location_id, quantity_available",
          )
          .in("product_id", productIds)
          .eq("inventory_condition", "regular"),
        supabase
          .from("product_packing_box")
          .select(
            "id, product_id, box_sequence, box_label, box_length, box_width, box_height, net_weight, gross_weight",
          )
          .in("product_id", productIds)
          .eq("is_active", true)
          .eq("is_required_for_sale", true),
        packingLineIds.length
          ? supabase
              .from("packing_list_line_box")
              .select("id, packing_list_line_id, inventory_balance_id")
              .in("packing_list_line_id", packingLineIds)
          : Promise.resolve({ data: [], error: null }),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
        { data: [], error: null },
      ];
  if (inventoryResult.error || boxesResult.error || allocationsResult.error)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(inventoryResult.error?.message ?? boxesResult.error?.message ?? allocationsResult.error?.message ?? "Unable to load shipment inventory.")}`,
    );

  const inventoryByProduct = new Map<string, typeof inventoryResult.data>();
  for (const inventory of inventoryResult.data ?? []) {
    const rows = inventoryByProduct.get(inventory.product_id) ?? [];
    rows.push(inventory);
    inventoryByProduct.set(inventory.product_id, rows);
  }
  const boxesByProduct = new Map<string, typeof boxesResult.data>();
  for (const box of boxesResult.data ?? []) {
    const rows = boxesByProduct.get(box.product_id) ?? [];
    rows.push(box);
    boxesByProduct.set(box.product_id, rows);
  }
  const selectedByBalanceId = new Map<string, number>();
  const adjustments = (packingLines ?? []).map((line) => {
    const requestedQuantity = Number(
      textValue(formData, `packing_quantity_${line.id}`) || 0,
    );
    const orderLine = orderLineById.get(line.sales_order_line_id);
    const remainingQuantity = orderLine
      ? Math.max(
          0,
          Number(orderLine.quantity_ordered) -
            Number(orderLine.quantity_shipped) -
            Number(orderLine.quantity_cancelled ?? 0),
        )
      : 0;
    const requiredBoxes = boxesByProduct.get(line.product_id) ?? [];
    const allocations = (inventoryByProduct.get(line.product_id) ?? []).flatMap(
      (inventory) => {
        if (
          requiredBoxes.length &&
          (!inventory.product_packing_box_id ||
            !requiredBoxes.some(
              (box) => box.id === inventory.product_packing_box_id,
            ))
        )
          return [];
        if (!requiredBoxes.length && inventory.product_packing_box_id)
          return [];
        const quantity = Number(
          textValue(formData, `packing_balance_${line.id}_${inventory.id}`) ||
            0,
        );
        if (quantity > 0)
          selectedByBalanceId.set(
            inventory.id,
            (selectedByBalanceId.get(inventory.id) ?? 0) + quantity,
          );
        return quantity > 0 ? [{ ...inventory, quantity }] : [];
      },
    );
    const quantityByBox = new Map<string, number>();
    for (const allocation of allocations) {
      if (allocation.product_packing_box_id)
        quantityByBox.set(
          allocation.product_packing_box_id,
          (quantityByBox.get(allocation.product_packing_box_id) ?? 0) +
            allocation.quantity,
        );
    }
    const allocatedQuantity = requiredBoxes.length
      ? (quantityByBox.get(requiredBoxes[0]?.id ?? "") ?? 0)
      : allocations.reduce((sum, allocation) => sum + allocation.quantity, 0);
    return {
      ...line,
      requestedQuantity,
      remainingQuantity,
      requiredBoxes,
      allocations,
      quantityByBox,
      allocatedQuantity,
    };
  });
  const inventoryById = new Map(
    (inventoryResult.data ?? []).map((inventory) => [inventory.id, inventory]),
  );
  const invalidLine = adjustments.find(
    (line) =>
      !Number.isInteger(line.requestedQuantity) ||
      line.requestedQuantity < 0 ||
      line.requestedQuantity > line.remainingQuantity ||
      line.requestedQuantity !== line.allocatedQuantity ||
      line.allocations.some(
        (allocation) =>
          !Number.isInteger(allocation.quantity) ||
          allocation.quantity > Number(allocation.quantity_available),
      ) ||
      (line.requiredBoxes.length > 0 &&
        line.requiredBoxes.some(
          (box) =>
            (line.quantityByBox.get(box.id) ?? 0) !== line.requestedQuantity,
        )),
  );
  const overAllocatedBalance = [...selectedByBalanceId.entries()].find(
    ([inventoryBalanceId, quantity]) =>
      quantity >
      Number(inventoryById.get(inventoryBalanceId)?.quantity_available ?? 0),
  );
  if (invalidLine || overAllocatedBalance)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(`Check the warehouse/bin quantities. Each required box for ${invalidLine?.product_sku_snapshot ?? "an item"} must have the same total as Quantity to Ship.`)}`,
    );
  if (!adjustments.some((line) => line.requestedQuantity > 0))
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("At least one packing-list line must have a shipment quantity.")}`,
    );

  const existingAllocationByLineAndBalance = new Map(
    (allocationsResult.data ?? [])
      .filter((allocation) => allocation.inventory_balance_id)
      .map((allocation) => [
        `${allocation.packing_list_line_id}:${allocation.inventory_balance_id}`,
        allocation,
      ]),
  );
  const boxById = new Map((boxesResult.data ?? []).map((box) => [box.id, box]));
  for (const line of adjustments) {
    if (line.requestedQuantity === 0) {
      const { error } = await supabase
        .from("packing_list_line")
        .delete()
        .eq("id", line.id);
      if (error)
        redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
      continue;
    }
    const { error: lineError } = await supabase
      .from("packing_list_line")
      .update({ quantity_shipped: line.requestedQuantity })
      .eq("id", line.id);
    if (lineError)
      redirect(`${fallbackUrl}&error=${encodeURIComponent(lineError.message)}`);
    const desiredKeys = new Set(
      line.allocations.map((allocation) => `${line.id}:${allocation.id}`),
    );
    const staleAllocationIds = (allocationsResult.data ?? [])
      .filter(
        (allocation) =>
          allocation.packing_list_line_id === line.id &&
          (!allocation.inventory_balance_id ||
            !desiredKeys.has(`${line.id}:${allocation.inventory_balance_id}`)),
      )
      .map((allocation) => allocation.id);
    if (staleAllocationIds.length) {
      const { error } = await supabase
        .from("packing_list_line_box")
        .delete()
        .in("id", staleAllocationIds);
      if (error)
        redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
    }
    for (const allocation of line.allocations) {
      const key = `${line.id}:${allocation.id}`;
      const existing = existingAllocationByLineAndBalance.get(key);
      if (existing) {
        const { error } = await supabase
          .from("packing_list_line_box")
          .update({ box_quantity_shipped: allocation.quantity })
          .eq("id", existing.id);
        if (error)
          redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
        continue;
      }
      const box = allocation.product_packing_box_id
        ? boxById.get(allocation.product_packing_box_id)
        : null;
      const { error } = await supabase.from("packing_list_line_box").insert({
        box_height_snapshot: box?.box_height ?? null,
        box_label_snapshot: box?.box_label ?? "No packing box",
        box_length_snapshot: box?.box_length ?? null,
        box_quantity_shipped: allocation.quantity,
        box_sequence_snapshot: box?.box_sequence ?? 1,
        box_width_snapshot: box?.box_width ?? null,
        gross_weight_snapshot: box?.gross_weight ?? null,
        inventory_balance_id: allocation.id,
        net_weight_snapshot: box?.net_weight ?? null,
        packing_list_line_id: line.id,
        product_id: line.product_id,
        product_packing_box_id: allocation.product_packing_box_id,
        warehouse_id: allocation.warehouse_id,
        warehouse_location_id: allocation.warehouse_location_id,
      });
      if (error)
        redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
    }
  }
  redirect(
    `${fallbackUrl}&notice=${encodeURIComponent("Draft packing-list quantities and warehouse/bin picks updated.")}`,
  );
}

async function addPendingPackingListLinesAction(formData: FormData) {
  "use server";

  const orderId = textValue(formData, "order_id");
  const shipmentId = textValue(formData, "shipment_id");
  const packingListId = textValue(formData, "packing_list_id");
  const fallbackUrl = `/?module=shipment-create&order=${orderId}&shipment=${shipmentId}&shipment_edit=lines`;
  if (!orderId || !shipmentId || !packingListId)
    redirect(
      "/?module=shipping&error=The%20packing%20list%20could%20not%20be%20identified.",
    );

  const supabase = createSupabaseAdminClient();
  const [
    packingListResult,
    shipmentResult,
    existingLinesResult,
    orderLinesResult,
  ] = await Promise.all([
    supabase
      .from("packing_list")
      .select("id, status")
      .eq("id", packingListId)
      .eq("freight_shipment_id", shipmentId)
      .maybeSingle(),
    supabase
      .from("freight_shipment")
      .select("id, status")
      .eq("id", shipmentId)
      .maybeSingle(),
    supabase
      .from("packing_list_line")
      .select("sales_order_line_id")
      .eq("packing_list_id", packingListId),
    supabase
      .from("sales_order_line")
      .select(
        "id, product_id, brand_id_snapshot, brand_name_snapshot, product_sku_snapshot, product_name_snapshot, quantity_ordered, quantity_shipped, quantity_cancelled, unit_price, discount_percent",
      )
      .eq("sales_order_id", orderId),
  ]);
  const failure = [
    packingListResult,
    shipmentResult,
    existingLinesResult,
    orderLinesResult,
  ].find((result) => result.error);
  if (failure?.error)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(failure.error.message)}`,
    );
  if (
    !packingListResult.data ||
    packingListResult.data.status !== "draft" ||
    !shipmentResult.data ||
    !["pending", "in_progress"].includes(shipmentResult.data.status)
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Only a pending shipment with a draft packing list can receive additional items.")}`,
    );
  }

  const existingOrderLineIds = new Set(
    (existingLinesResult.data ?? []).map((line) => line.sales_order_line_id),
  );
  const eligibleOrderLines = (orderLinesResult.data ?? []).filter(
    (line) =>
      !existingOrderLineIds.has(line.id) &&
      Number(line.quantity_ordered) >
        Number(line.quantity_shipped) + Number(line.quantity_cancelled ?? 0),
  );
  const productIds = [
    ...new Set(eligibleOrderLines.map((line) => line.product_id)),
  ];
  const [inventoryResult, boxesResult] = productIds.length
    ? await Promise.all([
        supabase
          .from("inventory_balance")
          .select(
            "id, product_id, product_packing_box_id, warehouse_id, warehouse_location_id, quantity_available",
          )
          .in("product_id", productIds)
          .eq("inventory_condition", "regular")
          .gt("quantity_available", 0),
        supabase
          .from("product_packing_box")
          .select(
            "id, product_id, box_sequence, box_label, box_length, box_width, box_height, net_weight, gross_weight",
          )
          .in("product_id", productIds)
          .eq("is_active", true)
          .eq("is_required_for_sale", true),
      ])
    : [
        { data: [], error: null },
        { data: [], error: null },
      ];
  if (inventoryResult.error || boxesResult.error)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(inventoryResult.error?.message ?? boxesResult.error?.message ?? "Unable to load available inventory.")}`,
    );

  const inventoryByProduct = new Map<string, typeof inventoryResult.data>();
  for (const inventory of inventoryResult.data ?? []) {
    const rows = inventoryByProduct.get(inventory.product_id) ?? [];
    rows.push(inventory);
    inventoryByProduct.set(inventory.product_id, rows);
  }
  const boxesByProduct = new Map<string, typeof boxesResult.data>();
  for (const box of boxesResult.data ?? []) {
    const rows = boxesByProduct.get(box.product_id) ?? [];
    rows.push(box);
    boxesByProduct.set(box.product_id, rows);
  }

  const selectedLines = eligibleOrderLines.flatMap((line) => {
    const requiredBoxes = boxesByProduct.get(line.product_id) ?? [];
    const allocations = (inventoryByProduct.get(line.product_id) ?? []).flatMap(
      (inventory) => {
        const usesRequiredBoxes = requiredBoxes.length > 0;
        if (
          usesRequiredBoxes &&
          (!inventory.product_packing_box_id ||
            !requiredBoxes.some(
              (box) => box.id === inventory.product_packing_box_id,
            ))
        )
          return [];
        if (!usesRequiredBoxes && inventory.product_packing_box_id) return [];
        const quantity = Number(
          textValue(
            formData,
            `additional_shipment_balance_${line.id}_${inventory.id}`,
          ) || 0,
        );
        return quantity > 0 ? [{ ...inventory, quantity }] : [];
      },
    );
    if (!allocations.length) return [];
    const quantityByBox = new Map<string, number>();
    for (const allocation of allocations) {
      if (allocation.product_packing_box_id)
        quantityByBox.set(
          allocation.product_packing_box_id,
          (quantityByBox.get(allocation.product_packing_box_id) ?? 0) +
            allocation.quantity,
        );
    }
    const requestedQuantity = requiredBoxes.length
      ? (quantityByBox.get(requiredBoxes[0].id) ?? 0)
      : allocations.reduce((sum, allocation) => sum + allocation.quantity, 0);
    const remainingQuantity = Math.max(
      0,
      Number(line.quantity_ordered) -
        Number(line.quantity_shipped) -
        Number(line.quantity_cancelled ?? 0),
    );
    return [
      {
        ...line,
        allocations,
        requiredBoxes,
        quantityByBox,
        requestedQuantity,
        remainingQuantity,
      },
    ];
  });

  if (!selectedLines.length)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Choose a warehouse/bin quantity for at least one additional item.")}`,
    );
  const invalidLine = selectedLines.find(
    (line) =>
      !line.brand_id_snapshot ||
      !Number.isInteger(line.requestedQuantity) ||
      line.requestedQuantity <= 0 ||
      line.requestedQuantity > line.remainingQuantity ||
      line.allocations.some(
        (allocation) =>
          !Number.isInteger(allocation.quantity) ||
          allocation.quantity > Number(allocation.quantity_available),
      ) ||
      (line.requiredBoxes.length > 0 &&
        line.requiredBoxes.some(
          (box) =>
            (line.quantityByBox.get(box.id) ?? 0) !== line.requestedQuantity,
        )),
  );
  if (invalidLine)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(`Check the box/location quantities for ${invalidLine.product_sku_snapshot}. Every required box must use the same shipment quantity.`)}`,
    );

  const { data: packingLines, error: packingLinesError } = await supabase
    .from("packing_list_line")
    .insert(
      selectedLines.map((line) => ({
        brand_id_snapshot: String(line.brand_id_snapshot),
        brand_name_snapshot: line.brand_name_snapshot,
        discount_percent_snapshot: Number(line.discount_percent),
        packing_list_id: packingListId,
        product_id: line.product_id,
        product_name_snapshot: line.product_name_snapshot,
        product_sku_snapshot: line.product_sku_snapshot,
        quantity_ordered_snapshot: Number(line.quantity_ordered),
        quantity_previously_shipped_snapshot: Number(line.quantity_shipped),
        quantity_shipped: line.requestedQuantity,
        sales_order_line_id: line.id,
        unit_price_snapshot: Number(line.unit_price),
      })),
    )
    .select("id, sales_order_line_id");
  if (packingLinesError)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(packingLinesError.message)}`,
    );

  const packingLineIdByOrderLine = new Map(
    (packingLines ?? []).map((line) => [line.sales_order_line_id, line.id]),
  );
  const boxById = new Map((boxesResult.data ?? []).map((box) => [box.id, box]));
  const allocationRows = selectedLines.flatMap((line) =>
    line.allocations.flatMap((allocation) => {
      const packingListLineId = packingLineIdByOrderLine.get(line.id);
      if (!packingListLineId) return [];
      const box = allocation.product_packing_box_id
        ? boxById.get(allocation.product_packing_box_id)
        : null;
      return {
        box_height_snapshot: box?.box_height ?? null,
        box_label_snapshot: box?.box_label ?? "No packing box",
        box_length_snapshot: box?.box_length ?? null,
        box_quantity_shipped: allocation.quantity,
        box_sequence_snapshot: box?.box_sequence ?? 1,
        box_width_snapshot: box?.box_width ?? null,
        gross_weight_snapshot: box?.gross_weight ?? null,
        inventory_balance_id: allocation.id,
        net_weight_snapshot: box?.net_weight ?? null,
        packing_list_line_id: packingListLineId,
        product_id: line.product_id,
        product_packing_box_id: allocation.product_packing_box_id,
        warehouse_id: allocation.warehouse_id,
        warehouse_location_id: allocation.warehouse_location_id,
      };
    }),
  );
  const { error: allocationsError } = await supabase
    .from("packing_list_line_box")
    .insert(allocationRows);
  if (allocationsError) {
    await supabase
      .from("packing_list_line")
      .delete()
      .eq("packing_list_id", packingListId)
      .in(
        "sales_order_line_id",
        selectedLines.map((line) => line.id),
      );
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(allocationsError.message)}`,
    );
  }

  redirect(
    `${fallbackUrl}&notice=${encodeURIComponent("Additional order items were added to the draft packing list.")}`,
  );
}

async function updateShipmentDetailsAction(formData: FormData) {
  "use server";

  const orderId = textValue(formData, "order_id");
  const shipmentId = textValue(formData, "shipment_id");
  const fallbackUrl = `/?module=shipment-create&order=${orderId}&shipment=${shipmentId}`;
  if (!orderId || !shipmentId)
    redirect(
      "/?module=shipping&error=The%20shipment%20could%20not%20be%20identified.",
    );

  const freightCostText = textValue(formData, "freight_cost");
  const freightChargeText = textValue(formData, "shipping_fee");
  const freightCost = freightCostText === "" ? 0 : Number(freightCostText);
  const isFreeFreight = formData.get("is_free_freight") === "on";
  const shippingFee = isFreeFreight
    ? 0
    : freightChargeText === ""
      ? freightCost
      : Number(freightChargeText);
  if (
    !Number.isFinite(freightCost) ||
    freightCost < 0 ||
    !Number.isFinite(shippingFee) ||
    shippingFee < 0
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Freight cost and customer freight charge must be valid non-negative amounts.")}`,
    );
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("freight_shipment")
    .update({
      carrier: textValue(formData, "carrier") || null,
      freight_cost: freightCost,
      master_tracking_number:
        textValue(formData, "master_tracking_number") || null,
      notes: textValue(formData, "shipment_notes") || null,
      shipping_type: (textValue(formData, "shipping_type") || null) as
        | Database["public"]["Enums"]["shipping_type"]
        | null,
    })
    .eq("id", shipmentId);
  if (error)
    redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
  const { error: packingListError } = await supabase
    .from("packing_list")
    .update({ allocated_freight_cost: freightCost, shipping_fee: shippingFee })
    .eq("freight_shipment_id", shipmentId)
    .eq("status", "draft")
    .eq("invoice_generation_status_snapshot", "not_invoiced");
  if (packingListError)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(packingListError.message)}`,
    );
  redirect(
    `${fallbackUrl}&notice=${encodeURIComponent("Shipment details updated.")}`,
  );
}

async function uploadShipmentDocumentAction(formData: FormData) {
  "use server";

  const orderId = textValue(formData, "order_id");
  const shipmentId = textValue(formData, "shipment_id");
  const documentType = textValue(formData, "shipping_document_type") || "other";
  const shipmentDocument = formData.get("shipping_document_file");
  const fallbackUrl = `/?module=shipment-create&order=${orderId}&shipment=${shipmentId}`;
  if (
    !orderId ||
    !shipmentId ||
    !(shipmentDocument instanceof File) ||
    shipmentDocument.size === 0
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Choose a shipping document to upload.")}`,
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data: shipment, error: shipmentError } = await supabase
    .from("freight_shipment")
    .select("id")
    .eq("id", shipmentId)
    .maybeSingle();
  if (shipmentError || !shipment)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(shipmentError?.message ?? "Shipment not found.")}`,
    );

  const safeName = shipmentDocument.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageBucket = "customer-attachments";
  const storagePath = `shipping/${shipmentId}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from(storageBucket)
    .upload(storagePath, new Uint8Array(await shipmentDocument.arrayBuffer()), {
      contentType: shipmentDocument.type || "application/octet-stream",
      upsert: false,
    });
  if (uploadError)
    redirect(`${fallbackUrl}&error=${encodeURIComponent(uploadError.message)}`);

  const { data: attachment, error: attachmentError } = await supabase
    .from("attachment")
    .insert({
      category: `shipping_${documentType}`,
      content_type: shipmentDocument.type || null,
      entity_id: shipmentId,
      entity_type: "freight_shipment",
      file_size: shipmentDocument.size,
      original_file_name: shipmentDocument.name,
      storage_bucket: storageBucket,
      storage_path: storagePath,
    })
    .select("id")
    .single();
  if (attachmentError || !attachment)
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(attachmentError?.message ?? "Document record could not be created.")}`,
    );

  if (documentType === "bol") {
    const { error: bolError } = await supabase
      .from("freight_shipment")
      .update({ bol_document_file_id: attachment.id })
      .eq("id", shipmentId);
    if (bolError)
      redirect(`${fallbackUrl}&error=${encodeURIComponent(bolError.message)}`);
  }
  redirect(
    `${fallbackUrl}&notice=${encodeURIComponent("Shipping document uploaded.")}`,
  );
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
  const modulePrefix =
    returnModule === "obsolete-customers" ? "/?module=obsolete-customers" : "/";
  const querySuffix = query
    ? `${returnModule === "obsolete-customers" ? "&" : "?"}q=${encodeURIComponent(query)}`
    : "";
  const messagePrefix = `${modulePrefix}${querySuffix ? querySuffix : ""}${querySuffix ? "&" : modulePrefix.includes("?") ? "&" : "?"}`;

  if (customerIds.length === 0) {
    redirect(
      `${messagePrefix}error=${encodeURIComponent("Please select at least one customer to delete.")}`,
    );
  }

  const { error } = await supabase
    .from("customer_account")
    .update({ status: "obsolete" as "inactive" })
    .in("id", customerIds);

  if (error) {
    redirect(`${messagePrefix}error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `${messagePrefix}notice=${encodeURIComponent(
      `${customerIds.length} customer record${customerIds.length === 1 ? "" : "s"} moved to Obsolete Accounts.`,
    )}`,
  );
}

async function deleteProductsAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productIds = formData
    .getAll("product_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const returnModule = String(
    formData.get("return_module") ?? "products",
  ).trim();
  const returnParams = new URLSearchParams({
    module:
      returnModule === "discontinued-products"
        ? "discontinued-products"
        : "products",
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
    "product_style",
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

  const { error } = await supabase
    .from("product")
    .update({ status: "deleted" })
    .in("id", productIds);

  if (error) {
    returnParams.set("error", error.message);
    redirect(`/?${returnParams.toString()}`);
  }

  returnParams.set(
    "notice",
    `${productIds.length} product record${productIds.length === 1 ? "" : "s"} moved to Deleted Products.`,
  );
  redirect(`/?${returnParams.toString()}`);
}

async function uploadCustomerAttachmentAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const category =
    String(formData.get("category") ?? "").trim() || "account_document";
  const attachmentFile = formData.get("attachment_file");

  if (
    !customerId ||
    !(attachmentFile instanceof File) ||
    attachmentFile.size === 0
  ) {
    redirect(
      `/?customer=${customerId}&tab=attachments&error=${encodeURIComponent("Please select a document to upload.")}`,
    );
  }

  const safeName = attachmentFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `customer-account/${customerId}/${Date.now()}-${safeName}`;
  const fileBody = new Uint8Array(await attachmentFile.arrayBuffer());
  const bucketName = "customer-attachments";

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, fileBody, {
      contentType: attachmentFile.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    redirect(
      `/?customer=${customerId}&tab=attachments&error=${encodeURIComponent(uploadError.message)}`,
    );
  }

  const { error: attachmentError } = await supabase.from("attachment").insert({
    category,
    content_type: attachmentFile.type || null,
    entity_id: customerId,
    entity_type: "customer_account",
    file_size: attachmentFile.size,
    original_file_name: attachmentFile.name,
    storage_bucket: bucketName,
    storage_path: storagePath,
  });

  if (attachmentError) {
    redirect(
      `/?customer=${customerId}&tab=attachments&error=${encodeURIComponent(attachmentError.message)}`,
    );
  }

  redirect(
    `/?customer=${customerId}&tab=attachments&notice=${encodeURIComponent("Attachment uploaded.")}`,
  );
}

async function uploadProductDocumentAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const displayName = String(formData.get("display_name") ?? "").trim();
  const requestedType = String(formData.get("document_type") ?? "other").trim();
  const documentTypes: ProductDocumentType[] = [
    "spec_sheet",
    "installation_instruction",
    "manual",
    "box_label",
    "cad_drawing",
    "other",
  ];
  const documentType: ProductDocumentType = documentTypes.includes(
    requestedType as ProductDocumentType,
  )
    ? (requestedType as ProductDocumentType)
    : "other";
  const documentFile = formData.get("document_file");
  const baseUrl = `/?module=products&product=${productId}&product_tab=documents`;

  if (
    !productId ||
    !(documentFile instanceof File) ||
    documentFile.size === 0
  ) {
    redirect(
      `${baseUrl}&error=${encodeURIComponent("Please select a product document to upload.")}`,
    );
  }

  const safeName = documentFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `product/${productId}/${Date.now()}-${safeName}`;
  const fileBody = new Uint8Array(await documentFile.arrayBuffer());
  const bucketName = "product-documents";

  const { data: buckets, error: bucketsError } =
    await supabase.storage.listBuckets();

  if (bucketsError) {
    redirect(`${baseUrl}&error=${encodeURIComponent(bucketsError.message)}`);
  }

  if (!buckets?.some((bucket) => bucket.name === bucketName)) {
    const { error: createBucketError } = await supabase.storage.createBucket(
      bucketName,
      {
        public: false,
      },
    );

    if (createBucketError) {
      redirect(
        `${baseUrl}&error=${encodeURIComponent(createBucketError.message)}`,
      );
    }
  }

  const { data: uploadedFile, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, fileBody, {
      contentType: documentFile.type || "application/octet-stream",
      upsert: false,
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
      storage_path: storagePath,
    })
    .select("id")
    .single();

  if (attachmentError || !attachment) {
    redirect(
      `${baseUrl}&error=${encodeURIComponent(attachmentError?.message ?? "Unable to save product document file record.")}`,
    );
  }

  if (
    ["spec_sheet", "installation_instruction", "manual", "other"].includes(
      documentType,
    )
  ) {
    await supabase.from("product_document").insert({
      display_name: displayName || documentFile.name,
      document_type: documentType as
        | "spec_sheet"
        | "installation_instruction"
        | "manual"
        | "other",
      file_id: attachment.id,
      product_id: productId,
    });
  }

  redirect(
    `${baseUrl}&notice=${encodeURIComponent(`Product document uploaded: ${uploadedFile?.path ?? documentFile.name}`)}`,
  );
}

async function uploadProductImageAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const returnModule = String(formData.get("return_module") ?? "").trim();
  const returnToPart = returnModule === "product-parts";
  const displayName = String(formData.get("display_name") ?? "").trim();
  const requestedCategory = String(
    formData.get("image_category") ?? "stock",
  ).trim();
  const imageCategories: ProductImageCategory[] = [
    "stock",
    "detail",
    "lifestyle",
    "drawing",
    "other",
  ];
  const imageCategory: ProductImageCategory = imageCategories.includes(
    requestedCategory as ProductImageCategory,
  )
    ? (requestedCategory as ProductImageCategory)
    : "stock";
  const imageFile = formData.get("image_file");
  const baseUrl = `/?module=edit-product-images&product=${productId}&image_category=${imageCategory}${returnToPart ? "&return_module=product-parts" : ""}`;

  if (!productId || !(imageFile instanceof File) || imageFile.size === 0) {
    redirect(
      `${baseUrl}&error=${encodeURIComponent("Please select an image to upload.")}`,
    );
  }

  if (imageFile.size > 25 * 1024 * 1024) {
    redirect(
      `${baseUrl}&error=${encodeURIComponent("Image file is too large. Please upload an image smaller than 25 MB.")}`,
    );
  }

  const allowedImageTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
  ]);

  if (imageFile.type && !allowedImageTypes.has(imageFile.type)) {
    redirect(
      `${baseUrl}&error=${encodeURIComponent("Please upload a major image format such as JPG, PNG, WEBP, GIF, BMP, or TIFF.")}`,
    );
  }

  const bucketName = "product-images";
  const { data: buckets, error: bucketsError } =
    await supabase.storage.listBuckets();

  if (bucketsError) {
    redirect(`${baseUrl}&error=${encodeURIComponent(bucketsError.message)}`);
  }

  if (!buckets?.some((bucket) => bucket.name === bucketName)) {
    const { error: createBucketError } = await supabase.storage.createBucket(
      bucketName,
      { public: false },
    );

    if (createBucketError) {
      redirect(
        `${baseUrl}&error=${encodeURIComponent(createBucketError.message)}`,
      );
    }
  }

  const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `product/${productId}/${Date.now()}-${safeName}`;
  const fileBody = new Uint8Array(await imageFile.arrayBuffer());
  const { data: uploadedFile, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, fileBody, {
      contentType: imageFile.type || "application/octet-stream",
      upsert: false,
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
      storage_path: storagePath,
    })
    .select("id")
    .single();

  if (attachmentError || !attachment) {
    redirect(
      `${baseUrl}&error=${encodeURIComponent(attachmentError?.message ?? "Unable to save image file record.")}`,
    );
  }

  const { count, error: countError } = await supabase
    .from("product_image")
    .select("id", { count: "exact", head: true })
    .eq("product_id", productId)
    .eq("is_active", true);

  if (countError) {
    redirect(`${baseUrl}&error=${encodeURIComponent(countError.message)}`);
  }

  const shouldBeDefault =
    imageCategory === "stock" &&
    (formData.get("is_default_thumbnail") === "on" || (count ?? 0) === 0);

  if (shouldBeDefault) {
    await supabase
      .from("product_image")
      .update({ is_default_thumbnail: false })
      .eq("product_id", productId);
  }

  const { error: imageError } = await supabase.from("product_image").insert({
    display_name: displayName || imageFile.name,
    file_id: attachment.id,
    image_category: imageCategory,
    is_default_thumbnail: shouldBeDefault,
    product_id: productId,
    sort_order: ((count ?? 0) + 1) * 10,
  });

  if (imageError) {
    redirect(`${baseUrl}&error=${encodeURIComponent(imageError.message)}`);
  }

  redirect(
    `${baseUrl}&notice=${encodeURIComponent(`Product image uploaded: ${uploadedFile?.path ?? imageFile.name}`)}`,
  );
}

async function updateProductImagesAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const returnCategory = String(
    formData.get("return_image_category") ?? "stock",
  ).trim();
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
  const imageCategories: ProductImageCategory[] = [
    "stock",
    "detail",
    "lifestyle",
    "drawing",
    "other",
  ];
  const imageCategoryValue = (key: string): ProductImageCategory => {
    const value = optionalText(key);
    return imageCategories.includes(value as ProductImageCategory)
      ? (value as ProductImageCategory)
      : "stock";
  };
  const imageIds = formData
    .getAll("image_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const deletedImageIds = new Set(
    formData
      .getAll("delete_image_ids")
      .map((value) => String(value).trim())
      .filter(Boolean),
  );
  const defaultImageId = optionalText("default_thumbnail_image_id");

  if (defaultImageId && !deletedImageIds.has(defaultImageId)) {
    const defaultCategory = imageCategoryValue(
      `image_category_${defaultImageId}`,
    );

    if (defaultCategory !== "stock") {
      redirect(
        `${baseUrl}&error=${encodeURIComponent("Default thumbnail must be a stock image.")}`,
      );
    }

    const { error } = await supabase
      .from("product_image")
      .update({ is_default_thumbnail: false })
      .eq("product_id", productId);

    if (error) {
      redirect(`${baseUrl}&error=${encodeURIComponent(error.message)}`);
    }
  }

  for (const imageId of imageIds) {
    if (deletedImageIds.has(imageId)) {
      const { error } = await supabase
        .from("product_image")
        .update({
          deleted_at: new Date().toISOString(),
          is_active: false,
          is_default_thumbnail: false,
        })
        .eq("id", imageId)
        .eq("product_id", productId);

      if (error) {
        redirect(`${baseUrl}&error=${encodeURIComponent(error.message)}`);
      }

      continue;
    }

    const category = imageCategoryValue(`image_category_${imageId}`);
    const isDefaultThumbnail =
      defaultImageId === imageId && category === "stock";
    const sortOrderRaw = optionalText(`sort_order_${imageId}`);
    const sortOrder = sortOrderRaw ? Number(sortOrderRaw) : 100;
    const { error } = await supabase
      .from("product_image")
      .update({
        display_name: optionalText(`display_name_${imageId}`),
        image_category: category,
        is_default_thumbnail: isDefaultThumbnail,
        sort_order: Number.isFinite(sortOrder) ? sortOrder : 100,
      })
      .eq("id", imageId)
      .eq("product_id", productId);

    if (error) {
      redirect(`${baseUrl}&error=${encodeURIComponent(error.message)}`);
    }
  }

  redirect(
    `${baseUrl}&notice=${encodeURIComponent("Product images updated.")}`,
  );
}

async function updateAccountProfileAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const accountTypeId = String(formData.get("account_type_id") ?? "").trim();
  const businessTypeId = String(formData.get("business_type_id") ?? "").trim();

  if (!customerId || !name || !accountTypeId || !businessTypeId) {
    redirect(
      `/?module=edit-account-profile&customer=${customerId}&error=missing_required`,
    );
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const defaultDiscount = Number(formData.get("default_discount_percent") ?? 0);
  const statusValue = String(formData.get("status") ?? "active");
  const status = [
    "pending",
    "active",
    "inactive",
    "credit_hold",
    "obsolete",
  ].includes(statusValue)
    ? (statusValue as "pending" | "active" | "inactive" | "credit_hold")
    : "active";

  const { error } = await supabase
    .from("customer_account")
    .update({
      account_type_id: accountTypeId,
      business_type_id: businessTypeId,
      default_discount_percent: Number.isFinite(defaultDiscount)
        ? defaultDiscount
        : 0,
      is_sales_tax_exempt: formData.get("is_sales_tax_exempt") === "on",
      legal_name: optionalText("legal_name"),
      name,
      state_resale_certificate_number: optionalText(
        "state_resale_certificate_number",
      ),
      status,
    })
    .eq("id", customerId);

  if (error) {
    redirect(
      `/?module=edit-account-profile&customer=${customerId}&error=${encodeURIComponent(error.message)}`,
    );
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
    redirect(
      `/?module=edit-product-profile&product=${productId}&error=missing_required`,
    );
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const statusValue = String(formData.get("status") ?? "pending");
  const status = [
    "pending",
    "active",
    "inactive",
    "discontinued",
    "deleted",
  ].includes(statusValue)
    ? (statusValue as
        | "pending"
        | "active"
        | "inactive"
        | "discontinued"
        | "deleted")
    : "pending";
  const sellabilityValue = String(
    formData.get("sellability_status") ?? "hidden",
  );
  const sellabilityStatus = [
    "hidden",
    "sellable",
    "blocked",
    "override_required",
  ].includes(sellabilityValue)
    ? (sellabilityValue as
        | "hidden"
        | "sellable"
        | "blocked"
        | "override_required")
    : "hidden";
  const eligibilityValue = String(
    formData.get("customer_eligibility_tag") ?? "all",
  );
  const customerEligibilityTag = [
    "all",
    "ecommerce_only",
    "non_ecommerce_only",
    "exclusive",
  ].includes(eligibilityValue)
    ? (eligibilityValue as
        | "all"
        | "ecommerce_only"
        | "non_ecommerce_only"
        | "exclusive")
    : "all";
  const priceRaw = optionalText("default_price");
  const defaultPrice = priceRaw ? Number(priceRaw) : null;
  const description = optionalText("description");

  const { error } = await supabase
    .from("product")
    .update({
      brand_id: brandId,
      collection: optionalText("collection"),
      counts_toward_primary_showroom_default:
        formData.get("counts_toward_primary_showroom_default") === "yes",
      customer_eligibility_tag: customerEligibilityTag,
      default_price:
        defaultPrice !== null && Number.isFinite(defaultPrice)
          ? defaultPrice
          : null,
      default_vendor_item_number: optionalText("default_vendor_item_number"),
      description,
      description_word_count: description
        ? description.split(/\s+/).filter(Boolean).length
        : null,
      name,
      no_box_needed: formData.get("no_box_needed") === "on",
      primary_showroom_exclusion_reason:
        formData.get("counts_toward_primary_showroom_default") === "no"
          ? optionalText("primary_showroom_exclusion_reason")
          : null,
      product_category_id: optionalText("product_category_id"),
      sellability_status: sellabilityStatus,
      signature_suite_id: optionalText("signature_suite_id"),
      sku,
      status,
    })
    .eq("id", productId);

  if (error) {
    redirect(
      `/?module=edit-product-profile&product=${productId}&error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect(`/?module=products&product=${productId}`);
}

async function updateProductSpecsAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const specSection = String(
    formData.get("spec_section") ?? "dimensions",
  ).trim();

  if (!productId) {
    redirect(
      `/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=missing_required`,
    );
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const specFields = formData
    .getAll("spec_fields")
    .map((field) => String(field));

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
      const { error } = await supabase
        .from("product_spec_attribute")
        .delete()
        .eq("id", specId)
        .eq("product_id", productId);

      if (error) {
        redirect(
          `/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(error.message)}`,
        );
      }

      continue;
    }

    if (specId && attributeValue) {
      const { error } = await supabase
        .from("product_spec_attribute")
        .update({
          attribute_name: attributeName,
          attribute_value: attributeValue,
          unit,
        })
        .eq("id", specId)
        .eq("product_id", productId);

      if (error) {
        redirect(
          `/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(error.message)}`,
        );
      }

      continue;
    }

    if (attributeValue) {
      const { error } = await supabase.from("product_spec_attribute").insert({
        attribute_name: attributeName,
        attribute_value: attributeValue,
        product_id: productId,
        unit,
      });

      if (error) {
        redirect(
          `/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(error.message)}`,
        );
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
      unit,
    });

    if (error) {
      redirect(
        `/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(error.message)}`,
      );
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
      wire_length: optionalText("hanging_wire_length"),
    };
    const { data: existingHangingConfig, error: existingHangingError } =
      await supabase
        .from("product_hanging_config")
        .select("id")
        .eq("product_id", productId)
        .eq("is_active", true)
        .maybeSingle();

    if (existingHangingError) {
      redirect(
        `/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(existingHangingError.message)}`,
      );
    }

    const result = existingHangingConfig
      ? await supabase
          .from("product_hanging_config")
          .update(hangingConfig)
          .eq("id", existingHangingConfig.id)
      : await supabase.from("product_hanging_config").insert(hangingConfig);

    if (result.error) {
      redirect(
        `/?module=edit-product-specs&product=${productId}&spec_section=${specSection}&error=${encodeURIComponent(result.error.message)}`,
      );
    }
  }

  redirect(`/?module=products&product=${productId}&product_tab=specs`);
}

async function updateProductBoxesAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();

  if (!productId) {
    redirect(
      `/?module=edit-product-boxes&product=${productId}&error=missing_required`,
    );
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
    return value !== null && Number.isInteger(value)
      ? value
      : value === null
        ? null
        : Number.NaN;
  };
  const cbmFromInches = (
    length: number | null,
    width: number | null,
    height: number | null,
  ) =>
    length !== null && width !== null && height !== null
      ? (length * width * height) / 61023.744095
      : null;
  const redirectWithError = (message: string) =>
    redirect(
      `/?module=edit-product-boxes&product=${productId}&error=${encodeURIComponent(message)}`,
    );
  const upsertPackingSpec = async (
    attributeName: string,
    attributeValue: string | null,
  ) => {
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
        const { error } = await supabase
          .from("product_spec_attribute")
          .delete()
          .eq("id", existingSpec.id);

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
      unit: null,
    };
    const result = existingSpec
      ? await supabase
          .from("product_spec_attribute")
          .update(payload)
          .eq("id", existingSpec.id)
      : await supabase.from("product_spec_attribute").insert(payload);

    if (result.error) {
      redirectWithError(result.error.message);
    }
  };
  const deletedBoxIds = new Set(
    formData
      .getAll("delete_box_ids")
      .map((value) => String(value).trim())
      .filter(Boolean),
  );
  const boxIds = formData
    .getAll("box_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);

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
        is_required_for_sale:
          formData.get(`is_required_for_sale_${boxId}`) === "on",
        net_weight: optionalNumber(`net_weight_${boxId}`),
        notes: optionalText(`notes_${boxId}`),
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
    redirect(
      `/?module=add-product-box&product=${productId}&error=missing_required`,
    );
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
  const cbmFromInches = (
    length: number | null,
    width: number | null,
    height: number | null,
  ) =>
    length !== null && width !== null && height !== null
      ? (length * width * height) / 61023.744095
      : null;
  const redirectWithError = (message: string) =>
    redirect(
      `/?module=add-product-box&product=${productId}&error=${encodeURIComponent(message)}`,
    );

  const { data: existingBoxes, error: existingBoxesError } = await supabase
    .from("product_packing_box")
    .select("box_sequence")
    .eq("product_id", productId)
    .eq("is_active", true);

  if (existingBoxesError) {
    redirectWithError(existingBoxesError.message);
  }

  const newSequence =
    Math.max(0, ...(existingBoxes ?? []).map((box) => box.box_sequence)) + 1;

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
      product_id: productId,
    });

    if (error) {
      redirectWithError(
        error?.message ?? "Unable to save the new product box.",
      );
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
    return value !== null && Number.isInteger(value)
      ? value
      : value === null
        ? null
        : Number.NaN;
  };
  const inventoryConditions = [
    "regular",
    "to_be_inspected",
    "hold",
    "damaged",
    "demolished_trash",
  ] as const;
  const inventoryConditionValue = (
    key: string,
  ): (typeof inventoryConditions)[number] => {
    const value = optionalText(key);
    return inventoryConditions.includes(
      value as (typeof inventoryConditions)[number],
    )
      ? (value as (typeof inventoryConditions)[number])
      : "regular";
  };
  const redirectWithError = (message: string) =>
    redirect(`${editUrl}&error=${encodeURIComponent(message)}`);
  const resolveUnspecifiedPickLocation = async (
    preferredWarehouseId: string | null,
  ) => {
    let fallbackQuery = supabase
      .from("warehouse_location")
      .select("id, warehouse_id")
      .eq("is_active", true)
      .eq("is_pickable", true)
      .eq("location_code", "UNSPECIFIED-PICK")
      .order("warehouse_id", { ascending: true })
      .limit(1);

    if (preferredWarehouseId) {
      fallbackQuery = fallbackQuery.eq("warehouse_id", preferredWarehouseId);
    }

    const { data: fallbackLocation, error } = await fallbackQuery.maybeSingle();
    if (error || !fallbackLocation) {
      redirectWithError(
        preferredWarehouseId
          ? "The selected warehouse does not have an Unspecified Pick Location. Apply the Unspecified Pick Location migration, or select a saved bin."
          : "No Unspecified Pick Location is available. Apply the Unspecified Pick Location migration, or select a saved warehouse/bin.",
      );
    }

    return fallbackLocation!;
  };
  const resolveLocation = async (
    rawCode: string | null,
    warehouseId: string | null,
  ) => {
    const locationCode = rawCode?.split("/")[0]?.trim() ?? "";

    if (!locationCode) {
      const fallbackLocation =
        await resolveUnspecifiedPickLocation(warehouseId);
      return {
        locationId: fallbackLocation.id,
        warehouseId: fallbackLocation.warehouse_id,
      };
    }

    const { data: locations, error } = await supabase
      .from("warehouse_location")
      .select("id, warehouse_id")
      .eq("is_active", true)
      .eq("location_code", locationCode);

    const matchingWarehouseLocation = locations?.find(
      (location) => location.warehouse_id === warehouseId,
    );
    const location =
      matchingWarehouseLocation ??
      (locations?.length === 1 ? locations[0] : null);
    if (error || !location) {
      redirectWithError(
        `Inventory location "${locationCode}" was not found. Please enter an active warehouse/bin location code.`,
      );
    }

    // A bin uniquely identifies its warehouse in the normal warehouse workflow.
    // Let the selected bin correct a stale warehouse selection rather than rejecting the move.
    return { locationId: location!.id, warehouseId: location!.warehouse_id };
  };

  const deletedBalanceIds = new Set(
    formData
      .getAll("delete_balance_ids")
      .map((value) => String(value).trim())
      .filter(Boolean),
  );
  const balanceIds = formData
    .getAll("balance_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);

  for (const balanceId of balanceIds) {
    const quantityOnHand = optionalInventoryInteger(
      `quantity_on_hand_${balanceId}`,
    );
    const quantityAllocated = optionalInventoryInteger(
      `quantity_allocated_${balanceId}`,
    );

    if (
      quantityOnHand === null ||
      !Number.isFinite(quantityOnHand) ||
      quantityOnHand < 0 ||
      quantityAllocated === null ||
      !Number.isFinite(quantityAllocated) ||
      quantityAllocated < 0
    ) {
      redirectWithError(
        "Inventory quantities must be whole numbers zero or higher.",
      );
    }

    if (deletedBalanceIds.has(balanceId)) {
      if (quantityOnHand !== 0 || quantityAllocated !== 0) {
        redirectWithError(
          "Only inventory balance rows with zero on-hand and zero allocated quantity can be deleted.",
        );
      }

      const { error } = await supabase
        .from("inventory_balance")
        .delete()
        .eq("id", balanceId)
        .eq("product_id", productId);

      if (error) {
        redirectWithError(error.message);
      }

      continue;
    }

    const warehouseId = optionalText(`warehouse_id_${balanceId}`);
    const location = await resolveLocation(
      optionalText(`location_code_${balanceId}`),
      warehouseId,
    );

    if (!location.warehouseId || !location.locationId) {
      redirectWithError(
        "Each inventory balance needs a warehouse and bin/location.",
      );
    }

    const activeQuantityOnHand = quantityOnHand ?? 0;
    const activeQuantityAllocated = quantityAllocated ?? 0;
    const activeWarehouseId = location.warehouseId!;
    const activeLocationId = location.locationId!;
    const { error } = await supabase
      .from("inventory_balance")
      .update({
        inventory_condition: inventoryConditionValue(
          `inventory_condition_${balanceId}`,
        ),
        quantity_allocated: activeQuantityAllocated,
        quantity_on_hand: activeQuantityOnHand,
        warehouse_id: activeWarehouseId,
        warehouse_location_id: activeLocationId,
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
    const newAllocatedQuantity =
      optionalInventoryInteger("new_quantity_allocated") ?? 0;
    const newPackingBoxId = optionalText("new_product_packing_box_id");

    if (
      newQuantityOnHand === null ||
      !Number.isFinite(newQuantityOnHand) ||
      newQuantityOnHand < 0 ||
      !Number.isFinite(newAllocatedQuantity) ||
      newAllocatedQuantity < 0
    ) {
      redirectWithError(
        "New inventory quantities must be whole numbers zero or higher.",
      );
    }

    if (!newLocation.warehouseId || !newLocation.locationId) {
      redirectWithError(
        "New inventory location needs a warehouse and bin/location.",
      );
    }

    if (newQuantityOnHand === 0 && newAllocatedQuantity === 0) {
      redirectWithError(
        "New inventory location must have a positive on-hand or allocated quantity.",
      );
    }

    const { error } = await supabase.from("inventory_balance").insert({
      inventory_condition: inventoryConditionValue("new_inventory_condition"),
      product_id: productId,
      product_packing_box_id: newPackingBoxId,
      quantity_allocated: newAllocatedQuantity,
      quantity_on_hand: newQuantityOnHand!,
      warehouse_id: newLocation.warehouseId!,
      warehouse_location_id: newLocation.locationId!,
    });

    if (error) {
      redirectWithError(error.message);
    }
  }

  const targetQuantity = optionalInventoryInteger("target_sellable_quantity");

  if (targetQuantity !== null) {
    if (!Number.isFinite(targetQuantity) || targetQuantity < 0) {
      redirectWithError(
        "Target sellable quantity must be a whole number zero or higher.",
      );
    }

    const { data: product, error: productError } = await supabase
      .from("product")
      .select("no_box_needed")
      .eq("id", productId)
      .maybeSingle();

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
      ? [
          {
            id: null,
            default_warehouse_id: null,
            default_warehouse_location_id: null,
          },
        ]
      : (requiredBoxes ?? []);

    for (const target of targetRows) {
      let warehouseId = target.default_warehouse_id;
      let locationId = target.default_warehouse_location_id;

      if (!warehouseId || !locationId) {
        const fallbackLocation =
          await resolveUnspecifiedPickLocation(warehouseId);
        warehouseId = warehouseId ?? fallbackLocation.warehouse_id;
        locationId = locationId ?? fallbackLocation.id;
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

      const { data: existingBalance, error: existingBalanceError } =
        await existingBalanceQuery.maybeSingle();

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
        warehouse_location_id: locationId,
      };
      const result = existingBalance
        ? await supabase
            .from("inventory_balance")
            .update(payload)
            .eq("id", existingBalance.id)
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
  const selectedParentProductId = String(
    formData.get("parent_product_id") ?? "",
  ).trim();
  const productId = initialProductId || selectedParentProductId;

  if (!productId) {
    redirect(
      `/?module=edit-product-parts&part_action=add&error=Please%20select%20a%20parent%20product.`,
    );
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
    return value !== null && Number.isInteger(value)
      ? value
      : value === null
        ? null
        : Number.NaN;
  };
  const redirectWithError = (message: string) =>
    redirect(
      `/?module=edit-product-parts${initialProductId ? `&product=${initialProductId}` : "&part_action=add"}&error=${encodeURIComponent(message)}`,
    );

  const partSaveAction = optionalText("part_save_action");
  const selectedPartIds = formData
    .getAll("selected_part_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (
    (partSaveAction === "edit" ||
      partSaveAction === "delete" ||
      partSaveAction === "add_parent") &&
    selectedPartIds.length === 0
  ) {
    redirectWithError("Please select at least one part line first.");
  }

  if (partSaveAction === "add_parent") {
    const additionalParentProductId = optionalText(
      "additional_parent_product_id",
    );

    if (!additionalParentProductId) {
      redirectWithError("Please select the additional parent product SKU.");
    }

    const activeAdditionalParentProductId = additionalParentProductId ?? "";

    const { data: sourcePartLinks, error: sourcePartLinksError } =
      await supabase
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
      if (
        activeAdditionalParentProductId === sourcePartLink.component_product_id
      ) {
        redirectWithError(
          "A part cannot be linked to itself as a parent product.",
        );
      }

      const partRole = optionalText(`part_role_${sourcePartLink.id}`);
      let existingParentLinkQuery = supabase
        .from("product_part")
        .select("id, is_active")
        .eq("parent_product_id", activeAdditionalParentProductId)
        .eq("component_product_id", sourcePartLink.component_product_id);

      existingParentLinkQuery = partRole
        ? existingParentLinkQuery.eq("part_role", partRole)
        : existingParentLinkQuery.is("part_role", null);

      const { data: existingParentLink, error: existingParentLinkError } =
        await existingParentLinkQuery.limit(1).maybeSingle();

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
        quantity_required: 1,
      };

      const result = existingParentLink
        ? await supabase
            .from("product_part")
            .update(payload)
            .eq("id", existingParentLink.id)
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
          part_role: optionalText(`part_role_${partId}`),
        })
        .eq("id", partId)
        .eq("parent_product_id", productId);

      if (error) {
        redirectWithError(error.message);
      }
    }
  }

  const generatePartSku = async (role: string | null) => {
    const roleWord =
      (role ?? "General").split(/\s+/).filter(Boolean).at(-1) ?? "General";
    const roleSegment = (
      roleWord.replace(/[^a-z0-9]/gi, "") || "GENERAL"
    ).toUpperCase();

    for (let attempt = 0; attempt < 25; attempt += 1) {
      const randomDigits = String(Math.floor(Math.random() * 100000)).padStart(
        5,
        "0",
      );
      const sku = `PT ${roleSegment}-${randomDigits}`;
      const { data: existingProduct, error: existingProductError } =
        await supabase
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

    redirectWithError(
      "Unable to generate a unique part SKU. Please try saving again.",
    );
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

    const initialInventory = optionalInventoryInteger(
      "new_part_initial_inventory",
    );

    if (
      initialInventory !== null &&
      (!Number.isFinite(initialInventory) || initialInventory < 0)
    ) {
      redirectWithError(
        "Initial inventory must be a whole number zero or higher.",
      );
    }

    const allowedImageTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/bmp",
      "image/tiff",
    ]);

    for (const imageFile of newPartImageFiles) {
      if (imageFile.size > 25 * 1024 * 1024) {
        redirectWithError(
          "Part image file is too large. Please upload images smaller than 25 MB.",
        );
      }

      if (imageFile.type && !allowedImageTypes.has(imageFile.type)) {
        redirectWithError(
          "Please upload major image formats such as JPG, PNG, WEBP, GIF, BMP, or TIFF.",
        );
      }
    }

    const { data: parentProduct, error: parentProductError } = await supabase
      .from("product")
      .select("brand_id")
      .eq("id", productId)
      .maybeSingle();

    if (parentProductError || !parentProduct) {
      redirectWithError(
        parentProductError?.message ?? "Parent product was not found.",
      );
    }

    const { data: accessoryCategory, error: accessoryCategoryError } =
      await supabase
        .from("product_category")
        .select("id")
        .or("category_code.eq.accessory,name.ilike.Accessory")
        .limit(1)
        .maybeSingle();

    if (accessoryCategoryError || !accessoryCategory) {
      redirectWithError(
        accessoryCategoryError?.message ??
          "Accessory product category was not found.",
      );
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
        status: "active",
      })
      .select("id")
      .single();

    if (productInsertError || !newPartProduct) {
      redirectWithError(
        productInsertError?.message ?? "Unable to create the new part SKU.",
      );
    }

    const activeNewPartProduct = newPartProduct!;

    const { error } = await supabase.from("product_part").insert({
      component_product_id: activeNewPartProduct.id,
      is_required: formData.get("new_is_required") === "on",
      notes: optionalText("new_notes"),
      parent_product_id: productId,
      part_name: activePartName,
      part_role: newPartRole,
      quantity_required: 1,
    });

    if (error) {
      redirectWithError(error.message);
    }

    if (initialInventory !== null && initialInventory > 0) {
      const { data: fallbackLocation, error: fallbackLocationError } =
        await supabase
          .from("warehouse_location")
          .select("id, warehouse_id")
          .eq("is_active", true)
          .eq("is_pickable", true)
          .eq("location_code", "UNSPECIFIED-PICK")
          .order("location_code", { ascending: true })
          .limit(1)
          .maybeSingle();

      if (fallbackLocationError || !fallbackLocation) {
        redirectWithError(
          "No active pickable warehouse/bin location was found for the initial part inventory.",
        );
      }

      const activeFallbackLocation = fallbackLocation!;
      const { error: inventoryError } = await supabase
        .from("inventory_balance")
        .insert({
          inventory_condition: "regular",
          product_id: activeNewPartProduct.id,
          product_packing_box_id: null,
          quantity_allocated: 0,
          quantity_on_hand: initialInventory,
          warehouse_id: activeFallbackLocation.warehouse_id,
          warehouse_location_id: activeFallbackLocation.id,
        });

      if (inventoryError) {
        redirectWithError(inventoryError.message);
      }
    }

    if (newPartImageFiles.length > 0) {
      const bucketName = "product-images";
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();

      if (bucketsError) {
        redirectWithError(bucketsError.message);
      }

      if (!buckets?.some((bucket) => bucket.name === bucketName)) {
        const { error: createBucketError } =
          await supabase.storage.createBucket(bucketName, { public: false });

        if (createBucketError) {
          redirectWithError(createBucketError.message);
        }
      }

      for (const [index, imageFile] of newPartImageFiles.entries()) {
        const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `product/${activeNewPartProduct.id}/${Date.now()}-${index}-${safeName}`;
        const fileBody = new Uint8Array(await imageFile.arrayBuffer());
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(storagePath, fileBody, {
            contentType: imageFile.type || "application/octet-stream",
            upsert: false,
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
            storage_path: storagePath,
          })
          .select("id")
          .single();

        if (attachmentError || !attachment) {
          redirectWithError(
            attachmentError?.message ??
              "Unable to save part image file record.",
          );
        }

        const activeAttachment = attachment!;

        const { error: imageError } = await supabase
          .from("product_image")
          .insert({
            display_name: imageFile.name,
            file_id: activeAttachment.id,
            image_category: "stock",
            is_default_thumbnail: index === 0,
            product_id: activeNewPartProduct.id,
            sort_order: (index + 1) * 10,
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
    redirect(
      `/?module=product-parts&part=${partId}&product_tab=parents&error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect(`/?module=product-parts&part=${partId}&product_tab=parents`);
}

async function updateProductVendorsAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const action = String(formData.get("vendor_action") ?? "edit").trim();
  const selectedIds = formData
    .getAll("selected_vendor_product_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const returnToVendors = () =>
    redirect(`/?module=products&product=${productId}&product_tab=vendors`);
  const redirectWithError = (message: string) =>
    redirect(
      `/?module=edit-product-vendors&product=${productId}&vendor_action=${action}&selected_vendor_products=${selectedIds.join(",")}&error=${encodeURIComponent(message)}`,
    );
  const optionalNumber = (key: string) => {
    const raw = String(formData.get(key) ?? "").trim();
    return raw ? Number(raw) : null;
  };

  if (!productId) {
    redirect("/?module=products&error=Missing%20product.");
  }

  if (action === "delete") {
    if (selectedIds.length === 0)
      redirectWithError("Select at least one vendor line.");
    const { error } = await supabase
      .from("vendor_product")
      .update({ is_active: false })
      .eq("product_id", productId)
      .in("id", selectedIds);
    if (error) redirectWithError(error.message);
    returnToVendors();
  }

  if (action === "add") {
    const vendorId = String(formData.get("vendor_id") ?? "").trim();
    const vendorItemNumber = String(
      formData.get("vendor_item_number") ?? "",
    ).trim();
    const unitCost = optionalNumber("unit_cost");
    const moq = optionalNumber("minimum_order_quantity");
    const leadTime = optionalNumber("lead_time_days");

    if (
      !vendorId ||
      !vendorItemNumber ||
      unitCost === null ||
      unitCost < 0 ||
      (moq !== null && moq <= 0) ||
      (leadTime !== null && (!Number.isInteger(leadTime) || leadTime < 0))
    ) {
      redirectWithError(
        "Vendor, vendor item number, non-negative price, and valid MOQ/lead time are required.",
      );
    }

    const { error } = await supabase.from("vendor_product").insert({
      lead_time_days: leadTime,
      minimum_order_quantity: moq,
      product_id: productId,
      unit_cost: unitCost!,
      vendor_id: vendorId,
      vendor_item_name:
        String(formData.get("vendor_item_name") ?? "").trim() || null,
      vendor_item_number: vendorItemNumber,
    });
    if (error) redirectWithError(error.message);
    returnToVendors();
  }

  if (selectedIds.length === 0)
    redirectWithError("Select at least one vendor line.");

  for (const id of selectedIds) {
    const unitCost = optionalNumber(`unit_cost_${id}`);
    const moq = optionalNumber(`minimum_order_quantity_${id}`);
    const leadTime = optionalNumber(`lead_time_days_${id}`);
    const vendorItemNumber = String(
      formData.get(`vendor_item_number_${id}`) ?? "",
    ).trim();

    if (
      !vendorItemNumber ||
      unitCost === null ||
      unitCost < 0 ||
      (moq !== null && moq <= 0) ||
      (leadTime !== null && (!Number.isInteger(leadTime) || leadTime < 0))
    ) {
      redirectWithError(
        "Vendor item number, non-negative price, and valid MOQ/lead time are required.",
      );
    }

    const { error } = await supabase
      .from("vendor_product")
      .update({
        lead_time_days: leadTime,
        minimum_order_quantity: moq,
        unit_cost: unitCost!,
        vendor_item_number: vendorItemNumber,
      })
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
  const parentProductIds = formData
    .getAll("parent_product_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const partRoleValue = String(formData.get("part_role") ?? "").trim();
  const notesValue = String(formData.get("notes") ?? "").trim();
  const redirectWithError = (message: string) =>
    redirect(
      `/?module=edit-part-parents&part=${partId}&error=${encodeURIComponent(message)}`,
    );

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

  const selectedParentIds = [...new Set(parentProductIds)].filter(
    (parentId) => parentId !== partId,
  );

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
      quantity_required: 1,
    };
    const result = existingLink
      ? await supabase
          .from("product_part")
          .update(payload)
          .eq("id", existingLink.id)
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
  const billingProfileId = String(
    formData.get("billing_profile_id") ?? "",
  ).trim();

  if (!customerId) {
    redirect(
      `/?module=edit-billing-credit&customer=${customerId}&error=missing_required`,
    );
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
  const billingLocationId = optionalText("billing_location_id");
  const billingLocationName =
    optionalText("billing_location_name") ?? "Billing Address";
  const billingAddressLine1 = optionalText("address_line_1");
  const billingAddressLine2 = optionalText("address_line_2");
  const billingCity = optionalText("city");
  const billingStateProvince = optionalText("state_province");
  const billingPostalCode = optionalText("postal_code");
  const billingCountryCode = optionalText("country_code") ?? "USA";
  const billingCountry =
    countryOptions.find((option) => option.code === billingCountryCode)?.name ??
    "United States";
  const billingAddressEntered = Boolean(
    billingAddressLine1 ||
      billingAddressLine2 ||
      billingCity ||
      billingStateProvince ||
      billingPostalCode,
  );

  if (
    (billingLocationId || billingAddressEntered) &&
    (!billingAddressLine1 ||
      !billingCity ||
      !billingStateProvince ||
      !billingPostalCode)
  ) {
    redirect(
      `/?module=edit-billing-credit&customer=${customerId}&error=${encodeURIComponent("Complete the billing address: address line 1, city, state/province, and postal code are required.")}`,
    );
  }

  if (billingLocationId || billingAddressEntered) {
    const billingAddressPayload = {
      address_line_1: billingAddressLine1,
      address_line_2: billingAddressLine2,
      city: billingCity,
      country: billingCountry,
      country_code: billingCountryCode,
      is_billing_address: true,
      location_name: billingLocationName,
      location_type: "ship_to" as const,
      postal_code: billingPostalCode,
      state_province: billingStateProvince,
      status: "active" as const,
    };

    const billingLocationResult = billingLocationId
      ? await supabase
          .from("customer_location")
          .update(billingAddressPayload)
          .eq("id", billingLocationId)
          .eq("customer_account_id", customerId)
      : await supabase
          .from("customer_location")
          .insert({
            ...billingAddressPayload,
            customer_account_id: customerId,
          });

    if (billingLocationResult.error) {
      redirect(
        `/?module=edit-billing-credit&customer=${customerId}&error=${encodeURIComponent(billingLocationResult.error.message)}`,
      );
    }
  }

  const profile = {
    credit_limit: creditLimit,
    credit_limit_source:
      creditLimit === null ? "system_default" : "customer_override",
    customer_account_id: customerId,
    default_statement_email: defaultStatementEmail,
    invoice_delivery_method: defaultStatementEmail ? "email" : "print",
    payment_days: Number.isFinite(paymentDays) ? paymentDays : 0,
    payment_terms: paymentTerms,
    statement_delivery_method: defaultStatementEmail ? "email" : "print",
  } as const;

  const result = billingProfileId
    ? await supabase
        .from("customer_billing_profile")
        .update(profile)
        .eq("id", billingProfileId)
        .eq("customer_account_id", customerId)
    : await supabase.from("customer_billing_profile").insert(profile);

  if (result.error) {
    redirect(
      `/?module=edit-billing-credit&customer=${customerId}&error=${encodeURIComponent(result.error.message)}`,
    );
  }

  const { error: customerError } = await supabase
    .from("customer_account")
    .update({
      billing_email: defaultStatementEmail,
    })
    .eq("id", customerId);

  if (customerError) {
    redirect(
      `/?module=edit-billing-credit&customer=${customerId}&error=${encodeURIComponent(customerError.message)}`,
    );
  }

  redirect(`/?customer=${customerId}`);
}

async function addLocationAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const locationName = String(formData.get("location_name") ?? "").trim();

  if (!customerId || !locationName) {
    redirect(
      `/?module=add-location&customer=${customerId}&error=missing_required`,
    );
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const countryCode = optionalText("country_code") ?? "USA";
  const country =
    countryOptions.find((option) => option.code === countryCode)?.name ??
    "United States";
  const isShowroom = formData.get("is_showroom") === "on";
  const isPrimaryShowroom =
    isShowroom && formData.get("is_primary_showroom") === "on";

  const { data, error } = await supabase
    .from("customer_location")
    .insert({
      address_line_1: optionalText("address_line_1"),
      address_line_2: optionalText("address_line_2"),
      city: optionalText("city"),
      country,
      country_code: countryCode,
      customer_account_id: customerId,
      default_ship_to_order_channel:
        formData.get("is_default_ship_to") === "on" ? "manual" : null,
      email: optionalText("location_contact_email"),
      is_billing_address: formData.get("is_billing_address") === "on",
      is_default_ship_to: formData.get("is_default_ship_to") === "on",
      is_shipping_address: formData.get("is_shipping_address") === "on",
      is_showroom: isShowroom,
      location_name: locationName,
      location_type: isShowroom ? "showroom" : "ship_to",
      postal_code: optionalText("postal_code"),
      state_province: optionalText("state_province"),
      status: "active",
    })
    .select("id")
    .single();

  if (error) {
    redirect(
      `/?module=add-location&customer=${customerId}&error=${encodeURIComponent(error.message)}`,
    );
  }

  if (isPrimaryShowroom) {
    const { error: showroomError } = await supabase
      .from("primary_showroom_enrollment")
      .insert({
        customer_account_id: customerId,
        customer_location_id: data.id,
        program_status: "pending",
        required_display_count: 0,
        current_display_count: 0,
        discount_percent: 0,
      });

    if (showroomError) {
      redirect(
        `/?module=add-location&customer=${customerId}&error=${encodeURIComponent(showroomError.message)}`,
      );
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
    redirect(
      `/?module=edit-location&customer=${customerId}&location=${locationId}&error=missing_required`,
    );
  }

  const optionalText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value ? value : null;
  };
  const countryCode = optionalText("country_code") ?? "USA";
  const country =
    countryOptions.find((option) => option.code === countryCode)?.name ??
    "United States";
  const isShowroom = formData.get("is_showroom") === "on";
  const isPrimaryShowroom =
    isShowroom && formData.get("is_primary_showroom") === "on";

  const { error } = await supabase
    .from("customer_location")
    .update({
      address_line_1: optionalText("address_line_1"),
      address_line_2: optionalText("address_line_2"),
      city: optionalText("city"),
      country,
      country_code: countryCode,
      default_ship_to_order_channel:
        formData.get("is_default_ship_to") === "on" ? "manual" : null,
      email: optionalText("location_contact_email"),
      is_billing_address: formData.get("is_billing_address") === "on",
      is_default_ship_to: formData.get("is_default_ship_to") === "on",
      is_shipping_address: formData.get("is_shipping_address") === "on",
      is_showroom: isShowroom,
      location_name: locationName,
      location_type: isShowroom ? "showroom" : "ship_to",
      postal_code: optionalText("postal_code"),
      state_province: optionalText("state_province"),
      status:
        String(formData.get("status") ?? "active") === "inactive"
          ? "inactive"
          : "active",
    })
    .eq("id", locationId)
    .eq("customer_account_id", customerId);

  if (error) {
    redirect(
      `/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(error.message)}`,
    );
  }

  const { data: existingEnrollment, error: existingError } = await supabase
    .from("primary_showroom_enrollment")
    .select("id, program_status")
    .eq("customer_location_id", locationId)
    .in("program_status", ["pending", "active", "pending_renew", "suspended"])
    .maybeSingle();

  if (existingError) {
    redirect(
      `/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(existingError.message)}`,
    );
  }

  if (isPrimaryShowroom && !existingEnrollment) {
    const { error: showroomError } = await supabase
      .from("primary_showroom_enrollment")
      .insert({
        customer_account_id: customerId,
        customer_location_id: locationId,
        program_status: "pending",
        required_display_count: 0,
        current_display_count: 0,
        discount_percent: 0,
      });

    if (showroomError) {
      redirect(
        `/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(showroomError.message)}`,
      );
    }
  }

  if (!isPrimaryShowroom && existingEnrollment) {
    const { error: showroomUpdateError } = await supabase
      .from("primary_showroom_enrollment")
      .update({ program_status: "cancelled" })
      .eq("id", existingEnrollment.id);

    if (showroomUpdateError) {
      redirect(
        `/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(showroomUpdateError.message)}`,
      );
    }
  }

  redirect(
    `/?module=view-location&customer=${customerId}&location=${locationId}`,
  );
}

async function updateContactAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const contactId = String(formData.get("contact_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!customerId || !contactId || !name) {
    redirect(
      `/?module=edit-contact&customer=${customerId}&contact=${contactId}&error=missing_required`,
    );
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
      title: optionalText("title"),
    })
    .eq("id", contactId)
    .eq("customer_account_id", customerId);

  if (error) {
    redirect(
      `/?module=edit-contact&customer=${customerId}&contact=${contactId}&error=${encodeURIComponent(error.message)}`,
    );
  }

  redirect(`/?module=view-contact&customer=${customerId}&contact=${contactId}`);
}

async function addContactAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = String(formData.get("customer_id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (!customerId || !name) {
    redirect(
      `/?module=add-contact&customer=${customerId}&error=missing_required`,
    );
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
      title: optionalText("title"),
    })
    .select("id")
    .single();

  if (error) {
    redirect(
      `/?module=add-contact&customer=${customerId}&error=${encodeURIComponent(error.message)}`,
    );
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
    return [
      "prepaid",
      "collect",
      "customer_pickup",
      "free_freight",
      "flat_rate",
      "manual_review",
    ].includes(text)
      ? (text as
          | "prepaid"
          | "collect"
          | "customer_pickup"
          | "free_freight"
          | "flat_rate"
          | "manual_review")
      : "prepaid";
  };
  const freightTerms = freightTerm(formData.get("freight_terms"));
  const freightAllowanceRaw = optionalText("freight_allowance_amount");
  const flatRateRaw = optionalText("flat_rate_percent");
  const policy = {
    customer_account_id: customerId,
    customer_location_id: null,
    default_ground_carrier:
      freightTerms === "collect"
        ? optionalText("ground_customer_collect_carrier")
        : null,
    default_ground_carrier_account_number:
      freightTerms === "collect"
        ? optionalText("ground_customer_collect_account_number")
        : null,
    default_ltl_carrier:
      freightTerms === "collect"
        ? optionalText("ltl_customer_collect_carrier")
        : null,
    default_ltl_carrier_account_number:
      freightTerms === "collect"
        ? optionalText("ltl_customer_collect_account_number")
        : null,
    flat_rate_percent:
      flatRateRaw && freightTerms === "flat_rate" ? Number(flatRateRaw) : null,
    freight_allowance_amount: freightAllowanceRaw
      ? Number(freightAllowanceRaw)
      : null,
    freight_terms: freightTerms,
    ground_freight_terms: freightTerms,
    is_default: true,
    ltl_freight_terms: freightTerms,
    policy_name: "Default Freight Policy",
    preferred_shipping_type: null,
  };

  const result = policyId
    ? await supabase
        .from("customer_freight_policy")
        .update(policy)
        .eq("id", policyId)
    : await supabase.from("customer_freight_policy").insert(policy);

  if (result.error) {
    redirect(
      `/?module=edit-freight&customer=${customerId}&error=${encodeURIComponent(result.error.message)}`,
    );
  }

  redirect(`/?customer=${customerId}#freight`);
}

async function searchCustomers(
  query: string,
  mode: "active" | "obsolete" = "active",
) {
  const supabase = createSupabaseAdminClient();
  const cleanQuery = query.trim();
  let request = supabase
    .from("customer_account")
    .select(
      "id, account_number, legacy_account_id, name, legal_name, status, default_discount_percent, is_sales_tax_exempt, billing_contact_name, billing_email, purchase_contact_name, purchase_email, account_type_id, business_type_id",
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
      `name.ilike.%${escaped}%,legal_name.ilike.%${escaped}%,account_number.ilike.%${escaped}%,legacy_account_id.ilike.%${escaped}%`,
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
  mode: "active" | "discontinued" = "active",
): Promise<ProductSearchResult> {
  const supabase = createSupabaseAdminClient();
  const cleanQuery = query.trim();
  let constrainedProductIds: Set<string> | null = null;

  // Parts use the Accessory category but are maintained separately from sellable products.
  const { data: accessoryCategories, error: accessoryCategoryError } =
    await supabase
      .from("product_category")
      .select("id")
      .or("category_code.eq.accessory,name.ilike.Accessory");

  if (accessoryCategoryError) {
    throw new Error(accessoryCategoryError.message);
  }

  const accessoryCategoryIds = (accessoryCategories ?? []).map(
    (category) => category.id,
  );

  const intersectProductIds = (productIds: string[]) => {
    const next = new Set(productIds);
    constrainedProductIds = constrainedProductIds
      ? new Set(
          [...constrainedProductIds].filter((productId) => next.has(productId)),
        )
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
      totalPages: 1,
    };
  }

  const offset = (page - 1) * pageSize;
  let request = supabase
    .from("product")
    .select(
      "id, sku, name, collection, status, sellability_status, customer_eligibility_tag, default_price, brand(name), product_category(name), product_signature_suite(name)",
      { count: "exact" },
    )
    .order("sku", { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (mode === "discontinued") {
    request = request.in("status", ["discontinued", "deleted"]);
  } else {
    request = request.neq("status", "deleted").neq("status", "discontinued");
  }

  if (accessoryCategoryIds.length > 0) {
    request = request.not(
      "product_category_id",
      "in",
      `(${accessoryCategoryIds.join(",")})`,
    );
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
    request = request.eq(
      "customer_eligibility_tag",
      filters.eligibility as "all",
    );
  }

  if (filters.status && mode !== "discontinued") {
    request = request.eq("status", filters.status as "active");
  }

  if (constrainedIds) {
    request = request.in("id", [...constrainedIds]);
  }

  if (cleanQuery) {
    const escaped = cleanQuery.replaceAll("%", "\\%").replaceAll("_", "\\_");
    request = request.or(
      `sku.ilike.%${escaped}%,name.ilike.%${escaped}%,collection.ilike.%${escaped}%`,
    );
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
        .select(
          "product_id, sellable_quantity, incoming_quantity, next_incoming_eta",
        )
        .in("product_id", productIds)
    : { data: [], error: null };

  if (inventoryError) {
    throw new Error(inventoryError.message);
  }

  const inventoryByProductId = new Map(
    (inventoryData ?? []).map((item) => [item.product_id, item]),
  );
  const { data: productPartData, error: productPartError } = productIds.length
    ? await supabase
        .from("product_part")
        .select(
          "id, parent_product_id, component_product_id, quantity_required, part_name, part_role, is_required, notes",
        )
        .eq("is_active", true)
        .in("parent_product_id", productIds)
    : { data: [], error: null };

  if (productPartError) {
    throw new Error(productPartError.message);
  }

  const componentProductIds = [
    ...new Set(
      (productPartData ?? []).map((part) => part.component_product_id),
    ),
  ];
  const { data: componentProductData, error: componentProductError } =
    componentProductIds.length
      ? await supabase
          .from("product")
          .select("id, sku, name, status, sellability_status")
          .in("id", componentProductIds)
      : { data: [], error: null };

  if (componentProductError) {
    throw new Error(componentProductError.message);
  }

  const { data: componentInventoryData, error: componentInventoryError } =
    componentProductIds.length
      ? await supabase
          .from("inventory_sku_summary")
          .select(
            "product_id, sellable_quantity, incoming_quantity, next_incoming_eta",
          )
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
        sku: product.sku,
      },
    ]),
  );
  const componentProductById = new Map(
    (componentProductData ?? []).map((product) => [product.id, product]),
  );
  const componentInventoryByProductId = new Map(
    (componentInventoryData ?? []).map((item) => [item.product_id, item]),
  );
  const partsByParentProductId = new Map<string, ProductComponentPartItem[]>();

  (productPartData ?? []).forEach((part) => {
    const parentProduct = productById.get(part.parent_product_id);
    const componentProduct = componentProductById.get(
      part.component_product_id,
    );

    if (!parentProduct || !componentProduct) {
      return;
    }

    const inventory = componentInventoryByProductId.get(
      part.component_product_id,
    );
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
      sellable_quantity: inventory?.sellable_quantity ?? 0,
    };

    partsByParentProductId.set(part.parent_product_id, [
      ...(partsByParentProductId.get(part.parent_product_id) ?? []),
      partItem,
    ]);
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
      parts: partsByParentProductId.get(product.id) ?? [],
    };
  }) as ProductListItem[];

  return {
    items,
    page,
    pageSize,
    totalCount: count ?? items.length,
    totalPages: Math.max(1, Math.ceil((count ?? items.length) / pageSize)),
  };
}

async function searchProductParts(
  query: string,
  page = 1,
  pageSize = 10,
): Promise<ProductPartSearchResult> {
  const supabase = createSupabaseAdminClient();
  const cleanQuery = query.trim();
  const offset = (page - 1) * pageSize;
  const escaped = cleanQuery.replaceAll("%", "\\%").replaceAll("_", "\\_");

  const { data: accessoryCategories, error: accessoryCategoryError } =
    await supabase
      .from("product_category")
      .select("id")
      .or("category_code.eq.accessory,name.ilike.Accessory");

  if (accessoryCategoryError) {
    throw new Error(accessoryCategoryError.message);
  }

  const accessoryCategoryIds = (accessoryCategories ?? []).map(
    (category) => category.id,
  );

  if (accessoryCategoryIds.length === 0) {
    return {
      items: [],
      page,
      pageSize,
      totalCount: 0,
      totalPages: 1,
    };
  }

  let componentIdsLinkedToMatchingParents: string[] = [];

  if (cleanQuery) {
    const { data: matchingProducts, error: matchingProductsError } =
      await supabase
        .from("product")
        .select("id")
        .or(`sku.ilike.%${escaped}%,name.ilike.%${escaped}%`)
        .limit(500);

    if (matchingProductsError) {
      throw new Error(matchingProductsError.message);
    }

    const matchingProductIds = (matchingProducts ?? []).map(
      (product) => product.id,
    );

    if (matchingProductIds.length > 0) {
      const { data: matchingParentParts, error: matchingParentPartsError } =
        await supabase
          .from("product_part")
          .select("component_product_id")
          .eq("is_active", true)
          .in("parent_product_id", matchingProductIds);

      if (matchingParentPartsError) {
        throw new Error(matchingParentPartsError.message);
      }

      componentIdsLinkedToMatchingParents = [
        ...new Set(
          (matchingParentParts ?? []).map((part) => part.component_product_id),
        ),
      ];
    }
  }

  let request = supabase
    .from("product")
    .select(
      "id, sku, name, status, sellability_status, default_price, brand(name)",
      { count: "exact" },
    )
    .in("product_category_id", accessoryCategoryIds)
    .neq("status", "deleted")
    .order("sku", { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (cleanQuery) {
    const searchClauses = [`sku.ilike.%${escaped}%`, `name.ilike.%${escaped}%`];

    if (componentIdsLinkedToMatchingParents.length > 0) {
      searchClauses.push(
        `id.in.(${componentIdsLinkedToMatchingParents.join(",")})`,
      );
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
        .select(
          "product_id, sellable_quantity, incoming_quantity, next_incoming_eta",
        )
        .in("product_id", partProductIds)
    : { data: [], error: null };

  if (inventoryError) {
    throw new Error(inventoryError.message);
  }

  const { data: parentPartRows, error: parentPartError } = partProductIds.length
    ? await supabase
        .from("product_part")
        .select(
          "parent_product_id, component_product_id, quantity_required, part_name, part_role",
        )
        .eq("is_active", true)
        .in("component_product_id", partProductIds)
    : { data: [], error: null };

  if (parentPartError) {
    throw new Error(parentPartError.message);
  }

  const parentProductIds = [
    ...new Set((parentPartRows ?? []).map((part) => part.parent_product_id)),
  ];
  const { data: parentProductData, error: parentProductError } =
    parentProductIds.length
      ? await supabase
          .from("product")
          .select("id, sku, name")
          .in("id", parentProductIds)
      : { data: [], error: null };

  if (parentProductError) {
    throw new Error(parentProductError.message);
  }

  const parentProductById = new Map(
    (parentProductData ?? []).map((product) => [product.id, product]),
  );
  const inventoryByProductId = new Map(
    (inventoryData ?? []).map((item) => [item.product_id, item]),
  );
  const parentsByPartProductId = new Map<
    string,
    AccessoryPartListItem["parent_products"]
  >();

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
        part_role: part.part_role,
      },
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
      status: product.status,
    };
  });

  return {
    items,
    page,
    pageSize,
    totalCount: count ?? items.length,
    totalPages: Math.max(1, Math.ceil((count ?? items.length) / pageSize)),
  };
}

async function getProductDetail(
  productId: string,
): Promise<ProductDetail | null> {
  const supabase = createSupabaseAdminClient();
  const { data: product, error: productError } = await supabase
    .from("product")
    .select(
      "id, sku, name, description, collection, status, sellability_status, customer_eligibility_tag, counts_toward_primary_showroom_default, primary_showroom_exclusion_reason, default_price, currency, default_vendor_item_number, no_box_needed, brand_id, product_category_id, signature_suite_id, brand(name), product_category(name), product_signature_suite(name)",
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
    vendorProductsResult,
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
        "id, box_sequence, box_label, net_weight, gross_weight, box_length, box_width, box_height, inch_volume, cbm, default_warehouse_id, default_warehouse_location_id, is_required_for_sale, pallet_quantity, notes",
      )
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("box_sequence", { ascending: true }),
    supabase
      .from("inventory_balance")
      .select(
        "id, product_packing_box_id, warehouse_id, warehouse_location_id, inventory_condition, quantity_on_hand, quantity_allocated, quantity_available",
      )
      .eq("product_id", productId)
      .order("inventory_condition", { ascending: true }),
    supabase
      .from("product_part")
      .select(
        "id, parent_product_id, component_product_id, quantity_required, part_name, part_role, is_required, notes",
      )
      .eq("parent_product_id", productId)
      .eq("is_active", true),
    supabase
      .from("product_part")
      .select(
        "id, parent_product_id, component_product_id, quantity_required, part_name, part_role, is_required, notes",
      )
      .eq("component_product_id", productId)
      .eq("is_active", true),
    supabase
      .from("product_image")
      .select(
        "id, file_id, image_category, display_name, sort_order, is_default_thumbnail, uploaded_at",
      )
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("image_category", { ascending: true })
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_document")
      .select(
        "id, file_id, document_type, display_name, sort_order, uploaded_at",
      )
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("document_type", { ascending: true })
      .order("sort_order", { ascending: true }),
    supabase
      .from("attachment")
      .select(
        "id, category, original_file_name, content_type, file_size, storage_bucket, storage_path, uploaded_at",
      )
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
      .select(
        "mounting_type, chain_length, rod_length, wire_length, canopy_detail, notes",
      )
      .eq("product_id", productId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("vendor_product")
      .select(
        "id, vendor_id, vendor_item_number, unit_cost, minimum_order_quantity, lead_time_days, updated_at, vendor(name)",
      )
      .eq("product_id", productId)
      .eq("is_active", true)
      .order("updated_at", { ascending: false }),
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
    vendorProductsResult.error,
  ].find(Boolean);

  if (firstError) {
    throw new Error(firstError.message);
  }

  const componentIds = [
    ...new Set(
      (partsResult.data ?? []).map((part) => part.component_product_id),
    ),
  ];
  const usedInParentIds = [
    ...new Set((usedInResult.data ?? []).map((part) => part.parent_product_id)),
  ];
  const relatedProductIds = [...new Set([...componentIds, ...usedInParentIds])];
  const productDocuments = documentsResult.error
    ? []
    : (documentsResult.data ?? []);
  const boxIds = (inventoryResult.data ?? [])
    .map((balance) => balance.product_packing_box_id)
    .filter((id): id is string => Boolean(id));
  const imageFileIds = (imagesResult.data ?? []).map((image) => image.file_id);
  const attachmentDocumentIds = new Set(
    (productDocumentAttachmentsResult.data ?? []).map(
      (attachment) => attachment.id,
    ),
  );
  const documentFileIds = productDocuments
    .map((document) => document.file_id)
    .filter((fileId) => !attachmentDocumentIds.has(fileId));
  const attachmentFileIds = [...new Set([...imageFileIds, ...documentFileIds])];
  const warehouseIds = [
    ...new Set([
      ...(inventoryResult.data ?? []).map((balance) => balance.warehouse_id),
      ...(boxesResult.data ?? [])
        .map((box) => box.default_warehouse_id)
        .filter((id): id is string => Boolean(id)),
    ]),
  ];
  const locationIds = [
    ...new Set([
      ...(inventoryResult.data ?? []).map(
        (balance) => balance.warehouse_location_id,
      ),
      ...(boxesResult.data ?? [])
        .map((box) => box.default_warehouse_location_id)
        .filter((id): id is string => Boolean(id)),
    ]),
  ];

  const [
    relatedProductsResult,
    componentInventoryResult,
    inventoryBoxesResult,
    attachmentsResult,
    warehousesResult,
    locationsResult,
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
          .select(
            "product_id, sellable_quantity, incoming_quantity, next_incoming_eta",
          )
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
          .select(
            "id, original_file_name, content_type, file_size, storage_bucket, storage_path",
          )
          .in("id", attachmentFileIds)
      : Promise.resolve({ data: [], error: null }),
    warehouseIds.length
      ? supabase.from("warehouse").select("id, name").in("id", warehouseIds)
      : Promise.resolve({ data: [], error: null }),
    locationIds.length
      ? supabase
          .from("warehouse_location")
          .select("id, location_code, location_name")
          .in("id", locationIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const secondError = [
    relatedProductsResult.error,
    componentInventoryResult.error,
    inventoryBoxesResult.error,
    attachmentsResult.error,
    warehousesResult.error,
    locationsResult.error,
  ].find(Boolean);

  if (secondError) {
    throw new Error(secondError.message);
  }

  const relatedProductById = new Map(
    (relatedProductsResult.data ?? []).map((item) => [item.id, item]),
  );
  const componentInventoryByProductId = new Map(
    (componentInventoryResult.data ?? []).map((item) => [
      item.product_id,
      item,
    ]),
  );
  const inventoryBoxById = new Map(
    (inventoryBoxesResult.data ?? []).map((item) => [item.id, item]),
  );
  const attachmentById = new Map(
    (attachmentsResult.data ?? []).map((item) => [item.id, item]),
  );
  const warehouseById = new Map(
    (warehousesResult.data ?? []).map((item) => [item.id, item]),
  );
  const locationById = new Map(
    (locationsResult.data ?? []).map((item) => [item.id, item]),
  );

  const parts: ProductComponentPartItem[] = (partsResult.data ?? []).flatMap(
    (part) => {
      const componentProduct = relatedProductById.get(
        part.component_product_id,
      );

      if (!componentProduct) {
        return [];
      }

      const inventory = componentInventoryByProductId.get(
        part.component_product_id,
      );

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
          sellable_quantity: inventory?.sellable_quantity ?? 0,
        },
      ];
    },
  );

  const usedInParents: ProductComponentPartItem[] = (
    usedInResult.data ?? []
  ).flatMap((part) => {
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
        sellable_quantity: summaryResult.data?.sellable_quantity ?? 0,
      },
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
        file_size:
          attachment.file_size === null ? null : Number(attachment.file_size),
        id: document.id,
        original_file_name: attachment.original_file_name,
        signed_url: signedUrlData?.signedUrl ?? null,
        storage_bucket: attachment.storage_bucket,
        storage_path: attachment.storage_path,
        uploaded_at: document.uploaded_at,
      } satisfies ProductDocumentDetail;
    }),
  );
  const normalizeProductDocumentType = (
    value: string | null,
  ): ProductDocumentType =>
    [
      "spec_sheet",
      "installation_instruction",
      "manual",
      "box_label",
      "cad_drawing",
      "other",
    ].includes(value ?? "")
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
        file_size:
          attachment.file_size === null ? null : Number(attachment.file_size),
        id: attachment.id,
        original_file_name: attachment.original_file_name,
        signed_url: signedUrlData?.signedUrl ?? null,
        storage_bucket: attachment.storage_bucket,
        storage_path: attachment.storage_path,
        uploaded_at: attachment.uploaded_at,
      } satisfies ProductDocumentDetail;
    }),
  );
  const documentDetails = [
    ...attachmentDocumentDetails,
    ...linkedDocumentDetails.filter(
      (document): document is NonNullable<typeof document> => Boolean(document),
    ),
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
      const publicUrl = supabase.storage
        .from(attachment.storage_bucket)
        .getPublicUrl(attachment.storage_path).data.publicUrl;

      return {
        content_type: attachment.content_type,
        display_name: image.display_name,
        file_size:
          attachment.file_size === null ? null : Number(attachment.file_size),
        id: image.id,
        image_category: image.image_category,
        is_default_thumbnail: image.is_default_thumbnail,
        original_file_name: attachment.original_file_name,
        public_url: signedUrlData?.signedUrl ?? publicUrl,
        sort_order: image.sort_order,
        storage_bucket: attachment.storage_bucket,
        storage_path: attachment.storage_path,
        uploaded_at: image.uploaded_at,
      } satisfies ProductImageDetail;
    }),
  );
  const inventoryBalances: ProductInventoryBalance[] = (
    inventoryResult.data ?? []
  ).map((balance) => {
    const box = balance.product_packing_box_id
      ? inventoryBoxById.get(balance.product_packing_box_id)
      : null;
    const warehouse = warehouseById.get(balance.warehouse_id);
    const location = locationById.get(balance.warehouse_location_id);
    const quantityOnHand = Number(balance.quantity_on_hand);
    const quantityAllocated = Number(balance.quantity_allocated);
    const quantityAvailable = Number(balance.quantity_available);

    return {
      box_label: box?.box_label ?? null,
      box_sequence: box?.box_sequence ?? null,
      id: balance.id,
      inventory_condition: balance.inventory_condition,
      location_code: location?.location_code ?? "Not set",
      product_packing_box_id: balance.product_packing_box_id,
      quantity_allocated: quantityAllocated,
      quantity_available: quantityAvailable,
      quantity_on_hand: quantityOnHand,
      warehouse_id: balance.warehouse_id,
      warehouse_location_id: balance.warehouse_location_id,
      warehouse_name: warehouse?.name ?? "Not set",
    };
  });
  const packingBoxes: ProductPackingBoxDetail[] = (boxesResult.data ?? []).map(
    (box) => {
      const warehouse = box.default_warehouse_id
        ? warehouseById.get(box.default_warehouse_id)
        : null;
      const location = box.default_warehouse_location_id
        ? locationById.get(box.default_warehouse_location_id)
        : null;

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
        gross_weight:
          box.gross_weight === null ? null : Number(box.gross_weight),
        id: box.id,
        inch_volume: box.inch_volume === null ? null : Number(box.inch_volume),
        is_required_for_sale: box.is_required_for_sale,
        net_weight: box.net_weight === null ? null : Number(box.net_weight),
        notes: box.notes,
        pallet_quantity: box.pallet_quantity,
      };
    },
  );
  const regularBalances = inventoryBalances.filter(
    (balance) => balance.inventory_condition === "regular",
  );
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
              .reduce((sum, balance) => sum + balance.quantity_available, 0),
          ),
        )
      : Number(summaryResult.data?.sellable_quantity ?? 0);

  return {
    brand_id: product.brand_id,
    brand_name: product.brand?.name ?? "Not set",
    category_id: product.product_category_id,
    category_name: product.product_category?.name ?? null,
    collection: product.collection,
    counts_toward_primary_showroom_default:
      product.counts_toward_primary_showroom_default,
    currency: product.currency,
    customer_eligibility_tag: product.customer_eligibility_tag,
    default_price: product.default_price,
    default_vendor_item_number: product.default_vendor_item_number,
    description: product.description,
    documents: documentDetails,
    finishes: (finishesResult.data ?? [])
      .map((finish) => finish.finish?.finish_name)
      .filter((finish): finish is string => Boolean(finish)),
    id: product.id,
    images: imageDetails.filter((image): image is ProductImageDetail =>
      Boolean(image),
    ),
    incoming_quantity: summaryResult.data?.incoming_quantity ?? null,
    inventoryBalances,
    name: product.name,
    next_incoming_eta: summaryResult.data?.next_incoming_eta ?? null,
    no_box_needed: product.no_box_needed,
    packingBoxes,
    parts,
    primary_showroom_exclusion_reason:
      product.primary_showroom_exclusion_reason,
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
          wire_length: hangingResult.data.wire_length,
        }
      : null,
    usedInParents,
    vendors: (vendorProductsResult.data ?? []).map((vendorProduct) => ({
      id: vendorProduct.id,
      lead_time_days: vendorProduct.lead_time_days,
      minimum_order_quantity: vendorProduct.minimum_order_quantity,
      unit_cost: Number(vendorProduct.unit_cost),
      updated_at: vendorProduct.updated_at,
      vendor_id: vendorProduct.vendor_id,
      vendor_item_number: vendorProduct.vendor_item_number,
      vendor_name: vendorProduct.vendor?.name ?? "Not set",
    })),
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
    attachmentsResult,
  ] = await Promise.all([
    supabase
      .from("customer_account")
      .select(
        "id, account_number, legacy_account_id, name, legal_name, status, default_discount_percent, is_sales_tax_exempt, state_resale_certificate_number, billing_contact_name, billing_email, purchase_contact_name, purchase_email, account_type_id, business_type_id",
      )
      .eq("id", customerId)
      .single(),
    supabase
      .from("customer_location")
      .select(
        "id, location_code, location_name, location_type, city, state_province, country_code, is_shipping_address, is_default_ship_to, is_billing_address, is_showroom, status",
      )
      .eq("customer_account_id", customerId)
      .order("location_name", { ascending: true }),
    supabase
      .from("customer_contact")
      .select(
        "id, name, title, department, email, is_primary, is_billing_contact, is_purchasing_contact, is_warehouse_receiver, is_showroom_floor_sales, is_showroom_manager",
      )
      .eq("customer_account_id", customerId)
      .order("is_primary", { ascending: false })
      .order("name", { ascending: true }),
    supabase
      .from("sales_order")
      .select(
        "id, sales_order_number, customer_po_number, order_date, created_at, order_source, order_type, status, shipping_readiness_status, credit_hold_status, total_amount, converted_from_quote_id",
      )
      .eq("customer_account_id", customerId)
      .order("order_date", { ascending: false })
      .limit(100),
    supabase
      .from("customer_invoice")
      .select(
        "id, invoice_number, sales_order_id, brand_name_snapshot, invoice_date, due_date, invoice_status, payment_status, total_amount, balance_due, sales_order(customer_po_number)",
      )
      .eq("customer_account_id", customerId)
      .order("invoice_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(1000),
    supabase
      .from("credit_memo")
      .select(
        "id, credit_memo_number, brand_name_snapshot, issue_date, reason_code, status, total_credit_amount, amount_applied, amount_remaining",
      )
      .eq("customer_account_id", customerId)
      .order("issue_date", { ascending: false })
      .limit(8),
    supabase
      .from("packing_list")
      .select(
        "id, packing_list_number, sales_order_id, customer_po_number_snapshot, status, invoice_generation_status_snapshot, shipping_fee, allocated_freight_cost, freight_shipment_id, ship_date",
      )
      .eq("customer_account_id", customerId)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("primary_showroom_enrollment")
      .select("customer_location_id, program_status")
      .eq("customer_account_id", customerId)
      .in("program_status", [
        "pending",
        "active",
        "pending_renew",
        "suspended",
      ]),
    supabase
      .from("rga")
      .select("id, rga_number, status, requested_resolution_type, request_date")
      .eq("customer_account_id", customerId)
      .order("request_date", { ascending: false })
      .limit(8),
    supabase
      .from("customer_billing_profile")
      .select(
        "id, payment_terms, payment_days, credit_limit, credit_limit_source, default_statement_email",
      )
      .eq("customer_account_id", customerId)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("customer_freight_policy")
      .select(
        "policy_name, freight_terms, ltl_freight_terms, ground_freight_terms, preferred_shipping_type, freight_allowance_amount, flat_rate_percent",
      )
      .eq("customer_account_id", customerId)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .limit(3),
    supabase
      .from("active_customer_rep_assignments")
      .select(
        "id, location_name, sales_rep_agency_id, agency_name, sales_rep_name, territory_name, coverage_role",
      )
      .eq("customer_account_id", customerId)
      .order("location_name", { ascending: true }),
    supabase
      .from("attachment")
      .select(
        "id, original_file_name, category, content_type, file_size, storage_bucket, storage_path, uploaded_at",
      )
      .eq("entity_type", "customer_account")
      .eq("entity_id", customerId)
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false }),
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
    attachmentsResult,
  ];
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    throw new Error(failed.error.message);
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { data: last30DayOrders, error: last30DayOrdersError } = await supabase
    .from("sales_order")
    .select("total_amount, order_type")
    .eq("customer_account_id", customerId)
    .neq("status", "deleted")
    .gte("order_date", thirtyDaysAgo.toISOString().slice(0, 10));
  if (last30DayOrdersError) {
    throw new Error(last30DayOrdersError.message);
  }
  const ordersLast30DaysTotal = (last30DayOrders ?? [])
    .filter((order) => order.order_type !== "quote")
    .reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0);

  const orderIds = (ordersResult.data ?? []).map((order) => order.id);
  const orderLinesResult = orderIds.length
    ? await supabase
        .from("sales_order_line")
        .select(
          "sales_order_id, product_id, product_sku_snapshot, quantity_ordered, quantity_shipped, quantity_cancelled, quantity_cleared",
        )
        .in("sales_order_id", orderIds)
    : { data: [], error: null };
  const invoiceIds = (invoicesResult.data ?? []).map((invoice) => invoice.id);
  const invoiceLinesResult = invoiceIds.length
    ? await supabase
        .from("customer_invoice_line")
        .select("customer_invoice_id, product_sku_snapshot")
        .in("customer_invoice_id", invoiceIds)
    : { data: [], error: null };
  if (orderLinesResult.error) {
    throw new Error(orderLinesResult.error.message);
  }
  if (invoiceLinesResult.error) {
    throw new Error(invoiceLinesResult.error.message);
  }
  const { data: orderPackingLists, error: orderPackingListsError } =
    orderIds.length
      ? await supabase
          .from("packing_list")
          .select("sales_order_id, freight_shipment_id")
          .in("sales_order_id", orderIds)
          .not("freight_shipment_id", "is", null)
      : { data: [], error: null };
  if (orderPackingListsError) {
    throw new Error(orderPackingListsError.message);
  }
  const shipmentIds = [
    ...new Set(
      (orderPackingLists ?? [])
        .map((packingList) => packingList.freight_shipment_id)
        .filter(Boolean),
    ),
  ];
  const { data: pendingShipments, error: pendingShipmentsError } =
    shipmentIds.length
      ? await supabase
          .from("freight_shipment")
          .select("id, status")
          .in("id", shipmentIds)
          .in("status", ["pending", "in_progress"])
      : { data: [], error: null };
  if (pendingShipmentsError) {
    throw new Error(pendingShipmentsError.message);
  }
  const pendingShipmentIds = new Set(
    (pendingShipments ?? []).map((shipment) => shipment.id),
  );
  const shippingInProgressOrderIds = new Set(
    (orderPackingLists ?? [])
      .filter(
        (packingList) =>
          packingList.freight_shipment_id &&
          pendingShipmentIds.has(packingList.freight_shipment_id),
      )
      .map((packingList) => packingList.sales_order_id),
  );
  const orderProductIds = [
    ...new Set(
      (orderLinesResult.data ?? [])
        .map((line) => line.product_id)
        .filter(Boolean),
    ),
  ];
  const inventoryResult = orderProductIds.length
    ? await supabase
        .from("inventory_sku_summary")
        .select("product_id, sellable_quantity")
        .in("product_id", orderProductIds)
    : { data: [], error: null };
  if (inventoryResult.error) {
    throw new Error(inventoryResult.error.message);
  }
  const inventoryByProduct = new Map(
    (inventoryResult.data ?? []).map((item) => [
      item.product_id,
      Number(item.sellable_quantity ?? 0),
    ]),
  );
  const shippingByOrder = new Map<string, { shipped: number; total: number }>();
  const readyToShipOrderIds = new Set<string>();
  const orderSearchSkus = new Map<string, string[]>();
  const invoiceSearchSkus = new Map<string, string[]>();
  for (const line of invoiceLinesResult.data ?? []) {
    const skus = invoiceSearchSkus.get(line.customer_invoice_id) ?? [];
    if (line.product_sku_snapshot) {
      skus.push(line.product_sku_snapshot);
    }
    invoiceSearchSkus.set(line.customer_invoice_id, skus);
  }
  for (const orderId of orderIds) {
    const lines = (orderLinesResult.data ?? []).filter(
      (line) => line.sales_order_id === orderId,
    );
    let readyToShip = 0;
    orderSearchSkus.set(
      orderId,
      lines.map((line) => line.product_sku_snapshot).filter(Boolean),
    );
    shippingByOrder.set(orderId, {
      shipped: lines.reduce(
        (sum, line) => sum + Number(line.quantity_shipped ?? 0),
        0,
      ),
      total: lines.reduce(
        (sum, line) => sum + Number(line.quantity_ordered ?? 0),
        0,
      ),
    });
    for (const line of lines) {
      const remaining = Math.max(
        0,
        Number(line.quantity_ordered ?? 0) -
          Number(line.quantity_shipped ?? 0) -
          Number(line.quantity_cancelled ?? 0) -
          Number(line.quantity_cleared ?? 0),
      );
      readyToShip += Math.min(
        remaining,
        inventoryByProduct.get(line.product_id) ?? 0,
      );
    }
    if (readyToShip > 0) readyToShipOrderIds.add(orderId);
  }

  const convertedOrderByQuoteId = new Map(
    (ordersResult.data ?? [])
      .filter((order) => order.converted_from_quote_id)
      .map((order) => [
        order.converted_from_quote_id!,
        { id: order.id, sales_order_number: order.sales_order_number },
      ]),
  );

  return {
    billing: billingResult.data as BillingProfile | null,
    attachments: (attachmentsResult.data ?? []) as CustomerAttachment[],
    contacts: (contactsResult.data ?? []) as CustomerContact[],
    creditMemos: (creditMemosResult.data ?? []) as CreditMemo[],
    customer: customerResult.data as CustomerAccount,
    freightPolicies: (freightResult.data ?? []) as FreightPolicy[],
    invoices: (invoicesResult.data ?? []) as CustomerInvoice[],
    invoiceSearchSkus: Object.fromEntries(invoiceSearchSkus),
    locations: (locationsResult.data ?? []) as CustomerLocation[],
    orders: (ordersResult.data ?? []).map((order) => ({
      ...order,
      converted_order:
        order.order_type === "quote"
          ? (convertedOrderByQuoteId.get(order.id) ?? null)
          : null,
      shipping_in_progress: shippingInProgressOrderIds.has(order.id),
      shipping_quantity: shippingByOrder.get(order.id) ?? {
        shipped: 0,
        total: 0,
      },
    })) as SalesOrder[],
    orderSearchSkus: Object.fromEntries(orderSearchSkus),
    ordersLast30DaysTotal,
    readyToShipOrderCount: (ordersResult.data ?? []).filter(
      (order) =>
        order.order_type !== "quote" &&
        order.status !== "closed" &&
        order.status !== "deleted" &&
        readyToShipOrderIds.has(order.id),
    ).length,
    packingLists: (packingListsResult.data ?? []) as PackingList[],
    primaryShowrooms: (primaryShowroomsResult.data ??
      []) as PrimaryShowroomEnrollment[],
    rgas: (rgasResult.data ?? []) as Rga[],
    salesRepAssignments: (salesRepAssignmentsResult.data ??
      []) as CustomerSalesRepAssignment[],
  };
}

async function getOrderEntryData(customerId: string) {
  const supabase = createSupabaseAdminClient();
  const [customerResult, locationsResult, accessoryResult] = await Promise.all([
    supabase
      .from("customer_account")
      .select("id, name, default_discount_percent")
      .eq("id", customerId)
      .single(),
    supabase
      .from("customer_location")
      .select(
        "id, location_name, address_line_1, city, state_province, country_code, email, is_default_ship_to",
      )
      .eq("customer_account_id", customerId)
      .eq("is_shipping_address", true)
      .eq("status", "active")
      .order("is_default_ship_to", { ascending: false })
      .order("location_name", { ascending: true }),
    supabase
      .from("product_category")
      .select("id")
      .or("category_code.eq.accessory,name.ilike.Accessory"),
  ]);

  const initialFailure = [
    customerResult,
    locationsResult,
    accessoryResult,
  ].find((result) => result.error);
  if (initialFailure?.error) {
    throw new Error(initialFailure.error.message);
  }

  if (!customerResult.data) return null;

  const accessoryIds = (accessoryResult.data ?? []).map(
    (category) => category.id,
  );
  let productRequest = supabase
    .from("product")
    .select("id, sku, name, default_price, brand(name)")
    .eq("status", "active")
    .eq("sellability_status", "sellable")
    .order("sku", { ascending: true })
    .limit(1000);

  if (accessoryIds.length > 0) {
    productRequest = productRequest.not(
      "product_category_id",
      "in",
      `(${accessoryIds.join(",")})`,
    );
  }

  const { data: products, error: productsError } = await productRequest;
  if (productsError) throw new Error(productsError.message);

  const productIds = (products ?? []).map((product) => product.id);
  const partProductRequest = accessoryIds.length
    ? supabase
        .from("product")
        .select("id, sku, name, default_price, brand(name)")
        .eq("status", "active")
        .eq("sellability_status", "sellable")
        .in("product_category_id", accessoryIds)
        .order("sku", { ascending: true })
        .limit(1000)
    : null;
  const [inventoryResult, partProductsResult, partLinksResult] =
    await Promise.all([
      productIds.length
        ? supabase
            .from("inventory_sku_summary")
            .select("product_id, sellable_quantity")
            .in("product_id", productIds)
        : Promise.resolve({ data: [], error: null }),
      partProductRequest ?? Promise.resolve({ data: [], error: null }),
      supabase
        .from("product_part")
        .select("component_product_id, parent_product_id, part_role")
        .eq("is_active", true),
    ]);
  const inventory = inventoryResult.data;
  const inventoryError = inventoryResult.error;
  if (inventoryError) throw new Error(inventoryError.message);
  if (partProductsResult.error)
    throw new Error(partProductsResult.error.message);
  if (partLinksResult.error) throw new Error(partLinksResult.error.message);

  const partProductIds = (partProductsResult.data ?? []).map((part) => part.id);
  const { data: partInventory, error: partInventoryError } =
    partProductIds.length
      ? await supabase
          .from("inventory_sku_summary")
          .select("product_id, sellable_quantity")
          .in("product_id", partProductIds)
      : { data: [], error: null };
  if (partInventoryError) throw new Error(partInventoryError.message);

  const inventoryByProduct = new Map(
    [...(inventory ?? []), ...(partInventory ?? [])].map((item) => [
      item.product_id,
      Number(item.sellable_quantity ?? 0),
    ]),
  );
  const productOptions: OrderProductOption[] = (products ?? []).map(
    (product) => ({
      brandName: product.brand?.name ?? "Not set",
      defaultPrice: Number(product.default_price ?? 0),
      id: product.id,
      inventory: inventoryByProduct.get(product.id) ?? 0,
      name: product.name,
      sku: product.sku,
    }),
  );
  const partLinksByComponentId = new Map<
    string,
    { parentProductId: string; role: string | null }[]
  >();
  (partLinksResult.data ?? []).forEach((link) => {
    partLinksByComponentId.set(link.component_product_id, [
      ...(partLinksByComponentId.get(link.component_product_id) ?? []),
      { parentProductId: link.parent_product_id, role: link.part_role },
    ]);
  });
  const partOptions: OrderPartOption[] = (partProductsResult.data ?? []).map(
    (part) => {
      const links = partLinksByComponentId.get(part.id) ?? [];
      return {
        brandName: part.brand?.name ?? "Not set",
        defaultPrice: Number(part.default_price ?? 0),
        id: part.id,
        inventory: inventoryByProduct.get(part.id) ?? 0,
        name: part.name,
        parentProductIds: links.map((link) => link.parentProductId),
        parentRoles: links.map((link) => link.role).filter(Boolean) as string[],
        sku: part.sku,
      };
    },
  );
  const shipToOptions: OrderShipToOption[] = (locationsResult.data ?? []).map(
    (location) => ({
      address: [
        location.address_line_1,
        location.city,
        location.state_province,
        location.country_code,
      ]
        .filter(Boolean)
        .join(", "),
      email: location.email,
      id: location.id,
      isDefault: location.is_default_ship_to,
      name: location.location_name,
    }),
  );

  return {
    customer: customerResult.data,
    partOptions,
    products: productOptions,
    shipToOptions,
  };
}

async function NewOrderPage({
  customerId,
  error,
  locationId,
}: {
  customerId?: string;
  error?: string;
  locationId?: string;
}) {
  if (!customerId) {
    return (
      <ModulePlaceholder moduleName="Choose a customer account before entering a new order" />
    );
  }

  const data = await getOrderEntryData(customerId);
  if (!data)
    return <ModulePlaceholder moduleName="Customer account not found" />;

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Order Entry</span>
          <Link
            className="context-parent-link"
            href={`/?customer=${customerId}`}
          >
            {data.customer.name}
          </Link>
          <h2>Enter New Order</h2>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      <OrderEntryForm
        accountName={data.customer.name}
        customerId={customerId}
        defaultDiscountPercent={Number(
          data.customer.default_discount_percent ?? 0,
        )}
        defaultLocationId={locationId}
        parts={data.partOptions}
        products={data.products}
        saveAction={createSalesOrderAction}
        shipToOptions={data.shipToOptions}
      />
    </section>
  );
}

async function getSalesOrderDetail(
  orderId: string,
): Promise<SalesOrderDetail | null> {
  const supabase = createSupabaseAdminClient();
  const [orderResult, linesResult] = await Promise.all([
    supabase
      .from("sales_order")
      .select(
        "id, customer_account_id, customer_location_id, sales_order_number, customer_po_number, customer_name_snapshot, order_date, requested_ship_date, order_source, order_type, status, shipping_readiness_status, credit_hold_status, is_dropship, ship_to_type, ship_to_display_name_snapshot, ship_to_snapshot_json, bill_to_snapshot_json, shipping_priority, sales_rep_agency_id_snapshot, sales_rep_id_snapshot, territory_id_snapshot, subtotal_amount, freight_amount, tax_amount, total_amount, notes",
      )
      .eq("id", orderId)
      .maybeSingle(),
    supabase
      .from("sales_order_line")
      .select(
        "id, line_number, product_id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_ordered, quantity_shipped, quantity_cancelled, quantity_cleared, unit_price, discount_percent, line_total, line_status",
      )
      .eq("sales_order_id", orderId)
      .order("line_number", { ascending: true }),
  ]);

  const failure = [orderResult, linesResult].find((result) => result.error);
  if (failure?.error) throw new Error(failure.error.message);
  if (!orderResult.data) return null;

  const convertedOrderResult =
    orderResult.data.order_type === "quote"
      ? await supabase
          .from("sales_order")
          .select("id, sales_order_number")
          .eq("converted_from_quote_id", orderId)
          .maybeSingle()
      : { data: null, error: null };
  if (convertedOrderResult.error)
    throw new Error(convertedOrderResult.error.message);

  const productIds = [
    ...new Set((linesResult.data ?? []).map((line) => line.product_id)),
  ];
  const inventoryResult = productIds.length
    ? await supabase
        .from("inventory_sku_summary")
        .select("product_id, sellable_quantity")
        .in("product_id", productIds)
    : { data: [], error: null };
  if (inventoryResult.error) throw new Error(inventoryResult.error.message);
  const inventoryByProduct = new Map(
    (inventoryResult.data ?? []).map((item) => [
      item.product_id,
      Number(item.sellable_quantity ?? 0),
    ]),
  );

  return {
    ...orderResult.data,
    converted_order: convertedOrderResult.data,
    lines: (linesResult.data ?? []).map((line) => ({
      ...line,
      available_inventory: inventoryByProduct.get(line.product_id) ?? 0,
      line_total: Number(line.line_total ?? 0),
    })),
  } as unknown as SalesOrderDetail;
}

async function getInvoiceQueuePackingLists() {
  const supabase = createSupabaseAdminClient();
  const { data: packingLists, error: packingListsError } = await supabase
    .from("packing_list")
    .select(
      "id, packing_list_number, customer_account_id, customer_po_number_snapshot, sales_order_number_snapshot, status, invoice_generation_status_snapshot, shipping_fee, allocated_freight_cost, dropship_fee_amount, ship_date, created_at",
    )
    .eq("invoice_required", true)
    .eq("invoice_generation_status_snapshot", "not_invoiced")
    .in("status", ["shipped", "invoiced"])
    .order("ship_date", { ascending: true });
  if (packingListsError) throw new Error(packingListsError.message);

  const customerIds = [
    ...new Set(
      (packingLists ?? []).map(
        (packingList) => packingList.customer_account_id,
      ),
    ),
  ];
  const packingListIds = (packingLists ?? []).map(
    (packingList) => packingList.id,
  );
  const [customersResult, linesResult, billingProfilesResult] =
    await Promise.all([
      customerIds.length
        ? supabase
            .from("customer_account")
            .select("id, name")
            .in("id", customerIds)
        : Promise.resolve({ data: [], error: null }),
      packingListIds.length
        ? supabase
            .from("packing_list_line")
            .select(
              "packing_list_id, brand_id_snapshot, brand_name_snapshot, line_total",
            )
            .in("packing_list_id", packingListIds)
        : Promise.resolve({ data: [], error: null }),
      customerIds.length
        ? supabase
            .from("customer_billing_profile")
            .select("customer_account_id, payment_terms, payment_days")
            .in("customer_account_id", customerIds)
            .eq("is_active", true)
        : Promise.resolve({ data: [], error: null }),
    ]);
  if (customersResult.error || linesResult.error || billingProfilesResult.error)
    throw new Error(
      customersResult.error?.message ??
        linesResult.error?.message ??
        billingProfilesResult.error?.message ??
        "Unable to load invoice work.",
    );

  const customersById = new Map(
    (customersResult.data ?? []).map((customer) => [
      customer.id,
      customer.name,
    ]),
  );
  const billingProfilesByCustomerId = new Map(
    (billingProfilesResult.data ?? []).map((profile) => [
      profile.customer_account_id,
      profile,
    ]),
  );
  const brandSummariesByPackingList = new Map<string, InvoiceBrandSummary[]>();
  for (const line of linesResult.data ?? []) {
    const summaries =
      brandSummariesByPackingList.get(line.packing_list_id) ?? [];
    const summary = summaries.find(
      (item) => item.brand_id === line.brand_id_snapshot,
    );
    if (summary) summary.subtotal_amount += Number(line.line_total ?? 0);
    else
      summaries.push({
        brand_id: line.brand_id_snapshot,
        brand_name: line.brand_name_snapshot,
        subtotal_amount: Number(line.line_total ?? 0),
      });
    brandSummariesByPackingList.set(line.packing_list_id, summaries);
  }

  return (packingLists ?? []).map((packingList) => ({
    ...packingList,
    customer_name:
      customersById.get(packingList.customer_account_id) ?? "Unknown customer",
    payment_days:
      billingProfilesByCustomerId.get(packingList.customer_account_id)
        ?.payment_days ?? 0,
    payment_terms:
      billingProfilesByCustomerId.get(packingList.customer_account_id)
        ?.payment_terms ?? "Prepaid / No Credit",
    brandSummaries: brandSummariesByPackingList.get(packingList.id) ?? [],
  }));
}

async function InvoiceQueuePage({
  error,
  financialTab,
  financialFilters,
  notice,
}: {
  error?: string;
  financialTab?: string;
  financialFilters: {
    page?: string;
    pageSize?: string;
    query?: string;
    advanced?: string;
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    customer?: string;
    skus?: string;
  };
  notice?: string;
}) {
  const packingLists = await getInvoiceQueuePackingLists();
  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href="/">
            ERP Dashboard
          </Link>
          <div className="record-title-row">
            <h2>Financial Dashboard</h2>
          </div>
          <p>Financial work is organized by invoice and payment status.</p>
        </div>
      </section>
      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {notice ? (
        <div className="notice-banner">{decodeURIComponent(notice)}</div>
      ) : null}
      <FinancialDashboardTabs
        financialFilters={financialFilters}
        financialTab={financialTab}
        packingLists={packingLists}
      />
    </section>
  );
}

async function getPaymentEntry(invoiceId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: invoice, error: invoiceError } = await supabase
    .from("customer_invoice")
    .select(
      "id, customer_account_id, brand_id, invoice_number, brand_name_snapshot, customer_name_snapshot, invoice_date, due_date, total_amount, balance_due, payment_status, invoice_status",
    )
    .eq("id", invoiceId)
    .maybeSingle();

  if (invoiceError) throw new Error(invoiceError.message);
  if (!invoice) return null;

  const { data: availableCreditMemos, error: creditMemoError } = await supabase
    .from("credit_memo")
    .select("id, credit_memo_number, issue_date, amount_remaining")
    .eq("customer_account_id", invoice.customer_account_id)
    .eq("brand_id", invoice.brand_id)
    .in("status", ["posted", "partially_applied"])
    .gt("amount_remaining", 0)
    .order("issue_date", { ascending: false });
  if (creditMemoError) throw new Error(creditMemoError.message);

  return {
    creditMemos: availableCreditMemos ?? [],
    invoice,
  };
}

async function getPaymentDetail(paymentId: string) {
  const supabase = createSupabaseAdminClient();
  const [
    { data: payment, error: paymentError },
    { data: applications, error: applicationsError },
    { data: attachments },
  ] = await Promise.all([
    supabase
      .from("customer_payment")
      .select(
        "id, payment_number, customer_account_id, payment_date, payment_method, reference_number, amount_received, amount_applied, amount_unapplied, memo, status, posted_at, created_at",
      )
      .eq("id", paymentId)
      .maybeSingle(),
    supabase
      .from("customer_payment_application")
      .select(
        "id, customer_invoice_id, amount_applied, line_waive_amount, applied_date, application_status, notes",
      )
      .eq("customer_payment_id", paymentId)
      .order("created_at", { ascending: false }),
    supabase
      .from("attachment")
      .select(
        "id, original_file_name, category, storage_bucket, storage_path, uploaded_at",
      )
      .eq("entity_type", "customer_payment")
      .eq("entity_id", paymentId)
      .eq("is_active", true)
      .order("uploaded_at", { ascending: false }),
  ]);
  if (paymentError) throw new Error(paymentError.message);
  if (applicationsError) throw new Error(applicationsError.message);
  if (!payment) return null;

  const invoiceIds = [
    ...new Set(
      (applications ?? []).map(
        (application) => application.customer_invoice_id,
      ),
    ),
  ];
  const [
    { data: invoices, error: invoicesError },
    { data: customer, error: customerError },
  ] = await Promise.all([
    invoiceIds.length
      ? supabase
          .from("customer_invoice")
          .select(
            "id, invoice_number, brand_name_snapshot, invoice_date, total_amount, balance_due",
          )
          .in("id", invoiceIds)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("customer_account")
      .select("id, name")
      .eq("id", payment.customer_account_id)
      .maybeSingle(),
  ]);
  if (invoicesError) throw new Error(invoicesError.message);
  if (customerError) throw new Error(customerError.message);
  const invoiceById = new Map(
    (invoices ?? []).map((invoice) => [invoice.id, invoice]),
  );
  const documents = await Promise.all(
    (attachments ?? []).map(async (attachment) => {
      const { data } = await supabase.storage
        .from(attachment.storage_bucket)
        .createSignedUrl(attachment.storage_path, 60 * 60);
      return { ...attachment, downloadUrl: data?.signedUrl ?? null };
    }),
  );

  return {
    applications: applications ?? [],
    customer,
    documents,
    invoices: invoices ?? [],
    payment,
  };
}

async function getCreatedInvoices(ids: string[]) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("customer_invoice")
    .select(
      "id, invoice_number, brand_name_snapshot, customer_name_snapshot, invoice_date, due_date, freight_amount, total_amount, invoice_status, email_status",
    )
    .in("id", ids);
  if (error) {
    throw new Error(error.message);
  }

  const invoicesById = new Map(
    (data ?? []).map((invoice) => [invoice.id, invoice]),
  );
  return ids.flatMap((id) => {
    const invoice = invoicesById.get(id);
    return invoice ? [invoice] : [];
  });
}

async function getInvoiceDocument(invoiceId: string) {
  const supabase = createSupabaseAdminClient();
  const [
    { data: invoice, error: invoiceError },
    { data: lines, error: linesError },
  ] = await Promise.all([
    supabase
      .from("customer_invoice")
      .select(
        "id, invoice_number, brand_name_snapshot, customer_name_snapshot, customer_account_id, sales_order_id, invoice_date, due_date, payment_terms_snapshot, bill_to_snapshot_json, ship_to_snapshot_json, subtotal_amount, freight_amount, dropship_fee_amount, tax_amount, total_amount, balance_due",
      )
      .eq("id", invoiceId)
      .maybeSingle(),
    supabase
      .from("customer_invoice_line")
      .select(
        "id, product_sku_snapshot, product_name_snapshot, quantity_invoiced, unit_price, discount_percent, line_total",
      )
      .eq("customer_invoice_id", invoiceId)
      .order("created_at"),
  ]);
  if (invoiceError) throw new Error(invoiceError.message);
  if (linesError) throw new Error(linesError.message);
  if (!invoice) return null;

  const [
    { data: customer, error: customerError },
    { data: salesOrder, error: salesOrderError },
  ] = await Promise.all([
    supabase
      .from("customer_account")
      .select("billing_email")
      .eq("id", invoice.customer_account_id)
      .maybeSingle(),
    supabase
      .from("sales_order")
      .select("id, customer_po_number")
      .eq("id", invoice.sales_order_id)
      .maybeSingle(),
  ]);
  if (customerError) throw new Error(customerError.message);
  if (salesOrderError) throw new Error(salesOrderError.message);

  return {
    customer,
    invoice,
    lines: lines ?? [],
    salesOrder,
  };
}

async function OrdersOverview({
  error,
  notice,
  orderAction,
  orderAdvanced,
  orderCustomer,
  orderCustomerName,
  orderDateFrom,
  orderDateTo,
  orderDir,
  orderId,
  orderPage,
  orderPageSize,
  orderQuery,
  orderReady,
  orderRep,
  orderSku,
  orderSort,
  orderStatus,
  orderTerritory,
  quoteMode = false,
  returnCustomerId,
}: {
  error?: string;
  notice?: string;
  orderAction?: string;
  orderAdvanced?: string;
  orderCustomer?: string;
  orderCustomerName?: string;
  orderDateFrom?: string;
  orderDateTo?: string;
  orderDir?: string;
  orderId?: string;
  orderPage?: string;
  orderPageSize?: string;
  orderQuery?: string;
  orderReady?: string;
  orderRep?: string;
  orderSku?: string;
  orderSort?: string;
  orderStatus?: string;
  orderTerritory?: string;
  quoteMode?: boolean;
  returnCustomerId?: string;
}) {
  const supabase = createSupabaseAdminClient();
  if (orderId) {
    const order = await getSalesOrderDetail(orderId);
    if (!order) return <ModulePlaceholder moduleName="Order not found" />;
    if (orderAction === "edit") {
      const [
        orderEntryData,
        locationsResult,
        salesRepOptions,
        territoryOptions,
      ] = await Promise.all([
        getOrderEntryData(order.customer_account_id),
        supabase
          .from("customer_location")
          .select(
            "id, location_name, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, email, is_billing_address, is_default_ship_to, is_shipping_address",
          )
          .eq("customer_account_id", order.customer_account_id)
          .eq("status", "active")
          .order("location_name", { ascending: true }),
        getSalesRepOptions(),
        getTerritoryOptions(),
      ]);
      if (locationsResult.error) throw new Error(locationsResult.error.message);
      const addressOptions: OrderAddressOption[] = (
        locationsResult.data ?? []
      ).map((location) => ({
        address: [
          location.address_line_1,
          location.address_line_2,
          location.city,
          location.state_province,
          location.postal_code,
          location.country,
        ]
          .filter(Boolean)
          .join(", "),
        addressLine1: location.address_line_1,
        addressLine2: location.address_line_2,
        city: location.city,
        country: location.country,
        countryCode: location.country_code,
        email: location.email,
        id: location.id,
        isDefault: location.is_default_ship_to,
        name: location.location_name,
        postalCode: location.postal_code,
        stateProvince: location.state_province,
      }));
      return (
        <EditOrderPage
          billingAddressOptions={addressOptions.filter(
            (location) =>
              (locationsResult.data ?? []).find(
                (item) => item.id === location.id,
              )?.is_billing_address,
          )}
          defaultDiscountPercent={Number(
            orderEntryData?.customer.default_discount_percent ?? 0,
          )}
          error={error}
          order={order}
          parts={orderEntryData?.partOptions ?? []}
          products={orderEntryData?.products ?? []}
          salesRepOptions={salesRepOptions}
          shipToOptions={addressOptions.filter(
            (location) =>
              (locationsResult.data ?? []).find(
                (item) => item.id === location.id,
              )?.is_shipping_address,
          )}
          territoryOptions={territoryOptions}
        />
      );
    }
    return (
      <OrderDetailPage order={order} returnCustomerId={returnCustomerId} />
    );
  }

  let ordersQuery = supabase
    .from("sales_order")
    .select(
      "id, customer_account_id, sales_order_number, customer_po_number, customer_name_snapshot, order_date, created_at, order_source, order_type, status, shipping_readiness_status, credit_hold_status, sales_rep_id_snapshot, territory_id_snapshot, total_amount",
    );
  if (orderStatus !== "deleted")
    ordersQuery = ordersQuery.neq("status", "deleted");
  if (orderStatus)
    ordersQuery = ordersQuery.eq(
      "status",
      orderStatus as
        | "open"
        | "closed"
        | "deleted"
        | "draft"
        | "cancelled"
        | "shipped"
        | "partially_shipped"
        | "pending"
        | "hold"
        | "void",
    );
  if (orderCustomer)
    ordersQuery = ordersQuery.eq("customer_account_id", orderCustomer);
  if (orderDateFrom) ordersQuery = ordersQuery.gte("order_date", orderDateFrom);
  if (orderDateTo) ordersQuery = ordersQuery.lte("order_date", orderDateTo);
  const { data, error: ordersError } = await ordersQuery
    .order("order_date", { ascending: false })
    .limit(100);
  if (ordersError) throw new Error(ordersError.message);

  const backToCustomerId = orderCustomer ?? null;
  const orderIds = (data ?? []).map((order) => order.id);
  const orderLinesResult = orderIds.length
    ? await supabase
        .from("sales_order_line")
        .select(
          "sales_order_id, product_id, product_sku_snapshot, quantity_ordered, quantity_shipped, quantity_cancelled, quantity_cleared",
        )
        .in("sales_order_id", orderIds)
    : { data: [], error: null };
  if (orderLinesResult.error) throw new Error(orderLinesResult.error.message);

  const { data: orderPackingLists, error: orderPackingListsError } =
    orderIds.length
      ? await supabase
          .from("packing_list")
          .select("sales_order_id, freight_shipment_id")
          .in("sales_order_id", orderIds)
          .not("freight_shipment_id", "is", null)
      : { data: [], error: null };
  if (orderPackingListsError) throw new Error(orderPackingListsError.message);
  const shipmentIds = [
    ...new Set(
      (orderPackingLists ?? [])
        .map((packingList) => packingList.freight_shipment_id)
        .filter(Boolean),
    ),
  ];
  const { data: pendingShipments, error: pendingShipmentsError } =
    shipmentIds.length
      ? await supabase
          .from("freight_shipment")
          .select("id")
          .in("id", shipmentIds)
          .in("status", ["pending", "in_progress"])
      : { data: [], error: null };
  if (pendingShipmentsError) throw new Error(pendingShipmentsError.message);
  const pendingShipmentIds = new Set(
    (pendingShipments ?? []).map((shipment) => shipment.id),
  );
  const shippingInProgressOrderIds = new Set(
    (orderPackingLists ?? [])
      .filter(
        (packingList) =>
          packingList.freight_shipment_id &&
          pendingShipmentIds.has(packingList.freight_shipment_id),
      )
      .map((packingList) => packingList.sales_order_id),
  );

  const orderProductIds = [
    ...new Set((orderLinesResult.data ?? []).map((line) => line.product_id)),
  ];
  const inventoryResult = orderProductIds.length
    ? await supabase
        .from("inventory_sku_summary")
        .select("product_id, sellable_quantity, next_incoming_eta")
        .in("product_id", orderProductIds)
    : { data: [], error: null };
  if (inventoryResult.error) throw new Error(inventoryResult.error.message);
  const inventoryByProduct = new Map(
    (inventoryResult.data ?? []).map((item) => [item.product_id, item]),
  );
  const orderShipping = new Map<
    string,
    {
      backorders: number;
      nextEta: string | null;
      ordered: number;
      readyToShip: number;
    }
  >();
  for (const orderId of orderIds) {
    const lines = (orderLinesResult.data ?? []).filter(
      (line) => line.sales_order_id === orderId,
    );
    const ordered = lines.reduce(
      (sum, line) => sum + Number(line.quantity_ordered ?? 0),
      0,
    );
    let backorders = 0;
    let readyToShip = 0;
    let nextEta: string | null = null;
    for (const line of lines) {
      const remaining = Math.max(
        0,
        Number(line.quantity_ordered ?? 0) -
          Number(line.quantity_shipped ?? 0) -
          Number(line.quantity_cancelled ?? 0) -
          Number(line.quantity_cleared ?? 0),
      );
      const inventory = inventoryByProduct.get(line.product_id);
      const available = Number(inventory?.sellable_quantity ?? 0);
      readyToShip += Math.min(remaining, available);
      backorders += Math.max(0, remaining - available);
      if (
        remaining > available &&
        inventory?.next_incoming_eta &&
        (!nextEta || inventory.next_incoming_eta < nextEta)
      ) {
        nextEta = inventory.next_incoming_eta;
      }
    }
    orderShipping.set(orderId, { backorders, nextEta, ordered, readyToShip });
  }
  const [territoryResult, repResult] = await Promise.all([
    orderTerritory
      ? supabase.from("territory").select("id, name")
      : Promise.resolve({ data: [], error: null }),
    orderRep
      ? supabase.from("sales_rep").select("id, name")
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (territoryResult.error) throw new Error(territoryResult.error.message);
  if (repResult.error) throw new Error(repResult.error.message);
  const territoryQuery = (orderTerritory ?? "").trim().toLowerCase();
  const repQuery = (orderRep ?? "").trim().toLowerCase();
  const territoryIds = new Set(
    (territoryResult.data ?? [])
      .filter(
        (territory) =>
          territory.name.toLowerCase().includes(territoryQuery) ||
          territory.id.toLowerCase().includes(territoryQuery),
      )
      .map((territory) => territory.id),
  );
  const repIds = new Set(
    (repResult.data ?? [])
      .filter(
        (rep) =>
          rep.name.toLowerCase().includes(repQuery) ||
          rep.id.toLowerCase().includes(repQuery),
      )
      .map((rep) => rep.id),
  );
  const quickSearch = (orderCustomerName ?? "").trim().toLowerCase();
  const orderSearch = (orderSku ?? "").trim().toLowerCase();
  const quickQuery = (orderQuery ?? "").trim().toLowerCase();
  const allOrders = (data ?? []).filter((order) => {
    const matchesQuoteMode = quoteMode
      ? order.order_type === "quote"
      : order.order_type !== "quote";
    const matchesReady =
      orderReady !== "true" ||
      (orderShipping.get(order.id)?.readyToShip ?? 0) > 0;
    const matchesCustomer =
      !quickSearch ||
      order.customer_name_snapshot.toLowerCase().includes(quickSearch);
    const matchesSku =
      !orderSearch ||
      (orderLinesResult.data ?? []).some(
        (line) =>
          line.sales_order_id === order.id &&
          String(line.product_sku_snapshot ?? "")
            .toLowerCase()
            .includes(orderSearch),
      );
    const matchesQuick =
      !quickQuery ||
      [
        order.sales_order_number,
        order.customer_po_number,
        order.customer_name_snapshot,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(quickQuery),
      ) ||
      (orderLinesResult.data ?? []).some(
        (line) =>
          line.sales_order_id === order.id &&
          String(line.product_sku_snapshot ?? "")
            .toLowerCase()
            .includes(quickQuery),
      );
    const matchesTerritory =
      !territoryQuery ||
      territoryIds.has(String(order.territory_id_snapshot ?? ""));
    const matchesRep =
      !repQuery || repIds.has(String(order.sales_rep_id_snapshot ?? ""));
    return (
      matchesQuoteMode &&
      matchesReady &&
      matchesCustomer &&
      matchesSku &&
      matchesQuick &&
      matchesTerritory &&
      matchesRep
    );
  });
  const activeSort =
    orderSort === "order_date" || orderSort === "ready_to_ship"
      ? orderSort
      : "priority";
  const activeDirection = orderDir === "asc" ? "asc" : "desc";
  const sortedOrders = [...allOrders].sort((left, right) => {
    if (activeSort === "order_date") {
      const comparison = left.order_date.localeCompare(right.order_date);
      return activeDirection === "asc" ? comparison : -comparison;
    }
    if (activeSort === "ready_to_ship") {
      const comparison =
        (orderShipping.get(left.id)?.readyToShip ?? 0) -
        (orderShipping.get(right.id)?.readyToShip ?? 0);
      if (comparison !== 0)
        return activeDirection === "asc" ? comparison : -comparison;
      return left.order_date.localeCompare(right.order_date);
    }
    const leftReady =
      (orderShipping.get(left.id)?.readyToShip ?? 0) > 0 ? 1 : 0;
    const rightReady =
      (orderShipping.get(right.id)?.readyToShip ?? 0) > 0 ? 1 : 0;
    if (leftReady !== rightReady) return rightReady - leftReady;
    return left.order_date.localeCompare(right.order_date);
  });
  const pageSize = [10, 20, 30].includes(Number(orderPageSize))
    ? Number(orderPageSize)
    : 10;
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number(orderPage ?? 1) || 1),
  );
  const pageOrders = sortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const openOrderTotal = allOrders.reduce(
    (sum, order) => sum + Number(order.total_amount ?? 0),
    0,
  );
  const readyOrderCount = allOrders.filter(
    (order) => (orderShipping.get(order.id)?.readyToShip ?? 0) > 0,
  ).length;
  const orderFilterParams = [
    orderStatus ? `order_status=${encodeURIComponent(orderStatus)}` : "",
    orderCustomer ? `order_customer=${encodeURIComponent(orderCustomer)}` : "",
    orderReady === "true" ? "order_ready=true" : "",
    orderPageSize ? `order_page_size=${pageSize}` : "",
    orderQuery ? `order_q=${encodeURIComponent(orderQuery)}` : "",
    orderCustomerName
      ? `order_customer_name=${encodeURIComponent(orderCustomerName)}`
      : "",
    orderDateFrom ? `order_date_from=${encodeURIComponent(orderDateFrom)}` : "",
    orderDateTo ? `order_date_to=${encodeURIComponent(orderDateTo)}` : "",
    orderSku ? `order_sku=${encodeURIComponent(orderSku)}` : "",
    orderTerritory
      ? `order_territory=${encodeURIComponent(orderTerritory)}`
      : "",
    orderRep ? `order_rep=${encodeURIComponent(orderRep)}` : "",
  ]
    .filter(Boolean)
    .join("&");
  const moduleKey = quoteMode ? "quotes" : "orders";
  const pageHref = (page: number) =>
    `/?module=${moduleKey}${orderFilterParams ? `&${orderFilterParams}` : ""}&order_page=${page}&order_sort=${activeSort}&order_dir=${activeDirection}`;
  const sortHref = (sort: "order_date" | "ready_to_ship") => {
    const nextDirection =
      activeSort === sort && activeDirection === "asc" ? "desc" : "asc";
    return `/?module=${moduleKey}${orderFilterParams ? `&${orderFilterParams}` : ""}&order_page=1&order_sort=${sort}&order_dir=${nextDirection}`;
  };

  return (
    <section className="dashboard-panel">
      <section className="list-header-panel list-header-panel--compact">
        <div>
          {backToCustomerId ? (
            <Link
              className="context-parent-link"
              href={`/?customer=${backToCustomerId}`}
            >
              Back to Dashboard
            </Link>
          ) : null}
          {backToCustomerId ? (
            <span className="orders-context-customer">
              {data?.[0]?.customer_name_snapshot}
            </span>
          ) : (
            <Link className="context-parent-link" href="/">
              ERP Dashboard
            </Link>
          )}
          <h2>
            {quoteMode
              ? "Quotes"
              : orderReady === "true"
                ? "Ready to Ship Orders"
                : orderStatus === "open"
                  ? "Open Orders"
                  : "Orders"}
          </h2>
        </div>
      </section>
      {notice ? (
        <p className="form-alert form-alert--success">{notice}</p>
      ) : null}
      <OrdersOverviewControls
        advanced={
          orderAdvanced === "true" ||
          Boolean(
            orderCustomerName ||
              orderDateFrom ||
              orderDateTo ||
              orderSku ||
              orderTerritory ||
              orderRep ||
              orderStatus,
          )
        }
        moduleKey={moduleKey}
        pageSize={pageSize}
        values={{
          q: orderQuery ?? "",
          dateFrom: orderDateFrom ?? "",
          dateTo: orderDateTo ?? "",
          customer: orderCustomerName ?? "",
          sku: orderSku ?? "",
          territory: orderTerritory ?? "",
          rep: orderRep ?? "",
          status: orderStatus ?? "",
        }}
      />
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sales Order</th>
              <th>Customer PO</th>
              {!orderCustomer ? <th>Customer</th> : null}
              <th>
                <Link className="table-link" href={sortHref("order_date")}>
                  Order Date{" "}
                  {activeSort === "order_date"
                    ? activeDirection === "asc"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </Link>
              </th>
              <th>Source</th>
              <th>Type</th>
              <th>Ordered</th>
              <th>
                <Link className="table-link" href={sortHref("ready_to_ship")}>
                  Ready to Ship{" "}
                  {activeSort === "ready_to_ship"
                    ? activeDirection === "asc"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </Link>
              </th>
              <th>Backorders</th>
              <th>Total</th>
              <th>Shipping Status</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {pageOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link
                    className="table-link"
                    href={`/?module=orders&order=${order.id}`}
                  >
                    {order.sales_order_number}
                  </Link>
                </td>
                <td>{order.customer_po_number}</td>
                {!orderCustomer ? (
                  <td>{order.customer_name_snapshot}</td>
                ) : null}
                <td>{order.order_date}</td>
                <td>{label(order.order_source)}</td>
                <td>{label(order.order_type)}</td>
                <td>
                  {numberFormatter.format(
                    orderShipping.get(order.id)?.ordered ?? 0,
                  )}
                </td>
                <td>
                  {numberFormatter.format(
                    orderShipping.get(order.id)?.readyToShip ?? 0,
                  )}
                </td>
                <td>
                  {(orderShipping.get(order.id)?.backorders ?? 0) > 0
                    ? `${numberFormatter.format(orderShipping.get(order.id)?.backorders ?? 0)} : ${dateLabel(orderShipping.get(order.id)?.nextEta)}`
                    : "No B/O"}
                </td>
                <td>{money(Number(order.total_amount ?? 0))}</td>
                <td>
                  <StatusBadge
                    {...shippingStatus(
                      {
                        shipped: (orderLinesResult.data ?? [])
                          .filter((line) => line.sales_order_id === order.id)
                          .reduce(
                            (sum, line) =>
                              sum + Number(line.quantity_shipped ?? 0),
                            0,
                          ),
                        total: orderShipping.get(order.id)?.ordered ?? 0,
                      },
                      shippingInProgressOrderIds.has(order.id),
                    )}
                  />
                </td>
                <td>
                  <StatusBadge {...orderLifecycleStatus(order.status)} />
                </td>
              </tr>
            ))}
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={orderCustomer ? 11 : 12}>
                  <EmptyState text="No orders have been entered yet." />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {totalPages > 1 ? (
        <nav className="pagination" aria-label="Open order pages">
          <Link className="secondary-action" href={pageHref(1)}>
            First
          </Link>
          <Link
            className="secondary-action"
            href={pageHref(Math.max(1, currentPage - 1))}
          >
            Previous
          </Link>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Link
                aria-current={page === currentPage ? "page" : undefined}
                className={
                  page === currentPage
                    ? "pagination-link pagination-link--active"
                    : "pagination-link"
                }
                href={pageHref(page)}
                key={page}
              >
                {page}
              </Link>
            ),
          )}
          <Link
            className="secondary-action"
            href={pageHref(Math.min(totalPages, currentPage + 1))}
          >
            Next
          </Link>
          <Link className="secondary-action" href={pageHref(totalPages)}>
            Last
          </Link>
        </nav>
      ) : null}
      <p className="open-order-summary">
        {quoteMode ? "Total quotes" : "Total open orders"}:{" "}
        <strong>{numberFormatter.format(allOrders.length)}</strong> | Total
        amount: <strong>{money(openOrderTotal)}</strong>
        {quoteMode ? null : (
          <>
            {" "}
            | Ready to ship orders:{" "}
            <strong>{numberFormatter.format(readyOrderCount)}</strong>
          </>
        )}
      </p>
    </section>
  );
}

async function ShippingDashboardPage({
  error,
  notice,
  shippingTab,
}: {
  error?: string;
  notice?: string;
  shippingTab?: string;
}) {
  const activeTab = ["ready", "backorders", "shipped"].includes(
    shippingTab ?? "",
  )
    ? shippingTab!
    : "ready";
  const supabase = createSupabaseAdminClient();
  const { data: orders, error: ordersError } = await supabase
    .from("sales_order")
    .select(
      "id, sales_order_number, customer_name_snapshot, customer_po_number, created_at, order_date, order_type, ship_to_display_name_snapshot, shipping_priority, status",
    )
    .in("status", ["open", "partially_shipped"])
    .in("order_type", ["regular", "display", "rga_replacement"]);
  if (ordersError) throw new Error(ordersError.message);

  const orderIds = (orders ?? []).map((order) => order.id);
  const { data: lines, error: linesError } = orderIds.length
    ? await supabase
        .from("sales_order_line")
        .select(
          "sales_order_id, product_id, product_sku_snapshot, product_name_snapshot, quantity_ordered, quantity_shipped, quantity_cancelled, quantity_cleared",
        )
        .in("sales_order_id", orderIds)
    : { data: [], error: null };
  if (linesError) throw new Error(linesError.message);

  const productIds = [...new Set((lines ?? []).map((line) => line.product_id))];
  const { data: inventory, error: inventoryError } = productIds.length
    ? await supabase
        .from("inventory_sku_summary")
        .select("product_id, sellable_quantity")
        .in("product_id", productIds)
    : { data: [], error: null };
  if (inventoryError) throw new Error(inventoryError.message);

  const { data: incoming, error: incomingError } = productIds.length
    ? await supabase
        .from("incoming_inventory")
        .select(
          "product_id, expected_quantity, received_quantity, pre_allocated_quantity, expected_date",
        )
        .in("product_id", productIds)
    : { data: [], error: null };
  if (incomingError) throw new Error(incomingError.message);

  const { data: shippedOrders, error: shippedOrdersError } = await supabase
    .from("sales_order")
    .select(
      "id, sales_order_number, customer_name_snapshot, customer_po_number, created_at, order_date, order_type, ship_to_display_name_snapshot, status",
    )
    .in("status", ["partially_shipped", "shipped", "closed"])
    .in("order_type", ["regular", "display", "rga_replacement"])
    .order("updated_at", { ascending: false })
    .limit(100);
  if (shippedOrdersError) throw new Error(shippedOrdersError.message);

  const availableByProduct = new Map(
    (inventory ?? []).map((item) => [
      item.product_id,
      Number(item.sellable_quantity ?? 0),
    ]),
  );
  const incomingByProduct = new Map<
    string,
    { quantity: number; eta: string | null }
  >();
  for (const item of incoming ?? []) {
    const existing = incomingByProduct.get(item.product_id) ?? {
      quantity: 0,
      eta: null,
    };
    const quantity = Math.max(
      0,
      Number(item.expected_quantity ?? 0) -
        Number(item.received_quantity ?? 0) -
        Number(item.pre_allocated_quantity ?? 0),
    );
    incomingByProduct.set(item.product_id, {
      quantity: existing.quantity + quantity,
      eta:
        !existing.eta ||
        (item.expected_date && item.expected_date < existing.eta)
          ? item.expected_date
          : existing.eta,
    });
  }
  const queueRows = (orders ?? [])
    .map((order) => {
      const orderLines = (lines ?? []).filter(
        (line) => line.sales_order_id === order.id,
      );
      const orderedQuantity = orderLines.reduce(
        (sum, line) => sum + Number(line.quantity_ordered ?? 0),
        0,
      );
      const remainingQuantity = orderLines.reduce(
        (sum, line) =>
          sum +
          Math.max(
            0,
            Number(line.quantity_ordered ?? 0) -
              Number(line.quantity_shipped ?? 0) -
              Number(line.quantity_cancelled ?? 0) -
              Number(line.quantity_cleared ?? 0),
          ),
        0,
      );
      const readyQuantity = orderLines.reduce((sum, line) => {
        const remaining = Math.max(
          0,
          Number(line.quantity_ordered ?? 0) -
            Number(line.quantity_shipped ?? 0) -
            Number(line.quantity_cancelled ?? 0) -
            Number(line.quantity_cleared ?? 0),
        );
        return (
          sum +
          Math.min(remaining, availableByProduct.get(line.product_id) ?? 0)
        );
      }, 0);
      return { ...order, orderedQuantity, readyQuantity, remainingQuantity };
    })
    .filter((order) => order.readyQuantity > 0)
    .sort((left, right) => {
      const priorityDifference =
        Number(right.shipping_priority === "highest") -
        Number(left.shipping_priority === "highest");
      return (
        priorityDifference ||
        String(left.created_at).localeCompare(String(right.created_at))
      );
    });

  const orderById = new Map((orders ?? []).map((order) => [order.id, order]));
  const backorderRows = (lines ?? [])
    .map((line) => {
      const remaining = Math.max(
        0,
        Number(line.quantity_ordered ?? 0) -
          Number(line.quantity_shipped ?? 0) -
          Number(line.quantity_cancelled ?? 0) -
          Number(line.quantity_cleared ?? 0),
      );
      const available = availableByProduct.get(line.product_id) ?? 0;
      const incomingItem = incomingByProduct.get(line.product_id) ?? {
        quantity: 0,
        eta: null,
      };
      return {
        ...line,
        available,
        backorderQuantity: Math.max(0, remaining - available),
        incomingQuantity: incomingItem.quantity,
        eta: incomingItem.eta,
        order: orderById.get(line.sales_order_id),
      };
    })
    .filter((line) => line.order && line.backorderQuantity > 0)
    .sort((left, right) =>
      String(left.order?.created_at).localeCompare(
        String(right.order?.created_at),
      ),
    );

  return (
    <section className="dashboard-panel">
      <section className="list-header">
        <div>
          <span className="eyebrow">Warehouse Shipping</span>
          <h2>Shipping Dashboard</h2>
          <p>
            All customer orders across the ERP. Highest priority ready orders
            appear first, then the oldest orders.
          </p>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {notice ? <p className="form-notice">{notice}</p> : null}
      <nav
        className="tab-strip shipping-dashboard-tabs"
        aria-label="Shipping dashboard views"
      >
        <Link
          aria-current={activeTab === "ready" ? "page" : undefined}
          href="/?module=shipping&shipping_tab=ready"
        >
          Ready to Ship
        </Link>
        <Link
          aria-current={activeTab === "backorders" ? "page" : undefined}
          href="/?module=shipping&shipping_tab=backorders"
        >
          Backorders
        </Link>
        <Link
          aria-current={activeTab === "shipped" ? "page" : undefined}
          href="/?module=shipping&shipping_tab=shipped"
        >
          Shipped Orders
        </Link>
      </nav>
      {activeTab === "ready" ? (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Sales Order</th>
                  <th>Customer</th>
                  <th>Customer PO</th>
                  <th>Ship-to</th>
                  <th>Order Date / Time</th>
                  <th>Type</th>
                  <th>Ordered</th>
                  <th>Ready to Ship</th>
                  <th>Status</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {queueRows.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <StatusBadge
                        tone={
                          order.shipping_priority === "highest"
                            ? "warn"
                            : "neutral"
                        }
                        value={
                          order.shipping_priority === "highest"
                            ? "Highest"
                            : "Normal"
                        }
                      />
                    </td>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?module=orders&order=${order.id}`}
                      >
                        {order.sales_order_number}
                      </Link>
                    </td>
                    <td>{order.customer_name_snapshot}</td>
                    <td>{order.customer_po_number}</td>
                    <td>{order.ship_to_display_name_snapshot}</td>
                    <td>{timestampLabel(order.created_at)}</td>
                    <td>{label(order.order_type)}</td>
                    <td>{numberFormatter.format(order.orderedQuantity)}</td>
                    <td>
                      <strong>
                        {numberFormatter.format(order.readyQuantity)}
                      </strong>
                    </td>
                    <td>
                      <StatusBadge tone="good" value={order.status} />
                    </td>
                    <td>
                      <form action={setShippingPriorityAction}>
                        <input name="order_id" type="hidden" value={order.id} />
                        <input
                          name="shipping_priority"
                          type="hidden"
                          value={
                            order.shipping_priority === "highest"
                              ? "normal"
                              : "highest"
                          }
                        />
                        <button
                          className="text-action text-action--button"
                          type="submit"
                        >
                          {order.shipping_priority === "highest"
                            ? "Set Normal"
                            : "Set Highest"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {queueRows.length === 0 ? (
                  <tr>
                    <td colSpan={11}>
                      <EmptyState text="No orders currently have items ready to ship." />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="open-order-summary">
            Orders in queue:{" "}
            <strong>{numberFormatter.format(queueRows.length)}</strong> |
            Highest priority:{" "}
            <strong>
              {numberFormatter.format(
                queueRows.filter(
                  (order) => order.shipping_priority === "highest",
                ).length,
              )}
            </strong>
          </p>
        </>
      ) : null}
      {activeTab === "backorders" ? (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sales Order</th>
                  <th>Customer</th>
                  <th>SKU</th>
                  <th>Item</th>
                  <th>Backordered</th>
                  <th>In Hand</th>
                  <th>Incoming</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {backorderRows.map((line) => (
                  <tr key={`${line.sales_order_id}-${line.product_id}`}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?module=orders&order=${line.order!.id}`}
                      >
                        {line.order!.sales_order_number}
                      </Link>
                    </td>
                    <td>{line.order!.customer_name_snapshot}</td>
                    <td>{line.product_sku_snapshot}</td>
                    <td>{line.product_name_snapshot}</td>
                    <td>
                      <strong>
                        {numberFormatter.format(line.backorderQuantity)}
                      </strong>
                    </td>
                    <td>{numberFormatter.format(line.available)}</td>
                    <td>{numberFormatter.format(line.incomingQuantity)}</td>
                    <td>{dateLabel(line.eta)}</td>
                  </tr>
                ))}
                {backorderRows.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState text="No current backorders." />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="open-order-summary">
            Backordered line items:{" "}
            <strong>{numberFormatter.format(backorderRows.length)}</strong> |
            Total backordered quantity:{" "}
            <strong>
              {numberFormatter.format(
                backorderRows.reduce(
                  (sum, line) => sum + line.backorderQuantity,
                  0,
                ),
              )}
            </strong>
          </p>
        </>
      ) : null}
      {activeTab === "shipped" ? (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sales Order</th>
                  <th>Customer</th>
                  <th>Customer PO</th>
                  <th>Ship-to</th>
                  <th>Order Date</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(shippedOrders ?? []).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?module=orders&order=${order.id}`}
                      >
                        {order.sales_order_number}
                      </Link>
                    </td>
                    <td>{order.customer_name_snapshot}</td>
                    <td>{order.customer_po_number}</td>
                    <td>{order.ship_to_display_name_snapshot}</td>
                    <td>{dateLabel(order.order_date)}</td>
                    <td>{label(order.order_type)}</td>
                    <td>
                      <StatusBadge tone="good" value={order.status} />
                    </td>
                  </tr>
                ))}
                {(shippedOrders ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState text="No shipped orders found." />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="open-order-summary">
            Orders with shipments:{" "}
            <strong>
              {numberFormatter.format((shippedOrders ?? []).length)}
            </strong>
          </p>
        </>
      ) : null}
    </section>
  );
}

async function ShipmentCreatePage({
  error,
  notice,
  orderId,
  shipmentId,
  shipmentEdit,
}: {
  error?: string;
  notice?: string;
  orderId?: string;
  shipmentId?: string;
  shipmentEdit?: string;
}) {
  if (!orderId)
    return (
      <ModulePlaceholder moduleName="Choose an order to create a shipment" />
    );
  const order = await getSalesOrderDetail(orderId);
  if (!order) return <ModulePlaceholder moduleName="Order not found" />;
  const supabase = createSupabaseAdminClient();
  const [shipmentResult, documentsResult, packingListResult] = shipmentId
    ? await Promise.all([
        supabase
          .from("freight_shipment")
          .select(
            "id, freight_shipment_number, status, carrier, shipping_type, master_tracking_number, freight_cost, notes",
          )
          .eq("id", shipmentId)
          .eq("customer_account_id", order.customer_account_id)
          .maybeSingle(),
        supabase
          .from("attachment")
          .select("id, original_file_name, category, uploaded_at")
          .eq("entity_type", "freight_shipment")
          .eq("entity_id", shipmentId)
          .eq("is_active", true)
          .order("uploaded_at", { ascending: false }),
        supabase
          .from("packing_list")
          .select("id, packing_list_number, shipping_fee")
          .eq("freight_shipment_id", shipmentId)
          .maybeSingle(),
      ])
    : [
        { data: null, error: null },
        { data: [], error: null },
        { data: null, error: null },
      ];
  const shipmentFailure = [
    shipmentResult,
    documentsResult,
    packingListResult,
  ].find((result) => result.error);
  if (shipmentFailure?.error) throw new Error(shipmentFailure.error.message);
  const shipment = shipmentResult.data;
  const packingList = packingListResult.data;
  const { data: packingLines, error: packingLinesError } = packingList
    ? await supabase
        .from("packing_list_line")
        .select(
          "id, sales_order_line_id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_shipped",
        )
        .eq("packing_list_id", packingList.id)
        .order("product_sku_snapshot")
    : { data: [], error: null };
  if (packingLinesError) throw new Error(packingLinesError.message);
  const packingLineIds = (packingLines ?? []).map((line) => line.id);
  const {
    data: packingLineBoxAllocations,
    error: packingLineBoxAllocationsError,
  } = packingLineIds.length
    ? await supabase
        .from("packing_list_line_box")
        .select(
          "id, packing_list_line_id, inventory_balance_id, box_quantity_shipped",
        )
        .in("packing_list_line_id", packingLineIds)
    : { data: [], error: null };
  if (packingLineBoxAllocationsError)
    throw new Error(packingLineBoxAllocationsError.message);
  const editAll = shipmentEdit === "all";
  const editHeader = editAll || shipmentEdit === "header";
  const editDocuments = editAll || shipmentEdit === "documents";
  const editLines = editAll || shipmentEdit === "lines";
  const confirmationHref = `/?module=shipment-create&order=${orderId}&shipment=${shipmentId}`;
  const editHref = (section: "header" | "documents" | "lines" | "all") =>
    `${confirmationHref}&shipment_edit=${section}`;

  const eligibleLines = order.lines
    .map((line) => ({
      ...line,
      remainingQuantity: Math.max(
        0,
        line.quantity_ordered - line.quantity_shipped - line.quantity_cancelled,
      ),
    }))
    .filter((line) => line.remainingQuantity > 0);
  const shipmentProductIds = [
    ...new Set(eligibleLines.map((line) => line.product_id)),
  ];
  const [availableBalancesResult, requiredBoxesResult] =
    shipmentProductIds.length
      ? await Promise.all([
          supabase
            .from("inventory_balance")
            .select(
              "id, product_id, product_packing_box_id, warehouse_id, warehouse_location_id, quantity_available",
            )
            .in("product_id", shipmentProductIds)
            .eq("inventory_condition", "regular"),
          supabase
            .from("product_packing_box")
            .select("id, product_id, box_sequence, box_label")
            .in("product_id", shipmentProductIds)
            .eq("is_active", true)
            .eq("is_required_for_sale", true)
            .order("box_sequence"),
        ])
      : [
          { data: [], error: null },
          { data: [], error: null },
        ];
  const locationIds = [
    ...new Set(
      (availableBalancesResult.data ?? []).map(
        (balance) => balance.warehouse_location_id,
      ),
    ),
  ];
  const warehouseIds = [
    ...new Set(
      (availableBalancesResult.data ?? []).map(
        (balance) => balance.warehouse_id,
      ),
    ),
  ];
  const [warehousesResult, locationsResult] = await Promise.all([
    warehouseIds.length
      ? supabase.from("warehouse").select("id, name").in("id", warehouseIds)
      : Promise.resolve({ data: [], error: null }),
    locationIds.length
      ? supabase
          .from("warehouse_location")
          .select("id, location_code, location_name")
          .in("id", locationIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  const shipmentDataFailure = [
    availableBalancesResult,
    requiredBoxesResult,
    warehousesResult,
    locationsResult,
  ].find((result) => result.error);
  if (shipmentDataFailure?.error)
    throw new Error(shipmentDataFailure.error.message);
  const warehouseNameById = new Map(
    (warehousesResult.data ?? []).map((warehouse) => [
      warehouse.id,
      warehouse.name,
    ]),
  );
  const locationById = new Map(
    (locationsResult.data ?? []).map((location) => [location.id, location]),
  );
  const boxesByShipmentProduct = new Map<
    string,
    typeof requiredBoxesResult.data
  >();
  for (const box of requiredBoxesResult.data ?? []) {
    const boxes = boxesByShipmentProduct.get(box.product_id) ?? [];
    boxes.push(box);
    boxesByShipmentProduct.set(box.product_id, boxes);
  }
  const balancesByShipmentProduct = new Map<
    string,
    typeof availableBalancesResult.data
  >();
  for (const balance of availableBalancesResult.data ?? []) {
    const balances = balancesByShipmentProduct.get(balance.product_id) ?? [];
    balances.push(balance);
    balancesByShipmentProduct.set(balance.product_id, balances);
  }
  const shipmentLines = eligibleLines.map((line) => {
    const requiredBoxes = boxesByShipmentProduct.get(line.product_id) ?? [];
    const balances = balancesByShipmentProduct.get(line.product_id) ?? [];
    const locationBalances = requiredBoxes.length
      ? requiredBoxes.map((box) => ({
          ...box,
          balances: balances
            .filter((balance) => balance.product_packing_box_id === box.id)
            .map((balance) => ({
              ...balance,
              warehouseName:
                warehouseNameById.get(balance.warehouse_id) ?? "Warehouse",
              location: locationById.get(balance.warehouse_location_id),
            })),
        }))
      : [
          {
            id: `sku-${line.product_id}`,
            box_label: "No packing box",
            box_sequence: 1,
            balances: balances
              .filter((balance) => !balance.product_packing_box_id)
              .map((balance) => ({
                ...balance,
                warehouseName:
                  warehouseNameById.get(balance.warehouse_id) ?? "Warehouse",
                location: locationById.get(balance.warehouse_location_id),
              })),
          },
        ];
    const readyQuantity = locationBalances.length
      ? Math.min(
          ...locationBalances.map((box) =>
            box.balances.reduce(
              (sum, balance) => sum + Number(balance.quantity_available),
              0,
            ),
          ),
        )
      : 0;
    return { ...line, locationBalances, readyQuantity };
  });
  const packedOrderLineIds = new Set(
    (packingLines ?? []).map((line) => line.sales_order_line_id),
  );
  const additionalShipmentLines = shipmentLines.filter(
    (line) => !packedOrderLineIds.has(line.id),
  );
  const shipmentLineByOrderLineId = new Map(
    shipmentLines.map((line) => [line.id, line]),
  );
  const pickedQuantityByPackingLineAndBalance = new Map<string, number>();
  for (const allocation of packingLineBoxAllocations ?? []) {
    if (allocation.inventory_balance_id) {
      const key = `${allocation.packing_list_line_id}:${allocation.inventory_balance_id}`;
      pickedQuantityByPackingLineAndBalance.set(
        key,
        (pickedQuantityByPackingLineAndBalance.get(key) ?? 0) +
          Number(allocation.box_quantity_shipped),
      );
    }
  }
  const canCreateShipment =
    order.order_type !== "quote" &&
    ["open", "partially_shipped"].includes(order.status) &&
    order.credit_hold_status !== "on_credit_hold" &&
    shipmentLines.length > 0;

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="context-parent-link"
            href={`/?module=orders&order=${order.id}`}
          >
            Back to Order
          </Link>
          <div className="record-title-row">
            <h2>{shipment ? "Shipment Confirmation" : "Create Shipment"}</h2>
            <StatusBadge tone="neutral" value={order.sales_order_number} />
          </div>
          <p>
            <Link
              className="context-parent-link"
              href={`/?customer=${order.customer_account_id}`}
            >
              {order.customer_name_snapshot}
            </Link>{" "}
            | Customer PO {order.customer_po_number}
          </p>
        </div>
        {shipment ? (
          <Link className="secondary-action" href={editHref("all")}>
            Full Shipment Edit
          </Link>
        ) : (
          <Link
            className="secondary-action"
            href="/?module=shipping&shipping_tab=ready"
          >
            Shipping Queue
          </Link>
        )}
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {notice ? <p className="form-notice">{notice}</p> : null}
      <section className="detail-section order-address-section">
        <article className="info-panel">
          <h3>Ship-to Address</h3>
          {addressSnapshotLines(
            order.ship_to_snapshot_json,
            order.ship_to_display_name_snapshot,
          ).map((line, index) => (
            <p className="address-line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </article>
        <article className="info-panel">
          <h3>Shipment Status</h3>
          <p>
            <strong>
              {order.shipping_priority === "highest"
                ? "Highest Priority"
                : "Normal Priority"}
            </strong>
          </p>
          <p>
            {order.credit_hold_status === "on_credit_hold"
              ? "Credit hold must be resolved before shipping."
              : "Draft shipment creation does not reduce inventory."}
          </p>
        </article>
      </section>
      {shipment ? (
        <section className="detail-section shipment-workspace-section">
          <article className="data-section">
            <div className="section-title">
              <h3>
                Review Pending Shipment {shipment.freight_shipment_number}
              </h3>
              <div className="section-title-actions">
                {!editHeader ? (
                  <Link className="text-action" href={editHref("header")}>
                    Edit
                  </Link>
                ) : null}
                <StatusBadge tone="neutral" value={shipment.status} />
              </div>
            </div>
            {editHeader ? (
              <form
                action={updateShipmentDetailsAction}
                className="customer-form compact-form"
              >
                <input name="order_id" type="hidden" value={order.id} />
                <input name="shipment_id" type="hidden" value={shipment.id} />
                <div className="form-grid">
                  <label>
                    Carrier
                    <input
                      defaultValue={shipment.carrier ?? ""}
                      name="carrier"
                    />
                  </label>
                  <label>
                    Shipping Type
                    <select
                      defaultValue={shipment.shipping_type ?? ""}
                      name="shipping_type"
                    >
                      <option value="">Select later</option>
                      <option value="parcel">Ground / Parcel</option>
                      <option value="ltl">LTL Freight</option>
                      <option value="truck_freight">Truck Freight</option>
                      <option value="will_call">Pick up</option>
                      <option value="drop_ship">Drop Ship</option>
                    </select>
                  </label>
                  <ShipmentFreightFields
                    actualCost={shipment.freight_cost ?? 0}
                    customerCharge={
                      packingList?.shipping_fee ?? shipment.freight_cost ?? 0
                    }
                    masterTrackingNumber={shipment.master_tracking_number ?? ""}
                  />
                  <label className="full-width-field">
                    Internal Shipment Notes
                    <textarea
                      defaultValue={shipment.notes ?? ""}
                      name="shipment_notes"
                      rows={2}
                    />
                  </label>
                </div>
                <p className="fieldset-note">
                  Leave Customer Freight Charge blank to use the actual freight
                  cost. Free Freight sets only the customer charge to $0.00.
                </p>
                <div className="form-actions">
                  <button className="primary-action" type="submit">
                    Save Header
                  </button>
                  <Link className="secondary-action" href={confirmationHref}>
                    Cancel
                  </Link>
                </div>
              </form>
            ) : (
              <dl className="record-details">
                <div>
                  <dt>Carrier</dt>
                  <dd>{shipment.carrier || "Not set"}</dd>
                </div>
                <div>
                  <dt>Shipping Type</dt>
                  <dd>
                    {shipment.shipping_type
                      ? label(shipment.shipping_type)
                      : "Not set"}
                  </dd>
                </div>
                <div>
                  <dt>Actual Freight Cost</dt>
                  <dd>{money(shipment.freight_cost)}</dd>
                </div>
                <div>
                  <dt>Customer Freight Charge</dt>
                  <dd>
                    {Number(packingList?.shipping_fee ?? 0) === 0
                      ? "Free Freight"
                      : money(packingList?.shipping_fee)}
                  </dd>
                </div>
                <div>
                  <dt>Master Tracking No.</dt>
                  <dd>{shipment.master_tracking_number || "Not set"}</dd>
                </div>
                <div>
                  <dt>Internal Notes</dt>
                  <dd>{shipment.notes || "None"}</dd>
                </div>
              </dl>
            )}
          </article>
          <article className="data-section">
            <div className="section-title">
              <h3>Shipping Documents</h3>
              <div className="section-title-actions">
                {!editDocuments ? (
                  <Link className="text-action" href={editHref("documents")}>
                    Edit
                  </Link>
                ) : null}
                <span>{documentsResult.data?.length ?? 0}</span>
              </div>
            </div>
            {editDocuments ? (
              <form
                action={uploadShipmentDocumentAction}
                className="attachment-upload-form"
              >
                <input name="order_id" type="hidden" value={order.id} />
                <input name="shipment_id" type="hidden" value={shipment.id} />
                <label>
                  Document
                  <input
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
                    name="shipping_document_file"
                    type="file"
                  />
                </label>
                <label>
                  Document Type
                  <select defaultValue="other" name="shipping_document_type">
                    <option value="bol">Bill of Lading (BOL)</option>
                    <option value="shipping_label">Shipping Label</option>
                    <option value="other">Other Shipping Document</option>
                  </select>
                </label>
                <button className="primary-action" type="submit">
                  Add Document
                </button>
                <Link className="secondary-action" href={confirmationHref}>
                  Cancel
                </Link>
              </form>
            ) : null}
            <div className="compact-list">
              {(documentsResult.data ?? []).length === 0 ? (
                <EmptyState text="No shipping documents were attached." />
              ) : (
                (documentsResult.data ?? []).map((document) => (
                  <div className="compact-row" key={document.id}>
                    <div>
                      <strong>{document.original_file_name}</strong>
                      <span>
                        {label(document.category ?? "shipping document")} |{" "}
                        {timestampLabel(document.uploaded_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
          <article className="data-section full-width-field">
            <div className="section-title">
              <h3>
                {packingList ? (
                  <Link
                    className="packing-list-draft-link"
                    href={`/?module=shipping-preparation-packing-list&preparation_packing_list=${packingList.id}`}
                    target="_blank"
                  >
                    Draft Packing List {packingList.packing_list_number}
                  </Link>
                ) : (
                  "Draft Packing List"
                )}
              </h3>
              {!editLines ? (
                <Link className="text-action" href={editHref("lines")}>
                  Edit
                </Link>
              ) : null}
            </div>
            {editLines && packingList ? (
              <>
                <form action={updatePendingPackingListLinesAction}>
                  <input name="order_id" type="hidden" value={order.id} />
                  <input name="shipment_id" type="hidden" value={shipment.id} />
                  <input
                    name="packing_list_id"
                    type="hidden"
                    value={packingList.id}
                  />
                  <p className="fieldset-note">
                    Adjust the total shipment quantity and the warehouse/bin
                    quantity for each box. Every required box must total the
                    same amount as Quantity to Ship.
                  </p>
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>SKU</th>
                          <th>Item</th>
                          <th>Quantity to Ship</th>
                          <th>Warehouse / Bin Picks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(packingLines ?? []).map((line) => {
                          const shipmentLine = shipmentLineByOrderLineId.get(
                            line.sales_order_line_id,
                          );
                          return (
                            <tr key={line.id}>
                              <td>{line.product_sku_snapshot}</td>
                              <td>{line.product_name_snapshot}</td>
                              <td>
                                <input
                                  defaultValue={Number(line.quantity_shipped)}
                                  min="0"
                                  name={`packing_quantity_${line.id}`}
                                  step="1"
                                  type="number"
                                />
                              </td>
                              <td>
                                {shipmentLine?.locationBalances.length ? (
                                  <details
                                    className="shipment-location-picker"
                                    open
                                  >
                                    <summary>
                                      <strong>
                                        {numberFormatter.format(
                                          shipmentLine.readyQuantity,
                                        )}{" "}
                                        available
                                      </strong>
                                      <span>Adjust locations</span>
                                    </summary>
                                    {shipmentLine.locationBalances.map(
                                      (box) => (
                                        <section
                                          className="shipment-box-picks"
                                          key={box.id}
                                        >
                                          <strong>
                                            {box.box_label === "No packing box"
                                              ? "SKU Inventory (No packing box)"
                                              : `Box ${box.box_sequence}${box.box_label ? `: ${box.box_label}` : ""}`}
                                          </strong>
                                          {box.balances.length ? (
                                            <table>
                                              <thead>
                                                <tr>
                                                  <th>Warehouse</th>
                                                  <th>Bin</th>
                                                  <th>Available</th>
                                                  <th>Pick</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {box.balances.map((balance) => (
                                                  <tr key={balance.id}>
                                                    <td>
                                                      {balance.warehouseName}
                                                    </td>
                                                    <td>
                                                      {balance.location
                                                        ?.location_code ??
                                                        "Location"}
                                                      {balance.location
                                                        ?.location_name
                                                        ? ` - ${balance.location.location_name}`
                                                        : ""}
                                                    </td>
                                                    <td>
                                                      {numberFormatter.format(
                                                        Number(
                                                          balance.quantity_available,
                                                        ),
                                                      )}
                                                    </td>
                                                    <td>
                                                      <input
                                                        defaultValue={
                                                          pickedQuantityByPackingLineAndBalance.get(
                                                            `${line.id}:${balance.id}`,
                                                          ) ?? 0
                                                        }
                                                        max={Number(
                                                          balance.quantity_available,
                                                        )}
                                                        min="0"
                                                        name={`packing_balance_${line.id}_${balance.id}`}
                                                        step="1"
                                                        type="number"
                                                      />
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          ) : (
                                            <span className="muted-copy">
                                              No inventory location is set up
                                              for this box.
                                            </span>
                                          )}
                                        </section>
                                      ),
                                    )}
                                  </details>
                                ) : (
                                  <span className="muted-copy">
                                    No regular inventory location is available.
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="form-actions">
                    <button className="primary-action" type="submit">
                      Save Selected Items
                    </button>
                    <Link className="secondary-action" href={confirmationHref}>
                      Cancel
                    </Link>
                  </div>
                </form>
                {additionalShipmentLines.length ? (
                  <form
                    action={addPendingPackingListLinesAction}
                    className="customer-form compact-form shipment-add-items-form"
                  >
                    <input name="order_id" type="hidden" value={order.id} />
                    <input
                      name="shipment_id"
                      type="hidden"
                      value={shipment.id}
                    />
                    <input
                      name="packing_list_id"
                      type="hidden"
                      value={packingList.id}
                    />
                    <fieldset>
                      <legend>Add Available Order Items</legend>
                      <p className="fieldset-note">
                        Open Available to choose the warehouse/bin and quantity
                        for an unpicked order item. Parts without packing boxes
                        are picked from their SKU inventory location.
                      </p>
                      <div className="table-wrap">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>SKU</th>
                              <th>Item</th>
                              <th>Remaining</th>
                              <th>Available</th>
                            </tr>
                          </thead>
                          <tbody>
                            {additionalShipmentLines.map((line) => (
                              <tr key={line.id}>
                                <td>{line.product_sku_snapshot}</td>
                                <td>{line.product_name_snapshot}</td>
                                <td>
                                  {numberFormatter.format(
                                    line.remainingQuantity,
                                  )}
                                </td>
                                <td>
                                  <details className="shipment-location-picker">
                                    <summary>
                                      <strong>
                                        {numberFormatter.format(
                                          line.readyQuantity,
                                        )}{" "}
                                        available
                                      </strong>
                                      <span>Pick locations</span>
                                    </summary>
                                    {line.locationBalances.map((box) => (
                                      <section
                                        className="shipment-box-picks"
                                        key={box.id}
                                      >
                                        <strong>
                                          {box.box_label === "No packing box"
                                            ? "SKU Inventory (No packing box)"
                                            : `Box ${box.box_sequence}${box.box_label ? `: ${box.box_label}` : ""}`}
                                        </strong>
                                        {box.balances.length ? (
                                          <table>
                                            <thead>
                                              <tr>
                                                <th>Warehouse</th>
                                                <th>Bin</th>
                                                <th>Available</th>
                                                <th>Pick</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {box.balances.map((balance) => (
                                                <tr key={balance.id}>
                                                  <td>
                                                    {balance.warehouseName}
                                                  </td>
                                                  <td>
                                                    {balance.location
                                                      ?.location_code ??
                                                      "Location"}
                                                    {balance.location
                                                      ?.location_name
                                                      ? ` - ${balance.location.location_name}`
                                                      : ""}
                                                  </td>
                                                  <td>
                                                    {numberFormatter.format(
                                                      Number(
                                                        balance.quantity_available,
                                                      ),
                                                    )}
                                                  </td>
                                                  <td>
                                                    <input
                                                      defaultValue="0"
                                                      max={Number(
                                                        balance.quantity_available,
                                                      )}
                                                      min="0"
                                                      name={`additional_shipment_balance_${line.id}_${balance.id}`}
                                                      step="1"
                                                      type="number"
                                                    />
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        ) : (
                                          <span className="muted-copy">
                                            No inventory location is set up for
                                            this item.
                                          </span>
                                        )}
                                      </section>
                                    ))}
                                  </details>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </fieldset>
                    <div className="form-actions">
                      <button className="primary-action" type="submit">
                        Add Selected Items
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="fieldset-note">
                    All currently available order items are already included in
                    this draft packing list.
                  </p>
                )}
              </>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Item</th>
                      <th>Quantity to Ship</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(packingLines ?? []).map((line) => (
                      <tr key={line.id}>
                        <td>{line.product_sku_snapshot}</td>
                        <td>{line.product_name_snapshot}</td>
                        <td>
                          {numberFormatter.format(
                            Number(line.quantity_shipped),
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="fieldset-note shipment-confirmation-note">
              Before final confirmation, use Shipment Header Edit to enter both
              Carrier and Master Tracking No.
            </p>
            <form
              action={confirmPendingShipmentAction}
              className="form-actions"
            >
              <input name="order_id" type="hidden" value={order.id} />
              <input name="shipment_id" type="hidden" value={shipment.id} />
              <button className="primary-action" type="submit">
                Confirm Pending Shipment
              </button>
              <Link
                className="secondary-action"
                href="/?module=shipping&shipping_tab=ready"
              >
                Back to Shipping Queue
              </Link>
            </form>
          </article>
        </section>
      ) : null}
      {!shipment && !canCreateShipment ? (
        <EmptyState text="This order does not currently have items available to ship." />
      ) : null}
      {!shipment && canCreateShipment ? (
        <form action={createPendingShipmentAction} className="customer-form">
          <input name="order_id" type="hidden" value={order.id} />
          <fieldset>
            <legend>Shipment Header</legend>
            <div className="form-grid">
              <label>
                Carrier
                <input name="carrier" placeholder="Optional carrier name" />
              </label>
              <label>
                Shipping Type
                <select defaultValue="" name="shipping_type">
                  <option value="">Select later</option>
                  <option value="parcel">Ground / Parcel</option>
                  <option value="ltl">LTL Freight</option>
                  <option value="truck_freight">Truck Freight</option>
                  <option value="will_call">Pick up</option>
                  <option value="drop_ship">Drop Ship</option>
                </select>
              </label>
              <ShipmentFreightFields />
              <label className="full-width-field">
                Internal Shipment Notes
                <textarea name="shipment_notes" rows={2} />
              </label>
            </div>
            <p className="fieldset-note">
              Leave Customer Freight Charge blank to use the actual freight
              cost. Free Freight sets only the customer charge to $0.00.
            </p>
          </fieldset>
          <fieldset>
            <legend>Shipping Documents</legend>
            <div className="form-grid">
              <label>
                Documents
                <input
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
                  multiple
                  name="shipping_document_files"
                  type="file"
                />
              </label>
              <label>
                Document Type
                <select defaultValue="other" name="shipping_document_type">
                  <option value="bol">Bill of Lading (BOL)</option>
                  <option value="shipping_label">Shipping Label</option>
                  <option value="other">Other Shipping Document</option>
                </select>
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Items to Ship</legend>
            <p className="fieldset-note">
              Open Available to select the warehouse/bin and quantity for each
              required box. The same quantity must be selected for every
              required box of an item.
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Item</th>
                    <th>Ordered</th>
                    <th>Previously Shipped</th>
                    <th>Remaining</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {shipmentLines.map((line) => (
                    <tr key={line.id}>
                      <td>{line.product_sku_snapshot}</td>
                      <td>{line.product_name_snapshot}</td>
                      <td>{numberFormatter.format(line.quantity_ordered)}</td>
                      <td>{numberFormatter.format(line.quantity_shipped)}</td>
                      <td>{numberFormatter.format(line.remainingQuantity)}</td>
                      <td>
                        {line.locationBalances.length ? (
                          <details className="shipment-location-picker">
                            <summary>
                              <strong>
                                {numberFormatter.format(line.readyQuantity)}{" "}
                                available
                              </strong>
                              <span>Pick locations</span>
                            </summary>
                            {line.locationBalances.map((box) => (
                              <section
                                className="shipment-box-picks"
                                key={box.id}
                              >
                                <strong>
                                  Box {box.box_sequence}
                                  {box.box_label ? `: ${box.box_label}` : ""}
                                </strong>
                                {box.balances.length ? (
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Warehouse</th>
                                        <th>Bin</th>
                                        <th>Available</th>
                                        <th>Pick</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {box.balances.map((balance) => (
                                        <tr key={balance.id}>
                                          <td>{balance.warehouseName}</td>
                                          <td>
                                            {balance.location?.location_code ??
                                              "Location"}
                                            {balance.location?.location_name
                                              ? ` - ${balance.location.location_name}`
                                              : ""}
                                          </td>
                                          <td>
                                            {numberFormatter.format(
                                              Number(
                                                balance.quantity_available,
                                              ),
                                            )}
                                          </td>
                                          <td>
                                            <input
                                              defaultValue="0"
                                              max={Number(
                                                balance.quantity_available,
                                              )}
                                              min="0"
                                              name={`shipment_balance_${line.id}_${balance.id}`}
                                              step="1"
                                              type="number"
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <span className="muted-copy">
                                    No inventory location is set up for this
                                    box.
                                  </span>
                                )}
                              </section>
                            ))}
                          </details>
                        ) : (
                          <span>Set up packing boxes before shipping</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
          <div className="form-actions">
            <ShipmentSubmitButton />
            <Link
              className="secondary-action"
              href={`/?module=orders&order=${order.id}`}
            >
              Cancel
            </Link>
          </div>
        </form>
      ) : null}
    </section>
  );
}

async function ShipmentResultPage({
  notice,
  returnCustomerId,
  shipmentId,
}: {
  notice?: string;
  returnCustomerId?: string;
  shipmentId?: string;
}) {
  if (!shipmentId) return <ModulePlaceholder moduleName="Shipment not found" />;

  const supabase = createSupabaseAdminClient();
  const [shipmentResult, packingListResult, documentsResult] =
    await Promise.all([
      supabase
        .from("freight_shipment")
        .select(
          "id, freight_shipment_number, status, carrier, shipping_type, master_tracking_number, freight_cost, notes, ship_to_snapshot_json",
        )
        .eq("id", shipmentId)
        .maybeSingle(),
      supabase
        .from("packing_list")
        .select(
          "id, packing_list_number, sales_order_id, customer_po_number_snapshot, sales_order_number_snapshot, shipping_fee",
        )
        .eq("freight_shipment_id", shipmentId)
        .maybeSingle(),
      supabase
        .from("attachment")
        .select(
          "id, original_file_name, category, storage_bucket, storage_path, uploaded_at",
        )
        .eq("entity_type", "freight_shipment")
        .eq("entity_id", shipmentId)
        .eq("is_active", true)
        .order("uploaded_at", { ascending: false }),
    ]);
  const failure = [shipmentResult, packingListResult, documentsResult].find(
    (result) => result.error,
  );
  if (failure?.error) throw new Error(failure.error.message);
  if (!shipmentResult.data || !packingListResult.data)
    return <ModulePlaceholder moduleName="Shipment not found" />;

  const shipment = shipmentResult.data;
  const packingList = packingListResult.data;
  const [order, packingLinesResult] = await Promise.all([
    getSalesOrderDetail(packingList.sales_order_id),
    supabase
      .from("packing_list_line")
      .select("id, brand_name_snapshot, product_sku_snapshot, quantity_shipped")
      .eq("packing_list_id", packingList.id)
      .order("product_sku_snapshot"),
  ]);
  if (packingLinesResult.error)
    throw new Error(packingLinesResult.error.message);
  const documents = await Promise.all(
    (documentsResult.data ?? []).map(async (document) => {
      const { data, error } = await supabase.storage
        .from(document.storage_bucket)
        .createSignedUrl(document.storage_path, 60 * 60);
      return {
        ...document,
        downloadUrl: error ? null : (data?.signedUrl ?? null),
      };
    }),
  );

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="context-parent-link"
            href={
              returnCustomerId
                ? `/?customer=${returnCustomerId}&tab=shipments`
                : order
                  ? `/?module=orders&order=${order.id}`
                  : "/?module=shipping&shipping_tab=ready"
            }
          >
            {returnCustomerId ? "Back to Packing Lists" : "Back to Order"}
          </Link>
          <div className="record-title-row">
            <h2>Shipment {shipment.freight_shipment_number}</h2>
            <StatusBadge tone="neutral" value={shipment.status} />
          </div>
          <p>
            {order?.customer_name_snapshot ?? "Customer"} | Customer PO{" "}
            {packingList.customer_po_number_snapshot}
          </p>
        </div>
        <Link
          className="secondary-action"
          href="/?module=shipping&shipping_tab=ready"
        >
          Shipping Queue
        </Link>
      </section>
      {notice ? <p className="form-notice">{notice}</p> : null}
      <section className="detail-section order-address-section">
        <article className="info-panel">
          <h3>Ship-to Address</h3>
          {addressSnapshotLines(
            shipment.ship_to_snapshot_json as Record<string, unknown>,
            order?.ship_to_display_name_snapshot,
          ).map((line, index) => (
            <p className="address-line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </article>
        <article className="info-panel">
          <h3>Shipment Details</h3>
          <p>
            <strong>Carrier:</strong> {shipment.carrier || "Not set"}
          </p>
          <p>
            <strong>Shipping Type:</strong>{" "}
            {shipment.shipping_type ? label(shipment.shipping_type) : "Not set"}
          </p>
          <p>
            <strong>Actual Freight Cost:</strong> {money(shipment.freight_cost)}
          </p>
          <p>
            <strong>Customer Freight Charge:</strong>{" "}
            {Number(packingList.shipping_fee ?? 0) === 0
              ? "Free Freight"
              : money(packingList.shipping_fee)}
          </p>
          <p>
            <strong>Master Tracking No.:</strong>{" "}
            {shipment.master_tracking_number || "Not set"}
          </p>
        </article>
      </section>
      <section className="detail-section shipment-workspace-section">
        <article className="data-section">
          <div className="section-title">
            <h3>Packing List {packingList.packing_list_number}</h3>
            <Link
              className="text-action"
              href={`/?module=packing-list-document&packing_list=${packingList.id}`}
              target="_blank"
            >
              Download Packing List
            </Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Brand</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {(packingLinesResult.data ?? []).map((line) => (
                  <tr key={line.id}>
                    <td>{line.product_sku_snapshot}</td>
                    <td>{line.brand_name_snapshot}</td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_shipped))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <article className="data-section">
          <div className="section-title">
            <h3>Shipping Documents</h3>
            <span>{documents.length}</span>
          </div>
          <div className="compact-list">
            {documents.length === 0 ? (
              <EmptyState text="No shipping documents were attached." />
            ) : (
              documents.map((document) => (
                <div className="compact-row" key={document.id}>
                  <div>
                    <strong>{document.original_file_name}</strong>
                    <span>
                      {label(document.category ?? "shipping document")} |{" "}
                      {timestampLabel(document.uploaded_at)}
                    </span>
                  </div>
                  {document.downloadUrl ? (
                    <a className="text-action" href={document.downloadUrl}>
                      Download
                    </a>
                  ) : (
                    <span>Unavailable</span>
                  )}
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </section>
  );
}

async function PackingListDocumentPage({
  packingListId,
}: {
  packingListId?: string;
}) {
  if (!packingListId)
    return <ModulePlaceholder moduleName="Packing list not found" />;
  const supabase = createSupabaseAdminClient();
  const [packingListResult, packingLinesResult] = await Promise.all([
    supabase
      .from("packing_list")
      .select(
        "id, packing_list_number, freight_shipment_id, sales_order_id, customer_po_number_snapshot, sales_order_number_snapshot, ship_to_snapshot_json",
      )
      .eq("id", packingListId)
      .maybeSingle(),
    supabase
      .from("packing_list_line")
      .select("id, brand_name_snapshot, product_sku_snapshot, quantity_shipped")
      .eq("packing_list_id", packingListId)
      .order("product_sku_snapshot"),
  ]);
  const failure = [packingListResult, packingLinesResult].find(
    (result) => result.error,
  );
  if (failure?.error) throw new Error(failure.error.message);
  if (!packingListResult.data)
    return <ModulePlaceholder moduleName="Packing list not found" />;
  const packingList = packingListResult.data;
  const packingLines = packingLinesResult.data ?? [];
  const { data: packingBoxLines, error: packingBoxLinesError } =
    packingLines.length > 0
      ? await supabase
          .from("packing_list_line_box")
          .select(
            "packing_list_line_id, box_sequence_snapshot, box_label_snapshot, box_quantity_shipped",
          )
          .in(
            "packing_list_line_id",
            packingLines.map((line) => line.id),
          )
          .order("box_sequence_snapshot")
      : { data: [], error: null };
  if (packingBoxLinesError) throw new Error(packingBoxLinesError.message);

  const boxesByPackingLine = new Map<
    string,
    Array<{
      packing_list_line_id: string;
      box_sequence_snapshot: number;
      box_label_snapshot: string | null;
      box_quantity_shipped: number;
    }>
  >();
  for (const box of packingBoxLines ?? []) {
    const lineBoxes = boxesByPackingLine.get(box.packing_list_line_id) ?? [];
    lineBoxes.push(box);
    boxesByPackingLine.set(box.packing_list_line_id, lineBoxes);
  }
  const totalItems = packingLines.reduce(
    (total, line) => total + Number(line.quantity_shipped),
    0,
  );
  const totalBoxes = (packingBoxLines ?? []).reduce(
    (total, box) => total + Number(box.box_quantity_shipped),
    0,
  );

  const [order, shipmentResult] = await Promise.all([
    getSalesOrderDetail(packingList.sales_order_id),
    packingList.freight_shipment_id
      ? supabase
          .from("freight_shipment")
          .select("carrier, master_tracking_number")
          .eq("id", packingList.freight_shipment_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (shipmentResult.error) throw new Error(shipmentResult.error.message);
  const shipment = shipmentResult.data;

  return (
    <section className="quote-document-page">
      <div className="quote-document-controls">
        <Link
          className="secondary-action"
          href={`/?module=shipment-detail&shipment=${packingList.freight_shipment_id}`}
        >
          Back to Shipment
        </Link>
        <PackingListDocumentControls />
      </div>
      <article className="quote-document">
        <header className="quote-document-header">
          <div>
            <span className="eyebrow">
              Terracotta Designs and Kanova &amp; Co.
            </span>
            <h2>Packing List</h2>
          </div>
          <dl>
            <div>
              <dt>Packing List No.</dt>
              <dd>{packingList.packing_list_number}</dd>
            </div>
            <div>
              <dt>Sales Order No.</dt>
              <dd>{packingList.sales_order_number_snapshot}</dd>
            </div>
            <div>
              <dt>Customer PO</dt>
              <dd>{packingList.customer_po_number_snapshot}</dd>
            </div>
            <div>
              <dt>Carrier</dt>
              <dd>{shipment?.carrier || "Not set"}</dd>
            </div>
            <div>
              <dt>Master Tracking No.</dt>
              <dd>{shipment?.master_tracking_number || "Not set"}</dd>
            </div>
          </dl>
        </header>
        <section className="quote-document-addresses">
          <div>
            <span>Customer</span>
            <strong>{order?.customer_name_snapshot ?? "Not set"}</strong>
          </div>
          <div>
            <span>Ship To</span>
            {addressSnapshotLines(
              packingList.ship_to_snapshot_json as Record<string, unknown>,
              order?.ship_to_display_name_snapshot,
            ).map((line, index) => (
              <strong key={`${line}-${index}`}>{line}</strong>
            ))}
          </div>
        </section>
        <table className="quote-document-table packing-list-detail-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Brand</th>
              <th>Item Qty</th>
              <th>Box</th>
              <th>Box Qty</th>
            </tr>
          </thead>
          <tbody>
            {packingLines.map((line) => {
              const boxes = boxesByPackingLine.get(line.id) ?? [];
              return boxes.length > 0 ? (
                boxes.map((box, index) => (
                  <tr
                    className={index === 0 ? "" : "packing-list-box-row"}
                    key={`${line.id}-${box.box_sequence_snapshot}-${index}`}
                  >
                    <td>{index === 0 ? line.product_sku_snapshot : ""}</td>
                    <td>{index === 0 ? line.brand_name_snapshot : ""}</td>
                    <td>
                      {index === 0
                        ? numberFormatter.format(Number(line.quantity_shipped))
                        : ""}
                    </td>
                    <td>
                      Box {box.box_sequence_snapshot}
                      {box.box_label_snapshot
                        ? `: ${box.box_label_snapshot}`
                        : ""}
                    </td>
                    <td>
                      {numberFormatter.format(Number(box.box_quantity_shipped))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr key={line.id}>
                  <td>{line.product_sku_snapshot}</td>
                  <td>{line.brand_name_snapshot}</td>
                  <td>
                    {numberFormatter.format(Number(line.quantity_shipped))}
                  </td>
                  <td>Not recorded</td>
                  <td>0</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="quote-document-total packing-list-totals">
          <span>
            Total Items: <strong>{numberFormatter.format(totalItems)}</strong>
          </span>
          <span>
            Total Boxes: <strong>{numberFormatter.format(totalBoxes)}</strong>
          </span>
        </div>
      </article>
    </section>
  );
}

async function ShippingPreparationPackingListPage({
  packingListId,
}: {
  packingListId?: string;
}) {
  if (!packingListId)
    return <ModulePlaceholder moduleName="Draft packing list not found" />;
  const supabase = createSupabaseAdminClient();
  const [packingListResult, linesResult] = await Promise.all([
    supabase
      .from("packing_list")
      .select(
        "id, packing_list_number, freight_shipment_id, sales_order_id, customer_po_number_snapshot, sales_order_number_snapshot",
      )
      .eq("id", packingListId)
      .maybeSingle(),
    supabase
      .from("packing_list_line")
      .select(
        "id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_shipped",
      )
      .eq("packing_list_id", packingListId)
      .order("product_sku_snapshot"),
  ]);
  const failure = [packingListResult, linesResult].find(
    (result) => result.error,
  );
  if (failure?.error) throw new Error(failure.error.message);
  if (!packingListResult.data)
    return <ModulePlaceholder moduleName="Draft packing list not found" />;
  const packingList = packingListResult.data;
  const lines = linesResult.data ?? [];
  const lineIds = lines.map((line) => line.id);
  const { data: boxAllocations, error: boxAllocationsError } = lineIds.length
    ? await supabase
        .from("packing_list_line_box")
        .select(
          "packing_list_line_id, box_sequence_snapshot, box_label_snapshot, box_length_snapshot, box_width_snapshot, box_height_snapshot, gross_weight_snapshot, warehouse_id, warehouse_location_id, box_quantity_shipped",
        )
        .in("packing_list_line_id", lineIds)
        .order("box_sequence_snapshot")
    : { data: [], error: null };
  if (boxAllocationsError) throw new Error(boxAllocationsError.message);
  const warehouseIds = [
    ...new Set(
      (boxAllocations ?? []).map((allocation) => allocation.warehouse_id),
    ),
  ];
  const locationIds = [
    ...new Set(
      (boxAllocations ?? []).map(
        (allocation) => allocation.warehouse_location_id,
      ),
    ),
  ];
  const [warehousesResult, locationsResult] = await Promise.all([
    warehouseIds.length
      ? supabase.from("warehouse").select("id, name").in("id", warehouseIds)
      : Promise.resolve({ data: [], error: null }),
    locationIds.length
      ? supabase
          .from("warehouse_location")
          .select("id, location_code, location_name")
          .in("id", locationIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  const locationFailure = [warehousesResult, locationsResult].find(
    (result) => result.error,
  );
  if (locationFailure?.error) throw new Error(locationFailure.error.message);
  const lineById = new Map(lines.map((line) => [line.id, line]));
  const warehouseById = new Map(
    (warehousesResult.data ?? []).map((warehouse) => [
      warehouse.id,
      warehouse.name,
    ]),
  );
  const locationById = new Map(
    (locationsResult.data ?? []).map((location) => [location.id, location]),
  );
  const preparationBoxes = boxAllocations ?? [];
  const totalGrossWeight = preparationBoxes.reduce(
    (total, allocation) =>
      total +
      (allocation.gross_weight_snapshot === null
        ? 0
        : Number(allocation.gross_weight_snapshot) *
          Number(allocation.box_quantity_shipped)),
    0,
  );
  const totalCubicInches = preparationBoxes.reduce((total, allocation) => {
    const dimensions = [
      allocation.box_length_snapshot,
      allocation.box_width_snapshot,
      allocation.box_height_snapshot,
    ];
    return dimensions.every((value) => value !== null)
      ? total +
          Number(dimensions[0]) *
            Number(dimensions[1]) *
            Number(dimensions[2]) *
            Number(allocation.box_quantity_shipped)
      : total;
  }, 0);
  const totalCbm = totalCubicInches / 61023.744;
  const shipmentMetric = (value: number) =>
    value.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <section className="quote-document-page">
      <div className="quote-document-controls">
        <Link
          className="secondary-action"
          href={`/?module=shipment-create&order=${packingList.sales_order_id}&shipment=${packingList.freight_shipment_id}`}
        >
          Back to Pending Shipment
        </Link>
        <PackingListDocumentControls />
      </div>
      <article className="quote-document">
        <header className="quote-document-header">
          <div>
            <span className="eyebrow">Warehouse Use Only</span>
            <h2>Shipping Preparation List</h2>
          </div>
          <dl>
            <div>
              <dt>Draft Packing List No.</dt>
              <dd>{packingList.packing_list_number}</dd>
            </div>
            <div>
              <dt>Sales Order No.</dt>
              <dd>{packingList.sales_order_number_snapshot}</dd>
            </div>
            <div>
              <dt>Customer PO</dt>
              <dd>{packingList.customer_po_number_snapshot}</dd>
            </div>
          </dl>
        </header>
        <p className="warehouse-prep-note">
          Use this sheet to locate and pack the selected items. It is an
          internal preparation document, not the customer-facing packing list.
        </p>
        <table className="quote-document-table warehouse-preparation-table">
          <thead>
            <tr>
              <th>SKU / Item</th>
              <th>Brand</th>
              <th>Box</th>
              <th>Box Dimensions</th>
              <th>Gross Weight</th>
              <th>Pieces</th>
              <th>Warehouse / Bin</th>
            </tr>
          </thead>
          <tbody>
            {preparationBoxes.map((allocation, index) => {
              const line = lineById.get(allocation.packing_list_line_id);
              const location = locationById.get(
                allocation.warehouse_location_id,
              );
              const dimensions = [
                allocation.box_length_snapshot,
                allocation.box_width_snapshot,
                allocation.box_height_snapshot,
              ].every((value) => value !== null)
                ? `${allocation.box_length_snapshot} x ${allocation.box_width_snapshot} x ${allocation.box_height_snapshot} in`
                : "Not set";
              return (
                <tr key={`${allocation.packing_list_line_id}-${index}`}>
                  <td>
                    <strong>{line?.product_sku_snapshot ?? "SKU"}</strong>
                    <br />
                    {line?.product_name_snapshot ?? "Item"}
                  </td>
                  <td>{line?.brand_name_snapshot ?? "Not set"}</td>
                  <td>
                    Box {allocation.box_sequence_snapshot}
                    {allocation.box_label_snapshot
                      ? `: ${allocation.box_label_snapshot}`
                      : ""}
                  </td>
                  <td>{dimensions}</td>
                  <td>
                    {allocation.gross_weight_snapshot === null
                      ? "Not set"
                      : `${allocation.gross_weight_snapshot} lb`}
                  </td>
                  <td>
                    {numberFormatter.format(
                      Number(allocation.box_quantity_shipped),
                    )}
                  </td>
                  <td>
                    {warehouseById.get(allocation.warehouse_id) ?? "Warehouse"}
                    <br />
                    {location?.location_code ?? "Location"}
                    {location?.location_name
                      ? ` - ${location.location_name}`
                      : ""}
                  </td>
                </tr>
              );
            })}
            {preparationBoxes.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  No warehouse/bin picks have been selected for this draft
                  packing list.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className="quote-document-total preparation-list-totals">
          <span>
            Total Gross Weight:{" "}
            <strong>{shipmentMetric(totalGrossWeight)} lb</strong>
          </span>
          <span>
            Total Volume:{" "}
            <strong>
              {shipmentMetric(totalCubicInches)} cu in (
              {shipmentMetric(totalCbm)} CBM)
            </strong>
          </span>
        </div>
      </article>
    </section>
  );
}

async function OrderDetailPage({
  order,
  returnCustomerId,
}: {
  order: SalesOrderDetail;
  returnCustomerId?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const [
    { data: latestPackingList, error: latestPackingListError },
    { data: invoices, error: invoicesError },
    { count: rgaCount, error: rgaCountError },
  ] = await Promise.all([
    supabase
      .from("packing_list")
      .select("freight_shipment_id")
      .eq("sales_order_id", order.id)
      .not("freight_shipment_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("customer_invoice")
      .select(
        "id, invoice_number, brand_name_snapshot, invoice_date, due_date, invoice_status, payment_status, total_amount, balance_due",
      )
      .eq("sales_order_id", order.id)
      .neq("invoice_status", "void")
      .order("invoice_date", { ascending: false }),
    supabase
      .from("rga")
      .select("id", { count: "exact", head: true })
      .eq("sales_order_id", order.id),
  ]);
  if (latestPackingListError) throw new Error(latestPackingListError.message);
  if (invoicesError) throw new Error(invoicesError.message);
  if (rgaCountError) throw new Error(rgaCountError.message);
  const { data: latestShipment, error: latestShipmentError } =
    latestPackingList?.freight_shipment_id
      ? await supabase
          .from("freight_shipment")
          .select("id, status")
          .eq("id", latestPackingList.freight_shipment_id)
          .maybeSingle()
      : { data: null, error: null };
  if (latestShipmentError) throw new Error(latestShipmentError.message);
  const isQuote = order.order_type === "quote";
  const canEdit = ["open", "partially_shipped", "pending", "hold"].includes(
    order.status,
  );
  const canShip =
    !isQuote &&
    ["open", "partially_shipped"].includes(order.status) &&
    order.credit_hold_status !== "on_credit_hold" &&
    order.lines.some(
      (line) =>
        line.quantity_ordered > line.quantity_shipped &&
        line.available_inventory > 0,
    );
  const customerOrdersHref = returnCustomerId
    ? `/?customer=${returnCustomerId}&tab=shipments`
    : `/?customer=${order.customer_account_id}&tab=orders${isQuote ? "&order_mode=quotes" : ""}`;
  const editHref = `/?module=orders&order=${order.id}&order_action=edit`;
  const hasPendingShipment =
    latestShipment?.status === "pending" ||
    latestShipment?.status === "in_progress";
  const hasPostedShipment =
    latestShipment?.status === "shipped" ||
    latestShipment?.status === "delivered";
  const replacementRgaNumber =
    order.order_type === "rga_replacement"
      ? (order.notes?.match(/\b(RGA\d{8}-\d{4})\b/i)?.[1] ?? null)
      : null;
  const replacementReferenceRga = replacementRgaNumber
    ? await supabase
        .from("rga")
        .select(
          "id, rga_number, sales_order_id, original_customer_po_number_snapshot",
        )
        .eq("rga_number", replacementRgaNumber)
        .maybeSingle()
    : { data: null, error: null };

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          {returnCustomerId ? (
            <Link className="context-parent-link" href={customerOrdersHref}>
              Back to Packing Lists
            </Link>
          ) : isQuote ? (
            <Link className="context-parent-link" href={customerOrdersHref}>
              Quote List
            </Link>
          ) : (
            <Link className="context-parent-link" href={customerOrdersHref}>
              Order List
            </Link>
          )}
          <div className="record-title-row">
            <h2>{order.sales_order_number}</h2>
            {canEdit ? (
              <Link className="status-badge status-badge--good" href={editHref}>
                Edit
              </Link>
            ) : (
              <StatusBadge tone="neutral" value={order.status} />
            )}
            {isQuote && order.status === "open" ? (
              <form
                action={convertQuoteToOrderAction}
                className="inline-status-action"
              >
                <input name="order_id" type="hidden" value={order.id} />
                <button
                  className="status-badge status-badge--good status-badge--button"
                  type="submit"
                >
                  Convert to Order
                </button>
              </form>
            ) : null}
            {order.credit_hold_status === "on_credit_hold" ? (
              <StatusBadge tone="warn" value="Credit Hold" />
            ) : null}
          </div>
          <p>
            <Link
              className="context-parent-link"
              href={`/?customer=${order.customer_account_id}`}
            >
              {order.customer_name_snapshot}
            </Link>{" "}
            | Customer PO {order.customer_po_number}
          </p>
          {isQuote && order.converted_order ? (
            <p>
              Converted PO:{" "}
              <Link
                className="table-link"
                href={`/?module=orders&order=${order.converted_order.id}`}
              >
                {order.converted_order.sales_order_number}
              </Link>
            </p>
          ) : null}
        </div>
        <div className="record-hero-actions">
          {!isQuote && hasPendingShipment && latestShipment ? (
            <Link
              className="primary-action"
              href={`/?module=shipment-create&order=${order.id}&shipment=${latestShipment.id}`}
            >
              Continue Shipment
            </Link>
          ) : null}
          {!isQuote && hasPostedShipment && latestShipment ? (
            <Link
              className="primary-action"
              href={`/?module=shipment-detail&shipment=${latestShipment.id}`}
            >
              View Shipment
            </Link>
          ) : null}
          {!isQuote && !hasPendingShipment && !hasPostedShipment && canShip ? (
            <Link
              className="primary-action"
              href={`/?module=shipment-create&order=${order.id}`}
            >
              Ship Order
            </Link>
          ) : null}
          {!isQuote ? (
            <Link
              className="secondary-action"
              href={`/?module=create-rga&order=${order.id}`}
            >
              Create RGA
            </Link>
          ) : null}
          {isQuote ? (
            <Link
              className="secondary-action quote-export-link"
              href={`/?module=quote-document&quote=${order.id}`}
              target="_blank"
            >
              Export
            </Link>
          ) : null}
        </div>
      </section>
      <section className="metric-grid order-metric-grid">
        <Metric labelText="Order Date" value={order.order_date} />
        <Metric labelText="Order Type" value={label(order.order_type)} />
        <Metric
          labelText="Shipping Priority"
          value={label(order.shipping_priority)}
        />
        <Metric
          labelText="Order Total"
          value={money(Number(order.total_amount ?? 0))}
        />
        {invoices && invoices.length > 0 ? (
          <MetricLink
            href="#order-invoices"
            labelText="Invoices"
            value={numberFormatter.format(invoices.length)}
          />
        ) : null}
        {!isQuote ? (
          <MetricLink
            href={`/?module=rga&rga_order=${order.id}`}
            labelText="RGAs"
            value={numberFormatter.format(rgaCount ?? 0)}
          />
        ) : null}
      </section>
      {replacementRgaNumber ? (
        <section className="detail-section">
          <article className="info-panel">
            <h3>Replacement Reference</h3>
            <p>
              Original RGA:{" "}
              {replacementReferenceRga.data ? (
                <Link
                  className="table-link"
                  href={`/?module=rga-detail&rga=${replacementReferenceRga.data.id}`}
                >
                  {replacementReferenceRga.data.rga_number}
                </Link>
              ) : (
                replacementRgaNumber
              )}
            </p>
            {replacementReferenceRga.data ? (
              <p>
                Original PO:{" "}
                <Link
                  className="table-link"
                  href={`/?module=orders&order=${replacementReferenceRga.data.sales_order_id}`}
                >
                  {replacementReferenceRga.data
                    .original_customer_po_number_snapshot || "Original order"}
                </Link>
              </p>
            ) : null}
          </article>
        </section>
      ) : null}
      <section className="detail-section order-address-section">
        <article className="info-panel">
          <h3>Ship-to Address</h3>
          {addressSnapshotLines(
            order.ship_to_snapshot_json,
            order.ship_to_display_name_snapshot,
          ).map((line, index) => (
            <p className="address-line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </article>
        <article className="info-panel">
          <h3>Bill-to Address</h3>
          {addressSnapshotLines(
            order.bill_to_snapshot_json,
            order.customer_name_snapshot,
          ).map((line, index) => (
            <p className="address-line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </article>
      </section>
      <section className="detail-section">
        <article className="data-section">
          <div className="section-title">
            <h3>Order Lines</h3>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Ordered</th>
                  <th>Available</th>
                  <th>Shipped</th>
                  <th>Unit Price</th>
                  <th>Discount</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={
                          line.product_sku_snapshot.startsWith("PT ")
                            ? `/?module=product-parts&part=${line.product_id}`
                            : `/?module=products&product=${line.product_id}`
                        }
                      >
                        {line.product_sku_snapshot}
                      </Link>
                    </td>
                    <td>{line.product_name_snapshot}</td>
                    <td>{line.brand_name_snapshot}</td>
                    <td>{line.quantity_ordered}</td>
                    <td>{line.available_inventory}</td>
                    <td>{line.quantity_shipped}</td>
                    <td>{money(Number(line.unit_price))}</td>
                    <td>{line.discount_percent}%</td>
                    <td>{money(line.line_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <article className="info-panel">
          <h3>Order Notes</h3>
          <p className="long-text">{order.notes || "No internal notes."}</p>
        </article>
      </section>
      {invoices && invoices.length > 0 ? (
        <section className="detail-section" id="order-invoices">
          <article className="data-section">
            <div className="section-title">
              <h3>Invoices</h3>
              <span className="section-count">
                {numberFormatter.format(invoices.length)}
              </span>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Brand</th>
                    <th>Invoice Date</th>
                    <th>Due Date</th>
                    <th>Invoice Total</th>
                    <th>Balance Due</th>
                    <th>Invoice Status</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <Link
                          className="table-link"
                          href={`/?module=invoice-document&invoice=${invoice.id}`}
                        >
                          {invoice.invoice_number}
                        </Link>
                      </td>
                      <td>{invoice.brand_name_snapshot}</td>
                      <td>{dateLabel(invoice.invoice_date)}</td>
                      <td>
                        {invoice.due_date
                          ? dateLabel(invoice.due_date)
                          : "Not set"}
                      </td>
                      <td>{money(Number(invoice.total_amount))}</td>
                      <td>{money(Number(invoice.balance_due))}</td>
                      <td>
                        <StatusBadge
                          tone={
                            invoice.invoice_status === "open"
                              ? "primary"
                              : "neutral"
                          }
                          value={invoice.invoice_status}
                        />
                      </td>
                      <td>
                        <StatusBadge
                          tone={
                            invoice.payment_status === "paid"
                              ? "good"
                              : invoice.payment_status === "partially_paid"
                                ? "warn"
                                : "danger"
                          }
                          value={invoice.payment_status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      ) : null}
    </section>
  );
}

async function CreateRgaPage({
  error,
  orderId,
}: {
  error?: string;
  orderId?: string;
}) {
  if (!orderId)
    return <ModulePlaceholder moduleName="Select an order to create an RGA" />;

  const [order, supabase] = await Promise.all([
    getSalesOrderDetail(orderId),
    Promise.resolve(createSupabaseAdminClient()),
  ]);
  if (!order || order.order_type === "quote")
    return <ModulePlaceholder moduleName="Original sales order not found" />;

  const { data: availableLines, error: availableLinesError } = await supabase
    .from("rga_available_sales_order_lines")
    .select(
      "sales_order_line_id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_shipped, previous_rga_quantity, available_rga_quantity",
    )
    .eq("sales_order_id", order.id)
    .order("product_sku_snapshot");
  if (availableLinesError) throw new Error(availableLinesError.message);

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="context-parent-link"
            href={`/?module=orders&order=${order.id}`}
          >
            Back to Order
          </Link>
          <div className="record-title-row">
            <h2>Create RGA</h2>
          </div>
          <p>
            <Link
              className="context-parent-link"
              href={`/?customer=${order.customer_account_id}`}
            >
              {order.customer_name_snapshot}
            </Link>{" "}
            | Original PO {order.customer_po_number}
          </p>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {(availableLines ?? []).length === 0 ? (
        <section className="detail-section">
          <article className="info-panel">
            <h3>No eligible items</h3>
            <p>
              There are no shipped quantities remaining on this order that can
              be included in a new RGA.
            </p>
          </article>
        </section>
      ) : (
        <form action={createRgaFromOrderAction} className="customer-form">
          <input name="order_id" type="hidden" value={order.id} />
          <fieldset>
            <legend>RGA Request</legend>
            <div className="form-grid rga-request-grid">
              <label>
                Reason
                <select
                  defaultValue="product_defect"
                  name="rga_reason_category"
                >
                  <option value="product_defect">Product Defect</option>
                  <option value="freight_damage">Freight Damage</option>
                  <option value="wrong_item">Wrong Item</option>
                  <option value="shipping_error">Shipping Error</option>
                  <option value="buy_remorse">Buy Remorse</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Requested Solution
                <select defaultValue="credit" name="requested_resolution_type">
                  <option value="credit">Credit</option>
                  <option value="replacement">Replacement</option>
                </select>
              </label>
              <div className="rga-request-options full-width-field">
                <label>
                  <input
                    defaultChecked
                    name="return_required"
                    type="checkbox"
                  />{" "}
                  Return required
                </label>
                <label>
                  <input name="customer_pays_return_freight" type="checkbox" />{" "}
                  Customer pays return freight
                </label>
              </div>
              <label className="full-width-field">
                Issue Description
                <textarea
                  name="issue_description"
                  placeholder="Describe the issue and any information needed for review."
                />
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Supporting Documents</legend>
            <p className="fieldset-note">
              Optional. Attach photos, freight-damage evidence, customer
              correspondence, or other documents needed to review this RGA.
            </p>
            <label className="rga-supporting-documents-field">
              Documents or Images
              <input
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                multiple
                name="rga_supporting_documents"
                type="file"
              />
            </label>
          </fieldset>
          <fieldset>
            <legend>Affected Shipped Items</legend>
            <p className="form-help">
              Select one or more eligible order lines. Available RGA quantity is
              the original shipped quantity less quantities already requested on
              prior active RGAs.
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>SKU</th>
                    <th>Item</th>
                    <th>Brand</th>
                    <th>Shipped</th>
                    <th>Previous RGA</th>
                    <th>Available for RGA</th>
                    <th>Requested Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {(availableLines ?? []).map((line) => (
                    <tr key={line.sales_order_line_id}>
                      <td>
                        <input
                          name="rga_line_id"
                          type="checkbox"
                          value={line.sales_order_line_id ?? ""}
                        />
                      </td>
                      <td>{line.product_sku_snapshot}</td>
                      <td>{line.product_name_snapshot}</td>
                      <td>{line.brand_name_snapshot}</td>
                      <td>
                        {numberFormatter.format(
                          Number(line.quantity_shipped ?? 0),
                        )}
                      </td>
                      <td>
                        {numberFormatter.format(
                          Number(line.previous_rga_quantity ?? 0),
                        )}
                      </td>
                      <td>
                        {numberFormatter.format(
                          Number(line.available_rga_quantity ?? 0),
                        )}
                      </td>
                      <td>
                        <input
                          defaultValue=""
                          max={Number(line.available_rga_quantity ?? 0)}
                          min="0"
                          name={`quantity_requested_${line.sales_order_line_id}`}
                          step="1"
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
          <div className="form-actions">
            <button className="primary-action" type="submit">
              Create RGA
            </button>
            <Link
              className="secondary-action"
              href={`/?module=orders&order=${order.id}`}
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}

async function RgaDashboardPage({
  error,
  notice,
  rgaOrder,
  rgaTab,
}: {
  error?: string;
  notice?: string;
  rgaOrder?: string;
  rgaTab?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { data: rgas, error: rgasError } = await supabase
    .from("rga")
    .select(
      "id, rga_number, customer_account_id, customer_name_snapshot, original_customer_po_number_snapshot, sales_order_id, request_date, requested_resolution_type, approved_resolution_type, status, created_at",
    )
    .order("created_at", { ascending: false });
  if (rgasError) throw new Error(rgasError.message);

  const rows = (rgas ?? []).filter(
    (rga) => !rgaOrder || rga.sales_order_id === rgaOrder,
  );
  const tabs = [
    { key: "pending", label: "Pending", statuses: ["draft", "pending_review"] },
    {
      key: "approved",
      label: "Approved",
      statuses: [
        "authorized",
        "awaiting_return",
        "received",
        "awaiting_credit_memo",
      ],
    },
    {
      key: "credit-memo",
      label: "Credit Memo",
      statuses: [
        "authorized",
        "awaiting_return",
        "received",
        "awaiting_credit_memo",
        "resolved",
        "closed",
      ],
      solution: "credit",
    },
    {
      key: "replacement-orders",
      label: "Replacement Orders",
      statuses: [
        "authorized",
        "awaiting_return",
        "received",
        "awaiting_credit_memo",
        "resolved",
        "closed",
      ],
      solution: "replacement",
    },
    {
      key: "closed",
      label: "Closed",
      statuses: ["resolved", "closed", "cancelled", "rejected"],
    },
  ];
  const selectedTab = tabs.some((tab) => tab.key === rgaTab)
    ? rgaTab!
    : "pending";
  const matchesTab = (rga: (typeof rows)[number], key: string) => {
    const tab = tabs.find((candidate) => candidate.key === key);
    return Boolean(
      tab?.statuses.includes(rga.status) &&
        (!tab.solution || rga.approved_resolution_type === tab.solution),
    );
  };
  const visibleRows = rows.filter((rga) => matchesTab(rga, selectedTab));
  const countForTab = (key: string) =>
    rows.filter((rga) => matchesTab(rga, key)).length;

  const dashboardHref = rgaOrder
    ? `/?module=rga&rga_order=${rgaOrder}`
    : "/?module=rga";

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <span className="eyebrow">RGA / Returns</span>
          <h2>{rgaOrder ? "Order RGAs" : "RGA Dashboard"}</h2>
          <p>
            {rgaOrder
              ? "RGAs related to this original sales order."
              : "Start an RGA from the original sales order so every request stays tied to shipped quantities and the customer PO."}
          </p>
        </div>
        <div className="record-hero-actions">
          <Link className="primary-action" href="/?module=orders">
            Create RGA from Order
          </Link>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {notice ? <p className="form-notice">{notice}</p> : null}
      <nav className="dashboard-tabs" aria-label="RGA queues">
        {tabs.map((tab) => (
          <Link
            className={
              selectedTab === tab.key
                ? "dashboard-tab dashboard-tab--active"
                : "dashboard-tab"
            }
            href={`${dashboardHref}&rga_tab=${tab.key}`}
            key={tab.key}
          >
            {tab.label}{" "}
            <span className="section-count">{countForTab(tab.key)}</span>
          </Link>
        ))}
      </nav>
      <section className="detail-section">
        <article className="data-section">
          <div className="section-title">
            <h3>{tabs.find((tab) => tab.key === selectedTab)?.label}</h3>
            <span className="section-count">{visibleRows.length}</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>RGA No.</th>
                  <th>Customer</th>
                  <th>Original PO</th>
                  <th>Request Date</th>
                  <th>Requested Solution</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((rga) => (
                  <tr key={rga.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?module=rga-detail&rga=${rga.id}`}
                      >
                        {rga.rga_number}
                      </Link>
                    </td>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?customer=${rga.customer_account_id}`}
                      >
                        {rga.customer_name_snapshot}
                      </Link>
                    </td>
                    <td>
                      {rga.sales_order_id ? (
                        <Link
                          className="table-link"
                          href={`/?module=orders&order=${rga.sales_order_id}`}
                        >
                          {rga.original_customer_po_number_snapshot ||
                            "Original order"}
                        </Link>
                      ) : (
                        rga.original_customer_po_number_snapshot || "Not set"
                      )}
                    </td>
                    <td>{dateLabel(rga.request_date)}</td>
                    <td>{label(rga.requested_resolution_type)}</td>
                    <td>
                      <StatusBadge
                        tone={
                          ["closed", "resolved"].includes(rga.status)
                            ? "neutral"
                            : rga.status === "pending_review"
                              ? "warn"
                              : "primary"
                        }
                        value={rga.status}
                      />
                    </td>
                  </tr>
                ))}
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No RGAs are in this queue.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </section>
  );
}

async function RgaDetailPage({
  error,
  notice,
  rgaId,
}: {
  error?: string;
  notice?: string;
  rgaId?: string;
}) {
  if (!rgaId) return <ModulePlaceholder moduleName="Select an RGA to review" />;

  const supabase = createSupabaseAdminClient();
  const [
    { data: rga, error: rgaError },
    { data: lines, error: linesError },
    { data: documents, error: documentsError },
  ] = await Promise.all([
    supabase
      .from("rga")
      .select(
        "id, rga_number, customer_account_id, customer_name_snapshot, original_customer_po_number_snapshot, sales_order_id, request_date, authorized_date, rejected_at, rga_reason_category, requested_resolution_type, approved_resolution_type, return_required, customer_pays_return_freight, issue_description, resolution_notes, status, created_at",
      )
      .eq("id", rgaId)
      .maybeSingle(),
    supabase
      .from("rga_line")
      .select(
        "id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_shipped_snapshot, previous_rga_quantity_snapshot, available_rga_quantity_snapshot, quantity_requested, quantity_authorized, status, notes",
      )
      .eq("rga_id", rgaId)
      .order("product_sku_snapshot"),
    supabase
      .from("attachment")
      .select(
        "id, original_file_name, content_type, storage_bucket, storage_path, uploaded_at",
      )
      .eq("entity_type", "rga")
      .eq("entity_id", rgaId)
      .eq("is_active", true)
      .order("uploaded_at"),
  ]);
  if (rgaError) throw new Error(rgaError.message);
  if (linesError) throw new Error(linesError.message);
  if (documentsError) throw new Error(documentsError.message);
  if (!rga) return <ModulePlaceholder moduleName="RGA not found" />;

  const [{ data: replacementOrder }, { data: creditMemo }] = await Promise.all([
    supabase
      .from("sales_order")
      .select("id, sales_order_number, created_at")
      .eq("order_type", "rga_replacement")
      .ilike("notes", `%${rga.rga_number}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("credit_memo")
      .select("id, credit_memo_number, created_at")
      .eq("rga_id", rga.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const documentLinks = await Promise.all(
    (documents ?? []).map(async (document) => {
      const { data } = await supabase.storage
        .from(document.storage_bucket)
        .createSignedUrl(document.storage_path, 3600);
      return { ...document, signedUrl: data?.signedUrl ?? null };
    }),
  );
  const isPendingReview = rga.status === "pending_review";
  const statusTone =
    rga.status === "pending_review"
      ? "warn"
      : ["authorized", "awaiting_return", "awaiting_credit_memo"].includes(
            rga.status,
          )
        ? "primary"
        : ["rejected", "cancelled"].includes(rga.status)
          ? "danger"
          : "neutral";

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="context-parent-link"
            href={
              rga.sales_order_id
                ? `/?module=rga&rga_order=${rga.sales_order_id}`
                : "/?module=rga"
            }
          >
            RGA List
          </Link>
          <div className="record-title-row">
            <h2>{rga.rga_number}</h2>
            <StatusBadge tone={statusTone} value={rga.status} />
          </div>
          <p>
            <Link
              className="context-parent-link"
              href={`/?customer=${rga.customer_account_id}`}
            >
              {rga.customer_name_snapshot}
            </Link>{" "}
            | Original PO{" "}
            {rga.sales_order_id ? (
              <Link
                className="table-link"
                href={`/?module=orders&order=${rga.sales_order_id}`}
              >
                {rga.original_customer_po_number_snapshot ||
                  "Open original order"}
              </Link>
            ) : (
              rga.original_customer_po_number_snapshot || "Not set"
            )}
          </p>
        </div>
        <div className="record-hero-actions">
          <Link
            className="secondary-action"
            href={`/?module=rga-solution&rga=${rga.id}`}
          >
            RGA Solution
          </Link>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {notice ? <p className="form-notice">{notice}</p> : null}
      <section className="detail-section">
        <article className="info-panel">
          <h3>Request Details</h3>
          <dl className="detail-list">
            <div>
              <dt>Request Date</dt>
              <dd>{dateLabel(rga.request_date)}</dd>
            </div>
            <div>
              <dt>Reason</dt>
              <dd>{label(rga.rga_reason_category)}</dd>
            </div>
            <div>
              <dt>Requested Solution</dt>
              <dd>{label(rga.requested_resolution_type)}</dd>
            </div>
            <div>
              <dt>Return Required</dt>
              <dd>{rga.return_required ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt>Customer Pays Return Freight</dt>
              <dd>{rga.customer_pays_return_freight ? "Yes" : "No"}</dd>
            </div>
          </dl>
          <h4>Issue Description</h4>
          <p className="long-text">
            {rga.issue_description || "No issue description was provided."}
          </p>
        </article>
        <article className="info-panel">
          <h3>Review Details</h3>
          <dl className="detail-list">
            <div>
              <dt>Approved Solution</dt>
              <dd>
                {rga.approved_resolution_type
                  ? label(rga.approved_resolution_type)
                  : "Not reviewed"}
              </dd>
            </div>
            <div>
              <dt>Authorized Date</dt>
              <dd>{dateLabel(rga.authorized_date)}</dd>
            </div>
            <div>
              <dt>Rejected Date</dt>
              <dd>{dateLabel(rga.rejected_at)}</dd>
            </div>
          </dl>
          <h4>Review Notes</h4>
          <p className="long-text">
            {rga.resolution_notes || "No review notes yet."}
          </p>
        </article>
        <article className="info-panel">
          <h3>Solution Record</h3>
          <dl className="detail-list">
            {replacementOrder ? (
              <div>
                <dt>Replacement Order</dt>
                <dd>
                  <Link
                    className="table-link"
                    href={`/?module=orders&order=${replacementOrder.id}`}
                  >
                    {replacementOrder.sales_order_number}
                  </Link>
                </dd>
              </div>
            ) : null}
            {creditMemo ? (
              <div>
                <dt>Credit Memo</dt>
                <dd>
                  <Link
                    className="table-link"
                    href={`/?customer=${rga.customer_account_id}&tab=credit-memo`}
                  >
                    {creditMemo.credit_memo_number}
                  </Link>
                </dd>
              </div>
            ) : null}
            {!replacementOrder && !creditMemo ? (
              <div>
                <dt>Solution</dt>
                <dd>Not created yet</dd>
              </div>
            ) : null}
          </dl>
        </article>
      </section>
      <section className="detail-section">
        <article className="data-section">
          <div className="section-title">
            <h3>Affected Items</h3>
            <span className="section-count">{lines?.length ?? 0}</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Item</th>
                  <th>Brand</th>
                  <th>Shipped</th>
                  <th>Previously Requested</th>
                  <th>Available When Filed</th>
                  <th>Requested</th>
                  <th>Authorized</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(lines ?? []).map((line) => (
                  <tr key={line.id}>
                    <td>{line.product_sku_snapshot}</td>
                    <td>{line.product_name_snapshot}</td>
                    <td>{line.brand_name_snapshot}</td>
                    <td>
                      {numberFormatter.format(
                        Number(line.quantity_shipped_snapshot),
                      )}
                    </td>
                    <td>
                      {numberFormatter.format(
                        Number(line.previous_rga_quantity_snapshot),
                      )}
                    </td>
                    <td>
                      {numberFormatter.format(
                        Number(line.available_rga_quantity_snapshot),
                      )}
                    </td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_requested))}
                    </td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_authorized))}
                    </td>
                    <td>
                      <StatusBadge
                        tone={
                          line.status === "authorized" ? "primary" : "neutral"
                        }
                        value={line.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
      <section className="detail-section">
        <article className="data-section">
          <div className="section-title">
            <h3>Supporting Documents</h3>
            <span className="section-count">{documentLinks.length}</span>
          </div>
          {documentLinks.length === 0 ? (
            <p className="empty-state">
              No supporting documents were attached.
            </p>
          ) : (
            <ul className="rga-document-list">
              {documentLinks.map((document) => (
                <li key={document.id}>
                  <span>{document.original_file_name}</span>
                  <span>
                    {document.content_type || "File"} |{" "}
                    {dateLabel(document.uploaded_at)}
                  </span>
                  {document.signedUrl ? (
                    <a
                      className="table-link"
                      href={document.signedUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Download
                    </a>
                  ) : (
                    <span>Unavailable</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
      {isPendingReview ? (
        <form action={reviewRgaAction} className="customer-form">
          <input name="rga_id" type="hidden" value={rga.id} />
          <fieldset>
            <legend>Review Decision</legend>
            <div className="form-grid">
              <label>
                Approved Solution
                <select
                  defaultValue={rga.requested_resolution_type}
                  name="approved_resolution_type"
                >
                  <option value="credit">Credit</option>
                  <option value="replacement">Replacement</option>
                </select>
              </label>
              <label className="full-width-field">
                Review Notes
                <textarea
                  name="review_notes"
                  placeholder="Required when rejecting. Add approval notes if useful."
                />
              </label>
            </div>
          </fieldset>
          <div className="form-actions">
            <button
              className="primary-action"
              name="review_decision"
              type="submit"
              value="approve"
            >
              Approve RGA
            </button>
            <button
              className="danger-action"
              name="review_decision"
              type="submit"
              value="reject"
            >
              Reject RGA
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

async function RgaSolutionPage({
  error,
  notice,
  rgaId,
}: {
  error?: string;
  notice?: string;
  rgaId?: string;
}) {
  if (!rgaId) return <ModulePlaceholder moduleName="Select an approved RGA" />;

  const supabase = createSupabaseAdminClient();
  const [rgaResult, linesResult] = await Promise.all([
    supabase
      .from("rga")
      .select(
        "id, rga_number, customer_account_id, customer_name_snapshot, original_customer_po_number_snapshot, sales_order_id, status, approved_resolution_type",
      )
      .eq("id", rgaId)
      .maybeSingle(),
    supabase
      .from("rga_line")
      .select(
        "id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_authorized, quantity_credited, quantity_replaced, status",
      )
      .eq("rga_id", rgaId)
      .order("product_sku_snapshot"),
  ]);
  if (rgaResult.error) throw new Error(rgaResult.error.message);
  if (linesResult.error) throw new Error(linesResult.error.message);
  if (!rgaResult.data) return <ModulePlaceholder moduleName="RGA not found" />;

  const rga = rgaResult.data;
  const lines = linesResult.data ?? [];
  const isApproved = [
    "authorized",
    "awaiting_return",
    "received",
    "awaiting_credit_memo",
    "resolved",
    "closed",
  ].includes(rga.status);
  const approvedSolution = rga.approved_resolution_type;
  const [
    { data: replacementOrder, error: replacementOrderError },
    { data: creditMemo, error: creditMemoError },
  ] = await Promise.all([
    supabase
      .from("sales_order")
      .select("id, sales_order_number, created_at")
      .eq("order_type", "rga_replacement")
      .ilike("notes", `%${rga.rga_number}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("credit_memo")
      .select("id, credit_memo_number, created_at")
      .eq("rga_id", rga.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  if (replacementOrderError) throw new Error(replacementOrderError.message);
  if (creditMemoError) throw new Error(creditMemoError.message);

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="context-parent-link"
            href={`/?module=rga-detail&rga=${rga.id}`}
          >
            Back to RGA
          </Link>
          <div className="record-title-row">
            <h2>RGA Solution</h2>
            <StatusBadge
              tone={isApproved ? "primary" : "warn"}
              value={rga.status}
            />
          </div>
          <p>
            <strong>{rga.rga_number}</strong> |{" "}
            <Link
              className="context-parent-link"
              href={`/?customer=${rga.customer_account_id}`}
            >
              {rga.customer_name_snapshot}
            </Link>{" "}
            | Original PO{" "}
            {rga.sales_order_id ? (
              <Link
                className="table-link"
                href={`/?module=orders&order=${rga.sales_order_id}`}
              >
                {rga.original_customer_po_number_snapshot || "Open order"}
              </Link>
            ) : (
              rga.original_customer_po_number_snapshot || "Not set"
            )}
          </p>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {notice ? <p className="form-notice">{notice}</p> : null}
      <section className="detail-section">
        <article className="info-panel">
          <h3>Solution Record</h3>
          <dl className="detail-list">
            {replacementOrder ? (
              <div>
                <dt>Replacement Order</dt>
                <dd>
                  <Link
                    className="table-link"
                    href={`/?module=orders&order=${replacementOrder.id}`}
                  >
                    {replacementOrder.sales_order_number}
                  </Link>
                </dd>
              </div>
            ) : null}
            {creditMemo ? (
              <div>
                <dt>Credit Memo</dt>
                <dd>
                  <Link
                    className="table-link"
                    href={`/?customer=${rga.customer_account_id}&tab=credit-memo`}
                  >
                    {creditMemo.credit_memo_number}
                  </Link>
                </dd>
              </div>
            ) : null}
            {!replacementOrder && !creditMemo ? (
              <div>
                <dt>Solution</dt>
                <dd>Not created yet</dd>
              </div>
            ) : null}
          </dl>
        </article>
      </section>
      <section className="detail-section">
        <article className="info-panel">
          <h3>Approved Resolution</h3>
          <dl className="detail-list">
            <div>
              <dt>Solution</dt>
              <dd>
                {approvedSolution ? label(approvedSolution) : "Not approved"}
              </dd>
            </div>
            <div>
              <dt>Workflow Status</dt>
              <dd>{label(rga.status)}</dd>
            </div>
          </dl>
          {!isApproved || !approvedSolution ? (
            <p className="empty-state">
              This RGA must be approved with a solution before a credit memo or
              replacement order can be created.
            </p>
          ) : null}
        </article>
        <article className="info-panel">
          <h3>Solution Status</h3>
          {!isApproved || !approvedSolution ? (
            <p className="empty-state">
              The RGA is still waiting for approval. Once a solution is
              approved, its credit or replacement progress will appear here.
            </p>
          ) : null}
          {isApproved && approvedSolution === "credit" ? (
            <form action={issueRgaCreditMemoAction} className="form-actions">
              <input type="hidden" name="rga_id" value={rga.id} />
              <button className="primary-action" type="submit">
                Issue Credit Memo
              </button>
            </form>
          ) : null}
          {isApproved && approvedSolution === "replacement" ? (
            <form
              action={createRgaReplacementOrderAction}
              className="form-actions"
            >
              <input type="hidden" name="rga_id" value={rga.id} />
              <button className="primary-action" type="submit">
                Create Replacement Order
              </button>
            </form>
          ) : null}
        </article>
      </section>
      <section className="detail-section">
        <article className="data-section">
          <div className="section-title">
            <h3>Authorized Items</h3>
            <span className="section-count">{lines.length}</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Item</th>
                  <th>Brand</th>
                  <th>Authorized</th>
                  <th>Credited</th>
                  <th>Replaced</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id}>
                    <td>{line.product_sku_snapshot}</td>
                    <td>{line.product_name_snapshot}</td>
                    <td>{line.brand_name_snapshot}</td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_authorized))}
                    </td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_credited))}
                    </td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_replaced))}
                    </td>
                    <td>
                      <StatusBadge tone="neutral" value={line.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </section>
  );
}

async function QuoteDocumentPage({ quoteId }: { quoteId?: string }) {
  if (!quoteId) return <ModulePlaceholder moduleName="Quote document" />;

  const quote = await getSalesOrderDetail(quoteId);
  if (!quote || quote.order_type !== "quote")
    return <ModulePlaceholder moduleName="Quote not found" />;

  return (
    <section className="quote-document-page">
      <div className="quote-document-controls">
        <Link
          className="secondary-action"
          href={`/?module=orders&order=${quote.id}`}
        >
          Back to Quote
        </Link>
        <QuoteDocumentControls />
      </div>
      <article className="quote-document">
        <header className="quote-document-header">
          <div>
            <span className="eyebrow">
              Terracotta Designs and Kanova &amp; Co.
            </span>
            <h2>Quote</h2>
          </div>
          <dl>
            <div>
              <dt>Quote No.</dt>
              <dd>{quote.sales_order_number}</dd>
            </div>
            <div>
              <dt>Quote Date</dt>
              <dd>{dateLabel(quote.order_date)}</dd>
            </div>
            <div>
              <dt>Customer PO</dt>
              <dd>{quote.customer_po_number}</dd>
            </div>
          </dl>
        </header>
        <section className="quote-document-addresses">
          <div>
            <span>Bill To</span>
            <strong>{quote.customer_name_snapshot}</strong>
          </div>
          <div>
            <span>Ship To</span>
            <strong>{quote.ship_to_display_name_snapshot}</strong>
          </div>
        </section>
        <table className="quote-document-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Item</th>
              <th>Brand</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {quote.lines.map((line) => (
              <tr key={line.id}>
                <td>{line.product_sku_snapshot}</td>
                <td>{line.product_name_snapshot}</td>
                <td>{line.brand_name_snapshot}</td>
                <td>{numberFormatter.format(line.quantity_ordered)}</td>
                <td>{money(Number(line.unit_price))}</td>
                <td>{line.discount_percent}%</td>
                <td>{money(line.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="quote-document-total">
          <span>Quote Total</span>
          <strong>{money(Number(quote.total_amount ?? 0))}</strong>
        </div>
        {quote.notes ? (
          <section className="quote-document-notes">
            <span>Notes</span>
            <p>{quote.notes}</p>
          </section>
        ) : null}
      </article>
    </section>
  );
}

function EditOrderPage({
  billingAddressOptions,
  defaultDiscountPercent,
  error,
  order,
  parts,
  products,
  salesRepOptions,
  shipToOptions,
  territoryOptions,
}: {
  billingAddressOptions: OrderAddressOption[];
  defaultDiscountPercent: number;
  error?: string;
  order: SalesOrderDetail;
  parts: OrderPartOption[];
  products: OrderProductOption[];
  salesRepOptions: RepOption[];
  shipToOptions: OrderAddressOption[];
  territoryOptions: SelectOption[];
}) {
  const customerOrdersHref = `/?customer=${order.customer_account_id}&tab=orders`;
  const detailHref = `/?module=orders&order=${order.id}`;
  const editable = ["open", "partially_shipped", "pending", "hold"].includes(
    order.status,
  );

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <Link className="context-parent-link" href={customerOrdersHref}>
            Order List
          </Link>
          <span className="eyebrow">Order Entry</span>
          <h2>Edit {order.sales_order_number}</h2>
          <p>
            <Link
              className="context-parent-link"
              href={`/?customer=${order.customer_account_id}`}
            >
              {order.customer_name_snapshot}
            </Link>
          </p>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {!editable ? (
        <p className="form-alert">
          Only open, partially shipped, pending, or held orders can be edited.
        </p>
      ) : null}
      <form
        action={updateSalesOrderAction}
        className="customer-form order-entry-form"
        data-default-discount={defaultDiscountPercent}
      >
        <OrderEntryPartsInitializer />
        <input name="order_id" type="hidden" value={order.id} />
        <input
          name="customer_id"
          type="hidden"
          value={order.customer_account_id}
        />
        <input
          data-order-lines
          name="new_order_lines"
          type="hidden"
          value="[]"
        />
        <fieldset>
          <legend>Order Header</legend>
          <div className="form-grid form-grid--two">
            <label>
              Customer PO No.
              <input
                defaultValue={order.customer_po_number}
                disabled={!editable}
                name="customer_po_number"
                required
              />
            </label>
            <label>
              Order Date
              <input defaultValue={order.order_date} readOnly />
            </label>
            <label>
              Order Status
              <select
                defaultValue={order.status}
                disabled={!editable}
                name="order_status"
              >
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="hold">Hold</option>
                <option value="void">Void</option>
              </select>
            </label>
            <label>
              Shipping Priority
              <select
                defaultValue={order.shipping_priority}
                disabled={!editable || order.order_type === "quote"}
                name="shipping_priority"
              >
                <option value="normal">Normal</option>
                <option value="highest">Highest</option>
              </select>
            </label>
            <label>
              Territory
              <select
                defaultValue={order.territory_id_snapshot ?? ""}
                disabled={!editable}
                name="territory_id"
              >
                <option value="">Not assigned</option>
                {territoryOptions.map((territory) => (
                  <option key={territory.id} value={territory.id}>
                    {territory.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sales Rep
              <select
                defaultValue={
                  order.sales_rep_id_snapshot &&
                  order.sales_rep_agency_id_snapshot
                    ? `${order.sales_rep_id_snapshot}|${order.sales_rep_agency_id_snapshot}`
                    : ""
                }
                disabled={!editable}
                name="sales_rep_selection"
              >
                <option value="">Not assigned</option>
                {salesRepOptions.map((rep) => (
                  <option key={rep.id} value={`${rep.id}|${rep.agency_id}`}>
                    {rep.name} - {rep.agency_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>
        <EditOrderAddresses
          billingAddressOptions={billingAddressOptions}
          billingSnapshot={order.bill_to_snapshot_json}
          disabled={!editable}
          shipToOptions={shipToOptions}
          shipToSnapshot={order.ship_to_snapshot_json}
        />
        {editable ? (
          <EditOrderItemsPicker parts={parts} products={products} />
        ) : null}
        <fieldset>
          <legend>Order Lines</legend>
          <p className="fieldset-note">
            Only unshipped lines can be changed or removed. Order totals update
            automatically when you save.
          </p>
          <div className="table-wrap">
            <table className="data-table edit-order-lines-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Ordered</th>
                  <th>Shipped</th>
                  <th>Unit Price</th>
                  <th>Discount</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => {
                  const locked = !editable || Number(line.quantity_shipped) > 0;
                  return (
                    <tr key={line.id}>
                      <td>
                        {line.product_sku_snapshot}
                        <input name="line_id" type="hidden" value={line.id} />
                      </td>
                      <td>{line.product_name_snapshot}</td>
                      <td>
                        {locked ? (
                          line.quantity_ordered
                        ) : (
                          <input
                            defaultValue={line.quantity_ordered}
                            min={1}
                            name={`quantity_${line.id}`}
                            required
                            step="1"
                            type="number"
                          />
                        )}
                      </td>
                      <td>{line.quantity_shipped}</td>
                      <td>
                        {locked ? (
                          money(Number(line.unit_price))
                        ) : (
                          <input
                            defaultValue={line.unit_price}
                            min={0}
                            name={`unit_price_${line.id}`}
                            required
                            step="0.01"
                            type="number"
                          />
                        )}
                      </td>
                      <td>
                        {locked ? (
                          `${line.discount_percent}%`
                        ) : (
                          <input
                            defaultValue={line.discount_percent}
                            max={100}
                            min={0}
                            name={`discount_percent_${line.id}`}
                            required
                            step="0.01"
                            type="number"
                          />
                        )}
                      </td>
                      <td>
                        {locked ? (
                          "Locked"
                        ) : (
                          <label className="inline-checkbox">
                            <input
                              name="delete_line_id"
                              type="checkbox"
                              value={line.id}
                            />{" "}
                            Remove
                          </label>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </fieldset>
        <fieldset>
          <legend>Notes</legend>
          <label className="order-notes-field">
            Internal Order Notes
            <textarea
              defaultValue={order.notes ?? ""}
              disabled={!editable}
              name="notes"
              rows={4}
            />
          </label>
        </fieldset>
        {editable ? (
          <div className="form-actions">
            <button className="primary-action" type="submit">
              Save Changes
            </button>
            <Link className="secondary-action" href={detailHref}>
              Cancel
            </Link>
          </div>
        ) : null}
      </form>
    </section>
  );
}

function EditOrderItemsPicker({
  parts,
  products,
}: {
  parts: OrderPartOption[];
  products: OrderProductOption[];
}) {
  return (
    <fieldset>
      <legend>Add Items</legend>
      <p className="fieldset-note">
        Search and add regular products or parts. New items are added when you
        save the order.
      </p>
      <div
        className="order-product-search"
        data-order-product-picker
        data-parent-products={JSON.stringify(
          products.map((product) => ({
            id: product.id,
            name: product.name,
            sku: product.sku,
          })),
        )}
        data-part-options={JSON.stringify(parts)}
        data-products={JSON.stringify(products)}
      >
        <div className="order-search-heading">
          <label className="order-search-label">
            Search SKU or Product Name
          </label>
          <label className="checkbox-label order-part-toggle">
            <input name="search_parts" type="checkbox" /> Search Parts
          </label>
        </div>
        <div className="order-search-mode order-search-mode--products">
          <label>
            <input
              autoComplete="off"
              list="edit-order-product-options"
              name="product_search"
              placeholder="Type a SKU or product name"
            />
            <datalist id="edit-order-product-options">
              {products.map((product) => (
                <option
                  key={product.id}
                  label={`${product.name} | ${product.brandName}`}
                  value={product.sku}
                />
              ))}
            </datalist>
          </label>
          <div className="order-product-results" data-product-results />
          <p className="fieldset-note" data-product-empty />
        </div>
        <div className="order-search-mode order-search-mode--parts">
          <label className="checkbox-label order-generic-toggle">
            <input name="search_generic_part" type="checkbox" /> Search a
            generic part
          </label>
          <div className="part-search-mode part-search-mode--parent">
            <div
              className="part-parent-search-grid"
              data-order-part-picker
              data-parent-products={JSON.stringify(
                products.map((product) => ({
                  id: product.id,
                  name: product.name,
                  sku: product.sku,
                })),
              )}
              data-part-options={JSON.stringify(parts)}
            >
              <div>
                <label>
                  Enter a Parent SKU/Name
                  <input
                    autoComplete="off"
                    list="edit-order-parent-options"
                    name="parent_part_search"
                    placeholder="Type a parent SKU or name"
                  />
                  <datalist id="edit-order-parent-options">
                    {products.map((product) => (
                      <option
                        key={product.id}
                        label={`${product.name} | ${product.brandName}`}
                        value={product.sku}
                      />
                    ))}
                  </datalist>
                </label>
              </div>
              <div className="part-child-picker" data-child-parts>
                <span className="part-picker-label">Child Parts</span>
                <p className="fieldset-note">
                  Pick a parent product to display its child parts.
                </p>
              </div>
            </div>
          </div>
          <div className="part-search-mode part-search-mode--generic">
            <label>
              Search Generic Part Name or SKU
              <input
                autoComplete="off"
                list="edit-order-generic-part-options"
                name="generic_part_search"
                placeholder="Type a part name or SKU"
              />
              <datalist id="edit-order-generic-part-options">
                {parts
                  .filter((part) => part.parentProductIds.length === 0)
                  .map((part) => (
                    <option key={part.id} label={part.name} value={part.sku} />
                  ))}
              </datalist>
            </label>
            <div className="order-product-results" data-generic-part-results />
            <p className="fieldset-note" data-generic-part-empty />
          </div>
        </div>
      </div>
      <div className="native-order-lines" data-native-order-lines />
      <div className="order-total">
        <span>New Items Subtotal</span>
        <strong data-native-order-subtotal>$0.00</strong>
      </div>
    </fieldset>
  );
}

async function getCustomerName(customerId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("customer_account")
    .select("id, name")
    .eq("id", customerId)
    .single();

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
      "id, policy_name, freight_terms, ltl_freight_terms, ground_freight_terms, preferred_shipping_type, freight_allowance_amount, flat_rate_percent, default_ltl_carrier, default_ltl_carrier_account_number, default_ground_carrier, default_ground_carrier_account_number",
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

async function getLocationForEdit(locationId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: location, error: locationError } = await supabase
    .from("customer_location")
    .select(
      "id, customer_account_id, location_code, location_name, location_type, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, email, is_shipping_address, is_default_ship_to, is_billing_address, is_showroom, status",
    )
    .eq("id", locationId)
    .single();

  if (locationError) {
    throw new Error(locationError.message);
  }

  const { data: showroom, error: showroomError } = await supabase
    .from("primary_showroom_enrollment")
    .select(
      "id, customer_location_id, program_status, enrollment_date, expiration_date, pending_renew_date, required_display_count, current_display_count, discount_percent, free_freight_threshold, showroom_size_classification, showroom_notification_email",
    )
    .eq("customer_location_id", locationId)
    .in("program_status", ["pending", "active", "pending_renew", "suspended"])
    .maybeSingle();

  if (showroomError) {
    throw new Error(showroomError.message);
  }

  return {
    location: location as LocationEditRecord,
    primaryShowroom: showroom as PrimaryShowroomEnrollment | null,
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
    displaysResult,
  ] = await Promise.all([
    getLocationForEdit(locationId),
    supabase
      .from("customer_contact")
      .select(
        "id, customer_location_id, name, title, department, email, phone, mobile, fax, is_active, is_primary, is_billing_contact, is_purchasing_contact, is_warehouse_receiver, is_showroom_floor_sales, is_showroom_manager",
      )
      .eq("customer_account_id", customerId)
      .eq("customer_location_id", locationId)
      .order("is_primary", { ascending: false })
      .order("name", { ascending: true }),
    supabase
      .from("sales_order")
      .select(
        "id, sales_order_number, customer_po_number, order_date, order_source, order_type, status, shipping_readiness_status, credit_hold_status, total_amount",
      )
      .eq("customer_account_id", customerId)
      .eq("customer_location_id", locationId)
      .order("order_date", { ascending: false })
      .limit(12),
    supabase
      .from("packing_list")
      .select(
        "id, packing_list_number, customer_po_number_snapshot, status, invoice_generation_status_snapshot, shipping_fee, ship_date",
      )
      .eq("customer_account_id", customerId)
      .eq("customer_location_id", locationId)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase
      .from("customer_invoice")
      .select(
        "id, invoice_number, brand_name_snapshot, invoice_date, due_date, invoice_status, payment_status, total_amount, balance_due",
      )
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
        "id, sku_snapshot, product_name_snapshot, display_status, display_shipped_date_snapshot, customer_po_number_snapshot, display_discount_percent_snapshot, counts_toward_primary_showroom",
      )
      .eq("customer_location_id", locationId)
      .order("display_shipped_date_snapshot", { ascending: false })
      .limit(24),
  ]);

  const results = [
    contactsResult,
    ordersResult,
    packingListsResult,
    invoicesResult,
    rgasResult,
    displaysResult,
  ];
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
    rgas: (rgasResult.data ?? []) as Rga[],
  };
}

async function getContactForEdit(contactId: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("customer_contact")
    .select(
      "id, customer_account_id, customer_location_id, name, title, department, email, phone, mobile, fax, is_active, is_primary, is_billing_contact, is_purchasing_contact, is_warehouse_receiver, is_showroom_floor_sales, is_showroom_manager",
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

function PartDetailDashboard({
  part,
  selectedTab,
}: {
  part: ProductDetail | null;
  selectedTab: string;
}) {
  if (!part) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Part was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=product-parts"
        >
          Back to Parts List
        </Link>
      </section>
    );
  }

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "images", label: "Images" },
    { key: "inventory", label: "Inventory / Locations" },
    { key: "parents", label: "Parent Products" },
  ];
  const activeTab = tabs.some((tab) => tab.key === selectedTab)
    ? selectedTab
    : "profile";
  const partTabHref = (tabKey: string) =>
    `/?module=product-parts&part=${part.id}&product_tab=${tabKey}`;
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
            <StatusBadge
              tone={part.status === "active" ? "good" : "warn"}
              value={part.status}
            />
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
          <strong>
            {numberFormatter.format(Number(part.sellable_quantity ?? 0))}
          </strong>
        </div>
        <div className="metric-card">
          <span>ETA</span>
          <strong>{etaLabel}</strong>
        </div>
      </section>

      <nav className="tab-nav" aria-label="Part detail tabs">
        {tabs.map((tab) => (
          <Link
            aria-current={activeTab === tab.key ? "page" : undefined}
            href={partTabHref(tab.key)}
            key={tab.key}
          >
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
                  <dd>
                    {part.usedInParents.length === 0
                      ? "Generic part"
                      : "Product-specific part"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "images" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>
              {numberFormatter.format(part.images.length)} part images
            </span>
            <div className="list-actions">
              <Link
                className="text-action"
                href={`/?module=edit-product-images&product=${part.id}&return_module=product-parts`}
              >
                Edit Images
              </Link>
            </div>
          </section>
          {part.images.length === 0 ? (
            <div className="info-card">
              No images have been uploaded for this part.
            </div>
          ) : (
            <div className="image-gallery-grid">
              {part.images.map((image) => (
                <article className="image-tile" key={image.id}>
                  <div className="image-preview-frame">
                    <img
                      alt={image.display_name ?? image.original_file_name}
                      src={image.public_url}
                    />
                  </div>
                  <div className="image-tile-body">
                    <strong>
                      {image.display_name ?? image.original_file_name}
                    </strong>
                    <span>{label(image.image_category)}</span>
                    <a
                      className="table-link"
                      href={image.public_url}
                      rel="noreferrer"
                      target="_blank"
                    >
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
            <span>
              {numberFormatter.format(part.inventoryBalances.length)} inventory
              balances
            </span>
            <div className="list-actions">
              <Link
                className="text-action"
                href={`/?module=edit-product-inventory&product=${part.id}&return_module=product-parts`}
              >
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
                      <td>
                        {balance.box_sequence
                          ? `Box ${balance.box_sequence}${balance.box_label ? ` / ${balance.box_label}` : ""}`
                          : "SKU balance"}
                      </td>
                      <td>{balance.warehouse_name}</td>
                      <td>{balance.location_code}</td>
                      <td>{label(balance.inventory_condition)}</td>
                      <td>
                        {numberFormatter.format(balance.quantity_on_hand)}
                      </td>
                      <td>
                        {numberFormatter.format(balance.quantity_allocated)}
                      </td>
                      <td>
                        {numberFormatter.format(balance.quantity_available)}
                      </td>
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
            <span>
              {numberFormatter.format(part.usedInParents.length)} linked parent
              products
            </span>
            <div className="list-actions">
              <Link
                className="text-action"
                href={`/?module=edit-part-parents&part=${part.id}`}
              >
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
                    <td colSpan={6}>
                      This is a generic part. It is not linked to a parent
                      product yet.
                    </td>
                  </tr>
                ) : (
                  part.usedInParents.map((parent) => (
                    <tr key={parent.id}>
                      <td>
                        <Link
                          className="table-link"
                          href={`/?module=products&product=${parent.parent_product_id}`}
                        >
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
                          <input
                            name="parent_link_id"
                            type="hidden"
                            value={parent.id}
                          />
                          <button
                            className="text-action text-action--button text-action--danger"
                            type="submit"
                          >
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

function ProductDetailDashboard({
  product,
  selectedTab,
}: {
  product: ProductDetail | null;
  selectedTab: string;
}) {
  if (!product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
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
    { key: "vendors", label: "Vendors" },
  ];
  const activeTab = tabs.some((tab) => tab.key === selectedTab)
    ? selectedTab
    : "profile";
  const productTabHref = (tabKey: string) =>
    `/?module=products&product=${product.id}&product_tab=${tabKey}`;
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
  const normalizeSpecName = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const specValue = (...names: string[]) => {
    const wantedNames = new Set(names.map(normalizeSpecName));
    const match = product.specAttributes.find((spec) =>
      wantedNames.has(normalizeSpecName(spec.attribute_name)),
    );

    if (!match) {
      return "Not set";
    }

    return match.unit
      ? `${match.attribute_value} ${match.unit}`
      : match.attribute_value;
  };
  const specRows = (rows: { label: string; names: string[] }[]) =>
    rows.map((row) => ({
      label: row.label,
      value: specValue(...row.names),
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
            <StatusBadge
              tone={product.status === "active" ? "good" : "warn"}
              value={product.status}
            />
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
          <strong>
            {numberFormatter.format(Number(product.sellable_quantity ?? 0))}
          </strong>
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
          <Link
            aria-current={activeTab === tab.key ? "page" : undefined}
            href={productTabHref(tab.key)}
            key={tab.key}
          >
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
                <Link
                  className="text-action"
                  href={`/?module=edit-product-profile&product=${product.id}`}
                >
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
                  <dd>
                    {product.counts_toward_primary_showroom_default === false
                      ? "Excluded"
                      : "Included"}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="info-card">
              <div className="card-heading">
                <h3>Pricing / Finish</h3>
                <Link
                  className="text-action"
                  href={`/?module=edit-product-pricing-finishes&product=${product.id}`}
                >
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
                  <dd>
                    {product.finishes.length > 0
                      ? product.finishes.join(", ")
                      : "Not set"}
                  </dd>
                </div>
                <div>
                  <dt>Box Required</dt>
                  <dd>
                    {product.no_box_needed
                      ? "No box needed"
                      : "Packing box required"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="info-card">
            <div className="card-heading">
              <h3>Description</h3>
              <Link
                className="text-action"
                href={`/?module=edit-product-description&product=${product.id}`}
              >
                Edit
              </Link>
            </div>
            <p className="long-text">
              {product.description ?? "No product description saved yet."}
            </p>
          </div>
        </section>
      ) : null}

      {activeTab === "specs" ? (
        <section className="detail-section">
          <div className="two-column-grid">
            <div className="info-card">
              <div className="card-heading">
                <h3>Dimensions and Weight</h3>
                <Link
                  className="text-action"
                  href={`/?module=edit-product-specs&product=${product.id}&spec_section=dimensions`}
                >
                  Edit
                </Link>
              </div>
              <dl className="detail-list">
                {specRows([
                  {
                    label: "Body Dimension",
                    names: ["body dimension", "body dimensions", "body size"],
                  },
                  {
                    label: "Shade Dimension",
                    names: [
                      "shade dimension",
                      "shade dimensions",
                      "shade size",
                    ],
                  },
                  {
                    label: "Canopy Shape / Size",
                    names: [
                      "canopy shape / size",
                      "canopy shape and size",
                      "canopy detail",
                      "canopy shape",
                      "canopy size",
                    ],
                  },
                  {
                    label: "Net Weight",
                    names: ["net weight", "product net weight"],
                  },
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
                <Link
                  className="text-action"
                  href={`/?module=edit-product-specs&product=${product.id}&spec_section=electrical`}
                >
                  Edit
                </Link>
              </div>
              <dl className="detail-list">
                {specRows([
                  {
                    label: "Max Wattage",
                    names: ["max wattage", "maximum wattage"],
                  },
                  { label: "Voltage", names: ["voltage"] },
                  { label: "Socket Type", names: ["socket type"] },
                  {
                    label: "Number of Bulbs",
                    names: ["number of bulbs", "bulb count"],
                  },
                  { label: "Bulb Type", names: ["bulb type", "bulb types"] },
                  {
                    label: "Max Bulbs Wattage",
                    names: [
                      "max bulbs wattage",
                      "max bulb wattage",
                      "maximum bulbs wattage",
                      "max bulb voltage",
                      "maximum bulb voltage",
                    ],
                  },
                  {
                    label: "Bulbs Included",
                    names: ["bulbs included", "bulb included"],
                  },
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
                <Link
                  className="text-action"
                  href={`/?module=edit-product-specs&product=${product.id}&spec_section=hanging`}
                >
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
                  <dd>
                    {product.hangingConfig?.wire_length ??
                      specValue("wire length")}
                  </dd>
                </div>
                <div>
                  <dt>Chain Length</dt>
                  <dd>
                    {product.hangingConfig?.chain_length ??
                      specValue("chain length")}
                  </dd>
                </div>
                <div>
                  <dt>Rod Length / Sizes</dt>
                  <dd>
                    {product.hangingConfig?.rod_length ??
                      specValue("rod sizes", "rod pieces", "rods included")}
                  </dd>
                </div>
                <div>
                  <dt>Canopy Detail</dt>
                  <dd>
                    {product.hangingConfig?.canopy_detail ??
                      specValue(
                        "canopy shape / size",
                        "canopy shape and size",
                        "canopy detail",
                      )}
                  </dd>
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
                <Link
                  className="text-action"
                  href={`/?module=edit-product-specs&product=${product.id}&spec_section=led`}
                >
                  Edit
                </Link>
              </div>
              <dl className="detail-list">
                {specRows([
                  {
                    label: "Integrated LED",
                    names: ["integrated led", "integrated led fixture"],
                  },
                  { label: "Dimmable", names: ["dimmable"] },
                  { label: "Dimmer Type", names: ["dimmer type"] },
                  {
                    label: "Color Temperature",
                    names: ["color temperature", "kelvin"],
                  },
                  { label: "Lumen", names: ["lumen", "lumens"] },
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
              <Link
                className="text-action"
                href={`/?module=edit-product-specs&product=${product.id}&spec_section=safety`}
              >
                Edit
              </Link>
            </div>
            <dl className="detail-list">
              {specRows([
                {
                  label: "Safety Rating",
                  names: ["safety rating", "safety rate", "ul etl"],
                },
                { label: "UPC Code", names: ["upc", "upc code"] },
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
            <span>
              {numberFormatter.format(product.images.length)} product images
            </span>
            <div className="list-actions">
              <Link
                className="primary-action"
                href={`/?module=edit-product-images&product=${product.id}`}
              >
                Add Image
              </Link>
            </div>
          </section>
          {product.images.length === 0 ? (
            <div className="empty-state">No product images uploaded yet.</div>
          ) : null}
          {imageCategories.map((category) => {
            const categoryImages = product.images.filter(
              (image) => image.image_category === category,
            );

            if (categoryImages.length === 0) {
              return null;
            }

            return (
              <div className="info-card" key={category}>
                <div className="section-title section-title--plain">
                  <strong>{label(category)} Images</strong>
                  <div className="section-title-actions">
                    <span>{categoryImages.length}</span>
                    <Link
                      className="text-action"
                      href={`/?module=edit-product-images&product=${product.id}&image_category=${category}`}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
                <div className="image-gallery-grid">
                  {categoryImages.map((image) => (
                    <article className="image-tile" key={image.id}>
                      <div className="image-preview-frame">
                        <img
                          alt={image.display_name ?? image.original_file_name}
                          src={image.public_url}
                        />
                      </div>
                      <div className="image-tile-body">
                        <div className="image-tile-title">
                          <strong>
                            {image.display_name ?? image.original_file_name}
                          </strong>
                          {image.is_default_thumbnail ? (
                            <StatusBadge
                              tone="primary"
                              value="Default Thumbnail"
                            />
                          ) : null}
                        </div>
                        <span>{image.original_file_name}</span>
                        <span>{fileSizeLabel(image.file_size)}</span>
                        <span>{dateLabel(image.uploaded_at.slice(0, 10))}</span>
                        <a
                          className="table-link"
                          href={image.public_url}
                          rel="noreferrer"
                          target="_blank"
                        >
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
            <span>
              {numberFormatter.format(product.documents.length)} product
              documents
            </span>
          </section>
          <div className="info-card">
            <div className="section-title section-title--plain">
              <strong>Upload Product Document</strong>
            </div>
            <form
              action={uploadProductDocumentAction}
              className="attachment-upload-form attachment-upload-form--product"
            >
              <input name="product_id" type="hidden" value={product.id} />
              <label>
                Document
                <input name="document_file" required type="file" />
              </label>
              <label>
                Type
                <select name="document_type" defaultValue="spec_sheet">
                  <option value="spec_sheet">Product Spec Tear Sheet</option>
                  <option value="installation_instruction">
                    Installation Instructions
                  </option>
                  <option value="manual">Manual</option>
                  <option value="box_label">Box Label / White Label</option>
                  <option value="cad_drawing">CAD Drawing</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Display Name
                <input
                  name="display_name"
                  placeholder="Optional display name"
                />
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
                      <td>
                        {document.display_name ?? document.original_file_name}
                      </td>
                      <td>{label(document.document_type)}</td>
                      <td>{document.original_file_name}</td>
                      <td>{fileSizeLabel(document.file_size)}</td>
                      <td>{dateLabel(document.uploaded_at.slice(0, 10))}</td>
                      <td>
                        {document.signed_url ? (
                          <a
                            className="table-link"
                            href={document.signed_url}
                            rel="noreferrer"
                            target="_blank"
                          >
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

      {activeTab === "vendors" ? (
        <ProductVendorRows productId={product.id} vendors={product.vendors} />
      ) : null}

      {activeTab === "inventory" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>
              {numberFormatter.format(product.inventoryBalances.length)}{" "}
              inventory balances
            </span>
            <div className="list-actions">
              <Link
                className="text-action"
                href={`/?module=edit-product-inventory&product=${product.id}`}
              >
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
                      <td>
                        {balance.box_sequence
                          ? `Box ${balance.box_sequence}${balance.box_label ? ` / ${balance.box_label}` : ""}`
                          : "SKU balance"}
                      </td>
                      <td>{balance.warehouse_name}</td>
                      <td>{balance.location_code}</td>
                      <td>{label(balance.inventory_condition)}</td>
                      <td>
                        {numberFormatter.format(balance.quantity_on_hand)}
                      </td>
                      <td>
                        {numberFormatter.format(balance.quantity_allocated)}
                      </td>
                      <td>
                        {numberFormatter.format(balance.quantity_available)}
                      </td>
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
          <ProductDetailPartsTable
            parts={product.parts}
            productId={product.id}
          />
          {product.usedInParents.length > 0 ? (
            <div className="info-card">
              <div className="card-heading">
                <h3>This Part Is Used In</h3>
                <Link
                  className="text-action"
                  href={`/?module=edit-product-parts&product=${product.id}`}
                >
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
                          <Link
                            className="table-link"
                            href={`/?module=products&product=${part.parent_product_id}`}
                          >
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
              <Link
                className="text-action"
                href={`/?module=edit-product-boxes&product=${product.id}`}
              >
                Edit
              </Link>
            </div>
            <dl className="detail-list">
              {specRows([
                {
                  label: "Cardboard Spec",
                  names: ["cardboard spec", "cardboard specification"],
                },
                { label: "Foam Density", names: ["foam density"] },
              ]).map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <section className="list-header-panel list-header-panel--compact">
            <span>
              {numberFormatter.format(product.packingBoxes.length)} packing
              boxes
            </span>
            <div className="list-actions">
              <Link
                className="text-action"
                href={`/?module=add-product-box&product=${product.id}`}
              >
                Add Box
              </Link>
              <Link
                className="text-action"
                href={`/?module=edit-product-boxes&product=${product.id}`}
              >
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
                      <td>
                        {box.net_weight === null
                          ? "Not set"
                          : `${numberFormatter.format(box.net_weight)} lb`}
                      </td>
                      <td>
                        {box.gross_weight === null
                          ? "Not set"
                          : `${numberFormatter.format(box.gross_weight)} lb`}
                      </td>
                      <td>
                        {box.inch_volume === null
                          ? "Not set"
                          : numberFormatter.format(box.inch_volume)}
                      </td>
                      <td>
                        {box.cbm === null
                          ? "Not set"
                          : numberFormatter.format(box.cbm)}
                      </td>
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

async function EditProductImagesForm({
  error,
  imageCategory,
  notice,
  productId,
  returnModule,
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
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
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
    { key: "other", label: "Other Images" },
  ];
  const activeCategory = imageCategories.some(
    (category) => category.key === imageCategory,
  )
    ? (imageCategory as ProductImageCategory)
    : "stock";
  const visibleImages = product.images.filter(
    (image) => image.image_category === activeCategory,
  );

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
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {notice ? (
        <div className="form-notice">{decodeURIComponent(notice)}</div>
      ) : null}

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
        {returnToPart ? (
          <input name="return_module" type="hidden" value="product-parts" />
        ) : null}
        <fieldset>
          <legend>Upload Image</legend>
          <div className="form-grid">
            <label>
              Image File
              <input
                accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff"
                name="image_file"
                required
                type="file"
              />
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
              <input
                name="display_name"
                placeholder="Optional image name or short description"
              />
            </label>
            <label className="checkbox-label">
              <input
                disabled={activeCategory !== "stock"}
                name="is_default_thumbnail"
                type="checkbox"
              />
              Set as default thumbnail
            </label>
          </div>
          <p className="fieldset-note">
            Supported image formats include JPG, PNG, WEBP, GIF, BMP, and TIFF.
          </p>
        </fieldset>
        <div className="form-actions">
          <button type="submit">Upload Image</button>
        </div>
      </form>

      <form action={updateProductImagesAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        <input
          name="return_image_category"
          type="hidden"
          value={activeCategory}
        />
        {returnToPart ? (
          <input name="return_module" type="hidden" value="product-parts" />
        ) : null}
        <fieldset>
          <legend>Existing Images</legend>
          {visibleImages.length === 0 ? (
            <p className="fieldset-note">
              No images uploaded in this category yet.
            </p>
          ) : null}
          <div className="image-edit-list">
            {visibleImages.map((image) => (
              <section className="image-edit-panel" key={image.id}>
                <input name="image_ids" type="hidden" value={image.id} />
                <div className="image-edit-preview">
                  <img
                    alt={image.display_name ?? image.original_file_name}
                    src={image.public_url}
                  />
                </div>
                <div className="form-grid image-edit-grid">
                  <label>
                    Image Name / Description
                    <input
                      defaultValue={image.display_name ?? ""}
                      name={`display_name_${image.id}`}
                    />
                  </label>
                  <label>
                    Category
                    <select
                      defaultValue={image.image_category}
                      name={`image_category_${image.id}`}
                    >
                      {imageCategories.map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Sort Order
                    <input
                      defaultValue={image.sort_order}
                      min={0}
                      name={`sort_order_${image.id}`}
                      step={1}
                      type="number"
                    />
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
                    <input
                      name="delete_image_ids"
                      type="checkbox"
                      value={image.id}
                    />
                    Delete image
                  </label>
                  <div className="image-edit-meta">
                    <span>{image.original_file_name}</span>
                    <span>{fileSizeLabel(image.file_size)}</span>
                    <span>{dateLabel(image.uploaded_at.slice(0, 10))}</span>
                    <a
                      className="table-link"
                      href={image.public_url}
                      rel="noreferrer"
                      target="_blank"
                    >
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
          <Link
            className="secondary-action secondary-action--light"
            href={imagesHref}
          >
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
  selectedParts,
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
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
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
  const cancelHref = product
    ? `/?module=products&product=${product.id}&product_tab=parts`
    : "/?module=product-parts";
  const pageTitle =
    activeAction === "add"
      ? "Add Product Part"
      : activeAction === "delete"
        ? "Delete Product Parts"
        : "Edit Product Parts";
  const submitLabel =
    activeAction === "add"
      ? "Save New Part"
      : activeAction === "delete"
        ? "Save Part Deletions"
        : "Save Part Changes";
  const optionLabel = (candidate: (typeof productOptions)[number]) => {
    const brandName = Array.isArray(candidate.brand)
      ? candidate.brand[0]?.name
      : candidate.brand?.name;
    const categoryName = Array.isArray(candidate.product_category)
      ? candidate.product_category[0]?.name
      : candidate.product_category?.name;

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
          <p>
            {product
              ? `${product.sku} / ${product.name}`
              : "Select the parent product, then enter the new part."}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}

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
                sku: candidate.sku,
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
                <input
                  name="new_part_product_name"
                  placeholder="Example: H23107 Glass Shade"
                />
              </label>
              <label>
                Initial Inventory
                <input
                  min={0}
                  name="new_part_initial_inventory"
                  step={1}
                  type="number"
                />
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
                <textarea
                  name="new_notes"
                  placeholder="Optional internal notes"
                  rows={3}
                />
              </label>
              <label className="full-width-field">
                Part Images
                <input
                  accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff"
                  multiple
                  name="new_part_images"
                  type="file"
                />
              </label>
            </div>
            <p className="fieldset-note">
              The system will create this as a new Accessory product SKU, using
              the format PT [ROLE]-[5 random digits], and link it to the parent
              product above. Uploaded images are saved as stock images for the
              new part.
            </p>
          </fieldset>
        ) : null}

        <div className="form-actions">
          {activeAction === "add" ? (
            <button type="submit">{submitLabel}</button>
          ) : null}
          <Link
            className="secondary-action secondary-action--light"
            href={cancelHref}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function AddPartParentProductsForm({
  error,
  partId,
}: {
  error?: string;
  partId?: string;
}) {
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
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=product-parts"
        >
          Back to Parts List
        </Link>
      </section>
    );
  }

  const { data: originalPartLink, error: originalPartLinkError } =
    await supabase
      .from("product_part")
      .select("part_role")
      .eq("component_product_id", part.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

  if (originalPartLinkError) {
    throw new Error(originalPartLinkError.message);
  }

  const existingParentIds = new Set(
    part.usedInParents.map((parent) => parent.parent_product_id),
  );
  const parentCandidates = (candidates ?? []).filter((candidate) => {
    const category = Array.isArray(candidate.product_category)
      ? candidate.product_category[0]
      : candidate.product_category;
    const isAccessory =
      category?.category_code === "accessory" ||
      category?.name?.toLowerCase() === "accessory";

    return (
      candidate.id !== part.id &&
      !isAccessory &&
      !existingParentIds.has(candidate.id)
    );
  });

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={`/?module=product-parts&part=${part.id}&product_tab=parents`}
          >
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

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}

      <form action={addPartParentProductsAction} className="customer-form">
        <input name="part_id" type="hidden" value={part.id} />
        <fieldset>
          <legend>Products to Link</legend>
          <p className="fieldset-note">
            Select one or more regular products that can use this part.
          </p>
          {parentCandidates.length === 0 ? (
            <p className="fieldset-note">
              All available regular products are already linked, or no regular
              products are available.
            </p>
          ) : (
            <PartParentProductPicker
              products={parentCandidates.map((candidate) => ({
                brandName:
                  (Array.isArray(candidate.brand)
                    ? candidate.brand[0]?.name
                    : candidate.brand?.name) ?? "No brand",
                id: candidate.id,
                name: candidate.name,
                sku: candidate.sku,
              }))}
            />
          )}
        </fieldset>

        <fieldset>
          <legend>Link Details</legend>
          <div className="form-grid">
            <label>
              Role
              <select
                name="part_role"
                defaultValue={originalPartLink?.part_role ?? ""}
              >
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
              <textarea
                name="notes"
                placeholder="Optional internal notes for these parent-product links"
                rows={3}
              />
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button disabled={parentCandidates.length === 0} type="submit">
            Add Parent Products
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=product-parts&part=${part.id}&product_tab=parents`}
          >
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
  vendorAction,
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
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
      </section>
    );
  }

  const selectedIds = (selectedVendorProducts ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const action =
    vendorAction === "add" || vendorAction === "delete" ? vendorAction : "edit";
  const selectedVendors = product.vendors.filter((vendor) =>
    selectedIds.includes(vendor.id),
  );
  const cancelHref = `/?module=products&product=${product.id}&product_tab=vendors`;

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={cancelHref}>
            Product Vendors
          </Link>
          <div className="record-title-row">
            <h2>
              {action === "add"
                ? "Add Vendor"
                : action === "delete"
                  ? "Delete Product Vendors"
                  : "Edit Product Vendors"}
            </h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>
      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      <form action={updateProductVendorsAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        <input name="vendor_action" type="hidden" value={action} />
        {selectedIds.map((id) => (
          <input
            key={id}
            name="selected_vendor_product_ids"
            type="hidden"
            value={id}
          />
        ))}
        {action === "add" ? (
          <fieldset>
            <legend>Vendor Product Details</legend>
            <div className="form-grid">
              <label>
                Vendor
                <select name="vendor_id" required>
                  <option value="">Select vendor</option>
                  {(vendors ?? []).map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Vendor Item No.
                <input name="vendor_item_number" required />
              </label>
              <label>
                Vendor Item Name
                <input name="vendor_item_name" />
              </label>
              <label>
                Vendor Price
                <input
                  min={0}
                  name="unit_cost"
                  required
                  step="0.0001"
                  type="number"
                />
              </label>
              <label>
                MOQ
                <input
                  min={0.001}
                  name="minimum_order_quantity"
                  step="0.001"
                  type="number"
                />
              </label>
              <label>
                Lead Time (days)
                <input min={0} name="lead_time_days" step={1} type="number" />
              </label>
            </div>
          </fieldset>
        ) : action === "delete" ? (
          <fieldset>
            <legend>Confirm Deletion</legend>
            <p className="fieldset-note">
              The selected vendor links will be removed from this product.
              Vendor master records are not deleted.
            </p>
            <ul>
              {selectedVendors.map((vendor) => (
                <li key={vendor.id}>{vendor.vendor_name}</li>
              ))}
            </ul>
          </fieldset>
        ) : (
          <fieldset>
            <legend>Selected Vendor Lines</legend>
            {selectedVendors.length === 0 ? (
              <p className="fieldset-note">No vendor lines were selected.</p>
            ) : (
              selectedVendors.map((vendor) => (
                <section className="info-card" key={vendor.id}>
                  <h3>{vendor.vendor_name}</h3>
                  <div className="form-grid">
                    <label>
                      Vendor Item No.
                      <input
                        defaultValue={vendor.vendor_item_number}
                        name={`vendor_item_number_${vendor.id}`}
                        required
                      />
                    </label>
                    <label>
                      Vendor Price
                      <input
                        defaultValue={vendor.unit_cost}
                        min={0}
                        name={`unit_cost_${vendor.id}`}
                        required
                        step="0.0001"
                        type="number"
                      />
                    </label>
                    <label>
                      MOQ
                      <input
                        defaultValue={vendor.minimum_order_quantity ?? ""}
                        min={0.001}
                        name={`minimum_order_quantity_${vendor.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label>
                      Lead Time (days)
                      <input
                        defaultValue={vendor.lead_time_days ?? ""}
                        min={0}
                        name={`lead_time_days_${vendor.id}`}
                        step={1}
                        type="number"
                      />
                    </label>
                  </div>
                </section>
              ))
            )}
          </fieldset>
        )}
        <div className="form-actions">
          <button
            className={action === "delete" ? "danger-action" : undefined}
            disabled={action !== "add" && selectedVendors.length === 0}
            type="submit"
          >
            {action === "add"
              ? "Add Vendor"
              : action === "delete"
                ? "Delete Selected"
                : "Save Vendor Changes"}
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={cancelHref}
          >
            Cancel
          </Link>
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
  styleOptions,
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
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={`/?module=products&product=${product.id}`}
          >
            Product Detail
          </Link>
          <div className="record-title-row">
            <h2>Edit Product Profile</h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}

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
              <select
                defaultValue={product.category_id ?? ""}
                name="product_category_id"
              >
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
              <select
                defaultValue={product.signature_suite_id ?? ""}
                name="signature_suite_id"
              >
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
              <input
                defaultValue={product.collection ?? ""}
                name="collection"
              />
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
              <select
                defaultValue={product.sellability_status}
                name="sellability_status"
              >
                <option value="hidden">Hidden</option>
                <option value="sellable">Sellable</option>
                <option value="blocked">Blocked</option>
                <option value="override_required">Override Required</option>
              </select>
            </label>
            <label>
              Customer Eligibility
              <select
                defaultValue={product.customer_eligibility_tag}
                name="customer_eligibility_tag"
              >
                <option value="all">All</option>
                <option value="ecommerce_only">Ecommerce Only</option>
                <option value="non_ecommerce_only">Non-ecommerce Only</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </label>
            <label>
              Primary Showroom Count
              <select
                defaultValue={
                  product.counts_toward_primary_showroom_default === false
                    ? "no"
                    : "yes"
                }
                name="counts_toward_primary_showroom_default"
              >
                <option value="yes">Included</option>
                <option value="no">Excluded</option>
              </select>
            </label>
            <label className="full-width-field">
              Exclusion Reason
              <input
                defaultValue={product.primary_showroom_exclusion_reason ?? ""}
                name="primary_showroom_exclusion_reason"
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Pricing / Description</legend>
          <div className="form-grid">
            <label>
              Default Price
              <input
                defaultValue={product.default_price ?? ""}
                min="0"
                name="default_price"
                step="0.01"
                type="number"
              />
            </label>
            <label>
              Default Vendor Item No.
              <input
                defaultValue={product.default_vendor_item_number ?? ""}
                name="default_vendor_item_number"
              />
            </label>
            <label className="checkbox-label">
              <input
                defaultChecked={product.no_box_needed}
                name="no_box_needed"
                type="checkbox"
              />
              No box needed
            </label>
            <label className="full-width-field">
              Product Description
              <textarea
                defaultValue={product.description ?? ""}
                maxLength={3500}
                name="description"
                rows={7}
              />
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Save Product Profile</button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=products&product=${product.id}`}
          >
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
  specSection = "dimensions",
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
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  const normalizeSpecName = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const findSpec = (names: string[]) => {
    const wantedNames = new Set(names.map(normalizeSpecName));
    return (
      product.specAttributes.find((spec) =>
        wantedNames.has(normalizeSpecName(spec.attribute_name)),
      ) ?? null
    );
  };
  const fieldGroups: Record<
    string,
    {
      label: string;
      fields: {
        key: string;
        label: string;
        names: string[];
        unit?: string;
        inputType?: "checkbox";
        showUnit?: boolean;
      }[];
    }
  > = {
    dimensions: {
      label: "Dimensions and Weight",
      fields: [
        {
          key: "body_dimension",
          label: "Body Dimension",
          names: ["body dimension", "body dimensions", "body size"],
          unit: "in",
        },
        {
          key: "shade_dimension",
          label: "Shade Dimension",
          names: ["shade dimension", "shade dimensions", "shade size"],
          unit: "in",
        },
        {
          key: "canopy_shape_size",
          label: "Canopy Shape / Size",
          names: [
            "canopy shape / size",
            "canopy shape and size",
            "canopy detail",
            "canopy shape",
            "canopy size",
          ],
          unit: "in",
        },
        {
          key: "net_weight",
          label: "Net Weight",
          names: ["net weight", "product net weight"],
          unit: "lb",
        },
      ],
    },
    electrical: {
      label: "Electrical / Bulbs",
      fields: [
        {
          key: "max_wattage",
          label: "Max Wattage",
          names: ["max wattage", "maximum wattage"],
          unit: "W",
        },
        { key: "voltage", label: "Voltage", names: ["voltage"], unit: "V" },
        {
          key: "socket_type",
          label: "Socket Type",
          names: ["socket type"],
          showUnit: false,
        },
        {
          key: "number_of_bulbs",
          label: "Number of Bulbs",
          names: ["number of bulbs", "bulb count"],
          showUnit: false,
        },
        {
          key: "bulb_type",
          label: "Bulb Type",
          names: ["bulb type", "bulb types"],
          showUnit: false,
        },
        {
          key: "max_bulbs_wattage",
          label: "Max Bulbs Wattage",
          names: [
            "max bulbs wattage",
            "max bulb wattage",
            "maximum bulbs wattage",
            "max bulb voltage",
            "maximum bulb voltage",
          ],
          unit: "W",
        },
        {
          key: "bulbs_included",
          label: "Bulbs Included",
          names: ["bulbs included", "bulb included"],
          inputType: "checkbox",
          showUnit: false,
        },
      ],
    },
    hanging: {
      label: "Hanging / Suspension",
      fields: [
        {
          key: "suspension_system",
          label: "Suspension System",
          names: ["suspension system", "suspension type"],
          showUnit: false,
        },
      ],
    },
    led: {
      label: "Integrated LED",
      fields: [
        {
          key: "integrated_led",
          label: "Integrated LED",
          names: ["integrated led", "integrated led fixture"],
          inputType: "checkbox",
          showUnit: false,
        },
        {
          key: "dimmable",
          label: "Dimmable",
          names: ["dimmable"],
          inputType: "checkbox",
          showUnit: false,
        },
        {
          key: "dimmer_type",
          label: "Dimmer Type",
          names: ["dimmer type"],
          showUnit: false,
        },
        {
          key: "color_temperature",
          label: "Color Temperature",
          names: ["color temperature", "kelvin"],
          unit: "K",
        },
        {
          key: "lumen",
          label: "Lumen",
          names: ["lumen", "lumens"],
          unit: "lm",
        },
      ],
    },
    safety: {
      label: "Safety / Identifiers",
      fields: [
        {
          key: "safety_rating",
          label: "Safety Rating",
          names: ["safety rating", "safety rate", "ul etl"],
        },
        { key: "upc_code", label: "UPC Code", names: ["upc", "upc code"] },
      ],
    },
    packing: {
      label: "Packing Specification",
      fields: [
        {
          key: "cardboard_spec",
          label: "Cardboard Spec",
          names: ["cardboard spec", "cardboard specification"],
          showUnit: false,
        },
        {
          key: "foam_density",
          label: "Foam Density",
          names: ["foam density"],
          showUnit: false,
        },
      ],
    },
  };
  const sectionKey = Object.keys(fieldGroups).includes(specSection)
    ? specSection
    : "dimensions";
  const section = fieldGroups[sectionKey];
  const knownSpecNames = new Set(
    Object.values(fieldGroups).flatMap((group) =>
      group.fields.flatMap((field) => field.names.map(normalizeSpecName)),
    ),
  );
  const otherSpecs = product.specAttributes.filter(
    (spec) => !knownSpecNames.has(normalizeSpecName(spec.attribute_name)),
  );

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={`/?module=products&product=${product.id}&product_tab=specs`}
          >
            Product Specs
          </Link>
          <div className="record-title-row">
            <h2>Edit Product Specs</h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}

      <nav className="tab-nav" aria-label="Spec edit sections">
        {[
          ...Object.entries(fieldGroups).map(([key, group]) => ({
            key,
            label: group.label,
          })),
          { key: "other", label: "Other Specs" },
        ].map((tab) => (
          <Link
            aria-current={
              (specSection === "other" ? "other" : sectionKey) === tab.key
                ? "page"
                : undefined
            }
            href={`/?module=edit-product-specs&product=${product.id}&spec_section=${tab.key}`}
            key={tab.key}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <form action={updateProductSpecsAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        <input
          name="spec_section"
          type="hidden"
          value={specSection === "other" ? "other" : sectionKey}
        />

        {specSection === "other" ? (
          <fieldset>
            <legend>Other Saved Specs</legend>
            {otherSpecs.length === 0 ? (
              <p className="fieldset-note">
                No other specs saved yet. Add custom specs below.
              </p>
            ) : null}
            <div className="form-grid">
              {otherSpecs.map((spec) => (
                <Fragment key={spec.id}>
                  <input
                    name="spec_fields"
                    type="hidden"
                    value={`${spec.id}|${spec.attribute_name}`}
                  />
                  <input
                    name={`spec_id_${spec.id}`}
                    type="hidden"
                    value={spec.id}
                  />
                  <label>
                    {spec.attribute_name}
                    <input
                      defaultValue={spec.attribute_value}
                      name={`spec_value_${spec.id}`}
                    />
                  </label>
                  <label>
                    Unit
                    <input
                      defaultValue={spec.unit ?? ""}
                      name={`spec_unit_${spec.id}`}
                    />
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
                      <input
                        name={`custom_spec_name_${rowNumber}`}
                        placeholder="Example: Backplate Material"
                      />
                    </label>
                    <label>
                      Spec Value
                      <input
                        name={`custom_spec_value_${rowNumber}`}
                        placeholder="Example: Steel"
                      />
                    </label>
                    <label>
                      Unit
                      <input
                        name={`custom_spec_unit_${rowNumber}`}
                        placeholder="Optional"
                      />
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
                    value: existingSpec?.attribute_value ?? "",
                  };
                })}
              />
            ) : (
              <div className="form-grid">
                {section.fields.map((field) => {
                  const existingSpec = findSpec(field.names);
                  const isChecked = ["yes", "true", "included", "1"].includes(
                    (existingSpec?.attribute_value ?? "").toLowerCase(),
                  );

                  return (
                    <Fragment key={field.key}>
                      <input
                        name="spec_fields"
                        type="hidden"
                        value={`${field.key}|${field.label}`}
                      />
                      {existingSpec ? (
                        <input
                          name={`spec_id_${field.key}`}
                          type="hidden"
                          value={existingSpec.id}
                        />
                      ) : null}
                      {field.inputType === "checkbox" ? (
                        <label className="checkbox-label">
                          <input
                            defaultChecked={isChecked}
                            name={`spec_value_${field.key}`}
                            type="checkbox"
                            value="Yes"
                          />
                          {field.label}
                        </label>
                      ) : field.showUnit !== false ? (
                        <label className="full-width-field">
                          {field.label}
                          <span className="spec-input-row">
                            <input
                              defaultValue={existingSpec?.attribute_value ?? ""}
                              name={`spec_value_${field.key}`}
                            />
                            <input
                              aria-label={`${field.label} unit`}
                              defaultValue={
                                existingSpec?.unit ?? field.unit ?? ""
                              }
                              name={`spec_unit_${field.key}`}
                            />
                          </span>
                        </label>
                      ) : field.key === "suspension_system" ? (
                        <label>
                          {field.label}
                          <select
                            defaultValue={existingSpec?.attribute_value ?? ""}
                            name={`spec_value_${field.key}`}
                          >
                            <option value="">Not set</option>
                            <option value="Standard">
                              Standard - installed onto ceiling box
                            </option>
                            <option value="Heavy Duty">
                              Heavy Duty - mounted to building structure
                            </option>
                          </select>
                        </label>
                      ) : (
                        <label>
                          {field.label}
                          <input
                            defaultValue={existingSpec?.attribute_value ?? ""}
                            name={`spec_value_${field.key}`}
                          />
                        </label>
                      )}
                      {field.showUnit === false ? (
                        <input
                          name={`spec_unit_${field.key}`}
                          type="hidden"
                          value=""
                        />
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
                <select
                  defaultValue={product.hangingConfig?.mounting_type ?? ""}
                  name="hanging_mounting_type"
                >
                  <option value="">Not set</option>
                  <option value="Ceiling Mounted / Hardwired">
                    Ceiling Mounted / Hardwired
                  </option>
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
                <input
                  defaultValue={product.hangingConfig?.wire_length ?? ""}
                  name="hanging_wire_length"
                />
              </label>
              <label>
                Chain Length
                <input
                  defaultValue={product.hangingConfig?.chain_length ?? ""}
                  name="hanging_chain_length"
                />
              </label>
              <label>
                Rod Length / Sizes
                <input
                  defaultValue={product.hangingConfig?.rod_length ?? ""}
                  name="hanging_rod_length"
                />
              </label>
              <label>
                Canopy Detail
                <input
                  defaultValue={product.hangingConfig?.canopy_detail ?? ""}
                  name="hanging_canopy_detail"
                />
              </label>
              <label className="full-width-field">
                Hanging Notes
                <textarea
                  defaultValue={product.hangingConfig?.notes ?? ""}
                  name="hanging_notes"
                  rows={4}
                />
              </label>
            </div>
          </fieldset>
        ) : null}

        <div className="form-actions">
          <button type="submit">Save Product Specs</button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=products&product=${product.id}&product_tab=specs`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function EditProductBoxesForm({
  error,
  productId,
}: {
  error?: string;
  productId?: string;
}) {
  const product = productId ? await getProductDetail(productId) : null;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  const normalizePackingSpecName = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const packingSpecValue = (...names: string[]) => {
    const wantedNames = new Set(names.map(normalizePackingSpecName));
    const spec = product.specAttributes.find((item) =>
      wantedNames.has(normalizePackingSpecName(item.attribute_name)),
    );

    return spec?.attribute_value ?? "";
  };

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={`/?module=products&product=${product.id}&product_tab=packing`}
          >
            Packing / Boxes
          </Link>
          <div className="record-title-row">
            <h2>Edit Product Boxes</h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}

      <form action={updateProductBoxesAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />

        <fieldset>
          <legend>Packing Specification</legend>
          <div className="form-grid">
            <label>
              Cardboard Spec
              <input
                defaultValue={packingSpecValue(
                  "cardboard spec",
                  "cardboard specification",
                )}
                name="cardboard_spec"
                placeholder="Example: 150 LBS or 200 LBS"
              />
            </label>
            <label>
              Foam Density
              <input
                defaultValue={packingSpecValue("foam density")}
                name="foam_density"
                placeholder="Example: 8 kg or 12 kg"
              />
            </label>
          </div>
          <p className="fieldset-note">
            These packing standards can be provided to vendors/factories for
            production and packaging requirements.
          </p>
        </fieldset>

        <fieldset>
          <legend>Existing Boxes</legend>
          <div className="box-edit-list">
            {product.packingBoxes.length === 0 ? (
              <p className="fieldset-note">
                No active boxes yet. Use Add Box from the Packing / Boxes page.
              </p>
            ) : (
              product.packingBoxes.map((box) => (
                <section className="box-edit-panel" key={box.id}>
                  <div className="box-edit-header">
                    <div className="box-edit-title-row">
                      <strong>Box {box.box_sequence}</strong>
                      <label className="checkbox-label checkbox-label--box-header">
                        <input
                          defaultChecked={box.is_required_for_sale}
                          name={`is_required_for_sale_${box.id}`}
                          type="checkbox"
                        />
                        Required Box
                      </label>
                    </div>
                    <label className="checkbox-label checkbox-label--compact">
                      <input
                        name="delete_box_ids"
                        type="checkbox"
                        value={box.id}
                      />
                      Delete
                    </label>
                    <input name="box_ids" type="hidden" value={box.id} />
                  </div>
                  <div className="form-grid box-edit-grid">
                    <label className="box-field--label">
                      Label
                      <input
                        defaultValue={box.box_label ?? ""}
                        name={`box_label_${box.id}`}
                      />
                    </label>
                    <label className="box-field--number">
                      L
                      <input
                        defaultValue={box.box_length ?? ""}
                        min={0}
                        name={`box_length_${box.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label className="box-field--number">
                      W
                      <input
                        defaultValue={box.box_width ?? ""}
                        min={0}
                        name={`box_width_${box.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label className="box-field--number">
                      H
                      <input
                        defaultValue={box.box_height ?? ""}
                        min={0}
                        name={`box_height_${box.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label className="box-field--number">
                      Net lb
                      <input
                        defaultValue={box.net_weight ?? ""}
                        min={0}
                        name={`net_weight_${box.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label className="box-field--number">
                      Gross lb
                      <input
                        defaultValue={box.gross_weight ?? ""}
                        min={0}
                        name={`gross_weight_${box.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label className="box-field--notes">
                      Notes
                      <input
                        defaultValue={box.notes ?? ""}
                        name={`notes_${box.id}`}
                      />
                    </label>
                  </div>
                </section>
              ))
            )}
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Save Product Boxes</button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=products&product=${product.id}&product_tab=packing`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

async function AddProductBoxForm({
  error,
  productId,
}: {
  error?: string;
  productId?: string;
}) {
  const product = productId ? await getProductDetail(productId) : null;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  const nextBoxSequence =
    product.packingBoxes.reduce(
      (max, box) => Math.max(max, box.box_sequence),
      0,
    ) + 1;

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={`/?module=products&product=${product.id}&product_tab=packing`}
          >
            Packing / Boxes
          </Link>
          <div className="record-title-row">
            <h2>Add Product Box</h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}

      <form action={addProductBoxAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />

        <fieldset>
          <legend>Box Information</legend>
          <div className="form-grid">
            <label>
              Box No.
              <input
                readOnly
                value={`Box ${nextBoxSequence} - generated by system`}
              />
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
              <input
                min={0}
                name="new_gross_weight"
                step="0.001"
                type="number"
              />
            </label>
            <label className="checkbox-label">
              <input
                defaultChecked
                name="new_is_required_for_sale"
                type="checkbox"
              />
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
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=products&product=${product.id}&product_tab=packing`}
          >
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
  warehouseOptions,
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
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
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
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}

      <form action={updateProductInventoryAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        {returnToPart ? (
          <input name="return_module" type="hidden" value="product-parts" />
        ) : null}

        <fieldset>
          <legend>Top-Level Sellable Quantity</legend>
          <div className="form-grid">
            <label>
              Current Sellable Quantity
              <input
                readOnly
                value={numberFormatter.format(
                  Number(product.sellable_quantity ?? 0),
                )}
              />
            </label>
            <label>
              Set Sellable Quantity
              <input
                min={0}
                name="target_sellable_quantity"
                step={1}
                type="number"
              />
            </label>
          </div>
          <p className="fieldset-note">
            For products with required boxes, this updates each required box
            balance to the same quantity. Product-level inventory is
            recalculated from box balances.
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
                    <td colSpan={8}>
                      No inventory balances found. Use Set Sellable Quantity to
                      create balances for required boxes.
                    </td>
                  </tr>
                ) : (
                  product.inventoryBalances.map((balance) => {
                    const canDeleteBalance =
                      balance.quantity_on_hand === 0 &&
                      balance.quantity_allocated === 0;

                    return (
                      <tr key={balance.id}>
                        <td>
                          {canDeleteBalance ? (
                            <label className="checkbox-label checkbox-label--compact">
                              <input
                                name="delete_balance_ids"
                                type="checkbox"
                                value={balance.id}
                              />
                              Delete
                            </label>
                          ) : (
                            "Locked"
                          )}
                        </td>
                        <td>
                          {balance.box_sequence
                            ? `Box ${balance.box_sequence}${balance.box_label ? ` / ${balance.box_label}` : ""}`
                            : "SKU balance"}
                          <input
                            name="balance_ids"
                            type="hidden"
                            value={balance.id}
                          />
                        </td>
                        <td>
                          {warehouseSelect(
                            `warehouse_id_${balance.id}`,
                            balance.warehouse_id,
                          )}
                        </td>
                        <td>
                          <input
                            defaultValue={balance.location_code}
                            list="inventory-location-codes"
                            name={`location_code_${balance.id}`}
                          />
                        </td>
                        <td>
                          <select
                            defaultValue={balance.inventory_condition}
                            name={`inventory_condition_${balance.id}`}
                          >
                            <option value="regular">Regular</option>
                            <option value="to_be_inspected">
                              To Be Inspected
                            </option>
                            <option value="hold">Hold</option>
                            <option value="damaged">Damaged</option>
                            <option value="demolished_trash">
                              Demolished / Trash
                            </option>
                          </select>
                        </td>
                        <td>
                          <input
                            defaultValue={Math.trunc(balance.quantity_on_hand)}
                            min={0}
                            name={`quantity_on_hand_${balance.id}`}
                            step={1}
                            type="number"
                          />
                        </td>
                        <td>
                          <input
                            defaultValue={Math.trunc(
                              balance.quantity_allocated,
                            )}
                            min={0}
                            name={`quantity_allocated_${balance.id}`}
                            step={1}
                            type="number"
                          />
                        </td>
                        <td>
                          {numberFormatter.format(balance.quantity_available)}
                        </td>
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
              Bin / Location
              <input
                list="inventory-location-codes"
                name="new_location_code"
                placeholder="Leave blank for Unspecified Pick Location"
              />
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
              <input
                min={0}
                name="new_quantity_on_hand"
                step={1}
                type="number"
              />
            </label>
            <label>
              Allocated
              <input
                defaultValue={0}
                min={0}
                name="new_quantity_allocated"
                step={1}
                type="number"
              />
            </label>
          </div>
          <p className="fieldset-note">
            Use this when restocked inventory is stored in an additional
            warehouse/bin location after receiving or putaway. Leave the bin
            blank when the physical location is not yet recorded; the system
            will use the pickable Unspecified Pick Location.
          </p>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Save Inventory / Locations</button>
          <Link
            className="secondary-action secondary-action--light"
            href={inventoryHref}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

export async function ErpRouter({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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
    styleId: params.product_style,
  };
  const requestedProductPage = Math.max(
    1,
    Number(params.product_page ?? 1) || 1,
  );
  const requestedProductPageSize = [10, 25, 50, 100].includes(
    Number(params.product_page_size),
  )
    ? Number(params.product_page_size)
    : 10;
  const customerListMode =
    activeModule === "obsolete-customers" ? "obsolete" : "active";
  const customers = await searchCustomers(query, customerListMode);
  const selectedProductId =
    activeModule === "products" ? params.product : undefined;
  const selectedPartId =
    activeModule === "product-parts" ? params.part : undefined;
  const productListMode =
    activeModule === "discontinued-products" ? "discontinued" : "active";
  const productSearchResult =
    (activeModule === "products" && !selectedProductId) ||
    activeModule === "discontinued-products"
      ? await searchProducts(
          query,
          productFilters,
          requestedProductPage,
          requestedProductPageSize,
          productListMode,
        )
      : { items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 1 };
  const productDetail = selectedProductId
    ? await getProductDetail(selectedProductId)
    : null;
  const partDetail = selectedPartId
    ? await getProductDetail(selectedPartId)
    : null;
  const productPartSearchResult =
    activeModule === "product-parts" && !selectedPartId
      ? await searchProductParts(
          query,
          requestedProductPage,
          requestedProductPageSize,
        )
      : { items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 1 };
  const selectedCustomerId =
    activeModule === "customers" ? params.customer : undefined;
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
    warehouseLocationOptions,
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
    getWarehouseLocationOptions(),
  ]);
  const accountTypes = toLookup(accountTypeOptions);
  const businessTypes = toLookup(businessTypeOptions);
  const dashboard = selectedCustomerId
    ? await getCustomerDashboard(selectedCustomerId)
    : null;
  const moduleLabels: Record<string, string> = {
    admin: "Admin",
    "add-contact": "Add Contact",
    "add-customer": "Add Customer",
    "add-location": "Add Location",
    "add-product-box": "Add Product Box",
    ar: "Payments / AR",
    "create-rga": "Create RGA",
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
    "invoice-create": "Create Invoice",
    "invoice-created": "Invoices Created",
    "invoice-document": "Invoice",
    invoices: "Financial",
    "payment-detail": "Payment",
    orders: "Orders",
    quotes: "Quotes",
    "obsolete-customers": "Obsolete Accounts",
    "new-order": "Enter New Order",
    "product-parts": "Parts",
    products: "Products",
    purchasing: "Purchasing",
    reports: "Reports",
    rga: "RGA",
    "rga-detail": "RGA Review",
    "rga-solution": "RGA Solution",
    "sales-rep-agency": "Sales Rep Agency",
    shipping: "Shipments",
    "view-contact": "Contact",
    "view-location": "Location",
  };
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
              ? {
                  eyebrow: "Product Master",
                  title: "Product Search / Product List",
                }
              : activeModule === "customers" ||
                  activeModule === "obsolete-customers"
                ? {
                    eyebrow: "Customer Master",
                    title: "Customer Search / Account Dashboard",
                  }
                : {
                    eyebrow: "Lighting ERP",
                    title: moduleLabels[activeModule] ?? label(activeModule),
                  };

  const openOrders =
    dashboard?.orders.filter(
      (order) => order.status !== "closed" && order.status !== "deleted",
    ) ?? [];
  const ordersLast30DaysTotal = dashboard?.ordersLast30DaysTotal ?? 0;
  const openInvoiceCount =
    dashboard?.invoices.filter((invoice) => invoice.invoice_status !== "void")
      .length ?? 0;
  const today = new Date().toISOString().slice(0, 10);
  const overdueInvoiceCount =
    dashboard?.invoices.filter(
      (invoice) =>
        invoice.invoice_status !== "void" &&
        Number(invoice.balance_due ?? 0) > 0 &&
        Boolean(invoice.due_date) &&
        invoice.due_date! < today,
    ).length ?? 0;
  const openBalance =
    dashboard?.invoices.reduce(
      (sum, invoice) => sum + Number(invoice.balance_due ?? 0),
      0,
    ) ?? 0;
  const uninvoicedPackingLists =
    dashboard?.packingLists.filter(
      (packingList) =>
        packingList.invoice_generation_status_snapshot === "not_invoiced",
    ).length ?? 0;
  const packingInvoiceStatusFilter =
    params.packing_invoice_status === "not_invoiced"
      ? "not_invoiced"
      : undefined;
  const packingListFreightEditId = params.packing_freight_edit;
  const visiblePackingLists =
    dashboard?.packingLists.filter(
      (packingList) =>
        !packingInvoiceStatusFilter ||
        packingList.invoice_generation_status_snapshot ===
          packingInvoiceStatusFilter,
    ) ?? [];
  const primaryShowroomLocationIds = new Set(
    dashboard?.primaryShowrooms.map(
      (showroom) => showroom.customer_location_id,
    ) ?? [],
  );
  const customerDashboardTabs = [
    { key: "overview", label: "Overview" },
    { key: "locations", label: "Locations" },
    { key: "contacts", label: "Contacts" },
    { key: "sales-rep", label: "Sales Rep" },
    { key: "freight", label: "Freight" },
    { key: "orders", label: "Orders / Quotes" },
    { key: "shipments", label: "Shipments" },
    { key: "invoices", label: "Invoices" },
    { key: "credit-memo", label: "Credit Memo" },
    { key: "rga", label: "RGA" },
    { key: "attachments", label: "Attachments" },
    { key: "performance", label: "Performance" },
  ];
  const selectedCustomerTab = customerDashboardTabs.some(
    (tab) => tab.key === params.tab,
  )
    ? params.tab
    : "overview";
  const customerOrderSearch = (params.order_q ?? "").trim().toLowerCase();
  const customerOrderListMode =
    params.order_mode === "quotes" || params.order_mode === "display"
      ? params.order_mode
      : "orders";
  const customerQuoteMode = customerOrderListMode === "quotes";
  const customerDisplayMode = customerOrderListMode === "display";
  const customerOrderSort =
    params.order_sort === "status" || params.order_sort === "created_at"
      ? params.order_sort
      : undefined;
  const customerOrderSortDirection =
    customerOrderSort === "created_at"
      ? params.order_dir === "asc"
        ? "asc"
        : "desc"
      : params.order_dir === "desc"
        ? "desc"
        : "asc";
  const customerOrderPageSize = [10, 20, 30].includes(
    Number(params.order_page_size),
  )
    ? Number(params.order_page_size)
    : 10;
  const customerOrderPage = Math.max(1, Number(params.order_page ?? 1) || 1);
  const customerOrderStatusRank = (status: string | null | undefined) => {
    switch (status) {
      case "open":
        return 0;
      case "pending":
        return 1;
      case "hold":
        return 2;
      case "partially_shipped":
        return 3;
      case "closed":
        return 4;
      case "void":
        return 5;
      case "deleted":
        return 6;
      default:
        return 7;
    }
  };
  const customerOrders =
    dashboard?.orders
      .filter((order) => {
        if (customerQuoteMode && order.order_type !== "quote") return false;
        if (customerDisplayMode && order.order_type !== "display") return false;
        if (
          !customerQuoteMode &&
          !customerDisplayMode &&
          (order.order_type === "quote" || order.order_type === "display")
        )
          return false;
        if (!customerOrderSearch) return true;
        return [
          order.sales_order_number,
          order.customer_po_number,
          order.order_source,
          order.order_type,
          order.status,
          ...(dashboard?.orderSearchSkus?.[order.id] ?? []),
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(customerOrderSearch),
          );
      })
      .sort((left, right) => {
        const statusDifference =
          customerOrderStatusRank(left.status) -
          customerOrderStatusRank(right.status);
        const shouldSortByStatus = customerOrderSort === "status";

        if (shouldSortByStatus && statusDifference !== 0) {
          return customerOrderSortDirection === "desc"
            ? -statusDifference
            : statusDifference;
        }

        const dateDifference = String(left.created_at ?? "").localeCompare(
          String(right.created_at ?? ""),
        );
        return customerOrderSort === "created_at" &&
          customerOrderSortDirection === "asc"
          ? dateDifference
          : -dateDifference;
      }) ?? [];
  const customerOrderTotalPages = Math.max(
    1,
    Math.ceil(customerOrders.length / customerOrderPageSize),
  );
  const customerOrderCurrentPage = Math.min(
    customerOrderTotalPages,
    customerOrderPage,
  );
  const customerOrderPageRows = customerOrders.slice(
    (customerOrderCurrentPage - 1) * customerOrderPageSize,
    customerOrderCurrentPage * customerOrderPageSize,
  );
  const customerOrderAmount = customerOrders.reduce(
    (sum, order) => sum + Number(order.total_amount ?? 0),
    0,
  );
  const customerOrderPageHref = (page: number) =>
    `/?customer=${dashboard?.customer.id ?? ""}&tab=orders${customerOrderListMode !== "orders" ? `&order_mode=${customerOrderListMode}` : ""}&order_page=${page}&order_page_size=${customerOrderPageSize}${customerOrderSearch ? `&order_q=${encodeURIComponent(customerOrderSearch)}` : ""}${customerOrderSort ? `&order_sort=${customerOrderSort}&order_dir=${customerOrderSortDirection}` : ""}`;
  const customerOrderStatusSortHref = `/?customer=${dashboard?.customer.id ?? ""}&tab=orders${customerOrderListMode !== "orders" ? `&order_mode=${customerOrderListMode}` : ""}&order_page=1&order_page_size=${customerOrderPageSize}${customerOrderSearch ? `&order_q=${encodeURIComponent(customerOrderSearch)}` : ""}&order_sort=status&order_dir=${customerOrderSort === "status" && customerOrderSortDirection === "asc" ? "desc" : "asc"}`;
  const customerOrderDateSortHref = `/?customer=${dashboard?.customer.id ?? ""}&tab=orders${customerOrderListMode !== "orders" ? `&order_mode=${customerOrderListMode}` : ""}&order_page=1&order_page_size=${customerOrderPageSize}${customerOrderSearch ? `&order_q=${encodeURIComponent(customerOrderSearch)}` : ""}&order_sort=created_at&order_dir=${customerOrderSort === "created_at" && customerOrderSortDirection === "desc" ? "asc" : "desc"}`;
  const customerInvoiceSearch = (params.invoice_q ?? "").trim().toLowerCase();
  const customerInvoiceAdvanced = params.invoice_advanced === "1";
  const customerInvoiceDateFrom = params.invoice_date_from ?? "";
  const customerInvoiceDateTo = params.invoice_date_to ?? "";
  const customerInvoiceStatus = ["unpaid", "partially_paid", "paid"].includes(
    params.invoice_status ?? "",
  )
    ? (params.invoice_status ?? "")
    : "";
  const customerInvoiceSkus = (params.invoice_skus ?? "")
    .split(",")
    .map((sku) => sku.trim().toLowerCase())
    .filter(Boolean);
  const customerInvoicePageSize = [10, 20, 30, 50, 100].includes(
    Number(params.invoice_page_size),
  )
    ? Number(params.invoice_page_size)
    : 10;
  const customerInvoices = (dashboard?.invoices ?? []).filter((invoice) => {
    if (
      customerInvoiceDateFrom &&
      invoice.invoice_date < customerInvoiceDateFrom
    )
      return false;
    if (customerInvoiceDateTo && invoice.invoice_date > customerInvoiceDateTo)
      return false;
    if (
      customerInvoiceStatus &&
      invoice.payment_status !== customerInvoiceStatus
    )
      return false;
    if (customerInvoiceSkus.length) {
      const invoiceSkus = dashboard?.invoiceSearchSkus?.[invoice.id] ?? [];
      if (
        !customerInvoiceSkus.some((requestedSku) =>
          invoiceSkus.some((invoiceSku) =>
            invoiceSku.toLowerCase().includes(requestedSku),
          ),
        )
      ) {
        return false;
      }
    }
    if (!customerInvoiceSearch) return true;
    return [
      invoice.invoice_number,
      invoice.brand_name_snapshot,
      invoice.invoice_status,
      invoice.payment_status,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(customerInvoiceSearch),
      );
  });
  const customerInvoiceTotalPages = Math.max(
    1,
    Math.ceil(customerInvoices.length / customerInvoicePageSize),
  );
  const customerInvoiceRequestedPage = Math.max(
    1,
    Number(params.invoice_page ?? 1) || 1,
  );
  const customerInvoiceCurrentPage = Math.min(
    customerInvoiceTotalPages,
    customerInvoiceRequestedPage,
  );
  const customerInvoicePageRows = customerInvoices.slice(
    (customerInvoiceCurrentPage - 1) * customerInvoicePageSize,
    customerInvoiceCurrentPage * customerInvoicePageSize,
  );
  const paidCustomerInvoices = customerInvoices.filter(
    (invoice) => invoice.payment_status === "paid",
  );
  const openCustomerInvoices = customerInvoices.filter(
    (invoice) =>
      invoice.invoice_status !== "void" && Number(invoice.balance_due) > 0,
  );
  const paidCustomerInvoiceAmount = paidCustomerInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.total_amount ?? 0),
    0,
  );
  const openCustomerInvoiceAmount = openCustomerInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.balance_due ?? 0),
    0,
  );
  const customerInvoicePageHref = (page: number) =>
    `/?customer=${dashboard?.customer.id ?? ""}&tab=invoices&invoice_page=${page}&invoice_page_size=${customerInvoicePageSize}${customerInvoiceSearch ? `&invoice_q=${encodeURIComponent(customerInvoiceSearch)}` : ""}${customerInvoiceAdvanced ? "&invoice_advanced=1" : ""}${customerInvoiceDateFrom ? `&invoice_date_from=${encodeURIComponent(customerInvoiceDateFrom)}` : ""}${customerInvoiceDateTo ? `&invoice_date_to=${encodeURIComponent(customerInvoiceDateTo)}` : ""}${customerInvoiceStatus ? `&invoice_status=${encodeURIComponent(customerInvoiceStatus)}` : ""}${params.invoice_skus ? `&invoice_skus=${encodeURIComponent(params.invoice_skus)}` : ""}`;
  const customerTabHref = (tabKey: string) => {
    const search = new URLSearchParams({
      customer: dashboard?.customer.id ?? "",
      tab: tabKey,
    });

    if (tabKey === "orders") {
      search.set("order_mode", "orders");
    }

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

        <ModuleNav
          activeModule={activeModule}
          productBrands={productBrandOptions}
        />
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
            saveAction={createCustomerAction}
            territoryOptions={territoryOptions}
          />
        ) : activeModule === "edit-account-profile" ? (
          <EditAccountProfileForm
            accountTypeOptions={accountTypeOptions}
            businessTypeOptions={businessTypeOptions}
            customerId={params.customer}
            error={params.error}
            loadCustomerDashboard={getCustomerDashboard}
            saveAction={updateAccountProfileAction}
          />
        ) : activeModule === "edit-billing-credit" ? (
          <EditBillingCreditForm
            customerId={params.customer}
            error={params.error}
            loadCustomerDashboard={getCustomerDashboard}
            saveAction={updateBillingCreditAction}
          />
        ) : activeModule === "add-contact" ? (
          <AddContactForm
            customerId={params.customer}
            error={params.error}
            loadCustomer={getCustomerName}
            loadLocations={getContactLocationOptions}
            saveAction={addContactAction}
          />
        ) : activeModule === "add-location" ? (
          <AddLocationForm
            customerId={params.customer}
            error={params.error}
            loadCustomer={getCustomerName}
            saveAction={addLocationAction}
          />
        ) : activeModule === "view-contact" ? (
          <ContactInfoPage
            contactId={params.contact}
            customerId={params.customer}
            loadContact={getContactForEdit}
            loadCustomer={getCustomerName}
            loadLocations={getContactLocationOptions}
          />
        ) : activeModule === "edit-contact" ? (
          <EditContactForm
            contactId={params.contact}
            customerId={params.customer}
            error={params.error}
            loadContact={getContactForEdit}
            loadCustomer={getCustomerName}
            loadLocations={getContactLocationOptions}
            saveAction={updateContactAction}
          />
        ) : activeModule === "view-location" ? (
          <LocationInfoPage
            customerId={params.customer}
            loadCustomer={getCustomerName}
            loadLocationDashboard={getLocationDashboard}
            locationId={params.location}
          />
        ) : activeModule === "edit-location" ? (
          <EditLocationForm
            customerId={params.customer}
            error={params.error}
            loadCustomer={getCustomerName}
            loadLocation={getLocationForEdit}
            locationId={params.location}
            saveAction={updateLocationAction}
          />
        ) : activeModule === "edit-freight" ? (
          <EditFreightForm
            customerId={params.customer}
            error={params.error}
            loadCustomer={getCustomerName}
            loadFreightPolicy={getDefaultFreightPolicy}
            saveAction={updateFreightPolicyAction}
          />
        ) : activeModule === "sales-rep-agency" ? (
          <SalesRepAgencyPage agencyId={params.agency} />
        ) : activeModule === "new-order" ? (
          <NewOrderPage
            customerId={params.customer}
            error={params.error}
            locationId={params.location}
          />
        ) : activeModule === "create-rga" ? (
          <CreateRgaPage error={params.error} orderId={params.order} />
        ) : activeModule === "rga" ? (
          <RgaDashboardPage
            error={params.error}
            notice={params.notice}
            rgaOrder={params.rga_order}
            rgaTab={params.rga_tab}
          />
        ) : activeModule === "rga-detail" ? (
          <RgaDetailPage
            error={params.error}
            notice={params.notice}
            rgaId={params.rga}
          />
        ) : activeModule === "rga-solution" ? (
          <RgaSolutionPage
            error={params.error}
            notice={params.notice}
            rgaId={params.rga}
          />
        ) : selectedPartId ? (
          <PartDetailDashboard
            part={partDetail}
            selectedTab={params.product_tab ?? "profile"}
          />
        ) : selectedProductId ? (
          <ProductDetailDashboard
            product={productDetail}
            selectedTab={params.product_tab ?? "profile"}
          />
        ) : activeModule === "edit-product-profile" ? (
          <EditProductProfileForm
            brandOptions={productBrandOptions}
            categoryOptions={productCategoryOptions}
            error={params.error}
            productId={params.product}
            styleOptions={productStyleOptions}
          />
        ) : activeModule === "edit-product-specs" ? (
          <EditProductSpecsForm
            error={params.error}
            productId={params.product}
            specSection={params.spec_section ?? "dimensions"}
          />
        ) : activeModule === "edit-product-boxes" ? (
          <EditProductBoxesForm
            error={params.error}
            productId={params.product}
          />
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
          <AddPartParentProductsForm
            error={params.error}
            partId={params.part}
          />
        ) : activeModule.startsWith("edit-product-") ? (
          <ProductEditPlaceholder
            moduleName={moduleLabels[activeModule] ?? label(activeModule)}
            productId={params.product}
          />
        ) : activeModule === "products" ||
          activeModule === "discontinued-products" ? (
          <ProductListOverview
            brandOptions={productBrandOptions}
            categoryOptions={productCategoryOptions}
            deleteAction={deleteProductsAction}
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
        ) : activeModule === "quote-document" ? (
          <QuoteDocumentPage quoteId={params.quote} />
        ) : activeModule === "shipment-create" ? (
          <ShipmentCreatePage
            error={params.error}
            notice={params.notice}
            orderId={params.order}
            shipmentId={params.shipment}
            shipmentEdit={params.shipment_edit}
          />
        ) : activeModule === "shipment-detail" ? (
          <ShipmentResultPage
            notice={params.notice}
            returnCustomerId={params.return_customer}
            shipmentId={params.shipment}
          />
        ) : activeModule === "packing-list-document" ? (
          <PackingListDocumentPage packingListId={params.packing_list} />
        ) : activeModule === "shipping-preparation-packing-list" ? (
          <ShippingPreparationPackingListPage
            packingListId={params.preparation_packing_list}
          />
        ) : activeModule === "shipping" ? (
          <ShippingDashboardPage
            error={params.error}
            notice={params.notice}
            shippingTab={params.shipping_tab}
          />
        ) : activeModule === "invoice-create" ? (
          <InvoiceCreatePage
            error={params.error}
            loadPackingLists={getInvoiceQueuePackingLists}
            packingListId={params.packing_list}
            saveAction={prepareInvoiceConfirmationAction}
          />
        ) : activeModule === "invoice-confirm" ? (
          <InvoiceConfirmationPage
            customerFreightCharge={params.invoice_customer_freight}
            dropshipAllocations={params.invoice_dropship_allocations}
            freightAllocations={params.invoice_freight_allocations}
            invoiceDate={params.invoice_date}
            invoiceDueDate={invoiceDueDate}
            loadPackingLists={getInvoiceQueuePackingLists}
            packingListId={params.packing_list}
            parseInvoiceAllocations={parseInvoiceAllocations}
            paymentDays={params.invoice_payment_days}
            paymentTerms={params.invoice_payment_terms}
            saveAction={createInvoicesFromPackingListAction}
            taxAllocations={params.invoice_tax_allocations}
          />
        ) : activeModule === "invoice-created" ? (
          <InvoiceCreatedPage
            invoiceIds={params.invoice_ids}
            loadInvoices={getCreatedInvoices}
          />
        ) : activeModule === "invoice-document" ? (
          <InvoiceDocumentPage
            invoiceId={params.invoice}
            loadInvoiceDocument={getInvoiceDocument}
          />
        ) : activeModule === "payment-detail" ? (
          <PaymentDetailPage
            loadPaymentDetail={getPaymentDetail}
            paymentId={params.payment}
          />
        ) : activeModule === "invoices" ? (
          <InvoiceQueuePage
            error={params.error}
            financialTab={params.financial_tab}
            financialFilters={{
              page: params.financial_page,
              pageSize: params.financial_page_size,
              query: params.financial_q,
              advanced: params.financial_advanced,
              dateFrom: params.financial_date_from,
              dateTo: params.financial_date_to,
              status: params.financial_status,
              customer: params.financial_customer,
              skus: params.financial_skus,
            }}
            notice={params.notice}
          />
        ) : activeModule === "ar" ? (
          <PaymentEntryPage
            error={params.error}
            invoiceId={params.invoice}
            loadPaymentEntry={getPaymentEntry}
            notice={params.notice}
            saveAction={recordInvoicePaymentAction}
          />
        ) : activeModule === "orders" || activeModule === "quotes" ? (
          <OrdersOverview
            error={params.error}
            notice={params.notice}
            orderAction={params.order_action}
            orderAdvanced={params.order_advanced}
            orderCustomer={params.order_customer}
            orderCustomerName={params.order_customer_name}
            orderDateFrom={params.order_date_from}
            orderDateTo={params.order_date_to}
            orderDir={params.order_dir}
            orderId={params.order}
            orderPage={params.order_page}
            orderPageSize={params.order_page_size}
            orderQuery={params.order_q}
            orderReady={params.order_ready}
            orderRep={params.order_rep}
            orderSku={params.order_sku}
            orderSort={params.order_sort}
            orderStatus={params.order_status}
            orderTerritory={params.order_territory}
            quoteMode={activeModule === "quotes"}
            returnCustomerId={params.return_customer}
          />
        ) : activeModule !== "customers" &&
          activeModule !== "obsolete-customers" ? (
          <ModulePlaceholder
            moduleName={moduleLabels[activeModule] ?? label(activeModule)}
          />
        ) : (
          <section className="customer-layout">
            {!dashboard ? (
              <CustomerListOverview
                accountTypes={accountTypes}
                businessTypes={businessTypes}
                customers={customers}
                deleteAction={deleteCustomersAction}
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
                      <StatusBadge
                        tone={
                          dashboard.customer.status === "active"
                            ? "good"
                            : "warn"
                        }
                        value={dashboard.customer.status}
                      />
                    </div>
                    <Link
                      className="text-action"
                      href={query ? `/?q=${encodeURIComponent(query)}` : "/"}
                    >
                      Back to Customer List
                    </Link>
                  </div>
                  <div className="account-header-side">
                    <div className="account-numbers">
                      <span>
                        Account No. {dashboard.customer.account_number}
                      </span>
                      {dashboard.customer.legacy_account_id ? (
                        <span className="legacy-account-number">
                          Legacy Account No.{" "}
                          {dashboard.customer.legacy_account_id}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section className="metric-grid">
                  <div className="metric">
                    <span>Open / Ready to Ship Orders</span>
                    <div className="metric-value-links">
                      <Link
                        className="metric-link"
                        href={`/?module=orders&order_status=open&order_customer=${dashboard.customer.id}`}
                      >
                        <strong>
                          {numberFormatter.format(openOrders.length)}
                        </strong>
                      </Link>
                      <span aria-hidden="true"> / </span>
                      <Link
                        className="metric-link"
                        href={`/?module=orders&order_status=open&order_customer=${dashboard.customer.id}&order_ready=true`}
                      >
                        <strong>
                          {numberFormatter.format(
                            dashboard.readyToShipOrderCount,
                          )}
                        </strong>
                      </Link>
                    </div>
                  </div>
                  <Metric
                    labelText="Order Total of Last 30 Days"
                    value={money(ordersLast30DaysTotal)}
                  />
                  <Metric
                    labelText="Overdue / Open Invoices"
                    value={`${numberFormatter.format(overdueInvoiceCount)} / ${numberFormatter.format(openInvoiceCount)}`}
                  />
                  <Metric labelText="Open Balance" value={money(openBalance)} />
                  <div className="metric">
                    <span>Un-invoiced Packing Lists</span>
                    <Link
                      className="metric-link"
                      href={`/?customer=${dashboard.customer.id}&tab=shipments&packing_invoice_status=not_invoiced`}
                    >
                      <strong>
                        {numberFormatter.format(uninvoicedPackingLists)}
                      </strong>
                    </Link>
                  </div>
                </section>

                <section
                  className="tab-strip"
                  aria-label="Customer dashboard sections"
                >
                  {customerDashboardTabs.map((tab) => (
                    <Link
                      aria-current={
                        selectedCustomerTab === tab.key ? "page" : undefined
                      }
                      href={customerTabHref(tab.key)}
                      key={tab.key}
                    >
                      {tab.label}
                    </Link>
                  ))}
                </section>

                <section className="section-stack">
                  <article
                    className={
                      selectedCustomerTab === "overview"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="overview"
                  >
                    <div className="section-title">
                      <h3>Overview</h3>
                    </div>
                    <section className="detail-grid detail-grid--inside">
                      <article className="info-panel">
                        <div className="panel-title-row">
                          <h3>Account Profile</h3>
                          <Link
                            className="text-action"
                            href={`/?module=edit-account-profile&customer=${dashboard.customer.id}`}
                          >
                            Edit
                          </Link>
                        </div>
                        <dl>
                          <div>
                            <dt>Account Type</dt>
                            <dd>
                              {accountTypes[
                                dashboard.customer.account_type_id
                              ] ?? "Not set"}
                            </dd>
                          </div>
                          <div>
                            <dt>Business Type</dt>
                            <dd>
                              {businessTypes[
                                dashboard.customer.business_type_id
                              ] ?? "Not set"}
                            </dd>
                          </div>
                          <div>
                            <dt>Default Discount</dt>
                            <dd>
                              {dashboard.customer.default_discount_percent}%
                            </dd>
                          </div>
                          <div>
                            <dt>Sales Tax</dt>
                            <dd>
                              {dashboard.customer.is_sales_tax_exempt
                                ? "Exempt"
                                : "Taxable"}
                            </dd>
                          </div>
                        </dl>
                      </article>

                      <article className="info-panel">
                        <div className="panel-title-row">
                          <h3>Billing / Credit</h3>
                          <Link
                            className="text-action"
                            href={`/?module=edit-billing-credit&customer=${dashboard.customer.id}`}
                          >
                            Edit
                          </Link>
                        </div>
                        <dl>
                          <div>
                            <dt>Payment Terms</dt>
                            <dd>
                              {dashboard.billing?.payment_terms ?? "Not set"}
                            </dd>
                          </div>
                          <div>
                            <dt>Credit Limit</dt>
                            <dd>
                              {dashboard.billing?.credit_limit
                                ? money(dashboard.billing.credit_limit)
                                : "System default"}
                            </dd>
                          </div>
                          <div>
                            <dt>Limit Source</dt>
                            <dd>
                              {label(dashboard.billing?.credit_limit_source)}
                            </dd>
                          </div>
                          <div>
                            <dt>Invoice Email</dt>
                            <dd>
                              {dashboard.billing?.default_statement_email ??
                                dashboard.customer.billing_email ??
                                "Not set"}
                            </dd>
                          </div>
                        </dl>
                      </article>
                    </section>
                  </article>

                  <article
                    className={
                      selectedCustomerTab === "locations"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="locations"
                  >
                    <div className="section-title">
                      <h3>Locations</h3>
                      <div className="section-actions">
                        <span>{dashboard.locations.length}</span>
                        <Link
                          className="small-action"
                          href={`/?module=add-location&customer=${dashboard.customer.id}`}
                        >
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
                              {[
                                location.city,
                                location.state_province,
                                location.country_code,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                          <div className="badge-row">
                            {location.is_default_ship_to ? (
                              <StatusBadge
                                tone="good"
                                value="Default Ship-to"
                              />
                            ) : null}
                            {primaryShowroomLocationIds.has(location.id) ? (
                              <StatusBadge
                                tone="primary"
                                value="Primary Showroom"
                              />
                            ) : null}
                            {location.is_shipping_address ? (
                              <StatusBadge value="Shipping Address" />
                            ) : null}
                            {location.is_billing_address ? (
                              <StatusBadge value="Billing Address" />
                            ) : null}
                            {location.is_showroom ? (
                              <StatusBadge value="Showroom" />
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article
                    className={
                      selectedCustomerTab === "contacts"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="contacts"
                  >
                    <div className="section-title">
                      <h3>Contacts</h3>
                      <div className="section-actions">
                        <span>{dashboard.contacts.length}</span>
                        <Link
                          className="small-action"
                          href={`/?module=add-contact&customer=${dashboard.customer.id}`}
                        >
                          Add Contact
                        </Link>
                      </div>
                    </div>
                    <div className="compact-list">
                      {dashboard.contacts.length === 0 ? (
                        <EmptyState text="No contacts on this account yet." />
                      ) : null}
                      {dashboard.contacts.map((contact) => (
                        <div className="compact-row" key={contact.id}>
                          <div>
                            <Link
                              className="record-link"
                              href={`/?module=view-contact&customer=${dashboard.customer.id}&contact=${contact.id}`}
                            >
                              {contact.name}
                            </Link>
                            <span>
                              {[contact.title, contact.department]
                                .filter(Boolean)
                                .join(" / ") || "Contact"}
                            </span>
                          </div>
                          <span>{contact.email ?? "No email"}</span>
                          <div className="badge-row">
                            {contact.is_purchasing_contact ? (
                              <StatusBadge value="Purchasing" />
                            ) : null}
                            {contact.is_billing_contact ? (
                              <StatusBadge value="Billing" />
                            ) : null}
                            {contact.is_warehouse_receiver ? (
                              <StatusBadge value="Warehouse Receiver" />
                            ) : null}
                            {contact.is_showroom_floor_sales ? (
                              <StatusBadge value="Showroom Floor Sales" />
                            ) : null}
                            {contact.is_showroom_manager ? (
                              <StatusBadge value="Showroom Manager" />
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article
                    className={
                      selectedCustomerTab === "sales-rep"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="sales-rep"
                  >
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
                          <span>
                            {assignment.sales_rep_name ??
                              "No individual rep assigned"}
                          </span>
                          <div className="badge-row">
                            {assignment.territory_name ? (
                              <StatusBadge value={assignment.territory_name} />
                            ) : null}
                            <StatusBadge value={assignment.coverage_role} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article
                    className={
                      selectedCustomerTab === "orders"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="orders"
                  >
                    <div className="section-title order-section-title">
                      <div className="order-actions-row">
                        <Link
                          className="primary-action"
                          href={`/?module=new-order&customer=${dashboard.customer.id}`}
                        >
                          Enter New Order / Quote
                        </Link>
                        <Link
                          className={
                            customerOrderListMode === "orders"
                              ? "text-action text-action--active"
                              : "text-action"
                          }
                          href={`/?customer=${dashboard.customer.id}&tab=orders`}
                        >
                          Order List
                        </Link>
                        <Link
                          className={
                            customerQuoteMode
                              ? "text-action text-action--active"
                              : "text-action"
                          }
                          href={`/?customer=${dashboard.customer.id}&tab=orders&order_mode=quotes`}
                        >
                          Quote List
                        </Link>
                        <Link
                          className={
                            customerDisplayMode
                              ? "text-action text-action--active"
                              : "text-action"
                          }
                          href={`/?customer=${dashboard.customer.id}&tab=orders&order_mode=display`}
                        >
                          Display Orders
                        </Link>
                        <CustomerOrderControls
                          customerId={dashboard.customer.id}
                          mode={customerOrderListMode}
                          pageSize={customerOrderPageSize}
                          search={params.order_q ?? ""}
                          sort={customerOrderSort}
                          direction={customerOrderSortDirection}
                        />
                      </div>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>
                              {customerQuoteMode ? "Quote No." : "SO No."}
                            </th>
                            <th>Customer PO</th>
                            <th>
                              <Link
                                className="table-link"
                                href={customerOrderDateSortHref}
                              >
                                Date / Time{" "}
                                {customerOrderSort === "created_at"
                                  ? customerOrderSortDirection === "desc"
                                    ? "↓"
                                    : "↑"
                                  : "↓"}
                              </Link>
                            </th>
                            <th>Source</th>
                            <th>Type</th>
                            <th>
                              {customerQuoteMode
                                ? "Converted PO"
                                : "Shipping Status"}
                            </th>
                            <th>
                              <Link
                                className="table-link"
                                href={customerOrderStatusSortHref}
                              >
                                Order Status{" "}
                                {customerOrderSort === "status"
                                  ? customerOrderSortDirection === "asc"
                                    ? "↑"
                                    : "↓"
                                  : "↕"}
                              </Link>
                            </th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerOrderPageRows.map((order) => (
                            <tr key={order.id}>
                              <td>
                                <Link
                                  className="table-link"
                                  href={`/?module=orders&order=${order.id}`}
                                >
                                  {order.sales_order_number}
                                </Link>
                              </td>
                              <td>{order.customer_po_number}</td>
                              <td>{timestampLabel(order.created_at)}</td>
                              <td>{label(order.order_source)}</td>
                              <td>{label(order.order_type)}</td>
                              <td>
                                {customerQuoteMode ? (
                                  order.converted_order ? (
                                    <Link
                                      className="table-link"
                                      href={`/?module=orders&order=${order.converted_order.id}`}
                                    >
                                      {order.converted_order.sales_order_number}
                                    </Link>
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  <StatusBadge
                                    {...shippingStatus(
                                      order.shipping_quantity,
                                      order.shipping_in_progress,
                                    )}
                                  />
                                )}
                              </td>
                              <td>
                                <StatusBadge
                                  {...orderLifecycleStatus(order.status)}
                                />
                              </td>
                              <td>{money(order.total_amount)}</td>
                            </tr>
                          ))}
                          {customerOrderPageRows.length === 0 ? (
                            <tr>
                              <td colSpan={8}>
                                <EmptyState text="No matching orders found." />
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                    {customerOrderTotalPages > 1 ? (
                      <nav
                        className="pagination"
                        aria-label="Customer order pages"
                      >
                        <Link
                          className="secondary-action"
                          href={customerOrderPageHref(1)}
                        >
                          First
                        </Link>
                        <Link
                          className="secondary-action"
                          href={customerOrderPageHref(
                            Math.max(1, customerOrderCurrentPage - 1),
                          )}
                        >
                          Previous
                        </Link>
                        {Array.from(
                          { length: customerOrderTotalPages },
                          (_, index) => index + 1,
                        ).map((page) => (
                          <Link
                            aria-current={
                              page === customerOrderCurrentPage
                                ? "page"
                                : undefined
                            }
                            className={
                              page === customerOrderCurrentPage
                                ? "pagination-link pagination-link--active"
                                : "pagination-link"
                            }
                            href={customerOrderPageHref(page)}
                            key={page}
                          >
                            {page}
                          </Link>
                        ))}
                        <Link
                          className="secondary-action"
                          href={customerOrderPageHref(
                            Math.min(
                              customerOrderTotalPages,
                              customerOrderCurrentPage + 1,
                            ),
                          )}
                        >
                          Next
                        </Link>
                        <Link
                          className="secondary-action"
                          href={customerOrderPageHref(customerOrderTotalPages)}
                        >
                          Last
                        </Link>
                      </nav>
                    ) : null}
                    <p className="open-order-summary">
                      Total{" "}
                      {customerQuoteMode
                        ? "quotes"
                        : customerDisplayMode
                          ? "display orders"
                          : "orders"}
                      :{" "}
                      <strong>
                        {numberFormatter.format(customerOrders.length)}
                      </strong>{" "}
                      | Total amount:{" "}
                      <strong>{money(customerOrderAmount)}</strong>
                      {customerQuoteMode || customerDisplayMode ? null : (
                        <>
                          {" "}
                          | Ready to ship orders:{" "}
                          <strong>
                            {numberFormatter.format(
                              dashboard.readyToShipOrderCount,
                            )}
                          </strong>
                        </>
                      )}
                    </p>
                  </article>

                  <article
                    className={
                      selectedCustomerTab === "shipments"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="shipments"
                  >
                    <div className="section-title">
                      <h3>
                        {packingInvoiceStatusFilter
                          ? "Packing Lists Awaiting Invoice"
                          : "Packing Lists / Shipment Work"}
                      </h3>
                      <span>{visiblePackingLists.length}</span>
                    </div>
                    <div className="compact-list">
                      {visiblePackingLists.length === 0 ? (
                        <EmptyState
                          text={
                            packingInvoiceStatusFilter
                              ? "No packing lists are awaiting an invoice."
                              : "No packing lists for this customer yet."
                          }
                        />
                      ) : null}
                      {visiblePackingLists.map((packingList) => {
                        const canEditFreight =
                          packingList.invoice_generation_status_snapshot ===
                          "not_invoiced";
                        const editHref = `/?customer=${dashboard.customer.id}&tab=shipments${packingInvoiceStatusFilter ? "&packing_invoice_status=not_invoiced" : ""}&packing_freight_edit=${packingList.id}`;
                        const cancelHref = `/?customer=${dashboard.customer.id}&tab=shipments${packingInvoiceStatusFilter ? "&packing_invoice_status=not_invoiced" : ""}`;
                        return (
                          <Fragment key={packingList.id}>
                            <div className="compact-row packing-list-work-row">
                              <div>
                                {packingList.freight_shipment_id ? (
                                  <Link
                                    className="packing-list-record-link"
                                    href={`/?module=shipment-detail&shipment=${packingList.freight_shipment_id}&return_customer=${dashboard.customer.id}`}
                                  >
                                    {packingList.packing_list_number}
                                  </Link>
                                ) : (
                                  <strong>
                                    {packingList.packing_list_number}
                                  </strong>
                                )}
                                <span>
                                  PO{" "}
                                  <Link
                                    className="packing-list-po-link"
                                    href={`/?module=orders&order=${packingList.sales_order_id}&return_customer=${dashboard.customer.id}`}
                                  >
                                    {packingList.customer_po_number_snapshot}
                                  </Link>
                                </span>
                              </div>
                              <div className="packing-list-row-actions">
                                {canEditFreight ? (
                                  <Link
                                    className="text-action"
                                    href={`/?module=invoice-create&packing_list=${packingList.id}`}
                                  >
                                    Create Invoice
                                  </Link>
                                ) : (
                                  <span>
                                    {label(
                                      packingList.invoice_generation_status_snapshot,
                                    )}
                                  </span>
                                )}
                                {canEditFreight ? (
                                  <Link className="text-action" href={editHref}>
                                    Freight Charge{" "}
                                    {money(packingList.shipping_fee)}
                                  </Link>
                                ) : (
                                  <span>{money(packingList.shipping_fee)}</span>
                                )}
                              </div>
                            </div>
                            {canEditFreight &&
                            packingListFreightEditId === packingList.id ? (
                              <PackingListFreightEditor
                                action={updatePackingListFreightChargeAction}
                                actualFreightCost={Number(
                                  packingList.allocated_freight_cost,
                                )}
                                cancelHref={cancelHref}
                                currentFreightCharge={Number(
                                  packingList.shipping_fee,
                                )}
                                customerId={dashboard.customer.id}
                                packingListId={packingList.id}
                              />
                            ) : null}
                          </Fragment>
                        );
                      })}
                    </div>
                  </article>

                  <article
                    className={
                      selectedCustomerTab === "invoices"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="invoices"
                  >
                    <div className="section-title order-section-title">
                      <h3>Invoices</h3>
                      <span>{dashboard.invoices.length}</span>
                    </div>
                    <div className="customer-invoice-controls-row">
                      <CustomerInvoiceControls
                        customerId={dashboard.customer.id}
                        pageSize={customerInvoicePageSize}
                        search={params.invoice_q ?? ""}
                        advanced={customerInvoiceAdvanced}
                        dateFrom={customerInvoiceDateFrom}
                        dateTo={customerInvoiceDateTo}
                        paymentStatus={customerInvoiceStatus}
                        skus={params.invoice_skus ?? ""}
                      />
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Invoice No.</th>
                            <th>Brand</th>
                            <th>Invoice Date</th>
                            <th>Due Date</th>
                            <th>Total</th>
                            <th>Balance Due</th>
                            <th>Payment Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerInvoicePageRows.map((invoice) => (
                            <tr key={invoice.id}>
                              <td>
                                <Link
                                  className="table-link"
                                  href={`/?module=invoice-document&invoice=${invoice.id}`}
                                >
                                  {invoice.invoice_number}
                                </Link>
                                {invoice.sales_order?.customer_po_number ? (
                                  <span className="invoice-po-reference">
                                    PO{" "}
                                    <Link
                                      className="table-link"
                                      href={`/?module=orders&order=${invoice.sales_order_id}`}
                                    >
                                      {invoice.sales_order.customer_po_number}
                                    </Link>
                                  </span>
                                ) : null}
                              </td>
                              <td>{invoice.brand_name_snapshot}</td>
                              <td>{dateLabel(invoice.invoice_date)}</td>
                              <td
                                className={
                                  invoice.due_date &&
                                  invoice.due_date < today &&
                                  Number(invoice.balance_due) > 0 &&
                                  invoice.invoice_status !== "void"
                                    ? "invoice-due-date invoice-due-date--overdue"
                                    : "invoice-due-date"
                                }
                              >
                                {invoice.due_date
                                  ? dateLabel(invoice.due_date)
                                  : "Not set"}
                              </td>
                              <td>{money(Number(invoice.total_amount))}</td>
                              <td>{money(Number(invoice.balance_due))}</td>
                              <td>
                                <StatusBadge
                                  tone={
                                    invoice.payment_status === "paid"
                                      ? "good"
                                      : invoice.payment_status ===
                                          "partially_paid"
                                        ? "warn"
                                        : "danger"
                                  }
                                  value={invoice.payment_status}
                                />
                              </td>
                            </tr>
                          ))}
                          {customerInvoicePageRows.length === 0 ? (
                            <tr>
                              <td colSpan={7}>
                                <EmptyState text="No matching invoices found." />
                              </td>
                            </tr>
                          ) : null}
                        </tbody>
                      </table>
                    </div>
                    {customerInvoiceTotalPages > 1 ? (
                      <nav
                        className="pagination"
                        aria-label="Customer invoice pages"
                      >
                        <Link
                          className="secondary-action"
                          href={customerInvoicePageHref(1)}
                        >
                          First
                        </Link>
                        <Link
                          className="secondary-action"
                          href={customerInvoicePageHref(
                            Math.max(1, customerInvoiceCurrentPage - 1),
                          )}
                        >
                          Previous
                        </Link>
                        {Array.from(
                          { length: customerInvoiceTotalPages },
                          (_, index) => index + 1,
                        ).map((page) => (
                          <Link
                            aria-current={
                              page === customerInvoiceCurrentPage
                                ? "page"
                                : undefined
                            }
                            className={
                              page === customerInvoiceCurrentPage
                                ? "pagination-link pagination-link--active"
                                : "pagination-link"
                            }
                            href={customerInvoicePageHref(page)}
                            key={page}
                          >
                            {page}
                          </Link>
                        ))}
                        <Link
                          className="secondary-action"
                          href={customerInvoicePageHref(
                            Math.min(
                              customerInvoiceTotalPages,
                              customerInvoiceCurrentPage + 1,
                            ),
                          )}
                        >
                          Next
                        </Link>
                        <Link
                          className="secondary-action"
                          href={customerInvoicePageHref(
                            customerInvoiceTotalPages,
                          )}
                        >
                          Last
                        </Link>
                      </nav>
                    ) : null}
                    <p className="open-order-summary">
                      Total invoices:{" "}
                      <strong>
                        {numberFormatter.format(customerInvoices.length)}
                      </strong>{" "}
                      | Paid invoices:{" "}
                      <strong>
                        {numberFormatter.format(paidCustomerInvoices.length)}
                      </strong>{" "}
                      ({money(paidCustomerInvoiceAmount)}) | Open invoices:{" "}
                      <strong>
                        {numberFormatter.format(openCustomerInvoices.length)}
                      </strong>{" "}
                      ({money(openCustomerInvoiceAmount)})
                    </p>
                  </article>

                  <article
                    className={
                      selectedCustomerTab === "credit-memo"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="credit-memo"
                  >
                    <div className="section-title">
                      <h3>Credit Memo</h3>
                      <span>{dashboard.creditMemos.length}</span>
                    </div>
                    <div className="table-wrap">
                      {dashboard.creditMemos.length === 0 ? (
                        <EmptyState text="No credit memos for this customer yet." />
                      ) : null}
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

                  <article
                    className={
                      selectedCustomerTab === "rga"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="rga"
                  >
                    <div className="section-title">
                      <h3>RGA</h3>
                      <span>{dashboard.rgas.length}</span>
                    </div>
                    <div className="compact-list">
                      {dashboard.rgas.length === 0 ? (
                        <EmptyState text="No RGA activity for this customer yet." />
                      ) : null}
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

                  <article
                    className={
                      selectedCustomerTab === "attachments"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="attachments"
                  >
                    <div className="section-title">
                      <h3>Attachments</h3>
                      <span>{dashboard.attachments.length}</span>
                    </div>
                    <form
                      action={uploadCustomerAttachmentAction}
                      className="attachment-upload-form"
                    >
                      <input
                        name="customer_id"
                        type="hidden"
                        value={dashboard.customer.id}
                      />
                      <label>
                        Document
                        <input name="attachment_file" required type="file" />
                      </label>
                      <label>
                        Category
                        <select name="category" defaultValue="account_document">
                          <option value="account_document">
                            Account Document
                          </option>
                          <option value="resale_certificate">
                            Resale Certificate
                          </option>
                          <option value="agreement">Agreement</option>
                          <option value="credit_application">
                            Credit Application
                          </option>
                          <option value="other">Other</option>
                        </select>
                      </label>
                      <button className="small-action" type="submit">
                        Upload
                      </button>
                    </form>
                    <div className="compact-list">
                      {dashboard.attachments.length === 0 ? (
                        <EmptyState text="No account attachments uploaded yet." />
                      ) : null}
                      {dashboard.attachments.map((attachment) => (
                        <div className="compact-row" key={attachment.id}>
                          <div>
                            <strong>{attachment.original_file_name}</strong>
                            <span>{label(attachment.category)}</span>
                          </div>
                          <span>{fileSizeLabel(attachment.file_size)}</span>
                          <span>
                            {dateLabel(attachment.uploaded_at.slice(0, 10))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article
                    className={
                      selectedCustomerTab === "freight"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
                    id="freight"
                  >
                    <div className="section-title">
                      <h3>Freight</h3>
                      <div className="section-actions">
                        <span>{dashboard.freightPolicies.length}</span>
                        <Link
                          className="small-action"
                          href={`/?module=edit-freight&customer=${dashboard.customer.id}`}
                        >
                          Edit Freight
                        </Link>
                      </div>
                    </div>
                    <div className="compact-list">
                      {dashboard.freightPolicies.map((policy) => (
                        <div
                          className="compact-row"
                          key={`${policy.policy_name}-${policy.freight_terms ?? policy.ltl_freight_terms}`}
                        >
                          <div>
                            <strong>{policy.policy_name}</strong>
                            <span>
                              {label(
                                policy.freight_terms ??
                                  policy.ltl_freight_terms,
                              )}
                            </span>
                          </div>
                          <span>
                            FFA{" "}
                            {policy.freight_allowance_amount
                              ? money(policy.freight_allowance_amount)
                              : "Not set"}
                          </span>
                          <span>
                            {policy.flat_rate_percent
                              ? `${policy.flat_rate_percent}% Flat Rate`
                              : "No flat rate"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article
                    className={
                      selectedCustomerTab === "performance"
                        ? "data-section"
                        : "data-section tab-panel-hidden"
                    }
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
