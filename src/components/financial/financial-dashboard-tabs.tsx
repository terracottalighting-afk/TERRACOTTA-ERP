import Link from "next/link";

import { StatusBadge } from "@/components/ui";
import { dateLabel, label, money, numberFormatter } from "@/lib/formatters";
import { createSupabaseAdminClient, createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";
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
  invoiceFreightCharge: number;
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

type FinancialCreditMemo = {
  amount_applied: number | null;
  amount_remaining: number | null;
  brand_name_snapshot: string;
  credit_memo_number: string;
  customer_name_snapshot: string;
  id: string;
  issue_date: string;
  status: string;
  total_credit_amount: number | null;
};

type SupplierBill = {
  id: string;
  container_id: string;
  container_number: string;
  loaded_date: string | null;
  vendor_id: string;
  vendor_name: string;
  erp_invoice_number: string;
  vendor_invoice_number: string | null;
  invoice_date: string | null;
  due_date: string | null;
  total_amount: number;
  invoice_status: "open" | "paid";
};

function SupplierBillTable({ bills }: { bills: SupplierBill[] }) {
  return bills.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>No.</th><th>Invoice Number</th><th>Container Number</th><th>Vendor</th><th>Container Loaded Date</th><th>Invoice Date</th><th>Due Date</th><th>Total Amount</th><th>Status</th></tr></thead><tbody>{bills.map((bill, index) => <tr key={bill.id}><td>{numberFormatter.format(index + 1)}</td><td><Link className="table-link" href={`/?module=vendor-invoice&vendor_invoice=${bill.id}`}>{bill.erp_invoice_number}</Link>{bill.vendor_invoice_number ? <><br /><small>Vendor: {bill.vendor_invoice_number}</small></> : null}</td><td><Link className="table-link" href={`/?module=container&container=${bill.container_id}`}>{bill.container_number}</Link></td><td><Link className="table-link" href={`/?module=vendor&vendor=${bill.vendor_id}`}>{bill.vendor_name}</Link></td><td>{dateLabel(bill.loaded_date)}</td><td>{dateLabel(bill.invoice_date)}</td><td>{dateLabel(bill.due_date)}</td><td>{money(bill.total_amount)}</td><td><StatusBadge tone={bill.invoice_status === "paid" ? "good" : "primary"} value={bill.invoice_status} /></td></tr>)}</tbody></table></div> : <div className="empty-state">No supplier bills have been recorded.</div>;
}

export async function FinancialDashboardTabs({
  financialFilters,
  financialCommissionTab,
  financialCreditMemoTab,
  financialBillsTab,
  financialSection,
  financialTab,
  packingLists,
}: {
  financialFilters: FinancialInvoiceFilters;
  financialCommissionTab?: string;
  financialCreditMemoTab?: string;
  financialBillsTab?: string;
  financialSection?: string;
  financialTab?: string;
  packingLists: FinancialDashboardPackingList[];
}) {
  const supabase = createSupabaseAdminClient();
  const supplierSupabase = createSupabaseUntypedAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const [
    { data: invoices, error: invoicesError },
    { data: payments, error: paymentsError },
    { data: paymentApplications, error: paymentApplicationsError },
    { data: commissionPayments, error: commissionPaymentsError },
    { data: commissionPaymentLines, error: commissionPaymentLinesError },
    { data: creditMemos, error: creditMemosError },
    { data: supplierBills, error: supplierBillsError },
    { data: billContainers, error: billContainersError },
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
    supabase
      .from("credit_memo")
      .select("id, credit_memo_number, customer_name_snapshot, brand_name_snapshot, issue_date, status, total_credit_amount, amount_applied, amount_remaining")
      .in("status", ["posted", "partially_applied", "fully_applied"])
      .order("issue_date", { ascending: false }),
    supplierSupabase
      .from("container_vendor_invoice")
      .select("id, import_container_id, vendor_id, vendor_name_snapshot, erp_invoice_number, vendor_invoice_number, invoice_date, due_date, invoice_status")
      .order("invoice_date", { ascending: false, nullsFirst: false }),
    supplierSupabase
      .from("import_container")
      .select("id, container_number, loaded_date"),
  ]);
  if (invoicesError) throw new Error(invoicesError.message);
  if (paymentsError) throw new Error(paymentsError.message);
  if (paymentApplicationsError)
    throw new Error(paymentApplicationsError.message);
  if (commissionPaymentsError) throw new Error(commissionPaymentsError.message);
  if (commissionPaymentLinesError)
    throw new Error(commissionPaymentLinesError.message);
  if (creditMemosError) throw new Error(creditMemosError.message);
  if (supplierBillsError) throw new Error(supplierBillsError.message);
  if (billContainersError) throw new Error(billContainersError.message);

  const supplierBillIds = (supplierBills ?? []).map((bill) => bill.id);
  const { data: supplierBillLines, error: supplierBillLinesError } = supplierBillIds.length
    ? await supplierSupabase.from("container_vendor_invoice_line").select("container_vendor_invoice_id, quantity, unit_price").in("container_vendor_invoice_id", supplierBillIds)
    : { data: [], error: null };
  if (supplierBillLinesError) throw new Error(supplierBillLinesError.message);

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
  const availableCreditMemos = (creditMemos ?? []) as FinancialCreditMemo[];
  const appliedCreditMemos = availableCreditMemos.filter((memo) => Number(memo.amount_remaining ?? 0) <= 0);
  const partiallyAppliedCreditMemos = availableCreditMemos.filter((memo) => Number(memo.amount_applied ?? 0) > 0 && Number(memo.amount_remaining ?? 0) > 0);
  const outstandingCreditMemos = availableCreditMemos.filter((memo) => Number(memo.amount_applied ?? 0) <= 0 && Number(memo.amount_remaining ?? 0) > 0);
  const allInvoices = (invoices ?? []) as FinancialInvoice[];
  const billContainerById = new Map((billContainers ?? []).map((container) => [container.id, container]));
  const orderedSupplierBills: SupplierBill[] = (supplierBills ?? []).map((bill) => {
    const container = billContainerById.get(bill.import_container_id);
    const totalAmount = (supplierBillLines ?? []).filter((line) => line.container_vendor_invoice_id === bill.id).reduce((sum, line) => sum + Number(line.quantity) * Number(line.unit_price), 0);
    return { id: bill.id, container_id: bill.import_container_id, container_number: container?.container_number ?? "Unavailable", loaded_date: container?.loaded_date ?? null, vendor_id: bill.vendor_id, vendor_name: bill.vendor_name_snapshot ?? "Unknown vendor", erp_invoice_number: bill.erp_invoice_number, vendor_invoice_number: bill.vendor_invoice_number, invoice_date: bill.invoice_date, due_date: bill.due_date, total_amount: totalAmount, invoice_status: (bill.invoice_status === "paid" ? "paid" : "open") as "open" | "paid" };
  }).sort((left, right) => `${right.invoice_date ?? ""}${right.erp_invoice_number}`.localeCompare(`${left.invoice_date ?? ""}${left.erp_invoice_number}`));
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
  const selectedSection = ["commission", "credit-memo", "bills-to-pay"].includes(financialSection ?? "") ? financialSection! : "invoices";
  const commissionTabs = [
    { key: "paid", label: "Paid Commission", statements: paidCommissionStatements },
    { key: "draft", label: "Draft Commission", statements: draftCommissionStatements },
  ];
  const selectedCommissionTab = commissionTabs.some((tab) => tab.key === financialCommissionTab)
    ? financialCommissionTab!
    : "paid";
  const creditMemoTabs = [
    { key: "applied", label: "Applied Credit Memo", memos: appliedCreditMemos },
    { key: "partially-applied", label: "Partially Applied", memos: partiallyAppliedCreditMemos },
    { key: "outstanding", label: "Ready to be Applied", memos: outstandingCreditMemos },
  ];
  const selectedCreditMemoTab = creditMemoTabs.some((tab) => tab.key === financialCreditMemoTab)
    ? financialCreditMemoTab!
    : "outstanding";
  const billsTabs = [
    { key: "suppliers", label: "Suppliers" },
    { key: "shipping-agency", label: "Shipping Agency" },
    { key: "customs-services", label: "Customs Services" },
  ];
  const selectedBillsTab = billsTabs.some((tab) => tab.key === financialBillsTab)
    ? financialBillsTab!
    : "suppliers";

  return (
    <>
      <div aria-label="Financial dashboard sections" className="metric-grid financial-dashboard-section-tabs">
        <Link className={`metric agency-customer-type-tab${selectedSection === "invoices" ? " agency-customer-type-tab--active" : ""}`} href={`/?module=invoices&financial_section=invoices&financial_tab=${selectedTab}`}>
          <span>Receivable Invoices</span>
          <strong>{numberFormatter.format(allInvoices.length)}</strong>
        </Link>
        <Link className={`metric agency-customer-type-tab${selectedSection === "bills-to-pay" ? " agency-customer-type-tab--active" : ""}`} href="/?module=invoices&financial_section=bills-to-pay&financial_bills_tab=suppliers">
          <span>Bills to Pay</span>
          <strong>{numberFormatter.format(orderedSupplierBills.length)}</strong>
        </Link>
        <Link className={`metric agency-customer-type-tab${selectedSection === "commission" ? " agency-customer-type-tab--active" : ""}`} href="/?module=invoices&financial_section=commission&financial_commission_tab=paid">
          <span>Commission</span>
          <strong>{numberFormatter.format(paidCommissionStatements.length + draftCommissionStatements.length)}</strong>
        </Link>
        <Link className={`metric agency-customer-type-tab${selectedSection === "credit-memo" ? " agency-customer-type-tab--active" : ""}`} href="/?module=invoices&financial_section=credit-memo&financial_credit_memo_tab=outstanding">
          <span>Credit Memo</span>
          <strong>{numberFormatter.format(availableCreditMemos.length)}</strong>
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
                      <td>{money(packingList.invoiceFreightCharge)}</td>
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
      {selectedSection === "bills-to-pay" ? <>
        <nav className="tab-nav financial-tab-nav" aria-label="Bills to pay lists">
          {billsTabs.map((tab) => <Link aria-current={tab.key === selectedBillsTab ? "page" : undefined} href={`/?module=invoices&financial_section=bills-to-pay&financial_bills_tab=${tab.key}`} key={tab.key}>{tab.label}</Link>)}
        </nav>
        {selectedBillsTab === "suppliers" ? <section className="record-section"><h3>Supplier Bills</h3><SupplierBillTable bills={orderedSupplierBills} /></section> : null}
        {selectedBillsTab === "shipping-agency" ? <section className="record-section"><h3>Shipping Agency Bills</h3><div className="empty-state">Shipping agency bills will be available here when agency invoices are recorded.</div></section> : null}
        {selectedBillsTab === "customs-services" ? <section className="record-section"><h3>Customs Services Bills</h3><div className="empty-state">Customs services bills will be available here when customs invoices are recorded.</div></section> : null}
      </> : null}
      {selectedSection === "commission" ? <>
        <nav className="tab-nav financial-tab-nav" aria-label="Commission statement lists">
          {commissionTabs.map((tab) => <Link aria-current={tab.key === selectedCommissionTab ? "page" : undefined} href={`/?module=invoices&financial_section=commission&financial_commission_tab=${tab.key}`} key={tab.key}>{tab.label} ({numberFormatter.format(tab.statements.length)})</Link>)}
        </nav>
        <section className="record-section">
          <h3>{selectedCommissionTab === "paid" ? "Paid Commission" : "Draft Commission"}</h3>
          {commissionTabs.find((tab) => tab.key === selectedCommissionTab)?.statements.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Commission Statement</th><th>Sales Agency</th><th>Statement Date</th><th>Included Invoices</th>{selectedCommissionTab === "paid" ? <><th>Payment Method</th><th>Reference</th></> : null}<th>Commission Total</th><th>Status</th>{selectedCommissionTab === "draft" ? <th>Action</th> : null}</tr></thead><tbody>{commissionTabs.find((tab) => tab.key === selectedCommissionTab)!.statements.map((statement) => <tr key={statement.id}><td><Link className="table-link" href={`/?module=commission-statement&commission_payment=${statement.id}`}>{statement.commission_payment_number}</Link></td><td><Link className="table-link" href={`/?module=sales-rep-agency&agency=${statement.sales_rep_agency_id}`}>{commissionAgencyNames.get(statement.sales_rep_agency_id) ?? "Unknown agency"}</Link></td><td>{dateLabel(statement.payment_date)}</td><td>{numberFormatter.format(commissionItemCountsByPaymentId.get(statement.id) ?? 0)}</td>{selectedCommissionTab === "paid" ? <><td>{label(statement.payment_type)}</td><td>{statement.payment_reference ?? "Not set"}</td></> : null}<td>{money(commissionAmountsByPaymentId.get(statement.id) ?? 0)}</td><td><StatusBadge tone={statement.status === "posted" ? "good" : "primary"} value={statement.status === "posted" ? "Paid" : "Draft"} /></td>{selectedCommissionTab === "draft" ? <td><Link className="text-action" href={`/?module=commission-payment&commission_payment=${statement.id}`}>Make Payment</Link></td> : null}</tr>)}</tbody></table></div> : <div className="empty-state">{selectedCommissionTab === "paid" ? "No paid commission statements have been recorded." : "No draft commission statements are awaiting payment."}</div>}
        </section>
      </> : null}
      {selectedSection === "credit-memo" ? <>
        <nav className="tab-nav financial-tab-nav" aria-label="Credit memo lists">
          {creditMemoTabs.map((tab) => <Link aria-current={tab.key === selectedCreditMemoTab ? "page" : undefined} href={`/?module=invoices&financial_section=credit-memo&financial_credit_memo_tab=${tab.key}`} key={tab.key}>{tab.label} ({numberFormatter.format(tab.memos.length)})</Link>)}
        </nav>
        <section className="record-section">
          <h3>{creditMemoTabs.find((tab) => tab.key === selectedCreditMemoTab)?.label}</h3>
          {creditMemoTabs.find((tab) => tab.key === selectedCreditMemoTab)?.memos.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Credit Memo</th><th>Customer</th><th>Brand</th><th>Issue Date</th><th>Credit Total</th><th>Applied</th><th>Remaining</th><th>Status</th></tr></thead><tbody>{creditMemoTabs.find((tab) => tab.key === selectedCreditMemoTab)!.memos.map((memo) => <tr key={memo.id}><td><Link className="table-link" href={`/?module=credit-memo-document&credit_memo=${memo.id}`}>{memo.credit_memo_number}</Link></td><td>{memo.customer_name_snapshot}</td><td>{memo.brand_name_snapshot}</td><td>{dateLabel(memo.issue_date)}</td><td>{money(memo.total_credit_amount)}</td><td>{money(memo.amount_applied)}</td><td>{money(memo.amount_remaining)}</td><td><StatusBadge tone={Number(memo.amount_remaining ?? 0) > 0 ? "primary" : "good"} value={Number(memo.amount_remaining ?? 0) > 0 ? Number(memo.amount_applied ?? 0) > 0 ? "Partially Applied" : "Ready to be Applied" : "Applied"} /></td></tr>)}</tbody></table></div> : <div className="empty-state">{selectedCreditMemoTab === "applied" ? "No fully applied credit memos have been recorded." : selectedCreditMemoTab === "partially-applied" ? "No partially applied credit memos have been recorded." : "No credit memos are ready to be applied."}</div>}
        </section>
      </> : null}
    </>
  );
}
