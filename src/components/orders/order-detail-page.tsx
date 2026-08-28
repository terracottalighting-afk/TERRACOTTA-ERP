import Link from "next/link";
import { Metric, MetricLink, StatusBadge } from "@/components/ui";
import {
  addressSnapshotLines,
  dateLabel,
  label,
  money,
  numberFormatter,
} from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type SalesOrderDetail = {
  bill_to_snapshot_json: Record<string, unknown> | null;
  converted_order?: { id: string; sales_order_number: string } | null;
  credit_hold_status: string;
  customer_account_id: string;
  customer_name_snapshot: string;
  customer_po_number: string;
  id: string;
  lines: {
    available_inventory: number;
    brand_name_snapshot: string;
    discount_percent: number;
    id: string;
    line_total: number;
    product_id: string;
    product_name_snapshot: string;
    product_sku_snapshot: string;
    quantity_ordered: number;
    quantity_shipped: number;
    unit_price: number;
  }[];
  notes: string | null;
  order_date: string;
  order_type: string;
  sales_order_number: string;
  ship_to_display_name_snapshot: string;
  ship_to_snapshot_json: Record<string, unknown>;
  shipping_priority: string;
  status: string;
  total_amount: number;
};

type ConvertQuoteAction = (formData: FormData) => Promise<void>;

export async function OrderDetailPage({
  convertQuoteToOrderAction,
  order,
  returnCustomerId,
}: {
  convertQuoteToOrderAction: ConvertQuoteAction;
  order: SalesOrderDetail;
  returnCustomerId?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const [
    { data: latestPackingList, error: latestPackingListError },
    { data: invoices, error: invoicesError },
    { count: rgaCount, error: rgaCountError },
  ] = await Promise.all([
    supabase
      .from("packing_list")
      .select("freight_shipment_id")
      .eq("sales_order_id", order.id)
      .not("freight_shipment_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("customer_invoice")
      .select(
        "id, invoice_number, brand_name_snapshot, invoice_date, due_date, invoice_status, payment_status, total_amount, balance_due",
      )
      .eq("sales_order_id", order.id)
      .neq("invoice_status", "void")
      .order("invoice_date", { ascending: false }),
    supabase
      .from("rga")
      .select("id", { count: "exact", head: true })
      .eq("sales_order_id", order.id),
  ]);
  if (latestPackingListError) throw new Error(latestPackingListError.message);
  if (invoicesError) throw new Error(invoicesError.message);
  if (rgaCountError) throw new Error(rgaCountError.message);

  const { data: latestShipment, error: latestShipmentError } =
    latestPackingList?.freight_shipment_id
      ? await supabase
          .from("freight_shipment")
          .select("id, status")
          .eq("id", latestPackingList.freight_shipment_id)
          .maybeSingle()
      : { data: null, error: null };
  if (latestShipmentError) throw new Error(latestShipmentError.message);

  const isQuote = order.order_type === "quote";
  const canEdit = ["open", "partially_shipped", "pending", "hold"].includes(order.status);
  const canShip =
    !isQuote &&
    ["open", "partially_shipped"].includes(order.status) &&
    order.credit_hold_status !== "on_credit_hold" &&
    order.lines.some((line) => line.quantity_ordered > line.quantity_shipped && line.available_inventory > 0);
  const customerOrdersHref = returnCustomerId
    ? `/?customer=${returnCustomerId}&tab=shipments`
    : `/?customer=${order.customer_account_id}&tab=orders${isQuote ? "&order_mode=quotes" : ""}`;
  const editHref = `/?module=orders&order=${order.id}&order_action=edit`;
  const hasPendingShipment = latestShipment?.status === "pending" || latestShipment?.status === "in_progress";
  const hasPostedShipment = latestShipment?.status === "shipped" || latestShipment?.status === "delivered";
  const replacementRgaNumber =
    order.order_type === "rga_replacement" ? (order.notes?.match(/\b(RGA\d{8}-\d{4})\b/i)?.[1] ?? null) : null;
  const replacementReferenceRga = replacementRgaNumber
    ? await supabase
        .from("rga")
        .select("id, rga_number, sales_order_id, original_customer_po_number_snapshot")
        .eq("rga_number", replacementRgaNumber)
        .maybeSingle()
    : { data: null, error: null };

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          {returnCustomerId ? (
            <Link className="context-parent-link" href={customerOrdersHref}>
              Back to Packing Lists
            </Link>
          ) : isQuote ? (
            <Link className="context-parent-link" href={customerOrdersHref}>
              Quote List
            </Link>
          ) : (
            <Link className="context-parent-link" href={customerOrdersHref}>
              Order List
            </Link>
          )}
          <div className="record-title-row">
            <h2>{order.sales_order_number}</h2>
            {canEdit ? (
              <Link className="status-badge status-badge--good" href={editHref}>
                Edit
              </Link>
            ) : (
              <StatusBadge tone="neutral" value={order.status} />
            )}
            {isQuote && order.status === "open" ? (
              <form action={convertQuoteToOrderAction} className="inline-status-action">
                <input name="order_id" type="hidden" value={order.id} />
                <button className="status-badge status-badge--good status-badge--button" type="submit">
                  Convert to Order
                </button>
              </form>
            ) : null}
            {order.credit_hold_status === "on_credit_hold" ? <StatusBadge tone="warn" value="Credit Hold" /> : null}
          </div>
          <p>
            <Link className="context-parent-link" href={`/?customer=${order.customer_account_id}`}>
              {order.customer_name_snapshot}
            </Link>{" "}
            | Customer PO {order.customer_po_number}
          </p>
          {isQuote && order.converted_order ? (
            <p>
              Converted PO:{" "}
              <Link className="table-link" href={`/?module=orders&order=${order.converted_order.id}`}>
                {order.converted_order.sales_order_number}
              </Link>
            </p>
          ) : null}
        </div>
        <div className="record-hero-actions">
          {!isQuote && hasPendingShipment && latestShipment ? (
            <Link className="primary-action" href={`/?module=shipment-create&order=${order.id}&shipment=${latestShipment.id}`}>
              Continue Shipment
            </Link>
          ) : null}
          {!isQuote && hasPostedShipment && latestShipment ? (
            <Link className="primary-action" href={`/?module=shipment-detail&shipment=${latestShipment.id}`}>
              View Shipment
            </Link>
          ) : null}
          {!isQuote && !hasPendingShipment && !hasPostedShipment && canShip ? (
            <Link className="primary-action" href={`/?module=shipment-create&order=${order.id}`}>
              Ship Order
            </Link>
          ) : null}
          {!isQuote ? (
            <Link className="secondary-action" href={`/?module=create-rga&order=${order.id}`}>
              Create RGA
            </Link>
          ) : null}
          {isQuote ? (
            <Link className="secondary-action quote-export-link" href={`/?module=quote-document&quote=${order.id}`} target="_blank">
              Export
            </Link>
          ) : null}
        </div>
      </section>

      <section className="metric-grid order-metric-grid">
        <Metric labelText="Order Date" value={order.order_date} />
        <Metric labelText="Order Type" value={label(order.order_type)} />
        <Metric labelText="Shipping Priority" value={label(order.shipping_priority)} />
        <Metric labelText="Order Total" value={money(Number(order.total_amount ?? 0))} />
        {invoices && invoices.length > 0 ? (
          <MetricLink href="#order-invoices" labelText="Invoices" value={numberFormatter.format(invoices.length)} />
        ) : null}
        {!isQuote ? (
          <MetricLink href={`/?module=rga&rga_order=${order.id}`} labelText="RGAs" value={numberFormatter.format(rgaCount ?? 0)} />
        ) : null}
      </section>

      {replacementRgaNumber ? (
        <section className="detail-section">
          <article className="info-panel">
            <h3>Replacement Reference</h3>
            <p>
              Original RGA:{" "}
              {replacementReferenceRga.data ? (
                <Link className="table-link" href={`/?module=rga-detail&rga=${replacementReferenceRga.data.id}`}>
                  {replacementReferenceRga.data.rga_number}
                </Link>
              ) : (
                replacementRgaNumber
              )}
            </p>
            {replacementReferenceRga.data ? (
              <p>
                Original PO:{" "}
                <Link className="table-link" href={`/?module=orders&order=${replacementReferenceRga.data.sales_order_id}`}>
                  {replacementReferenceRga.data.original_customer_po_number_snapshot || "Original order"}
                </Link>
              </p>
            ) : null}
          </article>
        </section>
      ) : null}

      <section className="detail-section order-address-section">
        <article className="info-panel">
          <h3>Ship-to Address</h3>
          {addressSnapshotLines(order.ship_to_snapshot_json, order.ship_to_display_name_snapshot).map((line, index) => (
            <p className="address-line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </article>
        <article className="info-panel">
          <h3>Bill-to Address</h3>
          {addressSnapshotLines(order.bill_to_snapshot_json, order.customer_name_snapshot).map((line, index) => (
            <p className="address-line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </article>
      </section>

      <section className="detail-section">
        <article className="data-section">
          <div className="section-title">
            <h3>Order Lines</h3>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Ordered</th>
                  <th>Available</th>
                  <th>Shipped</th>
                  <th>Unit Price</th>
                  <th>Discount</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => (
                  <tr key={line.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={
                          line.product_sku_snapshot.startsWith("PT ")
                            ? `/?module=product-parts&part=${line.product_id}`
                            : `/?module=products&product=${line.product_id}`
                        }
                      >
                        {line.product_sku_snapshot}
                      </Link>
                    </td>
                    <td>{line.product_name_snapshot}</td>
                    <td>{line.brand_name_snapshot}</td>
                    <td>{line.quantity_ordered}</td>
                    <td>{line.available_inventory}</td>
                    <td>{line.quantity_shipped}</td>
                    <td>{money(Number(line.unit_price))}</td>
                    <td>{line.discount_percent}%</td>
                    <td>{money(line.line_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <article className="info-panel">
          <h3>Order Notes</h3>
          <p className="long-text">{order.notes || "No internal notes."}</p>
        </article>
      </section>

      {invoices && invoices.length > 0 ? (
        <section className="detail-section" id="order-invoices">
          <article className="data-section">
            <div className="section-title">
              <h3>Invoices</h3>
              <span className="section-count">{numberFormatter.format(invoices.length)}</span>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Brand</th>
                    <th>Invoice Date</th>
                    <th>Due Date</th>
                    <th>Invoice Total</th>
                    <th>Balance Due</th>
                    <th>Invoice Status</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>
                        <Link className="table-link" href={`/?module=invoice-document&invoice=${invoice.id}`}>
                          {invoice.invoice_number}
                        </Link>
                      </td>
                      <td>{invoice.brand_name_snapshot}</td>
                      <td>{dateLabel(invoice.invoice_date)}</td>
                      <td>{invoice.due_date ? dateLabel(invoice.due_date) : "Not set"}</td>
                      <td>{money(Number(invoice.total_amount))}</td>
                      <td>{money(Number(invoice.balance_due))}</td>
                      <td>
                        <StatusBadge tone={invoice.invoice_status === "open" ? "primary" : "neutral"} value={invoice.invoice_status} />
                      </td>
                      <td>
                        <StatusBadge
                          tone={
                            invoice.payment_status === "paid"
                              ? "good"
                              : invoice.payment_status === "partially_paid"
                                ? "warn"
                                : "danger"
                          }
                          value={invoice.payment_status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      ) : null}
    </section>
  );
}
