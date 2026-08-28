"use client";

export function InvoiceDocumentControls({
  invoiceNumber,
  recipientEmail
}: {
  invoiceNumber: string;
  recipientEmail?: string | null;
}) {
  const subject = encodeURIComponent(`Invoice ${invoiceNumber}`);
  const body = encodeURIComponent(`Please find invoice ${invoiceNumber} attached.`);
  const mailto = `mailto:${recipientEmail ?? ""}?subject=${subject}&body=${body}`;

  return (
    <div className="record-hero-actions print-hidden">
      <button className="primary-action" onClick={() => window.print()} type="button">Download Invoice PDF</button>
      <a className="secondary-action" href={mailto}>Email Invoice</a>
    </div>
  );
}
