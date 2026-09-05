import Link from "next/link";

type FormAction = (formData: FormData) => Promise<void>;

export function ZoneEditor({
  createAction,
  error,
  warehouseId,
}: {
  createAction: FormAction;
  error?: string;
  warehouseId?: string;
}) {
  if (!warehouseId) return <section className="dashboard-panel"><p className="empty-state">Choose a warehouse before adding a zone.</p></section>;
  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Warehouse Settings</span><h2>Add Zone</h2><Link className="text-action" href={`/?module=admin-warehouse&warehouse=${warehouseId}`}>Back to Warehouse</Link></div></section>{error ? <p className="form-error">{error}</p> : null}<form action={createAction} className="form-stack"><input name="warehouse_id" type="hidden" value={warehouseId} /><fieldset><legend>Zone Information</legend><div className="form-grid"><label>Zone Code<input name="zone_code" required /></label><label>Zone Name<input name="name" required /></label><label>Zone Description<textarea name="description" /></label></div></fieldset><div className="form-actions"><button className="primary-action" type="submit">Create Zone</button><Link className="secondary-action" href={`/?module=admin-warehouse&warehouse=${warehouseId}`}>Cancel</Link></div></form></section>;
}
