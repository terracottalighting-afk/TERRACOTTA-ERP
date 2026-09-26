"use client";

import { useState } from "react";

const countryCodes: Record<string, string> = {
  China: "CN",
  India: "IN",
  Mexico: "MX",
  "United States": "US",
  Vietnam: "VN",
};

export function VendorCountryFields() {
  const [country, setCountry] = useState("United States");
  return <><label>Country<select name="country" onChange={(event) => setCountry(event.target.value)} value={country} required>{Object.keys(countryCodes).map((name) => <option key={name} value={name}>{name}</option>)}</select></label><label>Country Code<input name="country_code" readOnly value={countryCodes[country]} required /></label></>;
}
