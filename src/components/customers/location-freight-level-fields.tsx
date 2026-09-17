"use client";

import { useState } from "react";

type FreightLevel = {
  freeFreightAllowance: number;
  freightRatePercent: number;
  id: string;
  levelName: string;
};

export function LocationFreightLevelFields({
  defaultCustomFreightAllowance = "",
  defaultCustomFreightRate = "",
  defaultFreightLevelId = "",
  defaultTerm,
  freightLevels,
}: {
  defaultCustomFreightAllowance?: string;
  defaultCustomFreightRate?: string;
  defaultFreightLevelId?: string;
  defaultTerm: string;
  freightLevels: FreightLevel[];
}) {
  const [freightLevelId, setFreightLevelId] = useState(defaultFreightLevelId);
  const isCustomFreightLevel = freightLevelId === "custom";

  return (
    <div className="form-grid">
      <label>
        Freight Level
        <select
          name="location_freight_level_id"
          onChange={(event) => setFreightLevelId(event.target.value)}
          value={freightLevelId}
        >
          <option value="">Use default: {defaultTerm}</option>
          {freightLevels.map((level) => (
            <option key={level.id} value={level.id}>
              {level.levelName} - FFA ${level.freeFreightAllowance.toFixed(2)} / {level.freightRatePercent}%
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </label>
      {isCustomFreightLevel ? (
        <>
          <label>
            Custom FFA Amount
            <input defaultValue={defaultCustomFreightAllowance} min="0" name="location_custom_freight_allowance_amount" required step="0.01" type="number" />
          </label>
          <label>
            Custom Freight Rate (%)
            <input defaultValue={defaultCustomFreightRate} min="0" name="location_custom_freight_rate_percent" required step="0.01" type="number" />
          </label>
        </>
      ) : null}
    </div>
  );
}
