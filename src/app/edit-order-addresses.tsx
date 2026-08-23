"use client";

import { useState } from "react";

type AddressOption = {
  address: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  country: string | null;
  countryCode: string | null;
  email: string | null;
  id: string;
  isDefault: boolean;
  name: string;
  postalCode: string | null;
  stateProvince: string | null;
};

type AddressDraft = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  email: string;
  name: string;
  postalCode: string;
  stateProvince: string;
};

function optionDraft(option: AddressOption): AddressDraft {
  return { addressLine1: option.addressLine1 ?? "", addressLine2: option.addressLine2 ?? "", city: option.city ?? "", country: option.country ?? "United States", email: option.email ?? "", name: option.name, postalCode: option.postalCode ?? "", stateProvince: option.stateProvince ?? "" };
}

function snapshotDraft(snapshot: Record<string, unknown> | null, nameKey: "bill_to_display_name" | "ship_to_display_name"): AddressDraft {
  const emailKey = nameKey === "bill_to_display_name" ? "billing_email" : "shipping_contact_email";
  return { addressLine1: String(snapshot?.address_line_1 ?? ""), addressLine2: String(snapshot?.address_line_2 ?? ""), city: String(snapshot?.city ?? ""), country: String(snapshot?.country ?? "United States"), email: String(snapshot?.[emailKey] ?? snapshot?.email ?? ""), name: String(snapshot?.[nameKey] ?? ""), postalCode: String(snapshot?.postal_code ?? ""), stateProvince: String(snapshot?.state_province ?? "") };
}

function AddressFields({ disabled, draft, onChange, prefix, title }: { disabled: boolean; draft: AddressDraft; onChange: (field: keyof AddressDraft, value: string) => void; prefix: "billing" | "dropship"; title: string }) {
  const fieldName = (field: string) => `${prefix}_${field}`;
  return (
    <div className="address-fields">
      <h4>{title}</h4>
      <label>{prefix === "billing" ? "Billing Name" : "Ship-to Name"}<input disabled={disabled} name={fieldName("name")} onChange={(event) => onChange("name", event.target.value)} value={draft.name} /></label>
      <label>{prefix === "billing" ? "Billing Email" : "Shipping Contact Email"}<input disabled={disabled} name={fieldName("email")} onChange={(event) => onChange("email", event.target.value)} type="email" value={draft.email} /></label>
      <label className="full-width-field">Address Line 1<input disabled={disabled} name={fieldName("address_line_1")} onChange={(event) => onChange("addressLine1", event.target.value)} value={draft.addressLine1} /></label>
      <label>Address Line 2<input disabled={disabled} name={fieldName("address_line_2")} onChange={(event) => onChange("addressLine2", event.target.value)} value={draft.addressLine2} /></label>
      <label>City<input disabled={disabled} name={fieldName("city")} onChange={(event) => onChange("city", event.target.value)} value={draft.city} /></label>
      <label>State / Province<input disabled={disabled} name={fieldName("state_province")} onChange={(event) => onChange("stateProvince", event.target.value)} value={draft.stateProvince} /></label>
      <label>Postal Code<input disabled={disabled} name={fieldName("postal_code")} onChange={(event) => onChange("postalCode", event.target.value)} value={draft.postalCode} /></label>
      <label className="full-width-field">Country<input disabled={disabled} name={fieldName("country")} onChange={(event) => onChange("country", event.target.value)} value={draft.country} /></label>
    </div>
  );
}

export function EditOrderAddresses({ billingAddressOptions, billingSnapshot, disabled, shipToOptions, shipToSnapshot }: { billingAddressOptions: AddressOption[]; billingSnapshot: Record<string, unknown> | null; disabled: boolean; shipToOptions: AddressOption[]; shipToSnapshot: Record<string, unknown> }) {
  const currentShippingDraft = snapshotDraft(shipToSnapshot, "ship_to_display_name");
  const currentBillingDraft = snapshotDraft(billingSnapshot, "bill_to_display_name");
  const [shippingAddressSelection, setShippingAddressSelection] = useState("current");
  const [billingAddressSelection, setBillingAddressSelection] = useState("current");
  const [shippingDraft, setShippingDraft] = useState(currentShippingDraft);
  const [billingDraft, setBillingDraft] = useState(currentBillingDraft);

  const chooseShippingAddress = (selection: string) => {
    setShippingAddressSelection(selection);
    const option = shipToOptions.find((location) => location.id === selection);
    setShippingDraft(option ? optionDraft(option) : currentShippingDraft);
  };
  const chooseBillingAddress = (selection: string) => {
    setBillingAddressSelection(selection);
    const option = billingAddressOptions.find((location) => location.id === selection);
    setBillingDraft(option ? optionDraft(option) : currentBillingDraft);
  };

  return (
    <fieldset>
      <legend>Shipping and Billing</legend>
      <div className="address-editor-grid">
        <section className="address-editor-column">
          <label>Shipping Address<select disabled={disabled} name="shipping_address_selection" onChange={(event) => chooseShippingAddress(event.target.value)} value={shippingAddressSelection}><option value="current">Current Address</option>{shipToOptions.map((location) => <option key={location.id} value={location.id}>{location.name}{location.isDefault ? " (Default Ship-to)" : ""}</option>)}</select></label>
          <AddressFields disabled={disabled} draft={shippingDraft} onChange={(field, value) => setShippingDraft((current) => ({ ...current, [field]: value }))} prefix="dropship" title="Shipping Address Details" />
        </section>
        <section className="address-editor-column">
          <label>Billing Address<select disabled={disabled} name="billing_address_selection" onChange={(event) => chooseBillingAddress(event.target.value)} value={billingAddressSelection}><option value="current">Current Address</option>{billingAddressOptions.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select></label>
          <AddressFields disabled={disabled} draft={billingDraft} onChange={(field, value) => setBillingDraft((current) => ({ ...current, [field]: value }))} prefix="billing" title="Billing Address Details" />
        </section>
      </div>
    </fieldset>
  );
}
