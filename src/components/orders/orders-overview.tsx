import Link from "next/link";
import { EmptyState, ModulePlaceholder, StatusBadge } from "@/components/ui";
import { dateLabel, label, money, numberFormatter } from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OrderPartOption, OrderProductOption, OrderShipToOption } from "./order-entry-form";
import { EditOrderPage } from "./edit-order-page";
import { OrderDetailPage } from "./order-detail-page";
import { OrdersOverviewControls } from "./orders-overview-controls";

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
  sales_rep_agency_id_snapshot: string | null;
  sales_rep_id_snapshot: string | null;
  ship_to_display_name_snapshot: string;
  ship_to_snapshot_json: Record<string, unknown>;
  shipping_priority: string;
  status: string;
  territory_id_snapshot: string | null;
  total_amount: number;
};

type OrderAddressOption = OrderShipToOption & {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  email: string | null;
  postalCode: string | null;
  stateProvince: string | null;
};

type SelectOption = {
  id: string;
  name: string;
};

type RepOption = SelectOption & {
  agency_id: string;
  agency_name: string;
};

type OrderEntryData = {
  customer: {
    default_discount_percent: number | null;
  };
  partOptions: OrderPartOption[];
  products: OrderProductOption[];
};

type ShippingQuantity = { shipped: number; total: number };

function shippingStatus(value: ShippingQuantity, shipmentInProgress = false) {
  const shipped = Number(value?.shipped ?? 0);
  const total = Number(value?.total ?? 0);
  if (shipmentInProgress) return { tone: "primary" as const, value: "In Progress" };
  if (total > 0 && shipped >= total) return { tone: "good" as const, value: "Shipped" };
  if (shipped > 0) return { tone: "warn" as const, value: "Partially Shipped" };
  return { tone: "danger" as const, value: "Not Shipped" };
}

function orderLifecycleStatus(status: string) {
  if (status === "closed" || status === "shipped") return { tone: "good" as const, value: status };
  if (status === "hold" || status === "pending") return { tone: "warn" as const, value: status };
  if (status === "cancelled" || status === "void" || status === "deleted") return { tone: "danger" as const, value: status };
  return { tone: "primary" as const, value: status };
}

export async function OrdersOverview({
  convertQuoteToOrderAction,
  error,
  loadOrder,
  loadOrderEntryData,
  loadSalesRepOptions,
  loadTerritoryOptions,
  notice,
  orderAction,
  orderAdvanced,
  orderCustomer,
  orderCustomerName,
  orderDateFrom,
  orderDateTo,
  orderDir,
  orderId,
  orderPage,
  orderPageSize,
  orderQuery,
  orderReady,
  orderRep,
  orderSku,
  orderSort,
  orderStatus,
  orderTerritory,
  quoteMode = false,
  returnCustomerId,
  updateSalesOrderAction,
}: {
  convertQuoteToOrderAction: (formData: FormData) => Promise<void>;
  error?: string;
  loadOrder: (orderId: string) => Promise<SalesOrderDetail | null>;
  loadOrderEntryData: (customerId: string) => Promise<OrderEntryData | null>;
  loadSalesRepOptions: () => Promise<RepOption[]>;
  loadTerritoryOptions: () => Promise<SelectOption[]>;
  notice?: string;
  orderAction?: string;
  orderAdvanced?: string;
  orderCustomer?: string;
  orderCustomerName?: string;
  orderDateFrom?: string;
  orderDateTo?: string;
  orderDir?: string;
  orderId?: string;
  orderPage?: string;
  orderPageSize?: string;
  orderQuery?: string;
  orderReady?: string;
  orderRep?: string;
  orderSku?: string;
  orderSort?: string;
  orderStatus?: string;
  orderTerritory?: string;
  quoteMode?: boolean;
  returnCustomerId?: string;
  updateSalesOrderAction: (formData: FormData) => Promise<void>;
}) {
  const supabase = createSupabaseAdminClient();
  if (orderId) {
    const order = await loadOrder(orderId);
    if (!order) return <ModulePlaceholder moduleName="Order not found" />;
    if (orderAction === "edit") {
      const [orderEntryData, locationsResult, salesRepOptions, territoryOptions] = await Promise.all([
        loadOrderEntryData(order.customer_account_id),
        supabase
          .from("customer_location")
          .select(
            "id, location_name, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, email, is_billing_address, is_default_ship_to, is_shipping_address",
          )
          .eq("customer_account_id", order.customer_account_id)
          .eq("status", "active")
          .order("location_name", { ascending: true }),
        loadSalesRepOptions(),
        loadTerritoryOptions(),
      ]);
      if (locationsResult.error) throw new Error(locationsResult.error.message);
      const addressOptions: OrderAddressOption[] = (locationsResult.data ?? []).map((location) => ({
        address: [location.address_line_1, location.address_line_2, location.city, location.state_province, location.postal_code, location.country]
          .filter(Boolean)
          .join(", "),
        addressLine1: location.address_line_1,
        addressLine2: location.address_line_2,
        city: location.city,
        country: location.country,
        countryCode: location.country_code,
        email: location.email,
        id: location.id,
        isDefault: location.is_default_ship_to,
        name: location.location_name,
        postalCode: location.postal_code,
        stateProvince: location.state_province,
      }));
      return (
        <EditOrderPage
          billingAddressOptions={addressOptions.filter(
            (location) => (locationsResult.data ?? []).find((item) => item.id === location.id)?.is_billing_address,
          )}
          defaultDiscountPercent={Number(orderEntryData?.customer.default_discount_percent ?? 0)}
          error={error}
          order={order}
          parts={orderEntryData?.partOptions ?? []}
          products={orderEntryData?.products ?? []}
          salesRepOptions={salesRepOptions}
          shipToOptions={addressOptions.filter(
            (location) => (locationsResult.data ?? []).find((item) => item.id === location.id)?.is_shipping_address,
          )}
          territoryOptions={territoryOptions}
          updateAction={updateSalesOrderAction}
        />
      );
    }
    return <OrderDetailPage convertQuoteToOrderAction={convertQuoteToOrderAction} order={order} returnCustomerId={returnCustomerId} />;
  }

  let ordersQuery = supabase
    .from("sales_order")
    .select(
      "id, customer_account_id, sales_order_number, customer_po_number, customer_name_snapshot, order_date, created_at, order_source, order_type, status, shipping_readiness_status, credit_hold_status, sales_rep_id_snapshot, territory_id_snapshot, total_amount",
    );
  if (orderStatus !== "deleted") ordersQuery = ordersQuery.neq("status", "deleted");
  if (orderStatus)
    ordersQuery = ordersQuery.eq(
      "status",
      orderStatus as "open" | "closed" | "deleted" | "draft" | "cancelled" | "shipped" | "partially_shipped" | "pending" | "hold" | "void",
    );
  if (orderCustomer) ordersQuery = ordersQuery.eq("customer_account_id", orderCustomer);
  if (orderDateFrom) ordersQuery = ordersQuery.gte("order_date", orderDateFrom);
  if (orderDateTo) ordersQuery = ordersQuery.lte("order_date", orderDateTo);
  const { data, error: ordersError } = await ordersQuery.order("order_date", { ascending: false }).limit(100);
  if (ordersError) throw new Error(ordersError.message);

  const backToCustomerId = orderCustomer ?? null;
  const orderIds = (data ?? []).map((order) => order.id);
  const orderLinesResult = orderIds.length
    ? await supabase
        .from("sales_order_line")
        .select("sales_order_id, product_id, product_sku_snapshot, quantity_ordered, quantity_shipped, quantity_cancelled, quantity_cleared")
        .in("sales_order_id", orderIds)
    : { data: [], error: null };
  if (orderLinesResult.error) throw new Error(orderLinesResult.error.message);

  const { data: orderPackingLists, error: orderPackingListsError } = orderIds.length
    ? await supabase.from("packing_list").select("sales_order_id, freight_shipment_id").in("sales_order_id", orderIds).not("freight_shipment_id", "is", null)
    : { data: [], error: null };
  if (orderPackingListsError) throw new Error(orderPackingListsError.message);
  const shipmentIds = [...new Set((orderPackingLists ?? []).map((packingList) => packingList.freight_shipment_id).filter(Boolean))];
  const { data: pendingShipments, error: pendingShipmentsError } = shipmentIds.length
    ? await supabase.from("freight_shipment").select("id").in("id", shipmentIds).in("status", ["pending", "in_progress"])
    : { data: [], error: null };
  if (pendingShipmentsError) throw new Error(pendingShipmentsError.message);
  const pendingShipmentIds = new Set((pendingShipments ?? []).map((shipment) => shipment.id));
  const shippingInProgressOrderIds = new Set(
    (orderPackingLists ?? [])
      .filter((packingList) => packingList.freight_shipment_id && pendingShipmentIds.has(packingList.freight_shipment_id))
      .map((packingList) => packingList.sales_order_id),
  );

  const orderProductIds = [...new Set((orderLinesResult.data ?? []).map((line) => line.product_id))];
  const inventoryResult = orderProductIds.length
    ? await supabase.from("inventory_sku_summary").select("product_id, sellable_quantity, next_incoming_eta").in("product_id", orderProductIds)
    : { data: [], error: null };
  if (inventoryResult.error) throw new Error(inventoryResult.error.message);
  const inventoryByProduct = new Map((inventoryResult.data ?? []).map((item) => [item.product_id, item]));
  const orderShipping = new Map<string, { backorders: number; nextEta: string | null; ordered: number; readyToShip: number }>();
  for (const orderId of orderIds) {
    const lines = (orderLinesResult.data ?? []).filter((line) => line.sales_order_id === orderId);
    const ordered = lines.reduce((sum, line) => sum + Number(line.quantity_ordered ?? 0), 0);
    let backorders = 0;
    let readyToShip = 0;
    let nextEta: string | null = null;
    for (const line of lines) {
      const remaining = Math.max(
        0,
        Number(line.quantity_ordered ?? 0) -
          Number(line.quantity_shipped ?? 0) -
          Number(line.quantity_cancelled ?? 0) -
          Number(line.quantity_cleared ?? 0),
      );
      const inventory = inventoryByProduct.get(line.product_id);
      const available = Number(inventory?.sellable_quantity ?? 0);
      readyToShip += Math.min(remaining, available);
      backorders += Math.max(0, remaining - available);
      if (remaining > available && inventory?.next_incoming_eta && (!nextEta || inventory.next_incoming_eta < nextEta)) {
        nextEta = inventory.next_incoming_eta;
      }
    }
    orderShipping.set(orderId, { backorders, nextEta, ordered, readyToShip });
  }
  const [territoryResult, repResult] = await Promise.all([
    orderTerritory ? supabase.from("territory").select("id, name") : Promise.resolve({ data: [], error: null }),
    orderRep ? supabase.from("sales_rep").select("id, name") : Promise.resolve({ data: [], error: null }),
  ]);
  if (territoryResult.error) throw new Error(territoryResult.error.message);
  if (repResult.error) throw new Error(repResult.error.message);
  const territoryQuery = (orderTerritory ?? "").trim().toLowerCase();
  const repQuery = (orderRep ?? "").trim().toLowerCase();
  const territoryIds = new Set(
    (territoryResult.data ?? [])
      .filter((territory) => territory.name.toLowerCase().includes(territoryQuery) || territory.id.toLowerCase().includes(territoryQuery))
      .map((territory) => territory.id),
  );
  const repIds = new Set(
    (repResult.data ?? [])
      .filter((rep) => rep.name.toLowerCase().includes(repQuery) || rep.id.toLowerCase().includes(repQuery))
      .map((rep) => rep.id),
  );
  const quickSearch = (orderCustomerName ?? "").trim().toLowerCase();
  const orderSearch = (orderSku ?? "").trim().toLowerCase();
  const quickQuery = (orderQuery ?? "").trim().toLowerCase();
  const allOrders = (data ?? []).filter((order) => {
    const matchesQuoteMode = quoteMode ? order.order_type === "quote" : order.order_type !== "quote";
    const matchesReady = orderReady !== "true" || (orderShipping.get(order.id)?.readyToShip ?? 0) > 0;
    const matchesCustomer = !quickSearch || order.customer_name_snapshot.toLowerCase().includes(quickSearch);
    const matchesSku =
      !orderSearch ||
      (orderLinesResult.data ?? []).some(
        (line) => line.sales_order_id === order.id && String(line.product_sku_snapshot ?? "").toLowerCase().includes(orderSearch),
      );
    const matchesQuick =
      !quickQuery ||
      [order.sales_order_number, order.customer_po_number, order.customer_name_snapshot].some((value) =>
        String(value ?? "").toLowerCase().includes(quickQuery),
      ) ||
      (orderLinesResult.data ?? []).some(
        (line) => line.sales_order_id === order.id && String(line.product_sku_snapshot ?? "").toLowerCase().includes(quickQuery),
      );
    const matchesTerritory = !territoryQuery || territoryIds.has(String(order.territory_id_snapshot ?? ""));
    const matchesRep = !repQuery || repIds.has(String(order.sales_rep_id_snapshot ?? ""));
    return matchesQuoteMode && matchesReady && matchesCustomer && matchesSku && matchesQuick && matchesTerritory && matchesRep;
  });
  const activeSort = orderSort === "order_date" || orderSort === "ready_to_ship" ? orderSort : "priority";
  const activeDirection = orderDir === "asc" ? "asc" : "desc";
  const sortedOrders = [...allOrders].sort((left, right) => {
    if (activeSort === "order_date") {
      const comparison = left.order_date.localeCompare(right.order_date);
      return activeDirection === "asc" ? comparison : -comparison;
    }
    if (activeSort === "ready_to_ship") {
      const comparison = (orderShipping.get(left.id)?.readyToShip ?? 0) - (orderShipping.get(right.id)?.readyToShip ?? 0);
      if (comparison !== 0) return activeDirection === "asc" ? comparison : -comparison;
      return left.order_date.localeCompare(right.order_date);
    }
    const leftReady = (orderShipping.get(left.id)?.readyToShip ?? 0) > 0 ? 1 : 0;
    const rightReady = (orderShipping.get(right.id)?.readyToShip ?? 0) > 0 ? 1 : 0;
    if (leftReady !== rightReady) return rightReady - leftReady;
    return left.order_date.localeCompare(right.order_date);
  });
  const pageSize = [10, 20, 30].includes(Number(orderPageSize)) ? Number(orderPageSize) : 10;
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize));
  const currentPage = Math.min(totalPages, Math.max(1, Number(orderPage ?? 1) || 1));
  const pageOrders = sortedOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const openOrderTotal = allOrders.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0);
  const readyOrderCount = allOrders.filter((order) => (orderShipping.get(order.id)?.readyToShip ?? 0) > 0).length;
  const orderFilterParams = [
    orderStatus ? `order_status=${encodeURIComponent(orderStatus)}` : "",
    orderCustomer ? `order_customer=${encodeURIComponent(orderCustomer)}` : "",
    orderReady === "true" ? "order_ready=true" : "",
    orderPageSize ? `order_page_size=${pageSize}` : "",
    orderQuery ? `order_q=${encodeURIComponent(orderQuery)}` : "",
    orderCustomerName ? `order_customer_name=${encodeURIComponent(orderCustomerName)}` : "",
    orderDateFrom ? `order_date_from=${encodeURIComponent(orderDateFrom)}` : "",
    orderDateTo ? `order_date_to=${encodeURIComponent(orderDateTo)}` : "",
    orderSku ? `order_sku=${encodeURIComponent(orderSku)}` : "",
    orderTerritory ? `order_territory=${encodeURIComponent(orderTerritory)}` : "",
    orderRep ? `order_rep=${encodeURIComponent(orderRep)}` : "",
  ]
    .filter(Boolean)
    .join("&");
  const moduleKey = quoteMode ? "quotes" : "orders";
  const pageHref = (page: number) =>
    `/?module=${moduleKey}${orderFilterParams ? `&${orderFilterParams}` : ""}&order_page=${page}&order_sort=${activeSort}&order_dir=${activeDirection}`;
  const sortHref = (sort: "order_date" | "ready_to_ship") => {
    const nextDirection = activeSort === sort && activeDirection === "asc" ? "desc" : "asc";
    return `/?module=${moduleKey}${orderFilterParams ? `&${orderFilterParams}` : ""}&order_page=1&order_sort=${sort}&order_dir=${nextDirection}`;
  };

  return (
    <section className="dashboard-panel">
      <section className="list-header-panel list-header-panel--compact">
        <div>
          {backToCustomerId ? (
            <Link className="context-parent-link" href={`/?customer=${backToCustomerId}`}>
              Back to Dashboard
            </Link>
          ) : null}
          {backToCustomerId ? (
            <span className="orders-context-customer">{data?.[0]?.customer_name_snapshot}</span>
          ) : (
            <Link className="context-parent-link" href="/">
              ERP Dashboard
            </Link>
          )}
          <h2>
            {quoteMode ? "Quotes" : orderReady === "true" ? "Ready to Ship Orders" : orderStatus === "open" ? "Open Orders" : "Orders"}
          </h2>
        </div>
      </section>
      {notice ? <p className="form-alert form-alert--success">{notice}</p> : null}
      <OrdersOverviewControls
        advanced={
          orderAdvanced === "true" ||
          Boolean(orderCustomerName || orderDateFrom || orderDateTo || orderSku || orderTerritory || orderRep || orderStatus)
        }
        moduleKey={moduleKey}
        pageSize={pageSize}
        values={{
          q: orderQuery ?? "",
          dateFrom: orderDateFrom ?? "",
          dateTo: orderDateTo ?? "",
          customer: orderCustomerName ?? "",
          sku: orderSku ?? "",
          territory: orderTerritory ?? "",
          rep: orderRep ?? "",
          status: orderStatus ?? "",
        }}
      />
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sales Order</th>
              <th>Customer PO</th>
              {!orderCustomer ? <th>Customer</th> : null}
              <th>
                <Link className="table-link" href={sortHref("order_date")}>
                  Order Date {activeSort === "order_date" ? (activeDirection === "asc" ? "↑" : "↓") : "↕"}
                </Link>
              </th>
              <th>Source</th>
              <th>Type</th>
              <th>Ordered</th>
              <th>
                <Link className="table-link" href={sortHref("ready_to_ship")}>
                  Ready to Ship {activeSort === "ready_to_ship" ? (activeDirection === "asc" ? "↑" : "↓") : "↕"}
                </Link>
              </th>
              <th>Backorders</th>
              <th>Total</th>
              <th>Shipping Status</th>
              <th>Order Status</th>
            </tr>
          </thead>
          <tbody>
            {pageOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link className="table-link" href={`/?module=orders&order=${order.id}`}>
                    {order.sales_order_number}
                  </Link>
                </td>
                <td>{order.customer_po_number}</td>
                {!orderCustomer ? <td>{order.customer_name_snapshot}</td> : null}
                <td>{order.order_date}</td>
                <td>{label(order.order_source)}</td>
                <td>{label(order.order_type)}</td>
                <td>{numberFormatter.format(orderShipping.get(order.id)?.ordered ?? 0)}</td>
                <td>{numberFormatter.format(orderShipping.get(order.id)?.readyToShip ?? 0)}</td>
                <td>
                  {(orderShipping.get(order.id)?.backorders ?? 0) > 0
                    ? `${numberFormatter.format(orderShipping.get(order.id)?.backorders ?? 0)} : ${dateLabel(orderShipping.get(order.id)?.nextEta)}`
                    : "No B/O"}
                </td>
                <td>{money(Number(order.total_amount ?? 0))}</td>
                <td>
                  <StatusBadge
                    {...shippingStatus(
                      {
                        shipped: (orderLinesResult.data ?? [])
                          .filter((line) => line.sales_order_id === order.id)
                          .reduce((sum, line) => sum + Number(line.quantity_shipped ?? 0), 0),
                        total: orderShipping.get(order.id)?.ordered ?? 0,
                      },
                      shippingInProgressOrderIds.has(order.id),
                    )}
                  />
                </td>
                <td>
                  <StatusBadge {...orderLifecycleStatus(order.status)} />
                </td>
              </tr>
            ))}
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan={orderCustomer ? 11 : 12}>
                  <EmptyState text="No orders have been entered yet." />
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {totalPages > 1 ? (
        <nav className="pagination" aria-label="Open order pages">
          <Link className="secondary-action" href={pageHref(1)}>
            First
          </Link>
          <Link className="secondary-action" href={pageHref(Math.max(1, currentPage - 1))}>
            Previous
          </Link>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Link
              aria-current={page === currentPage ? "page" : undefined}
              className={page === currentPage ? "pagination-link pagination-link--active" : "pagination-link"}
              href={pageHref(page)}
              key={page}
            >
              {page}
            </Link>
          ))}
          <Link className="secondary-action" href={pageHref(Math.min(totalPages, currentPage + 1))}>
            Next
          </Link>
          <Link className="secondary-action" href={pageHref(totalPages)}>
            Last
          </Link>
        </nav>
      ) : null}
      <p className="open-order-summary">
        {quoteMode ? "Total quotes" : "Total open orders"}: <strong>{numberFormatter.format(allOrders.length)}</strong> | Total amount:{" "}
        <strong>{money(openOrderTotal)}</strong>
        {quoteMode ? null : (
          <>
            {" "}
            | Ready to ship orders: <strong>{numberFormatter.format(readyOrderCount)}</strong>
          </>
        )}
      </p>
    </section>
  );
}
