"use client";

import { useFormStatus } from "react-dom";

export function ShipmentSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="primary-action" disabled={pending} type="submit">
      {pending ? "Creating Shipment..." : "Create Pending Shipment and Packing List"}
    </button>
  );
}
