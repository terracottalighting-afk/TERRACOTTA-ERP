import Link from "next/link";

import { InvoiceTermsAndFreightFields } from "@/components/financial/invoice-terms-and-freight-fields";
import { money } from "@/lib/formatters";

type InvoiceQueuePackingList = {
  allocated_freight_cost: number;
  brandSummaries: {
    brand_id: string;
    brand_name: string;
    subtotal_amount: number;
  }[];
  customer_name: string;
  customer_po_number_snapshot: string;
  dropship_fee_amount: number;
  id: string;
  invoiceFreightCharge: number;
  packing_list_number: string;
  payment_days: number;
  payment_terms: string;
  ship_date: string | null;
  shipping_fee: number;
  freightTerm: string;
  is_dropship: boolean;
  commission: {
    agencyName: string | null;
    defaultPayable: boolean;
    defaultPercent: number | null;
    eligible: boolean;
    territoryLabel: string | null;
    unavailableReason: string | null;
  };
};

export async function InvoiceCreatePage({
  error,
  loadPackingLists,
  packingListId,
  saveAction,
}: {
  error?: string;
  loadPackingLists: () => Promise<InvoiceQueuePackingList[]>;
  packingListId?: string;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  const packingLists = await loadPackingLists();
  const packingList = packingLists.find((item) => item.id === packingListId);
  if (!packingList) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">
          This packing list is not available for invoice creation.
        </div>
        <Link className="secondary-action" href="/?module=invoices">
          Back to Invoice Work Queue
        </Link>
      </section>
    );
  }
  const multipleBrands = packingList.brandSummaries.length > 1;
  const hasDropshipFee = Number(packingList.dropship_fee_amount ?? 0) > 0;

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href="/?module=invoices">
            Invoice Work Queue
          </Link>
          <div className="record-title-row">
            <h2>Invoice Setup</h2>
          </div>
          <p>
            {packingList.packing_list_number} / {packingList.customer_name} /
            Customer PO {packingList.customer_po_number_snapshot}
          </p>
        </div>
      </section>
      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      <form action={saveAction} className="customer-form">
        <input name="packing_list_id" type="hidden" value={packingList.id} />
        <fieldset>
          <legend>Invoice Date</legend>
          <div className="form-grid">
            <label>
              Invoice Date
              <input
                defaultValue={new Date().toISOString().slice(0, 10)}
                name="invoice_date"
                required
                type="date"
              />
            </label>
          </div>
        </fieldset>
        <InvoiceTermsAndFreightFields
          actualFreightCost={Number(packingList.allocated_freight_cost ?? 0)}
          defaultCustomerFreightCharge={Number(packingList.invoiceFreightCharge ?? 0)}
          defaultPaymentDays={Number(packingList.payment_days ?? 0)}
          defaultPaymentTerms={
            packingList.payment_terms ?? "Prepaid / No Credit"
          }
          shipDate={packingList.ship_date}
        />
        <fieldset>
          <legend>Commission</legend>
          {packingList.commission.eligible ? (
            <>
              <p className="fieldset-note">
                {packingList.commission.territoryLabel} maps to {" "}
                <strong>{packingList.commission.agencyName}</strong>. The agency
                is the commission payee; an assigned sales rep is recorded as a
                territory note only.
              </p>
              <div className="table-wrap">
                <table className="editable-table">
                  <thead>
                    <tr>
                      <th>Brand Invoice</th>
                      <th>Commission Payable</th>
                      <th>Commission Rate (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packingList.brandSummaries.map((brand) => (
                      <tr key={brand.brand_id}>
                        <td>{brand.brand_name}</td>
                        <td>
                          <label className="inline-checkbox">
                            <input
                              defaultChecked={packingList.commission.defaultPayable}
                              name={`commission_payable_${brand.brand_id}`}
                              type="checkbox"
                            />
                            Pay commission
                          </label>
                        </td>
                        <td>
                          <input
                            defaultValue={packingList.commission.defaultPercent ?? 0}
                            max={100}
                            min={0}
                            name={`commission_rate_${brand.brand_id}`}
                            step="0.01"
                            type="number"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="form-grid">
                {packingList.brandSummaries.map((brand) => (
                  <label className="full-width-field" key={brand.brand_id}>
                    {brand.brand_name} commission decision-change note
                    <textarea
                      name={`commission_change_reason_${brand.brand_id}`}
                      placeholder="Required only when changing the Pay commission decision from the original order"
                      rows={2}
                    />
                  </label>
                ))}
              </div>
            </>
          ) : (
            <p className="fieldset-note">
              No commission will be created. {packingList.commission.unavailableReason}
            </p>
          )}
        </fieldset>
        <fieldset>
          <legend>Brand Invoice Allocation</legend>
          {multipleBrands ? (
            <p className="fieldset-note">
              Freight and drop-ship charges must be manually allocated across
              the brand invoices. Tax is entered manually for each brand
              invoice.
            </p>
          ) : (
            <p className="fieldset-note">
              One invoice will be created for this brand. Freight is taken from
              the packing list; enter tax manually if applicable.
            </p>
          )}
          <div className="table-wrap">
            <table className="editable-table">
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Shipped Product Total</th>
                  <th>Freight</th>
                {hasDropshipFee ? <th>Drop-ship Fee</th> : null}
                  <th>Tax</th>
                </tr>
              </thead>
              <tbody>
                {packingList.brandSummaries.map((brand) => (
                  <tr key={brand.brand_id}>
                    <td>
                      {brand.brand_name}
                      <input
                        name="brand_id"
                        type="hidden"
                        value={brand.brand_id}
                      />
                    </td>
                    <td>{money(brand.subtotal_amount)}</td>
                    {hasDropshipFee ? <td>
                      {multipleBrands ? (
                        <input
                          defaultValue={0}
                          min={0}
                          name={`freight_${brand.brand_id}`}
                          step="0.01"
                          type="number"
                        />
                      ) : (
                        <>
                          Uses customer freight charge
                          <input
                            name={`freight_${brand.brand_id}`}
                            type="hidden"
                            value={packingList.invoiceFreightCharge ?? 0}
                          />
                        </>
                      )}
                    </td> : <input name={`dropship_${brand.brand_id}`} type="hidden" value={0} />}
                    <td>
                      {multipleBrands ? (
                        <input
                          defaultValue={0}
                          min={0}
                          name={`dropship_${brand.brand_id}`}
                          step="0.01"
                          type="number"
                        />
                      ) : (
                        <>
                          {money(Number(packingList.dropship_fee_amount ?? 0))}
                          <input
                            name={`dropship_${brand.brand_id}`}
                            type="hidden"
                            value={packingList.dropship_fee_amount ?? 0}
                          />
                        </>
                      )}
                    </td>
                    <td>
                      <input
                        defaultValue={0}
                        min={0}
                        name={`tax_${brand.brand_id}`}
                        step="0.01"
                        type="number"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>
        <div className="form-actions">
          <button type="submit">Continue to Invoice Confirmation</button>
          <Link
            className="secondary-action secondary-action--light"
            href="/?module=invoices"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
