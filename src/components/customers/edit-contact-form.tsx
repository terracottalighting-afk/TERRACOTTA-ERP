import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";

type CustomerName = {
  name: string;
};

type Contact = {
  customer_location_id?: string | null;
  department: string | null;
  email: string | null;
  fax?: string | null;
  is_active?: boolean;
  is_billing_contact: boolean;
  is_primary: boolean;
  is_purchasing_contact: boolean;
  is_showroom_floor_sales?: boolean;
  is_showroom_manager?: boolean;
  is_warehouse_receiver?: boolean;
  mobile?: string | null;
  name: string;
  phone?: string | null;
  title: string | null;
};

type ContactLocationOption = {
  id: string;
  location_name: string;
};

export async function EditContactForm({
  contactId,
  customerId,
  error,
  loadContact,
  loadCustomer,
  loadLocations,
  saveAction,
}: {
  contactId?: string;
  customerId?: string;
  error?: string;
  loadContact: (contactId: string) => Promise<Contact>;
  loadCustomer: (customerId: string) => Promise<CustomerName>;
  loadLocations: (customerId: string) => Promise<ContactLocationOption[]>;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!customerId || !contactId) {
    return (
      <ModulePlaceholder moduleName="Edit Contact requires a selected customer and contact" />
    );
  }

  const [customer, contact, locations] = await Promise.all([
    loadCustomer(customerId),
    loadContact(contactId),
    loadLocations(customerId),
  ]);

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Contact</span>
          <h2>{contact.name}</h2>
          <p>{customer.name}</p>
        </div>
        <Link
          className="secondary-action secondary-action--light"
          href={`/?customer=${customerId}&tab=contacts`}
        >
          Back to Contact
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
        <input name="contact_id" type="hidden" value={contactId} />
        <fieldset>
          <legend>Contact Information</legend>
          <div className="form-grid">
            <label>
              Contact Name
              <input defaultValue={contact.name} name="name" required />
            </label>
            <label>
              Status
              <select
                defaultValue={
                  contact.is_active === false ? "inactive" : "active"
                }
                name="status"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label>
              Title
              <input defaultValue={contact.title ?? ""} name="title" />
            </label>
            <label>
              Department
              <input
                defaultValue={contact.department ?? ""}
                name="department"
              />
            </label>
            <label>
              Location
              <select
                defaultValue={contact.customer_location_id ?? ""}
                name="customer_location_id"
              >
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
              <input
                defaultValue={contact.email ?? ""}
                name="email"
                type="email"
              />
            </label>
            <label>
              Phone
              <input defaultValue={contact.phone ?? ""} name="phone" />
            </label>
            <label>
              Mobile
              <input defaultValue={contact.mobile ?? ""} name="mobile" />
            </label>
            <label>
              Fax
              <input defaultValue={contact.fax ?? ""} name="fax" />
            </label>
            <div className="checkbox-cluster">
              <label className="checkbox-label">
                <input
                  defaultChecked={contact.is_primary}
                  name="is_primary"
                  type="checkbox"
                />
                Primary contact
              </label>
              <label className="checkbox-label">
                <input
                  defaultChecked={contact.is_purchasing_contact}
                  name="is_purchasing_contact"
                  type="checkbox"
                />
                Purchasing contact
              </label>
              <label className="checkbox-label">
                <input
                  defaultChecked={contact.is_billing_contact}
                  name="is_billing_contact"
                  type="checkbox"
                />
                Billing contact
              </label>
              <label className="checkbox-label">
                <input
                  defaultChecked={contact.is_warehouse_receiver}
                  name="is_warehouse_receiver"
                  type="checkbox"
                />
                Warehouse receiver
              </label>
              <label className="checkbox-label">
                <input
                  defaultChecked={contact.is_showroom_floor_sales}
                  name="is_showroom_floor_sales"
                  type="checkbox"
                />
                Showroom floor sales
              </label>
              <label className="checkbox-label">
                <input
                  defaultChecked={contact.is_showroom_manager}
                  name="is_showroom_manager"
                  type="checkbox"
                />
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
            href={`/?customer=${customerId}&tab=contacts`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
