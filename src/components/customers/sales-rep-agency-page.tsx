import Link from "next/link";

import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type SalesRepAgency = {
  agency_code: string;
  commission_default_percent: number;
  email: string | null;
  main_contact_name: string | null;
  name: string;
  phone: string | null;
  status: string;
};

export async function SalesRepAgencyPage({
  agencyId,
}: {
  agencyId?: string;
}) {
  if (!agencyId) {
    return <ModulePlaceholder moduleName="Sales Rep Agency" />;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sales_rep_agency")
    .select(
      "agency_code, commission_default_percent, email, main_contact_name, name, phone, status",
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
    </section>
  );
}
