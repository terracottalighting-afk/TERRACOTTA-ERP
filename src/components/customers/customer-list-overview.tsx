import Link from "next/link";

import { EmptyState, StatusBadge } from "@/components/ui";

type Lookup = Record<string, string>;

type CustomerAccount = {
  account_number: string;
  account_type_id: string;
  business_type_id: string;
  id: string;
  legacy_account_id: string | null;
  name: string;
  status: string;
};

export function CustomerListOverview({
  accountTypes,
  businessTypes,
  customers,
  deleteAction,
  error,
  listMode = "active",
  notice,
  query,
}: {
  accountTypes: Lookup;
  businessTypes: Lookup;
  customers: CustomerAccount[];
  deleteAction: (formData: FormData) => void | Promise<void>;
  error?: string;
  listMode?: "active" | "obsolete";
  notice?: string;
  query: string;
}) {
  const isObsoleteList = listMode === "obsolete";

  return (
    <section className="dashboard-panel">
      <section className="list-header">
        <div>
          <span className="eyebrow">
            {isObsoleteList ? "Customer History" : "Customer List"}
          </span>
          <h2>
            {query
              ? `Search Results for "${query}"`
              : isObsoleteList
                ? "Obsolete Accounts"
                : "All Active Customers"}
          </h2>
        </div>
        <div className="list-actions">
          <span>{customers.length} shown</span>
          {!isObsoleteList ? (
            <button
              className="danger-action"
              form="customer-delete-form"
              type="submit"
            >
              Delete Selected
            </button>
          ) : null}
          {!isObsoleteList ? (
            <Link className="primary-action" href="/?module=add-customer">
              Add Customer
            </Link>
          ) : null}
        </div>
      </section>
      <form className="list-search-form">
        {isObsoleteList ? (
          <input name="module" type="hidden" value="obsolete-customers" />
        ) : null}
        <label htmlFor="customer-list-search">Search customers</label>
        <div className="list-search-row">
          <input
            defaultValue={query}
            id="customer-list-search"
            name="q"
            placeholder="Name, account no., or legacy no."
            type="search"
          />
          <button type="submit">Search</button>
          <a className="advanced-search-link" href="#advanced-search">
            Advanced Search
          </a>
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

      {customers.length === 0 ? (
        <EmptyState
          text={
            isObsoleteList
              ? "No obsolete customer accounts match this search."
              : "No customers match this search."
          }
        />
      ) : (
        <form action={deleteAction} id="customer-delete-form">
          <input name="q" type="hidden" value={query} />
          <input
            name="return_module"
            type="hidden"
            value={isObsoleteList ? "obsolete-customers" : "customers"}
          />
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {!isObsoleteList ? (
                    <th className="select-column">Select</th>
                  ) : null}
                  <th>Customer</th>
                  <th>Account No.</th>
                  <th>Legacy Account No.</th>
                  <th>Account Type</th>
                  <th>Business Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    {!isObsoleteList ? (
                      <td className="select-column">
                        <input
                          aria-label={`Select ${customer.name}`}
                          name="customer_ids"
                          type="checkbox"
                          value={customer.id}
                        />
                      </td>
                    ) : null}
                    <td>
                      <Link
                        className="table-link"
                        href={`/?customer=${customer.id}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                      >
                        {customer.name}
                      </Link>
                    </td>
                    <td>{customer.account_number}</td>
                    <td>{customer.legacy_account_id ?? "Not set"}</td>
                    <td>
                      {accountTypes[customer.account_type_id] ?? "Not set"}
                    </td>
                    <td>
                      {businessTypes[customer.business_type_id] ?? "Not set"}
                    </td>
                    <td>
                      <StatusBadge
                        tone={customer.status === "active" ? "good" : "warn"}
                        value={customer.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      )}
    </section>
  );
}
