import Link from "next/link";

import {
  FreightTermsFields,
  PaymentTermsCreditFields,
} from "@/components/customers/customer-terms-fields";
import { LocationRegionFields } from "@/components/customers/location-region-fields";
import { LocationRoleFields } from "@/components/customers/location-role-fields";

type SelectOption = {
  id: string;
  name: string;
};

type RepOption = SelectOption & {
  agency_id: string;
  agency_name: string;
};

export function AddCustomerForm({
  accountTypeOptions,
  businessTypeOptions,
  error,
  salesRepOptions,
  saveAction,
  territoryOptions,
}: {
  accountTypeOptions: SelectOption[];
  businessTypeOptions: SelectOption[];
  error?: string;
  salesRepOptions: RepOption[];
  saveAction: (formData: FormData) => void | Promise<void>;
  territoryOptions: SelectOption[];
}) {
  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Master</span>
          <h2>Add Customer</h2>
          <p>The ERP will generate the 10-digit Account No. after save.</p>
        </div>
        <Link className="secondary-action secondary-action--light" href="/">
          Back to List
        </Link>
      </section>

      {error ? (
        <div className="form-alert">
          {error === "missing_required"
            ? "Customer name, account type, and business type are required."
            : decodeURIComponent(error)}
        </div>
      ) : null}

      <form action={saveAction} className="customer-form">
        <fieldset>
          <legend>Account</legend>
          <div className="form-grid">
            <label>
              Customer Name
              <input name="name" required />
            </label>
            <label>
              Legal Name
              <input name="legal_name" />
            </label>
            <label>
              Account Type
              <select name="account_type_id" required>
                <option value="">Select account type</option>
                {accountTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Business Type
              <select name="business_type_id" required>
                <option value="">Select business type</option>
                {businessTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue="active">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="credit_hold">Credit Hold</option>
              </select>
            </label>
            <label>
              Default Discount %
              <input
                defaultValue="0"
                min="0"
                name="default_discount_percent"
                step="0.01"
                type="number"
              />
            </label>
            <label>
              Legacy Account No.
              <input name="legacy_account_id" />
            </label>
            <label>
              State Resale Certificate No.
              <input name="state_resale_certificate_number" />
            </label>
            <label className="checkbox-label">
              <input name="is_sales_tax_exempt" type="checkbox" />
              Sales tax exempt
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Main Location / Address</legend>
          <p className="fieldset-note">
            Additional locations can be added from the customer Locations tab
            later.
          </p>
          <div className="form-grid">
            <label>
              Location Name
              <input
                name="location_name"
                placeholder="Main showroom, warehouse, billing office..."
              />
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
            <LocationRoleFields defaultBillingAddress defaultDefaultShipTo />
          </div>
        </fieldset>

        <fieldset>
          <legend>Contacts</legend>
          <div className="form-subsection">
            <h3>Main Location Contact</h3>
            <p>
              Additional location-specific contacts can be added from the
              customer Contacts tab later.
            </p>
          </div>
          <div className="form-grid">
            <label>
              Contact Name
              <input name="main_location_contact_name" required />
            </label>
            <label>
              Title
              <input name="main_location_contact_title" />
            </label>
            <label>
              Department
              <input name="main_location_contact_department" />
            </label>
            <label>
              Email
              <input name="main_location_contact_email" required type="email" />
            </label>
            <label>
              Phone
              <input name="main_location_contact_phone" required />
            </label>
            <label>
              Mobile
              <input name="main_location_contact_mobile" />
            </label>
            <div className="checkbox-cluster">
              <label className="checkbox-label">
                <input name="main_contact_is_purchasing" type="checkbox" />
                Purchasing Contact
              </label>
              <label className="checkbox-label">
                <input
                  name="main_contact_is_warehouse_receiver"
                  type="checkbox"
                />
                Warehouse receiver
              </label>
              <label className="checkbox-label">
                <input
                  name="main_contact_is_showroom_floor_sales"
                  type="checkbox"
                />
                Showroom floor sales
              </label>
              <label className="checkbox-label">
                <input
                  name="main_contact_is_showroom_manager"
                  type="checkbox"
                />
                Showroom manager
              </label>
            </div>
          </div>

          <div className="form-subsection">
            <h3>Billing Contact</h3>
            <p>
              This is the account-level billing contact used for invoice and AR
              email defaults.
            </p>
          </div>
          <div className="form-grid">
            <label>
              Contact Name
              <input name="billing_contact_name" required />
            </label>
            <label>
              Title
              <input name="billing_contact_title" />
            </label>
            <label>
              Department
              <input
                defaultValue="Accounting"
                name="billing_contact_department"
              />
            </label>
            <label>
              Email
              <input name="billing_contact_email" required type="email" />
            </label>
            <label>
              Phone
              <input name="billing_contact_phone" required />
            </label>
            <label>
              Mobile
              <input name="billing_contact_mobile" />
            </label>
          </div>
        </fieldset>

        <PaymentTermsCreditFields />

        <FreightTermsFields />

        <fieldset>
          <legend>Sales Rep / Territory</legend>
          <div className="form-grid">
            <label>
              Territory
              <select defaultValue="" name="territory_id">
                <option value="">Not assigned</option>
                {territoryOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sales Rep
              <select defaultValue="" name="sales_rep_selection">
                <option value="">Not assigned</option>
                {salesRepOptions.map((option) => (
                  <option
                    data-agency-id={option.agency_id}
                    key={option.id}
                    value={`${option.id}|${option.agency_id}`}
                  >
                    {option.name} / {option.agency_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Customer
          </button>
          <Link className="secondary-action secondary-action--light" href="/">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
