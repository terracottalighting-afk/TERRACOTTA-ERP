"use client";

import Link from "next/link";
import { useState } from "react";

type FreightLevelOption = {
  freeFreightAllowance: number;
  freightRatePercent: number;
  id: string;
  levelName: string;
};

type FreightPolicy = {
  dropship_freight_level_id?: string | null;
  dropship_freight_allowance_amount?: number | null;
  dropship_freight_rate_percent?: number | null;
  dropship_is_active?: boolean | null;
  dropship_rate_percent?: number | null;
  residential_surcharge_is_active?: boolean | null;
  residential_surcharge_rate_percent?: number | null;
};

export function EditDropshipSettingsForm({
  customerId,
  customerName,
  error,
  freightLevels,
  freightPolicy,
  saveAction,
}: {
  customerId: string;
  customerName: string;
  error?: string;
  freightLevels: FreightLevelOption[];
  freightPolicy: FreightPolicy | null;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  const [overrideDropship, setOverrideDropship] = useState(
    freightPolicy?.dropship_rate_percent !== null &&
      freightPolicy?.dropship_rate_percent !== undefined,
  );
  const [overrideResidential, setOverrideResidential] = useState(
    freightPolicy?.residential_surcharge_rate_percent !== null &&
      freightPolicy?.residential_surcharge_rate_percent !== undefined,
  );
  const initialFreightLevel = freightPolicy?.dropship_freight_level_id ??
    (freightPolicy?.dropship_freight_allowance_amount !== null &&
    freightPolicy?.dropship_freight_allowance_amount !== undefined &&
    freightPolicy?.dropship_freight_rate_percent !== null &&
    freightPolicy?.dropship_freight_rate_percent !== undefined
      ? "custom"
      : "");
  const [dropshipFreightLevel, setDropshipFreightLevel] = useState(initialFreightLevel);

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Freight</span>
          <h2>Edit Dropship Settings</h2>
          <p>{customerName}</p>
        </div>
        <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}&tab=freight`}>
          Back to Account
        </Link>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <form action={saveAction} className="customer-form dropship-settings-editor">
        <input name="customer_id" type="hidden" value={customerId} />

        <fieldset className="dropship-override-panel">
          <legend>Dropship Fee</legend>
          <div className="dropship-override-heading">
            <label className="settings-toggle">
              <input checked={overrideDropship} name="override_dropship_settings" onChange={(event) => setOverrideDropship(event.target.checked)} type="checkbox" />
              Use account-level Dropship Fee override
            </label>
            <p>When off, the admin Dropship Rate setting applies.</p>
          </div>
          <div className="dropship-override-fields dropship-override-fields--single">
            <label>
              Dropship Rate (%)
              <input defaultValue={freightPolicy?.dropship_rate_percent?.toString() ?? ""} disabled={!overrideDropship} min="0" name="dropship_rate_percent" required={overrideDropship} step="0.01" type="number" />
            </label>
          </div>
        </fieldset>

        <fieldset className="dropship-override-panel">
          <legend>Residential Surcharge</legend>
          <div className="dropship-override-heading">
            <label className="settings-toggle">
              <input checked={overrideResidential} name="override_residential_surcharge" onChange={(event) => setOverrideResidential(event.target.checked)} type="checkbox" />
              Use account-level Residential Surcharge override
            </label>
            <p>When off, the admin Residential Surcharge Rate setting applies.</p>
          </div>
          <div className="dropship-override-fields dropship-override-fields--single">
            <label>
              Residential Surcharge Rate (%)
              <input defaultValue={freightPolicy?.residential_surcharge_rate_percent?.toString() ?? ""} disabled={!overrideResidential} min="0" name="residential_surcharge_rate_percent" required={overrideResidential} step="0.01" type="number" />
            </label>
          </div>
        </fieldset>

        <fieldset className="dropship-override-panel">
          <legend>Dropship Freight Level</legend>
          <div className="dropship-level-field">
            <label>
              Freight Level
              <select name="dropship_freight_level_id" onChange={(event) => setDropshipFreightLevel(event.target.value)} value={dropshipFreightLevel}>
                <option value="">Use Account Freight Level</option>
                {freightLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.levelName} - FFA ${level.freeFreightAllowance.toFixed(2)} / {level.freightRatePercent}%
                  </option>
                ))}
                <option value="custom">Custom</option>
              </select>
            </label>
            <p>Use a different level only when Dropship orders need a separate freight allowance or rate.</p>
          </div>
          {dropshipFreightLevel === "custom" ? (
            <div className="dropship-override-fields">
              <label>
                Custom FFA Amount
                <input defaultValue={freightPolicy?.dropship_freight_allowance_amount?.toString() ?? ""} min="0" name="custom_dropship_freight_allowance_amount" required step="0.01" type="number" />
              </label>
              <label>
                Custom Freight Rate (%)
                <input defaultValue={freightPolicy?.dropship_freight_rate_percent?.toString() ?? ""} min="0" name="custom_dropship_freight_rate_percent" required step="0.01" type="number" />
              </label>
            </div>
          ) : null}
        </fieldset>

        <div className="form-actions">
          <button className="primary-action" type="submit">Save Dropship Settings</button>
          <Link className="secondary-action secondary-action--light" href={`/?customer=${customerId}&tab=freight`}>Cancel</Link>
        </div>
      </form>
    </section>
  );
}
