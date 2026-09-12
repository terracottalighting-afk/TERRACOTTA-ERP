import Link from "next/link";
import {
  FinancialDashboardTabs,
  type FinancialDashboardPackingList,
} from "@/components/financial/financial-dashboard-tabs";

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

export async function InvoiceQueuePage({
  error,
  financialFilters,
  financialCommissionTab,
  financialCreditMemoTab,
  financialSection,
  financialTab,
  loadPackingLists,
  notice,
}: {
  error?: string;
  financialFilters: FinancialInvoiceFilters;
  financialCommissionTab?: string;
  financialCreditMemoTab?: string;
  financialSection?: string;
  financialTab?: string;
  loadPackingLists: () => Promise<FinancialDashboardPackingList[]>;
  notice?: string;
}) {
  const packingLists = await loadPackingLists();
  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href="/">
            ERP Dashboard
          </Link>
          <div className="record-title-row">
            <h2>Financial Dashboard</h2>
          </div>
          <p>Financial work is organized by invoice and payment status.</p>
        </div>
      </section>
      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {notice ? (
        <div className="notice-banner">{decodeURIComponent(notice)}</div>
      ) : null}
      <FinancialDashboardTabs
        financialFilters={financialFilters}
        financialCommissionTab={financialCommissionTab}
        financialCreditMemoTab={financialCreditMemoTab}
        financialSection={financialSection}
        financialTab={financialTab}
        packingLists={packingLists}
      />
    </section>
  );
}
