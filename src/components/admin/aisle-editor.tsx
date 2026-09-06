import Link from "next/link";
import { createSupabaseAdminClient, createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type FormAction = (formData: FormData) => Promise<void>;

export async function AisleEditor({ createAction, error, saveAction, warehouseId, aisleId }: { createAction: FormAction; error?: string; saveAction: FormAction; warehouseId?: string; aisleId?: string }) {
  if (!warehouseId) return <section className="dashboard-panel"><p className="empty-state">Choose a warehouse before adding an aisle.</p></section>;
  const supabase = createSupabaseAdminClient();
  const [{ data: zones, error: zonesError }, { data: aisle, error: aisleError }] = await Promise.all([
    supabase.from("warehouse_zone").select("id, zone_code, name").eq("warehouse_id", warehouseId).eq("is_active", true).order("sort_order"),
    aisleId ? createSupabaseUntypedAdminClient().from("warehouse_aisle").select("id, warehouse_zone_id, aisle_code, name, description").eq("id", aisleId).maybeSingle() : Promise.resolve({ data: null, error: null }),
  ]);
  if (zonesError || aisleError) throw new Error(zonesError?.message ?? aisleError?.message);
  if (aisleId && (!aisle || !(zones ?? []).some((zone) => zone.id === aisle.warehouse_zone_id))) return <section className="dashboard-panel"><p className="empty-state">Aisle not found for this warehouse.</p></section>;
  const editing = Boolean(aisle);
  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Warehouse Settings</span><h2>{editing ? "Edit Aisle" : "Add Aisle"}</h2><Link className="text-action" href={`/?module=admin-warehouse&warehouse=${warehouseId}`}>Back to Warehouse</Link></div></section>{error ? <p className="form-error">{error}</p> : null}<form action={editing ? saveAction : createAction} className="form-stack"><input name="warehouse_id" type="hidden" value={warehouseId} />{editing ? <input name="aisle_id" type="hidden" value={aisle?.id ?? ""} /> : null}<fieldset><legend>Aisle Information</legend><div className="form-grid"><label>Zone<select defaultValue={aisle?.warehouse_zone_id ?? ""} name="warehouse_zone_id" required><option value="">Select a zone</option>{(zones ?? []).map((zone) => <option key={zone.id} value={zone.id}>{zone.zone_code} / {zone.name}</option>)}</select></label><label>Aisle Code<input defaultValue={aisle?.aisle_code ?? ""} name="aisle_code" required /></label><label>Aisle Name<input defaultValue={aisle?.name ?? ""} name="name" required /></label><label>Aisle Description<textarea defaultValue={aisle?.description ?? ""} name="description" /></label></div></fieldset><div className="form-actions"><button className="primary-action" type="submit">{editing ? "Save Aisle Changes" : "Create Aisle"}</button><Link className="secondary-action" href={`/?module=admin-warehouse&warehouse=${warehouseId}`}>Cancel</Link></div></form></section>;
}
