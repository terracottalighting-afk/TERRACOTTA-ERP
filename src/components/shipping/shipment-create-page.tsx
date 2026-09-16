import Link from "next/link";
import { EmptyState, ModulePlaceholder, StatusBadge } from "@/components/ui";
import {
  addressSnapshotLines,
  label,
  money,
  numberFormatter,
  timestampLabel,
} from "@/lib/formatters";
import { createSupabaseAdminClient, createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";
import { ShipmentCarrierFields } from "./shipment-carrier-fields";
import { ShipmentFreightFields } from "./shipment-freight-fields";
import { ShipmentSubmitButton } from "./shipment-submit-button";

type ShipmentOrder = {
  credit_hold_status: string;
  customer_account_id: string;
  customer_name_snapshot: string;
  customer_po_number: string;
  id: string;
  lines: {
    id: string;
    product_id: string;
    product_name_snapshot: string;
    product_sku_snapshot: string;
    quantity_cancelled: number;
    quantity_ordered: number;
    quantity_shipped: number;
  }[];
  order_type: string;
  sales_order_number: string;
  ship_to_display_name_snapshot: string;
  ship_to_snapshot_json: Record<string, unknown>;
  shipping_priority: string;
  status: string;
};
export async function ShipmentCreatePage({
  error,
  notice,
  orderId,
  shipmentId,
  shipmentEdit,
  addPendingPackingListLinesAction,
  confirmPendingShipmentAction,
  createPendingShipmentAction,
  loadOrder,
  updatePendingPackingListLinesAction,
  updateShipmentDetailsAction,
  uploadShipmentDocumentAction,
}: {
  error?: string;
  notice?: string;
  orderId?: string;
  shipmentId?: string;
  shipmentEdit?: string;
  addPendingPackingListLinesAction: (formData: FormData) => Promise<void>;
  confirmPendingShipmentAction: (formData: FormData) => Promise<void>;
  createPendingShipmentAction: (formData: FormData) => Promise<void>;
  loadOrder: (orderId: string) => Promise<ShipmentOrder | null>;
  updatePendingPackingListLinesAction: (formData: FormData) => Promise<void>;
  updateShipmentDetailsAction: (formData: FormData) => Promise<void>;
  uploadShipmentDocumentAction: (formData: FormData) => Promise<void>;
}) {
  if (!orderId)
    return (
      <ModulePlaceholder moduleName="Choose an order to create a shipment" />
    );
  const order = await loadOrder(orderId);
  if (!order) return <ModulePlaceholder moduleName="Order not found" />;
  const supabase = createSupabaseAdminClient();
  const { data: carriers, error: carriersError } = await createSupabaseUntypedAdminClient()
    .from("freight_carrier")
    .select("id, carrier_name, freight_type")
    .eq("is_active", true)
    .order("carrier_name", { ascending: true });
  if (carriersError) throw new Error(carriersError.message);
  const [shipmentResult, documentsResult, packingListResult] = shipmentId
    ? await Promise.all([
        supabase
          .from("freight_shipment")
          .select(
            "id, freight_shipment_number, status, carrier, shipping_type, master_tracking_number, freight_cost, notes",
          )
          .eq("id", shipmentId)
          .eq("customer_account_id", order.customer_account_id)
          .maybeSingle(),
        supabase
          .from("attachment")
          .select("id, original_file_name, category, uploaded_at")
          .eq("entity_type", "freight_shipment")
          .eq("entity_id", shipmentId)
          .eq("is_active", true)
          .order("uploaded_at", { ascending: false }),
        supabase
          .from("packing_list")
          .select("id, packing_list_number, shipping_fee")
          .eq("freight_shipment_id", shipmentId)
          .maybeSingle(),
      ])
    : [
        { data: null, error: null },
        { data: [], error: null },
        { data: null, error: null },
      ];
  const shipmentFailure = [
    shipmentResult,
    documentsResult,
    packingListResult,
  ].find((result) => result.error);
  if (shipmentFailure?.error) throw new Error(shipmentFailure.error.message);
  const shipment = shipmentResult.data;
  const packingList = packingListResult.data;
  const { data: packingLines, error: packingLinesError } = packingList
    ? await supabase
        .from("packing_list_line")
        .select(
          "id, sales_order_line_id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_shipped",
        )
        .eq("packing_list_id", packingList.id)
        .order("product_sku_snapshot")
    : { data: [], error: null };
  if (packingLinesError) throw new Error(packingLinesError.message);
  const packingLineIds = (packingLines ?? []).map((line) => line.id);
  const {
    data: packingLineBoxAllocations,
    error: packingLineBoxAllocationsError,
  } = packingLineIds.length
    ? await supabase
        .from("packing_list_line_box")
        .select(
          "id, packing_list_line_id, inventory_balance_id, box_quantity_shipped",
        )
        .in("packing_list_line_id", packingLineIds)
    : { data: [], error: null };
  if (packingLineBoxAllocationsError)
    throw new Error(packingLineBoxAllocationsError.message);
  const editAll = shipmentEdit === "all";
  const editHeader = editAll || shipmentEdit === "header";
  const editDocuments = editAll || shipmentEdit === "documents";
  const editLines = editAll || shipmentEdit === "lines";
  const confirmationHref = `/?module=shipment-create&order=${orderId}&shipment=${shipmentId}`;
  const editHref = (section: "header" | "documents" | "lines" | "all") =>
    `${confirmationHref}&shipment_edit=${section}`;

  const eligibleLines = order.lines
    .map((line) => ({
      ...line,
      remainingQuantity: Math.max(
        0,
        line.quantity_ordered - line.quantity_shipped - line.quantity_cancelled,
      ),
    }))
    .filter((line) => line.remainingQuantity > 0);
  const shipmentProductIds = [
    ...new Set(eligibleLines.map((line) => line.product_id)),
  ];
  const [availableBalancesResult, requiredBoxesResult] =
    shipmentProductIds.length
      ? await Promise.all([
          supabase
            .from("inventory_balance")
            .select(
              "id, product_id, product_packing_box_id, warehouse_id, warehouse_location_id, quantity_available",
            )
            .in("product_id", shipmentProductIds)
            .eq("inventory_condition", "regular"),
          supabase
            .from("product_packing_box")
            .select("id, product_id, box_sequence, box_label")
            .in("product_id", shipmentProductIds)
            .eq("is_active", true)
            .eq("is_required_for_sale", true)
            .order("box_sequence"),
        ])
      : [
          { data: [], error: null },
          { data: [], error: null },
        ];
  const locationIds = [
    ...new Set(
      (availableBalancesResult.data ?? []).map(
        (balance) => balance.warehouse_location_id,
      ),
    ),
  ];
  const warehouseIds = [
    ...new Set(
      (availableBalancesResult.data ?? []).map(
        (balance) => balance.warehouse_id,
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
  const shipmentDataFailure = [
    availableBalancesResult,
    requiredBoxesResult,
    warehousesResult,
    locationsResult,
  ].find((result) => result.error);
  if (shipmentDataFailure?.error)
    throw new Error(shipmentDataFailure.error.message);
  const warehouseNameById = new Map(
    (warehousesResult.data ?? []).map((warehouse) => [
      warehouse.id,
      warehouse.name,
    ]),
  );
  const locationById = new Map(
    (locationsResult.data ?? []).map((location) => [location.id, location]),
  );
  const boxesByShipmentProduct = new Map<
    string,
    typeof requiredBoxesResult.data
  >();
  for (const box of requiredBoxesResult.data ?? []) {
    const boxes = boxesByShipmentProduct.get(box.product_id) ?? [];
    boxes.push(box);
    boxesByShipmentProduct.set(box.product_id, boxes);
  }
  const balancesByShipmentProduct = new Map<
    string,
    typeof availableBalancesResult.data
  >();
  for (const balance of availableBalancesResult.data ?? []) {
    const balances = balancesByShipmentProduct.get(balance.product_id) ?? [];
    balances.push(balance);
    balancesByShipmentProduct.set(balance.product_id, balances);
  }
  const shipmentLines = eligibleLines.map((line) => {
    const requiredBoxes = boxesByShipmentProduct.get(line.product_id) ?? [];
    const balances = balancesByShipmentProduct.get(line.product_id) ?? [];
    const locationBalances = requiredBoxes.length
      ? requiredBoxes.map((box) => ({
          ...box,
          balances: balances
            .filter((balance) => balance.product_packing_box_id === box.id)
            .map((balance) => ({
              ...balance,
              warehouseName:
                warehouseNameById.get(balance.warehouse_id) ?? "Warehouse",
              location: locationById.get(balance.warehouse_location_id),
            })),
        }))
      : [
          {
            id: `sku-${line.product_id}`,
            box_label: "No packing box",
            box_sequence: 1,
            balances: balances
              .filter((balance) => !balance.product_packing_box_id)
              .map((balance) => ({
                ...balance,
                warehouseName:
                  warehouseNameById.get(balance.warehouse_id) ?? "Warehouse",
                location: locationById.get(balance.warehouse_location_id),
              })),
          },
        ];
    const readyQuantity = locationBalances.length
      ? Math.min(
          ...locationBalances.map((box) =>
            box.balances.reduce(
              (sum, balance) => sum + Number(balance.quantity_available),
              0,
            ),
          ),
        )
      : 0;
    return { ...line, locationBalances, readyQuantity };
  });
  const packedOrderLineIds = new Set(
    (packingLines ?? []).map((line) => line.sales_order_line_id),
  );
  const additionalShipmentLines = shipmentLines.filter(
    (line) => !packedOrderLineIds.has(line.id),
  );
  const shipmentLineByOrderLineId = new Map(
    shipmentLines.map((line) => [line.id, line]),
  );
  const pickedQuantityByPackingLineAndBalance = new Map<string, number>();
  for (const allocation of packingLineBoxAllocations ?? []) {
    if (allocation.inventory_balance_id) {
      const key = `${allocation.packing_list_line_id}:${allocation.inventory_balance_id}`;
      pickedQuantityByPackingLineAndBalance.set(
        key,
        (pickedQuantityByPackingLineAndBalance.get(key) ?? 0) +
          Number(allocation.box_quantity_shipped),
      );
    }
  }
  const canCreateShipment =
    order.order_type !== "quote" &&
    ["open", "partially_shipped"].includes(order.status) &&
    order.credit_hold_status !== "on_credit_hold" &&
    shipmentLines.length > 0;

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="context-parent-link"
            href={`/?module=orders&order=${order.id}`}
          >
            Back to Order
          </Link>
          <div className="record-title-row">
            <h2>{shipment ? "Shipment Confirmation" : "Create Shipment"}</h2>
            <StatusBadge tone="neutral" value={order.sales_order_number} />
          </div>
          <p>
            <Link
              className="context-parent-link"
              href={`/?customer=${order.customer_account_id}`}
            >
              {order.customer_name_snapshot}
            </Link>{" "}
            | Customer PO {order.customer_po_number}
          </p>
        </div>
        {shipment ? (
          <Link className="secondary-action" href={editHref("all")}>
            Full Shipment Edit
          </Link>
        ) : (
          <Link
            className="secondary-action"
            href="/?module=shipping&shipping_tab=ready"
          >
            Shipping Queue
          </Link>
        )}
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {notice ? <p className="form-notice">{notice}</p> : null}
      <section className="detail-section order-address-section">
        <article className="info-panel">
          <h3>Ship-to Address</h3>
          {addressSnapshotLines(
            order.ship_to_snapshot_json,
            order.ship_to_display_name_snapshot,
          ).map((line, index) => (
            <p className="address-line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </article>
        <article className="info-panel">
          <h3>Shipment Status</h3>
          <p>
            <strong>
              {order.shipping_priority === "highest"
                ? "Highest Priority"
                : "Normal Priority"}
            </strong>
          </p>
          <p>
            {order.credit_hold_status === "on_credit_hold"
              ? "Credit hold must be resolved before shipping."
              : "Draft shipment creation does not reduce inventory."}
          </p>
        </article>
      </section>
      {shipment ? (
        <section className="detail-section shipment-workspace-section">
          <article className="data-section">
            <div className="section-title">
              <h3>
                Review Pending Shipment {shipment.freight_shipment_number}
              </h3>
              <div className="section-title-actions">
                {!editHeader ? (
                  <Link className="text-action" href={editHref("header")}>
                    Edit
                  </Link>
                ) : null}
                <StatusBadge tone="neutral" value={shipment.status} />
              </div>
            </div>
            {editHeader ? (
              <form
                action={updateShipmentDetailsAction}
                className="customer-form compact-form"
              >
                <input name="order_id" type="hidden" value={order.id} />
                <input name="shipment_id" type="hidden" value={shipment.id} />
                <div className="form-grid">
                  <ShipmentCarrierFields carriers={carriers ?? []} currentCarrier={shipment.carrier ?? ""} currentShippingType={shipment.shipping_type ?? ""} />
                  <ShipmentFreightFields
                    actualCost={shipment.freight_cost ?? 0}
                    masterTrackingNumber={shipment.master_tracking_number ?? ""}
                  />
                  <label className="full-width-field">
                    Internal Shipment Notes
                    <textarea
                      defaultValue={shipment.notes ?? ""}
                      name="shipment_notes"
                      rows={2}
                    />
                  </label>
                </div>
                <div className="form-actions">
                  <button className="primary-action" type="submit">
                    Save Header
                  </button>
                  <Link className="secondary-action" href={confirmationHref}>
                    Cancel
                  </Link>
                </div>
              </form>
            ) : (
              <dl className="record-details">
                <div>
                  <dt>Carrier</dt>
                  <dd>{shipment.carrier || "Not set"}</dd>
                </div>
                <div>
                  <dt>Shipping Type</dt>
                  <dd>
                    {shipment.shipping_type
                      ? label(shipment.shipping_type)
                      : "Not set"}
                  </dd>
                </div>
                <div>
                  <dt>Actual Freight Cost</dt>
                  <dd>{money(shipment.freight_cost)}</dd>
                </div>
                <div>
                  <dt>Customer Freight Charge</dt>
                  <dd>
                    {Number(packingList?.shipping_fee ?? 0) === 0
                      ? "Free Freight"
                      : money(packingList?.shipping_fee)}
                  </dd>
                </div>
                <div>
                  <dt>Master Tracking No.</dt>
                  <dd>{shipment.master_tracking_number || "Not set"}</dd>
                </div>
                <div>
                  <dt>Internal Notes</dt>
                  <dd>{shipment.notes || "None"}</dd>
                </div>
              </dl>
            )}
          </article>
          <article className="data-section">
            <div className="section-title">
              <h3>Shipping Documents</h3>
              <div className="section-title-actions">
                {!editDocuments ? (
                  <Link className="text-action" href={editHref("documents")}>
                    Edit
                  </Link>
                ) : null}
                <span>{documentsResult.data?.length ?? 0}</span>
              </div>
            </div>
            {editDocuments ? (
              <form
                action={uploadShipmentDocumentAction}
                className="attachment-upload-form"
              >
                <input name="order_id" type="hidden" value={order.id} />
                <input name="shipment_id" type="hidden" value={shipment.id} />
                <label>
                  Document
                  <input
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
                    name="shipping_document_file"
                    type="file"
                  />
                </label>
                <label>
                  Document Type
                  <select defaultValue="other" name="shipping_document_type">
                    <option value="bol">Bill of Lading (BOL)</option>
                    <option value="shipping_label">Shipping Label</option>
                    <option value="other">Other Shipping Document</option>
                  </select>
                </label>
                <button className="primary-action" type="submit">
                  Add Document
                </button>
                <Link className="secondary-action" href={confirmationHref}>
                  Cancel
                </Link>
              </form>
            ) : null}
            <div className="compact-list">
              {(documentsResult.data ?? []).length === 0 ? (
                <EmptyState text="No shipping documents were attached." />
              ) : (
                (documentsResult.data ?? []).map((document) => (
                  <div className="compact-row" key={document.id}>
                    <div>
                      <strong>{document.original_file_name}</strong>
                      <span>
                        {label(document.category ?? "shipping document")} |{" "}
                        {timestampLabel(document.uploaded_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
          <article className="data-section full-width-field">
            <div className="section-title">
              <h3>
                {packingList ? (
                  <Link
                    className="packing-list-draft-link"
                    href={`/?module=shipping-preparation-packing-list&preparation_packing_list=${packingList.id}`}
                    target="_blank"
                  >
                    Draft Packing List {packingList.packing_list_number}
                  </Link>
                ) : (
                  "Draft Packing List"
                )}
              </h3>
              {!editLines ? (
                <Link className="text-action" href={editHref("lines")}>
                  Edit
                </Link>
              ) : null}
            </div>
            {editLines && packingList ? (
              <>
                <form action={updatePendingPackingListLinesAction}>
                  <input name="order_id" type="hidden" value={order.id} />
                  <input name="shipment_id" type="hidden" value={shipment.id} />
                  <input
                    name="packing_list_id"
                    type="hidden"
                    value={packingList.id}
                  />
                  <p className="fieldset-note">
                    Adjust the total shipment quantity and the warehouse/bin
                    quantity for each box. Every required box must total the
                    same amount as Quantity to Ship.
                  </p>
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>SKU</th>
                          <th>Item</th>
                          <th>Quantity to Ship</th>
                          <th>Warehouse / Bin Picks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(packingLines ?? []).map((line) => {
                          const shipmentLine = shipmentLineByOrderLineId.get(
                            line.sales_order_line_id,
                          );
                          return (
                            <tr key={line.id}>
                              <td>{line.product_sku_snapshot}</td>
                              <td>{line.product_name_snapshot}</td>
                              <td>
                                <input
                                  defaultValue={Number(line.quantity_shipped)}
                                  min="0"
                                  name={`packing_quantity_${line.id}`}
                                  step="1"
                                  type="number"
                                />
                              </td>
                              <td>
                                {shipmentLine?.locationBalances.length ? (
                                  <details
                                    className="shipment-location-picker"
                                    open
                                  >
                                    <summary>
                                      <strong>
                                        {numberFormatter.format(
                                          shipmentLine.readyQuantity,
                                        )}{" "}
                                        available
                                      </strong>
                                      <span>Adjust locations</span>
                                    </summary>
                                    {shipmentLine.locationBalances.map(
                                      (box) => (
                                        <section
                                          className="shipment-box-picks"
                                          key={box.id}
                                        >
                                          <strong>
                                            {box.box_label === "No packing box"
                                              ? "SKU Inventory (No packing box)"
                                              : `Box ${box.box_sequence}${box.box_label ? `: ${box.box_label}` : ""}`}
                                          </strong>
                                          {box.balances.length ? (
                                            <table>
                                              <thead>
                                                <tr>
                                                  <th>Warehouse</th>
                                                  <th>Bin</th>
                                                  <th>Available</th>
                                                  <th>Pick</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {box.balances.map((balance) => (
                                                  <tr key={balance.id}>
                                                    <td>
                                                      {balance.warehouseName}
                                                    </td>
                                                    <td>
                                                      {balance.location
                                                        ?.location_code ??
                                                        "Location"}
                                                      {balance.location
                                                        ?.location_name
                                                        ? ` - ${balance.location.location_name}`
                                                        : ""}
                                                    </td>
                                                    <td>
                                                      {numberFormatter.format(
                                                        Number(
                                                          balance.quantity_available,
                                                        ),
                                                      )}
                                                    </td>
                                                    <td>
                                                      <input
                                                        defaultValue={
                                                          pickedQuantityByPackingLineAndBalance.get(
                                                            `${line.id}:${balance.id}`,
                                                          ) ?? 0
                                                        }
                                                        max={Number(
                                                          balance.quantity_available,
                                                        )}
                                                        min="0"
                                                        name={`packing_balance_${line.id}_${balance.id}`}
                                                        step="1"
                                                        type="number"
                                                      />
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          ) : (
                                            <span className="muted-copy">
                                              No inventory location is set up
                                              for this box.
                                            </span>
                                          )}
                                        </section>
                                      ),
                                    )}
                                  </details>
                                ) : (
                                  <span className="muted-copy">
                                    No regular inventory location is available.
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="form-actions">
                    <button className="primary-action" type="submit">
                      Save Selected Items
                    </button>
                    <Link className="secondary-action" href={confirmationHref}>
                      Cancel
                    </Link>
                  </div>
                </form>
                {additionalShipmentLines.length ? (
                  <form
                    action={addPendingPackingListLinesAction}
                    className="customer-form compact-form shipment-add-items-form"
                  >
                    <input name="order_id" type="hidden" value={order.id} />
                    <input
                      name="shipment_id"
                      type="hidden"
                      value={shipment.id}
                    />
                    <input
                      name="packing_list_id"
                      type="hidden"
                      value={packingList.id}
                    />
                    <fieldset>
                      <legend>Add Available Order Items</legend>
                      <p className="fieldset-note">
                        Open Available to choose the warehouse/bin and quantity
                        for an unpicked order item. Parts without packing boxes
                        are picked from their SKU inventory location.
                      </p>
                      <div className="table-wrap">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>SKU</th>
                              <th>Item</th>
                              <th>Remaining</th>
                              <th>Available</th>
                            </tr>
                          </thead>
                          <tbody>
                            {additionalShipmentLines.map((line) => (
                              <tr key={line.id}>
                                <td>{line.product_sku_snapshot}</td>
                                <td>{line.product_name_snapshot}</td>
                                <td>
                                  {numberFormatter.format(
                                    line.remainingQuantity,
                                  )}
                                </td>
                                <td>
                                  <details className="shipment-location-picker">
                                    <summary>
                                      <strong>
                                        {numberFormatter.format(
                                          line.readyQuantity,
                                        )}{" "}
                                        available
                                      </strong>
                                      <span>Pick locations</span>
                                    </summary>
                                    {line.locationBalances.map((box) => (
                                      <section
                                        className="shipment-box-picks"
                                        key={box.id}
                                      >
                                        <strong>
                                          {box.box_label === "No packing box"
                                            ? "SKU Inventory (No packing box)"
                                            : `Box ${box.box_sequence}${box.box_label ? `: ${box.box_label}` : ""}`}
                                        </strong>
                                        {box.balances.length ? (
                                          <table>
                                            <thead>
                                              <tr>
                                                <th>Warehouse</th>
                                                <th>Bin</th>
                                                <th>Available</th>
                                                <th>Pick</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {box.balances.map((balance) => (
                                                <tr key={balance.id}>
                                                  <td>
                                                    {balance.warehouseName}
                                                  </td>
                                                  <td>
                                                    {balance.location
                                                      ?.location_code ??
                                                      "Location"}
                                                    {balance.location
                                                      ?.location_name
                                                      ? ` - ${balance.location.location_name}`
                                                      : ""}
                                                  </td>
                                                  <td>
                                                    {numberFormatter.format(
                                                      Number(
                                                        balance.quantity_available,
                                                      ),
                                                    )}
                                                  </td>
                                                  <td>
                                                    <input
                                                      defaultValue="0"
                                                      max={Number(
                                                        balance.quantity_available,
                                                      )}
                                                      min="0"
                                                      name={`additional_shipment_balance_${line.id}_${balance.id}`}
                                                      step="1"
                                                      type="number"
                                                    />
                                                  </td>
                                                </tr>
                                              ))}
                                            </tbody>
                                          </table>
                                        ) : (
                                          <span className="muted-copy">
                                            No inventory location is set up for
                                            this item.
                                          </span>
                                        )}
                                      </section>
                                    ))}
                                  </details>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </fieldset>
                    <div className="form-actions">
                      <button className="primary-action" type="submit">
                        Add Selected Items
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="fieldset-note">
                    All currently available order items are already included in
                    this draft packing list.
                  </p>
                )}
              </>
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Item</th>
                      <th>Quantity to Ship</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(packingLines ?? []).map((line) => (
                      <tr key={line.id}>
                        <td>{line.product_sku_snapshot}</td>
                        <td>{line.product_name_snapshot}</td>
                        <td>
                          {numberFormatter.format(
                            Number(line.quantity_shipped),
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="fieldset-note shipment-confirmation-note">
              Before final confirmation, use Shipment Header Edit to enter both
              Carrier and Master Tracking No.
            </p>
            <form
              action={confirmPendingShipmentAction}
              className="form-actions"
            >
              <input name="order_id" type="hidden" value={order.id} />
              <input name="shipment_id" type="hidden" value={shipment.id} />
              <button className="primary-action" type="submit">
                Confirm Pending Shipment
              </button>
              <Link
                className="secondary-action"
                href="/?module=shipping&shipping_tab=ready"
              >
                Back to Shipping Queue
              </Link>
            </form>
          </article>
        </section>
      ) : null}
      {!shipment && !canCreateShipment ? (
        <EmptyState text="This order does not currently have items available to ship." />
      ) : null}
      {!shipment && canCreateShipment ? (
        <form action={createPendingShipmentAction} className="customer-form">
          <input name="order_id" type="hidden" value={order.id} />
          <fieldset>
            <legend>Shipment Header</legend>
            <div className="form-grid">
              <ShipmentCarrierFields carriers={carriers ?? []} />
              <ShipmentFreightFields />
              <label className="full-width-field">
                Internal Shipment Notes
                <textarea name="shipment_notes" rows={2} />
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Shipping Documents</legend>
            <div className="form-grid">
              <label>
                Documents
                <input
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png"
                  multiple
                  name="shipping_document_files"
                  type="file"
                />
              </label>
              <label>
                Document Type
                <select defaultValue="other" name="shipping_document_type">
                  <option value="bol">Bill of Lading (BOL)</option>
                  <option value="shipping_label">Shipping Label</option>
                  <option value="other">Other Shipping Document</option>
                </select>
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Items to Ship</legend>
            <p className="fieldset-note">
              Open Available to select the warehouse/bin and quantity for each
              required box. The same quantity must be selected for every
              required box of an item.
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Item</th>
                    <th>Ordered</th>
                    <th>Previously Shipped</th>
                    <th>Remaining</th>
                    <th>Available</th>
                  </tr>
                </thead>
                <tbody>
                  {shipmentLines.map((line) => (
                    <tr key={line.id}>
                      <td>{line.product_sku_snapshot}</td>
                      <td>{line.product_name_snapshot}</td>
                      <td>{numberFormatter.format(line.quantity_ordered)}</td>
                      <td>{numberFormatter.format(line.quantity_shipped)}</td>
                      <td>{numberFormatter.format(line.remainingQuantity)}</td>
                      <td>
                        {line.locationBalances.length ? (
                          <details className="shipment-location-picker">
                            <summary>
                              <strong>
                                {numberFormatter.format(line.readyQuantity)}{" "}
                                available
                              </strong>
                              <span>Pick locations</span>
                            </summary>
                            {line.locationBalances.map((box) => (
                              <section
                                className="shipment-box-picks"
                                key={box.id}
                              >
                                <strong>
                                  Box {box.box_sequence}
                                  {box.box_label ? `: ${box.box_label}` : ""}
                                </strong>
                                {box.balances.length ? (
                                  <table>
                                    <thead>
                                      <tr>
                                        <th>Warehouse</th>
                                        <th>Bin</th>
                                        <th>Available</th>
                                        <th>Pick</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {box.balances.map((balance) => (
                                        <tr key={balance.id}>
                                          <td>{balance.warehouseName}</td>
                                          <td>
                                            {balance.location?.location_code ??
                                              "Location"}
                                            {balance.location?.location_name
                                              ? ` - ${balance.location.location_name}`
                                              : ""}
                                          </td>
                                          <td>
                                            {numberFormatter.format(
                                              Number(
                                                balance.quantity_available,
                                              ),
                                            )}
                                          </td>
                                          <td>
                                            <input
                                              defaultValue="0"
                                              max={Number(
                                                balance.quantity_available,
                                              )}
                                              min="0"
                                              name={`shipment_balance_${line.id}_${balance.id}`}
                                              step="1"
                                              type="number"
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                ) : (
                                  <span className="muted-copy">
                                    No inventory location is set up for this
                                    box.
                                  </span>
                                )}
                              </section>
                            ))}
                          </details>
                        ) : (
                          <span>Set up packing boxes before shipping</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
          <div className="form-actions">
            <ShipmentSubmitButton />
            <Link
              className="secondary-action"
              href={`/?module=orders&order=${order.id}`}
            >
              Cancel
            </Link>
          </div>
        </form>
      ) : null}
    </section>
  );
}
