export type ReportTypeCode = "container_invoice" | "container_packing_list";

export type ReportFieldMapping = {
  id: string;
  report_type: ReportTypeCode;
  field_code: string;
  display_label: string;
  data_source: string;
  sort_order: number;
};

export const REPORT_DATA_SOURCE_OPTIONS = [
  { code: "product_hs_code", name: "Product > HS Code" },
  { code: "product_category_name", name: "Product > Category" },
  { code: "product_name", name: "Product > Product Name" },
  { code: "product_sku", name: "Product > SKU" },
  { code: "product_pieces_per_carton", name: "Product > Pieces Per Carton" },
] as const;

export type ReportMappingObjectCode = "product" | "vendor" | "purchase_order" | "container" | "container_line";

export type ReportMappingSource = {
  code: string;
  name: string;
};

export type ReportMappingObject = {
  code: ReportMappingObjectCode;
  name: string;
  sources: ReportMappingSource[];
};

export type ReportMappingObjectSourceSetting = {
  id: string;
  object_code: ReportMappingObjectCode;
  source_code: string;
  source_label: string;
  sort_order: number;
};

// These are the durable fields available to container reports. Product specification
// attributes are added from the live catalog below because they are user-defined.
export const REPORT_MAPPING_OBJECTS: ReportMappingObject[] = [
  {
    code: "product",
    name: "Product",
    sources: [
      { code: "product_sku", name: "SKU" }, { code: "product_name", name: "Product Name" }, { code: "product_description", name: "Description" }, { code: "product_brand_name", name: "Brand" }, { code: "product_category_name", name: "Category" }, { code: "product_collection", name: "Collection" }, { code: "product_lifecycle_status", name: "Lifecycle Status" }, { code: "product_sellability_status", name: "Sellability Status" }, { code: "product_customer_eligibility", name: "Customer Eligibility" }, { code: "product_default_price", name: "Default Price" }, { code: "product_currency", name: "Currency" }, { code: "product_default_vendor_item_number", name: "Default Vendor Item Number" }, { code: "product_pieces_per_carton", name: "Pieces Per Carton" }, { code: "product_hs_code", name: "HS Code" }, { code: "product_legacy_product_id", name: "Legacy Product ID" }, { code: "product_notes", name: "Notes" },
    ],
  },
  {
    code: "vendor",
    name: "Vendor",
    sources: [
      { code: "vendor_name", name: "Name" }, { code: "vendor_legal_name", name: "Legal Name" }, { code: "vendor_contact_name", name: "Contact Name" }, { code: "vendor_email", name: "Contact Email" }, { code: "vendor_phone", name: "Phone" }, { code: "vendor_address", name: "Address" }, { code: "vendor_country", name: "Country" }, { code: "vendor_payment_terms", name: "Payment Terms" }, { code: "vendor_currency", name: "Currency" },
    ],
  },
  {
    code: "purchase_order",
    name: "Purchase Order",
    sources: [
      { code: "purchase_order_number", name: "PO Number" }, { code: "purchase_order_date", name: "PO Date" }, { code: "purchase_order_expected_ready_date", name: "Expected Ready Date" }, { code: "purchase_order_expected_ship_date", name: "Expected Ship Date" }, { code: "purchase_order_status", name: "Status" }, { code: "purchase_order_currency", name: "Currency" }, { code: "purchase_order_notes", name: "Notes" },
    ],
  },
  {
    code: "container",
    name: "Container",
    sources: [
      { code: "container_number", name: "Container Number" }, { code: "container_booking_number", name: "Booking Number" }, { code: "container_vessel_name", name: "Vessel Name" }, { code: "container_status", name: "Status" }, { code: "container_expected_loading_date", name: "Expected Loading Date" }, { code: "container_actual_loading_date", name: "Actual Loading Date" }, { code: "container_expected_departure_date", name: "Expected Departure Date" }, { code: "container_actual_departure_date", name: "Actual Departure Date" }, { code: "container_arrival_port", name: "Arrival Port" }, { code: "container_expected_arrival_date", name: "Expected Arrival Date" }, { code: "container_actual_arrival_date", name: "Actual Arrival Date" },
    ],
  },
  {
    code: "container_line",
    name: "Container Line",
    sources: [
      { code: "container_line_quantity_loaded", name: "Quantity Loaded" }, { code: "container_line_carton_count", name: "Carton Count" }, { code: "container_line_unit_cbm", name: "Unit CBM" }, { code: "container_line_total_cbm", name: "Line CBM" }, { code: "container_line_gross_weight", name: "Gross Weight" },
    ],
  },
];

export function productSpecificationSource(attributeName: string): ReportMappingSource {
  return { code: `product_spec:${attributeName}`, name: attributeName };
}

export function reportMappingObjectSources(objectCode: ReportMappingObjectCode, productSpecificationAttributes: string[] = []): ReportMappingSource[] {
  const object = REPORT_MAPPING_OBJECTS.find((item) => item.code === objectCode);
  if (!object) return [];
  if (objectCode !== "product") return object.sources;
  const standardNames = new Set(object.sources.map((source) => source.name.toLowerCase()));
  return [...object.sources, ...productSpecificationAttributes.filter((attribute) => !standardNames.has(attribute.toLowerCase())).map(productSpecificationSource)];
}

export function reportDataSourceLabel(dataSource: string): string {
  const legacySource = REPORT_DATA_SOURCE_OPTIONS.find((source) => source.code === dataSource);
  if (legacySource) return legacySource.name;
  if (dataSource.startsWith("product_spec:")) return `Product > ${dataSource.slice("product_spec:".length)}`;
  for (const object of REPORT_MAPPING_OBJECTS) {
    const source = object.sources.find((item) => item.code === dataSource);
    if (source) return `${object.name} > ${source.name}`;
  }
  return dataSource;
}

export const REPORT_TYPE_OPTIONS: { code: ReportTypeCode; name: string; description: string }[] = [
  { code: "container_invoice", name: "Container Invoice", description: "Commercial vendor invoice generated from the products loaded in a container." },
  { code: "container_packing_list", name: "Container Packing List", description: "Container and vendor packing lists used for loading, shipping, and customs." },
];

export const REPORT_FIELD_OPTIONS: Record<ReportTypeCode, { code: string; label: string; sources: { code: string; name: string }[] }[]> = {
  container_invoice: [
    { code: "hs_code", label: "HS", sources: [REPORT_DATA_SOURCE_OPTIONS[0]] },
    { code: "description", label: "Description", sources: [REPORT_DATA_SOURCE_OPTIONS[1], REPORT_DATA_SOURCE_OPTIONS[2]] },
  ],
  container_packing_list: [
    { code: "hs_code", label: "HS", sources: [REPORT_DATA_SOURCE_OPTIONS[0]] },
  ],
};

export const DEFAULT_REPORT_FIELD_MAPPINGS: Omit<ReportFieldMapping, "id">[] = [
  { report_type: "container_invoice", field_code: "hs_code", display_label: "HS", data_source: "product_hs_code", sort_order: 10 },
  { report_type: "container_invoice", field_code: "description", display_label: "Description", data_source: "product_category_name", sort_order: 20 },
  { report_type: "container_packing_list", field_code: "hs_code", display_label: "HS", data_source: "product_hs_code", sort_order: 10 },
];

export function reportMappingFor(mappings: ReportFieldMapping[], reportType: ReportTypeCode, fieldCode: string) {
  return mappings.find((mapping) => mapping.report_type === reportType && mapping.field_code === fieldCode) ?? DEFAULT_REPORT_FIELD_MAPPINGS.find((mapping) => mapping.report_type === reportType && mapping.field_code === fieldCode) ?? null;
}
