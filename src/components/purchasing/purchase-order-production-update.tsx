import Link from "next/link";
import { numberFormatter, timestampLabel } from "@/lib/formatters";
import { PurchaseOrderStatus } from "./purchase-order-status";

type Order = { id: string; vendor_po_number: string; vendor_name: string; currency: string; status: string };
type Line = { id: string; sku: string; name: string; vendor_item_number: string; quantity_ordered: number; quantity_exited_factory: number; production_status: string; production_status_changed_at: string | null };

const productionStatusLabel = (status: string) => ({ in_production: "In Production", complete: "Complete", qa_pass: "QA Pass", qa_failed: "QA Failed", exit_factory: "Exit Factory" }[status] ?? status);

export function PurchaseOrderProductionUpdate({ error, lines, order, saveAction }: { error?: string; lines: Line[]; order: Order | null; saveAction: (formData: FormData) => Promise<void> }) {
  if (!order) return <section className="dashboard-panel"><div className="form-alert">Purchase order was not found.</div><Link className="secondary-action secondary-action--light" href="/?module=purchasing">Back to Purchasing</Link></section>;

  const reviewHref = `/?module=vendor-purchase-order-review&purchase_order=${order.id}`;
  return <section className="dashboard-panel">
    <section className="form-header"><div><span className="eyebrow">Production Update</span><h2>{order.vendor_po_number}</h2><p>{order.vendor_name} · {order.currency}</p></div><Link className="secondary-action secondary-action--light" href={reviewHref}>Back to Purchase Order</Link></section>
    <PurchaseOrderStatus status={order.status} />
    {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}
    <article className="data-section"><div className="section-title"><div><h3>Production Lines</h3><p className="fieldset-note">Update each product’s current production status. Exit-factory quantities are set from the container-loading workflow.</p></div><span>{lines.length}</span></div>{lines.length ? <div className="table-wrap"><table><thead><tr><th>SKU</th><th>Vendor Code</th><th>Product</th><th>Ordered Qty</th><th>Product Status</th><th>Status Change Date</th><th>Qty of Exit Factory</th><th>Remaining to Load</th><th>Action</th></tr></thead><tbody>{lines.map(line => { const remaining = Math.max(0, line.quantity_ordered - line.quantity_exited_factory); return <tr key={line.id}><td>{line.sku}</td><td>{line.vendor_item_number}</td><td>{line.name}</td><td>{numberFormatter.format(line.quantity_ordered)}</td><td>{productionStatusLabel(line.production_status)}</td><td>{line.production_status_changed_at ? timestampLabel(line.production_status_changed_at) : "Not set"}</td><td>{numberFormatter.format(line.quantity_exited_factory)}</td><td>{numberFormatter.format(remaining)}</td><td><form action={saveAction} className="inline-form"><input name="purchase_order_id" type="hidden" value={order.id} /><input name="line_id" type="hidden" value={line.id} /><select aria-label={`Production status for ${line.sku}`} defaultValue={line.production_status} name="production_status"><option value="in_production">In Production</option><option value="complete">Complete</option><option value="qa_pass">QA Pass</option><option value="qa_failed">QA Failed</option><option value="exit_factory">Exit Factory</option></select><button className="text-action text-action--button" type="submit">Save</button></form></td></tr>; })}</tbody></table></div> : <p className="fieldset-note">There are no products on this purchase order.</p>}</article>
  </section>;
}
