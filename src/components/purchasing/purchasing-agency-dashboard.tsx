import Link from "next/link";
import { EmptyState, StatusBadge } from "@/components/ui";
import { dateLabel, money, numberFormatter } from "@/lib/formatters";

export type PurchasingAgencyDashboardData = {
  agency: { id: string; business_type: "shipping" | "customs_broker"; agency_name: string; address: string | null; contact_name: string | null; contact_email: string | null; contact_phone: string | null; bank_name: string | null; bank_swift_code: string | null; bank_ach_routing_number: string | null; bank_account_number: string | null };
  containers: { id: string; container_number: string; booking_number: string | null; vessel_name: string | null; loaded_date: string | null; eta: string | null; container_status: string; service_invoice_count: number }[];
  invoices: { id: string; erp_invoice_number: string; agency_invoice_number: string; container_id: string; container_number: string; booking_number: string | null; invoice_date: string; due_date: string; total_amount: number; invoice_status: "open" | "paid" }[];
};

const tabHref = (agencyId: string, tab: string) => `/?module=purchasing-agency&purchasing_agency=${agencyId}&agency_tab=${tab}`;

export function PurchasingAgencyDashboard({ dashboard, error, selectedTab }: { dashboard: PurchasingAgencyDashboardData | null; error?: string; selectedTab?: string }) {
  if (!dashboard) return <section className="dashboard-panel"><div className="form-alert">Agency was not found.</div><Link className="secondary-action secondary-action--light" href="/?module=purchasing">Back to Purchasing</Link></section>;
  const { agency } = dashboard;
  const tabs = ["profile", "containers", "invoices"];
  const activeTab = tabs.includes(selectedTab ?? "") ? selectedTab! : "profile";
  const agencyType = agency.business_type === "customs_broker" ? "Customs Broker Agency" : "Shipping Agency";
  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Purchasing Agency</span><h2>{agency.agency_name}</h2><p>{agencyType}</p></div><div className="form-actions"><Link className="text-action" href={`/?module=purchasing-agency&purchasing_agency=${agency.id}&agency_edit=1`}>Edit Agency</Link><Link className="secondary-action secondary-action--light" href="/?module=purchasing">Back to Purchasing</Link></div></section>{error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}<section className="tab-strip">{tabs.map((tab) => <Link className={activeTab === tab ? "active" : ""} href={tabHref(agency.id, tab)} key={tab}>{tab[0].toUpperCase() + tab.slice(1)}</Link>)}</section>{activeTab === "profile" ? <Profile agency={agency} /> : null}{activeTab === "containers" ? <Containers containers={dashboard.containers} /> : null}{activeTab === "invoices" ? <Invoices invoices={dashboard.invoices} /> : null}</section>;
}

function Profile({ agency }: { agency: PurchasingAgencyDashboardData["agency"] }) {
  return <section className="detail-grid"><article className="info-panel"><div className="section-title"><h3>Agency Details and Contacts</h3></div><dl><div><dt>Business Type</dt><dd>{agency.business_type === "customs_broker" ? "Customs Broker Agency" : "Shipping Agency"}</dd></div><div><dt>Agency Name</dt><dd>{agency.agency_name}</dd></div><div><dt>Address</dt><dd className="preserve-lines">{agency.address || "Not set"}</dd></div><div><dt>Contact</dt><dd>{agency.contact_name || "Not set"}<br />{agency.contact_email || "Not set"}<br />{agency.contact_phone || "Not set"}</dd></div></dl></article><article className="info-panel"><div className="section-title"><h3>Bank Payment Information</h3></div><dl><div><dt>Bank Name</dt><dd>{agency.bank_name || "Not set"}</dd></div><div><dt>Bank SWIFT Code</dt><dd>{agency.bank_swift_code || "Not set"}</dd></div><div><dt>ACH Routing Number</dt><dd>{agency.bank_ach_routing_number || "Not set"}</dd></div><div><dt>Bank Account Number</dt><dd>{agency.bank_account_number || "Not set"}</dd></div></dl></article></section>;
}

function Containers({ containers }: { containers: PurchasingAgencyDashboardData["containers"] }) {
  return <article className="data-section"><div className="section-title"><h3>Containers</h3><span>{containers.length}</span></div>{containers.length ? <div className="table-wrap"><table><thead><tr><th>Container Number</th><th>Booking Number</th><th>Vessel</th><th>Loaded Date</th><th>Expected Arrival</th><th>Service Invoices</th><th>Status</th></tr></thead><tbody>{containers.map((container) => <tr key={container.id}><td><Link className="text-action" href={`/?module=container-detail&container=${container.id}`}>{container.container_number}</Link></td><td>{container.booking_number || "Not set"}</td><td>{container.vessel_name || "Not set"}</td><td>{dateLabel(container.loaded_date)}</td><td>{dateLabel(container.eta)}</td><td>{numberFormatter.format(container.service_invoice_count)}</td><td><StatusBadge tone="neutral" value={container.container_status.replaceAll("_", " ")} /></td></tr>)}</tbody></table></div> : <EmptyState text="No containers are assigned to this agency." />}</article>;
}

function Invoices({ invoices }: { invoices: PurchasingAgencyDashboardData["invoices"] }) {
  return <article className="data-section"><div className="section-title"><h3>Invoices</h3><span>{invoices.length}</span></div>{invoices.length ? <div className="table-wrap"><table><thead><tr><th>No.</th><th>Invoice Number</th><th>Container Number</th><th>Booking Number</th><th>Invoice Date</th><th>Due Date</th><th>Total Amount</th><th>Status</th></tr></thead><tbody>{invoices.map((invoice, index) => <tr key={invoice.id}><td>{numberFormatter.format(index + 1)}</td><td><Link className="text-action" href={`/?module=service-invoice&service_invoice=${invoice.id}`}>{invoice.erp_invoice_number}</Link><br /><small>Provided: {invoice.agency_invoice_number}</small></td><td><Link className="text-action" href={`/?module=container-detail&container=${invoice.container_id}`}>{invoice.container_number}</Link></td><td>{invoice.booking_number || "Not set"}</td><td>{dateLabel(invoice.invoice_date)}</td><td>{dateLabel(invoice.due_date)}</td><td>{money(invoice.total_amount)}</td><td><StatusBadge tone={invoice.invoice_status === "paid" ? "good" : "neutral"} value={invoice.invoice_status} /></td></tr>)}</tbody></table></div> : <EmptyState text="No service invoices have been saved for this agency." />}</article>;
}
