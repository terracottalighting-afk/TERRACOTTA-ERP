import Link from "next/link";

import { FreightTermsFields } from "@/components/customers/customer-terms-fields";
import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type CustomerName = {
  name: string;
};

type FreightPolicy = {
  default_ground_carrier?: string | null;
  default_ground_carrier_account_number?: string | null;
  default_ltl_carrier?: string | null;
  default_ltl_carrier_account_number?: string | null;
  flat_rate_percent?: number | null;
  freight_allowance_amount?: number | null;
  freight_level_id?: string | null;
  freight_terms?: string;
  id?: string;
  ltl_freight_terms: string;
};

export async function EditFreightForm({
  customerId,
  error,
  loadCustomer,
  loadFreightPolicy,
  saveAction,
}: {
  customerId?: string;
  error?: string;
  loadCustomer: (customerId: string) => Promise<CustomerName>;
  loadFreightPolicy: (customerId: string) => Promise<FreightPolicy | null>;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!customerId) {
    return (
      <ModulePlaceholder moduleName="Edit Freight requires a selected customer" />
    );
  }

  const [customer, freightPolicy, freightLevelsResult] = await Promise.all([
    loadCustomer(customerId),
    loadFreightPolicy(customerId),
    createSupabaseUntypedAdminClient().from("freight_level").select("id, level_name, free_freight_allowance, freight_rate_percent").eq("is_active", true).order("sort_order", { ascending: true }).order("level_name", { ascending: true }),
  ]);
  if (freightLevelsResult.error) throw new Error(freightLevelsResult.error.message);
  const freightTerms =
    freightPolicy?.freight_terms ??
    freightPolicy?.ltl_freight_terms ??
    "prepaid";

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Freight</span>
          <h2>Edit Freight Terms</h2>
          <p>{customer.name}</p>
        </div>
        <Link
          className="secondary-action secondary-action--light"
          href={`/?customer=${customerId}&tab=freight`}
        >
          Back to Account
        </Link>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}

      <form action={saveAction} className="customer-form">
        <input name="customer_id" type="hidden" value={customerId} />
        <input
          name="freight_policy_id"
          type="hidden"
          value={freightPolicy?.id ?? ""}
        />
        <FreightTermsFields
          defaultFlatRatePercent={
            freightPolicy?.flat_rate_percent?.toString() ?? ""
          }
          defaultFreightAllowance={
            freightPolicy?.freight_allowance_amount?.toString() ?? ""
          }
          defaultFreightLevelId={
            freightPolicy?.freight_level_id ??
            (freightPolicy?.freight_allowance_amount !== null &&
            freightPolicy?.freight_allowance_amount !== undefined &&
            freightPolicy?.flat_rate_percent !== null &&
            freightPolicy?.flat_rate_percent !== undefined
              ? "custom"
              : "")
          }
          defaultFreightTerms={freightTerms}
          defaultGroundCollectAccount={
            freightPolicy?.default_ground_carrier_account_number ?? ""
          }
          defaultGroundCollectCarrier={
            freightPolicy?.default_ground_carrier ?? ""
          }
          defaultLtlCollectAccount={
            freightPolicy?.default_ltl_carrier_account_number ?? ""
          }
          defaultLtlCollectCarrier={freightPolicy?.default_ltl_carrier ?? ""}
          freightLevels={(freightLevelsResult.data ?? []).map((level) => ({ id: level.id, levelName: level.level_name, freeFreightAllowance: Number(level.free_freight_allowance), freightRatePercent: Number(level.freight_rate_percent) }))}
        />
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Freight Terms
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
