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
type CommissionSnapshot = { commission_amount: number; commission_base_amount: number; commission_percent: number; commission_status: string; customer_invoice_id: string; id: string; paid_amount: number; sales_order_id: string; sales_rep_id: string | null; territory_id: string | null };
type CommissionInvoice = { balance_due: number | null; brand_name_snapshot: string; customer_name_snapshot: string; id: string; invoice_date: string; invoice_number: string; invoice_status: string; payment_status: string };
type CommissionPayment = { commission_payment_number: string; id: string; payment_amount: number; payment_date: string; payment_reference: string | null; payment_type: string; status: string; total_amount: number | null };
type CommissionPaymentLine = { amount_paid: number; commission_payment_id: string; commission_snapshot_id: string };
type CommissionSalesOrder = { customer_po_number: string; id: string };

type Territory = { id: string; territory_code: string; name: string; description: string | null };
type SalesRep = { id: string; name: string; email: string | null; phone: string | null; role_title: string | null; is_principal: boolean; city: string | null; state_province: string | null };
type CustomerAccountType = { id: string; name: string; type_code: string };
type CustomerAccount = { account_number: string; account_type_id: string; id: string; name: string; status: string };
type CustomerLocation = { city: string | null; customer_account_id: string; id: string; location_name: string; postal_code: string | null; state_province: string | null; territory_id: string };
type FormAction = (formData: FormData) => void | Promise<void>;

type AgencyTab = "profile" | "sales-reps" | "territories" | "customers" | "commissions" | "shipment-statements" | "orders";
type CommissionTab = "statements" | "ready" | "awaiting-payment";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const labelize = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export async function SalesRepAgencyPage({ agencyId, prepareCommissionStatementAction, removeSalesRepAction, removeTerritoryAction, selectedCommissionTab, selectedTab }: { agencyId?: string; prepareCommissionStatementAction: FormAction; removeSalesRepAction: FormAction; removeTerritoryAction: FormAction; selectedCommissionTab?: string; selectedTab?: string }) {
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
    { key: "shipment-statements", label: "Shipment Statement" },
    { key: "orders", label: "Orders" },
  ];
  const activeTab: AgencyTab = tabs.some((tab) => tab.key === selectedTab) ? selectedTab as AgencyTab : "profile";
  const commissionTabs: { key: CommissionTab; label: string }[] = [
    { key: "statements", label: "Commission Statements" },
    { key: "ready", label: "Ready for Commission" },
    { key: "awaiting-payment", label: "Awaiting Customer Payment" },
  ];
  const activeCommissionTab: CommissionTab = commissionTabs.some((tab) => tab.key === selectedCommissionTab) ? selectedCommissionTab as CommissionTab : "statements";
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
  const needsCommissionData = activeTab === "commissions" || activeTab === "shipment-statements";
  const { data: commissionSnapshots, error: commissionSnapshotsError } = needsCommissionData
    ? await supabase
        .from("commission_snapshot")
        .select("id, customer_invoice_id, sales_order_id, sales_rep_id, territory_id, commission_percent, commission_base_amount, commission_amount, paid_amount, commission_status")
        .eq("sales_rep_agency_id", agency.id)
        .order("created_at", { ascending: false })
        .limit(500)
    : { data: [] as CommissionSnapshot[], error: null };
  if (commissionSnapshotsError) throw new Error(commissionSnapshotsError.message);
  const commissionInvoiceIds = [...new Set((commissionSnapshots ?? []).map((snapshot) => snapshot.customer_invoice_id))];
  const commissionSnapshotIds = (commissionSnapshots ?? []).map((snapshot) => snapshot.id);
  const commissionSalesOrderIds = [...new Set((commissionSnapshots ?? []).map((snapshot) => snapshot.sales_order_id))];
  const commissionTerritoryIds = [...new Set((commissionSnapshots ?? []).map((snapshot) => snapshot.territory_id).filter((territoryId): territoryId is string => Boolean(territoryId)))];
  const commissionRepIds = [...new Set((commissionSnapshots ?? []).map((snapshot) => snapshot.sales_rep_id).filter((repId): repId is string => Boolean(repId)))];
  const [commissionInvoicesResult, commissionTerritoriesResult, commissionRepsResult, commissionPaymentsResult, commissionPaymentLinesResult, commissionSalesOrdersResult] = await Promise.all([
    commissionInvoiceIds.length ? supabase.from("customer_invoice").select("id, invoice_number, invoice_date, customer_name_snapshot, brand_name_snapshot, payment_status, invoice_status, balance_due").in("id", commissionInvoiceIds) : Promise.resolve({ data: [] as CommissionInvoice[], error: null }),
    commissionTerritoryIds.length ? supabase.from("territory").select("id, territory_code, name").in("id", commissionTerritoryIds) : Promise.resolve({ data: [] as { id: string; territory_code: string; name: string }[], error: null }),
    commissionRepIds.length ? supabase.from("sales_rep").select("id, name").in("id", commissionRepIds) : Promise.resolve({ data: [] as { id: string; name: string }[], error: null }),
    needsCommissionData ? supabase.from("commission_payment").select("id, commission_payment_number, payment_date, payment_amount, total_amount, payment_type, payment_reference, status").eq("sales_rep_agency_id", agency.id).order("payment_date", { ascending: false }).limit(100) : Promise.resolve({ data: [] as CommissionPayment[], error: null }),
    commissionSnapshotIds.length ? supabase.from("commission_payment_line").select("commission_payment_id, commission_snapshot_id, amount_paid").in("commission_snapshot_id", commissionSnapshotIds) : Promise.resolve({ data: [] as CommissionPaymentLine[], error: null }),
    commissionSalesOrderIds.length ? supabase.from("sales_order").select("id, customer_po_number").in("id", commissionSalesOrderIds) : Promise.resolve({ data: [] as CommissionSalesOrder[], error: null }),
  ]);
  if (commissionInvoicesResult.error || commissionTerritoriesResult.error || commissionRepsResult.error || commissionPaymentsResult.error || commissionPaymentLinesResult.error || commissionSalesOrdersResult.error) {
    throw new Error(commissionInvoicesResult.error?.message ?? commissionTerritoriesResult.error?.message ?? commissionRepsResult.error?.message ?? commissionPaymentsResult.error?.message ?? commissionPaymentLinesResult.error?.message ?? commissionSalesOrdersResult.error?.message ?? "Unable to load commissions.");
  }
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
  const commissionInvoiceById = new Map((commissionInvoicesResult.data ?? []).map((invoice) => [invoice.id, invoice]));
  const commissionTerritoryById = new Map((commissionTerritoriesResult.data ?? []).map((territory) => [territory.id, territory]));
  const commissionRepById = new Map((commissionRepsResult.data ?? []).map((rep) => [rep.id, rep]));
  const commissionSalesOrderById = new Map((commissionSalesOrdersResult.data ?? []).map((order) => [order.id, order]));
  const commissionPaymentById = new Map((commissionPaymentsResult.data ?? []).map((payment) => [payment.id, payment]));
  const paymentLinesBySnapshotId = new Map<string, CommissionPaymentLine[]>();
  for (const paymentLine of commissionPaymentLinesResult.data ?? []) {
    paymentLinesBySnapshotId.set(paymentLine.commission_snapshot_id, [...(paymentLinesBySnapshotId.get(paymentLine.commission_snapshot_id) ?? []), paymentLine]);
  }
  const commissionRows = [...new Map((commissionSnapshots ?? []).map((snapshot) => [snapshot.customer_invoice_id, snapshot])).keys()].map((invoiceId) => {
    const snapshots = (commissionSnapshots ?? []).filter((snapshot) => snapshot.customer_invoice_id === invoiceId);
    const first = snapshots[0];
    const invoice = commissionInvoiceById.get(invoiceId);
    const territory = first.territory_id ? commissionTerritoryById.get(first.territory_id) : null;
    const rep = first.sales_rep_id ? commissionRepById.get(first.sales_rep_id) : null;
    const statementIds = [...new Set(snapshots.flatMap((snapshot) => (paymentLinesBySnapshotId.get(snapshot.id) ?? []).map((line) => line.commission_payment_id)))];
    const statements = statementIds.map((statementId) => commissionPaymentById.get(statementId)).filter((statement): statement is CommissionPayment => Boolean(statement));
    return {
      amount: snapshots.reduce((sum, snapshot) => sum + Number(snapshot.commission_amount ?? 0), 0),
      base: snapshots.reduce((sum, snapshot) => sum + Number(snapshot.commission_base_amount ?? 0), 0),
      invoice,
      paidAmount: snapshots.reduce((sum, snapshot) => sum + Number(snapshot.paid_amount ?? 0), 0),
      percent: Number(first.commission_percent ?? 0),
      purchaseOrder: commissionSalesOrderById.get(first.sales_order_id)?.customer_po_number ?? "Not set",
      repName: rep?.name ?? null,
      status: first.commission_status,
      statements,
      territoryLabel: territory ? `${territory.territory_code} - ${territory.name}` : "Not set",
    };
  });
  const commissionReadyRows = commissionRows.filter((row) => row.invoice?.payment_status === "paid" && row.status === "commission_ready" && row.statements.length === 0);
  const awaitingCustomerPaymentRows = commissionRows.filter((row) => row.invoice && row.invoice.invoice_status !== "void" && row.invoice.payment_status !== "paid");
  const shipmentStatementRows = commissionRows.filter((row) => row.invoice?.invoice_status !== "void" && row.status !== "void");
  const commissionPaymentLineCounts = new Map<string, number>();
  const commissionPaymentStatementAmounts = new Map<string, number>();
  for (const paymentLine of commissionPaymentLinesResult.data ?? []) {
    commissionPaymentLineCounts.set(paymentLine.commission_payment_id, (commissionPaymentLineCounts.get(paymentLine.commission_payment_id) ?? 0) + 1);
    commissionPaymentStatementAmounts.set(paymentLine.commission_payment_id, (commissionPaymentStatementAmounts.get(paymentLine.commission_payment_id) ?? 0) + Number(paymentLine.amount_paid ?? 0));
  }

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
      {activeTab === "commissions" ? <>
        <nav aria-label="Commission dashboard" className="agency-dashboard-tabs">
          {commissionTabs.map((tab) => <Link className={activeCommissionTab === tab.key ? "agency-dashboard-tab agency-dashboard-tab--active" : "agency-dashboard-tab"} href={`/?module=sales-rep-agency&agency=${agency.id}&agency_tab=commissions&commission_tab=${tab.key}`} key={tab.key}>{tab.label}</Link>)}
        </nav>
        {activeCommissionTab === "statements" ? <section className="data-section">
          <div className="section-title"><div><h3>Commission Statements</h3><p>Statements issued to this sales agency. A posted statement is paid; a draft statement is not yet paid.</p></div></div>
          {commissionPaymentsResult.data?.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Statement</th><th>Statement Date</th><th>Included Items</th><th>Payment Method</th><th>Reference</th><th>Amount</th><th>Payment Status</th></tr></thead><tbody>{commissionPaymentsResult.data.map((payment) => <tr key={payment.id}><td><Link className="table-link" href={`/?module=commission-statement&commission_payment=${payment.id}`}>{payment.commission_payment_number}</Link></td><td>{payment.payment_date}</td><td>{commissionPaymentLineCounts.get(payment.id) ?? 0}</td><td>{labelize(payment.payment_type)}</td><td>{payment.payment_reference ?? "Not set"}</td><td>{currency.format(commissionPaymentStatementAmounts.get(payment.id) ?? Number(payment.total_amount ?? payment.payment_amount ?? 0))}</td><td>{payment.status === "posted" ? "Paid" : labelize(payment.status)}</td></tr>)}</tbody></table></div> : <p className="fieldset-note">No commission statements have been created for this agency.</p>}
        </section> : null}
        {activeCommissionTab === "ready" ? <section className="data-section">
          <form action={prepareCommissionStatementAction}>
            <input name="agency_id" type="hidden" value={agency.id} />
            <div className="section-title"><div><h3>Ready for Commission</h3><p>Customer invoices that are paid in full, commission-ready, and not yet included in a commission statement.</p></div><button className="small-action" type="submit">Create Commission Statement</button></div>
            <CommissionInvoiceTable presentation="ready" rows={commissionReadyRows} selectable showCustomerPayment={false} />
          </form>
        </section> : null}
        {activeCommissionTab === "awaiting-payment" ? <section className="data-section">
          <div className="section-title"><div><h3>Awaiting Customer Payment</h3><p>Commission-qualified invoices that are still unpaid or partially paid by the customer.</p></div><StatusBadge tone="warn" value={`${awaitingCustomerPaymentRows.length} awaiting payment`} /></div>
          <CommissionInvoiceTable rows={awaitingCustomerPaymentRows} showCustomerPayment />
        </section> : null}

      </> : null}
      {activeTab === "shipment-statements" ? <section className="data-section">
        <div className="section-title"><div><h3>Shipment Statement</h3><p>All commission-qualified invoices for this agency, including paid, unpaid, and statement-included invoices. Use this complete list when preparing an agency shipment report for a selected period.</p></div><StatusBadge tone="neutral" value={`${shipmentStatementRows.length} invoices`} /></div>
        <CommissionInvoiceTable rows={shipmentStatementRows} showCustomerPayment />
      </section> : null}
    </section>
  );
}

type CommissionInvoiceRow = {
  amount: number;
  base: number;
  invoice: CommissionInvoice | undefined;
  paidAmount: number;
  percent: number;
  purchaseOrder: string;
  repName: string | null;
  status: string;
  statements: CommissionPayment[];
  territoryLabel: string;
};

function CommissionInvoiceTable({ presentation = "full", rows, selectable = false, showCustomerPayment }: { presentation?: "full" | "ready"; rows: CommissionInvoiceRow[]; selectable?: boolean; showCustomerPayment: boolean }) {
  if (!rows.length) return <p className="fieldset-note">No invoices match this list.</p>;

  const isReadyTable = presentation === "ready";
  return <div className="table-wrap"><table className="data-table"><thead><tr>{selectable ? <th aria-label="Select invoice" /> : null}<th>Invoice</th>{isReadyTable ? <th>PO #</th> : null}<th>Customer</th><th>Invoice Date</th><th>Brand</th>{!isReadyTable ? <><th>Territory</th><th>Sales Rep Note</th></> : null}{showCustomerPayment ? <><th>Customer Payment</th><th>Balance Due</th></> : null}<th>Rate</th><th>Commission Base</th><th>Commission</th>{!isReadyTable ? <><th>Commission Status</th><th>Statement</th></> : null}</tr></thead><tbody>{rows.map((row) => <tr key={row.invoice?.id ?? `${row.territoryLabel}-${row.amount}`}>{selectable ? <td><input aria-label={`Select ${row.invoice?.invoice_number ?? "invoice"}`} defaultChecked name="customer_invoice_ids" type="checkbox" value={row.invoice?.id ?? ""} /></td> : null}<td>{row.invoice ? <Link className="table-link" href={`/?module=invoice-document&invoice=${row.invoice.id}`}>{row.invoice.invoice_number}</Link> : "Invoice not found"}</td>{isReadyTable ? <td>{row.purchaseOrder}</td> : null}<td>{row.invoice?.customer_name_snapshot ?? "Not set"}</td><td>{row.invoice?.invoice_date ?? "Not set"}</td><td>{row.invoice?.brand_name_snapshot ?? "Not set"}</td>{!isReadyTable ? <><td>{row.territoryLabel}</td><td>{row.repName ?? "No rep assigned"}</td></> : null}{showCustomerPayment ? <><td>{row.invoice ? labelize(row.invoice.payment_status) : "Not set"}</td><td>{currency.format(Number(row.invoice?.balance_due ?? 0))}</td></> : null}<td>{row.percent}%</td><td>{currency.format(row.base)}</td><td>{currency.format(row.amount)}</td>{!isReadyTable ? <><td>{labelize(row.status)}</td><td>{row.statements.length ? row.statements.map((statement) => `${statement.commission_payment_number} (${statement.status === "posted" ? "Paid" : labelize(statement.status)})`).join(", ") : "Not included"}</td></> : null}</tr>)}</tbody></table></div>;
}
