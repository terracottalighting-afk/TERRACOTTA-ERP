"use client";

import { useState } from "react";

type Carrier = { carrier_name: string; freight_type: "small_parcel_ground" | "ltl" | "sea_freight"; id: string };
type ShippingType = "parcel" | "ltl" | "sea_freight";

const shippingTypeByFreightType: Record<Carrier["freight_type"], ShippingType> = { small_parcel_ground: "parcel", ltl: "ltl", sea_freight: "sea_freight" };
const shippingTypeLabel: Record<ShippingType, string> = { parcel: "Small Parcel / Ground", ltl: "LTL", sea_freight: "Sea Freight" };

export function ShipmentCarrierFields({ carriers, currentCarrier = "", currentShippingType = "" }: { carriers: Carrier[]; currentCarrier?: string; currentShippingType?: string }) {
  const initialCarrier = carriers.find((carrier) => carrier.carrier_name === currentCarrier);
  const [carrierId, setCarrierId] = useState(initialCarrier?.id ?? "");
  const carrier = carriers.find((candidate) => candidate.id === carrierId);
  const effectiveType = carrier ? shippingTypeByFreightType[carrier.freight_type] : currentShippingType;
  return <>
    <input name="existing_carrier" type="hidden" value={currentCarrier} />
    <input name="existing_shipping_type" type="hidden" value={currentShippingType} />
    <label>Carrier<select name="freight_carrier_id" onChange={(event) => setCarrierId(event.target.value)} value={carrierId}><option value="">Select later</option>{carriers.map((option) => <option key={option.id} value={option.id}>{option.carrier_name}</option>)}</select></label>
    <label>Freight Type<input readOnly value={effectiveType && effectiveType in shippingTypeLabel ? shippingTypeLabel[effectiveType as ShippingType] : "Select a carrier"} /></label>
  </>;
}
