import Link from "next/link";
import { revalidatePath } from "next/cache";
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
import { EditDropshipSettingsForm } from "@/components/customers/edit-dropship-settings-form";
import { EditLocationFreightForm } from "@/components/customers/edit-location-freight-form";
import { EditLocationForm } from "@/components/customers/edit-location-form";
import { EditSalesRepForm } from "@/components/customers/edit-sales-rep-form";
import { LocationInfoPage } from "@/components/customers/location-info-page";
import { SalesRepAgencyEditor } from "@/components/customers/sales-rep-agency-editor";
import { SalesRepAgencyPage } from "@/components/customers/sales-rep-agency-page";
import { CommissionStatementConfirmationPage } from "@/components/customers/commission-statement-confirmation-page";
import { SalesRepAgenciesDashboard } from "@/components/customers/sales-rep-agencies-dashboard";
import { SalesRepEditor } from "@/components/customers/sales-rep-editor";
import { SalesRepPage } from "@/components/customers/sales-rep-page";
import { SalesRepSubTerritoryEditor } from "@/components/customers/sales-rep-sub-territory-editor";
import { AgencyTerritoryEditor } from "@/components/customers/agency-territory-editor";
import { InvoiceConfirmationPage } from "@/components/financial/invoice-confirmation-page";
import { InvoiceCreatePage } from "@/components/financial/invoice-create-page";
import { InvoiceCreatedPage } from "@/components/financial/invoice-created-page";
import { InvoiceDocumentPage } from "@/components/financial/invoice-document-page";
import { InvoiceQueuePage } from "@/components/financial/invoice-queue-page";
import { PaymentEntryPage } from "@/components/financial/payment-entry-page";
import { PaymentDetailPage } from "@/components/financial/payment-detail-page";
import { CommissionPaymentPage } from "@/components/financial/commission-payment-page";
import { CommissionStatementPage } from "@/components/financial/commission-statement-page";
import { CreditMemoDocumentPage } from "@/components/financial/credit-memo-document-page";
import { RgaReplacementOrderConfirmPage } from "@/components/rga/rga-replacement-order-confirm-page";
import { ProductEditPlaceholder } from "@/components/products/product-edit-placeholder";
import { ProductListOverview } from "@/components/products/product-list-overview";
import { ProductPartsListOverview } from "@/components/products/product-parts-list-overview";
import { PartDetailDashboard } from "@/components/products/part-detail-dashboard";
import { ProductDetailDashboard } from "@/components/products/product-detail-dashboard";
import {
  AddPartParentProductsForm,
  AddProductForm,
  AddProductBoxForm,
  EditProductBoxesForm,
  EditProductImagesForm,
  EditProductInventoryForm,
  EditProductPartsForm,
  EditProductProfileForm,
  EditProductSpecsForm,
  EditProductVendorsForm,
} from "@/components/products/product-edit-forms";
import {
  type OrderPartOption,
  type OrderProductOption,
  type OrderSalesRepOption,
  type OrderShipToOption,
  type OrderTerritoryOption,
} from "@/components/orders/order-entry-form";
import { NewOrderPage } from "@/components/orders/new-order-page";
import { OrdersOverview } from "@/components/orders/orders-overview";
import { OrderAcknowledgementPage } from "@/components/orders/order-acknowledgement-page";
import { QuoteDocumentPage } from "@/components/orders/quote-document-page";
import { PackingListDocumentPage } from "@/components/shipping/packing-list-document-page";
import { ShipmentCreatePage } from "@/components/shipping/shipment-create-page";
import { PackingListFreightEditor } from "@/components/shipping/packing-list-freight-editor";
import { ShippingDashboardPage } from "@/components/shipping/shipping-dashboard-page";
import { ShipmentResultPage } from "@/components/shipping/shipment-result-page";
import { ShippingPreparationPackingListPage } from "@/components/shipping/shipping-preparation-packing-list-page";
import { CreateRgaPage } from "@/components/rga/create-rga-page";
import { RgaDashboardPage } from "@/components/rga/rga-dashboard-page";
import { RgaDetailPage } from "@/components/rga/rga-detail-page";
import { RgaSolutionPage } from "@/components/rga/rga-solution-page";
import { CreditMemoCreationPage } from "@/components/rga/credit-memo-creation-page";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { WarehouseEditor } from "@/components/admin/warehouse-editor";
import { WarehouseInfoPage } from "@/components/admin/warehouse-info-page";
import { TerritoryEditor } from "@/components/admin/territory-editor";
import { ZoneEditor } from "@/components/admin/zone-editor";
import { AisleEditor } from "@/components/admin/aisle-editor";
import { SectionEditorPage } from "@/components/admin/section-editor-page";
import { ModuleNav } from "./module-nav";
import {
  addressSnapshotLines,
  dateLabel,
  fileSizeLabel,
  label,
  money,
  numberFormatter,
  timestampLabel,
} from "@/lib/formatters";
import { productPartRoleOptions } from "@/lib/product-part-roles";
import {
  EmptyState,
  Metric,
  MetricLink,
  ModulePlaceholder,
  StatusBadge,
} from "@/components/ui";
import { createSupabaseAdminClient, createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/supabase";

export type SearchParams = Promise<{
  advanced?: string;
  agency_tab?: string;
  commission_tab?: string;
  commission_invoices?: string;
  commission_payment?: string;
  admin_tab?: string;
  agency?: string;
  contact?: string;
  customer?: string;
  customer_advanced?: string;
  customer_agency?: string;
  customer_account_type?: string;
  customer_status?: string;
  customer_territory?: string;
  error?: string;
  freight_tab?: string;
  location?: string;
  location_tab?: string;
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
  rep?: string;
  quote?: string;
  order?: string;
  order_action?: string;
  order_tab?: string;
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
  credit_memo?: string;
  invoice_ids?: string;
  invoice_date?: string;
  invoice_payment_terms?: string;
  invoice_payment_days?: string;
  invoice_customer_freight?: string;
  invoice_freight_allocations?: string;
  invoice_dropship_allocations?: string;
  invoice_tax_allocations?: string;
  invoice_commission_overrides?: string;
  financial_tab?: string;
  financial_section?: string;
  financial_commission_tab?: string;
  financial_credit_memo_tab?: string;
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
  setup?: string;
  product_tab?: string;
  spec_section?: string;
  vendor_action?: string;
  warehouse?: string;
  territory?: string;
  zone?: string;
  aisle?: string;
  section?: string;
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

type CustomerSearchFilters = {
  accountTypeId?: string;
  agencyId?: string;
  status?: string;
  territoryId?: string;
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
  updated_at?: string;
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
  updated_at?: string;
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
  territory_assignment_source: "auto" | "manual_unassigned";
  territory_id: string | null;
};

type LocationTerritory = {
  id: string;
  name: string;
  territory_code: string;
};

type LocationCoverageOption = {
  id: string;
  name: string;
};

type LocationCoverageAssignment = {
  salesRepAgencyId: string;
  salesRepId: string | null;
  source: "manual" | "territory";
  territoryId: string;
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
  dropship_fee_amount: number;
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
  ground_freight_terms_snapshot: string;
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
    next_incoming_eta: string | null;
    quantity_cancelled: number;
    quantity_cleared: number;
    quantity_ordered: number;
    quantity_shipped: number;
    shipment_details: {
      carrier: string | null;
      ship_date: string | null;
      shipped_quantity: number;
      tracking_number: string | null;
    }[];
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
  rga_id: string | null;
  rga_number: string | null;
  sales_order_id: string | null;
  customer_po_number: string | null;
  status: string;
  total_credit_amount: number | null;
};

type PackingList = {
  allocated_freight_cost: number;
  carrier: string | null;
  freight_shipment_id: string | null;
  id: string;
  items_shipped: number;
  packing_list_number: string;
  sales_order_id: string;
  customer_po_number_snapshot: string;
  status: string;
  invoice_generation_status_snapshot: string;
  shipping_fee: number;
  ship_date: string | null;
  total_order_items: number;
};

type InvoiceQueuePackingList = PackingList & {
  customer_account_id: string;
  customer_name: string;
  created_at: string;
  dropship_fee_amount: number;
  is_dropship: boolean;
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
  original_customer_po_number_snapshot: string | null;
  sales_order_id: string | null;
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
  customer_location_id?: string | null;
  freight_level_id?: string | null;
  dropship_freight_level_id?: string | null;
  dropship_freight_allowance_amount?: number | null;
  dropship_freight_rate_percent?: number | null;
  dropship_freight_terms?: string | null;
  dropship_default_ground_carrier?: string | null;
  dropship_default_ground_carrier_account_number?: string | null;
  dropship_default_ltl_carrier?: string | null;
  dropship_default_ltl_carrier_account_number?: string | null;
  dropship_is_active?: boolean | null;
  dropship_rate_percent?: number | null;
  policy_name: string;
  ltl_freight_terms: string;
  ground_freight_terms: string;
  preferred_shipping_type: string | null;
  residential_surcharge_is_active?: boolean | null;
  residential_surcharge_rate_percent?: number | null;
  updated_at?: string;
};

type ShippingAddressFreightTerm = {
  freightTerm: string;
  locationId: string;
  locationName: string;
  updatedAt: string | null;
};

type FreightLevelConfig = {
  free_freight_allowance: number;
  freight_rate_percent: number;
  id: string;
  level_name: string;
};

type FreightLevelCustomerGroupInput = {
  accountTypeId: string;
  primaryShowroomRequirement: "any" | "no" | "yes";
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

async function loadOptionalLookup<T>(label: string, load: () => Promise<T>) {
  try {
    return await load();
  } catch (error) {
    console.warn(`${label} could not be loaded:`, error instanceof Error ? error.message : error);
    return [] as unknown as T;
  }
}

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
  material_ids: string[];
  materials: string[];
  next_incoming_eta: string | null;
  no_box_needed: boolean;
  on_hand_quantity: number;
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
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SelectOption[];
}

async function getCustomerStatusOptions() {
  const { data, error } = await createSupabaseUntypedAdminClient().from("customer_status_setting").select("status_code, name").eq("is_active", true).order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((status) => ({ id: status.status_code, name: status.name })) as SelectOption[];
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

async function getSalesRepAgencies() {
  const { data, error } = await createSupabaseAdminClient().from("sales_rep_agency").select("id, agency_code, name, main_contact_name, email, commission_default_percent, status").order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as { id: string; agency_code: string; name: string; main_contact_name: string | null; email: string | null; commission_default_percent: number; status: "active" | "inactive" }[];
}

async function getSalesRepAgencyOptions() {
  const { data, error } = await createSupabaseAdminClient()
    .from("sales_rep_agency")
    .select("id, name")
    .eq("status", "active")
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as SelectOption[];
}

async function getSalesRepsForDashboard() {
  const { data, error } = await createSupabaseAdminClient()
    .from("sales_rep")
    .select("id, name, role_title, email, phone, status, sales_rep_agency(id, name)")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((salesRep) => ({
    agency: salesRep.sales_rep_agency
      ? {
          id: salesRep.sales_rep_agency.id,
          name: salesRep.sales_rep_agency.name,
        }
      : null,
    email: salesRep.email,
    id: salesRep.id,
    name: salesRep.name,
    phone: salesRep.phone,
    role_title: salesRep.role_title,
    status: salesRep.status,
  })) as {
    agency: { id: string; name: string } | null;
    email: string | null;
    id: string;
    name: string;
    phone: string | null;
    role_title: string | null;
    status: "active" | "inactive";
  }[];
}

async function getSalesCoverageDashboard() {
  const [agencies, salesReps] = await Promise.all([
    getSalesRepAgencies(),
    getSalesRepsForDashboard(),
  ]);

  return { agencies, salesReps };
}

async function getCustomerRepAssignmentsForEdit(customerId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: locations, error: locationsError } = await supabase
    .from("customer_location")
    .select("id, location_name")
    .eq("customer_account_id", customerId)
    .order("location_name", { ascending: true });

  if (locationsError) {
    throw new Error(locationsError.message);
  }

  const locationIds = (locations ?? []).map((location) => location.id);
  const { data: assignments, error: assignmentsError } = locationIds.length
    ? await supabase
        .from("customer_location_rep_assignment")
        .select("id, customer_location_id, sales_rep_id, territory_id, coverage_role, status")
        .in("customer_location_id", locationIds)
        .order("created_at", { ascending: true })
    : { data: [], error: null };

  if (assignmentsError) {
    throw new Error(assignmentsError.message);
  }

  return {
    assignments: assignments ?? [],
    locations: (locations ?? []).map((location) => ({
      id: location.id,
      name: location.location_name,
    })),
  };
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
    console.warn("Product style options could not be loaded:", error.message);
    return [];
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

async function getMaterialOptions() {
  const supabase = createSupabaseUntypedAdminClient();
  const { data, error } = await supabase
    .from("material")
    .select("id, material_name")
    .eq("is_active", true)
    .order("material_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((material) => ({
    id: material.id,
    name: material.material_name,
  })) as SelectOption[];
}

async function replaceProductMaterials(productId: string, formData: FormData) {
  const materialIds = [...new Set(formData.getAll("material_id").map((value) => String(value).trim()).filter(Boolean))];
  const supabase = createSupabaseUntypedAdminClient();
  if (materialIds.length) {
    const { data, error } = await supabase.from("material").select("id").eq("is_active", true).in("id", materialIds);
    if (error) throw new Error(error.message);
    if ((data ?? []).length !== materialIds.length) throw new Error("One or more selected materials are no longer available.");
  }
  const { error: deleteError } = await supabase.from("product_material").delete().eq("product_id", productId);
  if (deleteError) throw new Error(deleteError.message);
  if (!materialIds.length) return;
  const { error } = await supabase.from("product_material").insert(materialIds.map((materialId) => ({ material_id: materialId, product_id: productId })));
  if (error) throw new Error(error.message);
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

async function createWarehouseAction(formData: FormData) {
  "use server";
  const optionalText = (key: string) => textValue(formData, key) || null;
  const warehouseCode = textValue(formData, "warehouse_code").toUpperCase();
  const name = textValue(formData, "name");
  if (!warehouseCode || !name) redirect("/?module=admin-warehouse-edit&error=Warehouse%20code%20and%20name%20are%20required.");

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("warehouse").insert({
    address_line_1: optionalText("address_line_1"), address_line_2: optionalText("address_line_2"), city: optionalText("city"),
    country: textValue(formData, "country") || "United States", country_code: (textValue(formData, "country_code") || "USA").toUpperCase(),
    name, notes: optionalText("notes"), postal_code: optionalText("postal_code"), state_province: optionalText("state_province"), warehouse_code: warehouseCode,
  }).select("id").single();
  if (error) redirect(`/?module=admin-warehouse-edit&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${data.id}&notice=warehouse_created`);
}

type TerritoryCountyRule = { county_geoid: string; coverage_mode: "include" | "exclude" };

function postalCodesFromField(formData: FormData, key: string) {
  const postalCodes = [...new Set(textValue(formData, key).split(/[\s,;]+/).map((code) => code.trim()).filter(Boolean))];
  const invalidPostalCode = postalCodes.find((code) => !/^\d{5}$/.test(code));
  if (invalidPostalCode) throw new Error(`\"${invalidPostalCode}\" is not a valid five-digit ZIP code.`);
  return postalCodes;
}

function territoryCoverage(formData: FormData) {
  const stateCodes = [...new Set(formData.getAll("state_code").map((value) => String(value).trim().toUpperCase()).filter((code) => /^[A-Z]{2}$/.test(code)))];
  const rawRules = textValue(formData, "county_rules_json") || "[]";
  let countyRules: TerritoryCountyRule[];
  try {
    const parsed = JSON.parse(rawRules) as unknown;
    if (!Array.isArray(parsed)) throw new Error();
    countyRules = parsed.flatMap((rule) => {
      if (!rule || typeof rule !== "object") return [];
      const { county_geoid: countyGeoid, coverage_mode: coverageMode } = rule as Record<string, unknown>;
      return typeof countyGeoid === "string" && /^\d{5}$/.test(countyGeoid) && (coverageMode === "include" || coverageMode === "exclude") ? [{ county_geoid: countyGeoid, coverage_mode: coverageMode }] : [];
    });
  } catch {
    throw new Error("County coverage could not be read. Please add the county rule again.");
  }
  const ruleMap = new Map(countyRules.map((rule) => [rule.county_geoid, rule]));
  const includedPostalCodes = postalCodesFromField(formData, "include_zip_codes");
  const excludedPostalCodes = postalCodesFromField(formData, "exclude_zip_codes");
  const conflictingPostalCode = includedPostalCodes.find((postalCode) => excludedPostalCodes.includes(postalCode));
  if (conflictingPostalCode) throw new Error(`ZIP code ${conflictingPostalCode} cannot be both included and excluded.`);
  return {
    countyRules: [...ruleMap.values()],
    excludedPostalCodes,
    includedPostalCodes,
    stateCodes,
  };
}

async function listReferencePostalCodes(column: "county_geoid" | "state_code", values: string[]) {
  const codes = new Set<string>();
  const supabase = createSupabaseUntypedAdminClient();
  for (let start = 0; start < values.length; start += 100) {
    const valueGroup = values.slice(start, start + 100);
    for (let page = 0; ; page += 1) {
      const { data, error } = await supabase.from("zip_county_reference").select("postal_code").in(column, valueGroup).range(page * 1000, page * 1000 + 999);
      if (error) throw new Error(error.message);
      for (const row of data ?? []) codes.add(row.postal_code);
      if (!data || data.length < 1000) break;
    }
  }
  return codes;
}

async function resolveTerritoryZipCoverage(coverage: ReturnType<typeof territoryCoverage>) {
  const selectedStateCodes = await listReferencePostalCodes("state_code", coverage.stateCodes);
  const includedCountyCodes = await listReferencePostalCodes("county_geoid", coverage.countyRules.filter((rule) => rule.coverage_mode === "include").map((rule) => rule.county_geoid));
  const excludedCountyCodes = await listReferencePostalCodes("county_geoid", coverage.countyRules.filter((rule) => rule.coverage_mode === "exclude").map((rule) => rule.county_geoid));
  const hasReferenceSelection = coverage.stateCodes.length > 0 || coverage.countyRules.length > 0;
  if (hasReferenceSelection && selectedStateCodes.size + includedCountyCodes.size + excludedCountyCodes.size === 0) {
    throw new Error("The ZIP-to-county reference data has not been imported yet. Import it before saving state or county coverage.");
  }
  const postalCodes = new Set([...selectedStateCodes, ...includedCountyCodes]);
  for (const postalCode of excludedCountyCodes) postalCodes.delete(postalCode);
  for (const postalCode of coverage.includedPostalCodes) postalCodes.add(postalCode);
  for (const postalCode of coverage.excludedPostalCodes) postalCodes.delete(postalCode);
  return [...postalCodes].sort();
}

async function replaceTerritoryRules(territoryId: string, coverage: ReturnType<typeof territoryCoverage>) {
  const supabase = createSupabaseUntypedAdminClient();
  const { error: countyDeleteError } = await supabase.from("territory_county_coverage_rule").delete().eq("territory_id", territoryId);
  if (countyDeleteError) throw new Error(countyDeleteError.message);
  const { error: zipDeleteError } = await supabase.from("territory_zip_override").delete().eq("territory_id", territoryId);
  if (zipDeleteError) throw new Error(zipDeleteError.message);
  if (coverage.countyRules.length) {
    const { error } = await supabase.from("territory_county_coverage_rule").insert(coverage.countyRules.map((rule) => ({ ...rule, territory_id: territoryId })));
    if (error) throw new Error(error.message);
  }
  const zipOverrides = [
    ...coverage.includedPostalCodes.map((postal_code) => ({ coverage_mode: "include", postal_code, territory_id: territoryId })),
    ...coverage.excludedPostalCodes.map((postal_code) => ({ coverage_mode: "exclude", postal_code, territory_id: territoryId })),
  ];
  if (zipOverrides.length) {
    const { error } = await supabase.from("territory_zip_override").insert(zipOverrides);
    if (error) throw new Error(error.message);
  }
}

async function replaceTerritoryZipCoverage(territoryId: string, postalCodes: string[]) {
  const supabase = createSupabaseUntypedAdminClient();
  const { error: deleteError } = await supabase.from("territory_zip_coverage").delete().eq("territory_id", territoryId);
  if (deleteError) throw new Error(deleteError.message);
  for (let start = 0; start < postalCodes.length; start += 1000) {
    const { error } = await supabase.from("territory_zip_coverage").insert(postalCodes.slice(start, start + 1000).map((postalCode) => ({ postal_code: postalCode, territory_id: territoryId })));
    if (error) throw new Error(error.message);
  }
}

async function territoryOverlapCount(territoryId: string, postalCodes: string[]) {
  if (!postalCodes.length) return 0;
  const supabase = createSupabaseUntypedAdminClient();
  const territoryIds = new Set<string>();
  for (let start = 0; start < postalCodes.length; start += 500) {
    const { data, error } = await supabase.from("territory_zip_coverage").select("territory_id").neq("territory_id", territoryId).in("postal_code", postalCodes.slice(start, start + 500));
    if (error) throw new Error(error.message);
    for (const row of data ?? []) territoryIds.add(row.territory_id);
  }
  return territoryIds.size;
}

async function createTerritoryAction(formData: FormData) {
  "use server";
  const territoryCode = textValue(formData, "territory_code").toUpperCase();
  const name = textValue(formData, "name");
  const description = textValue(formData, "description") || null;
  if (!territoryCode || !name) redirect("/?module=admin-territory-edit&error=Territory%20code%20and%20name%20are%20required.");
  let coverage: ReturnType<typeof territoryCoverage>;
  try { coverage = territoryCoverage(formData); } catch (error) { redirect(`/?module=admin-territory-edit&error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid territory coverage.")}`); }
  let postalCodes: string[];
  try { postalCodes = await resolveTerritoryZipCoverage(coverage!); } catch (coverageError) { redirect(`/?module=admin-territory-edit&error=${encodeURIComponent(coverageError instanceof Error ? coverageError.message : "Unable to resolve ZIP coverage.")}`); }
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("territory").insert({ description, name, state_codes_json: coverage!.stateCodes, territory_code: territoryCode }).select("id").single();
  if (error) redirect(`/?module=admin-territory-edit&error=${encodeURIComponent(error.message)}`);
  let overlapCount: number;
  try {
    await replaceTerritoryRules(data.id, coverage!);
    await replaceTerritoryZipCoverage(data.id, postalCodes!);
    overlapCount = await territoryOverlapCount(data.id, postalCodes!);
  } catch (coverageError) { redirect(`/?module=admin-territory-edit&territory=${data.id}&error=${encodeURIComponent(coverageError instanceof Error ? coverageError.message : "Unable to save ZIP coverage.")}`); }
  revalidatePath("/");
  redirect(`/?module=admin&admin_tab=territory${overlapCount! ? `&notice=${encodeURIComponent(`Territory created. Its ZIP coverage overlaps ${overlapCount} existing territor${overlapCount === 1 ? "y" : "ies"}; review the territory coverage if needed.`)}` : ""}`);
}

async function updateTerritoryAction(formData: FormData) {
  "use server";
  const territoryId = textValue(formData, "territory_id");
  const territoryCode = textValue(formData, "territory_code").toUpperCase();
  const name = textValue(formData, "name");
  const status = textValue(formData, "status") === "inactive" ? "inactive" : "active";
  if (!territoryId || !territoryCode || !name) redirect(`/?module=admin-territory-edit&territory=${territoryId}&error=Territory%20code%20and%20name%20are%20required.`);
  let coverage: ReturnType<typeof territoryCoverage>;
  try { coverage = territoryCoverage(formData); } catch (error) { redirect(`/?module=admin-territory-edit&territory=${territoryId}&error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid territory coverage.")}`); }
  const { error } = await createSupabaseAdminClient().from("territory").update({ description: textValue(formData, "description") || null, name, state_codes_json: coverage!.stateCodes, status, territory_code: territoryCode }).eq("id", territoryId);
  if (error) redirect(`/?module=admin-territory-edit&territory=${territoryId}&error=${encodeURIComponent(error.message)}`);
  let overlapCount: number;
  try {
    const postalCodes = await resolveTerritoryZipCoverage(coverage!);
    await replaceTerritoryRules(territoryId, coverage!);
    await replaceTerritoryZipCoverage(territoryId, postalCodes);
    overlapCount = await territoryOverlapCount(territoryId, postalCodes);
  } catch (coverageError) { redirect(`/?module=admin-territory-edit&territory=${territoryId}&error=${encodeURIComponent(coverageError instanceof Error ? coverageError.message : "Unable to save ZIP coverage.")}`); }
  revalidatePath("/");
  redirect(`/?module=admin-territory-edit&territory=${territoryId}&notice=${encodeURIComponent(overlapCount! ? `Territory saved. Its ZIP coverage overlaps ${overlapCount} existing territor${overlapCount === 1 ? "y" : "ies"}; review the individual ZIP exclusions if needed.` : "Territory saved.")}`);
}

async function deactivateTerritoryAction(formData: FormData) {
  "use server";
  const territoryId = textValue(formData, "territory_id");
  if (!territoryId) redirect("/?module=admin&admin_tab=territory");
  const { error } = await createSupabaseAdminClient().from("territory").update({ status: "inactive" }).eq("id", territoryId);
  if (error) redirect(`/?module=admin-territory-edit&territory=${territoryId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect("/?module=admin&admin_tab=territory");
}

async function syncAgencyTerritoryAssignments(agencyId: string, territoryIds: string[]) {
  const supabase = createSupabaseUntypedAdminClient();
  const [{ data: agency, error: agencyError }, { data: territories, error: territoryError }, { data: existingAssignments, error: assignmentsError }] = await Promise.all([
    supabase.from("sales_rep_agency").select("id").eq("id", agencyId).maybeSingle(),
    territoryIds.length ? supabase.from("territory").select("id").in("id", territoryIds).eq("status", "active") : Promise.resolve({ data: [], error: null }),
    supabase.from("territory_assignment").select("id, territory_id").eq("sales_rep_agency_id", agencyId).eq("status", "active").is("end_date", null),
  ]);
  if (agencyError || !agency) throw new Error(agencyError?.message ?? "Sales rep agency not found.");
  if (territoryError || assignmentsError) throw new Error(territoryError?.message ?? assignmentsError?.message ?? "Unable to load territory assignments.");
  if ((territories ?? []).length !== territoryIds.length) throw new Error("Choose active territories only.");
  const selected = new Set(territoryIds);
  const existingByTerritory = new Map((existingAssignments ?? []).map((assignment) => [assignment.territory_id, assignment]));
  const toEnd = (existingAssignments ?? []).filter((assignment) => !selected.has(assignment.territory_id)).map((assignment) => assignment.id);
  if (toEnd.length) {
    const { error } = await supabase.from("territory_assignment").update({ end_date: new Date().toISOString().slice(0, 10), status: "inactive" }).in("id", toEnd);
    if (error) throw new Error(error.message);
  }
  const toCreate = territoryIds.filter((territoryId) => !existingByTerritory.has(territoryId));
  if (toCreate.length) {
    const { error } = await supabase.from("territory_assignment").insert(toCreate.map((territory_id) => ({ sales_rep_agency_id: agencyId, territory_id })));
    if (error) throw new Error(error.message);
  }
}

function agencyProfileValues(formData: FormData) {
  const commission = Number(textValue(formData, "commission_default_percent") || 0);
  if (!Number.isFinite(commission) || commission < 0) throw new Error("Default commission must be zero or greater.");
  return {
    address_line_1: textValue(formData, "address_line_1") || null,
    address_line_2: textValue(formData, "address_line_2") || null,
    agency_code: textValue(formData, "agency_code").toUpperCase(),
    city: textValue(formData, "city") || null,
    commission_default_percent: commission,
    email: textValue(formData, "email") || null,
    main_contact_name: textValue(formData, "main_contact_name") || null,
    name: textValue(formData, "name"),
    notes: textValue(formData, "notes") || null,
    phone: textValue(formData, "phone") || null,
    postal_code: textValue(formData, "postal_code") || null,
    state_province: textValue(formData, "state_province") || null,
    status: textValue(formData, "status") === "inactive" ? "inactive" : "active",
  };
}

async function createSalesRepAgencyAction(formData: FormData) {
  "use server";
  let profile: ReturnType<typeof agencyProfileValues>;
  try { profile = agencyProfileValues(formData); } catch (error) { redirect(`/?module=sales-rep-agency-edit&error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid agency information.")}`); }
  if (!profile!.agency_code || !profile!.name) redirect("/?module=sales-rep-agency-edit&error=Agency%20code%20and%20name%20are%20required.");
  const supabase = createSupabaseUntypedAdminClient();
  const { data, error } = await supabase.from("sales_rep_agency").insert(profile!).select("id").single();
  if (error) redirect(`/?module=sales-rep-agency-edit&error=${encodeURIComponent(error.message)}`);
  try { await syncAgencyTerritoryAssignments(data.id, [...new Set(formData.getAll("territory_ids").map(String).filter(Boolean))]); } catch (assignmentError) {
    redirect(`/?module=sales-rep-agency-edit&agency=${data.id}&error=${encodeURIComponent(assignmentError instanceof Error ? assignmentError.message : "Unable to save territory assignments.")}`);
  }
  revalidatePath("/");
  redirect(`/?module=sales-rep-agency&agency=${data.id}`);
}

async function updateSalesRepAgencyAction(formData: FormData) {
  "use server";
  const agencyId = textValue(formData, "agency_id");
  if (!agencyId) redirect("/?module=sales-rep-agencies");
  let profile: ReturnType<typeof agencyProfileValues>;
  try { profile = agencyProfileValues(formData); } catch (error) { redirect(`/?module=sales-rep-agency-edit&agency=${agencyId}&error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid agency information.")}`); }
  if (!profile!.agency_code || !profile!.name) redirect(`/?module=sales-rep-agency-edit&agency=${agencyId}&error=Agency%20code%20and%20name%20are%20required.`);
  const { error } = await createSupabaseUntypedAdminClient().from("sales_rep_agency").update(profile!).eq("id", agencyId);
  if (error) redirect(`/?module=sales-rep-agency-edit&agency=${agencyId}&error=${encodeURIComponent(error.message)}`);
  try { await syncAgencyTerritoryAssignments(agencyId, [...new Set(formData.getAll("territory_ids").map(String).filter(Boolean))]); } catch (assignmentError) {
    redirect(`/?module=sales-rep-agency-edit&agency=${agencyId}&error=${encodeURIComponent(assignmentError instanceof Error ? assignmentError.message : "Unable to save territory assignments.")}`);
  }
  revalidatePath("/");
  redirect(`/?module=sales-rep-agency&agency=${agencyId}`);
}

async function createAgencySalesRepAction(formData: FormData) {
  "use server";
  const agencyId = textValue(formData, "agency_id");
  const name = textValue(formData, "name");
  if (!agencyId || !name) redirect(`/?module=sales-rep-edit&agency=${agencyId}&error=Sales%20rep%20name%20is%20required.`);
  const { error } = await createSupabaseUntypedAdminClient().from("sales_rep").insert({
    address_line_1: textValue(formData, "address_line_1") || null,
    address_line_2: textValue(formData, "address_line_2") || null,
    city: textValue(formData, "city") || null,
    email: textValue(formData, "email") || null,
    is_principal: formData.get("is_principal") === "on",
    name,
    notes: textValue(formData, "notes") || null,
    phone: textValue(formData, "phone") || null,
    postal_code: textValue(formData, "postal_code") || null,
    role_title: textValue(formData, "role_title") || null,
    sales_rep_agency_id: agencyId,
    state_province: textValue(formData, "state_province") || null,
  });
  if (error) redirect(`/?module=sales-rep-edit&agency=${agencyId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=sales-rep-agency&agency=${agencyId}`);
}

async function updateAgencySalesRepAction(formData: FormData) {
  "use server";
  const agencyId = textValue(formData, "agency_id");
  const salesRepId = textValue(formData, "sales_rep_id");
  const name = textValue(formData, "name");
  if (!agencyId || !salesRepId || !name) redirect(`/?module=sales-rep-edit&agency=${agencyId}&rep=${salesRepId}&error=Sales%20rep%20name%20is%20required.`);
  const { error } = await createSupabaseUntypedAdminClient().from("sales_rep").update({
    address_line_1: textValue(formData, "address_line_1") || null,
    address_line_2: textValue(formData, "address_line_2") || null,
    city: textValue(formData, "city") || null,
    email: textValue(formData, "email") || null,
    is_principal: formData.get("is_principal") === "on",
    name,
    notes: textValue(formData, "notes") || null,
    phone: textValue(formData, "phone") || null,
    postal_code: textValue(formData, "postal_code") || null,
    role_title: textValue(formData, "role_title") || null,
    state_province: textValue(formData, "state_province") || null,
    status: textValue(formData, "status") === "inactive" ? "inactive" : "active",
  }).eq("id", salesRepId).eq("sales_rep_agency_id", agencyId);
  if (error) redirect(`/?module=sales-rep-edit&agency=${agencyId}&rep=${salesRepId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=sales-rep&rep=${salesRepId}`);
}

async function addSalesRepSubTerritoriesAction(formData: FormData) {
  "use server";
  const salesRepId = textValue(formData, "sales_rep_id");
  const territoryIds = [...new Set(formData.getAll("territory_ids").map(String).filter(Boolean))];
  if (!salesRepId || !territoryIds.length) redirect(`/?module=sales-rep-sub-territory-add&rep=${salesRepId}&error=Select%20at%20least%20one%20sub-territory.`);
  const supabase = createSupabaseUntypedAdminClient();
  const { data: salesRep, error: salesRepError } = await supabase.from("sales_rep").select("id, sales_rep_agency_id").eq("id", salesRepId).maybeSingle();
  if (salesRepError || !salesRep) redirect(`/?module=sales-rep-sub-territory-add&rep=${salesRepId}&error=${encodeURIComponent(salesRepError?.message ?? "Sales rep not found.")}`);
  const [{ data: agencyAssignments, error: agencyAssignmentsError }, { data: agencySalesReps, error: agencySalesRepsError }] = await Promise.all([
    supabase.from("territory_assignment").select("territory_id").eq("sales_rep_agency_id", salesRep!.sales_rep_agency_id).eq("status", "active").is("end_date", null),
    supabase.from("sales_rep").select("id").eq("sales_rep_agency_id", salesRep!.sales_rep_agency_id),
  ]);
  if (agencyAssignmentsError || agencySalesRepsError) redirect(`/?module=sales-rep-sub-territory-add&rep=${salesRepId}&error=${encodeURIComponent(agencyAssignmentsError?.message ?? agencySalesRepsError?.message ?? "Unable to load agency territory assignments.")}`);
  const agencyTerritoryIds = new Set((agencyAssignments ?? []).map((assignment) => assignment.territory_id));
  if (territoryIds.some((territoryId) => !agencyTerritoryIds.has(territoryId))) redirect(`/?module=sales-rep-sub-territory-add&rep=${salesRepId}&error=Choose%20territories%20assigned%20to%20the%20parent%20agency.`);
  const agencySalesRepIds = (agencySalesReps ?? []).map((rep) => rep.id);
  const { data: existingAssignments, error: existingAssignmentsError } = agencySalesRepIds.length ? await supabase.from("sales_rep_territory_assignment").select("territory_id").in("sales_rep_id", agencySalesRepIds).eq("status", "active").is("end_date", null) : { data: [], error: null };
  if (existingAssignmentsError) redirect(`/?module=sales-rep-sub-territory-add&rep=${salesRepId}&error=${encodeURIComponent(existingAssignmentsError.message)}`);
  const existingIds = new Set((existingAssignments ?? []).map((assignment) => assignment.territory_id));
  if (territoryIds.some((territoryId) => existingIds.has(territoryId))) redirect(`/?module=sales-rep-sub-territory-add&rep=${salesRepId}&error=One%20or%20more%20selected%20sub-territories%20are%20already%20assigned%20to%20another%20sales%20rep.`);
  const newTerritoryIds = territoryIds.filter((territoryId) => !existingIds.has(territoryId));
  if (newTerritoryIds.length) {
    const { error } = await supabase.from("sales_rep_territory_assignment").insert(newTerritoryIds.map((territory_id) => ({ sales_rep_id: salesRepId, territory_id })));
    if (error) redirect(`/?module=sales-rep-sub-territory-add&rep=${salesRepId}&error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/");
  redirect(`/?module=sales-rep&rep=${salesRepId}`);
}

async function deactivateSalesRepSubTerritoryAction(formData: FormData) {
  "use server";
  const assignmentId = textValue(formData, "assignment_id");
  const salesRepId = textValue(formData, "sales_rep_id");
  if (!assignmentId || !salesRepId) redirect(`/?module=sales-rep&rep=${salesRepId}`);
  const { error } = await createSupabaseUntypedAdminClient()
    .from("sales_rep_territory_assignment")
    .update({ end_date: new Date().toISOString().slice(0, 10), status: "inactive" })
    .eq("id", assignmentId)
    .eq("sales_rep_id", salesRepId)
    .eq("status", "active")
    .is("end_date", null);
  if (error) redirect(`/?module=sales-rep&rep=${salesRepId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=sales-rep&rep=${salesRepId}`);
}

async function removeSalesRepFromAgencyAction(formData: FormData) {
  "use server";
  const agencyId = textValue(formData, "agency_id");
  const salesRepId = textValue(formData, "sales_rep_id");
  if (!agencyId || !salesRepId) redirect(`/?module=sales-rep-agency&agency=${agencyId}`);
  const supabase = createSupabaseUntypedAdminClient();
  const { error: salesRepError } = await supabase.from("sales_rep").update({ sales_rep_agency_id: null }).eq("id", salesRepId).eq("sales_rep_agency_id", agencyId);
  if (salesRepError) redirect(`/?module=sales-rep-agency&agency=${agencyId}&error=${encodeURIComponent(salesRepError.message)}`);
  const { error: subTerritoryError } = await supabase.from("sales_rep_territory_assignment").update({ end_date: new Date().toISOString().slice(0, 10), status: "inactive" }).eq("sales_rep_id", salesRepId).eq("status", "active").is("end_date", null);
  if (subTerritoryError) redirect(`/?module=sales-rep-agency&agency=${agencyId}&error=${encodeURIComponent(subTerritoryError.message)}`);
  revalidatePath("/");
  redirect(`/?module=sales-rep-agency&agency=${agencyId}`);
}

async function removeTerritoryFromAgencyAction(formData: FormData) {
  "use server";
  const agencyId = textValue(formData, "agency_id");
  const assignmentId = textValue(formData, "assignment_id");
  const territoryId = textValue(formData, "territory_id");
  if (!agencyId || !assignmentId || !territoryId) redirect(`/?module=sales-rep-agency&agency=${agencyId}`);
  const supabase = createSupabaseUntypedAdminClient();
  const { data: agencySalesReps, error: salesRepsError } = await supabase.from("sales_rep").select("id").eq("sales_rep_agency_id", agencyId);
  if (salesRepsError) redirect(`/?module=sales-rep-agency&agency=${agencyId}&error=${encodeURIComponent(salesRepsError.message)}`);
  const { error: assignmentError } = await supabase.from("territory_assignment").update({ end_date: new Date().toISOString().slice(0, 10), status: "inactive" }).eq("id", assignmentId).eq("sales_rep_agency_id", agencyId).eq("territory_id", territoryId).eq("status", "active").is("end_date", null);
  if (assignmentError) redirect(`/?module=sales-rep-agency&agency=${agencyId}&error=${encodeURIComponent(assignmentError.message)}`);
  const salesRepIds = (agencySalesReps ?? []).map((rep) => rep.id);
  if (salesRepIds.length) {
    const { error: subTerritoryError } = await supabase.from("sales_rep_territory_assignment").update({ end_date: new Date().toISOString().slice(0, 10), status: "inactive" }).in("sales_rep_id", salesRepIds).eq("territory_id", territoryId).eq("status", "active").is("end_date", null);
    if (subTerritoryError) redirect(`/?module=sales-rep-agency&agency=${agencyId}&error=${encodeURIComponent(subTerritoryError.message)}`);
  }
  revalidatePath("/");
  redirect(`/?module=sales-rep-agency&agency=${agencyId}`);
}

async function addTerritoriesToAgencyAction(formData: FormData) {
  "use server";
  const agencyId = textValue(formData, "agency_id");
  const territoryIds = [...new Set(formData.getAll("territory_ids").map(String).filter(Boolean))];
  if (!agencyId || !territoryIds.length) redirect(`/?module=sales-rep-agency-territory-add&agency=${agencyId}&error=Select%20at%20least%20one%20territory.`);
  const supabase = createSupabaseUntypedAdminClient();
  const [{ data: agency, error: agencyError }, { data: territories, error: territoriesError }, { data: existingAssignments, error: assignmentsError }] = await Promise.all([
    supabase.from("sales_rep_agency").select("id").eq("id", agencyId).maybeSingle(),
    supabase.from("territory").select("id").in("id", territoryIds).eq("status", "active"),
    supabase.from("territory_assignment").select("territory_id").eq("sales_rep_agency_id", agencyId).eq("status", "active").is("end_date", null),
  ]);
  if (agencyError || !agency) redirect(`/?module=sales-rep-agency-territory-add&agency=${agencyId}&error=${encodeURIComponent(agencyError?.message ?? "Sales rep agency not found.")}`);
  if (territoriesError || assignmentsError) redirect(`/?module=sales-rep-agency-territory-add&agency=${agencyId}&error=${encodeURIComponent(territoriesError?.message ?? assignmentsError?.message ?? "Unable to load territories.")}`);
  if ((territories ?? []).length !== territoryIds.length) redirect(`/?module=sales-rep-agency-territory-add&agency=${agencyId}&error=Choose%20active%20territories%20only.`);
  const existingIds = new Set((existingAssignments ?? []).map((assignment) => assignment.territory_id));
  const newTerritoryIds = territoryIds.filter((territoryId) => !existingIds.has(territoryId));
  if (newTerritoryIds.length) {
    const { error } = await supabase.from("territory_assignment").insert(newTerritoryIds.map((territory_id) => ({ sales_rep_agency_id: agencyId, territory_id })));
    if (error) redirect(`/?module=sales-rep-agency-territory-add&agency=${agencyId}&error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/");
  redirect(`/?module=sales-rep-agency&agency=${agencyId}&agency_tab=territories`);
}

async function deactivateWarehousesAction(formData: FormData) {
  "use server";
  const warehouseIds = formData.getAll("warehouse_ids").map(String).filter(Boolean);
  if (warehouseIds.length === 0) redirect("/?module=admin&admin_tab=warehouse");
  const { error } = await createSupabaseAdminClient().from("warehouse").update({ is_active: false }).in("id", warehouseIds);
  if (error) redirect(`/?module=admin&admin_tab=warehouse&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect("/?module=admin&admin_tab=warehouse");
}

async function updateWarehouseAction(formData: FormData) {
  "use server";
  const optionalText = (key: string) => textValue(formData, key) || null;
  const warehouseId = textValue(formData, "warehouse_id");
  if (!warehouseId) redirect("/?module=admin&admin_tab=warehouse");
  const update = formData.get("deactivate") === "true" ? { is_active: false } : {
    address_line_1: optionalText("address_line_1"), address_line_2: optionalText("address_line_2"), city: optionalText("city"),
    country: textValue(formData, "country") || "United States", country_code: (textValue(formData, "country_code") || "USA").toUpperCase(),
    name: textValue(formData, "name"), notes: optionalText("notes"), postal_code: optionalText("postal_code"),
    state_province: optionalText("state_province"), warehouse_code: textValue(formData, "warehouse_code").toUpperCase(),
  };
  const { error } = await createSupabaseAdminClient().from("warehouse").update(update).eq("id", warehouseId);
  if (error) redirect(`/?module=admin-warehouse-edit&warehouse=${warehouseId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${warehouseId}`);
}

async function createWarehouseZoneAction(formData: FormData) {
  "use server";
  const warehouseId = textValue(formData, "warehouse_id");
  const zoneCode = textValue(formData, "zone_code").toUpperCase();
  const name = textValue(formData, "name");
  if (!warehouseId || !zoneCode || !name) {
    redirect(`/?module=admin-zone-add&warehouse=${warehouseId}&error=Zone%20code%20and%20name%20are%20required.`);
  }
  const { error } = await createSupabaseAdminClient().from("warehouse_zone").insert({
    description: textValue(formData, "description") || null,
    name,
    warehouse_id: warehouseId,
    zone_code: zoneCode,
  });
  if (error) redirect(`/?module=admin-zone-add&warehouse=${warehouseId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${warehouseId}`);
}

async function createWarehouseAisleAction(formData: FormData) {
  "use server";
  const warehouseId = textValue(formData, "warehouse_id");
  const zoneId = textValue(formData, "warehouse_zone_id");
  const aisleCode = textValue(formData, "aisle_code").toUpperCase();
  const name = textValue(formData, "name");
  if (!warehouseId || !zoneId || !aisleCode || !name) {
    redirect(`/?module=admin-aisle-add&warehouse=${warehouseId}&error=Zone%2C%20aisle%20code%2C%20and%20aisle%20name%20are%20required.`);
  }
  const { data: zone, error: zoneError } = await createSupabaseAdminClient().from("warehouse_zone").select("id").eq("id", zoneId).eq("warehouse_id", warehouseId).maybeSingle();
  if (zoneError || !zone) redirect(`/?module=admin-aisle-add&warehouse=${warehouseId}&error=${encodeURIComponent(zoneError?.message ?? "Choose a zone from this warehouse.")}`);
  const { error } = await createSupabaseUntypedAdminClient().from("warehouse_aisle").insert({
    aisle_code: aisleCode,
    description: textValue(formData, "description") || null,
    name,
    warehouse_zone_id: zoneId,
  });
  if (error) redirect(`/?module=admin-aisle-add&warehouse=${warehouseId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${warehouseId}`);
}

async function createWarehouseSectionAction(formData: FormData) {
  "use server";
  const warehouseId = textValue(formData, "warehouse_id");
  const zoneId = textValue(formData, "warehouse_zone_id");
  const aisleId = textValue(formData, "warehouse_aisle_id");
  const sectionCode = textValue(formData, "section_code").toUpperCase();
  const sectionName = textValue(formData, "section_name");
  if (!warehouseId || !zoneId || !aisleId || !sectionCode || !sectionName) redirect(`/?module=admin-section-add&warehouse=${warehouseId}&error=Zone%2C%20aisle%2C%20section%20code%2C%20and%20section%20name%20are%20required.`);
  const { data: zone } = await createSupabaseAdminClient().from("warehouse_zone").select("id").eq("id", zoneId).eq("warehouse_id", warehouseId).maybeSingle();
  const { data: aisle, error: aisleError } = await createSupabaseUntypedAdminClient().from("warehouse_aisle").select("id").eq("id", aisleId).eq("warehouse_zone_id", zoneId).maybeSingle();
  if (!zone || aisleError || !aisle) redirect(`/?module=admin-section-add&warehouse=${warehouseId}&error=${encodeURIComponent(aisleError?.message ?? "Choose a valid zone and aisle.")}`);
  const { error } = await createSupabaseUntypedAdminClient().from("warehouse_location").insert({ warehouse_id: warehouseId, warehouse_zone_id: zoneId, warehouse_aisle_id: aisleId, location_code: sectionCode, location_name: sectionName, location_type: "bin", is_pickable: formData.get("is_pickable") === "on", notes: textValue(formData, "notes") || null });
  if (error) redirect(`/?module=admin-section-add&warehouse=${warehouseId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${warehouseId}`);
}

async function updateWarehouseZoneAction(formData: FormData) {
  "use server";
  const warehouseId = textValue(formData, "warehouse_id");
  const zoneId = textValue(formData, "zone_id");
  const zoneCode = textValue(formData, "zone_code").toUpperCase();
  const name = textValue(formData, "name");
  if (!warehouseId || !zoneId || !zoneCode || !name) redirect(`/?module=admin-zone-edit&warehouse=${warehouseId}&zone=${zoneId}&error=Zone%20code%20and%20name%20are%20required.`);
  const { error } = await createSupabaseAdminClient().from("warehouse_zone").update({ description: textValue(formData, "description") || null, name, zone_code: zoneCode }).eq("id", zoneId).eq("warehouse_id", warehouseId);
  if (error) redirect(`/?module=admin-zone-edit&warehouse=${warehouseId}&zone=${zoneId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${warehouseId}`);
}

async function updateWarehouseAisleAction(formData: FormData) {
  "use server";
  const warehouseId = textValue(formData, "warehouse_id");
  const aisleId = textValue(formData, "aisle_id");
  const zoneId = textValue(formData, "warehouse_zone_id");
  const aisleCode = textValue(formData, "aisle_code").toUpperCase();
  const name = textValue(formData, "name");
  if (!warehouseId || !aisleId || !zoneId || !aisleCode || !name) redirect(`/?module=admin-aisle-edit&warehouse=${warehouseId}&aisle=${aisleId}&error=Zone%2C%20aisle%20code%2C%20and%20aisle%20name%20are%20required.`);
  const { data: existingAisle } = await createSupabaseUntypedAdminClient().from("warehouse_aisle").select("warehouse_zone_id").eq("id", aisleId).maybeSingle();
  const { data: existingZone } = existingAisle ? await createSupabaseAdminClient().from("warehouse_zone").select("id").eq("id", existingAisle.warehouse_zone_id).eq("warehouse_id", warehouseId).maybeSingle() : { data: null };
  if (!existingZone) redirect(`/?module=admin-aisle-edit&warehouse=${warehouseId}&aisle=${aisleId}&error=Aisle%20not%20found%20for%20this%20warehouse.`);
  const { data: zone } = await createSupabaseAdminClient().from("warehouse_zone").select("id").eq("id", zoneId).eq("warehouse_id", warehouseId).maybeSingle();
  if (!zone) redirect(`/?module=admin-aisle-edit&warehouse=${warehouseId}&aisle=${aisleId}&error=Choose%20a%20zone%20from%20this%20warehouse.`);
  const { error } = await createSupabaseUntypedAdminClient().from("warehouse_aisle").update({ aisle_code: aisleCode, description: textValue(formData, "description") || null, name, warehouse_zone_id: zoneId }).eq("id", aisleId);
  if (error) redirect(`/?module=admin-aisle-edit&warehouse=${warehouseId}&aisle=${aisleId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${warehouseId}`);
}

async function updateWarehouseSectionAction(formData: FormData) {
  "use server";
  const warehouseId = textValue(formData, "warehouse_id");
  const sectionId = textValue(formData, "section_id");
  const zoneId = textValue(formData, "warehouse_zone_id");
  const aisleId = textValue(formData, "warehouse_aisle_id");
  const sectionCode = textValue(formData, "section_code").toUpperCase();
  const sectionName = textValue(formData, "section_name");
  if (!warehouseId || !sectionId || !zoneId || !aisleId || !sectionCode || !sectionName) redirect(`/?module=admin-section-edit&warehouse=${warehouseId}&section=${sectionId}&error=Zone%2C%20aisle%2C%20section%20code%2C%20and%20section%20name%20are%20required.`);
  const { data: zone } = await createSupabaseAdminClient().from("warehouse_zone").select("id").eq("id", zoneId).eq("warehouse_id", warehouseId).maybeSingle();
  const { data: aisle } = await createSupabaseUntypedAdminClient().from("warehouse_aisle").select("id").eq("id", aisleId).eq("warehouse_zone_id", zoneId).maybeSingle();
  if (!zone || !aisle) redirect(`/?module=admin-section-edit&warehouse=${warehouseId}&section=${sectionId}&error=Choose%20a%20valid%20zone%20and%20aisle.`);
  const { error } = await createSupabaseUntypedAdminClient().from("warehouse_location").update({ warehouse_zone_id: zoneId, warehouse_aisle_id: aisleId, location_code: sectionCode, location_name: sectionName, is_pickable: formData.get("is_pickable") === "on", notes: textValue(formData, "notes") || null }).eq("id", sectionId).eq("warehouse_id", warehouseId);
  if (error) redirect(`/?module=admin-section-edit&warehouse=${warehouseId}&section=${sectionId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${warehouseId}`);
}

async function deactivateWarehouseZoneAction(formData: FormData) {
  "use server";
  const warehouseId = textValue(formData, "warehouse_id");
  const zoneId = textValue(formData, "zone_id");
  if (!warehouseId || !zoneId) redirect(`/?module=admin&admin_tab=warehouse`);
  const { error } = await createSupabaseAdminClient().from("warehouse_zone").update({ is_active: false }).eq("id", zoneId).eq("warehouse_id", warehouseId);
  if (error) redirect(`/?module=admin-warehouse&warehouse=${warehouseId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${warehouseId}`);
}

async function deactivateWarehouseAisleAction(formData: FormData) {
  "use server";
  const warehouseId = textValue(formData, "warehouse_id");
  const aisleId = textValue(formData, "aisle_id");
  if (!warehouseId || !aisleId) redirect(`/?module=admin&admin_tab=warehouse`);
  const { data: aisle, error: aisleLookupError } = await createSupabaseUntypedAdminClient().from("warehouse_aisle").select("id, warehouse_zone_id").eq("id", aisleId).maybeSingle();
  const { data: zone } = aisle ? await createSupabaseAdminClient().from("warehouse_zone").select("id").eq("id", aisle.warehouse_zone_id).eq("warehouse_id", warehouseId).maybeSingle() : { data: null };
  if (aisleLookupError || !zone) redirect(`/?module=admin-warehouse&warehouse=${warehouseId}&error=${encodeURIComponent(aisleLookupError?.message ?? "Aisle not found for this warehouse.")}`);
  const { error } = await createSupabaseUntypedAdminClient().from("warehouse_aisle").update({ is_active: false }).eq("id", aisleId).eq("warehouse_zone_id", zone.id);
  if (error) redirect(`/?module=admin-warehouse&warehouse=${warehouseId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${warehouseId}`);
}

async function deactivateWarehouseSectionAction(formData: FormData) {
  "use server";
  const warehouseId = textValue(formData, "warehouse_id");
  const sectionId = textValue(formData, "section_id");
  if (!warehouseId || !sectionId) redirect(`/?module=admin&admin_tab=warehouse`);
  const { error } = await createSupabaseUntypedAdminClient().from("warehouse_location").update({ is_active: false }).eq("id", sectionId).eq("warehouse_id", warehouseId);
  if (error) redirect(`/?module=admin-warehouse&warehouse=${warehouseId}&error=${encodeURIComponent(error.message)}`);
  revalidatePath("/");
  redirect(`/?module=admin-warehouse&warehouse=${warehouseId}`);
}

async function saveProductSettingAction(formData: FormData) {
  "use server";
  const configurationType = textValue(formData, "configuration_type");
  const configurationId = textValue(formData, "configuration_id");
  const code = textValue(formData, "code").toUpperCase();
  const name = textValue(formData, "name");
  const brandId = textValue(formData, "brand_id");
  const optionalText = (key: string) => textValue(formData, key) || null;
  const errorUrl = (message: string) => `/?module=admin&admin_tab=products&error=${encodeURIComponent(message)}`;
  if (!["brand", "category", "suite", "style", "finish", "material", "part_role"].includes(configurationType) || !name || (!["finish", "material"].includes(configurationType) && !code)) redirect(errorUrl("A name and code are required."));
  if ((configurationType === "suite" || configurationType === "style") && !brandId) redirect(errorUrl("Choose a Brand."));
  const supabase = createSupabaseAdminClient();
  let error: { message: string } | null = null;

  if (configurationType === "brand") {
    const value = { brand_code: code, legal_company_name: optionalText("legal_company_name"), name };
    ({ error } = configurationId ? await supabase.from("brand").update(value).eq("id", configurationId) : await supabase.from("brand").insert(value));
  } else if (configurationType === "category") {
    const value = { category_code: code, name };
    ({ error } = configurationId ? await supabase.from("product_category").update(value).eq("id", configurationId) : await supabase.from("product_category").insert(value));
  } else if (configurationType === "suite") {
    const value = { brand_id: brandId, description: optionalText("description"), name, suite_code: code };
    ({ error } = configurationId ? await supabase.from("product_signature_suite").update(value).eq("id", configurationId) : await supabase.from("product_signature_suite").insert(value));
  } else if (configurationType === "style") {
    const styleSupabase = createSupabaseUntypedAdminClient();
    const selectedSuiteId = optionalText("signature_suite_id");
    const currentSuiteId = optionalText("current_signature_suite_id");
    const retainsCurrentSuite = formData.get("retain_signature_suite_assignment") === "on";
    const signatureSuiteId = selectedSuiteId || (retainsCurrentSuite ? currentSuiteId : null);
    if (signatureSuiteId) {
      const { data: signatureSuite, error: signatureSuiteError } = await styleSupabase.from("product_signature_suite").select("brand_id").eq("id", signatureSuiteId).single();
      if (signatureSuiteError) redirect(errorUrl(signatureSuiteError.message));
      if (signatureSuite.brand_id !== brandId) redirect(errorUrl("A Style and its Signature Suite must belong to the same Brand."));
    }
    const value = { brand_id: brandId, description: optionalText("description"), name, signature_suite_id: signatureSuiteId, style_code: code };
    ({ error } = configurationId ? await styleSupabase.from("product_style").update(value).eq("id", configurationId) : await styleSupabase.from("product_style").insert(value));
  } else if (configurationType === "finish") {
    const value = { description: optionalText("description"), finish_name: name };
    ({ error } = configurationId ? await supabase.from("finish").update(value).eq("id", configurationId) : await supabase.from("finish").insert(value));
  } else if (configurationType === "material") {
    const materialSupabase = createSupabaseUntypedAdminClient();
    const value = { description: optionalText("description"), material_name: name };
    ({ error } = configurationId ? await materialSupabase.from("material").update(value).eq("id", configurationId) : await materialSupabase.from("material").insert(value));
  } else {
    const roleSupabase = createSupabaseUntypedAdminClient();
    const value = { name, role_code: code };
    ({ error } = configurationId ? await roleSupabase.from("product_part_role_setting").update(value).eq("id", configurationId) : await roleSupabase.from("product_part_role_setting").insert(value));
  }

  if (error) redirect(errorUrl(error.message));
  revalidatePath("/");
  redirect("/?module=admin&admin_tab=products");
}

async function deactivateProductSettingAction(formData: FormData) {
  "use server";
  const configurationType = textValue(formData, "configuration_type");
  const configurationId = textValue(formData, "configuration_id");
  const errorUrl = (message: string) => `/?module=admin&admin_tab=products&error=${encodeURIComponent(message)}`;
  if (!["brand", "category", "suite", "style", "finish", "material", "part_role"].includes(configurationType) || !configurationId) redirect(errorUrl("Choose a product setting to deactivate."));
  const supabase = createSupabaseAdminClient();
  let error: { message: string } | null = null;
  if (configurationType === "brand") ({ error } = await supabase.from("brand").update({ is_active: false }).eq("id", configurationId));
  else if (configurationType === "category") ({ error } = await supabase.from("product_category").update({ is_active: false }).eq("id", configurationId));
  else if (configurationType === "suite") ({ error } = await supabase.from("product_signature_suite").update({ is_active: false }).eq("id", configurationId));
  else if (configurationType === "style") ({ error } = await createSupabaseUntypedAdminClient().from("product_style").update({ is_active: false }).eq("id", configurationId));
  else if (configurationType === "finish") ({ error } = await supabase.from("finish").update({ is_active: false }).eq("id", configurationId));
  else if (configurationType === "material") ({ error } = await createSupabaseUntypedAdminClient().from("material").update({ is_active: false }).eq("id", configurationId));
  else ({ error } = await createSupabaseUntypedAdminClient().from("product_part_role_setting").update({ is_active: false }).eq("id", configurationId));
  if (error) redirect(errorUrl(error.message));
  revalidatePath("/");
  redirect("/?module=admin&admin_tab=products");
}

async function saveCustomerSettingAction(formData: FormData) {
  "use server";
  const configurationType = textValue(formData, "configuration_type");
  const configurationId = textValue(formData, "configuration_id");
  const code = textValue(formData, "code").toLowerCase().replace(/\s+/g, "_");
  const name = textValue(formData, "name");
  const errorUrl = (message: string) => `/?module=admin&admin_tab=customers&error=${encodeURIComponent(message)}`;
  if (!name || !/^[a-z][a-z0-9_]*$/.test(code) || !["account_type", "business_type", "status"].includes(configurationType)) redirect(errorUrl("A valid code and name are required."));
  const supabase = createSupabaseUntypedAdminClient();
  const description = textValue(formData, "description") || null;
  let error: { message: string } | null = null;
  if (configurationType === "account_type") {
    const value = { description, is_rep_type: formData.get("is_rep_type") === "on", name, type_code: code };
    ({ error } = configurationId ? await supabase.from("customer_account_type").update(value).eq("id", configurationId) : await supabase.from("customer_account_type").insert(value));
  } else if (configurationType === "business_type") {
    const value = { description, name, type_code: code };
    ({ error } = configurationId ? await supabase.from("customer_business_type").update(value).eq("id", configurationId) : await supabase.from("customer_business_type").insert(value));
  } else {
    const value = { description, name, status_code: code };
    ({ error } = configurationId ? await supabase.from("customer_status_setting").update(value).eq("id", configurationId) : await supabase.from("customer_status_setting").insert(value));
  }
  if (error) redirect(errorUrl(error.message));
  revalidatePath("/");
  redirect("/?module=admin&admin_tab=customers");
}

async function deactivateCustomerSettingAction(formData: FormData) {
  "use server";
  const configurationType = textValue(formData, "configuration_type");
  const configurationId = textValue(formData, "configuration_id");
  const errorUrl = (message: string) => `/?module=admin&admin_tab=customers&error=${encodeURIComponent(message)}`;
  if (!configurationId || !["account_type", "business_type", "status"].includes(configurationType)) redirect(errorUrl("Choose a customer setting to deactivate."));
  const table = configurationType === "account_type" ? "customer_account_type" : configurationType === "business_type" ? "customer_business_type" : "customer_status_setting";
  const { error } = await createSupabaseUntypedAdminClient().from(table).update({ is_active: false }).eq("id", configurationId);
  if (error) redirect(errorUrl(error.message));
  revalidatePath("/");
  redirect("/?module=admin&admin_tab=customers");
}

async function saveFreightLevelAction(formData: FormData) {
  "use server";

  const freightLevelId = textValue(formData, "freight_level_id");
  const levelName = textValue(formData, "level_name");
  const freeFreightAllowanceText = textValue(formData, "free_freight_allowance");
  const freightRatePercentText = textValue(formData, "freight_rate_percent");
  const freeFreightAllowance = Number(freeFreightAllowanceText);
  const freightRatePercent = Number(freightRatePercentText);
  const errorUrl = (message: string) =>
    `/?module=admin&admin_tab=freight&freight_tab=levels&error=${encodeURIComponent(message)}`;

  if (
    !levelName ||
    !freeFreightAllowanceText ||
    !Number.isFinite(freeFreightAllowance) ||
    freeFreightAllowance < 0 ||
    !freightRatePercentText ||
    !Number.isFinite(freightRatePercent) ||
    freightRatePercent < 0
  ) {
    redirect(errorUrl("Enter a freight level name, a non-negative FFA, and a freight rate."));
  }

  let customerGroups: FreightLevelCustomerGroupInput[];
  try {
    customerGroups = JSON.parse(
      textValue(formData, "customer_groups") || "[]",
    ) as FreightLevelCustomerGroupInput[];
  } catch {
    redirect(errorUrl("Customer groups could not be read. Please add them again."));
  }
  if (!customerGroups.length) {
    redirect(errorUrl("Add at least one customer group to this freight level."));
  }
  if (
    customerGroups.some(
      (group) =>
        !group.accountTypeId ||
        !["any", "yes", "no"].includes(group.primaryShowroomRequirement),
    )
  ) {
    redirect(errorUrl("Each customer group must have a valid account type."));
  }

  const supabase = createSupabaseUntypedAdminClient();
  const accountTypeIds = [...new Set(customerGroups.map((group) => group.accountTypeId))];
  const { data: accountTypes, error: accountTypesError } = await supabase
    .from("customer_account_type")
    .select("id, type_code")
    .in("id", accountTypeIds)
    .eq("is_active", true);
  if (accountTypesError) redirect(errorUrl(accountTypesError.message));
  if ((accountTypes ?? []).length !== accountTypeIds.length) {
    redirect(errorUrl("One or more selected account types are no longer active."));
  }

  const accountTypeById = new Map(
    (accountTypes ?? []).map((accountType) => [accountType.id, accountType]),
  );
  const normalizedGroups = customerGroups.map((group) => {
    const accountType = accountTypeById.get(group.accountTypeId);
    return {
      account_type_id: group.accountTypeId,
      primary_showroom_requirement:
        accountType?.type_code === "stocking_dealer"
          ? group.primaryShowroomRequirement === "yes"
            ? true
            : group.primaryShowroomRequirement === "no"
              ? false
              : null
          : null,
    };
  });
  const groupKeys = new Set(
    normalizedGroups.map(
      (group) =>
        `${group.account_type_id}:${group.primary_showroom_requirement ?? "any"}`,
    ),
  );
  if (groupKeys.size !== normalizedGroups.length) {
    redirect(errorUrl("The same customer group can only be added once to a freight level."));
  }

  const value = {
    free_freight_allowance: freeFreightAllowance,
    freight_rate_percent: freightRatePercent,
    is_active: formData.get("is_active") === "on",
    level_name: levelName,
  };
  const levelResult = freightLevelId
    ? await supabase
        .from("freight_level")
        .update(value)
        .eq("id", freightLevelId)
        .select("id")
        .single()
    : await supabase.from("freight_level").insert(value).select("id").single();
  if (levelResult.error || !levelResult.data) {
    redirect(errorUrl(levelResult.error?.message ?? "Freight level could not be saved."));
  }

  const { error: removeGroupsError } = await supabase
    .from("freight_level_customer_group")
    .delete()
    .eq("freight_level_id", levelResult.data.id);
  if (removeGroupsError) redirect(errorUrl(removeGroupsError.message));

  const { error: createGroupsError } = await supabase
    .from("freight_level_customer_group")
    .insert(
      normalizedGroups.map((group) => ({
        ...group,
        freight_level_id: levelResult.data.id,
      })),
    );
  if (createGroupsError) redirect(errorUrl(createGroupsError.message));

  revalidatePath("/");
  redirect("/?module=admin&admin_tab=freight&freight_tab=levels");
}

async function saveFreightCarrierAction(formData: FormData) {
  "use server";

  const carrierId = textValue(formData, "freight_carrier_id");
  const carrierName = textValue(formData, "carrier_name");
  const freightType = textValue(formData, "freight_type");
  const errorUrl = (message: string) => `/?module=admin&admin_tab=freight&freight_tab=carriers&error=${encodeURIComponent(message)}`;
  if (!carrierName || !["small_parcel_ground", "ltl", "sea_freight"].includes(freightType)) redirect(errorUrl("Enter a carrier name and select a freight type."));

  const rawWebsite = textValue(formData, "website");
  const website = rawWebsite && !/^https?:\/\//i.test(rawWebsite) ? `https://${rawWebsite}` : rawWebsite;
  if (website) {
    try {
      new URL(website);
    } catch {
      redirect(errorUrl("Enter a valid website, such as www.example.com."));
    }
  }
  const value = {
    carrier_name: carrierName,
    contact_email: textValue(formData, "contact_email") || null,
    contact_name: textValue(formData, "contact_name") || null,
    freight_type: freightType,
    is_active: formData.get("is_active") === "on",
    website: website || null,
  };
  const supabase = createSupabaseUntypedAdminClient();
  const result = carrierId ? await supabase.from("freight_carrier").update(value).eq("id", carrierId) : await supabase.from("freight_carrier").insert(value);
  if (result.error) redirect(errorUrl(result.error.message));
  revalidatePath("/");
  redirect("/?module=admin&admin_tab=freight&freight_tab=carriers");
}

async function saveDropshipSettingsAction(formData: FormData) {
  "use server";

  const rateText = textValue(formData, "dropship_rate_percent");
  const ratePercent = Number(rateText);
  const residentialRateText = textValue(formData, "residential_surcharge_rate_percent");
  const residentialSurchargeRatePercent = Number(residentialRateText);
  const errorUrl = (message: string) =>
    `/?module=admin&admin_tab=freight&freight_tab=dropship&error=${encodeURIComponent(message)}`;
  if (!rateText || !residentialRateText || !Number.isFinite(ratePercent) || ratePercent < 0 || !Number.isFinite(residentialSurchargeRatePercent) || residentialSurchargeRatePercent < 0) {
    redirect(errorUrl("Enter non-negative Dropship and Residential Surcharge rates."));
  }

  const { error } = await createSupabaseUntypedAdminClient()
    .from("system_setting")
    .upsert(
      {
        category: "shipping",
        default_value_json: { isActive: true, ratePercent: 0, residentialSurchargeActive: false, residentialSurchargeRatePercent: 0 },
        description:
          "Controls the percentage fee applied to manual Ship-to / Drop Ship orders.",
        setting_key: "dropship_settings",
        setting_label: "Dropship Settings",
        setting_value: {
          isActive: formData.get("is_active_dropship") === "on",
          ratePercent,
          residentialSurchargeActive: formData.get("is_residential_surcharge_active") === "on",
          residentialSurchargeRatePercent,
        },
        validation_json: { type: "object" },
        value_type: "json",
      },
      { onConflict: "setting_key" },
    );
  if (error) redirect(errorUrl(error.message));

  revalidatePath("/");
  redirect("/?module=admin&admin_tab=freight&freight_tab=dropship");
}

async function resolveShipmentCarrier(formData: FormData) {
  const carrierId = textValue(formData, "freight_carrier_id");
  if (!carrierId) {
    return {
      carrier: textValue(formData, "existing_carrier") || null,
      shippingType: textValue(formData, "existing_shipping_type") || null,
    };
  }
  const { data, error } = await createSupabaseUntypedAdminClient()
    .from("freight_carrier")
    .select("carrier_name, freight_type")
    .eq("id", carrierId)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("The selected freight carrier is no longer active.");
  const shippingTypeByFreightType: Record<string, string> = { small_parcel_ground: "parcel", ltl: "ltl", sea_freight: "sea_freight" };
  return { carrier: data.carrier_name, shippingType: shippingTypeByFreightType[data.freight_type] ?? null };
}

async function assignStyleToSignatureSuiteAction(formData: FormData) {
  "use server";
  const signatureSuiteId = textValue(formData, "signature_suite_id");
  const styleId = textValue(formData, "style_id");
  const errorUrl = (message: string) => `/?module=admin&admin_tab=products&error=${encodeURIComponent(message)}`;
  if (!signatureSuiteId || !styleId) redirect(errorUrl("Select a Style to add under the Signature Suite."));
  const supabase = createSupabaseUntypedAdminClient();
  const [{ data: signatureSuite, error: signatureSuiteError }, { data: style, error: styleError }] = await Promise.all([
    supabase.from("product_signature_suite").select("brand_id").eq("id", signatureSuiteId).single(),
    supabase.from("product_style").select("brand_id").eq("id", styleId).is("signature_suite_id", null).single(),
  ]);
  if (signatureSuiteError) redirect(errorUrl(signatureSuiteError.message));
  if (styleError) redirect(errorUrl(styleError.message));
  if (!signatureSuite.brand_id || signatureSuite.brand_id !== style.brand_id) redirect(errorUrl("A Style and its Signature Suite must belong to the same Brand."));
  const { error } = await supabase.from("product_style").update({ signature_suite_id: signatureSuiteId }).eq("id", styleId).is("signature_suite_id", null);
  if (error) redirect(errorUrl(error.message));
  revalidatePath("/");
  redirect("/?module=admin&admin_tab=products");
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

async function resolveFreightLevelForCustomer(
  customerId: string,
  accountTypeId: string,
  locationId?: string | null,
): Promise<FreightLevelConfig | null> {
  const supabase = createSupabaseUntypedAdminClient();
  const [{ data: accountPolicy, error: accountPolicyError }, { data: primaryShowroom, error: showroomError }, { data: locationPolicy, error: locationPolicyError }] = await Promise.all([
    supabase.from("customer_freight_policy").select("freight_terms, freight_level_id, freight_allowance_amount, flat_rate_percent").eq("customer_account_id", customerId).is("customer_location_id", null).eq("is_active", true).order("is_default", { ascending: false }).limit(1).maybeSingle(),
    locationId ? supabase.from("primary_showroom_enrollment").select("id").eq("customer_account_id", customerId).eq("customer_location_id", locationId).eq("program_status", "active").maybeSingle() : Promise.resolve({ data: null, error: null }),
    locationId ? supabase.from("customer_freight_policy").select("freight_level_id, freight_allowance_amount, flat_rate_percent").eq("customer_account_id", customerId).eq("customer_location_id", locationId).eq("is_active", true).order("is_default", { ascending: false }).limit(1).maybeSingle() : Promise.resolve({ data: null, error: null }),
  ]);
  if (accountPolicyError) throw new Error(accountPolicyError.message);
  if (showroomError) throw new Error(showroomError.message);
  if (locationPolicyError) throw new Error(locationPolicyError.message);
  const isPrimaryShowroom = Boolean(primaryShowroom);

  const loadLevel = async (levelId: string): Promise<FreightLevelConfig | null> => {
    const { data, error } = await supabase.from("freight_level").select("id, level_name, free_freight_allowance, freight_rate_percent").eq("id", levelId).eq("is_active", true).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? { id: data.id, level_name: data.level_name, free_freight_allowance: Number(data.free_freight_allowance), freight_rate_percent: Number(data.freight_rate_percent) } : null;
  };
  const customLevel = (
    policy: {
      flat_rate_percent?: number | string | null;
      freight_allowance_amount?: number | string | null;
      freight_level_id?: string | null;
    } | null,
    id: string,
  ): FreightLevelConfig | null => {
    if (
      policy?.freight_level_id ||
      policy?.freight_allowance_amount === null ||
      policy?.freight_allowance_amount === undefined ||
      policy?.flat_rate_percent === null ||
      policy?.flat_rate_percent === undefined
    ) {
      return null;
    }
    return {
      free_freight_allowance: Number(policy.freight_allowance_amount),
      freight_rate_percent: Number(policy.flat_rate_percent),
      id,
      level_name: "Custom",
    };
  };

  if (locationPolicy?.freight_level_id) return loadLevel(locationPolicy.freight_level_id);
  const locationCustomLevel = customLevel(locationPolicy, `custom-location-${locationId}`);
  if (locationCustomLevel) return locationCustomLevel;

  if (isPrimaryShowroom) {
    const { data: levelOne, error: levelOneError } = await supabase.from("freight_level").select("id").eq("level_name", "Level I").eq("is_active", true).maybeSingle();
    if (levelOneError) throw new Error(levelOneError.message);
    if (levelOne) return loadLevel(levelOne.id);
  }

  if (!isPrimaryShowroom && accountPolicy?.freight_level_id) {
    return loadLevel(accountPolicy.freight_level_id);
  }
  if (!isPrimaryShowroom) {
    const accountCustomLevel = customLevel(accountPolicy, `custom-account-${customerId}`);
    if (accountCustomLevel) return accountCustomLevel;
  }

  const { data: groups, error: groupsError } = await supabase
    .from("freight_level_customer_group")
    .select("freight_level_id, primary_showroom_requirement")
    .eq("account_type_id", accountTypeId);
  if (groupsError) throw new Error(groupsError.message);
  if (!groups?.length) return null;

  const locationSpecificGroups = groups.filter(
    (group) => group.primary_showroom_requirement === isPrimaryShowroom,
  );
  const matchingLevelIds = [
    ...new Set(
      (locationSpecificGroups.length ? locationSpecificGroups : groups.filter((group) => group.primary_showroom_requirement === null))
        .map((group) => group.freight_level_id),
    ),
  ];
  if (!matchingLevelIds.length) return null;

  const { data: levels, error: levelsError } = await supabase
    .from("freight_level")
    .select("id, level_name, free_freight_allowance, freight_rate_percent")
    .in("id", matchingLevelIds)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("level_name", { ascending: true })
    .limit(1);
  if (levelsError) throw new Error(levelsError.message);
  if (!levels?.[0]) return null;

  return {
    free_freight_allowance: Number(levels[0].free_freight_allowance),
    freight_rate_percent: Number(levels[0].freight_rate_percent),
    id: levels[0].id,
    level_name: levels[0].level_name,
  };
}

function defaultFreightCharge(
  subtotal: number,
  freightLevel: FreightLevelConfig | null,
) {
  if (!freightLevel || subtotal >= freightLevel.free_freight_allowance) {
    return 0;
  }
  return Math.round(subtotal * (freightLevel.freight_rate_percent / 100));
}

type DropshipSettings = {
  freightTerms: "prepaid" | "collect";
  isActive: boolean;
  ratePercent: number;
  residentialSurchargeActive: boolean;
  residentialSurchargeRatePercent: number;
};

async function getDropshipSettings(): Promise<Omit<DropshipSettings, "freightTerms">> {
  const { data, error } = await createSupabaseUntypedAdminClient()
    .from("system_setting")
    .select("setting_value")
    .eq("setting_key", "dropship_settings")
    .maybeSingle();
  if (error) throw new Error(error.message);
  const value = data?.setting_value as { isActive?: unknown; ratePercent?: unknown; residentialSurchargeActive?: unknown; residentialSurchargeRatePercent?: unknown } | null;
  const ratePercent = Number(value?.ratePercent ?? 0);
  const residentialSurchargeRatePercent = Number(value?.residentialSurchargeRatePercent ?? 0);
  return {
    isActive: value?.isActive !== false,
    ratePercent: Number.isFinite(ratePercent) && ratePercent >= 0 ? ratePercent : 0,
    residentialSurchargeActive: value?.residentialSurchargeActive === true,
    residentialSurchargeRatePercent: Number.isFinite(residentialSurchargeRatePercent) && residentialSurchargeRatePercent >= 0 ? residentialSurchargeRatePercent : 0,
  };
}

async function resolveDropshipSettingsForCustomer(
  customerId: string,
  accountTypeId?: string,
): Promise<DropshipSettings & { freightLevel: FreightLevelConfig | null }> {
  const supabase = createSupabaseUntypedAdminClient();
  const [systemSettings, policyResult, accountResult] = await Promise.all([
    getDropshipSettings(),
    supabase
      .from("customer_freight_policy")
      .select("freight_terms, dropship_freight_terms, dropship_freight_level_id, dropship_freight_allowance_amount, dropship_freight_rate_percent, dropship_is_active, dropship_rate_percent, residential_surcharge_is_active, residential_surcharge_rate_percent")
      .eq("customer_account_id", customerId)
      .is("customer_location_id", null)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .limit(1)
      .maybeSingle(),
    accountTypeId
      ? Promise.resolve({ data: { account_type_id: accountTypeId }, error: null })
      : supabase.from("customer_account").select("account_type_id").eq("id", customerId).maybeSingle(),
  ]);
  if (policyResult.error) throw new Error(policyResult.error.message);
  if (accountResult.error || !accountResult.data) {
    throw new Error(accountResult.error?.message ?? "Customer account was not found.");
  }

  const policy = policyResult.data;
  const loadLevel = async (id: string) => {
    const { data, error } = await supabase
      .from("freight_level")
      .select("id, level_name, free_freight_allowance, freight_rate_percent")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data
      ? {
          id: data.id,
          level_name: data.level_name,
          free_freight_allowance: Number(data.free_freight_allowance),
          freight_rate_percent: Number(data.freight_rate_percent),
        }
      : null;
  };
  const hasCustomFreightLevel =
    !policy?.dropship_freight_level_id &&
    policy?.dropship_freight_allowance_amount !== null &&
    policy?.dropship_freight_allowance_amount !== undefined &&
    policy?.dropship_freight_rate_percent !== null &&
    policy?.dropship_freight_rate_percent !== undefined;
  const freightLevel = policy?.dropship_freight_level_id
    ? await loadLevel(policy.dropship_freight_level_id)
    : hasCustomFreightLevel
      ? {
          id: `custom-dropship-${customerId}`,
          level_name: "Custom",
          free_freight_allowance: Number(policy.dropship_freight_allowance_amount),
          freight_rate_percent: Number(policy.dropship_freight_rate_percent),
        }
      : await resolveFreightLevelForCustomer(customerId, accountResult.data.account_type_id);

  return {
    freightLevel,
    freightTerms:
      policy?.dropship_freight_terms === "collect" || policy?.dropship_freight_terms === "prepaid"
        ? policy.dropship_freight_terms
        : policy?.freight_terms === "collect" || policy?.freight_terms === "prepaid"
          ? policy.freight_terms
          : "prepaid",
    isActive: policy?.dropship_is_active ?? systemSettings.isActive,
    ratePercent: policy?.dropship_rate_percent === null || policy?.dropship_rate_percent === undefined
      ? systemSettings.ratePercent
      : Number(policy.dropship_rate_percent),
    residentialSurchargeActive: policy?.residential_surcharge_is_active ?? systemSettings.residentialSurchargeActive,
    residentialSurchargeRatePercent:
      policy?.residential_surcharge_rate_percent === null || policy?.residential_surcharge_rate_percent === undefined
        ? systemSettings.residentialSurchargeRatePercent
        : Number(policy.residential_surcharge_rate_percent),
  };
}

function dropshipFee(
  amount: number,
  isDropship: boolean,
  settings: Omit<DropshipSettings, "freightTerms">,
) {
  if (!isDropship || !settings.isActive) return 0;
  return Math.round(amount * (settings.ratePercent / 100) * 100) / 100;
}

function residentialSurcharge(amount: number, isResidentialDropship: boolean, settings: Omit<DropshipSettings, "freightTerms">) {
  if (!isResidentialDropship || !settings.residentialSurchargeActive) return 0;
  return Math.round(amount * (settings.residentialSurchargeRatePercent / 100) * 100) / 100;
}

async function shipmentFreightCharge(
  order: {
    customer_account_id: string;
    customer_location_id: string | null;
    is_dropship: boolean;
    subtotal_amount: number | string | null;
  },
  shipmentLines: {
    discountPercent: number | string | null;
    quantity: number | string;
    unitPrice: number | string;
  }[],
) {
  const supabase = createSupabaseUntypedAdminClient();
  const { data: account, error } = await supabase
    .from("customer_account")
    .select("account_type_id")
    .eq("id", order.customer_account_id)
    .maybeSingle();
  if (error || !account) {
    throw new Error(error?.message ?? "Customer account was not found.");
  }
  const freightLevel = order.is_dropship
    ? (await resolveDropshipSettingsForCustomer(
        order.customer_account_id,
        account.account_type_id,
      )).freightLevel
    : await resolveFreightLevelForCustomer(
        order.customer_account_id,
        account.account_type_id,
        order.customer_location_id,
      );
  if (
    !freightLevel ||
    Number(order.subtotal_amount ?? 0) >= freightLevel.free_freight_allowance
  ) {
    return 0;
  }
  const shipmentSubtotal = shipmentLines.reduce(
    (total, line) =>
      total +
      Number(line.quantity) *
        Number(line.unitPrice) *
        (1 - Number(line.discountPercent ?? 0) / 100),
    0,
  );
  return Math.round(shipmentSubtotal * (freightLevel.freight_rate_percent / 100));
}

async function refreshPackingListFreightCharge(
  packingListId: string,
  orderId: string,
) {
  const supabase = createSupabaseAdminClient();
  const [{ data: order, error: orderError }, { data: lines, error: linesError }] =
    await Promise.all([
      supabase
        .from("sales_order")
        .select("customer_account_id, customer_location_id, is_dropship, ship_to_snapshot_json, subtotal_amount")
        .eq("id", orderId)
        .maybeSingle(),
      supabase
        .from("packing_list_line")
        .select("quantity_shipped, unit_price_snapshot, discount_percent_snapshot")
        .eq("packing_list_id", packingListId),
    ]);
  if (orderError || linesError || !order) {
    throw new Error(orderError?.message ?? linesError?.message ?? "Order freight details could not be loaded.");
  }
  const shippingFee = await shipmentFreightCharge(
    order,
    (lines ?? []).map((line) => ({
      discountPercent: line.discount_percent_snapshot,
      quantity: line.quantity_shipped,
      unitPrice: line.unit_price_snapshot,
    })),
  );
  const shipmentSubtotal = (lines ?? []).reduce(
    (total, line) =>
      total +
      Number(line.quantity_shipped) *
        Number(line.unit_price_snapshot) *
        (1 - Number(line.discount_percent_snapshot ?? 0) / 100),
    0,
  );
  const dropshipSettings = await resolveDropshipSettingsForCustomer(
    order.customer_account_id,
  );
  let shipmentDropshipFee = dropshipFee(
    shipmentSubtotal,
    order.is_dropship,
    dropshipSettings,
  );
  shipmentDropshipFee += residentialSurcharge(
    shipmentSubtotal,
    order.is_dropship && (order.ship_to_snapshot_json as Record<string, unknown> | null)?.is_residential_address === true,
    dropshipSettings,
  );
  const { error } = await supabase
    .from("packing_list")
    .update({ dropship_fee_amount: shipmentDropshipFee, shipping_fee: shippingFee })
    .eq("id", packingListId)
    .eq("status", "draft")
    .eq("invoice_generation_status_snapshot", "not_invoiced");
  if (error) throw new Error(error.message);
}

async function createSalesOrderAction(formData: FormData) {
  "use server";

  const customerId = textValue(formData, "customer_id");
  const salesRepAgencyId = textValue(formData, "sales_rep_agency_id") || null;
  const customerPoNumber = textValue(formData, "customer_po_number");
  const orderDate = textValue(formData, "order_date");
  const orderSource = textValue(formData, "order_source") || "manual";
  const orderType = textValue(formData, "order_type") || "regular";
  const displayOrderType = textValue(formData, "display_order_type") || null;
  const isDropship = formData.get("is_dropship") === "on";
  const isResidentialDropship = isDropship && formData.get("dropship_residential_address") === "on";
  const locationId = textValue(formData, "customer_location_id") || null;
  const commissionOverrideEnabled =
    textValue(formData, "commission_override_enabled") === "1";
  const territoryOverrideId = textValue(formData, "territory_id_override") || null;
  const salesRepAgencyOverrideId =
    textValue(formData, "sales_rep_agency_id_override") || null;
  const salesRepOverrideId = textValue(formData, "sales_rep_id_override") || null;
  const payCommission = textValue(formData, "commission_payable") === "1";
  const requestedCommissionRate = textValue(formData, "commission_rate_percent");
  const notes = textValue(formData, "notes") || null;
  const productSearch = textValue(formData, "product_search");
  const fallbackUrl = salesRepAgencyId
    ? `/?module=sales-rep-agency-order&agency=${salesRepAgencyId}`
    : `/?module=new-order&customer=${customerId}`;

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
    agencyResult,
    billingResult,
    invoiceResult,
    freightResult,
    billToLocationResult,
    locationResult,
    locationCoverageResult,
    productsResult,
  ] = await Promise.all([
    supabase
      .from("customer_account")
      .select(
        "id, name, account_number, legacy_account_id, account_type_id, default_discount_percent, is_sales_tax_exempt, purchase_email",
      )
      .eq("id", customerId)
      .single(),
    salesRepAgencyId
      ? createSupabaseUntypedAdminClient()
          .from("sales_rep_agency")
          .select("id, customer_account_id")
          .eq("id", salesRepAgencyId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
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
        "freight_terms, ltl_freight_terms, ground_freight_terms, dropship_freight_terms, default_ltl_carrier, default_ltl_carrier_account_number, default_ground_carrier, default_ground_carrier_account_number, dropship_default_ltl_carrier, dropship_default_ltl_carrier_account_number, dropship_default_ground_carrier, dropship_default_ground_carrier_account_number",
      )
      .eq("customer_account_id", customerId)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("customer_location")
      .select(
        "location_name, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, receiver_name, phone, email",
      )
      .eq("customer_account_id", customerId)
      .eq("is_billing_address", true)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    locationId
      ? supabase
          .from("customer_location")
          .select(
            "id, location_name, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, receiver_name, phone, email, territory_id",
          )
          .eq("id", locationId)
          .eq("customer_account_id", customerId)
          .eq("is_shipping_address", true)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    !isDropship && locationId
      ? createSupabaseUntypedAdminClient()
          .from("customer_location_rep_assignment")
          .select("territory_id, sales_rep_agency_id, sales_rep_id")
          .eq("customer_location_id", locationId)
          .eq("coverage_role", "primary")
          .eq("status", "active")
          .is("end_date", null)
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
    agencyResult,
    billingResult,
    invoiceResult,
    freightResult,
    billToLocationResult,
    locationResult,
    locationCoverageResult,
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

  if (
    salesRepAgencyId &&
    (!agencyResult.data || agencyResult.data.customer_account_id !== customerId)
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("The agency order account is not available.")}`,
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

  const pricedLines = orderType === "catalog_marketing"
    ? effectiveLines.map((line) => ({ ...line, discountPercent: 100 }))
    : effectiveLines;

  if (
    pricedLines.length === 0 ||
    productById.size !== pricedLines.length
  ) {
    redirect(
      `${fallbackUrl}&error=One%20or%20more%20selected%20products%20are%20no%20longer%20available.`,
    );
  }

  const dropshipSettings = isDropship
    ? await resolveDropshipSettingsForCustomer(
        customerId,
        accountResult.data.account_type_id,
      )
    : null;
  const defaultFreightLevel = isDropship
    ? dropshipSettings?.freightLevel ?? null
    : await resolveFreightLevelForCustomer(
        customerId,
        accountResult.data.account_type_id,
        locationId,
      );
  const dropshipFreightTerms = dropshipSettings?.freightTerms ?? "prepaid";
  const shouldChargeCustomerFreight = !isDropship || dropshipFreightTerms === "prepaid";
  const defaultFreightAmount = shouldChargeCustomerFreight ? defaultFreightCharge(
    pricedLines.reduce(
      (sum, line) =>
        sum +
        Number(line.quantity) *
          Number(line.unitPrice) *
          (1 - Number(line.discountPercent) / 100),
      0,
    ),
    defaultFreightLevel,
  ) : 0;
  let defaultDropshipFee = 0;
  let residentialSurchargeAmount = 0;
  let residentialSurchargeRatePercent = 0;
  try {
    const settings = dropshipSettings ?? await resolveDropshipSettingsForCustomer(
      customerId,
      accountResult.data.account_type_id,
    );
    residentialSurchargeRatePercent = settings.residentialSurchargeRatePercent;
    defaultDropshipFee = dropshipFee(
      pricedLines.reduce(
        (sum, line) =>
          sum +
          Number(line.quantity) *
            Number(line.unitPrice) *
            (1 - Number(line.discountPercent) / 100),
        0,
      ),
      isDropship,
      settings,
    );
    residentialSurchargeAmount = shouldChargeCustomerFreight ? residentialSurcharge(
      pricedLines.reduce((sum, line) => sum + Number(line.quantity) * Number(line.unitPrice) * (1 - Number(line.discountPercent) / 100), 0),
      isResidentialDropship,
      settings,
    ) : 0;
    defaultDropshipFee += residentialSurchargeAmount;
  } catch (dropshipError) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(dropshipError instanceof Error ? dropshipError.message : "The Dropship Fee could not be calculated.")}`,
    );
  }

  const account = accountResult.data;
  const savedLocation = locationResult.data;
  const locationCoverage = locationCoverageResult.data;
  let resolvedTerritoryId =
    locationCoverage?.territory_id ?? savedLocation?.territory_id ?? null;
  let resolvedSalesRepAgencyId =
    salesRepAgencyId ?? locationCoverage?.sales_rep_agency_id ?? null;
  let resolvedSalesRepId = salesRepAgencyId
    ? null
    : locationCoverage?.sales_rep_id ?? null;

  if (commissionOverrideEnabled) {
    if (!territoryOverrideId) {
      if (salesRepAgencyOverrideId || salesRepOverrideId) {
        redirect(
          `${fallbackUrl}&error=${encodeURIComponent("Choose a territory before selecting a sales agency or sales rep.")}`,
        );
      }
      resolvedTerritoryId = null;
      resolvedSalesRepAgencyId = salesRepAgencyId;
      resolvedSalesRepId = null;
    } else {
      const coverageOptions = await getLocationCoverageOptions(territoryOverrideId);
      const selectedAgencyId = salesRepAgencyId ?? salesRepAgencyOverrideId;
      const selectedAgency = selectedAgencyId
        ? coverageOptions.agencies.find((agency) => agency.id === selectedAgencyId)
        : null;
      if (selectedAgencyId && !selectedAgency) {
        redirect(
          `${fallbackUrl}&error=${encodeURIComponent("Choose a sales agency that covers the selected territory.")}`,
        );
      }
      if (!selectedAgency && salesRepOverrideId) {
        redirect(
          `${fallbackUrl}&error=${encodeURIComponent("Choose a sales agency before selecting a sales rep.")}`,
        );
      }
      const agencyReps = selectedAgency
        ? coverageOptions.reps.filter(
            (rep) => rep.agencyId === selectedAgency.id,
          )
        : [];
      const selectedRep = salesRepOverrideId
        ? agencyReps.find((rep) => rep.id === salesRepOverrideId)
        : null;
      if (salesRepOverrideId && !selectedRep) {
        redirect(
          `${fallbackUrl}&error=${encodeURIComponent("Choose a sales rep assigned to the selected sales agency.")}`,
        );
      }
      resolvedTerritoryId = territoryOverrideId;
      resolvedSalesRepAgencyId = selectedAgency?.id ?? null;
      resolvedSalesRepId = salesRepAgencyId ? null : selectedRep?.id ?? null;
    }
  }
  const requestedCommissionRateValue = requestedCommissionRate
    ? Number(requestedCommissionRate)
    : null;
  if (
    requestedCommissionRateValue !== null &&
    (!Number.isFinite(requestedCommissionRateValue) ||
      requestedCommissionRateValue < 0 ||
      requestedCommissionRateValue > 100)
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Commission rates must be between 0 and 100 percent.")}`,
    );
  }
  const { data: resolvedCommissionAgency, error: resolvedCommissionAgencyError } =
    resolvedSalesRepAgencyId
      ? await createSupabaseUntypedAdminClient()
          .from("sales_rep_agency")
          .select("commission_default_percent")
          .eq("id", resolvedSalesRepAgencyId)
          .eq("status", "active")
          .maybeSingle()
      : { data: null, error: null };
  if (resolvedCommissionAgencyError) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(resolvedCommissionAgencyError.message)}`,
    );
  }
  const commissionRatePercent =
    payCommission && resolvedCommissionAgency
      ? requestedCommissionRateValue ??
        Number(resolvedCommissionAgency.commission_default_percent ?? 0)
      : null;
  const billToLocation = billToLocationResult.data;
  const dropshipName = textValue(formData, "dropship_name");
  const dropshipAddressLine1 = textValue(formData, "dropship_address_line_1");
  const dropshipCity = textValue(formData, "dropship_city");
  const dropshipStateProvince = textValue(formData, "dropship_state_province");
  const dropshipPostalCode = textValue(formData, "dropship_postal_code");
  const dropshipCountry =
    textValue(formData, "dropship_country") || "United States";
  const shippingContactEmail = textValue(formData, "shipping_contact_email");
  const shippingContactName = textValue(formData, "shipping_contact_name");
  const shippingContactPhone = textValue(formData, "shipping_contact_phone");

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
        shipping_contact_name:
          textValue(formData, "dropship_contact_name") || null,
        shipping_contact_phone:
          textValue(formData, "dropship_contact_phone") || null,
        shipping_contact_email:
          textValue(formData, "dropship_email") ||
          account.purchase_email ||
          null,
        is_residential_address:
          isResidentialDropship,
        residential_surcharge_amount: residentialSurchargeAmount,
        residential_surcharge_rate_percent: residentialSurchargeRatePercent,
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
        shipping_contact_name:
          shippingContactName || savedLocation!.receiver_name || null,
        shipping_contact_phone:
          shippingContactPhone || savedLocation!.phone || null,
        shipping_contact_email:
          shippingContactEmail ||
          savedLocation!.email ||
          account.purchase_email ||
          null,
      };
  const billToSnapshot = billToLocation
    ? {
        bill_to_display_name: billToLocation.location_name,
        address_line_1: billToLocation.address_line_1,
        address_line_2: billToLocation.address_line_2,
        city: billToLocation.city,
        state_province: billToLocation.state_province,
        postal_code: billToLocation.postal_code,
        country: billToLocation.country,
        country_code: billToLocation.country_code,
        shipping_contact_name: billToLocation.receiver_name,
        shipping_contact_phone: billToLocation.phone,
        shipping_contact_email: billToLocation.email,
      }
    : { bill_to_display_name: account.name };

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
      bill_to_snapshot_json: billToSnapshot,
      credit_hold_reason: onCreditHold ? "credit_limit_exceeded" : null,
      credit_hold_status: onCreditHold ? "on_credit_hold" : "none",
      credit_limit_snapshot: creditLimit,
      customer_account_id: customerId,
      customer_account_number_snapshot: account.account_number,
      customer_location_id: isDropship ? null : locationId,
      customer_name_snapshot: account.name,
      customer_po_number: customerPoNumber,
      commission_payable: payCommission,
      commission_rate_percent: commissionRatePercent,
      invoice_required: !["quote", "catalog_marketing"].includes(orderType),
      sales_order_number: quoteNumber,
      display_order_type:
        orderType === "display"
          ? (displayOrderType as
              | "primary_showroom_display"
              | "non_primary_display"
              | "other_display")
          : null,
      display_tracking_required: orderType === "display",
      dropship_fee_amount: defaultDropshipFee,
      ground_carrier_account_number_snapshot:
        isDropship && dropshipFreightTerms === "collect"
          ? freight?.dropship_default_ground_carrier_account_number ?? freight?.default_ground_carrier_account_number ?? null
          : freight?.default_ground_carrier_account_number ?? null,
      ground_carrier_snapshot:
        isDropship && dropshipFreightTerms === "collect"
          ? freight?.dropship_default_ground_carrier ?? freight?.default_ground_carrier ?? null
          : freight?.default_ground_carrier ?? null,
      ground_freight_terms_snapshot: isDropship ? dropshipFreightTerms : freight?.ground_freight_terms ?? "prepaid",
      freight_amount: defaultFreightAmount,
      is_dropship: isDropship,
      legacy_account_id_snapshot: account.legacy_account_id,
      ltl_carrier_account_number_snapshot:
        isDropship && dropshipFreightTerms === "collect"
          ? freight?.dropship_default_ltl_carrier_account_number ?? freight?.default_ltl_carrier_account_number ?? null
          : freight?.default_ltl_carrier_account_number ?? null,
      ltl_carrier_snapshot:
        isDropship && dropshipFreightTerms === "collect"
          ? freight?.dropship_default_ltl_carrier ?? freight?.default_ltl_carrier ?? null
          : freight?.default_ltl_carrier ?? null,
      ltl_freight_terms_snapshot: isDropship ? dropshipFreightTerms : freight?.ltl_freight_terms ?? "prepaid",
      notes,
      order_date: orderDate,
      order_source: orderSource as "manual",
      order_type: orderType as "regular" | "display" | "quote" | "catalog_marketing",
      payment_terms_snapshot: billingResult.data?.payment_terms ?? null,
      ship_to_display_name_snapshot: isDropship
        ? dropshipName
        : savedLocation!.location_name,
      ship_to_snapshot_json: shipToSnapshot,
      ship_to_type: isDropship ? "dropship" : "saved_location",
      sales_rep_agency_id_snapshot: resolvedSalesRepAgencyId,
      sales_rep_id_snapshot: resolvedSalesRepId,
      status: "open",
      shipping_readiness_status: "not_ready",
      territory_id_snapshot: resolvedTerritoryId,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(orderError?.message ?? "Order could not be created.")}`,
    );
  }

  const lineRows = pricedLines.map((line, index) => {
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

  redirect(salesRepAgencyId
    ? `/?module=sales-rep-agency&agency=${salesRepAgencyId}&agency_tab=orders&notice=${encodeURIComponent(orderType === "catalog_marketing" ? "No-charge marketing order created." : "Agency order created.")}`
    : `/?module=orders&order=${order.id}&notice=${encodeURIComponent(orderType === "quote" ? "Quote created." : "Order created.")}`,
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
  const { data: updatedOrderAmounts, error: updatedOrderAmountsError } =
    await supabase
      .from("sales_order")
      .select("subtotal_amount")
      .eq("id", orderId)
      .maybeSingle();
  if (updatedOrderAmountsError || !updatedOrderAmounts) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(updatedOrderAmountsError?.message ?? "Order totals could not be loaded.")}`,
    );
  }
  try {
    orderUpdate.dropship_fee_amount = dropshipFee(
      Number(updatedOrderAmounts.subtotal_amount ?? 0),
      orderAddressUpdate.is_dropship ?? currentOrder.is_dropship,
      await getDropshipSettings(),
    );
  } catch (dropshipError) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(dropshipError instanceof Error ? dropshipError.message : "The Dropship Fee could not be calculated.")}`,
    );
  }

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
        "id, customer_account_id, customer_location_id, sales_order_number, customer_po_number, order_type, status, credit_hold_status, is_dropship, ship_to_type, ship_to_snapshot_json, subtotal_amount",
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

  let shipmentCarrier: { carrier: string | null; shippingType: string | null };
  try {
    shipmentCarrier = await resolveShipmentCarrier(formData);
  } catch (carrierError) {
    redirect(`${fallbackUrl}&error=${encodeURIComponent(carrierError instanceof Error ? carrierError.message : "The freight carrier could not be selected.")}`);
  }
  const masterTrackingNumber =
    textValue(formData, "master_tracking_number") || null;
  const notes = textValue(formData, "shipment_notes") || null;
  const freightCostText = textValue(formData, "freight_cost");
  const freightCost = freightCostText === "" ? 0 : Number(freightCostText);
  if (!Number.isFinite(freightCost) || freightCost < 0) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Freight cost must be a valid non-negative amount.")}`,
    );
  }
  let shippingFee: number;
  try {
    shippingFee = await shipmentFreightCharge(
      order,
      selectedLines.map((line) => ({
        discountPercent: line.discount_percent,
        quantity: line.requestedQuantity,
        unitPrice: line.unit_price,
      })),
    );
  } catch (freightError) {
    redirect(`${fallbackUrl}&error=${encodeURIComponent(freightError instanceof Error ? freightError.message : "The shipment freight charge could not be calculated.")}`);
  }
  let shipmentDropshipFee = 0;
  let shipmentResidentialSurcharge = 0;
  try {
    const settings = await resolveDropshipSettingsForCustomer(
      order.customer_account_id,
    );
    const shipmentSubtotal = selectedLines.reduce(
      (sum, line) => sum + Number(line.requestedQuantity) * Number(line.unit_price) * (1 - Number(line.discount_percent) / 100),
      0,
    );
    shipmentDropshipFee = dropshipFee(
      shipmentSubtotal,
      order.is_dropship,
      settings,
    );
    shipmentResidentialSurcharge = residentialSurcharge(
      shipmentSubtotal,
      order.is_dropship && (order.ship_to_snapshot_json as Record<string, unknown> | null)?.is_residential_address === true,
      settings,
    );
    shipmentDropshipFee += shipmentResidentialSurcharge;
  } catch (dropshipError) {
    redirect(`${fallbackUrl}&error=${encodeURIComponent(dropshipError instanceof Error ? dropshipError.message : "The Dropship Fee could not be calculated.")}`);
  }
  const { data: shipment, error: shipmentError } = await supabase
    .from("freight_shipment")
    .insert({
      carrier: shipmentCarrier!.carrier,
      customer_account_id: order.customer_account_id,
      freight_cost: freightCost,
      is_dropship: order.is_dropship,
      master_tracking_number: masterTrackingNumber,
      notes,
      ship_to_location_id: order.customer_location_id,
      ship_to_snapshot_json: order.ship_to_snapshot_json,
      ship_to_type:
        order.ship_to_type as Database["public"]["Enums"]["sales_order_ship_to_type"],
      shipping_type: shipmentCarrier!.shippingType
        ? (shipmentCarrier!.shippingType as unknown as Database["public"]["Enums"]["shipping_type"])
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
      dropship_fee_amount: shipmentDropshipFee,
      allocated_freight_cost: freightCost,
      freight_shipment_id: shipment.id,
      is_dropship: order.is_dropship,
      notes,
      sales_order_id: order.id,
      sales_order_number_snapshot: order.sales_order_number,
      ship_to_snapshot_json: { ...(order.ship_to_snapshot_json as Record<string, unknown>), residential_surcharge_amount: shipmentResidentialSurcharge },
      ship_to_type:
        order.ship_to_type as Database["public"]["Enums"]["sales_order_ship_to_type"],
      shipping_type_snapshot: shipmentCarrier!.shippingType
        ? (shipmentCarrier!.shippingType as unknown as Database["public"]["Enums"]["shipping_type"])
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

async function backfillOrderCoverageFromPackingList(packingListId: string) {
  const supabase = createSupabaseUntypedAdminClient();
  const { data: packingList, error: packingListError } = await supabase
    .from("packing_list")
    .select("sales_order_id")
    .eq("id", packingListId)
    .maybeSingle();

  if (packingListError) throw new Error(packingListError.message);
  if (!packingList?.sales_order_id) return;

  const { data: order, error: orderError } = await supabase
    .from("sales_order")
    .select(
      "id, customer_location_id, is_dropship, territory_id_snapshot, sales_rep_agency_id_snapshot, sales_rep_id_snapshot",
    )
    .eq("id", packingList.sales_order_id)
    .maybeSingle();

  if (orderError) throw new Error(orderError.message);
  if (!order?.customer_location_id || order.is_dropship) return;

  const [locationResult, coverageResult] = await Promise.all([
    supabase
      .from("customer_location")
      .select("territory_id")
      .eq("id", order.customer_location_id)
      .maybeSingle(),
    supabase
      .from("customer_location_rep_assignment")
      .select("territory_id, sales_rep_agency_id, sales_rep_id")
      .eq("customer_location_id", order.customer_location_id)
      .eq("coverage_role", "primary")
      .eq("status", "active")
      .is("end_date", null)
      .maybeSingle(),
  ]);

  if (locationResult.error) throw new Error(locationResult.error.message);
  if (coverageResult.error) throw new Error(coverageResult.error.message);

  const coverage = coverageResult.data;
  const update = {
    sales_rep_agency_id_snapshot:
      order.sales_rep_agency_id_snapshot ?? coverage?.sales_rep_agency_id ?? null,
    sales_rep_id_snapshot:
      order.sales_rep_id_snapshot ?? coverage?.sales_rep_id ?? null,
    territory_id_snapshot:
      order.territory_id_snapshot ??
      coverage?.territory_id ??
      locationResult.data?.territory_id ??
      null,
  };

  if (
    update.sales_rep_agency_id_snapshot === order.sales_rep_agency_id_snapshot &&
    update.sales_rep_id_snapshot === order.sales_rep_id_snapshot &&
    update.territory_id_snapshot === order.territory_id_snapshot
  ) {
    return;
  }

  const { error: updateError } = await supabase
    .from("sales_order")
    .update(update)
    .eq("id", order.id);

  if (updateError) throw new Error(updateError.message);
}

async function createInvoicesFromPackingListAction(formData: FormData) {
  "use server";

  const packingListId = textValue(formData, "packing_list_id");
  const invoiceDate =
    textValue(formData, "invoice_date") ||
    new Date().toISOString().slice(0, 10);
  const paymentTerms = textValue(formData, "payment_terms") || "Upon Receipt";
  const paymentDays = Number(textValue(formData, "payment_days"));
  let customerFreightCharge = Number(
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

  try {
    await backfillOrderCoverageFromPackingList(packingListId);
  } catch (coverageError) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(coverageError instanceof Error ? coverageError.message : "Unable to resolve order sales coverage.")}`,
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

  const supabase = createSupabaseAdminClient();
  const { data: packingList, error: packingListError } = await supabase
    .from("packing_list")
    .select("sales_order_id, shipping_fee, dropship_fee_amount")
    .eq("id", packingListId)
    .maybeSingle();
  const { data: order, error: orderError } = packingList
    ? await supabase
        .from("sales_order")
        .select("ground_freight_terms_snapshot")
        .eq("id", packingList.sales_order_id)
        .maybeSingle()
    : { data: null, error: null };
  if (packingListError || orderError || !packingList || !order) {
    redirect(`${fallbackUrl}&error=${encodeURIComponent(packingListError?.message ?? orderError?.message ?? "Packing-list freight details could not be loaded.")}`);
  }
  customerFreightCharge =
    order.ground_freight_terms_snapshot === "prepaid"
      ? Number(packingList.shipping_fee ?? 0)
      : 0;
  if (order.ground_freight_terms_snapshot !== "prepaid") {
    for (const brandId of brandIds) freightAllocations[brandId] = 0;
  }
  if (Number(packingList.dropship_fee_amount ?? 0) === 0) {
    for (const brandId of brandIds) dropshipAllocations[brandId] = 0;
  }
  if (brandIds.length === 1) {
    freightAllocations[brandIds[0]] = customerFreightCharge;
    dropshipAllocations[brandIds[0]] = Number(
      packingList.dropship_fee_amount ?? 0,
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

  let commissionOverrides: Record<
    string,
    { payable: boolean; percent: number | null }
  >;
  try {
    const parsed = JSON.parse(textValue(formData, "commission_overrides") || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Commission overrides must be an object.");
    }
    commissionOverrides = Object.fromEntries(
      Object.entries(parsed).map(([brandId, value]) => {
        const override = value as { payable?: unknown; percent?: unknown };
        const percent =
          override.percent === null || override.percent === undefined
            ? null
            : Number(override.percent);
        if (percent !== null && (!Number.isFinite(percent) || percent < 0 || percent > 100)) {
          throw new Error("Commission rates must be between 0 and 100 percent.");
        }
        return [brandId, { payable: override.payable === true, percent }];
      }),
    );
  } catch (commissionError) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(commissionError instanceof Error ? commissionError.message : "Commission settings are invalid.")}`,
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
      p_commission_overrides: commissionOverrides!,
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

async function prepareCommissionStatementAction(formData: FormData) {
  "use server";

  const agencyId = textValue(formData, "agency_id");
  const invoiceIds = [...new Set(formData.getAll("customer_invoice_ids").map(String).filter(Boolean))];
  const readyUrl = `/?module=sales-rep-agency&agency=${agencyId}&agency_tab=commissions&commission_tab=ready`;
  if (!agencyId || !invoiceIds.length) {
    redirect(`${readyUrl}&error=${encodeURIComponent("Select at least one ready invoice.")}`);
  }
  redirect(`/?module=commission-statement-confirm&agency=${agencyId}&commission_invoices=${encodeURIComponent(invoiceIds.join(","))}`);
}

async function createCommissionStatementAction(formData: FormData) {
  "use server";

  const agencyId = textValue(formData, "agency_id");
  const invoiceIds = [...new Set(textValue(formData, "invoice_ids").split(",").filter(Boolean))];
  const confirmationUrl = `/?module=commission-statement-confirm&agency=${agencyId}&commission_invoices=${encodeURIComponent(invoiceIds.join(","))}`;
  if (!agencyId || !invoiceIds.length) {
    redirect(`${confirmationUrl}&error=${encodeURIComponent("Select at least one ready invoice.")}`);
  }

  const { data, error } = await createSupabaseUntypedAdminClient().rpc("create_draft_commission_statement", {
    p_customer_invoice_ids: invoiceIds,
    p_sales_rep_agency_id: agencyId,
  });
  if (error) redirect(`${confirmationUrl}&error=${encodeURIComponent(error.message)}`);

  const statement = Array.isArray(data) ? data[0] : data;
  const statementNumber = statement?.commission_payment_number ?? "Commission statement";
  redirect(`/?module=sales-rep-agency&agency=${agencyId}&agency_tab=commissions&commission_tab=statements&notice=${encodeURIComponent(`${statementNumber} created as a draft.`)}`);
}

async function postCommissionStatementPaymentAction(formData: FormData) {
  "use server";

  const paymentId = textValue(formData, "commission_payment_id");
  const paymentDate = textValue(formData, "payment_date") || new Date().toISOString().slice(0, 10);
  const paymentType = textValue(formData, "payment_type") || "ach";
  const paymentReference = textValue(formData, "payment_reference") || null;
  const fallbackUrl = `/?module=commission-payment&commission_payment=${paymentId}`;
  if (!paymentId) redirect("/?module=invoices&financial_section=commission&financial_commission_tab=draft&error=The%20commission%20statement%20could%20not%20be%20identified.");

  const { error } = await createSupabaseUntypedAdminClient().rpc("post_commission_statement_payment", {
    p_commission_payment_id: paymentId,
    p_payment_date: paymentDate,
    p_payment_reference: paymentReference,
    p_payment_type: paymentType,
  });
  if (error) redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
  redirect("/?module=invoices&financial_section=commission&financial_commission_tab=paid&notice=Commission%20payment%20posted.");
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
  if (!rgaId) {
    redirect(
      "/?module=rga&error=Select an approved RGA before issuing a credit memo.",
    );
  }

  redirect(`/?module=credit-memo-create&rga=${rgaId}`);
}

async function createRgaCreditMemoAction(formData: FormData) {
  "use server";

  const rgaId = textValue(formData, "rga_id");
  const fallbackUrl = `/?module=credit-memo-create&rga=${rgaId}`;
  if (!rgaId) {
    redirect("/?module=rga&error=Select an authorized RGA before creating a credit memo.");
  }

  const lineCreditOverrides: Record<string, number> = {};
  for (const [name, value] of formData.entries()) {
    if (!name.startsWith("credit_amount_")) continue;
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount < 0) {
      redirect(`${fallbackUrl}&error=${encodeURIComponent("Enter a valid credit amount for every line.")}`);
    }
    lineCreditOverrides[name.slice("credit_amount_".length)] = Math.round(amount * 100) / 100;
  }
  if (!Object.keys(lineCreditOverrides).length) {
    redirect(`${fallbackUrl}&error=${encodeURIComponent("Select at least one authorized credit line.")}`);
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.rpc(
    "issue_rga_credit_memos_with_overrides" as never,
    {
      p_rga_id: rgaId,
      p_line_credit_amount_overrides: lineCreditOverrides,
    } as never,
  );
  const createdMemos = (data as { credit_memo_id: string }[] | null) ?? [];

  if (error || createdMemos.length === 0) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(error?.message ?? "Unable to issue the RGA credit memo.")}`,
    );
  }

  redirect(
    `/?module=credit-memo-document&credit_memo=${createdMemos[0].credit_memo_id}`,
  );
}

async function createRgaReplacementOrderAction(formData: FormData) {
  "use server";

  const rgaId = textValue(formData, "rga_id");
  const fallbackUrl = `/?module=rga-replacement-confirm&rga=${rgaId}`;
  if (!rgaId) {
    redirect(
      "/?module=rga&error=Select an approved RGA before creating a replacement order.",
    );
  }

  const shipToLocationId = textValue(formData, "ship_to_location_id");
  const supabase = createSupabaseAdminClient();
  const { data: rga, error: rgaLookupError } = await supabase.from("rga").select("customer_account_id").eq("id", rgaId).maybeSingle();
  if (rgaLookupError || !rga) redirect(`${fallbackUrl}&error=${encodeURIComponent(rgaLookupError?.message ?? "RGA not found.")}`);
  let shipToUpdate: Database["public"]["Tables"]["sales_order"]["Update"];
  if (shipToLocationId) {
    const { data: location, error: locationError } = await supabase.from("customer_location").select("id, location_name, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, receiver_name, email, phone").eq("id", shipToLocationId).eq("customer_account_id", rga.customer_account_id).eq("is_shipping_address", true).eq("status", "active").maybeSingle();
    if (locationError || !location) redirect(`${fallbackUrl}&error=${encodeURIComponent(locationError?.message ?? "Select a valid saved shipping address.")}`);
    shipToUpdate = { customer_location_id: location.id, is_dropship: false, ship_to_display_name_snapshot: location.location_name, ship_to_snapshot_json: { ...location, ship_to_display_name: location.location_name, shipping_contact_name: location.receiver_name, shipping_contact_email: location.email, shipping_contact_phone: location.phone }, ship_to_type: "saved_location" };
  } else {
    const name = textValue(formData, "dropship_name"); const address = textValue(formData, "dropship_address_line_1"); const city = textValue(formData, "dropship_city"); const state = textValue(formData, "dropship_state_province"); const postal = textValue(formData, "dropship_postal_code");
    if (!name || !address || !city || !state || !postal) redirect(`${fallbackUrl}&error=${encodeURIComponent("Enter recipient name, address, city, state/province, and postal code for a direct shipment.")}`);
    shipToUpdate = { customer_location_id: null, is_dropship: true, ship_to_display_name_snapshot: name, ship_to_snapshot_json: { ship_to_display_name: name, address_line_1: address, city, state_province: state, postal_code: postal, country: textValue(formData, "dropship_country") || "United States", shipping_contact_email: textValue(formData, "dropship_email") || null, shipping_contact_phone: textValue(formData, "dropship_phone") || null }, ship_to_type: "dropship" };
  }
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
  const { error: shipToError } = await supabase.from("sales_order").update(shipToUpdate).eq("id", replacementOrder.sales_order_id);
  if (shipToError) redirect(`${fallbackUrl}&error=${encodeURIComponent(shipToError.message)}`);

  redirect(
    `/?module=orders&order=${encodeURIComponent(replacementOrder.sales_order_id)}&notice=${encodeURIComponent(`Replacement order ${replacementOrder.sales_order_number} was created from RGA ${rgaId}.`)}`,
  );
}

async function prepareRgaReplacementOrderAction(formData: FormData) {
  "use server";
  const rgaId = textValue(formData, "rga_id");
  if (!rgaId) redirect("/?module=rga&error=Select an approved RGA before creating a replacement order.");
  redirect(`/?module=rga-replacement-confirm&rga=${rgaId}`);
}

async function prepareInvoiceConfirmationAction(formData: FormData) {
  "use server";

  const packingListId = textValue(formData, "packing_list_id");
  const invoiceDate =
    textValue(formData, "invoice_date") ||
    new Date().toISOString().slice(0, 10);
  const paymentTerms = textValue(formData, "payment_terms") || "Upon Receipt";
  const paymentDays = Number(textValue(formData, "payment_days"));
  let customerFreightCharge = Number(
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

  const invoiceSupabase = createSupabaseAdminClient();
  const { data: invoicePackingList, error: invoicePackingListError } =
    await invoiceSupabase
      .from("packing_list")
      .select("sales_order_id, shipping_fee, dropship_fee_amount")
      .eq("id", packingListId)
      .maybeSingle();
  const { data: invoiceOrder, error: invoiceOrderError } = invoicePackingList
    ? await invoiceSupabase
        .from("sales_order")
        .select("ground_freight_terms_snapshot")
        .eq("id", invoicePackingList.sales_order_id)
        .maybeSingle()
    : { data: null, error: null };
  if (invoicePackingListError || invoiceOrderError || !invoicePackingList || !invoiceOrder) {
    redirect(`${fallbackUrl}&error=${encodeURIComponent(invoicePackingListError?.message ?? invoiceOrderError?.message ?? "Packing-list freight details could not be loaded.")}`);
  }
  customerFreightCharge =
    invoiceOrder.ground_freight_terms_snapshot === "prepaid"
      ? Number(invoicePackingList.shipping_fee ?? 0)
      : 0;

  try {
    await backfillOrderCoverageFromPackingList(packingListId);
  } catch (coverageError) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent(coverageError instanceof Error ? coverageError.message : "Unable to resolve order sales coverage.")}`,
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
  if (invoiceOrder.ground_freight_terms_snapshot !== "prepaid") {
    for (const brandId of brandIds) freightAllocations[brandId] = 0;
  }
  if (Number(invoicePackingList.dropship_fee_amount ?? 0) === 0) {
    for (const brandId of brandIds) dropshipAllocations[brandId] = 0;
  }
  if (brandIds.length === 1) {
    freightAllocations[brandIds[0]] = customerFreightCharge;
    dropshipAllocations[brandIds[0]] = Number(
      invoicePackingList.dropship_fee_amount ?? 0,
    );
  }
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
  const commissionOverrides = Object.fromEntries(
    brandIds.map((brandId) => {
      const percent = Number(textValue(formData, `commission_rate_${brandId}`));
      return [
        brandId,
        {
          payable: formData.get(`commission_payable_${brandId}`) === "on",
          percent: Number.isFinite(percent) ? percent : null,
        },
      ];
    }),
  );
  if (
    Object.values(commissionOverrides).some(
      (override) =>
        override.percent !== null &&
        (override.percent < 0 || override.percent > 100),
    )
  ) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Commission rates must be between 0 and 100 percent.")}`,
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
    invoice_commission_overrides: JSON.stringify(commissionOverrides),
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
  try {
    await refreshPackingListFreightCharge(packingListId, orderId);
  } catch (freightError) {
    redirect(`${fallbackUrl}&error=${encodeURIComponent(freightError instanceof Error ? freightError.message : "The shipment freight charge could not be recalculated.")}`);
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
  try {
    await refreshPackingListFreightCharge(packingListId, orderId);
  } catch (freightError) {
    redirect(`${fallbackUrl}&error=${encodeURIComponent(freightError instanceof Error ? freightError.message : "The shipment freight charge could not be recalculated.")}`);
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
  const freightCost = freightCostText === "" ? 0 : Number(freightCostText);
  if (!Number.isFinite(freightCost) || freightCost < 0) {
    redirect(
      `${fallbackUrl}&error=${encodeURIComponent("Freight cost must be a valid non-negative amount.")}`,
    );
  }

  let shipmentCarrier: { carrier: string | null; shippingType: string | null };
  try {
    shipmentCarrier = await resolveShipmentCarrier(formData);
  } catch (carrierError) {
    redirect(`${fallbackUrl}&error=${encodeURIComponent(carrierError instanceof Error ? carrierError.message : "The freight carrier could not be selected.")}`);
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("freight_shipment")
    .update({
      carrier: shipmentCarrier!.carrier,
      freight_cost: freightCost,
      master_tracking_number:
        textValue(formData, "master_tracking_number") || null,
      notes: textValue(formData, "shipment_notes") || null,
      shipping_type: shipmentCarrier!.shippingType as unknown as
        | Database["public"]["Enums"]["shipping_type"]
        | null,
    })
    .eq("id", shipmentId);
  if (error)
    redirect(`${fallbackUrl}&error=${encodeURIComponent(error.message)}`);
  const { error: packingListError } = await supabase
    .from("packing_list")
    .update({ allocated_freight_cost: freightCost })
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
  const setupFlow = formData.get("setup_flow") === "product";
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
  const baseUrl = `/?module=edit-product-images&product=${productId}&image_category=${imageCategory}${returnToPart ? "&return_module=product-parts" : ""}${setupFlow ? "&setup=product" : ""}`;

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
  const setupFlow = formData.get("setup_flow") === "product";
  const returnCategory = String(
    formData.get("return_image_category") ?? "stock",
  ).trim();
  const returnModule = String(formData.get("return_module") ?? "").trim();
  const returnToPart = returnModule === "product-parts";
  const baseUrl = `/?module=edit-product-images&product=${productId}&image_category=${returnCategory}${returnToPart ? "&return_module=product-parts" : ""}${setupFlow ? "&setup=product" : ""}`;

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
  const setupFlow = formData.get("setup_flow") === "product";
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

  try {
    await replaceProductMaterials(productId, formData);
  } catch (materialError) {
    redirect(`/?module=edit-product-profile&product=${productId}&error=${encodeURIComponent(materialError instanceof Error ? materialError.message : "Unable to save materials.")}`);
  }

  redirect(
    setupFlow
      ? `/?module=edit-product-specs&product=${productId}&spec_section=dimensions&setup=product`
      : `/?module=products&product=${productId}`,
  );
}

async function createProductAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const setupFlow = formData.get("setup_flow") === "product";
  const sku = String(formData.get("sku") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const brandId = String(formData.get("brand_id") ?? "").trim();

  if (!sku || !name || !brandId) {
    redirect("/?module=add-product&error=missing_required");
  }

  const productCreatedUrl = (productId: string) =>
    setupFlow
      ? `/?module=edit-product-specs&product=${productId}&spec_section=dimensions&setup=product`
      : `/?module=products&product=${productId}`;
  const { data: existingProduct, error: existingProductError } = await supabase
    .from("product")
    .select("id")
    .eq("sku", sku)
    .maybeSingle();

  if (existingProductError) {
    redirect(
      `/?module=add-product&error=${encodeURIComponent(existingProductError.message)}`,
    );
  }

  if (existingProduct) {
    revalidatePath("/");
    redirect(productCreatedUrl(existingProduct.id));
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

  const { data, error } = await supabase
    .from("product")
    .insert({
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
    .select("id")
    .single();

  if (error) {
    redirect(`/?module=add-product&error=${encodeURIComponent(error.message)}`);
  }

  try {
    await replaceProductMaterials(data.id, formData);
  } catch (materialError) {
    redirect(`/?module=add-product&error=${encodeURIComponent(materialError instanceof Error ? materialError.message : "Unable to save materials.")}`);
  }

  revalidatePath("/");
  redirect(productCreatedUrl(data.id));
}

async function updateProductSpecsAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const setupFlow = formData.get("setup_flow") === "product";
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

  redirect(
    setupFlow
      ? `/?module=add-product-box&product=${productId}&setup=product`
      : `/?module=products&product=${productId}&product_tab=specs`,
  );
}

async function updateProductBoxesAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const setupFlow = formData.get("setup_flow") === "product";

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

  redirect(
    setupFlow
      ? `/?module=edit-product-images&product=${productId}&setup=product`
      : `/?module=products&product=${productId}&product_tab=packing`,
  );
}

async function addProductBoxAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const setupFlow = formData.get("setup_flow") === "product";

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

  redirect(
    setupFlow
      ? `/?module=edit-product-boxes&product=${productId}&setup=product`
      : `/?module=products&product=${productId}&product_tab=packing`,
  );
}

async function updateProductInventoryAction(formData: FormData) {
  "use server";

  const defaultBoxOnSave = "__create_default_box_1__";
  const supabase = createSupabaseAdminClient();
  const productId = String(formData.get("product_id") ?? "").trim();
  const setupFlow = formData.get("setup_flow") === "product";
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
    let newPackingBoxId = optionalText("new_product_packing_box_id");

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

    if (newPackingBoxId === defaultBoxOnSave) {
      const { data: product, error: productError } = await supabase
        .from("product")
        .select("no_box_needed")
        .eq("id", productId)
        .maybeSingle();

      if (productError || !product) {
        redirectWithError(productError?.message ?? "Product was not found.");
      }

      if (product!.no_box_needed) {
        redirectWithError("This product does not require a packing box.");
      }

      const { data: existingBox, error: existingBoxError } = await supabase
        .from("product_packing_box")
        .select("id")
        .eq("product_id", productId)
        .eq("box_sequence", 1)
        .eq("is_active", true)
        .maybeSingle();

      if (existingBoxError) {
        redirectWithError(existingBoxError.message);
      }

      if (existingBox) {
        newPackingBoxId = existingBox.id;
      } else {
        const { data: newBox, error: newBoxError } = await supabase
          .from("product_packing_box")
          .insert({
            box_sequence: 1,
            is_required_for_sale: true,
            product_id: productId,
          })
          .select("id")
          .single();

        if (newBoxError || !newBox) {
          redirectWithError(
            newBoxError?.message ?? "Unable to create the default Box 1.",
          );
        }

        newPackingBoxId = newBox!.id;
      }
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

  redirect(
    setupFlow && !returnToPart
      ? `/?module=edit-product-parts&product=${productId}&part_action=add&setup=product`
      : returnUrl,
  );
}

async function updatePartInventoryAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const parentProductId = String(formData.get("product_id") ?? "").trim();
  const productIds = [
    ...new Set(
      formData
        .getAll("part_inventory_product_ids")
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  ];
  const editUrl = `/?module=edit-product-parts&product=${parentProductId}&part_action=edit`;

  if (!parentProductId || productIds.length === 0) {
    redirect(`${editUrl}&error=missing_required`);
  }

  const targetQuantityByProductId = new Map<string, number>();
  for (const productId of productIds) {
    const rawValue = String(
      formData.get(`part_inventory_target_${productId}`) ?? "",
    ).trim();
    if (!rawValue) {
      continue;
    }

    const quantity = Number(rawValue);
    if (!Number.isInteger(quantity) || quantity < 0) {
      redirect(
        `${editUrl}&error=${encodeURIComponent("Each sellable quantity must be a whole number zero or higher.")}`,
      );
    }
    targetQuantityByProductId.set(productId, quantity);
  }

  if (targetQuantityByProductId.size === 0) {
    redirect(
      `${editUrl}&error=${encodeURIComponent("Enter at least one sellable quantity to update.")}`,
    );
  }

  const [partLinksResult, productsResult] = await Promise.all([
    supabase
      .from("product_part")
      .select("component_product_id")
      .eq("parent_product_id", parentProductId)
      .eq("is_active", true)
      .in("component_product_id", [...targetQuantityByProductId.keys()]),
    supabase
      .from("product")
      .select("id, no_box_needed")
      .in("id", [...targetQuantityByProductId.keys()]),
  ]);

  if (partLinksResult.error || productsResult.error) {
    redirect(
      `${editUrl}&error=${encodeURIComponent(partLinksResult.error?.message ?? productsResult.error?.message ?? "Unable to load part inventory.")}`,
    );
  }

  const linkedProductIds = new Set(
    (partLinksResult.data ?? []).map((part) => part.component_product_id),
  );
  if (
    [...targetQuantityByProductId.keys()].some(
      (productId) => !linkedProductIds.has(productId),
    )
  ) {
    redirect(
      `${editUrl}&error=${encodeURIComponent("A selected part is no longer linked to this product.")}`,
    );
  }

  const productById = new Map(
    (productsResult.data ?? []).map((product) => [product.id, product]),
  );
  if (
    [...targetQuantityByProductId.keys()].some(
      (productId) => !productById.has(productId),
    )
  ) {
    redirect(`${editUrl}&error=${encodeURIComponent("A selected part was not found.")}`);
  }

  const { data: fallbackLocation, error: fallbackLocationError } = await supabase
    .from("warehouse_location")
    .select("id, warehouse_id")
    .eq("is_active", true)
    .eq("is_pickable", true)
    .eq("location_code", "UNSPECIFIED-PICK")
    .order("warehouse_id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (fallbackLocationError || !fallbackLocation) {
    redirect(
      `${editUrl}&error=${encodeURIComponent(fallbackLocationError?.message ?? "No Unspecified Pick Location is available for the inventory update.")}`,
    );
  }

  for (const [productId, targetQuantity] of targetQuantityByProductId) {
    const product = productById.get(productId)!;
    const { data: requiredBoxes, error: requiredBoxesError } = product.no_box_needed
      ? { data: [], error: null }
      : await supabase
          .from("product_packing_box")
          .select("id, default_warehouse_id, default_warehouse_location_id")
          .eq("product_id", productId)
          .eq("is_active", true)
          .eq("is_required_for_sale", true);

    if (requiredBoxesError) {
      redirect(`${editUrl}&error=${encodeURIComponent(requiredBoxesError.message)}`);
    }

    const targets = product.no_box_needed
      ? [
          {
            id: null,
            default_warehouse_id: fallbackLocation.warehouse_id,
            default_warehouse_location_id: fallbackLocation.id,
          },
        ]
      : requiredBoxes ?? [];

    for (const target of targets) {
      const warehouseId = target.default_warehouse_id ?? fallbackLocation.warehouse_id;
      const warehouseLocationId =
        target.default_warehouse_location_id ?? fallbackLocation.id;
      let balanceQuery = supabase
        .from("inventory_balance")
        .select("id")
        .eq("product_id", productId)
        .eq("warehouse_location_id", warehouseLocationId)
        .eq("inventory_condition", "regular");
      balanceQuery = target.id
        ? balanceQuery.eq("product_packing_box_id", target.id)
        : balanceQuery.is("product_packing_box_id", null);

      const { data: existingBalance, error: existingBalanceError } =
        await balanceQuery.maybeSingle();
      if (existingBalanceError) {
        redirect(`${editUrl}&error=${encodeURIComponent(existingBalanceError.message)}`);
      }

      const payload = {
        inventory_condition: "regular" as const,
        product_id: productId,
        product_packing_box_id: target.id,
        quantity_allocated: 0,
        quantity_on_hand: targetQuantity,
        warehouse_id: warehouseId,
        warehouse_location_id: warehouseLocationId,
      };
      const result = existingBalance
        ? await supabase.from("inventory_balance").update(payload).eq("id", existingBalance.id)
        : await supabase.from("inventory_balance").insert(payload);
      if (result.error) {
        redirect(`${editUrl}&error=${encodeURIComponent(result.error.message)}`);
      }
    }
  }

  redirect(editUrl);
}

async function updateProductPartsAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const initialProductId = String(formData.get("product_id") ?? "").trim();
  const setupFlow = formData.get("setup_flow") === "product";
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

    redirect(
      setupFlow
        ? `/?module=edit-product-vendors&product=${productId}&vendor_action=add&setup=product`
        : `/?module=products&product=${productId}&product_tab=parts`,
    );
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

  redirect(
    setupFlow
      ? `/?module=edit-product-vendors&product=${productId}&vendor_action=add&setup=product`
      : `/?module=products&product=${productId}&product_tab=parts`,
  );
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
  const setupFlow = formData.get("setup_flow") === "product";
  const action = String(formData.get("vendor_action") ?? "edit").trim();
  const selectedIds = formData
    .getAll("selected_vendor_product_ids")
    .map((value) => String(value).trim())
    .filter(Boolean);
  const returnToVendors = () =>
    redirect(
      setupFlow
        ? `/?module=products&product=${productId}`
        : `/?module=products&product=${productId}&product_tab=vendors`,
    );
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

function normalizedPostalCode(postalCode: string | null) {
  const match = postalCode?.match(/^(\d{5})(?:-\d{4})?$/);
  return match?.[1] ?? null;
}

async function resolveLocationTerritory(postalCode: string | null) {
  const normalizedPostalCodeValue = normalizedPostalCode(postalCode);
  if (!normalizedPostalCodeValue) return null;

  const supabase = createSupabaseUntypedAdminClient();
  const { data: coverage, error: coverageError } = await supabase
    .from("territory_zip_coverage")
    .select("territory_id")
    .eq("postal_code", normalizedPostalCodeValue);

  if (coverageError) throw new Error(coverageError.message);

  const territoryIds = [...new Set((coverage ?? []).map((row) => row.territory_id))];
  if (!territoryIds.length) return null;

  const { data: territories, error: territoriesError } = await supabase
    .from("territory")
    .select("id, territory_code, name")
    .in("id", territoryIds)
    .eq("status", "active");

  if (territoriesError) throw new Error(territoriesError.message);
  return territories?.length === 1 ? (territories[0] as LocationTerritory) : null;
}

async function selectedLocationTerritory(territoryId: string | null) {
  if (!territoryId) return null;

  const { data, error } = await createSupabaseUntypedAdminClient()
    .from("territory")
    .select("id, territory_code, name")
    .eq("id", territoryId)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Choose an active territory or Not assigned.");
  return data as LocationTerritory;
}

async function getLocationCoverageOptions(territoryId: string | null) {
  if (!territoryId) {
    return {
      agencies: [] as LocationCoverageOption[],
      reps: [] as (LocationCoverageOption & { agencyId: string })[],
      territoryRepIds: [] as string[],
    };
  }

  const supabase = createSupabaseUntypedAdminClient();
  const { data: territoryAssignments, error: territoryAssignmentsError } = await supabase
    .from("territory_assignment")
    .select("sales_rep_agency_id")
    .eq("territory_id", territoryId)
    .eq("status", "active")
    .is("end_date", null);

  if (territoryAssignmentsError) throw new Error(territoryAssignmentsError.message);

  const agencyIds = [...new Set((territoryAssignments ?? []).map((assignment) => assignment.sales_rep_agency_id))];
  if (!agencyIds.length) {
    return {
      agencies: [] as LocationCoverageOption[],
      reps: [] as (LocationCoverageOption & { agencyId: string })[],
      territoryRepIds: [] as string[],
    };
  }

  const [agenciesResult, repTerritoryAssignmentsResult, repsResult] = await Promise.all([
    supabase
      .from("sales_rep_agency")
      .select("id, name")
      .in("id", agencyIds)
      .eq("status", "active")
      .order("name", { ascending: true }),
    supabase
      .from("sales_rep_territory_assignment")
      .select("sales_rep_id")
      .eq("territory_id", territoryId)
      .eq("status", "active")
      .is("end_date", null),
    supabase
      .from("sales_rep")
      .select("id, name, sales_rep_agency_id")
      .in("sales_rep_agency_id", agencyIds)
      .eq("status", "active")
      .order("name", { ascending: true }),
  ]);

  if (agenciesResult.error) throw new Error(agenciesResult.error.message);
  if (repTerritoryAssignmentsResult.error) throw new Error(repTerritoryAssignmentsResult.error.message);
  if (repsResult.error) throw new Error(repsResult.error.message);

  return {
    agencies: (agenciesResult.data ?? []) as LocationCoverageOption[],
    reps: (repsResult.data ?? []).map((rep) => ({
      agencyId: rep.sales_rep_agency_id,
      id: rep.id,
      name: rep.name,
    })) as (LocationCoverageOption & { agencyId: string })[],
    territoryRepIds: [...new Set((repTerritoryAssignmentsResult.data ?? []).map((assignment) => assignment.sales_rep_id))],
  };
}

async function resolveLocationCoverageAssignment(
  territoryId: string | null,
  requestedAgencyId: string | null,
  requestedRepId: string | null,
) {
  if (!territoryId) {
    if (requestedAgencyId || requestedRepId) {
      throw new Error("Choose an assigned territory before selecting a sales agency or sales rep.");
    }
    return null;
  }

  const options = await getLocationCoverageOptions(territoryId);
  const agency = requestedAgencyId
    ? options.agencies.find((candidate) => candidate.id === requestedAgencyId)
    : options.agencies.length === 1
      ? options.agencies[0]
      : null;

  if (!agency) {
    if (requestedAgencyId) {
      throw new Error("The selected sales agency does not cover this territory.");
    }
    if (requestedRepId) {
      throw new Error("Choose a sales agency before selecting a sales rep.");
    }
    return null;
  }

  const agencyReps = options.reps.filter((rep) => rep.agencyId === agency.id);
  const territoryAgencyReps = agencyReps.filter((rep) =>
    options.territoryRepIds.includes(rep.id),
  );
  const rep = requestedRepId
    ? agencyReps.find((candidate) => candidate.id === requestedRepId)
    : territoryAgencyReps.length === 1
      ? territoryAgencyReps[0]
      : null;

  if (requestedRepId && !rep) {
    throw new Error("The selected sales rep does not belong to this sales agency.");
  }

  return {
    salesRepAgencyId: agency.id,
    salesRepId: rep?.id ?? null,
    source: requestedAgencyId || requestedRepId ? "manual" : "territory",
    territoryId,
  } satisfies LocationCoverageAssignment;
}

async function replaceLocationCoverageAssignment(
  locationId: string,
  assignment: LocationCoverageAssignment | null,
) {
  const supabase = createSupabaseUntypedAdminClient();
  const { error: clearError } = await supabase
    .from("customer_location_rep_assignment")
    .update({ end_date: new Date().toISOString().slice(0, 10), status: "inactive" })
    .eq("customer_location_id", locationId)
    .eq("coverage_role", "primary")
    .eq("status", "active")
    .is("end_date", null);

  if (clearError) throw new Error(clearError.message);
  if (!assignment) return;

  const { error: insertError } = await supabase
    .from("customer_location_rep_assignment")
    .insert({
      assignment_source: assignment.source,
      coverage_role: "primary",
      customer_location_id: locationId,
      sales_rep_agency_id: assignment.salesRepAgencyId,
      sales_rep_id: assignment.salesRepId,
      status: "active",
      territory_id: assignment.territoryId,
    });

  if (insertError) throw new Error(insertError.message);
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
  let territory: LocationTerritory | null;
  let coverageAssignment: LocationCoverageAssignment | null;

  try {
    territory = await resolveLocationTerritory(optionalText("postal_code"));
    coverageAssignment = await resolveLocationCoverageAssignment(
      territory?.id ?? null,
      optionalText("sales_rep_agency_id"),
      optionalText("sales_rep_id"),
    );
  } catch (territoryError) {
    redirect(
      `/?module=add-location&customer=${customerId}&error=${encodeURIComponent(territoryError instanceof Error ? territoryError.message : "Unable to resolve the location territory.")}`,
    );
  }

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
      territory_assignment_source: "auto",
      territory_id: territory?.id ?? null,
    })
    .select("id")
    .single();

  if (error) {
    redirect(
      `/?module=add-location&customer=${customerId}&error=${encodeURIComponent(error.message)}`,
    );
  }

  try {
    await replaceLocationCoverageAssignment(data.id, coverageAssignment);
  } catch (assignmentError) {
    redirect(
      `/?module=add-location&customer=${customerId}&error=${encodeURIComponent(assignmentError instanceof Error ? assignmentError.message : "Unable to save the location sales coverage.")}`,
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

  redirect(`/?customer=${customerId}&tab=locations`);
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
  const selectedTerritoryId = optionalText("territory_id");
  let territory: LocationTerritory | null;
  let coverageAssignment: LocationCoverageAssignment | null;

  try {
    territory = await selectedLocationTerritory(selectedTerritoryId);
    coverageAssignment = await resolveLocationCoverageAssignment(
      territory?.id ?? null,
      optionalText("sales_rep_agency_id"),
      optionalText("sales_rep_id"),
    );
  } catch (territoryError) {
    redirect(
      `/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(territoryError instanceof Error ? territoryError.message : "Unable to resolve the location territory.")}`,
    );
  }

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
      territory_assignment_source: territory ? "auto" : "manual_unassigned",
      territory_id: territory?.id ?? null,
    })
    .eq("id", locationId)
    .eq("customer_account_id", customerId);

  if (error) {
    redirect(
      `/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(error.message)}`,
    );
  }

  try {
    await replaceLocationCoverageAssignment(locationId, coverageAssignment);
  } catch (assignmentError) {
    redirect(
      `/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(assignmentError instanceof Error ? assignmentError.message : "Unable to save the location sales coverage.")}`,
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

  const locationFreightLevelId = optionalText("location_freight_level_id");
  if (formData.get("is_shipping_address") === "on") {
    const freightAdmin = createSupabaseUntypedAdminClient();
    if (locationFreightLevelId) {
      const { data: freightLevel, error: freightLevelError } = await freightAdmin.from("freight_level").select("id").eq("id", locationFreightLevelId).eq("is_active", true).maybeSingle();
      if (freightLevelError || !freightLevel) redirect(`/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(freightLevelError?.message ?? "The selected Freight Level is no longer active.")}`);
    }
    const { data: locationPolicy, error: locationPolicyLookupError } = await freightAdmin.from("customer_freight_policy").select("id").eq("customer_account_id", customerId).eq("customer_location_id", locationId).maybeSingle();
    if (locationPolicyLookupError) redirect(`/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(locationPolicyLookupError.message)}`);
    const policyResult = locationPolicy
      ? await freightAdmin.from("customer_freight_policy").update({ freight_level_id: locationFreightLevelId }).eq("id", locationPolicy.id)
      : await freightAdmin.from("customer_freight_policy").insert({ customer_account_id: customerId, customer_location_id: locationId, freight_level_id: locationFreightLevelId, freight_terms: "free_freight", ground_freight_terms: "free_freight", is_active: true, is_default: true, ltl_freight_terms: "free_freight", policy_name: "Location Freight Policy" });
    if (policyResult.error) redirect(`/?module=edit-location&customer=${customerId}&location=${locationId}&error=${encodeURIComponent(policyResult.error.message)}`);
  }

  redirect(`/?customer=${customerId}&tab=locations`);
}

async function updateLocationFreightTermAction(formData: FormData) {
  "use server";

  const customerId = String(formData.get("customer_id") ?? "").trim();
  const locationId = String(formData.get("location_id") ?? "").trim();
  const freightLevelId = String(
    formData.get("location_freight_level_id") ?? "",
  ).trim();
  const customFreightAllowance = Number(
    String(formData.get("location_custom_freight_allowance_amount") ?? "").trim(),
  );
  const customFreightRate = Number(
    String(formData.get("location_custom_freight_rate_percent") ?? "").trim(),
  );
  const isCustomFreightLevel = freightLevelId === "custom";
  const returnUrl = `/?module=edit-location-freight&customer=${customerId}&location=${locationId}`;

  if (!customerId || !locationId) {
    redirect(`${returnUrl}&error=${encodeURIComponent("A customer and shipping address are required.")}`);
  }

  const supabase = createSupabaseUntypedAdminClient();
  const { data: location, error: locationError } = await supabase
    .from("customer_location")
    .select("id, is_shipping_address")
    .eq("id", locationId)
    .eq("customer_account_id", customerId)
    .maybeSingle();
  if (locationError || !location?.is_shipping_address) {
    redirect(`${returnUrl}&error=${encodeURIComponent(locationError?.message ?? "Select a saved shipping address.")}`);
  }

  if (isCustomFreightLevel) {
    if (!Number.isFinite(customFreightAllowance) || customFreightAllowance < 0 || !Number.isFinite(customFreightRate) || customFreightRate < 0) {
      redirect(`${returnUrl}&error=${encodeURIComponent("Enter a valid custom FFA amount and freight rate.")}`);
    }
  } else if (freightLevelId) {
    const { data: freightLevel, error: freightLevelError } = await supabase
      .from("freight_level")
      .select("id")
      .eq("id", freightLevelId)
      .eq("is_active", true)
      .maybeSingle();
    if (freightLevelError || !freightLevel) {
      redirect(`${returnUrl}&error=${encodeURIComponent(freightLevelError?.message ?? "The selected Freight Level is no longer active.")}`);
    }
  }

  const { data: existingPolicy, error: existingPolicyError } = await supabase
    .from("customer_freight_policy")
    .select("id")
    .eq("customer_account_id", customerId)
    .eq("customer_location_id", locationId)
    .maybeSingle();
  if (existingPolicyError) {
    redirect(`${returnUrl}&error=${encodeURIComponent(existingPolicyError.message)}`);
  }

  const policyResult = existingPolicy
    ? await supabase
        .from("customer_freight_policy")
        .update({
          flat_rate_percent: isCustomFreightLevel ? customFreightRate : null,
          freight_allowance_amount: isCustomFreightLevel ? customFreightAllowance : null,
          freight_level_id: isCustomFreightLevel ? null : freightLevelId || null,
        })
        .eq("id", existingPolicy.id)
    : await supabase.from("customer_freight_policy").insert({
        customer_account_id: customerId,
        customer_location_id: locationId,
        flat_rate_percent: isCustomFreightLevel ? customFreightRate : null,
        freight_allowance_amount: isCustomFreightLevel ? customFreightAllowance : null,
        freight_level_id: isCustomFreightLevel ? null : freightLevelId || null,
        freight_terms: "free_freight",
        ground_freight_terms: "free_freight",
        is_active: true,
        is_default: true,
        ltl_freight_terms: "free_freight",
        policy_name: "Location Freight Policy",
      });
  if (policyResult.error) {
    redirect(`${returnUrl}&error=${encodeURIComponent(policyResult.error.message)}`);
  }

  revalidatePath("/");
  redirect(`/?customer=${customerId}&tab=freight`);
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

  redirect(`/?customer=${customerId}&tab=contacts`);
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

  redirect(`/?customer=${customerId}&tab=contacts`);
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
    return ["prepaid", "collect", "customer_pickup"].includes(text)
      ? (text as "prepaid" | "collect" | "customer_pickup")
      : "prepaid";
  };
  const freightTerms = freightTerm(formData.get("freight_terms"));
  const freightLevelId = optionalText("freight_level_id");
  const isCustomFreightLevel = freightLevelId === "custom";
  const customFreightAllowance = Number(
    optionalText("custom_freight_allowance_amount"),
  );
  const customFreightRate = Number(optionalText("custom_freight_rate_percent"));
  if (
    isCustomFreightLevel &&
    (!Number.isFinite(customFreightAllowance) ||
      customFreightAllowance < 0 ||
      !Number.isFinite(customFreightRate) ||
      customFreightRate < 0)
  ) {
    redirect(`/?module=edit-freight&customer=${customerId}&error=${encodeURIComponent("Enter a valid custom FFA amount and freight rate.")}`);
  }
  const freightAdmin = createSupabaseUntypedAdminClient();
  const selectedFreightLevelResult = freightTerms === "customer_pickup"
    ? await freightAdmin.from("freight_level").select("id, free_freight_allowance").eq("level_name", "Level 0").eq("is_active", true).maybeSingle()
    : freightLevelId && !isCustomFreightLevel
      ? await freightAdmin.from("freight_level").select("id, free_freight_allowance").eq("id", freightLevelId).eq("is_active", true).maybeSingle()
      : isCustomFreightLevel
        ? { data: { id: null, free_freight_allowance: customFreightAllowance }, error: null }
        : { data: null, error: null };
  if (selectedFreightLevelResult.error || !selectedFreightLevelResult.data) {
    redirect(`/?module=edit-freight&customer=${customerId}&error=${encodeURIComponent(selectedFreightLevelResult.error?.message ?? (freightTerms === "customer_pickup" ? "Level 0 must be configured before Customer Pickup can be saved." : "Select an active Freight Level."))}`);
  }
  const selectedFreightLevel = selectedFreightLevelResult.data;
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
    flat_rate_percent: isCustomFreightLevel ? customFreightRate : null,
    freight_allowance_amount: Number(selectedFreightLevel.free_freight_allowance),
    freight_level_id: isCustomFreightLevel ? null : selectedFreightLevel.id,
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

  redirect(`/?customer=${customerId}&tab=freight`);
}

async function updateCustomerDropshipSettingsAction(formData: FormData) {
  "use server";

  const customerId = String(formData.get("customer_id") ?? "").trim();
  const returnUrl = `/?module=edit-dropship-settings&customer=${customerId}`;
  if (!customerId) redirect("/?module=customers");

  const overridesDropship = formData.get("override_dropship_settings") === "on";
  const overridesResidential = formData.get("override_residential_surcharge") === "on";
  const dropshipRatePercent = Number(String(formData.get("dropship_rate_percent") ?? "").trim());
  const residentialRatePercent = Number(String(formData.get("residential_surcharge_rate_percent") ?? "").trim());
  const selectedDropshipFreightLevel = String(formData.get("dropship_freight_level_id") ?? "").trim();
  const dropshipFreightTerms = String(formData.get("dropship_freight_terms") ?? "prepaid").trim();
  const dropshipFreightLevelId = selectedDropshipFreightLevel === "custom" ? null : selectedDropshipFreightLevel || null;
  const customDropshipFreightAllowance = Number(String(formData.get("custom_dropship_freight_allowance_amount") ?? "").trim());
  const customDropshipFreightRate = Number(String(formData.get("custom_dropship_freight_rate_percent") ?? "").trim());
  const isCustomDropshipFreightLevel = selectedDropshipFreightLevel === "custom";
  if (!["prepaid", "collect"].includes(dropshipFreightTerms)) {
    redirect(`${returnUrl}&error=${encodeURIComponent("Select Prepay or Collect for Dropship Freight Terms.")}`);
  }
  if (overridesDropship && (!Number.isFinite(dropshipRatePercent) || dropshipRatePercent < 0)) {
    redirect(`${returnUrl}&error=${encodeURIComponent("Enter a valid Dropship Rate.")}`);
  }
  if (overridesResidential && (!Number.isFinite(residentialRatePercent) || residentialRatePercent < 0)) {
    redirect(`${returnUrl}&error=${encodeURIComponent("Enter a valid Residential Surcharge Rate.")}`);
  }
  if (isCustomDropshipFreightLevel && (!Number.isFinite(customDropshipFreightAllowance) || customDropshipFreightAllowance < 0 || !Number.isFinite(customDropshipFreightRate) || customDropshipFreightRate < 0)) {
    redirect(`${returnUrl}&error=${encodeURIComponent("Enter a valid custom Dropship FFA amount and freight rate.")}`);
  }

  const supabase = createSupabaseAdminClient();
  if (dropshipFreightLevelId) {
    const { data: level, error: levelError } = await createSupabaseUntypedAdminClient()
      .from("freight_level")
      .select("id")
      .eq("id", dropshipFreightLevelId)
      .eq("is_active", true)
      .maybeSingle();
    if (levelError || !level) {
      redirect(`${returnUrl}&error=${encodeURIComponent(levelError?.message ?? "The selected Dropship Freight Level is no longer active.")}`);
    }
  }

  const { data: policy, error: policyError } = await supabase
    .from("customer_freight_policy")
    .select("id, freight_terms, default_ground_carrier, default_ground_carrier_account_number, default_ltl_carrier, default_ltl_carrier_account_number")
    .eq("customer_account_id", customerId)
    .is("customer_location_id", null)
    .eq("is_active", true)
    .order("is_default", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (policyError || !policy) {
    redirect(`${returnUrl}&error=${encodeURIComponent(policyError?.message ?? "Set the account Freight Terms before configuring Dropship Settings.")}`);
  }
  const accountCollectDetailsExist = Boolean(
    policy.freight_terms === "collect" &&
      (policy.default_ground_carrier ||
        policy.default_ground_carrier_account_number ||
        policy.default_ltl_carrier ||
        policy.default_ltl_carrier_account_number),
  );
  const optionalCollectText = (key: string) => {
    const value = String(formData.get(key) ?? "").trim();
    return value || null;
  };

  const { error } = await supabase
    .from("customer_freight_policy")
    .update({
      dropship_freight_level_id: dropshipFreightLevelId,
      dropship_freight_allowance_amount: isCustomDropshipFreightLevel ? customDropshipFreightAllowance : null,
      dropship_freight_rate_percent: isCustomDropshipFreightLevel ? customDropshipFreightRate : null,
      dropship_freight_terms: dropshipFreightTerms as "prepaid" | "collect",
      dropship_default_ground_carrier:
        dropshipFreightTerms === "collect" && !accountCollectDetailsExist
          ? optionalCollectText("dropship_ground_collect_carrier")
          : null,
      dropship_default_ground_carrier_account_number:
        dropshipFreightTerms === "collect" && !accountCollectDetailsExist
          ? optionalCollectText("dropship_ground_collect_account_number")
          : null,
      dropship_default_ltl_carrier:
        dropshipFreightTerms === "collect" && !accountCollectDetailsExist
          ? optionalCollectText("dropship_ltl_collect_carrier")
          : null,
      dropship_default_ltl_carrier_account_number:
        dropshipFreightTerms === "collect" && !accountCollectDetailsExist
          ? optionalCollectText("dropship_ltl_collect_account_number")
          : null,
      dropship_is_active: overridesDropship ? true : null,
      dropship_rate_percent: overridesDropship ? dropshipRatePercent : null,
      residential_surcharge_is_active: overridesResidential ? true : null,
      residential_surcharge_rate_percent: overridesResidential ? residentialRatePercent : null,
    })
    .eq("id", policy.id);
  if (error) redirect(`${returnUrl}&error=${encodeURIComponent(error.message)}`);

  revalidatePath("/");
  redirect(`/?customer=${customerId}&tab=freight`);
}

async function saveCustomerRepAssignmentAction(formData: FormData) {
  "use server";

  const supabase = createSupabaseAdminClient();
  const customerId = textValue(formData, "customer_id");
  const assignmentId = textValue(formData, "assignment_id");
  const locationId = textValue(formData, "location_id");
  const salesRepSelection = textValue(formData, "sales_rep_selection");
  const [salesRepId, salesRepAgencyId] = salesRepSelection
    ? salesRepSelection.split("|")
    : ["", ""];
  const territoryId = textValue(formData, "territory_id") || null;
  const coverageRoleValue = textValue(formData, "coverage_role");
  const coverageRole = ["primary", "secondary", "support", "manager"].includes(
    coverageRoleValue,
  )
    ? (coverageRoleValue as "primary" | "secondary" | "support" | "manager")
    : "primary";
  const status: "active" | "inactive" =
    textValue(formData, "status") === "inactive" ? "inactive" : "active";
  const editUrl = `/?module=edit-sales-rep&customer=${customerId}`;

  if (!customerId || !locationId || !salesRepId || !salesRepAgencyId) {
    redirect(`${editUrl}&error=missing_required`);
  }

  const { data: location, error: locationError } = await supabase
    .from("customer_location")
    .select("id")
    .eq("id", locationId)
    .eq("customer_account_id", customerId)
    .maybeSingle();

  if (locationError || !location) {
    redirect(
      `${editUrl}&error=${encodeURIComponent(locationError?.message ?? "The selected location does not belong to this customer.")}`,
    );
  }

  const assignment = {
    coverage_role: coverageRole,
    customer_location_id: locationId,
    sales_rep_agency_id: salesRepAgencyId,
    sales_rep_id: salesRepId,
    status,
    territory_id: territoryId,
  };

  if (assignmentId) {
    const { data: existingAssignment, error: existingError } = await supabase
      .from("customer_location_rep_assignment")
      .select("customer_location_id")
      .eq("id", assignmentId)
      .maybeSingle();

    if (existingError || !existingAssignment) {
      redirect(
        `${editUrl}&error=${encodeURIComponent(existingError?.message ?? "Sales rep assignment was not found.")}`,
      );
    }

    const { data: existingLocation, error: existingLocationError } = await supabase
      .from("customer_location")
      .select("id")
      .eq("id", existingAssignment.customer_location_id)
      .eq("customer_account_id", customerId)
      .maybeSingle();

    if (existingLocationError || !existingLocation) {
      redirect(`${editUrl}&error=${encodeURIComponent("Sales rep assignment does not belong to this customer.")}`);
    }

    const { error } = await supabase
      .from("customer_location_rep_assignment")
      .update(assignment)
      .eq("id", assignmentId);

    if (error) {
      redirect(`${editUrl}&error=${encodeURIComponent(error.message)}`);
    }
  } else {
    const { error } = await supabase
      .from("customer_location_rep_assignment")
      .insert({ ...assignment, assignment_source: "manual" });

    if (error) {
      redirect(`${editUrl}&error=${encodeURIComponent(error.message)}`);
    }
  }

  redirect(`/?customer=${customerId}&tab=sales-rep`);
}

async function searchCustomers(
  query: string,
  mode: "active" | "obsolete" = "active",
  filters: CustomerSearchFilters = {},
) {
  const supabase = createSupabaseAdminClient();
  const cleanQuery = query.trim();
  let matchingCustomerIds: Set<string> | null = null;

  if (filters.territoryId) {
    const { data: territoryLocations, error: territoryLocationsError } = await supabase
      .from("customer_location")
      .select("customer_account_id")
      .eq("territory_id", filters.territoryId);
    if (territoryLocationsError) throw new Error(territoryLocationsError.message);
    matchingCustomerIds = new Set((territoryLocations ?? []).map((location) => location.customer_account_id));
  }

  if (filters.agencyId) {
    const { data: agencyAssignments, error: agencyAssignmentsError } = await supabase
      .from("customer_location_rep_assignment")
      .select("customer_location_id")
      .eq("sales_rep_agency_id", filters.agencyId)
      .eq("status", "active")
      .is("end_date", null);
    if (agencyAssignmentsError) throw new Error(agencyAssignmentsError.message);
    const locationIds = (agencyAssignments ?? []).map((assignment) => assignment.customer_location_id);
    const { data: agencyLocations, error: agencyLocationsError } = locationIds.length
      ? await supabase.from("customer_location").select("customer_account_id").in("id", locationIds)
      : { data: [], error: null };
    if (agencyLocationsError) throw new Error(agencyLocationsError.message);
    const agencyCustomerIds = new Set((agencyLocations ?? []).map((location) => location.customer_account_id));
    matchingCustomerIds = matchingCustomerIds
      ? new Set([...matchingCustomerIds].filter((customerId) => agencyCustomerIds.has(customerId)))
      : agencyCustomerIds;
  }

  if (matchingCustomerIds && matchingCustomerIds.size === 0) return [] as CustomerAccount[];

  let request = supabase
    .from("customer_account")
    .select(
      "id, account_number, legacy_account_id, name, legal_name, status, default_discount_percent, is_sales_tax_exempt, billing_contact_name, billing_email, purchase_contact_name, purchase_email, account_type_id, business_type_id",
    )
    .order("name", { ascending: true })
    .limit(20);

  if (filters.status) {
    request = request.eq("status", filters.status as "active");
  } else if (mode === "obsolete") {
    request = request.eq("status", "obsolete" as "inactive");
  } else {
    request = request.not("status", "in", "(inactive,obsolete)");
  }

  if (filters.accountTypeId) request = request.eq("account_type_id", filters.accountTypeId);
  if (matchingCustomerIds) request = request.in("id", [...matchingCustomerIds]);

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
    materialsResult,
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
    createSupabaseUntypedAdminClient()
      .from("product_material")
      .select("material(id, material_name)")
      .eq("product_id", productId)
      .order("created_at", { ascending: true }),
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
    materialsResult.error,
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
  const calculatedOnHandQuantity = product.no_box_needed
    ? regularBalances
        .filter((balance) => balance.product_packing_box_id === null)
        .reduce((sum, balance) => sum + balance.quantity_on_hand, 0)
    : requiredBoxes.length > 0
      ? Math.min(
          ...requiredBoxes.map((box) =>
            regularBalances
              .filter((balance) => balance.product_packing_box_id === box.id)
              .reduce((sum, balance) => sum + balance.quantity_on_hand, 0),
          ),
        )
      : 0;

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
    material_ids: (materialsResult.data ?? []).flatMap((productMaterial) => productMaterial.material ?? []).map((material) => material.id),
    materials: (materialsResult.data ?? []).flatMap((productMaterial) => productMaterial.material ?? []).map((material) => material.material_name),
    next_incoming_eta: summaryResult.data?.next_incoming_eta ?? null,
    no_box_needed: product.no_box_needed,
    on_hand_quantity: calculatedOnHandQuantity,
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
        "id, location_code, location_name, location_type, city, state_province, country_code, is_shipping_address, is_default_ship_to, is_billing_address, is_showroom, status, updated_at",
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
        "id, credit_memo_number, brand_name_snapshot, issue_date, reason_code, status, total_credit_amount, amount_applied, amount_remaining, rga_id",
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
      .select("customer_location_id, program_status, updated_at")
      .eq("customer_account_id", customerId)
      .in("program_status", [
        "pending",
        "active",
        "pending_renew",
        "suspended",
      ]),
    supabase
      .from("rga")
      .select("id, rga_number, sales_order_id, original_customer_po_number_snapshot, status, requested_resolution_type, request_date")
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
        "customer_location_id, freight_level_id, policy_name, freight_terms, ltl_freight_terms, ground_freight_terms, preferred_shipping_type, freight_allowance_amount, flat_rate_percent, dropship_freight_level_id, dropship_freight_allowance_amount, dropship_freight_rate_percent, dropship_is_active, dropship_rate_percent, residential_surcharge_is_active, residential_surcharge_rate_percent, updated_at",
      )
      .eq("customer_account_id", customerId)
      .eq("is_active", true)
      .order("is_default", { ascending: false }),
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
  if (!customerResult.data) {
    throw new Error("Customer account was not found.");
  }

  const customer = customerResult.data as CustomerAccount;
  const customerRgas = (rgasResult.data ?? []) as Rga[];
  const customerRgaIds = customerRgas.map((rga) => rga.id);
  const { data: replacementLinks } = customerRgaIds.length ? await supabase.from("rga_replacement_order").select("rga_id, sales_order_id").in("rga_id", customerRgaIds) : { data: [] };
  const { data: issuedCreditMemos } = customerRgaIds.length ? await supabase.from("credit_memo").select("rga_id").in("rga_id", customerRgaIds) : { data: [] };
  const replacementOrderIds = (replacementLinks ?? []).map((link) => link.sales_order_id);
  const { data: replacementOrders } = replacementOrderIds.length ? await supabase.from("sales_order").select("id, status").in("id", replacementOrderIds) : { data: [] };
  const replacementByRga = new Map((replacementLinks ?? []).map((link) => [link.rga_id, replacementOrders?.find((order) => order.id === link.sales_order_id)]));
  const creditMemoStatusRgaIds = new Set((issuedCreditMemos ?? []).map((memo) => memo.rga_id));
  const resolvedRgas = customerRgas.map((rga) => {
    if (rga.status !== "authorized") return rga;
    if (rga.requested_resolution_type === "credit") return { ...rga, status: creditMemoStatusRgaIds.has(rga.id) ? "closed" : "waiting_for_credit_memo" };
    if (rga.requested_resolution_type === "replacement") { const replacement = replacementByRga.get(rga.id); return { ...rga, status: !replacement ? "waiting_for_replacement_order" : ["partially_shipped", "shipped", "closed"].includes(replacement.status) ? "closed" : "replacement_order_created" }; }
    return rga;
  });

  const locations = (locationsResult.data ?? []) as CustomerLocation[];
  const freightPolicies = (freightResult.data ?? []) as FreightPolicy[];
  const accountFreightPolicy = freightPolicies.find(
    (policy) => !policy.customer_location_id,
  );
  const locationFreightPolicies = new Map(
    freightPolicies
      .filter((policy) => policy.customer_location_id)
      .map((policy) => [policy.customer_location_id!, policy]),
  );
  const activePrimaryShowrooms = new Map(
    ((primaryShowroomsResult.data ?? []) as PrimaryShowroomEnrollment[])
      .filter((showroom) => showroom.program_status === "active")
      .map((showroom) => [showroom.customer_location_id, showroom]),
  );
  const shippingFreightTerms: ShippingAddressFreightTerm[] = await Promise.all(
    locations
      .filter((location) => location.is_shipping_address)
      .map(async (location) => {
        const freightLevel = await resolveFreightLevelForCustomer(
          customerId,
          customer.account_type_id,
          location.id,
        );
        const locationPolicy = locationFreightPolicies.get(location.id);
        const updatedAt =
          locationPolicy?.updated_at ??
          activePrimaryShowrooms.get(location.id)?.updated_at ??
          accountFreightPolicy?.updated_at ??
          location.updated_at ??
          null;

        return {
          freightTerm: freightLevel?.level_name ?? "Not configured",
          locationId: location.id,
          locationName: location.location_name,
          updatedAt,
        };
      }),
  );
  const resolvedDropshipSettings = await resolveDropshipSettingsForCustomer(
    customerId,
    customer.account_type_id,
  );
  const accountDropshipFreightLevel = accountFreightPolicy?.dropship_freight_level_id || (accountFreightPolicy?.dropship_freight_allowance_amount !== null && accountFreightPolicy?.dropship_freight_allowance_amount !== undefined)
    ? resolvedDropshipSettings.freightLevel?.level_name ?? "Not configured"
    : "Account Freight Level";

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
  const packingListIds = (packingListsResult.data ?? []).map(
    (packingList) => packingList.id,
  );
  const packingShipmentIds = [
    ...new Set(
      (packingListsResult.data ?? [])
        .map((packingList) => packingList.freight_shipment_id)
        .filter((shipmentId): shipmentId is string => Boolean(shipmentId)),
    ),
  ];
  const [
    orderLinesResult,
    packingListLinesResult,
    packingShipmentsResult,
  ] = await Promise.all([
    orderIds.length
      ? supabase
          .from("sales_order_line")
          .select(
            "sales_order_id, product_id, product_sku_snapshot, quantity_ordered, quantity_shipped, quantity_cancelled, quantity_cleared",
          )
          .in("sales_order_id", orderIds)
      : Promise.resolve({ data: [], error: null }),
    packingListIds.length
      ? supabase
          .from("packing_list_line")
          .select("packing_list_id, quantity_shipped")
          .in("packing_list_id", packingListIds)
      : Promise.resolve({ data: [], error: null }),
    packingShipmentIds.length
      ? supabase
          .from("freight_shipment")
          .select("id, carrier")
          .in("id", packingShipmentIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  const invoiceIds = (invoicesResult.data ?? []).map((invoice) => invoice.id);
  const invoiceLinesResult = invoiceIds.length
    ? await supabase
        .from("customer_invoice_line")
        .select("customer_invoice_id, product_sku_snapshot")
        .in("customer_invoice_id", invoiceIds)
    : { data: [], error: null };
  const shipmentDetailError = [
    orderLinesResult,
    packingListLinesResult,
    packingShipmentsResult,
  ].find((result) => result.error)?.error;
  if (shipmentDetailError) throw new Error(shipmentDetailError.message);
  if (invoiceLinesResult.error) {
    throw new Error(invoiceLinesResult.error.message);
  }
  const creditMemoRgaIds = [
    ...new Set(
      (creditMemosResult.data ?? [])
        .map((creditMemo) => creditMemo.rga_id)
        .filter((rgaId): rgaId is string => Boolean(rgaId)),
    ),
  ];
  const creditMemoRgasResult = creditMemoRgaIds.length
    ? await supabase
        .from("rga")
        .select(
          "id, rga_number, sales_order_id, original_customer_po_number_snapshot",
        )
        .in("id", creditMemoRgaIds)
    : { data: [], error: null };
  if (creditMemoRgasResult.error) {
    throw new Error(creditMemoRgasResult.error.message);
  }
  const creditMemoRgaById = new Map(
    (creditMemoRgasResult.data ?? []).map((rga) => [rga.id, rga]),
  );
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
  const shipmentItemsByPackingList = new Map<string, number>();
  for (const line of packingListLinesResult.data ?? []) {
    shipmentItemsByPackingList.set(
      line.packing_list_id,
      (shipmentItemsByPackingList.get(line.packing_list_id) ?? 0) +
        Number(line.quantity_shipped ?? 0),
    );
  }
  const carrierByShipmentId = new Map(
    (packingShipmentsResult.data ?? []).map((shipment) => [
      shipment.id,
      shipment.carrier,
    ]),
  );
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
    creditMemos: (creditMemosResult.data ?? []).map((creditMemo) => {
      const rga = creditMemo.rga_id
        ? creditMemoRgaById.get(creditMemo.rga_id)
        : null;
      return {
        ...creditMemo,
        rga_number: rga?.rga_number ?? null,
        sales_order_id: rga?.sales_order_id ?? null,
        customer_po_number: rga?.original_customer_po_number_snapshot ?? null,
      };
    }) as CreditMemo[],
    customer,
    shippingFreightTerms,
    dropshipFreightSettings: {
      dropshipRate: `${resolvedDropshipSettings.ratePercent}%${accountFreightPolicy?.dropship_rate_percent === null || accountFreightPolicy?.dropship_rate_percent === undefined ? " (System default)" : ""}`,
      dropshipStatus: resolvedDropshipSettings.isActive ? "Active" : "Inactive",
      freightLevel: accountDropshipFreightLevel,
      residentialSurchargeRate: `${resolvedDropshipSettings.residentialSurchargeRatePercent}%${accountFreightPolicy?.residential_surcharge_rate_percent === null || accountFreightPolicy?.residential_surcharge_rate_percent === undefined ? " (System default)" : ""}`,
      residentialSurchargeStatus: resolvedDropshipSettings.residentialSurchargeActive ? "Active" : "Inactive",
      updatedAt: accountFreightPolicy?.updated_at ?? null,
    },
    invoices: (invoicesResult.data ?? []) as CustomerInvoice[],
    invoiceSearchSkus: Object.fromEntries(invoiceSearchSkus),
    locations,
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
    packingLists: (packingListsResult.data ?? []).map((packingList) => ({
      ...packingList,
      carrier: packingList.freight_shipment_id
        ? (carrierByShipmentId.get(packingList.freight_shipment_id) ?? null)
        : null,
      items_shipped: shipmentItemsByPackingList.get(packingList.id) ?? 0,
      total_order_items: shippingByOrder.get(packingList.sales_order_id)?.total ?? 0,
    })) as PackingList[],
    primaryShowrooms: (primaryShowroomsResult.data ??
      []) as PrimaryShowroomEnrollment[],
    rgas: resolvedRgas,
    salesRepAssignments: (salesRepAssignmentsResult.data ??
      []) as CustomerSalesRepAssignment[],
  };
}

async function getOrderEntryData(customerId: string) {
  const supabase = createSupabaseAdminClient();
  const [customerResult, locationsResult, accessoryResult, dropshipSettingsResult] = await Promise.all([
    supabase
      .from("customer_account")
      .select("id, name, account_type_id, default_discount_percent")
      .eq("id", customerId)
      .single(),
    supabase
      .from("customer_location")
      .select(
        "id, location_name, address_line_1, city, state_province, country_code, receiver_name, phone, email, is_default_ship_to, territory_id",
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
    createSupabaseUntypedAdminClient()
      .from("system_setting")
      .select("setting_value")
      .eq("setting_key", "dropship_settings")
      .maybeSingle(),
  ]);

  const initialFailure = [
    customerResult,
    locationsResult,
    accessoryResult,
    dropshipSettingsResult,
  ].find((result) => result.error);
  if (initialFailure?.error) {
    throw new Error(initialFailure.error.message);
  }

  if (!customerResult.data) return null;
  const defaultFreightLevel = await resolveFreightLevelForCustomer(
    customerId,
    customerResult.data.account_type_id,
  );
  const resolvedDropshipSettings = await resolveDropshipSettingsForCustomer(
    customerId,
    customerResult.data.account_type_id,
  );
  const freightLevelsByLocation = new Map(
    await Promise.all(
      (locationsResult.data ?? []).map(async (location) => [
        location.id,
        await resolveFreightLevelForCustomer(
          customerId,
          customerResult.data.account_type_id,
          location.id,
        ),
      ] as const),
    ),
  );
  const locationIds = (locationsResult.data ?? []).map((location) => location.id);
  const { data: locationAssignments, error: locationAssignmentsError } =
    locationIds.length
      ? await createSupabaseUntypedAdminClient()
          .from("customer_location_rep_assignment")
          .select("customer_location_id, territory_id, sales_rep_agency_id, sales_rep_id")
          .in("customer_location_id", locationIds)
          .eq("coverage_role", "primary")
          .eq("status", "active")
          .is("end_date", null)
      : { data: [], error: null };
  if (locationAssignmentsError) throw new Error(locationAssignmentsError.message);

  const territoryIds = [
    ...new Set(
      [
        ...(locationsResult.data ?? []).map((location) => location.territory_id),
        ...(locationAssignments ?? []).map((assignment) => assignment.territory_id),
      ].filter((territoryId): territoryId is string => Boolean(territoryId)),
    ),
  ];
  const [territoriesResult, territoryAssignmentsResult] = await Promise.all([
    territoryIds.length
      ? createSupabaseUntypedAdminClient()
          .from("territory")
          .select("id, territory_code, name")
          .in("id", territoryIds)
          .eq("status", "active")
      : Promise.resolve({ data: [], error: null }),
    territoryIds.length
      ? createSupabaseUntypedAdminClient()
          .from("territory_assignment")
          .select("territory_id, sales_rep_agency_id")
          .in("territory_id", territoryIds)
          .eq("status", "active")
          .is("end_date", null)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (territoriesResult.error || territoryAssignmentsResult.error) {
    throw new Error(
      territoriesResult.error?.message ??
        territoryAssignmentsResult.error?.message ??
        "Unable to load customer territory coverage.",
    );
  }
  const agencyIds = [
    ...new Set(
      [
        ...(locationAssignments ?? []).map(
          (assignment) => assignment.sales_rep_agency_id,
        ),
        ...(territoryAssignmentsResult.data ?? []).map(
          (assignment) => assignment.sales_rep_agency_id,
        ),
      ].filter((agencyId): agencyId is string => Boolean(agencyId)),
    ),
  ];
  const [agenciesResult, repsResult] = await Promise.all([
    agencyIds.length
      ? createSupabaseUntypedAdminClient()
          .from("sales_rep_agency")
          .select("id, name, commission_default_percent")
          .in("id", agencyIds)
          .eq("status", "active")
      : Promise.resolve({ data: [], error: null }),
    agencyIds.length
      ? createSupabaseUntypedAdminClient()
          .from("sales_rep")
          .select("id, name, sales_rep_agency_id")
          .in("sales_rep_agency_id", agencyIds)
          .eq("status", "active")
          .order("name", { ascending: true })
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (agenciesResult.error || repsResult.error) {
    throw new Error(
      agenciesResult.error?.message ??
        repsResult.error?.message ??
        "Unable to load sales coverage choices.",
    );
  }
  const assignmentByLocation = new Map(
    (locationAssignments ?? []).map((assignment) => [
      assignment.customer_location_id,
      assignment,
    ]),
  );
  const territoryAgencyByTerritory = new Map<string, string>();
  for (const assignment of territoryAssignmentsResult.data ?? []) {
    if (!territoryAgencyByTerritory.has(assignment.territory_id)) {
      territoryAgencyByTerritory.set(
        assignment.territory_id,
        assignment.sales_rep_agency_id,
      );
    }
  }
  const agencyById = new Map(
    (agenciesResult.data ?? []).map((agency) => [agency.id, agency]),
  );
  const agenciesByTerritory = new Map<string, { id: string; name: string }[]>();
  for (const assignment of territoryAssignmentsResult.data ?? []) {
    const agency = agencyById.get(assignment.sales_rep_agency_id);
    if (!agency) continue;
    agenciesByTerritory.set(assignment.territory_id, [
      ...(agenciesByTerritory.get(assignment.territory_id) ?? []),
      { id: agency.id, name: agency.name },
    ]);
  }
  const territories: OrderTerritoryOption[] = (territoriesResult.data ?? [])
    .map((territory) => {
      const locationAssignment = (locationAssignments ?? []).find(
        (assignment) => assignment.territory_id === territory.id,
      );
      const agencyId =
        locationAssignment?.sales_rep_agency_id ??
        territoryAgencyByTerritory.get(territory.id) ??
        null;
      return {
        agencies: agenciesByTerritory.get(territory.id) ?? [],
        agencyId,
        agencyCommissionRate: agencyId
          ? Number(agencyById.get(agencyId)?.commission_default_percent ?? 0)
          : null,
        agencyName: agencyId ? agencyById.get(agencyId)?.name ?? null : null,
        id: territory.id,
        name: `${territory.territory_code} - ${territory.name}`,
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
  const salesReps: OrderSalesRepOption[] = (repsResult.data ?? []).map(
    (rep) => ({
      agencyId: rep.sales_rep_agency_id,
      id: rep.id,
      name: rep.name,
    }),
  );

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
    (location) => {
      const assignment = assignmentByLocation.get(location.id);
      const territoryId = assignment?.territory_id ?? location.territory_id ?? null;
      return {
      address: [
        location.address_line_1,
        location.city,
        location.state_province,
        location.country_code,
      ]
        .filter(Boolean)
        .join(", "),
      agencyId:
        assignment?.sales_rep_agency_id ??
        (territoryId ? territoryAgencyByTerritory.get(territoryId) ?? null : null),
      contactName: location.receiver_name,
      email: location.email,
      freightLevel: (() => {
        const freightLevel = freightLevelsByLocation.get(location.id);
        return freightLevel ? { freeFreightAllowance: freightLevel.free_freight_allowance, freightRatePercent: freightLevel.freight_rate_percent, levelName: freightLevel.level_name } : null;
      })(),
      id: location.id,
      isDefault: location.is_default_ship_to,
      name: location.location_name,
      phone: location.phone,
      salesRepId: assignment?.sales_rep_id ?? null,
      territoryId,
    };
    },
  );

  return {
    customer: {
      ...customerResult.data,
      dropshipSettings: {
        freightTerms: resolvedDropshipSettings.freightTerms,
        isActive: resolvedDropshipSettings.isActive,
        ratePercent: resolvedDropshipSettings.ratePercent,
        residentialSurchargeActive: resolvedDropshipSettings.residentialSurchargeActive,
        residentialSurchargeRatePercent: resolvedDropshipSettings.residentialSurchargeRatePercent,
      },
      defaultDropshipFreightLevel: resolvedDropshipSettings.freightLevel
        ? {
            freeFreightAllowance: resolvedDropshipSettings.freightLevel.free_freight_allowance,
            freightRatePercent: resolvedDropshipSettings.freightLevel.freight_rate_percent,
            levelName: resolvedDropshipSettings.freightLevel.level_name,
          }
        : null,
      defaultFreightLevel: defaultFreightLevel
        ? {
            freeFreightAllowance: defaultFreightLevel.free_freight_allowance,
            freightRatePercent: defaultFreightLevel.freight_rate_percent,
            levelName: defaultFreightLevel.level_name,
          }
        : null,
    },
    partOptions,
    products: productOptions,
    salesReps,
    shipToOptions,
    territories,
  };
}

async function ensureSalesRepAgencyOrderAccount(agencyId: string) {
  const supabase = createSupabaseUntypedAdminClient();
  const { data: agency, error: agencyError } = await supabase
    .from("sales_rep_agency")
    .select("id, name, main_contact_name, email, phone, address_line_1, address_line_2, city, state_province, postal_code, customer_account_id")
    .eq("id", agencyId)
    .maybeSingle();
  if (agencyError || !agency) {
    throw new Error(agencyError?.message ?? "Sales rep agency not found.");
  }

  let customerAccountId = agency.customer_account_id as string | null;
  if (!customerAccountId) {
    const [{ data: repAccountType, error: accountTypeError }, { data: businessType, error: businessTypeError }] = await Promise.all([
      supabase.from("customer_account_type").select("id").eq("type_code", "rep").eq("is_active", true).maybeSingle(),
      supabase.from("customer_business_type").select("id").eq("type_code", "other").eq("is_active", true).maybeSingle(),
    ]);
    if (accountTypeError || businessTypeError || !repAccountType || !businessType) {
      throw new Error(accountTypeError?.message ?? businessTypeError?.message ?? "The Rep customer account settings are not available.");
    }
    const { data: account, error: accountError } = await supabase
      .from("customer_account")
      .insert({
        account_type_id: repAccountType.id,
        billing_contact_name: agency.main_contact_name,
        billing_email: agency.email,
        business_type_id: businessType.id,
        linked_sales_rep_agency_id: agency.id,
        main_email: agency.email,
        main_phone: agency.phone,
        name: agency.name,
        purchase_contact_name: agency.main_contact_name,
        purchase_email: agency.email,
        status: "active",
      })
      .select("id")
      .single();
    if (accountError || !account) {
      throw new Error(accountError?.message ?? "The agency customer account could not be created.");
    }
    customerAccountId = account.id;
    const { error: agencyUpdateError } = await supabase
      .from("sales_rep_agency")
      .update({ customer_account_id: customerAccountId })
      .eq("id", agency.id);
    if (agencyUpdateError) throw new Error(agencyUpdateError.message);
  }

  const [{ data: reps, error: repsError }, { data: existingLocations, error: locationsError }] = await Promise.all([
    supabase.from("sales_rep").select("id, name, email, phone, address_line_1, address_line_2, city, state_province, postal_code").eq("sales_rep_agency_id", agency.id).eq("status", "active").order("name", { ascending: true }),
    supabase.from("customer_location").select("id, legacy_location_code").eq("customer_account_id", customerAccountId),
  ]);
  if (repsError || locationsError) throw new Error(repsError?.message ?? locationsError?.message ?? "The agency shipping addresses could not be loaded.");

  const existingByCode = new Map((existingLocations ?? []).map((location) => [location.legacy_location_code, location.id]));
  const candidates = [
    {
      address_line_1: agency.address_line_1,
      address_line_2: agency.address_line_2,
      city: agency.city,
      code: `agency-order-office:${agency.id}`,
      email: agency.email,
      is_billing_address: true,
      is_default_ship_to: true,
      location_name: `${agency.name} - Main Office`,
      phone: agency.phone,
      receiver_name: agency.main_contact_name,
      state_province: agency.state_province,
      postal_code: agency.postal_code,
    },
    ...(reps ?? []).map((rep) => ({
      address_line_1: rep.address_line_1,
      address_line_2: rep.address_line_2,
      city: rep.city,
      code: `agency-order-rep:${rep.id}`,
      email: rep.email,
      is_billing_address: false,
      is_default_ship_to: false,
      location_name: rep.name,
      phone: rep.phone,
      receiver_name: rep.name,
      state_province: rep.state_province,
      postal_code: rep.postal_code,
    })),
  ].filter((location) => Boolean(location.address_line_1 && location.city && location.state_province && location.postal_code));

  for (const location of candidates) {
    const payload = {
      address_line_1: location.address_line_1,
      address_line_2: location.address_line_2,
      city: location.city,
      country: "United States",
      country_code: "USA",
      email: location.email,
      is_billing_address: location.is_billing_address,
      is_default_ship_to: location.is_default_ship_to,
      is_shipping_address: true,
      legacy_location_code: location.code,
      location_name: location.location_name,
      location_type: "ship_to",
      phone: location.phone,
      postal_code: location.postal_code,
      receiver_name: location.receiver_name,
      state_province: location.state_province,
      status: "active",
    };
    const locationId = existingByCode.get(location.code);
    const result = locationId
      ? await supabase.from("customer_location").update(payload).eq("id", locationId)
      : await supabase.from("customer_location").insert({ ...payload, customer_account_id: customerAccountId });
    if (result.error) throw new Error(result.error.message);
  }

  return { customerAccountId: customerAccountId!, name: agency.name };
}

async function getSalesOrderDetail(
  orderId: string,
): Promise<SalesOrderDetail | null> {
  const supabase = createSupabaseAdminClient();
  const [orderResult, linesResult] = await Promise.all([
    supabase
      .from("sales_order")
      .select(
        "id, customer_account_id, customer_location_id, sales_order_number, customer_po_number, customer_name_snapshot, order_date, requested_ship_date, order_source, order_type, status, shipping_readiness_status, credit_hold_status, is_dropship, ship_to_type, ship_to_display_name_snapshot, ship_to_snapshot_json, bill_to_snapshot_json, shipping_priority, sales_rep_agency_id_snapshot, sales_rep_id_snapshot, territory_id_snapshot, subtotal_amount, freight_amount, dropship_fee_amount, ground_freight_terms_snapshot, tax_amount, total_amount, notes",
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
        .select("product_id, sellable_quantity, next_incoming_eta")
        .in("product_id", productIds)
    : { data: [], error: null };
  if (inventoryResult.error) throw new Error(inventoryResult.error.message);
  const inventoryByProduct = new Map(
    (inventoryResult.data ?? []).map((item) => [
      item.product_id,
      {
        availableInventory: Number(item.sellable_quantity ?? 0),
        nextIncomingEta: item.next_incoming_eta ?? null,
      },
    ]),
  );

  const lineIds = (linesResult.data ?? []).map((line) => line.id);
  const packingLineResult = lineIds.length
    ? await supabase
        .from("packing_list_line")
        .select("sales_order_line_id, packing_list_id, quantity_shipped")
        .in("sales_order_line_id", lineIds)
    : { data: [], error: null };
  if (packingLineResult.error) throw new Error(packingLineResult.error.message);

  const packingListIds = [
    ...new Set((packingLineResult.data ?? []).map((line) => line.packing_list_id)),
  ];
  const packingListsResult = packingListIds.length
    ? await supabase
        .from("packing_list")
        .select("id, freight_shipment_id, ship_date, status")
        .in("id", packingListIds)
    : { data: [], error: null };
  if (packingListsResult.error) throw new Error(packingListsResult.error.message);

  const postedPackingLists = (packingListsResult.data ?? []).filter((packingList) =>
    ["shipped", "invoiced"].includes(packingList.status),
  );
  const shipmentIds = [
    ...new Set(
      postedPackingLists
        .map((packingList) => packingList.freight_shipment_id)
        .filter((shipmentId): shipmentId is string => Boolean(shipmentId)),
    ),
  ];
  const shipmentsResult = shipmentIds.length
    ? await supabase
        .from("freight_shipment")
        .select("id, carrier, master_tracking_number")
        .in("id", shipmentIds)
    : { data: [], error: null };
  if (shipmentsResult.error) throw new Error(shipmentsResult.error.message);

  const packingListById = new Map(
    postedPackingLists.map((packingList) => [packingList.id, packingList]),
  );
  const shipmentById = new Map(
    (shipmentsResult.data ?? []).map((shipment) => [shipment.id, shipment]),
  );
  const shipmentDetailsByLineId = new Map<
    string,
    {
      carrier: string | null;
      ship_date: string | null;
      shipped_quantity: number;
      tracking_number: string | null;
    }[]
  >();
  for (const packingLine of packingLineResult.data ?? []) {
    const packingList = packingListById.get(packingLine.packing_list_id);
    if (!packingList || Number(packingLine.quantity_shipped ?? 0) <= 0) continue;
    const shipment = packingList.freight_shipment_id
      ? shipmentById.get(packingList.freight_shipment_id)
      : null;
    shipmentDetailsByLineId.set(packingLine.sales_order_line_id, [
      ...(shipmentDetailsByLineId.get(packingLine.sales_order_line_id) ?? []),
      {
        carrier: shipment?.carrier ?? null,
        ship_date: packingList.ship_date ?? null,
        shipped_quantity: Number(packingLine.quantity_shipped ?? 0),
        tracking_number: shipment?.master_tracking_number ?? null,
      },
    ]);
  }

  const billToLocationResult = orderResult.data.bill_to_snapshot_json
    ? { data: null, error: null }
    : await supabase
        .from("customer_location")
        .select(
          "location_name, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, receiver_name, phone, email",
        )
        .eq("customer_account_id", orderResult.data.customer_account_id)
        .eq("is_billing_address", true)
        .eq("status", "active")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
  if (billToLocationResult.error)
    throw new Error(billToLocationResult.error.message);

  const billToSnapshot =
    orderResult.data.bill_to_snapshot_json ??
    (billToLocationResult.data
      ? {
          bill_to_display_name: billToLocationResult.data.location_name,
          address_line_1: billToLocationResult.data.address_line_1,
          address_line_2: billToLocationResult.data.address_line_2,
          city: billToLocationResult.data.city,
          state_province: billToLocationResult.data.state_province,
          postal_code: billToLocationResult.data.postal_code,
          country: billToLocationResult.data.country,
          country_code: billToLocationResult.data.country_code,
          shipping_contact_name: billToLocationResult.data.receiver_name,
          shipping_contact_phone: billToLocationResult.data.phone,
          shipping_contact_email: billToLocationResult.data.email,
        }
      : null);

  return {
    ...orderResult.data,
    bill_to_snapshot_json: billToSnapshot,
    converted_order: convertedOrderResult.data,
    lines: (linesResult.data ?? []).map((line) => ({
      ...line,
      available_inventory: inventoryByProduct.get(line.product_id)?.availableInventory ?? 0,
      line_total: Number(line.line_total ?? 0),
      next_incoming_eta: inventoryByProduct.get(line.product_id)?.nextIncomingEta ?? null,
      shipment_details: shipmentDetailsByLineId.get(line.id) ?? [],
    })),
  } as unknown as SalesOrderDetail;
}

async function getInvoiceQueuePackingLists() {
  const supabase = createSupabaseAdminClient();
  const { data: packingLists, error: packingListsError } = await supabase
    .from("packing_list")
    .select(
      "id, packing_list_number, customer_account_id, customer_po_number_snapshot, sales_order_id, sales_order_number_snapshot, status, invoice_generation_status_snapshot, is_dropship, shipping_fee, allocated_freight_cost, dropship_fee_amount, ship_date, created_at",
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
  const orderIds = [
    ...new Set((packingLists ?? []).map((packingList) => packingList.sales_order_id)),
  ];
  const [customersResult, linesResult, billingProfilesResult, ordersResult] =
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
      orderIds.length
        ? supabase
            .from("sales_order")
            .select("id, commission_payable, commission_rate_percent, order_type, territory_id_snapshot, ground_freight_terms_snapshot")
            .in("id", orderIds)
        : Promise.resolve({ data: [], error: null }),
    ]);
  if (
    customersResult.error ||
    linesResult.error ||
    billingProfilesResult.error ||
    ordersResult.error
  )
    throw new Error(
      customersResult.error?.message ??
        linesResult.error?.message ??
        billingProfilesResult.error?.message ??
        ordersResult.error?.message ??
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
  const orderById = new Map(
    (ordersResult.data ?? []).map((order) => [order.id, order]),
  );
  const territoryIds = [
    ...new Set(
      (ordersResult.data ?? [])
        .map((order) => order.territory_id_snapshot)
        .filter((territoryId): territoryId is string => Boolean(territoryId)),
    ),
  ];
  const [territoriesResult, territoryAssignmentsResult] = await Promise.all([
    territoryIds.length
      ? supabase
          .from("territory")
          .select("id, territory_code, name")
          .in("id", territoryIds)
      : Promise.resolve({ data: [], error: null }),
    territoryIds.length
      ? createSupabaseUntypedAdminClient()
          .from("territory_assignment")
          .select("territory_id, sales_rep_agency_id")
          .in("territory_id", territoryIds)
          .eq("status", "active")
          .is("end_date", null)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (territoriesResult.error || territoryAssignmentsResult.error) {
    throw new Error(
      territoriesResult.error?.message ??
        territoryAssignmentsResult.error?.message ??
        "Unable to load territory commission assignments.",
    );
  }
  const agencyIds = [
    ...new Set(
      (territoryAssignmentsResult.data ?? []).map(
        (assignment) => assignment.sales_rep_agency_id,
      ),
    ),
  ];
  const { data: agencies, error: agenciesError } = agencyIds.length
    ? await createSupabaseUntypedAdminClient()
        .from("sales_rep_agency")
        .select("id, name, commission_default_percent, status")
        .in("id", agencyIds)
        .eq("status", "active")
    : { data: [], error: null };
  if (agenciesError) throw new Error(agenciesError.message);
  const territoryById = new Map(
    (territoriesResult.data ?? []).map((territory) => [territory.id, territory]),
  );
  const assignmentsByTerritory = new Map<string, string[]>();
  for (const assignment of territoryAssignmentsResult.data ?? []) {
    const assigned = assignmentsByTerritory.get(assignment.territory_id) ?? [];
    assigned.push(assignment.sales_rep_agency_id);
    assignmentsByTerritory.set(assignment.territory_id, assigned);
  }
  const agencyById = new Map((agencies ?? []).map((agency) => [agency.id, agency]));
  const commissionForOrder = (salesOrderId: string) => {
    const order = orderById.get(salesOrderId);
    if (order?.order_type === "rga_replacement") {
      return { agencyName: null, defaultPayable: false, defaultPercent: null, eligible: false, territoryLabel: null, unavailableReason: "RGA replacement invoices do not earn commission." };
    }
    if (!order?.territory_id_snapshot) {
      return { agencyName: null, defaultPayable: false, defaultPercent: null, eligible: false, territoryLabel: null, unavailableReason: "No territory is assigned to the original order." };
    }
    const territory = territoryById.get(order.territory_id_snapshot);
    const assignedAgencyIds = [...new Set(assignmentsByTerritory.get(order.territory_id_snapshot) ?? [])].filter((agencyId) => agencyById.has(agencyId));
    if (assignedAgencyIds.length !== 1) {
      return { agencyName: null, defaultPayable: false, defaultPercent: null, eligible: false, territoryLabel: territory ? `${territory.territory_code} - ${territory.name}` : "Territory assigned", unavailableReason: assignedAgencyIds.length ? "More than one active agency is assigned to this territory." : "No active sales agency is assigned to this territory." };
    }
    const agency = agencyById.get(assignedAgencyIds[0])!;
    return { agencyName: agency.name, defaultPayable: order.commission_payable, defaultPercent: order.commission_rate_percent ?? Number(agency.commission_default_percent ?? 0), eligible: true, territoryLabel: territory ? `${territory.territory_code} - ${territory.name}` : "Territory assigned", unavailableReason: null };
  };
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
    commission: commissionForOrder(packingList.sales_order_id),
    freightTerm:
      orderById.get(packingList.sales_order_id)
        ?.ground_freight_terms_snapshot ?? "prepaid",
    invoiceFreightCharge:
      orderById.get(packingList.sales_order_id)
        ?.ground_freight_terms_snapshot === "prepaid"
        ? Number(packingList.shipping_fee ?? 0)
        : 0,
  }));
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
    .select("id, credit_memo_number, brand_name_snapshot, issue_date, amount_remaining")
    .eq("customer_account_id", invoice.customer_account_id)
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
      .select("id, customer_po_number, ground_freight_terms_snapshot, is_dropship")
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

async function getCreditMemoDocument(creditMemoId: string) {
  const supabase = createSupabaseAdminClient();
  const [memoResult, linesResult, applicationsResult] = await Promise.all([
    supabase
      .from("credit_memo")
      .select("id, credit_memo_number, customer_account_id, customer_name_snapshot, brand_name_snapshot, issue_date, reason_code, status, total_credit_amount, amount_applied, amount_remaining, rga_id")
      .eq("id", creditMemoId)
      .maybeSingle(),
    supabase
      .from("credit_memo_line")
      .select("id, description, quantity, unit_amount, line_total")
      .eq("credit_memo_id", creditMemoId)
      .order("created_at"),
    supabase
      .from("credit_memo_application")
      .select("id, customer_invoice_id, amount_applied, applied_date")
      .eq("credit_memo_id", creditMemoId)
      .eq("application_status", "posted")
      .order("applied_date", { ascending: false }),
  ]);
  if (memoResult.error) throw new Error(memoResult.error.message);
  if (linesResult.error) throw new Error(linesResult.error.message);
  if (applicationsResult.error) throw new Error(applicationsResult.error.message);
  if (!memoResult.data) return null;

  const applications = applicationsResult.data ?? [];
  const invoiceIds = [...new Set(applications.map((application) => application.customer_invoice_id))];

  const [customerResult, rgaResult, invoicesResult] = await Promise.all([
    supabase
      .from("customer_account")
      .select("billing_email")
      .eq("id", memoResult.data.customer_account_id)
      .maybeSingle(),
    memoResult.data.rga_id
      ? supabase
          .from("rga")
          .select("rga_number, sales_order_id, original_customer_po_number_snapshot")
          .eq("id", memoResult.data.rga_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    invoiceIds.length
      ? supabase
          .from("customer_invoice")
          .select("id, invoice_number, invoice_date, total_amount")
          .in("id", invoiceIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (customerResult.error) throw new Error(customerResult.error.message);
  if (rgaResult.error) throw new Error(rgaResult.error.message);
  if (invoicesResult.error) throw new Error(invoicesResult.error.message);

  const invoicesById = new Map(
    (invoicesResult.data ?? []).map((invoice) => [invoice.id, invoice]),
  );

  return {
    applications: applications.flatMap((application) => {
      const invoice = invoicesById.get(application.customer_invoice_id);
      return invoice
        ? [{
            amount_applied: Number(application.amount_applied ?? 0),
            applied_date: application.applied_date,
            customer_invoice_id: application.customer_invoice_id,
            id: application.id,
            invoice_date: invoice.invoice_date,
            invoice_number: invoice.invoice_number,
            invoice_total: Number(invoice.total_amount ?? 0),
          }]
        : [];
    }),
    customerEmail: customerResult.data?.billing_email ?? null,
    lines: (linesResult.data ?? []).map((line) => ({
      ...line,
      line_total: Number(line.line_total ?? 0),
    })),
    memo: {
      ...memoResult.data,
      amount_applied: Number(memoResult.data.amount_applied ?? 0),
      amount_remaining: Number(memoResult.data.amount_remaining ?? 0),
      total_credit_amount: Number(memoResult.data.total_credit_amount ?? 0),
      original_customer_po_number:
        rgaResult.data?.original_customer_po_number_snapshot ?? null,
      original_sales_order_id: rgaResult.data?.sales_order_id ?? null,
      rga_number: rgaResult.data?.rga_number ?? null,
    },
  };
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
      "id, policy_name, freight_terms, ltl_freight_terms, ground_freight_terms, preferred_shipping_type, freight_allowance_amount, freight_level_id, flat_rate_percent, default_ltl_carrier, default_ltl_carrier_account_number, default_ground_carrier, default_ground_carrier_account_number, dropship_freight_terms, dropship_default_ltl_carrier, dropship_default_ltl_carrier_account_number, dropship_default_ground_carrier, dropship_default_ground_carrier_account_number, dropship_freight_level_id, dropship_freight_allowance_amount, dropship_freight_rate_percent, dropship_is_active, dropship_rate_percent, residential_surcharge_is_active, residential_surcharge_rate_percent",
    )
    .eq("customer_account_id", customerId)
    .is("customer_location_id", null)
    .eq("is_active", true)
    .order("is_default", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as FreightPolicy | null;
}

async function getActiveFreightLevelOptions() {
  const { data, error } = await createSupabaseUntypedAdminClient()
    .from("freight_level")
    .select("id, level_name, free_freight_allowance, freight_rate_percent")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("level_name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((level) => ({
    id: level.id,
    levelName: level.level_name,
    freeFreightAllowance: Number(level.free_freight_allowance),
    freightRatePercent: Number(level.freight_rate_percent),
  }));
}

async function getLocationForEdit(locationId: string) {
  const supabase = createSupabaseAdminClient();
  const { data: location, error: locationError } = await supabase
    .from("customer_location")
    .select(
      "id, customer_account_id, location_code, location_name, location_type, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, email, is_shipping_address, is_default_ship_to, is_billing_address, is_showroom, status, territory_assignment_source, territory_id",
    )
    .eq("id", locationId)
    .single();

  if (locationError) {
    throw new Error(locationError.message);
  }

  const { data: territory, error: territoryError } = location.territory_id
    ? await createSupabaseUntypedAdminClient()
        .from("territory")
        .select("id, territory_code, name")
        .eq("id", location.territory_id)
        .maybeSingle()
    : { data: null, error: null };

  if (territoryError) {
    throw new Error(territoryError.message);
  }

  const suggestedTerritory = territory ?? await resolveLocationTerritory(location.postal_code);
  const coverageTerritoryId = territory?.id ?? suggestedTerritory?.id ?? null;
  const [coverageOptions, coverageAssignmentResult] = await Promise.all([
    getLocationCoverageOptions(coverageTerritoryId),
    createSupabaseUntypedAdminClient()
      .from("customer_location_rep_assignment")
      .select("sales_rep_agency_id, sales_rep_id")
      .eq("customer_location_id", locationId)
      .eq("coverage_role", "primary")
      .eq("status", "active")
      .is("end_date", null)
      .maybeSingle(),
  ]);

  if (coverageAssignmentResult.error) {
    throw new Error(coverageAssignmentResult.error.message);
  }

  const salesRepAgencyId = coverageAssignmentResult.data?.sales_rep_agency_id ?? null;
  const salesRepId = coverageAssignmentResult.data?.sales_rep_id ?? null;
  const [salesRepAgencyResult, salesRepResult] = await Promise.all([
    salesRepAgencyId
      ? createSupabaseUntypedAdminClient()
          .from("sales_rep_agency")
          .select("name")
          .eq("id", salesRepAgencyId)
          .maybeSingle()
      : { data: null, error: null },
    salesRepId
      ? createSupabaseUntypedAdminClient()
          .from("sales_rep")
          .select("name")
          .eq("id", salesRepId)
          .maybeSingle()
      : { data: null, error: null },
  ]);

  if (salesRepAgencyResult.error) {
    throw new Error(salesRepAgencyResult.error.message);
  }
  if (salesRepResult.error) {
    throw new Error(salesRepResult.error.message);
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
    territory: territory as LocationTerritory | null,
    territoryAssignmentSource: location.territory_assignment_source as "auto" | "manual_unassigned",
    suggestedTerritory: suggestedTerritory as LocationTerritory | null,
    coverage: {
      agencies: coverageOptions.agencies,
      reps: coverageOptions.reps,
      salesRepAgencyId,
      salesRepAgencyName: salesRepAgencyResult.data?.name ?? null,
      salesRepId,
      salesRepName: salesRepResult.data?.name ?? null,
    },
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

  const { data: account, error: accountError } = await supabase
    .from("customer_account")
    .select("account_type_id")
    .eq("id", customerId)
    .maybeSingle();
  if (accountError) throw new Error(accountError.message);
  const freightLevel = account && locationData.location.is_shipping_address
    ? await resolveFreightLevelForCustomer(customerId, account.account_type_id, locationId)
    : null;

  return {
    ...locationData,
    contacts: (contactsResult.data ?? []) as CustomerContact[],
    displays: (displaysResult.data ?? []) as ShowroomDisplay[],
    invoices: (invoicesResult.data ?? []) as CustomerInvoice[],
    orders: (ordersResult.data ?? []) as SalesOrder[],
    packingLists: (packingListsResult.data ?? []) as PackingList[],
    freightLevel: freightLevel ? { levelName: freightLevel.level_name, freeFreightAllowance: freightLevel.free_freight_allowance, freightRatePercent: freightLevel.freight_rate_percent } : null,
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
  const customerSearchFilters: CustomerSearchFilters = {
    accountTypeId: params.customer_account_type,
    agencyId: params.customer_agency,
    status: params.customer_status,
    territoryId: params.customer_territory,
  };
  const customers = await loadOptionalLookup("Customers", () =>
    searchCustomers(query, customerListMode, customerSearchFilters),
  );
  const selectedProductId =
    activeModule === "products" ? params.product : undefined;
  const selectedPartId =
    activeModule === "product-parts" ? params.part : undefined;
  const productListMode =
    activeModule === "discontinued-products" ? "discontinued" : "active";
  const emptyProductSearchResult: ProductSearchResult = {
    items: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  };
  const productSearchResult =
    (activeModule === "products" && !selectedProductId) ||
    activeModule === "discontinued-products"
      ? await searchProducts(
          query,
          productFilters,
          requestedProductPage,
          requestedProductPageSize,
          productListMode,
        ).catch((error) => {
          console.warn(
            "Products could not be loaded:",
            error instanceof Error ? error.message : error,
          );
          return emptyProductSearchResult;
        })
      : emptyProductSearchResult;
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
    customerStatusOptions,
    territoryOptions,
    salesRepAgencyOptions,
    salesRepOptions,
    productBrandOptions,
    productStyleOptions,
    productCategoryOptions,
    finishOptions,
    materialOptions,
    warehouseOptions,
    warehouseLocationOptions,
  ] = await Promise.all([
    loadOptionalLookup("Customer account types", () => getCustomerOptions("customer_account_type")),
    loadOptionalLookup("Customer business types", () => getCustomerOptions("customer_business_type")),
    loadOptionalLookup("Customer statuses", getCustomerStatusOptions),
    loadOptionalLookup("Territories", getTerritoryOptions),
    loadOptionalLookup("Sales rep agencies", getSalesRepAgencyOptions),
    loadOptionalLookup("Sales reps", getSalesRepOptions),
    loadOptionalLookup("Product brands", getProductBrandOptions),
    loadOptionalLookup("Product styles", getProductStyleOptions),
    loadOptionalLookup("Product categories", getProductCategoryOptions),
    loadOptionalLookup("Finishes", getFinishOptions),
    loadOptionalLookup("Materials", getMaterialOptions),
    loadOptionalLookup("Warehouses", getWarehouseOptions),
    loadOptionalLookup("Warehouse locations", getWarehouseLocationOptions),
  ]);
  const accountTypes = toLookup(accountTypeOptions);
  const businessTypes = toLookup(businessTypeOptions);
  const dashboard = selectedCustomerId
    ? await getCustomerDashboard(selectedCustomerId)
    : null;
  const moduleLabels: Record<string, string> = {
    admin: "Admin",
    "admin-warehouse": "Warehouse Information",
    "admin-warehouse-edit": "Edit Warehouse",
    "admin-zone-add": "Add Zone",
    "admin-zone-edit": "Edit Zone",
    "admin-aisle-add": "Add Aisle",
    "admin-aisle-edit": "Edit Aisle",
    "admin-section-add": "Add Section",
    "admin-section-edit": "Edit Section",
    "admin-territory-edit": "Territory Settings",
    "add-contact": "Add Contact",
    "add-customer": "Add Customer",
    "add-location": "Add Location",
    "add-product": "Add Product",
    "add-product-box": "Add Product Box",
    ar: "Payments / AR",
    "create-rga": "Create RGA",
    customers: "Customers",
    "discontinued-products": "Discontinued Products",
    "edit-account-profile": "Edit Account Profile",
    "edit-billing-credit": "Edit Billing / Credit",
    "edit-contact": "Edit Contact",
    "edit-freight": "Edit Freight",
    "edit-dropship-settings": "Edit Dropship Settings",
    "edit-location-freight": "Edit Freight Term",
    "edit-location": "Edit Location",
    "edit-sales-rep": "Edit Sales Rep",
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
    "commission-statement-confirm": "Commission Statement",
    "commission-payment": "Commission Payment",
    "commission-statement": "Commission Statement",
    "credit-memo-create": "Credit Memo Creation",
    "credit-memo-document": "Credit Memo",
    "sales-rep-agency-edit": "Sales Rep Agency",
    "sales-rep-agency-territory-add": "Add Territory",
    "sales-rep-agencies": "Sales Rep Agencies",
    "sales-rep-edit": "Add Sales Rep",
    "sales-rep": "Sales Rep",
    "sales-rep-sub-territory-add": "Add Sub-Territory",
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
            statusOptions={customerStatusOptions}
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
            statusOptions={customerStatusOptions}
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
            selectedTab={params.location_tab}
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
        ) : activeModule === "edit-location-freight" ? (
          <EditLocationFreightForm
            customerId={params.customer}
            error={params.error}
            loadCustomer={getCustomerName}
            locationId={params.location}
            saveAction={updateLocationFreightTermAction}
          />
        ) : activeModule === "edit-sales-rep" ? (
          <EditSalesRepForm
            customerId={params.customer}
            error={params.error}
            loadAssignments={getCustomerRepAssignmentsForEdit}
            loadCustomer={getCustomerName}
            repOptions={salesRepOptions}
            saveAction={saveCustomerRepAssignmentAction}
            territoryOptions={territoryOptions}
          />
        ) : activeModule === "edit-freight" ? (
          <EditFreightForm
            customerId={params.customer}
            error={params.error}
            loadCustomer={getCustomerName}
            loadFreightPolicy={getDefaultFreightPolicy}
            saveAction={updateFreightPolicyAction}
          />
        ) : activeModule === "edit-dropship-settings" ? (
          <EditDropshipSettingsForm
            customerId={params.customer ?? ""}
            customerName={(await getCustomerName(params.customer ?? "")).name}
            error={params.error}
            freightLevels={await getActiveFreightLevelOptions()}
            freightPolicy={await getDefaultFreightPolicy(params.customer ?? "")}
            saveAction={updateCustomerDropshipSettingsAction}
          />
        ) : activeModule === "sales-rep-agencies" ? (
          <SalesRepAgenciesDashboard {...(await getSalesCoverageDashboard())} />
        ) : activeModule === "sales-rep-agency-edit" ? (
          <SalesRepAgencyEditor
            agencyId={params.agency}
            createAction={createSalesRepAgencyAction}
            error={params.error}
            saveAction={updateSalesRepAgencyAction}
          />
        ) : activeModule === "sales-rep-agency" ? (
          <SalesRepAgencyPage agencyId={params.agency} prepareCommissionStatementAction={prepareCommissionStatementAction} removeSalesRepAction={removeSalesRepFromAgencyAction} removeTerritoryAction={removeTerritoryFromAgencyAction} selectedCommissionTab={params.commission_tab} selectedTab={params.agency_tab} />
        ) : activeModule === "commission-statement-confirm" ? (
          <CommissionStatementConfirmationPage agencyId={params.agency} confirmAction={createCommissionStatementAction} error={params.error} invoiceIds={params.commission_invoices} />
        ) : activeModule === "commission-payment" ? (
          <CommissionPaymentPage error={params.error} paymentId={params.commission_payment} saveAction={postCommissionStatementPaymentAction} />
        ) : activeModule === "commission-statement" ? (
          <CommissionStatementPage paymentId={params.commission_payment} />
        ) : activeModule === "sales-rep-agency-territory-add" ? (
          <AgencyTerritoryEditor agencyId={params.agency} error={params.error} saveAction={addTerritoriesToAgencyAction} />
        ) : activeModule === "sales-rep-edit" ? (
          <SalesRepEditor agencyId={params.agency} createAction={createAgencySalesRepAction} error={params.error} salesRepId={params.rep} saveAction={updateAgencySalesRepAction} />
        ) : activeModule === "sales-rep" ? (
          <SalesRepPage deactivateSubTerritoryAction={deactivateSalesRepSubTerritoryAction} salesRepId={params.rep} />
        ) : activeModule === "sales-rep-sub-territory-add" ? (
          <SalesRepSubTerritoryEditor error={params.error} salesRepId={params.rep} saveAction={addSalesRepSubTerritoriesAction} />
        ) : activeModule === "sales-rep-agency-order" && params.agency ? (
          <NewOrderPage
            agencyId={params.agency ?? undefined}
            customerId={(await ensureSalesRepAgencyOrderAccount(params.agency ?? "")).customerAccountId}
            error={params.error}
            getOrderEntryData={getOrderEntryData}
            isAgencyOrder
            saveAction={createSalesOrderAction}
          />
        ) : activeModule === "new-order" ? (
          <NewOrderPage
            customerId={params.customer}
            error={params.error}
            getOrderEntryData={getOrderEntryData}
            locationId={params.location}
            saveAction={createSalesOrderAction}
          />
        ) : activeModule === "order-acknowledgement" ? (
          <OrderAcknowledgementPage
            loadOrder={getSalesOrderDetail}
            orderId={params.order}
          />
        ) : activeModule === "create-rga" ? (
          <CreateRgaPage
            createAction={createRgaFromOrderAction}
            error={params.error}
            loadOrder={getSalesOrderDetail}
            orderId={params.order}
          />
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
            reviewAction={reviewRgaAction}
            rgaId={params.rga}
          />
        ) : activeModule === "rga-replacement-confirm" ? (
          <RgaReplacementOrderConfirmPage createAction={createRgaReplacementOrderAction} rgaId={params.rga} />
        ) : activeModule === "rga-solution" ? (
          <RgaSolutionPage
            createReplacementOrderAction={prepareRgaReplacementOrderAction}
            error={params.error}
            issueCreditMemoAction={issueRgaCreditMemoAction}
            notice={params.notice}
            rgaId={params.rga}
          />
        ) : activeModule === "credit-memo-create" ? (
          <CreditMemoCreationPage
            createAction={createRgaCreditMemoAction}
            error={params.error}
            rgaId={params.rga}
          />
        ) : activeModule === "credit-memo-document" ? (
          <CreditMemoDocumentPage
            creditMemoId={params.credit_memo}
            loadCreditMemo={getCreditMemoDocument}
          />
        ) : selectedPartId ? (
          <PartDetailDashboard
            deleteParentLinkAction={deletePartParentLinkAction}
            part={partDetail}
            selectedTab={params.product_tab ?? "profile"}
          />
        ) : selectedProductId ? (
          <ProductDetailDashboard
            product={productDetail}
            selectedTab={params.product_tab ?? "profile"}
            uploadDocumentAction={uploadProductDocumentAction}
          />
        ) : activeModule === "add-product" ? (
          <AddProductForm
            brandOptions={productBrandOptions}
            categoryOptions={productCategoryOptions}
            createProductAction={createProductAction}
            error={params.error}
            materialOptions={materialOptions}
            styleOptions={productStyleOptions}
          />
        ) : activeModule === "edit-product-profile" ? (
          <EditProductProfileForm
            brandOptions={productBrandOptions}
            categoryOptions={productCategoryOptions}
            error={params.error}
            loadProduct={getProductDetail}
            productId={params.product}
            setupFlow={params.setup === "product"}
            materialOptions={materialOptions}
            styleOptions={productStyleOptions}
            updateProductProfileAction={updateProductProfileAction}
          />
        ) : activeModule === "edit-product-specs" ? (
          <EditProductSpecsForm
            error={params.error}
            loadProduct={getProductDetail}
            productId={params.product}
            setupFlow={params.setup === "product"}
            specSection={params.spec_section ?? "dimensions"}
            updateProductSpecsAction={updateProductSpecsAction}
          />
        ) : activeModule === "edit-product-boxes" ? (
          <EditProductBoxesForm
            error={params.error}
            loadProduct={getProductDetail}
            productId={params.product}
            setupFlow={params.setup === "product"}
            updateProductBoxesAction={updateProductBoxesAction}
          />
        ) : activeModule === "add-product-box" ? (
          <AddProductBoxForm
            addProductBoxAction={addProductBoxAction}
            error={params.error}
            loadProduct={getProductDetail}
            productId={params.product}
            setupFlow={params.setup === "product"}
          />
        ) : activeModule === "edit-product-inventory" ? (
          <EditProductInventoryForm
            error={params.error}
            loadProduct={getProductDetail}
            productId={params.product}
            returnModule={params.return_module}
            setupFlow={params.setup === "product"}
            updateProductInventoryAction={updateProductInventoryAction}
            warehouseLocationOptions={warehouseLocationOptions}
            warehouseOptions={warehouseOptions}
          />
        ) : activeModule === "edit-product-images" ? (
          <EditProductImagesForm
            error={params.error}
            imageCategory={params.image_category}
            loadProduct={getProductDetail}
            notice={params.notice}
            productId={params.product}
            returnModule={params.return_module}
            setupFlow={params.setup === "product"}
            updateProductImagesAction={updateProductImagesAction}
            uploadProductImageAction={uploadProductImageAction}
          />
        ) : activeModule === "edit-product-parts" ? (
          <EditProductPartsForm
            error={params.error}
            loadProduct={getProductDetail}
            partAction={params.part_action}
            productId={params.product}
            selectedParts={params.selected_parts}
            setupFlow={params.setup === "product"}
            updatePartInventoryAction={updatePartInventoryAction}
            updateProductPartsAction={updateProductPartsAction}
          />
        ) : activeModule === "edit-product-vendors" ? (
          <EditProductVendorsForm
            error={params.error}
            loadProduct={getProductDetail}
            productId={params.product}
            selectedVendorProducts={params.selected_vendor_products}
            setupFlow={params.setup === "product"}
            updateProductVendorsAction={updateProductVendorsAction}
            vendorAction={params.vendor_action}
          />
        ) : activeModule === "edit-part-parents" ? (
          <AddPartParentProductsForm
            addPartParentProductsAction={addPartParentProductsAction}
            error={params.error}
            loadProduct={getProductDetail}
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
          <QuoteDocumentPage
            loadQuote={getSalesOrderDetail}
            quoteId={params.quote}
          />
        ) : activeModule === "shipment-create" ? (
          <ShipmentCreatePage
            addPendingPackingListLinesAction={addPendingPackingListLinesAction}
            confirmPendingShipmentAction={confirmPendingShipmentAction}
            createPendingShipmentAction={createPendingShipmentAction}
            error={params.error}
            loadOrder={getSalesOrderDetail}
            notice={params.notice}
            orderId={params.order}
            shipmentId={params.shipment}
            shipmentEdit={params.shipment_edit}
            updatePendingPackingListLinesAction={
              updatePendingPackingListLinesAction
            }
            updateShipmentDetailsAction={updateShipmentDetailsAction}
            uploadShipmentDocumentAction={uploadShipmentDocumentAction}
          />
        ) : activeModule === "shipment-detail" ? (
          <ShipmentResultPage
            loadOrder={getSalesOrderDetail}
            notice={params.notice}
            returnCustomerId={params.return_customer}
            shipmentId={params.shipment}
          />
        ) : activeModule === "packing-list-document" ? (
          <PackingListDocumentPage
            loadOrder={getSalesOrderDetail}
            packingListId={params.packing_list}
          />
        ) : activeModule === "shipping-preparation-packing-list" ? (
          <ShippingPreparationPackingListPage
            packingListId={params.preparation_packing_list}
          />
        ) : activeModule === "shipping" ? (
          <ShippingDashboardPage
            error={params.error}
            notice={params.notice}
            setShippingPriorityAction={setShippingPriorityAction}
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
            commissionOverrides={params.invoice_commission_overrides}
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
            financialSection={params.financial_section}
            financialCommissionTab={params.financial_commission_tab}
            financialCreditMemoTab={params.financial_credit_memo_tab}
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
            loadPackingLists={getInvoiceQueuePackingLists}
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
        ) : activeModule === "admin-warehouse-edit" ? (
          <WarehouseEditor createAction={createWarehouseAction} error={params.error} notice={params.notice} saveAction={updateWarehouseAction} warehouseId={params.warehouse} />
        ) : activeModule === "admin-territory-edit" ? (
          <TerritoryEditor createAction={createTerritoryAction} deactivateAction={deactivateTerritoryAction} error={params.error} notice={params.notice} saveAction={updateTerritoryAction} territoryId={params.territory} />
        ) : activeModule === "admin-zone-add" ? (
          <ZoneEditor createAction={createWarehouseZoneAction} error={params.error} saveAction={updateWarehouseZoneAction} warehouseId={params.warehouse} />
        ) : activeModule === "admin-zone-edit" ? (
          <ZoneEditor createAction={createWarehouseZoneAction} error={params.error} saveAction={updateWarehouseZoneAction} warehouseId={params.warehouse} zoneId={params.zone} />
        ) : activeModule === "admin-aisle-add" ? (
          <AisleEditor createAction={createWarehouseAisleAction} error={params.error} saveAction={updateWarehouseAisleAction} warehouseId={params.warehouse} />
        ) : activeModule === "admin-aisle-edit" ? (
          <AisleEditor aisleId={params.aisle} createAction={createWarehouseAisleAction} error={params.error} saveAction={updateWarehouseAisleAction} warehouseId={params.warehouse} />
        ) : activeModule === "admin-section-add" ? (
          <SectionEditorPage createAction={createWarehouseSectionAction} error={params.error} saveAction={updateWarehouseSectionAction} warehouseId={params.warehouse} />
        ) : activeModule === "admin-section-edit" ? (
          <SectionEditorPage createAction={createWarehouseSectionAction} error={params.error} saveAction={updateWarehouseSectionAction} sectionId={params.section} warehouseId={params.warehouse} />
        ) : activeModule === "admin-warehouse" ? (
          <WarehouseInfoPage deactivateAisleAction={deactivateWarehouseAisleAction} deactivateSectionAction={deactivateWarehouseSectionAction} deactivateZoneAction={deactivateWarehouseZoneAction} warehouseId={params.warehouse} />
        ) : activeModule === "admin" ? (
          <AdminDashboard assignStyleAction={assignStyleToSignatureSuiteAction} deactivateCustomerSettingAction={deactivateCustomerSettingAction} deactivateProductSettingAction={deactivateProductSettingAction} deactivateWarehousesAction={deactivateWarehousesAction} error={params.error} saveCustomerSettingAction={saveCustomerSettingAction} saveDropshipSettingsAction={saveDropshipSettingsAction} saveFreightCarrierAction={saveFreightCarrierAction} saveFreightLevelAction={saveFreightLevelAction} saveProductSettingAction={saveProductSettingAction} selectedFreightTab={params.freight_tab} selectedTab={params.admin_tab} />
        ) : activeModule === "orders" || activeModule === "quotes" ? (
          <OrdersOverview
            convertQuoteToOrderAction={convertQuoteToOrderAction}
            error={params.error}
            loadOrder={getSalesOrderDetail}
            loadOrderEntryData={getOrderEntryData}
            loadSalesRepOptions={getSalesRepOptions}
            loadTerritoryOptions={getTerritoryOptions}
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
            orderTab={params.order_tab}
            orderTerritory={params.order_territory}
            quoteMode={activeModule === "quotes"}
            returnCustomerId={params.return_customer}
            updateSalesOrderAction={updateSalesOrderAction}
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
                accountTypeOptions={accountTypeOptions}
                accountStatusOptions={customerStatusOptions}
                businessTypes={businessTypes}
                customers={customers}
                deleteAction={deleteCustomersAction}
                error={params.error}
                filters={{ ...customerSearchFilters, advanced: params.customer_advanced === "1" }}
                listMode={customerListMode}
                notice={params.notice}
                query={query}
                salesAgencyOptions={salesRepAgencyOptions}
                territoryOptions={territoryOptions}
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
                    <a
                      aria-current={
                        selectedCustomerTab === tab.key ? "page" : undefined
                      }
                      href={customerTabHref(tab.key)}
                      key={tab.key}
                    >
                      {tab.label}
                    </a>
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
                              href={`/?module=view-location&customer=${dashboard.customer.id}&location=${location.id}&location_tab=profile`}
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
                            <Link
                              className="text-action"
                              href={`/?module=edit-location&customer=${dashboard.customer.id}&location=${location.id}`}
                            >
                              Edit
                            </Link>
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
                            <Link
                              className="text-action"
                              href={`/?module=edit-contact&customer=${dashboard.customer.id}&contact=${contact.id}`}
                            >
                              Edit
                            </Link>
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
                      <div className="section-actions">
                        <span>{dashboard.salesRepAssignments.length}</span>
                        <Link
                          className="text-action"
                          href={`/?module=edit-sales-rep&customer=${dashboard.customer.id}`}
                        >
                          Edit
                        </Link>
                      </div>
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
                      <Link
                        className="small-action order-create-action"
                        href={`/?module=new-order&customer=${dashboard.customer.id}`}
                      >
                        Create New Order / Quote
                      </Link>
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
                                  <span className="packing-list-shipment-details">
                                  Shipping Date: {packingList.ship_date ? dateLabel(packingList.ship_date) : "Not shipped"}
                                  {" | "}
                                  Carrier: {packingList.carrier ?? "Not set"}
                                  {" | "}
                                  Items: {numberFormatter.format(packingList.items_shipped)} / {numberFormatter.format(packingList.total_order_items)}
                                  </span>
                                </span>
                              </div>
                              <div className="packing-list-row-actions">
                                {canEditFreight ? (
                                  <Link
                                    className="primary-action"
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
                                <td>
                                  <Link
                                    className="table-link"
                                    href={`/?module=credit-memo-document&credit_memo=${creditMemo.id}`}
                                  >
                                    {creditMemo.credit_memo_number}
                                  </Link>
                                  {creditMemo.rga_number ? (
                                    <>
                                      {" | "}
                                      <Link
                                        className="table-link"
                                        href={`/?module=rga-detail&rga=${creditMemo.rga_id}`}
                                      >
                                        {creditMemo.rga_number}
                                      </Link>
                                    </>
                                  ) : null}
                                  {creditMemo.sales_order_id &&
                                  creditMemo.customer_po_number ? (
                                    <>
                                      {" | "}
                                      <Link
                                        className="table-link"
                                        href={`/?module=orders&order=${creditMemo.sales_order_id}`}
                                      >
                                        {creditMemo.customer_po_number}
                                      </Link>
                                    </>
                                  ) : null}
                                </td>
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
                            <Link className="table-link" href={`/?module=rga-detail&rga=${rga.id}`}>{rga.rga_number}</Link>
                            <span>{dateLabel(rga.request_date)} | Original PO {rga.sales_order_id ? <Link className="table-link" href={`/?module=orders&order=${rga.sales_order_id}`}>{rga.original_customer_po_number_snapshot ?? "View order"}</Link> : rga.original_customer_po_number_snapshot ?? "Not set"}</span>
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
                        <span>{dashboard.shippingFreightTerms.length}</span>
                        <Link
                          className="text-action"
                          href={`/?module=edit-freight&customer=${dashboard.customer.id}`}
                        >
                          Edit Account Terms
                        </Link>
                      </div>
                    </div>
                    {dashboard.shippingFreightTerms.length === 0 ? (
                      <EmptyState text="No saved shipping addresses are configured for this customer." />
                    ) : (
                      <div className="table-scroll">
                        <table>
                          <thead>
                            <tr>
                              <th>Shipping Address</th>
                              <th>Freight Term</th>
                              <th>Last Updated</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboard.shippingFreightTerms.map((term) => (
                              <tr key={term.locationId}>
                                <td>{term.locationName}</td>
                                <td>{term.freightTerm}</td>
                                <td>
                                  {term.updatedAt
                                    ? timestampLabel(term.updatedAt)
                                    : "Not set"}
                                </td>
                                <td>
                                  <Link
                                    className="text-action"
                                    href={`/?module=edit-location-freight&customer=${dashboard.customer.id}&location=${term.locationId}`}
                                  >
                                    Edit
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="section-title" style={{ marginTop: "1.5rem" }}>
                      <h3>Dropship Settings</h3>
                      <Link
                        className="text-action"
                        href={`/?module=edit-dropship-settings&customer=${dashboard.customer.id}`}
                      >
                        Edit
                      </Link>
                    </div>
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Dropship Rate</th>
                            <th>Dropship Status</th>
                            <th>Residential Surcharge</th>
                            <th>Surcharge Status</th>
                            <th>Dropship Freight Level</th>
                            <th>Last Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{dashboard.dropshipFreightSettings.dropshipRate}</td>
                            <td>{dashboard.dropshipFreightSettings.dropshipStatus}</td>
                            <td>{dashboard.dropshipFreightSettings.residentialSurchargeRate}</td>
                            <td>{dashboard.dropshipFreightSettings.residentialSurchargeStatus}</td>
                            <td>{dashboard.dropshipFreightSettings.freightLevel}</td>
                            <td>{dashboard.dropshipFreightSettings.updatedAt ? timestampLabel(dashboard.dropshipFreightSettings.updatedAt) : "Not set"}</td>
                          </tr>
                        </tbody>
                      </table>
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
