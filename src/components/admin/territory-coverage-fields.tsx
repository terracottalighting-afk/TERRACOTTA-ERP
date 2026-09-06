"use client";

import { useState } from "react";

type County = { county_geoid: string; county_name: string };
type CountyRule = { county_geoid: string; county_name: string; coverage_mode: "include" | "exclude"; state_code: string };
const US_STATES = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

export function TerritoryCoverageFields({ countyRules, excludedPostalCodes, includedPostalCodes, resolvedZipCount, selectedFullStates }: { countyRules: CountyRule[]; excludedPostalCodes: string[]; includedPostalCodes: string[]; resolvedZipCount: number; selectedFullStates: string[] }) {
  const [fullStateCodes, setFullStateCodes] = useState(selectedFullStates);
  const [selectedState, setSelectedState] = useState("");
  const [counties, setCounties] = useState<County[]>([]);
  const [selectedCountyIds, setSelectedCountyIds] = useState<string[]>([]);
  const [mode, setMode] = useState<"include" | "exclude">("include");
  const [rules, setRules] = useState(() => countyRules.filter((rule) => !selectedFullStates.includes(rule.state_code)));
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const availableStates = US_STATES.filter((state) => !fullStateCodes.includes(state));

  async function loadCounties(state: string) {
    setSelectedState(state);
    setSelectedCountyIds([]);
    setCounties([]);
    setLookupError("");
    if (!state) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/territory-counties?state=${encodeURIComponent(state)}`);
      const payload = await response.json() as { counties?: County[]; error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Unable to load counties.");
      setCounties(payload.counties ?? []);
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : "Unable to load counties.");
    } finally {
      setLoading(false);
    }
  }

  function addRules() {
    const selected = counties.filter((county) => selectedCountyIds.includes(county.county_geoid));
    if (!selected.length || !selectedState) return;
    setRules((current) => {
      const remaining = current.filter((rule) => !selected.some((county) => county.county_geoid === rule.county_geoid));
      return [...remaining, ...selected.map((county) => ({ ...county, coverage_mode: mode, state_code: selectedState }))];
    });
    setSelectedCountyIds([]);
  }

  function toggleFullState(state: string) {
    const isFullState = fullStateCodes.includes(state);
    setFullStateCodes((current) => isFullState ? current.filter((code) => code !== state) : [...current, state]);
    if (!isFullState) {
      setRules((current) => current.filter((rule) => rule.state_code !== state));
      if (selectedState === state) {
        setSelectedState("");
        setSelectedCountyIds([]);
        setCounties([]);
      }
    }
  }

  function addCounty(countyId: string) {
    setSelectedCountyIds((current) => current.includes(countyId) ? current : [...current, countyId]);
  }

  function removeCounty(countyId: string) {
    setSelectedCountyIds((current) => current.filter((id) => id !== countyId));
  }

  const availableCounties = counties.filter((county) => !selectedCountyIds.includes(county.county_geoid));
  const chosenCounties = counties.filter((county) => selectedCountyIds.includes(county.county_geoid));

  return <>
    <input name="county_rules_json" type="hidden" value={JSON.stringify(rules.map(({ county_geoid, coverage_mode }) => ({ county_geoid, coverage_mode })))} />
    <p className="fieldset-note">Select a whole state or set up partial coverage by county. Whole-state selection is exclusive and removes county rules for that state.</p>
    <div className="territory-state-grid">{US_STATES.map((state) => <label className="checkbox-label" key={state}><input checked={fullStateCodes.includes(state)} name="state_code" onChange={() => toggleFullState(state)} type="checkbox" value={state} />{state}</label>)}</div>
    <div className="form-grid territory-county-picker">
      <label>State for Partial Coverage<select onChange={(event) => void loadCounties(event.target.value)} value={selectedState}><option value="">Select a state</option>{availableStates.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
      <label>County Rule<select onChange={(event) => setMode(event.target.value as "include" | "exclude")} value={mode}><option value="include">Include selected counties</option><option value="exclude">Exclude selected counties</option></select></label>
      <div className="full-width-field territory-county-lists"><div><span className="field-label">Available Counties</span><div className="territory-county-list">{availableCounties.map((county) => <button disabled={loading} key={county.county_geoid} onDoubleClick={() => addCounty(county.county_geoid)} type="button">{county.county_name}</button>)}{selectedState && !loading && !availableCounties.length ? <span>No counties available.</span> : null}</div></div><div><span className="field-label">Selected Counties</span><div className="territory-county-list">{chosenCounties.map((county) => <button key={county.county_geoid} onDoubleClick={() => removeCounty(county.county_geoid)} type="button">{county.county_name}</button>)}{selectedState && !loading && !chosenCounties.length ? <span>No counties selected.</span> : null}</div></div></div>
    </div>
    {loading ? <p className="fieldset-note">Loading counties...</p> : null}{lookupError ? <p className="form-error">{lookupError}</p> : null}
    <button className="secondary-action" disabled={!selectedCountyIds.length} onClick={addRules} type="button">Add County Rule</button>
    {rules.length ? <div className="territory-rule-list">{rules.map((rule) => <div className="territory-rule" key={rule.county_geoid}><span>{rule.state_code} / {rule.county_name}</span><span className={`territory-coverage-mode territory-coverage-mode--${rule.coverage_mode}`}>{rule.coverage_mode === "include" ? "Included" : "Excluded"}</span><button className="text-action" onClick={() => setRules((current) => current.filter((item) => item.county_geoid !== rule.county_geoid))} type="button">Remove</button></div>)}</div> : null}
    <div className="form-grid">
      <label>Individual ZIP Additions<textarea defaultValue={includedPostalCodes.join("\n")} name="include_zip_codes" placeholder="One ZIP code per line, or separate with commas" /></label>
      <label>ZIP Codes to Remove<textarea defaultValue={excludedPostalCodes.join("\n")} name="exclude_zip_codes" placeholder="Paste ZIP codes here: one per line or separated with commas" /></label>
    </div>
    <p className="fieldset-note">{resolvedZipCount ? `${resolvedZipCount.toLocaleString()} ZIP codes are currently resolved for this territory. ZIP codes entered above are removed when the territory is saved.` : "The resolved ZIP list is created when the territory is saved."}</p>
  </>;
}
