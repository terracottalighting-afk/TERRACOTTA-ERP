import Link from "next/link";

import { BillingPaymentTermsFields } from "@/components/customers/billing-payment-terms-fields";
import { LocationRegionFields } from "@/components/customers/location-region-fields";
import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type CustomerAccount = {
  billing_email: string | null;
  name: string;
};

type BillingProfile = {
  credit_limit: number | null;
  default_statement_email: string | null;
  id: string;
  payment_days: number;
  payment_terms: string;
};

type BillingAddress = {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  country_code: string;
  id: string;
  location_name: string;
  postal_code: string | null;
  state_province: string | null;
};

type CustomerDashboardForBillingCredit = {
  billing: BillingProfile | null;
  customer: CustomerAccount;
};

export async function EditBillingCreditForm({
  customerId,
  error,
  loadCustomerDashboard,
  saveAction,
}: {
  customerId?: string;
  error?: string;
  loadCustomerDashboard: (
    customerId: string,
  ) => Promise<CustomerDashboardForBillingCredit>;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!customerId) {
    return (
      <ModulePlaceholder moduleName="Edit Billing / Credit requires a selected customer" />
    );
  }

  const dashboard = await loadCustomerDashboard(customerId);
  const customer = dashboard.customer;
  const billing = dashboard.billing;
  const supabase = createSupabaseAdminClient();
  const { data: billingAddress, error: billingAddressError } = await supabase
    .from("customer_location")
    .select(
      "id, location_name, address_line_1, address_line_2, city, state_province, postal_code, country_code",
    )
    .eq("customer_account_id", customerId)
    .eq("is_billing_address", true)
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (billingAddressError) {
    throw new Error(billingAddressError.message);
  }

  const address = billingAddress as BillingAddress | null;

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Account</span>
          <h2>Edit Billing / Credit</h2>
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
            ? "Customer is required."
            : decodeURIComponent(error)}
        </div>
      ) : null}

      <form action={saveAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <input
          name="billing_profile_id"
          type="hidden"
          value={billing?.id ?? ""}
        />
        <input
          name="billing_location_id"
          type="hidden"
          value={address?.id ?? ""}
        />
        <fieldset>
          <legend>Billing / Credit</legend>
          <div className="form-grid">
            <BillingPaymentTermsFields
              defaultPaymentDays={billing?.payment_days ?? 0}
              defaultPaymentTerms={
                billing?.payment_terms ?? "Prepaid / No Credit"
              }
            />
            <label>
              Credit Limit
              <input
                defaultValue={billing?.credit_limit ?? ""}
                min="0"
                name="credit_limit"
                placeholder="Blank uses system default"
                step="0.01"
                type="number"
              />
            </label>
            <label>
              Invoice Email
              <input
                defaultValue={
                  billing?.default_statement_email ??
                  customer.billing_email ??
                  ""
                }
                name="default_statement_email"
                type="email"
              />
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend>Billing Address</legend>
          <p className="fieldset-note">
            This address is available as a saved Bill-to address when entering
            or editing orders.
          </p>
          <div className="form-grid">
            <label>
              Billing Address Name
              <input
                defaultValue={address?.location_name ?? "Billing Address"}
                name="billing_location_name"
              />
            </label>
            <label>
              Address Line 1
              <input
                defaultValue={address?.address_line_1 ?? ""}
                name="address_line_1"
              />
            </label>
            <label>
              Address Line 2
              <input
                defaultValue={address?.address_line_2 ?? ""}
                name="address_line_2"
              />
            </label>
            <label>
              City
              <input defaultValue={address?.city ?? ""} name="city" />
            </label>
            <LocationRegionFields
              defaultCountryCode={address?.country_code ?? "USA"}
              defaultStateProvince={address?.state_province ?? ""}
            />
            <label>
              Postal Code
              <input
                defaultValue={address?.postal_code ?? ""}
                name="postal_code"
              />
            </label>
          </div>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Billing / Credit
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
