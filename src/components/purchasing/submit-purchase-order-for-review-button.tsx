"use client";

import { useState, useTransition } from "react";

type SubmissionResult = { destination?: string; error?: string };

export function SubmitPurchaseOrderForReviewButton({ label, purchaseOrderId, submitAction }: { label: string; purchaseOrderId: string; submitAction: (formData: FormData) => Promise<SubmissionResult> }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return <>
    <button className="primary-action" disabled={isPending} onClick={() => startTransition(async () => {
      setError(null);
      const formData = new FormData();
      formData.set("purchase_order_id", purchaseOrderId);
      const result = await submitAction(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.destination) window.location.assign(result.destination);
    })} type="button">{isPending ? "Saving..." : label}</button>
    {error ? <div className="form-alert">{error}</div> : null}
  </>;
}
