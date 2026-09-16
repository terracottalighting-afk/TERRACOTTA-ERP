"use client";

import { useEffect, useRef, useState } from "react";
import { StatusBadge } from "@/components/ui";

type FormAction = (formData: FormData) => Promise<void>;

type FreightCarrier = {
  carrier_name: string;
  contact_email: string | null;
  contact_name: string | null;
  freight_type: "small_parcel_ground" | "ltl" | "sea_freight";
  id: string;
  is_active: boolean;
  website: string | null;
};

const freightTypeLabel: Record<FreightCarrier["freight_type"], string> = {
  small_parcel_ground: "Small Parcel / Ground",
  ltl: "LTL",
  sea_freight: "Sea Freight",
};

export function FreightCarrierManager({ carriers, error, saveAction }: { carriers: FreightCarrier[]; error?: string; saveAction: FormAction }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hasEditedForm, setHasEditedForm] = useState(false);
  const signature = carriers.map((carrier) => `${carrier.id}:${carrier.carrier_name}:${carrier.freight_type}:${carrier.is_active}`).join("|");
  const previousSignature = useRef(signature);
  useEffect(() => {
    if (previousSignature.current === signature) return;
    previousSignature.current = signature;
    setEditingId(null);
    setHasEditedForm(false);
  }, [signature]);

  return <section className="product-settings-manager">
    <div className="section-title product-settings-title">
      <div><h3>Freight Carriers</h3><p className="fieldset-note">Maintain the carriers available when creating shipments.</p></div>
      <div className="section-actions"><button className="small-action" onClick={() => { setEditingId("new"); setHasEditedForm(false); }} type="button">Add Freight Carrier</button></div>
    </div>
    {error && !hasEditedForm ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
    {editingId ? <FreightCarrierEditor carrier={carriers.find((carrier) => carrier.id === editingId) ?? null} onCancel={() => setEditingId(null)} onEdit={() => setHasEditedForm(true)} onSubmit={() => setHasEditedForm(false)} saveAction={saveAction} /> : null}
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Carrier Name</th><th>Freight Type</th><th>Contact</th><th>Website</th><th>Status</th><th>Actions</th></tr></thead><tbody>
      {carriers.filter((carrier) => carrier.is_active).map((carrier) => <tr className={editingId === carrier.id ? "admin-row-selected" : undefined} key={carrier.id}>
        <td><strong>{carrier.carrier_name}</strong></td><td>{freightTypeLabel[carrier.freight_type]}</td><td>{carrier.contact_name || "-"}{carrier.contact_email ? <><br />{carrier.contact_email}</> : null}</td><td>{carrier.website ? <a className="text-action" href={carrier.website} rel="noreferrer" target="_blank">{carrier.website}</a> : "-"}</td><td><StatusBadge tone="good" value="Active" /></td><td><button className="text-action text-action--button" onClick={() => { setEditingId(carrier.id); setHasEditedForm(false); }} type="button">Edit</button></td>
      </tr>)}
      {!carriers.some((carrier) => carrier.is_active) ? <tr><td colSpan={6}>No freight carriers have been configured.</td></tr> : null}
    </tbody></table></div>
  </section>;
}

function FreightCarrierEditor({ carrier, onCancel, onEdit, onSubmit, saveAction }: { carrier: FreightCarrier | null; onCancel: () => void; onEdit: () => void; onSubmit: () => void; saveAction: FormAction }) {
  return <form action={saveAction} className="product-setting-editor" onInput={onEdit} onSubmit={onSubmit}>
    {carrier ? <input name="freight_carrier_id" type="hidden" value={carrier.id} /> : null}
    <fieldset><legend>{carrier ? "Edit Freight Carrier" : "Add Freight Carrier"}</legend><div className="form-grid">
      <label>Carrier Name<input defaultValue={carrier?.carrier_name ?? ""} name="carrier_name" required /></label>
      <label>Freight Type<select defaultValue={carrier?.freight_type ?? "small_parcel_ground"} name="freight_type"><option value="small_parcel_ground">Small Parcel / Ground</option><option value="ltl">LTL</option><option value="sea_freight">Sea Freight</option></select></label>
      <label>Contact Name<input defaultValue={carrier?.contact_name ?? ""} name="contact_name" /></label>
      <label>Contact Email<input defaultValue={carrier?.contact_email ?? ""} name="contact_email" type="email" /></label>
      <label className="full-width-field">Website<input defaultValue={carrier?.website ?? ""} name="website" placeholder="https://example.com" type="url" /></label>
      <label className="checkbox-label"><input defaultChecked={carrier?.is_active ?? true} name="is_active" type="checkbox" /> Active freight carrier</label>
    </div></fieldset>
    <div className="form-actions"><button className="primary-action" type="submit">{carrier ? "Save Freight Carrier" : "Create Freight Carrier"}</button><button className="secondary-action secondary-action--light" onClick={onCancel} type="button">Cancel</button></div>
  </form>;
}
