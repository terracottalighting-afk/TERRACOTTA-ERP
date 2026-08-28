import Link from "next/link";

import { PaymentSettlementFields } from "@/components/financial/payment-settlement-fields";
import { ModulePlaceholder } from "@/components/ui";
import { dateLabel, money } from "@/lib/formatters";

type PaymentEntryInvoice = {
  balance_due: number | null;
  brand_name_snapshot: string;
  customer_name_snapshot: string;
  due_date: string | null;
  id: string;
  invoice_date: string;
  invoice_number: string;
  invoice_status: string;
  total_amount: number | null;
};

type PaymentEntryCreditMemo = {
  amount_remaining: number | null;
  credit_memo_number: string;
  id: string;
  issue_date: string;
};

type PaymentEntryDetail = {
  creditMemos: PaymentEntryCreditMemo[];
  invoice: PaymentEntryInvoice;
};

export async function PaymentEntryPage({
  error,
  invoiceId,
  loadPaymentEntry,
  notice,
  saveAction,
}: {
  error?: string;
  invoiceId?: string;
  loadPaymentEntry: (invoiceId: string) => Promise<PaymentEntryDetail | null>;
  notice?: string;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  if (!invoiceId) {
    return (
      <ModulePlaceholder moduleName="Choose an unpaid invoice to record a payment" />
    );
  }

  const paymentEntry = await loadPaymentEntry(invoiceId);
  if (!paymentEntry) {
    return <ModulePlaceholder moduleName="Invoice not found" />;
  }

  const { invoice } = paymentEntry;
  const balanceDue = Number(invoice.balance_due ?? 0);
  const canRecordPayment = invoice.invoice_status !== "void" && balanceDue > 0;
  const creditMemos = paymentEntry.creditMemos.map((memo) => ({
    availableAmount: Number(memo.amount_remaining ?? 0),
    creditMemoNumber: memo.credit_memo_number,
    id: memo.id,
    issueDate: dateLabel(memo.issue_date),
  }));

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href="/?module=invoices&financial_tab=active"
          >
            Active Invoices
          </Link>
          <div className="record-title-row">
            <h2>Make Payment</h2>
          </div>
          <p>
            {invoice.customer_name_snapshot} / Invoice {invoice.invoice_number}{" "}
            / {invoice.brand_name_snapshot}
          </p>
        </div>
      </section>
      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {notice ? (
        <div className="form-notice">{decodeURIComponent(notice)}</div>
      ) : null}
      <section className="payment-invoice-summary">
        <div>
          <span>Invoice Total</span>
          <strong>{money(Number(invoice.total_amount))}</strong>
        </div>
        <div>
          <span>Balance Due</span>
          <strong>{money(balanceDue)}</strong>
        </div>
        <div>
          <span>Invoice Date</span>
          <strong>{dateLabel(invoice.invoice_date)}</strong>
        </div>
        <div>
          <span>Due Date</span>
          <strong>{dateLabel(invoice.due_date)}</strong>
        </div>
      </section>
      {!canRecordPayment ? (
        <div className="empty-state">
          This invoice does not have an amount remaining to pay.
        </div>
      ) : (
        <form action={saveAction} className="customer-form">
          <input name="invoice_id" type="hidden" value={invoice.id} />
          <PaymentSettlementFields
            balanceDue={balanceDue}
            creditMemos={creditMemos}
          />
          <div className="form-actions">
            <button className="primary-action" type="submit">
              Record Settlement
            </button>
            <Link
              className="secondary-action"
              href="/?module=invoices&financial_tab=active"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}
