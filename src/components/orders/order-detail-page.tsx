import Link from "next/link";
import { Metric, StatusBadge } from "@/components/ui";
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
  sales_rep_agency_id_snapshot: string | null;
  sales_rep_id_snapshot: string | null;
  sales_order_number: string;
  ship_to_display_name_snapshot: string;
  ship_to_snapshot_json: Record<string, unknown>;
  shipping_priority: string;
  status: string;
  territory_id_snapshot: string | null;
  total_amount: number;
};

type ConvertQuoteAction = (formData: FormData) => Promise<void>;

function snapshotEmail(snapshot: Record<string, unknown> | null) {
  const email = snapshot?.shipping_contact_email ?? snapshot?.email;
  return typeof email === "string" && email.trim() ? email : null;
}

export async function OrderDetailPage({
  convertQuoteToOrderAction,
  order,
  orderTab,
  returnCustomerId,
}: {
  convertQuoteToOrderAction: ConvertQuoteAction;
  order: SalesOrderDetail;
  orderTab?: string;
  returnCustomerId?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const [
    { data: packingLists, error: packingListsError },
    { data: invoices, error: invoicesError },
    { data: rgas, error: rgasError },
  ] = await Promise.all([
    supabase
      .from("packing_list")
      .select("id, packing_list_number, freight_shipment_id, invoice_generation_status_snapshot, invoice_required, ship_date, status")
      .eq("sales_order_id", order.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("customer_invoice")
      .select(
        "id, packing_list_id, invoice_number, brand_name_snapshot, invoice_date, due_date, invoice_status, payment_status, total_amount, balance_due",
      )
      .eq("sales_order_id", order.id)
      .neq("invoice_status", "void")
      .order("invoice_date", { ascending: false }),
    supabase
      .from("rga")
      .select("id, rga_number, request_date, requested_resolution_type, status")
      .eq("sales_order_id", order.id)
      .order("created_at", { ascending: false }),
  ]);
  if (packingListsError) throw new Error(packingListsError.message);
  if (invoicesError) throw new Error(invoicesError.message);
  if (rgasError) throw new Error(rgasError.message);

  const latestPackingList = (packingLists ?? []).find(
    (packingList) => packingList.freight_shipment_id,
  ) ?? null;

  const shipmentIds = [...new Set(
    (packingLists ?? [])
      .map((packingList) => packingList.freight_shipment_id)
      .filter((shipmentId): shipmentId is string => Boolean(shipmentId)),
  )];
  const { data: shipments, error: shipmentsError } = shipmentIds.length
    ? await supabase
        .from("freight_shipment")
        .select("id, freight_shipment_number, status")
        .in("id", shipmentIds)
    : { data: [], error: null };
  if (shipmentsError) throw new Error(shipmentsError.message);
  const shipmentById = new Map((shipments ?? []).map((shipment) => [shipment.id, shipment]));
  const invoicesByPackingList = new Map<string, NonNullable<typeof invoices>>();
  for (const invoice of invoices ?? []) {
    const relatedInvoices = invoicesByPackingList.get(invoice.packing_list_id) ?? [];
    relatedInvoices.push(invoice);
    invoicesByPackingList.set(invoice.packing_list_id, relatedInvoices);
  }

  const { data: latestShipment, error: latestShipmentError } =
    latestPackingList?.freight_shipment_id
      ? await supabase
          .from("freight_shipment")
          .select("id, status")
          .eq("id", latestPackingList.freight_shipment_id)
          .maybeSingle()
      : { data: null, error: null };
  if (latestShipmentError) throw new Error(latestShipmentError.message);

  const [territoryResult, agencyResult, salesRepResult] = await Promise.all([
    order.territory_id_snapshot
      ? supabase
          .from("territory")
          .select("territory_code, name")
          .eq("id", order.territory_id_snapshot)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    order.sales_rep_agency_id_snapshot
      ? supabase
          .from("sales_rep_agency")
          .select("name")
          .eq("id", order.sales_rep_agency_id_snapshot)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    order.sales_rep_id_snapshot
      ? supabase
          .from("sales_rep")
          .select("name")
          .eq("id", order.sales_rep_id_snapshot)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  const coverageLookupError = [territoryResult, agencyResult, salesRepResult].find(
    (result) => result.error,
  );
  if (coverageLookupError?.error) throw new Error(coverageLookupError.error.message);

  const isQuote = order.order_type === "quote";
  const canEdit = ["open", "partially_shipped", "pending", "hold"].includes(order.status);
  const canShip =
    !isQuote &&
    ["open", "partially_shipped"].includes(order.status) &&
    order.credit_hold_status !== "on_credit_hold" &&
    order.lines.some((line) => line.quantity_ordered > line.quantity_shipped && line.available_inventory > 0);
  const unshippedLines = order.lines.filter(
    (line) => line.quantity_ordered > line.quantity_shipped,
  );
  const allUnshippedLinesReady = unshippedLines.every(
    (line) =>
      line.available_inventory >= line.quantity_ordered - line.quantity_shipped,
  );
  const hasAvailableUnshippedItems = unshippedLines.some(
    (line) => line.available_inventory > 0,
  );
  const shippingStatus = !unshippedLines.length
    ? "Complete"
    : allUnshippedLinesReady
      ? "Ready to ship"
      : hasAvailableUnshippedItems
        ? "Partial Ready"
        : "On Backorder";
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
  const acknowledgementRecipientEmail =
    snapshotEmail(order.ship_to_snapshot_json) ??
    snapshotEmail(order.bill_to_snapshot_json);
  const acknowledgementSubject = encodeURIComponent(
    `Order Acknowledgement ${order.sales_order_number}`,
  );
  const acknowledgementBody = encodeURIComponent(
    `Please find the order acknowledgement for ${order.sales_order_number} attached.`,
  );
  const acknowledgementEmailHref = `mailto:${acknowledgementRecipientEmail ?? ""}?subject=${acknowledgementSubject}&body=${acknowledgementBody}`;
  const activeTab = ["profile", "shipments", "rga"].includes(orderTab ?? "")
    ? orderTab!
    : "profile";

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
          {!isQuote ? (
            <>
              <Link
                className="secondary-action"
                href={`/?module=order-acknowledgement&order=${order.id}`}
                target="_blank"
              >
                Download Order Acknowledgement
              </Link>
              <a className="secondary-action" href={acknowledgementEmailHref}>
                Email Order Acknowledgement
              </a>
            </>
          ) : null}
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
          {isQuote ? (
            <Link className="secondary-action quote-export-link" href={`/?module=quote-document&quote=${order.id}`} target="_blank">
              Export
            </Link>
          ) : null}
        </div>
      </section>

      <nav className="dashboard-tabs" aria-label="Order sections">
        <Link className={activeTab === "profile" ? "dashboard-tab dashboard-tab--active" : "dashboard-tab"} href={`/?module=orders&order=${order.id}&order_tab=profile`}>Order Profile</Link>
        <Link className={activeTab === "shipments" ? "dashboard-tab dashboard-tab--active" : "dashboard-tab"} href={`/?module=orders&order=${order.id}&order_tab=shipments`}>Shipment &amp; Invoices</Link>
        {!isQuote ? <Link className={activeTab === "rga" ? "dashboard-tab dashboard-tab--active" : "dashboard-tab"} href={`/?module=orders&order=${order.id}&order_tab=rga`}>RGA</Link> : null}
      </nav>

      {activeTab === "profile" ? <>
      <section className="data-section">
        <div className="section-title"><h3>Order Header</h3></div>
        <div className="metric-grid order-metric-grid">
        <Metric labelText="Order Date" value={order.order_date} />
        <Metric labelText="Order Type" value={label(order.order_type)} />
        <Metric labelText="Order Total" value={money(Number(order.total_amount ?? 0))} />
        <Metric labelText="Shipping Status" value={shippingStatus} />
        </div>
      </section>

      <section className="detail-section">
        <article className="info-panel">
          <h3>Sales Coverage</h3>
          <dl>
            <div>
              <dt>Territory</dt>
              <dd>
                {territoryResult.data
                  ? `${territoryResult.data.territory_code} - ${territoryResult.data.name}`
                  : "Not assigned"}
              </dd>
            </div>
            <div>
              <dt>Sales Agency</dt>
              <dd>{agencyResult.data?.name ?? "Not assigned"}</dd>
            </div>
            <div>
              <dt>Sales Rep</dt>
              <dd>{salesRepResult.data?.name ?? "Not assigned"}</dd>
            </div>
          </dl>
        </article>
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
      </> : null}

      {activeTab === "shipments" ? (
        <section className="detail-section">
          <article className="data-section">
            <div className="section-title">
              <h3>Shipments &amp; Invoices</h3>
              <span className="section-count">{numberFormatter.format(packingLists?.length ?? 0)}</span>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Shipment</th>
                    <th>Packing List</th>
                    <th>Ship Date</th>
                    <th>Shipment Status</th>
                    <th>Invoices</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(packingLists ?? []).map((packingList) => {
                    const shipment = packingList.freight_shipment_id ? shipmentById.get(packingList.freight_shipment_id) : null;
                    const relatedInvoices = invoicesByPackingList.get(packingList.id) ?? [];
                    const canCreateInvoice = packingList.invoice_required && packingList.invoice_generation_status_snapshot === "not_invoiced" && ["shipped", "invoiced"].includes(packingList.status);
                    return <tr key={packingList.id}>
                      <td>
                        {shipment ? <Link className="table-link" href={`/?module=shipment-detail&shipment=${shipment.id}`}>{shipment.freight_shipment_number}</Link> : "Not created"}
                      </td>
                      <td>{packingList.packing_list_number}</td>
                      <td>{packingList.ship_date ? dateLabel(packingList.ship_date) : "Not shipped"}</td>
                      <td>{shipment ? <StatusBadge tone={shipment.status === "shipped" || shipment.status === "delivered" ? "good" : "primary"} value={shipment.status} /> : "Not created"}</td>
                      <td>{relatedInvoices.length ? relatedInvoices.map((invoice, index) => <span key={invoice.id}>{index ? ", " : ""}<Link className="table-link" href={`/?module=invoice-document&invoice=${invoice.id}`}>{invoice.invoice_number}</Link></span>) : "Not invoiced"}</td>
                      <td>{canCreateInvoice ? <Link className="text-action" href={`/?module=invoice-create&packing_list=${packingList.id}`}>Create Invoice</Link> : null}</td>
                    </tr>;
                  })}
                  {(packingLists ?? []).length === 0 ? <tr><td colSpan={6}>No shipments have been created for this order.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === "rga" && !isQuote ? (
        <section className="detail-section">
          <article className="data-section">
            <div className="section-title"><h3>RGAs</h3><Link className="primary-action small-action" href={`/?module=create-rga&order=${order.id}`}>Create RGA</Link></div>
            <div className="table-wrap"><table className="data-table"><thead><tr><th>RGA No.</th><th>Request Date</th><th>Requested Solution</th><th>Status</th></tr></thead><tbody>
              {(rgas ?? []).map((rga) => <tr key={rga.id}><td><Link className="table-link" href={`/?module=rga-detail&rga=${rga.id}`}>{rga.rga_number}</Link></td><td>{dateLabel(rga.request_date)}</td><td>{label(rga.requested_resolution_type)}</td><td><StatusBadge tone={["closed", "resolved"].includes(rga.status) ? "neutral" : rga.status === "pending_review" ? "warn" : "primary"} value={rga.status} /></td></tr>)}
              {(rgas ?? []).length === 0 ? <tr><td colSpan={4}>No RGAs have been created for this order.</td></tr> : null}
            </tbody></table></div>
          </article>
        </section>
      ) : null}
    </section>
  );
}
