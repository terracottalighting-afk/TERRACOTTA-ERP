"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/ui";

type FormAction = (formData: FormData) => Promise<void>;

type AccountType = {
  id: string;
  is_active: boolean;
  name: string;
  type_code: string;
};

type FreightLevel = {
  free_freight_allowance: number | string;
  freight_rate_percent: number | string;
  id: string;
  is_active: boolean;
  level_name: string;
  sort_order: number;
};

type FreightLevelGroup = {
  account_type_id: string;
  freight_level_id: string;
  id: string;
  primary_showroom_requirement: boolean | null;
};

type DraftGroup = {
  accountTypeId: string;
  primaryShowroomRequirement: "any" | "yes" | "no";
};

const money = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export function FreightLevelManager({
  accountTypes,
  error,
  freightLevels,
  groups,
  saveAction,
}: {
  accountTypes: AccountType[];
  error?: string;
  freightLevels: FreightLevel[];
  groups: FreightLevelGroup[];
  saveAction: FormAction;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const activeAccountTypes = accountTypes.filter((accountType) => accountType.is_active);
  const activeLevels = freightLevels.filter((level) => level.is_active);
  const accountTypeById = new Map(accountTypes.map((accountType) => [accountType.id, accountType]));

  return (
    <section className="product-settings-manager">
      <div className="section-title product-settings-title">
        <div>
          <h3>Freight Levels</h3>
          <p className="fieldset-note">
            Set the free freight allowance and freight rate for each customer group.
          </p>
        </div>
        <div className="section-actions">
          <button
            className="small-action"
            onClick={() => setEditingId("new")}
            type="button"
          >
            Add Freight Level
          </button>
        </div>
      </div>
      {error ? <p className="form-error">{decodeURIComponent(error)}</p> : null}
      {editingId ? (
        <FreightLevelEditor
          accountTypes={activeAccountTypes}
          groups={groups.filter((group) => group.freight_level_id === editingId)}
          level={freightLevels.find((level) => level.id === editingId) ?? null}
          onCancel={() => setEditingId(null)}
          saveAction={saveAction}
        />
      ) : null}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Freight Level</th>
              <th>Customer Groups</th>
              <th>FFA</th>
              <th>Freight Rate</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeLevels.map((level) => {
              const levelGroups = groups.filter((group) => group.freight_level_id === level.id);
              return (
                <tr className={editingId === level.id ? "admin-row-selected" : undefined} key={level.id}>
                  <td><strong>{level.level_name}</strong></td>
                  <td>
                    {levelGroups.length
                      ? levelGroups.map((group) => {
                          const accountType = accountTypeById.get(group.account_type_id);
                          const showroomLabel = accountType?.type_code === "stocking_dealer"
                            ? group.primary_showroom_requirement === true
                              ? "Primary showroom"
                              : group.primary_showroom_requirement === false
                                ? "Not primary showroom"
                                : "All stocking dealers"
                            : null;
                          return [accountType?.name ?? "Unknown account type", showroomLabel]
                            .filter(Boolean)
                            .join(" - ");
                        }).join(", ")
                      : "No customer groups"}
                  </td>
                  <td>{money.format(Number(level.free_freight_allowance))}</td>
                  <td>{Number(level.freight_rate_percent)}%</td>
                  <td><StatusBadge tone="good" value="Active" /></td>
                  <td>
                    <button className="text-action text-action--button" onClick={() => setEditingId(level.id)} type="button">
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
            {activeLevels.length === 0 ? (
              <tr><td colSpan={6}>No freight levels have been configured.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FreightLevelEditor({
  accountTypes,
  groups,
  level,
  onCancel,
  saveAction,
}: {
  accountTypes: AccountType[];
  groups: FreightLevelGroup[];
  level: FreightLevel | null;
  onCancel: () => void;
  saveAction: FormAction;
}) {
  const [draftGroups, setDraftGroups] = useState<DraftGroup[]>(
    groups.map((group) => ({
      accountTypeId: group.account_type_id,
      primaryShowroomRequirement:
        group.primary_showroom_requirement === true
          ? "yes"
          : group.primary_showroom_requirement === false
            ? "no"
            : "any",
    })),
  );
  const [accountTypeId, setAccountTypeId] = useState(accountTypes[0]?.id ?? "");
  const [showroomRequirement, setShowroomRequirement] = useState<DraftGroup["primaryShowroomRequirement"]>("any");
  const selectedAccountType = accountTypes.find((accountType) => accountType.id === accountTypeId);
  const requiresShowroomChoice = selectedAccountType?.type_code === "stocking_dealer";

  const addGroup = () => {
    if (!accountTypeId) return;
    const nextGroup: DraftGroup = {
      accountTypeId,
      primaryShowroomRequirement: requiresShowroomChoice ? showroomRequirement : "any",
    };
    const isDuplicate = draftGroups.some(
      (group) =>
        group.accountTypeId === nextGroup.accountTypeId &&
        group.primaryShowroomRequirement === nextGroup.primaryShowroomRequirement,
    );
    if (!isDuplicate) setDraftGroups((current) => [...current, nextGroup]);
  };

  return (
    <form action={saveAction} className="product-setting-editor">
      {level ? <input name="freight_level_id" type="hidden" value={level.id} /> : null}
      <input name="customer_groups" type="hidden" value={JSON.stringify(draftGroups)} />
      <fieldset>
        <legend>{level ? "Edit Freight Level" : "Add Freight Level"}</legend>
        <div className="form-grid">
          <label>
            Freight Level Name
            <input defaultValue={level?.level_name ?? ""} name="level_name" placeholder="Level 1" required />
          </label>
          <label>
            Free Freight Allowance (FFA)
            <input defaultValue={level?.free_freight_allowance ?? ""} min="0" name="free_freight_allowance" required step="0.01" type="number" />
          </label>
          <label>
            Freight Rate (%)
            <input defaultValue={level?.freight_rate_percent ?? ""} min="0" name="freight_rate_percent" required step="0.0001" type="number" />
          </label>
          <label>
            Display Order
            <input defaultValue={level?.sort_order ?? 100} min="0" name="sort_order" required step="1" type="number" />
          </label>
          <label className="checkbox-label">
            <input defaultChecked={level?.is_active ?? true} name="is_active" type="checkbox" />
            Active freight level
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Customer Groups</legend>
        <p className="fieldset-note">
          Add one account type at a time. Stocking dealers can be restricted by primary showroom status.
        </p>
        <div className="form-grid">
          <label>
            Account Type
            <select onChange={(event) => { setAccountTypeId(event.target.value); setShowroomRequirement("any"); }} value={accountTypeId}>
              {accountTypes.map((accountType) => <option key={accountType.id} value={accountType.id}>{accountType.name}</option>)}
            </select>
          </label>
          {requiresShowroomChoice ? (
            <label>
              Primary Showroom
              <select onChange={(event) => setShowroomRequirement(event.target.value as DraftGroup["primaryShowroomRequirement"])} value={showroomRequirement}>
                <option value="any">All stocking dealers</option>
                <option value="yes">Primary showroom only</option>
                <option value="no">Not a primary showroom</option>
              </select>
            </label>
          ) : null}
        </div>
        <div className="form-actions">
          <button className="secondary-action" onClick={addGroup} type="button">Add Customer Group</button>
        </div>
        {draftGroups.length ? (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Account Type</th><th>Primary Showroom</th><th aria-label="Remove customer group" /></tr></thead>
              <tbody>
                {draftGroups.map((group, index) => {
                  const accountType = accountTypes.find((candidate) => candidate.id === group.accountTypeId);
                  return <tr key={`${group.accountTypeId}-${group.primaryShowroomRequirement}-${index}`}>
                    <td>{accountType?.name ?? "Unknown account type"}</td>
                    <td>{accountType?.type_code === "stocking_dealer" ? group.primaryShowroomRequirement === "yes" ? "Primary showroom only" : group.primaryShowroomRequirement === "no" ? "Not a primary showroom" : "All stocking dealers" : "Not applicable"}</td>
                    <td><button aria-label={`Remove ${accountType?.name ?? "customer group"}`} className="text-action text-action--button text-action--danger" onClick={() => setDraftGroups((current) => current.filter((_, currentIndex) => currentIndex !== index))} type="button">Remove</button></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        ) : <p className="empty-state">Add at least one customer group for this freight level.</p>}
      </fieldset>
      <div className="form-actions">
        <button className="primary-action" type="submit">{level ? "Save Freight Level" : "Create Freight Level"}</button>
        <button className="secondary-action secondary-action--light" onClick={onCancel} type="button">Cancel</button>
      </div>
    </form>
  );
}
