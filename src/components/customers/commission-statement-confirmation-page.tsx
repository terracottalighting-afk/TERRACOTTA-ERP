import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type FormAction = (formData: FormData) => void | Promise<void>;
type Invoice = { brand_name_snapshot: string; customer_name_snapshot: string; id: string; invoice_date: string; invoice_number: string; total_amount: number | null };
type Snapshot = { commission_amount: number; commission_base_amount: number; commission_percent: number; customer_invoice_id: string; sales_order_id: string };
type CreditApplication = { amount_applied: number; credit_memo_id: string; customer_invoice_id: string };
type CreditMemo = { credit_memo_number: string; id: string };
type SalesOrder = { customer_po_number: string; id: string };

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export async function CommissionStatementConfirmationPage({ agencyId, confirmAction, error, invoiceIds }: { agencyId?: string; confirmAction: FormAction; error?: string; invoiceIds?: string }) {
  if (!agencyId) return <ModulePlaceholder moduleName="Commission Statement" />;

  const selectedInvoiceIds = [...new Set((invoiceIds ?? "").split(",").filter(Boolean))];
  if (!selectedInvoiceIds.length) return <section className="dashboard-panel"><div className="placeholder-panel"><h2>No invoices selected</h2><p>Select at least one ready invoice before creating a commission statement.</p><Link className="secondary-action" href={`/?module=sales-rep-agency&agency=${agencyId}&agency_tab=commissions&commission_tab=ready`}>Back to Ready for Commission</Link></div></section>;

  const supabase = createSupabaseUntypedAdminClient();
  const [{ data: agency, error: agencyError }, { data: snapshots, error: snapshotsError }, { data: invoices, error: invoicesError }, { data: creditApplications, error: creditApplicationsError }] = await Promise.all([
    supabase.from("sales_rep_agency").select("name").eq("id", agencyId).maybeSingle(),
    supabase.from("commission_snapshot").select("customer_invoice_id, sales_order_id, commission_base_amount, commission_percent, commission_amount").eq("sales_rep_agency_id", agencyId).eq("commission_status", "commission_ready").in("customer_invoice_id", selectedInvoiceIds),
    supabase.from("customer_invoice").select("id, invoice_number, invoice_date, customer_name_snapshot, brand_name_snapshot, total_amount").in("id", selectedInvoiceIds),
    supabase.from("credit_memo_application").select("customer_invoice_id, credit_memo_id, amount_applied").in("customer_invoice_id", selectedInvoiceIds).eq("application_status", "posted"),
  ]);
  if (agencyError || snapshotsError || invoicesError || creditApplicationsError) throw new Error(agencyError?.message ?? snapshotsError?.message ?? invoicesError?.message ?? creditApplicationsError?.message ?? "Unable to load commission statement details.");

  const snapshotInvoiceIds = new Set((snapshots ?? []).map((snapshot: Snapshot) => snapshot.customer_invoice_id));
  const readyInvoices = (invoices ?? []).filter((invoice: Invoice) => snapshotInvoiceIds.has(invoice.id)) as Invoice[];
  const appliedCreditApplications = (creditApplications ?? []) as CreditApplication[];
  const creditMemoIds = [...new Set(appliedCreditApplications.map((application) => application.credit_memo_id))];
  const salesOrderIds = [...new Set((snapshots ?? []).map((snapshot: Snapshot) => snapshot.sales_order_id))];
  const [{ data: salesOrders, error: salesOrdersError }, { data: creditMemos, error: creditMemosError }] = await Promise.all([
    salesOrderIds.length
      ? supabase.from("sales_order").select("id, customer_po_number").in("id", salesOrderIds)
      : Promise.resolve({ data: [] as SalesOrder[], error: null }),
    creditMemoIds.length
      ? supabase.from("credit_memo").select("id, credit_memo_number").in("id", creditMemoIds)
      : Promise.resolve({ data: [] as CreditMemo[], error: null }),
  ]);
  if (salesOrdersError || creditMemosError) throw new Error(salesOrdersError?.message ?? creditMemosError?.message ?? "Unable to load commission statement references.");
  const salesOrderById = new Map((salesOrders ?? []).map((salesOrder: SalesOrder) => [salesOrder.id, salesOrder]));
  const creditMemoNumberById = new Map((creditMemos ?? []).map((creditMemo: CreditMemo) => [creditMemo.id, creditMemo.credit_memo_number]));
  const commissionByInvoiceId = new Map<string, number>();
  const adjustedBaseByInvoiceId = new Map<string, number>();
  const commissionRatesByInvoiceId = new Map<string, number[]>();
  const purchaseOrderByInvoiceId = new Map<string, string>();
  for (const snapshot of snapshots ?? []) {
    commissionByInvoiceId.set(snapshot.customer_invoice_id, (commissionByInvoiceId.get(snapshot.customer_invoice_id) ?? 0) + Number(snapshot.commission_amount ?? 0));
    adjustedBaseByInvoiceId.set(snapshot.customer_invoice_id, (adjustedBaseByInvoiceId.get(snapshot.customer_invoice_id) ?? 0) + Number(snapshot.commission_base_amount ?? 0));
    commissionRatesByInvoiceId.set(snapshot.customer_invoice_id, [
      ...(commissionRatesByInvoiceId.get(snapshot.customer_invoice_id) ?? []),
      Number(snapshot.commission_percent ?? 0),
    ]);
    if (!purchaseOrderByInvoiceId.has(snapshot.customer_invoice_id)) {
      purchaseOrderByInvoiceId.set(snapshot.customer_invoice_id, salesOrderById.get(snapshot.sales_order_id)?.customer_po_number ?? "Not set");
    }
  }
  const creditApplicationTextByInvoiceId = new Map<string, string>();
  for (const application of appliedCreditApplications) {
    const value = `${creditMemoNumberById.get(application.credit_memo_id) ?? "Credit memo"} | ${currency.format(Number(application.amount_applied ?? 0))}`;
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
      {readyInvoices.length ? <><div className="table-wrap"><table className="data-table"><thead><tr><th>Invoice</th><th>PO #</th><th>Customer</th><th>Invoice Date</th><th>Brand</th><th>Invoice Amount</th><th>Credit Applied</th><th>Adjusted Commission Base</th><th>Commission Rate</th><th>Commission</th></tr></thead><tbody>{readyInvoices.map((invoice) => <tr key={invoice.id}><td>{invoice.invoice_number}</td><td>{purchaseOrderByInvoiceId.get(invoice.id) ?? "Not set"}</td><td>{invoice.customer_name_snapshot}</td><td>{invoice.invoice_date}</td><td>{invoice.brand_name_snapshot}</td><td>{currency.format(Number(invoice.total_amount ?? 0))}</td><td>{creditApplicationTextByInvoiceId.get(invoice.id) ?? ""}</td><td>{currency.format(adjustedBaseByInvoiceId.get(invoice.id) ?? 0)}</td><td>{[...new Set(commissionRatesByInvoiceId.get(invoice.id) ?? [])].map((rate) => `${rate}%`).join(", ")}</td><td>{currency.format(commissionByInvoiceId.get(invoice.id) ?? 0)}</td></tr>)}</tbody><tfoot><tr><th colSpan={9}>Statement Total</th><th>{currency.format(total)}</th></tr></tfoot></table></div><form className="form-actions" action={confirmAction}><input name="agency_id" type="hidden" value={agencyId} /><input name="invoice_ids" type="hidden" value={readyInvoices.map((invoice) => invoice.id).join(",")} /><button className="primary-action" type="submit">Create Commission Statement</button><Link className="secondary-action" href={backUrl}>Cancel</Link></form></> : <p className="fieldset-note">None of the selected invoices are currently ready for commission. Return to the Ready for Commission tab and choose current invoices.</p>}
    </section>
  </section>;
}
