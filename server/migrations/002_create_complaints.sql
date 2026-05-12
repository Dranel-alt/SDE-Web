create table if not exists complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  category text not null,
  subject text not null,
  description text not null,
  location text not null,
  urgency text not null check (urgency in ('low', 'medium', 'high', 'critical')),
  status text not null default 'pending_review' check (status in ('pending_review', 'under_review', 'in_progress', 'resolved', 'closed')),
  progress integer not null default 25 check (progress >= 0 and progress <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists complaints_user_id_idx on complaints (user_id);
create index if not exists complaints_email_idx on complaints (email);
create index if not exists complaints_status_idx on complaints (status);