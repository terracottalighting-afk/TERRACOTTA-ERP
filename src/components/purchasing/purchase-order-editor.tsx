import Link from "next/link";

type VendorOption = {
  id: string;
  name: string;
  currency: string;
};

export function PurchaseOrderEditor({ error, saveAction, vendors }: { error?: string; saveAction: (formData: FormData) => Promise<void>; vendors: VendorOption[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const defaultNumber = `VPO-${today.replaceAll("-", "")}`;
  return <section className="dashboard-panel"><section className="form-header"><div><span className="eyebrow">Purchasing</span><h2>Create Purchase Order</h2><p>Create a draft purchase order for one vendor. Product lines can be added after the draft is saved.</p></div><Link className="secondary-action secondary-action--light" href="/?module=purchasing">Back to Purchasing</Link></section>{error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}<form action={saveAction} className="customer-form"><fieldset><legend>Purchase Order Details</legend><div className="form-grid"><label>Vendor<select name="vendor_id" required defaultValue=""><option disabled value="">Select a vendor</option>{vendors.map((vendor) => <option key={vendor.id} value={vendor.id}>{vendor.name} ({vendor.currency})</option>)}</select></label><label>PO Number<input defaultValue={defaultNumber} name="vendor_po_number" required /></label><label>PO Date<input defaultValue={today} name="po_date" required type="date" /></label><label>Expected Ready Date<input name="expected_ready_date" type="date" /></label><label>Expected Ship Date<input name="expected_ship_date" type="date" /></label><label>Expected Arrival Date<input name="expected_arrival_date" type="date" /></label><label>Notes<textarea name="notes" rows={3} /></label></div></fieldset><div className="form-actions"><button className="primary-action" disabled={!vendors.length} type="submit">Create Draft Order</button><Link className="secondary-action secondary-action--light" href="/?module=purchasing">Cancel</Link></div>{!vendors.length ? <div className="form-alert">Add an active vendor before creating a purchase order.</div> : null}</form></section>;
}
