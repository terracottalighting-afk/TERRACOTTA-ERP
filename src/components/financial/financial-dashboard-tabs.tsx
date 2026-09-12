import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { dateLabel, label, money, numberFormatter } from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { FinancialInvoiceTable } from "@/components/financial/financial-invoice-table";

type FinancialInvoiceFilters = {
  advanced?: string;
  customer?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
  pageSize?: string;
  query?: string;
  skus?: string;
  status?: string;
};

export type FinancialDashboardPackingList = {
  brandSummaries: {
    brand_id: string;
    brand_name: string;
    subtotal_amount: number;
  }[];
  created_at: string | null;
  customer_name: string;
  customer_po_number_snapshot: string | null;
  id: string;
  packing_list_number: string;
  ship_date: string | null;
  shipping_fee: number | null;
};

type FinancialInvoice = {
  balance_due: number | null;
  brand_name_snapshot: string;
  created_at: string;
  customer_account_id: string;
  customer_name_snapshot: string;
  due_date: string | null;
  id: string;
  invoice_date: string;
  invoice_number: string;
  invoice_status: string;
  payment_status: string;
  sales_order?: { customer_po_number: string | null } | null;
  sales_order_id: string;
  total_amount: number | null;
};

type FinancialPayment = {
  amount_applied: number | null;
  amount_received: number | null;
  amount_unapplied: number | null;
  created_at: string;
  customer_account_id: string;
  id: string;
  payment_date: string;
  payment_method: string;
  payment_number: string;
  reference_number: string | null;
  status: string;
};

type FinancialPaymentApplication = {
  amount_applied: number | null;
  application_status: string;
  applied_date: string;
  customer_invoice_id: string;
  customer_payment_id: string;
};

type FinancialCommissionPayment = {
  commission_payment_number: string;
  id: string;
  payment_date: string;
  payment_reference: string | null;
  payment_type: string;
  sales_rep_agency_id: string;
  status: string;
};

type FinancialCommissionPaymentLine = {
  amount_paid: number;
  commission_payment_id: string;
};

export async function FinancialDashboardTabs({
  financialFilters,
  financialCommissionTab,
  financialSection,
  financialTab,
  packingLists,
}: {
  financialFilters: FinancialInvoiceFilters;
  financialCommissionTab?: string;
  financialSection?: string;
  financialTab?: string;
  packingLists: FinancialDashboardPackingList[];
}) {
  const supabase = createSupabaseAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const [
    { data: invoices, error: invoicesError },
    { data: payments, error: paymentsError },
    { data: paymentApplications, error: paymentApplicationsError },
    { data: commissionPayments, error: commissionPaymentsError },
    { data: commissionPaymentLines, error: commissionPaymentLinesError },
  ] = await Promise.all([
    supabase
      .from("customer_invoice")
      .select(
        "id, invoice_number, sales_order_id, brand_name_snapshot, customer_name_snapshot, customer_account_id, invoice_date, due_date, invoice_status, payment_status, total_amount, balance_due, created_at, sales_order(customer_po_number)",
      )
      .neq("invoice_status", "void")
      .order("invoice_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("customer_payment")
      .select(
        "id, payment_number, customer_account_id, payment_date, payment_method, reference_number, amount_received, amount_applied, amount_unapplied, status, created_at",
      )
      .order("payment_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("customer_payment_application")
      .select(
        "customer_payment_id, customer_invoice_id, amount_applied, applied_date, application_status",
      )
      .eq("application_status", "posted"),
    supabase
      .from("commission_payment")
      .select("id, commission_payment_number, sales_rep_agency_id, payment_date, payment_type, payment_reference, status")
      .order("payment_date", { ascending: false }),
    supabase
      .from("commission_payment_line")
      .select("commission_payment_id, amount_paid"),
  ]);
  if (invoicesError) throw new Error(invoicesError.message);
  if (paymentsError) throw new Error(paymentsError.message);
  if (paymentApplicationsError)
    throw new Error(paymentApplicationsError.message);
  if (commissionPaymentsError) throw new Error(commissionPaymentsError.message);
  if (commissionPaymentLinesError)
    throw new Error(commissionPaymentLinesError.message);

  const invoiceIds = (invoices ?? []).map((invoice) => invoice.id);
  const { data: invoiceLines, error: invoiceLinesError } = invoiceIds.length
    ? await supabase
        .from("customer_invoice_line")
        .select("customer_invoice_id, product_sku_snapshot")
        .in("customer_invoice_id", invoiceIds)
    : { data: [], error: null };
  if (invoiceLinesError) throw new Error(invoiceLinesError.message);

  const customerIds = [
    ...new Set([
      ...(payments ?? []).map((payment) => payment.customer_account_id),
      ...(invoices ?? []).map((invoice) => invoice.customer_account_id),
    ]),
  ];
  const { data: financialCustomers, error: financialCustomersError } =
    customerIds.length
      ? await supabase
          .from("customer_account")
          .select("id, name, account_number")
          .in("id", customerIds)
      : { data: [], error: null };
  if (financialCustomersError) throw new Error(financialCustomersError.message);
  const commissionAgencyIds = [...new Set((commissionPayments ?? []).map((payment) => payment.sales_rep_agency_id))];
  const { data: commissionAgencies, error: commissionAgenciesError } = commissionAgencyIds.length
    ? await supabase.from("sales_rep_agency").select("id, name").in("id", commissionAgencyIds)
    : { data: [], error: null };
  if (commissionAgenciesError) throw new Error(commissionAgenciesError.message);
  const paymentCustomerNames = new Map(
    (financialCustomers ?? []).map((customer) => [customer.id, customer.name]),
  );
  const customerAccountNumbers = new Map(
    (financialCustomers ?? []).map((customer) => [
      customer.id,
      customer.account_number,
    ]),
  );
  const commissionAgencyNames = new Map((commissionAgencies ?? []).map((agency) => [agency.id, agency.name]));
  const commissionAmountsByPaymentId = new Map<string, number>();
  const commissionItemCountsByPaymentId = new Map<string, number>();
  for (const line of commissionPaymentLines ?? []) {
    commissionAmountsByPaymentId.set(line.commission_payment_id, (commissionAmountsByPaymentId.get(line.commission_payment_id) ?? 0) + Number(line.amount_paid ?? 0));
    commissionItemCountsByPaymentId.set(line.commission_payment_id, (commissionItemCountsByPaymentId.get(line.commission_payment_id) ?? 0) + 1);
  }
  const paidCommissionStatements = ((commissionPayments ?? []) as FinancialCommissionPayment[]).filter((statement) => statement.status === "posted");
  const draftCommissionStatements = ((commissionPayments ?? []) as FinancialCommissionPayment[]).filter((statement) => statement.status === "draft");
  const allInvoices = (invoices ?? []) as FinancialInvoice[];
  const invoiceSkusById = new Map<string, string[]>();
  for (const line of invoiceLines ?? []) {
    const skus = invoiceSkusById.get(line.customer_invoice_id) ?? [];
    if (line.product_sku_snapshot) skus.push(line.product_sku_snapshot);
    invoiceSkusById.set(line.customer_invoice_id, skus);
  }
  const allPayments = (payments ?? []) as FinancialPayment[];
  const invoiceById = new Map(
    allInvoices.map((invoice) => [invoice.id, invoice]),
  );
  const paymentApplicationsByPaymentId = new Map<
    string,
    FinancialPaymentApplication[]
  >();
  for (const application of (paymentApplications ??
    []) as FinancialPaymentApplication[]) {
    const applications =
      paymentApplicationsByPaymentId.get(application.customer_payment_id) ?? [];
    applications.push(application);
    paymentApplicationsByPaymentId.set(
      application.customer_payment_id,
      applications,
    );
  }
  const activeInvoices = allInvoices.filter(
    (invoice) =>
      invoice.payment_status !== "paid" && Number(invoice.balance_due) > 0,
  );
  const overdueInvoices = activeInvoices.filter(
    (invoice) => Boolean(invoice.due_date) && invoice.due_date! < today,
  );
  const paidInvoices = allInvoices.filter(
    (invoice) => invoice.payment_status === "paid",
  );
  const financialInvoiceQuery = (financialFilters.query ?? "")
    .trim()
    .toLowerCase();
  const financialInvoiceDateFrom = financialFilters.dateFrom ?? "";
  const financialInvoiceDateTo = financialFilters.dateTo ?? "";
  const financialInvoiceStatus = ["unpaid", "partially_paid", "paid"].includes(
    financialFilters.status ?? "",
  )
    ? (financialFilters.status ?? "")
    : "";
  const financialInvoiceCustomer = (financialFilters.customer ?? "")
    .trim()
    .toLowerCase();
  const financialInvoiceSkus = (financialFilters.skus ?? "")
    .split(",")
    .map((sku) => sku.trim().toLowerCase())
    .filter(Boolean);
  const filterFinancialInvoices = (invoiceList: FinancialInvoice[]) =>
    invoiceList.filter((invoice) => {
      if (
        financialInvoiceDateFrom &&
        invoice.invoice_date < financialInvoiceDateFrom
      )
        return false;
      if (
        financialInvoiceDateTo &&
        invoice.invoice_date > financialInvoiceDateTo
      )
        return false;
      if (
        financialInvoiceStatus &&
        invoice.payment_status !== financialInvoiceStatus
      )
        return false;
      if (
        financialInvoiceCustomer &&
        ![
          invoice.customer_name_snapshot,
          customerAccountNumbers.get(invoice.customer_account_id),
          invoice.customer_account_id,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(financialInvoiceCustomer),
          )
      )
        return false;
      if (
        financialInvoiceSkus.length &&
        !financialInvoiceSkus.some((requestedSku) =>
          (invoiceSkusById.get(invoice.id) ?? []).some((invoiceSku) =>
            invoiceSku.toLowerCase().includes(requestedSku),
          ),
        )
      )
        return false;
      if (!financialInvoiceQuery) return true;
      return [
        invoice.invoice_number,
        invoice.customer_name_snapshot,
        invoice.brand_name_snapshot,
        invoice.invoice_status,
        invoice.payment_status,
        ...(invoiceSkusById.get(invoice.id) ?? []),
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(financialInvoiceQuery),
        );
    });
  const newestUninvoiced = [...packingLists].sort((left, right) =>
    `${right.ship_date ?? ""}${right.created_at ?? ""}`.localeCompare(
      `${left.ship_date ?? ""}${left.created_at ?? ""}`,
    ),
  );
  const tabs = [
    {
      key: "uninvoiced",
      label: "Uninvoiced Packing Lists",
      count: newestUninvoiced.length,
    },
    { key: "active", label: "Active Invoices", count: activeInvoices.length },
    {
      key: "overdue",
      label: "Overdue Invoices",
      count: overdueInvoices.length,
    },
    { key: "paid", label: "Paid Invoices", count: paidInvoices.length },
    { key: "payments", label: "Payments", count: allPayments.length },
  ];
  const selectedTab = tabs.some((tab) => tab.key === financialTab)
    ? financialTab!
    : "uninvoiced";
  const selectedSection = financialSection === "commission" ? "commission" : "invoices";
  const commissionTabs = [
    { key: "paid", label: "Paid Commission", statements: paidCommissionStatements },
    { key: "draft", label: "Draft Commission", statements: draftCommissionStatements },
  ];
  const selectedCommissionTab = commissionTabs.some((tab) => tab.key === financialCommissionTab)
    ? financialCommissionTab!
    : "paid";

  return (
    <>
      <div aria-label="Financial dashboard sections" className="metric-grid financial-dashboard-section-tabs">
        <Link className={`metric agency-customer-type-tab${selectedSection === "invoices" ? " agency-customer-type-tab--active" : ""}`} href={`/?module=invoices&financial_section=invoices&financial_tab=${selectedTab}`}>
          <span>Invoices</span>
          <strong>{numberFormatter.format(allInvoices.length)}</strong>
        </Link>
        <Link className={`metric agency-customer-type-tab${selectedSection === "commission" ? " agency-customer-type-tab--active" : ""}`} href="/?module=invoices&financial_section=commission&financial_commission_tab=paid">
          <span>Commission</span>
          <strong>{numberFormatter.format(paidCommissionStatements.length + draftCommissionStatements.length)}</strong>
        </Link>
      </div>
      {selectedSection === "invoices" ? <>
      <nav
        className="tab-nav financial-tab-nav"
        aria-label="Financial dashboard lists"
      >
        {tabs.map((tab) => (
          <Link
            aria-current={tab.key === selectedTab ? "page" : undefined}
            href={`/?module=invoices&financial_section=invoices&financial_tab=${tab.key}`}
            key={tab.key}
          >
            {tab.label} ({numberFormatter.format(tab.count)})
          </Link>
        ))}
      </nav>
      {selectedTab === "uninvoiced" ? (
        <section className="record-section">
          <h3>Uninvoiced Packing Lists</h3>
          {newestUninvoiced.length === 0 ? (
            <div className="empty-state">
              No shipped packing lists are awaiting invoice creation.
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Packing List</th>
                    <th>Customer</th>
                    <th>Customer PO</th>
                    <th>Ship Date</th>
                    <th>Brands</th>
                    <th>Shipped Product Total</th>
                    <th>Freight</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newestUninvoiced.map((packingList) => (
                    <tr key={packingList.id}>
                      <td>{packingList.packing_list_number}</td>
                      <td>{packingList.customer_name}</td>
                      <td>{packingList.customer_po_number_snapshot}</td>
                      <td>{dateLabel(packingList.ship_date)}</td>
                      <td>
                        {packingList.brandSummaries
                          .map((brand) => brand.brand_name)
                          .join(", ")}
                      </td>
                      <td>
                        {money(
                          packingList.brandSummaries.reduce(
                            (total, brand) => total + brand.subtotal_amount,
                            0,
                          ),
                        )}
                      </td>
                      <td>{money(packingList.shipping_fee)}</td>
                      <td>
                        <Link
                          className="small-action"
                          href={`/?module=invoice-create&packing_list=${packingList.id}`}
                        >
                          Create Invoice
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
      {selectedTab === "active" ? (
        <section className="record-section">
          <h3>Active Invoices</h3>
          <FinancialInvoiceTable
            emptyText="No unpaid invoices."
            filters={financialFilters}
            invoices={filterFinancialInvoices(activeInvoices)}
            tab="active"
          />
        </section>
      ) : null}
      {selectedTab === "overdue" ? (
        <section className="record-section">
          <h3>Overdue Invoices</h3>
          <FinancialInvoiceTable
            emptyText="No overdue invoices."
            filters={financialFilters}
            invoices={filterFinancialInvoices(overdueInvoices)}
            tab="overdue"
          />
        </section>
      ) : null}
      {selectedTab === "paid" ? (
        <section className="record-section">
          <h3>Paid Invoices</h3>
          <FinancialInvoiceTable
            emptyText="No paid invoices."
            filters={financialFilters}
            invoices={filterFinancialInvoices(paidInvoices)}
            tab="paid"
          />
        </section>
      ) : null}
      {selectedTab === "payments" ? (
        <section className="record-section">
          <h3>Payment Transactions</h3>
          {allPayments.length === 0 ? (
            <div className="empty-state">
              No payment transactions have been recorded.
            </div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Payment No.</th>
                    <th>Paid Invoice No.</th>
                    <th>Customer</th>
                    <th>Payment Date</th>
                    <th>Method</th>
                    <th>Received</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((payment) => {
                    const applications =
                      paymentApplicationsByPaymentId.get(payment.id) ?? [];
                    return (
                      <tr key={payment.id}>
                        <td>
                          <Link
                            className="table-link"
                            href={`/?module=payment-detail&payment=${payment.id}`}
                          >
                            {payment.payment_number}
                          </Link>
                        </td>
                        <td>
                          {applications.length
                            ? applications.map((application, index) => {
                                const invoice = invoiceById.get(
                                  application.customer_invoice_id,
                                );
                                return invoice ? (
                                  <span key={application.customer_invoice_id}>
                                    {index ? ", " : ""}
                                    <Link
                                      className="table-link"
                                      href={`/?module=invoice-document&invoice=${invoice.id}`}
                                    >
                                      {invoice.invoice_number}
                                    </Link>
                                  </span>
                                ) : null;
                              })
                            : "Not applied"}
                        </td>
                        <td>
                          {paymentCustomerNames.get(
                            payment.customer_account_id,
                          ) ?? "Unknown customer"}
                        </td>
                        <td>{dateLabel(payment.payment_date)}</td>
                        <td>{label(payment.payment_method)}</td>
                        <td>{money(payment.amount_received)}</td>
                        <td>
                          <StatusBadge
                            tone={
                              payment.status === "fully_applied"
                                ? "good"
                                : payment.status === "voided"
                                  ? "danger"
                                  : "primary"
                            }
                            value={payment.status}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
      </> : null}
      {selectedSection === "commission" ? <>
        <nav className="tab-nav financial-tab-nav" aria-label="Commission statement lists">
          {commissionTabs.map((tab) => <Link aria-current={tab.key === selectedCommissionTab ? "page" : undefined} href={`/?module=invoices&financial_section=commission&financial_commission_tab=${tab.key}`} key={tab.key}>{tab.label} ({numberFormatter.format(tab.statements.length)})</Link>)}
        </nav>
        <section className="record-section">
          <h3>{selectedCommissionTab === "paid" ? "Paid Commission" : "Draft Commission"}</h3>
          {commissionTabs.find((tab) => tab.key === selectedCommissionTab)?.statements.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Commission Statement</th><th>Sales Agency</th><th>Statement Date</th><th>Included Invoices</th>{selectedCommissionTab === "paid" ? <><th>Payment Method</th><th>Reference</th></> : null}<th>Commission Total</th><th>Status</th>{selectedCommissionTab === "draft" ? <th>Action</th> : null}</tr></thead><tbody>{commissionTabs.find((tab) => tab.key === selectedCommissionTab)!.statements.map((statement) => <tr key={statement.id}><td>{statement.commission_payment_number}</td><td>{commissionAgencyNames.get(statement.sales_rep_agency_id) ?? "Unknown agency"}</td><td>{dateLabel(statement.payment_date)}</td><td>{numberFormatter.format(commissionItemCountsByPaymentId.get(statement.id) ?? 0)}</td>{selectedCommissionTab === "paid" ? <><td>{label(statement.payment_type)}</td><td>{statement.payment_reference ?? "Not set"}</td></> : null}<td>{money(commissionAmountsByPaymentId.get(statement.id) ?? 0)}</td><td><StatusBadge tone={statement.status === "posted" ? "good" : "primary"} value={statement.status === "posted" ? "Paid" : "Draft"} /></td>{selectedCommissionTab === "draft" ? <td><Link className="text-action" href={`/?module=commission-payment&commission_payment=${statement.id}`}>Make Payment</Link></td> : null}</tr>)}</tbody></table></div> : <div className="empty-state">{selectedCommissionTab === "paid" ? "No paid commission statements have been recorded." : "No draft commission statements are awaiting payment."}</div>}
        </section>
      </> : null}
    </>
  );
}
