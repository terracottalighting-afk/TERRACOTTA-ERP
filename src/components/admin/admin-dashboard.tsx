import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { productPartRoleOptions } from "@/lib/product-part-roles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type AdminTab = "users" | "products" | "warehouse";

export async function AdminDashboard({ selectedTab }: { selectedTab?: string }) {
  const supabase = createSupabaseAdminClient();
  const [warehousesResult, locationsResult, territoriesResult, brandsResult, suitesResult, categoriesResult, finishesResult, accountTypesResult, businessTypesResult, agenciesResult, salesRepsResult] = await Promise.all([
    supabase.from("warehouse").select("id, warehouse_code, name, is_active").order("name", { ascending: true }),
    supabase.from("warehouse_location").select("id, warehouse_id, location_code, location_name, location_type, is_active, is_pickable").order("location_code", { ascending: true }),
    supabase.from("territory").select("id, territory_code, name, status").order("name", { ascending: true }),
    supabase.from("brand").select("id"),
    supabase.from("product_signature_suite").select("id"),
    supabase.from("product_category").select("id"),
    supabase.from("finish").select("id"),
    supabase.from("customer_account_type").select("id"),
    supabase.from("customer_business_type").select("id"),
    supabase.from("sales_rep_agency").select("id"),
    supabase.from("sales_rep").select("id"),
  ]);
  const failedResult = [warehousesResult, locationsResult, territoriesResult, brandsResult, suitesResult, categoriesResult, finishesResult, accountTypesResult, businessTypesResult, agenciesResult, salesRepsResult].find((result) => result.error);
  if (failedResult?.error) throw new Error(failedResult.error.message);

  const warehouses = warehousesResult.data ?? [];
  const locations = locationsResult.data ?? [];
  const territories = territoriesResult.data ?? [];
  const warehouseNameById = new Map(warehouses.map((warehouse) => [warehouse.id, warehouse.name]));
  const configurationCounts = [
    { label: "Brands", value: brandsResult.data?.length ?? 0 },
    { label: "Signature Suites", value: suitesResult.data?.length ?? 0 },
    { label: "Product Categories", value: categoriesResult.data?.length ?? 0 },
    { label: "Finishes", value: finishesResult.data?.length ?? 0 },
    { label: "Account Types", value: accountTypesResult.data?.length ?? 0 },
    { label: "Business Types", value: businessTypesResult.data?.length ?? 0 },
    { label: "Rep Agencies", value: agenciesResult.data?.length ?? 0 },
    { label: "Sales Reps", value: salesRepsResult.data?.length ?? 0 },
  ];

  const activeTab: AdminTab = selectedTab === "products" || selectedTab === "warehouse" ? selectedTab : "users";

  return <section className="dashboard-panel">
    <section className="account-header"><div><span className="eyebrow">System Administration</span><h2>Admin Dashboard</h2><p className="fieldset-note">Central register for operational setup, shared lists, and user access.</p></div></section>
    <section className="tab-strip" aria-label="Administration sections">
      <Link aria-current={activeTab === "users" ? "page" : undefined} href="/?module=admin&admin_tab=users">Users and Roles</Link>
      <Link aria-current={activeTab === "products" ? "page" : undefined} href="/?module=admin&admin_tab=products">Product Settings</Link>
      <Link aria-current={activeTab === "warehouse" ? "page" : undefined} href="/?module=admin&admin_tab=warehouse">Warehouse Settings</Link>
    </section>
    <section className="section-stack">
      <article className={activeTab === "warehouse" ? "data-section" : "data-section tab-panel-hidden"}>
        <section className="metric-grid">
          <div className="metric"><span>Warehouses</span><strong>{warehouses.length}</strong></div>
          <div className="metric"><span>Legacy Bins / Locations</span><strong>{locations.length}</strong></div>
          <div className="metric"><span>Existing Bins / Locations</span><strong>{locations.length}</strong></div>
        </section>
        <div className="section-title"><h3>Warehouse and Bin Setup</h3><Link className="small-action" href="/?module=admin-warehouse">Add Warehouse</Link></div>
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Warehouse</th><th>Code</th><th>Bins / Locations</th><th>Status</th></tr></thead><tbody>
          {warehouses.map((warehouse) => { const count = locations.filter((location) => location.warehouse_id === warehouse.id).length; return <tr key={warehouse.id}><td><Link className="record-link" href={`/?module=admin-warehouse&warehouse=${warehouse.id}`}>{warehouse.name}</Link></td><td>{warehouse.warehouse_code}</td><td>{count}</td><td><StatusBadge tone={warehouse.is_active ? "good" : "warn"} value={warehouse.is_active ? "Active" : "Inactive"} /></td></tr>; })}
          {warehouses.length === 0 ? <tr><td colSpan={4}>No warehouses have been configured.</td></tr> : null}
        </tbody></table></div>
        <div className="compact-list">
          {locations.map((location) => <div className="compact-row" key={location.id}><div><strong>{location.location_code}</strong><span>{location.location_name ?? "No location name"}</span></div><span>{warehouseNameById.get(location.warehouse_id) ?? "Warehouse"}</span><div className="badge-row"><StatusBadge value={location.location_type} />{location.is_pickable ? <StatusBadge tone="good" value="Pickable" /> : null}{!location.is_active ? <StatusBadge tone="warn" value="Inactive" /> : null}</div></div>)}
          {locations.length === 0 ? <p className="empty-state">No bins or warehouse locations have been configured.</p> : null}
        </div>
      </article>
      <article className={activeTab === "warehouse" ? "data-section" : "data-section tab-panel-hidden"}><div className="section-title"><h3>Territories and Sales Coverage</h3></div><div className="compact-list">
        {territories.map((territory) => <div className="compact-row" key={territory.id}><div><strong>{territory.name}</strong><span>{territory.territory_code}</span></div><StatusBadge tone={territory.status === "active" ? "good" : "warn"} value={territory.status} /></div>)}
        {territories.length === 0 ? <p className="empty-state">No territories have been configured.</p> : null}
      </div></article>
      <article className={activeTab === "products" ? "data-section" : "data-section tab-panel-hidden"}><div className="section-title"><h3>Regular Product Settings</h3></div><p className="fieldset-note">Product categories, signature suites, and brands are the shared product lists used throughout Product Master.</p><div className="metric-grid">{configurationCounts.slice(0, 4).map((item) => <div className="metric" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></article>
      <article className={activeTab === "products" ? "data-section" : "data-section tab-panel-hidden"}><div className="section-title"><h3>Part Roles</h3></div><p className="fieldset-note">These roles are available when linking a component part to a product.</p><div className="badge-row">{productPartRoleOptions.map((role) => <StatusBadge key={role} value={role} />)}</div></article>
      <article className={activeTab === "users" ? "data-section" : "data-section tab-panel-hidden"}><div className="section-title"><h3>Users and Access Roles</h3></div><p className="fieldset-note">User accounts and security roles are intentionally protected from the general application database role. This tab reserves the management area; its controlled user-administration screen will be added with the required access policy.</p></article>
    </section>
  </section>;
}
