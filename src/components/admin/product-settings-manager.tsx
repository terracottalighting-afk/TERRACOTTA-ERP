"use client";

import { Fragment, useState } from "react";
import { StatusBadge } from "@/components/ui";

type FormAction = (formData: FormData) => Promise<void>;
type SettingType = "brand" | "category" | "finish" | "part_role" | "style" | "suite";
type Brand = { id: string; brand_code: string; name: string; legal_company_name: string | null; is_active: boolean };
type Category = { id: string; category_code: string; name: string; is_active: boolean };
type Suite = { id: string; suite_code: string; name: string; description: string | null; brand_id: string | null; is_active: boolean };
type Style = { id: string; style_code: string; name: string; description: string | null; brand_id: string | null; signature_suite_id: string | null; is_active: boolean };
type Finish = { id: string; finish_name: string; description: string | null; is_active: boolean };
type PartRole = { id: string; role_code: string; name: string; is_active: boolean };
type RecordItem = Brand | Category | Suite | Style | Finish | PartRole;

const settingLabels: Record<SettingType, string> = {
  brand: "Brands", category: "Product Types", finish: "Finishes", part_role: "Part Roles", style: "Styles", suite: "Signature Suites",
};
const settingSingularLabels: Record<SettingType, string> = {
  brand: "Brand", category: "Product Type", finish: "Finish", part_role: "Part Role", style: "Style", suite: "Signature Suite",
};
const settingTypes: Exclude<SettingType, "style">[] = ["category", "part_role", "suite", "brand", "finish"];

export function ProductSettingsManager({ assignStyleAction, brands, categories, deactivateAction, error, finishes, partRoles, saveAction, styles, suites }: { assignStyleAction: FormAction; brands: Brand[]; categories: Category[]; deactivateAction: FormAction; error?: string; finishes: Finish[]; partRoles: PartRole[]; saveAction: FormAction; styles: Style[]; suites: Suite[] }) {
  const [settingType, setSettingType] = useState<SettingType>("category");
  const [showDeactivated, setShowDeactivated] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [pendingDeactivate, setPendingDeactivate] = useState<{ id: string; label: string } | null>(null);
  const [addingSubstyleForSuiteId, setAddingSubstyleForSuiteId] = useState<string | null>(null);
  const [expandedSuiteId, setExpandedSuiteId] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState(brands.find((brand) => brand.is_active)?.id ?? "");
  const allRecords = recordsFor(settingType, { brands, categories, finishes, partRoles, styles, suites });
  const records = settingType === "suite" || settingType === "style" ? allRecords.filter((record) => (record as Suite | Style).brand_id === selectedBrandId) : allRecords;
  const visibleRecords = records.filter((record) => record.is_active !== showDeactivated);
  const activeCount = records.filter((record) => record.is_active).length;
  const deactivatedCount = records.length - activeCount;
  const editingRecord = records.find((record) => record.id === editingId) ?? null;
  const closeEditor = () => { setEditingId(null); setShowEditor(false); };
  const openEditor = (type: SettingType, recordId?: string) => { setSettingType(type); setEditingId(recordId ?? null); setShowEditor(true); };
  const selectType = (type: Exclude<SettingType, "style">) => { setSettingType(type); setShowDeactivated(false); closeEditor(); };

  return <section className="product-settings-manager">
    <div aria-label="Product configuration types" className="metric-grid product-settings-tabs" role="tablist">
      {settingTypes.map((type) => {
        const count = type === "suite" ? suites.filter((record) => record.is_active).length + styles.filter((record) => record.is_active).length : recordsFor(type, { brands, categories, finishes, partRoles, styles, suites }).filter((record) => record.is_active).length;
        const selected = settingType === type || (type === "suite" && settingType === "style");
        return <button aria-selected={selected} className={`metric product-settings-tab${selected ? " product-settings-tab--active" : ""}`} key={type} onClick={() => selectType(type)} role="tab" type="button"><span>{type === "suite" ? "Styles / Suites" : settingLabels[type]}</span><strong>{count}</strong></button>;
      })}
    </div>
    {settingType === "suite" || settingType === "style" ? <><div aria-label="Brand" className="product-settings-brand-tabs" role="tablist">{brands.filter((brand) => brand.is_active).map((brand) => <button aria-selected={brand.id === selectedBrandId} key={brand.id} onClick={() => { setSelectedBrandId(brand.id); setShowDeactivated(false); closeEditor(); }} role="tab" type="button">{brand.name}</button>)}</div><div aria-label="Styles and Signature Suites" className="product-settings-subtabs" role="tablist"><button aria-selected={settingType === "suite"} onClick={() => { setSettingType("suite"); setShowDeactivated(false); closeEditor(); }} role="tab" type="button">Signature Suites</button><button aria-selected={settingType === "style"} onClick={() => { setSettingType("style"); setShowDeactivated(false); closeEditor(); }} role="tab" type="button">Styles</button></div></> : null}
    <div className="section-title product-settings-title"><div><h3>{settingLabels[settingType]}</h3><p className="fieldset-note">{showDeactivated ? "Deactivated values are retained for history and cannot be selected for future products." : settingType === "style" ? "Styles can be added independently, then assigned under a Signature Suite." : "Active values are available throughout Product Master."}</p></div><div className="section-actions">
      <button className={`text-action text-action--button${!showDeactivated ? " text-action--active" : ""}`} onClick={() => { setShowDeactivated(false); closeEditor(); }} type="button">Active ({activeCount})</button>
      <button className={`text-action text-action--button${showDeactivated ? " text-action--active" : ""}`} onClick={() => { setShowDeactivated(true); closeEditor(); }} type="button">Deactivated ({deactivatedCount})</button>
      {!showDeactivated && settingType === "suite" ? <button className="small-action" onClick={() => openEditor("suite")} type="button">Add Signature Suite</button> : null}
      {!showDeactivated && settingType !== "suite" ? <button className="small-action" onClick={() => openEditor(settingType)} type="button">Add {settingSingularLabels[settingType]}</button> : null}
    </div></div>
    {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
    {showEditor && !showDeactivated && !(settingType === "style" && editingId) ? <ProductSettingEditor brands={brands.filter((brand) => brand.is_active)} initialBrandId={selectedBrandId} onCancel={closeEditor} record={editingRecord} saveAction={saveAction} settingType={settingType} suites={suites.filter((suite) => suite.is_active)} /> : null}
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Code</th><th>Name</th><th>Details</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visibleRecords.map((record) => {
      const suite = settingType === "suite" ? record as Suite : null;
      const isExpanded = suite?.id === expandedSuiteId;
      const isAddingSubstyle = suite?.id === addingSubstyleForSuiteId;
      const isSelectedStyle = settingType === "style" && editingId === record.id;
      return <Fragment key={record.id}><ConfigurationRow brands={brands} expanded={isExpanded} onAddSubstyle={suite?.is_active ? () => { setAddingSubstyleForSuiteId(suite.id); setExpandedSuiteId(suite.id); } : undefined} onDeactivate={() => setPendingDeactivate({ id: record.id, label: recordName(settingType, record) })} onEdit={() => openEditor(settingType, record.id)} onSelect={settingType === "style" ? () => openEditor("style", record.id) : undefined} onToggle={suite ? () => setExpandedSuiteId(isExpanded ? null : suite.id) : undefined} record={record} selected={isSelectedStyle} settingType={settingType} styles={styles} suites={suites} />
        {isSelectedStyle && showEditor ? <tr className="product-setting-editor-row"><td colSpan={5}><ProductSettingEditor brands={brands.filter((brand) => brand.is_active)} initialBrandId={selectedBrandId} onCancel={closeEditor} record={record} saveAction={saveAction} settingType="style" suites={suites.filter((suite) => suite.is_active)} /></td></tr> : null}
        {suite && isExpanded ? <SuiteSubstylesRow styles={styles.filter((style) => style.signature_suite_id === suite.id)} /> : null}
        {suite && isAddingSubstyle ? <AssignSubstyleRow assignAction={assignStyleAction} onCancel={() => setAddingSubstyleForSuiteId(null)} styles={styles.filter((style) => style.is_active && style.brand_id === suite.brand_id && !style.signature_suite_id)} suite={suite} /> : null}
      </Fragment>;
    })}{visibleRecords.length === 0 ? <tr><td colSpan={5}>No {showDeactivated ? "deactivated" : "active"} {settingLabels[settingType].toLowerCase()} have been configured.</td></tr> : null}</tbody></table></div>
    {pendingDeactivate ? <dialog className="confirmation-dialog" open><form action={deactivateAction}><h3>Deactivate {settingSingularLabels[settingType]}</h3><p>Are you sure you want to deactivate <strong>{pendingDeactivate.label}</strong>?</p><ul><li>This value will no longer be available for future product setup.</li><li>Existing products and historical transactions retain their current value.</li><li>This action does not delete any data.</li></ul><input name="configuration_type" type="hidden" value={settingType} /><input name="configuration_id" type="hidden" value={pendingDeactivate.id} /><div className="form-actions"><button className="danger-action" type="submit">Confirm Deactivation</button><button className="secondary-action secondary-action--light" onClick={() => setPendingDeactivate(null)} type="button">Cancel</button></div></form></dialog> : null}
  </section>;
}

function ConfigurationRow({ brands, expanded, onAddSubstyle, onDeactivate, onEdit, onSelect, onToggle, record, selected, settingType, styles, suites }: { brands: Brand[]; expanded?: boolean; onAddSubstyle?: () => void; onDeactivate: () => void; onEdit: () => void; onSelect?: () => void; onToggle?: () => void; record: RecordItem; selected?: boolean; settingType: SettingType; styles: Style[]; suites: Suite[] }) {
  const code = settingType === "brand" ? (record as Brand).brand_code : settingType === "category" ? (record as Category).category_code : settingType === "part_role" ? (record as PartRole).role_code : settingType === "style" ? (record as Style).style_code : settingType === "suite" ? (record as Suite).suite_code : "-";
  const detail = settingType === "brand" ? (record as Brand).legal_company_name ?? "-" : settingType === "style" ? [((record as Style).signature_suite_id ? suites.find((suite) => suite.id === (record as Style).signature_suite_id)?.name ?? "Signature Suite not set" : "Not assigned to a Signature Suite"), (record as Style).description].filter(Boolean).join(" - ") : settingType === "suite" ? [((record as Suite).brand_id ? brands.find((brand) => brand.id === (record as Suite).brand_id)?.name ?? "Brand not set" : "All brands"), (record as Suite).description, styles.filter((style) => style.signature_suite_id === record.id && style.is_active).map((style) => style.name).join(", ") || "No Styles assigned"].filter(Boolean).join(" - ") || "-" : settingType === "finish" ? (record as Finish).description ?? "-" : "-";
  return <tr className={`${onToggle ? "suite-row--expandable" : ""}${selected ? " admin-row-selected style-row--selectable" : onSelect ? " style-row--selectable" : ""}`} onClick={onToggle ?? onSelect}><td>{onToggle ? <span className="suite-row-indicator" aria-hidden="true">{expanded ? "-" : "+"}</span> : null}{code}</td><td><strong>{recordName(settingType, record)}</strong></td><td>{detail}</td><td><StatusBadge tone={record.is_active ? "good" : "warn"} value={record.is_active ? "Active" : "Deactivated"} /></td><td><div className="admin-hierarchy-links" onClick={(event) => event.stopPropagation()}>{onAddSubstyle ? <button className="text-action text-action--button" onClick={onAddSubstyle} type="button">Add Substyle</button> : null}<button className="text-action text-action--button" onClick={onEdit} type="button">Edit</button>{record.is_active ? <button className="text-action text-action--button text-action--danger" onClick={onDeactivate} type="button">Deactivate</button> : null}</div></td></tr>;
}

function ProductSettingEditor({ brands, initialBrandId, onCancel, record, saveAction, settingType, suites }: { brands: Brand[]; initialBrandId: string; onCancel: () => void; record: RecordItem | null; saveAction: FormAction; settingType: SettingType; suites: Suite[] }) {
  const editing = Boolean(record);
  const code = settingType === "brand" ? (record as Brand | null)?.brand_code ?? "" : settingType === "category" ? (record as Category | null)?.category_code ?? "" : settingType === "part_role" ? (record as PartRole | null)?.role_code ?? "" : settingType === "style" ? (record as Style | null)?.style_code ?? "" : settingType === "suite" ? (record as Suite | null)?.suite_code ?? "" : "";
  const name = settingType === "finish" ? (record as Finish | null)?.finish_name ?? "" : recordName(settingType, record);
  const description = settingType === "suite" ? (record as Suite | null)?.description ?? "" : settingType === "style" ? (record as Style | null)?.description ?? "" : settingType === "finish" ? (record as Finish | null)?.description ?? "" : "";
  const assignedSuiteId = settingType === "style" ? (record as Style | null)?.signature_suite_id ?? "" : "";
  const assignedSuite = suites.find((suite) => suite.id === assignedSuiteId);
  const recordBrandId = settingType === "suite" ? (record as Suite | null)?.brand_id ?? "" : settingType === "style" ? (record as Style | null)?.brand_id ?? "" : "";
  const [brandId, setBrandId] = useState(recordBrandId || initialBrandId);
  const applicableSuites = suites.filter((suite) => suite.brand_id === brandId);
  const selectedBrand = brands.find((brand) => brand.id === brandId);
  const lockedBrand = settingType === "style" && Boolean(assignedSuite);
  const brandField = lockedBrand ? <><input name="brand_id" type="hidden" value={brandId} /><label>Brand<input readOnly value={selectedBrand?.name ?? "Not set"} /></label></> : <label>Brand<select name="brand_id" onChange={(event) => setBrandId(event.target.value)} required value={brandId}><option value="">Select a Brand</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label>;
  return <form action={saveAction} className="product-setting-editor"><input name="configuration_type" type="hidden" value={settingType} />{editing ? <input name="configuration_id" type="hidden" value={record?.id ?? ""} /> : null}<fieldset><legend>{editing ? `Edit ${settingSingularLabels[settingType]}` : `Add ${settingSingularLabels[settingType]}`}</legend><div className="form-grid">{settingType !== "finish" ? <label>Code<input defaultValue={code} name="code" required /></label> : null}<label>{settingType === "finish" ? "Finish Name" : "Name"}<input defaultValue={name} name="name" required /></label>{settingType === "brand" ? <label>Legal Company Name<input defaultValue={(record as Brand | null)?.legal_company_name ?? ""} name="legal_company_name" /></label> : null}{settingType === "suite" || settingType === "style" ? brandField : null}{settingType === "style" ? <><input name="current_signature_suite_id" type="hidden" value={assignedSuiteId} />{assignedSuite ? <label className="setting-assignment-toggle"><input defaultChecked name="retain_signature_suite_assignment" type="checkbox" />Assigned to {assignedSuite.name}</label> : <label>Assign to Signature Suite<select defaultValue="" name="signature_suite_id"><option value="">No Signature Suite</option>{applicableSuites.map((suite) => <option key={suite.id} value={suite.id}>{suite.name}</option>)}</select></label>}</> : null}{settingType === "suite" || settingType === "style" || settingType === "finish" ? <label>Description<textarea defaultValue={description} name="description" /></label> : null}</div></fieldset><div className="form-actions"><button className="primary-action" type="submit">{editing ? "Save Changes" : `Create ${settingSingularLabels[settingType]}`}</button><button className="secondary-action secondary-action--light" onClick={onCancel} type="button">Cancel</button></div></form>;
}

function SuiteSubstylesRow({ styles }: { styles: Style[] }) {
  return <tr className="suite-substyles-row"><td colSpan={5}><div className="suite-substyles"><strong>Substyles</strong>{styles.length ? <div className="suite-substyles-list">{styles.map((style) => <span key={style.id}><strong>{style.style_code}</strong> {style.name}</span>)}</div> : <span className="fieldset-note">No Substyles have been assigned.</span>}</div></td></tr>;
}

function AssignSubstyleRow({ assignAction, onCancel, styles, suite }: { assignAction: FormAction; onCancel: () => void; styles: Style[]; suite: Suite }) {
  return <tr className="suite-substyle-editor"><td colSpan={5}><form action={assignAction}><strong>Add Substyle to {suite.name}</strong><input name="signature_suite_id" type="hidden" value={suite.id} />{styles.length ? <label>Style<select name="style_id" required><option value="">Select a Style</option>{styles.map((style) => <option key={style.id} value={style.id}>{style.name} ({style.style_code})</option>)}</select></label> : <span className="fieldset-note">No unassigned active Styles are available.</span>}<div className="form-actions">{styles.length ? <button className="primary-action" type="submit">Add Substyle</button> : null}<button className="secondary-action secondary-action--light" onClick={onCancel} type="button">Cancel</button></div></form></td></tr>;
}

function recordsFor(type: SettingType, data: { brands: Brand[]; categories: Category[]; finishes: Finish[]; partRoles: PartRole[]; styles: Style[]; suites: Suite[] }): RecordItem[] {
  return type === "brand" ? data.brands : type === "category" ? data.categories : type === "part_role" ? data.partRoles : type === "style" ? data.styles : type === "suite" ? data.suites : data.finishes;
}

function recordName(settingType: SettingType, record: RecordItem | null) {
  if (!record) return "";
  return settingType === "finish" ? (record as Finish).finish_name : (record as Brand | Category | Suite | Style | PartRole).name;
}
