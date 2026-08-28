import Link from "next/link";

import { ContactRoleBadges } from "@/components/customers/contact-role-badges";
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
  mobile?: string | null;
  name: string;
  phone?: string | null;
  title: string | null;
} & Parameters<typeof ContactRoleBadges>[0]["contact"];

type ContactLocationOption = {
  id: string;
  location_name: string;
};

export async function ContactInfoPage({
  contactId,
  customerId,
  loadContact,
  loadCustomer,
  loadLocations,
}: {
  contactId?: string;
  customerId?: string;
  loadContact: (contactId: string) => Promise<Contact>;
  loadCustomer: (customerId: string) => Promise<CustomerName>;
  loadLocations: (customerId: string) => Promise<ContactLocationOption[]>;
}) {
  if (!customerId || !contactId) {
    return (
      <ModulePlaceholder moduleName="Contact page requires a selected customer and contact" />
    );
  }

  const [customer, contact, locations] = await Promise.all([
    loadCustomer(customerId),
    loadContact(contactId),
    loadLocations(customerId),
  ]);
  const locationName =
    locations.find((location) => location.id === contact.customer_location_id)
      ?.location_name ?? "Account-level contact";

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Contact</span>
          <h2>{contact.name}</h2>
          <Link
            className="context-child-link"
            href={`/?customer=${customerId}`}
          >
            {customer.name}
          </Link>
        </div>
        <div className="header-actions">
          <Link
            className="primary-action"
            href={`/?module=edit-contact&customer=${customerId}&contact=${contactId}`}
          >
            Edit Contact
          </Link>
        </div>
      </section>

      <section className="detail-grid">
        <article className="info-panel">
          <h3>Contact Profile</h3>
          <dl>
            <div>
              <dt>Status</dt>
              <dd>{contact.is_active === false ? "Inactive" : "Active"}</dd>
            </div>
            <div>
              <dt>Title</dt>
              <dd>{contact.title ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{contact.department ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{locationName}</dd>
            </div>
          </dl>
        </article>

        <article className="info-panel">
          <h3>Contact Details</h3>
          <dl>
            <div>
              <dt>Email</dt>
              <dd>{contact.email ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{contact.phone ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Mobile</dt>
              <dd>{contact.mobile ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Fax</dt>
              <dd>{contact.fax ?? "Not set"}</dd>
            </div>
          </dl>
        </article>
      </section>

      <article className="data-section">
        <div className="section-title">
          <h3>Contact Roles</h3>
        </div>
        <ContactRoleBadges contact={contact} />
      </article>
    </section>
  );
}
