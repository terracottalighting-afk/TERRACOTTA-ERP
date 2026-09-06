import { SectionEditor } from "./section-editor";
import { createSupabaseAdminClient, createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type FormAction = (formData: FormData) => Promise<void>;

export async function SectionEditorPage({ createAction, error, saveAction, sectionId, warehouseId }: { createAction: FormAction; error?: string; saveAction: FormAction; sectionId?: string; warehouseId?: string }) {
  if (!warehouseId) return null;
  const [zonesResult, aislesResult, sectionResult] = await Promise.all([
    createSupabaseAdminClient().from("warehouse_zone").select("id, zone_code, name").eq("warehouse_id", warehouseId).eq("is_active", true).order("sort_order"),
    createSupabaseUntypedAdminClient().from("warehouse_aisle").select("id, warehouse_zone_id, aisle_code, name").eq("is_active", true).order("sort_order"),
    sectionId ? createSupabaseUntypedAdminClient().from("warehouse_location").select("id, warehouse_zone_id, warehouse_aisle_id, location_code, location_name, is_pickable, notes").eq("id", sectionId).eq("warehouse_id", warehouseId).maybeSingle() : Promise.resolve({ data: null, error: null }),
  ]);
  if (zonesResult.error) throw new Error(zonesResult.error.message);
  if (aislesResult.error) throw new Error(aislesResult.error.message);
  if (sectionResult.error) throw new Error(sectionResult.error.message);
  if (sectionId && !sectionResult.data) return <section className="dashboard-panel"><p className="empty-state">Section not found for this warehouse.</p></section>;
  return <SectionEditor aisles={aislesResult.data ?? []} createAction={createAction} error={error} saveAction={saveAction} section={sectionResult.data ?? undefined} warehouseId={warehouseId} zones={zonesResult.data ?? []} />;
}
