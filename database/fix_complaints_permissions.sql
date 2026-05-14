-- Repair permissions for resident complaint submission.
-- Run this in Supabase SQL Editor if the app shows:
-- "permission denied for table complaints"

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.complaints to authenticated;
grant select, insert on public.complaint_status_events to authenticated;
grant select, insert on public.complaint_attachments to authenticated;

alter table public.profiles enable row level security;
alter table public.complaints enable row level security;
alter table public.complaint_status_events enable row level security;
alter table public.complaint_attachments enable row level security;

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

drop policy if exists "events_select_related" on public.complaint_status_events;
create policy "events_select_related"
on public.complaint_status_events for select
using (
  exists (
    select 1 from public.complaints c
    where c.id = complaint_id
    and (
      c.resident_id = auth.uid()
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid()
        and p.role in ('official', 'admin')
      )
    )
  )
);

drop policy if exists "events_insert_allowed" on public.complaint_status_events;
drop policy if exists "events_insert_staff" on public.complaint_status_events;
create policy "events_insert_allowed"
on public.complaint_status_events for insert
with check (
  exists (
    select 1 from public.complaints c
    where c.id = complaint_id
    and c.resident_id = auth.uid()
  )
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
    and p.role in ('official', 'admin')
  )
);

