"use client";

import Link from "next/link";
import { useState } from "react";

type CatalogPackingBox = {
  id: string;
  sequence: number;
  label: string | null;
  width: number | null;
  depth: number | null;
  height: number | null;
  netWeight: number | null;
  grossWeight: number | null;
};

type PackingBoxFields = {
  catalogBoxId: string;
  label: string;
  sequence: number;
  width: string;
  depth: string;
  height: string;
  netWeight: string;
  grossWeight: string;
};

export type VendorProductOption = {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  hs_code: string | null;
  packing_boxes: CatalogPackingBox[];
};

type Vendor = {
  id: string;
  name: string;
  currency: string;
  defaultMinimumOrderQuantity: number | null;
  defaultLeadTimeDays: number | null;
};

type Fields = Record<string, string>;

const stringValue = (value: number | null | undefined) =>
  value === null || value === undefined ? "" : String(value);

const packingBoxFields = (box: CatalogPackingBox): PackingBoxFields => ({
  catalogBoxId: box.id,
  label: box.label ?? "",
  sequence: box.sequence,
  width: stringValue(box.width),
  depth: stringValue(box.depth),
  height: stringValue(box.height),
  netWeight: stringValue(box.netWeight),
  grossWeight: stringValue(box.grossWeight),
});

export function VendorProductEditor({
  vendor,
  products,
  error,
  saveAction,
}: {
  vendor: Vendor | null;
  products: VendorProductOption[];
  error?: string;
  saveAction: (formData: FormData) => Promise<void>;
}) {
  const [productId, setProductId] = useState("");
  const [fields, setFields] = useState<Fields>({
    lead_time_days: stringValue(vendor?.defaultLeadTimeDays),
    minimum_order_quantity: stringValue(vendor?.defaultMinimumOrderQuantity),
    unit_cost: "0",
  });
  const [packingBoxes, setPackingBoxes] = useState<PackingBoxFields[]>([]);

  if (!vendor)
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Vendor was not found.</div>
        <Link className="secondary-action secondary-action--light" href="/?module=purchasing">
          Back to Purchasing
        </Link>
      </section>
    );

  const selectedProduct = products.find((product) => product.id === productId);
  const setField = (name: string, value: string) =>
    setFields((current) => ({ ...current, [name]: value }));
  const field = (name: string) => ({
    name,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => setField(name, event.target.value),
    value: fields[name] ?? "",
  });
  const updatePackingBox = (index: number, name: keyof PackingBoxFields, value: string) =>
    setPackingBoxes((current) =>
      current.map((box, boxIndex) => (boxIndex === index ? { ...box, [name]: value } : box)),
    );
  const selectProduct = (nextProductId: string) => {
    const product = products.find((item) => item.id === nextProductId);
    setProductId(nextProductId);
    if (!product) return;
    setFields((current) => ({
      ...current,
      vendor_item_number: product.sku,
      vendor_item_name: product.name,
    }));
    setPackingBoxes(product.packing_boxes.map(packingBoxFields));
  };

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Purchasing Vendor</span>
          <h2>Add Vendor Product</h2>
          <p>Select a system product to import its product data, then refine vendor-specific details before saving.</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={`/?module=vendor&vendor=${vendor.id}&vendor_tab=products`}>
          Back to Products
        </Link>
      </section>
      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}
      <form action={saveAction} className="customer-form">
        <input type="hidden" name="vendor_id" value={vendor.id} />
        <fieldset>
          <legend>System Product</legend>
          <div className="form-grid">
            <label>
              Product SKU
              <select name="product_id" required value={productId} onChange={(event) => selectProduct(event.target.value)}>
                <option disabled value="">Select a system product</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.sku} · {product.name}</option>)}
              </select>
            </label>
            <label>Vendor Code<input required {...field("vendor_item_number")} /></label>
            <label>Vendor Product Name<input {...field("vendor_item_name")} /></label>
            <label>Catalog Product Type<input readOnly value={selectedProduct?.category ?? ""} /></label>
            <label>Catalog HS Code<input readOnly value={selectedProduct?.hs_code ?? ""} /></label>
            <label>Price ({vendor.currency})<input min="0" required step="0.0001" type="number" {...field("unit_cost")} /></label>
            <label>MOQ<input min="0.001" step="0.001" type="number" {...field("minimum_order_quantity")} /></label>
            <label>Lead Time (days)<input min="0" type="number" {...field("lead_time_days")} /></label>
          </div>
        </fieldset>
        {selectedProduct ? <p className="fieldset-note">Catalog type and HS code are read-only. Each catalog packing box is imported below and may be adjusted for this vendor.</p> : null}
        {selectedProduct ? (
          <fieldset>
            <legend>Vendor Packing Details</legend>
            {packingBoxes.length ? (
              <div className="detail-grid">
                {packingBoxes.map((box, index) => (
                  <section className="info-panel" key={box.catalogBoxId}>
                    <h3>{box.label || `Box ${box.sequence}`}</h3>
                    <input name={`packing_box_${index}_catalog_box_id`} type="hidden" value={box.catalogBoxId} />
                    <input name={`packing_box_${index}_sequence`} type="hidden" value={box.sequence} />
                    <input name={`packing_box_${index}_label`} type="hidden" value={box.label} />
                    <div className="form-grid">
                      <label>Box Width (in)<input min="0" name={`packing_box_${index}_width`} onChange={(event) => updatePackingBox(index, "width", event.target.value)} step="0.001" type="number" value={box.width} /></label>
                      <label>Box Depth (in)<input min="0" name={`packing_box_${index}_depth`} onChange={(event) => updatePackingBox(index, "depth", event.target.value)} step="0.001" type="number" value={box.depth} /></label>
                      <label>Box Height (in)<input min="0" name={`packing_box_${index}_height`} onChange={(event) => updatePackingBox(index, "height", event.target.value)} step="0.001" type="number" value={box.height} /></label>
                      <label>Net Weight (lb)<input min="0" name={`packing_box_${index}_net_weight`} onChange={(event) => updatePackingBox(index, "netWeight", event.target.value)} step="0.001" type="number" value={box.netWeight} /></label>
                      <label>Gross Weight (lb)<input min="0" name={`packing_box_${index}_gross_weight`} onChange={(event) => updatePackingBox(index, "grossWeight", event.target.value)} step="0.001" type="number" value={box.grossWeight} /></label>
                    </div>
                  </section>
                ))}
              </div>
            ) : <p className="fieldset-note">This catalog product does not have active packing boxes.</p>}
            <input name="packing_box_count" type="hidden" value={packingBoxes.length} />
          </fieldset>
        ) : null}
        <fieldset>
          <legend>Status</legend>
          <div className="form-grid">
            <label>Product Status<select name="is_active" defaultValue="true"><option value="true">Active</option><option value="false">Deactivated</option></select></label>
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">Save Vendor Product</button>
          <Link className="secondary-action secondary-action--light" href={`/?module=vendor&vendor=${vendor.id}&vendor_tab=products`}>Cancel</Link>
        </div>
      </form>
    </section>
  );
}
