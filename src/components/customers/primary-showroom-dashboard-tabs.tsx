"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { EmptyState, StatusBadge } from "@/components/ui";
import { ConfirmRemoveButton } from "@/components/ui/confirm-remove-button";
import { PrimaryShowroomRegistrationTab } from "@/components/customers/primary-showroom-registration-pages";
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
  snapshot_date: string;
  snapshot_name: string;
};

type Registration = { created_at: string; documentCount: number; id: string; imageCount: number; purpose: string; registration_name: string; };

export function PrimaryShowroomDashboardTabs({
  createSnapshotAction,
  createSnapshotHref,
  deleteSnapshotAction,
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
  performance,
  performanceEndDate,
  performanceStartDate,
  registrationHref,
  registrations,
  snapshots,
}: {
  createSnapshotAction: (formData: FormData) => void | Promise<void>;
  createSnapshotHref: string;
  deleteSnapshotAction: (formData: FormData) => void | Promise<void>;
  customerId: string;
  addDisplayHref: string;
  importFromPoHref: string;
  initialTab?: "profile" | "displays" | "history" | "registration" | "performance";
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
  performance: {
    endDate: string;
    itemized: { brandName: string; displayStatus: "current" | "past" | "never"; quantityShipped: number; salesAmount: number; sku: string }[];
    orderAmount: number;
    orderCount: number;
    shippedAmount: number;
    shippedSkuCount: number;
    startDate: string;
  };
  performanceEndDate?: string;
  performanceStartDate?: string;
  registrationHref: string;
  registrations: Registration[];
  snapshots: Snapshot[];
}) {
  const [activeTab, setActiveTab] = useState<"profile" | "displays" | "history" | "registration" | "performance">(initialTab ?? "profile");
  const [historyTab, setHistoryTab] = useState<"current" | "snapshots">("current");
  const [skuFilter, setSkuFilter] = useState("");
  const [poFilter, setPoFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [performanceTab, setPerformanceTab] = useState<"total" | "itemized">("total");

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
        <button aria-current={activeTab === "registration" ? "page" : undefined} onClick={() => setActiveTab("registration")} type="button">Registration / Renewal</button>
        <button aria-current={activeTab === "performance" ? "page" : undefined} onClick={() => setActiveTab("performance")} type="button">Performance</button>
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
            <div className="section-actions">
              <div className="primary-showroom-display-actions">
                <Link className="small-action" href={addDisplayHref}>Add a Display</Link>
                <Link className="small-action" href={importFromPoHref}>Import from PO</Link>
              </div>
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
                <Link className="small-action" href={createSnapshotHref}>Create a Snapshot</Link>
              </div>
              {displayTable(currentDisplays, true)}
            </article>
          ) : (
            <article className="data-section">
              <div className="section-title"><h3>Snapshots</h3><span>{snapshots.length}</span></div>
              {snapshots.length === 0 ? <EmptyState text="No display snapshots have been created yet." /> : <div className="table-wrap"><table><thead><tr><th>Snapshot Name</th><th>Snapshot Date</th><th>Total Active Items</th><th>Actions</th></tr></thead><tbody>{snapshots.map((snapshot) => <tr key={snapshot.id}><td><Link className="record-link" href={`/?module=primary-showroom-snapshot&customer=${customerId}&primary_showroom=${enrollmentId}&primary_showroom_snapshot=${snapshot.id}`}>{snapshot.snapshot_name}</Link></td><td>{dateLabel(snapshot.snapshot_date)}</td><td>{numberFormatter.format(snapshot.display_count)}</td><td><form action={deleteSnapshotAction}><input name="customer_id" type="hidden" value={customerId} /><input name="enrollment_id" type="hidden" value={enrollmentId} /><input name="snapshot_id" type="hidden" value={snapshot.id} /><ConfirmRemoveButton message={`Remove snapshot “${snapshot.snapshot_name}”? Its saved display list will also be permanently removed.`} /></form></td></tr>)}</tbody></table></div>}
            </article>
          )}
        </>
      ) : null}

      {activeTab === "registration" ? <PrimaryShowroomRegistrationTab addHref={registrationHref} customerId={customerId} enrollmentId={enrollmentId} registrations={registrations} /> : null}

      {activeTab === "performance" ? <><section className="tab-strip tab-strip--nested" aria-label="Primary showroom performance sections"><button aria-current={performanceTab === "total" ? "page" : undefined} onClick={() => setPerformanceTab("total")} type="button">Total Sales</button><button aria-current={performanceTab === "itemized" ? "page" : undefined} onClick={() => setPerformanceTab("itemized")} type="button">Itemized Report</button></section><form className="primary-showroom-performance-filter" method="get"><input name="module" type="hidden" value="primary-showroom" /><input name="customer" type="hidden" value={customerId} /><input name="primary_showroom" type="hidden" value={enrollmentId} /><input name="primary_showroom_tab" type="hidden" value="performance" /><label>From<input defaultValue={performanceStartDate ?? performance.startDate} name="primary_showroom_performance_from" type="date" /></label><label>To<input defaultValue={performanceEndDate ?? performance.endDate} name="primary_showroom_performance_to" type="date" /></label><button className="secondary-action" type="submit">Run Report</button><Link className="text-action" href={`/?module=primary-showroom-performance-report&customer=${customerId}&primary_showroom=${enrollmentId}&primary_showroom_performance_from=${performance.startDate}&primary_showroom_performance_to=${performance.endDate}&primary_showroom_performance_type=${performanceTab}`}>Export Report</Link></form>{performanceTab === "total" ? <section className="primary-showroom-performance"><div className="metric-grid"><article className="metric"><span>Number of Orders (PO)</span><strong>{numberFormatter.format(performance.orderCount)}</strong></article><article className="metric"><span>Order Amount</span><strong>{money(performance.orderAmount)}</strong></article><article className="metric"><span>Shipped Amount</span><strong>{money(performance.shippedAmount)}</strong></article><article className="metric"><span>Unique SKUs Sold</span><strong>{numberFormatter.format(performance.shippedSkuCount)}</strong></article></div><article className="data-section"><div className="section-title"><h3>Sold SKUs</h3><span>{performance.shippedSkuCount}</span></div>{performance.itemized.length ? <div className="sku-chip-list">{performance.itemized.map((item) => <span key={item.sku}>{item.sku}</span>)}</div> : <EmptyState text="No regular-order sales were shipped during this period." />}</article></section> : <article className="data-section"><div className="section-title"><div><h3>Itemized Sales Report</h3><p>Regular, non-display order shipments for the selected period.</p></div><span>{performance.itemized.length}</span></div>{performance.itemized.length ? <div className="table-wrap"><table><thead><tr><th>SKU</th><th>Brand</th><th>Pieces Shipped</th><th>Sales Amount</th><th>Display History</th></tr></thead><tbody>{performance.itemized.map((item) => <tr key={item.sku}><td>{item.sku}</td><td>{item.brandName}</td><td>{numberFormatter.format(item.quantityShipped)}</td><td>{money(item.salesAmount)}</td><td>{item.displayStatus === "current" ? "Current display" : item.displayStatus === "past" ? "Past display" : "Never a display"}</td></tr>)}</tbody></table></div> : <EmptyState text="No regular-order sales were shipped during this period." />}</article>}</> : null}
    </>
  );
}
