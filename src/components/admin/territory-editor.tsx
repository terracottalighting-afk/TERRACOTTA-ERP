import Link from "next/link";
import { createSupabaseAdminClient, createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";
import { TerritoryCoverageFields } from "@/components/admin/territory-coverage-fields";

type FormAction = (formData: FormData) => Promise<void>;

const US_STATES = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

export async function TerritoryEditor({ createAction, deactivateAction, error, notice, saveAction, territoryId }: { createAction: FormAction; deactivateAction: FormAction; error?: string; notice?: string; saveAction: FormAction; territoryId?: string }) {
  const supabase = createSupabaseAdminClient();
  const { data: territory, error: territoryError } = territoryId ? await supabase.from("territory").select("id, territory_code, name, description, state_codes_json, status").eq("id", territoryId).maybeSingle() : { data: null, error: null };
  if (territoryError) throw new Error(territoryError.message);
  const untypedSupabase = createSupabaseUntypedAdminClient();
  const [zipCoverageResult, countyRulesResult, zipOverridesResult] = territory ? await Promise.all([
    untypedSupabase.from("territory_zip_coverage").select("postal_code").eq("territory_id", territory.id),
    untypedSupabase.from("territory_county_coverage_rule").select("county_geoid, coverage_mode, county_reference(state_code, county_name)").eq("territory_id", territory.id),
    untypedSupabase.from("territory_zip_override").select("postal_code, coverage_mode").eq("territory_id", territory.id).order("postal_code", { ascending: true }),
  ]) : [{ data: [], error: null }, { data: [], error: null }, { data: [], error: null }];
  if (zipCoverageResult.error || countyRulesResult.error || zipOverridesResult.error) throw new Error(zipCoverageResult.error?.message ?? countyRulesResult.error?.message ?? zipOverridesResult.error?.message);
  const editing = Boolean(territory);
  const selectedStates = Array.isArray(territory?.state_codes_json) ? territory.state_codes_json.filter((state): state is string => typeof state === "string") : [];
  const countyRules = (countyRulesResult.data ?? []).flatMap((rule) => {
    const county = Array.isArray(rule.county_reference) ? rule.county_reference[0] : rule.county_reference;
    return county ? [{ county_geoid: rule.county_geoid, county_name: county.county_name, coverage_mode: rule.coverage_mode as "include" | "exclude", state_code: county.state_code }] : [];
  });
  const includedPostalCodes = (zipOverridesResult.data ?? []).filter((override) => override.coverage_mode === "include").map((override) => override.postal_code);
  const excludedPostalCodes = (zipOverridesResult.data ?? []).filter((override) => override.coverage_mode === "exclude").map((override) => override.postal_code);

  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Territory Settings</span><h2>{editing ? `Edit ${territory?.name}` : "Add Territory"}</h2><Link className="text-action" href="/?module=admin&admin_tab=territory">Back to Territory Settings</Link></div></section>{error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}{notice ? <p className="form-notice">{decodeURIComponent(notice)}</p> : null}<form action={editing ? saveAction : createAction} className="form-stack">{editing ? <input name="territory_id" type="hidden" value={territory?.id ?? ""} /> : null}<fieldset><legend>Territory Profile</legend><div className="form-grid"><label>Territory Code<input defaultValue={territory?.territory_code ?? ""} name="territory_code" required /></label><label>Territory Name<input defaultValue={territory?.name ?? ""} name="name" required /></label><label className="full-width-field">Description<textarea defaultValue={territory?.description ?? ""} name="description" /></label>{editing ? <label>Status<select defaultValue={territory?.status ?? "active"} name="status"><option value="active">Active</option><option value="inactive">Inactive</option></select></label> : null}</div></fieldset><fieldset><legend>Coverage</legend><p className="fieldset-note">Select a state only when this territory covers the entire state.</p><div className="territory-state-grid">{US_STATES.map((state) => <label className="checkbox-label" key={state}><input defaultChecked={selectedStates.includes(state)} name="state_code" type="checkbox" value={state} />{state}</label>)}</div><TerritoryCoverageFields countyRules={countyRules} excludedPostalCodes={excludedPostalCodes} includedPostalCodes={includedPostalCodes} resolvedZipCount={(zipCoverageResult.data ?? []).length} /></fieldset><div className="form-actions"><button className="primary-action" type="submit">{editing ? "Save Territory Changes" : "Create Territory"}</button>{editing && territory?.status === "active" ? <button className="danger-action" formAction={deactivateAction} type="submit">Deactivate Territory</button> : null}<Link className="secondary-action" href="/?module=admin&admin_tab=territory">Cancel</Link></div></form></section>;
}
