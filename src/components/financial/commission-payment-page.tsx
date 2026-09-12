import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type FormAction = (formData: FormData) => void | Promise<void>;
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export async function CommissionPaymentPage({ error, paymentId, saveAction }: { error?: string; paymentId?: string; saveAction: FormAction }) {
  if (!paymentId) return <ModulePlaceholder moduleName="Commission Payment" />;

  const supabase = createSupabaseUntypedAdminClient();
  const [{ data: statement, error: statementError }, { data: lines, error: linesError }, { data: agency, error: agencyError }] = await Promise.all([
    supabase.from("commission_payment").select("id, commission_payment_number, sales_rep_agency_id, payment_date, payment_type, payment_reference, status").eq("id", paymentId).maybeSingle(),
    supabase.from("commission_payment_line").select("amount_paid").eq("commission_payment_id", paymentId),
    supabase.from("commission_payment").select("sales_rep_agency(name)").eq("id", paymentId).maybeSingle(),
  ]);
  if (statementError || linesError || agencyError) throw new Error(statementError?.message ?? linesError?.message ?? agencyError?.message ?? "Unable to load commission statement.");
  if (!statement) return <section className="dashboard-panel"><div className="placeholder-panel"><h2>Commission statement not found</h2><Link className="secondary-action" href="/?module=invoices&financial_section=commission&financial_commission_tab=draft">Back to Draft Commission</Link></div></section>;

  const total = (lines ?? []).reduce((sum, line) => sum + Number(line.amount_paid ?? 0), 0);
  const agencyName = (agency as { sales_rep_agency?: { name?: string } | null } | null)?.sales_rep_agency?.name ?? "Sales Agency";
  const backUrl = "/?module=invoices&financial_section=commission&financial_commission_tab=draft";

  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Commission Payment</span><h2>Make Commission Payment</h2><p>{statement.commission_payment_number} | {agencyName}</p></div><Link className="secondary-action" href={backUrl}>Cancel</Link></section><section className="data-section"><div className="section-title"><div><h3>Payment Details</h3><p>Posting this payment moves the commission statement to Paid Commission.</p></div></div>{error ? <p className="form-error">{error}</p> : null}<form action={saveAction}><input name="commission_payment_id" type="hidden" value={statement.id} /><div className="form-grid"><label>Commission Statement<input disabled value={statement.commission_payment_number} /></label><label>Commission Total<input disabled value={currency.format(total)} /></label><label>Payment Date<input defaultValue={new Date().toISOString().slice(0, 10)} name="payment_date" required type="date" /></label><label>Payment Method<select defaultValue={statement.payment_type ?? "ach"} name="payment_type"><option value="ach">ACH</option><option value="check">Check</option><option value="cash">Cash</option><option value="other">Other</option></select></label><label className="form-grid-span">Payment Reference<input defaultValue={statement.payment_reference ?? ""} name="payment_reference" /></label></div><div className="form-actions"><button className="primary-action" disabled={statement.status !== "draft"} type="submit">Post Commission Payment</button><Link className="secondary-action" href={backUrl}>Cancel</Link></div>{statement.status !== "draft" ? <p className="fieldset-note">Only draft commission statements can be paid.</p> : null}</form></section></section>;
}
