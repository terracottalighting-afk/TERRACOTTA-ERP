"use client";

import { useState } from "react";

const statuses = [
  ["active", "On floor"],
  ["sold", "Sold"],
  ["swapped", "Swapped"],
  ["removed", "Removed"],
  ["needs_refresh", "Needs refresh"],
  ["expired", "Expired"],
] as const;

export function PrimaryShowroomDisplayStatusFields({ initialStatus }: { initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const changed = status !== initialStatus;
  return <>
    <label>Status<select name="status" onChange={(event) => setStatus(event.target.value)} value={status}>{statuses.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>
    {changed ? <label className="full-width-field">Reason for Status Change<textarea name="status_change_note" placeholder="Explain why this display status is changing" required rows={3} /></label> : null}
  </>;
}
