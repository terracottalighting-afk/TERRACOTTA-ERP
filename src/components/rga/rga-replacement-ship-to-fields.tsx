"use client";

import { useState } from "react";

type Location = { id: string; location_name: string; address_line_1: string | null; city: string | null; state_province: string | null; postal_code: string | null };

export function RgaReplacementShipToFields({ defaultLocationId, locations }: { defaultLocationId: string; locations: Location[] }) {
  const [locationId, setLocationId] = useState(defaultLocationId);
  return <div className="form-grid"><label className="full-width-field">Ship To<select name="ship_to_location_id" onChange={(event) => setLocationId(event.target.value)} value={locationId}><option value="">Direct-to-customer address</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.location_name} - {location.address_line_1}, {location.city}, {location.state_province} {location.postal_code}</option>)}</select></label>{!locationId ? <><label>Recipient Name<input name="dropship_name" placeholder="Required for direct shipment" /></label><label>Address Line 1<input name="dropship_address_line_1" /></label><label>City<input name="dropship_city" /></label><label>State / Province<input name="dropship_state_province" /></label><label>Postal Code<input name="dropship_postal_code" /></label><label>Country<input defaultValue="United States" name="dropship_country" /></label><label>Contact Email<input name="dropship_email" type="email" /></label><label>Contact Phone<input name="dropship_phone" /></label></> : null}</div>;
}
