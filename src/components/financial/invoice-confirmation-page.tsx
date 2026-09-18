import Link from "next/link";
import { Fragment } from "react";

import { dateLabel, money } from "@/lib/formatters";

type InvoiceAllocationMap = Record<string, number>;
type CommissionOverride = { payable: boolean; percent: number | null };

type InvoiceQueuePackingList = {
  brandSummaries: {
    brand_id: string;
    brand_name: string;
    subtotal_amount: number;
  }[];
  customer_name: string;
  customer_po_number_snapshot: string;
  id: string;
  packing_list_number: string;
  ship_date: string | null;
  commission: {
    agencyName: string | null;
    defaultPercent: number | null;
    eligible: boolean;
    territoryLabel: string | null;
    unavailableReason: string | null;
  };
};

export async function InvoiceConfirmationPage({
  customerFreightCharge,
  commissionOverrides: rawCommissionOverrides,
  commissionOverrideReasons,
  dropshipAllocations: rawDropshipAllocations,
  freightAllocations: rawFreightAllocations,
  invoiceDate,
  invoiceDueDate,
  loadPackingLists,
  packingListId,
  parseInvoiceAllocations,
  paymentDays: rawPaymentDays,
  paymentTerms,
  saveAction,
  taxAllocations: rawTaxAllocations,
}: {
  customerFreightCharge?: string;
  commissionOverrides?: string;
  commissionOverrideReasons?: string;
  dropshipAllocations?: string;
  freightAllocations?: string;
  invoiceDate?: string;
  invoiceDueDate: (
    shipDate: string | null,
    paymentDays: number,
    invoiceDate: string,
  ) => string;
  loadPackingLists: () => Promise<InvoiceQueuePackingList[]>;
  packingListId?: string;
  parseInvoiceAllocations: (
    value: string | undefined,
  ) => InvoiceAllocationMap | null;
  paymentDays?: string;
  paymentTerms?: string;
  saveAction: (formData: FormData) => void | Promise<void>;
  taxAllocations?: string;
}) {
  const packingLists = await loadPackingLists();
  const packingList = packingLists.find((item) => item.id === packingListId);
  const paymentDays = Number(rawPaymentDays);
  const freightCharge = Number(customerFreightCharge);
  const freightAllocations = parseInvoiceAllocations(rawFreightAllocations);
  const dropshipAllocations = parseInvoiceAllocations(rawDropshipAllocations);
  const taxAllocations = parseInvoiceAllocations(rawTaxAllocations);
  let commissionOverrides: Record<string, CommissionOverride> | null = null;
  try {
    const parsed = JSON.parse(rawCommissionOverrides || "{}");
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      commissionOverrides = Object.fromEntries(
        Object.entries(parsed).map(([brandId, value]) => {
          const override = value as { payable?: unknown; percent?: unknown };
          const percent =
            override.percent === null || override.percent === undefined
              ? null
              : Number(override.percent);
          return [brandId, { payable: override.payable === true, percent }];
        }),
      );
    }
  } catch {
    commissionOverrides = null;
  }
  const setupUrl = `/?module=invoice-create&packing_list=${packingListId}`;
  if (
    !packingList ||
    !Number.isInteger(paymentDays) ||
    paymentDays < 0 ||
    !Number.isFinite(freightCharge) ||
    freightCharge < 0 ||
    !freightAllocations ||
    !dropshipAllocations ||
    !taxAllocations ||
    !commissionOverrides
  ) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">
          The invoice setup could not be confirmed. Return to invoice setup and
          try again.
        </div>
        <Link className="secondary-action" href={setupUrl}>
          Back to Invoice Setup
        </Link>
      </section>
    );
  }

  const dueDate = invoiceDueDate(
    packingList.ship_date,
    paymentDays,
    invoiceDate || new Date().toISOString().slice(0, 10),
  );
  const multipleBrands = packingList.brandSummaries.length > 1;
  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={setupUrl}>
            Back to Invoice Setup
          </Link>
          <div className="record-title-row">
            <h2>Confirm Brand-specific Invoice{multipleBrands ? "s" : ""}</h2>
          </div>
          <p>
            {packingList.packing_list_number} / {packingList.customer_name} /
            Customer PO {packingList.customer_po_number_snapshot}
          </p>
        </div>
      </section>
      <section className="invoice-confirmation-summary">
        <div>
          <span>Shipment Date</span>
          <strong>{dateLabel(packingList.ship_date)}</strong>
        </div>
        <div>
          <span>Payment Terms</span>
          <strong>{paymentTerms || "Upon Receipt"}</strong>
        </div>
        <div>
          <span>Invoice Due Date</span>
          <strong>{dateLabel(dueDate)}</strong>
        </div>
        <div>
          <span>Customer Freight Charge</span>
          <strong>{money(freightCharge)}</strong>
        </div>
        <p className="fieldset-note">
          Every brand-specific invoice from this shipment will use the same due
          date. To change freight, tax, payment terms, or any allocation, return
          to Invoice Setup.
        </p>
      </section>
      <section className="invoice-confirmation-review">
        <h3>Brand Invoice Review</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Shipped Product Total</th>
                <th>Freight</th>
                <th>Drop-ship Fee</th>
              <th>Tax</th>
              <th>Commission</th>
              <th>Invoice Total</th>
              </tr>
            </thead>
            <tbody>
              {packingList.brandSummaries.map((brand) => {
                const freight = Number(freightAllocations[brand.brand_id] ?? 0);
                const dropship = Number(
                  dropshipAllocations[brand.brand_id] ?? 0,
                );
                const tax = Number(taxAllocations[brand.brand_id] ?? 0);
                const commission = commissionOverrides[brand.brand_id];
                const paysCommission =
                  packingList.commission.eligible && commission?.payable;
                return (
                  <tr key={brand.brand_id}>
                    <td>{brand.brand_name}</td>
                    <td>{money(brand.subtotal_amount)}</td>
                    <td>{money(freight)}</td>
                    <td>{money(dropship)}</td>
                    <td>{money(tax)}</td>
                    <td>
                      {paysCommission
                        ? `${packingList.commission.agencyName} at ${commission.percent ?? packingList.commission.defaultPercent ?? 0}%`
                        : "No commission"}
                    </td>
                    <td>
                      {money(brand.subtotal_amount + freight + dropship + tax)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <form action={saveAction} className="form-actions">
        <input name="packing_list_id" type="hidden" value={packingList.id} />
        <input
          name="invoice_date"
          type="hidden"
          value={invoiceDate || new Date().toISOString().slice(0, 10)}
        />
        <input
          name="payment_terms"
          type="hidden"
          value={paymentTerms || "Upon Receipt"}
        />
        <input name="payment_days" type="hidden" value={paymentDays} />
        <input
          name="customer_freight_charge"
          type="hidden"
          value={freightCharge}
        />
        <input
          name="commission_overrides"
          type="hidden"
          value={JSON.stringify(commissionOverrides)}
        />
        <input
          name="commission_override_reasons"
          type="hidden"
          value={commissionOverrideReasons || "{}"}
        />
        {packingList.brandSummaries.map((brand) => (
          <Fragment key={brand.brand_id}>
            <input name="brand_id" type="hidden" value={brand.brand_id} />
            <input
              name={`freight_${brand.brand_id}`}
              type="hidden"
              value={freightAllocations[brand.brand_id] ?? 0}
            />
            <input
              name={`dropship_${brand.brand_id}`}
              type="hidden"
              value={dropshipAllocations[brand.brand_id] ?? 0}
            />
            <input
              name={`tax_${brand.brand_id}`}
              type="hidden"
              value={taxAllocations[brand.brand_id] ?? 0}
            />
          </Fragment>
        ))}
        <button className="primary-action" type="submit">
          Create Brand-specific Invoice{multipleBrands ? "s" : ""}
        </button>
        <Link
          className="secondary-action secondary-action--light"
          href={setupUrl}
        >
          Back to Invoice Setup
        </Link>
      </form>
    </section>
  );
}
