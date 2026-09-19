import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";

type DisplayRecord = {
  counts_toward_primary_showroom: boolean;
  customer_po_number_snapshot: string | null;
  display_discount_percent_snapshot: number | null;
  display_shipped_date_snapshot: string | null;
  display_status: string;
  minimum_floor_through_date: string | null;
  off_floor_date: string | null;
  product_name_snapshot: string | null;
  replacement_required: boolean;
  sku_snapshot: string;
};

export async function EditPrimaryShowroomDisplayForm({ customerId, displayId, enrollmentId, error, loadDisplay, saveAction }: {
  customerId?: string;
  displayId?: string;
  enrollmentId?: string;
  error?: string;
  loadDisplay: (customerId: string, enrollmentId: string, displayId: string) => Promise<DisplayRecord>;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!customerId || !enrollmentId || !displayId) return <ModulePlaceholder moduleName="Editing a display requires a selected primary showroom display" />;
  const display = await loadDisplay(customerId, enrollmentId, displayId);
  const dashboardHref = `/?module=primary-showroom&customer=${customerId}&primary_showroom=${enrollmentId}&primary_showroom_tab=displays`;
  return <section className="dashboard-panel">
    <section className="form-header"><div><span className="eyebrow">Primary Showroom</span><h2>Edit Display</h2><p>{display.sku_snapshot} · {display.product_name_snapshot ?? "Display item"}</p></div><Link className="secondary-action secondary-action--light" href={dashboardHref}>Back to Displays</Link></section>
    {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}
    <form action={saveAction} className="customer-form">
      <input name="customer_id" type="hidden" value={customerId} /><input name="enrollment_id" type="hidden" value={enrollmentId} /><input name="display_id" type="hidden" value={displayId} />
      <fieldset><legend>Display Item</legend><div className="form-grid">
        <label>SKU<input defaultValue={display.sku_snapshot} name="sku" required /></label>
        <label>Name<input defaultValue={display.product_name_snapshot ?? ""} name="name" required /></label>
        <label>Original PO #<input defaultValue={display.customer_po_number_snapshot ?? ""} name="customer_po_number" /></label>
        <label>Discount (%)<input defaultValue={display.display_discount_percent_snapshot ?? ""} min="0" name="discount_percent" step="0.01" type="number" /></label>
        <label>Shipped Date<input defaultValue={display.display_shipped_date_snapshot ?? ""} name="shipped_date" type="date" /></label>
        <label>Mature Date<input defaultValue={display.minimum_floor_through_date ?? ""} name="mature_date" type="date" /></label>
        <label>Status<select defaultValue={display.display_status} name="status"><option value="active">On floor</option><option value="sold">Sold</option><option value="swapped">Swapped</option><option value="removed">Removed</option><option value="needs_refresh">Needs refresh</option><option value="expired">Expired</option></select></label>
        <label>Sold / Off Date<input defaultValue={display.off_floor_date ?? ""} name="off_floor_date" type="date" /></label>
      </div><div className="checkbox-grid"><label><input defaultChecked={display.counts_toward_primary_showroom} name="counts_toward_primary_showroom" type="checkbox" /> Count toward Primary Showroom</label><label><input defaultChecked={display.replacement_required} name="replacement_required" type="checkbox" /> Replacement Required</label></div></fieldset>
      <div className="form-actions"><button className="primary-action" type="submit">Save Display</button><Link className="secondary-action secondary-action--light" href={dashboardHref}>Cancel</Link></div>
    </form>
  </section>;
}
