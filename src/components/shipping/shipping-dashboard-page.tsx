import Link from "next/link";
import { EmptyState, StatusBadge } from "@/components/ui";
import {
  dateLabel,
  label,
  numberFormatter,
  timestampLabel,
} from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function ShippingDashboardPage({
  error,
  notice,
  setShippingPriorityAction,
  shippingTab,
}: {
  error?: string;
  notice?: string;
  setShippingPriorityAction: (formData: FormData) => Promise<void>;
  shippingTab?: string;
}) {
  const activeTab = ["ready", "backorders", "shipped"].includes(
    shippingTab ?? "",
  )
    ? shippingTab!
    : "ready";
  const supabase = createSupabaseAdminClient();
  const { data: orders, error: ordersError } = await supabase
    .from("sales_order")
    .select(
      "id, sales_order_number, customer_name_snapshot, customer_po_number, created_at, order_date, order_type, ship_to_display_name_snapshot, shipping_priority, status",
    )
    .in("status", ["open", "partially_shipped"])
    .in("order_type", [
      "regular",
      "display",
      "rga_replacement",
      "catalog_marketing",
    ]);
  if (ordersError) throw new Error(ordersError.message);

  const orderIds = (orders ?? []).map((order) => order.id);
  const { data: lines, error: linesError } = orderIds.length
    ? await supabase
        .from("sales_order_line")
        .select(
          "sales_order_id, product_id, product_sku_snapshot, product_name_snapshot, quantity_ordered, quantity_shipped, quantity_cancelled, quantity_cleared",
        )
        .in("sales_order_id", orderIds)
    : { data: [], error: null };
  if (linesError) throw new Error(linesError.message);

  const productIds = [...new Set((lines ?? []).map((line) => line.product_id))];
  const { data: inventory, error: inventoryError } = productIds.length
    ? await supabase
        .from("inventory_sku_summary")
        .select("product_id, sellable_quantity")
        .in("product_id", productIds)
    : { data: [], error: null };
  if (inventoryError) throw new Error(inventoryError.message);

  const { data: incoming, error: incomingError } = productIds.length
    ? await supabase
        .from("incoming_inventory")
        .select(
          "product_id, expected_quantity, received_quantity, pre_allocated_quantity, expected_date",
        )
        .in("product_id", productIds)
    : { data: [], error: null };
  if (incomingError) throw new Error(incomingError.message);

  const { data: shippedOrders, error: shippedOrdersError } = await supabase
    .from("sales_order")
    .select(
      "id, sales_order_number, customer_name_snapshot, customer_po_number, created_at, order_date, order_type, ship_to_display_name_snapshot, status",
    )
    .in("status", ["partially_shipped", "shipped", "closed"])
    .in("order_type", [
      "regular",
      "display",
      "rga_replacement",
      "catalog_marketing",
    ])
    .order("updated_at", { ascending: false })
    .limit(100);
  if (shippedOrdersError) throw new Error(shippedOrdersError.message);

  const availableByProduct = new Map(
    (inventory ?? []).map((item) => [
      item.product_id,
      Number(item.sellable_quantity ?? 0),
    ]),
  );
  const incomingByProduct = new Map<
    string,
    { quantity: number; eta: string | null }
  >();
  for (const item of incoming ?? []) {
    const existing = incomingByProduct.get(item.product_id) ?? {
      quantity: 0,
      eta: null,
    };
    const quantity = Math.max(
      0,
      Number(item.expected_quantity ?? 0) -
        Number(item.received_quantity ?? 0) -
        Number(item.pre_allocated_quantity ?? 0),
    );
    incomingByProduct.set(item.product_id, {
      quantity: existing.quantity + quantity,
      eta:
        !existing.eta ||
        (item.expected_date && item.expected_date < existing.eta)
          ? item.expected_date
          : existing.eta,
    });
  }
  const queueRows = (orders ?? [])
    .map((order) => {
      const orderLines = (lines ?? []).filter(
        (line) => line.sales_order_id === order.id,
      );
      const orderedQuantity = orderLines.reduce(
        (sum, line) => sum + Number(line.quantity_ordered ?? 0),
        0,
      );
      const remainingQuantity = orderLines.reduce(
        (sum, line) =>
          sum +
          Math.max(
            0,
            Number(line.quantity_ordered ?? 0) -
              Number(line.quantity_shipped ?? 0) -
              Number(line.quantity_cancelled ?? 0) -
              Number(line.quantity_cleared ?? 0),
          ),
        0,
      );
      const readyQuantity = orderLines.reduce((sum, line) => {
        const remaining = Math.max(
          0,
          Number(line.quantity_ordered ?? 0) -
            Number(line.quantity_shipped ?? 0) -
            Number(line.quantity_cancelled ?? 0) -
            Number(line.quantity_cleared ?? 0),
        );
        return (
          sum +
          Math.min(remaining, availableByProduct.get(line.product_id) ?? 0)
        );
      }, 0);
      return { ...order, orderedQuantity, readyQuantity, remainingQuantity };
    })
    .filter((order) => order.readyQuantity > 0)
    .sort((left, right) => {
      const priorityDifference =
        Number(right.shipping_priority === "highest") -
        Number(left.shipping_priority === "highest");
      return (
        priorityDifference ||
        String(left.created_at).localeCompare(String(right.created_at))
      );
    });

  const orderById = new Map((orders ?? []).map((order) => [order.id, order]));
  const backorderRows = (lines ?? [])
    .map((line) => {
      const remaining = Math.max(
        0,
        Number(line.quantity_ordered ?? 0) -
          Number(line.quantity_shipped ?? 0) -
          Number(line.quantity_cancelled ?? 0) -
          Number(line.quantity_cleared ?? 0),
      );
      const available = availableByProduct.get(line.product_id) ?? 0;
      const incomingItem = incomingByProduct.get(line.product_id) ?? {
        quantity: 0,
        eta: null,
      };
      return {
        ...line,
        available,
        backorderQuantity: Math.max(0, remaining - available),
        incomingQuantity: incomingItem.quantity,
        eta: incomingItem.eta,
        order: orderById.get(line.sales_order_id),
      };
    })
    .filter((line) => line.order && line.backorderQuantity > 0)
    .sort((left, right) =>
      String(left.order?.created_at).localeCompare(
        String(right.order?.created_at),
      ),
    );

  return (
    <section className="dashboard-panel">
      <section className="list-header">
        <div>
          <span className="eyebrow">Warehouse Shipping</span>
          <h2>Shipping Dashboard</h2>
          <p>
            All customer orders across the ERP. Highest priority ready orders
            appear first, then the oldest orders.
          </p>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {notice ? <p className="form-notice">{notice}</p> : null}
      <nav
        className="tab-strip shipping-dashboard-tabs"
        aria-label="Shipping dashboard views"
      >
        <Link
          aria-current={activeTab === "ready" ? "page" : undefined}
          href="/?module=shipping&shipping_tab=ready"
        >
          Ready to Ship
        </Link>
        <Link
          aria-current={activeTab === "backorders" ? "page" : undefined}
          href="/?module=shipping&shipping_tab=backorders"
        >
          Backorders
        </Link>
        <Link
          aria-current={activeTab === "shipped" ? "page" : undefined}
          href="/?module=shipping&shipping_tab=shipped"
        >
          Shipped Orders
        </Link>
      </nav>
      {activeTab === "ready" ? (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Sales Order</th>
                  <th>Customer</th>
                  <th>Customer PO</th>
                  <th>Ship-to</th>
                  <th>Order Date / Time</th>
                  <th>Type</th>
                  <th>Ordered</th>
                  <th>Ready to Ship</th>
                  <th>Status</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {queueRows.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <StatusBadge
                        tone={
                          order.shipping_priority === "highest"
                            ? "warn"
                            : "neutral"
                        }
                        value={
                          order.shipping_priority === "highest"
                            ? "Highest"
                            : "Normal"
                        }
                      />
                    </td>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?module=orders&order=${order.id}`}
                      >
                        {order.sales_order_number}
                      </Link>
                    </td>
                    <td>{order.customer_name_snapshot}</td>
                    <td>{order.customer_po_number}</td>
                    <td>{order.ship_to_display_name_snapshot}</td>
                    <td>{timestampLabel(order.created_at)}</td>
                    <td>{label(order.order_type)}</td>
                    <td>{numberFormatter.format(order.orderedQuantity)}</td>
                    <td>
                      <strong>
                        {numberFormatter.format(order.readyQuantity)}
                      </strong>
                    </td>
                    <td>
                      <StatusBadge tone="good" value={order.status} />
                    </td>
                    <td>
                      <form action={setShippingPriorityAction}>
                        <input name="order_id" type="hidden" value={order.id} />
                        <input
                          name="shipping_priority"
                          type="hidden"
                          value={
                            order.shipping_priority === "highest"
                              ? "normal"
                              : "highest"
                          }
                        />
                        <button
                          className="text-action text-action--button"
                          type="submit"
                        >
                          {order.shipping_priority === "highest"
                            ? "Set Normal"
                            : "Set Highest"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {queueRows.length === 0 ? (
                  <tr>
                    <td colSpan={11}>
                      <EmptyState text="No orders currently have items ready to ship." />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="open-order-summary">
            Orders in queue:{" "}
            <strong>{numberFormatter.format(queueRows.length)}</strong> |
            Highest priority:{" "}
            <strong>
              {numberFormatter.format(
                queueRows.filter(
                  (order) => order.shipping_priority === "highest",
                ).length,
              )}
            </strong>
          </p>
        </>
      ) : null}
      {activeTab === "backorders" ? (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sales Order</th>
                  <th>Customer</th>
                  <th>SKU</th>
                  <th>Item</th>
                  <th>Backordered</th>
                  <th>In Hand</th>
                  <th>Incoming</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {backorderRows.map((line) => (
                  <tr key={`${line.sales_order_id}-${line.product_id}`}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?module=orders&order=${line.order!.id}`}
                      >
                        {line.order!.sales_order_number}
                      </Link>
                    </td>
                    <td>{line.order!.customer_name_snapshot}</td>
                    <td>{line.product_sku_snapshot}</td>
                    <td>{line.product_name_snapshot}</td>
                    <td>
                      <strong>
                        {numberFormatter.format(line.backorderQuantity)}
                      </strong>
                    </td>
                    <td>{numberFormatter.format(line.available)}</td>
                    <td>{numberFormatter.format(line.incomingQuantity)}</td>
                    <td>{dateLabel(line.eta)}</td>
                  </tr>
                ))}
                {backorderRows.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState text="No current backorders." />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="open-order-summary">
            Backordered line items:{" "}
            <strong>{numberFormatter.format(backorderRows.length)}</strong> |
            Total backordered quantity:{" "}
            <strong>
              {numberFormatter.format(
                backorderRows.reduce(
                  (sum, line) => sum + line.backorderQuantity,
                  0,
                ),
              )}
            </strong>
          </p>
        </>
      ) : null}
      {activeTab === "shipped" ? (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sales Order</th>
                  <th>Customer</th>
                  <th>Customer PO</th>
                  <th>Ship-to</th>
                  <th>Order Date</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(shippedOrders ?? []).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?module=orders&order=${order.id}`}
                      >
                        {order.sales_order_number}
                      </Link>
                    </td>
                    <td>{order.customer_name_snapshot}</td>
                    <td>{order.customer_po_number}</td>
                    <td>{order.ship_to_display_name_snapshot}</td>
                    <td>{dateLabel(order.order_date)}</td>
                    <td>{label(order.order_type)}</td>
                    <td>
                      <StatusBadge tone="good" value={order.status} />
                    </td>
                  </tr>
                ))}
                {(shippedOrders ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState text="No shipped orders found." />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="open-order-summary">
            Orders with shipments:{" "}
            <strong>
              {numberFormatter.format((shippedOrders ?? []).length)}
            </strong>
          </p>
        </>
      ) : null}
    </section>
  );
}
