import Link from "next/link";
import { ModulePlaceholder } from "@/components/ui";
import { numberFormatter } from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PackingListDocumentControls } from "@/components/shipping/packing-list-document-controls";

export async function ShippingPreparationPackingListPage({
  packingListId,
}: {
  packingListId?: string;
}) {
  if (!packingListId)
    return <ModulePlaceholder moduleName="Draft packing list not found" />;
  const supabase = createSupabaseAdminClient();
  const [packingListResult, linesResult] = await Promise.all([
    supabase
      .from("packing_list")
      .select(
        "id, packing_list_number, freight_shipment_id, sales_order_id, customer_po_number_snapshot, sales_order_number_snapshot",
      )
      .eq("id", packingListId)
      .maybeSingle(),
    supabase
      .from("packing_list_line")
      .select(
        "id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_shipped",
      )
      .eq("packing_list_id", packingListId)
      .order("product_sku_snapshot"),
  ]);
  const failure = [packingListResult, linesResult].find(
    (result) => result.error,
  );
  if (failure?.error) throw new Error(failure.error.message);
  if (!packingListResult.data)
    return <ModulePlaceholder moduleName="Draft packing list not found" />;
  const packingList = packingListResult.data;
  const lines = linesResult.data ?? [];
  const lineIds = lines.map((line) => line.id);
  const { data: boxAllocations, error: boxAllocationsError } = lineIds.length
    ? await supabase
        .from("packing_list_line_box")
        .select(
          "packing_list_line_id, box_sequence_snapshot, box_label_snapshot, box_length_snapshot, box_width_snapshot, box_height_snapshot, gross_weight_snapshot, warehouse_id, warehouse_location_id, box_quantity_shipped",
        )
        .in("packing_list_line_id", lineIds)
        .order("box_sequence_snapshot")
    : { data: [], error: null };
  if (boxAllocationsError) throw new Error(boxAllocationsError.message);
  const warehouseIds = [
    ...new Set(
      (boxAllocations ?? []).map((allocation) => allocation.warehouse_id),
    ),
  ];
  const locationIds = [
    ...new Set(
      (boxAllocations ?? []).map(
        (allocation) => allocation.warehouse_location_id,
      ),
    ),
  ];
  const [warehousesResult, locationsResult] = await Promise.all([
    warehouseIds.length
      ? supabase.from("warehouse").select("id, name").in("id", warehouseIds)
      : Promise.resolve({ data: [], error: null }),
    locationIds.length
      ? supabase
          .from("warehouse_location")
          .select("id, location_code, location_name")
          .in("id", locationIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  const locationFailure = [warehousesResult, locationsResult].find(
    (result) => result.error,
  );
  if (locationFailure?.error) throw new Error(locationFailure.error.message);
  const lineById = new Map(lines.map((line) => [line.id, line]));
  const warehouseById = new Map(
    (warehousesResult.data ?? []).map((warehouse) => [
      warehouse.id,
      warehouse.name,
    ]),
  );
  const locationById = new Map(
    (locationsResult.data ?? []).map((location) => [location.id, location]),
  );
  const preparationBoxes = boxAllocations ?? [];
  const totalGrossWeight = preparationBoxes.reduce(
    (total, allocation) =>
      total +
      (allocation.gross_weight_snapshot === null
        ? 0
        : Number(allocation.gross_weight_snapshot) *
          Number(allocation.box_quantity_shipped)),
    0,
  );
  const totalCubicInches = preparationBoxes.reduce((total, allocation) => {
    const dimensions = [
      allocation.box_length_snapshot,
      allocation.box_width_snapshot,
      allocation.box_height_snapshot,
    ];
    return dimensions.every((value) => value !== null)
      ? total +
          Number(dimensions[0]) *
            Number(dimensions[1]) *
            Number(dimensions[2]) *
            Number(allocation.box_quantity_shipped)
      : total;
  }, 0);
  const totalCbm = totalCubicInches / 61023.744;
  const shipmentMetric = (value: number) =>
    value.toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <section className="quote-document-page">
      <div className="quote-document-controls">
        <Link
          className="secondary-action"
          href={`/?module=shipment-create&order=${packingList.sales_order_id}&shipment=${packingList.freight_shipment_id}`}
        >
          Back to Pending Shipment
        </Link>
        <PackingListDocumentControls />
      </div>
      <article className="quote-document">
        <header className="quote-document-header">
          <div>
            <span className="eyebrow">Warehouse Use Only</span>
            <h2>Shipping Preparation List</h2>
          </div>
          <dl>
            <div>
              <dt>Draft Packing List No.</dt>
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
          </dl>
        </header>
        <p className="warehouse-prep-note">
          Use this sheet to locate and pack the selected items. It is an
          internal preparation document, not the customer-facing packing list.
        </p>
        <table className="quote-document-table warehouse-preparation-table">
          <thead>
            <tr>
              <th>SKU / Item</th>
              <th>Brand</th>
              <th>Box</th>
              <th>Box Dimensions</th>
              <th>Gross Weight</th>
              <th>Pieces</th>
              <th>Warehouse / Bin</th>
            </tr>
          </thead>
          <tbody>
            {preparationBoxes.map((allocation, index) => {
              const line = lineById.get(allocation.packing_list_line_id);
              const location = locationById.get(
                allocation.warehouse_location_id,
              );
              const dimensions = [
                allocation.box_length_snapshot,
                allocation.box_width_snapshot,
                allocation.box_height_snapshot,
              ].every((value) => value !== null)
                ? `${allocation.box_length_snapshot} x ${allocation.box_width_snapshot} x ${allocation.box_height_snapshot} in`
                : "Not set";
              return (
                <tr key={`${allocation.packing_list_line_id}-${index}`}>
                  <td>
                    <strong>{line?.product_sku_snapshot ?? "SKU"}</strong>
                    <br />
                    {line?.product_name_snapshot ?? "Item"}
                  </td>
                  <td>{line?.brand_name_snapshot ?? "Not set"}</td>
                  <td>
                    Box {allocation.box_sequence_snapshot}
                    {allocation.box_label_snapshot
                      ? `: ${allocation.box_label_snapshot}`
                      : ""}
                  </td>
                  <td>{dimensions}</td>
                  <td>
                    {allocation.gross_weight_snapshot === null
                      ? "Not set"
                      : `${allocation.gross_weight_snapshot} lb`}
                  </td>
                  <td>
                    {numberFormatter.format(
                      Number(allocation.box_quantity_shipped),
                    )}
                  </td>
                  <td>
                    {warehouseById.get(allocation.warehouse_id) ?? "Warehouse"}
                    <br />
                    {location?.location_code ?? "Location"}
                    {location?.location_name
                      ? ` - ${location.location_name}`
                      : ""}
                  </td>
                </tr>
              );
            })}
            {preparationBoxes.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  No warehouse/bin picks have been selected for this draft
                  packing list.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className="quote-document-total preparation-list-totals">
          <span>
            Total Gross Weight:{" "}
            <strong>{shipmentMetric(totalGrossWeight)} lb</strong>
          </span>
          <span>
            Total Volume:{" "}
            <strong>
              {shipmentMetric(totalCubicInches)} cu in (
              {shipmentMetric(totalCbm)} CBM)
            </strong>
          </span>
        </div>
      </article>
    </section>
  );
}
