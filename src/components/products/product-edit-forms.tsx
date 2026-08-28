import Link from "next/link";
import { Fragment } from "react";
import { dateLabel, fileSizeLabel, label, numberFormatter } from "@/lib/formatters";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PartParentProductPicker } from "./part-parent-product-picker";
import { ProductLedSpecFields } from "./product-led-spec-fields";
import { ProductPartsEditRows } from "./product-parts-edit-rows";

type FormAction = (formData: FormData) => Promise<void>;
type ProductImageCategory = "stock" | "detail" | "lifestyle" | "drawing" | "other";
type SelectOption = { id: string; name: string };
type WarehouseLocationOption = SelectOption & { warehouse_id: string; warehouse_name: string };
type ProductEditProduct = {
  brand_id: string;
  category_id: string | null;
  collection: string | null;
  counts_toward_primary_showroom_default: boolean | null;
  customer_eligibility_tag: string;
  default_price: number | null;
  default_vendor_item_number: string | null;
  description: string | null;
  hangingConfig: {
    canopy_detail: string | null;
    chain_length: string | null;
    mounting_type: string | null;
    notes: string | null;
    rod_length: string | null;
    wire_length: string | null;
  } | null;
  id: string;
  images: {
    display_name: string | null;
    file_size: number | null;
    id: string;
    image_category: ProductImageCategory;
    is_default_thumbnail: boolean;
    original_file_name: string;
    public_url: string;
    sort_order: number;
    uploaded_at: string;
  }[];
  inventoryBalances: {
    box_label: string | null;
    box_sequence: number | null;
    id: string;
    inventory_condition: string;
    location_code: string;
    quantity_allocated: number;
    quantity_available: number;
    quantity_on_hand: number;
    warehouse_id: string;
  }[];
  name: string;
  no_box_needed: boolean;
  packingBoxes: {
    box_height: number | null;
    box_label: string | null;
    box_length: number | null;
    box_sequence: number;
    box_width: number | null;
    cbm: number | null;
    default_warehouse_id: string | null;
    default_warehouse_location_code: string | null;
    default_warehouse_location_id: string | null;
    default_warehouse_location_name: string | null;
    default_warehouse_name: string | null;
    gross_weight: number | null;
    id: string;
    inch_volume: number | null;
    is_required_for_sale: boolean;
    net_weight: number | null;
    notes: string | null;
    pallet_quantity: number | null;
  }[];
  parts: {
    component_name: string;
    component_product_id: string;
    component_sellability_status: string;
    component_sku: string;
    component_status: string;
    id: string;
    is_required: boolean;
    next_incoming_eta: string | null;
    notes: string | null;
    part_name: string | null;
    part_role: string | null;
    sellable_quantity: number | null;
  }[];
  primary_showroom_exclusion_reason: string | null;
  sellability_status: string;
  sellable_quantity: number | null;
  signature_suite_id: string | null;
  sku: string;
  specAttributes: {
    attribute_name: string;
    attribute_value: string;
    id: string;
    unit: string | null;
  }[];
  status: string;
  usedInParents: {
    parent_product_id: string;
  }[];
  vendors: {
    id: string;
    lead_time_days: number | null;
    minimum_order_quantity: number | null;
    unit_cost: number;
    vendor_id: string;
    vendor_item_number: string;
    vendor_name: string;
  }[];
};
type LoadProduct = (productId: string) => Promise<ProductEditProduct | null>;

const productPartRoleOptions = [
  "Chain",
  "Rod",
  "Decor Glass",
  "Glass Shade",
  "Stone Shade",
  "Other Decor",
  "Fabric Shade",
  "Decor Nut",
  "Canopy",
  "Others",
];

type ProductSetupStep =
  | "profile"
  | "specs"
  | "images"
  | "packing"
  | "inventory"
  | "parts"
  | "vendors"
  | "done";

function ProductSetupGuide({
  currentStep,
  productId,
}: {
  currentStep: ProductSetupStep;
  productId?: string;
}) {
  const setupSuffix = "&setup=product";
  const steps: { key: ProductSetupStep; href?: string; label: string }[] = [
    {
      key: "profile",
      href: productId
        ? `/?module=edit-product-profile&product=${productId}${setupSuffix}`
        : undefined,
      label: "Profile",
    },
    {
      key: "specs",
      href: productId
        ? `/?module=edit-product-specs&product=${productId}&spec_section=dimensions${setupSuffix}`
        : undefined,
      label: "Specs",
    },
    {
      key: "images",
      href: productId
        ? `/?module=edit-product-images&product=${productId}${setupSuffix}`
        : undefined,
      label: "Images",
    },
    {
      key: "packing",
      href: productId
        ? `/?module=add-product-box&product=${productId}${setupSuffix}`
        : undefined,
      label: "Packing / Boxes",
    },
    {
      key: "inventory",
      href: productId
        ? `/?module=edit-product-inventory&product=${productId}${setupSuffix}`
        : undefined,
      label: "Inventory",
    },
    {
      key: "parts",
      href: productId
        ? `/?module=edit-product-parts&product=${productId}&part_action=add${setupSuffix}`
        : undefined,
      label: "Parts",
    },
    {
      key: "vendors",
      href: productId
        ? `/?module=edit-product-vendors&product=${productId}&vendor_action=add${setupSuffix}`
        : undefined,
      label: "Vendors",
    },
    {
      key: "done",
      href: productId ? `/?module=products&product=${productId}` : undefined,
      label: "Review",
    },
  ];

  return (
    <section className="info-card">
      <div className="card-heading">
        <h3>Product Setup</h3>
        {productId ? (
          <Link className="text-action" href={`/?module=products&product=${productId}`}>
            Product Detail
          </Link>
        ) : null}
      </div>
      <nav className="tab-nav" aria-label="Product setup steps">
        {steps.map((step) =>
          step.href ? (
            <Link
              aria-current={currentStep === step.key ? "page" : undefined}
              href={step.href}
              key={step.key}
            >
              {step.label}
            </Link>
          ) : (
            <span
              aria-current={currentStep === step.key ? "page" : undefined}
              className="disabled-tab"
              key={step.key}
            >
              {step.label}
            </span>
          ),
        )}
      </nav>
    </section>
  );
}

export function AddProductForm({
  brandOptions,
  categoryOptions,
  createProductAction,
  error,
  styleOptions,
}: {
  brandOptions: SelectOption[];
  categoryOptions: SelectOption[];
  createProductAction: FormAction;
  error?: string;
  styleOptions: SelectOption[];
}) {
  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href="/?module=products">
            Product List
          </Link>
          <div className="record-title-row">
            <h2>Add Product</h2>
          </div>
          <p>Create the product profile first, then add specs, images, boxes, and inventory from the detail page.</p>
        </div>
      </section>

      {error ? <div className="form-alert">{decodeURIComponent(error)}</div> : null}

      <ProductSetupGuide currentStep="profile" />

      <form action={createProductAction} className="customer-form">
        <input name="setup_flow" type="hidden" value="product" />
        <fieldset>
          <legend>Core Product</legend>
          <div className="form-grid">
            <label>
              SKU
              <input name="sku" required />
            </label>
            <label>
              Product Name
              <input name="name" required />
            </label>
            <label>
              Brand
              <select name="brand_id" required>
                <option value="">Select brand</option>
                {brandOptions.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select name="product_category_id">
                <option value="">Not set</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Style / Suite
              <select name="signature_suite_id">
                <option value="">Not set</option>
                {styleOptions.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Collection / Family
              <input name="collection" />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Status / Eligibility</legend>
          <div className="form-grid">
            <label>
              Lifecycle Status
              <select defaultValue="pending" name="status">
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
                <option value="deleted">Deleted</option>
              </select>
            </label>
            <label>
              Sellability
              <select defaultValue="hidden" name="sellability_status">
                <option value="hidden">Hidden</option>
                <option value="sellable">Sellable</option>
                <option value="blocked">Blocked</option>
                <option value="override_required">Override Required</option>
              </select>
            </label>
            <label>
              Customer Eligibility
              <select defaultValue="all" name="customer_eligibility_tag">
                <option value="all">All</option>
                <option value="ecommerce_only">Ecommerce Only</option>
                <option value="non_ecommerce_only">Non-ecommerce Only</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </label>
            <label>
              Primary Showroom Count
              <select defaultValue="yes" name="counts_toward_primary_showroom_default">
                <option value="yes">Included</option>
                <option value="no">Excluded</option>
              </select>
            </label>
            <label className="full-width-field">
              Exclusion Reason
              <input name="primary_showroom_exclusion_reason" />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Pricing / Description</legend>
          <div className="form-grid">
            <label>
              Default Price
              <input min="0" name="default_price" step="0.01" type="number" />
            </label>
            <label>
              Default Vendor Item No.
              <input name="default_vendor_item_number" />
            </label>
            <label className="checkbox-label">
              <input name="no_box_needed" type="checkbox" />
              No box needed
            </label>
            <label className="full-width-field">
              Product Description
              <textarea maxLength={3500} name="description" rows={7} />
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Create Product and Continue to Specs</button>
          <Link className="secondary-action secondary-action--light" href="/?module=products">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

export async function EditProductImagesForm({
  error,
  imageCategory,
  notice,
  productId,
  returnModule,
  setupFlow,
  loadProduct,
  uploadProductImageAction,
  updateProductImagesAction,
}: {
  error?: string;
  imageCategory?: string;
  notice?: string;
  productId?: string;
  returnModule?: string;
  setupFlow?: boolean;
  loadProduct: LoadProduct;
  uploadProductImageAction: FormAction;
  updateProductImagesAction: FormAction;
}) {
  const product = productId ? await loadProduct(productId) : null;
  const returnToPart = returnModule === "product-parts";
  const setupSuffix = setupFlow ? "&setup=product" : "";
  const imagesHref = returnToPart
    ? `/?module=product-parts&part=${productId}&product_tab=images`
    : `/?module=products&product=${productId}&product_tab=images`;
  const editImagesHref = (category: ProductImageCategory) =>
    `/?module=edit-product-images&product=${productId}&image_category=${category}${returnToPart ? "&return_module=product-parts" : ""}${setupSuffix}`;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  const imageCategories: { key: ProductImageCategory; label: string }[] = [
    { key: "stock", label: "Stock Images" },
    { key: "detail", label: "Detail Images" },
    { key: "lifestyle", label: "Lifestyle Images" },
    { key: "drawing", label: "Drawing Images" },
    { key: "other", label: "Other Images" },
  ];
  const activeCategory = imageCategories.some(
    (category) => category.key === imageCategory,
  )
    ? (imageCategory as ProductImageCategory)
    : "stock";
  const visibleImages = product.images.filter(
    (image) => image.image_category === activeCategory,
  );

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={imagesHref}>
            {returnToPart ? "Part Images" : "Product Images"}
          </Link>
          <div className="record-title-row">
            <h2>{returnToPart ? "Edit Part Images" : "Edit Product Images"}</h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {notice ? (
        <div className="form-notice">{decodeURIComponent(notice)}</div>
      ) : null}
      {setupFlow ? (
        <ProductSetupGuide currentStep="images" productId={product.id} />
      ) : null}

      <nav className="tab-nav" aria-label="Image edit categories">
        {imageCategories.map((category) => (
          <Link
            aria-current={activeCategory === category.key ? "page" : undefined}
            href={editImagesHref(category.key)}
            key={category.key}
          >
            {category.label}
          </Link>
        ))}
      </nav>

      <form action={uploadProductImageAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        {setupFlow ? (
          <input name="setup_flow" type="hidden" value="product" />
        ) : null}
        {returnToPart ? (
          <input name="return_module" type="hidden" value="product-parts" />
        ) : null}
        <fieldset>
          <legend>Upload Image</legend>
          <div className="form-grid">
            <label>
              Image File
              <input
                accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff"
                name="image_file"
                required
                type="file"
              />
            </label>
            <label>
              Image Category
              <select defaultValue={activeCategory} name="image_category">
                {imageCategories.map((category) => (
                  <option key={category.key} value={category.key}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Image Name / Description
              <input
                name="display_name"
                placeholder="Optional image name or short description"
              />
            </label>
            <label className="checkbox-label">
              <input
                disabled={activeCategory !== "stock"}
                name="is_default_thumbnail"
                type="checkbox"
              />
              Set as default thumbnail
            </label>
          </div>
          <p className="fieldset-note">
            Supported image formats include JPG, PNG, WEBP, GIF, BMP, and TIFF.
          </p>
        </fieldset>
        <div className="form-actions">
          <button type="submit">Upload Image</button>
        </div>
      </form>

      <form action={updateProductImagesAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        <input
          name="return_image_category"
          type="hidden"
          value={activeCategory}
        />
        {setupFlow ? (
          <input name="setup_flow" type="hidden" value="product" />
        ) : null}
        {returnToPart ? (
          <input name="return_module" type="hidden" value="product-parts" />
        ) : null}
        <fieldset>
          <legend>Existing Images</legend>
          {visibleImages.length === 0 ? (
            <p className="fieldset-note">
              No images uploaded in this category yet.
            </p>
          ) : null}
          <div className="image-edit-list">
            {visibleImages.map((image) => (
              <section className="image-edit-panel" key={image.id}>
                <input name="image_ids" type="hidden" value={image.id} />
                <div className="image-edit-preview">
                  <img
                    alt={image.display_name ?? image.original_file_name}
                    src={image.public_url}
                  />
                </div>
                <div className="form-grid image-edit-grid">
                  <label>
                    Image Name / Description
                    <input
                      defaultValue={image.display_name ?? ""}
                      name={`display_name_${image.id}`}
                    />
                  </label>
                  <label>
                    Category
                    <select
                      defaultValue={image.image_category}
                      name={`image_category_${image.id}`}
                    >
                      {imageCategories.map((category) => (
                        <option key={category.key} value={category.key}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Sort Order
                    <input
                      defaultValue={image.sort_order}
                      min={0}
                      name={`sort_order_${image.id}`}
                      step={1}
                      type="number"
                    />
                  </label>
                  <label className="checkbox-label">
                    <input
                      defaultChecked={image.is_default_thumbnail}
                      disabled={image.image_category !== "stock"}
                      name="default_thumbnail_image_id"
                      type="radio"
                      value={image.id}
                    />
                    Default thumbnail
                  </label>
                  <label className="checkbox-label">
                    <input
                      name="delete_image_ids"
                      type="checkbox"
                      value={image.id}
                    />
                    Delete image
                  </label>
                  <div className="image-edit-meta">
                    <span>{image.original_file_name}</span>
                    <span>{fileSizeLabel(image.file_size)}</span>
                    <span>{dateLabel(image.uploaded_at.slice(0, 10))}</span>
                    <a
                      className="table-link"
                      href={image.public_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open image
                    </a>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </fieldset>
        <div className="form-actions">
          <button type="submit">Save Image Changes</button>
          <Link
            className="secondary-action secondary-action--light"
            href={imagesHref}
          >
            Cancel
          </Link>
          {setupFlow ? (
            <Link
              className="primary-action"
              href={`/?module=add-product-box&product=${product.id}&setup=product`}
            >
              Continue to Packing
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export async function EditProductPartsForm({
  error,
  partAction,
  productId,
  selectedParts,
  setupFlow,
  loadProduct,
  updateProductPartsAction,
}: {
  error?: string;
  partAction?: string;
  productId?: string;
  selectedParts?: string;
  setupFlow?: boolean;
  loadProduct: LoadProduct;
  updateProductPartsAction: FormAction;
}) {
  const product = productId ? await loadProduct(productId) : null;

  const supabase = createSupabaseAdminClient();
  const { data: candidateProducts, error: candidateError } = await supabase
    .from("product")
    .select("id, sku, name, status, brand(name), product_category(name)")
    .neq("status", "deleted")
    .order("sku", { ascending: true })
    .limit(500);

  if (candidateError) {
    throw new Error(candidateError.message);
  }

  if (productId && !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  const activeAction: "add" | "delete" | "edit" = product
    ? partAction === "add" || partAction === "delete"
      ? partAction
      : "edit"
    : "add";
  const productOptions = candidateProducts ?? [];
  const initialSelectedPartIds = (selectedParts ?? "")
    .split(",")
    .map((partId) => partId.trim())
    .filter(Boolean);
  const cancelHref = product
    ? `/?module=products&product=${product.id}&product_tab=parts`
    : "/?module=product-parts";
  const pageTitle =
    activeAction === "add"
      ? "Add Product Part"
      : activeAction === "delete"
        ? "Delete Product Parts"
        : "Edit Product Parts";
  const submitLabel =
    activeAction === "add"
      ? "Save New Part"
      : activeAction === "delete"
        ? "Save Part Deletions"
        : "Save Part Changes";
  const optionLabel = (candidate: (typeof productOptions)[number]) => {
    const brandName = Array.isArray(candidate.brand)
      ? candidate.brand[0]?.name
      : candidate.brand?.name;
    const categoryName = Array.isArray(candidate.product_category)
      ? candidate.product_category[0]?.name
      : candidate.product_category?.name;

    return `${candidate.sku} / ${candidate.name} / ${brandName ?? "No brand"} / ${categoryName ?? "No category"}`;
  };

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={cancelHref}>
            {product ? "Product Parts" : "Parts List"}
          </Link>
          <div className="record-title-row">
            <h2>{pageTitle}</h2>
          </div>
          <p>
            {product
              ? `${product.sku} / ${product.name}`
              : "Select the parent product, then enter the new part."}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {setupFlow && product ? (
        <ProductSetupGuide currentStep="parts" productId={product.id} />
      ) : null}

      <form action={updateProductPartsAction} className="customer-form">
        <input name="product_id" type="hidden" value={product?.id ?? ""} />
        {setupFlow ? (
          <input name="setup_flow" type="hidden" value="product" />
        ) : null}

        <fieldset>
          <legend>Parent Product</legend>
          {product ? (
            <div className="readonly-summary">
              <strong>{product.sku}</strong>
              <span>{product.name}</span>
              <span>Parent product is set from the current product page.</span>
            </div>
          ) : (
            <div className="form-grid">
              <label className="full-width-field">
                Parent Product
                <select name="parent_product_id" required>
                  <option value="">Select a parent product</option>
                  {productOptions.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {optionLabel(candidate)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </fieldset>

        {product && activeAction !== "add" ? (
          <fieldset>
            <legend>Existing Parts</legend>
            <ProductPartsEditRows
              activeAction={activeAction}
              initialSelectedPartIds={initialSelectedPartIds}
              parentProductId={product.id}
              parts={product.parts}
              productOptions={productOptions.map((candidate) => ({
                id: candidate.id,
                name: candidate.name,
                sku: candidate.sku,
              }))}
              roleOptions={productPartRoleOptions}
            />
          </fieldset>
        ) : null}

        {activeAction === "add" ? (
          <fieldset className="highlight-panel">
            <legend>Add Part</legend>
            <div className="form-grid">
              <label>
                Part Name
                <input
                  name="new_part_product_name"
                  placeholder="Example: H23107 Glass Shade"
                />
              </label>
              <label>
                Initial Inventory
                <input
                  min={0}
                  name="new_part_initial_inventory"
                  step={1}
                  type="number"
                />
              </label>
              <label>
                Role
                <select name="new_part_role">
                  <option value="">Not set</option>
                  {productPartRoleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>
              <label className="checkbox-label">
                <input defaultChecked name="new_is_required" type="checkbox" />
                Required part
              </label>
              <label className="full-width-field">
                Notes
                <textarea
                  name="new_notes"
                  placeholder="Optional internal notes"
                  rows={3}
                />
              </label>
              <label className="full-width-field">
                Part Images
                <input
                  accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/tiff"
                  multiple
                  name="new_part_images"
                  type="file"
                />
              </label>
            </div>
            <p className="fieldset-note">
              The system will create this as a new Accessory product SKU, using
              the format PT [ROLE]-[5 random digits], and link it to the parent
              product above. Uploaded images are saved as stock images for the
              new part.
            </p>
          </fieldset>
        ) : null}

        <div className="form-actions">
          {activeAction === "add" ? (
            <button type="submit">{submitLabel}</button>
          ) : null}
          <Link
            className="secondary-action secondary-action--light"
            href={cancelHref}
          >
            Cancel
          </Link>
          {setupFlow && product ? (
            <Link
              className="primary-action"
              href={`/?module=edit-product-vendors&product=${product.id}&vendor_action=add&setup=product`}
            >
              Continue to Vendors
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export async function AddPartParentProductsForm({
  error,
  partId,
  loadProduct,
  addPartParentProductsAction,
}: {
  error?: string;
  partId?: string;
  loadProduct: LoadProduct;
  addPartParentProductsAction: FormAction;
}) {
  const part = partId ? await loadProduct(partId) : null;
  const supabase = createSupabaseAdminClient();
  const { data: candidates, error: candidatesError } = await supabase
    .from("product")
    .select("id, sku, name, brand(name), product_category(name, category_code)")
    .neq("status", "deleted")
    .order("sku", { ascending: true })
    .limit(500);

  if (candidatesError) {
    throw new Error(candidatesError.message);
  }

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

  const { data: originalPartLink, error: originalPartLinkError } =
    await supabase
      .from("product_part")
      .select("part_role")
      .eq("component_product_id", part.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

  if (originalPartLinkError) {
    throw new Error(originalPartLinkError.message);
  }

  const existingParentIds = new Set(
    part.usedInParents.map((parent) => parent.parent_product_id),
  );
  const parentCandidates = (candidates ?? []).filter((candidate) => {
    const category = Array.isArray(candidate.product_category)
      ? candidate.product_category[0]
      : candidate.product_category;
    const isAccessory =
      category?.category_code === "accessory" ||
      category?.name?.toLowerCase() === "accessory";

    return (
      candidate.id !== part.id &&
      !isAccessory &&
      !existingParentIds.has(candidate.id)
    );
  });

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={`/?module=product-parts&part=${part.id}&product_tab=parents`}
          >
            Parent Products
          </Link>
          <div className="record-title-row">
            <h2>Add Parent Products</h2>
          </div>
          <p>
            {part.sku} / {part.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}

      <form action={addPartParentProductsAction} className="customer-form">
        <input name="part_id" type="hidden" value={part.id} />
        <fieldset>
          <legend>Products to Link</legend>
          <p className="fieldset-note">
            Select one or more regular products that can use this part.
          </p>
          {parentCandidates.length === 0 ? (
            <p className="fieldset-note">
              All available regular products are already linked, or no regular
              products are available.
            </p>
          ) : (
            <PartParentProductPicker
              products={parentCandidates.map((candidate) => ({
                brandName:
                  (Array.isArray(candidate.brand)
                    ? candidate.brand[0]?.name
                    : candidate.brand?.name) ?? "No brand",
                id: candidate.id,
                name: candidate.name,
                sku: candidate.sku,
              }))}
            />
          )}
        </fieldset>

        <fieldset>
          <legend>Link Details</legend>
          <div className="form-grid">
            <label>
              Role
              <select
                name="part_role"
                defaultValue={originalPartLink?.part_role ?? ""}
              >
                <option value="">Not set</option>
                {productPartRoleOptions.map((role) => (
                  <option key={role} value={role}>
                    {label(role)}
                  </option>
                ))}
              </select>
            </label>
            <label className="checkbox-label">
              <input defaultChecked name="is_required" type="checkbox" />
              Required part
            </label>
            <label className="full-width-field">
              Notes
              <textarea
                name="notes"
                placeholder="Optional internal notes for these parent-product links"
                rows={3}
              />
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button disabled={parentCandidates.length === 0} type="submit">
            Add Parent Products
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=product-parts&part=${part.id}&product_tab=parents`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

export async function EditProductVendorsForm({
  error,
  productId,
  selectedVendorProducts,
  vendorAction,
  setupFlow,
  loadProduct,
  updateProductVendorsAction,
}: {
  error?: string;
  productId?: string;
  selectedVendorProducts?: string;
  vendorAction?: string;
  setupFlow?: boolean;
  loadProduct: LoadProduct;
  updateProductVendorsAction: FormAction;
}) {
  const product = productId ? await loadProduct(productId) : null;
  const supabase = createSupabaseAdminClient();
  const { data: vendors, error: vendorsError } = await supabase
    .from("vendor")
    .select("id, name")
    .eq("status", "active")
    .order("name", { ascending: true });

  if (vendorsError) throw new Error(vendorsError.message);

  if (!product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
      </section>
    );
  }

  const selectedIds = (selectedVendorProducts ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const action =
    vendorAction === "add" || vendorAction === "delete" ? vendorAction : "edit";
  const selectedVendors = product.vendors.filter((vendor) =>
    selectedIds.includes(vendor.id),
  );
  const cancelHref = `/?module=products&product=${product.id}&product_tab=vendors`;

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={cancelHref}>
            Product Vendors
          </Link>
          <div className="record-title-row">
            <h2>
              {action === "add"
                ? "Add Vendor"
                : action === "delete"
                  ? "Delete Product Vendors"
                  : "Edit Product Vendors"}
            </h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>
      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {setupFlow ? (
        <ProductSetupGuide currentStep="vendors" productId={product.id} />
      ) : null}
      <form action={updateProductVendorsAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        <input name="vendor_action" type="hidden" value={action} />
        {setupFlow ? (
          <input name="setup_flow" type="hidden" value="product" />
        ) : null}
        {selectedIds.map((id) => (
          <input
            key={id}
            name="selected_vendor_product_ids"
            type="hidden"
            value={id}
          />
        ))}
        {action === "add" ? (
          <fieldset>
            <legend>Vendor Product Details</legend>
            <div className="form-grid">
              <label>
                Vendor
                <select name="vendor_id" required>
                  <option value="">Select vendor</option>
                  {(vendors ?? []).map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Vendor Item No.
                <input name="vendor_item_number" required />
              </label>
              <label>
                Vendor Item Name
                <input name="vendor_item_name" />
              </label>
              <label>
                Vendor Price
                <input
                  min={0}
                  name="unit_cost"
                  required
                  step="0.0001"
                  type="number"
                />
              </label>
              <label>
                MOQ
                <input
                  min={0.001}
                  name="minimum_order_quantity"
                  step="0.001"
                  type="number"
                />
              </label>
              <label>
                Lead Time (days)
                <input min={0} name="lead_time_days" step={1} type="number" />
              </label>
            </div>
          </fieldset>
        ) : action === "delete" ? (
          <fieldset>
            <legend>Confirm Deletion</legend>
            <p className="fieldset-note">
              The selected vendor links will be removed from this product.
              Vendor master records are not deleted.
            </p>
            <ul>
              {selectedVendors.map((vendor) => (
                <li key={vendor.id}>{vendor.vendor_name}</li>
              ))}
            </ul>
          </fieldset>
        ) : (
          <fieldset>
            <legend>Selected Vendor Lines</legend>
            {selectedVendors.length === 0 ? (
              <p className="fieldset-note">No vendor lines were selected.</p>
            ) : (
              selectedVendors.map((vendor) => (
                <section className="info-card" key={vendor.id}>
                  <h3>{vendor.vendor_name}</h3>
                  <div className="form-grid">
                    <label>
                      Vendor Item No.
                      <input
                        defaultValue={vendor.vendor_item_number}
                        name={`vendor_item_number_${vendor.id}`}
                        required
                      />
                    </label>
                    <label>
                      Vendor Price
                      <input
                        defaultValue={vendor.unit_cost}
                        min={0}
                        name={`unit_cost_${vendor.id}`}
                        required
                        step="0.0001"
                        type="number"
                      />
                    </label>
                    <label>
                      MOQ
                      <input
                        defaultValue={vendor.minimum_order_quantity ?? ""}
                        min={0.001}
                        name={`minimum_order_quantity_${vendor.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label>
                      Lead Time (days)
                      <input
                        defaultValue={vendor.lead_time_days ?? ""}
                        min={0}
                        name={`lead_time_days_${vendor.id}`}
                        step={1}
                        type="number"
                      />
                    </label>
                  </div>
                </section>
              ))
            )}
          </fieldset>
        )}
        <div className="form-actions">
          <button
            className={action === "delete" ? "danger-action" : undefined}
            disabled={action !== "add" && selectedVendors.length === 0}
            type="submit"
          >
            {action === "add"
              ? "Add Vendor"
              : action === "delete"
                ? "Delete Selected"
                : "Save Vendor Changes"}
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={cancelHref}
          >
            Cancel
          </Link>
          {setupFlow ? (
            <Link
              className="primary-action"
              href={`/?module=products&product=${product.id}`}
            >
              Finish Setup
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export async function EditProductProfileForm({
  brandOptions,
  categoryOptions,
  error,
  productId,
  setupFlow,
  styleOptions,
  loadProduct,
  updateProductProfileAction,
}: {
  brandOptions: SelectOption[];
  categoryOptions: SelectOption[];
  error?: string;
  productId?: string;
  setupFlow?: boolean;
  styleOptions: SelectOption[];
  loadProduct: LoadProduct;
  updateProductProfileAction: FormAction;
}) {
  const product = productId ? await loadProduct(productId) : null;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={`/?module=products&product=${product.id}`}
          >
            Product Detail
          </Link>
          <div className="record-title-row">
            <h2>Edit Product Profile</h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {setupFlow ? (
        <ProductSetupGuide currentStep="profile" productId={product.id} />
      ) : null}

      <form action={updateProductProfileAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        {setupFlow ? (
          <input name="setup_flow" type="hidden" value="product" />
        ) : null}

        <fieldset>
          <legend>Core Product</legend>
          <div className="form-grid">
            <label>
              SKU
              <input defaultValue={product.sku} name="sku" required />
            </label>
            <label>
              Product Name
              <input defaultValue={product.name} name="name" required />
            </label>
            <label>
              Brand
              <select defaultValue={product.brand_id} name="brand_id" required>
                {brandOptions.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select
                defaultValue={product.category_id ?? ""}
                name="product_category_id"
              >
                <option value="">Not set</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Style / Suite
              <select
                defaultValue={product.signature_suite_id ?? ""}
                name="signature_suite_id"
              >
                <option value="">Not set</option>
                {styleOptions.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Collection / Family
              <input
                defaultValue={product.collection ?? ""}
                name="collection"
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Status / Eligibility</legend>
          <div className="form-grid">
            <label>
              Lifecycle Status
              <select defaultValue={product.status} name="status">
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
                <option value="deleted">Deleted</option>
              </select>
            </label>
            <label>
              Sellability
              <select
                defaultValue={product.sellability_status}
                name="sellability_status"
              >
                <option value="hidden">Hidden</option>
                <option value="sellable">Sellable</option>
                <option value="blocked">Blocked</option>
                <option value="override_required">Override Required</option>
              </select>
            </label>
            <label>
              Customer Eligibility
              <select
                defaultValue={product.customer_eligibility_tag}
                name="customer_eligibility_tag"
              >
                <option value="all">All</option>
                <option value="ecommerce_only">Ecommerce Only</option>
                <option value="non_ecommerce_only">Non-ecommerce Only</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </label>
            <label>
              Primary Showroom Count
              <select
                defaultValue={
                  product.counts_toward_primary_showroom_default === false
                    ? "no"
                    : "yes"
                }
                name="counts_toward_primary_showroom_default"
              >
                <option value="yes">Included</option>
                <option value="no">Excluded</option>
              </select>
            </label>
            <label className="full-width-field">
              Exclusion Reason
              <input
                defaultValue={product.primary_showroom_exclusion_reason ?? ""}
                name="primary_showroom_exclusion_reason"
              />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Pricing / Description</legend>
          <div className="form-grid">
            <label>
              Default Price
              <input
                defaultValue={product.default_price ?? ""}
                min="0"
                name="default_price"
                step="0.01"
                type="number"
              />
            </label>
            <label>
              Default Vendor Item No.
              <input
                defaultValue={product.default_vendor_item_number ?? ""}
                name="default_vendor_item_number"
              />
            </label>
            <label className="checkbox-label">
              <input
                defaultChecked={product.no_box_needed}
                name="no_box_needed"
                type="checkbox"
              />
              No box needed
            </label>
            <label className="full-width-field">
              Product Description
              <textarea
                defaultValue={product.description ?? ""}
                maxLength={3500}
                name="description"
                rows={7}
              />
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">
            {setupFlow ? "Save Profile and Continue to Specs" : "Save Product Profile"}
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=products&product=${product.id}`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

export async function EditProductSpecsForm({
  error,
  productId,
  setupFlow,
  specSection = "dimensions",
  loadProduct,
  updateProductSpecsAction,
}: {
  error?: string;
  productId?: string;
  setupFlow?: boolean;
  specSection?: string;
  loadProduct: LoadProduct;
  updateProductSpecsAction: FormAction;
}) {
  const product = productId ? await loadProduct(productId) : null;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  const normalizeSpecName = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const findSpec = (names: string[]) => {
    const wantedNames = new Set(names.map(normalizeSpecName));
    return (
      product.specAttributes.find((spec) =>
        wantedNames.has(normalizeSpecName(spec.attribute_name)),
      ) ?? null
    );
  };
  const fieldGroups: Record<
    string,
    {
      label: string;
      fields: {
        key: string;
        label: string;
        names: string[];
        unit?: string;
        inputType?: "checkbox";
        showUnit?: boolean;
      }[];
    }
  > = {
    dimensions: {
      label: "Dimensions and Weight",
      fields: [
        {
          key: "body_dimension",
          label: "Body Dimension",
          names: ["body dimension", "body dimensions", "body size"],
          unit: "in",
        },
        {
          key: "shade_dimension",
          label: "Shade Dimension",
          names: ["shade dimension", "shade dimensions", "shade size"],
          unit: "in",
        },
        {
          key: "canopy_shape_size",
          label: "Canopy Shape / Size",
          names: [
            "canopy shape / size",
            "canopy shape and size",
            "canopy detail",
            "canopy shape",
            "canopy size",
          ],
          unit: "in",
        },
        {
          key: "net_weight",
          label: "Net Weight",
          names: ["net weight", "product net weight"],
          unit: "lb",
        },
      ],
    },
    electrical: {
      label: "Electrical / Bulbs",
      fields: [
        {
          key: "max_wattage",
          label: "Max Wattage",
          names: ["max wattage", "maximum wattage"],
          unit: "W",
        },
        { key: "voltage", label: "Voltage", names: ["voltage"], unit: "V" },
        {
          key: "socket_type",
          label: "Socket Type",
          names: ["socket type"],
          showUnit: false,
        },
        {
          key: "number_of_bulbs",
          label: "Number of Bulbs",
          names: ["number of bulbs", "bulb count"],
          showUnit: false,
        },
        {
          key: "bulb_type",
          label: "Bulb Type",
          names: ["bulb type", "bulb types"],
          showUnit: false,
        },
        {
          key: "max_bulbs_wattage",
          label: "Max Bulbs Wattage",
          names: [
            "max bulbs wattage",
            "max bulb wattage",
            "maximum bulbs wattage",
            "max bulb voltage",
            "maximum bulb voltage",
          ],
          unit: "W",
        },
        {
          key: "bulbs_included",
          label: "Bulbs Included",
          names: ["bulbs included", "bulb included"],
          inputType: "checkbox",
          showUnit: false,
        },
      ],
    },
    hanging: {
      label: "Hanging / Suspension",
      fields: [
        {
          key: "suspension_system",
          label: "Suspension System",
          names: ["suspension system", "suspension type"],
          showUnit: false,
        },
      ],
    },
    led: {
      label: "Integrated LED",
      fields: [
        {
          key: "integrated_led",
          label: "Integrated LED",
          names: ["integrated led", "integrated led fixture"],
          inputType: "checkbox",
          showUnit: false,
        },
        {
          key: "dimmable",
          label: "Dimmable",
          names: ["dimmable"],
          inputType: "checkbox",
          showUnit: false,
        },
        {
          key: "dimmer_type",
          label: "Dimmer Type",
          names: ["dimmer type"],
          showUnit: false,
        },
        {
          key: "color_temperature",
          label: "Color Temperature",
          names: ["color temperature", "kelvin"],
          unit: "K",
        },
        {
          key: "lumen",
          label: "Lumen",
          names: ["lumen", "lumens"],
          unit: "lm",
        },
      ],
    },
    safety: {
      label: "Safety / Identifiers",
      fields: [
        {
          key: "safety_rating",
          label: "Safety Rating",
          names: ["safety rating", "safety rate", "ul etl"],
        },
        { key: "upc_code", label: "UPC Code", names: ["upc", "upc code"] },
      ],
    },
    packing: {
      label: "Packing Specification",
      fields: [
        {
          key: "cardboard_spec",
          label: "Cardboard Spec",
          names: ["cardboard spec", "cardboard specification"],
          showUnit: false,
        },
        {
          key: "foam_density",
          label: "Foam Density",
          names: ["foam density"],
          showUnit: false,
        },
      ],
    },
  };
  const sectionKey = Object.keys(fieldGroups).includes(specSection)
    ? specSection
    : "dimensions";
  const section = fieldGroups[sectionKey];
  const knownSpecNames = new Set(
    Object.values(fieldGroups).flatMap((group) =>
      group.fields.flatMap((field) => field.names.map(normalizeSpecName)),
    ),
  );
  const otherSpecs = product.specAttributes.filter(
    (spec) => !knownSpecNames.has(normalizeSpecName(spec.attribute_name)),
  );

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={`/?module=products&product=${product.id}&product_tab=specs`}
          >
            Product Specs
          </Link>
          <div className="record-title-row">
            <h2>Edit Product Specs</h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {setupFlow ? (
        <ProductSetupGuide currentStep="specs" productId={product.id} />
      ) : null}

      <nav className="tab-nav" aria-label="Spec edit sections">
        {[
          ...Object.entries(fieldGroups).map(([key, group]) => ({
            key,
            label: group.label,
          })),
          { key: "other", label: "Other Specs" },
        ].map((tab) => (
          <Link
            aria-current={
              (specSection === "other" ? "other" : sectionKey) === tab.key
                ? "page"
                : undefined
            }
            href={`/?module=edit-product-specs&product=${product.id}&spec_section=${tab.key}${setupFlow ? "&setup=product" : ""}`}
            key={tab.key}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <form action={updateProductSpecsAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        <input
          name="spec_section"
          type="hidden"
          value={specSection === "other" ? "other" : sectionKey}
        />
        {setupFlow ? (
          <input name="setup_flow" type="hidden" value="product" />
        ) : null}

        {specSection === "other" ? (
          <fieldset>
            <legend>Other Saved Specs</legend>
            {otherSpecs.length === 0 ? (
              <p className="fieldset-note">
                No other specs saved yet. Add custom specs below.
              </p>
            ) : null}
            <div className="form-grid">
              {otherSpecs.map((spec) => (
                <Fragment key={spec.id}>
                  <input
                    name="spec_fields"
                    type="hidden"
                    value={`${spec.id}|${spec.attribute_name}`}
                  />
                  <input
                    name={`spec_id_${spec.id}`}
                    type="hidden"
                    value={spec.id}
                  />
                  <label>
                    {spec.attribute_name}
                    <input
                      defaultValue={spec.attribute_value}
                      name={`spec_value_${spec.id}`}
                    />
                  </label>
                  <label>
                    Unit
                    <input
                      defaultValue={spec.unit ?? ""}
                      name={`spec_unit_${spec.id}`}
                    />
                  </label>
                </Fragment>
              ))}
            </div>
            <div className="form-subsection">
              <h3>Add Custom Specs</h3>
              <div className="form-grid">
                {[1, 2, 3].map((rowNumber) => (
                  <Fragment key={rowNumber}>
                    <label>
                      Spec Name
                      <input
                        name={`custom_spec_name_${rowNumber}`}
                        placeholder="Example: Backplate Material"
                      />
                    </label>
                    <label>
                      Spec Value
                      <input
                        name={`custom_spec_value_${rowNumber}`}
                        placeholder="Example: Steel"
                      />
                    </label>
                    <label>
                      Unit
                      <input
                        name={`custom_spec_unit_${rowNumber}`}
                        placeholder="Optional"
                      />
                    </label>
                  </Fragment>
                ))}
              </div>
            </div>
          </fieldset>
        ) : section.fields.length > 0 ? (
          <fieldset>
            <legend>{section.label}</legend>
            {sectionKey === "led" ? (
              <ProductLedSpecFields
                fields={section.fields.map((field) => {
                  const existingSpec = findSpec(field.names);

                  return {
                    existingId: existingSpec?.id ?? null,
                    inputType: field.inputType,
                    key: field.key,
                    label: field.label,
                    showUnit: field.showUnit,
                    unit: existingSpec?.unit ?? field.unit ?? "",
                    value: existingSpec?.attribute_value ?? "",
                  };
                })}
              />
            ) : (
              <div className="form-grid">
                {section.fields.map((field) => {
                  const existingSpec = findSpec(field.names);
                  const isChecked = ["yes", "true", "included", "1"].includes(
                    (existingSpec?.attribute_value ?? "").toLowerCase(),
                  );

                  return (
                    <Fragment key={field.key}>
                      <input
                        name="spec_fields"
                        type="hidden"
                        value={`${field.key}|${field.label}`}
                      />
                      {existingSpec ? (
                        <input
                          name={`spec_id_${field.key}`}
                          type="hidden"
                          value={existingSpec.id}
                        />
                      ) : null}
                      {field.inputType === "checkbox" ? (
                        <label className="checkbox-label">
                          <input
                            defaultChecked={isChecked}
                            name={`spec_value_${field.key}`}
                            type="checkbox"
                            value="Yes"
                          />
                          {field.label}
                        </label>
                      ) : field.showUnit !== false ? (
                        <label className="full-width-field">
                          {field.label}
                          <span className="spec-input-row">
                            <input
                              defaultValue={existingSpec?.attribute_value ?? ""}
                              name={`spec_value_${field.key}`}
                            />
                            <input
                              aria-label={`${field.label} unit`}
                              defaultValue={
                                existingSpec?.unit ?? field.unit ?? ""
                              }
                              name={`spec_unit_${field.key}`}
                            />
                          </span>
                        </label>
                      ) : field.key === "suspension_system" ? (
                        <label>
                          {field.label}
                          <select
                            defaultValue={existingSpec?.attribute_value ?? ""}
                            name={`spec_value_${field.key}`}
                          >
                            <option value="">Not set</option>
                            <option value="Standard">
                              Standard - installed onto ceiling box
                            </option>
                            <option value="Heavy Duty">
                              Heavy Duty - mounted to building structure
                            </option>
                          </select>
                        </label>
                      ) : (
                        <label>
                          {field.label}
                          <input
                            defaultValue={existingSpec?.attribute_value ?? ""}
                            name={`spec_value_${field.key}`}
                          />
                        </label>
                      )}
                      {field.showUnit === false ? (
                        <input
                          name={`spec_unit_${field.key}`}
                          type="hidden"
                          value=""
                        />
                      ) : null}
                    </Fragment>
                  );
                })}
              </div>
            )}
          </fieldset>
        ) : null}

        {sectionKey === "hanging" && specSection !== "other" ? (
          <fieldset>
            <legend>Hanging Configuration</legend>
            <input name="include_hanging_config" type="hidden" value="yes" />
            <div className="form-grid">
              <label>
                Mounting Type
                <select
                  defaultValue={product.hangingConfig?.mounting_type ?? ""}
                  name="hanging_mounting_type"
                >
                  <option value="">Not set</option>
                  <option value="Ceiling Mounted / Hardwired">
                    Ceiling Mounted / Hardwired
                  </option>
                  <option value="Chain Hung">Chain Hung</option>
                  <option value="Rod Hung">Rod Hung</option>
                  <option value="Cable Hung">Cable Hung</option>
                  <option value="Semi-Flush Mounted">Semi-Flush Mounted</option>
                  <option value="Flush Mounted">Flush Mounted</option>
                  <option value="Others">Others</option>
                </select>
              </label>
              <label>
                Wire Length
                <input
                  defaultValue={product.hangingConfig?.wire_length ?? ""}
                  name="hanging_wire_length"
                />
              </label>
              <label>
                Chain Length
                <input
                  defaultValue={product.hangingConfig?.chain_length ?? ""}
                  name="hanging_chain_length"
                />
              </label>
              <label>
                Rod Length / Sizes
                <input
                  defaultValue={product.hangingConfig?.rod_length ?? ""}
                  name="hanging_rod_length"
                />
              </label>
              <label>
                Canopy Detail
                <input
                  defaultValue={product.hangingConfig?.canopy_detail ?? ""}
                  name="hanging_canopy_detail"
                />
              </label>
              <label className="full-width-field">
                Hanging Notes
                <textarea
                  defaultValue={product.hangingConfig?.notes ?? ""}
                  name="hanging_notes"
                  rows={4}
                />
              </label>
            </div>
          </fieldset>
        ) : null}

        <div className="form-actions">
          <button type="submit">
            {setupFlow ? "Save Specs and Continue to Images" : "Save Product Specs"}
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=products&product=${product.id}&product_tab=specs`}
          >
            Cancel
          </Link>
          {setupFlow ? (
            <Link
              className="secondary-action secondary-action--light"
              href={`/?module=edit-product-images&product=${product.id}&setup=product`}
            >
              Skip to Images
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export async function EditProductBoxesForm({
  error,
  productId,
  setupFlow,
  loadProduct,
  updateProductBoxesAction,
}: {
  error?: string;
  productId?: string;
  setupFlow?: boolean;
  loadProduct: LoadProduct;
  updateProductBoxesAction: FormAction;
}) {
  const product = productId ? await loadProduct(productId) : null;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  const normalizePackingSpecName = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const packingSpecValue = (...names: string[]) => {
    const wantedNames = new Set(names.map(normalizePackingSpecName));
    const spec = product.specAttributes.find((item) =>
      wantedNames.has(normalizePackingSpecName(item.attribute_name)),
    );

    return spec?.attribute_value ?? "";
  };

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={`/?module=products&product=${product.id}&product_tab=packing`}
          >
            Packing / Boxes
          </Link>
          <div className="record-title-row">
            <h2>Edit Product Boxes</h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {setupFlow ? (
        <ProductSetupGuide currentStep="packing" productId={product.id} />
      ) : null}

      <form action={updateProductBoxesAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        {setupFlow ? (
          <input name="setup_flow" type="hidden" value="product" />
        ) : null}

        <fieldset>
          <legend>Packing Specification</legend>
          <div className="form-grid">
            <label>
              Cardboard Spec
              <input
                defaultValue={packingSpecValue(
                  "cardboard spec",
                  "cardboard specification",
                )}
                name="cardboard_spec"
                placeholder="Example: 150 LBS or 200 LBS"
              />
            </label>
            <label>
              Foam Density
              <input
                defaultValue={packingSpecValue("foam density")}
                name="foam_density"
                placeholder="Example: 8 kg or 12 kg"
              />
            </label>
          </div>
          <p className="fieldset-note">
            These packing standards can be provided to vendors/factories for
            production and packaging requirements.
          </p>
        </fieldset>

        <fieldset>
          <legend>Existing Boxes</legend>
          <div className="box-edit-list">
            {product.packingBoxes.length === 0 ? (
              <p className="fieldset-note">
                No active boxes yet. Use Add Box from the Packing / Boxes page.
              </p>
            ) : (
              product.packingBoxes.map((box) => (
                <section className="box-edit-panel" key={box.id}>
                  <div className="box-edit-header">
                    <div className="box-edit-title-row">
                      <strong>Box {box.box_sequence}</strong>
                      <label className="checkbox-label checkbox-label--box-header">
                        <input
                          defaultChecked={box.is_required_for_sale}
                          name={`is_required_for_sale_${box.id}`}
                          type="checkbox"
                        />
                        Required Box
                      </label>
                    </div>
                    <label className="checkbox-label checkbox-label--compact">
                      <input
                        name="delete_box_ids"
                        type="checkbox"
                        value={box.id}
                      />
                      Delete
                    </label>
                    <input name="box_ids" type="hidden" value={box.id} />
                  </div>
                  <div className="form-grid box-edit-grid">
                    <label className="box-field--label">
                      Label
                      <input
                        defaultValue={box.box_label ?? ""}
                        name={`box_label_${box.id}`}
                      />
                    </label>
                    <label className="box-field--number">
                      L
                      <input
                        defaultValue={box.box_length ?? ""}
                        min={0}
                        name={`box_length_${box.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label className="box-field--number">
                      W
                      <input
                        defaultValue={box.box_width ?? ""}
                        min={0}
                        name={`box_width_${box.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label className="box-field--number">
                      H
                      <input
                        defaultValue={box.box_height ?? ""}
                        min={0}
                        name={`box_height_${box.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label className="box-field--number">
                      Net lb
                      <input
                        defaultValue={box.net_weight ?? ""}
                        min={0}
                        name={`net_weight_${box.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label className="box-field--number">
                      Gross lb
                      <input
                        defaultValue={box.gross_weight ?? ""}
                        min={0}
                        name={`gross_weight_${box.id}`}
                        step="0.001"
                        type="number"
                      />
                    </label>
                    <label className="box-field--notes">
                      Notes
                      <input
                        defaultValue={box.notes ?? ""}
                        name={`notes_${box.id}`}
                      />
                    </label>
                  </div>
                </section>
              ))
            )}
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">
            {setupFlow ? "Save Packing and Continue to Inventory" : "Save Product Boxes"}
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=products&product=${product.id}&product_tab=packing`}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}

export async function AddProductBoxForm({
  error,
  productId,
  setupFlow,
  loadProduct,
  addProductBoxAction,
}: {
  error?: string;
  productId?: string;
  setupFlow?: boolean;
  loadProduct: LoadProduct;
  addProductBoxAction: FormAction;
}) {
  const product = productId ? await loadProduct(productId) : null;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  const nextBoxSequence =
    product.packingBoxes.reduce(
      (max, box) => Math.max(max, box.box_sequence),
      0,
    ) + 1;

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link
            className="subtle-link"
            href={`/?module=products&product=${product.id}&product_tab=packing`}
          >
            Packing / Boxes
          </Link>
          <div className="record-title-row">
            <h2>Add Product Box</h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {setupFlow ? (
        <ProductSetupGuide currentStep="packing" productId={product.id} />
      ) : null}

      <form action={addProductBoxAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        {setupFlow ? (
          <input name="setup_flow" type="hidden" value="product" />
        ) : null}

        <fieldset>
          <legend>Box Information</legend>
          <div className="form-grid">
            <label>
              Box No.
              <input
                readOnly
                value={`Box ${nextBoxSequence} - generated by system`}
              />
            </label>
            <label>
              Label
              <input name="new_box_label" placeholder="Optional box label" />
            </label>
            <label>
              Length
              <input min={0} name="new_box_length" step="0.001" type="number" />
            </label>
            <label>
              Width
              <input min={0} name="new_box_width" step="0.001" type="number" />
            </label>
            <label>
              Height
              <input min={0} name="new_box_height" step="0.001" type="number" />
            </label>
            <label>
              Net lb
              <input min={0} name="new_net_weight" step="0.001" type="number" />
            </label>
            <label>
              Gross lb
              <input
                min={0}
                name="new_gross_weight"
                step="0.001"
                type="number"
              />
            </label>
            <label className="checkbox-label">
              <input
                defaultChecked
                name="new_is_required_for_sale"
                type="checkbox"
              />
              Required Box
            </label>
            <label className="full-width-field">
              Notes
              <textarea name="new_notes" rows={3} />
            </label>
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit">Add Product Box</button>
          <Link
            className="secondary-action secondary-action--light"
            href={`/?module=products&product=${product.id}&product_tab=packing`}
          >
            Cancel
          </Link>
          {setupFlow ? (
            <Link
              className="primary-action"
              href={`/?module=edit-product-inventory&product=${product.id}&setup=product`}
            >
              Continue to Inventory
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export async function EditProductInventoryForm({
  error,
  productId,
  returnModule,
  setupFlow,
  warehouseLocationOptions,
  warehouseOptions,
  loadProduct,
  updateProductInventoryAction,
}: {
  error?: string;
  productId?: string;
  returnModule?: string;
  setupFlow?: boolean;
  warehouseLocationOptions: WarehouseLocationOption[];
  warehouseOptions: SelectOption[];
  loadProduct: LoadProduct;
  updateProductInventoryAction: FormAction;
}) {
  const product = productId ? await loadProduct(productId) : null;
  const returnToPart = returnModule === "product-parts";
  const inventoryHref = returnToPart
    ? `/?module=product-parts&part=${productId}&product_tab=inventory`
    : `/?module=products&product=${productId}&product_tab=inventory`;

  if (!productId || !product) {
    return (
      <section className="dashboard-panel">
        <div className="form-alert">Product was not found.</div>
        <Link
          className="secondary-action secondary-action--light"
          href="/?module=products"
        >
          Back to Product List
        </Link>
      </section>
    );
  }

  const warehouseSelect = (name: string, defaultValue?: string | null) => (
    <select defaultValue={defaultValue ?? ""} name={name}>
      <option value="">Not set</option>
      {warehouseOptions.map((warehouse) => (
        <option key={warehouse.id} value={warehouse.id}>
          {warehouse.name}
        </option>
      ))}
    </select>
  );

  return (
    <section className="dashboard-panel">
      <section className="record-hero">
        <div>
          <Link className="subtle-link" href={inventoryHref}>
            Inventory / Locations
          </Link>
          <div className="record-title-row">
            <h2>Edit Inventory / Locations</h2>
          </div>
          <p>
            {product.sku} / {product.name}
          </p>
        </div>
      </section>

      {error ? (
        <div className="form-alert">{decodeURIComponent(error)}</div>
      ) : null}
      {setupFlow && !returnToPart ? (
        <ProductSetupGuide currentStep="inventory" productId={product.id} />
      ) : null}

      <form action={updateProductInventoryAction} className="customer-form">
        <input name="product_id" type="hidden" value={product.id} />
        {setupFlow ? (
          <input name="setup_flow" type="hidden" value="product" />
        ) : null}
        {returnToPart ? (
          <input name="return_module" type="hidden" value="product-parts" />
        ) : null}

        <fieldset>
          <legend>Top-Level Sellable Quantity</legend>
          <div className="form-grid">
            <label>
              Current Sellable Quantity
              <input
                readOnly
                value={numberFormatter.format(
                  Number(product.sellable_quantity ?? 0),
                )}
              />
            </label>
            <label>
              Set Sellable Quantity
              <input
                min={0}
                name="target_sellable_quantity"
                step={1}
                type="number"
              />
            </label>
          </div>
          <p className="fieldset-note">
            For products with required boxes, this updates each required box
            balance to the same quantity. Product-level inventory is
            recalculated from box balances.
          </p>
        </fieldset>

        <fieldset>
          <legend>Inventory Balances</legend>
          <div className="table-wrap">
            <table className="editable-table">
              <thead>
                <tr>
                  <th>Delete</th>
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
                {product.inventoryBalances.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      No inventory balances found. Use Set Sellable Quantity to
                      create balances for required boxes.
                    </td>
                  </tr>
                ) : (
                  product.inventoryBalances.map((balance) => {
                    const canDeleteBalance =
                      balance.quantity_on_hand === 0 &&
                      balance.quantity_allocated === 0;

                    return (
                      <tr key={balance.id}>
                        <td>
                          {canDeleteBalance ? (
                            <label className="checkbox-label checkbox-label--compact">
                              <input
                                name="delete_balance_ids"
                                type="checkbox"
                                value={balance.id}
                              />
                              Delete
                            </label>
                          ) : (
                            "Locked"
                          )}
                        </td>
                        <td>
                          {balance.box_sequence
                            ? `Box ${balance.box_sequence}${balance.box_label ? ` / ${balance.box_label}` : ""}`
                            : "SKU balance"}
                          <input
                            name="balance_ids"
                            type="hidden"
                            value={balance.id}
                          />
                        </td>
                        <td>
                          {warehouseSelect(
                            `warehouse_id_${balance.id}`,
                            balance.warehouse_id,
                          )}
                        </td>
                        <td>
                          <input
                            defaultValue={balance.location_code}
                            list="inventory-location-codes"
                            name={`location_code_${balance.id}`}
                          />
                        </td>
                        <td>
                          <select
                            defaultValue={balance.inventory_condition}
                            name={`inventory_condition_${balance.id}`}
                          >
                            <option value="regular">Regular</option>
                            <option value="to_be_inspected">
                              To Be Inspected
                            </option>
                            <option value="hold">Hold</option>
                            <option value="damaged">Damaged</option>
                            <option value="demolished_trash">
                              Demolished / Trash
                            </option>
                          </select>
                        </td>
                        <td>
                          <input
                            defaultValue={Math.trunc(balance.quantity_on_hand)}
                            min={0}
                            name={`quantity_on_hand_${balance.id}`}
                            step={1}
                            type="number"
                          />
                        </td>
                        <td>
                          <input
                            defaultValue={Math.trunc(
                              balance.quantity_allocated,
                            )}
                            min={0}
                            name={`quantity_allocated_${balance.id}`}
                            step={1}
                            type="number"
                          />
                        </td>
                        <td>
                          {numberFormatter.format(balance.quantity_available)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <datalist id="inventory-location-codes">
              {warehouseLocationOptions.map((location) => (
                <option key={location.id} value={location.name.split(" / ")[0]}>
                  {location.warehouse_name} / {location.name}
                </option>
              ))}
            </datalist>
          </div>
        </fieldset>

        <fieldset>
          <legend>Add Inventory Location</legend>
          <div className="form-grid">
            <label>
              Box
              <select name="new_product_packing_box_id">
                <option value="">SKU balance / no specific box</option>
                {product.packingBoxes.map((box) => (
                  <option key={box.id} value={box.id}>
                    Box {box.box_sequence}
                    {box.box_label ? ` / ${box.box_label}` : ""}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Warehouse
              {warehouseSelect("new_warehouse_id")}
            </label>
            <label>
              Bin / Location
              <input
                list="inventory-location-codes"
                name="new_location_code"
                placeholder="Leave blank for Unspecified Pick Location"
              />
            </label>
            <label>
              Condition
              <select defaultValue="regular" name="new_inventory_condition">
                <option value="regular">Regular</option>
                <option value="to_be_inspected">To Be Inspected</option>
                <option value="hold">Hold</option>
                <option value="damaged">Damaged</option>
                <option value="demolished_trash">Demolished / Trash</option>
              </select>
            </label>
            <label>
              On Hand
              <input
                min={0}
                name="new_quantity_on_hand"
                step={1}
                type="number"
              />
            </label>
            <label>
              Allocated
              <input
                defaultValue={0}
                min={0}
                name="new_quantity_allocated"
                step={1}
                type="number"
              />
            </label>
          </div>
          <p className="fieldset-note">
            Use this when restocked inventory is stored in an additional
            warehouse/bin location after receiving or putaway. Leave the bin
            blank when the physical location is not yet recorded; the system
            will use the pickable Unspecified Pick Location.
          </p>
        </fieldset>

        <div className="form-actions">
          <button type="submit">
            {setupFlow ? "Save Inventory and Continue to Parts" : "Save Inventory / Locations"}
          </button>
          <Link
            className="secondary-action secondary-action--light"
            href={inventoryHref}
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
