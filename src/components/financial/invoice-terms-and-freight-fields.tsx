"use client";

import { useMemo, useState } from "react";

const standardTermDays: Record<string, number> = {
  "Upon Receipt": 0,
  "Net 30": 30,
  "Net 60": 60,
  "Net 90": 90
};

function toInvoiceTerm(paymentTerms: string) {
  if (paymentTerms === "Net 30") return "Net 30";
  if (paymentTerms === "Net 60" || paymentTerms === "Net 60 Days") return "Net 60";
  if (paymentTerms === "Net 90") return "Net 90";
  if (paymentTerms === "Other") return "Other";
  return "Upon Receipt";
}

function dueDateFromShipment(shipDate: string | null, days: number) {
  if (!shipDate) return "Not available";
  const date = new Date(`${shipDate.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "Not available";
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function InvoiceTermsAndFreightFields({
  actualFreightCost,
  defaultCustomerFreightCharge,
  defaultPaymentDays,
  defaultPaymentTerms,
  shipDate
}: {
  actualFreightCost: number;
  defaultCustomerFreightCharge: number;
  defaultPaymentDays: number;
  defaultPaymentTerms: string;
  shipDate: string | null;
}) {
  const [paymentTerms, setPaymentTerms] = useState(() => toInvoiceTerm(defaultPaymentTerms));
  const [customDays, setCustomDays] = useState(defaultPaymentDays);
  const paymentDays = paymentTerms === "Other" ? customDays : standardTermDays[paymentTerms];
  const dueDate = useMemo(() => dueDateFromShipment(shipDate, Math.max(0, paymentDays || 0)), [paymentDays, shipDate]);

  return (
    <>
      <fieldset>
        <legend>Payment Terms</legend>
        <div className="form-grid form-grid--two">
          <label>
            Payment Due
            <select name="payment_terms" onChange={(event) => setPaymentTerms(event.target.value)} value={paymentTerms}>
              <option value="Upon Receipt">Upon Receipt</option>
              <option value="Net 30">Net 30</option>
              <option value="Net 60">Net 60</option>
              <option value="Net 90">Net 90</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            {paymentTerms === "Other" ? "Custom Payment Days" : "Payment Days"}
            <input
              min="0"
              name="payment_days"
              onChange={(event) => setCustomDays(Number(event.target.value) || 0)}
              readOnly={paymentTerms !== "Other"}
              required
              step="1"
              type="number"
              value={paymentDays ?? 0}
            />
          </label>
          <label>
            Shipment Date
            <input readOnly value={shipDate?.slice(0, 10) ?? "Not available"} />
          </label>
          <label>
            Calculated Due Date
            <input readOnly value={dueDate} />
          </label>
        </div>
        <p className="fieldset-note">The due date is calculated from the shipment date and the selected payment terms.</p>
      </fieldset>
      <fieldset>
        <legend>Freight Charge</legend>
        <div className="form-grid form-grid--two">
          <label>
            Actual Freight Cost (Internal)
            <input readOnly value={actualFreightCost.toFixed(2)} />
          </label>
          <label>
            Customer Freight Charge
            <input readOnly value={defaultCustomerFreightCharge} min="0" name="customer_freight_charge" required step="0.01" type="number" />
          </label>
        </div>
        <p className="fieldset-note">The invoice freight charge follows the order Freight Term. Only Prepay invoices include the calculated shipment freight charge.</p>
      </fieldset>
    </>
  );
}
