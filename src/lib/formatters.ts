const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export const numberFormatter = new Intl.NumberFormat("en-US");

export function addressSnapshotLines(
  snapshot: Record<string, unknown> | null,
  fallbackName?: string,
) {
  const value = snapshot ?? {};
  const name = String(
    value.ship_to_display_name ??
      value.bill_to_display_name ??
      value.location_name ??
      fallbackName ??
      "",
  ).trim();
  const cityStatePostal = [value.city, value.state_province, value.postal_code]
    .filter(Boolean)
    .map(String)
    .join(", ");
  const shippingContact = [
    value.shipping_contact_name,
    value.shipping_contact_phone,
    value.shipping_contact_email,
  ]
    .filter(Boolean)
    .map(String)
    .join(" | ");

  return [
    name,
    value.address_line_1,
    value.address_line_2,
    cityStatePostal,
    value.country,
    shippingContact,
  ]
    .filter(Boolean)
    .map(String);
}

export function money(value: number | null | undefined) {
  return currencyFormatter.format(Number(value ?? 0));
}

export function label(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function dateLabel(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function timestampLabel(value: string | null | undefined) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function shippingQuantityLabel(
  value: { shipped: number; total: number } | null | undefined,
) {
  const shipped = Number(value?.shipped ?? 0);
  const total = Number(value?.total ?? 0);
  const formatQuantity = (quantity: number) =>
    Number.isInteger(quantity)
      ? String(quantity)
      : quantity.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return `${formatQuantity(shipped)}/${formatQuantity(total)}`;
}

export function fileSizeLabel(value: number | null | undefined) {
  const size = Number(value ?? 0);

  if (!size) {
    return "Size not set";
  }

  if (size < 1024 * 1024) {
    return `${Math.ceil(size / 1024)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
