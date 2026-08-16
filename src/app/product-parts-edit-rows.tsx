"use client";

import Link from "next/link";
import { useState } from "react";

type ProductPartEditRow = {
  component_name: string;
  component_product_id: string;
  component_sku: string;
  id: string;
  is_required: boolean;
  notes: string | null;
  part_name: string | null;
  part_role: string | null;
};

type ProductOption = {
  id: string;
  name: string;
  sku: string;
};

function label(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ProductPartsEditRows({
  activeAction,
  initialSelectedPartIds = [],
  parentProductId,
  parts,
  productOptions,
  roleOptions
}: {
  activeAction: string;
  initialSelectedPartIds?: string[];
  parentProductId: string;
  parts: ProductPartEditRow[];
  productOptions: ProductOption[];
  roleOptions: string[];
}) {
  const hasInitialSelection = initialSelectedPartIds.length > 0;
  const visibleParts = hasInitialSelection ? parts.filter((part) => initialSelectedPartIds.includes(part.id)) : parts;
  const [selectedPartIds, setSelectedPartIds] = useState<Set<string>>(() => new Set(hasInitialSelection ? visibleParts.map((part) => part.id) : []));
  const [showParentPicker, setShowParentPicker] = useState(false);
  const parentOptions = productOptions.filter((product) => product.id !== parentProductId);

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

  if (visibleParts.length === 0) {
    return <p className="fieldset-note">No active parts are linked to this product yet.</p>;
  }

  return (
    <>
      <p className="fieldset-note">
        {hasInitialSelection
          ? "Only the selected part lines are shown here. Single-click a line to include or exclude it from this save."
          : "Single-click a line to select it. Selected lines are highlighted and can be edited."}
      </p>
      {[...selectedPartIds].map((partId) => (
        <input key={partId} name="selected_part_ids" type="hidden" value={partId} />
      ))}
      <div className="table-wrap">
        <table className="editable-table product-parts-edit-table">
          <thead>
            <tr>
              <th>Part SKU</th>
              <th>Part Name</th>
              <th>Role</th>
              <th>Required</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {visibleParts.map((part) => {
              const isSelected = selectedPartIds.has(part.id);

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
                  <td>
                    <input defaultValue={part.part_name ?? ""} name={`part_name_${part.id}`} placeholder={part.component_name} />
                  </td>
                  <td>
                    <select defaultValue={part.part_role ?? ""} name={`part_role_${part.id}`}>
                      <option value="">Not set</option>
                      {roleOptions.map((role) => (
                        <option key={role} value={role}>
                          {label(role)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <label className="checkbox-label checkbox-label--compact">
                      <input defaultChecked={part.is_required} name={`is_required_${part.id}`} type="checkbox" />
                      Required
                    </label>
                  </td>
                  <td>
                    <input defaultValue={part.notes ?? ""} name={`notes_${part.id}`} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="form-actions form-actions--inline">
        {activeAction === "delete" ? (
          <button className="danger-action" name="part_save_action" type="submit" value="delete">
            Delete Selected
          </button>
        ) : (
          <>
            <button name="part_save_action" type="submit" value="edit">
              Edit Selected
            </button>
            <button className="secondary-action secondary-action--light" onClick={() => setShowParentPicker((current) => !current)} type="button">
              Add a Parent Product
            </button>
          </>
        )}
      </div>
      {activeAction !== "delete" && showParentPicker ? (
        <div className="inline-action-panel">
          <label>
            Additional Parent Product
            <select name="additional_parent_product_id">
              <option value="">Select product SKU to link</option>
              {parentOptions.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.sku} / {product.name}
                </option>
              ))}
            </select>
          </label>
          <button name="part_save_action" type="submit" value="add_parent">
            Link Parent Product
          </button>
        </div>
      ) : null}
    </>
  );
}
