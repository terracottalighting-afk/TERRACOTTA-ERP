"use client";

export function OrderAcknowledgementControls({
  orderNumber,
  recipientEmail,
}: {
  orderNumber: string;
  recipientEmail?: string | null;
}) {
  const subject = encodeURIComponent(`Order Acknowledgement ${orderNumber}`);
  const body = encodeURIComponent(
    `Please find the order acknowledgement for ${orderNumber} attached.`,
  );
  const mailto = `mailto:${recipientEmail ?? ""}?subject=${subject}&body=${body}`;

  return (
    <div className="record-hero-actions print-hidden">
      <button className="primary-action" onClick={() => window.print()} type="button">
        Download Order Acknowledgement
      </button>
      <a className="secondary-action" href={mailto}>
        Email Order Acknowledgement
      </a>
    </div>
  );
}
