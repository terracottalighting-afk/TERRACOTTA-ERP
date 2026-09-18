import Link from "next/link";
import { ModulePlaceholder } from "@/components/ui";
import { dateLabel, money, numberFormatter } from "@/lib/formatters";
import { QuoteDocumentControls } from "@/components/orders/quote-document-controls";

type QuoteDocumentOrder = {
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
  total_amount: number | null;
};

export async function QuoteDocumentPage({
  loadQuote,
  quoteId,
}: {
  loadQuote: (quoteId: string) => Promise<QuoteDocumentOrder | null>;
  quoteId?: string;
}) {
  if (!quoteId) return <ModulePlaceholder moduleName="Quote document" />;

  const quote = await loadQuote(quoteId);
  if (!quote || quote.order_type !== "quote")
    return <ModulePlaceholder moduleName="Quote not found" />;

  return (
    <section className="quote-document-page">
      <div className="quote-document-controls">
        <Link
          className="secondary-action"
          href={`/?module=orders&order=${quote.id}`}
        >
          Back to Quote
        </Link>
        <QuoteDocumentControls />
      </div>
      <article className="quote-document">
        <header className="quote-document-header">
          <div>
            <span className="eyebrow">
              Terracotta Designs and Kanova &amp; Co.
            </span>
            <h2>Quote</h2>
          </div>
          <dl>
            <div>
              <dt>Quote No.</dt>
              <dd>{quote.sales_order_number}</dd>
            </div>
            <div>
              <dt>Quote Date</dt>
              <dd>{dateLabel(quote.order_date)}</dd>
            </div>
            <div>
              <dt>Customer PO</dt>
              <dd>{quote.customer_po_number}</dd>
            </div>
          </dl>
        </header>
        <section className="quote-document-addresses">
          <div>
            <span>Bill To</span>
            <strong>{quote.customer_name_snapshot}</strong>
          </div>
          <div>
            <span>Ship To</span>
            <strong>{quote.ship_to_display_name_snapshot}</strong>
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
            {quote.lines.map((line) => (
              <tr key={line.id}>
                <td>{line.product_sku_snapshot}</td>
                <td>{line.product_name_snapshot}</td>
                <td>{line.brand_name_snapshot}</td>
                <td>{numberFormatter.format(line.quantity_ordered)}</td>
                <td>{money(Number(line.unit_price))}</td>
                <td>{line.discount_percent}%</td>
                <td>{money(line.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="quote-document-total">
          <span>Subtotal</span>
          <strong>{money(quote.lines.reduce((total, line) => total + Number(line.line_total), 0))}</strong>
        </div>
        <div className="quote-document-total">
          <span>Quote Total</span>
          <strong>{money(Number(quote.total_amount ?? 0))}</strong>
        </div>
        {quote.notes ? (
          <section className="quote-document-notes">
            <span>Notes</span>
            <p>{quote.notes}</p>
          </section>
        ) : null}
      </article>
    </section>
  );
}
