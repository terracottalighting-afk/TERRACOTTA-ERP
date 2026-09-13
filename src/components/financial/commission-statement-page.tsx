import Link from "next/link";

import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";
import { CommissionStatementControls } from "./commission-statement-controls";

type CommissionPaymentLine = {
  amount_paid: number;
  commission_snapshot_id: string;
};
type CommissionSnapshot = {
  commission_base_amount: number;
  commission_percent: number;
  customer_invoice_id: string;
  id: string;
  sales_order_id: string;
};
type Invoice = {
  customer_name_snapshot: string;
  id: string;
  invoice_number: string;
  total_amount: number | null;
};
type SalesOrder = { customer_po_number: string; id: string };
type CreditApplication = {
  amount_applied: number;
  credit_memo_id: string;
  customer_invoice_id: string;
};
type CreditMemo = { credit_memo_number: string; id: string };

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export async function CommissionStatementPage({ paymentId }: { paymentId?: string }) {
  if (!paymentId) return <ModulePlaceholder moduleName="Commission Statement" />;

  const supabase = createSupabaseUntypedAdminClient();
  const [statementResult, linesResult] = await Promise.all([
    supabase
      .from("commission_payment")
      .select("id, commission_payment_number, sales_rep_agency_id, payment_date, payment_type, payment_reference, status")
      .eq("id", paymentId)
      .maybeSingle(),
    supabase
      .from("commission_payment_line")
      .select("commission_snapshot_id, amount_paid")
      .eq("commission_payment_id", paymentId),
  ]);
  if (statementResult.error || linesResult.error) {
    throw new Error(
      statementResult.error?.message ??
        linesResult.error?.message ??
        "Unable to load commission statement.",
    );
  }
  if (!statementResult.data) {
    return <section className="dashboard-panel"><div className="placeholder-panel"><h2>Commission statement not found</h2><Link className="secondary-action" href="/?module=invoices&financial_section=commission&financial_commission_tab=paid">Back to Commission</Link></div></section>;
  }

  const statement = statementResult.data;
  const lines = (linesResult.data ?? []) as CommissionPaymentLine[];
  const snapshotIds = lines.map((line) => line.commission_snapshot_id);
  const [agencyResult, snapshotsResult] = await Promise.all([
    supabase
      .from("sales_rep_agency")
      .select("id, name, email")
      .eq("id", statement.sales_rep_agency_id)
      .maybeSingle(),
    snapshotIds.length
      ? supabase
          .from("commission_snapshot")
          .select("id, customer_invoice_id, sales_order_id, commission_base_amount, commission_percent")
          .in("id", snapshotIds)
      : Promise.resolve({ data: [] as CommissionSnapshot[], error: null }),
  ]);
  if (agencyResult.error || snapshotsResult.error) {
    throw new Error(
      agencyResult.error?.message ??
        snapshotsResult.error?.message ??
        "Unable to load commission statement details.",
    );
  }

  const snapshots = (snapshotsResult.data ?? []) as CommissionSnapshot[];
  const invoiceIds = [...new Set(snapshots.map((snapshot) => snapshot.customer_invoice_id))];
  const salesOrderIds = [...new Set(snapshots.map((snapshot) => snapshot.sales_order_id))];
  const [invoicesResult, salesOrdersResult, creditApplicationsResult] = await Promise.all([
    invoiceIds.length
      ? supabase
          .from("customer_invoice")
          .select("id, invoice_number, customer_name_snapshot, total_amount")
          .in("id", invoiceIds)
      : Promise.resolve({ data: [] as Invoice[], error: null }),
    salesOrderIds.length
      ? supabase
          .from("sales_order")
          .select("id, customer_po_number")
          .in("id", salesOrderIds)
      : Promise.resolve({ data: [] as SalesOrder[], error: null }),
    invoiceIds.length
      ? supabase
          .from("credit_memo_application")
          .select("customer_invoice_id, credit_memo_id, amount_applied")
          .in("customer_invoice_id", invoiceIds)
          .eq("application_status", "posted")
      : Promise.resolve({ data: [] as CreditApplication[], error: null }),
  ]);
  if (invoicesResult.error || salesOrdersResult.error || creditApplicationsResult.error) {
    throw new Error(
      invoicesResult.error?.message ??
        salesOrdersResult.error?.message ??
        creditApplicationsResult.error?.message ??
        "Unable to load commission statement invoice details.",
    );
  }

  const invoiceById = new Map(
    ((invoicesResult.data ?? []) as Invoice[]).map((invoice) => [invoice.id, invoice]),
  );
  const salesOrderById = new Map(
    ((salesOrdersResult.data ?? []) as SalesOrder[]).map((order) => [order.id, order]),
  );
  const snapshotById = new Map(snapshots.map((snapshot) => [snapshot.id, snapshot]));
  const appliedCreditApplications = (creditApplicationsResult.data ?? []) as CreditApplication[];
  const creditMemoIds = [...new Set(appliedCreditApplications.map((application) => application.credit_memo_id))];
  const { data: creditMemos, error: creditMemosError } = creditMemoIds.length
    ? await supabase
        .from("credit_memo")
        .select("id, credit_memo_number")
        .in("id", creditMemoIds)
    : { data: [] as CreditMemo[], error: null };
  if (creditMemosError) throw new Error(creditMemosError.message);
  const creditMemoNumberById = new Map(
    ((creditMemos ?? []) as CreditMemo[]).map((creditMemo) => [
      creditMemo.id,
      creditMemo.credit_memo_number,
    ]),
  );
  const creditAppliedTextByInvoiceId = new Map<string, string>();
  for (const application of appliedCreditApplications) {
    const applicationText = `${creditMemoNumberById.get(application.credit_memo_id) ?? "Credit memo"} | ${currency.format(Number(application.amount_applied ?? 0))}`;
    creditAppliedTextByInvoiceId.set(application.customer_invoice_id, [
      creditAppliedTextByInvoiceId.get(application.customer_invoice_id),
      applicationText,
    ].filter(Boolean).join(", "));
  }

  const rowsByInvoiceId = new Map<string, {
    adjustedBase: number;
    commission: number;
    invoice: Invoice | undefined;
    purchaseOrder: string;
    rates: Set<number>;
  }>();
  for (const line of lines) {
    const snapshot = snapshotById.get(line.commission_snapshot_id);
    if (!snapshot) continue;

    const existing = rowsByInvoiceId.get(snapshot.customer_invoice_id);
    if (existing) {
      existing.adjustedBase += Number(snapshot.commission_base_amount ?? 0);
      existing.commission += Number(line.amount_paid ?? 0);
      existing.rates.add(Number(snapshot.commission_percent ?? 0));
      continue;
    }

    rowsByInvoiceId.set(snapshot.customer_invoice_id, {
      adjustedBase: Number(snapshot.commission_base_amount ?? 0),
      commission: Number(line.amount_paid ?? 0),
      invoice: invoiceById.get(snapshot.customer_invoice_id),
      purchaseOrder:
        salesOrderById.get(snapshot.sales_order_id)?.customer_po_number ??
        "Not set",
      rates: new Set([Number(snapshot.commission_percent ?? 0)]),
    });
  }
  const rows = [...rowsByInvoiceId.entries()];
  const total = rows.reduce((sum, [, row]) => sum + row.commission, 0);
  const backUrl = `/?module=invoices&financial_section=commission&financial_commission_tab=${statement.status === "posted" ? "paid" : "draft"}`;

  return <section className="dashboard-panel commission-statement-page">
    <section className="account-header">
      <div>
        <span className="eyebrow">Commission Statement</span>
        <div className="header-line"><h2>{statement.commission_payment_number}</h2><StatusBadge tone={statement.status === "posted" ? "good" : "primary"} value={statement.status === "posted" ? "Paid" : "Draft"} /></div>
        <Link className="text-action" href={`/?module=sales-rep-agency&agency=${statement.sales_rep_agency_id}`}>{agencyResult.data?.name ?? "Sales Agency"}</Link>
      </div>
      <div className="record-hero-actions"><CommissionStatementControls recipientEmail={agencyResult.data?.email} statementNumber={statement.commission_payment_number} /><Link className="secondary-action print-hidden" href={backUrl}>Back to Commission</Link></div>
    </section>
    <section className="detail-grid"><article className="info-panel"><h3>Statement Details</h3><dl><div><dt>Statement Date</dt><dd>{statement.payment_date}</dd></div><div><dt>Payment Method</dt><dd>{statement.status === "posted" ? statement.payment_type.toUpperCase() : "Not paid"}</dd></div><div><dt>Payment Reference</dt><dd>{statement.status === "posted" ? statement.payment_reference ?? "Not set" : "Not paid"}</dd></div><div><dt>Commission Total</dt><dd>{currency.format(total)}</dd></div></dl></article></section>
    <section className="data-section">
      <div className="section-title"><div><h3>Included Invoices</h3><p>Commission items included in this statement.</p></div></div>
      {rows.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Invoice</th><th>PO #</th><th>Customer</th><th>Invoice Amount</th><th>Credit Applied</th><th>Adjusted Commission Base</th><th>Commission Rate</th><th>Commission</th></tr></thead><tbody>{rows.map(([invoiceId, row]) => <tr key={invoiceId}><td>{row.invoice ? <Link className="table-link" href={`/?module=invoice-document&invoice=${row.invoice.id}`}>{row.invoice.invoice_number}</Link> : "Invoice not found"}</td><td>{row.purchaseOrder}</td><td>{row.invoice?.customer_name_snapshot ?? "Not set"}</td><td>{currency.format(Number(row.invoice?.total_amount ?? 0))}</td><td>{creditAppliedTextByInvoiceId.get(invoiceId) ?? ""}</td><td>{currency.format(row.adjustedBase)}</td><td>{[...row.rates].map((rate) => `${rate}%`).join(", ")}</td><td>{currency.format(row.commission)}</td></tr>)}</tbody><tfoot><tr><th colSpan={7}>Statement Total</th><th>{currency.format(total)}</th></tr></tfoot></table></div> : <p className="fieldset-note">No invoices are included in this statement.</p>}
    </section>
  </section>;
}
