const statusLabel = (status: string) => ({
  draft: "Draft",
  ready_for_review: "Ready for Review",
  for_vendor_confirmation: "For Vendor Confirmation",
  in_production: "In Production",
}[status] ?? status.replaceAll("_", " "));

export function PurchaseOrderStatus({ status }: { status: string }) {
  return <div className="purchase-order-status" role="status"><span>Current Order Status</span><strong>{statusLabel(status)}</strong></div>;
}
