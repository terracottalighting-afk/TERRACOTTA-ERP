"use client";

export function PackingListDocumentControls() {
  return (
    <button className="primary-action" onClick={() => window.print()} type="button">
      Download Packing List PDF
    </button>
  );
}
