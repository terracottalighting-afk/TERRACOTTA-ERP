import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FormAction = (formData: FormData) => Promise<void>;

export async function AisleEditor({ createAction, error, warehouseId }: { createAction: FormAction; error?: string; warehouseId?: string }) {
  if (!warehouseId) return <section className="dashboard-panel"><p className="empty-state">Choose a warehouse before adding an aisle.</p></section>;
  const { data: zones, error: zonesError } = await createSupabaseAdminClient().from("warehouse_zone").select("id, zone_code, name").eq("warehouse_id", warehouseId).eq("is_active", true).order("sort_order");
  if (zonesError) throw new Error(zonesError.message);
  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Warehouse Settings</span><h2>Add Aisle</h2><Link className="text-action" href={`/?module=admin-warehouse&warehouse=${warehouseId}`}>Back to Warehouse</Link></div></section>{error ? <p className="form-error">{error}</p> : null}<form action={createAction} className="form-stack"><input name="warehouse_id" type="hidden" value={warehouseId} /><fieldset><legend>Aisle Information</legend><div className="form-grid"><label>Zone<select name="warehouse_zone_id" required><option value="">Select a zone</option>{(zones ?? []).map((zone) => <option key={zone.id} value={zone.id}>{zone.zone_code} / {zone.name}</option>)}</select></label><label>Aisle Code<input name="aisle_code" required /></label><label>Aisle Name<input name="name" required /></label><label>Aisle Description<textarea name="description" /></label></div></fieldset><div className="form-actions"><button className="primary-action" type="submit">Create Aisle</button><Link className="secondary-action" href={`/?module=admin-warehouse&warehouse=${warehouseId}`}>Cancel</Link></div></form></section>;
}
