import Link from "next/link";

import { CreditMemoDocumentControls } from "@/components/financial/credit-memo-document-controls";
import { ModulePlaceholder } from "@/components/ui";
import { dateLabel, money, numberFormatter } from "@/lib/formatters";

type CreditMemoDocumentDetail = {
  applications: { amount_applied: number; applied_date: string; customer_invoice_id: string; id: string; invoice_date: string; invoice_number: string; invoice_total: number }[];
  customerEmail: string | null;
  lines: { description: string; id: string; quantity: number; line_total: number; unit_amount: number }[];
  memo: { amount_applied: number; amount_remaining: number; brand_name_snapshot: string; credit_memo_number: string; customer_name_snapshot: string; id: string; issue_date: string; original_customer_po_number: string | null; original_sales_order_id: string | null; reason_code: string; rga_id: string | null; rga_number: string | null; status: string; total_credit_amount: number };
};

export async function CreditMemoDocumentPage({ creditMemoId, loadCreditMemo }: { creditMemoId?: string; loadCreditMemo: (creditMemoId: string) => Promise<CreditMemoDocumentDetail | null> }) {
  if (!creditMemoId) return <ModulePlaceholder moduleName="Credit memo not found" />;
  const detail = await loadCreditMemo(creditMemoId);
  if (!detail) return <ModulePlaceholder moduleName="Credit memo not found" />;

  return <section className="quote-document-page">
    <div className="quote-document-controls print-hidden">
      <Link className="secondary-action" href={`/?module=rga-solution&rga=${detail.memo.rga_id ?? ""}`}>Back to RGA Solution</Link>
      <CreditMemoDocumentControls creditMemoNumber={detail.memo.credit_memo_number} recipientEmail={detail.customerEmail} />
    </div>
    <article className="quote-document">
      <header className="quote-document-header">
        <div><span className="eyebrow">{detail.memo.brand_name_snapshot}</span><h2>Credit Memo</h2></div>
        <dl>
          <div><dt>Credit Memo No.</dt><dd>{detail.memo.credit_memo_number}</dd></div>
          <div><dt>Issue Date</dt><dd>{dateLabel(detail.memo.issue_date)}</dd></div>
          <div><dt>RGA</dt><dd>{detail.memo.rga_number ?? "Not set"}</dd></div>
          <div><dt>Original PO</dt><dd>{detail.memo.original_sales_order_id ? <Link className="table-link" href={`/?module=orders&order=${detail.memo.original_sales_order_id}`}>{detail.memo.original_customer_po_number ?? "View order"}</Link> : detail.memo.original_customer_po_number ?? "Not set"}</dd></div>
          <div><dt>Status</dt><dd>{detail.memo.status}</dd></div>
        </dl>
      </header>
      <section className="quote-document-addresses"><div><span>Customer</span><strong>{detail.memo.customer_name_snapshot}</strong></div><div><span>Reason</span><strong>{detail.memo.reason_code}</strong></div></section>
      <table className="quote-document-table"><thead><tr><th>Item</th><th>Qty</th><th>Unit Amount</th><th>Credit Amount</th></tr></thead><tbody>{detail.lines.map((line) => <tr key={line.id}><td>{line.description}</td><td>{numberFormatter.format(Number(line.quantity))}</td><td>{money(Number(line.unit_amount))}</td><td>{money(Number(line.line_total))}</td></tr>)}</tbody></table>
      <dl className="invoice-document-totals">
        <div><dt>Credit Subtotal</dt><dd>{money(detail.lines.reduce((total, line) => total + Number(line.line_total), 0))}</dd></div>
        <div><dt>Credit Total</dt><dd>{money(detail.memo.total_credit_amount)}</dd></div>
        <div><dt>Credit Used</dt><dd>{money(detail.memo.amount_applied)}</dd></div>
        <div><dt>Remaining Balance</dt><dd>{money(detail.memo.amount_remaining)}</dd></div>
      </dl>
      <section className="record-section">
        <h3>Applied Invoice Payments</h3>
        {detail.applications.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Invoice</th><th>Invoice Date</th><th>Invoice Total</th><th>Applied Date</th><th>Credit Applied</th></tr></thead><tbody>{detail.applications.map((application) => <tr key={application.id}><td><Link className="table-link" href={`/?module=invoice-document&invoice=${application.customer_invoice_id}`}>{application.invoice_number}</Link></td><td>{dateLabel(application.invoice_date)}</td><td>{money(application.invoice_total)}</td><td>{dateLabel(application.applied_date)}</td><td>{money(application.amount_applied)}</td></tr>)}</tbody></table></div> : <p className="fieldset-note">This credit memo has not been applied to an invoice yet.</p>}
      </section>
    </article>
  </section>;
}
