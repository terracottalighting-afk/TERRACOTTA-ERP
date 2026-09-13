"use client";

import { useState } from "react";

type ShipmentFreightFieldsProps = {
  actualCost?: number;
  customerCharge?: number;
  masterTrackingNumber?: string;
};

export function ShipmentFreightFields({ actualCost = 0, customerCharge, masterTrackingNumber = "" }: ShipmentFreightFieldsProps) {
  const [freeFreight, setFreeFreight] = useState(false);
  const [charge, setCharge] = useState(customerCharge === undefined ? "" : String(customerCharge));

  return <div className="shipment-freight-fields">
    <label>Master Tracking No.<input defaultValue={masterTrackingNumber} name="master_tracking_number" /></label>
    <label>Actual Freight Cost (Internal)<input defaultValue={actualCost} min="0" name="freight_cost" step="0.01" type="number" /></label>
    <label>Customer Freight Charge<input disabled={freeFreight} min="0" name="shipping_fee" onChange={(event) => setCharge(event.target.value)} step="0.01" type="number" value={freeFreight ? "0.00" : charge} /></label>
    <label className="checkbox-label"><input checked={freeFreight} name="is_free_freight" onChange={(event) => setFreeFreight(event.target.checked)} type="checkbox" /> Free Freight for customer</label>
  </div>;
}
