import Link from "next/link";
import { createSupabaseAdminClient, createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";
import { ProductSettingsManager } from "./product-settings-manager";
import { TerritoryDirectory } from "./territory-directory";
import { WarehouseDirectory } from "./warehouse-directory";

type AdminTab = "users" | "products" | "warehouse" | "territory";

export async function AdminDashboard({ assignStyleAction, deactivateProductSettingAction, deactivateWarehousesAction, error, saveProductSettingAction, selectedTab }: { assignStyleAction: (formData: FormData) => Promise<void>; deactivateProductSettingAction: (formData: FormData) => Promise<void>; deactivateWarehousesAction: (formData: FormData) => Promise<void>; error?: string; saveProductSettingAction: (formData: FormData) => Promise<void>; selectedTab?: string }) {
  const supabase = createSupabaseAdminClient();
  const untypedSupabase = createSupabaseUntypedAdminClient();
  const [warehousesResult, deactivatedWarehousesResult, territoriesResult, brandsResult, suitesResult, stylesResult, categoriesResult, materialsResult, finishesResult, partRolesResult] = await Promise.all([
    supabase.from("warehouse").select("id, warehouse_code, name, is_active").eq("is_active", true).order("name", { ascending: true }),
    supabase.from("warehouse").select("id, warehouse_code, name, is_active").eq("is_active", false).order("name", { ascending: true }),
    supabase.from("territory").select("id, territory_code, name, description, state_codes_json, status").order("name", { ascending: true }),
    supabase.from("brand").select("id, brand_code, name, legal_company_name, is_active").order("name", { ascending: true }),
    supabase.from("product_signature_suite").select("id, suite_code, name, description, brand_id, is_active").order("name", { ascending: true }),
    untypedSupabase.from("product_style").select("id, style_code, name, description, brand_id, signature_suite_id, is_active").order("name", { ascending: true }),
    supabase.from("product_category").select("id, category_code, name, is_active").order("name", { ascending: true }),
    untypedSupabase.from("material").select("id, material_name, description, is_active").order("material_name", { ascending: true }),
    supabase.from("finish").select("id, finish_name, description, is_active").order("finish_name", { ascending: true }),
    untypedSupabase.from("product_part_role_setting").select("id, role_code, name, is_active").order("name", { ascending: true }),
  ]);
  const failedResult = [warehousesResult, deactivatedWarehousesResult, territoriesResult, brandsResult, suitesResult, stylesResult, categoriesResult, materialsResult, finishesResult, partRolesResult].find((result) => result.error);
  if (failedResult?.error) throw new Error(failedResult.error.message);

  const warehouses = warehousesResult.data ?? [];
  const deactivatedWarehouses = deactivatedWarehousesResult.data ?? [];
  const territories = territoriesResult.data ?? [];

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
      <article className={activeTab === "territory" ? "data-section" : "data-section tab-panel-hidden"}><TerritoryDirectory territories={territories} /></article>
      <article className={activeTab === "products" ? "data-section tab-panel--flush" : "data-section tab-panel-hidden"}><ProductSettingsManager assignStyleAction={assignStyleAction} brands={brandsResult.data ?? []} categories={categoriesResult.data ?? []} deactivateAction={deactivateProductSettingAction} error={error} finishes={finishesResult.data ?? []} materials={materialsResult.data ?? []} partRoles={partRolesResult.data ?? []} saveAction={saveProductSettingAction} styles={stylesResult.data ?? []} suites={suitesResult.data ?? []} /></article>
      <article className={activeTab === "users" ? "data-section" : "data-section tab-panel-hidden"}><div className="section-title"><h3>Users and Access Roles</h3></div><p className="fieldset-note">User accounts and security roles are intentionally protected from the general application database role. This tab reserves the management area; its controlled user-administration screen will be added with the required access policy.</p></article>
    </section>
  </section>;
}
