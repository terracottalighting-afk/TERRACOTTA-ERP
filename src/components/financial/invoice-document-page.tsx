import Link from "next/link";

import { InvoiceDocumentControls } from "@/components/financial/invoice-document-controls";
import { ModulePlaceholder } from "@/components/ui";
import {
  addressSnapshotLines,
  dateLabel,
  money,
  numberFormatter,
} from "@/lib/formatters";

type InvoiceDocumentDetail = {
  customer: {
    billing_email: string | null;
  } | null;
  invoice: {
    balance_due: number | null;
    bill_to_snapshot_json: unknown;
    brand_name_snapshot: string;
    customer_name_snapshot: string;
    dropship_fee_amount: number | null;
    due_date: string | null;
    freight_amount: number | null;
    invoice_date: string;
    invoice_number: string;
    payment_terms_snapshot: string | null;
    ship_to_snapshot_json: unknown;
    subtotal_amount: number | null;
    tax_amount: number | null;
    total_amount: number | null;
  };
  lines: {
    discount_percent: number | null;
    id: string;
    line_total: number | null;
    product_name_snapshot: string;
    product_sku_snapshot: string;
    quantity_invoiced: number;
    unit_price: number | null;
  }[];
  salesOrder: {
    customer_po_number: string;
    ground_freight_terms_snapshot: string;
    id: string;
    is_dropship: boolean;
  } | null;
};

function snapshotRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export async function InvoiceDocumentPage({
  invoiceId,
  loadInvoiceDocument,
}: {
  invoiceId?: string;
  loadInvoiceDocument: (
    invoiceId: string,
  ) => Promise<InvoiceDocumentDetail | null>;
}) {
  if (!invoiceId) {
    return <ModulePlaceholder moduleName="Invoice not found" />;
  }

  const detail = await loadInvoiceDocument(invoiceId);
  if (!detail) {
    return <ModulePlaceholder moduleName="Invoice not found" />;
  }

  const { customer, invoice, lines, salesOrder } = detail;
  const residentialSurcharge = Number(snapshotRecord(invoice.ship_to_snapshot_json)?.residential_surcharge_amount ?? 0);
  const baseDropshipFee = Math.max(0, Number(invoice.dropship_fee_amount ?? 0) - residentialSurcharge);
  const isCollect = salesOrder?.ground_freight_terms_snapshot === "collect";

  return (
    <section className="quote-document-page">
      <div className="quote-document-controls print-hidden">
        <Link className="secondary-action" href="/?module=invoices">
          Back to Invoice Work Queue
        </Link>
        <InvoiceDocumentControls
          invoiceNumber={invoice.invoice_number}
          recipientEmail={customer?.billing_email}
        />
      </div>
      <article className="quote-document">
        <header className="quote-document-header">
          <div>
            <span className="eyebrow">{invoice.brand_name_snapshot}</span>
            <h2>Invoice</h2>
          </div>
          <dl>
            <div>
              <dt>Invoice No.</dt>
              <dd>{invoice.invoice_number}</dd>
            </div>
            <div>
              <dt>Customer PO</dt>
              <dd>
                {salesOrder ? (
                  <Link
                    className="invoice-document-order-link"
                    href={`/?module=orders&order=${salesOrder.id}`}
                  >
                    {salesOrder.customer_po_number}
                  </Link>
                ) : (
                  "Not set"
                )}
              </dd>
            </div>
            <div>
              <dt>Invoice Date</dt>
              <dd>{dateLabel(invoice.invoice_date)}</dd>
            </div>
            <div>
              <dt>Due Date</dt>
              <dd>{dateLabel(invoice.due_date)}</dd>
            </div>
            <div>
              <dt>Payment Terms</dt>
              <dd>{invoice.payment_terms_snapshot || "Upon Receipt"}</dd>
            </div>
          </dl>
        </header>
        <section className="quote-document-addresses">
          <div>
            <span>Bill To</span>
            {addressSnapshotLines(
              snapshotRecord(invoice.bill_to_snapshot_json),
              invoice.customer_name_snapshot,
            ).map((line, index) => (
              <strong key={`bill-${line}-${index}`}>{line}</strong>
            ))}
          </div>
          <div>
            <span>Ship To</span>
            {addressSnapshotLines(snapshotRecord(invoice.ship_to_snapshot_json)).map(
              (line, index) => (
                <strong key={`ship-${line}-${index}`}>{line}</strong>
              ),
            )}
          </div>
        </section>
        <table className="quote-document-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id}>
                <td>{line.product_sku_snapshot}</td>
                <td>{line.product_name_snapshot}</td>
                <td>
                  {numberFormatter.format(Number(line.quantity_invoiced))}
                </td>
                <td>{money(Number(line.unit_price))}</td>
                <td>{Number(line.discount_percent)}%</td>
                <td>{money(Number(line.line_total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="invoice-document-totals">
          <div>
            <dt>Subtotal</dt>
            <dd>{money(Number(invoice.subtotal_amount))}</dd>
          </div>
          {!isCollect ? <div>
            <dt>Freight</dt>
            <dd>{money(Number(invoice.freight_amount))}</dd>
          </div> : null}
          {!isCollect && residentialSurcharge > 0 ? <div><dt>Residential Surcharge</dt><dd>{money(residentialSurcharge)}</dd></div> : null}
          {salesOrder?.is_dropship ? (
            <div>
              <dt>Drop-ship Fee</dt>
              <dd>{money(isCollect ? Number(invoice.dropship_fee_amount ?? 0) : baseDropshipFee)}</dd>
            </div>
          ) : null}
          <div>
            <dt>Tax</dt>
            <dd>{money(Number(invoice.tax_amount))}</dd>
          </div>
          <div>
            <dt>Invoice Total</dt>
            <dd>{money(Number(invoice.total_amount))}</dd>
          </div>
          <div>
            <dt>Balance Due</dt>
            <dd>{money(Number(invoice.balance_due))}</dd>
          </div>
        </dl>
      </article>
    </section>
  );
}
