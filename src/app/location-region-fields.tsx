"use client";

import { useMemo, useState } from "react";

const regionOptionsByCountry = {
  CAN: [
    ["AB", "Alberta"],
    ["BC", "British Columbia"],
    ["MB", "Manitoba"],
    ["NB", "New Brunswick"],
    ["NL", "Newfoundland and Labrador"],
    ["NS", "Nova Scotia"],
    ["NT", "Northwest Territories"],
    ["NU", "Nunavut"],
    ["ON", "Ontario"],
    ["PE", "Prince Edward Island"],
    ["QC", "Quebec"],
    ["SK", "Saskatchewan"],
    ["YT", "Yukon"]
  ],
  MEX: [
    ["AGU", "Aguascalientes"],
    ["BCN", "Baja California"],
    ["BCS", "Baja California Sur"],
    ["CAM", "Campeche"],
    ["CHP", "Chiapas"],
    ["CHH", "Chihuahua"],
    ["CMX", "Ciudad de Mexico"],
    ["COA", "Coahuila"],
    ["COL", "Colima"],
    ["DUR", "Durango"],
    ["GUA", "Guanajuato"],
    ["GRO", "Guerrero"],
    ["HID", "Hidalgo"],
    ["JAL", "Jalisco"],
    ["MEX", "Mexico"],
    ["MIC", "Michoacan"],
    ["MOR", "Morelos"],
    ["NAY", "Nayarit"],
    ["NLE", "Nuevo Leon"],
    ["OAX", "Oaxaca"],
    ["PUE", "Puebla"],
    ["QUE", "Queretaro"],
    ["ROO", "Quintana Roo"],
    ["SLP", "San Luis Potosi"],
    ["SIN", "Sinaloa"],
    ["SON", "Sonora"],
    ["TAB", "Tabasco"],
    ["TAM", "Tamaulipas"],
    ["TLA", "Tlaxcala"],
    ["VER", "Veracruz"],
    ["YUC", "Yucatan"],
    ["ZAC", "Zacatecas"]
  ],
  USA: [
    ["AL", "Alabama"],
    ["AK", "Alaska"],
    ["AZ", "Arizona"],
    ["AR", "Arkansas"],
    ["CA", "California"],
    ["CO", "Colorado"],
    ["CT", "Connecticut"],
    ["DE", "Delaware"],
    ["FL", "Florida"],
    ["GA", "Georgia"],
    ["HI", "Hawaii"],
    ["ID", "Idaho"],
    ["IL", "Illinois"],
    ["IN", "Indiana"],
    ["IA", "Iowa"],
    ["KS", "Kansas"],
    ["KY", "Kentucky"],
    ["LA", "Louisiana"],
    ["ME", "Maine"],
    ["MD", "Maryland"],
    ["MA", "Massachusetts"],
    ["MI", "Michigan"],
    ["MN", "Minnesota"],
    ["MS", "Mississippi"],
    ["MO", "Missouri"],
    ["MT", "Montana"],
    ["NE", "Nebraska"],
    ["NV", "Nevada"],
    ["NH", "New Hampshire"],
    ["NJ", "New Jersey"],
    ["NM", "New Mexico"],
    ["NY", "New York"],
    ["NC", "North Carolina"],
    ["ND", "North Dakota"],
    ["OH", "Ohio"],
    ["OK", "Oklahoma"],
    ["OR", "Oregon"],
    ["PA", "Pennsylvania"],
    ["RI", "Rhode Island"],
    ["SC", "South Carolina"],
    ["SD", "South Dakota"],
    ["TN", "Tennessee"],
    ["TX", "Texas"],
    ["UT", "Utah"],
    ["VT", "Vermont"],
    ["VA", "Virginia"],
    ["WA", "Washington"],
    ["WV", "West Virginia"],
    ["WI", "Wisconsin"],
    ["WY", "Wyoming"]
  ]
};

const countryOptions = [
  { code: "USA", name: "United States" },
  { code: "CAN", name: "Canada" },
  { code: "MEX", name: "Mexico" },
  { code: "CHN", name: "China" }
];

export function LocationRegionFields({
  defaultCountryCode = "USA",
  defaultStateProvince = ""
}: {
  defaultCountryCode?: string;
  defaultStateProvince?: string;
}) {
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const regionOptions = useMemo(
    () => regionOptionsByCountry[countryCode as keyof typeof regionOptionsByCountry] ?? [],
    [countryCode]
  );

  return (
    <>
      <label>
        State / Province
        {regionOptions.length > 0 ? (
          <select key={countryCode} defaultValue={defaultStateProvince} name="state_province">
            <option value="">Select state / province</option>
            {regionOptions.map(([code, name]) => (
              <option key={`${countryCode}-${code}`} value={code}>
                {name}
              </option>
            ))}
          </select>
        ) : (
          <input key={countryCode} defaultValue={defaultStateProvince} name="state_province" placeholder="Enter state / province" />
        )}
      </label>
      <label>
        Country
        <select name="country_code" onChange={(event) => setCountryCode(event.target.value)} value={countryCode}>
          {countryOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
