"use client";

export function QuoteDocumentControls() {
  return (
    <button className="primary-action" onClick={() => window.print()} type="button">
      Export PDF
    </button>
  );
}
