"use client";

import { useState } from "react";

type BrandOption = { id: string; name: string };

export function ModuleNav({ activeModule, productBrands }: { activeModule: string; productBrands: BrandOption[] }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const toggleGroup = (group: string) => setOpenGroup((current) => (current === group ? null : group));
  const isCustomerModule = ["customers", "add-customer", "obsolete-customers"].includes(activeModule);
  const isProductModule = ["products", "product-parts", "discontinued-products"].includes(activeModule);
  const isOrderModule = ["orders", "quotes", "new-order"].includes(activeModule);
  const isRgaModule = ["rga", "create-rga"].includes(activeModule);

  return (
    <nav className="module-nav" aria-label="ERP modules">
      <div className="nav-group">
        <button className={`nav-group-toggle${isCustomerModule ? " nav-group-toggle--active" : ""}`} onClick={() => toggleGroup("customers")} type="button">Customers</button>
        {openGroup === "customers" ? <div className="submenu-block"><a href="/">All Customers</a><a href="/?module=add-customer">Add Customer</a><a href="/?module=obsolete-customers">Obsolete Accounts</a></div> : null}
      </div>
      <a className={["sales-rep-agencies", "sales-rep-agency", "sales-rep-agency-edit"].includes(activeModule) ? "nav-link--active" : undefined} href="/?module=sales-rep-agencies">Sales Agencies</a>
      <div className="nav-group">
        <button className={`nav-group-toggle${isProductModule ? " nav-group-toggle--active" : ""}`} onClick={() => toggleGroup("products")} type="button">Products</button>
        {openGroup === "products" ? <div className="submenu-block"><a href="/?module=products">All Products</a>{productBrands.map((brand) => <a href={`/?module=products&product_brand=${brand.id}`} key={brand.id}>{brand.name}</a>)}<a href="/?module=product-parts">Parts</a><a href="/?module=discontinued-products">Discontinued</a></div> : null}
      </div>
      <div className="nav-group">
        <button className={`nav-group-toggle${isOrderModule ? " nav-group-toggle--active" : ""}`} onClick={() => toggleGroup("orders")} type="button">Orders</button>
        {openGroup === "orders" ? <div className="submenu-block"><a href="/?module=orders">Order List</a><a href="/?module=quotes">Quotes</a></div> : null}
      </div>
      <a className={activeModule === "shipping" ? "nav-link--active" : undefined} href="/?module=shipping">Shipments</a>
      <a className={activeModule === "invoices" ? "nav-link--active" : undefined} href="/?module=invoices">Financial</a>
      <a className={activeModule === "ar" ? "nav-link--active" : undefined} href="/?module=ar">Payments / AR</a>
      <a className={isRgaModule ? "nav-link--active" : undefined} href="/?module=rga">RGA</a>
      <a className={activeModule === "inventory" ? "nav-link--active" : undefined} href="/?module=inventory">Inventory</a>
      <a className={activeModule === "purchasing" ? "nav-link--active" : undefined} href="/?module=purchasing">Purchasing</a>
      <a className={activeModule === "reports" ? "nav-link--active" : undefined} href="/?module=reports">Reports</a>
      <a className={activeModule === "admin" ? "nav-link--active" : undefined} href="/?module=admin">Admin</a>
    </nav>
  );
}
