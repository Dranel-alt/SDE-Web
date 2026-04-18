# e-Reklamo – Barangay Lapasan Complaint System
## How to Run in VSCode

### Option 1: Live Server (Recommended for Beginners)
1. Open VSCode
2. Install the **"Live Server"** extension (search in Extensions panel → Ctrl+Shift+X)
3. Open the `e-reklamo` folder in VSCode (File → Open Folder)
4. Right-click `index.html` → **"Open with Live Server"**
5. Your browser opens automatically at `http://127.0.0.1:5500`

### Option 2: Just double-click
- Double-click `index.html` to open directly in your browser
- NOTE: Some features (like localStorage) work better with Live Server

---

## Folder Structure

```
e-reklamo/
│
├── index.html              ← HOMEPAGE (start here)
│
├── css/
│   └── style.css           ← All styles for every page
│
├── js/
│   └── components.js       ← Shared navbar + footer (auto-injected)
│
└── pages/
    ├── login-resident.html    ← Login + Signup (Resident & Official)
    ├── services.html          ← Services landing page
    ├── contact.html           ← Contact & Hotlines page
    ├── complaint.html         ← Submit Complaint + My Complaints
    ├── official-dashboard.html ← Official/Admin Dashboard
    └── track.html             ← Public complaint tracker
```

---

## Demo Login Credentials

| Role     | Username  | Password     |
|----------|-----------|--------------|
| Resident | resident  | password123  |
| Official | official  | official123  |

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
