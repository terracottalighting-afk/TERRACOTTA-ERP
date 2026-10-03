alter table container_vendor_invoice_line
  add column if not exists po_number text,
  add column if not exists factory_sku text,
  add column if not exists hs_code text,
  add column if not exists pieces_per_carton numeric(14,3),
  add column if not exists carton_count numeric(14,3);
