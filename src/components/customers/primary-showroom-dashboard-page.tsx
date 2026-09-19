import Link from "next/link";

import { EmptyState, ModulePlaceholder, StatusBadge } from "@/components/ui";
import { dateLabel, label, numberFormatter } from "@/lib/formatters";

type CustomerName = { name: string };

type PrimaryShowroomDashboard = {
  displays: {
    counts_toward_primary_showroom: boolean;
    customer_po_number_snapshot: string | null;
    display_shipped_date_snapshot: string | null;
    display_status: string;
    id: string;
    minimum_floor_through_date: string | null;
    product_name_snapshot: string | null;
    sku_snapshot: string;
  }[];
  enrollment: {
    current_display_count: number;
    enrollment_date: string;
    expiration_date: string | null;
    last_review_date: string | null;
    program_status: string;
    required_display_count: number;
  };
  location: {
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    location_name: string;
    postal_code: string | null;
    state_province: string | null;
  };
};

export async function PrimaryShowroomDashboardPage({
  customerId,
  enrollmentId,
  loadCustomer,
  loadPrimaryShowroomDashboard,
}: {
  customerId?: string;
  enrollmentId?: string;
  loadCustomer: (customerId: string) => Promise<CustomerName>;
  loadPrimaryShowroomDashboard: (customerId: string, enrollmentId: string) => Promise<PrimaryShowroomDashboard>;
}) {
  if (!customerId || !enrollmentId) {
    return <ModulePlaceholder moduleName="Primary Showroom page requires a selected showroom" />;
  }

  const [customer, dashboard] = await Promise.all([
    loadCustomer(customerId),
    loadPrimaryShowroomDashboard(customerId, enrollmentId),
  ]);
  const address = [
    dashboard.location.address_line_1,
    dashboard.location.address_line_2,
    [dashboard.location.city, dashboard.location.state_province].filter(Boolean).join(", "),
    dashboard.location.postal_code,
  ].filter(Boolean).join(", ");

  return (
    <section className="dashboard-panel">
      <section className="account-header">
        <div>
          <span className="eyebrow">Primary Showroom</span>
          <div className="header-line">
            <h2>{dashboard.location.location_name}</h2>
            <StatusBadge tone={dashboard.enrollment.program_status === "active" ? "good" : "warn"} value={dashboard.enrollment.program_status} />
          </div>
          <p>{customer.name}</p>
        </div>
        <Link className="secondary-action" href={`/?customer=${customerId}&tab=primary-showrooms`}>
          Back to Primary Showrooms
        </Link>
      </section>

      <section className="detail-grid">
        <article className="info-panel">
          <h3>Showroom Location</h3>
          <dl>
            <div><dt>Address</dt><dd>{address || "Not set"}</dd></div>
            <div><dt>Initial Enrollment</dt><dd>{dateLabel(dashboard.enrollment.enrollment_date)}</dd></div>
            <div><dt>Last Review</dt><dd>{dateLabel(dashboard.enrollment.last_review_date)}</dd></div>
            <div><dt>Membership Expiration</dt><dd>{dateLabel(dashboard.enrollment.expiration_date)}</dd></div>
          </dl>
        </article>
        <article className="info-panel">
          <h3>Floor Displays</h3>
          <dl>
            <div><dt>Displays on Floor</dt><dd>{numberFormatter.format(dashboard.enrollment.current_display_count)}</dd></div>
            <div><dt>Required Displays</dt><dd>{numberFormatter.format(dashboard.enrollment.required_display_count)}</dd></div>
            <div><dt>Tracked Display Records</dt><dd>{numberFormatter.format(dashboard.displays.length)}</dd></div>
          </dl>
        </article>
      </section>

      <article className="data-section">
        <div className="section-title"><h3>Floor Display List</h3><span>{dashboard.displays.length}</span></div>
        {dashboard.displays.length === 0 ? <EmptyState text="No display items are linked to this primary showroom yet." /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>SKU</th><th>Display Item</th><th>Initial Display PO</th><th>Shipped</th><th>Mature Date</th><th>Status</th></tr></thead>
              <tbody>
                {dashboard.displays.map((display) => (
                  <tr key={display.id}>
                    <td>{display.sku_snapshot}</td>
                    <td>{display.product_name_snapshot ?? "Display item"}</td>
                    <td>{display.customer_po_number_snapshot ?? "Not set"}</td>
                    <td>{dateLabel(display.display_shipped_date_snapshot)}</td>
                    <td>{dateLabel(display.minimum_floor_through_date)}</td>
                    <td><StatusBadge tone={display.counts_toward_primary_showroom ? "good" : "neutral"} value={label(display.display_status)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
