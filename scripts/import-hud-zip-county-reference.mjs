import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
const stateFips = { AL: "01", AK: "02", AZ: "04", AR: "05", CA: "06", CO: "08", CT: "09", DE: "10", FL: "12", GA: "13", HI: "15", ID: "16", IL: "17", IN: "18", IA: "19", KS: "20", KY: "21", LA: "22", ME: "23", MD: "24", MA: "25", MI: "26", MN: "27", MS: "28", MO: "29", MT: "30", NE: "31", NV: "32", NH: "33", NJ: "34", NM: "35", NY: "36", NC: "37", ND: "38", OH: "39", OK: "40", OR: "41", PA: "42", RI: "44", SC: "45", SD: "46", TN: "47", TX: "48", UT: "49", VT: "50", VA: "51", WA: "53", WV: "54", WI: "55", WY: "56" };

function envFile() {
  const values = {};
  for (const line of readFileSync(resolve(".env.local"), "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) values[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
  return values;
}

function chunks(values, size = 1000) {
  return Array.from({ length: Math.ceil(values.length / size) }, (_, index) => values.slice(index * size, (index + 1) * size));
}

async function getCountyNames() {
  const counties = new Map();
  for (const state of states) {
    const response = await fetch(`https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_gaz_counties_${stateFips[state]}.txt`);
    if (!response.ok) throw new Error(`Census county lookup failed for ${state}: ${response.status}`);
    const [header, ...rows] = (await response.text()).trim().split(/\r?\n/);
    const columns = header.split("\t");
    const geoidIndex = columns.indexOf("GEOID");
    const nameIndex = columns.indexOf("NAME");
    if (geoidIndex < 0 || nameIndex < 0) throw new Error(`Census county file for ${state} has an unexpected format.`);
    for (const row of rows) {
      const values = row.split("\t");
      const county_geoid = values[geoidIndex];
      if (/^\d{5}$/.test(county_geoid)) counties.set(county_geoid, { county_geoid, county_name: values[nameIndex], state_code: state });
    }
  }
  return counties;
}

async function main() {
  const env = envFile();
  const token = process.env.HUD_API_TOKEN;
  if (!token) throw new Error("Set HUD_API_TOKEN for this session before running the importer.");
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing Supabase settings in .env.local.");
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const countyNames = await getCountyNames();
  const allZipRows = [];

  for (const state of states) {
    process.stdout.write(`Fetching ${state} ZIP-to-county data...\n`);
    const response = await fetch(`https://www.huduser.gov/hudapi/public/usps?type=2&query=${state}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) throw new Error(`HUD ZIP-to-county lookup failed for ${state}: ${response.status}`);
    const payload = await response.json();
    for (const row of payload?.data?.results ?? []) {
      const postal_code = String(row.zip ?? "").padStart(5, "0");
      const county_geoid = String(row.geoid ?? "").padStart(5, "0");
      if (!/^\d{5}$/.test(postal_code) || !/^\d{5}$/.test(county_geoid)) continue;
      if (!countyNames.has(county_geoid)) countyNames.set(county_geoid, { county_geoid, county_name: `County ${county_geoid}`, state_code: state });
      allZipRows.push({ postal_code, county_geoid, state_code: state, residential_ratio: Number(row.res_ratio) || null, business_ratio: Number(row.bus_ratio) || null, other_ratio: Number(row.oth_ratio) || null, total_ratio: Number(row.tot_ratio) || null, source_year: Number(payload?.data?.year) || null, source_quarter: String(payload?.data?.quarter ?? "") || null });
    }
  }

  for (const batch of chunks([...countyNames.values()])) {
    const { error } = await supabase.from("county_reference").upsert(batch, { onConflict: "county_geoid" });
    if (error) throw new Error(error.message);
  }
  for (const batch of chunks(allZipRows)) {
    const { error } = await supabase.from("zip_county_reference").upsert(batch, { onConflict: "postal_code,county_geoid" });
    if (error) throw new Error(error.message);
  }
  process.stdout.write(`Imported ${allZipRows.length.toLocaleString()} ZIP-to-county rows and ${countyNames.size.toLocaleString()} counties.\n`);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; });
