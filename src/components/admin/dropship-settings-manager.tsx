"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui";

export function DropshipSettingsManager({
  error,
  isActive,
  ratePercent,
  residentialSurchargeActive,
  residentialSurchargeRatePercent,
  saveAction,
}: {
  error?: string;
  isActive: boolean;
  ratePercent: number;
  residentialSurchargeActive: boolean;
  residentialSurchargeRatePercent: number;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(Boolean(error));

  return (
    <section className="product-settings-manager">
      <div className="section-title product-settings-title">
        <div>
          <h3>Dropship Settings</h3>
          <p className="fieldset-note">
            Apply a percentage fee to manual Ship-to / Drop Ship orders.
          </p>
        </div>
      </div>
      {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
      {isEditing ? (
        <form action={saveAction} className="product-setting-editor">
          <fieldset>
            <legend>Edit Dropship Fee</legend>
            <div className="form-grid">
              <label>
                Dropship Rate (%)
                <input
                  defaultValue={ratePercent}
                  min="0"
                  name="dropship_rate_percent"
                  required
                  step="0.01"
                  type="number"
                />
              </label>
              <label className="checkbox-label">
                <input defaultChecked={isActive} name="is_active_dropship" type="checkbox" />
                Active Dropship
              </label>
              <label>
                Residential Surcharge Rate (%)
                <input defaultValue={residentialSurchargeRatePercent} min="0" name="residential_surcharge_rate_percent" required step="0.01" type="number" />
              </label>
              <label className="checkbox-label">
                <input defaultChecked={residentialSurchargeActive} name="is_residential_surcharge_active" type="checkbox" />
                Surcharge Active
              </label>
            </div>
            <p className="fieldset-note">
              When active, the fee is calculated from the order subtotal and from each shipment subtotal. Inactive settings do not add a Dropship Fee to new order acknowledgements or invoices.
            </p>
          </fieldset>
          <div className="form-actions">
            <button className="primary-action" type="submit">
              Save Dropship Settings
            </button>
            <button className="secondary-action secondary-action--light" onClick={() => setIsEditing(false)} type="button">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Setting</th><th>Value</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Dropship Rate</strong></td>
                <td>{ratePercent}%</td>
                <td><StatusBadge tone={isActive ? "good" : "warn"} value={isActive ? "Active" : "Inactive"} /></td>
                <td><button className="text-action text-action--button" onClick={() => setIsEditing(true)} type="button">Edit</button></td>
              </tr>
              <tr>
                <td><strong>Residential Surcharge Rate</strong></td>
                <td>{residentialSurchargeRatePercent}%</td>
                <td><StatusBadge tone={residentialSurchargeActive ? "good" : "warn"} value={residentialSurchargeActive ? "Active" : "Inactive"} /></td>
                <td><button className="text-action text-action--button" onClick={() => setIsEditing(true)} type="button">Edit</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
