"use client";

import Link from "next/link";
import { Fragment, useState } from "react";

import { StatusBadge } from "@/components/ui";

type AccountType = {
  id: string;
  name: string;
};

type CoveredCustomer = {
  accountNumber: string;
  accountTypeId: string;
  id: string;
  locations: CoveredLocation[];
  name: string;
  status: string;
};

type CoveredLocation = {
  city: string | null;
  id: string;
  locationName: string;
  postalCode: string | null;
  stateProvince: string | null;
  territoryLabel: string;
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
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);

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
              <th>Locations</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleCustomers.map((customer) => {
              const isExpanded = customer.id === expandedCustomerId;

              return (
                <Fragment key={customer.id}>
                  <tr
                    className="agency-customer-row"
                    onClick={() =>
                      setExpandedCustomerId(isExpanded ? null : customer.id)
                    }
                  >
                    <td>
                      <button
                        aria-expanded={isExpanded}
                        className="agency-customer-row-toggle"
                        onClick={(event) => {
                          event.stopPropagation();
                          setExpandedCustomerId(isExpanded ? null : customer.id);
                        }}
                        type="button"
                      >
                        <span aria-hidden="true">{isExpanded ? "-" : "+"}</span>
                        {customer.name}
                      </button>
                    </td>
                    <td>{customer.accountNumber}</td>
                    <td>{customer.locations.length}</td>
                    <td>
                      <StatusBadge
                        tone={customer.status === "active" ? "good" : "warn"}
                        value={customer.status}
                      />
                    </td>
                  </tr>
                  {isExpanded ? (
                    <tr className="agency-customer-locations">
                      <td colSpan={4}>
                        <div className="agency-customer-locations__header">
                          <strong>Covered Locations</strong>
                          <Link
                            className="text-action"
                            href={`/?customer=${customer.id}`}
                          >
                            View Account
                          </Link>
                        </div>
                        <div className="compact-list">
                          {customer.locations.map((location) => (
                            <Link
                              className="compact-row agency-customer-location"
                              href={`/?module=view-location&customer=${customer.id}&location=${location.id}`}
                              key={location.id}
                            >
                              <div>
                                <strong>{location.locationName}</strong>
                                <span>
                                  {[location.city, location.stateProvince, location.postalCode]
                                    .filter(Boolean)
                                    .join(", ") || "Address not set"}
                                </span>
                              </div>
                              <span>{location.territoryLabel}</span>
                            </Link>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
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
