import Link from "next/link";
import { money } from "@/lib/formatters";
import { EditOrderAddresses } from "./edit-order-addresses";
import { OrderEntryPartsInitializer } from "./order-entry-parts-initializer";
import type { OrderPartOption, OrderProductOption, OrderShipToOption } from "./order-entry-form";

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

type SalesOrderDetail = {
  bill_to_snapshot_json: Record<string, unknown> | null;
  customer_account_id: string;
  customer_name_snapshot: string;
  customer_po_number: string;
  id: string;
  lines: {
    discount_percent: number;
    id: string;
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
  ship_to_snapshot_json: Record<string, unknown>;
  shipping_priority: string;
  status: string;
  territory_id_snapshot: string | null;
};

export function EditOrderPage({
  billingAddressOptions,
  defaultDiscountPercent,
  error,
  order,
  parts,
  products,
  salesRepOptions,
  shipToOptions,
  territoryOptions,
  updateAction,
}: {
  billingAddressOptions: OrderAddressOption[];
  defaultDiscountPercent: number;
  error?: string;
  order: SalesOrderDetail;
  parts: OrderPartOption[];
  products: OrderProductOption[];
  salesRepOptions: RepOption[];
  shipToOptions: OrderAddressOption[];
  territoryOptions: SelectOption[];
  updateAction: (formData: FormData) => Promise<void>;
}) {
  const customerOrdersHref = `/?customer=${order.customer_account_id}&tab=orders`;
  const detailHref = `/?module=orders&order=${order.id}`;
  const editable = ["open", "partially_shipped", "pending", "hold"].includes(order.status);

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <Link className="context-parent-link" href={customerOrdersHref}>
            Order List
          </Link>
          <span className="eyebrow">Order Entry</span>
          <h2>Edit {order.sales_order_number}</h2>
          <p>
            <Link className="context-parent-link" href={`/?customer=${order.customer_account_id}`}>
              {order.customer_name_snapshot}
            </Link>
          </p>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      {!editable ? <p className="form-alert">Only open, partially shipped, pending, or held orders can be edited.</p> : null}
      <form action={updateAction} className="customer-form order-entry-form" data-default-discount={defaultDiscountPercent}>
        <OrderEntryPartsInitializer />
        <input name="order_id" type="hidden" value={order.id} />
        <input name="customer_id" type="hidden" value={order.customer_account_id} />
        <input data-order-lines name="new_order_lines" type="hidden" value="[]" />
        <fieldset>
          <legend>Order Header</legend>
          <div className="form-grid form-grid--two">
            <label>
              Customer PO No.
              <input defaultValue={order.customer_po_number} disabled={!editable} name="customer_po_number" required />
            </label>
            <label>
              Order Date
              <input defaultValue={order.order_date} readOnly />
            </label>
            <label>
              Order Status
              <select defaultValue={order.status} disabled={!editable} name="order_status">
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="hold">Hold</option>
                <option value="void">Void</option>
              </select>
            </label>
            <label>
              Shipping Priority
              <select defaultValue={order.shipping_priority} disabled={!editable || order.order_type === "quote"} name="shipping_priority">
                <option value="normal">Normal</option>
                <option value="highest">Highest</option>
              </select>
            </label>
            <label>
              Territory
              <select defaultValue={order.territory_id_snapshot ?? ""} disabled={!editable} name="territory_id">
                <option value="">Not assigned</option>
                {territoryOptions.map((territory) => (
                  <option key={territory.id} value={territory.id}>
                    {territory.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sales Rep
              <select
                defaultValue={
                  order.sales_rep_id_snapshot && order.sales_rep_agency_id_snapshot
                    ? `${order.sales_rep_id_snapshot}|${order.sales_rep_agency_id_snapshot}`
                    : ""
                }
                disabled={!editable}
                name="sales_rep_selection"
              >
                <option value="">Not assigned</option>
                {salesRepOptions.map((rep) => (
                  <option key={rep.id} value={`${rep.id}|${rep.agency_id}`}>
                    {rep.name} - {rep.agency_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>
        <EditOrderAddresses
          billingAddressOptions={billingAddressOptions}
          billingSnapshot={order.bill_to_snapshot_json}
          disabled={!editable}
          shipToOptions={shipToOptions}
          shipToSnapshot={order.ship_to_snapshot_json}
        />
        {editable ? <EditOrderItemsPicker parts={parts} products={products} /> : null}
        <fieldset>
          <legend>Order Lines</legend>
          <p className="fieldset-note">Only unshipped lines can be changed or removed. Order totals update automatically when you save.</p>
          <div className="table-wrap">
            <table className="data-table edit-order-lines-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Ordered</th>
                  <th>Shipped</th>
                  <th>Unit Price</th>
                  <th>Discount</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {order.lines.map((line) => {
                  const locked = !editable || Number(line.quantity_shipped) > 0;
                  return (
                    <tr key={line.id}>
                      <td>
                        {line.product_sku_snapshot}
                        <input name="line_id" type="hidden" value={line.id} />
                      </td>
                      <td>{line.product_name_snapshot}</td>
                      <td>
                        {locked ? (
                          line.quantity_ordered
                        ) : (
                          <input defaultValue={line.quantity_ordered} min={1} name={`quantity_${line.id}`} required step="1" type="number" />
                        )}
                      </td>
                      <td>{line.quantity_shipped}</td>
                      <td>
                        {locked ? (
                          money(Number(line.unit_price))
                        ) : (
                          <input defaultValue={line.unit_price} min={0} name={`unit_price_${line.id}`} required step="0.01" type="number" />
                        )}
                      </td>
                      <td>
                        {locked ? (
                          `${line.discount_percent}%`
                        ) : (
                          <input
                            defaultValue={line.discount_percent}
                            inputMode="decimal"
                            name={`discount_percent_${line.id}`}
                            onFocus={(event) => event.currentTarget.select()}
                            pattern="[0-9]*[.]?[0-9]*"
                            required
                            type="text"
                          />
                        )}
                      </td>
                      <td>
                        {locked ? (
                          "Locked"
                        ) : (
                          <label className="inline-checkbox">
                            <input name="delete_line_id" type="checkbox" value={line.id} /> Remove
                          </label>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </fieldset>
        <fieldset>
          <legend>Notes</legend>
          <label className="order-notes-field">
            Internal Order Notes
            <textarea defaultValue={order.notes ?? ""} disabled={!editable} name="notes" rows={4} />
          </label>
        </fieldset>
        {editable ? (
          <div className="form-actions">
            <button className="primary-action" type="submit">
              Save Changes
            </button>
            <Link className="secondary-action" href={detailHref}>
              Cancel
            </Link>
          </div>
        ) : null}
      </form>
    </section>
  );
}

function EditOrderItemsPicker({ parts, products }: { parts: OrderPartOption[]; products: OrderProductOption[] }) {
  return (
    <fieldset>
      <legend>Add Items</legend>
      <p className="fieldset-note">Search and add regular products or parts. New items are added when you save the order.</p>
      <div
        className="order-product-search"
        data-order-product-picker
        data-parent-products={JSON.stringify(
          products.map((product) => ({
            id: product.id,
            name: product.name,
            sku: product.sku,
          })),
        )}
        data-part-options={JSON.stringify(parts)}
        data-products={JSON.stringify(products)}
      >
        <div className="order-search-heading">
          <label className="order-search-label">Search SKU or Product Name</label>
          <label className="checkbox-label order-part-toggle">
            <input name="search_parts" type="checkbox" /> Search Parts
          </label>
        </div>
        <div className="order-search-mode order-search-mode--products">
          <label>
            <input autoComplete="off" list="edit-order-product-options" name="product_search" placeholder="Type a SKU or product name" />
            <datalist id="edit-order-product-options">
              {products.map((product) => (
                <option key={product.id} label={`${product.name} | ${product.brandName}`} value={product.sku} />
              ))}
            </datalist>
          </label>
          <div className="order-product-results" data-product-results />
          <p className="fieldset-note" data-product-empty />
        </div>
        <div className="order-search-mode order-search-mode--parts">
          <label className="checkbox-label order-generic-toggle">
            <input name="search_generic_part" type="checkbox" /> Search a generic part
          </label>
          <div className="part-search-mode part-search-mode--parent">
            <div
              className="part-parent-search-grid"
              data-order-part-picker
              data-parent-products={JSON.stringify(
                products.map((product) => ({
                  id: product.id,
                  name: product.name,
                  sku: product.sku,
                })),
              )}
              data-part-options={JSON.stringify(parts)}
            >
              <div>
                <label>
                  Enter a Parent SKU/Name
                  <input autoComplete="off" list="edit-order-parent-options" name="parent_part_search" placeholder="Type a parent SKU or name" />
                  <datalist id="edit-order-parent-options">
                    {products.map((product) => (
                      <option key={product.id} label={`${product.name} | ${product.brandName}`} value={product.sku} />
                    ))}
                  </datalist>
                </label>
              </div>
              <div className="part-child-picker" data-child-parts>
                <span className="part-picker-label">Child Parts</span>
                <p className="fieldset-note">Pick a parent product to display its child parts.</p>
              </div>
            </div>
          </div>
          <div className="part-search-mode part-search-mode--generic">
            <label>
              Search Generic Part Name or SKU
              <input autoComplete="off" list="edit-order-generic-part-options" name="generic_part_search" placeholder="Type a part name or SKU" />
              <datalist id="edit-order-generic-part-options">
                {parts
                  .filter((part) => part.parentProductIds.length === 0)
                  .map((part) => (
                    <option key={part.id} label={part.name} value={part.sku} />
                  ))}
              </datalist>
            </label>
            <div className="order-product-results" data-generic-part-results />
            <p className="fieldset-note" data-generic-part-empty />
          </div>
        </div>
      </div>
      <div className="native-order-lines" data-native-order-lines />
      <div className="order-total">
        <span>New Items Subtotal</span>
        <strong data-native-order-subtotal>$0.00</strong>
      </div>
    </fieldset>
  );
}
