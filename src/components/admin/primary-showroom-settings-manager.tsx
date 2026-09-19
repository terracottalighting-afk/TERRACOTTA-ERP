"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui";

export function PrimaryShowroomSettingsManager({ error, periodMonths, saveAction }: { error?: string; periodMonths: number; saveAction: (formData: FormData) => void | Promise<void> }) {
  const [isEditing, setIsEditing] = useState(Boolean(error));
  return <section className="product-settings-manager">
    <div className="section-title product-settings-title"><div><h3>Primary Showroom Settings</h3><p className="fieldset-note">Controls how far back users can search shipped POs when importing primary showroom displays.</p></div></div>
    {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
    {isEditing ? <form action={saveAction} className="product-setting-editor"><fieldset><legend>BackTrack_Display_PO_Period</legend><div className="form-grid"><label>Backtrack Display PO Period (Months)<input defaultValue={periodMonths} min="1" name="backtrack_display_po_period_months" required step="1" type="number" /></label></div><p className="fieldset-note">Shipped POs from this number of prior months are available for selection. The default is 12 months.</p></fieldset><div className="form-actions"><button className="primary-action" type="submit">Save Primary Showroom Settings</button><button className="secondary-action secondary-action--light" onClick={() => setIsEditing(false)} type="button">Cancel</button></div></form> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Setting</th><th>Value</th><th>Status</th><th>Actions</th></tr></thead><tbody><tr><td><strong>BackTrack_Display_PO_Period</strong></td><td>{periodMonths} months</td><td><StatusBadge tone="good" value="Active" /></td><td><button className="text-action text-action--button" onClick={() => setIsEditing(true)} type="button">Edit</button></td></tr></tbody></table></div>}
  </section>;
}
