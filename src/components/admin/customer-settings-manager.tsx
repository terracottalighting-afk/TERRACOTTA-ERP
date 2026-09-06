"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui";

type FormAction = (formData: FormData) => Promise<void>;
type SettingType = "account_type" | "business_type" | "status";
type Setting = { id: string; type_code: string; name: string; description: string | null; is_active: boolean; is_rep_type?: boolean };

const labels: Record<SettingType, { plural: string; singular: string }> = {
  account_type: { plural: "Account Types", singular: "Account Type" },
  business_type: { plural: "Business Types", singular: "Business Type" },
  status: { plural: "Customer Statuses", singular: "Customer Status" },
};

export function CustomerSettingsManager({ accountTypes, businessTypes, deactivateAction, error, saveAction, statuses }: { accountTypes: Setting[]; businessTypes: Setting[]; deactivateAction: FormAction; error?: string; saveAction: FormAction; statuses: Setting[] }) {
  const [settingType, setSettingType] = useState<SettingType>("account_type");
  const [showInactive, setShowInactive] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const records = settingType === "account_type" ? accountTypes : settingType === "business_type" ? businessTypes : statuses;
  const visibleRecords = records.filter((record) => record.is_active !== showInactive);
  const editingRecord = records.find((record) => record.id === editingId) ?? null;
  const selectType = (type: SettingType) => { setSettingType(type); setShowInactive(false); setEditingId(null); };

  return <section className="product-settings-manager">
    <div aria-label="Customer configuration types" className="metric-grid product-settings-tabs customer-settings-tabs" role="tablist">{(["account_type", "business_type", "status"] as SettingType[]).map((type) => <button aria-selected={settingType === type} className={`metric product-settings-tab${settingType === type ? " product-settings-tab--active" : ""}`} key={type} onClick={() => selectType(type)} role="tab" type="button"><span>{labels[type].plural}</span><strong>{(type === "account_type" ? accountTypes : type === "business_type" ? businessTypes : statuses).filter((record) => record.is_active).length}</strong></button>)}</div>
    <div className="section-title product-settings-title"><div><h3>{labels[settingType].plural}</h3><p className="fieldset-note">Active values are available when creating and maintaining customer accounts.</p></div><div className="section-actions"><button className={`text-action text-action--button${!showInactive ? " text-action--active" : ""}`} onClick={() => { setShowInactive(false); setEditingId(null); }} type="button">Active ({records.filter((record) => record.is_active).length})</button><button className={`text-action text-action--button${showInactive ? " text-action--active" : ""}`} onClick={() => { setShowInactive(true); setEditingId(null); }} type="button">Inactive ({records.filter((record) => !record.is_active).length})</button><button className="small-action" onClick={() => { setEditingId("new"); setShowInactive(false); }} type="button">Add {labels[settingType].singular}</button></div></div>
    {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
    {editingId && !showInactive ? <CustomerSettingEditor onCancel={() => setEditingId(null)} record={editingRecord} saveAction={saveAction} settingType={settingType} /> : null}
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Code</th><th>Name</th><th>Details</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visibleRecords.map((record) => <tr className={editingId === record.id ? "admin-row-selected" : undefined} key={record.id}><td>{record.type_code}</td><td><strong>{record.name}</strong></td><td>{record.description ?? "-"}{settingType === "account_type" && record.is_rep_type ? " Rep account type" : ""}</td><td><StatusBadge tone={record.is_active ? "good" : "warn"} value={record.is_active ? "Active" : "Inactive"} /></td><td><button className="text-action text-action--button" onClick={() => { setEditingId(record.id); setShowInactive(false); }} type="button">Edit</button>{record.is_active ? <form className="inline-form" action={deactivateAction}><input name="configuration_id" type="hidden" value={record.id} /><input name="configuration_type" type="hidden" value={settingType} /><button className="text-action text-action--button text-action--danger" type="submit">Deactivate</button></form> : null}</td></tr>)}{visibleRecords.length === 0 ? <tr><td colSpan={5}>No {showInactive ? "inactive" : "active"} {labels[settingType].plural.toLowerCase()} have been configured.</td></tr> : null}</tbody></table></div>
  </section>;
}

function CustomerSettingEditor({ onCancel, record, saveAction, settingType }: { onCancel: () => void; record: Setting | null; saveAction: FormAction; settingType: SettingType }) {
  const isNew = !record;
  return <form action={saveAction} className="product-setting-editor"><input name="configuration_type" type="hidden" value={settingType} />{record ? <input name="configuration_id" type="hidden" value={record.id} /> : null}<fieldset><legend>{isNew ? `Add ${labels[settingType].singular}` : `Edit ${labels[settingType].singular}`}</legend><div className="form-grid"><label>Code<input defaultValue={record?.type_code ?? ""} name="code" required /></label><label>Name<input defaultValue={record?.name ?? ""} name="name" required /></label><label className="full-width-field">Description<textarea defaultValue={record?.description ?? ""} name="description" /></label>{settingType === "account_type" ? <label className="checkbox-label"><input defaultChecked={record?.is_rep_type ?? false} name="is_rep_type" type="checkbox" />Sales rep account type</label> : null}</div></fieldset><div className="form-actions"><button className="primary-action" type="submit">{isNew ? `Create ${labels[settingType].singular}` : "Save Changes"}</button><button className="secondary-action secondary-action--light" onClick={onCancel} type="button">Cancel</button></div></form>;
}
