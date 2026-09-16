import Link from "next/link";

import { ContactRoleBadges } from "@/components/customers/contact-role-badges";
import {
  EmptyState,
  Metric,
  ModulePlaceholder,
  StatusBadge,
} from "@/components/ui";
import { dateLabel, label, money, numberFormatter } from "@/lib/formatters";

type CustomerName = {
  name: string;
};

type CustomerLocation = {
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  country: string;
  id: string;
  is_billing_address?: boolean;
  is_default_ship_to: boolean;
  is_shipping_address: boolean;
  is_showroom: boolean;
  location_code: string | null;
  location_name: string;
  location_type: string;
  postal_code: string | null;
  state_province: string | null;
  status: string;
};

type LocationTerritory = {
  name: string;
  territory_code: string;
};

type PrimaryShowroomEnrollment = {
  current_display_count?: number;
  discount_percent?: number;
  enrollment_date?: string;
  expiration_date?: string | null;
  free_freight_threshold?: number | null;
  pending_renew_date?: string | null;
  program_status: string;
  required_display_count?: number;
  showroom_notification_email?: string | null;
};

type CustomerContact = {
  department: string | null;
  email: string | null;
  fax?: string | null;
  id: string;
  is_active?: boolean;
  is_billing_contact: boolean;
  is_primary: boolean;
  is_purchasing_contact: boolean;
  is_showroom_floor_sales?: boolean;
  is_showroom_manager?: boolean;
  is_warehouse_receiver?: boolean;
  mobile?: string | null;
  name: string;
  phone?: string | null;
  title: string | null;
};

type SalesOrder = {
  credit_hold_status: string;
  customer_po_number: string;
  id: string;
  order_date: string;
  order_source: string;
  order_type: string;
  sales_order_number: string;
  status: string;
  total_amount: number;
};

type CustomerInvoice = {
  balance_due: number;
  brand_name_snapshot: string;
  id: string;
  invoice_date: string;
  invoice_number: string;
  invoice_status: string;
};

type PackingList = {
  customer_po_number_snapshot: string;
  id: string;
  packing_list_number: string;
  ship_date: string | null;
  status: string;
};

type Rga = {
  id: string;
  request_date: string;
  requested_resolution_type: string;
  rga_number: string;
  status: string;
};

type ShowroomDisplay = {
  counts_toward_primary_showroom: boolean;
  display_shipped_date_snapshot: string | null;
  display_status: string;
  id: string;
  product_name_snapshot: string | null;
  sku_snapshot: string;
};

type LocationDashboard = {
  contacts: CustomerContact[];
  coverage: {
    salesRepAgencyName: string | null;
    salesRepName: string | null;
  };
  displays: ShowroomDisplay[];
  freightLevel: { levelName: string; freeFreightAllowance: number; freightRatePercent: number } | null;
  invoices: CustomerInvoice[];
  location: CustomerLocation;
  orders: SalesOrder[];
  packingLists: PackingList[];
  primaryShowroom: PrimaryShowroomEnrollment | null;
  rgas: Rga[];
  territory: LocationTerritory | null;
};

type LocationTab =
  | "profile"
  | "contacts"
  | "orders"
  | "shipments"
  | "rga"
  | "invoices"
  | "primary-showroom";

export async function LocationInfoPage({
  customerId,
  locationId,
  loadCustomer,
  loadLocationDashboard,
  selectedTab,
}: {
  customerId?: string;
  locationId?: string;
  loadCustomer: (customerId: string) => Promise<CustomerName>;
  loadLocationDashboard: (
    customerId: string,
    locationId: string,
  ) => Promise<LocationDashboard>;
  selectedTab?: string;
}) {
  if (!customerId || !locationId) {
    return (
      <ModulePlaceholder moduleName="Location page requires a selected customer and location" />
    );
  }

  const [customer, dashboard] = await Promise.all([
    loadCustomer(customerId),
    loadLocationDashboard(customerId, locationId),
  ]);
  const {
    contacts,
    coverage,
    displays,
    freightLevel,
    invoices,
    location,
    orders,
    packingLists,
    primaryShowroom,
    rgas,
    territory,
  } = dashboard;
  const locationTabs: { key: LocationTab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "contacts", label: "Contacts" },
    { key: "orders", label: "Orders" },
    { key: "shipments", label: "Shipments" },
    { key: "rga", label: "RGA" },
    { key: "invoices", label: "Invoices" },
  ];

  if (primaryShowroom) {
    locationTabs.push({ key: "primary-showroom", label: "Primary Showroom" });
  }

  const activeTab: LocationTab = locationTabs.some(
    (tab) => tab.key === selectedTab,
  )
    ? (selectedTab as LocationTab)
    : "profile";

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Customer Location</span>
          <Link
            className="context-parent-link"
            href={`/?customer=${customerId}`}
          >
            {customer.name}
          </Link>
          <h2>{location.location_name}</h2>
        </div>
        <div className="header-actions">
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=edit-location&customer=${customerId}&location=${locationId}`}
          >
            Edit
          </Link>
          <Link
            className="primary-action"
            href={`/?module=new-order&customer=${customerId}&location=${locationId}`}
          >
            Enter New Order
          </Link>
        </div>
      </section>

      <section className="metric-grid">
        <Metric
          labelText="Contacts"
          value={numberFormatter.format(contacts.length)}
        />
        <Metric
          labelText="Open Orders"
          value={numberFormatter.format(
            orders.filter((order) => order.status !== "closed").length,
          )}
        />
        <Metric
          labelText="Shipments"
          value={numberFormatter.format(packingLists.length)}
        />
        <Metric
          labelText="Open Invoices"
          value={numberFormatter.format(
            invoices.filter((invoice) => invoice.invoice_status !== "void")
              .length,
          )}
        />
        <Metric labelText="RGA" value={numberFormatter.format(rgas.length)} />
      </section>

      <section className="tab-strip" aria-label="Location dashboard sections">
        {locationTabs.map((tab) => (
          <Link
            aria-current={activeTab === tab.key ? "page" : undefined}
            href={`/?module=view-location&customer=${customerId}&location=${locationId}&location_tab=${tab.key}`}
            key={tab.key}
          >
            {tab.label}
          </Link>
        ))}
      </section>

      <section className="section-stack">
        {activeTab === "profile" ? <article className="data-section">
          <div className="section-title">
            <h3>Profile</h3>
            <Link
              className="text-action"
              href={`/?module=edit-location&customer=${customerId}&location=${locationId}`}
            >
              Edit
            </Link>
          </div>
          <section className="detail-grid detail-grid--inside">
            <article className="info-panel">
              <h3>Location Profile</h3>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{label(location.status)}</dd>
                </div>
                <div>
                  <dt>Location Type</dt>
                  <dd>{label(location.location_type)}</dd>
                </div>
                <div>
                  <dt>Location Code</dt>
                  <dd>{location.location_code ?? "System generated"}</dd>
                </div>
                <div>
                  <dt>Territory</dt>
                  <dd>
                    {territory
                      ? `${territory.territory_code} - ${territory.name}`
                      : "Not assigned"}
                  </dd>
                </div>
                <div>
                  <dt>Sales Agency</dt>
                  <dd>{coverage.salesRepAgencyName ?? "Not assigned"}</dd>
                </div>
                <div>
                  <dt>Sales Rep</dt>
                  <dd>{coverage.salesRepName ?? "Not assigned"}</dd>
                </div>
                <div>
                  <dt>Primary Showroom</dt>
                  <dd>
                    {primaryShowroom
                      ? label(primaryShowroom.program_status)
                      : "No"}
                  </dd>
                </div>
                <div>
                  <dt>Freight Term</dt>
                  <dd>{location.is_shipping_address && freightLevel ? `${freightLevel.levelName} - FFA ${money(freightLevel.freeFreightAllowance)}, ${freightLevel.freightRatePercent}%` : location.is_shipping_address ? "Not configured" : "Not a shipping address"}</dd>
                </div>
              </dl>
            </article>

            <article className="info-panel">
              <h3>Address</h3>
              <dl>
                <div>
                  <dt>Address Line 1</dt>
                  <dd>{location.address_line_1 ?? "Not set"}</dd>
                </div>
                <div>
                  <dt>Address Line 2</dt>
                  <dd>{location.address_line_2 ?? "Not set"}</dd>
                </div>
                <div>
                  <dt>City / State</dt>
                  <dd>
                    {[location.city, location.state_province]
                      .filter(Boolean)
                      .join(", ") || "Not set"}
                  </dd>
                </div>
                <div>
                  <dt>Country / Postal Code</dt>
                  <dd>
                    {[location.country, location.postal_code]
                      .filter(Boolean)
                      .join(" ") || "Not set"}
                  </dd>
                </div>
              </dl>
            </article>
          </section>
          <div className="badge-row badge-row--left">
            {location.is_default_ship_to ? (
              <StatusBadge tone="good" value="Default Ship-to" />
            ) : null}
            {primaryShowroom ? (
              <StatusBadge tone="primary" value="Primary Showroom" />
            ) : null}
            {location.is_shipping_address ? (
              <StatusBadge value="Shipping Address" />
            ) : null}
            {location.is_billing_address ? (
              <StatusBadge value="Billing Address" />
            ) : null}
            {location.is_showroom ? <StatusBadge value="Showroom" /> : null}
          </div>
        </article> : null}

        {activeTab === "contacts" ? <article className="data-section">
          <div className="section-title">
            <h3>Contacts</h3>
            <div className="section-actions">
              <span>{contacts.length}</span>
              <Link
                className="small-action"
                href={`/?module=add-contact&customer=${customerId}`}
              >
                Add Contact
              </Link>
            </div>
          </div>
          <div className="compact-list">
            {contacts.length === 0 ? (
              <EmptyState text="No contacts are assigned to this location." />
            ) : null}
            {contacts.map((contact) => (
              <div className="compact-row" key={contact.id}>
                <div>
                  <Link
                    className="record-link"
                    href={`/?module=view-contact&customer=${customerId}&contact=${contact.id}`}
                  >
                    {contact.name}
                  </Link>
                  <span>
                    {[contact.title, contact.department]
                      .filter(Boolean)
                      .join(" / ") || "Contact"}
                  </span>
                </div>
                <span>{contact.email ?? "No email"}</span>
                <ContactRoleBadges contact={contact} />
              </div>
            ))}
          </div>
        </article> : null}

        {activeTab === "orders" ? <article className="data-section">
          <div className="section-title">
            <h3>Orders</h3>
            <span>{orders.length}</span>
          </div>
          <div className="table-wrap">
            {orders.length === 0 ? (
              <EmptyState text="No orders are linked to this location." />
            ) : null}
            {orders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>SO No.</th>
                    <th>Customer PO</th>
                    <th>Date</th>
                    <th>Source</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <Link
                          className="table-link"
                          href={`/?module=orders&order=${order.id}`}
                        >
                          {order.sales_order_number}
                        </Link>
                      </td>
                      <td>{order.customer_po_number}</td>
                      <td>{dateLabel(order.order_date)}</td>
                      <td>{label(order.order_source)}</td>
                      <td>{label(order.order_type)}</td>
                      <td>
                        <StatusBadge
                          tone={
                            order.credit_hold_status === "none"
                              ? "good"
                              : "warn"
                          }
                          value={order.status}
                        />
                      </td>
                      <td>{money(order.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </article> : null}

        {activeTab === "shipments" ? <article className="data-section">
          <div className="section-title">
            <h3>Shipments</h3>
            <span>{packingLists.length}</span>
          </div>
          <div className="compact-list">
            {packingLists.length === 0 ? (
              <EmptyState text="No packing lists are linked to this location." />
            ) : null}
            {packingLists.map((packingList) => (
              <div className="compact-row" key={packingList.id}>
                <div>
                  <strong>{packingList.packing_list_number}</strong>
                  <span>PO {packingList.customer_po_number_snapshot}</span>
                </div>
                <span>{dateLabel(packingList.ship_date)}</span>
                <StatusBadge value={packingList.status} />
              </div>
            ))}
          </div>
        </article> : null}

        {activeTab === "rga" ? <article className="data-section">
          <div className="section-title">
            <h3>RGA</h3>
            <span>{rgas.length}</span>
          </div>
          <div className="compact-list">
            {rgas.length === 0 ? (
              <EmptyState text="No RGA activity is linked to this location." />
            ) : null}
            {rgas.map((rga) => (
              <div className="compact-row" key={rga.id}>
                <div>
                  <strong>{rga.rga_number}</strong>
                  <span>{dateLabel(rga.request_date)}</span>
                </div>
                <span>{label(rga.requested_resolution_type)}</span>
                <StatusBadge value={rga.status} />
              </div>
            ))}
          </div>
        </article> : null}

        {activeTab === "invoices" ? <article className="data-section">
          <div className="section-title">
            <h3>Invoices</h3>
            <span>{invoices.length}</span>
          </div>
          <div className="compact-list">
            {invoices.length === 0 ? (
              <EmptyState text="No invoices are linked to this location." />
            ) : null}
            {invoices.map((invoice) => (
              <div className="compact-row" key={invoice.id}>
                <div>
                  <strong>{invoice.invoice_number}</strong>
                  <span>{invoice.brand_name_snapshot}</span>
                </div>
                <span>{dateLabel(invoice.invoice_date)}</span>
                <span>{money(invoice.balance_due)}</span>
              </div>
            ))}
          </div>
        </article> : null}

        {activeTab === "primary-showroom" && primaryShowroom ? (
          <article className="data-section">
            <div className="section-title">
              <h3>Primary Showroom</h3>
              <span>{displays.length}</span>
            </div>
            <section className="detail-grid detail-grid--inside">
              <article className="info-panel">
                <h3>Enrollment</h3>
                <dl>
                  <div>
                    <dt>Status</dt>
                    <dd>{label(primaryShowroom.program_status)}</dd>
                  </div>
                  <div>
                    <dt>Enrollment Date</dt>
                    <dd>{dateLabel(primaryShowroom.enrollment_date)}</dd>
                  </div>
                  <div>
                    <dt>Pending Renew Date</dt>
                    <dd>{dateLabel(primaryShowroom.pending_renew_date)}</dd>
                  </div>
                  <div>
                    <dt>Expiration Date</dt>
                    <dd>{dateLabel(primaryShowroom.expiration_date)}</dd>
                  </div>
                </dl>
              </article>
              <article className="info-panel">
                <h3>Program Terms</h3>
                <dl>
                  <div>
                    <dt>Display Count</dt>
                    <dd>
                      {numberFormatter.format(
                        primaryShowroom.current_display_count ?? 0,
                      )}{" "}
                      /{" "}
                      {numberFormatter.format(
                        primaryShowroom.required_display_count ?? 0,
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Discount</dt>
                    <dd>{primaryShowroom.discount_percent ?? 0}%</dd>
                  </div>
                  <div>
                    <dt>Free Freight Threshold</dt>
                    <dd>
                      {primaryShowroom.free_freight_threshold
                        ? money(primaryShowroom.free_freight_threshold)
                        : "Not set"}
                    </dd>
                  </div>
                  <div>
                    <dt>Notification Email</dt>
                    <dd>
                      {primaryShowroom.showroom_notification_email ?? "Not set"}
                    </dd>
                  </div>
                </dl>
              </article>
            </section>
            <div className="compact-list">
              {displays.length === 0 ? (
                <EmptyState text="No display items are linked to this primary showroom yet." />
              ) : null}
              {displays.map((display) => (
                <div className="compact-row" key={display.id}>
                  <div>
                    <strong>{display.sku_snapshot}</strong>
                    <span>
                      {display.product_name_snapshot ?? "Display item"}
                    </span>
                  </div>
                  <span>
                    {dateLabel(display.display_shipped_date_snapshot)}
                  </span>
                  <StatusBadge
                    tone={
                      display.counts_toward_primary_showroom
                        ? "good"
                        : "neutral"
                    }
                    value={display.display_status}
                  />
                </div>
              ))}
            </div>
          </article>
        ) : null}
      </section>
    </section>
  );
}
