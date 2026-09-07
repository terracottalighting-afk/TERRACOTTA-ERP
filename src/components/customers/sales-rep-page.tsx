import Link from "next/link";

import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type Agency = { id: string; name: string };
type SalesRep = { id: string; address_line_1: string | null; address_line_2: string | null; city: string | null; email: string | null; is_principal: boolean; name: string; notes: string | null; phone: string | null; postal_code: string | null; role_title: string | null; sales_rep_agency_id: string; state_province: string | null; status: string };
type Territory = { id: string; territory_code: string; name: string; description: string | null };

export async function SalesRepPage({ salesRepId }: { salesRepId?: string }) {
  if (!salesRepId) return <ModulePlaceholder moduleName="Sales Rep" />;
  const supabase = createSupabaseUntypedAdminClient();
  const { data, error } = await supabase.from("sales_rep").select("id, address_line_1, address_line_2, city, email, is_principal, name, notes, phone, postal_code, role_title, sales_rep_agency_id, state_province, status").eq("id", salesRepId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return <ModulePlaceholder moduleName="Sales Rep not found" />;
  const salesRep = data as SalesRep;
  const { data: agency, error: agencyError } = await supabase.from("sales_rep_agency").select("id, name").eq("id", salesRep.sales_rep_agency_id).maybeSingle();
  if (agencyError) throw new Error(agencyError.message);
  const selectedAgency = agency as Agency | null;
  const editUrl = `/?module=sales-rep-edit&agency=${salesRep.sales_rep_agency_id}&rep=${salesRep.id}`;
  const { data: assignments, error: assignmentsError } = await supabase.from("sales_rep_territory_assignment").select("territory_id").eq("sales_rep_id", salesRep.id).eq("status", "active").is("end_date", null);
  if (assignmentsError) throw new Error(assignmentsError.message);
  const territoryIds = (assignments ?? []).map((assignment) => assignment.territory_id);
  const { data: territories, error: territoriesError } = territoryIds.length ? await supabase.from("territory").select("id, territory_code, name, description").in("id", territoryIds).order("name", { ascending: true }) : { data: [] as Territory[], error: null };
  if (territoriesError) throw new Error(territoriesError.message);

  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Sales Rep</span><div className="header-line"><h2>{salesRep.name}</h2><StatusBadge tone={salesRep.status === "active" ? "good" : "warn"} value={salesRep.status === "active" ? "Active" : "Inactive"} /></div>{selectedAgency ? <Link className="text-action" href={`/?module=sales-rep-agency&agency=${selectedAgency.id}`}>Back to {selectedAgency.name}</Link> : null}</div></section><section className="detail-grid"><article className="info-panel"><div className="section-title"><h3>Sales Rep Profile</h3><Link className="text-action" href={editUrl}>Edit</Link></div><dl><div><dt>Role / Title</dt><dd>{salesRep.role_title ?? "Not set"}</dd></div><div><dt>Agency Principal</dt><dd>{salesRep.is_principal ? "Yes" : "No"}</dd></div><div><dt>Email</dt><dd>{salesRep.email ?? "Not set"}</dd></div><div><dt>Phone</dt><dd>{salesRep.phone ?? "Not set"}</dd></div><div><dt>Notes</dt><dd>{salesRep.notes ?? "Not set"}</dd></div></dl></article><article className="info-panel"><div className="section-title"><h3>Sales Rep Address</h3><Link className="text-action" href={editUrl}>Edit</Link></div><dl><div><dt>Address</dt><dd>{salesRep.address_line_1 ?? "Not set"}{salesRep.address_line_2 ? <><br />{salesRep.address_line_2}</> : null}</dd></div><div><dt>City / State</dt><dd>{[salesRep.city, salesRep.state_province].filter(Boolean).join(", ") || "Not set"}</dd></div><div><dt>ZIP / Postal Code</dt><dd>{salesRep.postal_code ?? "Not set"}</dd></div></dl></article></section><section className="data-section"><div className="section-title"><div><h3>Sub-Territories</h3><p>Agency territories assigned specifically to this sales rep.</p></div><Link className="small-action" href={`/?module=sales-rep-sub-territory-add&rep=${salesRep.id}`}>Add Sub-Territory</Link></div>{territories?.length ? <div className="compact-list">{(territories as Territory[]).map((territory) => <div className="compact-row" key={territory.id}><div><strong>{territory.name}</strong><span>{territory.territory_code}{territory.description ? ` - ${territory.description}` : ""}</span></div></div>)}</div> : <p className="fieldset-note">No sub-territories are assigned to this sales rep.</p>}</section></section>;
}
