import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import {
  addressSnapshotLines,
  dateLabel,
  money,
  numberFormatter,
} from "@/lib/formatters";
import { OrderAcknowledgementControls } from "./order-acknowledgement-controls";

type OrderAcknowledgement = {
  bill_to_snapshot_json: Record<string, unknown> | null;
  customer_name_snapshot: string;
  customer_po_number: string | null;
  id: string;
  lines: {
    brand_name_snapshot: string;
    discount_percent: number;
    id: string;
    line_total: number;
    product_name_snapshot: string;
    product_sku_snapshot: string;
    quantity_ordered: number;
    unit_price: number;
  }[];
  notes: string | null;
  order_date: string;
  order_type: string;
  sales_order_number: string;
  ship_to_display_name_snapshot: string;
  ship_to_snapshot_json: Record<string, unknown> | null;
  total_amount: number;
};

function snapshotEmail(snapshot: Record<string, unknown> | null) {
  const email = snapshot?.shipping_contact_email ?? snapshot?.email;
  return typeof email === "string" && email.trim() ? email : null;
}

export async function OrderAcknowledgementPage({
  loadOrder,
  orderId,
}: {
  loadOrder: (orderId: string) => Promise<OrderAcknowledgement | null>;
  orderId?: string;
}) {
  if (!orderId) return <ModulePlaceholder moduleName="Order acknowledgement" />;

  const order = await loadOrder(orderId);
  if (!order || order.order_type === "quote") {
    return <ModulePlaceholder moduleName="Order acknowledgement not found" />;
  }

  const recipientEmail =
    snapshotEmail(order.ship_to_snapshot_json) ??
    snapshotEmail(order.bill_to_snapshot_json);

  return (
    <section className="quote-document-page">
      <div className="quote-document-controls">
        <Link className="secondary-action" href={`/?module=orders&order=${order.id}`}>
          Back to Order
        </Link>
        <OrderAcknowledgementControls
          orderNumber={order.sales_order_number}
          recipientEmail={recipientEmail}
        />
      </div>
      <article className="quote-document">
        <header className="quote-document-header">
          <div>
            <span className="eyebrow">Terracotta Designs and Kanova &amp; Co.</span>
            <h2>Order Acknowledgement</h2>
          </div>
          <dl>
            <div>
              <dt>Order No.</dt>
              <dd>{order.sales_order_number}</dd>
            </div>
            <div>
              <dt>Order Date</dt>
              <dd>{dateLabel(order.order_date)}</dd>
            </div>
            <div>
              <dt>Customer PO</dt>
              <dd>{order.customer_po_number ?? "Not provided"}</dd>
            </div>
          </dl>
        </header>
        <section className="quote-document-addresses">
          <div>
            <span>Bill To</span>
            {addressSnapshotLines(order.bill_to_snapshot_json, order.customer_name_snapshot).map(
              (line, index) => (
                <strong key={`${line}-${index}`}>{line}</strong>
              ),
            )}
          </div>
          <div>
            <span>Ship To</span>
            {addressSnapshotLines(
              order.ship_to_snapshot_json,
              order.ship_to_display_name_snapshot,
            ).map((line, index) => (
              <strong key={`${line}-${index}`}>{line}</strong>
            ))}
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
            {order.lines.map((line) => (
              <tr key={line.id}>
                <td>{line.product_sku_snapshot}</td>
                <td>{line.product_name_snapshot}</td>
                <td>{line.brand_name_snapshot}</td>
                <td>{numberFormatter.format(line.quantity_ordered)}</td>
                <td>{money(Number(line.unit_price))}</td>
                <td>{line.discount_percent}%</td>
                <td>{money(Number(line.line_total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="quote-document-total">
          <span>Order Total</span>
          <strong>{money(Number(order.total_amount ?? 0))}</strong>
        </div>
        {order.notes ? (
          <section className="quote-document-notes">
            <span>Order Notes</span>
            <p>{order.notes}</p>
          </section>
        ) : null}
      </article>
    </section>
  );
}
