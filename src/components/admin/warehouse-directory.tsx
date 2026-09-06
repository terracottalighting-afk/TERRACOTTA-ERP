"use client";

import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/ui";

type Warehouse = { id: string; name: string; warehouse_code: string; is_active: boolean };
type FormAction = (formData: FormData) => Promise<void>;

export function WarehouseDirectory({ deactivateAction, warehouses }: { deactivateAction: FormAction; warehouses: Warehouse[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const toggleSelected = (warehouseId: string) => setSelectedIds((current) => current.includes(warehouseId) ? current.filter((id) => id !== warehouseId) : [...current, warehouseId]);
  return <form action={deactivateAction}><div className="section-title"><h3>Warehouse Setup</h3><div className="section-actions admin-warehouse-directory-actions"><button className="danger-action" disabled={selectedIds.length === 0} type="submit">Deactivate Warehouse</button><Link className="small-action" href="/?module=admin-warehouse-edit">Add Warehouse</Link></div></div>{selectedIds.map((id) => <input key={id} name="warehouse_ids" type="hidden" value={id} />)}<div className="table-wrap"><table className="data-table"><thead><tr><th>Warehouse</th><th>Code</th><th>Status</th></tr></thead><tbody>{warehouses.map((warehouse) => <tr className={selectedIds.includes(warehouse.id) ? "admin-row-selected" : undefined} key={warehouse.id} onClick={() => toggleSelected(warehouse.id)}><td><Link className="record-link" href={`/?module=admin-warehouse&warehouse=${warehouse.id}`} onClick={(event) => event.stopPropagation()}>{warehouse.name}</Link></td><td>{warehouse.warehouse_code}</td><td><StatusBadge tone={warehouse.is_active ? "good" : "warn"} value={warehouse.is_active ? "Active" : "Inactive"} /></td></tr>)}{warehouses.length === 0 ? <tr><td colSpan={3}>No active warehouses have been configured.</td></tr> : null}</tbody></table></div></form>;
}
