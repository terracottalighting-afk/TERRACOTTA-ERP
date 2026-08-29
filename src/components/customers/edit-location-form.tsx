import Link from "next/link";

import { LocationRegionFields } from "@/components/customers/location-region-fields";
import { LocationRoleFields } from "@/components/customers/location-role-fields";
import { ModulePlaceholder } from "@/components/ui";

type CustomerName = {
  name: string;
};

type LocationForEdit = {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  country_code: string;
  email: string | null;
  is_billing_address?: boolean;
  is_default_ship_to: boolean;
  is_shipping_address: boolean;
  is_showroom: boolean;
  location_name: string;
  postal_code: string | null;
  state_province: string | null;
  status: string;
};

type LocationEditData = {
  location: LocationForEdit;
  primaryShowroom: unknown | null;
};

export async function EditLocationForm({
  customerId,
  error,
  loadCustomer,
  loadLocation,
  locationId,
  saveAction,
}: {
  customerId?: string;
  error?: string;
  loadCustomer: (customerId: string) => Promise<CustomerName>;
  loadLocation: (locationId: string) => Promise<LocationEditData>;
  locationId?: string;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!customerId || !locationId) {
    return (
      <ModulePlaceholder moduleName="Edit Location requires a selected customer and location" />
    );
  }

  const [customer, locationData] = await Promise.all([
    loadCustomer(customerId),
    loadLocation(locationId),
  ]);
  const { location, primaryShowroom } = locationData;

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Location</span>
          <h2>{location.location_name}</h2>
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
        <input name="location_id" type="hidden" value={locationId} />
        <fieldset>
          <legend>Location / Address</legend>
          <div className="form-grid">
            <label>
              Location Name
              <input
                defaultValue={location.location_name}
                name="location_name"
                required
              />
            </label>
            <label>
              Status
              <select defaultValue={location.status} name="status">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label>
              Location Contact Email
              <input
                defaultValue={location.email ?? ""}
                name="location_contact_email"
                type="email"
              />
            </label>
            <label>
              Address Line 1
              <input
                defaultValue={location.address_line_1 ?? ""}
                name="address_line_1"
              />
            </label>
            <label>
              Address Line 2
              <input
                defaultValue={location.address_line_2 ?? ""}
                name="address_line_2"
              />
            </label>
            <label>
              City
              <input defaultValue={location.city ?? ""} name="city" />
            </label>
            <LocationRegionFields
              defaultCountryCode={location.country_code}
              defaultStateProvince={location.state_province ?? ""}
            />
            <label>
              Postal Code
              <input
                defaultValue={location.postal_code ?? ""}
                name="postal_code"
              />
            </label>
            <LocationRoleFields
              defaultBillingAddress={Boolean(location.is_billing_address)}
              defaultDefaultShipTo={location.is_default_ship_to}
              defaultPrimaryShowroom={Boolean(primaryShowroom)}
              defaultShippingAddress={location.is_shipping_address}
              defaultShowroom={location.is_showroom}
            />
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
