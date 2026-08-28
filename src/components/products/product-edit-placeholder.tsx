import Link from "next/link";

export function ProductEditPlaceholder({
  moduleName,
  productId,
}: {
  moduleName: string;
  productId?: string;
}) {
  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={
              productId
                ? `/?module=products&product=${productId}`
                : "/?module=products"
            }
          >
            Product Detail
          </Link>
          <div className="record-title-row">
            <h2>{moduleName}</h2>
          </div>
          <p>
            This focused edit page will be built as a separate small form
            instead of one long product edit screen.
          </p>
        </div>
      </section>
      <div className="empty-state">
        Form coming in the next product edit slice.
      </div>
    </section>
  );
}
