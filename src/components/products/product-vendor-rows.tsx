"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ProductVendor = {
  id: string;
  lead_time_days: number | null;
  minimum_order_quantity: number | null;
  unit_cost: number;
  updated_at: string;
  vendor_id: string;
  vendor_item_number: string;
  vendor_name: string;
};

const moneyFormatter = new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" });

export function ProductVendorRows({ productId, vendors }: { productId: string; vendors: ProductVendor[] }) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const selectedParam = useMemo(() => [...selectedIds].join(","), [selectedIds]);

  const toggle = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openAction = (action: "edit" | "delete") => {
    if (!selectedParam) return;
    router.push(`/?module=edit-product-vendors&product=${productId}&vendor_action=${action}&selected_vendor_products=${selectedParam}`);
  };

  return (
    <section className="detail-section">
      <section className="list-header-panel list-header-panel--compact">
        <span>{vendors.length} vendor{vendors.length === 1 ? "" : "s"}</span>
        <div className="list-actions">
          <Link className="text-action" href={`/?module=edit-product-vendors&product=${productId}&vendor_action=add`}>
            Add Vendor
          </Link>
          <button className="text-action text-action--button" disabled={!selectedParam} onClick={() => openAction("edit")} type="button">
            Edit Selected
          </button>
          <button className="text-action text-action--button text-action--danger" disabled={!selectedParam} onClick={() => openAction("delete")} type="button">
            Delete Selected
          </button>
        </div>
      </section>
      <p className="fieldset-note">Single-click a vendor line to select it for editing or deleting.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Vendor Item No.</th>
              <th>Vendor Price</th>
              <th>MOQ</th>
              <th>Lead Time</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr><td colSpan={6}>No vendors are linked to this product yet.</td></tr>
            ) : vendors.map((vendor) => (
              <tr className={selectedIds.has(vendor.id) ? "selectable-table-row selectable-table-row--selected" : "selectable-table-row"} key={vendor.id} onClick={() => toggle(vendor.id)}>
                <td><Link className="table-link" href={`/?module=purchasing&vendor=${vendor.vendor_id}`}>{vendor.vendor_name}</Link></td>
                <td>{vendor.vendor_item_number}</td>
                <td>{moneyFormatter.format(vendor.unit_cost)}</td>
                <td>{vendor.minimum_order_quantity ?? "Not set"}</td>
                <td>{vendor.lead_time_days === null ? "Not set" : `${vendor.lead_time_days} days`}</td>
                <td>{new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(vendor.updated_at))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
