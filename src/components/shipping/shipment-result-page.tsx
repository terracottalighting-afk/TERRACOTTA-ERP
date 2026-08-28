import Link from "next/link";
import { EmptyState, ModulePlaceholder, StatusBadge } from "@/components/ui";
import {
  addressSnapshotLines,
  label,
  money,
  numberFormatter,
  timestampLabel,
} from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ShipmentResultOrder = {
  customer_name_snapshot: string;
  id: string;
  ship_to_display_name_snapshot: string;
};

export async function ShipmentResultPage({
  loadOrder,
  notice,
  returnCustomerId,
  shipmentId,
}: {
  loadOrder: (orderId: string) => Promise<ShipmentResultOrder | null>;
  notice?: string;
  returnCustomerId?: string;
  shipmentId?: string;
}) {
  if (!shipmentId) return <ModulePlaceholder moduleName="Shipment not found" />;

  const supabase = createSupabaseAdminClient();
  const [shipmentResult, packingListResult, documentsResult] =
    await Promise.all([
      supabase
        .from("freight_shipment")
        .select(
          "id, freight_shipment_number, status, carrier, shipping_type, master_tracking_number, freight_cost, notes, ship_to_snapshot_json",
        )
        .eq("id", shipmentId)
        .maybeSingle(),
      supabase
        .from("packing_list")
        .select(
          "id, packing_list_number, sales_order_id, customer_po_number_snapshot, sales_order_number_snapshot, shipping_fee",
        )
        .eq("freight_shipment_id", shipmentId)
        .maybeSingle(),
      supabase
        .from("attachment")
        .select(
          "id, original_file_name, category, storage_bucket, storage_path, uploaded_at",
        )
        .eq("entity_type", "freight_shipment")
        .eq("entity_id", shipmentId)
        .eq("is_active", true)
        .order("uploaded_at", { ascending: false }),
    ]);
  const failure = [shipmentResult, packingListResult, documentsResult].find(
    (result) => result.error,
  );
  if (failure?.error) throw new Error(failure.error.message);
  if (!shipmentResult.data || !packingListResult.data)
    return <ModulePlaceholder moduleName="Shipment not found" />;

  const shipment = shipmentResult.data;
  const packingList = packingListResult.data;
  const [order, packingLinesResult] = await Promise.all([
    loadOrder(packingList.sales_order_id),
    supabase
      .from("packing_list_line")
      .select("id, brand_name_snapshot, product_sku_snapshot, quantity_shipped")
      .eq("packing_list_id", packingList.id)
      .order("product_sku_snapshot"),
  ]);
  if (packingLinesResult.error)
    throw new Error(packingLinesResult.error.message);
  const documents = await Promise.all(
    (documentsResult.data ?? []).map(async (document) => {
      const { data, error } = await supabase.storage
        .from(document.storage_bucket)
        .createSignedUrl(document.storage_path, 60 * 60);
      return {
        ...document,
        downloadUrl: error ? null : (data?.signedUrl ?? null),
      };
    }),
  );

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="context-parent-link"
            href={
              returnCustomerId
                ? `/?customer=${returnCustomerId}&tab=shipments`
                : order
                  ? `/?module=orders&order=${order.id}`
                  : "/?module=shipping&shipping_tab=ready"
            }
          >
            {returnCustomerId ? "Back to Packing Lists" : "Back to Order"}
          </Link>
          <div className="record-title-row">
            <h2>Shipment {shipment.freight_shipment_number}</h2>
            <StatusBadge tone="neutral" value={shipment.status} />
          </div>
          <p>
            {order?.customer_name_snapshot ?? "Customer"} | Customer PO{" "}
            {packingList.customer_po_number_snapshot}
          </p>
        </div>
        <Link
          className="secondary-action"
          href="/?module=shipping&shipping_tab=ready"
        >
          Shipping Queue
        </Link>
      </section>
      {notice ? <p className="form-notice">{notice}</p> : null}
      <section className="detail-section order-address-section">
        <article className="info-panel">
          <h3>Ship-to Address</h3>
          {addressSnapshotLines(
            shipment.ship_to_snapshot_json as Record<string, unknown>,
            order?.ship_to_display_name_snapshot,
          ).map((line, index) => (
            <p className="address-line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </article>
        <article className="info-panel">
          <h3>Shipment Details</h3>
          <p>
            <strong>Carrier:</strong> {shipment.carrier || "Not set"}
          </p>
          <p>
            <strong>Shipping Type:</strong>{" "}
            {shipment.shipping_type ? label(shipment.shipping_type) : "Not set"}
          </p>
          <p>
            <strong>Actual Freight Cost:</strong> {money(shipment.freight_cost)}
          </p>
          <p>
            <strong>Customer Freight Charge:</strong>{" "}
            {Number(packingList.shipping_fee ?? 0) === 0
              ? "Free Freight"
              : money(packingList.shipping_fee)}
          </p>
          <p>
            <strong>Master Tracking No.:</strong>{" "}
            {shipment.master_tracking_number || "Not set"}
          </p>
        </article>
      </section>
      <section className="detail-section shipment-workspace-section">
        <article className="data-section">
          <div className="section-title">
            <h3>Packing List {packingList.packing_list_number}</h3>
            <Link
              className="text-action"
              href={`/?module=packing-list-document&packing_list=${packingList.id}`}
              target="_blank"
            >
              Download Packing List
            </Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Brand</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {(packingLinesResult.data ?? []).map((line) => (
                  <tr key={line.id}>
                    <td>{line.product_sku_snapshot}</td>
                    <td>{line.brand_name_snapshot}</td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_shipped))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        <article className="data-section">
          <div className="section-title">
            <h3>Shipping Documents</h3>
            <span>{documents.length}</span>
          </div>
          <div className="compact-list">
            {documents.length === 0 ? (
              <EmptyState text="No shipping documents were attached." />
            ) : (
              documents.map((document) => (
                <div className="compact-row" key={document.id}>
                  <div>
                    <strong>{document.original_file_name}</strong>
                    <span>
                      {label(document.category ?? "shipping document")} |{" "}
                      {timestampLabel(document.uploaded_at)}
                    </span>
                  </div>
                  {document.downloadUrl ? (
                    <a className="text-action" href={document.downloadUrl}>
                      Download
                    </a>
                  ) : (
                    <span>Unavailable</span>
                  )}
                </div>
              ))
            )}
          </div>
        </article>
      </section>
    </section>
  );
}
