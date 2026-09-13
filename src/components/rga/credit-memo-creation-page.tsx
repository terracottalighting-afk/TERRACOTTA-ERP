import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { money, numberFormatter } from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function CreditMemoCreationPage({
  createAction,
  error,
  rgaId,
}: {
  createAction: (formData: FormData) => Promise<void>;
  error?: string;
  rgaId?: string;
}) {
  if (!rgaId) return <ModulePlaceholder moduleName="Select an authorized RGA" />;

  const supabase = createSupabaseAdminClient();
  const [rgaResult, linesResult, existingMemosResult] = await Promise.all([
    supabase
      .from("rga")
      .select("id, rga_number, customer_name_snapshot, customer_account_id, status, approved_resolution_type")
      .eq("id", rgaId)
      .maybeSingle(),
    supabase
      .from("rga_line")
      .select("id, brand_id_snapshot, brand_name_snapshot, product_name_snapshot, product_sku_snapshot, quantity_authorized, quantity_credited, sales_order_line_id")
      .eq("rga_id", rgaId)
      .eq("credit_required", true)
      .order("product_sku_snapshot"),
    supabase
      .from("credit_memo")
      .select("id")
      .eq("rga_id", rgaId)
      .neq("status", "void")
      .limit(1),
  ]);
  if (rgaResult.error) throw new Error(rgaResult.error.message);
  if (linesResult.error) throw new Error(linesResult.error.message);
  if (existingMemosResult.error) throw new Error(existingMemosResult.error.message);
  if (!rgaResult.data) return <ModulePlaceholder moduleName="RGA not found" />;

  const rga = rgaResult.data;
  const lines = linesResult.data ?? [];
  const salesOrderLineIds = lines.map((line) => line.sales_order_line_id);
  const salesOrderLinesResult = salesOrderLineIds.length
    ? await supabase
        .from("sales_order_line")
        .select("id, discount_percent, unit_price")
        .in("id", salesOrderLineIds)
    : { data: [], error: null };
  if (salesOrderLinesResult.error) throw new Error(salesOrderLinesResult.error.message);

  const salesOrderLineById = new Map(
    (salesOrderLinesResult.data ?? []).map((line) => [line.id, line]),
  );
  const creditLines = lines
    .map((line) => {
      const orderLine = salesOrderLineById.get(line.sales_order_line_id);
      const quantity = Math.max(
        0,
        Number(line.quantity_authorized) - Number(line.quantity_credited),
      );
      const amount = orderLine
        ? Math.round(
            quantity *
              Number(orderLine.unit_price) *
              (1 - Number(orderLine.discount_percent) / 100) *
              100,
          ) / 100
        : 0;
      return { ...line, amount, quantity };
    })
    .filter((line) => line.quantity > 0);
  const defaultTotal = creditLines.reduce((total, line) => total + line.amount, 0);
  const canCreate =
    rga.approved_resolution_type === "credit" &&
    ["authorized", "awaiting_credit_memo"].includes(rga.status) &&
    !existingMemosResult.data?.length &&
    creditLines.length > 0;

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="context-parent-link" href={`/?module=rga-solution&rga=${rga.id}`}>
            Back to RGA Solution
          </Link>
          <h2>Credit Memo Creation</h2>
          <p>
            {rga.rga_number} | {rga.customer_name_snapshot}
          </p>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {!canCreate ? (
        <p className="empty-state">This RGA is not available for credit memo creation.</p>
      ) : (
        <form action={createAction} className="detail-section">
          <input name="rga_id" type="hidden" value={rga.id} />
          <article className="info-panel">
            <h3>Credit Memo Details</h3>
            <dl className="detail-list">
              <div><dt>Customer</dt><dd>{rga.customer_name_snapshot}</dd></div>
              <div><dt>Issue Date</dt><dd>{new Date().toISOString().slice(0, 10)}</dd></div>
              <div><dt>Reason</dt><dd>Defect</dd></div>
              <div><dt>Default Credit Total</dt><dd>{money(defaultTotal)}</dd></div>
            </dl>
          </article>
          <article className="data-section">
            <div className="section-title"><h3>Credit Amounts</h3><span className="section-count">{creditLines.length}</span></div>
            <p className="fieldset-note">Adjust a line amount only when the authorized credit differs from the calculated order value.</p>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>SKU</th><th>Item</th><th>Brand</th><th>Authorized Qty</th><th>Credit Amount</th></tr></thead>
                <tbody>
                  {creditLines.map((line) => (
                    <tr key={line.id}>
                      <td>{line.product_sku_snapshot}</td>
                      <td>{line.product_name_snapshot}</td>
                      <td>{line.brand_name_snapshot}</td>
                      <td>{numberFormatter.format(line.quantity)}</td>
                      <td><input aria-label={`Credit amount for ${line.product_sku_snapshot}`} min="0" name={`credit_amount_${line.id}`} step="0.01" type="number" defaultValue={line.amount.toFixed(2)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
          <div className="form-actions">
            <button className="primary-action" type="submit">Create Credit Memo</button>
            <Link className="secondary-action" href={`/?module=rga-solution&rga=${rga.id}`}>Cancel</Link>
          </div>
        </form>
      )}
    </section>
  );
}
