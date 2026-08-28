import Link from "next/link";

import { ModulePlaceholder } from "@/components/ui";
import { dateLabel, money } from "@/lib/formatters";

type CreatedInvoice = {
  brand_name_snapshot: string;
  customer_name_snapshot: string;
  due_date: string | null;
  freight_amount: number;
  id: string;
  invoice_date: string;
  invoice_number: string;
  total_amount: number | null;
};

export async function InvoiceCreatedPage({
  invoiceIds,
  loadInvoices,
}: {
  invoiceIds?: string;
  loadInvoices: (invoiceIds: string[]) => Promise<CreatedInvoice[]>;
}) {
  const ids = (invoiceIds ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (ids.length === 0) {
    return <ModulePlaceholder moduleName="Invoices not found" />;
  }

  const invoices = await loadInvoices(ids);
  if (invoices.length === 0) {
    return <ModulePlaceholder moduleName="Invoices not found" />;
  }

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href="/?module=invoices">
            Back to Invoice Work Queue
          </Link>
          <div className="record-title-row">
            <h2>Brand-specific Invoices Created</h2>
          </div>
          <p>{invoices[0].customer_name_snapshot}</p>
        </div>
      </section>
      <div className="success-banner">
        {invoices.length} brand-specific invoice
        {invoices.length === 1 ? "" : "s"} created successfully.
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Invoice No.</th>
              <th>Brand</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Freight</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <Link
                    className="text-action"
                    href={`/?module=invoice-document&invoice=${invoice.id}`}
                  >
                    {invoice.invoice_number}
                  </Link>
                </td>
                <td>{invoice.brand_name_snapshot}</td>
                <td>{dateLabel(invoice.invoice_date)}</td>
                <td>{dateLabel(invoice.due_date)}</td>
                <td>{money(Number(invoice.freight_amount))}</td>
                <td>{money(Number(invoice.total_amount))}</td>
                <td>
                  <Link
                    className="text-action"
                    href={`/?module=invoice-document&invoice=${invoice.id}`}
                  >
                    View / Download / Email
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
