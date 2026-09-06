import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FormAction = (formData: FormData) => Promise<void>;

export function ZoneEditor({
  createAction,
  error,
  saveAction,
  warehouseId,
  zoneId,
}: {
  createAction: FormAction;
  error?: string;
  saveAction: FormAction;
  warehouseId?: string;
  zoneId?: string;
}) {
  if (!warehouseId) return <section className="dashboard-panel"><p className="empty-state">Choose a warehouse before adding a zone.</p></section>;
  return <ZoneEditorForm createAction={createAction} error={error} saveAction={saveAction} warehouseId={warehouseId} zoneId={zoneId} />;
}

async function ZoneEditorForm({ createAction, error, saveAction, warehouseId, zoneId }: { createAction: FormAction; error?: string; saveAction: FormAction; warehouseId: string; zoneId?: string }) {
  const { data: zone, error: zoneError } = zoneId ? await createSupabaseAdminClient().from("warehouse_zone").select("id, zone_code, name, description").eq("id", zoneId).eq("warehouse_id", warehouseId).maybeSingle() : { data: null, error: null };
  if (zoneError) throw new Error(zoneError.message);
  if (zoneId && !zone) return <section className="dashboard-panel"><p className="empty-state">Zone not found for this warehouse.</p></section>;
  const editing = Boolean(zone);
  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Warehouse Settings</span><h2>{editing ? "Edit Zone" : "Add Zone"}</h2><Link className="text-action" href={`/?module=admin-warehouse&warehouse=${warehouseId}`}>Back to Warehouse</Link></div></section>{error ? <p className="form-error">{error}</p> : null}<form action={editing ? saveAction : createAction} className="form-stack"><input name="warehouse_id" type="hidden" value={warehouseId} />{editing ? <input name="zone_id" type="hidden" value={zone?.id ?? ""} /> : null}<fieldset><legend>Zone Information</legend><div className="form-grid"><label>Zone Code<input defaultValue={zone?.zone_code ?? ""} name="zone_code" required /></label><label>Zone Name<input defaultValue={zone?.name ?? ""} name="name" required /></label><label>Zone Description<textarea defaultValue={zone?.description ?? ""} name="description" /></label></div></fieldset><div className="form-actions"><button className="primary-action" type="submit">{editing ? "Save Zone Changes" : "Create Zone"}</button><Link className="secondary-action" href={`/?module=admin-warehouse&warehouse=${warehouseId}`}>Cancel</Link></div></form></section>;
}
