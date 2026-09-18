export function DropshipSettingsManager({
  error,
  isActive,
  ratePercent,
  saveAction,
}: {
  error?: string;
  isActive: boolean;
  ratePercent: number;
  saveAction: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <section className="product-settings-manager">
      <div className="section-title product-settings-title">
        <div>
          <h3>Dropship Settings</h3>
          <p className="fieldset-note">
            Apply a percentage fee to manual Ship-to / Drop Ship orders.
          </p>
        </div>
      </div>
      {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
      <form action={saveAction} className="product-setting-editor">
        <fieldset>
          <legend>Dropship Fee</legend>
          <div className="form-grid">
            <label>
              Dropship Rate (%)
              <input
                defaultValue={ratePercent}
                min="0"
                name="dropship_rate_percent"
                required
                step="0.01"
                type="number"
              />
            </label>
            <label className="checkbox-label">
              <input defaultChecked={isActive} name="is_active_dropship" type="checkbox" />
              Active Dropship
            </label>
          </div>
          <p className="fieldset-note">
            When active, the fee is calculated from the order subtotal and from each shipment subtotal. Inactive settings do not add a Dropship Fee to new order acknowledgements or invoices.
          </p>
        </fieldset>
        <div className="form-actions">
          <button className="primary-action" type="submit">
            Save Dropship Settings
          </button>
        </div>
      </form>
    </section>
  );
}
