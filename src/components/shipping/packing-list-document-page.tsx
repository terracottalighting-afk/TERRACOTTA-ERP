import Link from "next/link";
import { ModulePlaceholder } from "@/components/ui";
import { addressSnapshotLines, numberFormatter } from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PackingListDocumentControls } from "@/components/shipping/packing-list-document-controls";

type PackingListDocumentOrder = {
  customer_name_snapshot: string;
  ship_to_display_name_snapshot: string;
};

export async function PackingListDocumentPage({
  loadOrder,
  packingListId,
}: {
  loadOrder: (orderId: string) => Promise<PackingListDocumentOrder | null>;
  packingListId?: string;
}) {
  if (!packingListId)
    return <ModulePlaceholder moduleName="Packing list not found" />;
  const supabase = createSupabaseAdminClient();
  const [packingListResult, packingLinesResult] = await Promise.all([
    supabase
      .from("packing_list")
      .select(
        "id, packing_list_number, freight_shipment_id, sales_order_id, customer_po_number_snapshot, sales_order_number_snapshot, ship_to_snapshot_json",
      )
      .eq("id", packingListId)
      .maybeSingle(),
    supabase
      .from("packing_list_line")
      .select("id, brand_name_snapshot, product_sku_snapshot, quantity_shipped")
      .eq("packing_list_id", packingListId)
      .order("product_sku_snapshot"),
  ]);
  const failure = [packingListResult, packingLinesResult].find(
    (result) => result.error,
  );
  if (failure?.error) throw new Error(failure.error.message);
  if (!packingListResult.data)
    return <ModulePlaceholder moduleName="Packing list not found" />;
  const packingList = packingListResult.data;
  const packingLines = packingLinesResult.data ?? [];
  const { data: packingBoxLines, error: packingBoxLinesError } =
    packingLines.length > 0
      ? await supabase
          .from("packing_list_line_box")
          .select(
            "packing_list_line_id, box_sequence_snapshot, box_label_snapshot, box_quantity_shipped",
          )
          .in(
            "packing_list_line_id",
            packingLines.map((line) => line.id),
          )
          .order("box_sequence_snapshot")
      : { data: [], error: null };
  if (packingBoxLinesError) throw new Error(packingBoxLinesError.message);

  const boxesByPackingLine = new Map<
    string,
    Array<{
      box_label_snapshot: string | null;
      box_quantity_shipped: number;
      box_sequence_snapshot: number;
      packing_list_line_id: string;
    }>
  >();
  for (const box of packingBoxLines ?? []) {
    const lineBoxes = boxesByPackingLine.get(box.packing_list_line_id) ?? [];
    lineBoxes.push(box);
    boxesByPackingLine.set(box.packing_list_line_id, lineBoxes);
  }
  const totalItems = packingLines.reduce(
    (total, line) => total + Number(line.quantity_shipped),
    0,
  );
  const totalBoxes = (packingBoxLines ?? []).reduce(
    (total, box) => total + Number(box.box_quantity_shipped),
    0,
  );

  const [order, shipmentResult] = await Promise.all([
    loadOrder(packingList.sales_order_id),
    packingList.freight_shipment_id
      ? supabase
          .from("freight_shipment")
          .select("carrier, master_tracking_number")
          .eq("id", packingList.freight_shipment_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (shipmentResult.error) throw new Error(shipmentResult.error.message);
  const shipment = shipmentResult.data;

  return (
    <section className="quote-document-page">
      <div className="quote-document-controls">
        <Link
          className="secondary-action"
          href={`/?module=shipment-detail&shipment=${packingList.freight_shipment_id}`}
        >
          Back to Shipment
        </Link>
        <PackingListDocumentControls />
      </div>
      <article className="quote-document">
        <header className="quote-document-header">
          <div>
            <span className="eyebrow">
              Terracotta Designs and Kanova &amp; Co.
            </span>
            <h2>Packing List</h2>
          </div>
          <dl>
            <div>
              <dt>Packing List No.</dt>
              <dd>{packingList.packing_list_number}</dd>
            </div>
            <div>
              <dt>Sales Order No.</dt>
              <dd>{packingList.sales_order_number_snapshot}</dd>
            </div>
            <div>
              <dt>Customer PO</dt>
              <dd>{packingList.customer_po_number_snapshot}</dd>
            </div>
            <div>
              <dt>Carrier</dt>
              <dd>{shipment?.carrier || "Not set"}</dd>
            </div>
            <div>
              <dt>Master Tracking No.</dt>
              <dd>{shipment?.master_tracking_number || "Not set"}</dd>
            </div>
          </dl>
        </header>
        <section className="quote-document-addresses">
          <div>
            <span>Customer</span>
            <strong>{order?.customer_name_snapshot ?? "Not set"}</strong>
          </div>
          <div>
            <span>Ship To</span>
            {addressSnapshotLines(
              packingList.ship_to_snapshot_json as Record<string, unknown>,
              order?.ship_to_display_name_snapshot,
            ).map((line, index) => (
              <strong key={`${line}-${index}`}>{line}</strong>
            ))}
          </div>
        </section>
        <table className="quote-document-table packing-list-detail-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Brand</th>
              <th>Item Qty</th>
              <th>Box</th>
              <th>Box Qty</th>
            </tr>
          </thead>
          <tbody>
            {packingLines.map((line) => {
              const boxes = boxesByPackingLine.get(line.id) ?? [];
              return boxes.length > 0 ? (
                boxes.map((box, index) => (
                  <tr
                    className={index === 0 ? "" : "packing-list-box-row"}
                    key={`${line.id}-${box.box_sequence_snapshot}-${index}`}
                  >
                    {index === 0 ? (
                      <>
                        <td rowSpan={boxes.length}>
                          {line.product_sku_snapshot}
                        </td>
                        <td rowSpan={boxes.length}>
                          {line.brand_name_snapshot}
                        </td>
                        <td rowSpan={boxes.length}>
                          {numberFormatter.format(Number(line.quantity_shipped))}
                        </td>
                      </>
                    ) : null}
                    <td>
                      Box {box.box_sequence_snapshot}
                      {box.box_label_snapshot
                        ? `: ${box.box_label_snapshot}`
                        : ""}
                    </td>
                    <td>
                      {numberFormatter.format(Number(box.box_quantity_shipped))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr key={line.id}>
                  <td>{line.product_sku_snapshot}</td>
                  <td>{line.brand_name_snapshot}</td>
                  <td>
                    {numberFormatter.format(Number(line.quantity_shipped))}
                  </td>
                  <td>Not recorded</td>
                  <td>0</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="quote-document-total packing-list-totals">
          <span>
            Total Items: <strong>{numberFormatter.format(totalItems)}</strong>
          </span>
          <span>
            Total Boxes: <strong>{numberFormatter.format(totalBoxes)}</strong>
          </span>
        </div>
      </article>
    </section>
  );
}
