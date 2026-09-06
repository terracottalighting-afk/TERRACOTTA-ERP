import { SectionEditor } from "./section-editor";
import { createSupabaseAdminClient, createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type FormAction = (formData: FormData) => Promise<void>;

export async function SectionEditorPage({ createAction, error, warehouseId }: { createAction: FormAction; error?: string; warehouseId?: string }) {
  if (!warehouseId) return null;
  const [zonesResult, aislesResult] = await Promise.all([
    createSupabaseAdminClient().from("warehouse_zone").select("id, zone_code, name").eq("warehouse_id", warehouseId).eq("is_active", true).order("sort_order"),
    createSupabaseUntypedAdminClient().from("warehouse_aisle").select("id, warehouse_zone_id, aisle_code, name").eq("is_active", true).order("sort_order"),
  ]);
  if (zonesResult.error) throw new Error(zonesResult.error.message);
  if (aislesResult.error) throw new Error(aislesResult.error.message);
  return <SectionEditor aisles={aislesResult.data ?? []} createAction={createAction} error={error} warehouseId={warehouseId} zones={zonesResult.data ?? []} />;
}
