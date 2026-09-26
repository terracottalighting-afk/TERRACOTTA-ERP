"use client";

import { useRef } from "react";

export function ConfirmRemoveButton({ label = "Remove", message, title = "Remove Assignment?", variant = "button" }: { label?: string; message: string; title?: string; variant?: "button" | "text" }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const triggerClassName = variant === "text" ? "text-action text-action--button text-action--danger" : "danger-action danger-action--small";
  return <><button className={triggerClassName} onClick={(event) => { formRef.current = event.currentTarget.form; dialogRef.current?.showModal(); }} type="button">{label}</button><dialog aria-labelledby="remove-confirmation-title" className="confirmation-dialog" ref={dialogRef}><div className="confirmation-dialog__content"><h2 id="remove-confirmation-title">{title}</h2><p>{message}</p><div className="form-actions"><button className="secondary-action secondary-action--light" onClick={() => dialogRef.current?.close()} type="button">Cancel</button><button className="danger-action" onClick={() => { dialogRef.current?.close(); formRef.current?.requestSubmit(); }} type="button">Confirm</button></div></div></dialog></>;
}
