import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type Agency = { id: string; name: string };
type Territory = { id: string; territory_code: string; name: string; description: string | null };
type FormAction = (formData: FormData) => void | Promise<void>;

export async function AgencyTerritoryEditor({ agencyId, error, saveAction }: { agencyId?: string; error?: string; saveAction: FormAction }) {
  if (!agencyId) return <ModulePlaceholder moduleName="Add Territory requires a selected agency" />;
  const supabase = createSupabaseUntypedAdminClient();
  const [{ data: agencyData, error: agencyError }, { data: assignments, error: assignmentsError }, { data: territories, error: territoriesError }] = await Promise.all([
    supabase.from("sales_rep_agency").select("id, name").eq("id", agencyId).maybeSingle(),
    supabase.from("territory_assignment").select("territory_id").eq("sales_rep_agency_id", agencyId).eq("status", "active").is("end_date", null),
    supabase.from("territory").select("id, territory_code, name, description").eq("status", "active").order("name", { ascending: true }),
  ]);
  if (agencyError || assignmentsError || territoriesError) throw new Error(agencyError?.message ?? assignmentsError?.message ?? territoriesError?.message);
  if (!agencyData) return <ModulePlaceholder moduleName="Sales Rep Agency not found" />;
  const agency = agencyData as Agency;
  const assignedIds = new Set((assignments ?? []).map((assignment) => assignment.territory_id));
  const availableTerritories = (territories as Territory[]).filter((territory) => !assignedIds.has(territory.id));
  const returnUrl = `/?module=sales-rep-agency&agency=${agency.id}&agency_tab=territories`;

  return <section className="dashboard-panel"><section className="form-header"><div><span className="eyebrow">Sales Coverage</span><h2>Add Territory</h2><p>Assign active base territories to {agency.name}.</p></div><Link className="secondary-action secondary-action--light" href={returnUrl}>Cancel</Link></section>{error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}<form action={saveAction} className="customer-form"><input name="agency_id" type="hidden" value={agency.id} /><fieldset><legend>Available Territories</legend><div className="territory-assignment-grid">{availableTerritories.map((territory) => <label className="checkbox-label" key={territory.id}><input name="territory_ids" type="checkbox" value={territory.id} /><span><strong>{territory.name}</strong><small>{territory.territory_code}{territory.description ? ` - ${territory.description}` : ""}</small></span></label>)}</div>{!availableTerritories.length ? <p className="fieldset-note">All active territories are already assigned to this agency.</p> : null}</fieldset><div className="form-actions"><button className="primary-action" disabled={!availableTerritories.length} type="submit">Add Selected Territories</button><Link className="secondary-action secondary-action--light" href={returnUrl}>Cancel</Link></div></form></section>;
}
