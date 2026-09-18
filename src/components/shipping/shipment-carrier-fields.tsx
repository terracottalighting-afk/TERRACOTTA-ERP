"use client";

import { useState } from "react";

type Carrier = { carrier_name: string; freight_type: "small_parcel_ground" | "ltl" | "sea_freight"; id: string };
type ShippingType = "parcel" | "ltl" | "sea_freight";
type CustomerCarrier = { accountNumber: string | null; carrier: string; shippingType: ShippingType };

const shippingTypeByFreightType: Record<Carrier["freight_type"], ShippingType> = { small_parcel_ground: "parcel", ltl: "ltl", sea_freight: "sea_freight" };
const shippingTypeLabel: Record<ShippingType, string> = { parcel: "Small Parcel / Ground", ltl: "LTL", sea_freight: "Sea Freight" };

export function ShipmentCarrierFields({ carriers, currentCarrier = "", currentCarrierAccountNumber = "", currentShippingType = "", customerCarriers = [] }: { carriers: Carrier[]; currentCarrier?: string; currentCarrierAccountNumber?: string; currentShippingType?: string; customerCarriers?: CustomerCarrier[] }) {
  const initialCarrier = carriers.find((carrier) => carrier.carrier_name === currentCarrier);
  const [carrierId, setCarrierId] = useState(initialCarrier?.id ?? "");
  const [useCustomerCarriers, setUseCustomerCarriers] = useState(
    customerCarriers.length > 0,
  );
  const [customerCarrierSelection, setCustomerCarrierSelection] = useState("");
  const carrier = carriers.find((candidate) => candidate.id === carrierId);
  const customerCarrier = customerCarrierSelection ? JSON.parse(customerCarrierSelection) as CustomerCarrier : null;
  const effectiveType = customerCarrier?.shippingType ?? (carrier ? shippingTypeByFreightType[carrier.freight_type] : currentShippingType);
  return <>
    <input name="existing_carrier" type="hidden" value={currentCarrier} />
    <input name="existing_carrier_account_number" type="hidden" value={currentCarrierAccountNumber} />
    <input name="existing_shipping_type" type="hidden" value={currentShippingType} />
    {customerCarriers.length ? <label className="setting-assignment-toggle full-width-field"><input checked={useCustomerCarriers} name="use_customer_carriers" onChange={(event) => setUseCustomerCarriers(event.target.checked)} type="checkbox" />Use Customer Carriers</label> : null}
    <label>Carrier{useCustomerCarriers ? <select name="customer_carrier_selection" onChange={(event) => setCustomerCarrierSelection(event.target.value)} required value={customerCarrierSelection}><option value="">Select customer carrier</option>{customerCarriers.map((option) => <option key={`${option.carrier}-${option.accountNumber ?? ""}-${option.shippingType}`} value={JSON.stringify(option)}>{option.carrier}{option.accountNumber ? ` | Account ${option.accountNumber}` : ""}</option>)}</select> : <select name="freight_carrier_id" onChange={(event) => setCarrierId(event.target.value)} value={carrierId}><option value="">Select later</option>{carriers.map((option) => <option key={option.id} value={option.id}>{option.carrier_name}</option>)}</select>}</label>
    <label>Freight Type<input readOnly value={effectiveType && effectiveType in shippingTypeLabel ? shippingTypeLabel[effectiveType as ShippingType] : "Select a carrier"} /></label>
  </>;
}
