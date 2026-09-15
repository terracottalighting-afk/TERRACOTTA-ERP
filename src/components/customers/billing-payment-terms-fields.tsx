"use client";

import { useState } from "react";

const paymentTermDays: Record<string, number> = {
  "Prepaid / No Credit": 0,
  "Net 30": 30,
  "Net 60 Days": 60,
  "Net 90": 90,
};

export function BillingPaymentTermsFields({
  defaultPaymentDays,
  defaultPaymentTerms,
}: {
  defaultPaymentDays: number;
  defaultPaymentTerms: string;
}) {
  const [paymentTerms, setPaymentTerms] = useState(defaultPaymentTerms);
  const [paymentDays, setPaymentDays] = useState(defaultPaymentDays);

  function selectPaymentTerms(nextPaymentTerms: string) {
    setPaymentTerms(nextPaymentTerms);

    const mappedDays = paymentTermDays[nextPaymentTerms];
    if (mappedDays !== undefined) {
      setPaymentDays(mappedDays);
    }
  }

  return (
    <>
      <label>
        Payment Terms
        <select
          name="payment_terms"
          onChange={(event) => selectPaymentTerms(event.target.value)}
          value={paymentTerms}
        >
          <option value="Prepaid / No Credit">Prepaid / No Credit</option>
          <option value="Net 30">Net 30</option>
          <option value="Net 60 Days">Net 60 Days</option>
          <option value="Net 90">Net 90</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <label>
        Payment Days
        <input
          min="0"
          name="payment_days"
          onChange={(event) => setPaymentDays(Number(event.target.value) || 0)}
          step="1"
          type="number"
          value={paymentDays}
        />
      </label>
    </>
  );
}
