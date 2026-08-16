"use client";

import Link from "next/link";
import { Fragment, useState } from "react";

type ProductListRow = {
  brand_name: string;
  category_name: string | null;
  customer_eligibility_tag: string;
  default_price: number | null;
  id: string;
  incoming_quantity: number | null;
  name: string;
  next_incoming_eta: string | null;
  sellability_status: string;
  sellable_quantity: number | null;
  sku: string;
  status: string;
  parts: ProductPartRow[];
};

type ProductPartRow = {
  component_name: string;
  component_product_id: string;
  component_sellability_status: string;
  component_sku: string;
  component_status: string;
  id: string;
  incoming_quantity: number | null;
  next_incoming_eta: string | null;
  part_role: string | null;
  quantity_required: number;
  sellable_quantity: number | null;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency"
});

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

function money(value: number | null | undefined) {
  return value === null || value === undefined ? "Not set" : currencyFormatter.format(Number(value));
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

function StatusBadge({ tone = "neutral", value }: { tone?: "good" | "neutral" | "warn"; value: string }) {
  return <span className={`status-badge status-badge--${tone}`}>{label(value)}</span>;
}

export function ProductListRows({ products }: { products: ProductListRow[] }) {
  const [expandedProductIds, setExpandedProductIds] = useState<Set<string>>(new Set());
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (productId: string) => {
    setExpandedProductIds((current) => {
      const next = new Set(current);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((current) => {
      const next = new Set(current);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });
  };

  if (products.length === 0) {
    return (
      <tr>
        <td colSpan={10}>No products found.</td>
      </tr>
    );
  }

  return (
    <>
      {products.map((product) => {
        const isExpanded = expandedProductIds.has(product.id);
        const isSelected = selectedProductIds.has(product.id);

        return (
          <Fragment key={product.id}>
            <tr
              className={isSelected ? "selectable-table-row selectable-table-row--selected" : "selectable-table-row"}
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("a,input,button")) {
                  return;
                }

                toggleProduct(product.id);
              }}
            >
              <td className="expand-column">
                <button
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? "Hide" : "Show"} parts for ${product.sku}`}
                  className="row-expand-button"
                  disabled={product.parts.length === 0}
                  onClick={() => toggleExpanded(product.id)}
                  title={product.parts.length > 0 ? `${product.parts.length} linked parts` : "No linked parts"}
                  type="button"
                >
                  {isExpanded ? "-" : "+"}
                </button>
                {isSelected ? <input name="product_ids" type="hidden" value={product.id} /> : null}
              </td>
              <td>
                <Link className="table-link" href={`/?module=products&product=${product.id}`}>
                  {product.sku}
                </Link>
              </td>
              <td>{product.name}</td>
              <td>{product.brand_name}</td>
              <td>{product.category_name ?? "Not set"}</td>
              <td>{label(product.customer_eligibility_tag)}</td>
              <td>
                <div className="inventory-cell">
                  <strong>{numberFormatter.format(Number(product.sellable_quantity ?? 0))}</strong>
                  <span>{Number(product.sellable_quantity ?? 0) > 0 ? "Available" : "Out of stock"}</span>
                </div>
              </td>
              <td>
                {Number(product.sellable_quantity ?? 0) > 0
                  ? "In stock"
                  : product.next_incoming_eta
                    ? `${dateLabel(product.next_incoming_eta)} (${numberFormatter.format(Number(product.incoming_quantity ?? 0))})`
                    : "No ETA"}
              </td>
              <td>{money(product.default_price)}</td>
              <td>
                <div className="badge-row">
                  <StatusBadge tone={product.status === "active" ? "good" : "warn"} value={product.status} />
                  <StatusBadge value={product.sellability_status} />
                </div>
              </td>
            </tr>
            {isExpanded ? (
              <tr className="product-parts-row">
                <td colSpan={10}>
                  <div className="parts-panel">
                    <div className="parts-panel-title">Linked parts for {product.sku}</div>
                    <table className="parts-table">
                      <thead>
                        <tr>
                          <th>Part SKU</th>
                          <th>Part Name</th>
                          <th>Qty Required</th>
                          <th>Part Role</th>
                          <th>Inventory</th>
                          <th>ETA</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.parts.map((part) => (
                          <tr key={part.id}>
                            <td>
                              <Link className="table-link" href={`/?module=product-parts&part=${part.component_product_id}`}>
                                {part.component_sku}
                              </Link>
                            </td>
                            <td>{part.component_name}</td>
                            <td>{numberFormatter.format(Number(part.quantity_required))}</td>
                            <td>{label(part.part_role)}</td>
                            <td>
                              <div className="inventory-cell">
                                <strong>{numberFormatter.format(Number(part.sellable_quantity ?? 0))}</strong>
                                <span>{Number(part.sellable_quantity ?? 0) > 0 ? "Available" : "Out of stock"}</span>
                              </div>
                            </td>
                            <td>
                              {Number(part.sellable_quantity ?? 0) > 0
                                ? "In stock"
                                : part.next_incoming_eta
                                  ? `${dateLabel(part.next_incoming_eta)} (${numberFormatter.format(Number(part.incoming_quantity ?? 0))})`
                                  : "No ETA"}
                            </td>
                            <td>
                              <div className="badge-row">
                                <StatusBadge tone={part.component_status === "active" ? "good" : "warn"} value={part.component_status} />
                                <StatusBadge value={part.component_sellability_status} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            ) : null}
          </Fragment>
        );
      })}
    </>
  );
}
