"use client";

import { useMemo, useState } from "react";

export type OrderProductOption = {
  brandName: string;
  defaultPrice: number;
  id: string;
  inventory: number;
  name: string;
  sku: string;
};

export type OrderPartOption = OrderProductOption & {
  parentProductIds: string[];
  parentRoles: string[];
};

export type OrderShipToOption = {
  address: string;
  email: string | null;
  id: string;
  isDefault: boolean;
  name: string;
};

type OrderLine = OrderProductOption & {
  discountPercent: number;
  quantity: number;
  unitPrice: number;
};

type Props = {
  accountName: string;
  customerId: string;
  defaultDiscountPercent: number;
  defaultLocationId?: string;
  parts: OrderPartOption[];
  products: OrderProductOption[];
  saveAction: (formData: FormData) => void;
  shipToOptions: OrderShipToOption[];
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function OrderEntryForm({ accountName, customerId, defaultDiscountPercent, defaultLocationId, parts, products, saveAction, shipToOptions }: Props) {
  const [productQuery, setProductQuery] = useState("");
  const [searchParts, setSearchParts] = useState(false);
  const [partSearchMode, setPartSearchMode] = useState<"parent" | "generic">("parent");
  const [partQuery, setPartQuery] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [orderType, setOrderType] = useState("regular");
  const [locationId, setLocationId] = useState(defaultLocationId ?? shipToOptions.find((location) => location.isDefault)?.id ?? shipToOptions[0]?.id ?? "");
  const [shippingContactEmail, setShippingContactEmail] = useState(() => {
    const initialLocationId = defaultLocationId ?? shipToOptions.find((location) => location.isDefault)?.id ?? shipToOptions[0]?.id;
    return shipToOptions.find((location) => location.id === initialLocationId)?.email ?? "";
  });

  const productResults = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    if (!query) return [];

    return products
      .filter((product) => product.sku.toLowerCase().includes(query) || product.name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [productQuery, products]);

  const parentResults = useMemo(() => {
    const query = partQuery.trim().toLowerCase();
    if (!query || partSearchMode !== "parent") return [];
    return products.filter((product) => product.sku.toLowerCase().includes(query) || product.name.toLowerCase().includes(query)).slice(0, 8);
  }, [partSearchMode, partQuery, products]);

  const activeParentId = useMemo(() => {
    if (selectedParentId) return selectedParentId;
    const normalizedQuery = partQuery.trim().toLowerCase();
    return products.find((product) => product.sku.toLowerCase() === normalizedQuery || product.name.toLowerCase() === normalizedQuery)?.id ?? "";
  }, [partQuery, products, selectedParentId]);

  const partResults = useMemo(() => {
    if (!searchParts) return [];
    if (partSearchMode === "parent") {
      return activeParentId ? parts.filter((part) => part.parentProductIds.includes(activeParentId)) : [];
    }
    const query = partQuery.trim().toLowerCase();
    if (!query) return [];
    return parts.filter((part) => part.sku.toLowerCase().includes(query) || part.name.toLowerCase().includes(query)).slice(0, 8);
  }, [activeParentId, partSearchMode, partQuery, parts, searchParts]);

  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice * (1 - line.discountPercent / 100), 0);

  function addProduct(product: OrderProductOption) {
    setLines((current) => {
      const matchingLine = current.find((line) => line.id === product.id);
      if (matchingLine) {
        return current.map((line) => (line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line));
      }

      return [...current, { ...product, discountPercent: defaultDiscountPercent, quantity: 1, unitPrice: product.defaultPrice }];
    });
    setProductQuery("");
  }

  function updateProductQuery(value: string) {
    setProductQuery(value);
  }

  function chooseParent(parent: OrderProductOption) {
    setSelectedParentId(parent.id);
    setPartQuery(parent.sku);
  }

  function updateParentQuery(value: string) {
    setPartQuery(value);
    const matchingParent = products.find((product) => product.sku.toLowerCase() === value.trim().toLowerCase());
    setSelectedParentId(matchingParent?.id ?? "");
  }

  function updateLine(id: string, patch: Partial<Pick<OrderLine, "discountPercent" | "quantity" | "unitPrice">>) {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  return (
    <form action={saveAction} className="customer-form order-entry-form" data-default-discount={defaultDiscountPercent}>
      <input name="customer_id" type="hidden" value={customerId} />
      <input data-order-lines name="order_lines" type="hidden" value={JSON.stringify(lines.map((line) => ({ discountPercent: line.discountPercent, productId: line.id, quantity: line.quantity, unitPrice: line.unitPrice })))} />

      <fieldset>
        <legend>Order Header</legend>
        <div className="order-account-context">
          <span>Customer Account</span>
          <strong>{accountName}</strong>
        </div>
        <div className="form-grid">
          <label>
            Customer PO No.
            <input name="customer_po_number" placeholder="Customer PO number" required />
          </label>
          <label>
            Order Date
            <input defaultValue={new Date().toISOString().slice(0, 10)} name="order_date" type="date" required />
          </label>
          <label>
            Order Source
            <select defaultValue="manual" name="order_source">
              <option value="manual">Manual Entry</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="fax">Fax</option>
              <option value="ecommerce">Ecommerce</option>
              <option value="portal">Customer Portal</option>
              <option value="rep_submitted">Rep Submitted</option>
            </select>
          </label>
          <label>
            Order Type
            <select name="order_type" onChange={(event) => setOrderType(event.target.value)} onInput={(event) => setOrderType(event.currentTarget.value)} value={orderType}>
              <option value="regular">Regular Order</option>
              <option value="display">Display Order</option>
              <option value="quote">Quote</option>
            </select>
          </label>
          {orderType === "display" ? (
            <label>
              Display Order Type
              <select name="display_order_type" required>
                <option value="primary_showroom_display">Primary Showroom Display</option>
                <option value="non_primary_display">Non-primary Showroom Display</option>
                <option value="other_display">Other Display</option>
              </select>
            </label>
          ) : null}
        </div>
      </fieldset>

      <fieldset>
        <legend>Ship-to</legend>
        <label className="checkbox-label">
          <input name="is_dropship" type="checkbox" />
          Manual Ship-to / Drop Ship
        </label>
        <div className="ship-to-mode ship-to-mode--saved form-grid">
            <label className="full-width-field">
              Saved Shipping Address
              <select name="customer_location_id" onChange={(event) => {
                const nextLocationId = event.target.value;
                setLocationId(nextLocationId);
                setShippingContactEmail(shipToOptions.find((location) => location.id === nextLocationId)?.email ?? "");
              }} value={locationId}>
                <option value="">Select a saved shipping address</option>
                {shipToOptions.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}{location.isDefault ? " (Default Ship-to)" : ""} - {location.address}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Shipping Contact Email
              <input name="shipping_contact_email" onChange={(event) => setShippingContactEmail(event.target.value)} type="email" value={shippingContactEmail} />
            </label>
        </div>
        <div className="ship-to-mode ship-to-mode--dropship form-grid">
            <label>
              Ship-to Name
              <input name="dropship_name" placeholder="Recipient or business name" />
            </label>
            <label>
              Country
              <input defaultValue="United States" name="dropship_country" />
            </label>
            <label className="full-width-field">
              Address Line 1
              <input name="dropship_address_line_1" />
            </label>
            <label>
              Address Line 2
              <input name="dropship_address_line_2" />
            </label>
            <label>
              City
              <input name="dropship_city" />
            </label>
            <label>
              State / Province
              <input name="dropship_state_province" />
            </label>
            <label>
              Postal Code
              <input name="dropship_postal_code" />
            </label>
            <label>
              Shipping Contact Email
              <input name="dropship_email" type="email" />
            </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Products</legend>
        <div className="order-product-search">
          <div className="order-search-heading">
            <label className="order-search-label">
              Search SKU or Product Name
            </label>
            <label className="checkbox-label order-part-toggle">
              <input name="search_parts" onChange={(event) => { setSearchParts(event.target.checked); setProductQuery(""); setPartQuery(""); setSelectedParentId(""); }} type="checkbox" />
              Search Parts
            </label>
          </div>
          <div className="order-search-mode order-search-mode--products">
                <label>
                <input autoComplete="off" name="product_search" onChange={(event) => updateProductQuery(event.target.value)} placeholder="Type a SKU or product name" value={productQuery} />
              </label>
              {productResults.length > 0 ? (
                <div className="order-product-results">
                  {productResults.map((product) => (
                    <button key={product.id} onClick={() => addProduct(product)} type="button">
                      <span><strong>{product.sku}</strong> {product.name}</span>
                      <span>{product.brandName} | {product.inventory} available | {money.format(product.defaultPrice)}</span>
                    </button>
                  ))}
                </div>
              ) : productQuery.trim() ? <p className="fieldset-note">No active, sellable products match this search.</p> : null}
          </div>
          <div className="order-search-mode order-search-mode--parts">
              <label className="checkbox-label order-generic-toggle"><input name="search_generic_part" onChange={(event) => { setPartSearchMode(event.target.checked ? "generic" : "parent"); setPartQuery(""); setSelectedParentId(""); }} type="checkbox" /> Search a generic part</label>
              <div className="part-search-mode part-search-mode--parent">
                <div className="part-parent-search-grid">
                  <div>
                    <label>
                      Enter a Parent SKU/Name
                      <input autoComplete="off" name="parent_part_search" onChange={(event) => updateParentQuery(event.target.value)} placeholder="Type a parent SKU or name" value={partQuery} />
                    </label>
                    {parentResults.length > 0 ? <div className="order-product-results">{parentResults.map((parent) => <button key={parent.id} onClick={() => chooseParent(parent)} type="button"><span><strong>{parent.sku}</strong> {parent.name}</span><span>{parts.filter((part) => part.parentProductIds.includes(parent.id)).length} linked parts</span></button>)}</div> : partQuery.trim() ? <p className="fieldset-note">Select a suggested parent product.</p> : null}
                  </div>
                  <div className="part-child-picker">
                    <span className="part-picker-label">Child Parts</span>
                    {activeParentId && partResults.length > 0 ? <div className="order-product-results">{partResults.map((part) => <button key={part.id} onClick={() => addProduct(part)} type="button"><span><strong>{part.sku}</strong> {part.name}</span><span>{part.parentRoles.join(", ") || "Part"} | {part.inventory} available | {money.format(part.defaultPrice)}</span></button>)}</div> : <p className="fieldset-note">Pick a parent product to display its child parts.</p>}
                  </div>
                </div>
              </div>
              <div className="part-search-mode part-search-mode--generic">
                <label>
                  Search Generic Part Name or SKU
                  <input autoComplete="off" name="generic_part_search" onChange={(event) => setPartQuery(event.target.value)} placeholder="Type a part name or SKU" value={partQuery} />
                </label>
                {partResults.length > 0 ? <div className="order-product-results">{partResults.map((part) => <button key={part.id} onClick={() => addProduct(part)} type="button"><span><strong>{part.sku}</strong> {part.name}</span><span>Generic | {part.inventory} available | {money.format(part.defaultPrice)}</span></button>)}</div> : partQuery.trim() ? <p className="fieldset-note">No generic parts match this search.</p> : null}
              </div>
          </div>
        </div>

        {lines.length === 0 ? <p className="empty-state">Search for products above and select them to add order lines.</p> : null}
        {lines.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table order-lines-table">
              <thead>
                <tr><th>SKU</th><th>Product</th><th>Brand</th><th>Available</th><th>Qty</th><th>Unit Price</th><th>Discount</th><th>Line Total</th><th aria-label="Remove line" /></tr>
              </thead>
              <tbody>
                {lines.map((line) => {
                  const lineTotal = line.quantity * line.unitPrice * (1 - line.discountPercent / 100);
                  return (
                    <tr key={line.id}>
                      <td>{line.sku}</td><td>{line.name}</td><td>{line.brandName}</td><td>{line.inventory}</td>
                      <td><input min="1" onChange={(event) => updateLine(line.id, { quantity: Math.max(1, Number(event.target.value) || 1) })} step="1" type="number" value={line.quantity} /></td>
                      <td><input min="0" onChange={(event) => updateLine(line.id, { unitPrice: Math.max(0, Number(event.target.value) || 0) })} step="0.01" type="number" value={line.unitPrice} /></td>
                      <td><input min="0" onChange={(event) => updateLine(line.id, { discountPercent: Math.max(0, Number(event.target.value) || 0) })} step="0.01" type="number" value={line.discountPercent} /></td>
                      <td>{money.format(lineTotal)}</td>
                      <td><button aria-label={`Remove ${line.sku}`} className="icon-text-action" onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))} type="button">Remove</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
        <div className="order-total"><span>Order Subtotal</span><strong data-native-order-subtotal>{money.format(subtotal)}</strong></div>
      </fieldset>

      <fieldset>
        <legend>Notes</legend>
        <div className="form-grid"><label className="full-width-field">Internal Order Notes<textarea name="notes" rows={3} /></label></div>
      </fieldset>

      <div className="form-actions">
        <button className="primary-action" type="submit">Save Order</button>
      </div>
    </form>
  );
}
