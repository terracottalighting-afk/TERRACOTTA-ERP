type FormAction = (formData: FormData) => Promise<void>;

type InspectionPoint = {
  area_id: string;
  expected_result: string | null;
  id: string;
  is_active: boolean;
  point_name: string;
  sort_order: number;
};

type InspectionArea = {
  area_name: string;
  id: string;
  is_active: boolean;
  sort_order: number;
};

export function ExFactoryQaSettingsManager({ areas, deactivateAction, error, points, saveAreaAction, savePointAction }: { areas: InspectionArea[]; deactivateAction: FormAction; error?: string; points: InspectionPoint[]; saveAreaAction: FormAction; savePointAction: FormAction }) {
  const activeAreas = areas.filter((area) => area.is_active);
  const activePoints = points.filter((point) => point.is_active);

  return <section className="product-settings-manager">
    <div className="section-title product-settings-title"><div><h3>Ex-Factory QA Configuration</h3><p className="fieldset-note">Configure inspection areas and the checkpoints shown for every purchase-order SKU.</p></div></div>
    {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
    <form action={saveAreaAction} className="product-setting-editor"><fieldset><legend>Add Inspection Area</legend><div className="form-grid"><label>Inspection Area Name<input name="area_name" placeholder="Area name in Chinese and English" required /></label><label>Display Order<input defaultValue={activeAreas.length * 10 + 10} min="0" name="sort_order" required type="number" /></label></div></fieldset><div className="form-actions"><button className="primary-action" type="submit">Add Inspection Area</button></div></form>
    <div className="section-stack qa-setting-areas">
      {activeAreas.map((area) => <section className="qa-setting-area" key={area.id}>
        <div className="section-title"><h3>{area.area_name}</h3><div className="section-title-actions"><span>{activePoints.filter((point) => point.area_id === area.id).length}</span><details className="inline-editor"><summary className="text-action">Edit</summary><form action={saveAreaAction} className="compact-setting-form"><input name="inspection_area_id" type="hidden" value={area.id} /><label>Name<input defaultValue={area.area_name} name="area_name" required /></label><label>Order<input defaultValue={area.sort_order} min="0" name="sort_order" required type="number" /></label><button className="small-action" type="submit">Save Area</button></form></details><form action={deactivateAction} className="inline-form"><input name="configuration_type" type="hidden" value="area" /><input name="configuration_id" type="hidden" value={area.id} /><button className="text-action text-action--button text-action--danger" type="submit">Deactivate</button></form></div></div>
        <div className="table-wrap"><table><thead><tr><th>Inspection Point</th><th>Expected Value or Result</th><th>Order</th><th>Action</th></tr></thead><tbody>{activePoints.filter((point) => point.area_id === area.id).map((point) => <tr key={point.id}><td>{point.point_name}</td><td className="qa-expected-result">{point.expected_result || "Not set"}</td><td>{point.sort_order}</td><td><details className="inline-editor"><summary className="text-action">Edit</summary><form action={savePointAction} className="compact-setting-form compact-setting-form--wide"><input name="inspection_point_id" type="hidden" value={point.id} /><input name="inspection_area_id" type="hidden" value={area.id} /><label>Name<input defaultValue={point.point_name} name="point_name" required /></label><label>Expected Value or Result<textarea defaultValue={point.expected_result ?? ""} name="expected_result" required /></label><label>Order<input defaultValue={point.sort_order} min="0" name="sort_order" required type="number" /></label><button className="small-action" type="submit">Save Point</button></form></details><form action={deactivateAction} className="inline-form"><input name="configuration_type" type="hidden" value="point" /><input name="configuration_id" type="hidden" value={point.id} /><button className="text-action text-action--button text-action--danger" type="submit">Deactivate</button></form></td></tr>)}{!activePoints.some((point) => point.area_id === area.id) ? <tr><td colSpan={4}>No inspection points have been configured for this area.</td></tr> : null}</tbody></table></div>
        <form action={savePointAction} className="qa-add-point-form"><input name="inspection_area_id" type="hidden" value={area.id} /><label>Inspection Point<input name="point_name" required /></label><label>Expected Value or Result<textarea name="expected_result" required /></label><label>Display Order<input defaultValue={activePoints.filter((point) => point.area_id === area.id).length * 10 + 10} min="0" name="sort_order" required type="number" /></label><button className="small-action" type="submit">Add Inspection Point</button></form>
      </section>)}
      {!activeAreas.length ? <p className="fieldset-note">Run the Ex-Factory QA migration or add the first inspection area.</p> : null}
    </div>
  </section>;
}
