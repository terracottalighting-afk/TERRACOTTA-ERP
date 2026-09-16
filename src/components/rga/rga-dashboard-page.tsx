import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { dateLabel, label } from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function RgaDashboardPage({
  error,
  notice,
  rgaOrder,
  rgaTab,
}: {
  error?: string;
  notice?: string;
  rgaOrder?: string;
  rgaTab?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const [
    { data: rgas, error: rgasError },
    { data: scopedOrder, error: scopedOrderError },
  ] = await Promise.all([
    supabase
      .from("rga")
      .select(
        "id, rga_number, customer_account_id, customer_name_snapshot, original_customer_po_number_snapshot, sales_order_id, request_date, requested_resolution_type, approved_resolution_type, status, created_at",
      )
      .order("created_at", { ascending: false }),
    rgaOrder
      ? supabase
          .from("sales_order")
          .select("id, customer_account_id, customer_name_snapshot, customer_po_number")
          .eq("id", rgaOrder)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);
  if (rgasError) throw new Error(rgasError.message);
  if (scopedOrderError) throw new Error(scopedOrderError.message);

  const rgaIds = (rgas ?? []).map((rga) => rga.id);
  const [{ data: replacementLinks }, { data: creditMemos }] = await Promise.all([
    rgaIds.length ? supabase.from("rga_replacement_order").select("rga_id, sales_order_id").in("rga_id", rgaIds) : Promise.resolve({ data: [] }),
    rgaIds.length ? supabase.from("credit_memo").select("rga_id").in("rga_id", rgaIds) : Promise.resolve({ data: [] }),
  ]);
  const replacementOrderIds = (replacementLinks ?? []).map((link) => link.sales_order_id);
  const { data: replacementOrders } = replacementOrderIds.length ? await supabase.from("sales_order").select("id, status").in("id", replacementOrderIds) : { data: [] };
  const replacementByRga = new Map((replacementLinks ?? []).map((link) => [link.rga_id, replacementOrders?.find((order) => order.id === link.sales_order_id)]));
  const creditMemoRgaIds = new Set((creditMemos ?? []).map((memo) => memo.rga_id));
  const operationalRgas = (rgas ?? []).map((rga) => {
    if (rga.status !== "authorized") return rga;
    if (rga.approved_resolution_type === "credit") return { ...rga, status: creditMemoRgaIds.has(rga.id) ? "closed" : "waiting_for_credit_memo" };
    if (rga.approved_resolution_type === "replacement") { const replacement = replacementByRga.get(rga.id); return { ...rga, status: !replacement ? "waiting_for_replacement_order" : ["partially_shipped", "shipped", "closed"].includes(replacement.status) ? "closed" : "replacement_order_created" }; }
    return rga;
  });

  const rows = operationalRgas.filter(
    (rga) => !rgaOrder || rga.sales_order_id === rgaOrder,
  );
  const tabs = [
    { key: "pending", label: "Pending", statuses: ["draft", "pending_review"] },
    {
      key: "approved",
      label: "Approved",
      statuses: ["authorized", "awaiting_return", "received", "awaiting_credit_memo"],
    },
    {
      key: "credit-memo",
      label: "Credit Memo",
      statuses: [
        "waiting_for_credit_memo",
      ],
      solution: "credit",
    },
    {
      key: "replacement-orders",
      label: "Replacement Orders",
      statuses: [
        "waiting_for_replacement_order", "replacement_order_created",
      ],
      solution: "replacement",
    },
    {
      key: "closed",
      label: "Closed",
      statuses: ["resolved", "closed", "cancelled", "rejected"],
    },
  ];
  const selectedTab = tabs.some((tab) => tab.key === rgaTab)
    ? rgaTab!
    : "pending";
  const matchesTab = (rga: (typeof rows)[number], key: string) => {
    const tab = tabs.find((candidate) => candidate.key === key);
    return Boolean(
      tab?.statuses.includes(rga.status) &&
        (!tab.solution || rga.approved_resolution_type === tab.solution),
    );
  };
  const visibleRows = rows.filter((rga) => matchesTab(rga, selectedTab));
  const countForTab = (key: string) =>
    rows.filter((rga) => matchesTab(rga, key)).length;

  const dashboardHref = rgaOrder
    ? `/?module=rga&rga_order=${rgaOrder}`
    : "/?module=rga";

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <span className="eyebrow">RGA / Returns</span>
          <h2>{rgaOrder ? "Order RGAs" : "RGA Dashboard"}</h2>
          <p>
            {rgaOrder
              ? "RGAs related to this original sales order."
              : "Start an RGA from the original sales order so every request stays tied to shipped quantities and the customer PO."}
          </p>
          {scopedOrder ? (
            <p>
              <Link
                className="context-parent-link"
                href={`/?customer=${scopedOrder.customer_account_id}`}
              >
                {scopedOrder.customer_name_snapshot}
              </Link>{" "}
              | Original PO{" "}
              <Link
                className="table-link"
                href={`/?module=orders&order=${scopedOrder.id}`}
              >
                {scopedOrder.customer_po_number || "Open original order"}
              </Link>
            </p>
          ) : null}
        </div>
        <div className="record-hero-actions">
          <Link className="primary-action" href="/?module=orders">
            Create RGA from Order
          </Link>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {notice ? <p className="form-notice">{notice}</p> : null}
      <nav className="dashboard-tabs" aria-label="RGA queues">
        {tabs.map((tab) => (
          <Link
            className={
              selectedTab === tab.key
                ? "dashboard-tab dashboard-tab--active"
                : "dashboard-tab"
            }
            href={`${dashboardHref}&rga_tab=${tab.key}`}
            key={tab.key}
          >
            {tab.label}{" "}
            <span className="section-count">{countForTab(tab.key)}</span>
          </Link>
        ))}
      </nav>
      <section className="detail-section">
        <article className="data-section">
          <div className="section-title">
            <h3>{tabs.find((tab) => tab.key === selectedTab)?.label}</h3>
            <span className="section-count">{visibleRows.length}</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>RGA No.</th>
                  <th>Customer</th>
                  <th>Original PO</th>
                  <th>Request Date</th>
                  <th>Requested Solution</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((rga) => (
                  <tr key={rga.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?module=rga-detail&rga=${rga.id}`}
                      >
                        {rga.rga_number}
                      </Link>
                    </td>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?customer=${rga.customer_account_id}`}
                      >
                        {rga.customer_name_snapshot}
                      </Link>
                    </td>
                    <td>
                      {rga.sales_order_id ? (
                        <Link
                          className="table-link"
                          href={`/?module=orders&order=${rga.sales_order_id}`}
                        >
                          {rga.original_customer_po_number_snapshot ||
                            "Original order"}
                        </Link>
                      ) : (
                        rga.original_customer_po_number_snapshot || "Not set"
                      )}
                    </td>
                    <td>{dateLabel(rga.request_date)}</td>
                    <td>{label(rga.requested_resolution_type)}</td>
                    <td>
                      <StatusBadge
                        tone={
                          ["closed", "resolved"].includes(rga.status)
                            ? "neutral"
                            : rga.status === "pending_review"
                              ? "warn"
                              : "primary"
                        }
                        value={rga.status}
                      />
                    </td>
                  </tr>
                ))}
                {visibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No RGAs are in this queue.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </section>
  );
}
