"use client";

export function CustomerOrderControls({
  customerId,
  mode,
  pageSize,
  search,
  sort,
  direction
}: {
  customerId: string;
  mode: "orders" | "quotes" | "display";
  pageSize: number;
  search: string;
  sort?: "status" | "created_at";
  direction?: "asc" | "desc";
}) {
  const listLabel = mode === "quotes" ? "quotes" : mode === "display" ? "display orders" : "orders";
  const searchLabel = mode === "quotes" ? "quote" : mode === "display" ? "display order" : "order";

  return (
    <div className="order-list-controls">
      <form method="get" className="order-page-size-form">
        <input type="hidden" name="customer" value={customerId} />
        <input type="hidden" name="tab" value="orders" />
        {mode !== "orders" ? <input type="hidden" name="order_mode" value={mode} /> : null}
        {search ? <input type="hidden" name="order_q" value={search} /> : null}
        {sort ? <input type="hidden" name="order_sort" value={sort} /> : null}
        {sort && direction ? <input type="hidden" name="order_dir" value={direction} /> : null}
        <label htmlFor="customer-order-page-size">Show</label>
        <select
          id="customer-order-page-size"
          name="order_page_size"
          defaultValue={String(pageSize)}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
        </select>
        <span>{listLabel}</span>
      </form>
      <form method="get" className="order-search-form">
        <input type="hidden" name="customer" value={customerId} />
        <input type="hidden" name="tab" value="orders" />
        {mode !== "orders" ? <input type="hidden" name="order_mode" value={mode} /> : null}
        <input type="hidden" name="order_page_size" value={pageSize} />
        {sort ? <input type="hidden" name="order_sort" value={sort} /> : null}
        {sort && direction ? <input type="hidden" name="order_dir" value={direction} /> : null}
        <label className="sr-only" htmlFor="customer-order-search">Search {listLabel}</label>
        <input id="customer-order-search" name="order_q" placeholder={`Search ${searchLabel}, PO, or SKU`} defaultValue={search} />
        <button aria-label={`Search ${listLabel}`} className="icon-button" title={`Search ${listLabel}`} type="submit">⌕</button>
      </form>
    </div>
  );
}
