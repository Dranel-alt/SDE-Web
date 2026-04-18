// ===== SHARED COMPONENTS =====
// This file injects the navbar and footer into every page

const basePath = window.location.pathname.includes('/pages/') ? '../' : '';

const LOGO_SVG = `<img src="${basePath}assets/logo.png"
  width="48"
  height="48"
  alt="e-Reklamo Logo"
  style="border-radius:8px;"/>`;

function getCurrentPage() {
  const path = window.location.pathname;
  if (path.includes('services')) return 'services';
  if (path.includes('contact')) return 'contact';
  if (path.includes('login') || path.includes('signup')) return 'login';
  if (path.includes('complaint')) return 'services';
  if (path.includes('official')) return '';
  return 'home';
}

function renderNavbar() {
  const current = getCurrentPage();
  const navHTML = `
  <nav class="navbar">
    <a href="../index.html" class="navbar-brand">
      ${LOGO_SVG}
      <div class="navbar-brand-text">
        <span class="brand-name">e-Reklamo</span>
        <span class="brand-sub">Barangay Lapasan</span>
      </div>
    </a>
    <div class="navbar-links">
      <a href="../index.html" class="${current === 'home' ? 'active' : ''}">Home</a>
      <a href="services.html" class="${current === 'services' ? 'active' : ''}">Services</a>
      <a href="contact.html" class="${current === 'contact' ? 'active' : ''}">Contact</a>
      <a href="login-resident.html" class="login-link ${current === 'login' ? 'active' : ''}">Login</a>
    </div>
  </nav>`;
  const el = document.getElementById('navbar');
  if (el) el.innerHTML = navHTML;
}

function renderFooter() {
  const footHTML = `
  <footer>
    <div class="footer-inner">
      <div class="footer-brand">
        ${LOGO_SVG}
        <div class="footer-brand-text">
          <div class="footer-name">e-Reklamo</div>
          <div class="footer-tagline">Barangay Lapasan</div>
          <div class="footer-desc">Serving our community with transparency, efficiency, and dedication to improve the lives of all residents. <strong>Katawhan Una Sa Tanan!</strong></div>
        </div>
      </div>
      <div class="footer-links">
        <nav>
          <a href="../index.html">Home</a>
          <a href="services.html">Services</a>
          <a href="contact.html">Contact</a>
        </nav>
        <div class="footer-connect">Connect With Us</div>
        <div class="footer-social">
          <a href="https://www.facebook.com/share/1QaQgPgkuP/" target="_blank" rel="noopener" title="Facebook" style="width:36px;height:36px;background:rgba(0,0,0,0.25);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background 0.2s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#fff">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">© 2026 e-Reklamo. All rights reserved.</div>
  </footer>`;
  const el = document.getElementById('footer');
  if (el) el.innerHTML = footHTML;
}

function initComponents() {
  renderNavbar();
  renderFooter();
}

document.addEventListener('DOMContentLoaded', initComponents);
