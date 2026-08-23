"use client";

import { useState } from "react";

type FinancialInvoiceControlsProps = {
  advanced: boolean;
  customer: string;
  dateFrom: string;
  dateTo: string;
  pageSize: number;
  query: string;
  skus: string;
  status: string;
  tab: "active" | "overdue" | "paid";
};

function PreservedAdvancedFilters({ advanced, customer, dateFrom, dateTo, skus, status }: FinancialInvoiceControlsProps) {
  if (!advanced) return null;
  return <>
    <input name="financial_advanced" type="hidden" value="1" />
    {dateFrom ? <input name="financial_date_from" type="hidden" value={dateFrom} /> : null}
    {dateTo ? <input name="financial_date_to" type="hidden" value={dateTo} /> : null}
    {status ? <input name="financial_status" type="hidden" value={status} /> : null}
    {customer ? <input name="financial_customer" type="hidden" value={customer} /> : null}
    {skus ? <input name="financial_skus" type="hidden" value={skus} /> : null}
  </>;
}

export function FinancialInvoiceControls(props: FinancialInvoiceControlsProps) {
  const { advanced, customer, dateFrom, dateTo, pageSize, query, skus, status, tab } = props;
  const [showAdvanced, setShowAdvanced] = useState(advanced);
  const clearHref = `/?module=invoices&financial_tab=${tab}&financial_page_size=${pageSize}${query ? `&financial_q=${encodeURIComponent(query)}` : ""}`;

  return <div className="financial-invoice-controls">
    <div className="order-list-controls">
      <form className="order-page-size-form" method="get">
        <input name="module" type="hidden" value="invoices" />
        <input name="financial_tab" type="hidden" value={tab} />
        {query ? <input name="financial_q" type="hidden" value={query} /> : null}
        <PreservedAdvancedFilters {...props} />
        <label htmlFor="financial-invoice-page-size">Show</label>
        <select defaultValue={String(pageSize)} id="financial-invoice-page-size" name="financial_page_size" onChange={(event) => event.currentTarget.form?.requestSubmit()}>
          <option value="10">10</option><option value="20">20</option><option value="30">30</option><option value="50">50</option><option value="100">100</option>
        </select>
        <span>invoices</span>
      </form>
      <form className="order-search-form" method="get">
        <input name="module" type="hidden" value="invoices" />
        <input name="financial_tab" type="hidden" value={tab} />
        <input name="financial_page_size" type="hidden" value={pageSize} />
        <PreservedAdvancedFilters {...props} />
        <label className="sr-only" htmlFor="financial-invoice-search">Search invoices</label>
        <input defaultValue={query} id="financial-invoice-search" name="financial_q" placeholder="Search invoice, customer, or brand" />
        <button aria-label="Search invoices" className="icon-button" title="Search invoices" type="submit">⌕</button>
      </form>
      <button className="text-action" onClick={() => setShowAdvanced((visible) => !visible)} type="button">{showAdvanced ? "Hide Advanced Search" : "Advanced Search"}</button>
    </div>
    {showAdvanced ? <form className="invoice-advanced-search" method="get">
      <input name="module" type="hidden" value="invoices" />
      <input name="financial_tab" type="hidden" value={tab} />
      <input name="financial_page_size" type="hidden" value={pageSize} />
      <input name="financial_advanced" type="hidden" value="1" />
      {query ? <input name="financial_q" type="hidden" value={query} /> : null}
      <label>Invoice Date From<input defaultValue={dateFrom} name="financial_date_from" type="date" /></label>
      <label>Invoice Date To<input defaultValue={dateTo} name="financial_date_to" type="date" /></label>
      <label>Payment Status<select defaultValue={status} name="financial_status"><option value="">All statuses</option><option value="unpaid">Unpaid</option><option value="partially_paid">Partially Paid</option><option value="paid">Paid</option></select></label>
      <label>Customer Name or ID<input defaultValue={customer} name="financial_customer" placeholder="Customer name or account no." /></label>
      <label>Product Item SKU(s)<input defaultValue={skus} name="financial_skus" placeholder="SKU-001, SKU-002" /></label>
      <div className="invoice-advanced-search-actions"><button className="primary-action" type="submit">Apply Filters</button><a className="text-action" href={clearHref}>Clear Filters</a></div>
    </form> : null}
  </div>;
}
