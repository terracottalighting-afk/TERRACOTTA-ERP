"use client";

import Link from "next/link";
import { useState } from "react";

import { StatusBadge } from "@/components/ui";

type AccountType = {
  id: string;
  name: string;
};

type CoveredCustomer = {
  accountNumber: string;
  accountTypeId: string;
  id: string;
  name: string;
  status: string;
  territoryNames: string[];
};

export function AgencyCustomersDashboard({
  accountTypes,
  customers,
}: {
  accountTypes: AccountType[];
  customers: CoveredCustomer[];
}) {
  const [selectedAccountTypeId, setSelectedAccountTypeId] = useState(
    accountTypes[0]?.id ?? "",
  );

  if (!accountTypes.length) {
    return <p className="fieldset-note">No customer account types are available.</p>;
  }

  const activeAccountTypeId = accountTypes.some(
    (accountType) => accountType.id === selectedAccountTypeId,
  )
    ? selectedAccountTypeId
    : accountTypes[0].id;

  const visibleCustomers = customers.filter(
    (customer) => customer.accountTypeId === activeAccountTypeId,
  );

  return (
    <>
      <div
        aria-label="Customer account types"
        className="metric-grid agency-customer-type-tabs"
        role="tablist"
      >
        {accountTypes.map((accountType) => {
          const customerCount = customers.filter(
            (customer) => customer.accountTypeId === accountType.id,
          ).length;
          const isActive = accountType.id === activeAccountTypeId;

          return (
            <button
              aria-selected={isActive}
              className={`metric agency-customer-type-tab${isActive ? " agency-customer-type-tab--active" : ""}`}
              key={accountType.id}
              onClick={() => setSelectedAccountTypeId(accountType.id)}
              role="tab"
              type="button"
            >
              <span>{accountType.name}</span>
              <strong>{customerCount}</strong>
            </button>
          );
        })}
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Account No.</th>
              <th>Covered Territories</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <Link className="record-link" href={`/?customer=${customer.id}`}>
                    {customer.name}
                  </Link>
                </td>
                <td>{customer.accountNumber}</td>
                <td>{customer.territoryNames.join(", ") || "Not set"}</td>
                <td>
                  <StatusBadge
                    tone={customer.status === "active" ? "good" : "warn"}
                    value={customer.status}
                  />
                </td>
              </tr>
            ))}
            {!visibleCustomers.length ? (
              <tr>
                <td colSpan={4}>No customers of this account type are covered by this agency.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
