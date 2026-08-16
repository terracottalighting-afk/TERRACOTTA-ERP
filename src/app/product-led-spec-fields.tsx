"use client";

import { useState } from "react";

type LedSpecField = {
  existingId: string | null;
  inputType?: "checkbox";
  key: string;
  label: string;
  showUnit?: boolean;
  unit: string;
  value: string;
};

export function ProductLedSpecFields({ fields }: { fields: LedSpecField[] }) {
  const integratedField = fields.find((field) => field.key === "integrated_led");
  const initialIntegrated = ["yes", "true", "included", "1"].includes((integratedField?.value ?? "").toLowerCase());
  const [isIntegratedLed, setIsIntegratedLed] = useState(initialIntegrated);

  return (
    <div className="form-grid">
      {fields.map((field) => {
        const isIntegratedControl = field.key === "integrated_led";
        const isDisabled = !isIntegratedControl && !isIntegratedLed;
        const isChecked = ["yes", "true", "included", "1"].includes(field.value.toLowerCase());

        return (
          <div className={field.showUnit === false ? undefined : "full-width-field"} key={field.key}>
            <input name="spec_fields" type="hidden" value={`${field.key}|${field.label}`} />
            {field.existingId ? <input name={`spec_id_${field.key}`} type="hidden" value={field.existingId} /> : null}
            {field.inputType === "checkbox" ? (
              <label className="checkbox-label">
                <input
                  defaultChecked={isChecked}
                  disabled={isDisabled}
                  name={`spec_value_${field.key}`}
                  onChange={isIntegratedControl ? (event) => setIsIntegratedLed(event.currentTarget.checked) : undefined}
                  type="checkbox"
                  value="Yes"
                />
                {field.label}
              </label>
            ) : field.showUnit !== false ? (
              <label>
                {field.label}
                <span className="spec-input-row">
                  <input defaultValue={field.value} disabled={isDisabled} name={`spec_value_${field.key}`} />
                  <input aria-label={`${field.label} unit`} defaultValue={field.unit} disabled={isDisabled} name={`spec_unit_${field.key}`} />
                </span>
              </label>
            ) : (
              <label>
                {field.label}
                <input defaultValue={field.value} disabled={isDisabled} name={`spec_value_${field.key}`} />
              </label>
            )}
            {field.showUnit === false ? <input name={`spec_unit_${field.key}`} type="hidden" value="" /> : null}
          </div>
        );
      })}
    </div>
  );
}
