import Link from "next/link";

import { EmptyState, ModulePlaceholder, StatusBadge } from "@/components/ui";
import { dateLabel } from "@/lib/formatters";

type ShowroomContext = {
  location: {
    address: string;
    location_name: string;
  };
};

type ImportLine = {
  alreadyImported: boolean;
  discountPercent: number;
  id: string;
  name: string;
  quantityShipped: number;
  sku: string;
};

type ImportOrder = {
  customerPoNumber: string;
  orderDate: string | null;
  salesOrderNumber: string;
  shipDate: string | null;
  lines: ImportLine[];
};

type ImportPoOption = {
  isShowroomLocation: boolean;
  locationName: string;
  poNumber: string;
  salesOrderNumber: string;
  shipDate: string | null;
};

function DashboardLink({ customerId, enrollmentId }: { customerId: string; enrollmentId: string }) {
  return <Link className="secondary-action secondary-action--light" href={`/?module=primary-showroom&customer=${customerId}&primary_showroom=${enrollmentId}`}>Back to Primary Showroom</Link>;
}

export async function AddPrimaryShowroomDisplayForm({
  customerId,
  enrollmentId,
  error,
  loadShowroom,
  saveAction,
}: {
  customerId?: string;
  enrollmentId?: string;
  error?: string;
  loadShowroom: (customerId: string, enrollmentId: string) => Promise<ShowroomContext>;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!customerId || !enrollmentId) return <ModulePlaceholder moduleName="Adding a display requires a selected primary showroom" />;
  const showroom = await loadShowroom(customerId, enrollmentId);

  return <section className="dashboard-panel">
    <section className="form-header">
      <div><span className="eyebrow">Primary Showroom</span><h2>Add a Display</h2><p>{showroom.location.location_name} · {showroom.location.address}</p></div>
      <DashboardLink customerId={customerId} enrollmentId={enrollmentId} />
    </section>
    {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}
    <form action={saveAction} className="customer-form">
      <input name="customer_id" type="hidden" value={customerId} />
      <input name="enrollment_id" type="hidden" value={enrollmentId} />
      <fieldset>
        <legend>Display Item</legend>
        <div className="form-grid">
          <label>SKU<input name="sku" required /></label>
          <label>Name<input name="name" required /></label>
          <label>Original PO #<input name="customer_po_number" /></label>
          <label>Discount (%)<input min="0" name="discount_percent" step="0.01" type="number" /></label>
          <label>Shipped Date<input name="shipped_date" type="date" /></label>
          <label>Mature Date<input name="mature_date" type="date" /></label>
          <label>Status<select defaultValue="active" name="status"><option value="active">On floor</option><option value="sold">Sold</option><option value="swapped">Swapped</option><option value="removed">Removed</option><option value="needs_refresh">Needs refresh</option><option value="expired">Expired</option></select></label>
          <label>Sold / Off Date<input name="off_floor_date" type="date" /></label>
        </div>
        <div className="checkbox-grid">
          <label><input defaultChecked name="counts_toward_primary_showroom" type="checkbox" /> Count toward Primary Showroom</label>
          <label><input name="replacement_required" type="checkbox" /> Replacement Required</label>
        </div>
      </fieldset>
      <div className="form-actions"><button className="primary-action" type="submit">Add Display</button><DashboardLink customerId={customerId} enrollmentId={enrollmentId} /></div>
    </form>
  </section>;
}

export async function ImportPrimaryShowroomDisplaysForm({
  customerId,
  enrollmentId,
  error,
  poNumber,
  importAction,
  loadImportOptions,
  loadImportOrder,
}: {
  customerId?: string;
  enrollmentId?: string;
  error?: string;
  poNumber?: string;
  importAction: (formData: FormData) => void | Promise<void>;
  loadImportOptions: (customerId: string, enrollmentId: string) => Promise<{ periodMonths: number; pos: ImportPoOption[] }>;
  loadImportOrder: (customerId: string, enrollmentId: string, poNumber: string) => Promise<{ error?: string; order: ImportOrder | null }>;
}) {
  if (!customerId || !enrollmentId) return <ModulePlaceholder moduleName="Importing displays requires a selected primary showroom" />;
  const [options, result] = await Promise.all([
    loadImportOptions(customerId, enrollmentId),
    poNumber ? loadImportOrder(customerId, enrollmentId, poNumber) : Promise.resolve({ error: undefined, order: null }),
  ]);

  return <section className="dashboard-panel">
    <section className="form-header">
      <div><span className="eyebrow">Primary Showroom</span><h2>Import Displays from PO</h2><p>Only shipped items sent to this showroom location can be imported.</p></div>
      <DashboardLink customerId={customerId} enrollmentId={enrollmentId} />
    </section>
    {error || result.error ? <div className="form-alert">{decodeURIComponent(error ?? result.error ?? "")}</div> : null}
    <article className="data-section">
      <div className="section-title"><div><h3>Shipped POs From the Last {options.periodMonths} Months</h3><p>Choose a PO shipped to this primary showroom to review its items.</p></div><span>{options.pos.length}</span></div>
      {options.pos.length === 0 ? <EmptyState text="No shipped POs are available for this account in the selected period." /> : <div className="table-wrap"><table><thead><tr><th>Customer PO</th><th>Order</th><th>Shipped Date</th><th>Ship-to Location</th><th>Action</th></tr></thead><tbody>{options.pos.map((po) => <tr key={`${po.salesOrderNumber}:${po.poNumber}`}><td>{po.poNumber}</td><td>{po.salesOrderNumber}</td><td>{dateLabel(po.shipDate)}</td><td>{po.locationName}</td><td>{po.isShowroomLocation ? <Link className="text-action" href={`/?module=primary-showroom-display-import&customer=${customerId}&primary_showroom=${enrollmentId}&primary_showroom_po=${encodeURIComponent(po.poNumber)}`}>Select PO</Link> : <span className="muted-text">Different ship-to</span>}</td></tr>)}</tbody></table></div>}
    </article>
    {result.order ? <form action={importAction} className="customer-form">
      <input name="customer_id" type="hidden" value={customerId} /><input name="enrollment_id" type="hidden" value={enrollmentId} /><input name="customer_po_number" type="hidden" value={result.order.customerPoNumber} />
      <fieldset><legend>Shipped Display Items</legend>
        <p>Order {result.order.salesOrderNumber} · PO {result.order.customerPoNumber} · Shipped {dateLabel(result.order.shipDate)}. Select the items to add as active floor displays.</p>
        {result.order.lines.length === 0 ? <EmptyState text="This PO has no shipped items available to import." /> : <div className="table-wrap"><table><thead><tr><th>Import</th><th>SKU</th><th>Name</th><th>Shipped Qty</th><th>Discount</th><th>Status</th></tr></thead><tbody>{result.order.lines.map((line) => <tr key={line.id}><td><input defaultChecked={!line.alreadyImported} disabled={line.alreadyImported} name="sales_order_line_id" type="checkbox" value={line.id} /></td><td>{line.sku}</td><td>{line.name}</td><td>{line.quantityShipped}</td><td>{line.discountPercent}%</td><td>{line.alreadyImported ? <StatusBadge tone="neutral" value="Already imported" /> : <StatusBadge tone="good" value="Ready" />}</td></tr>)}</tbody></table></div>}
      </fieldset>
      <div className="form-actions"><button className="primary-action" type="submit">Import Selected Displays</button><DashboardLink customerId={customerId} enrollmentId={enrollmentId} /></div>
    </form> : null}
  </section>;
}
