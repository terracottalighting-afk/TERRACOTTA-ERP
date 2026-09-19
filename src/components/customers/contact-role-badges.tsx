import { EmptyState, StatusBadge } from "@/components/ui";

type ContactRoleFlags = {
  is_billing_contact: boolean;
  is_primary: boolean;
  is_purchasing_contact: boolean;
  is_showroom_floor_sales?: boolean;
  is_showroom_manager?: boolean;
  is_primary_showroom_contact?: boolean;
  is_warehouse_receiver?: boolean;
};

export function ContactRoleBadges({ contact }: { contact: ContactRoleFlags }) {
  const hasRoles =
    contact.is_primary ||
    contact.is_billing_contact ||
    contact.is_purchasing_contact ||
    contact.is_warehouse_receiver ||
    contact.is_showroom_floor_sales ||
    contact.is_showroom_manager ||
    contact.is_primary_showroom_contact;

  return (
    <div className="badge-row badge-row--left">
      {contact.is_primary ? <StatusBadge tone="good" value="Primary" /> : null}
      {contact.is_purchasing_contact ? (
        <StatusBadge value="Purchasing" />
      ) : null}
      {contact.is_billing_contact ? <StatusBadge value="Billing" /> : null}
      {contact.is_warehouse_receiver ? (
        <StatusBadge value="Warehouse Receiver" />
      ) : null}
      {contact.is_showroom_floor_sales ? (
        <StatusBadge value="Showroom Floor Sales" />
      ) : null}
      {contact.is_showroom_manager ? (
        <StatusBadge value="Showroom Manager" />
      ) : null}
      {contact.is_primary_showroom_contact ? (
        <StatusBadge tone="primary" value="Primary Showroom Contact" />
      ) : null}
      {!hasRoles ? <EmptyState text="No contact roles are selected." /> : null}
    </div>
  );
}
