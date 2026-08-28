"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  actualFreightCost: number;
  cancelHref: string;
  currentFreightCharge: number;
  customerId: string;
  packingListId: string;
};

const money = (value: number) => new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" }).format(value);

export function PackingListFreightEditor({ action, actualFreightCost, cancelHref, currentFreightCharge, customerId, packingListId }: Props) {
  const router = useRouter();
  const [freeFreight, setFreeFreight] = useState(currentFreightCharge === 0);
  const [freightCharge, setFreightCharge] = useState(String(currentFreightCharge));

  return <form action={action} className="packing-list-freight-editor">
    <input name="packing_list_id" type="hidden" value={packingListId} />
    <input name="customer_id" type="hidden" value={customerId} />
    <div className="packing-list-freight-summary"><span>Actual Freight Cost <strong>{money(actualFreightCost)}</strong></span><span>Current Freight Charge <strong>{freeFreight ? "Free Freight" : money(currentFreightCharge)}</strong></span></div>
    <div className="packing-list-freight-controls">
      <label>New Freight Charge<input disabled={freeFreight} min="0" name="shipping_fee" onChange={(event) => setFreightCharge(event.target.value)} step="0.01" type="number" value={freeFreight ? "0.00" : freightCharge} /></label>
      <label className="checkbox-label"><input checked={freeFreight} name="is_free_freight" onChange={(event) => setFreeFreight(event.target.checked)} type="checkbox" /> Free Freight</label>
      <button className="primary-action" type="submit">Save</button>
      <button className="secondary-action" onClick={() => router.push(cancelHref)} type="button">Cancel</button>
    </div>
  </form>;
}
