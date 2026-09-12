import Link from "next/link";

import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";
import { CommissionStatementControls } from "./commission-statement-controls";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export async function CommissionStatementPage({ paymentId }: { paymentId?: string }) {
  if (!paymentId) return <ModulePlaceholder moduleName="Commission Statement" />;

  const supabase = createSupabaseUntypedAdminClient();
  const [{ data: statement, error: statementError }, { data: lines, error: linesError }] = await Promise.all([
    supabase.from("commission_payment").select("id, commission_payment_number, sales_rep_agency_id, payment_date, payment_type, payment_reference, status").eq("id", paymentId).maybeSingle(),
    supabase.from("commission_payment_line").select("commission_snapshot_id, amount_paid").eq("commission_payment_id", paymentId),
  ]);
  if (statementError || linesError) throw new Error(statementError?.message ?? linesError?.message ?? "Unable to load commission statement.");
  if (!statement) return <section className="dashboard-panel"><div className="placeholder-panel"><h2>Commission statement not found</h2><Link className="secondary-action" href="/?module=invoices&financial_section=commission&financial_commission_tab=paid">Back to Commission</Link></div></section>;

  const snapshotIds = (lines ?? []).map((line) => line.commission_snapshot_id);
  const [{ data: agency, error: agencyError }, { data: snapshots, error: snapshotsError }] = await Promise.all([
    supabase.from("sales_rep_agency").select("id, name, email").eq("id", statement.sales_rep_agency_id).maybeSingle(),
    snapshotIds.length ? supabase.from("commission_snapshot").select("id, customer_invoice_id").in("id", snapshotIds) : Promise.resolve({ data: [], error: null }),
  ]);
  if (agencyError || snapshotsError) throw new Error(agencyError?.message ?? snapshotsError?.message ?? "Unable to load commission statement details.");
  const invoiceIds = [...new Set((snapshots ?? []).map((snapshot) => snapshot.customer_invoice_id))];
  const { data: invoices, error: invoicesError } = invoiceIds.length ? await supabase.from("customer_invoice").select("id, invoice_number, invoice_date, customer_name_snapshot").in("id", invoiceIds) : { data: [], error: null };
  if (invoicesError) throw new Error(invoicesError.message);
  const invoiceById = new Map((invoices ?? []).map((invoice) => [invoice.id, invoice]));
  const invoiceBySnapshotId = new Map((snapshots ?? []).map((snapshot) => [snapshot.id, snapshot.customer_invoice_id]));
  const total = (lines ?? []).reduce((sum, line) => sum + Number(line.amount_paid ?? 0), 0);
  const backUrl = `/?module=invoices&financial_section=commission&financial_commission_tab=${statement.status === "posted" ? "paid" : "draft"}`;

  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Commission Statement</span><div className="header-line"><h2>{statement.commission_payment_number}</h2><StatusBadge tone={statement.status === "posted" ? "good" : "primary"} value={statement.status === "posted" ? "Paid" : "Draft"} /></div><Link className="text-action" href={`/?module=sales-rep-agency&agency=${statement.sales_rep_agency_id}`}>{agency?.name ?? "Sales Agency"}</Link></div><div className="record-hero-actions"><CommissionStatementControls recipientEmail={agency?.email} statementNumber={statement.commission_payment_number} /><Link className="secondary-action print-hidden" href={backUrl}>Back to Commission</Link></div></section><section className="detail-grid"><article className="info-panel"><h3>Statement Details</h3><dl><div><dt>Statement Date</dt><dd>{statement.payment_date}</dd></div><div><dt>Payment Method</dt><dd>{statement.status === "posted" ? statement.payment_type.toUpperCase() : "Not paid"}</dd></div><div><dt>Payment Reference</dt><dd>{statement.status === "posted" ? statement.payment_reference ?? "Not set" : "Not paid"}</dd></div><div><dt>Commission Total</dt><dd>{currency.format(total)}</dd></div></dl></article></section><section className="data-section"><div className="section-title"><div><h3>Included Invoices</h3><p>Commission items included in this statement.</p></div></div>{lines?.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Invoice</th><th>Customer</th><th>Invoice Date</th><th>Commission</th></tr></thead><tbody>{lines.map((line) => { const invoice = invoiceById.get(invoiceBySnapshotId.get(line.commission_snapshot_id) ?? ""); return <tr key={line.commission_snapshot_id}><td>{invoice ? <Link className="table-link" href={`/?module=invoice-document&invoice=${invoice.id}`}>{invoice.invoice_number}</Link> : "Invoice not found"}</td><td>{invoice?.customer_name_snapshot ?? "Not set"}</td><td>{invoice?.invoice_date ?? "Not set"}</td><td>{currency.format(Number(line.amount_paid ?? 0))}</td></tr>; })}</tbody></table></div> : <p className="fieldset-note">No invoices are included in this statement.</p>}</section></section>;
}
