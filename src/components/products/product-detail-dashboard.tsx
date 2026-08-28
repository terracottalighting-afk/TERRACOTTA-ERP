import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import {
  dateLabel,
  fileSizeLabel,
  label,
  money,
  numberFormatter,
} from "@/lib/formatters";
import { ProductDetailPartsTable } from "./product-detail-parts-table";
import { ProductVendorRows } from "./product-vendor-rows";

type ProductImageCategory = "stock" | "detail" | "lifestyle" | "drawing" | "other";

type ProductDetailPartRow = {
  component_name: string;
  component_product_id: string;
  component_sellability_status: string;
  component_sku: string;
  component_status: string;
  id: string;
  is_required: boolean;
  next_incoming_eta: string | null;
  notes: string | null;
  part_name: string | null;
  part_role: string | null;
  sellable_quantity: number | null;
};

type ProductUsedInParent = ProductDetailPartRow & {
  parent_name: string;
  parent_product_id: string;
  parent_sku: string;
};

type ProductVendor = {
  id: string;
  lead_time_days: number | null;
  minimum_order_quantity: number | null;
  unit_cost: number;
  updated_at: string;
  vendor_id: string;
  vendor_item_number: string;
  vendor_name: string;
};

type ProductPackingBox = {
  box_height: number | null;
  box_label: string | null;
  box_length: number | null;
  box_sequence: number;
  box_width: number | null;
  cbm: number | null;
  gross_weight: number | null;
  id: string;
  inch_volume: number | null;
  is_required_for_sale: boolean;
  net_weight: number | null;
};

type ProductInventoryBalance = {
  box_label: string | null;
  box_sequence: number | null;
  id: string;
  inventory_condition: string;
  location_code: string;
  quantity_allocated: number;
  quantity_available: number;
  quantity_on_hand: number;
  warehouse_name: string;
};

type ProductImage = {
  display_name: string | null;
  file_size: number | null;
  id: string;
  image_category: ProductImageCategory;
  is_default_thumbnail: boolean;
  original_file_name: string;
  public_url: string;
  uploaded_at: string;
};

type ProductDocument = {
  display_name: string | null;
  document_type: string;
  file_size: number | null;
  id: string;
  original_file_name: string;
  signed_url: string | null;
  uploaded_at: string;
};

type ProductSpecAttribute = {
  attribute_name: string;
  attribute_value: string;
  unit: string | null;
};

type ProductHangingConfig = {
  canopy_detail: string | null;
  chain_length: string | null;
  mounting_type: string | null;
  notes: string | null;
  rod_length: string | null;
  wire_length: string | null;
};

type ProductDetailDashboardProduct = {
  brand_name: string;
  category_name: string | null;
  collection: string | null;
  counts_toward_primary_showroom_default: boolean | null;
  currency: string;
  customer_eligibility_tag: string;
  default_price: number | null;
  default_vendor_item_number: string | null;
  description: string | null;
  documents: ProductDocument[];
  finishes: string[];
  hangingConfig: ProductHangingConfig | null;
  id: string;
  images: ProductImage[];
  incoming_quantity: number | null;
  inventoryBalances: ProductInventoryBalance[];
  name: string;
  next_incoming_eta: string | null;
  no_box_needed: boolean;
  packingBoxes: ProductPackingBox[];
  parts: ProductDetailPartRow[];
  sellability_status: string;
  sellable_quantity: number | null;
  signature_suite_name: string | null;
  sku: string;
  specAttributes: ProductSpecAttribute[];
  status: string;
  usedInParents: ProductUsedInParent[];
  vendors: ProductVendor[];
};

export function ProductDetailDashboard({
  product,
  selectedTab,
  uploadDocumentAction,
}: {
  product: ProductDetailDashboardProduct | null;
  selectedTab: string;
  uploadDocumentAction: (formData: FormData) => Promise<void>;
}) {
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
    { key: "vendors", label: "Vendors" },
  ];
  const activeTab = tabs.some((tab) => tab.key === selectedTab) ? selectedTab : "profile";
  const productTabHref = (tabKey: string) => `/?module=products&product=${product.id}&product_tab=${tabKey}`;
  const dimensionLabel = (box: ProductPackingBox) =>
    box.box_length !== null && box.box_width !== null && box.box_height !== null
      ? `${numberFormatter.format(box.box_length)} x ${numberFormatter.format(box.box_width)} x ${numberFormatter.format(box.box_height)} in`
      : "Not set";
  const etaLabel =
    Number(product.sellable_quantity ?? 0) > 0
      ? "In stock"
      : product.next_incoming_eta
        ? `${dateLabel(product.next_incoming_eta)} (${numberFormatter.format(Number(product.incoming_quantity ?? 0))})`
        : "No ETA";
  const imageCategories: ProductImageCategory[] = ["stock", "detail", "lifestyle", "drawing", "other"];
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
                  {
                    label: "Canopy Shape / Size",
                    names: ["canopy shape / size", "canopy shape and size", "canopy detail", "canopy shape", "canopy size"],
                  },
                  { label: "Net Weight", names: ["net weight", "product net weight"] },
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
                    names: ["max bulbs wattage", "max bulb wattage", "maximum bulbs wattage", "max bulb voltage", "maximum bulb voltage"],
                  },
                  { label: "Bulbs Included", names: ["bulbs included", "bulb included"] },
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
              <Link className="text-action" href={`/?module=edit-product-specs&product=${product.id}&spec_section=safety`}>
                Edit
              </Link>
            </div>
            <dl className="detail-list">
              {specRows([
                { label: "Safety Rating", names: ["safety rating", "safety rate", "ul etl"] },
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
            <form action={uploadDocumentAction} className="attachment-upload-form attachment-upload-form--product">
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
                      <td>
                        {balance.box_sequence
                          ? `Box ${balance.box_sequence}${balance.box_label ? ` / ${balance.box_label}` : ""}`
                          : "SKU balance"}
                      </td>
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
