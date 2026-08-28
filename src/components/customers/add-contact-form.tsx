import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";

type CustomerName = {
  name: string;
};

type ContactLocationOption = {
  id: string;
  location_name: string;
};

export async function AddContactForm({
  customerId,
  error,
  loadCustomer,
  loadLocations,
  saveAction,
}: {
  customerId?: string;
  error?: string;
  loadCustomer: (customerId: string) => Promise<CustomerName>;
  loadLocations: (customerId: string) => Promise<ContactLocationOption[]>;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!customerId) {
    return (
      <ModulePlaceholder moduleName="Add Contact requires a selected customer" />
    );
  }

  const [customer, locations] = await Promise.all([
    loadCustomer(customerId),
    loadLocations(customerId),
  ]);

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Contact</span>
          <h2>Add Contact</h2>
          <p>{customer.name}</p>
        </div>
        <Link
          className="secondary-action secondary-action--light"
          href={`/?customer=${customerId}#contacts`}
        >
          Back to Account
        </Link>
      </section>

      {error ? (
        <div className="form-alert">
          {error === "missing_required"
            ? "Contact name is required."
            : decodeURIComponent(error)}
        </div>
      ) : null}

      <form action={saveAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <fieldset>
          <legend>Contact Information</legend>
          <div className="form-grid">
            <label>
              Contact Name
              <input name="name" required />
            </label>
            <label>
              Title
              <input name="title" />
            </label>
            <label>
              Department
              <input name="department" />
            </label>
            <label>
              Location
              <select name="customer_location_id">
                <option value="">Account-level contact</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.location_name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Email
              <input name="email" type="email" />
            </label>
            <label>
              Phone
              <input name="phone" />
            </label>
            <label>
              Mobile
              <input name="mobile" />
            </label>
            <label>
              Fax
              <input name="fax" />
            </label>
            <div className="checkbox-cluster">
              <label className="checkbox-label">
                <input name="is_primary" type="checkbox" />
                Primary contact
              </label>
              <label className="checkbox-label">
                <input name="is_purchasing_contact" type="checkbox" />
                Purchasing contact
              </label>
              <label className="checkbox-label">
                <input name="is_billing_contact" type="checkbox" />
                Billing contact
              </label>
              <label className="checkbox-label">
                <input name="is_warehouse_receiver" type="checkbox" />
                Warehouse receiver
              </label>
              <label className="checkbox-label">
                <input name="is_showroom_floor_sales" type="checkbox" />
                Showroom floor sales
              </label>
              <label className="checkbox-label">
                <input name="is_showroom_manager" type="checkbox" />
                Showroom manager
              </label>
            </div>
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Contact
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?customer=${customerId}#contacts`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
