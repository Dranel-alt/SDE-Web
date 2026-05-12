# Barangay Issue Reporting and Tracking System

Welcome to the **Barangay Lapasan Complaint System** (e-Reklamo)! This web app streamlines community issue reporting, tracking, and management. The frontend is built with vanilla HTML, CSS, and JavaScript, with Supabase-ready auth and complaint storage plus an optional Node/TypeScript backend foundation under `server/`.

## Table of Contents
- [ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Setup for Contributors](#quick-setup-for-contributors)
  - [Supabase Setup](#supabase-setup)
  - [Optional Backend API Setup](#optional-backend-api-setup)
  - [Optional: Daily Workflow for Contributors (Safer Approach)](#optional-daily-workflow-for-contributors-safer-approach)
  - [Alternative: Live Server Extension](#alternative-live-server-extension)
- [ Project Structure](#-project-structure)
- [ How It Works](#-how-it-works)
- [ Contributing](#-contributing)
- [ Support](#-support)
- [How the Pages Connect](#how-the-pages-connect)
- [How Data is Stored](#how-data-is-stored)
- [Want to Customize?](#want-to-customize)

##  Getting Started

### Prerequisites
- **Node.js** (for npm)  Download from [nodejs.org](https://nodejs.org/)
- **Git**  Usually comes with VS Code, or download from [git-scm.com](https://git-scm.com/)
- A code editor like VS Code

### Quick Setup for Contributors
1. **Clone the repo**:
   ```bash
   git clone https://github.com/Dranel-alt/SDE-Web.git
   cd SDE-Web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run locally**:
   ```bash
   npm start
   ```
   - Opens your browser at `http://127.0.0.1:8080` (or similar)
   - Hot-reloads on file changes

4. **Save and share your changes**:
   ```bash
   git add .
   git commit -m "Describe your changes"
   git push origin main
   ```
   - If you are using a feature branch, replace `main` with your branch name
   - If `git push` is rejected, run `git pull origin main` first and resolve any merge conflicts

### Supabase Setup
The static frontend can connect directly to Supabase using the publishable/anon key. Do not put a service role key in frontend code.

1. Create a Supabase project.
2. In Supabase SQL Editor, run [`database/supabase-schema.sql`](database/supabase-schema.sql).
3. Go to Project Settings > API and copy:
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY` or anon key on older projects
4. Put those values in [`js/supabaseClient.js`](js/supabaseClient.js).
5. For quick auth testing, temporarily disable email confirmation in Supabase Auth settings. Turn it back on before real deployment.

If `js/supabaseClient.js` still contains placeholder values, the app safely falls back to localStorage demo data.

### Optional Backend API Setup
The backend under `server/` is available if the team wants a server-controlled API later. It is not required for the current static Supabase flow.

1. **Create your local environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Start local PostgreSQL if not using hosted Supabase Postgres**:
   ```bash
   docker compose up -d db
   ```

3. **Create the backend database tables**:
   ```bash
   npm run migrate:api
   ```

4. **Run the backend API**:
   ```bash
   npm run dev:api
   ```
   The API runs at `http://localhost:3000`.

5. **Useful backend checks**:
   ```bash
   npm run typecheck
   npm run build:api
   ```

Available API endpoints:
- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`

##  Deployment

### Vercel Deployment (Recommended for Free Hosting)
The app is designed to work with Vercel's free tier for both frontend and backend.

#### Prerequisites
- Vercel account (free)
- Supabase project (free tier)

#### Deploy Steps
1. **Set up Supabase** (as above)

2. **Deploy Backend to Vercel**:
   - Connect your GitHub repo to Vercel
   - Set build command: `npm run build:api`
   - Set output directory: `dist/server/src`
   - Add environment variables from `.env` to Vercel project settings
   - Deploy

3. **Deploy Frontend to Vercel**:
   - Use the same repo
   - Set root directory to `/` (default)
   - Set build command: `npm run build` (if needed, but static)
   - Since it's static HTML, Vercel will serve it directly
   - Configure Supabase keys in `js/supabaseClient.js`

4. **Update CORS**:
   - In Vercel backend settings, update `CORS_ORIGIN` to include your frontend URL

#### Potential Issues
- **Cold starts**: Vercel serverless functions may have startup delays
- **Database connections**: Ensure Supabase allows connections from Vercel IPs
- **Environment variables**: Must be set in Vercel dashboard
- **File uploads**: If adding file uploads, may need cloud storage

### Docker Deployment (Alternative)
Use the provided `docker-compose.yml` for full containerized deployment.

```bash
docker-compose up -d
```

This starts the local PostgreSQL service used by the optional backend.

### Optional: Daily Workflow for Contributors (Safer Approach)
Want to contribute regularly but keep things safe? This optional workflow ensures your changes get reviewed before merging into the main codebase. Always work on your own fork and use pull requests for collaboration!

**Every time you start working:**
```bash
git pull origin main  # Sync with the latest changes
git checkout -b feature/your-feature-name  # Create a new branch for your work
# Make your changes here
npm start  # Test locally
```

**When ready to share:**
```bash
git add .
git commit -m "Describe your awesome changes"
git push origin feature/your-feature-name
```
Then, head to GitHub and create a **Pull Request** from your branch to the main repo. The maintainers will review your changes and merge them once approved. This keeps the main code stable and high-quality!

### Alternative: Live Server Extension
If npm feels overwhelming:
- Install "Live Server" in VS Code
- Right-click `index.html`  "Open with Live Server"

##  Project Structure

```
SDE-Web/
 index.html              # Homepage
 package.json            # npm scripts & deps
 README.md               # This file!
 .env.example            # Backend environment template
 docker-compose.yml      # Local PostgreSQL for collaborators
 database/
    supabase-schema.sql  # Supabase tables, RLS policies, and indexes
 server/                 # Node/TypeScript backend API
    migrations/         # Database schema migrations
    scripts/            # Local maintenance scripts
    src/                # API source code
 assets/                 # Images & media
 css/
    style.css           # All styles
js/
    components.js       # Shared components
    supabaseClient.js   # Browser Supabase client config
    appState.js         # Auth, role checks, complaint data layer
pages/                  # All sub-pages
     complaint.html      # Submit/track complaints
     contact.html        # Contact info
     login-resident.html # Login/signup
     resident-dashboard.html # Resident view
     official-dashboard.html # Admin view
     services.html       # Services overview
     track.html          # Public tracker
```

##  How It Works

- **Residents** log in, submit complaints, and track status
- **Officials** manage complaints via a dashboard
- Supabase is used when `js/supabaseClient.js` is configured
- localStorage remains as a safe demo fallback when Supabase keys are still placeholders
- Demo fallback credentials: `resident@example.com` / `password123` or `official@example.com` / `official123`

##  Contributing

### First-Time Contributors? No worries!
This project is beginner-friendly. Here's what to expect:

1. **Fork & Clone**: Hit the "Fork" button on GitHub, then clone your fork
2. **Pull latest changes first**: `git pull origin main`
3. **Branch Out**: Create a feature branch: `git checkout -b my-feature`
4. **Make Changes**: Edit files, test with `npm start`
5. **Commit & Push**: `git add .; git commit -m "Add cool feature"; git push --set-upstream origin my-feature`
6. **Pull Request**: Open a PR on GitHub  we'll review!

### Common Hiccups & Fixes
- **"npm start not working?"** Run `npm install` first. If issues persist, try `npx live-server --open=./index.html`
- **Git branch confusion?** If you see "main vs master", rename:
  ```bash
  git branch -m master main
  git push -u origin main
  ```
- **Pull before you start**: Always do `git pull origin main` before editing files.
- **Push rejected?** That means someone changed the remote first. Run:
  ```bash
  git pull origin main
  ```
  Resolve any conflicts, then `git push` again.
- **Merge conflicts?** VS Code highlights conflict markers. Keep the best content, save, and finish with:
  ```bash
  git add <file>
  git commit -m "Resolve merge conflict"
  ```
- **Code not showing on GitHub?** Check the branch dropdown  switch to `main` or your branch.
- **Vulnerabilities in npm audit?** They're in dev deps; safe for local development. For production, consider switching to `http-server`.

### Tips for Smooth Sailing
- Test your changes in multiple browsers
- Keep commits small and descriptive
- Ask questions in Issues  we're here to help!
- Customize styles in `css/style.css` (uses CSS variables)

##  Support

Found a bug? Have ideas? Open an Issue or start a Discussion on GitHub.

Happy coding! 

---

## How the Pages Connect

```
Homepage (index.html)
     Login/SignUp button
Login Page (login-resident.html)
     Resident role -> Resident Dashboard
     Official/Admin role -> Official Dashboard
Resident Dashboard (resident-dashboard.html)
    - View own complaints
    - Track status timeline
Complaint Page (complaint.html)
    - Submit Complaint (2-step form)
    - My Complaints (search + list)
Official Dashboard (official-dashboard.html)
    - View all complaints
    - Filter queue, assign department, update status
    - Add internal notes and audit events
    - Search & sort

Track Complaint (track.html)
    - Public tracker by reference number or email
```

---

## How Data is Stored
- When `js/supabaseClient.js` is configured, auth, complaints, status events, and profiles use Supabase with RLS.
- When Supabase keys are placeholders, the app uses localStorage demo fallback so pages do not break.
- The optional backend uses PostgreSQL through `DATABASE_URL`, but the current static flow does not require it.

---

## Want to Customize?
- Colors  Edit `css/style.css`, look for `:root { --primary: ... }`
- Add more complaint categories  Edit `complaint.html`, find `<select id="category">`
- Change hotline numbers  Edit `index.html` and `contact.html`
