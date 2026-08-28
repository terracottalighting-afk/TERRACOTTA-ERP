import Link from "next/link";

import { StatusBadge } from "@/components/ui";
import { dateLabel, label, money, numberFormatter } from "@/lib/formatters";

type AccessoryPartListItem = {
  brand_name: string;
  default_price: number | null;
  id: string;
  incoming_quantity: number | null;
  name: string;
  next_incoming_eta: string | null;
  parent_products: {
    id: string;
    name: string;
    part_name: string | null;
    part_role: string | null;
    quantity_required: number;
    sku: string;
  }[];
  sellability_status: string;
  sellable_quantity: number | null;
  sku: string;
  status: string;
};

export function ProductPartsListOverview({
  page,
  pageSize,
  parts,
  query,
  totalCount,
  totalPages,
}: {
  page: number;
  pageSize: number;
  parts: AccessoryPartListItem[];
  query: string;
  totalCount: number;
  totalPages: number;
}) {
  const buildProductPartsParams = (
    overrides: Record<string, string | number | undefined> = {},
  ) => {
    const searchParams = new URLSearchParams({
      module: "product-parts",
    });

    if (query) {
      searchParams.set("q", query);
    }

    searchParams.set("product_page", String(page));
    searchParams.set("product_page_size", String(pageSize));

    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        searchParams.delete(key);
      } else {
        searchParams.set(key, String(value));
      }
    });

    return `/?${searchParams.toString()}`;
  };

  const startRow = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, totalCount);
  const visiblePageNumbers = Array.from(
    new Set(
      [1, 2, 3, page - 1, page, page + 1, totalPages].filter(
        (value) => value >= 1 && value <= totalPages,
      ),
    ),
  ).sort((a, b) => a - b);

  return (
    <section className="dashboard-panel">
      <section className="list-header-panel">
        <span>{numberFormatter.format(totalCount)} parts</span>
        <div className="list-actions">
          <Link
            className="primary-action"
            href="/?module=edit-product-parts&part_action=add"
          >
            Add Part
          </Link>
        </div>
      </section>

      <form action="/" className="list-search-form">
        <input name="module" type="hidden" value="product-parts" />
        <input name="product_page" type="hidden" value="1" />
        <label htmlFor="product-part-search">Search parts</label>
        <div className="product-list-controls">
          <label className="inline-select-label">
            Per Page
            <select defaultValue={pageSize} name="product_page_size">
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <div className="list-search-row">
            <input
              autoComplete="off"
              defaultValue={query}
              id="product-part-search"
              name="q"
              placeholder="Part SKU, part name, parent SKU"
              type="search"
            />
            <button type="submit">Search</button>
          </div>
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Part SKU</th>
              <th>Part Name</th>
              <th>Brand</th>
              <th>Parent SKU(s)</th>
              <th>Parent Product(s)</th>
              <th>Inventory</th>
              <th>ETA</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {parts.length === 0 ? (
              <tr>
                <td colSpan={9}>No parts found.</td>
              </tr>
            ) : (
              parts.map((part) => (
                <tr key={part.id}>
                  <td>
                    <Link
                      className="table-link"
                      href={`/?module=product-parts&part=${part.id}`}
                    >
                      {part.sku}
                    </Link>
                  </td>
                  <td>{part.name}</td>
                  <td>{part.brand_name}</td>
                  <td>
                    {part.parent_products.length === 0
                      ? "Generic"
                      : part.parent_products.map((parent, index) => (
                          <span key={parent.id}>
                            {index > 0 ? ", " : null}
                            <Link
                              className="table-link"
                              href={`/?module=products&product=${parent.id}`}
                            >
                              {parent.sku}
                            </Link>
                          </span>
                        ))}
                  </td>
                  <td>
                    {part.parent_products.length === 0
                      ? "Generic part"
                      : part.parent_products.map((parent) => (
                          <div className="stacked-detail" key={parent.id}>
                            <span>{parent.name}</span>
                            <small>
                              {parent.part_name ? `${parent.part_name} / ` : ""}
                              {parent.part_role
                                ? label(parent.part_role)
                                : "Role not set"}
                            </small>
                          </div>
                        ))}
                  </td>
                  <td>
                    <div className="inventory-cell">
                      <strong>
                        {numberFormatter.format(
                          Number(part.sellable_quantity ?? 0),
                        )}
                      </strong>
                      <span>
                        {Number(part.sellable_quantity ?? 0) > 0
                          ? "Available"
                          : "Out of stock"}
                      </span>
                    </div>
                  </td>
                  <td>
                    {Number(part.sellable_quantity ?? 0) > 0
                      ? "In stock"
                      : part.next_incoming_eta
                        ? `${dateLabel(part.next_incoming_eta)} (${numberFormatter.format(Number(part.incoming_quantity ?? 0))})`
                        : "No ETA"}
                  </td>
                  <td>{money(part.default_price)}</td>
                  <td>
                    <div className="badge-row">
                      <StatusBadge
                        tone={part.status === "active" ? "good" : "warn"}
                        value={part.status}
                      />
                      <StatusBadge value={part.sellability_status} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={9}>
                <div className="pagination-footer">
                  <span>
                    Showing {numberFormatter.format(startRow)}-
                    {numberFormatter.format(endRow)} of{" "}
                    {numberFormatter.format(totalCount)} parts
                  </span>
                  <nav
                    className="pagination-nav"
                    aria-label="Product parts pages"
                  >
                    <Link
                      aria-disabled={page <= 1}
                      className="pagination-link"
                      href={buildProductPartsParams({ product_page: 1 })}
                    >
                      First
                    </Link>
                    <Link
                      aria-disabled={page <= 1}
                      className="pagination-link"
                      href={buildProductPartsParams({
                        product_page: Math.max(1, page - 1),
                      })}
                    >
                      Previous
                    </Link>
                    {visiblePageNumbers.map((pageNumber, index) => (
                      <span className="pagination-page-wrap" key={pageNumber}>
                        {index > 0 &&
                        pageNumber - visiblePageNumbers[index - 1] > 1 ? (
                          <span className="pagination-ellipsis">...</span>
                        ) : null}
                        {pageNumber === page ? (
                          <span
                            aria-current="page"
                            className="pagination-current"
                          >
                            {pageNumber}
                          </span>
                        ) : (
                          <Link
                            className="pagination-link"
                            href={buildProductPartsParams({
                              product_page: pageNumber,
                            })}
                          >
                            {pageNumber}
                          </Link>
                        )}
                      </span>
                    ))}
                    <Link
                      aria-disabled={page >= totalPages}
                      className="pagination-link"
                      href={buildProductPartsParams({
                        product_page: Math.min(totalPages, page + 1),
                      })}
                    >
                      Next
                    </Link>
                    <Link
                      aria-disabled={page >= totalPages}
                      className="pagination-link"
                      href={buildProductPartsParams({
                        product_page: totalPages,
                      })}
                    >
                      Last
                    </Link>
                  </nav>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
