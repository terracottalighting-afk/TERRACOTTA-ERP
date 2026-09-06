import Link from "next/link";

type FormAction = (formData: FormData) => Promise<void>;

export function TerritoryZipCoverageList({ page, removeAction, territoryId, totalCount, zipCodes }: { page: number; removeAction: FormAction; territoryId: string; totalCount: number; zipCodes: { postal_code: string }[] }) {
  const pageSize = 100;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const pageUrl = (nextPage: number) => `/?module=admin-territory-edit&territory=${territoryId}&territory_zip_page=${nextPage}`;
  return <section className="data-section territory-zip-coverage"><div className="section-title"><div><h3>Resolved ZIP Codes</h3><p>Select ZIP codes to remove them from this territory. Removed ZIP codes become persistent individual exclusions.</p></div></div><form action={removeAction}><input name="territory_id" type="hidden" value={territoryId} /><input name="territory_zip_page" type="hidden" value={page} /><div className="territory-zip-grid">{zipCodes.map((zip) => <label className="checkbox-label" key={zip.postal_code}><input name="postal_codes" type="checkbox" value={zip.postal_code} />{zip.postal_code}</label>)}</div><div className="territory-zip-actions"><button className="danger-action" type="submit">Remove Selected ZIP Codes</button><div className="pagination-footer"><span>Showing {Math.min((page - 1) * pageSize + 1, totalCount).toLocaleString()}-{Math.min(page * pageSize, totalCount).toLocaleString()} of {totalCount.toLocaleString()} ZIP codes</span><nav className="pagination-nav" aria-label="Territory ZIP code pages"><Link aria-disabled={page <= 1} className="pagination-link" href={pageUrl(Math.max(1, page - 1))}>Previous</Link><span aria-current="page" className="pagination-current">{page} of {totalPages}</span><Link aria-disabled={page >= totalPages} className="pagination-link" href={pageUrl(Math.min(totalPages, page + 1))}>Next</Link></nav></div></div></form></section>;
}
