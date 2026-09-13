import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type FormAction = (formData: FormData) => void | Promise<void>;
type Invoice = { customer_name_snapshot: string; id: string; invoice_date: string; invoice_number: string };
type Snapshot = { commission_amount: number; customer_invoice_id: string };
type CreditApplication = { amount_applied: number; credit_memo: { credit_memo_number: string }[]; customer_invoice_id: string };

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export async function CommissionStatementConfirmationPage({ agencyId, confirmAction, error, invoiceIds }: { agencyId?: string; confirmAction: FormAction; error?: string; invoiceIds?: string }) {
  if (!agencyId) return <ModulePlaceholder moduleName="Commission Statement" />;

  const selectedInvoiceIds = [...new Set((invoiceIds ?? "").split(",").filter(Boolean))];
  if (!selectedInvoiceIds.length) return <section className="dashboard-panel"><div className="placeholder-panel"><h2>No invoices selected</h2><p>Select at least one ready invoice before creating a commission statement.</p><Link className="secondary-action" href={`/?module=sales-rep-agency&agency=${agencyId}&agency_tab=commissions&commission_tab=ready`}>Back to Ready for Commission</Link></div></section>;

  const supabase = createSupabaseUntypedAdminClient();
  const [{ data: agency, error: agencyError }, { data: snapshots, error: snapshotsError }, { data: invoices, error: invoicesError }, { data: creditApplications, error: creditApplicationsError }] = await Promise.all([
    supabase.from("sales_rep_agency").select("name").eq("id", agencyId).maybeSingle(),
    supabase.from("commission_snapshot").select("customer_invoice_id, commission_amount").eq("sales_rep_agency_id", agencyId).eq("commission_status", "commission_ready").in("customer_invoice_id", selectedInvoiceIds),
    supabase.from("customer_invoice").select("id, invoice_number, invoice_date, customer_name_snapshot").in("id", selectedInvoiceIds),
    supabase.from("credit_memo_application").select("customer_invoice_id, amount_applied, credit_memo:credit_memo_id(credit_memo_number)").in("customer_invoice_id", selectedInvoiceIds).eq("application_status", "posted"),
  ]);
  if (agencyError || snapshotsError || invoicesError || creditApplicationsError) throw new Error(agencyError?.message ?? snapshotsError?.message ?? invoicesError?.message ?? creditApplicationsError?.message ?? "Unable to load commission statement details.");

  const snapshotInvoiceIds = new Set((snapshots ?? []).map((snapshot: Snapshot) => snapshot.customer_invoice_id));
  const readyInvoices = (invoices ?? []).filter((invoice: Invoice) => snapshotInvoiceIds.has(invoice.id)) as Invoice[];
  const commissionByInvoiceId = new Map<string, number>();
  for (const snapshot of snapshots ?? []) {
    commissionByInvoiceId.set(snapshot.customer_invoice_id, (commissionByInvoiceId.get(snapshot.customer_invoice_id) ?? 0) + Number(snapshot.commission_amount ?? 0));
  }
  const creditApplicationTextByInvoiceId = new Map<string, string>();
  for (const application of (creditApplications ?? []) as CreditApplication[]) {
    const value = `${application.credit_memo[0]?.credit_memo_number ?? "Credit memo"} | ${currency.format(Number(application.amount_applied ?? 0))}`;
    creditApplicationTextByInvoiceId.set(application.customer_invoice_id, [
      creditApplicationTextByInvoiceId.get(application.customer_invoice_id),
      value,
    ].filter(Boolean).join(", "));
  }
  const total = [...commissionByInvoiceId.values()].reduce((sum, amount) => sum + amount, 0);
  const backUrl = `/?module=sales-rep-agency&agency=${agencyId}&agency_tab=commissions&commission_tab=ready`;

  return <section className="dashboard-panel">
    <section className="account-header"><div><span className="eyebrow">Commission Statement</span><h2>Confirm Commission Statement</h2><p>{agency?.name ?? "Sales Rep Agency"}</p></div><Link className="secondary-action" href={backUrl}>Cancel</Link></section>
    <section className="data-section">
      <div className="section-title"><div><h3>Selected Ready Invoices</h3><p>A draft commission statement will be created. Its number uses the format CMS + year + month + three random digits.</p></div></div>
      {error ? <p className="form-error">{error}</p> : null}
      {readyInvoices.length ? <><div className="table-wrap"><table className="data-table"><thead><tr><th>Invoice</th><th>Customer</th><th>Invoice Date</th><th>Credit Applied</th><th>Commission</th></tr></thead><tbody>{readyInvoices.map((invoice) => <tr key={invoice.id}><td>{invoice.invoice_number}</td><td>{invoice.customer_name_snapshot}</td><td>{invoice.invoice_date}</td><td>{creditApplicationTextByInvoiceId.get(invoice.id) ?? ""}</td><td>{currency.format(commissionByInvoiceId.get(invoice.id) ?? 0)}</td></tr>)}</tbody><tfoot><tr><th colSpan={4}>Statement Total</th><th>{currency.format(total)}</th></tr></tfoot></table></div><form className="form-actions" action={confirmAction}><input name="agency_id" type="hidden" value={agencyId} /><input name="invoice_ids" type="hidden" value={readyInvoices.map((invoice) => invoice.id).join(",")} /><button className="primary-action" type="submit">Create Commission Statement</button><Link className="secondary-action" href={backUrl}>Cancel</Link></form></> : <p className="fieldset-note">None of the selected invoices are currently ready for commission. Return to the Ready for Commission tab and choose current invoices.</p>}
    </section>
  </section>;
}
