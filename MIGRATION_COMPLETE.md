# Migration Status

The frontend now has a Supabase-ready data layer with a localStorage fallback.

Implemented:

- Role-aware login redirects:
  - resident -> `pages/resident-dashboard.html`
  - official/admin -> `pages/official-dashboard.html`
- Protected resident and official pages.
- Supabase Auth helpers through `js/appState.js`.
- Complaint creation with `CMP-YYYY-XXXXXX` reference numbers.
- Complaint listing, tracking, status timelines, and admin status updates.
- Internal admin notes and status event/audit insertion.
- Attachment type/size validation before submission.
- Debounced search, loading skeletons, toast notifications, and duplicate-submit prevention.
- Supabase schema in `database/supabase-schema.sql`.

Important:

- If `js/supabaseClient.js` still contains placeholder keys, the app uses localStorage demo fallback.
- Once real Supabase keys are configured and the SQL schema is run, the same pages use Supabase tables with RLS.
