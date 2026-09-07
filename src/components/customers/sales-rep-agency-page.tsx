import Link from "next/link";

import { AgencyCustomersDashboard } from "@/components/customers/agency-customers-dashboard";
import { ConfirmRemoveButton } from "@/components/ui/confirm-remove-button";
import { ModulePlaceholder, StatusBadge } from "@/components/ui";
import { createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

type SalesRepAgency = {
  address_line_1: string | null;
  address_line_2: string | null;
  id: string;
  agency_code: string;
  city: string | null;
  commission_default_percent: number;
  customer_account_id: string | null;
  email: string | null;
  main_contact_name: string | null;
  name: string;
  notes: string | null;
  phone: string | null;
  postal_code: string | null;
  state_province: string | null;
  status: string;
};
type AgencyOrder = { customer_po_number: string; id: string; invoice_required: boolean; order_date: string; order_type: string; sales_order_number: string; status: string; total_amount: number };

type Territory = { id: string; territory_code: string; name: string; description: string | null };
type SalesRep = { id: string; name: string; email: string | null; phone: string | null; role_title: string | null; is_principal: boolean; city: string | null; state_province: string | null };
type CustomerAccountType = { id: string; name: string; type_code: string };
type CustomerAccount = { account_number: string; account_type_id: string; id: string; name: string; status: string };
type CustomerLocation = { city: string | null; customer_account_id: string; id: string; location_name: string; postal_code: string | null; state_province: string | null; territory_id: string };
type FormAction = (formData: FormData) => void | Promise<void>;

type AgencyTab = "profile" | "sales-reps" | "territories" | "customers" | "commissions" | "orders";

export async function SalesRepAgencyPage({ agencyId, removeSalesRepAction, removeTerritoryAction, selectedTab }: { agencyId?: string; removeSalesRepAction: FormAction; removeTerritoryAction: FormAction; selectedTab?: string }) {
  if (!agencyId) return <ModulePlaceholder moduleName="Sales Rep Agency" />;

  const supabase = createSupabaseUntypedAdminClient();
  const { data, error } = await supabase
    .from("sales_rep_agency")
    .select("id, address_line_1, address_line_2, agency_code, city, commission_default_percent, customer_account_id, email, main_contact_name, name, notes, phone, postal_code, state_province, status")
    .eq("id", agencyId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) {
    return <section className="dashboard-panel"><div className="placeholder-panel"><span className="eyebrow">Sales Rep Agency</span><h2>Agency not found</h2><p>The selected sales rep agency could not be found.</p><Link className="secondary-action" href="/?module=sales-rep-agencies">Back to Sales Agencies</Link></div></section>;
  }

  const agency = data as SalesRepAgency;
  const { data: assignments, error: assignmentsError } = await supabase
    .from("territory_assignment")
    .select("id, territory_id")
    .eq("sales_rep_agency_id", agency.id)
    .eq("status", "active")
    .is("end_date", null);
  if (assignmentsError) throw new Error(assignmentsError.message);
  const territoryIds = (assignments ?? []).map((assignment) => assignment.territory_id);
  const assignmentByTerritory = new Map((assignments ?? []).map((assignment) => [assignment.territory_id, assignment.id]));
  const tabs: { key: AgencyTab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "sales-reps", label: "Sales Reps" },
    { key: "territories", label: "Territories" },
    { key: "customers", label: "Customers" },
    { key: "commissions", label: "Commissions" },
    { key: "orders", label: "Orders" },
  ];
  const activeTab: AgencyTab = tabs.some((tab) => tab.key === selectedTab) ? selectedTab as AgencyTab : "profile";
  const [{ data: territories, error: territoriesError }, { data: salesReps, error: salesRepsError }] = await Promise.all([
    territoryIds.length ? supabase.from("territory").select("id, territory_code, name, description").in("id", territoryIds).order("name", { ascending: true }) : Promise.resolve({ data: [] as Territory[], error: null }),
    supabase.from("sales_rep").select("id, name, email, phone, role_title, is_principal, city, state_province").eq("sales_rep_agency_id", agency.id).eq("status", "active").order("name", { ascending: true }),
  ]);
  if (territoriesError || salesRepsError) throw new Error(territoriesError?.message ?? salesRepsError?.message);
  const { data: orders, error: ordersError } = activeTab === "orders"
    ? await supabase
        .from("sales_order")
        .select("id, sales_order_number, customer_po_number, order_date, order_type, status, total_amount, invoice_required")
        .eq("sales_rep_agency_id_snapshot", agency.id)
        .order("order_date", { ascending: false })
        .limit(100)
    : { data: [] as AgencyOrder[], error: null };
  if (ordersError) throw new Error(ordersError.message);
  const { data: accountTypes, error: accountTypesError } = activeTab === "customers"
    ? await supabase
        .from("customer_account_type")
        .select("id, name, type_code")
        .eq("is_active", true)
        .neq("type_code", "rep")
        .order("sort_order", { ascending: true })
    : { data: [] as CustomerAccountType[], error: null };
  if (accountTypesError) throw new Error(accountTypesError.message);

  const { data: customerLocations, error: customerLocationsError } = activeTab === "customers" && territoryIds.length
    ? await supabase
        .from("customer_location")
        .select("id, customer_account_id, location_name, city, state_province, postal_code, territory_id")
        .in("territory_id", territoryIds)
        .eq("status", "active")
    : { data: [] as CustomerLocation[], error: null };
  if (customerLocationsError) throw new Error(customerLocationsError.message);
  const customerAccountIds = [...new Set((customerLocations ?? []).map((location) => location.customer_account_id))];
  const { data: customerAccounts, error: customerAccountsError } = activeTab === "customers" && customerAccountIds.length
    ? await supabase
        .from("customer_account")
        .select("id, account_number, account_type_id, name, status")
        .in("id", customerAccountIds)
        .order("name", { ascending: true })
    : { data: [] as CustomerAccount[], error: null };
  if (customerAccountsError) throw new Error(customerAccountsError.message);
  const eligibleAccountTypes = (accountTypes as CustomerAccountType[]).filter((accountType) => accountType.type_code !== "rep");
  const territoryById = new Map((territories ?? []).map((territory: Territory) => [territory.id, territory]));
  const eligibleAccountTypeIds = new Set(eligibleAccountTypes.map((accountType) => accountType.id));
  const coveredCustomers = (customerAccounts as CustomerAccount[])
    .filter((customer) => eligibleAccountTypeIds.has(customer.account_type_id))
    .map((customer) => ({
      accountNumber: customer.account_number,
      accountTypeId: customer.account_type_id,
      id: customer.id,
      name: customer.name,
      status: customer.status,
      locations: (customerLocations ?? [])
        .filter((location) => location.customer_account_id === customer.id)
        .map((location) => {
          const territory = territoryById.get(location.territory_id);

          return {
            city: location.city,
            id: location.id,
            locationName: location.location_name,
            postalCode: location.postal_code,
            stateProvince: location.state_province,
            territoryLabel: territory
              ? `${territory.territory_code} - ${territory.name}`
              : "Territory not set",
          };
        }),
    }));

  return (
    <section className="dashboard-panel">
      <section className="account-header">
        <div><span className="eyebrow">Sales Rep Agency</span><div className="header-line"><h2>{agency.name}</h2><StatusBadge tone={agency.status === "active" ? "good" : "warn"} value={agency.status === "active" ? "Active" : "Inactive"} /></div><Link className="text-action" href="/?module=sales-rep-agencies">Back to Sales Agencies</Link></div>
      </section>

      <nav aria-label="Sales rep agency dashboard" className="agency-dashboard-tabs">
        {tabs.map((tab) => <Link className={activeTab === tab.key ? "agency-dashboard-tab agency-dashboard-tab--active" : "agency-dashboard-tab"} href={`/?module=sales-rep-agency&agency=${agency.id}&agency_tab=${tab.key}`} key={tab.key}>{tab.label}</Link>)}
      </nav>

      {activeTab === "profile" ? <section className="detail-grid">
        <article className="info-panel"><div className="section-title"><h3>Agency Profile</h3><Link className="text-action" href={`/?module=sales-rep-agency-edit&agency=${agency.id}`}>Edit</Link></div><dl><div><dt>Agency Code</dt><dd>{agency.agency_code}</dd></div><div><dt>Main Contact</dt><dd>{agency.main_contact_name ?? "Not set"}</dd></div><div><dt>Email</dt><dd>{agency.email ?? "Not set"}</dd></div><div><dt>Phone</dt><dd>{agency.phone ?? "Not set"}</dd></div><div><dt>Default Commission</dt><dd>{agency.commission_default_percent}%</dd></div><div><dt>Notes</dt><dd>{agency.notes ?? "Not set"}</dd></div></dl></article>
        <article className="info-panel"><div className="section-title"><h3>Agency Address</h3><Link className="text-action" href={`/?module=sales-rep-agency-edit&agency=${agency.id}`}>Edit</Link></div><dl><div><dt>Address</dt><dd>{agency.address_line_1 ?? "Not set"}{agency.address_line_2 ? <><br />{agency.address_line_2}</> : null}</dd></div><div><dt>City / State</dt><dd>{[agency.city, agency.state_province].filter(Boolean).join(", ") || "Not set"}</dd></div><div><dt>ZIP / Postal Code</dt><dd>{agency.postal_code ?? "Not set"}</dd></div></dl></article>
      </section> : null}

      {activeTab === "sales-reps" ? <section className="data-section"><div className="section-title"><div><h3>Sales Reps</h3><p>Individual sales reps working under this agency.</p></div><Link className="small-action" href={`/?module=sales-rep-edit&agency=${agency.id}`}>Add Sales Rep</Link></div>{salesReps?.length ? <div className="compact-list">{(salesReps as SalesRep[]).map((rep) => <div className="compact-row" key={rep.id}><div><strong><Link className="record-link" href={`/?module=sales-rep&rep=${rep.id}`}>{rep.name}{rep.is_principal ? " - Principal" : ""}</Link></strong><span>{[rep.role_title, rep.email, rep.phone].filter(Boolean).join(" | ") || "No contact information"}{rep.city || rep.state_province ? ` - ${[rep.city, rep.state_province].filter(Boolean).join(", ")}` : ""}</span></div><div className="section-actions"><StatusBadge tone="good" value="Active" /><form action={removeSalesRepAction}><input name="agency_id" type="hidden" value={agency.id} /><input name="sales_rep_id" type="hidden" value={rep.id} /><ConfirmRemoveButton message="This removes the sales rep from this agency and clears their sub-territory coverage. The Sales Rep record will remain in the system." /></form></div></div>)}</div> : <p className="fieldset-note">No individual sales reps have been added.</p>}</section> : null}

      {activeTab === "territories" ? <section className="data-section"><div className="section-title"><div><h3>Assigned Territories</h3><p>Base territories this agency covers. Individual sales reps can later receive a subset of these territories.</p></div><Link className="small-action" href={`/?module=sales-rep-agency-territory-add&agency=${agency.id}`}>Add Territory</Link></div>{territories?.length ? <div className="compact-list">{territories.map((territory: Territory) => <div className="compact-row" key={territory.id}><div><strong>{territory.name}</strong><span>{territory.territory_code}{territory.description ? ` - ${territory.description}` : ""}</span></div><form action={removeTerritoryAction}><input name="agency_id" type="hidden" value={agency.id} /><input name="assignment_id" type="hidden" value={assignmentByTerritory.get(territory.id)} /><input name="territory_id" type="hidden" value={territory.id} /><ConfirmRemoveButton message="This removes the territory from the agency and clears it from every sales rep’s sub-territory coverage at this agency." /></form></div>)}</div> : <p className="fieldset-note">No territories are assigned to this agency.</p>}</section> : null}
      {activeTab === "customers" ? <section className="data-section"><div className="section-title"><div><h3>Customers</h3><p>Customer accounts with an active location in this agency&apos;s assigned territories.</p></div></div><AgencyCustomersDashboard accountTypes={eligibleAccountTypes.map((accountType) => ({ id: accountType.id, name: accountType.name }))} customers={coveredCustomers} /></section> : null}
      {activeTab === "orders" ? <section className="data-section"><div className="section-title"><div><h3>Orders</h3><p>Orders placed directly by this sales agency.</p></div><Link className="small-action" href={`/?module=sales-rep-agency-order&agency=${agency.id}`}>Place Order</Link></div>{orders?.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Order</th><th>PO / Reference</th><th>Type</th><th>Order Date</th><th>Amount</th><th>Invoice</th><th>Status</th></tr></thead><tbody>{(orders as AgencyOrder[]).map((order) => <tr key={order.id}><td><Link className="table-link" href={`/?module=orders&order=${order.id}`}>{order.sales_order_number}</Link></td><td>{order.customer_po_number}</td><td>{order.order_type === "catalog_marketing" ? "Catalog / Marketing" : order.order_type.replaceAll("_", " ")}</td><td>{order.order_date}</td><td>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(order.total_amount ?? 0))}</td><td>{order.invoice_required ? "Required" : "No charge"}</td><td>{order.status.replaceAll("_", " ")}</td></tr>)}</tbody></table></div> : <p className="fieldset-note">No orders have been placed by this agency.</p>}</section> : null}
      {activeTab === "commissions" ? <section className="data-section"><div className="section-title"><div><h3>Commissions</h3><p>This section will be available in a later phase.</p></div></div></section> : null}
    </section>
  );
}
