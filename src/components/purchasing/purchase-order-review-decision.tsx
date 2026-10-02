"use client";

import { useState, useTransition } from "react";

type DecisionResult = { destination?: string; error?: string };

export function PurchaseOrderReviewDecision({ decisionAction, purchaseOrderId, reviewNotes: initialReviewNotes }: { decisionAction: (formData: FormData) => Promise<DecisionResult>; purchaseOrderId: string; reviewNotes: string }) {
  const [reviewNotes, setReviewNotes] = useState(initialReviewNotes);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const submit = (decision: "approve" | "reject") => startTransition(async () => {
    setError(null);
    const formData = new FormData();
    formData.set("purchase_order_id", purchaseOrderId);
    formData.set("decision", decision);
    formData.set("review_notes", reviewNotes);
    const result = await decisionAction(formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.destination) window.location.assign(result.destination);
  });

  return <section className="customer-form"><fieldset><legend>Reviewer Decision</legend><div className="form-grid"><label>Review Notes<textarea onChange={(event) => setReviewNotes(event.target.value)} rows={3} value={reviewNotes} /></label></div></fieldset><div className="form-actions"><button className="primary-action" disabled={isPending} onClick={() => submit("approve")} type="button">{isPending ? "Saving..." : "Approve"}</button><button className="secondary-action secondary-action--light" disabled={isPending} onClick={() => submit("reject")} type="button">Reject</button></div>{error ? <div className="form-alert">{error}</div> : null}</section>;
}
