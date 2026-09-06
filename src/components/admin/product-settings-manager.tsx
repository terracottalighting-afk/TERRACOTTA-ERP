"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui";

type FormAction = (formData: FormData) => Promise<void>;
type SettingType = "brand" | "category" | "finish" | "part_role" | "suite";
type Brand = { id: string; brand_code: string; name: string; legal_company_name: string | null; is_active: boolean };
type Category = { id: string; category_code: string; name: string; is_active: boolean };
type Suite = { id: string; suite_code: string; name: string; description: string | null; brand_id: string | null; is_active: boolean };
type Finish = { id: string; finish_name: string; description: string | null; is_active: boolean };
type PartRole = { id: string; role_code: string; name: string; sort_order: number; is_active: boolean };

const settingLabels: Record<SettingType, string> = {
  brand: "Brands",
  category: "Product Types",
  finish: "Finishes",
  part_role: "Part Roles",
  suite: "Styles / Suites",
};

const settingSingularLabels: Record<SettingType, string> = {
  brand: "Brand",
  category: "Product Type",
  finish: "Finish",
  part_role: "Part Role",
  suite: "Style / Suite",
};

const settingTypes: SettingType[] = ["category", "part_role", "suite", "brand", "finish"];

export function ProductSettingsManager({ brands, categories, deactivateAction, error, finishes, partRoles, saveAction, suites }: { brands: Brand[]; categories: Category[]; deactivateAction: FormAction; error?: string; finishes: Finish[]; partRoles: PartRole[]; saveAction: FormAction; suites: Suite[] }) {
  const [settingType, setSettingType] = useState<SettingType>("category");
  const [showDeactivated, setShowDeactivated] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [pendingDeactivate, setPendingDeactivate] = useState<{ id: string; label: string } | null>(null);
  const records = settingType === "brand" ? brands : settingType === "category" ? categories : settingType === "part_role" ? partRoles : settingType === "suite" ? suites : finishes;
  const visibleRecords = records.filter((record) => record.is_active !== showDeactivated);
  const activeCount = records.filter((record) => record.is_active).length;
  const deactivatedCount = records.length - activeCount;
  const editingRecord = useMemo(() => records.find((record) => record.id === editingId) ?? null, [editingId, records]);
  const openEditor = (recordId?: string) => { setEditingId(recordId ?? null); setShowEditor(true); };
  const closeEditor = () => { setEditingId(null); setShowEditor(false); };

  return <section className="product-settings-manager">
    <div aria-label="Product configuration types" className="metric-grid product-settings-tabs" role="tablist">
      {settingTypes.map((type) => {
        const count = (type === "brand" ? brands : type === "category" ? categories : type === "part_role" ? partRoles : type === "suite" ? suites : finishes).filter((record) => record.is_active).length;
        return <button aria-selected={settingType === type} className={`metric product-settings-tab${settingType === type ? " product-settings-tab--active" : ""}`} key={type} onClick={() => { setSettingType(type); setShowDeactivated(false); closeEditor(); }} role="tab" type="button"><span>{settingLabels[type]}</span><strong>{count}</strong></button>;
      })}
    </div>
    <div className="section-title product-settings-title"><div><h3>{settingLabels[settingType]}</h3><p className="fieldset-note">{showDeactivated ? "Deactivated values are retained for history and cannot be selected for future products." : "Active values are available throughout Product Master."}</p></div><div className="section-actions"><button className={`text-action text-action--button${!showDeactivated ? " text-action--active" : ""}`} onClick={() => { setShowDeactivated(false); closeEditor(); }} type="button">Active ({activeCount})</button><button className={`text-action text-action--button${showDeactivated ? " text-action--active" : ""}`} onClick={() => { setShowDeactivated(true); closeEditor(); }} type="button">Deactivated ({deactivatedCount})</button>{!showDeactivated ? <button className="small-action" onClick={() => openEditor()} type="button">Add {settingSingularLabels[settingType]}</button> : null}</div></div>
    {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
    {showEditor && !showDeactivated ? <ProductSettingEditor brands={brands.filter((brand) => brand.is_active)} onCancel={closeEditor} record={editingRecord} saveAction={saveAction} settingType={settingType} /> : null}
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Code</th><th>Name</th><th>Details</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visibleRecords.map((record) => <ConfigurationRow brands={brands} key={record.id} onDeactivate={() => setPendingDeactivate({ id: record.id, label: recordName(settingType, record) })} onEdit={() => openEditor(record.id)} record={record} settingType={settingType} />)}{visibleRecords.length === 0 ? <tr><td colSpan={5}>No {showDeactivated ? "deactivated" : "active"} {settingLabels[settingType].toLowerCase()} have been configured.</td></tr> : null}</tbody></table></div>
    {pendingDeactivate ? <dialog className="confirmation-dialog" open><form action={deactivateAction}><h3>Deactivate {settingSingularLabels[settingType]}</h3><p>Are you sure you want to deactivate <strong>{pendingDeactivate.label}</strong>?</p><ul><li>This value will no longer be available for future product setup.</li><li>Existing products and historical transactions retain their current value.</li><li>This action does not delete any data.</li></ul><input name="configuration_type" type="hidden" value={settingType} /><input name="configuration_id" type="hidden" value={pendingDeactivate.id} /><div className="form-actions"><button className="danger-action" type="submit">Confirm Deactivation</button><button className="secondary-action secondary-action--light" onClick={() => setPendingDeactivate(null)} type="button">Cancel</button></div></form></dialog> : null}
  </section>;
}

function ConfigurationRow({ brands, onDeactivate, onEdit, record, settingType }: { brands: Brand[]; onDeactivate: () => void; onEdit: () => void; record: Brand | Category | Suite | Finish | PartRole; settingType: SettingType }) {
  const active = record.is_active;
  const code = settingType === "brand" ? (record as Brand).brand_code : settingType === "category" ? (record as Category).category_code : settingType === "part_role" ? (record as PartRole).role_code : settingType === "suite" ? (record as Suite).suite_code : "-";
  const name = recordName(settingType, record);
  const detail = settingType === "brand" ? (record as Brand).legal_company_name ?? "-" : settingType === "part_role" ? `Display order: ${(record as PartRole).sort_order}` : settingType === "suite" ? [((record as Suite).brand_id ? brands.find((brand) => brand.id === (record as Suite).brand_id)?.name ?? "Brand not set" : "All brands"), (record as Suite).description].filter(Boolean).join(" - ") || "-" : settingType === "finish" ? (record as Finish).description ?? "-" : "-";
  return <tr key={record.id}><td>{code}</td><td><strong>{name}</strong></td><td>{detail}</td><td><StatusBadge tone={active ? "good" : "warn"} value={active ? "Active" : "Deactivated"} /></td><td><div className="admin-hierarchy-links"><button className="text-action text-action--button" onClick={onEdit} type="button">Edit</button>{active ? <button className="text-action text-action--button text-action--danger" onClick={onDeactivate} type="button">Deactivate</button> : null}</div></td></tr>;
}

function ProductSettingEditor({ brands, onCancel, record, saveAction, settingType }: { brands: Brand[]; onCancel: () => void; record: Brand | Category | Suite | Finish | PartRole | null; saveAction: FormAction; settingType: SettingType }) {
  const editing = Boolean(record);
  const code = settingType === "brand" ? (record as Brand | null)?.brand_code ?? "" : settingType === "category" ? (record as Category | null)?.category_code ?? "" : settingType === "part_role" ? (record as PartRole | null)?.role_code ?? "" : settingType === "suite" ? (record as Suite | null)?.suite_code ?? "" : "";
  const name = settingType === "finish" ? (record as Finish | null)?.finish_name ?? "" : recordName(settingType, record);
  return <form action={saveAction} className="product-setting-editor"><input name="configuration_type" type="hidden" value={settingType} />{editing ? <input name="configuration_id" type="hidden" value={record?.id ?? ""} /> : null}<fieldset><legend>{editing ? `Edit ${settingSingularLabels[settingType]}` : `Add ${settingSingularLabels[settingType]}`}</legend><div className="form-grid">{settingType !== "finish" ? <label>Code<input defaultValue={code} name="code" required /></label> : null}<label>{settingType === "finish" ? "Finish Name" : "Name"}<input defaultValue={name} name="name" required /></label>{settingType === "part_role" ? <label>Display Order<input defaultValue={(record as PartRole | null)?.sort_order ?? 100} min="0" name="sort_order" type="number" required /></label> : null}{settingType === "brand" ? <label>Legal Company Name<input defaultValue={(record as Brand | null)?.legal_company_name ?? ""} name="legal_company_name" /></label> : null}{settingType === "suite" ? <label>Brand<select defaultValue={(record as Suite | null)?.brand_id ?? ""} name="brand_id"><option value="">All brands</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label> : null}{settingType === "suite" || settingType === "finish" ? <label>Description<textarea defaultValue={settingType === "suite" ? (record as Suite | null)?.description ?? "" : (record as Finish | null)?.description ?? ""} name="description" /></label> : null}</div></fieldset><div className="form-actions"><button className="primary-action" type="submit">{editing ? "Save Changes" : `Create ${settingSingularLabels[settingType]}`}</button><button className="secondary-action secondary-action--light" onClick={onCancel} type="button">Cancel</button></div></form>;
}

function recordName(settingType: SettingType, record: Brand | Category | Suite | Finish | PartRole | null) {
  if (!record) return "";
  return settingType === "finish" ? (record as Finish).finish_name : (record as Brand | Category | Suite | PartRole).name;
}
