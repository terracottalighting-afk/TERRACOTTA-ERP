type ShipmentFreightFieldsProps = {
  actualCost?: number;
  masterTrackingNumber?: string;
};

export function ShipmentFreightFields({ actualCost = 0, masterTrackingNumber = "" }: ShipmentFreightFieldsProps) {
  return <div className="shipment-freight-fields">
    <label>Master Tracking No.<input defaultValue={masterTrackingNumber} name="master_tracking_number" /></label>
    <label>Actual Freight Cost (Internal)<input defaultValue={actualCost} min="0" name="freight_cost" step="0.01" type="number" /></label>
  </div>;
}
