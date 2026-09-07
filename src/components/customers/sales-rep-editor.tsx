import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type Agency = { id: string; name: string };
type SalesRep = { id: string; address_line_1: string | null; address_line_2: string | null; city: string | null; email: string | null; is_principal: boolean; name: string; notes: string | null; phone: string | null; postal_code: string | null; role_title: string | null; state_province: string | null; status: string };
type FormAction = (formData: FormData) => void | Promise<void>;

export async function SalesRepEditor({ agencyId, createAction, error, salesRepId, saveAction }: { agencyId?: string; createAction: FormAction; error?: string; salesRepId?: string; saveAction: FormAction }) {
  if (!agencyId) return <ModulePlaceholder moduleName="Add Sales Rep requires a selected agency" />;
  const supabase = createSupabaseUntypedAdminClient();
  const { data: agency, error: agencyError } = await supabase.from("sales_rep_agency").select("id, name").eq("id", agencyId).maybeSingle();
  if (agencyError) throw new Error(agencyError.message);
  if (!agency) return <ModulePlaceholder moduleName="Sales Rep Agency not found" />;
  const selectedAgency = agency as Agency;
  let salesRep: SalesRep | null = null;
  if (salesRepId) {
    const { data, error: salesRepError } = await supabase.from("sales_rep").select("id, address_line_1, address_line_2, city, email, is_principal, name, notes, phone, postal_code, role_title, state_province, status").eq("id", salesRepId).eq("sales_rep_agency_id", selectedAgency.id).maybeSingle();
    if (salesRepError) throw new Error(salesRepError.message);
    if (!data) return <ModulePlaceholder moduleName="Sales Rep not found" />;
    salesRep = data as SalesRep;
  }
  const isEditing = Boolean(salesRep);
  const returnUrl = `/?module=sales-rep${isEditing ? `&rep=${salesRep!.id}` : `-agency&agency=${selectedAgency.id}`}`;

  return <section className="dashboard-panel"><section className="form-header"><div><span className="eyebrow">Sales Coverage</span><h2>{isEditing ? `Edit ${salesRep!.name}` : "Add Sales Rep"}</h2><p>{selectedAgency.name}</p></div><Link className="secondary-action secondary-action--light" href={returnUrl}>Cancel</Link></section>{error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}<form action={isEditing ? saveAction : createAction} className="customer-form"><input name="agency_id" type="hidden" value={selectedAgency.id} />{isEditing ? <input name="sales_rep_id" type="hidden" value={salesRep!.id} /> : null}<fieldset><legend>Sales Rep Profile</legend><div className="form-grid"><label>Name<input defaultValue={salesRep?.name ?? ""} name="name" required /></label><label>Role / Title<input defaultValue={salesRep?.role_title ?? ""} name="role_title" /></label><label>Email<input defaultValue={salesRep?.email ?? ""} name="email" type="email" /></label><label>Phone<input defaultValue={salesRep?.phone ?? ""} name="phone" /></label><label className="checkbox-label"><input defaultChecked={salesRep?.is_principal ?? false} name="is_principal" type="checkbox" /><span><strong>Agency Principal</strong><small>Mark this rep as the agency principal.</small></span></label><label>Notes<textarea defaultValue={salesRep?.notes ?? ""} name="notes" rows={3} /></label></div></fieldset><fieldset><legend>Sales Rep Address</legend><div className="form-grid"><label className="form-grid-span">Address Line 1<input defaultValue={salesRep?.address_line_1 ?? ""} name="address_line_1" /></label><label className="form-grid-span">Address Line 2<input defaultValue={salesRep?.address_line_2 ?? ""} name="address_line_2" /></label><label>City<input defaultValue={salesRep?.city ?? ""} name="city" /></label><label>State / Province<input defaultValue={salesRep?.state_province ?? ""} name="state_province" /></label><label>ZIP / Postal Code<input defaultValue={salesRep?.postal_code ?? ""} name="postal_code" /></label>{isEditing ? <label>Status<select defaultValue={salesRep?.status ?? "active"} name="status"><option value="active">Active</option><option value="inactive">Inactive</option></select></label> : null}</div></fieldset><div className="form-actions"><button className="primary-action" type="submit">{isEditing ? "Save Sales Rep Changes" : "Add Sales Rep"}</button><Link className="secondary-action secondary-action--light" href={returnUrl}>Cancel</Link></div></form></section>;
}
