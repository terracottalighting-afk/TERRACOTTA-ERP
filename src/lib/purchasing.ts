export const DEFAULT_IMPORT_TARIFF_RATE = 0.39;

export function expectedImportTariff(subtotal: number) {
  return Math.round(subtotal * DEFAULT_IMPORT_TARIFF_RATE * 100) / 100;
}
