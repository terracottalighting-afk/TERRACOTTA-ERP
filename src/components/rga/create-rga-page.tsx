import Link from "next/link";
import { ModulePlaceholder } from "@/components/ui";
import { numberFormatter } from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type CreateRgaOrder = {
  customer_account_id: string;
  customer_name_snapshot: string;
  customer_po_number: string | null;
  id: string;
  order_type: string;
};

export async function CreateRgaPage({
  createAction,
  error,
  loadOrder,
  orderId,
}: {
  createAction: (formData: FormData) => Promise<void>;
  error?: string;
  loadOrder: (orderId: string) => Promise<CreateRgaOrder | null>;
  orderId?: string;
}) {
  if (!orderId)
    return <ModulePlaceholder moduleName="Select an order to create an RGA" />;

  const [order, supabase] = await Promise.all([
    loadOrder(orderId),
    Promise.resolve(createSupabaseAdminClient()),
  ]);
  if (!order || order.order_type === "quote")
    return <ModulePlaceholder moduleName="Original sales order not found" />;

  const { data: availableLines, error: availableLinesError } = await supabase
    .from("rga_available_sales_order_lines")
    .select(
      "sales_order_line_id, product_sku_snapshot, product_name_snapshot, brand_name_snapshot, quantity_shipped, previous_rga_quantity, available_rga_quantity",
    )
    .eq("sales_order_id", order.id)
    .order("product_sku_snapshot");
  if (availableLinesError) throw new Error(availableLinesError.message);

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
            <h2>Create RGA</h2>
          </div>
          <p>
            <Link
              className="context-parent-link"
              href={`/?customer=${order.customer_account_id}`}
            >
              {order.customer_name_snapshot}
            </Link>{" "}
            | Original PO {order.customer_po_number}
          </p>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {(availableLines ?? []).length === 0 ? (
        <section className="detail-section">
          <article className="info-panel">
            <h3>No eligible items</h3>
            <p>
              There are no shipped quantities remaining on this order that can
              be included in a new RGA.
            </p>
          </article>
        </section>
      ) : (
        <form action={createAction} className="customer-form">
          <input name="order_id" type="hidden" value={order.id} />
          <fieldset>
            <legend>RGA Request</legend>
            <div className="form-grid rga-request-grid">
              <label>
                Reason
                <select
                  defaultValue="product_defect"
                  name="rga_reason_category"
                >
                  <option value="product_defect">Product Defect</option>
                  <option value="freight_damage">Freight Damage</option>
                  <option value="wrong_item">Wrong Item</option>
                  <option value="shipping_error">Shipping Error</option>
                  <option value="buy_remorse">Buy Remorse</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label>
                Requested Solution
                <select defaultValue="credit" name="requested_resolution_type">
                  <option value="credit">Credit</option>
                  <option value="replacement">Replacement</option>
                </select>
              </label>
              <div className="rga-request-options full-width-field">
                <label>
                  <input
                    defaultChecked
                    name="return_required"
                    type="checkbox"
                  />{" "}
                  Return required
                </label>
                <label>
                  <input name="customer_pays_return_freight" type="checkbox" />{" "}
                  Customer pays return freight
                </label>
              </div>
              <label className="full-width-field">
                Issue Description
                <textarea
                  name="issue_description"
                  placeholder="Describe the issue and any information needed for review."
                />
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Supporting Documents</legend>
            <p className="fieldset-note">
              Optional. Attach photos, freight-damage evidence, customer
              correspondence, or other documents needed to review this RGA.
            </p>
            <label className="rga-supporting-documents-field">
              Documents or Images
              <input
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                multiple
                name="rga_supporting_documents"
                type="file"
              />
            </label>
          </fieldset>
          <fieldset>
            <legend>Affected Shipped Items</legend>
            <p className="form-help">
              Select one or more eligible order lines. Available RGA quantity is
              the original shipped quantity less quantities already requested on
              prior active RGAs.
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>SKU</th>
                    <th>Item</th>
                    <th>Brand</th>
                    <th>Shipped</th>
                    <th>Previous RGA</th>
                    <th>Available for RGA</th>
                    <th>Requested Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {(availableLines ?? []).map((line) => (
                    <tr key={line.sales_order_line_id}>
                      <td>
                        <input
                          name="rga_line_id"
                          type="checkbox"
                          value={line.sales_order_line_id ?? ""}
                        />
                      </td>
                      <td>{line.product_sku_snapshot}</td>
                      <td>{line.product_name_snapshot}</td>
                      <td>{line.brand_name_snapshot}</td>
                      <td>
                        {numberFormatter.format(
                          Number(line.quantity_shipped ?? 0),
                        )}
                      </td>
                      <td>
                        {numberFormatter.format(
                          Number(line.previous_rga_quantity ?? 0),
                        )}
                      </td>
                      <td>
                        {numberFormatter.format(
                          Number(line.available_rga_quantity ?? 0),
                        )}
                      </td>
                      <td>
                        <input
                          defaultValue=""
                          max={Number(line.available_rga_quantity ?? 0)}
                          min="0"
                          name={`quantity_requested_${line.sales_order_line_id}`}
                          step="1"
                          type="number"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
          <div className="form-actions">
            <button className="primary-action" type="submit">
              Create RGA
            </button>
            <Link
              className="secondary-action"
              href={`/?module=orders&order=${order.id}`}
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}
