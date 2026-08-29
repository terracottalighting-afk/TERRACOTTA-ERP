import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";

type CustomerName = {
  name: string;
};

type LocationOption = {
  id: string;
  name: string;
};

type RepOption = {
  agency_id: string;
  agency_name: string;
  id: string;
  name: string;
};

type SelectOption = {
  id: string;
  name: string;
};

type RepAssignment = {
  coverage_role: string;
  customer_location_id: string;
  id: string;
  sales_rep_id: string | null;
  status: string;
  territory_id: string | null;
};

export async function EditSalesRepForm({
  customerId,
  error,
  loadAssignments,
  loadCustomer,
  repOptions,
  saveAction,
  territoryOptions,
}: {
  customerId?: string;
  error?: string;
  loadAssignments: (customerId: string) => Promise<{
    assignments: RepAssignment[];
    locations: LocationOption[];
  }>;
  loadCustomer: (customerId: string) => Promise<CustomerName>;
  repOptions: RepOption[];
  saveAction: (formData: FormData) => void | Promise<void>;
  territoryOptions: SelectOption[];
}) {
  if (!customerId) {
    return <ModulePlaceholder moduleName="Edit Sales Rep requires a selected customer" />;
  }

  const [customer, assignmentData] = await Promise.all([
    loadCustomer(customerId),
    loadAssignments(customerId),
  ]);
  const { assignments, locations } = assignmentData;

  const assignmentForm = (assignment?: RepAssignment) => (
    <form action={saveAction} className="customer-form" key={assignment?.id ?? "new"}>
      <input name="customer_id" type="hidden" value={customerId} />
      <input name="assignment_id" type="hidden" value={assignment?.id ?? ""} />
      <fieldset>
        <legend>{assignment ? "Sales Rep Assignment" : "Add Sales Rep Assignment"}</legend>
        <div className="form-grid">
          <label>
            Location
            <select defaultValue={assignment?.customer_location_id ?? ""} name="location_id" required>
              <option value="">Select location</option>
              {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
            </select>
          </label>
          <label>
            Sales Rep
            <select defaultValue={assignment?.sales_rep_id ? `${assignment.sales_rep_id}|${repOptions.find((rep) => rep.id === assignment.sales_rep_id)?.agency_id ?? ""}` : ""} name="sales_rep_selection" required>
              <option value="">Select sales rep</option>
              {repOptions.map((rep) => <option key={rep.id} value={`${rep.id}|${rep.agency_id}`}>{rep.name} / {rep.agency_name}</option>)}
            </select>
          </label>
          <label>
            Territory
            <select defaultValue={assignment?.territory_id ?? ""} name="territory_id">
              <option value="">Not assigned</option>
              {territoryOptions.map((territory) => <option key={territory.id} value={territory.id}>{territory.name}</option>)}
            </select>
          </label>
          <label>
            Coverage Role
            <select defaultValue={assignment?.coverage_role ?? "primary"} name="coverage_role">
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="support">Support</option>
              <option value="manager">Manager</option>
            </select>
          </label>
          <label>
            Status
            <select defaultValue={assignment?.status ?? "active"} name="status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>
      </fieldset>
      <div className="form-actions">
        <button className="primary-action" type="submit">{assignment ? "Save Assignment" : "Add Assignment"}</button>
      </div>
    </form>
  );

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Account</span>
          <h2>Edit Sales Rep</h2>
          <p>{customer.name}</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}&tab=sales-rep`}>Back to Account</Link>
      </section>

      {error ? <div className="form-alert">{error === "missing_required" ? "Location and sales rep are required." : decodeURIComponent(error)}</div> : null}

      {assignments.map(assignmentForm)}
      {assignmentForm()}

      <div className="form-actions">
        <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}&tab=sales-rep`}>Done</Link>
      </div>
    </section>
  );
}
