"use client";

export function CommissionStatementControls({ recipientEmail, statementNumber }: { recipientEmail?: string | null; statementNumber: string }) {
  const subject = encodeURIComponent(`Commission Statement ${statementNumber}`);
  const body = encodeURIComponent(`Please find the commission statement ${statementNumber} attached.`);

  return <><button className="primary-action print-hidden" onClick={() => window.print()} type="button">Download in PDF</button><a className="secondary-action print-hidden" href={`mailto:${recipientEmail ?? ""}?subject=${subject}&body=${body}`}>Email PDF Statement</a></>;
}
