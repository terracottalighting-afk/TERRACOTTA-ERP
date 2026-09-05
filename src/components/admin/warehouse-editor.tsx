import Link from "next/link";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type FormAction = (formData: FormData) => Promise<void>;

export async function WarehouseEditor({
  createAction,
  error,
  saveAction,
  warehouseId,
}: {
  createAction: FormAction;
  error?: string;
  saveAction: FormAction;
  warehouseId?: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { data: warehouse, error: warehouseError } = warehouseId
    ? await supabase
        .from("warehouse")
        .select("id, warehouse_code, name, address_line_1, address_line_2, city, state_province, postal_code, country, country_code, notes, is_active")
        .eq("id", warehouseId)
        .maybeSingle()
    : { data: null, error: null };

  if (warehouseError) throw new Error(warehouseError.message);
  const editing = Boolean(warehouse);

  return (
    <section className="dashboard-panel">
      <section className="account-header">
        <div>
          <span className="eyebrow">Warehouse Settings</span>
          <h2>{warehouse?.name ?? "Add Warehouse"}</h2>
          <Link className="text-action" href="/?module=admin&admin_tab=warehouse">
            Back to Warehouse Settings
          </Link>
        </div>
      </section>
      {error ? <p className="form-error">{error}</p> : null}
      <form action={editing ? saveAction : createAction} className="form-stack">
        {editing ? <input name="warehouse_id" type="hidden" value={warehouse?.id ?? ""} /> : null}
        <fieldset>
          <legend>Warehouse Profile</legend>
          <div className="form-grid">
            <label>Warehouse Code<input defaultValue={warehouse?.warehouse_code ?? ""} name="warehouse_code" required /></label>
            <label>Warehouse Name<input defaultValue={warehouse?.name ?? ""} name="name" required /></label>
            <label>Address Line 1<input defaultValue={warehouse?.address_line_1 ?? ""} name="address_line_1" /></label>
            <label>Address Line 2<input defaultValue={warehouse?.address_line_2 ?? ""} name="address_line_2" /></label>
            <label>City<input defaultValue={warehouse?.city ?? ""} name="city" /></label>
            <label>State / Province<input defaultValue={warehouse?.state_province ?? ""} name="state_province" /></label>
            <label>Postal Code<input defaultValue={warehouse?.postal_code ?? ""} name="postal_code" /></label>
            <label>Country<input defaultValue={warehouse?.country ?? "United States"} name="country" required /></label>
            <label>Country Code<input defaultValue={warehouse?.country_code ?? "USA"} maxLength={3} name="country_code" required /></label>
            <label>Notes<textarea defaultValue={warehouse?.notes ?? ""} name="notes" /></label>
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">{editing ? "Save Warehouse Changes" : "Create Warehouse"}</button>
          {editing && warehouse?.is_active ? <button className="danger-action" formAction={saveAction} name="deactivate" type="submit" value="true">Deactivate Warehouse</button> : null}
          <Link className="secondary-action" href="/?module=admin&admin_tab=warehouse">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
