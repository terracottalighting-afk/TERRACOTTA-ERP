"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/ui";

type Agency = { id: string; agency_code: string; name: string; main_contact_name: string | null; email: string | null; commission_default_percent: number; status: "active" | "inactive" };

export function SalesRepAgenciesDashboard({ agencies }: { agencies: Agency[] }) {
  const [view, setView] = useState<"active" | "inactive">("active");
  const activeAgencies = agencies.filter((agency) => agency.status === "active");
  const inactiveAgencies = agencies.filter((agency) => agency.status === "inactive");
  const visibleAgencies = view === "active" ? activeAgencies : inactiveAgencies;

  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Sales Coverage</span><h2>Sales Rep Agencies</h2><p className="fieldset-note">Manage agency coverage with reusable base territories.</p></div></section><div aria-label="Agency status" className="metric-grid warehouse-directory-tabs" role="tablist"><button aria-selected={view === "active"} className={`metric warehouse-directory-tab${view === "active" ? " warehouse-directory-tab--active" : ""}`} onClick={() => setView("active")} role="tab" type="button"><span>Active Agencies</span><strong>{activeAgencies.length}</strong></button><button aria-selected={view === "inactive"} className={`metric warehouse-directory-tab${view === "inactive" ? " warehouse-directory-tab--active" : ""}`} onClick={() => setView("inactive")} role="tab" type="button"><span>Inactive Agencies</span><strong>{inactiveAgencies.length}</strong></button></div>{view === "active" ? <div className="warehouse-directory-toolbar"><Link className="small-action" href="/?module=sales-rep-agency-edit">Create Agency</Link></div> : null}<div className="table-wrap"><table className="data-table"><thead><tr><th>Agency</th><th>Code</th><th>Main Contact</th><th>Email</th><th>Default Commission</th><th>Status</th></tr></thead><tbody>{visibleAgencies.map((agency) => <tr key={agency.id}><td><Link className="record-link" href={`/?module=sales-rep-agency&agency=${agency.id}`}>{agency.name}</Link></td><td>{agency.agency_code}</td><td>{agency.main_contact_name ?? "-"}</td><td>{agency.email ?? "-"}</td><td>{agency.commission_default_percent}%</td><td><StatusBadge tone={agency.status === "active" ? "good" : "warn"} value={agency.status === "active" ? "Active" : "Inactive"} /></td></tr>)}{visibleAgencies.length === 0 ? <tr><td colSpan={6}>No {view} sales rep agencies have been configured.</td></tr> : null}</tbody></table></div></section>;
}
