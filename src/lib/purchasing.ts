export const DEFAULT_IMPORT_TARIFF_RATE_PERCENT = 39;
export const DEFAULT_VENDOR_PRODUCTION_COMMITMENT = "By accepting this purchase order, the vendor confirms its commitment to complete production by the stated Expected Ready Date. Delays may be subject to a late-performance charge of up to 1% of the applicable purchase-order value for each day of delay, subject to the agreed terms between Terracotta Designs / Kanova & Co. and the vendor.";
export const DEFAULT_CONTAINER_STATUSES = ["Draft", "Booked", "Loaded", "On Water", "Customs Cleared", "Delivered", "Cancelled"];

export type ContainerStatusOption = { code: string; label: string };

export function containerStatusCode(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export function configuredContainerStatusOptions(value: unknown): ContainerStatusOption[] {
  const labels = Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : DEFAULT_CONTAINER_STATUSES;
  const options = labels.map((label) => label.trim()).filter(Boolean).map((label) => ({ code: containerStatusCode(label), label })).filter((option) => option.code);
  return options.length ? options.filter((option, index) => options.findIndex((candidate) => candidate.code === option.code) === index) : DEFAULT_CONTAINER_STATUSES.map((label) => ({ code: containerStatusCode(label), label }));
}

export function expectedImportTariff(subtotal: number, tariffRatePercent = DEFAULT_IMPORT_TARIFF_RATE_PERCENT) {
  return Math.round(subtotal * (tariffRatePercent / 100) * 100) / 100;
}
