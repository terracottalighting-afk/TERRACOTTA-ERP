import Link from "next/link";
import { ModulePlaceholder } from "@/components/ui";
import { RgaReplacementShipToFields } from "@/components/rga/rga-replacement-ship-to-fields";

export async function RgaReplacementOrderConfirmPage({ rgaId, createAction }: { rgaId?: string; createAction: (formData: FormData) => Promise<void> }) {
  if (!rgaId) return <ModulePlaceholder moduleName="Select an approved replacement RGA" />;
  const { createSupabaseAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createSupabaseAdminClient();
  const { data: rga } = await supabase.from("rga").select("id, rga_number, customer_account_id, customer_name_snapshot, original_customer_po_number_snapshot, sales_order_id, approved_resolution_type").eq("id", rgaId).maybeSingle();
  if (!rga || rga.approved_resolution_type !== "replacement") return <ModulePlaceholder moduleName="Replacement RGA not found" />;
  const [{ data: sourceOrder }, { data: locations }, { data: lines }] = await Promise.all([
    rga.sales_order_id ? supabase.from("sales_order").select("customer_location_id").eq("id", rga.sales_order_id).maybeSingle() : Promise.resolve({ data: null }),
    supabase.from("customer_location").select("id, location_name, address_line_1, city, state_province, postal_code, country, receiver_name, email, phone").eq("customer_account_id", rga.customer_account_id).eq("is_shipping_address", true).eq("status", "active").order("is_default_ship_to", { ascending: false }),
    supabase.from("rga_line").select("id, product_sku_snapshot, product_name_snapshot, quantity_authorized, quantity_replaced").eq("rga_id", rga.id).order("product_sku_snapshot"),
  ]);
  const remainingLines = (lines ?? []).filter((line) => Number(line.quantity_authorized) > Number(line.quantity_replaced));
  return <section className="dashboard-panel"><section className="record-hero"><div><Link className="context-parent-link" href={`/?module=rga-solution&rga=${rga.id}`}>Back to RGA Solution</Link><span className="eyebrow">Replacement Order</span><h2>Confirm Replacement Order</h2><p>{rga.customer_name_snapshot} | Original PO {rga.original_customer_po_number_snapshot ?? "Not set"}</p></div></section><form action={createAction} className="customer-form"><input name="rga_id" type="hidden" value={rga.id} /><fieldset><legend>Replacement Items</legend><div className="table-wrap"><table className="data-table"><thead><tr><th>SKU</th><th>Item</th><th>Qty to Replace</th></tr></thead><tbody>{remainingLines.map((line) => <tr key={line.id}><td>{line.product_sku_snapshot}</td><td>{line.product_name_snapshot}</td><td>{Number(line.quantity_authorized) - Number(line.quantity_replaced)}</td></tr>)}</tbody></table></div></fieldset><fieldset><legend>Ship-to Address</legend><p className="fieldset-note">Choose the original or another saved customer address, or enter a direct-to-customer shipping address.</p><RgaReplacementShipToFields defaultLocationId={sourceOrder?.customer_location_id ?? ""} locations={locations ?? []} /></fieldset><div className="form-actions"><button className="primary-action" type="submit">Confirm and Create Replacement Order</button><Link className="secondary-action secondary-action--light" href={`/?module=rga-solution&rga=${rga.id}`}>Cancel</Link></div></form></section>;
}
