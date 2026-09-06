import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { createSupabaseAdminClient, createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";

export async function WarehouseInfoPage({ warehouseId }: { warehouseId?: string }) {
  if (!warehouseId) return <section className="dashboard-panel"><p className="empty-state">Select a warehouse from Warehouse Settings.</p></section>;

  const supabase = createSupabaseAdminClient();
  const untypedSupabase = createSupabaseUntypedAdminClient();
  const [{ data: warehouse, error: warehouseError }, { data: zones, error: zonesError }, { data: aisles, error: aislesError }, { data: sections, error: sectionsError }] = await Promise.all([
    supabase.from("warehouse").select("id, warehouse_code, name, address_line_1, address_line_2, city, state_province, postal_code, country, notes, is_active").eq("id", warehouseId).maybeSingle(),
    supabase.from("warehouse_zone").select("id, zone_code, name, description, is_active").eq("warehouse_id", warehouseId).order("sort_order"),
    untypedSupabase.from("warehouse_aisle").select("id, warehouse_zone_id, aisle_code, name, description, is_active").order("sort_order"),
    untypedSupabase.from("warehouse_location").select("id, warehouse_aisle_id, location_code, location_name, location_type, is_active").eq("warehouse_id", warehouseId).order("location_code"),
  ]);
  const failed = [warehouseError, zonesError, aislesError, sectionsError].find(Boolean);
  if (failed) throw new Error(failed.message);
  if (!warehouse) return <section className="dashboard-panel"><p className="empty-state">Warehouse not found.</p></section>;

  return <section className="dashboard-panel">
    <section className="account-header"><div><span className="eyebrow">Warehouse Settings</span><h2>{warehouse.name}</h2><Link className="text-action" href="/?module=admin&admin_tab=warehouse">Back to Warehouse Settings</Link></div></section>
    <article className="info-panel"><div className="panel-title-row"><h3>Warehouse Profile</h3><Link className="text-action" href={`/?module=admin-warehouse-edit&warehouse=${warehouse.id}`}>Edit</Link></div><div className="detail-grid"><dl><div><dt>Warehouse Name</dt><dd>{warehouse.name}</dd></div><div><dt>Warehouse Code</dt><dd>{warehouse.warehouse_code}</dd></div><div><dt>Status</dt><dd><StatusBadge tone={warehouse.is_active ? "good" : "warn"} value={warehouse.is_active ? "Active" : "Inactive"} /></dd></div><div><dt>Notes</dt><dd>{warehouse.notes ?? "Not set"}</dd></div></dl><dl><div><dt>Address</dt><dd>{[warehouse.address_line_1, warehouse.address_line_2].filter(Boolean).join(", ") || "Not set"}</dd></div><div><dt>City / State</dt><dd>{[warehouse.city, warehouse.state_province, warehouse.postal_code].filter(Boolean).join(", ") || "Not set"}</dd></div><div><dt>Country</dt><dd>{warehouse.country}</dd></div></dl></div></article>
    <article className="data-section">
      <div className="section-title"><h3>Zones, Aisles, and Sections</h3><div className="section-actions"><Link className="text-action" href={`/?module=admin-zone-add&warehouse=${warehouse.id}`}>Add Zone</Link><Link className="text-action" href={`/?module=admin-aisle-add&warehouse=${warehouse.id}`}>Add Aisle</Link><Link className="text-action" href={`/?module=admin-section-add&warehouse=${warehouse.id}`}>Add Section</Link></div></div>
      <div className="compact-list">
        {(zones ?? []).map((zone) => {
          const zoneAisles = (aisles ?? []).filter((aisle) => aisle.warehouse_zone_id === zone.id);
          return <details className="admin-hierarchy" key={zone.id}><summary><span><strong>{zone.zone_code}</strong> {zone.name}</span><StatusBadge tone={zone.is_active ? "good" : "warn"} value={zone.is_active ? "Active" : "Inactive"} /></summary><p className="fieldset-note">{zone.description ?? "No zone description."}</p><div className="hierarchy-children">{zoneAisles.map((aisle) => { const aisleSections = (sections ?? []).filter((section) => section.warehouse_aisle_id === aisle.id); return <details key={aisle.id}><summary><span><strong>{aisle.aisle_code}</strong> {aisle.name}</span><StatusBadge tone={aisle.is_active ? "good" : "warn"} value={aisle.is_active ? "Active" : "Inactive"} /></summary><div className="compact-list">{aisleSections.map((section) => <div className="compact-row" key={section.id}><div><strong>{section.location_code}</strong><span>{section.location_name ?? "No section name"}</span></div><StatusBadge value={section.location_type} /></div>)}{aisleSections.length === 0 ? <p className="empty-state">No sections in this aisle.</p> : null}</div></details>; })}{zoneAisles.length === 0 ? <p className="empty-state">No aisles in this zone.</p> : null}</div></details>;
        })}
        {(zones ?? []).length === 0 ? <p className="empty-state">No zones have been added to this warehouse yet.</p> : null}
      </div>
    </article>
  </section>;
}
