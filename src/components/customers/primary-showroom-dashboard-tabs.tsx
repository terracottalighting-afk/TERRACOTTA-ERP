"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { EmptyState, StatusBadge } from "@/components/ui";
import { dateLabel, label, money, numberFormatter } from "@/lib/formatters";

type Display = {
  counts_toward_primary_showroom: boolean;
  customer_po_number_snapshot: string | null;
  display_discount_percent_snapshot: number | null;
  display_shipped_date_snapshot: string | null;
  display_status: string;
  id: string;
  minimum_floor_through_date: string | null;
  off_floor_date: string | null;
  product_name_snapshot: string | null;
  replacement_required: boolean;
  sku_snapshot: string;
};

type Snapshot = {
  display_count: number;
  id: string;
  items: Display[];
  snapshot_date: string;
};

export function PrimaryShowroomDashboardTabs({
  createSnapshotAction,
  customerId,
  addDisplayHref,
  importFromPoHref,
  initialTab,
  profileEditHref,
  primaryShowroomContactEditHref,
  measuresEditHref,
  displays,
  enrollmentId,
  profile,
  snapshots,
}: {
  createSnapshotAction: (formData: FormData) => void | Promise<void>;
  customerId: string;
  addDisplayHref: string;
  importFromPoHref: string;
  initialTab?: "profile" | "displays" | "history";
  profileEditHref: string;
  primaryShowroomContactEditHref: string;
  measuresEditHref: string;
  displays: Display[];
  enrollmentId: string;
  profile: {
    address: string;
    currentDisplayCount: number;
    enrollmentDate: string;
    expirationDate: string | null;
    lastReviewDate: string | null;
    nextReviewDate: string | null;
    minimumAnnualSalesTarget: number | null;
    primaryShowroomContact: {
      email: string | null;
      id: string;
      name: string;
      phone: string | null;
      title: string | null;
    } | null;
    requiredDisplayCount: number;
    salesCoverage: {
      agency_name: string | null;
      sales_rep_name: string | null;
    } | null;
  };
  snapshots: Snapshot[];
}) {
  const [activeTab, setActiveTab] = useState<"profile" | "displays" | "history">(initialTab ?? "profile");
  const [historyTab, setHistoryTab] = useState<"current" | "snapshots">("current");
  const [skuFilter, setSkuFilter] = useState("");
  const [poFilter, setPoFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDisplays = useMemo(() => displays.filter((display) => {
    const matchesSku = !skuFilter || display.sku_snapshot.toLowerCase().includes(skuFilter.toLowerCase());
    const matchesPo = !poFilter || (display.customer_po_number_snapshot ?? "").toLowerCase().includes(poFilter.toLowerCase());
    const matchesStatus = statusFilter === "all" || display.display_status === statusFilter;
    return matchesSku && matchesPo && matchesStatus;
  }), [displays, poFilter, skuFilter, statusFilter]);
  const currentDisplays = displays.filter((display) => display.display_status === "active" && display.counts_toward_primary_showroom);

  const displayTable = (rows: Display[], editable = false) => rows.length === 0 ? (
    <EmptyState text="No display items match this view." />
  ) : (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>SKU</th><th>Name</th><th>Original PO</th><th>Discount</th><th>Shipped Date</th><th>Mature Date</th><th>Status</th><th>Sold / Off Date</th><th>Replace</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((display) => (
            <tr key={display.id}>
              <td>{editable ? <Link className="text-action" href={`/?module=edit-primary-showroom-display&customer=${customerId}&primary_showroom=${enrollmentId}&primary_showroom_display=${display.id}`}>{display.sku_snapshot}</Link> : display.sku_snapshot}</td>
              <td>{display.product_name_snapshot ?? "Display item"}</td>
              <td>{display.customer_po_number_snapshot ?? "Not set"}</td>
              <td>{display.display_discount_percent_snapshot === null ? "Not set" : `${display.display_discount_percent_snapshot}%`}</td>
              <td>{dateLabel(display.display_shipped_date_snapshot)}</td>
              <td>{dateLabel(display.minimum_floor_through_date)}</td>
              <td><StatusBadge tone={display.display_status === "active" ? "good" : "neutral"} value={display.display_status === "active" ? "On floor" : "Off floor"} /></td>
              <td>{dateLabel(display.off_floor_date)}</td>
              <td>{display.replacement_required ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <section className="tab-strip" aria-label="Primary showroom sections">
        <button aria-current={activeTab === "profile" ? "page" : undefined} onClick={() => setActiveTab("profile")} type="button">Profile</button>
        <button aria-current={activeTab === "displays" ? "page" : undefined} onClick={() => setActiveTab("displays")} type="button">Displays</button>
        <button aria-current={activeTab === "history" ? "page" : undefined} onClick={() => setActiveTab("history")} type="button">Current &amp; History</button>
      </section>

      {activeTab === "profile" ? (
        <section className="detail-grid">
          <article className="info-panel">
            <div className="panel-title-row"><h3>Showroom Profile</h3><Link className="text-action" href={profileEditHref}>Edit</Link></div>
            <dl>
              <div><dt>Address</dt><dd>{profile.address || "Not set"}</dd></div>
              <div><dt>Initial Enrollment Date</dt><dd>{dateLabel(profile.enrollmentDate)}</dd></div>
              <div><dt>Last Review Date</dt><dd>{dateLabel(profile.lastReviewDate)}</dd></div>
              <div><dt>Next Review Date</dt><dd>{dateLabel(profile.nextReviewDate)}</dd></div>
              <div><dt>Membership Expiration</dt><dd>{dateLabel(profile.expirationDate)}</dd></div>
            </dl>
          </article>
          <article className="info-panel">
            <div className="panel-title-row"><h3>Program Measures</h3><Link className="text-action" href={measuresEditHref}>Edit</Link></div>
            <dl>
              <div><dt>Current Displays on Floor</dt><dd>{numberFormatter.format(profile.currentDisplayCount)}</dd></div>
              <div><dt>Required Displays</dt><dd>{numberFormatter.format(profile.requiredDisplayCount)}</dd></div>
              <div><dt>Minimum Annual Sales Target</dt><dd>{profile.minimumAnnualSalesTarget === null ? "Not set" : money(profile.minimumAnnualSalesTarget)}</dd></div>
            </dl>
          </article>
          <article className="info-panel">
            <div className="panel-title-row"><h3>Primary Showroom Contact</h3><Link className="text-action" href={primaryShowroomContactEditHref}>Edit</Link></div>
            {profile.primaryShowroomContact ? (
              <dl>
                <div><dt>Name</dt><dd>{profile.primaryShowroomContact.name}</dd></div>
                <div><dt>Title</dt><dd>{profile.primaryShowroomContact.title ?? "Not set"}</dd></div>
                <div><dt>Email</dt><dd>{profile.primaryShowroomContact.email ?? "Not set"}</dd></div>
                <div><dt>Phone</dt><dd>{profile.primaryShowroomContact.phone ?? "Not set"}</dd></div>
              </dl>
            ) : <EmptyState text="No location contact is marked Primary Showroom Contact." />}
          </article>
          <article className="info-panel">
            <h3>Sales Coverage</h3>
            <dl>
              <div><dt>Sales Agency</dt><dd>{profile.salesCoverage?.agency_name ?? "Not assigned"}</dd></div>
              <div><dt>Sales Rep</dt><dd>{profile.salesCoverage?.sales_rep_name ?? "Not assigned"}</dd></div>
            </dl>
          </article>
        </section>
      ) : null}

      {activeTab === "displays" ? (
        <article className="data-section">
          <div className="section-title">
            <h3>Display Items</h3>
            <div className="form-actions">
              <Link className="secondary-action secondary-action--light" href={addDisplayHref}>Add a Display</Link>
              <Link className="small-action" href={importFromPoHref}>Import from PO</Link>
              <span>{filteredDisplays.length}</span>
            </div>
          </div>
          <div className="filter-grid">
            <label>SKU<input onChange={(event) => setSkuFilter(event.target.value)} placeholder="Search SKU" value={skuFilter} /></label>
            <label>PO #<input onChange={(event) => setPoFilter(event.target.value)} placeholder="Search PO number" value={poFilter} /></label>
            <label>Status
              <select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
                <option value="all">All statuses</option>
                <option value="active">On floor</option>
                <option value="sold">Sold</option>
                <option value="swapped">Swapped</option>
                <option value="removed">Removed</option>
                <option value="needs_refresh">Needs refresh</option>
                <option value="expired">Expired</option>
              </select>
            </label>
          </div>
          {displayTable(filteredDisplays, true)}
        </article>
      ) : null}

      {activeTab === "history" ? (
        <>
          <section className="tab-strip tab-strip--nested" aria-label="Primary showroom history sections">
            <button aria-current={historyTab === "current" ? "page" : undefined} onClick={() => setHistoryTab("current")} type="button">Current</button>
            <button aria-current={historyTab === "snapshots" ? "page" : undefined} onClick={() => setHistoryTab("snapshots")} type="button">Snapshots</button>
          </section>
          {historyTab === "current" ? (
            <article className="data-section">
              <div className="section-title">
                <div><h3>Current Floor Displays</h3><p>Active display items that count toward this primary showroom.</p></div>
                <form action={createSnapshotAction}>
                  <input name="customer_id" type="hidden" value={customerId} />
                  <input name="enrollment_id" type="hidden" value={enrollmentId} />
                  <button className="small-action" type="submit">Create a Snapshot</button>
                </form>
              </div>
              {displayTable(currentDisplays, true)}
            </article>
          ) : (
            <article className="data-section">
              <div className="section-title"><h3>Snapshots</h3><span>{snapshots.length}</span></div>
              {snapshots.length === 0 ? <EmptyState text="No display snapshots have been created yet." /> : (
                <div className="compact-list">
                  {snapshots.map((snapshot) => (
                    <details className="compact-row" key={snapshot.id}>
                      <summary><strong>{dateLabel(snapshot.snapshot_date)}</strong><span>{numberFormatter.format(snapshot.display_count)} displays</span></summary>
                      <div className="table-wrap">{displayTable(snapshot.items)}</div>
                    </details>
                  ))}
                </div>
              )}
            </article>
          )}
        </>
      ) : null}
    </>
  );
}
