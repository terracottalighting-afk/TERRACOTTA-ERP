import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Agency = {
  agency_code: string;
  commission_default_percent: number;
  email: string | null;
  id: string;
  main_contact_name: string | null;
  name: string;
  notes: string | null;
  phone: string | null;
  status: string;
};

type Territory = { id: string; territory_code: string; name: string; description: string | null };
type FormAction = (formData: FormData) => void | Promise<void>;

export async function SalesRepAgencyEditor({ agencyId, createAction, error, saveAction }: { agencyId?: string; createAction: FormAction; error?: string; saveAction: FormAction }) {
  const supabase = createSupabaseAdminClient();
  let agency: Agency | null = null;
  let assignedTerritoryIds = new Set<string>();

  if (agencyId) {
    const [{ data: agencyData, error: agencyError }, { data: assignments, error: assignmentsError }] = await Promise.all([
      supabase.from("sales_rep_agency").select("id, agency_code, commission_default_percent, email, main_contact_name, name, notes, phone, status").eq("id", agencyId).maybeSingle(),
      supabase.from("territory_assignment").select("territory_id").eq("sales_rep_agency_id", agencyId).eq("status", "active").is("end_date", null),
    ]);
    if (agencyError || assignmentsError) throw new Error(agencyError?.message ?? assignmentsError?.message);
    if (!agencyData) return <ModulePlaceholder moduleName="Sales Rep Agency not found" />;
    agency = agencyData as Agency;
    assignedTerritoryIds = new Set((assignments ?? []).map((assignment) => assignment.territory_id));
  }

  const { data: territories, error: territoriesError } = await supabase.from("territory").select("id, territory_code, name, description").eq("status", "active").order("name", { ascending: true });
  if (territoriesError) throw new Error(territoriesError.message);
  const isEditing = Boolean(agency);
  const cancelUrl = isEditing ? `/?module=sales-rep-agency&agency=${agency!.id}` : "/?module=sales-rep-agencies";

  return (
    <section className="dashboard-panel">
      <section className="form-header"><div><span className="eyebrow">Sales Coverage</span><h2>{isEditing ? `Edit ${agency!.name}` : "Create Agency"}</h2><p>{isEditing ? "Update agency information and its base territory coverage." : "Create a sales rep agency, then assign the territories it covers."}</p></div><Link className="secondary-action secondary-action--light" href={cancelUrl}>Cancel</Link></section>
      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}
      <form action={isEditing ? saveAction : createAction} className="customer-form">
        {isEditing ? <input name="agency_id" type="hidden" value={agency!.id} /> : null}
        <fieldset><legend>Agency Profile</legend><div className="form-grid"><label>Agency Code<input defaultValue={agency?.agency_code ?? ""} name="agency_code" required /></label><label>Agency Name<input defaultValue={agency?.name ?? ""} name="name" required /></label><label>Main Contact<input defaultValue={agency?.main_contact_name ?? ""} name="main_contact_name" /></label><label>Email<input defaultValue={agency?.email ?? ""} name="email" type="email" /></label><label>Phone<input defaultValue={agency?.phone ?? ""} name="phone" /></label><label>Default Commission (%)<input defaultValue={agency?.commission_default_percent ?? 0} min="0" name="commission_default_percent" step="0.01" type="number" /></label>{isEditing ? <label>Status<select defaultValue={agency?.status ?? "active"} name="status"><option value="active">Active</option><option value="inactive">Inactive</option></select></label> : null}<label className="form-grid-span">Notes<textarea defaultValue={agency?.notes ?? ""} name="notes" rows={3} /></label></div></fieldset>
        <fieldset><legend>Assigned Territories</legend><p className="fieldset-note">Select the reusable base territories this agency covers. Individual reps can later receive a subset of them.</p><div className="territory-assignment-grid">{(territories ?? []).map((territory: Territory) => <label className="checkbox-label" key={territory.id}><input defaultChecked={assignedTerritoryIds.has(territory.id)} name="territory_ids" type="checkbox" value={territory.id} /><span><strong>{territory.name}</strong><small>{territory.territory_code}{territory.description ? ` - ${territory.description}` : ""}</small></span></label>)}</div>{!(territories ?? []).length ? <p className="fieldset-note">No active territories are available to assign.</p> : null}</fieldset>
        <div className="form-actions"><button className="primary-action" type="submit">{isEditing ? "Save Agency Changes" : "Create Agency"}</button><Link className="secondary-action secondary-action--light" href={cancelUrl}>Cancel</Link></div>
      </form>
    </section>
  );
}
