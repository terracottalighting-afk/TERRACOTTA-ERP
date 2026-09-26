begin;

create table public.primary_showroom_registration (
  id uuid primary key default gen_random_uuid(),
  primary_showroom_enrollment_id uuid not null references public.primary_showroom_enrollment(id) on delete cascade,
  registration_name text not null check (btrim(registration_name) <> ''),
  purpose text not null check (purpose in ('initial_participating', 'program_renewal', 'program_audit', 'other')),
  created_at timestamptz not null default now()
);

create index primary_showroom_registration_enrollment_idx on public.primary_showroom_registration(primary_showroom_enrollment_id, created_at desc);

create table public.primary_showroom_registration_attachment (
  id uuid primary key default gen_random_uuid(),
  primary_showroom_registration_id uuid not null references public.primary_showroom_registration(id) on delete cascade,
  attachment_id uuid not null references public.attachment(id) on delete cascade,
  attachment_type text not null check (attachment_type in ('document', 'image')),
  created_at timestamptz not null default now(),
  unique(primary_showroom_registration_id, attachment_id)
);

create index primary_showroom_registration_attachment_registration_idx on public.primary_showroom_registration_attachment(primary_showroom_registration_id, attachment_type);

grant select, insert, delete on table public.primary_showroom_registration to service_role;
grant select, insert, delete on table public.primary_showroom_registration_attachment to service_role;

commit;
