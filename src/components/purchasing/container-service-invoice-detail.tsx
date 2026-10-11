"use client";

import { useState } from "react";
import { dateLabel, money } from "@/lib/formatters";

type ServiceInvoice = {
  id: string;
  import_container_id: string;
  service_type: "shipping_agency" | "tariff_broker";
  agency_name_snapshot: string;
  erp_invoice_number: string;
  agency_invoice_number: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  container_number_snapshot: string;
  booking_number_snapshot: string | null;
  vessel_name_snapshot: string | null;
  container_status: string | null;
  payment_bank_name: string | null;
  payment_bank_swift_code: string | null;
  payment_bank_ach_routing_number: string | null;
  payment_bank_account_number: string | null;
  invoice_status: "open" | "paid";
  paid_date: string | null;
  paid_amount: number | null;
  payment_method: string | null;
  payment_reference: string | null;
  payment_notes: string | null;
};

export function ContainerServiceInvoiceDetail({ error, invoice, payAction }: { error?: string; invoice: ServiceInvoice | null; payAction: (formData: FormData) => void | Promise<void> }) {
  const [isPaying, setIsPaying] = useState(false);
  if (!invoice) return <section className="dashboard-panel"><div className="form-alert">Service invoice was not found.</div><a className="secondary-action secondary-action--light" href="/?module=purchasing">Back to Purchasing</a></section>;
  const isShipping = invoice.service_type === "shipping_agency";
  const serviceLabel = isShipping ? "Shipping Agency" : "Tariff Broker";
  const detailUrl = `/?module=service-invoice&service_invoice=${invoice.id}`;
  return <section className="dashboard-panel"><section className="form-header"><div><span className="eyebrow">Container Service Invoice</span><h2>{invoice.erp_invoice_number}</h2><p>{serviceLabel} invoice for container <a className="text-action" href={`/?module=container-detail&container=${invoice.import_container_id}`}>{invoice.container_number_snapshot}</a>.</p></div><div className="form-actions">{invoice.invoice_status === "open" && !isPaying ? <button className="secondary-action" onClick={() => setIsPaying(true)} type="button">Make Payment</button> : null}{invoice.invoice_status === "open" && !isPaying ? <a className="primary-action" href={`/?module=container-service-invoice&container=${invoice.import_container_id}&service_invoice_type=${invoice.service_type}&service_invoice=${invoice.id}`}>Edit Invoice</a> : null}<a className="secondary-action secondary-action--light" href={`/?module=container-detail&container=${invoice.import_container_id}&container_tab=service_invoices`}>Back to Service Invoices</a></div></section>{error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}<section className="container-arrival-callout invoice-status-callout"><span>Invoice Status</span><strong className={`container-status-highlight ${invoice.invoice_status === "paid" ? "container-status-highlight--delivered" : "container-status-highlight--active"}`}>{invoice.invoice_status === "paid" ? "Paid" : "Open"}</strong></section>{isPaying ? <form action={payAction} className="customer-form"><input name="service_invoice_id" type="hidden" value={invoice.id} /><fieldset><legend>Payment Information</legend><div className="form-grid"><label>Total Invoice Amount<input disabled value={money(invoice.total_amount)} /></label><label>Paid Date<input defaultValue={new Date().toISOString().slice(0, 10)} name="paid_date" required type="date" /></label><label>Paid Amount<input defaultValue={invoice.total_amount} min="0" name="paid_amount" required step="0.01" type="number" /></label><label>Payment Method<select defaultValue="wire" name="payment_method"><option value="wire">Wire</option><option value="ach">ACH</option><option value="check">Check</option><option value="zelle">Zelle</option></select></label><label>Payment Reference<input name="payment_reference" placeholder="Check, wire, or transaction reference" /></label><label>Payment Notes<textarea name="payment_notes" /></label></div></fieldset><div className="form-actions"><button className="primary-action" type="submit">Mark as Paid</button><button className="secondary-action secondary-action--light" onClick={() => setIsPaying(false)} type="button">Cancel</button></div></form> : null}<section className="detail-grid"><article className="info-panel"><div className="section-title"><h3>Service Invoice Details</h3></div><dl><div><dt>ERP Invoice ID</dt><dd>{invoice.erp_invoice_number}</dd></div><div><dt>Total Amount</dt><dd><strong>{money(invoice.total_amount)}</strong></dd></div><div><dt>{serviceLabel} Name</dt><dd>{invoice.agency_name_snapshot}</dd></div><div><dt>Provided Invoice Number</dt><dd>{invoice.agency_invoice_number}</dd></div><div><dt>Invoice Date</dt><dd>{dateLabel(invoice.invoice_date)}</dd></div><div><dt>Due Date</dt><dd>{dateLabel(invoice.due_date)}</dd></div></dl></article><article className="info-panel"><div className="section-title"><h3>Container Booking Details</h3></div><dl><div><dt>Container Number</dt><dd><a className="text-action" href={`/?module=container-detail&container=${invoice.import_container_id}`}>{invoice.container_number_snapshot}</a></dd></div><div><dt>Container Status</dt><dd>{invoice.container_status ? invoice.container_status.replaceAll("_", " ") : "Not set"}</dd></div>{isShipping ? <><div><dt>Sea Freight Booking</dt><dd>{invoice.booking_number_snapshot || "Not set"}</dd></div><div><dt>Vessel</dt><dd>{invoice.vessel_name_snapshot || "Not set"}</dd></div></> : null}</dl></article></section><section className="detail-grid"><article className="info-panel"><div className="section-title"><h3>Payment Information</h3></div><dl><div><dt>Status</dt><dd>{invoice.invoice_status === "paid" ? "Paid" : "Open"}</dd></div><div><dt>Paid Date</dt><dd>{dateLabel(invoice.paid_date)}</dd></div><div><dt>Paid Amount</dt><dd>{invoice.paid_amount === null ? "Not set" : money(invoice.paid_amount)}</dd></div><div><dt>Payment Method</dt><dd>{invoice.payment_method || "Not set"}</dd></div><div><dt>Payment Reference</dt><dd>{invoice.payment_reference || "Not set"}</dd></div><div><dt>Payment Notes</dt><dd className="preserve-lines">{invoice.payment_notes || "Not set"}</dd></div></dl></article><article className="info-panel"><div className="section-title"><h3>Payment Bank Information</h3></div><dl><div><dt>Bank Name</dt><dd>{invoice.payment_bank_name || "Not set"}</dd></div><div><dt>Bank SWIFT Code</dt><dd>{invoice.payment_bank_swift_code || "Not set"}</dd></div><div><dt>ACH Routing Number</dt><dd>{invoice.payment_bank_ach_routing_number || "Not set"}</dd></div><div><dt>Bank Account Number</dt><dd>{invoice.payment_bank_account_number || "Not set"}</dd></div></dl></article></section></section>;
}
