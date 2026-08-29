import Link from "next/link";

import { LocationRegionFields } from "@/components/customers/location-region-fields";
import { LocationRoleFields } from "@/components/customers/location-role-fields";
import { ModulePlaceholder } from "@/components/ui";

type CustomerName = {
  name: string;
};

export async function AddLocationForm({
  customerId,
  error,
  loadCustomer,
  saveAction,
}: {
  customerId?: string;
  error?: string;
  loadCustomer: (customerId: string) => Promise<CustomerName>;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!customerId) {
    return (
      <ModulePlaceholder moduleName="Add Location requires a selected customer" />
    );
  }

  const customer = await loadCustomer(customerId);

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Locations</span>
          <h2>Add Location</h2>
          <p>{customer.name}</p>
        </div>
        <Link
          className="secondary-action secondary-action--light"
          href={`/?customer=${customerId}&tab=locations`}
        >
          Back to Account
        </Link>
      </section>

      {error ? (
        <div className="form-alert">
          {error === "missing_required"
            ? "Location name is required."
            : decodeURIComponent(error)}
        </div>
      ) : null}

      <form action={saveAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <fieldset>
          <legend>Location / Address</legend>
          <div className="form-grid">
            <label>
              Location Name
              <input name="location_name" required />
            </label>
            <label>
              Location Contact Email
              <input name="location_contact_email" type="email" />
            </label>
            <label>
              Address Line 1
              <input name="address_line_1" />
            </label>
            <label>
              Address Line 2
              <input name="address_line_2" />
            </label>
            <label>
              City
              <input name="city" />
            </label>
            <LocationRegionFields />
            <label>
              Postal Code
              <input name="postal_code" />
            </label>
            <LocationRoleFields />
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Location
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?customer=${customerId}&tab=locations`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
