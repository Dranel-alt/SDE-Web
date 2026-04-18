# Barangay Issue Reporting and Tracking System

Welcome to the **Barangay Lapasan Complaint System** (e-Reklamo)! This web app streamlines community issue reporting, tracking, and management. Built with vanilla HTML, CSS, and JavaScript, it focuses on improving information flow and follow-up without needing a backend.

## Table of Contents
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Setup for Contributors](#quick-setup-for-contributors)
  - [Optional: Daily Workflow for Contributors (Safer Approach)](#optional-daily-workflow-for-contributors-safer-approach)
  - [Alternative: Live Server Extension](#alternative-live-server-extension)
- [📁 Project Structure](#-project-structure)
- [🎯 How It Works](#-how-it-works)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)
- [How the Pages Connect](#how-the-pages-connect)
- [How Data is Stored](#how-data-is-stored)
- [Want to Customize?](#want-to-customize)

## 🚀 Getting Started

### Prerequisites
- **Node.js** (for npm) – Download from [nodejs.org](https://nodejs.org/)
- **Git** – Usually comes with VS Code, or download from [git-scm.com](https://git-scm.com/)
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
- Right-click `index.html` → "Open with Live Server"

## 📁 Project Structure

```
SDE-Web/
├── index.html              # Homepage
├── package.json            # npm scripts & deps
├── README.md               # This file!
├── assets/                 # Images & media
├── css/
│   └── style.css           # All styles
├── js/
│   └── components.js       # Shared components
└── pages/                  # All sub-pages
    ├── complaint.html      # Submit/track complaints
    ├── contact.html        # Contact info
    ├── login-resident.html # Login/signup
    ├── official-dashboard.html # Admin view
    ├── services.html       # Services overview
    └── track.html          # Public tracker
```

## 🎯 How It Works

- **Residents** log in, submit complaints, and track status
- **Officials** manage complaints via a dashboard
- Data stored in browser's localStorage (no server needed)
- Demo credentials: `resident` / `password123` or `official` / `official123`

## 🤝 Contributing

### First-Time Contributors? No worries!
This project is beginner-friendly. Here's what to expect:

1. **Fork & Clone**: Hit the "Fork" button on GitHub, then clone your fork
2. **Pull latest changes first**: `git pull origin main`
3. **Branch Out**: Create a feature branch: `git checkout -b my-feature`
4. **Make Changes**: Edit files, test with `npm start`
5. **Commit & Push**: `git add .; git commit -m "Add cool feature"; git push --set-upstream origin my-feature`
6. **Pull Request**: Open a PR on GitHub – we'll review!

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
- **Code not showing on GitHub?** Check the branch dropdown – switch to `main` or your branch.
- **Vulnerabilities in npm audit?** They're in dev deps; safe for local development. For production, consider switching to `http-server`.

### Tips for Smooth Sailing
- Test your changes in multiple browsers
- Keep commits small and descriptive
- Ask questions in Issues – we're here to help!
- Customize styles in `css/style.css` (uses CSS variables)

## 📞 Support

Found a bug? Have ideas? Open an Issue or start a Discussion on GitHub.

Happy coding! 🎉

---

## How the Pages Connect

```
Homepage (index.html)
    ↓ Login/SignUp button
Login Page (login-resident.html)
    ↓ Login as Resident → Success panel
Complaint Page (complaint.html)
    - Submit Complaint (2-step form)
    - My Complaints (search + list)
    ↓ Login as Official → Redirects to
Official Dashboard (official-dashboard.html)
    - View all complaints
    - Update status
    - Search & sort

Track Complaint (track.html)
    - Public tracker by ID or email
```

---

## How Data is Stored
- Complaints are saved in **localStorage** (browser storage)
- No backend/server needed — works completely in the browser
- Data persists even after closing the tab

---

## Want to Customize?
- Colors → Edit `css/style.css`, look for `:root { --primary: ... }`
- Add more complaint categories → Edit `complaint.html`, find `<select id="category">`
- Change hotline numbers → Edit `index.html` and `contact.html`
