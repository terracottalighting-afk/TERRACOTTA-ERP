import Link from "next/link";
import { createSupabaseAdminClient, createSupabaseUntypedAdminClient } from "@/lib/supabase/admin";
import { ProductSettingsManager } from "./product-settings-manager";
import { CustomerSettingsManager } from "./customer-settings-manager";
import { TerritoryDirectory } from "./territory-directory";
import { WarehouseDirectory } from "./warehouse-directory";
import { FreightLevelManager } from "./freight-level-manager";
import { FreightCarrierManager } from "./freight-carrier-manager";
import { DropshipSettingsManager } from "./dropship-settings-manager";
import { PrimaryShowroomSettingsManager } from "./primary-showroom-settings-manager";
import { PurchasingSettingsManager } from "./purchasing-settings-manager";
import { ReportSettingsManager } from "./report-settings-manager";
import { configuredContainerStatusOptions, DEFAULT_CONTAINER_STATUSES } from "@/lib/purchasing";
import type { ReportFieldMapping } from "@/lib/report-settings";

type AdminTab = "users" | "products" | "warehouse" | "territory" | "customers" | "freight" | "purchasing" | "reports";

export async function AdminDashboard({ assignStyleAction, deactivateCustomerSettingAction, deactivateProductSettingAction, deactivateWarehousesAction, error, saveCustomerSettingAction, saveDropshipSettingsAction, saveFreightCarrierAction, saveFreightLevelAction, savePrimaryShowroomSettingsAction, saveProductSettingAction, savePurchasingSettingsAction, saveReportSettingsAction, selectedFreightTab, selectedTab }: { assignStyleAction: (formData: FormData) => Promise<void>; deactivateCustomerSettingAction: (formData: FormData) => Promise<void>; deactivateProductSettingAction: (formData: FormData) => Promise<void>; deactivateWarehousesAction: (formData: FormData) => Promise<void>; error?: string; saveCustomerSettingAction: (formData: FormData) => Promise<void>; saveDropshipSettingsAction: (formData: FormData) => Promise<void>; saveFreightCarrierAction: (formData: FormData) => Promise<void>; saveFreightLevelAction: (formData: FormData) => Promise<void>; savePrimaryShowroomSettingsAction: (formData: FormData) => Promise<void>; saveProductSettingAction: (formData: FormData) => Promise<void>; savePurchasingSettingsAction: (formData: FormData) => Promise<void>; saveReportSettingsAction: (formData: FormData) => Promise<void>; selectedFreightTab?: string; selectedTab?: string }) {
  const supabase = createSupabaseAdminClient();
  const untypedSupabase = createSupabaseUntypedAdminClient();
  const [warehousesResult, deactivatedWarehousesResult, territoriesResult, brandsResult, suitesResult, stylesResult, categoriesResult, materialsResult, finishesResult, partRolesResult, customerAccountTypesResult, customerBusinessTypesResult, customerStatusesResult, freightLevelsResult, freightLevelGroupsResult, freightCarriersResult, dropshipSettingsResult, primaryShowroomSettingsResult, purchasingTariffRateResult, purchasingCommitmentResult, purchasingContainerStatusesResult, reportMappingsResult] = await Promise.all([
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
    supabase.from("customer_account_type").select("id, type_code, name, description, is_active, is_rep_type").order("name", { ascending: true }),
    supabase.from("customer_business_type").select("id, type_code, name, description, is_active").order("name", { ascending: true }),
    untypedSupabase.from("customer_status_setting").select("id, status_code, name, description, is_active").order("sort_order", { ascending: true }),
    untypedSupabase.from("freight_level").select("id, level_name, free_freight_allowance, freight_rate_percent, sort_order, is_active").order("sort_order", { ascending: true }).order("level_name", { ascending: true }),
    untypedSupabase.from("freight_level_customer_group").select("id, freight_level_id, account_type_id, primary_showroom_requirement"),
    untypedSupabase.from("freight_carrier").select("id, carrier_name, freight_type, contact_name, contact_email, website, is_active").order("carrier_name", { ascending: true }),
    untypedSupabase.from("system_setting").select("setting_value").eq("setting_key", "dropship_settings").maybeSingle(),
    untypedSupabase.from("system_setting").select("setting_value").eq("setting_key", "BackTrack_Display_PO_Period").maybeSingle(),
    untypedSupabase.from("system_setting").select("setting_value").eq("setting_key", "purchasing_import_tariff_rate_percent").maybeSingle(),
    untypedSupabase.from("system_setting").select("setting_value").eq("setting_key", "purchasing_vendor_production_commitment").maybeSingle(),
    untypedSupabase.from("system_setting").select("setting_value").eq("setting_key", "purchasing_container_statuses").maybeSingle(),
    untypedSupabase.from("report_field_mapping").select("id, report_type, field_code, display_label, data_source, sort_order").order("report_type").order("sort_order"),
  ]);
  const failedResult = [warehousesResult, deactivatedWarehousesResult, territoriesResult, brandsResult, suitesResult, stylesResult, categoriesResult, materialsResult, finishesResult, partRolesResult, customerAccountTypesResult, customerBusinessTypesResult, customerStatusesResult, freightLevelsResult, freightLevelGroupsResult, freightCarriersResult, dropshipSettingsResult, primaryShowroomSettingsResult, purchasingTariffRateResult, purchasingCommitmentResult, purchasingContainerStatusesResult, reportMappingsResult].find((result) => result.error);
  if (failedResult?.error) throw new Error(failedResult.error.message);

  const warehouses = warehousesResult.data ?? [];
  const deactivatedWarehouses = deactivatedWarehousesResult.data ?? [];
  const territories = territoriesResult.data ?? [];
  const dropshipSettings = dropshipSettingsResult.data?.setting_value as { isActive?: unknown; ratePercent?: unknown; residentialSurchargeActive?: unknown; residentialSurchargeRatePercent?: unknown } | null;
  const dropshipRatePercent = Number(dropshipSettings?.ratePercent ?? 0);
  const residentialSurchargeRatePercent = Number(dropshipSettings?.residentialSurchargeRatePercent ?? 0);
  const primaryShowroomBacktrackPeriod = Number(primaryShowroomSettingsResult.data?.setting_value ?? 12);
  const purchasingTariffRatePercent = Number(purchasingTariffRateResult.data?.setting_value ?? 39);
  const purchasingCommitment = String(purchasingCommitmentResult.data?.setting_value ?? "By accepting this purchase order, the vendor confirms its commitment to complete production by the stated Expected Ready Date. Delays may be subject to a late-performance charge of up to 1% of the applicable purchase-order value for each day of delay, subject to the agreed terms between Terracotta Designs / Kanova & Co. and the vendor.");
  const purchasingContainerStatuses = configuredContainerStatusOptions(purchasingContainerStatusesResult.data?.setting_value ?? DEFAULT_CONTAINER_STATUSES).map((status) => status.label);

  const activeTab: AdminTab = selectedTab === "products" || selectedTab === "warehouse" || selectedTab === "territory" || selectedTab === "customers" || selectedTab === "freight" || selectedTab === "purchasing" || selectedTab === "reports" ? selectedTab : "users";

  return <section className="dashboard-panel">
    <section className="account-header"><div><span className="eyebrow">System Administration</span><h2>Admin Dashboard</h2><p className="fieldset-note">Central register for operational setup, shared lists, and user access.</p></div></section>
    <section className="tab-strip" aria-label="Administration sections">
      <Link aria-current={activeTab === "users" ? "page" : undefined} href="/?module=admin&admin_tab=users">Users and Roles</Link>
      <Link aria-current={activeTab === "products" ? "page" : undefined} href="/?module=admin&admin_tab=products">Product Settings</Link>
      <Link aria-current={activeTab === "warehouse" ? "page" : undefined} href="/?module=admin&admin_tab=warehouse">Warehouse Settings</Link>
      <Link aria-current={activeTab === "territory" ? "page" : undefined} href="/?module=admin&admin_tab=territory">Territory Settings</Link>
      <Link aria-current={activeTab === "customers" ? "page" : undefined} href="/?module=admin&admin_tab=customers">Customer Settings</Link>
      <Link aria-current={activeTab === "freight" ? "page" : undefined} href="/?module=admin&admin_tab=freight">Freight Settings</Link>
      <Link aria-current={activeTab === "purchasing" ? "page" : undefined} href="/?module=admin&admin_tab=purchasing">Purchasing</Link>
      <Link aria-current={activeTab === "reports" ? "page" : undefined} href="/?module=admin&admin_tab=reports">Report Settings</Link>
    </section>
    <section className="section-stack">
      <article className={activeTab === "warehouse" ? "data-section" : "data-section tab-panel-hidden"}>
        <WarehouseDirectory deactivateAction={deactivateWarehousesAction} deactivatedWarehouses={deactivatedWarehouses} warehouses={warehouses} />
      </article>
      <article className={activeTab === "territory" ? "data-section" : "data-section tab-panel-hidden"}><TerritoryDirectory territories={territories} /></article>
      <article className={activeTab === "customers" ? "data-section tab-panel--flush" : "data-section tab-panel-hidden"}><CustomerSettingsManager accountTypes={customerAccountTypesResult.data ?? []} businessTypes={customerBusinessTypesResult.data ?? []} deactivateAction={deactivateCustomerSettingAction} error={error} saveAction={saveCustomerSettingAction} statuses={(customerStatusesResult.data ?? []).map((status) => ({ ...status, type_code: status.status_code }))} /><PrimaryShowroomSettingsManager error={error} periodMonths={Number.isInteger(primaryShowroomBacktrackPeriod) && primaryShowroomBacktrackPeriod > 0 ? primaryShowroomBacktrackPeriod : 12} saveAction={savePrimaryShowroomSettingsAction} /></article>
      <article className={activeTab === "freight" ? "data-section tab-panel--flush" : "data-section tab-panel-hidden"}>
        <section className="tab-strip" aria-label="Freight settings">
          <Link aria-current={selectedFreightTab !== "carriers" ? "page" : undefined} href="/?module=admin&admin_tab=freight&freight_tab=levels">Freight Levels</Link>
          <Link aria-current={selectedFreightTab === "carriers" ? "page" : undefined} href="/?module=admin&admin_tab=freight&freight_tab=carriers">Freight Carriers</Link>
          <Link aria-current={selectedFreightTab === "dropship" ? "page" : undefined} href="/?module=admin&admin_tab=freight&freight_tab=dropship">Dropship Settings</Link>
        </section>
        {selectedFreightTab === "carriers" ? <FreightCarrierManager carriers={freightCarriersResult.data ?? []} error={error} saveAction={saveFreightCarrierAction} /> : selectedFreightTab === "dropship" ? <DropshipSettingsManager error={error} isActive={dropshipSettings?.isActive !== false} ratePercent={Number.isFinite(dropshipRatePercent) ? dropshipRatePercent : 0} residentialSurchargeActive={dropshipSettings?.residentialSurchargeActive === true} residentialSurchargeRatePercent={Number.isFinite(residentialSurchargeRatePercent) ? residentialSurchargeRatePercent : 0} saveAction={saveDropshipSettingsAction} /> : <FreightLevelManager accountTypes={customerAccountTypesResult.data ?? []} error={error} freightLevels={freightLevelsResult.data ?? []} groups={freightLevelGroupsResult.data ?? []} saveAction={saveFreightLevelAction} />}
      </article>
      <article className={activeTab === "products" ? "data-section tab-panel--flush" : "data-section tab-panel-hidden"}><ProductSettingsManager assignStyleAction={assignStyleAction} brands={brandsResult.data ?? []} categories={categoriesResult.data ?? []} deactivateAction={deactivateProductSettingAction} error={error} finishes={finishesResult.data ?? []} materials={materialsResult.data ?? []} partRoles={partRolesResult.data ?? []} saveAction={saveProductSettingAction} styles={stylesResult.data ?? []} suites={suitesResult.data ?? []} /></article>
      <article className={activeTab === "purchasing" ? "data-section tab-panel--flush" : "data-section tab-panel-hidden"}><PurchasingSettingsManager commitment={purchasingCommitment} containerStatuses={purchasingContainerStatuses} error={error} saveAction={savePurchasingSettingsAction} tariffRatePercent={Number.isFinite(purchasingTariffRatePercent) ? purchasingTariffRatePercent : 39} /></article>
      <article className={activeTab === "reports" ? "data-section tab-panel--flush" : "data-section tab-panel-hidden"}><ReportSettingsManager error={error} mappings={(reportMappingsResult.data ?? []) as ReportFieldMapping[]} saveAction={saveReportSettingsAction} /></article>
      <article className={activeTab === "users" ? "data-section" : "data-section tab-panel-hidden"}><div className="section-title"><h3>Users and Access Roles</h3></div><p className="fieldset-note">User accounts and security roles are intentionally protected from the general application database role. This tab reserves the management area; its controlled user-administration screen will be added with the required access policy.</p></article>
    </section>
  </section>;
}
