import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";

type PrimaryShowroomForEdit = {
  enrollment: {
    current_display_count: number;
    enrollment_date: string;
    expiration_date: string | null;
    last_review_date: string | null;
    minimum_annual_sales_target: number | null;
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

export async function EditPrimaryShowroomForm({
  customerId,
  enrollmentId,
  error,
  loadPrimaryShowroom,
  saveAction,
  section,
}: {
  customerId?: string;
  enrollmentId?: string;
  error?: string;
  loadPrimaryShowroom: (customerId: string, enrollmentId: string) => Promise<PrimaryShowroomForEdit>;
  saveAction: (formData: FormData) => void | Promise<void>;
  section?: string;
}) {
  if (!customerId || !enrollmentId) {
    return <ModulePlaceholder moduleName="Primary Showroom editing requires a selected showroom" />;
  }

  const showroom = await loadPrimaryShowroom(customerId, enrollmentId);
  const editMeasures = section === "measures";
  const dashboardHref = `/?module=primary-showroom&customer=${customerId}&primary_showroom=${enrollmentId}`;

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Primary Showroom</span>
          <h2>{editMeasures ? "Edit Program Measures" : "Edit Showroom Profile"}</h2>
          <p>{showroom.location.location_name}</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={dashboardHref}>
          Back to Primary Showroom
        </Link>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={saveAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <input name="enrollment_id" type="hidden" value={enrollmentId} />
        <input name="section" type="hidden" value={editMeasures ? "measures" : "profile"} />
        {editMeasures ? (
          <fieldset>
            <legend>Program Measures</legend>
            <div className="form-grid">
              <label>Current Displays on Floor<input defaultValue={showroom.enrollment.current_display_count} min="0" name="current_display_count" required type="number" /></label>
              <label>Required Displays<input defaultValue={showroom.enrollment.required_display_count} min="0" name="required_display_count" required type="number" /></label>
              <label>Minimum Annual Sales Target<input defaultValue={showroom.enrollment.minimum_annual_sales_target ?? ""} min="0" name="minimum_annual_sales_target" step="0.01" type="number" /></label>
            </div>
          </fieldset>
        ) : (
          <fieldset>
            <legend>Showroom Profile</legend>
            <div className="form-grid">
              <label>Address Line 1<input defaultValue={showroom.location.address_line_1 ?? ""} name="address_line_1" /></label>
              <label>Address Line 2<input defaultValue={showroom.location.address_line_2 ?? ""} name="address_line_2" /></label>
              <label>City<input defaultValue={showroom.location.city ?? ""} name="city" /></label>
              <label>State / Province<input defaultValue={showroom.location.state_province ?? ""} name="state_province" /></label>
              <label>Postal Code<input defaultValue={showroom.location.postal_code ?? ""} name="postal_code" /></label>
              <label>Initial Enrollment Date<input defaultValue={showroom.enrollment.enrollment_date} name="enrollment_date" required type="date" /></label>
              <label>Last Review Date<input defaultValue={showroom.enrollment.last_review_date ?? ""} name="last_review_date" type="date" /></label>
              <label>Membership Expiration<input defaultValue={showroom.enrollment.expiration_date ?? ""} name="expiration_date" type="date" /></label>
            </div>
          </fieldset>
        )}
        <div className="form-actions">
          <button className="primary-action" type="submit">Save Changes</button>
          <Link className="secondary-action secondary-action--light" href={dashboardHref}>Cancel</Link>
        </div>
      </form>
    </section>
  );
}
