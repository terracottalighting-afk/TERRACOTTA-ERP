"use client";

import { useRef } from "react";

type FormAction = (formData: FormData) => Promise<void>;

export function HierarchyDeactivateControl({
  deactivateAction,
  entityId,
  entityLabel,
  entityType,
  idField,
  warehouseId,
}: {
  deactivateAction: FormAction;
  entityId: string;
  entityLabel: string;
  entityType: "Zone" | "Aisle" | "Section";
  idField: "zone_id" | "aisle_id" | "section_id";
  warehouseId: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dialogRef.current?.showModal();
  };

  return <><button className="text-action text-action--button text-action--danger" onClick={openDialog} type="button">Deactivate</button><dialog aria-labelledby={`deactivate-${entityType}-${entityId}`} className="confirmation-dialog" ref={dialogRef}><form action={deactivateAction}><h3 id={`deactivate-${entityType}-${entityId}`}>Deactivate {entityType}</h3><p>Are you sure you want to deactivate <strong>{entityLabel}</strong>?</p><ul><li>This {entityType.toLowerCase()} will no longer be available for future warehouse setup or inventory assignments.</li><li>Existing inventory, order history, and related hierarchy records will be retained.</li><li>This action does not delete any data.</li></ul><input name="warehouse_id" type="hidden" value={warehouseId} /><input name={idField} type="hidden" value={entityId} /><div className="form-actions"><button className="danger-action" type="submit">Confirm Deactivation</button><button className="secondary-action secondary-action--light" onClick={() => dialogRef.current?.close()} type="button">Cancel</button></div></form></dialog></>;
}
