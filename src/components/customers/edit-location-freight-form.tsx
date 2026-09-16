import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type CustomerName = {
  name: string;
};

type FreightLevel = {
  free_freight_allowance: number | string;
  freight_rate_percent: number | string;
  id: string;
  level_name: string;
};

export async function EditLocationFreightForm({
  customerId,
  error,
  loadCustomer,
  locationId,
  saveAction,
}: {
  customerId?: string;
  error?: string;
  loadCustomer: (customerId: string) => Promise<CustomerName>;
  locationId?: string;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!customerId || !locationId) {
    return (
      <ModulePlaceholder moduleName="Edit Freight Term requires a selected customer and shipping address" />
    );
  }

  const supabase = createSupabaseUntypedAdminClient();
  const [
    customer,
    locationResult,
    freightLevelsResult,
    locationPolicyResult,
    accountPolicyResult,
    primaryShowroomResult,
  ] = await Promise.all([
    loadCustomer(customerId),
    supabase
      .from("customer_location")
      .select("location_name, is_shipping_address")
      .eq("id", locationId)
      .eq("customer_account_id", customerId)
      .maybeSingle(),
    supabase
      .from("freight_level")
      .select("id, level_name, free_freight_allowance, freight_rate_percent")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("level_name", { ascending: true }),
    supabase
      .from("customer_freight_policy")
      .select("freight_level_id")
      .eq("customer_account_id", customerId)
      .eq("customer_location_id", locationId)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("customer_freight_policy")
      .select("freight_level_id")
      .eq("customer_account_id", customerId)
      .is("customer_location_id", null)
      .eq("is_active", true)
      .order("is_default", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("primary_showroom_enrollment")
      .select("id")
      .eq("customer_account_id", customerId)
      .eq("customer_location_id", locationId)
      .eq("program_status", "active")
      .maybeSingle(),
  ]);
  const lookupError = [
    locationResult,
    freightLevelsResult,
    locationPolicyResult,
    accountPolicyResult,
    primaryShowroomResult,
  ].find((result) => result.error)?.error;
  if (lookupError) throw new Error(lookupError.message);
  if (!locationResult.data?.is_shipping_address) {
    return <ModulePlaceholder moduleName="This location is not a saved shipping address" />;
  }

  const freightLevels = (freightLevelsResult.data ?? []) as FreightLevel[];
  const accountFreightLevel = freightLevels.find(
    (level) => level.id === accountPolicyResult.data?.freight_level_id,
  );
  const isActivePrimaryShowroom = Boolean(primaryShowroomResult.data);
  const defaultTerm = isActivePrimaryShowroom
    ? "Level I (active primary showroom default)"
    : accountFreightLevel
      ? `${accountFreightLevel.level_name} (inherited from account)`
      : "No freight level configured";

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Freight</span>
          <h2>Edit Freight Term</h2>
          <p>
            {customer.name} | {locationResult.data.location_name}
          </p>
        </div>
        <Link
          className="secondary-action secondary-action--light"
          href={`/?customer=${customerId}&tab=freight`}
        >
          Back to Freight
        </Link>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={saveAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <input name="location_id" type="hidden" value={locationId} />
        <fieldset>
          <legend>Freight Term</legend>
          <div className="form-grid">
            <label>
              Freight Level
              <select
                defaultValue={locationPolicyResult.data?.freight_level_id ?? ""}
                name="location_freight_level_id"
              >
                <option value="">Use default: {defaultTerm}</option>
                {freightLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.level_name} - FFA ${Number(level.free_freight_allowance).toFixed(2)} / {Number(level.freight_rate_percent)}%
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="fieldset-note">
            A saved level overrides the default for this shipping address. An active primary showroom uses Level I by default; other shipping addresses inherit the account freight level.
          </p>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Freight Term
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?customer=${customerId}&tab=freight`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
