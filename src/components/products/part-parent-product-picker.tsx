"use client";

import { useMemo, useState } from "react";

type ProductOption = {
  brandName: string;
  id: string;
  name: string;
  sku: string;
};

export function PartParentProductPicker({ products }: { products: ProductOption[] }) {
  const [query, setQuery] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const normalizedQuery = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      normalizedQuery
        ? products.filter((product) => `${product.sku} ${product.name} ${product.brandName}`.toLowerCase().includes(normalizedQuery)).slice(0, 20)
        : [],
    [normalizedQuery, products]
  );
  const selectedProducts = products.filter((product) => selectedProductIds.has(product.id));

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

  return (
    <div className="part-parent-product-picker">
      {[...selectedProductIds].map((productId) => (
        <input key={productId} name="parent_product_ids" type="hidden" value={productId} />
      ))}
      <label>
        Search by SKU or product name
        <input
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Start typing a SKU, such as TEST-TD..."
          type="search"
          value={query}
        />
      </label>
      <p className="fieldset-note">Enter at least part of a SKU or product name, then check each product to link.</p>

      {normalizedQuery ? (
        matches.length > 0 ? (
          <div className="checkbox-option-list">
            {matches.map((product) => (
              <label className="checkbox-label" key={product.id}>
                <input
                  checked={selectedProductIds.has(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  type="checkbox"
                />
                <span>
                  <strong>{product.sku}</strong> / {product.name} / {product.brandName}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="fieldset-note">No matching regular products found.</p>
        )
      ) : null}

      {selectedProducts.length > 0 ? (
        <div className="selected-product-summary">
          <strong>{selectedProducts.length} product{selectedProducts.length === 1 ? "" : "s"} selected</strong>
          <div>
            {selectedProducts.map((product) => (
              <button className="selected-product-chip" key={product.id} onClick={() => toggleProduct(product.id)} type="button">
                {product.sku} x
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
