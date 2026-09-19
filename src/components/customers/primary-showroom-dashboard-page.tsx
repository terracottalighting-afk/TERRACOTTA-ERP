import Link from "next/link";

import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { PrimaryShowroomDashboardTabs } from "@/components/customers/primary-showroom-dashboard-tabs";

type CustomerName = { name: string };

type PrimaryShowroomDashboard = {
  displays: {
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
  }[];
  enrollment: {
    current_display_count: number;
    enrollment_date: string;
    expiration_date: string | null;
    last_review_date: string | null;
    next_review_date: string | null;
    minimum_annual_sales_target: number | null;
    program_status: string;
    required_display_count: number;
  };
  location: {
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    id: string;
    location_name: string;
    postal_code: string | null;
    state_province: string | null;
  };
  snapshots: {
    display_count: number;
    id: string;
    items: {
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
    }[];
    snapshot_date: string;
  }[];
  primaryShowroomContact: {
    email: string | null;
    id: string;
    name: string;
    phone: string | null;
    title: string | null;
  } | null;
  salesCoverage: {
    agency_name: string | null;
    sales_rep_name: string | null;
  } | null;
};

export async function PrimaryShowroomDashboardPage({
  customerId,
  enrollmentId,
  createSnapshotAction,
  loadCustomer,
  loadPrimaryShowroomDashboard,
}: {
  customerId?: string;
  enrollmentId?: string;
  createSnapshotAction: (formData: FormData) => void | Promise<void>;
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
            <h2>
              <Link
                className="record-link"
                href={`/?module=view-location&customer=${customerId}&location=${dashboard.location.id}&location_tab=profile`}
              >
                {dashboard.location.location_name}
              </Link>
            </h2>
            <StatusBadge tone={dashboard.enrollment.program_status === "active" ? "good" : "warn"} value={dashboard.enrollment.program_status} />
          </div>
          <p>
            <Link className="text-action" href={`/?customer=${customerId}`}>
              {customer.name}
            </Link>
          </p>
        </div>
        <Link className="secondary-action" href={`/?customer=${customerId}&tab=primary-showrooms`}>
          Back to Primary Showrooms
        </Link>
      </section>

      <PrimaryShowroomDashboardTabs
        addDisplayHref={`/?module=primary-showroom-display-add&customer=${customerId}&primary_showroom=${enrollmentId}`}
        createSnapshotAction={createSnapshotAction}
        customerId={customerId}
        displays={dashboard.displays}
        enrollmentId={enrollmentId}
        importFromPoHref={`/?module=primary-showroom-display-import&customer=${customerId}&primary_showroom=${enrollmentId}`}
        profile={{
          address,
          currentDisplayCount: dashboard.enrollment.current_display_count,
          enrollmentDate: dashboard.enrollment.enrollment_date,
          expirationDate: dashboard.enrollment.expiration_date,
          lastReviewDate: dashboard.enrollment.last_review_date,
          nextReviewDate: dashboard.enrollment.next_review_date,
          minimumAnnualSalesTarget: dashboard.enrollment.minimum_annual_sales_target,
          primaryShowroomContact: dashboard.primaryShowroomContact,
          requiredDisplayCount: dashboard.enrollment.required_display_count,
          salesCoverage: dashboard.salesCoverage,
        }}
        profileEditHref={`/?module=edit-primary-showroom&customer=${customerId}&primary_showroom=${enrollmentId}&primary_showroom_section=profile`}
        measuresEditHref={`/?module=edit-primary-showroom&customer=${customerId}&primary_showroom=${enrollmentId}&primary_showroom_section=measures`}
        primaryShowroomContactEditHref={
          dashboard.primaryShowroomContact
            ? `/?module=edit-contact&customer=${customerId}&contact=${dashboard.primaryShowroomContact.id}`
            : `/?module=view-location&customer=${customerId}&location=${dashboard.location.id}&location_tab=contacts`
        }
        snapshots={dashboard.snapshots}
      />
    </section>
  );
}
