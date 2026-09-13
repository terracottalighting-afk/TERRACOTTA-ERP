"use client";

export function OrderAcknowledgementControls({
  documentLabel,
  orderNumber,
  recipientEmail,
}: {
  documentLabel: "Order Acknowledgement" | "Order Status";
  orderNumber: string;
  recipientEmail?: string | null;
}) {
  const subject = encodeURIComponent(`${documentLabel} ${orderNumber}`);
  const body = encodeURIComponent(
    `Please find the ${documentLabel.toLowerCase()} for ${orderNumber} attached.`,
  );
  const mailto = `mailto:${recipientEmail ?? ""}?subject=${subject}&body=${body}`;

  return (
    <div className="record-hero-actions print-hidden">
      <button className="primary-action" onClick={() => window.print()} type="button">
        Download {documentLabel}
      </button>
      <a className="secondary-action" href={mailto}>
        Email {documentLabel}
      </a>
    </div>
  );
}
