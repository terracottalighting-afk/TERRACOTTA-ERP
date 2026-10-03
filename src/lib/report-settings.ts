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
