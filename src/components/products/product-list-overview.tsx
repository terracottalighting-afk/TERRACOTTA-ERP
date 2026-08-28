import Link from "next/link";

import { ProductListRows } from "@/components/products/product-list-rows";
import { numberFormatter } from "@/lib/formatters";

type SelectOption = {
  id: string;
  name: string;
};

type ProductSearchFilters = {
  brandId?: string;
  categoryId?: string;
  eligibility?: string;
  finishId?: string;
  lightCount?: string;
  status?: string;
  styleId?: string;
};

type ProductComponentPartItem = {
  component_name: string;
  component_product_id: string;
  component_sellability_status: string;
  component_sku: string;
  component_status: string;
  id: string;
  incoming_quantity: number | null;
  next_incoming_eta: string | null;
  part_role: string | null;
  quantity_required: number;
  sellable_quantity: number | null;
};

type ProductListItem = {
  brand_name: string;
  category_name: string | null;
  customer_eligibility_tag: string;
  default_price: number | null;
  id: string;
  incoming_quantity: number | null;
  name: string;
  next_incoming_eta: string | null;
  parts: ProductComponentPartItem[];
  sellability_status: string;
  sellable_quantity: number | null;
  sku: string;
  status: string;
};

export function ProductListOverview({
  brandOptions,
  categoryOptions,
  deleteAction,
  error,
  filters,
  finishOptions,
  listMode = "active",
  notice,
  page,
  pageSize,
  products,
  query,
  showAdvanced,
  styleOptions,
  totalCount,
  totalPages,
}: {
  brandOptions: SelectOption[];
  categoryOptions: SelectOption[];
  deleteAction: (formData: FormData) => void | Promise<void>;
  error?: string;
  filters: ProductSearchFilters;
  finishOptions: SelectOption[];
  listMode?: "active" | "discontinued";
  notice?: string;
  page: number;
  pageSize: number;
  products: ProductListItem[];
  query: string;
  showAdvanced: boolean;
  styleOptions: SelectOption[];
  totalCount: number;
  totalPages: number;
}) {
  const regularCategoryOptions = categoryOptions.filter(
    (category) => category.name.toLowerCase() !== "accessory",
  );
  const buildProductListParams = (
    overrides: Record<string, string | number | undefined> = {},
  ) => {
    const searchParams = new URLSearchParams({
      module:
        listMode === "discontinued" ? "discontinued-products" : "products",
    });

    if (query) {
      searchParams.set("q", query);
    }

    if (filters.brandId) {
      searchParams.set("product_brand", filters.brandId);
    }

    if (filters.styleId) {
      searchParams.set("product_style", filters.styleId);
    }

    if (filters.categoryId) {
      searchParams.set("product_category", filters.categoryId);
    }

    if (filters.eligibility) {
      searchParams.set("product_eligibility", filters.eligibility);
    }

    if (filters.status) {
      searchParams.set("product_status", filters.status);
    }

    if (filters.finishId) {
      searchParams.set("product_finish", filters.finishId);
    }

    if (filters.lightCount) {
      searchParams.set("product_lights", filters.lightCount);
    }

    if (showAdvanced) {
      searchParams.set("advanced", "1");
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

  const advancedSearchHref = buildProductListParams({
    advanced: showAdvanced ? undefined : "1",
    product_page: 1,
  });
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
        <span>{numberFormatter.format(totalCount)} total products</span>
        <div className="list-actions">
          <button
            className="danger-action"
            form="product-delete-form"
            type="submit"
          >
            Delete Selected
          </button>
          <button className="primary-action" type="button">
            Add Product
          </button>
        </div>
      </section>

      <form action="/" className="list-search-form">
        <input
          name="module"
          type="hidden"
          value={
            listMode === "discontinued" ? "discontinued-products" : "products"
          }
        />
        <input name="product_page" type="hidden" value="1" />
        {!showAdvanced && filters.brandId ? (
          <input name="product_brand" type="hidden" value={filters.brandId} />
        ) : null}
        {!showAdvanced && filters.styleId ? (
          <input name="product_style" type="hidden" value={filters.styleId} />
        ) : null}
        {!showAdvanced && filters.categoryId ? (
          <input
            name="product_category"
            type="hidden"
            value={filters.categoryId}
          />
        ) : null}
        {!showAdvanced && filters.eligibility ? (
          <input
            name="product_eligibility"
            type="hidden"
            value={filters.eligibility}
          />
        ) : null}
        {!showAdvanced && filters.status ? (
          <input name="product_status" type="hidden" value={filters.status} />
        ) : null}
        {!showAdvanced && filters.finishId ? (
          <input name="product_finish" type="hidden" value={filters.finishId} />
        ) : null}
        {!showAdvanced && filters.lightCount ? (
          <input
            name="product_lights"
            type="hidden"
            value={filters.lightCount}
          />
        ) : null}
        {showAdvanced ? (
          <input name="advanced" type="hidden" value="1" />
        ) : null}
        {showAdvanced ? (
          <section className="advanced-filter-panel">
            <div className="advanced-filter-title">
              <h3>Advanced Search</h3>
            </div>
            <div className="advanced-filter-grid">
              <label>
                Brand
                <select
                  defaultValue={filters.brandId ?? ""}
                  name="product_brand"
                >
                  <option value="">All brands</option>
                  {brandOptions.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Style / Suite
                <select
                  defaultValue={filters.styleId ?? ""}
                  name="product_style"
                >
                  <option value="">All styles</option>
                  {styleOptions.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Category
                <select
                  defaultValue={filters.categoryId ?? ""}
                  name="product_category"
                >
                  <option value="">All categories</option>
                  {regularCategoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Eligibility
                <select
                  defaultValue={filters.eligibility ?? ""}
                  name="product_eligibility"
                >
                  <option value="">All eligibility</option>
                  <option value="all">All</option>
                  <option value="ecommerce_only">Ecommerce Only</option>
                  <option value="non_ecommerce_only">Non-ecommerce Only</option>
                  <option value="exclusive">Exclusive</option>
                </select>
              </label>
              <label>
                Status
                <select
                  defaultValue={filters.status ?? ""}
                  name="product_status"
                >
                  <option value="">All status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </label>
              <label>
                Finish
                <select
                  defaultValue={filters.finishId ?? ""}
                  name="product_finish"
                >
                  <option value="">All finishes</option>
                  {finishOptions.map((finish) => (
                    <option key={finish.id} value={finish.id}>
                      {finish.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Number of Lights
                <input
                  defaultValue={filters.lightCount ?? ""}
                  min="0"
                  name="product_lights"
                  placeholder="Any"
                  type="number"
                />
              </label>
            </div>
            <div className="advanced-filter-actions">
              <button className="primary-action" type="submit">
                Apply Filters
              </button>
              <Link
                className="secondary-action secondary-action--light"
                href={
                  listMode === "discontinued"
                    ? "/?module=discontinued-products"
                    : "/?module=products"
                }
              >
                Clear Filters
              </Link>
            </div>
          </section>
        ) : null}
        <label htmlFor="product-search">Search products</label>
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
              id="product-search"
              name="q"
              placeholder="SKU, product name, collection"
              type="search"
            />
            <button type="submit">Search</button>
            <Link className="advanced-search-link" href={advancedSearchHref}>
              {showAdvanced ? "Hide Advanced Search" : "Advanced Search"}
            </Link>
          </div>
        </div>
      </form>

      {notice ? (
        <div className="form-alert form-alert--success">
          {decodeURIComponent(notice)}
        </div>
      ) : null}
      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}

      <form action={deleteAction} id="product-delete-form">
        <input name="q" type="hidden" value={query} />
        <input
          name="return_module"
          type="hidden"
          value={
            listMode === "discontinued" ? "discontinued-products" : "products"
          }
        />
        <input name="advanced" type="hidden" value={showAdvanced ? "1" : ""} />
        <input
          name="product_brand"
          type="hidden"
          value={filters.brandId ?? ""}
        />
        <input
          name="product_category"
          type="hidden"
          value={filters.categoryId ?? ""}
        />
        <input
          name="product_eligibility"
          type="hidden"
          value={filters.eligibility ?? ""}
        />
        <input
          name="product_finish"
          type="hidden"
          value={filters.finishId ?? ""}
        />
        <input
          name="product_lights"
          type="hidden"
          value={filters.lightCount ?? ""}
        />
        <input name="product_page" type="hidden" value={page} />
        <input name="product_page_size" type="hidden" value={pageSize} />
        <input
          name="product_status"
          type="hidden"
          value={filters.status ?? ""}
        />
        <input
          name="product_style"
          type="hidden"
          value={filters.styleId ?? ""}
        />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="expand-column">Parts</th>
                <th>SKU</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Eligibility</th>
                <th>Inventory</th>
                <th>ETA</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <ProductListRows products={products} />
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={10}>
                  <div className="pagination-footer">
                    <span>
                      Showing {numberFormatter.format(startRow)}-
                      {numberFormatter.format(endRow)} of{" "}
                      {numberFormatter.format(totalCount)} products
                    </span>
                    <nav
                      className="pagination-nav"
                      aria-label="Product list pages"
                    >
                      <Link
                        aria-disabled={page <= 1}
                        className="pagination-link"
                        href={buildProductListParams({ product_page: 1 })}
                      >
                        First
                      </Link>
                      <Link
                        aria-disabled={page <= 1}
                        className="pagination-link"
                        href={buildProductListParams({
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
                              href={buildProductListParams({
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
                        href={buildProductListParams({
                          product_page: Math.min(totalPages, page + 1),
                        })}
                      >
                        Next
                      </Link>
                      <Link
                        aria-disabled={page >= totalPages}
                        className="pagination-link"
                        href={buildProductListParams({
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
      </form>
    </section>
  );
}
