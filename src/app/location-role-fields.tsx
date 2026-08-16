"use client";

import { useState } from "react";

export function LocationRoleFields({
  defaultBillingAddress = false,
  defaultDefaultShipTo = false,
  defaultPrimaryShowroom = false,
  defaultShippingAddress = true,
  defaultShowroom = false
}: {
  defaultBillingAddress?: boolean;
  defaultDefaultShipTo?: boolean;
  defaultPrimaryShowroom?: boolean;
  defaultShippingAddress?: boolean;
  defaultShowroom?: boolean;
}) {
  const [isShowroom, setIsShowroom] = useState(defaultShowroom);

  return (
    <>
      <label className="checkbox-label">
        <input defaultChecked={defaultShippingAddress} name="is_shipping_address" type="checkbox" />
        Shipping address
      </label>
      <label className="checkbox-label">
        <input defaultChecked={defaultDefaultShipTo} name="is_default_ship_to" type="checkbox" />
        Default ship-to
      </label>
      <label className="checkbox-label">
        <input defaultChecked={defaultBillingAddress} name="is_billing_address" type="checkbox" />
        Billing address
      </label>
      <label className="checkbox-label">
        <input defaultChecked={defaultShowroom} name="is_showroom" onChange={(event) => setIsShowroom(event.target.checked)} type="checkbox" />
        Showroom location
      </label>
      {isShowroom ? (
        <label className="checkbox-label">
          <input defaultChecked={defaultPrimaryShowroom} name="is_primary_showroom" type="checkbox" />
          Primary Showroom
        </label>
      ) : null}
    </>
  );
}
