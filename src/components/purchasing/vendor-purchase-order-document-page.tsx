import Link from "next/link";
import { Fragment } from "react";
import { dateLabel, money, numberFormatter } from "@/lib/formatters";
import { expectedImportTariff } from "@/lib/purchasing";
import { VendorPurchaseOrderDocumentControls } from "./vendor-purchase-order-document-controls";

type Order = { id: string; vendor_po_number: string; vendor_name: string; vendor_email: string | null; currency: string; po_date: string; expected_ready_date: string | null; expected_ship_date: string | null; expected_available_date: string | null; freight_amount: number; notes: string | null };
type Line = { id: string; sku: string; name: string; vendor_item_number: string; quantity_ordered: number; unit_cost: number; line_total: number; notes: string | null };

export function VendorPurchaseOrderDocumentPage({ lines, order, tariffRatePercent, vendorProductionCommitment }: { lines: Line[]; order: Order | null; tariffRatePercent: number; vendorProductionCommitment: string }) {
  if (!order) return <section className="dashboard-panel"><div className="form-alert">Purchase order was not found.</div></section>;

  const backHref = `/?module=vendor-purchase-order-review&purchase_order=${order.id}`;
  const subtotal = lines.reduce((total, line) => total + line.line_total, 0);
  const freight = Number(order.freight_amount ?? 0);
  const importTariff = expectedImportTariff(subtotal, tariffRatePercent);
  const poTotal = subtotal + freight + importTariff;

  return <section className="quote-document-page">
    <div className="quote-document-controls">
      <Link className="secondary-action" href={backHref}>Back to Purchase Order</Link>
      <VendorPurchaseOrderDocumentControls orderNumber={order.vendor_po_number} recipientEmail={order.vendor_email} />
    </div>
    <article className="quote-document">
      <header className="quote-document-header">
        <div><span className="eyebrow">Terracotta Designs and Kanova &amp; Co.</span><h2>Purchase Order</h2><p>{order.vendor_name}</p></div>
        <dl><div><dt>PO Number</dt><dd>{order.vendor_po_number}</dd></div><div><dt>PO Date</dt><dd>{dateLabel(order.po_date)}</dd></div><div><dt>Expected Ready</dt><dd>{dateLabel(order.expected_ready_date)}</dd></div><div><dt>Expected Ship</dt><dd>{dateLabel(order.expected_ship_date)}</dd></div><div><dt>Expected Available</dt><dd>{dateLabel(order.expected_available_date)}</dd></div></dl>
      </header>
      <table className="quote-document-table"><thead><tr><th>SKU</th><th>Vendor Code</th><th>Product</th><th>Quantity</th><th>Unit Cost</th><th>Line Total</th></tr></thead><tbody>{lines.map(line => <Fragment key={line.id}><tr><td>{line.sku}</td><td>{line.vendor_item_number}</td><td>{line.name}</td><td>{numberFormatter.format(line.quantity_ordered)}</td><td>{money(line.unit_cost)} {order.currency}</td><td>{money(line.line_total)} {order.currency}</td></tr>{line.notes ? <tr className="quote-document-line-note"><td colSpan={6}><strong>Production Instructions:</strong> {line.notes}</td></tr> : null}</Fragment>)}</tbody></table>
      <div className="quote-document-total"><span>Product Subtotal</span><strong>{money(subtotal)} {order.currency}</strong></div>
      <div className="quote-document-total"><span>Expected Freight Cost</span><strong>{money(freight)} {order.currency}</strong></div>
      <div className="quote-document-total"><span>Expected Import Tariff ({tariffRatePercent}%)</span><strong>{money(importTariff)} {order.currency}</strong></div>
      <div className="quote-document-total"><span>PO Total</span><strong>{money(poTotal)} {order.currency}</strong></div>
      <section className="quote-document-notes quote-document-commitment"><span>Vendor Production Commitment</span><p>{vendorProductionCommitment}</p></section>
      {order.notes ? <section className="quote-document-notes"><span>Purchase Notes</span><p>{order.notes}</p></section> : null}
    </article>
  </section>;
}
