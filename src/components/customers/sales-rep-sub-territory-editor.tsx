import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type SalesRep = { id: string; name: string; sales_rep_agency_id: string };
type Territory = { id: string; territory_code: string; name: string; description: string | null };
type FormAction = (formData: FormData) => void | Promise<void>;

export async function SalesRepSubTerritoryEditor({ error, salesRepId, saveAction }: { error?: string; salesRepId?: string; saveAction: FormAction }) {
  if (!salesRepId) return <ModulePlaceholder moduleName="Add Sub-Territory requires a selected sales rep" />;
  const supabase = createSupabaseUntypedAdminClient();
  const { data: salesRepData, error: salesRepError } = await supabase.from("sales_rep").select("id, name, sales_rep_agency_id").eq("id", salesRepId).maybeSingle();
  if (salesRepError) throw new Error(salesRepError.message);
  if (!salesRepData) return <ModulePlaceholder moduleName="Sales Rep not found" />;
  const salesRep = salesRepData as SalesRep;
  const [{ data: agencyAssignments, error: agencyAssignmentsError }, { data: agencySalesReps, error: agencySalesRepsError }] = await Promise.all([
    supabase.from("territory_assignment").select("territory_id").eq("sales_rep_agency_id", salesRep.sales_rep_agency_id).eq("status", "active").is("end_date", null),
    supabase.from("sales_rep").select("id").eq("sales_rep_agency_id", salesRep.sales_rep_agency_id),
  ]);
  if (agencyAssignmentsError || agencySalesRepsError) throw new Error(agencyAssignmentsError?.message ?? agencySalesRepsError?.message);
  const agencyTerritoryIds = (agencyAssignments ?? []).map((assignment) => assignment.territory_id);
  const agencySalesRepIds = (agencySalesReps ?? []).map((rep) => rep.id);
  const { data: repAssignments, error: repAssignmentsError } = agencySalesRepIds.length ? await supabase.from("sales_rep_territory_assignment").select("territory_id").in("sales_rep_id", agencySalesRepIds).eq("status", "active").is("end_date", null) : { data: [], error: null };
  if (repAssignmentsError) throw new Error(repAssignmentsError.message);
  const assignedIds = new Set((repAssignments ?? []).map((assignment) => assignment.territory_id));
  const { data: territories, error: territoriesError } = agencyTerritoryIds.length ? await supabase.from("territory").select("id, territory_code, name, description").in("id", agencyTerritoryIds).eq("status", "active").order("name", { ascending: true }) : { data: [] as Territory[], error: null };
  if (territoriesError) throw new Error(territoriesError.message);
  const eligibleTerritories = (territories as Territory[]).filter((territory) => !assignedIds.has(territory.id));
  const returnUrl = `/?module=sales-rep&rep=${salesRep.id}`;

  return <section className="dashboard-panel"><section className="form-header"><div><span className="eyebrow">Sales Coverage</span><h2>Add Sub-Territory</h2><p>Assign base territories from the parent agency to {salesRep.name}.</p></div><Link className="secondary-action secondary-action--light" href={returnUrl}>Cancel</Link></section>{error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}<form action={saveAction} className="customer-form"><input name="sales_rep_id" type="hidden" value={salesRep.id} /><fieldset><legend>Available Agency Territories</legend><p className="fieldset-note">Territories already assigned to another rep at this agency are not available.</p><div className="territory-assignment-grid">{eligibleTerritories.map((territory) => <label className="checkbox-label" key={territory.id}><input name="territory_ids" type="checkbox" value={territory.id} /><span><strong>{territory.name}</strong><small>{territory.territory_code}{territory.description ? ` - ${territory.description}` : ""}</small></span></label>)}</div>{!eligibleTerritories.length ? <p className="fieldset-note">There are no unassigned agency territories available for this sales rep.</p> : null}</fieldset><div className="form-actions"><button className="primary-action" disabled={!eligibleTerritories.length} type="submit">Add Selected Sub-Territories</button><Link className="secondary-action secondary-action--light" href={returnUrl}>Cancel</Link></div></form></section>;
}
