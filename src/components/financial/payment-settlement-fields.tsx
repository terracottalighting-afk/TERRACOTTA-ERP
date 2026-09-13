"use client";

import { useMemo, useState } from "react";

type CreditMemoOption = {
  id: string;
  creditMemoNumber: string;
  availableAmount: number;
  brandName: string;
  issueDate: string;
};

type PaymentSettlementFieldsProps = {
  balanceDue: number;
  creditMemos: CreditMemoOption[];
};

function currency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function PaymentSettlementFields({ balanceDue, creditMemos }: PaymentSettlementFieldsProps) {
  const [creditMemoId, setCreditMemoId] = useState("");
  const [creditAmount, setCreditAmount] = useState(0);
  const [waiverAmount, setWaiverAmount] = useState(0);
  const selectedMemo = useMemo(
    () => creditMemos.find((memo) => memo.id === creditMemoId),
    [creditMemoId, creditMemos]
  );
  const maximumCredit = Math.min(balanceDue, selectedMemo?.availableAmount ?? 0);
  const normalizedCredit = Math.max(0, Math.min(creditAmount, maximumCredit));
  const maximumWaiver = Math.max(0, balanceDue - normalizedCredit);
  const normalizedWaiver = Math.max(0, Math.min(waiverAmount, maximumWaiver));
  const customerPaymentAmount = Math.max(0, balanceDue - normalizedCredit - normalizedWaiver);

  function selectCreditMemo(nextId: string) {
    const nextMemo = creditMemos.find((memo) => memo.id === nextId);
    setCreditMemoId(nextId);
    setCreditAmount(nextMemo ? Math.min(balanceDue, nextMemo.availableAmount) : 0);
  }

  return <>
    <fieldset>
      <legend>Credit Memo Application</legend>
      <p className="fieldset-note">Apply an available credit memo before recording the customer payment. You can use all or part of the available credit.</p>
      <div className="form-grid">
        <label className="full-width-field">Available Credit Memo
          <select name="credit_memo_id" onChange={(event) => selectCreditMemo(event.target.value)} value={creditMemoId}>
            <option value="">Do not apply a credit memo</option>
            {creditMemos.map((memo) => <option key={memo.id} value={memo.id}>{memo.creditMemoNumber} - {memo.brandName} - Available {currency(memo.availableAmount)} - Issued {memo.issueDate}</option>)}
          </select>
        </label>
        {selectedMemo ? <>
          <div className="settlement-available-credit"><span>Available credit</span><strong>{currency(selectedMemo.availableAmount)}</strong></div>
          <label>Credit Amount to Apply
            <input max={maximumCredit} min="0" name="credit_memo_amount" onChange={(event) => setCreditAmount(Number(event.target.value) || 0)} step="0.01" type="number" value={normalizedCredit.toFixed(2)} />
          </label>
        </> : <input name="credit_memo_amount" type="hidden" value="0" />}
      </div>
    </fieldset>
    <fieldset>
      <legend>Waiver</legend>
      <p className="fieldset-note">Use a waiver only when part of the invoice balance will not be collected. A reason is required and will be saved in the AR adjustment record.</p>
      <div className="form-grid">
        <label>Amount to Waive
          <input max={maximumWaiver} min="0" name="waiver_amount" onChange={(event) => setWaiverAmount(Number(event.target.value) || 0)} step="0.01" type="number" value={normalizedWaiver.toFixed(2)} />
        </label>
        <label>Waiver Reason
          <textarea name="waiver_reason" placeholder="Explain why this amount is being waived" required={normalizedWaiver > 0} rows={3} />
        </label>
      </div>
    </fieldset>
    <fieldset>
      <legend>Customer Payment</legend>
      <p className="fieldset-note">The customer payment is the invoice balance remaining after any credit memo and waiver amounts.</p>
      <input name="customer_payment_amount" type="hidden" value={customerPaymentAmount.toFixed(2)} />
      <div className="form-grid">
        <label>Payment Date<input defaultValue={new Date().toISOString().slice(0, 10)} name="payment_date" required type="date" /></label>
        <label>Customer Payment Amount<input readOnly value={customerPaymentAmount.toFixed(2)} /></label>
        <label>Payment Method<select defaultValue="check" disabled={customerPaymentAmount === 0} name="payment_method"><option value="check">Check</option><option value="ach">ACH</option><option value="wire">Wire</option><option value="credit_card">Credit Card</option><option value="cash">Cash</option><option value="other">Other</option></select></label>
        <label>Reference No.<input disabled={customerPaymentAmount === 0} name="reference_number" placeholder="Check, ACH, wire, or card reference" /></label>
        <label className="full-width-field">Memo<textarea name="memo" placeholder="Optional settlement note" rows={3} /></label>
      </div>
    </fieldset>
    <fieldset>
      <legend>Supporting Documents</legend>
      <p className="fieldset-note">{customerPaymentAmount > 0 ? "Optional: attach a check image, credit-card confirmation, ACH receipt, or other proof of payment." : "No customer payment is due after the credit memo is applied."}</p>
      {customerPaymentAmount > 0 ? <div className="form-grid"><label className="full-width-field">Payment Documents<input accept="image/*,application/pdf" multiple name="payment_document_files" type="file" /></label></div> : null}
    </fieldset>
    <section className="record-section">
      <h3>Settlement Summary</h3>
      <p>Invoice balance: {currency(balanceDue)} | Credit memo: {currency(normalizedCredit)} | Waiver: {currency(normalizedWaiver)} | Customer payment: {currency(customerPaymentAmount)}</p>
    </section>
  </>;
}
