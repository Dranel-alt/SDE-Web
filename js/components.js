// ===== e-Reklamo Shared Components v2.0 =====

const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
const pagePath = window.location.pathname.includes('/pages/') ? '' : 'pages/';

function icon(name, label = '') {
  return `<span class="material-symbols-outlined icon" aria-hidden="true">${name}</span>`;
}

const LOGO_SVG = `<img src="${basePath}assets/logo.png" width="74" height="74" alt="e-Reklamo Logo"/>`;
const PROFILE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>`;

// Language strings
const LANG = {
  en: {
    home:'Home', services:'Services', contact:'Contact', login:'Login',
    tagline:'Barangay Lapasan',
    footerDesc: 'Serving our community with transparency, efficiency, and dedication to improve the lives of all residents.',
    footerMotto: 'Katawhan Una Sa Tanan!',
    connectWith: 'Connect With Us',
    rights: ' 2026 e-Reklamo Barangay Lapasan. All rights reserved.',
    accessibility: 'Accessibility:',
    largeText: 'Large Text',
    highContrast: 'High Contrast',
  },
  bi: {
    home:'Balay', services:'Serbisyo', contact:'Kontak', login:'Login',
    tagline:'Barangay Lapasan',
    footerDesc: 'Serving our community with transparency, efficiency, and dedication to improve the lives of all residents.',
    footerMotto: 'Katawhan Una Sa Tanan!',
    connectWith: 'I-konekta Kita',
    rights: ' 2026 e-Reklamo Barangay Lapasan. Tanan nga katungod gitagana.',
    accessibility: 'Accessibility:',
    largeText: 'Dagko nga Teksto',
    highContrast: 'Taas nga Kontrast',
  }
};

let currentLang = localStorage.getItem('ereklamo_lang') || 'en';
const THEME_KEY = 'ereklamo_theme';

function getStoredTheme() {
  const value = localStorage.getItem(THEME_KEY);
  return value === 'dark' || value === 'light' ? value : null;
}

function getSavedTheme() {
  return getStoredTheme() || 'light';
}

function applyTheme(theme = getSavedTheme(), persist = false) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark-mode', isDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if (document.body) document.body.classList.toggle('dark-mode', isDark);
  if (persist) {
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }
}

applyTheme(getSavedTheme());

function getLang() { return LANG[currentLang] || LANG.en; }

function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('services'))  return 'services';
  if (path.includes('contact'))   return 'contact';
  if (path.includes('login') || path.includes('signup')) return 'login';
  if (path.includes('complaint')) return 'services';
  if (path.includes('official'))  return '';
  if (path.includes('about'))     return 'about';
  if (path.includes('faq'))       return 'faq';
  return 'home';
}

function getSavedSessionUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || localStorage.getItem('ereklamo_user') || 'null');
  } catch {
    return null;
  }
}

function getRoleHome(role) {
  return role === 'admin' || role === 'official' ? 'official-dashboard.html' : 'resident-dashboard.html';
}

function getProfileHref(user = getSavedSessionUser()) {
  return `${pagePath}${user ? getRoleHome(user.role) : 'login-resident.html'}`;
}

function renderA11yBar() {
  return '';
}

function renderAnnouncementBar() {
  return '';
}

function renderNavbar() {
  const current = getCurrentPage();
  const L = getLang();
  const newBadge = getNewComplaintsCount();
  const badgeHtml = newBadge >0 ? `<span class="nav-badge" aria-label="${newBadge} new complaints">${newBadge}</span>` : '';
  const sessionUser = getSavedSessionUser();
  const profileHref = getProfileHref(sessionUser);
  const profileLabel = sessionUser ? `Open ${sessionUser.role || 'user'} profile` : L.login;
  const isDark = getSavedTheme() === 'dark';
  const themeLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  const navHTML = `
  <a href="#main-content" class="skip-link">Skip to main content</a>
  ${renderA11yBar()}
  ${renderAnnouncementBar()}
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <a href="${basePath}index.html" class="navbar-brand" aria-label="e-Reklamo home">
      ${LOGO_SVG}
      <div class="navbar-brand-text">
        <span class="brand-name">e-Reklamo</span>
        <span class="brand-sub">${L.tagline}</span>
      </div>
    </a>
    <div class="navbar-links" id="nav-links" role="menubar">
      <a href="${basePath}index.html"               class="${current==='home'?'active':''}"    role="menuitem">${L.home}</a>
      <a href="${basePath}pages/services.html"      class="${current==='services'?'active':''}" role="menuitem">${L.services}</a>
      <a href="${basePath}pages/faq.html"           class="${current==='faq'?'active':''}"     role="menuitem">FAQ</a>
      <a href="${basePath}pages/contact.html"       class="${current==='contact'?'active':''}" role="menuitem">${L.contact}</a>
      <button class="theme-toggle" id="theme-toggle" type="button" onclick="toggleDarkMode()" aria-label="${themeLabel}" aria-pressed="${isDark}" title="${themeLabel}">
        ${icon(isDark ? 'light_mode' : 'dark_mode')}
      </button>
      <a href="${profileHref}" class="login-link profile-login ${current==='login'?'active':''}" role="menuitem" aria-label="${profileLabel}" title="${profileLabel}">${PROFILE_ICON}${badgeHtml}</a>
    </div>
    <button class="hamburger" id="hamburger" onclick="toggleMobileMenu()" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mobile-menu">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="mobile-menu" id="mobile-menu" role="menu" aria-hidden="true">
    <a href="${basePath}index.html"                class="${current==='home'?'active':''}"    role="menuitem">${L.home}</a>
    <a href="${basePath}pages/services.html"       class="${current==='services'?'active':''}" role="menuitem">${L.services}</a>
    <a href="${basePath}pages/faq.html"            class="${current==='faq'?'active':''}"     role="menuitem">FAQ</a>
    <a href="${basePath}pages/contact.html"        class="${current==='contact'?'active':''}" role="menuitem">${L.contact}</a>
    <button class="mobile-theme-toggle" id="mobile-theme-toggle" type="button" onclick="toggleDarkMode()" aria-pressed="${isDark}">
      ${icon(isDark ? 'light_mode' : 'dark_mode')}<span>${isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
    <a href="${profileHref}" class="login-link"                        role="menuitem">${sessionUser ? 'Profile' : L.login}</a>
  </div>`;

  const el = document.getElementById('navbar');
  if (el) el.innerHTML = navHTML;

  // Restore accessibility states
  if (localStorage.getItem('ereklamo_large_text') === '1') {
    document.body.classList.add('large-text');
    const b = document.getElementById('btn-large-text');
    if (b) b.classList.add('active');
  }
  if (localStorage.getItem('ereklamo_high_contrast') === '1') {
    document.body.classList.add('high-contrast');
    const b = document.getElementById('btn-high-contrast');
    if (b) b.classList.add('active');
  }
  applyTheme(getSavedTheme());
}

async function refreshNavbarSession() {
  if (!window.eReklamo?.currentUser) return;
  const before = JSON.stringify(getSavedSessionUser() || null);
  const user = await window.eReklamo.currentUser();
  const after = JSON.stringify(user || getSavedSessionUser() || null);
  if (before !== after) renderNavbar();
}

function renderFooter() {
  const L = getLang();
  const footHTML = `
  <footer role="contentinfo">
    <div class="footer-inner">
      <div class="footer-brand">
        ${LOGO_SVG}
        <div class="footer-brand-text">
          <div class="footer-name">e-Reklamo</div>
          <div class="footer-tagline">Barangay Lapasan</div>
          <div class="footer-desc">${L.footerDesc} <strong>${L.footerMotto}</strong></div>
        </div>
      </div>
      <div class="footer-links">
        <nav aria-label="Footer navigation">
          <a href="${basePath}index.html">${L.home}</a>
          <a href="${basePath}pages/services.html">${L.services}</a>
          <a href="${basePath}pages/faq.html">FAQ</a>
          <a href="${basePath}pages/contact.html">${L.contact}</a>
        </nav>
        <div class="footer-connect">${L.connectWith}</div>
        <div class="footer-social">
          <a href="https://www.facebook.com/share/1QaQgPgkuP/" target="_blank" rel="noopener noreferrer" title="Facebook Page" aria-label="Visit our Facebook page">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>2026 e-Reklamo. All rights reserved.</span>
      <span>Barangay Lapasan, Cagayan de Oro City, Philippines</span>
    </div>
  </footer>`;
  const el = document.getElementById('footer');
  if (el) el.innerHTML = footHTML;
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn   = document.getElementById('hamburger');
  if (!menu || !btn) return;
  const isOpen = menu.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', isOpen);
  menu.setAttribute('aria-hidden', !isOpen);
}

// Close mobile menu on outside click
document.addEventListener('click', e => {
  const menu = document.getElementById('mobile-menu');
  const btn   = document.getElementById('hamburger');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }
});

// ===== ACCESSIBILITY =====
function toggleLargeText() {
  const active = document.body.classList.toggle('large-text');
  localStorage.setItem('ereklamo_large_text', active ? '1' : '0');
  const btn = document.getElementById('btn-large-text');
  if (btn) btn.classList.toggle('active', active);
}

function toggleHighContrast() {
  const active = document.body.classList.toggle('high-contrast');
  localStorage.setItem('ereklamo_high_contrast', active ? '1' : '0');
  const btn = document.getElementById('btn-high-contrast');
  if (btn) btn.classList.toggle('active', active);
}

function toggleDarkMode() {
  const nextTheme = getSavedTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme, true);
  renderNavbar();
}

// ===== LANGUAGE =====
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ereklamo_lang', lang);
  location.reload();
}

// ===== NOTIFICATIONS BADGE =====
function getNewComplaintsCount() {
  const list = JSON.parse(localStorage.getItem('ereklamo_complaints') || '[]');
  const lastSeen = parseInt(localStorage.getItem('ereklamo_last_seen') || '0');
  return list.filter(c =>new Date(c.dateRaw).getTime() >lastSeen).length;
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success', duration = 3500) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  const icons = {
    success: icon('check_circle'),
    error: icon('error_outline'),
    warning: icon('warning'),
    info: icon('info')
  };
  toast.innerHTML = `${icons[type] || icon('check_circle')}<span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() =>toast.remove(), 300);
  }, duration);
}

// ===== COPY TO CLIPBOARD =====
function copyToClipboard(text, btnEl) {
  navigator.clipboard.writeText(text).then(() => {
    if (btnEl) {
      const orig = btnEl.innerHTML;
      btnEl.innerHTML = `${icon('check_circle')} Copied!`;
      btnEl.classList.add('copied');
      setTimeout(() => { btnEl.innerHTML = orig; btnEl.classList.remove('copied'); }, 2000);
    }
    showToast('Copied to clipboard!');
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('Copied!');
  });
}

// ===== CATEGORY METADATA =====
const CATEGORIES = {
  'Garbage / Waste Management': { icon: 'delete', color: '#FF9F4A', bg: '#FEF3E2' },
  'Noise Complaint':            { icon: 'volume_up', color: '#D97706', bg: '#FEF3C7' },
  'Road / Infrastructure':      { icon: 'construction', color: '#FF9F4A', bg: '#FFF8F0' },
  'Peace and Order':            { icon: 'local_police', color: '#7C3AED', bg: '#EDE9FE' },
  'Flooding / Drainage':        { icon: 'water_drop', color: '#0891B2', bg: '#CFFAFE' },
  'Street Lights':              { icon: 'lightbulb', color: '#CA8A04', bg: '#FEF9C3' },
  'Health / Sanitation':        { icon: 'local_hospital', color: '#DC2626', bg: '#FEE2E2' },
  'Illegal Structures':         { icon: 'engineering', color: '#9A3412', bg: '#FFEDD5' },
  'Environmental':              { icon: 'eco', color: '#15803D', bg: '#F0FFF4' },
  'Animal Control':             { icon: 'pets', color: '#78350F', bg: '#FEF3C7' },
  'Other':                      { icon: 'assignment', color: '#6B7280', bg: '#F3F4F6' },
};

function getCatMeta(cat) {
  return CATEGORIES[cat] || CATEGORIES['Other'];
}

// ===== SLA HELPER =====
function getSLAInfo(complaint) {
  const filed = new Date(complaint.dateRaw);
  const now   = new Date();
  const days  = Math.floor((now - filed) / (1000 * 60 * 60 * 24));
  const SLA   = { critical: 1, high: 3, medium: 7, low: 14 };
  const limit = SLA[complaint.urgency] || 7;
  if (complaint.status === 'Resolved' || complaint.status === 'Closed') {
    return { label: 'Resolved', cls: 'sla-ok', days };
  }
  if (days >limit)     return { label: `Overdue by ${days - limit}d`, cls: 'sla-overdue', days };
  if (days >= limit - 1) return { label: `Due soon`, cls: 'sla-warning', days };
  return { label: `${limit - days}d remaining`, cls: 'sla-ok', days };
}

// ===== PUROK OPTIONS =====
const PUROK_OPTIONS = ['All', 'Purok 1', 'Purok 2', 'Purok 3', 'Purok 4', 'Purok 5', 'Purok 6', 'Purok 7', 'Purok 8'];

// ===== STORAGE HELPERS =====
const STORAGE_KEY = 'ereklamo_complaints';
function getComplaints()       { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
function saveComplaints(list)  { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

// ===== INIT =====
function initComponents() {
  renderNavbar();
  renderFooter();
  refreshNavbarSession();
  // Add main landmark if missing
  const main = document.querySelector('main') || document.querySelector('.page-fade');
  if (main && !main.id) main.id = 'main-content';
}

document.addEventListener('DOMContentLoaded', initComponents);

