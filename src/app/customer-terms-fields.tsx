"use client";

import { useState } from "react";

const paymentTermDays: Record<string, string> = {
  "Net 30": "30",
  "Net 60 Days": "60",
  "Net 90": "90",
  "Prepaid / No Credit": "0"
};

export function PaymentTermsCreditFields() {
  const [paymentTerms, setPaymentTerms] = useState("Prepaid / No Credit");
  const paymentDays = paymentTermDays[paymentTerms] ?? "";
  const isOther = paymentTerms === "Other";

  return (
    <fieldset>
      <legend>Payment Terms / Credit</legend>
      <div className="form-grid">
        <label>
          Payment Terms
          <select
            name="payment_terms"
            onChange={(event) => setPaymentTerms(event.target.value)}
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
            key={paymentTerms}
            defaultValue={paymentDays}
            min="0"
            name="payment_days"
            placeholder={isOther ? "Enter days" : undefined}
            readOnly={!isOther}
            step="1"
            type="number"
          />
        </label>
        <label>
          Credit Limit
          <input min="0" name="credit_limit" placeholder="Blank uses system default" step="0.01" type="number" />
        </label>
      </div>
    </fieldset>
  );
}

export function FreightTermsFields({
  defaultFlatRatePercent = "",
  defaultFreightAllowance = "",
  defaultFreightTerms = "prepaid",
  defaultGroundCollectAccount = "",
  defaultGroundCollectCarrier = "",
  defaultLtlCollectAccount = "",
  defaultLtlCollectCarrier = ""
}: {
  defaultFlatRatePercent?: string;
  defaultFreightAllowance?: string;
  defaultFreightTerms?: string;
  defaultGroundCollectAccount?: string;
  defaultGroundCollectCarrier?: string;
  defaultLtlCollectAccount?: string;
  defaultLtlCollectCarrier?: string;
}) {
  const [freightTerms, setFreightTerms] = useState(defaultFreightTerms);
  const isCollect = freightTerms === "collect";
  const isFlatRate = freightTerms === "flat_rate";

  return (
    <fieldset>
      <legend>Freight Terms</legend>
      <div className="form-grid">
        <label>
          Freight Terms
          <select name="freight_terms" onChange={(event) => setFreightTerms(event.target.value)} value={freightTerms}>
            <option value="prepaid">Prepaid</option>
            <option value="collect">Collect</option>
            <option value="customer_pickup">Customer Pickup</option>
            <option value="free_freight">Free Freight per FFA</option>
            <option value="flat_rate">Flat Rate</option>
            <option value="manual_review">Manual Review</option>
          </select>
        </label>
        <label>
          FFA Amount
          <input
            defaultValue={defaultFreightAllowance}
            min="0"
            name="freight_allowance_amount"
            placeholder="Optional freight allowance"
            step="0.01"
            type="number"
          />
        </label>
        {isCollect ? (
          <>
            <label>
              LTL Customer Carrier
              <input defaultValue={defaultLtlCollectCarrier} name="ltl_customer_collect_carrier" placeholder="LTL carrier provided by customer" />
            </label>
            <label>
              LTL Customer Carrier Account No.
              <input defaultValue={defaultLtlCollectAccount} name="ltl_customer_collect_account_number" />
            </label>
            <label>
              Ground Customer Carrier
              <input
                defaultValue={defaultGroundCollectCarrier}
                name="ground_customer_collect_carrier"
                placeholder="Ground carrier provided by customer"
              />
            </label>
            <label>
              Ground Customer Carrier Account No.
              <input defaultValue={defaultGroundCollectAccount} name="ground_customer_collect_account_number" />
            </label>
          </>
        ) : null}
        {isFlatRate ? (
          <label>
            Flat Rate %
            <input defaultValue={defaultFlatRatePercent} min="0" name="flat_rate_percent" placeholder="Example: 10" step="0.01" type="number" />
          </label>
        ) : null}
      </div>
    </fieldset>
  );
}
