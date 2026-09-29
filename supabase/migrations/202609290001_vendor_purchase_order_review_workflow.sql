alter type public.vendor_purchase_order_status add value if not exists 'ready_for_review';
alter type public.vendor_purchase_order_status add value if not exists 'for_vendor_confirmation';

alter table public.vendor_purchase_order
  add column if not exists expected_available_date date,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by_user_id uuid references public.user_account(id),
  add column if not exists review_notes text,
  add column if not exists vendor_confirmed_at timestamptz;

insert into public.permission (permission_code, permission_area, name, description, permission_action, is_sensitive)
values
  ('purchasing.vendor_po.review', 'purchasing', 'Vendor PO Review', 'Approve or reject purchase orders that are ready for review.', 'review', false)
on conflict (permission_code) do update
set permission_area = excluded.permission_area,
    name = excluded.name,
    description = excluded.description,
    permission_action = excluded.permission_action,
    is_sensitive = excluded.is_sensitive;

insert into public.role_permission (role_id, permission_id, permission_level)
select role.id, permission.id, 'admin'::public.permission_level
from public.role
join public.permission on permission.permission_code = 'purchasing.vendor_po.review'
where role.role_code = 'system_admin'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

insert into public.role_permission (role_id, permission_id, permission_level)
select role.id, permission.id, 'approve_post'::public.permission_level
from public.role
join public.permission on permission.permission_code = 'purchasing.vendor_po.review'
where role.role_code = 'operations_manager'
on conflict (role_id, permission_id) do update
set permission_level = excluded.permission_level;

grant select, insert, update on table public.vendor_purchase_order to service_role;
