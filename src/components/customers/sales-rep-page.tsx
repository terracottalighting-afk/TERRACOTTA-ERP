import Link from "next/link";

import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type Agency = { id: string; name: string };
type SalesRep = { id: string; address_line_1: string | null; address_line_2: string | null; city: string | null; email: string | null; is_principal: boolean; name: string; notes: string | null; phone: string | null; postal_code: string | null; role_title: string | null; sales_rep_agency_id: string; state_province: string | null; status: string };

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

  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Sales Rep</span><div className="header-line"><h2>{salesRep.name}</h2><StatusBadge tone={salesRep.status === "active" ? "good" : "warn"} value={salesRep.status === "active" ? "Active" : "Inactive"} /></div>{selectedAgency ? <Link className="text-action" href={`/?module=sales-rep-agency&agency=${selectedAgency.id}`}>Back to {selectedAgency.name}</Link> : null}</div></section><section className="detail-grid"><article className="info-panel"><div className="section-title"><h3>Sales Rep Profile</h3><Link className="text-action" href={editUrl}>Edit</Link></div><dl><div><dt>Role / Title</dt><dd>{salesRep.role_title ?? "Not set"}</dd></div><div><dt>Agency Principal</dt><dd>{salesRep.is_principal ? "Yes" : "No"}</dd></div><div><dt>Email</dt><dd>{salesRep.email ?? "Not set"}</dd></div><div><dt>Phone</dt><dd>{salesRep.phone ?? "Not set"}</dd></div><div><dt>Notes</dt><dd>{salesRep.notes ?? "Not set"}</dd></div></dl></article><article className="info-panel"><div className="section-title"><h3>Sales Rep Address</h3><Link className="text-action" href={editUrl}>Edit</Link></div><dl><div><dt>Address</dt><dd>{salesRep.address_line_1 ?? "Not set"}{salesRep.address_line_2 ? <><br />{salesRep.address_line_2}</> : null}</dd></div><div><dt>City / State</dt><dd>{[salesRep.city, salesRep.state_province].filter(Boolean).join(", ") || "Not set"}</dd></div><div><dt>ZIP / Postal Code</dt><dd>{salesRep.postal_code ?? "Not set"}</dd></div></dl></article></section></section>;
}
