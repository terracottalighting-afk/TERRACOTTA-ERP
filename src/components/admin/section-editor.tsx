"use client";

import Link from "next/link";
import { useState } from "react";

type FormAction = (formData: FormData) => Promise<void>;
type Zone = { id: string; zone_code: string; name: string };
type Aisle = { id: string; warehouse_zone_id: string; aisle_code: string; name: string };

export function SectionEditor({ createAction, error, warehouseId, zones, aisles }: { createAction: FormAction; error?: string; warehouseId: string; zones: Zone[]; aisles: Aisle[] }) {
  const [zoneId, setZoneId] = useState("");
  const [aisleId, setAisleId] = useState("");
  const visibleAisles = aisles.filter((aisle) => aisle.warehouse_zone_id === zoneId);
  return <section className="dashboard-panel"><section className="account-header"><div><span className="eyebrow">Warehouse Settings</span><h2>Add Section</h2><Link className="text-action" href={`/?module=admin-warehouse&warehouse=${warehouseId}`}>Back to Warehouse</Link></div></section>{error ? <p className="form-error">{error}</p> : null}<form action={createAction} className="form-stack"><input name="warehouse_id" type="hidden" value={warehouseId} /><fieldset><legend>Section Information</legend><div className="form-grid"><label>Zone<select name="warehouse_zone_id" onChange={(event) => { setZoneId(event.target.value); setAisleId(""); }} required value={zoneId}><option value="">Select a zone</option>{zones.map((zone) => <option key={zone.id} value={zone.id}>{zone.zone_code} / {zone.name}</option>)}</select></label><label>Aisle<select disabled={!zoneId} name="warehouse_aisle_id" onChange={(event) => setAisleId(event.target.value)} required value={aisleId}><option value="">{zoneId ? "Select an aisle" : "Select a zone first"}</option>{visibleAisles.map((aisle) => <option key={aisle.id} value={aisle.id}>{aisle.aisle_code} / {aisle.name}</option>)}</select></label><label>Section Code<input name="section_code" required /></label><label>Section Name<input name="section_name" required /></label><label className="checkbox-label"><input name="is_pickable" type="checkbox" />Pickable inventory section</label><label>Section Notes<textarea name="notes" /></label></div></fieldset><div className="form-actions"><button className="primary-action" type="submit">Create Section</button><Link className="secondary-action" href={`/?module=admin-warehouse&warehouse=${warehouseId}`}>Cancel</Link></div></form></section>;
}
