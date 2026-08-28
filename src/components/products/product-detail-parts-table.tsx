"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ProductDetailPartRow = {
  component_name: string;
  component_product_id: string;
  component_sellability_status: string;
  component_sku: string;
  component_status: string;
  id: string;
  is_required: boolean;
  next_incoming_eta: string | null;
  notes: string | null;
  part_name: string | null;
  part_role: string | null;
  sellable_quantity: number | null;
};

const numberFormatter = new Intl.NumberFormat("en-US");

function label(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function dateLabel(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function statusTone(value: string) {
  return value === "active" ? "status-badge status-badge--good" : "status-badge status-badge--warn";
}

export function ProductDetailPartsTable({ parts, productId }: { parts: ProductDetailPartRow[]; productId: string }) {
  const router = useRouter();
  const [selectedPartIds, setSelectedPartIds] = useState<Set<string>>(new Set());
  const selectedParam = useMemo(() => [...selectedPartIds].join(","), [selectedPartIds]);

  const togglePart = (partId: string) => {
    setSelectedPartIds((current) => {
      const next = new Set(current);

      if (next.has(partId)) {
        next.delete(partId);
      } else {
        next.add(partId);
      }

      return next;
    });
  };

  const openSelectedAction = (action: "delete" | "edit") => {
    if (!selectedParam) {
      return;
    }

    const search = new URLSearchParams({
      module: "edit-product-parts",
      product: productId,
      selected_parts: selectedParam
    });

    if (action === "delete") {
      search.set("part_action", "delete");
    }

    router.push(`/?${search.toString()}`);
  };

  return (
    <div className="info-card">
      <div className="card-heading">
        <h3>Parts Used By This Product</h3>
        <div className="section-title-actions">
          <Link className="text-action" href={`/?module=edit-product-parts&product=${productId}&part_action=add`}>
            Add Part
          </Link>
          <button
            className="text-action text-action--button"
            disabled={selectedPartIds.size === 0}
            onClick={() => openSelectedAction("edit")}
            type="button"
          >
            Edit Selected
          </button>
          <button
            className="text-action text-action--button text-action--danger"
            disabled={selectedPartIds.size === 0}
            onClick={() => openSelectedAction("delete")}
            type="button"
          >
            Delete Selected
          </button>
        </div>
      </div>
      <p className="fieldset-note">Single-click a part line to select it. Selected lines are highlighted.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Part SKU</th>
              <th>Part Name</th>
              <th>Role</th>
              <th>Required</th>
              <th>Inventory</th>
              <th>ETA</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {parts.length === 0 ? (
              <tr>
                <td colSpan={8}>No linked parts found for this product.</td>
              </tr>
            ) : (
              parts.map((part) => {
                const isSelected = selectedPartIds.has(part.id);
                const sellableQuantity = Number(part.sellable_quantity ?? 0);

                return (
                  <tr
                    className={isSelected ? "selectable-table-row selectable-table-row--selected" : "selectable-table-row"}
                    key={part.id}
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest("a,input,select,textarea,button")) {
                        return;
                      }

                      togglePart(part.id);
                    }}
                  >
                    <td>
                      <Link className="table-link" href={`/?module=product-parts&part=${part.component_product_id}`}>
                        {part.component_sku}
                      </Link>
                    </td>
                    <td>{part.part_name ?? part.component_name}</td>
                    <td>{label(part.part_role)}</td>
                    <td>{part.is_required ? "Yes" : "No"}</td>
                    <td>{numberFormatter.format(sellableQuantity)}</td>
                    <td>{sellableQuantity > 0 ? "In stock" : part.next_incoming_eta ? dateLabel(part.next_incoming_eta) : "No ETA"}</td>
                    <td>
                      <div className="badge-row">
                        <span className={statusTone(part.component_status)}>{label(part.component_status)}</span>
                        <span className="status-badge">{label(part.component_sellability_status)}</span>
                      </div>
                    </td>
                    <td>{part.notes ?? "Not set"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
