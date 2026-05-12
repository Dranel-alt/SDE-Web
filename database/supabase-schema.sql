-- e-Reklamo Supabase starter schema
-- Run in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'resident' check (role in ('resident', 'official', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  reference_no text not null unique,
  resident_id uuid references public.profiles(id) on delete set null,
  first_name text not null,
  last_name text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  category text not null,
  subject text not null,
  description text not null,
  location text not null,
  urgency text not null default 'medium' check (urgency in ('low', 'medium', 'high', 'critical')),
  status text not null default 'submitted' check (status in ('submitted', 'pending_review', 'under_review', 'assigned', 'in_progress', 'resolved', 'closed')),
  assigned_department text,
  internal_notes text,
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.complaint_status_events (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  status text not null,
  note text,
  changed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.complaint_attachments (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_type text not null,
  file_size integer not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists complaints_status_idx on public.complaints(status);
create index if not exists complaints_resident_id_idx on public.complaints(resident_id);
create index if not exists complaints_reference_no_idx on public.complaints(reference_no);
create index if not exists complaints_created_at_idx on public.complaints(created_at desc);
create index if not exists complaints_urgency_idx on public.complaints(urgency);
create index if not exists complaint_status_events_complaint_id_idx on public.complaint_status_events(complaint_id);

alter table public.profiles enable row level security;
alter table public.complaints enable row level security;
alter table public.complaint_status_events enable row level security;
alter table public.complaint_attachments enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'resident'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "profiles_select_own_or_staff"
on public.profiles for select
using (id = auth.uid() or public.current_profile_role() in ('official', 'admin'));

create policy "profiles_update_own_name"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy "complaints_insert_own"
on public.complaints for insert
with check (resident_id = auth.uid());

create policy "complaints_select_own_or_staff"
on public.complaints for select
using (resident_id = auth.uid() or public.current_profile_role() in ('official', 'admin'));

create policy "complaints_update_staff"
on public.complaints for update
using (public.current_profile_role() in ('official', 'admin'))
with check (public.current_profile_role() in ('official', 'admin'));

create policy "events_select_related"
on public.complaint_status_events for select
using (
  exists (
    select 1 from public.complaints c
    where c.id = complaint_id
    and (c.resident_id = auth.uid() or public.current_profile_role() in ('official', 'admin'))
  )
);

create policy "events_insert_staff"
on public.complaint_status_events for insert
with check (public.current_profile_role() in ('official', 'admin') or changed_by = auth.uid());

create policy "attachments_select_related"
on public.complaint_attachments for select
using (
  exists (
    select 1 from public.complaints c
    where c.id = complaint_id
    and (c.resident_id = auth.uid() or public.current_profile_role() in ('official', 'admin'))
  )
);

create or replace function public.track_complaints(search_text text)
returns table (
  id uuid,
  reference_no text,
  category text,
  subject text,
  description text,
  location text,
  urgency text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    c.id,
    c.reference_no,
    c.category,
    c.subject,
    c.description,
    c.location,
    c.urgency,
    c.status,
    c.created_at,
    c.updated_at
  from public.complaints c
  where lower(c.reference_no) = lower(search_text)
     or lower(c.email) = lower(search_text)
  order by c.created_at desc
  limit 10
$$;

grant execute on function public.track_complaints(text) to anon, authenticated;
