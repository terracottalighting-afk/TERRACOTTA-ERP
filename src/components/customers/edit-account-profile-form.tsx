import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";

type CustomerAccount = {
  account_type_id: string;
  business_type_id: string;
  default_discount_percent: number;
  is_sales_tax_exempt: boolean;
  legal_name: string | null;
  name: string;
  state_resale_certificate_number?: string | null;
  status: string;
};

type SelectOption = {
  id: string;
  name: string;
};

type CustomerDashboardForAccountProfile = {
  customer: CustomerAccount;
};

export async function EditAccountProfileForm({
  accountTypeOptions,
  businessTypeOptions,
  customerId,
  error,
  loadCustomerDashboard,
  saveAction,
}: {
  accountTypeOptions: SelectOption[];
  businessTypeOptions: SelectOption[];
  customerId?: string;
  error?: string;
  loadCustomerDashboard: (
    customerId: string,
  ) => Promise<CustomerDashboardForAccountProfile>;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!customerId) {
    return (
      <ModulePlaceholder moduleName="Edit Account Profile requires a selected customer" />
    );
  }

  const dashboard = await loadCustomerDashboard(customerId);
  const customer = dashboard.customer;

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Account</span>
          <h2>Edit Account Profile</h2>
          <p>{customer.name}</p>
        </div>
        <Link
          className="secondary-action secondary-action--light"
          href={`/?customer=${customerId}`}
        >
          Back to Account
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
        <input name="customer_id" type="hidden" value={customerId} />
        <fieldset>
          <legend>Account Profile</legend>
          <div className="form-grid">
            <label>
              Customer Name
              <input defaultValue={customer.name} name="name" required />
            </label>
            <label>
              Legal Name
              <input
                defaultValue={customer.legal_name ?? ""}
                name="legal_name"
              />
            </label>
            <label>
              Status
              <select defaultValue={customer.status} name="status">
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="credit_hold">Credit Hold</option>
                <option value="obsolete">Obsolete</option>
              </select>
            </label>
            <label>
              Account Type
              <select
                defaultValue={customer.account_type_id}
                name="account_type_id"
                required
              >
                {accountTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Business Type
              <select
                defaultValue={customer.business_type_id}
                name="business_type_id"
                required
              >
                {businessTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Default Discount %
              <input
                defaultValue={customer.default_discount_percent}
                min="0"
                name="default_discount_percent"
                step="0.01"
                type="number"
              />
            </label>
            <label>
              State Resale Certificate No.
              <input
                defaultValue={customer.state_resale_certificate_number ?? ""}
                name="state_resale_certificate_number"
              />
            </label>
            <label className="checkbox-label">
              <input
                defaultChecked={customer.is_sales_tax_exempt}
                name="is_sales_tax_exempt"
                type="checkbox"
              />
              Sales tax exempt
            </label>
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Account Profile
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?customer=${customerId}`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
