# Barangay Issue Reporting and Tracking System

Welcome to the **Barangay Lapasan Complaint System** (e-Reklamo)! This web app streamlines community issue reporting, tracking, and management. Built with vanilla HTML, CSS, and JavaScript, it focuses on improving information flow and follow-up without needing a backend.

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
2. **Branch Out**: Create a feature branch: `git checkout -b my-feature`
3. **Make Changes**: Edit files, test with `npm start`
4. **Commit & Push**: `git add .; git commit -m "Add cool feature"; git push`
5. **Pull Request**: Open a PR on GitHub – we'll review!

### Common Hiccups & Fixes
- **"npm start not working?"** Run `npm install` first. If issues persist, try `npx live-server --open=./index.html`
- **Git branch confusion?** If you see "main vs master", rename: `git branch -m master main; git push -u origin main`
- **Merge conflicts?** Don't panic! VS Code highlights them. Choose the best version, save, then `git add .; git commit`
- **Push rejected?** Pull first: `git pull origin main`, resolve conflicts, then push
- **Code not showing on GitHub?** Check the branch dropdown – switch to the correct one
- **Vulnerabilities in npm audit?** They're in dev deps; safe for local dev. For production, consider switching to `http-server`

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
