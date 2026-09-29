import Link from "next/link";
import { money, numberFormatter } from "@/lib/formatters";

type PurchaseOrder = {
  id: string;
  vendor_po_number: string;
  vendor_name: string;
  currency: string;
  po_date: string;
  expected_ready_date: string | null;
  expected_ship_date: string | null;
  expected_arrival_date: string | null;
};

type ProductOption = {
  id: string;
  sku: string;
  name: string;
  vendor_item_number: string;
  unit_cost: number;
};

type Line = {
  id: string;
  sku: string;
  name: string;
  vendor_item_number: string;
  quantity_ordered: number;
  unit_cost: number;
  line_total: number;
};

const dateValue = (value: string | null) => value || "Not set";

export function PurchaseOrderLinesEditor({ error, lines, order, products, saveAction }: { error?: string; lines: Line[]; order: PurchaseOrder | null; products: ProductOption[]; saveAction: (formData: FormData) => Promise<void> }) {
  if (!order) return <section className="dashboard-panel"><div className="form-alert">Purchase order was not found.</div><Link className="secondary-action secondary-action--light" href="/?module=purchasing">Back to Purchasing</Link></section>;
  return <section className="dashboard-panel"><section className="form-header"><div><span className="eyebrow">Purchase Order Draft</span><h2>{order.vendor_po_number}</h2><p>{order.vendor_name} · {order.currency}</p></div><Link className="secondary-action secondary-action--light" href="/?module=purchasing">Back to Purchasing</Link></section>{error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}<section className="detail-grid"><article className="info-panel"><h3>Order Schedule</h3><dl><div><dt>PO Date</dt><dd>{dateValue(order.po_date)}</dd></div><div><dt>Expected Ready</dt><dd>{dateValue(order.expected_ready_date)}</dd></div><div><dt>Expected Ship</dt><dd>{dateValue(order.expected_ship_date)}</dd></div><div><dt>Expected Arrival</dt><dd>{dateValue(order.expected_arrival_date)}</dd></div></dl></article></section><form action={saveAction} className="customer-form"><input name="purchase_order_id" type="hidden" value={order.id} /><fieldset><legend>Add Product</legend><div className="form-grid"><label>Vendor Product<select name="vendor_product_id" required defaultValue=""><option disabled value="">Select a vendor product</option>{products.map((product) => <option key={product.id} value={product.id}>{product.sku} · {product.name} · {money(product.unit_cost)} {order.currency}</option>)}</select></label><label>Quantity<input min="0.001" name="quantity_ordered" required step="0.001" type="number" /></label><label>Expected Ready Date<input defaultValue={order.expected_ready_date ?? ""} name="expected_ready_date" type="date" /></label><label>Line Notes<input name="notes" /></label></div></fieldset><div className="form-actions"><button className="primary-action" disabled={!products.length} type="submit">Add Product</button></div>{!products.length ? <div className="form-alert">This vendor has no active vendor products yet.</div> : null}</form><article className="data-section"><div className="section-title"><h3>Order Products</h3><span>{lines.length}</span></div>{lines.length ? <div className="table-wrap"><table><thead><tr><th>SKU</th><th>Vendor Code</th><th>Product</th><th>Quantity</th><th>Unit Cost</th><th>Line Total</th></tr></thead><tbody>{lines.map((line) => <tr key={line.id}><td>{line.sku}</td><td>{line.vendor_item_number}</td><td>{line.name}</td><td>{numberFormatter.format(line.quantity_ordered)}</td><td>{money(line.unit_cost)} {order.currency}</td><td>{money(line.line_total)} {order.currency}</td></tr>)}</tbody></table></div> : <p className="fieldset-note">Add products to begin building this purchase order.</p>}</article></section>;
}
