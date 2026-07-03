/* ==========================================
   ENTERPRISE HEALTHCARE SAAS - MAIN APP ORCHESTRATOR
   app.js
   ========================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Load shared components (Navbar & Footer)
  await loadComponent('#navbar-placeholder', 'components/navbar.html');
  await loadComponent('#footer-placeholder', 'components/footer.html');

  // 2. Initialize Core Engines
  if (typeof initScrollEngine === 'function') initScrollEngine();
  if (typeof initCustomCursor === 'function') initCustomCursor();
  if (typeof initNavigation === 'function') initNavigation();

  // 3. Initialize GSAP Animations after slight DOM delay
  setTimeout(() => {
    if (typeof initGSAPAnimations === 'function') initGSAPAnimations();
  }, 100);

  // 4. Initialize FAQ Accordions
  initFAQAccordion();

  // 5. Initialize Pricing Billing Toggle if present
  initPricingToggle();

  // 6. Initialize Login & Interactive Tab Switchers
  initInteractiveTabs();
  initHospitalLoginRedirect();

  // 7. Parse URL Parameters for Login Role Auto-Selection
  handleUrlTabSelection();

  // Render Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/**
 * FAQ Accordion expand/collapse
 */
function initFAQAccordion() {
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.faq-header');
    if (!header) return;

    const item = header.closest('.faq-item');
    const isActive = item.classList.contains('active');

    const accordion = item.closest('.faq-accordion');
    if (accordion) {
      accordion.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    }

    if (!isActive) {
      item.classList.add('active');
    }
  });
}

/**
 * Pricing Billing Toggle (Monthly / Yearly)
 */
function initPricingToggle() {
  const toggleBtn = document.querySelector('#pricing-billing-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('change', (e) => {
    const isYearly = e.target.checked;
    const priceElements = document.querySelectorAll('.pricing-price-val');

    priceElements.forEach(el => {
      const monthly = el.getAttribute('data-monthly');
      const yearly = el.getAttribute('data-yearly');
      el.textContent = isYearly ? yearly : monthly;
    });
  });
}

/**
 * Interactive Role & Feature Tabs Handler
 */
function initInteractiveTabs() {
  document.addEventListener('click', (e) => {
    const tabBtn = e.target.closest('[data-tab]');
    if (!tabBtn) return;

    const tabGroup = tabBtn.closest('[data-tab-group]');
    if (!tabGroup) return;

    const targetTabId = tabBtn.getAttribute('data-tab');

    // Update active class on tab buttons
    tabGroup.querySelectorAll('[data-tab]').forEach(btn => btn.classList.remove('active'));
    tabBtn.classList.add('active');

    // Show corresponding tab content
    const contentGroupAttr = tabGroup.getAttribute('data-tab-group');
    const contentContainer = document.querySelector(`[data-tab-content-group="${contentGroupAttr}"]`);
    if (contentContainer) {
      contentContainer.querySelectorAll('[data-tab-content]').forEach(content => {
        content.style.display = content.getAttribute('data-tab-content') === targetTabId ? 'block' : 'none';
      });
    }
  });
}

/**
 * Parse URL Query Parameters to pre-select Login Tabs (e.g. ?type=clinic | ?type=hospital | ?type=admin)
 */
function handleUrlTabSelection() {
  const urlParams = new URLSearchParams(window.location.search);
  const typeParam = urlParams.get('type') || urlParams.get('role');

  if (!typeParam) return;

  const targetTabId = `tab-role-${typeParam.toLowerCase()}`;
  const targetBtn = document.querySelector(`[data-tab="${targetTabId}"]`);

  if (targetBtn) {
    targetBtn.click();
  }
}

function initHospitalLoginRedirect() {
  const hospitalForm = document.querySelector('#hospital-login-form');
  if (!hospitalForm) return;

  hospitalForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = document.querySelector('#hospital-email');
    const passwordInput = document.querySelector('#hospital-password');
    const email = emailInput?.value?.trim() || '';
    const password = passwordInput?.value || '';

    if (!email || !password) {
      return;
    }

    const isHospitalCredential = email.includes('hospital') || email.includes('admin') || email.includes('curaos');
    if (isHospitalCredential) {
      window.location.href = 'pages/hospital/index.html';
    }
  });
}
