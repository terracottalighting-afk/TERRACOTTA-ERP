"use client";

export function OrdersOverviewControls({
  advanced,
  moduleKey,
  pageSize,
  values
}: {
  advanced: boolean;
  moduleKey: "orders" | "quotes";
  pageSize: number;
  values: {
    q: string;
    dateFrom: string;
    dateTo: string;
    customer: string;
    sku: string;
    territory: string;
    rep: string;
    status: string;
  };
}) {
  return (
    <div className="orders-overview-controls">
      <form method="get" className="orders-quick-controls">
        <input type="hidden" name="module" value={moduleKey} />
        <input type="hidden" name="order_page" value="1" />
        <input type="hidden" name="order_page_size" value={pageSize} />
        {advanced ? <input type="hidden" name="order_advanced" value="true" /> : null}
        <label htmlFor="orders-page-size">Show</label>
        <select id="orders-page-size" name="order_page_size" defaultValue={String(pageSize)} onChange={(event) => event.currentTarget.form?.requestSubmit()}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <span>orders</span>
        <label className="sr-only" htmlFor="orders-quick-search">Search orders</label>
        <input id="orders-quick-search" name="order_q" placeholder="Search PO, customer, or SKU" defaultValue={values.q} />
        <button aria-label="Search orders" className="icon-button" title="Search orders" type="submit">⌕</button>
        <button className="text-action" name="order_advanced" value={advanced ? "" : "true"} type="submit">{advanced ? "Hide Advanced Search" : "Advanced Search"}</button>
      </form>
      {advanced ? (
        <form method="get" className="orders-advanced-search">
          <input type="hidden" name="module" value={moduleKey} />
          <input type="hidden" name="order_page" value="1" />
          <input type="hidden" name="order_page_size" value={pageSize} />
          <input type="hidden" name="order_advanced" value="true" />
          <label>Order date from<input type="date" name="order_date_from" defaultValue={values.dateFrom} /></label>
          <label>Order date to<input type="date" name="order_date_to" defaultValue={values.dateTo} /></label>
          <label>Customer name<input name="order_customer_name" placeholder="Customer" defaultValue={values.customer} /></label>
          <label>SKU<input name="order_sku" placeholder="SKU" defaultValue={values.sku} /></label>
          <label>Territory<input name="order_territory" placeholder="Territory" defaultValue={values.territory} /></label>
          <label>Sales Rep<input name="order_rep" placeholder="Sales rep" defaultValue={values.rep} /></label>
          <label>Status<select name="order_status" defaultValue={values.status}><option value="">All statuses</option><option value="open">Open</option><option value="closed">Closed</option><option value="deleted">Deleted</option></select></label>
          <button className="secondary-action" type="submit">Apply Filters</button>
        </form>
      ) : null}
    </div>
  );
}
