-- Create the Supabase complaints table used by the e-Reklamo frontend
-- Run this file in Supabase SQL Editor if `public.complaints` is missing.

create extension if not exists pgcrypto;

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

create index if not exists complaints_status_idx on public.complaints(status);
create index if not exists complaints_resident_id_idx on public.complaints(resident_id);
create index if not exists complaints_reference_no_idx on public.complaints(reference_no);
create index if not exists complaints_created_at_idx on public.complaints(created_at desc);
create index if not exists complaints_urgency_idx on public.complaints(urgency);

alter table public.complaints enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on public.complaints to authenticated;

drop policy if exists "complaints_insert_own" on public.complaints;
create policy "complaints_insert_own"
on public.complaints for insert
with check (resident_id = auth.uid());

drop policy if exists "complaints_select_own_or_staff" on public.complaints;
create policy "complaints_select_own_or_staff"
on public.complaints for select
using (
  resident_id = auth.uid()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role in ('official', 'admin')
  )
);

drop policy if exists "complaints_update_staff" on public.complaints;
create policy "complaints_update_staff"
on public.complaints for update
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role in ('official', 'admin')
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role in ('official', 'admin')
  )
);
