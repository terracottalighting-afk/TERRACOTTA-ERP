import Link from "next/link";
import { ModulePlaceholder } from "@/components/ui";
import { OrderEntryForm, type OrderPartOption, type OrderProductOption, type OrderShipToOption } from "./order-entry-form";

type OrderEntryData = {
  customer: {
    default_discount_percent: number | null;
    name: string;
  };
  partOptions: OrderPartOption[];
  products: OrderProductOption[];
  shipToOptions: OrderShipToOption[];
};

export async function NewOrderPage({
  customerId,
  error,
  agencyId,
  getOrderEntryData,
  isAgencyOrder = false,
  locationId,
  saveAction,
}: {
  customerId?: string;
  error?: string;
  agencyId?: string;
  getOrderEntryData: (customerId: string) => Promise<OrderEntryData | null>;
  isAgencyOrder?: boolean;
  locationId?: string;
  saveAction: (formData: FormData) => Promise<void>;
}) {
  if (!customerId) {
    return <ModulePlaceholder moduleName="Choose a customer account before entering a new order" />;
  }

  const data = await getOrderEntryData(customerId);
  if (!data) return <ModulePlaceholder moduleName="Customer account not found" />;

  return (
    <section className="dashboard-panel">
      <section className="form-header">
        <div>
          <span className="eyebrow">Order Entry</span>
          <Link className="context-parent-link" href={isAgencyOrder && agencyId ? `/?module=sales-rep-agency&agency=${agencyId}&agency_tab=orders` : `/?customer=${customerId}`}>
            {data.customer.name}
          </Link>
          <h2>{isAgencyOrder ? "Place Agency Order" : "Enter New Order"}</h2>
        </div>
      </section>
      {error ? <p className="form-alert">{error}</p> : null}
      <OrderEntryForm
        accountName={data.customer.name}
        agencyId={agencyId}
        customerId={customerId}
        defaultDiscountPercent={Number(data.customer.default_discount_percent ?? 0)}
        defaultLocationId={locationId}
        isAgencyOrder={isAgencyOrder}
        parts={data.partOptions}
        products={data.products}
        saveAction={saveAction}
        shipToOptions={data.shipToOptions}
      />
    </section>
  );
}
