import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type Agency = { id: string; name: string };
type FormAction = (formData: FormData) => void | Promise<void>;

export async function SalesRepEditor({ agencyId, createAction, error }: { agencyId?: string; createAction: FormAction; error?: string }) {
  if (!agencyId) return <ModulePlaceholder moduleName="Add Sales Rep requires a selected agency" />;
  const { data: agency, error: agencyError } = await createSupabaseUntypedAdminClient().from("sales_rep_agency").select("id, name").eq("id", agencyId).maybeSingle();
  if (agencyError) throw new Error(agencyError.message);
  if (!agency) return <ModulePlaceholder moduleName="Sales Rep Agency not found" />;
  const selectedAgency = agency as Agency;
  const returnUrl = `/?module=sales-rep-agency&agency=${selectedAgency.id}`;

  return <section className="dashboard-panel"><section className="form-header"><div><span className="eyebrow">Sales Coverage</span><h2>Add Sales Rep</h2><p>{selectedAgency.name}</p></div><Link className="secondary-action secondary-action--light" href={returnUrl}>Cancel</Link></section>{error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}<form action={createAction} className="customer-form"><input name="agency_id" type="hidden" value={selectedAgency.id} /><fieldset><legend>Sales Rep Profile</legend><div className="form-grid"><label>Name<input name="name" required /></label><label>Role / Title<input name="role_title" /></label><label>Email<input name="email" type="email" /></label><label>Phone<input name="phone" /></label><label className="checkbox-label"><input name="is_principal" type="checkbox" /><span><strong>Agency Principal</strong><small>Mark this rep as the agency principal.</small></span></label><label>Notes<textarea name="notes" rows={3} /></label></div></fieldset><fieldset><legend>Sales Rep Address</legend><div className="form-grid"><label className="form-grid-span">Address Line 1<input name="address_line_1" /></label><label className="form-grid-span">Address Line 2<input name="address_line_2" /></label><label>City<input name="city" /></label><label>State / Province<input name="state_province" /></label><label>ZIP / Postal Code<input name="postal_code" /></label></div></fieldset><div className="form-actions"><button className="primary-action" type="submit">Add Sales Rep</button><Link className="secondary-action secondary-action--light" href={returnUrl}>Cancel</Link></div></form></section>;
}
