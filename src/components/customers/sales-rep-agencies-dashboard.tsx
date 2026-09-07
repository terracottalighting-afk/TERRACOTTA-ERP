"use client";

import Link from "next/link";
import { useState } from "react";

import { StatusBadge } from "@/components/ui";

type Agency = {
  agency_code: string;
  commission_default_percent: number;
  email: string | null;
  id: string;
  main_contact_name: string | null;
  name: string;
  status: "active" | "inactive";
};

type SalesRep = {
  agency: { id: string; name: string } | null;
  email: string | null;
  id: string;
  name: string;
  phone: string | null;
  role_title: string | null;
  status: "active" | "inactive";
};

type DashboardView = "active" | "inactive" | "sales-reps";

export function SalesRepAgenciesDashboard({
  agencies,
  salesReps,
}: {
  agencies: Agency[];
  salesReps: SalesRep[];
}) {
  const [view, setView] = useState<DashboardView>("active");
  const activeAgencies = agencies.filter((agency) => agency.status === "active");
  const inactiveAgencies = agencies.filter(
    (agency) => agency.status === "inactive",
  );
  const visibleAgencies = view === "active" ? activeAgencies : inactiveAgencies;

  return (
    <section className="dashboard-panel">
      <section className="account-header">
        <div>
          <span className="eyebrow">Sales Coverage</span>
          <h2>Sales Rep Agencies</h2>
          <p className="fieldset-note">
            Manage agency coverage with reusable base territories.
          </p>
        </div>
      </section>

      <div
        aria-label="Sales coverage view"
        className="metric-grid agency-directory-tabs"
        role="tablist"
      >
        <button
          aria-selected={view === "active"}
          className={`metric warehouse-directory-tab${view === "active" ? " warehouse-directory-tab--active" : ""}`}
          onClick={() => setView("active")}
          role="tab"
          type="button"
        >
          <span>Active Agencies</span>
          <strong>{activeAgencies.length}</strong>
        </button>
        <button
          aria-selected={view === "inactive"}
          className={`metric warehouse-directory-tab${view === "inactive" ? " warehouse-directory-tab--active" : ""}`}
          onClick={() => setView("inactive")}
          role="tab"
          type="button"
        >
          <span>Inactive Agencies</span>
          <strong>{inactiveAgencies.length}</strong>
        </button>
        <button
          aria-selected={view === "sales-reps"}
          className={`metric warehouse-directory-tab${view === "sales-reps" ? " warehouse-directory-tab--active" : ""}`}
          onClick={() => setView("sales-reps")}
          role="tab"
          type="button"
        >
          <span>Individual Sales Reps</span>
          <strong>{salesReps.length}</strong>
        </button>
      </div>

      {view === "active" ? (
        <div className="warehouse-directory-toolbar">
          <Link className="small-action" href="/?module=sales-rep-agency-edit">
            Create Agency
          </Link>
        </div>
      ) : null}

      {view === "sales-reps" ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sales Rep</th>
                <th>Agency</th>
                <th>Role / Title</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {salesReps.map((salesRep) => (
                <tr key={salesRep.id}>
                  <td>
                    <Link
                      className="record-link"
                      href={`/?module=sales-rep&rep=${salesRep.id}`}
                    >
                      {salesRep.name}
                    </Link>
                  </td>
                  <td>
                    {salesRep.agency ? (
                      <Link
                        className="record-link"
                        href={`/?module=sales-rep-agency&agency=${salesRep.agency.id}`}
                      >
                        {salesRep.agency.name}
                      </Link>
                    ) : (
                      "Independent"
                    )}
                  </td>
                  <td>{salesRep.role_title ?? "Not set"}</td>
                  <td>{salesRep.email ?? "Not set"}</td>
                  <td>{salesRep.phone ?? "Not set"}</td>
                  <td>
                    <StatusBadge
                      tone={salesRep.status === "active" ? "good" : "warn"}
                      value={salesRep.status === "active" ? "Active" : "Inactive"}
                    />
                  </td>
                </tr>
              ))}
              {!salesReps.length ? (
                <tr>
                  <td colSpan={6}>No sales reps have been configured.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Agency</th>
                <th>Code</th>
                <th>Main Contact</th>
                <th>Email</th>
                <th>Default Commission</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleAgencies.map((agency) => (
                <tr key={agency.id}>
                  <td>
                    <Link
                      className="record-link"
                      href={`/?module=sales-rep-agency&agency=${agency.id}`}
                    >
                      {agency.name}
                    </Link>
                  </td>
                  <td>{agency.agency_code}</td>
                  <td>{agency.main_contact_name ?? "-"}</td>
                  <td>{agency.email ?? "-"}</td>
                  <td>{agency.commission_default_percent}%</td>
                  <td>
                    <StatusBadge
                      tone={agency.status === "active" ? "good" : "warn"}
                      value={agency.status === "active" ? "Active" : "Inactive"}
                    />
                  </td>
                </tr>
              ))}
              {!visibleAgencies.length ? (
                <tr>
                  <td colSpan={6}>No {view} sales rep agencies have been configured.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
