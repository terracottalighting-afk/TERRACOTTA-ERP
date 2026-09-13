"use client";

export function CreditMemoDocumentControls({ creditMemoNumber, recipientEmail }: { creditMemoNumber: string; recipientEmail?: string | null }) {
  const subject = encodeURIComponent(`Credit Memo ${creditMemoNumber}`);
  const body = encodeURIComponent(`Please find the credit memo for ${creditMemoNumber} attached.`);

  return <div className="record-hero-actions print-hidden">
    <button className="primary-action" onClick={() => window.print()} type="button">Download Credit Memo</button>
    <a className="secondary-action" href={`mailto:${recipientEmail ?? ""}?subject=${subject}&body=${body}`}>Email Credit Memo</a>
  </div>;
}
