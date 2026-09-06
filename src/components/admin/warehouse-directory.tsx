"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/ui";

type Warehouse = { id: string; name: string; warehouse_code: string; is_active: boolean };
type FormAction = (formData: FormData) => Promise<void>;
type WarehouseView = "active" | "deactivated";

export function WarehouseDirectory({
  deactivateAction,
  deactivatedWarehouses,
  warehouses,
}: {
  deactivateAction: FormAction;
  deactivatedWarehouses: Warehouse[];
  warehouses: Warehouse[];
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [view, setView] = useState<WarehouseView>("active");
  const visibleWarehouses = view === "active" ? warehouses : deactivatedWarehouses;
  const toggleSelected = (warehouseId: string) => setSelectedIds((current) => current.includes(warehouseId) ? current.filter((id) => id !== warehouseId) : [...current, warehouseId]);

  return <>
    <div aria-label="Warehouse status" className="metric-grid warehouse-directory-tabs" role="tablist">
      <button aria-selected={view === "active"} className={`metric warehouse-directory-tab${view === "active" ? " warehouse-directory-tab--active" : ""}`} onClick={() => setView("active")} role="tab" type="button"><span>Warehouses</span><strong>{warehouses.length}</strong></button>
      <button aria-selected={view === "deactivated"} className={`metric warehouse-directory-tab${view === "deactivated" ? " warehouse-directory-tab--active" : ""}`} onClick={() => setView("deactivated")} role="tab" type="button"><span>Deactivated Warehouses</span><strong>{deactivatedWarehouses.length}</strong></button>
    </div>
    {view === "active" ? <form action={deactivateAction}>
      <div className="warehouse-directory-toolbar"><div className="section-actions admin-warehouse-directory-actions"><button className="danger-action" disabled={selectedIds.length === 0} type="submit">Deactivate Warehouse</button><Link className="small-action" href="/?module=admin-warehouse-edit">Add Warehouse</Link></div></div>
      {selectedIds.map((id) => <input key={id} name="warehouse_ids" type="hidden" value={id} />)}
      <WarehouseTable onRowClick={toggleSelected} selectedIds={selectedIds} warehouses={visibleWarehouses} />
    </form> : <WarehouseTable warehouses={visibleWarehouses} />}
  </>;
}

function WarehouseTable({ onRowClick, selectedIds = [], warehouses }: { onRowClick?: (warehouseId: string) => void; selectedIds?: string[]; warehouses: Warehouse[] }) {
  const isSelectable = Boolean(onRowClick);
  return <div className="table-wrap"><table className="data-table"><thead><tr><th>Warehouse</th><th>Code</th><th>Status</th></tr></thead><tbody>{warehouses.map((warehouse) => <tr className={selectedIds.includes(warehouse.id) ? "admin-row-selected" : undefined} key={warehouse.id} onClick={isSelectable ? () => onRowClick?.(warehouse.id) : undefined}><td><Link className="record-link" href={`/?module=admin-warehouse&warehouse=${warehouse.id}`} onClick={(event) => event.stopPropagation()}>{warehouse.name}</Link></td><td>{warehouse.warehouse_code}</td><td><StatusBadge tone={warehouse.is_active ? "good" : "warn"} value={warehouse.is_active ? "Active" : "Deactivated"} /></td></tr>)}{warehouses.length === 0 ? <tr><td colSpan={3}>No {isSelectable ? "active" : "deactivated"} warehouses have been configured.</td></tr> : null}</tbody></table></div>;
}
