"use client";

import { useRef } from "react";

export function ConfirmRemoveButton({ message }: { message: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  return <><button className="danger-action danger-action--small" onClick={(event) => { formRef.current = event.currentTarget.form; dialogRef.current?.showModal(); }} type="button">Remove</button><dialog aria-labelledby="remove-confirmation-title" className="confirmation-dialog" ref={dialogRef}><div className="confirmation-dialog__content"><h2 id="remove-confirmation-title">Remove Assignment?</h2><p>{message}</p><div className="form-actions"><button className="secondary-action secondary-action--light" onClick={() => dialogRef.current?.close()} type="button">Cancel</button><button className="danger-action" onClick={() => { dialogRef.current?.close(); formRef.current?.requestSubmit(); }} type="button">Confirm</button></div></div></dialog></>;
}
