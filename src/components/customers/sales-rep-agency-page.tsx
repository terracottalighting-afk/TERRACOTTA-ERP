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
  phone: string | null;
  status: string;
};

type Territory = { id: string; territory_code: string; name: string; description: string | null };

export async function SalesRepAgencyPage({
  agencyId,
  saveTerritoriesAction,
}: {
  agencyId?: string;
  saveTerritoriesAction: (formData: FormData) => Promise<void>;
}) {
  if (!agencyId) {
    return <ModulePlaceholder moduleName="Sales Rep Agency" />;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sales_rep_agency")
    .select(
      "id, agency_code, commission_default_percent, email, main_contact_name, name, phone, status",
    )
    .eq("id", agencyId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return (
      <section className="dashboard-panel">
        <div className="placeholder-panel">
          <span className="eyebrow">Sales Rep Agency</span>
          <h2>Agency not found</h2>
          <p>The selected sales rep agency could not be found.</p>
          <Link className="secondary-action" href="/">
            Back to Customer Search
          </Link>
        </div>
      </section>
    );
  }

  const agency = data as SalesRepAgency;
  const [{ data: territories, error: territoryError }, { data: assignments, error: assignmentError }] = await Promise.all([
    supabase.from("territory").select("id, territory_code, name, description").eq("status", "active").order("name", { ascending: true }),
    supabase.from("territory_assignment").select("territory_id").eq("sales_rep_agency_id", agency.id).eq("status", "active").is("end_date", null),
  ]);
  if (territoryError || assignmentError) throw new Error(territoryError?.message ?? assignmentError?.message);
  const assignedTerritoryIds = new Set((assignments ?? []).map((assignment) => assignment.territory_id));

  return (
    <section className="dashboard-panel">
      <section className="account-header">
        <div>
          <span className="eyebrow">Sales Rep Agency</span>
          <div className="header-line">
            <h2>{agency.name}</h2>
            <StatusBadge
              tone={agency.status === "active" ? "good" : "warn"}
              value={agency.status}
            />
          </div>
          <Link className="text-action" href="/">
            Back to Customer List
          </Link>
        </div>
        <div className="account-numbers">
          <span>Agency Code {agency.agency_code}</span>
        </div>
      </section>

      <section className="detail-grid">
        <article className="info-panel">
          <h3>Agency Profile</h3>
          <dl>
            <div>
              <dt>Main Contact</dt>
              <dd>{agency.main_contact_name ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{agency.email ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{agency.phone ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Default Commission</dt>
              <dd>{agency.commission_default_percent}%</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="data-section agency-territory-settings">
        <div className="section-title"><div><h3>Assigned Territories</h3><p>Assign the base territories this agency covers. Individual reps can later receive a subset of these agency territories.</p></div></div>
        <form action={saveTerritoriesAction} className="form-stack"><input name="agency_id" type="hidden" value={agency.id} /><div className="territory-assignment-grid">{(territories ?? []).map((territory: Territory) => <label className="checkbox-label" key={territory.id}><input defaultChecked={assignedTerritoryIds.has(territory.id)} name="territory_ids" type="checkbox" value={territory.id} /><span><strong>{territory.name}</strong><small>{territory.territory_code}{territory.description ? ` - ${territory.description}` : ""}</small></span></label>)}</div>{!(territories ?? []).length ? <p className="fieldset-note">No active territories are available to assign.</p> : null}<div className="form-actions"><button className="primary-action" type="submit">Save Territory Assignments</button></div></form>
      </section>
    </section>
  );
}
