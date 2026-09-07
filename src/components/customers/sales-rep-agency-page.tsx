import Link from "next/link";

import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type SalesRepAgency = {
  id: string;
  agency_code: string;
  commission_default_percent: number;
  email: string | null;
  main_contact_name: string | null;
  name: string;
  notes: string | null;
  phone: string | null;
  status: string;
};

type Territory = { id: string; territory_code: string; name: string; description: string | null };

export async function SalesRepAgencyPage({ agencyId }: { agencyId?: string }) {
  if (!agencyId) return <ModulePlaceholder moduleName="Sales Rep Agency" />;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sales_rep_agency")
    .select("id, agency_code, commission_default_percent, email, main_contact_name, name, notes, phone, status")
    .eq("id", agencyId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) {
    return <section className="dashboard-panel"><div className="placeholder-panel"><span className="eyebrow">Sales Rep Agency</span><h2>Agency not found</h2><p>The selected sales rep agency could not be found.</p><Link className="secondary-action" href="/?module=sales-rep-agencies">Back to Sales Agencies</Link></div></section>;
  }

  const agency = data as SalesRepAgency;
  const { data: assignments, error: assignmentsError } = await supabase
    .from("territory_assignment")
    .select("territory_id")
    .eq("sales_rep_agency_id", agency.id)
    .eq("status", "active")
    .is("end_date", null);
  if (assignmentsError) throw new Error(assignmentsError.message);
  const territoryIds = (assignments ?? []).map((assignment) => assignment.territory_id);
  const { data: territories, error: territoriesError } = territoryIds.length
    ? await supabase.from("territory").select("id, territory_code, name, description").in("id", territoryIds).order("name", { ascending: true })
    : { data: [] as Territory[], error: null };
  if (territoriesError) throw new Error(territoriesError.message);

  return (
    <section className="dashboard-panel">
      <section className="account-header">
        <div><span className="eyebrow">Sales Rep Agency</span><div className="header-line"><h2>{agency.name}</h2><StatusBadge tone={agency.status === "active" ? "good" : "warn"} value={agency.status === "active" ? "Active" : "Inactive"} /></div><Link className="text-action" href="/?module=sales-rep-agencies">Back to Sales Agencies</Link></div>
        <div className="form-actions"><Link className="primary-action" href={`/?module=sales-rep-agency-edit&agency=${agency.id}`}>Edit Agency</Link></div>
      </section>

      <section className="detail-grid">
        <article className="info-panel"><h3>Agency Profile</h3><dl><div><dt>Agency Code</dt><dd>{agency.agency_code}</dd></div><div><dt>Main Contact</dt><dd>{agency.main_contact_name ?? "Not set"}</dd></div><div><dt>Email</dt><dd>{agency.email ?? "Not set"}</dd></div><div><dt>Phone</dt><dd>{agency.phone ?? "Not set"}</dd></div><div><dt>Default Commission</dt><dd>{agency.commission_default_percent}%</dd></div><div><dt>Notes</dt><dd>{agency.notes ?? "Not set"}</dd></div></dl></article>
      </section>

      <section className="data-section"><div className="section-title"><div><h3>Assigned Territories</h3><p>Base territories this agency covers. Individual sales reps can later receive a subset of these territories.</p></div></div>{territories?.length ? <div className="compact-list">{territories.map((territory: Territory) => <div className="compact-row" key={territory.id}><div><strong>{territory.name}</strong><span>{territory.territory_code}{territory.description ? ` - ${territory.description}` : ""}</span></div></div>)}</div> : <p className="fieldset-note">No territories are assigned to this agency.</p>}</section>
    </section>
  );
}
