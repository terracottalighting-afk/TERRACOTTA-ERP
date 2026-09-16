import Link from "next/link";

import { LocationRegionFields } from "@/components/customers/location-region-fields";
import { LocationRoleFields } from "@/components/customers/location-role-fields";
import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

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
  coverage: {
    agencies: { id: string; name: string }[];
    reps: { agencyId: string; id: string; name: string }[];
    salesRepAgencyId: string | null;
    salesRepId: string | null;
  };
  location: LocationForEdit;
  primaryShowroom: unknown | null;
  territory: { id: string; name: string; territory_code: string } | null;
  territoryAssignmentSource: "auto" | "manual_unassigned";
  suggestedTerritory: { id: string; name: string; territory_code: string } | null;
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

  const freightAdmin = createSupabaseUntypedAdminClient();
  const [customer, locationData, freightLevelsResult, locationPolicyResult, accountPolicyResult, activeShowroomResult] = await Promise.all([
    loadCustomer(customerId),
    loadLocation(locationId),
    freightAdmin.from("freight_level").select("id, level_name, free_freight_allowance, freight_rate_percent").eq("is_active", true).order("sort_order", { ascending: true }).order("level_name", { ascending: true }),
    freightAdmin.from("customer_freight_policy").select("freight_level_id").eq("customer_account_id", customerId).eq("customer_location_id", locationId).eq("is_active", true).order("is_default", { ascending: false }).limit(1).maybeSingle(),
    freightAdmin.from("customer_freight_policy").select("freight_level_id").eq("customer_account_id", customerId).is("customer_location_id", null).eq("is_active", true).order("is_default", { ascending: false }).limit(1).maybeSingle(),
    freightAdmin.from("primary_showroom_enrollment").select("id").eq("customer_account_id", customerId).eq("customer_location_id", locationId).eq("program_status", "active").maybeSingle(),
  ]);
  const freightResultError = [freightLevelsResult, locationPolicyResult, accountPolicyResult, activeShowroomResult].find((result) => result.error)?.error;
  if (freightResultError) throw new Error(freightResultError.message);
  const {
    location,
    coverage,
    primaryShowroom,
    suggestedTerritory,
    territory,
    territoryAssignmentSource,
  } = locationData;
  const selectableTerritory = territory ?? suggestedTerritory;
  const defaultTerritoryId = territory?.id ?? (
    territoryAssignmentSource === "manual_unassigned" ? "" : suggestedTerritory?.id ?? ""
  );
  const freightLevels = freightLevelsResult.data ?? [];
  const accountFreightLevel = freightLevels.find((level) => level.id === accountPolicyResult.data?.freight_level_id) ?? null;
  const activePrimaryShowroom = Boolean(activeShowroomResult.data);

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
            <label>
              Assigned Territory
              <select defaultValue={defaultTerritoryId} name="territory_id">
                {selectableTerritory ? (
                  <option value={selectableTerritory.id}>
                    {selectableTerritory.territory_code} - {selectableTerritory.name}
                  </option>
                ) : null}
                <option value="">Not assigned</option>
              </select>
            </label>
            <label>
              Assigned Sales Agency
              <select
                defaultValue={coverage.salesRepAgencyId ?? ""}
                name="sales_rep_agency_id"
              >
                <option value="">Not assigned</option>
                {coverage.agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Assigned Sales Rep
              <select
                defaultValue={coverage.salesRepId ?? ""}
                name="sales_rep_id"
              >
                <option value="">Not assigned</option>
                {coverage.reps
                  .filter(
                    (rep) =>
                      !coverage.salesRepAgencyId ||
                      rep.agencyId === coverage.salesRepAgencyId,
                  )
                  .map((rep) => (
                    <option key={rep.id} value={rep.id}>
                      {rep.name}
                    </option>
                  ))}
              </select>
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
        {location.is_shipping_address ? <fieldset>
          <legend>Freight Terms</legend>
          <div className="form-grid">
            <label>
              Freight Level
              <select defaultValue={locationPolicyResult.data?.freight_level_id ?? ""} name="location_freight_level_id">
                <option value="">{activePrimaryShowroom ? "Use Level I (active primary showroom default)" : `Inherit account level${accountFreightLevel ? `: ${accountFreightLevel.level_name}` : ""}`}</option>
                {freightLevels.map((level) => <option key={level.id} value={level.id}>{level.level_name} - FFA ${Number(level.free_freight_allowance).toFixed(2)} / {Number(level.freight_rate_percent)}%</option>)}
              </select>
            </label>
          </div>
          <p className="fieldset-note">Choose a level to override the default for this shipping address. An active primary showroom defaults to Level I; other shipping addresses inherit the account freight level.</p>
        </fieldset> : null}
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
