"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui";

export function PurchasingSettingsManager({ commitment, error, saveAction, tariffRatePercent }: { commitment: string; error?: string; saveAction: (formData: FormData) => void | Promise<void>; tariffRatePercent: number }) {
  const [isEditing, setIsEditing] = useState(Boolean(error));

  return <section className="product-settings-manager">
    <div className="section-title product-settings-title"><div><h3>Purchasing Settings</h3><p className="fieldset-note">Controls default import-tariff planning and the vendor production-commitment language for purchase orders.</p></div></div>
    {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
    {isEditing ? <form action={saveAction} className="product-setting-editor"><fieldset><legend>Purchase Order Defaults</legend><div className="form-grid"><label>Import Tariff Rate (%)<input defaultValue={tariffRatePercent} max="100" min="0" name="import_tariff_rate_percent" required step="0.01" type="number" /></label><label>Vendor Production Commitment<textarea defaultValue={commitment} name="vendor_production_commitment" required rows={5} /></label></div><p className="fieldset-note">The tariff rate is used for expected import-cost planning. The commitment text is reserved for the purchase-order sheet.</p></fieldset><div className="form-actions"><button className="primary-action" type="submit">Save Purchasing Settings</button><button className="secondary-action secondary-action--light" onClick={() => setIsEditing(false)} type="button">Cancel</button></div></form> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Setting</th><th>Value</th><th>Status</th><th>Actions</th></tr></thead><tbody><tr><td><strong>Import Tariff Rate</strong></td><td>{tariffRatePercent}%</td><td><StatusBadge tone="good" value="Active" /></td><td><button className="text-action text-action--button" onClick={() => setIsEditing(true)} type="button">Edit</button></td></tr><tr><td><strong>Vendor Production Commitment</strong></td><td className="admin-long-value">{commitment}</td><td><StatusBadge tone="good" value="Active" /></td><td><button className="text-action text-action--button" onClick={() => setIsEditing(true)} type="button">Edit</button></td></tr></tbody></table></div>}
  </section>;
}
