import Link from "next/link";

import { EmptyState, ModulePlaceholder, StatusBadge } from "@/components/ui";
import { dateLabel, label, money, timestampLabel } from "@/lib/formatters";

type PaymentDetail = {
  applications: {
    amount_applied: number | null;
    applied_date: string;
    customer_invoice_id: string;
    id: string;
    line_waive_amount: number | null;
  }[];
  customer: {
    id: string;
    name: string;
  } | null;
  documents: {
    category: string | null;
    downloadUrl: string | null;
    id: string;
    original_file_name: string;
    uploaded_at: string;
  }[];
  invoices: {
    balance_due: number | null;
    brand_name_snapshot: string;
    id: string;
    invoice_date: string;
    invoice_number: string;
  }[];
  payment: {
    amount_applied: number | null;
    amount_received: number | null;
    amount_unapplied: number | null;
    created_at: string;
    memo: string | null;
    payment_date: string;
    payment_method: string;
    payment_number: string;
    posted_at: string | null;
    reference_number: string | null;
    status: string;
  };
};

export async function PaymentDetailPage({
  loadPaymentDetail,
  paymentId,
}: {
  loadPaymentDetail: (paymentId: string) => Promise<PaymentDetail | null>;
  paymentId?: string;
}) {
  if (!paymentId) {
    return <ModulePlaceholder moduleName="Payment not found" />;
  }

  const detail = await loadPaymentDetail(paymentId);
  if (!detail) {
    return <ModulePlaceholder moduleName="Payment not found" />;
  }

  const { applications, customer, documents, invoices, payment } = detail;
  const invoiceById = new Map(
    invoices.map((invoice) => [invoice.id, invoice]),
  );

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href="/?module=invoices&financial_tab=payments"
          >
            Payment List
          </Link>
          <div className="record-title-row">
            <h2>Payment {payment.payment_number}</h2>
            <StatusBadge
              tone={
                payment.status === "fully_applied"
                  ? "good"
                  : payment.status === "voided"
                    ? "danger"
                    : "primary"
              }
              value={payment.status}
            />
          </div>
          <p>
            {customer ? (
              <Link
                className="context-parent-link"
                href={`/?customer=${customer.id}&tab=invoices`}
              >
                {customer.name}
              </Link>
            ) : (
              "Customer"
            )}
          </p>
        </div>
      </section>
      <section className="payment-invoice-summary">
        <div>
          <span>Payment Date</span>
          <strong>{dateLabel(payment.payment_date)}</strong>
        </div>
        <div>
          <span>Payment Method</span>
          <strong>{label(payment.payment_method)}</strong>
        </div>
        <div>
          <span>Received</span>
          <strong>{money(Number(payment.amount_received))}</strong>
        </div>
        <div>
          <span>Applied</span>
          <strong>{money(Number(payment.amount_applied))}</strong>
        </div>
        <div>
          <span>Unapplied</span>
          <strong>{money(Number(payment.amount_unapplied))}</strong>
        </div>
      </section>
      <section className="detail-section shipment-workspace-section">
        <article className="data-section">
          <div className="section-title">
            <h3>Payment Details</h3>
          </div>
          <dl className="record-details">
            <div>
              <dt>Reference No.</dt>
              <dd>{payment.reference_number || "Not set"}</dd>
            </div>
            <div>
              <dt>Recorded</dt>
              <dd>{timestampLabel(payment.posted_at ?? payment.created_at)}</dd>
            </div>
            <div>
              <dt>Memo</dt>
              <dd>{payment.memo || "None"}</dd>
            </div>
          </dl>
        </article>
        <article className="data-section">
          <div className="section-title">
            <h3>Supporting Documents</h3>
            <span>{documents.length}</span>
          </div>
          <div className="compact-list">
            {documents.length === 0 ? (
              <EmptyState text="No supporting documents were attached." />
            ) : (
              documents.map((document) => (
                <div className="compact-row" key={document.id}>
                  <div>
                    <strong>{document.original_file_name}</strong>
                    <span>
                      {label(document.category ?? "payment document")} |{" "}
                      {timestampLabel(document.uploaded_at)}
                    </span>
                  </div>
                  {document.downloadUrl ? (
                    <a className="text-action" href={document.downloadUrl}>
                      Download
                    </a>
                  ) : (
                    <span>Unavailable</span>
                  )}
                </div>
              ))
            )}
          </div>
        </article>
        <article className="data-section full-width-field">
          <div className="section-title">
            <h3>Applied Invoices</h3>
          </div>
          {applications.length === 0 ? (
            <EmptyState text="This payment has not been applied to an invoice." />
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Brand</th>
                    <th>Invoice Date</th>
                    <th>Applied Date</th>
                    <th>Payment Applied</th>
                    <th>Waived</th>
                    <th>Balance Due</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => {
                    const invoice = invoiceById.get(
                      application.customer_invoice_id,
                    );
                    return (
                      <tr key={application.id}>
                        <td>
                          {invoice ? (
                            <Link
                              className="table-link"
                              href={`/?module=invoice-document&invoice=${invoice.id}`}
                            >
                              {invoice.invoice_number}
                            </Link>
                          ) : (
                            "Unavailable"
                          )}
                        </td>
                        <td>{invoice?.brand_name_snapshot ?? "-"}</td>
                        <td>{dateLabel(invoice?.invoice_date)}</td>
                        <td>{dateLabel(application.applied_date)}</td>
                        <td>{money(Number(application.amount_applied))}</td>
                        <td>{money(Number(application.line_waive_amount))}</td>
                        <td>{money(Number(invoice?.balance_due ?? 0))}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </section>
  );
}
