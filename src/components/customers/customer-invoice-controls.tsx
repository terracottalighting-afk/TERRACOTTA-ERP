"use client";

import { useState } from "react";

type AdvancedInvoiceFilters = {
  advanced: boolean;
  dateFrom: string;
  dateTo: string;
  paymentStatus: string;
  skus: string;
};

function AdvancedFilterFields({ advanced, dateFrom, dateTo, paymentStatus, skus }: AdvancedInvoiceFilters) {
  if (!advanced) return null;

  return (
    <>
      <input type="hidden" name="invoice_advanced" value="1" />
      {dateFrom ? <input type="hidden" name="invoice_date_from" value={dateFrom} /> : null}
      {dateTo ? <input type="hidden" name="invoice_date_to" value={dateTo} /> : null}
      {paymentStatus ? <input type="hidden" name="invoice_status" value={paymentStatus} /> : null}
      {skus ? <input type="hidden" name="invoice_skus" value={skus} /> : null}
    </>
  );
}

export function CustomerInvoiceControls({
  customerId,
  pageSize,
  search,
  advanced,
  dateFrom,
  dateTo,
  paymentStatus,
  skus
}: {
  customerId: string;
  pageSize: number;
  search: string;
} & AdvancedInvoiceFilters) {
  const [showAdvanced, setShowAdvanced] = useState(advanced);
  const clearAdvancedHref = `/?customer=${encodeURIComponent(customerId)}&tab=invoices&invoice_page_size=${pageSize}${search ? `&invoice_q=${encodeURIComponent(search)}` : ""}`;

  return (
    <div className="customer-invoice-controls">
      <div className="order-list-controls">
        <form method="get" className="order-page-size-form">
          <input type="hidden" name="customer" value={customerId} />
          <input type="hidden" name="tab" value="invoices" />
          {search ? <input type="hidden" name="invoice_q" value={search} /> : null}
          <AdvancedFilterFields advanced={advanced} dateFrom={dateFrom} dateTo={dateTo} paymentStatus={paymentStatus} skus={skus} />
          <label htmlFor="customer-invoice-page-size">Show</label>
          <select id="customer-invoice-page-size" name="invoice_page_size" defaultValue={String(pageSize)} onChange={(event) => event.currentTarget.form?.requestSubmit()}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>invoices</span>
        </form>
        <form method="get" className="order-search-form">
          <input type="hidden" name="customer" value={customerId} />
          <input type="hidden" name="tab" value="invoices" />
          <input type="hidden" name="invoice_page_size" value={pageSize} />
          <AdvancedFilterFields advanced={advanced} dateFrom={dateFrom} dateTo={dateTo} paymentStatus={paymentStatus} skus={skus} />
          <label className="sr-only" htmlFor="customer-invoice-search">Search invoices</label>
          <input id="customer-invoice-search" name="invoice_q" placeholder="Search invoice or brand" defaultValue={search} />
          <button aria-label="Search invoices" className="icon-button" title="Search invoices" type="submit">⌕</button>
        </form>
        <button type="button" className="text-action" onClick={() => setShowAdvanced((visible) => !visible)}>
          {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}
        </button>
      </div>
      {showAdvanced ? (
        <form method="get" className="invoice-advanced-search">
          <input type="hidden" name="customer" value={customerId} />
          <input type="hidden" name="tab" value="invoices" />
          <input type="hidden" name="invoice_page_size" value={pageSize} />
          <input type="hidden" name="invoice_advanced" value="1" />
          {search ? <input type="hidden" name="invoice_q" value={search} /> : null}
          <label>Invoice Date From<input type="date" name="invoice_date_from" defaultValue={dateFrom} /></label>
          <label>Invoice Date To<input type="date" name="invoice_date_to" defaultValue={dateTo} /></label>
          <label>
            Payment Status
            <select name="invoice_status" defaultValue={paymentStatus}>
              <option value="">All statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          <label>Product Item SKU(s)<input name="invoice_skus" placeholder="SKU-001, SKU-002" defaultValue={skus} /></label>
          <div className="invoice-advanced-search-actions">
            <button type="submit" className="primary-action">Apply Filters</button>
            <a className="text-action" href={clearAdvancedHref}>Clear Filters</a>
          </div>
        </form>
      ) : null}
    </div>
  );
}
