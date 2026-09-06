import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { productPartRoleOptions } from "@/lib/product-part-roles";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { WarehouseDirectory } from "./warehouse-directory";

type AdminTab = "users" | "products" | "warehouse" | "territory";

export async function AdminDashboard({ deactivateWarehousesAction, selectedTab }: { deactivateWarehousesAction: (formData: FormData) => Promise<void>; selectedTab?: string }) {
  const supabase = createSupabaseAdminClient();
  const [warehousesResult, deactivatedWarehousesResult, territoriesResult, brandsResult, suitesResult, categoriesResult, finishesResult, accountTypesResult, businessTypesResult, agenciesResult, salesRepsResult] = await Promise.all([
    supabase.from("warehouse").select("id, warehouse_code, name, is_active").eq("is_active", true).order("name", { ascending: true }),
    supabase.from("warehouse").select("id, warehouse_code, name, is_active").eq("is_active", false).order("name", { ascending: true }),
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
  const failedResult = [warehousesResult, deactivatedWarehousesResult, territoriesResult, brandsResult, suitesResult, categoriesResult, finishesResult, accountTypesResult, businessTypesResult, agenciesResult, salesRepsResult].find((result) => result.error);
  if (failedResult?.error) throw new Error(failedResult.error.message);

  const warehouses = warehousesResult.data ?? [];
  const deactivatedWarehouses = deactivatedWarehousesResult.data ?? [];
  const territories = territoriesResult.data ?? [];
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

  const activeTab: AdminTab = selectedTab === "products" || selectedTab === "warehouse" || selectedTab === "territory" ? selectedTab : "users";

  return <section className="dashboard-panel">
    <section className="account-header"><div><span className="eyebrow">System Administration</span><h2>Admin Dashboard</h2><p className="fieldset-note">Central register for operational setup, shared lists, and user access.</p></div></section>
    <section className="tab-strip" aria-label="Administration sections">
      <Link aria-current={activeTab === "users" ? "page" : undefined} href="/?module=admin&admin_tab=users">Users and Roles</Link>
      <Link aria-current={activeTab === "products" ? "page" : undefined} href="/?module=admin&admin_tab=products">Product Settings</Link>
      <Link aria-current={activeTab === "warehouse" ? "page" : undefined} href="/?module=admin&admin_tab=warehouse">Warehouse Settings</Link>
      <Link aria-current={activeTab === "territory" ? "page" : undefined} href="/?module=admin&admin_tab=territory">Territory Settings</Link>
    </section>
    <section className="section-stack">
      <article className={activeTab === "warehouse" ? "data-section" : "data-section tab-panel-hidden"}>
        <WarehouseDirectory deactivateAction={deactivateWarehousesAction} deactivatedWarehouses={deactivatedWarehouses} warehouses={warehouses} />
      </article>
      <article className={activeTab === "territory" ? "data-section" : "data-section tab-panel-hidden"}><div className="section-title"><h3>Territory Settings</h3></div><div className="compact-list">
        {territories.map((territory) => <div className="compact-row" key={territory.id}><div><strong>{territory.name}</strong><span>{territory.territory_code}</span></div><StatusBadge tone={territory.status === "active" ? "good" : "warn"} value={territory.status} /></div>)}
        {territories.length === 0 ? <p className="empty-state">No territories have been configured.</p> : null}
      </div></article>
      <article className={activeTab === "products" ? "data-section" : "data-section tab-panel-hidden"}><div className="section-title"><h3>Regular Product Settings</h3></div><p className="fieldset-note">Product categories, signature suites, and brands are the shared product lists used throughout Product Master.</p><div className="metric-grid">{configurationCounts.slice(0, 4).map((item) => <div className="metric" key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}</div></article>
      <article className={activeTab === "products" ? "data-section" : "data-section tab-panel-hidden"}><div className="section-title"><h3>Part Roles</h3></div><p className="fieldset-note">These roles are available when linking a component part to a product.</p><div className="badge-row">{productPartRoleOptions.map((role) => <StatusBadge key={role} value={role} />)}</div></article>
      <article className={activeTab === "users" ? "data-section" : "data-section tab-panel-hidden"}><div className="section-title"><h3>Users and Access Roles</h3></div><p className="fieldset-note">User accounts and security roles are intentionally protected from the general application database role. This tab reserves the management area; its controlled user-administration screen will be added with the required access policy.</p></article>
    </section>
  </section>;
}
