"use client";

import { useMemo, useRef, useState, useTransition } from "react";

export type OrderProductOption = {
  brandName: string;
  defaultPrice: number;
  id: string;
  inventory: number;
  name: string;
  sku: string;
};

export type OrderPartOption = OrderProductOption & {
  parentProductIds: string[];
  parentRoles: string[];
};

export type OrderShipToOption = {
  address: string;
  agencyId: string | null;
  contactName: string | null;
  email: string | null;
  freightLevel?: DefaultFreightLevel | null;
  id: string;
  isDefault: boolean;
  name: string;
  phone: string | null;
  salesRepId: string | null;
  territoryId: string | null;
};

export type OrderTerritoryOption = {
  agencies: { id: string; name: string }[];
  agencyId: string | null;
  agencyCommissionRate: number | null;
  agencyName: string | null;
  id: string;
  name: string;
};

export type OrderSalesRepOption = {
  agencyId: string;
  id: string;
  name: string;
};

type DefaultFreightLevel = {
  freeFreightAllowance: number;
  freightRatePercent: number;
  levelName: string;
};

type DropshipSettings = {
  isActive: boolean;
  ratePercent: number;
};

type OrderLine = OrderProductOption & {
  discountPercent: number;
  quantity: number;
  unitPrice: number;
};

type OrderConfirmation = {
  customerPoNumber: string;
  displayOrderType: string;
  notes: string;
  orderDate: string;
  orderSource: string;
  orderType: string;
  shipToAddress: string;
  shipToContact: string;
  shipToName: string;
  isResidentialAddress: boolean;
};

type ManualShipTo = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  contactName: string;
  country: string;
  email: string;
  name: string;
  phone: string;
  postalCode: string;
  stateProvince: string;
};

type Props = {
  accountName: string;
  agencyId?: string;
  customerId: string;
  defaultDiscountPercent: number;
  defaultFreightLevel?: DefaultFreightLevel | null;
  dropshipSettings: DropshipSettings;
  defaultLocationId?: string;
  isAgencyOrder?: boolean;
  parts: OrderPartOption[];
  products: OrderProductOption[];
  saveAction: (formData: FormData) => void;
  salesReps: OrderSalesRepOption[];
  shipToOptions: OrderShipToOption[];
  territories: OrderTerritoryOption[];
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const wholeMoney = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const orderSourceLabels: Record<string, string> = {
  ecommerce: "Ecommerce",
  email: "Email",
  fax: "Fax",
  manual: "Manual Entry",
  phone: "Phone",
  portal: "Customer Portal",
  rep_submitted: "Rep Submitted",
};

const orderTypeLabels: Record<string, string> = {
  catalog_marketing: "Catalog / Marketing Materials",
  display: "Display Order",
  quote: "Quote",
  regular: "Regular Order",
};

export function OrderEntryForm({ accountName, agencyId, customerId, defaultDiscountPercent, defaultFreightLevel = null, defaultLocationId, dropshipSettings, isAgencyOrder = false, parts, products, salesReps, saveAction, shipToOptions, territories }: Props) {
  const [productQuery, setProductQuery] = useState("");
  const [searchParts, setSearchParts] = useState(false);
  const [partSearchMode, setPartSearchMode] = useState<"parent" | "generic">("parent");
  const [partQuery, setPartQuery] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [customerPoNumber, setCustomerPoNumber] = useState("");
  const [orderDate, setOrderDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [orderSource, setOrderSource] = useState("manual");
  const [orderType, setOrderType] = useState("regular");
  const [notes, setNotes] = useState("");
  const [isDropship, setIsDropship] = useState(false);
  const [manualShipTo, setManualShipTo] = useState<ManualShipTo>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    contactName: "",
    country: "United States",
    email: "",
    name: "",
    phone: "",
    postalCode: "",
    stateProvince: "",
  });
  const [commissionSelection, setCommissionSelection] = useState({
    agencyId: "",
    salesRepId: "",
    territoryId: "",
  });
  const [payCommission, setPayCommission] = useState(true);
  const [commissionRate, setCommissionRate] = useState("");
  const [isEditingCommission, setIsEditingCommission] = useState(false);
  const [hasCommissionOverride, setHasCommissionOverride] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [locationId, setLocationId] = useState(defaultLocationId ?? shipToOptions.find((location) => location.isDefault)?.id ?? shipToOptions[0]?.id ?? "");
  const [shippingContactName, setShippingContactName] = useState(() => {
    const initialLocationId = defaultLocationId ?? shipToOptions.find((location) => location.isDefault)?.id ?? shipToOptions[0]?.id;
    return shipToOptions.find((location) => location.id === initialLocationId)?.contactName ?? "";
  });
  const [shippingContactPhone, setShippingContactPhone] = useState(() => {
    const initialLocationId = defaultLocationId ?? shipToOptions.find((location) => location.isDefault)?.id ?? shipToOptions[0]?.id;
    return shipToOptions.find((location) => location.id === initialLocationId)?.phone ?? "";
  });
  const [shippingContactEmail, setShippingContactEmail] = useState(() => {
    const initialLocationId = defaultLocationId ?? shipToOptions.find((location) => location.isDefault)?.id ?? shipToOptions[0]?.id;
    return shipToOptions.find((location) => location.id === initialLocationId)?.email ?? "";
  });

  const productResults = useMemo(() => {
    const query = productQuery.trim().toLowerCase();
    if (!query) return [];

    return products
      .filter((product) => product.sku.toLowerCase().includes(query) || product.name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [productQuery, products]);

  const parentResults = useMemo(() => {
    const query = partQuery.trim().toLowerCase();
    if (!query || partSearchMode !== "parent") return [];
    return products.filter((product) => product.sku.toLowerCase().includes(query) || product.name.toLowerCase().includes(query)).slice(0, 8);
  }, [partSearchMode, partQuery, products]);

  const activeParentId = useMemo(() => {
    if (selectedParentId) return selectedParentId;
    const normalizedQuery = partQuery.trim().toLowerCase();
    return products.find((product) => product.sku.toLowerCase() === normalizedQuery || product.name.toLowerCase() === normalizedQuery)?.id ?? "";
  }, [partQuery, products, selectedParentId]);

  const partResults = useMemo(() => {
    if (!searchParts) return [];
    if (partSearchMode === "parent") {
      return activeParentId ? parts.filter((part) => part.parentProductIds.includes(activeParentId)) : [];
    }
    const query = partQuery.trim().toLowerCase();
    if (!query) return [];
    return parts.filter((part) => part.sku.toLowerCase().includes(query) || part.name.toLowerCase().includes(query)).slice(0, 8);
  }, [activeParentId, partSearchMode, partQuery, parts, searchParts]);

  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice * (1 - line.discountPercent / 100), 0);
  const selectedFreightLevel = shipToOptions.find((location) => location.id === locationId)?.freightLevel ?? defaultFreightLevel;
  const defaultFreightCharge = selectedFreightLevel && subtotal < selectedFreightLevel.freeFreightAllowance
    ? Math.round(subtotal * (selectedFreightLevel.freightRatePercent / 100))
    : 0;
  const estimatedDropshipFee = isDropship && dropshipSettings.isActive
    ? Math.round(subtotal * (dropshipSettings.ratePercent / 100) * 100) / 100
    : 0;
  const selectedTerritory = territories.find((territory) => territory.id === commissionSelection.territoryId);
  const selectedAgency = selectedTerritory?.agencies.find((agency) => agency.id === commissionSelection.agencyId);
  const selectedAgencyReps = salesReps.filter((rep) => rep.agencyId === commissionSelection.agencyId);
  const selectedSalesRep = selectedAgencyReps.find((rep) => rep.id === commissionSelection.salesRepId);

  function defaultCommissionRate(territoryId: string) {
    const rate = territories.find((territory) => territory.id === territoryId)?.agencyCommissionRate;
    return rate === null || rate === undefined ? "" : String(rate);
  }

  function commissionDefaultsForLocation(nextLocationId: string, dropship = isDropship) {
    const location = shipToOptions.find((option) => option.id === nextLocationId);
    return dropship || !location
      ? { agencyId: "", salesRepId: "", territoryId: "" }
      : {
          agencyId: location.agencyId ?? "",
          salesRepId: location.salesRepId ?? "",
          territoryId: location.territoryId ?? "",
    };
  }

  function selectCommissionTerritory(territoryId: string) {
    setCommissionSelection({ agencyId: "", salesRepId: "", territoryId });
    setCommissionRate(defaultCommissionRate(territoryId));
    setHasCommissionOverride(true);
  }

  function addProduct(product: OrderProductOption) {
    setLines((current) => {
      const matchingLine = current.find((line) => line.id === product.id);
      if (matchingLine) {
        return current.map((line) => (line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line));
      }

      return [...current, { ...product, discountPercent: orderType === "catalog_marketing" ? 100 : defaultDiscountPercent, quantity: 1, unitPrice: product.defaultPrice }];
    });
    setProductQuery("");
  }

  function updateProductQuery(value: string) {
    setProductQuery(value);
  }

  function chooseParent(parent: OrderProductOption) {
    setSelectedParentId(parent.id);
    setPartQuery(parent.sku);
  }

  function updateParentQuery(value: string) {
    setPartQuery(value);
    const matchingParent = products.find((product) => product.sku.toLowerCase() === value.trim().toLowerCase());
    setSelectedParentId(matchingParent?.id ?? "");
  }

  function updateLine(id: string, patch: Partial<Pick<OrderLine, "discountPercent" | "quantity" | "unitPrice">>) {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }

  function updateManualShipTo(field: keyof ManualShipTo, value: string) {
    setManualShipTo((current) => ({ ...current, [field]: value }));
  }

  function submitOrder(formData: FormData) {
    setSaveError(null);

    if (lines.length === 0) {
      setSaveError("Add at least one product or part to the order before saving.");
      return;
    }

    if (!isDropship && !locationId) {
      setSaveError("Select a saved shipping address or choose Manual Ship-to / Drop Ship.");
      return;
    }

    const selectedLocation = shipToOptions.find((location) => location.id === locationId);
    const manualShipToAddress = [
      String(formData.get("dropship_address_line_1") ?? "").trim(),
      String(formData.get("dropship_address_line_2") ?? "").trim(),
      [
        String(formData.get("dropship_city") ?? "").trim(),
        String(formData.get("dropship_state_province") ?? "").trim(),
        String(formData.get("dropship_postal_code") ?? "").trim(),
      ].filter(Boolean).join(", "),
      String(formData.get("dropship_country") ?? "").trim(),
    ].filter(Boolean).join(" | ");
    const manualShipToContact = [
      String(formData.get("dropship_contact_name") ?? "").trim(),
      String(formData.get("dropship_contact_phone") ?? "").trim(),
      String(formData.get("dropship_email") ?? "").trim(),
    ].filter(Boolean).join(" | ");

    setConfirmation({
      customerPoNumber: String(formData.get("customer_po_number") ?? "").trim(),
      displayOrderType: String(formData.get("display_order_type") ?? "").trim(),
      notes: String(formData.get("notes") ?? "").trim(),
      orderDate: String(formData.get("order_date") ?? "").trim(),
      orderSource: String(formData.get("order_source") ?? "").trim(),
      orderType: String(formData.get("order_type") ?? "").trim(),
      shipToAddress: isDropship ? manualShipToAddress : selectedLocation?.address ?? "Not set",
      shipToContact: isDropship
        ? manualShipToContact
        : [shippingContactName, shippingContactPhone, shippingContactEmail]
            .filter(Boolean)
            .join(" | "),
      shipToName: isDropship
        ? String(formData.get("dropship_name") ?? "").trim()
        : selectedLocation?.name ?? "Not set",
      isResidentialAddress: formData.get("dropship_residential_address") === "on",
    });
    if (!isDropship) {
      const nextCommissionSelection = commissionDefaultsForLocation(locationId);
      setCommissionSelection(nextCommissionSelection);
      setCommissionRate(defaultCommissionRate(nextCommissionSelection.territoryId));
      setPayCommission(true);
      setHasCommissionOverride(false);
      setIsEditingCommission(false);
    }
  }

  function returnToEditor(sectionId?: string) {
    setConfirmation(null);
    if (sectionId) {
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function createConfirmedOrder() {
    if (!formRef.current) return;

    startSaving(async () => {
      await saveAction(new FormData(formRef.current!));
    });
  }

  return (
    <form action={submitOrder} className="customer-form order-entry-form" data-default-discount={defaultDiscountPercent} ref={formRef}>
      <input name="customer_id" type="hidden" value={customerId} />
      {agencyId ? <input name="sales_rep_agency_id" type="hidden" value={agencyId} /> : null}
      <input data-order-lines name="order_lines" type="hidden" value={JSON.stringify(lines.map((line) => ({ discountPercent: line.discountPercent, productId: line.id, quantity: line.quantity, unitPrice: line.unitPrice })))} />
      <input name="customer_location_id" type="hidden" value={locationId} />
      <input name="territory_id_override" type="hidden" value={commissionSelection.territoryId} />
      <input name="sales_rep_agency_id_override" type="hidden" value={commissionSelection.agencyId} />
      <input name="sales_rep_id_override" type="hidden" value={commissionSelection.salesRepId} />
      <input name="commission_override_enabled" type="hidden" value={hasCommissionOverride ? "1" : ""} />
      <input name="commission_payable" type="hidden" value={payCommission ? "1" : ""} />
      <input name="commission_rate_percent" type="hidden" value={commissionRate} />

      <div hidden={Boolean(confirmation)}>
      <fieldset id="order-header">
        <legend>Order Header</legend>
        <div className="order-account-context">
          <span>Customer Account</span>
          <strong>{accountName}</strong>
        </div>
        <div className="form-grid">
          <label>
            Customer PO No.
            <input name="customer_po_number" onChange={(event) => setCustomerPoNumber(event.target.value)} placeholder="Customer PO number" required value={customerPoNumber} />
          </label>
          <label>
            Order Date
            <input name="order_date" onChange={(event) => setOrderDate(event.target.value)} required type="date" value={orderDate} />
          </label>
          <label>
            Order Source
            <select name="order_source" onChange={(event) => setOrderSource(event.target.value)} value={orderSource}>
              <option value="manual">Manual Entry</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="fax">Fax</option>
              <option value="ecommerce">Ecommerce</option>
              <option value="portal">Customer Portal</option>
              <option value="rep_submitted">Rep Submitted</option>
            </select>
          </label>
          <label>
            Order Type
            <select name="order_type" onChange={(event) => {
              const nextOrderType = event.target.value;
              setOrderType(nextOrderType);
              if (nextOrderType === "catalog_marketing") {
                setLines((current) => current.map((line) => ({ ...line, discountPercent: 100 })));
              }
            }} onInput={(event) => setOrderType(event.currentTarget.value)} value={orderType}>
              <option value="regular">Regular Order</option>
              {isAgencyOrder ? <option value="catalog_marketing">Catalog / Marketing Materials (No Charge)</option> : <><option value="display">Display Order</option><option value="quote">Quote</option></>}
            </select>
          </label>
          {orderType === "display" ? (
            <label>
              Display Order Type
              <select name="display_order_type" required>
                <option value="primary_showroom_display">Primary Showroom Display</option>
                <option value="non_primary_display">Non-primary Showroom Display</option>
                <option value="other_display">Other Display</option>
              </select>
            </label>
          ) : null}
        </div>
      </fieldset>

      <fieldset id="order-ship-to">
        <legend>Ship-to</legend>
        <label className="checkbox-label ship-to-mode-toggle">
          <input checked={isDropship} name="is_dropship" onChange={(event) => { const nextSelection = commissionDefaultsForLocation(locationId, event.target.checked); setIsDropship(event.target.checked); setCommissionSelection(nextSelection); setCommissionRate(defaultCommissionRate(nextSelection.territoryId)); }} type="checkbox" />
          Manual Ship-to / Drop Ship
        </label>
        <div className="ship-to-mode ship-to-mode--saved form-grid">
            <label className="full-width-field">
              Saved Shipping Address
              <select onChange={(event) => {
                const nextLocationId = event.target.value;
                const nextLocation = shipToOptions.find((location) => location.id === nextLocationId);
                setLocationId(nextLocationId);
                const nextSelection = commissionDefaultsForLocation(nextLocationId);
                setCommissionSelection(nextSelection);
                setCommissionRate(defaultCommissionRate(nextSelection.territoryId));
                setShippingContactName(nextLocation?.contactName ?? "");
                setShippingContactPhone(nextLocation?.phone ?? "");
                setShippingContactEmail(nextLocation?.email ?? "");
              }} value={locationId}>
                <option value="">Select a saved shipping address</option>
                {shipToOptions.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}{location.isDefault ? " (Default Ship-to)" : ""} - {location.address}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Shipping Contact
              <input name="shipping_contact_name" onChange={(event) => setShippingContactName(event.target.value)} value={shippingContactName} />
            </label>
            <label>
              Phone
              <input name="shipping_contact_phone" onChange={(event) => setShippingContactPhone(event.target.value)} type="tel" value={shippingContactPhone} />
            </label>
            <label>
              Email
              <input name="shipping_contact_email" onChange={(event) => setShippingContactEmail(event.target.value)} type="email" value={shippingContactEmail} />
            </label>
        </div>
        <div className="ship-to-mode ship-to-mode--dropship form-grid">
            <label>
              Ship-to Name
              <input name="dropship_name" onChange={(event) => updateManualShipTo("name", event.target.value)} placeholder="Recipient or business name" value={manualShipTo.name} />
            </label>
            <label>
              Country
              <input name="dropship_country" onChange={(event) => updateManualShipTo("country", event.target.value)} value={manualShipTo.country} />
            </label>
            <label className="full-width-field">
              Address Line 1
              <input name="dropship_address_line_1" onChange={(event) => updateManualShipTo("addressLine1", event.target.value)} value={manualShipTo.addressLine1} />
            </label>
            <label>
              Address Line 2
              <input name="dropship_address_line_2" onChange={(event) => updateManualShipTo("addressLine2", event.target.value)} value={manualShipTo.addressLine2} />
            </label>
            <label>
              City
              <input name="dropship_city" onChange={(event) => updateManualShipTo("city", event.target.value)} value={manualShipTo.city} />
            </label>
            <label>
              State / Province
              <input name="dropship_state_province" onChange={(event) => updateManualShipTo("stateProvince", event.target.value)} value={manualShipTo.stateProvince} />
            </label>
            <label>
              Postal Code
              <input name="dropship_postal_code" onChange={(event) => updateManualShipTo("postalCode", event.target.value)} value={manualShipTo.postalCode} />
            </label>
            <label>
              Shipping Contact
              <input name="dropship_contact_name" onChange={(event) => updateManualShipTo("contactName", event.target.value)} value={manualShipTo.contactName} />
            </label>
            <label>
              Phone
              <input name="dropship_contact_phone" onChange={(event) => updateManualShipTo("phone", event.target.value)} type="tel" value={manualShipTo.phone} />
            </label>
            <label>
              Email
              <input name="dropship_email" onChange={(event) => updateManualShipTo("email", event.target.value)} type="email" value={manualShipTo.email} />
            </label>
            <label>
              Territory
              <select onChange={(event) => selectCommissionTerritory(event.target.value)} value={commissionSelection.territoryId}>
                <option value="">Not Assigned</option>
                {territories.map((territory) => <option key={territory.id} value={territory.id}>{territory.name}</option>)}
              </select>
            </label>
            <label>
              Sales Agency
              <select disabled={!commissionSelection.territoryId} onChange={(event) => { setCommissionSelection((current) => ({ ...current, agencyId: event.target.value, salesRepId: "" })); setHasCommissionOverride(true); }} value={commissionSelection.agencyId}>
                <option value="">Not Assigned</option>
                {selectedTerritory?.agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}
              </select>
            </label>
            <label>
              Sales Rep
              <select disabled={!commissionSelection.agencyId} onChange={(event) => { setCommissionSelection((current) => ({ ...current, salesRepId: event.target.value })); setHasCommissionOverride(true); }} value={commissionSelection.salesRepId}>
                <option value="">Not Assigned</option>
                {selectedAgencyReps.map((rep) => <option key={rep.id} value={rep.id}>{rep.name}</option>)}
              </select>
            </label>
            <label className="checkbox-label">
              <input name="dropship_residential_address" type="checkbox" />
              Residential Address
            </label>
        </div>
      </fieldset>

      <fieldset id="order-products">
        <legend>Products</legend>
        <div className="order-product-search">
          <div className="order-search-heading">
            <label className="order-search-label">
              Search SKU or Product Name
            </label>
            <label className="checkbox-label order-part-toggle">
              <input name="search_parts" onChange={(event) => { setSearchParts(event.target.checked); setProductQuery(""); setPartQuery(""); setSelectedParentId(""); }} type="checkbox" />
              Search Parts
            </label>
          </div>
          <div className="order-search-mode order-search-mode--products">
                <label>
                <input autoComplete="off" name="product_search" onChange={(event) => updateProductQuery(event.target.value)} placeholder="Type a SKU or product name" value={productQuery} />
              </label>
              {productResults.length > 0 ? (
                <div className="order-product-results">
                  {productResults.map((product) => (
                    <button key={product.id} onClick={() => addProduct(product)} type="button">
                      <span><strong>{product.sku}</strong> {product.name}</span>
                      <span>{product.brandName} | {product.inventory} available | {money.format(product.defaultPrice)}</span>
                    </button>
                  ))}
                </div>
              ) : productQuery.trim() ? <p className="fieldset-note">No active, sellable products match this search.</p> : null}
          </div>
          <div className="order-search-mode order-search-mode--parts">
              <label className="checkbox-label order-generic-toggle"><input name="search_generic_part" onChange={(event) => { setPartSearchMode(event.target.checked ? "generic" : "parent"); setPartQuery(""); setSelectedParentId(""); }} type="checkbox" /> Search a generic part</label>
              <div className="part-search-mode part-search-mode--parent">
                <div className="part-parent-search-grid">
                  <div>
                    <label>
                      Enter a Parent SKU/Name
                      <input autoComplete="off" name="parent_part_search" onChange={(event) => updateParentQuery(event.target.value)} placeholder="Type a parent SKU or name" value={partQuery} />
                    </label>
                    {parentResults.length > 0 ? <div className="order-product-results">{parentResults.map((parent) => <button key={parent.id} onClick={() => chooseParent(parent)} type="button"><span><strong>{parent.sku}</strong> {parent.name}</span><span>{parts.filter((part) => part.parentProductIds.includes(parent.id)).length} linked parts</span></button>)}</div> : partQuery.trim() ? <p className="fieldset-note">Select a suggested parent product.</p> : null}
                  </div>
                  <div className="part-child-picker">
                    <span className="part-picker-label">Child Parts</span>
                    {activeParentId && partResults.length > 0 ? <div className="order-product-results">{partResults.map((part) => <button key={part.id} onClick={() => addProduct(part)} type="button"><span><strong>{part.sku}</strong> {part.name}</span><span>{part.parentRoles.join(", ") || "Part"} | {part.inventory} available | {money.format(part.defaultPrice)}</span></button>)}</div> : <p className="fieldset-note">Pick a parent product to display its child parts.</p>}
                  </div>
                </div>
              </div>
              <div className="part-search-mode part-search-mode--generic">
                <label>
                  Search Generic Part Name or SKU
                  <input autoComplete="off" name="generic_part_search" onChange={(event) => setPartQuery(event.target.value)} placeholder="Type a part name or SKU" value={partQuery} />
                </label>
                {partResults.length > 0 ? <div className="order-product-results">{partResults.map((part) => <button key={part.id} onClick={() => addProduct(part)} type="button"><span><strong>{part.sku}</strong> {part.name}</span><span>Generic | {part.inventory} available | {money.format(part.defaultPrice)}</span></button>)}</div> : partQuery.trim() ? <p className="fieldset-note">No generic parts match this search.</p> : null}
              </div>
          </div>
        </div>

        {lines.length === 0 ? <p className="empty-state">Search for products above and select them to add order lines.</p> : null}
        {lines.length > 0 ? (
          <div className="table-wrap">
            <table className="data-table order-lines-table">
              <thead>
                <tr><th>SKU</th><th>Product</th><th>Brand</th><th>Available</th><th>Qty</th><th>Unit Price</th><th>Discount</th><th>Line Total</th><th aria-label="Remove line" /></tr>
              </thead>
              <tbody>
                {lines.map((line) => {
                  const lineTotal = line.quantity * line.unitPrice * (1 - line.discountPercent / 100);
                  return (
                    <tr key={line.id}>
                      <td>{line.sku}</td><td>{line.name}</td><td>{line.brandName}</td><td>{line.inventory}</td>
                      <td><input min="1" onChange={(event) => updateLine(line.id, { quantity: Math.max(1, Number(event.target.value) || 1) })} step="1" type="number" value={line.quantity} /></td>
                      <td><input min="0" onChange={(event) => updateLine(line.id, { unitPrice: Math.max(0, Number(event.target.value) || 0) })} step="0.01" type="number" value={line.unitPrice} /></td>
                      <td><input disabled={orderType === "catalog_marketing"} min="0" onChange={(event) => updateLine(line.id, { discountPercent: Math.max(0, Number(event.target.value) || 0) })} step="0.01" type="number" value={line.discountPercent} /></td>
                      <td>{money.format(lineTotal)}</td>
                      <td><button aria-label={`Remove ${line.sku}`} className="icon-text-action" onClick={() => setLines((current) => current.filter((item) => item.id !== line.id))} type="button">Remove</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
        <div className="order-total"><span>Order Subtotal</span><strong data-native-order-subtotal>{money.format(subtotal)}</strong></div>
      </fieldset>

      <fieldset id="order-notes">
        <legend>Notes</legend>
        <div className="form-grid"><label className="full-width-field">Internal Order Notes<textarea name="notes" onChange={(event) => setNotes(event.target.value)} rows={3} value={notes} /></label></div>
      </fieldset>

      <div className="form-actions">
        <button className="primary-action" type="submit">
          Create Order
        </button>
      </div>
      {saveError ? <p aria-live="polite" className="form-alert">{saveError}</p> : null}
      </div>

      {confirmation ? (
        <section className="order-confirmation" aria-label="Order confirmation">
          <section className="form-header">
            <div>
              <span className="eyebrow">Order Confirmation</span>
              <h2>Review New Order</h2>
              <p className="muted-copy">Review the order before creating it. Edit returns to the saved local details.</p>
            </div>
          </section>

          <article className="data-section">
            <div className="section-title"><h3>Order Header</h3><button className="text-action text-action--button" onClick={() => returnToEditor("order-header")} type="button">Edit</button></div>
            <div className="detail-grid detail-grid--inside">
              <article className="info-panel"><dl><div><dt>Customer Account</dt><dd>{accountName}</dd></div><div><dt>Customer PO No.</dt><dd>{confirmation.customerPoNumber}</dd></div></dl></article>
              <article className="info-panel"><dl><div><dt>Order Date</dt><dd>{confirmation.orderDate}</dd></div><div><dt>Order Source</dt><dd>{orderSourceLabels[confirmation.orderSource] ?? confirmation.orderSource}</dd></div><div><dt>Order Type</dt><dd>{orderTypeLabels[confirmation.orderType] ?? confirmation.orderType}{confirmation.displayOrderType ? ` - ${confirmation.displayOrderType.replaceAll("_", " ")}` : ""}</dd></div></dl></article>
            </div>
          </article>

          <article className="data-section">
            <div className="section-title"><h3>Ship-to</h3><button className="text-action text-action--button" onClick={() => returnToEditor("order-ship-to")} type="button">Edit</button></div>
            <div className="detail-grid detail-grid--inside"><article className="info-panel"><dl><div><dt>{isDropship ? "Manual Ship-to" : "Saved Shipping Address"}</dt><dd>{confirmation.shipToName}</dd></div><div><dt>Address</dt><dd>{confirmation.shipToAddress}</dd></div><div><dt>Contact</dt><dd>{confirmation.shipToContact || "Not set"}</dd></div>{isDropship ? <div><dt>Residential Address</dt><dd>{confirmation.isResidentialAddress ? "Yes" : "No"}</dd></div> : null}</dl></article></div>
          </article>

          <article className="data-section">
            <div className="section-title"><h3>Territory &amp; Commission</h3><button className="text-action text-action--button" onClick={() => setIsEditingCommission((current) => !current)} type="button">{isEditingCommission ? "Done" : "Edit"}</button></div>
            {isEditingCommission ? (
              <div className="detail-grid detail-grid--inside">
                <label>Territory<select onChange={(event) => selectCommissionTerritory(event.target.value)} value={commissionSelection.territoryId}><option value="">Not assigned</option>{territories.map((territory) => <option key={territory.id} value={territory.id}>{territory.name}</option>)}</select></label>
                <label>Sales Agency<select disabled={!commissionSelection.territoryId} onChange={(event) => { setCommissionSelection((current) => ({ ...current, agencyId: event.target.value, salesRepId: "" })); setHasCommissionOverride(true); }} value={commissionSelection.agencyId}><option value="">Not assigned</option>{selectedTerritory?.agencies.map((agency) => <option key={agency.id} value={agency.id}>{agency.name}</option>)}</select></label>
                <label>Sales Rep<select disabled={!commissionSelection.agencyId} onChange={(event) => { setCommissionSelection((current) => ({ ...current, salesRepId: event.target.value })); setHasCommissionOverride(true); }} value={commissionSelection.salesRepId}><option value="">Not assigned</option>{selectedAgencyReps.map((rep) => <option key={rep.id} value={rep.id}>{rep.name}</option>)}</select></label>
                <label className="inline-checkbox">Pay Commission<input checked={payCommission} onChange={(event) => setPayCommission(event.target.checked)} type="checkbox" /></label>
                {payCommission ? <label>Commission Rate (%)<input disabled={!commissionSelection.agencyId} max="100" min="0" onChange={(event) => setCommissionRate(event.target.value)} step="0.01" type="number" value={commissionRate} /></label> : null}
              </div>
            ) : (
              <div className="detail-grid detail-grid--inside"><article className="info-panel"><dl><div><dt>Territory</dt><dd>{selectedTerritory?.name ?? "Not assigned"}</dd></div><div><dt>Sales Agency</dt><dd>{selectedAgency?.name ?? "Not assigned"}</dd></div><div><dt>Sales Rep</dt><dd>{selectedSalesRep?.name ?? "Not assigned"}</dd></div><div><dt>Pay Commission</dt><dd>{payCommission ? "Yes" : "No"}</dd></div>{payCommission ? <div><dt>Commission Rate</dt><dd>{commissionRate ? `${commissionRate}%` : "Not assigned"}</dd></div> : null}</dl></article></div>
            )}
          </article>

          <article className="data-section">
            <div className="section-title"><h3>Order Lines</h3><button className="text-action text-action--button" onClick={() => returnToEditor("order-products")} type="button">Edit</button></div>
            <div className="table-wrap"><table className="data-table"><thead><tr><th>SKU</th><th>Product</th><th>Brand</th><th>Qty</th><th>Unit Price</th><th>Discount</th><th>Line Total</th></tr></thead><tbody>{lines.map((line) => <tr key={line.id}><td>{line.sku}</td><td>{line.name}</td><td>{line.brandName}</td><td>{line.quantity}</td><td>{money.format(line.unitPrice)}</td><td>{line.discountPercent}%</td><td>{money.format(line.quantity * line.unitPrice * (1 - line.discountPercent / 100))}</td></tr>)}</tbody></table></div>
            <div className="order-total"><span>Order Subtotal</span><strong>{money.format(subtotal)}</strong></div>
            {selectedFreightLevel ? <div className="order-total"><span>Default Freight Charge ({selectedFreightLevel.levelName}: FFA {money.format(selectedFreightLevel.freeFreightAllowance)}, {selectedFreightLevel.freightRatePercent}%)</span><strong>{defaultFreightCharge === 0 ? "Free Freight" : wholeMoney.format(defaultFreightCharge)}</strong></div> : null}
            {isDropship && dropshipSettings.isActive ? <div className="order-total"><span>Dropship Fee ({dropshipSettings.ratePercent}%)</span><strong>{money.format(estimatedDropshipFee)}</strong></div> : null}
            <div className="order-total"><span>Estimated Order Total</span><strong>{money.format(subtotal + defaultFreightCharge + estimatedDropshipFee)}</strong></div>
          </article>

          <article className="data-section">
            <div className="section-title"><h3>Notes</h3><button className="text-action text-action--button" onClick={() => returnToEditor("order-notes")} type="button">Edit</button></div>
            <p className="section-copy">{confirmation.notes || "No internal notes."}</p>
          </article>

          <div className="form-actions">
            <button className="secondary-action" disabled={isSaving} onClick={() => returnToEditor()} type="button">Back to Edit</button>
            <button className="primary-action" disabled={isSaving} onClick={createConfirmedOrder} type="button">{isSaving ? "Creating Order..." : "Confirm and Create Order"}</button>
          </div>
        </section>
      ) : null}
    </form>
  );
}
