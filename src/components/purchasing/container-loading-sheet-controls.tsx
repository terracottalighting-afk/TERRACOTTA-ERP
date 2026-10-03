"use client";

export function ContainerLoadingSheetControls({ containerNumber, downloadLabel = "Download Loading Sheet PDF", recipientEmail, vendorName }: { containerNumber: string; downloadLabel?: string; recipientEmail: string | null; vendorName: string }) {
  const subject = encodeURIComponent(`Container Loading Sheet ${containerNumber}`);
  const body = encodeURIComponent(`Please find the loading sheet for container ${containerNumber}. This sheet lists the products to be loaded for ${vendorName}.`);
  return <div className="record-hero-actions print-hidden"><button className="primary-action" onClick={() => window.print()} type="button">{downloadLabel}</button>{recipientEmail ? <a className="secondary-action" href={`mailto:${recipientEmail}?subject=${subject}&body=${body}`}>Email Loading Sheet to Vendor</a> : null}</div>;
}
