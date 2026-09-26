"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { dateLabel } from "@/lib/formatters";

type Registration = {
  created_at: string;
  documentCount: number;
  id: string;
  imageCount: number;
  purpose: string;
  registration_name: string;
};

const purposeLabel: Record<string, string> = {
  initial_participating: "Initial Participating",
  program_renewal: "Program Renewal",
  program_audit: "Program Audit",
  other: "Other",
};

const pageSize = 10;

export function PrimaryShowroomRegistrationTable({ customerId, enrollmentId, registrations }: { customerId: string; enrollmentId: string; registrations: Registration[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(registrations.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = useMemo(() => registrations.slice((currentPage - 1) * pageSize, currentPage * pageSize), [currentPage, registrations]);
  const detailHref = (id: string) => `/?module=primary-showroom-registration&customer=${customerId}&primary_showroom=${enrollmentId}&primary_showroom_registration=${id}`;

  return <><div className="table-wrap"><table><thead><tr><th>No.</th><th>Name</th><th>Purpose</th><th>Documents</th><th>Images</th><th>Created</th></tr></thead><tbody>{pageRows.map((registration, index) => <tr key={registration.id}><td>{(currentPage - 1) * pageSize + index + 1}</td><td><Link className="record-link primary-showroom-registration-link" href={detailHref(registration.id)}>{registration.registration_name}</Link></td><td>{purposeLabel[registration.purpose] ?? registration.purpose}</td><td>{registration.documentCount} document{registration.documentCount === 1 ? "" : "s"}</td><td>{registration.imageCount} image{registration.imageCount === 1 ? "" : "s"}</td><td>{dateLabel(registration.created_at)}</td></tr>)}</tbody></table></div>{totalPages > 1 ? <nav className="pagination-footer" aria-label="Registration and renewal pages"><span>Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, registrations.length)} of {registrations.length}</span><div className="pagination-nav"><button className="pagination-link" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} type="button">Previous</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <button aria-current={pageNumber === currentPage ? "page" : undefined} className={pageNumber === currentPage ? "pagination-current" : "pagination-link"} key={pageNumber} onClick={() => setPage(pageNumber)} type="button">{pageNumber}</button>)}<button className="pagination-link" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} type="button">Next</button></div></nav> : null}</>;
}
