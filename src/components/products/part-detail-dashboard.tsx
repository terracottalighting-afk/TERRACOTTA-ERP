import Link from "next/link";
import { StatusBadge } from "@/components/ui";
import { dateLabel, label, numberFormatter } from "@/lib/formatters";

type PartDetail = {
  brand_name: string;
  id: string;
  images: {
    display_name: string | null;
    id: string;
    image_category: string;
    original_file_name: string;
    public_url: string;
  }[];
  incoming_quantity: number | null;
  inventoryBalances: {
    box_label: string | null;
    box_sequence: number | null;
    id: string;
    inventory_condition: string;
    location_code: string;
    quantity_allocated: number;
    quantity_available: number;
    quantity_on_hand: number;
    warehouse_name: string;
  }[];
  name: string;
  next_incoming_eta: string | null;
  sellable_quantity: number | null;
  sku: string;
  status: string;
  usedInParents: {
    id: string;
    is_required: boolean;
    notes: string | null;
    parent_name: string;
    parent_product_id: string;
    parent_sku: string;
    part_role: string | null;
  }[];
};

export function PartDetailDashboard({
  deleteParentLinkAction,
  part,
  selectedTab,
}: {
  deleteParentLinkAction: (formData: FormData) => Promise<void>;
  part: PartDetail | null;
  selectedTab: string;
}) {
  if (!part) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Part was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=product-parts"
        >
          Back to Parts List
        </Link>
      </section>
    );
  }

  const tabs = [
    { key: "profile", label: "Profile" },
    { key: "images", label: "Images" },
    { key: "inventory", label: "Inventory / Locations" },
    { key: "parents", label: "Parent Products" },
  ];
  const activeTab = tabs.some((tab) => tab.key === selectedTab)
    ? selectedTab
    : "profile";
  const partTabHref = (tabKey: string) =>
    `/?module=product-parts&part=${part.id}&product_tab=${tabKey}`;
  const etaLabel =
    Number(part.sellable_quantity ?? 0) > 0
      ? "In stock"
      : part.next_incoming_eta
        ? `${dateLabel(part.next_incoming_eta)} (${numberFormatter.format(Number(part.incoming_quantity ?? 0))})`
        : "No ETA";

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href="/?module=product-parts">
            Parts List
          </Link>
          <div className="record-title-row">
            <h2>{part.sku}</h2>
            <StatusBadge
              tone={part.status === "active" ? "good" : "warn"}
              value={part.status}
            />
          </div>
          <p>{part.name}</p>
        </div>
      </section>

      <section className="metric-grid">
        <div className="metric-card">
          <span>Brand</span>
          <strong>{part.brand_name}</strong>
        </div>
        <div className="metric-card">
          <span>Inventory</span>
          <strong>
            {numberFormatter.format(Number(part.sellable_quantity ?? 0))}
          </strong>
        </div>
        <div className="metric-card">
          <span>ETA</span>
          <strong>{etaLabel}</strong>
        </div>
      </section>

      <nav className="tab-nav" aria-label="Part detail tabs">
        {tabs.map((tab) => (
          <Link
            aria-current={activeTab === tab.key ? "page" : undefined}
            href={partTabHref(tab.key)}
            key={tab.key}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {activeTab === "profile" ? (
        <section className="detail-section">
          <div className="two-column-grid">
            <div className="info-card">
              <div className="card-heading">
                <h3>Part Profile</h3>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Part SKU</dt>
                  <dd>{part.sku}</dd>
                </div>
                <div>
                  <dt>Part Name</dt>
                  <dd>{part.name}</dd>
                </div>
                <div>
                  <dt>Brand</dt>
                  <dd>{part.brand_name}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{label(part.status)}</dd>
                </div>
              </dl>
            </div>
            <div className="info-card">
              <div className="card-heading">
                <h3>Parent Product Summary</h3>
              </div>
              <dl className="detail-list">
                <div>
                  <dt>Linked Products</dt>
                  <dd>{numberFormatter.format(part.usedInParents.length)}</dd>
                </div>
                <div>
                  <dt>Link Type</dt>
                  <dd>
                    {part.usedInParents.length === 0
                      ? "Generic part"
                      : "Product-specific part"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      ) : null}

      {activeTab === "images" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>
              {numberFormatter.format(part.images.length)} part images
            </span>
            <div className="list-actions">
              <Link
                className="text-action"
                href={`/?module=edit-product-images&product=${part.id}&return_module=product-parts`}
              >
                Edit Images
              </Link>
            </div>
          </section>
          {part.images.length === 0 ? (
            <div className="info-card">
              No images have been uploaded for this part.
            </div>
          ) : (
            <div className="image-gallery-grid">
              {part.images.map((image) => (
                <article className="image-tile" key={image.id}>
                  <div className="image-preview-frame">
                    <img
                      alt={image.display_name ?? image.original_file_name}
                      src={image.public_url}
                    />
                  </div>
                  <div className="image-tile-body">
                    <strong>
                      {image.display_name ?? image.original_file_name}
                    </strong>
                    <span>{label(image.image_category)}</span>
                    <a
                      className="table-link"
                      href={image.public_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open image
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {activeTab === "inventory" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>
              {numberFormatter.format(part.inventoryBalances.length)} inventory
              balances
            </span>
            <div className="list-actions">
              <Link
                className="text-action"
                href={`/?module=edit-product-inventory&product=${part.id}&return_module=product-parts`}
              >
                Edit Inventory
              </Link>
            </div>
          </section>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Box</th>
                  <th>Warehouse</th>
                  <th>Bin / Location</th>
                  <th>Condition</th>
                  <th>On Hand</th>
                  <th>Allocated</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {part.inventoryBalances.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No inventory balances found.</td>
                  </tr>
                ) : (
                  part.inventoryBalances.map((balance) => (
                    <tr key={balance.id}>
                      <td>
                        {balance.box_sequence
                          ? `Box ${balance.box_sequence}${balance.box_label ? ` / ${balance.box_label}` : ""}`
                          : "SKU balance"}
                      </td>
                      <td>{balance.warehouse_name}</td>
                      <td>{balance.location_code}</td>
                      <td>{label(balance.inventory_condition)}</td>
                      <td>
                        {numberFormatter.format(balance.quantity_on_hand)}
                      </td>
                      <td>
                        {numberFormatter.format(balance.quantity_allocated)}
                      </td>
                      <td>
                        {numberFormatter.format(balance.quantity_available)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {activeTab === "parents" ? (
        <section className="detail-section">
          <section className="list-header-panel list-header-panel--compact">
            <span>
              {numberFormatter.format(part.usedInParents.length)} linked parent
              products
            </span>
            <div className="list-actions">
              <Link
                className="text-action"
                href={`/?module=edit-part-parents&part=${part.id}`}
              >
                Add Parent Products
              </Link>
            </div>
          </section>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Parent SKU</th>
                  <th>Parent Product</th>
                  <th>Role</th>
                  <th>Required</th>
                  <th>Notes</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {part.usedInParents.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      This is a generic part. It is not linked to a parent
                      product yet.
                    </td>
                  </tr>
                ) : (
                  part.usedInParents.map((parent) => (
                    <tr key={parent.id}>
                      <td>
                        <Link
                          className="table-link"
                          href={`/?module=products&product=${parent.parent_product_id}`}
                        >
                          {parent.parent_sku}
                        </Link>
                      </td>
                      <td>{parent.parent_name}</td>
                      <td>{label(parent.part_role)}</td>
                      <td>{parent.is_required ? "Yes" : "No"}</td>
                      <td>{parent.notes ?? "Not set"}</td>
                      <td>
                        <form action={deleteParentLinkAction}>
                          <input name="part_id" type="hidden" value={part.id} />
                          <input
                            name="parent_link_id"
                            type="hidden"
                            value={parent.id}
                          />
                          <button
                            className="text-action text-action--button text-action--danger"
                            type="submit"
                          >
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </section>
  );
}
