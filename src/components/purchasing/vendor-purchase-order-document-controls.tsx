"use client";

export function VendorPurchaseOrderDocumentControls({ orderNumber, recipientEmail }: { orderNumber: string; recipientEmail: string | null }) {
  const subject = encodeURIComponent(`Purchase Order ${orderNumber}`);
  const body = encodeURIComponent(`Please find purchase order ${orderNumber} attached.`);
  return <div className="record-hero-actions print-hidden"><button className="primary-action" onClick={() => window.print()} type="button">Download PO PDF</button><a className="secondary-action" href={`mailto:${recipientEmail ?? ""}?subject=${subject}&body=${body}`}>Email PO to Vendor</a></div>;
}
