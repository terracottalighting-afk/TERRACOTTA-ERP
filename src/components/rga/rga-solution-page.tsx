import Link from "next/link";
import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { label, numberFormatter } from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function RgaSolutionPage({
  createReplacementOrderAction,
  error,
  issueCreditMemoAction,
  notice,
  rgaId,
}: {
  createReplacementOrderAction: (formData: FormData) => Promise<void>;
  error?: string;
  issueCreditMemoAction: (formData: FormData) => Promise<void>;
  notice?: string;
  rgaId?: string;
}) {
  if (!rgaId) return <ModulePlaceholder moduleName="Select an approved RGA" />;

  const supabase = createSupabaseAdminClient();
  const [rgaResult, linesResult] = await Promise.all([
    supabase
      .from("rga")
      .select(
        "id, rga_number, customer_account_id, customer_name_snapshot, original_customer_po_number_snapshot, sales_order_id, status, approved_resolution_type",
      )
      .eq("id", rgaId)
      .maybeSingle(),
    supabase
      .from("rga_line")
      .select(
        "id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_authorized, quantity_credited, quantity_replaced, status",
      )
      .eq("rga_id", rgaId)
      .order("product_sku_snapshot"),
  ]);
  if (rgaResult.error) throw new Error(rgaResult.error.message);
  if (linesResult.error) throw new Error(linesResult.error.message);
  if (!rgaResult.data) return <ModulePlaceholder moduleName="RGA not found" />;

  const rga = rgaResult.data;
  const lines = linesResult.data ?? [];
  const isApproved = [
    "authorized",
    "awaiting_return",
    "received",
    "awaiting_credit_memo",
    "resolved",
    "closed",
  ].includes(rga.status);
  const approvedSolution = rga.approved_resolution_type;
  const [
    { data: replacementOrder, error: replacementOrderError },
    { data: creditMemo, error: creditMemoError },
  ] = await Promise.all([
    supabase
      .from("sales_order")
      .select("id, sales_order_number, created_at")
      .eq("order_type", "rga_replacement")
      .ilike("notes", `%${rga.rga_number}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("credit_memo")
      .select("id, credit_memo_number, created_at")
      .eq("rga_id", rga.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  if (replacementOrderError) throw new Error(replacementOrderError.message);
  if (creditMemoError) throw new Error(creditMemoError.message);

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="context-parent-link"
            href={`/?module=rga-detail&rga=${rga.id}`}
          >
            Back to RGA
          </Link>
          <div className="record-title-row">
            <h2>RGA Solution</h2>
            <StatusBadge
              tone={isApproved ? "primary" : "warn"}
              value={rga.status}
            />
          </div>
          <p>
            <strong>{rga.rga_number}</strong> |{" "}
            <Link
              className="context-parent-link"
              href={`/?customer=${rga.customer_account_id}`}
            >
              {rga.customer_name_snapshot}
            </Link>{" "}
            | Original PO{" "}
            {rga.sales_order_id ? (
              <Link
                className="table-link"
                href={`/?module=orders&order=${rga.sales_order_id}`}
              >
                {rga.original_customer_po_number_snapshot || "Open order"}
              </Link>
            ) : (
              rga.original_customer_po_number_snapshot || "Not set"
            )}
          </p>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {notice ? <p className="form-notice">{notice}</p> : null}
      <section className="detail-section">
        <article className="info-panel">
          <h3>Solution Record</h3>
          <dl className="detail-list">
            {replacementOrder ? (
              <div>
                <dt>Replacement Order</dt>
                <dd>
                  <Link
                    className="table-link"
                    href={`/?module=orders&order=${replacementOrder.id}`}
                  >
                    {replacementOrder.sales_order_number}
                  </Link>
                </dd>
              </div>
            ) : null}
            {creditMemo ? (
              <div>
                <dt>Credit Memo</dt>
                <dd>
                  <Link
                    className="table-link"
                    href={`/?customer=${rga.customer_account_id}&tab=credit-memo`}
                  >
                    {creditMemo.credit_memo_number}
                  </Link>
                </dd>
              </div>
            ) : null}
            {!replacementOrder && !creditMemo ? (
              <div>
                <dt>Solution</dt>
                <dd>Not created yet</dd>
              </div>
            ) : null}
          </dl>
        </article>
      </section>
      <section className="detail-section">
        <article className="info-panel">
          <h3>Approved Resolution</h3>
          <dl className="detail-list">
            <div>
              <dt>Solution</dt>
              <dd>
                {approvedSolution ? label(approvedSolution) : "Not approved"}
              </dd>
            </div>
            <div>
              <dt>Workflow Status</dt>
              <dd>{label(rga.status)}</dd>
            </div>
          </dl>
          {!isApproved || !approvedSolution ? (
            <p className="empty-state">
              This RGA must be approved with a solution before a credit memo or
              replacement order can be created.
            </p>
          ) : null}
        </article>
        <article className="info-panel">
          <h3>Solution Status</h3>
          {!isApproved || !approvedSolution ? (
            <p className="empty-state">
              The RGA is still waiting for approval. Once a solution is
              approved, its credit or replacement progress will appear here.
            </p>
          ) : null}
          {isApproved && approvedSolution === "credit" ? (
            <form action={issueCreditMemoAction} className="form-actions">
              <input type="hidden" name="rga_id" value={rga.id} />
              <button className="primary-action" type="submit">
                Issue Credit Memo
              </button>
            </form>
          ) : null}
          {isApproved && approvedSolution === "replacement" ? (
            <form action={createReplacementOrderAction} className="form-actions">
              <input type="hidden" name="rga_id" value={rga.id} />
              <button className="primary-action" type="submit">
                Create Replacement Order
              </button>
            </form>
          ) : null}
        </article>
      </section>
      <section className="detail-section">
        <article className="data-section">
          <div className="section-title">
            <h3>Authorized Items</h3>
            <span className="section-count">{lines.length}</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Item</th>
                  <th>Brand</th>
                  <th>Authorized</th>
                  <th>Credited</th>
                  <th>Replaced</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id}>
                    <td>{line.product_sku_snapshot}</td>
                    <td>{line.product_name_snapshot}</td>
                    <td>{line.brand_name_snapshot}</td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_authorized))}
                    </td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_credited))}
                    </td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_replaced))}
                    </td>
                    <td>
                      <StatusBadge tone="neutral" value={line.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </section>
  );
}
