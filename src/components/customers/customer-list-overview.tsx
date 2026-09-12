import Link from "next/link";

import { EmptyState, StatusBadge } from "@/components/ui";

type Lookup = Record<string, string>;

type SelectOption = { id: string; name: string };

type CustomerListFilters = {
  accountTypeId?: string;
  advanced: boolean;
  agencyId?: string;
  status?: string;
  territoryId?: string;
};

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
  accountTypeOptions,
  accountStatusOptions,
  businessTypes,
  customers,
  deleteAction,
  error,
  filters,
  listMode = "active",
  notice,
  query,
  salesAgencyOptions,
  territoryOptions,
}: {
  accountTypes: Lookup;
  accountTypeOptions: SelectOption[];
  accountStatusOptions: SelectOption[];
  businessTypes: Lookup;
  customers: CustomerAccount[];
  deleteAction: (formData: FormData) => void | Promise<void>;
  error?: string;
  filters: CustomerListFilters;
  listMode?: "active" | "obsolete";
  notice?: string;
  query: string;
  salesAgencyOptions: SelectOption[];
  territoryOptions: SelectOption[];
}) {
  const isObsoleteList = listMode === "obsolete";
  const customerListUrl = (showAdvanced: boolean) => {
    const params = new URLSearchParams();
    if (isObsoleteList) params.set("module", "obsolete-customers");
    if (query) params.set("q", query);
    if (filters.accountTypeId) params.set("customer_account_type", filters.accountTypeId);
    if (filters.agencyId) params.set("customer_agency", filters.agencyId);
    if (filters.status) params.set("customer_status", filters.status);
    if (filters.territoryId) params.set("customer_territory", filters.territoryId);
    if (showAdvanced) params.set("customer_advanced", "1");
    const search = params.toString();
    return search ? `/?${search}` : "/";
  };

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
        {filters.accountTypeId ? <input name="customer_account_type" type="hidden" value={filters.accountTypeId} /> : null}
        {filters.agencyId ? <input name="customer_agency" type="hidden" value={filters.agencyId} /> : null}
        {filters.status ? <input name="customer_status" type="hidden" value={filters.status} /> : null}
        {filters.territoryId ? <input name="customer_territory" type="hidden" value={filters.territoryId} /> : null}
        {filters.advanced ? <input name="customer_advanced" type="hidden" value="1" /> : null}
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
          <Link className="advanced-search-link" href={customerListUrl(!filters.advanced)}>{filters.advanced ? "Hide" : "Advanced Search"}</Link>
        </div>
      </form>

      {filters.advanced ? <form className="advanced-filter-panel" id="advanced-search">
        {isObsoleteList ? <input name="module" type="hidden" value="obsolete-customers" /> : null}
        <input name="customer_advanced" type="hidden" value="1" />
        <div className="advanced-filter-title"><h3>Advanced Search</h3><Link className="advanced-search-link" href={customerListUrl(false)}>Hide</Link></div>
        <div className="advanced-filter-grid">
          <label>Account Name<input defaultValue={query} name="q" placeholder="Account name" type="search" /></label>
          <label>Territory<select defaultValue={filters.territoryId ?? ""} name="customer_territory"><option value="">All territories</option>{territoryOptions.map((territory) => <option key={territory.id} value={territory.id}>{territory.name}</option>)}</select></label>
          <label>Sales Agency<select defaultValue={filters.agencyId ?? ""} name="customer_agency"><option value="">All sales agencies</option>{salesAgencyOptions.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}</select></label>
          <label>Account Type<select defaultValue={filters.accountTypeId ?? ""} name="customer_account_type"><option value="">All account types</option>{accountTypeOptions.map((accountType) => <option key={accountType.id} value={accountType.id}>{accountType.name}</option>)}</select></label>
          <label>Account Status<select defaultValue={filters.status ?? ""} name="customer_status"><option value="">All current statuses</option>{accountStatusOptions.map((status) => <option key={status.id} value={status.id}>{status.name}</option>)}</select></label>
        </div>
        <div className="advanced-filter-actions"><button className="primary-action" type="submit">Apply Filters</button><Link className="secondary-action secondary-action--light" href={isObsoleteList ? "/?module=obsolete-customers" : "/"}>Clear Filters</Link></div>
      </form> : null}

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
