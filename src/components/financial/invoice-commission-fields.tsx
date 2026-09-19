"use client";

import { useState } from "react";

type Brand = {
  brand_id: string;
  brand_name: string;
};

export function InvoiceCommissionFields({
  brands,
  defaultPayable,
  defaultPercent,
}: {
  brands: Brand[];
  defaultPayable: boolean;
  defaultPercent: number | null;
}) {
  const [payableByBrand, setPayableByBrand] = useState<Record<string, boolean>>(
    () => Object.fromEntries(brands.map((brand) => [brand.brand_id, defaultPayable])),
  );

  return (
    <>
      <div className="table-wrap">
        <table className="editable-table">
          <thead>
            <tr>
              <th>Brand Invoice</th>
              <th>Commission Payable</th>
              <th>Commission Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.brand_id}>
                <td>{brand.brand_name}</td>
                <td>
                  <input
                    name={`commission_payable_choice_${brand.brand_id}`}
                    type="hidden"
                    value={
                      payableByBrand[brand.brand_id] ?? defaultPayable
                        ? "true"
                        : "false"
                    }
                  />
                  <label className="inline-checkbox">
                    <input
                      checked={payableByBrand[brand.brand_id] ?? defaultPayable}
                      onChange={(event) =>
                        setPayableByBrand((current) => ({
                          ...current,
                          [brand.brand_id]: event.target.checked,
                        }))
                      }
                      type="checkbox"
                    />
                    Pay commission
                  </label>
                </td>
                <td>
                  <input
                    defaultValue={defaultPercent ?? 0}
                    max={100}
                    min={0}
                    name={`commission_rate_${brand.brand_id}`}
                    step="0.01"
                    type="number"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="form-grid">
        {brands.map((brand) =>
          (payableByBrand[brand.brand_id] ?? defaultPayable) !== defaultPayable ? (
            <label className="full-width-field" key={brand.brand_id}>
              {brand.brand_name} commission decision-change note
              <textarea
                name={`commission_change_reason_${brand.brand_id}`}
                placeholder="Explain why the Pay commission decision changed from the original order"
                required
                rows={2}
              />
            </label>
          ) : null,
        )}
      </div>
    </>
  );
}
