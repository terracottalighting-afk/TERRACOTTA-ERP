"use client";

export function PrimaryShowroomPerformanceReportControls({ recipientEmail, reportTitle, showroomName }: { recipientEmail?: string | null; reportTitle: string; showroomName: string }) {
  const subject = encodeURIComponent(`${reportTitle} - ${showroomName}`);
  const body = encodeURIComponent(`Please find the ${reportTitle.toLowerCase()} for ${showroomName} attached.`);
  return <div className="record-hero-actions print-hidden"><button className="primary-action" onClick={() => window.print()} type="button">Download PDF</button><a className="secondary-action" href={`mailto:${recipientEmail ?? ""}?subject=${subject}&body=${body}`}>Email PDF</a></div>;
}
