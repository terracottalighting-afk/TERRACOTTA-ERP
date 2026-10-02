"use client";

import { useState, useTransition } from "react";

type Result = { destination?: string; error?: string };
type Line = { id: string; sku: string; production_status: string; cancellation_reason: string | null };

export function ProductionLineStatusEditor({ line, purchaseOrderId, saveAction }: { line: Line; purchaseOrderId: string; saveAction: (formData: FormData) => Promise<Result> }) {
  const [status, setStatus] = useState(line.production_status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return <form className="inline-form" onSubmit={(event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      setError(null);
      const result = await saveAction(formData);
      if (result.error) setError(result.error);
      else if (result.destination) window.location.assign(result.destination);
    });
  }}><input name="purchase_order_id" type="hidden" value={purchaseOrderId} /><input name="line_id" type="hidden" value={line.id} /><select aria-label={`Production status for ${line.sku}`} name="production_status" onChange={(event) => setStatus(event.target.value)} value={status}><option value="in_production">In Production</option><option value="complete">Complete</option><option value="qa_pass">QA Pass</option><option value="qa_failed">QA Failed</option><option value="exit_factory">Exit Factory</option><option value="cancelled">Cancelled</option></select>{status === "cancelled" ? <input aria-label={`Cancellation reason for ${line.sku}`} defaultValue={line.cancellation_reason ?? ""} name="cancellation_reason" placeholder="Cancellation reason" required /> : null}<button className="text-action text-action--button" disabled={isPending} type="submit">{isPending ? "Saving..." : "Save"}</button>{error ? <div className="form-alert">{error}</div> : null}</form>;
}
