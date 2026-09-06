"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/ui";

type Territory = {
  id: string;
  territory_code: string;
  name: string;
  description: string | null;
  state_codes_json: unknown;
  status: "active" | "inactive";
};

export function TerritoryDirectory({ territories }: { territories: Territory[] }) {
  const [view, setView] = useState<"active" | "inactive">("active");
  const activeTerritories = territories.filter((territory) => territory.status === "active");
  const inactiveTerritories = territories.filter((territory) => territory.status === "inactive");
  const visibleTerritories = view === "active" ? activeTerritories : inactiveTerritories;

  return <>
    <div aria-label="Territory status" className="metric-grid warehouse-directory-tabs" role="tablist"><button aria-selected={view === "active"} className={`metric warehouse-directory-tab${view === "active" ? " warehouse-directory-tab--active" : ""}`} onClick={() => setView("active")} role="tab" type="button"><span>Active Territories</span><strong>{activeTerritories.length}</strong></button><button aria-selected={view === "inactive"} className={`metric warehouse-directory-tab${view === "inactive" ? " warehouse-directory-tab--active" : ""}`} onClick={() => setView("inactive")} role="tab" type="button"><span>Inactive Territories</span><strong>{inactiveTerritories.length}</strong></button></div>
    {view === "active" ? <div className="warehouse-directory-toolbar"><div className="section-actions"><Link className="small-action" href="/?module=admin-territory-edit">Add Territory</Link></div></div> : null}
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Territory</th><th>Code</th><th>Full States</th><th>Description</th><th>Status</th></tr></thead><tbody>{visibleTerritories.map((territory) => <tr key={territory.id}><td><Link className="record-link" href={`/?module=admin-territory-edit&territory=${territory.id}`}>{territory.name}</Link></td><td>{territory.territory_code}</td><td>{stateCodes(territory.state_codes_json).join(", ") || "None"}</td><td>{territory.description ?? "-"}</td><td><StatusBadge tone={territory.status === "active" ? "good" : "warn"} value={territory.status === "active" ? "Active" : "Inactive"} /></td></tr>)}{visibleTerritories.length === 0 ? <tr><td colSpan={5}>No {view} territories have been configured.</td></tr> : null}</tbody></table></div>
  </>;
}

function stateCodes(value: unknown) {
  return Array.isArray(value) ? value.filter((state): state is string => typeof state === "string") : [];
}
