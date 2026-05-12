# E-Reklamo Supabase Setup Guide

This project can run as a static frontend with Supabase Auth, PostgreSQL tables, Row Level Security, and localStorage fallback while keys are not configured.

## Setup

1. Create a Supabase project.
2. Open Supabase SQL Editor and run:
   - `database/supabase-schema.sql`
3. Go to Project Settings > API and copy:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY` or anon key on older projects
4. Edit `js/supabaseClient.js`:

```js
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'your-publishable-or-anon-key';
```

Do not use the service role key in frontend code.

## Quick Testing

For early testing, temporarily disable email confirmation in Supabase Auth settings. If confirmation stays enabled, signup can create a user but may not return an active session until the email is confirmed.

Minimum test path:

1. Create account on `pages/login-resident.html`.
2. Confirm user appears in Supabase Authentication > Users.
3. Submit a complaint on `pages/complaint.html`.
4. Confirm row appears in `complaints`.
5. Open `pages/official-dashboard.html` with an official/admin profile and update status.
6. Confirm an event appears in `complaint_status_events`.

New Supabase signups are residents by default. To test the admin dashboard, update a trusted test account in Table Editor > profiles and set `role` to `official` or `admin`.

## Tables

- `profiles`
- `complaints`
- `complaint_status_events`
- `complaint_attachments`

## Performance Protections

The schema includes indexes for:

- `status`
- `resident_id`
- `reference_no`
- `created_at`
- `urgency`

The frontend also uses limited result ranges, debounced search, loading states, and duplicate-submit prevention.
