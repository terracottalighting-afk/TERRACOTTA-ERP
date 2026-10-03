"use client";

import { useState } from "react";
import { REPORT_DATA_SOURCE_OPTIONS, REPORT_FIELD_OPTIONS, REPORT_TYPE_OPTIONS, type ReportFieldMapping, type ReportTypeCode } from "@/lib/report-settings";

export function ReportSettingsManager({ createMappingAction, error, mappings, saveAction }: { createMappingAction: (formData: FormData) => void | Promise<void>; error?: string; mappings: ReportFieldMapping[]; saveAction: (formData: FormData) => void | Promise<void> }) {
  const [reportType, setReportType] = useState<ReportTypeCode>("container_invoice");
  const [isCreating, setIsCreating] = useState(false);
  const report = REPORT_TYPE_OPTIONS.find((item) => item.code === reportType)!;
  const fields = REPORT_FIELD_OPTIONS[reportType];
  const mappingsByField = new Map(mappings.filter((mapping) => mapping.report_type === reportType).map((mapping) => [mapping.field_code, mapping]));
  const additionalMappings = mappings.filter((mapping) => mapping.report_type === reportType && !fields.some((field) => field.code === mapping.field_code));

  return <section className="product-settings-manager">
    <div className="section-title product-settings-title"><div><h3>Report Settings</h3><p className="fieldset-note">Set approved product data sources and report labels. These mappings are applied when container reports are generated.</p></div></div>
    {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
    <section className="report-settings-guide" aria-label="Report settings steps">
      <div><strong>1</strong><span>Choose a report</span></div>
      <div><strong>2</strong><span>Map each report field to an approved data source</span></div>
      <div><strong>3</strong><span>Confirm the report label and save</span></div>
    </section>
    <div className="metric-grid product-settings-tabs" role="tablist" aria-label="Report types">
      {REPORT_TYPE_OPTIONS.map((option) => <button aria-selected={reportType === option.code} className={`metric product-settings-tab${reportType === option.code ? " product-settings-tab--active" : ""}`} key={option.code} onClick={() => { setReportType(option.code); setIsCreating(false); }} role="tab" type="button"><span>{option.name}</span><strong>{mappings.filter((mapping) => mapping.report_type === option.code).length}</strong></button>)}
    </div>
    <form action={saveAction} className="product-setting-editor">
      <input name="report_type" type="hidden" value={reportType} />
      <fieldset><legend>{report.name}</legend><p className="fieldset-note">{report.description}</p><div className="table-wrap"><table className="data-table"><thead><tr><th>Report Field</th><th>Product Data Source</th><th>Report Label</th></tr></thead><tbody>{fields.map((field) => { const mapping = mappingsByField.get(field.code); return <tr key={field.code}><td><strong>{field.label}</strong><input name="field_code" type="hidden" value={field.code} /><input name="mapping_id" type="hidden" value={mapping?.id ?? ""} /></td><td><select defaultValue={mapping?.data_source ?? field.sources[0].code} name="data_source">{field.sources.map((source) => <option key={source.code} value={source.code}>{source.name}</option>)}</select></td><td><input defaultValue={mapping?.display_label ?? field.label} name="display_label" required /></td></tr>; })}</tbody></table></div></fieldset>
      <div className="form-actions"><button className="primary-action" type="submit">Save {report.name} Mapping</button></div>
    </form>
    <article className="data-section report-additional-mappings"><div className="section-title"><div><h3>Additional Mappings</h3><p>Use these mappings for additional product fields as report layouts grow.</p></div><button className="small-action" onClick={() => setIsCreating(true)} type="button">Create Mapping</button></div>{additionalMappings.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Report Field</th><th>Product Data Source</th></tr></thead><tbody>{additionalMappings.map((mapping) => <tr key={mapping.id}><td>{mapping.display_label}</td><td>{REPORT_DATA_SOURCE_OPTIONS.find((source) => source.code === mapping.data_source)?.name ?? mapping.data_source}</td></tr>)}</tbody></table></div> : <p className="fieldset-note">No additional mappings have been created for this report.</p>}{isCreating ? <form action={createMappingAction} className="product-setting-editor"><input name="report_type" type="hidden" value={reportType} /><fieldset><legend>Create Mapping</legend><div className="form-grid"><label>Report Field Label<input name="display_label" placeholder="For example, Country of Origin" required /></label><label>Product Data Source<select defaultValue={REPORT_DATA_SOURCE_OPTIONS[0].code} name="data_source">{REPORT_DATA_SOURCE_OPTIONS.map((source) => <option key={source.code} value={source.code}>{source.name}</option>)}</select></label></div></fieldset><div className="form-actions"><button className="primary-action" type="submit">Create Mapping</button><button className="secondary-action secondary-action--light" onClick={() => setIsCreating(false)} type="button">Cancel</button></div></form> : null}</article>
  </section>;
}
