"use client";

import { useState } from "react";
import { REPORT_MAPPING_OBJECTS, REPORT_TYPE_OPTIONS, reportDataSourceLabel, reportMappingObjectForSource, reportMappingObjectSources, type ReportFieldMapping, type ReportMappingObjectCode, type ReportMappingObjectSourceSetting, type ReportTypeCode } from "@/lib/report-settings";

type Action = (formData: FormData) => void | Promise<void>;

export function ReportSettingsManager({ createMappingAction, deleteMappingAction, editMappingAction, error, mappingObjectSources, mappings, productSpecificationAttributes, saveAction: _saveAction, saveMappingObjectSourcesAction }: { createMappingAction: Action; deleteMappingAction: Action; editMappingAction: Action; error?: string; mappingObjectSources: ReportMappingObjectSourceSetting[]; mappings: ReportFieldMapping[]; productSpecificationAttributes: string[]; saveAction?: Action; saveMappingObjectSourcesAction: Action }) {
  const [reportType, setReportType] = useState<ReportTypeCode>("container_invoice");
  const [isCreatingMapping, setIsCreatingMapping] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ReportFieldMapping | null>(null);
  const [isEditingObject, setIsEditingObject] = useState(false);
  const [objectMappingObject, setObjectMappingObject] = useState<ReportMappingObjectCode>("product");
  const [attributeSearch, setAttributeSearch] = useState("");
  const [selectedSourceCodes, setSelectedSourceCodes] = useState<string[]>([]);
  const [createMappingObject, setCreateMappingObject] = useState<ReportMappingObjectCode>("product");
  const [editMappingObject, setEditMappingObject] = useState<ReportMappingObjectCode>("product");
  const [editSourceCode, setEditSourceCode] = useState("");
  const report = REPORT_TYPE_OPTIONS.find((item) => item.code === reportType)!;
  const reportMappings = mappings.filter((mapping) => mapping.report_type === reportType);
  const availableObjectSources = reportMappingObjectSources(objectMappingObject, productSpecificationAttributes);
  const configuredSources = mappingObjectSources.filter((source) => source.object_code === createMappingObject);
  const editConfiguredSources = mappingObjectSources.filter((source) => source.object_code === editMappingObject);

  function openObjectMapping(objectCode: ReportMappingObjectCode = "product") {
    setObjectMappingObject(objectCode);
    setSelectedSourceCodes(mappingObjectSources.filter((source) => source.object_code === objectCode).map((source) => source.source_code));
    setAttributeSearch("");
    setIsEditingObject(true);
  }

  function chooseObjectForMapping(objectCode: ReportMappingObjectCode) {
    setObjectMappingObject(objectCode);
    setSelectedSourceCodes(mappingObjectSources.filter((source) => source.object_code === objectCode).map((source) => source.source_code));
    setAttributeSearch("");
  }

  function openEdit(mapping: ReportFieldMapping) {
    const objectCode = reportMappingObjectForSource(mapping.data_source);
    setEditingMapping(mapping);
    setEditMappingObject(objectCode);
    setEditSourceCode(mapping.data_source);
    setIsCreatingMapping(false);
  }

  function chooseEditObject(objectCode: ReportMappingObjectCode) {
    setEditMappingObject(objectCode);
    setEditSourceCode(mappingObjectSources.find((source) => source.object_code === objectCode)?.source_code ?? "");
  }

  const matchingSources = attributeSearch.trim()
    ? availableObjectSources.filter((source) => source.name.toLowerCase().includes(attributeSearch.trim().toLowerCase()))
    : [];

  return <section className="product-settings-manager">
    <div className="section-title product-settings-title"><div><h3>Report Settings</h3><p className="fieldset-note">Set report field labels and map them to approved source attributes.</p></div></div>
    {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
    <section className="report-settings-guide" aria-label="Report settings steps">
      <div><strong>1</strong><span>Choose a report</span></div>
      <div><strong>2</strong><span>Build the source attribute list for each object</span></div>
      <div><strong>3</strong><span>Map a report field and save</span></div>
    </section>

    <fieldset className="product-setting-editor">
      <legend>Mapping Object Lists</legend>
      <div className="section-title"><p className="fieldset-note">Saved source attributes are available when users create or edit report mappings.</p><button className="small-action" onClick={() => openObjectMapping()} type="button">Add Object Mapping</button></div>
      {mappingObjectSources.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Mapping Object</th><th>Source Attributes</th><th>Action</th></tr></thead><tbody>{REPORT_MAPPING_OBJECTS.filter((object) => mappingObjectSources.some((source) => source.object_code === object.code)).map((object) => <tr key={object.code}><td><strong>{object.name}</strong></td><td>{mappingObjectSources.filter((source) => source.object_code === object.code).map((source) => source.source_label).join(", ")}</td><td><button className="text-action text-action--button" onClick={() => openObjectMapping(object.code)} type="button">Edit</button></td></tr>)}</tbody></table></div> : <p className="fieldset-note">No mapping objects have been configured.</p>}
    </fieldset>

    {isEditingObject ? <form action={saveMappingObjectSourcesAction} className="product-setting-editor"><fieldset><legend>Add Object Mapping</legend><div className="form-grid"><label>Object<select name="mapping_object" onChange={(event) => chooseObjectForMapping(event.target.value as ReportMappingObjectCode)} value={objectMappingObject}>{REPORT_MAPPING_OBJECTS.map((object) => <option key={object.code} value={object.code}>{object.name}</option>)}</select></label><label>Find an Attribute<input onChange={(event) => setAttributeSearch(event.target.value)} placeholder="Type an attribute name" value={attributeSearch} /></label></div>{attributeSearch.trim() ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Matching Attribute</th><th>Action</th></tr></thead><tbody>{matchingSources.length ? matchingSources.map((source) => <tr key={source.code}><td>{source.name}</td><td>{selectedSourceCodes.includes(source.code) ? "Added" : <button className="text-action text-action--button" onClick={() => setSelectedSourceCodes((codes) => [...codes, source.code])} type="button">Add</button>}</td></tr>) : <tr><td colSpan={2}>No attributes matched your search.</td></tr>}</tbody></table></div> : null}<div className="table-wrap"><table className="data-table"><thead><tr><th>Source Attribute List</th><th>Action</th></tr></thead><tbody>{selectedSourceCodes.length ? selectedSourceCodes.map((code) => <tr key={code}><td>{availableObjectSources.find((source) => source.code === code)?.name ?? code}<input name="source_code" type="hidden" value={code} /></td><td><button className="text-action text-action--button text-action--danger" onClick={() => setSelectedSourceCodes((codes) => codes.filter((sourceCode) => sourceCode !== code))} type="button">Remove</button></td></tr>) : <tr><td colSpan={2}>Search for and add one or more attributes.</td></tr>}</tbody></table></div></fieldset><div className="form-actions"><button className="primary-action" disabled={!selectedSourceCodes.length} type="submit">Save Object Mapping</button><button className="secondary-action secondary-action--light" onClick={() => setIsEditingObject(false)} type="button">Cancel</button></div></form> : null}

    <div className="metric-grid product-settings-tabs" role="tablist" aria-label="Report types">{REPORT_TYPE_OPTIONS.map((option) => <button aria-selected={reportType === option.code} className={`metric product-settings-tab${reportType === option.code ? " product-settings-tab--active" : ""}`} key={option.code} onClick={() => { setReportType(option.code); setIsCreatingMapping(false); setEditingMapping(null); }} role="tab" type="button"><span>{option.name}</span><strong>{mappings.filter((mapping) => mapping.report_type === option.code).length}</strong></button>)}</div>
    <fieldset className="product-setting-editor"><legend>{report.name}</legend><div className="section-title"><p className="fieldset-note">{report.description}</p><button className="small-action" onClick={() => { setIsCreatingMapping(true); setEditingMapping(null); }} type="button">Create Mapping</button></div>{reportMappings.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Report Field</th><th>Data Source</th><th>Report Label</th><th>Action</th></tr></thead><tbody>{reportMappings.map((mapping) => <tr key={mapping.id}><td>{mapping.display_label}</td><td>{reportDataSourceLabel(mapping.data_source)}</td><td>{mapping.display_label}</td><td><button className="text-action text-action--button" onClick={() => openEdit(mapping)} type="button">Edit</button><form action={deleteMappingAction} className="inline-action-form"><input name="mapping_id" type="hidden" value={mapping.id} /><input name="report_type" type="hidden" value={reportType} /><button className="text-action text-action--button text-action--danger" type="submit">Delete</button></form></td></tr>)}</tbody></table></div> : <p className="fieldset-note">No mappings have been created for this report.</p>}</fieldset>
    {isCreatingMapping ? <form action={createMappingAction} className="product-setting-editor"><input name="report_type" type="hidden" value={reportType} /><fieldset><legend>Create Mapping</legend><div className="form-grid"><label>Report Field Label<input name="display_label" placeholder="For example, Country of Origin" required /></label><label>Mapping Object<select name="mapping_object" onChange={(event) => setCreateMappingObject(event.target.value as ReportMappingObjectCode)} value={createMappingObject}>{REPORT_MAPPING_OBJECTS.map((object) => <option key={object.code} value={object.code}>{object.name}</option>)}</select></label><label>Source Attribute<select disabled={!configuredSources.length} name="data_source">{configuredSources.length ? configuredSources.map((source) => <option key={source.id} value={source.source_code}>{source.source_label}</option>) : <option value="">Configure this object first</option>}</select></label></div>{configuredSources.length ? null : <p className="form-error">Add and save source attributes for this object before creating a report mapping.</p>}</fieldset><div className="form-actions"><button className="primary-action" disabled={!configuredSources.length} type="submit">Create Mapping</button><button className="secondary-action secondary-action--light" onClick={() => setIsCreatingMapping(false)} type="button">Cancel</button></div></form> : null}
    {editingMapping ? <form action={editMappingAction} className="product-setting-editor"><input name="mapping_id" type="hidden" value={editingMapping.id} /><input name="report_type" type="hidden" value={reportType} /><fieldset><legend>Edit Mapping</legend><div className="form-grid"><label>Report Field Label<input defaultValue={editingMapping.display_label} name="display_label" required /></label><label>Mapping Object<select name="mapping_object" onChange={(event) => chooseEditObject(event.target.value as ReportMappingObjectCode)} value={editMappingObject}>{REPORT_MAPPING_OBJECTS.map((object) => <option key={object.code} value={object.code}>{object.name}</option>)}</select></label><label>Source Attribute<select disabled={!editConfiguredSources.length} name="data_source" onChange={(event) => setEditSourceCode(event.target.value)} value={editSourceCode}>{editConfiguredSources.length ? editConfiguredSources.map((source) => <option key={source.id} value={source.source_code}>{source.source_label}</option>) : <option value="">Configure this object first</option>}</select></label></div>{editConfiguredSources.length ? null : <p className="form-error">Add and save source attributes for this object before using it in a report mapping.</p>}</fieldset><div className="form-actions"><button className="primary-action" disabled={!editConfiguredSources.length} type="submit">Save Mapping</button><button className="secondary-action secondary-action--light" onClick={() => setEditingMapping(null)} type="button">Cancel</button></div></form> : null}
  </section>;
}
