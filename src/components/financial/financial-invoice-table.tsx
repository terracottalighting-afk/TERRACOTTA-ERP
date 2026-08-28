import Link from "next/link";

import { FinancialInvoiceControls } from "@/components/financial/financial-invoice-controls";
import { StatusBadge } from "@/components/ui";
import { dateLabel, money } from "@/lib/formatters";

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

type FinancialInvoice = {
  balance_due: number | null;
  brand_name_snapshot: string;
  customer_account_id: string;
  customer_name_snapshot: string;
  due_date: string | null;
  id: string;
  invoice_date: string;
  invoice_number: string;
  payment_status: string;
  sales_order?: { customer_po_number: string | null } | null;
  sales_order_id: string;
  total_amount: number | null;
};

export function FinancialInvoiceTable({
  emptyText,
  filters,
  invoices,
  tab,
}: {
  emptyText: string;
  filters: FinancialInvoiceFilters;
  invoices: FinancialInvoice[];
  tab: "active" | "overdue" | "paid";
}) {
  const pageSize = [10, 20, 30, 50, 100].includes(Number(filters.pageSize))
    ? Number(filters.pageSize)
    : 10;
  const totalPages = Math.max(1, Math.ceil(invoices.length / pageSize));
  const currentPage = Math.min(
    totalPages,
    Math.max(1, Number(filters.page ?? 1) || 1),
  );
  const pageRows = invoices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const pageHref = (page: number) =>
    `/?module=invoices&financial_tab=${tab}&financial_page=${page}&financial_page_size=${pageSize}${filters.query ? `&financial_q=${encodeURIComponent(filters.query)}` : ""}${filters.advanced === "1" ? "&financial_advanced=1" : ""}${filters.dateFrom ? `&financial_date_from=${encodeURIComponent(filters.dateFrom)}` : ""}${filters.dateTo ? `&financial_date_to=${encodeURIComponent(filters.dateTo)}` : ""}${filters.status ? `&financial_status=${encodeURIComponent(filters.status)}` : ""}${filters.customer ? `&financial_customer=${encodeURIComponent(filters.customer)}` : ""}${filters.skus ? `&financial_skus=${encodeURIComponent(filters.skus)}` : ""}`;

  return (
    <>
      <FinancialInvoiceControls
        advanced={filters.advanced === "1"}
        customer={filters.customer ?? ""}
        dateFrom={filters.dateFrom ?? ""}
        dateTo={filters.dateTo ?? ""}
        pageSize={pageSize}
        query={filters.query ?? ""}
        skus={filters.skus ?? ""}
        status={filters.status ?? ""}
        tab={tab}
      />
      {invoices.length === 0 ? (
        <div className="empty-state">{emptyText}</div>
      ) : (
        <>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice No.</th>
                  <th>Customer</th>
                  <th>Brand</th>
                  <th>Invoice Date</th>
                  <th>Due Date</th>
                  <th>Invoice Total</th>
                  <th>Balance Due</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?module=invoice-document&invoice=${invoice.id}`}
                      >
                        {invoice.invoice_number}
                      </Link>
                      {invoice.sales_order?.customer_po_number ? (
                        <span className="invoice-po-reference">
                          PO{" "}
                          <Link
                            className="table-link"
                            href={`/?module=orders&order=${invoice.sales_order_id}`}
                          >
                            {invoice.sales_order.customer_po_number}
                          </Link>
                        </span>
                      ) : null}
                    </td>
                    <td>
                      <Link
                        className="table-link"
                        href={`/?customer=${invoice.customer_account_id}&tab=invoices`}
                      >
                        {invoice.customer_name_snapshot}
                      </Link>
                    </td>
                    <td>{invoice.brand_name_snapshot}</td>
                    <td>{dateLabel(invoice.invoice_date)}</td>
                    <td>{dateLabel(invoice.due_date)}</td>
                    <td>{money(Number(invoice.total_amount))}</td>
                    <td>{money(Number(invoice.balance_due))}</td>
                    <td>
                      {invoice.payment_status === "unpaid" ? (
                        <Link
                          className="small-action"
                          href={`/?module=ar&invoice=${invoice.id}`}
                        >
                          Make Payment
                        </Link>
                      ) : (
                        <StatusBadge
                          tone={
                            invoice.payment_status === "paid" ? "good" : "warn"
                          }
                          value={invoice.payment_status}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 ? (
            <nav className="list-pagination" aria-label="Invoice pages">
              <Link href={pageHref(Math.max(1, currentPage - 1))}>
                Previous
              </Link>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Link href={pageHref(Math.min(totalPages, currentPage + 1))}>
                Next
              </Link>
            </nav>
          ) : null}
        </>
      )}
    </>
  );
}
