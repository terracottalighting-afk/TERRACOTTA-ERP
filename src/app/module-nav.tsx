"use client";

import Link from "next/link";
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
        {openGroup === "customers" ? <div className="submenu-block"><Link href="/">All Customers</Link><Link href="/?module=add-customer">Add Customer</Link><Link href="/?module=obsolete-customers">Obsolete Accounts</Link></div> : null}
      </div>
      <Link className={["sales-rep-agencies", "sales-rep-agency", "sales-rep-agency-edit"].includes(activeModule) ? "nav-link--active" : undefined} href="/?module=sales-rep-agencies">Sales Agencies</Link>
      <div className="nav-group">
        <button className={`nav-group-toggle${isProductModule ? " nav-group-toggle--active" : ""}`} onClick={() => toggleGroup("products")} type="button">Products</button>
        {openGroup === "products" ? <div className="submenu-block"><Link href="/?module=products">All Products</Link>{productBrands.map((brand) => <Link href={`/?module=products&product_brand=${brand.id}`} key={brand.id}>{brand.name}</Link>)}<Link href="/?module=product-parts">Parts</Link><Link href="/?module=discontinued-products">Discontinued</Link></div> : null}
      </div>
      <div className="nav-group">
        <button className={`nav-group-toggle${isOrderModule ? " nav-group-toggle--active" : ""}`} onClick={() => toggleGroup("orders")} type="button">Orders</button>
        {openGroup === "orders" ? <div className="submenu-block"><Link href="/?module=orders">Order List</Link><Link href="/?module=quotes">Quotes</Link></div> : null}
      </div>
      <Link className={activeModule === "shipping" ? "nav-link--active" : undefined} href="/?module=shipping">Shipments</Link>
      <Link className={activeModule === "invoices" ? "nav-link--active" : undefined} href="/?module=invoices">Financial</Link>
      <Link className={activeModule === "ar" ? "nav-link--active" : undefined} href="/?module=ar">Payments / AR</Link>
      <Link className={isRgaModule ? "nav-link--active" : undefined} href="/?module=rga">RGA</Link>
      <Link className={activeModule === "inventory" ? "nav-link--active" : undefined} href="/?module=inventory">Inventory</Link>
      <Link className={activeModule === "purchasing" ? "nav-link--active" : undefined} href="/?module=purchasing">Purchasing</Link>
      <Link className={activeModule === "reports" ? "nav-link--active" : undefined} href="/?module=reports">Reports</Link>
      <Link className={activeModule === "admin" ? "nav-link--active" : undefined} href="/?module=admin">Admin</Link>
    </nav>
  );
}
