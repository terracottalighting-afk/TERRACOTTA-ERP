"use client";

import { useState } from "react";
import { REPORT_FIELD_OPTIONS, REPORT_MAPPING_OBJECTS, REPORT_TYPE_OPTIONS, reportDataSourceLabel, reportMappingObjectSources, type ReportFieldMapping, type ReportMappingObjectCode, type ReportTypeCode } from "@/lib/report-settings";

export function ReportSettingsManager({ createMappingAction, error, mappings, productSpecificationAttributes, saveAction }: { createMappingAction: (formData: FormData) => void | Promise<void>; error?: string; mappings: ReportFieldMapping[]; productSpecificationAttributes: string[]; saveAction: (formData: FormData) => void | Promise<void> }) {
  const [reportType, setReportType] = useState<ReportTypeCode>("container_invoice");
  const [isCreating, setIsCreating] = useState(false);
  const [mappingObject, setMappingObject] = useState<ReportMappingObjectCode>("product");
  const [sourceAttribute, setSourceAttribute] = useState("product_sku");
  const report = REPORT_TYPE_OPTIONS.find((item) => item.code === reportType)!;
  const fields = REPORT_FIELD_OPTIONS[reportType];
  const mappingsByField = new Map(mappings.filter((mapping) => mapping.report_type === reportType).map((mapping) => [mapping.field_code, mapping]));
  const additionalMappings = mappings.filter((mapping) => mapping.report_type === reportType && !fields.some((field) => field.code === mapping.field_code));
  const mappingSources = reportMappingObjectSources(mappingObject, productSpecificationAttributes);

  function chooseMappingObject(nextObject: ReportMappingObjectCode) {
    setMappingObject(nextObject);
    setSourceAttribute(reportMappingObjectSources(nextObject, productSpecificationAttributes)[0]?.code ?? "");
  }

  return <section className="product-settings-manager">
    <div className="section-title product-settings-title"><div><h3>Report Settings</h3><p className="fieldset-note">Set report field labels and map them to approved source attributes.</p></div></div>
    {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
    <section className="report-settings-guide" aria-label="Report settings steps">
      <div><strong>1</strong><span>Choose a report</span></div>
      <div><strong>2</strong><span>Choose an object and its approved source attribute</span></div>
      <div><strong>3</strong><span>Confirm the report label and save</span></div>
    </section>
    <fieldset className="product-setting-editor"><legend>Mapping Object Lists</legend><p className="fieldset-note">Each object provides the source attributes available for report fields. Product also includes every active specification attribute currently used in the catalog.</p><div className="form-grid"><label>Mapping Object<select onChange={(event) => chooseMappingObject(event.target.value as ReportMappingObjectCode)} value={mappingObject}>{REPORT_MAPPING_OBJECTS.map((object) => <option key={object.code} value={object.code}>{object.name}</option>)}</select></label><label>Available Source Attributes<select disabled value={sourceAttribute}>{mappingSources.map((source) => <option key={source.code} value={source.code}>{source.name}</option>)}</select></label></div></fieldset>
    <div className="metric-grid product-settings-tabs" role="tablist" aria-label="Report types">
      {REPORT_TYPE_OPTIONS.map((option) => <button aria-selected={reportType === option.code} className={`metric product-settings-tab${reportType === option.code ? " product-settings-tab--active" : ""}`} key={option.code} onClick={() => { setReportType(option.code); setIsCreating(false); }} role="tab" type="button"><span>{option.name}</span><strong>{mappings.filter((mapping) => mapping.report_type === option.code).length}</strong></button>)}
    </div>
    <form action={saveAction} className="product-setting-editor">
      <input name="report_type" type="hidden" value={reportType} />
      <fieldset>
        <legend>{report.name}</legend>
        <div className="section-title"><p className="fieldset-note">{report.description}</p><button className="small-action" onClick={() => setIsCreating(true)} type="button">Create Mapping</button></div>
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Report Field</th><th>Data Source</th><th>Report Label</th></tr></thead><tbody>
          {fields.map((field) => { const mapping = mappingsByField.get(field.code); return <tr key={field.code}><td><strong>{field.label}</strong><input name="field_code" type="hidden" value={field.code} /><input name="mapping_id" type="hidden" value={mapping?.id ?? ""} /></td><td><select defaultValue={mapping?.data_source ?? field.sources[0].code} name="data_source">{field.sources.map((source) => <option key={source.code} value={source.code}>{source.name}</option>)}</select></td><td><input defaultValue={mapping?.display_label ?? field.label} name="display_label" required /></td></tr>; })}
          {additionalMappings.map((mapping) => <tr key={mapping.id}><td>{mapping.display_label}</td><td>{reportDataSourceLabel(mapping.data_source)}</td><td>{mapping.display_label}</td></tr>)}
        </tbody></table></div>
      </fieldset>
      <div className="form-actions"><button className="primary-action" type="submit">Save {report.name} Mapping</button></div>
    </form>
    {isCreating ? <form action={createMappingAction} className="product-setting-editor"><input name="report_type" type="hidden" value={reportType} /><fieldset><legend>Create Mapping</legend><div className="form-grid"><label>Report Field Label<input name="display_label" placeholder="For example, Country of Origin" required /></label><label>Mapping Object<select name="mapping_object" onChange={(event) => chooseMappingObject(event.target.value as ReportMappingObjectCode)} value={mappingObject}>{REPORT_MAPPING_OBJECTS.map((object) => <option key={object.code} value={object.code}>{object.name}</option>)}</select></label><label>Source Attribute<select name="data_source" onChange={(event) => setSourceAttribute(event.target.value)} value={sourceAttribute}>{mappingSources.map((source) => <option key={source.code} value={source.code}>{source.name}</option>)}</select></label></div></fieldset><div className="form-actions"><button className="primary-action" type="submit">Create Mapping</button><button className="secondary-action secondary-action--light" onClick={() => setIsCreating(false)} type="button">Cancel</button></div></form> : null}
  </section>;
}
