import Link from "next/link";

import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type SalesRepAgency = {
  address_line_1: string | null;
  address_line_2: string | null;
  id: string;
  agency_code: string;
  city: string | null;
  commission_default_percent: number;
  email: string | null;
  main_contact_name: string | null;
  name: string;
  notes: string | null;
  phone: string | null;
  postal_code: string | null;
  state_province: string | null;
  status: string;
};

type Territory = { id: string; territory_code: string; name: string; description: string | null };
type SalesRep = { id: string; name: string; email: string | null; phone: string | null; role_title: string | null; is_principal: boolean; city: string | null; state_province: string | null };
type FormAction = (formData: FormData) => void | Promise<void>;

export async function SalesRepAgencyPage({ agencyId, removeSalesRepAction, removeTerritoryAction }: { agencyId?: string; removeSalesRepAction: FormAction; removeTerritoryAction: FormAction }) {
  if (!agencyId) return <ModulePlaceholder moduleName="Sales Rep Agency" />;

  const supabase = createSupabaseUntypedAdminClient();
  const { data, error } = await supabase
    .from("sales_rep_agency")
    .select("id, address_line_1, address_line_2, agency_code, city, commission_default_percent, email, main_contact_name, name, notes, phone, postal_code, state_province, status")
    .eq("id", agencyId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) {
    return <section className="dashboard-panel"><div className="placeholder-panel"><span className="eyebrow">Sales Rep Agency</span><h2>Agency not found</h2><p>The selected sales rep agency could not be found.</p><Link className="secondary-action" href="/?module=sales-rep-agencies">Back to Sales Agencies</Link></div></section>;
  }

  const agency = data as SalesRepAgency;
  const { data: assignments, error: assignmentsError } = await supabase
    .from("territory_assignment")
    .select("id, territory_id")
    .eq("sales_rep_agency_id", agency.id)
    .eq("status", "active")
    .is("end_date", null);
  if (assignmentsError) throw new Error(assignmentsError.message);
  const territoryIds = (assignments ?? []).map((assignment) => assignment.territory_id);
  const assignmentByTerritory = new Map((assignments ?? []).map((assignment) => [assignment.territory_id, assignment.id]));
  const [{ data: territories, error: territoriesError }, { data: salesReps, error: salesRepsError }] = await Promise.all([
    territoryIds.length ? supabase.from("territory").select("id, territory_code, name, description").in("id", territoryIds).order("name", { ascending: true }) : Promise.resolve({ data: [] as Territory[], error: null }),
    supabase.from("sales_rep").select("id, name, email, phone, role_title, is_principal, city, state_province").eq("sales_rep_agency_id", agency.id).eq("status", "active").order("name", { ascending: true }),
  ]);
  if (territoriesError || salesRepsError) throw new Error(territoriesError?.message ?? salesRepsError?.message);

  return (
    <section className="dashboard-panel">
      <section className="account-header">
        <div><span className="eyebrow">Sales Rep Agency</span><div className="header-line"><h2>{agency.name}</h2><StatusBadge tone={agency.status === "active" ? "good" : "warn"} value={agency.status === "active" ? "Active" : "Inactive"} /></div><Link className="text-action" href="/?module=sales-rep-agencies">Back to Sales Agencies</Link></div>
      </section>

      <section className="detail-grid">
        <article className="info-panel"><div className="section-title"><h3>Agency Profile</h3><Link className="text-action" href={`/?module=sales-rep-agency-edit&agency=${agency.id}`}>Edit</Link></div><dl><div><dt>Agency Code</dt><dd>{agency.agency_code}</dd></div><div><dt>Main Contact</dt><dd>{agency.main_contact_name ?? "Not set"}</dd></div><div><dt>Email</dt><dd>{agency.email ?? "Not set"}</dd></div><div><dt>Phone</dt><dd>{agency.phone ?? "Not set"}</dd></div><div><dt>Default Commission</dt><dd>{agency.commission_default_percent}%</dd></div><div><dt>Notes</dt><dd>{agency.notes ?? "Not set"}</dd></div></dl></article>
        <article className="info-panel"><div className="section-title"><h3>Agency Address</h3><Link className="text-action" href={`/?module=sales-rep-agency-edit&agency=${agency.id}`}>Edit</Link></div><dl><div><dt>Address</dt><dd>{agency.address_line_1 ?? "Not set"}{agency.address_line_2 ? <><br />{agency.address_line_2}</> : null}</dd></div><div><dt>City / State</dt><dd>{[agency.city, agency.state_province].filter(Boolean).join(", ") || "Not set"}</dd></div><div><dt>ZIP / Postal Code</dt><dd>{agency.postal_code ?? "Not set"}</dd></div></dl></article>
      </section>

      <section className="data-section"><div className="section-title"><div><h3>Sales Reps</h3><p>Individual sales reps working under this agency.</p></div><Link className="small-action" href={`/?module=sales-rep-edit&agency=${agency.id}`}>Add Sales Rep</Link></div>{salesReps?.length ? <div className="compact-list">{(salesReps as SalesRep[]).map((rep) => <div className="compact-row" key={rep.id}><div><strong><Link className="record-link" href={`/?module=sales-rep&rep=${rep.id}`}>{rep.name}{rep.is_principal ? " - Principal" : ""}</Link></strong><span>{[rep.role_title, rep.email, rep.phone].filter(Boolean).join(" | ") || "No contact information"}{rep.city || rep.state_province ? ` - ${[rep.city, rep.state_province].filter(Boolean).join(", ")}` : ""}</span></div><div className="section-actions"><StatusBadge tone="good" value="Active" /><form action={removeSalesRepAction}><input name="agency_id" type="hidden" value={agency.id} /><input name="sales_rep_id" type="hidden" value={rep.id} /><button className="danger-action" type="submit">Remove</button></form></div></div>)}</div> : <p className="fieldset-note">No individual sales reps have been added.</p>}</section>

      <section className="data-section"><div className="section-title"><div><h3>Assigned Territories</h3><p>Base territories this agency covers. Individual sales reps can later receive a subset of these territories.</p></div></div>{territories?.length ? <div className="compact-list">{territories.map((territory: Territory) => <div className="compact-row" key={territory.id}><div><strong>{territory.name}</strong><span>{territory.territory_code}{territory.description ? ` - ${territory.description}` : ""}</span></div><form action={removeTerritoryAction}><input name="agency_id" type="hidden" value={agency.id} /><input name="assignment_id" type="hidden" value={assignmentByTerritory.get(territory.id)} /><input name="territory_id" type="hidden" value={territory.id} /><button className="danger-action" type="submit">Remove</button></form></div>)}</div> : <p className="fieldset-note">No territories are assigned to this agency.</p>}</section>
    </section>
  );
}
