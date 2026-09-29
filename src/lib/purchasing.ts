export const DEFAULT_IMPORT_TARIFF_RATE_PERCENT = 39;
export const DEFAULT_VENDOR_PRODUCTION_COMMITMENT = "By accepting this purchase order, the vendor confirms its commitment to complete production by the stated Expected Ready Date. Delays may be subject to a late-performance charge of up to 1% of the applicable purchase-order value for each day of delay, subject to the agreed terms between Terracotta Designs / Kanova & Co. and the vendor.";

export function expectedImportTariff(subtotal: number, tariffRatePercent = DEFAULT_IMPORT_TARIFF_RATE_PERCENT) {
  return Math.round(subtotal * (tariffRatePercent / 100) * 100) / 100;
}
