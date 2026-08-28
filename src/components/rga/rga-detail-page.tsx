import Link from "next/link";
import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { dateLabel, label, numberFormatter } from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function RgaDetailPage({
  error,
  notice,
  reviewAction,
  rgaId,
}: {
  error?: string;
  notice?: string;
  reviewAction: (formData: FormData) => Promise<void>;
  rgaId?: string;
}) {
  if (!rgaId) return <ModulePlaceholder moduleName="Select an RGA to review" />;

  const supabase = createSupabaseAdminClient();
  const [
    { data: rga, error: rgaError },
    { data: lines, error: linesError },
    { data: documents, error: documentsError },
  ] = await Promise.all([
    supabase
      .from("rga")
      .select(
        "id, rga_number, customer_account_id, customer_name_snapshot, original_customer_po_number_snapshot, sales_order_id, request_date, authorized_date, rejected_at, rga_reason_category, requested_resolution_type, approved_resolution_type, return_required, customer_pays_return_freight, issue_description, resolution_notes, status, created_at",
      )
      .eq("id", rgaId)
      .maybeSingle(),
    supabase
      .from("rga_line")
      .select(
        "id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_shipped_snapshot, previous_rga_quantity_snapshot, available_rga_quantity_snapshot, quantity_requested, quantity_authorized, status, notes",
      )
      .eq("rga_id", rgaId)
      .order("product_sku_snapshot"),
    supabase
      .from("attachment")
      .select(
        "id, original_file_name, content_type, storage_bucket, storage_path, uploaded_at",
      )
      .eq("entity_type", "rga")
      .eq("entity_id", rgaId)
      .eq("is_active", true)
      .order("uploaded_at"),
  ]);
  if (rgaError) throw new Error(rgaError.message);
  if (linesError) throw new Error(linesError.message);
  if (documentsError) throw new Error(documentsError.message);
  if (!rga) return <ModulePlaceholder moduleName="RGA not found" />;

  const [{ data: replacementOrder }, { data: creditMemo }] = await Promise.all([
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

  const documentLinks = await Promise.all(
    (documents ?? []).map(async (document) => {
      const { data } = await supabase.storage
        .from(document.storage_bucket)
        .createSignedUrl(document.storage_path, 3600);
      return { ...document, signedUrl: data?.signedUrl ?? null };
    }),
  );
  const isPendingReview = rga.status === "pending_review";
  const statusTone =
    rga.status === "pending_review"
      ? "warn"
      : ["authorized", "awaiting_return", "awaiting_credit_memo"].includes(
            rga.status,
          )
        ? "primary"
        : ["rejected", "cancelled"].includes(rga.status)
          ? "danger"
          : "neutral";

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="context-parent-link"
            href={
              rga.sales_order_id
                ? `/?module=rga&rga_order=${rga.sales_order_id}`
                : "/?module=rga"
            }
          >
            RGA List
          </Link>
          <div className="record-title-row">
            <h2>{rga.rga_number}</h2>
            <StatusBadge tone={statusTone} value={rga.status} />
          </div>
          <p>
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
                {rga.original_customer_po_number_snapshot ||
                  "Open original order"}
              </Link>
            ) : (
              rga.original_customer_po_number_snapshot || "Not set"
            )}
          </p>
        </div>
        <div className="record-hero-actions">
          <Link
            className="secondary-action"
            href={`/?module=rga-solution&rga=${rga.id}`}
          >
            RGA Solution
          </Link>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {notice ? <p className="form-notice">{notice}</p> : null}
      <section className="detail-section">
        <article className="info-panel">
          <h3>Request Details</h3>
          <dl className="detail-list">
            <div>
              <dt>Request Date</dt>
              <dd>{dateLabel(rga.request_date)}</dd>
            </div>
            <div>
              <dt>Reason</dt>
              <dd>{label(rga.rga_reason_category)}</dd>
            </div>
            <div>
              <dt>Requested Solution</dt>
              <dd>{label(rga.requested_resolution_type)}</dd>
            </div>
            <div>
              <dt>Return Required</dt>
              <dd>{rga.return_required ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt>Customer Pays Return Freight</dt>
              <dd>{rga.customer_pays_return_freight ? "Yes" : "No"}</dd>
            </div>
          </dl>
          <h4>Issue Description</h4>
          <p className="long-text">
            {rga.issue_description || "No issue description was provided."}
          </p>
        </article>
        <article className="info-panel">
          <h3>Review Details</h3>
          <dl className="detail-list">
            <div>
              <dt>Approved Solution</dt>
              <dd>
                {rga.approved_resolution_type
                  ? label(rga.approved_resolution_type)
                  : "Not reviewed"}
              </dd>
            </div>
            <div>
              <dt>Authorized Date</dt>
              <dd>{dateLabel(rga.authorized_date)}</dd>
            </div>
            <div>
              <dt>Rejected Date</dt>
              <dd>{dateLabel(rga.rejected_at)}</dd>
            </div>
          </dl>
          <h4>Review Notes</h4>
          <p className="long-text">
            {rga.resolution_notes || "No review notes yet."}
          </p>
        </article>
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
        <article className="data-section">
          <div className="section-title">
            <h3>Affected Items</h3>
            <span className="section-count">{lines?.length ?? 0}</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Item</th>
                  <th>Brand</th>
                  <th>Shipped</th>
                  <th>Previously Requested</th>
                  <th>Available When Filed</th>
                  <th>Requested</th>
                  <th>Authorized</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(lines ?? []).map((line) => (
                  <tr key={line.id}>
                    <td>{line.product_sku_snapshot}</td>
                    <td>{line.product_name_snapshot}</td>
                    <td>{line.brand_name_snapshot}</td>
                    <td>
                      {numberFormatter.format(
                        Number(line.quantity_shipped_snapshot),
                      )}
                    </td>
                    <td>
                      {numberFormatter.format(
                        Number(line.previous_rga_quantity_snapshot),
                      )}
                    </td>
                    <td>
                      {numberFormatter.format(
                        Number(line.available_rga_quantity_snapshot),
                      )}
                    </td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_requested))}
                    </td>
                    <td>
                      {numberFormatter.format(Number(line.quantity_authorized))}
                    </td>
                    <td>
                      <StatusBadge
                        tone={
                          line.status === "authorized" ? "primary" : "neutral"
                        }
                        value={line.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
      <section className="detail-section">
        <article className="data-section">
          <div className="section-title">
            <h3>Supporting Documents</h3>
            <span className="section-count">{documentLinks.length}</span>
          </div>
          {documentLinks.length === 0 ? (
            <p className="empty-state">
              No supporting documents were attached.
            </p>
          ) : (
            <ul className="rga-document-list">
              {documentLinks.map((document) => (
                <li key={document.id}>
                  <span>{document.original_file_name}</span>
                  <span>
                    {document.content_type || "File"} |{" "}
                    {dateLabel(document.uploaded_at)}
                  </span>
                  {document.signedUrl ? (
                    <a
                      className="table-link"
                      href={document.signedUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Download
                    </a>
                  ) : (
                    <span>Unavailable</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
      {isPendingReview ? (
        <form action={reviewAction} className="customer-form">
          <input name="rga_id" type="hidden" value={rga.id} />
          <fieldset>
            <legend>Review Decision</legend>
            <div className="form-grid">
              <label>
                Approved Solution
                <select
                  defaultValue={rga.requested_resolution_type}
                  name="approved_resolution_type"
                >
                  <option value="credit">Credit</option>
                  <option value="replacement">Replacement</option>
                </select>
              </label>
              <label className="full-width-field">
                Review Notes
                <textarea
                  name="review_notes"
                  placeholder="Required when rejecting. Add approval notes if useful."
                />
              </label>
            </div>
          </fieldset>
          <div className="form-actions">
            <button
              className="primary-action"
              name="review_decision"
              type="submit"
              value="approve"
            >
              Approve RGA
            </button>
            <button
              className="danger-action"
              name="review_decision"
              type="submit"
              value="reject"
            >
              Reject RGA
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
