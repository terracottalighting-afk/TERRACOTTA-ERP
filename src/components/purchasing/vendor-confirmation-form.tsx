"use client";

import { useState, useTransition } from "react";

type Result = { destination?: string; error?: string };
type Order = { id: string; expected_ready_date: string | null; expected_ship_date: string | null; expected_arrival_date: string | null; expected_available_date: string | null };

export function VendorConfirmationForm({ action, cancelHref, order }: { action: (formData: FormData) => Promise<Result>; cancelHref: string; order: Order }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return <form className="customer-form" onSubmit={(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      setError(null);
      const result = await action(formData);
      if (result.error) setError(result.error);
      else if (result.destination) window.location.assign(result.destination);
    });
  }}><fieldset><legend>Vendor Confirmation</legend><input name="purchase_order_id" type="hidden" value={order.id} /><div className="form-grid"><label>Confirmed Expected Ready Date<input defaultValue={order.expected_ready_date ?? ""} name="expected_ready_date" required type="date" /></label><label>Confirmed Expected Ship Date<input defaultValue={order.expected_ship_date ?? ""} name="expected_ship_date" required type="date" /></label><label>Confirmed Expected Available Date<input defaultValue={order.expected_available_date ?? order.expected_arrival_date ?? ""} name="expected_available_date" required type="date" /></label></div></fieldset><div className="form-actions"><button className="primary-action" disabled={isPending} type="submit">{isPending ? "Saving..." : "Save Vendor Confirmation"}</button><a className="secondary-action secondary-action--light" href={cancelHref}>Cancel</a></div>{error ? <div className="form-alert">{error}</div> : null}</form>;
}
