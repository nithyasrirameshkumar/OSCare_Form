/* ==========================================
   ENTERPRISE HEALTHCARE SAAS - NAVIGATION CONTROLLER
   navigation.js
   ========================================== */

function initNavigation() {
  const navbar = document.querySelector('.glass-navbar');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Handle dropdown & mega menu toggles with keyboard accessibility
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.dropdown-trigger');
    const dropdownWrapper = e.target.closest('.nav-dropdown-wrapper');
    const allMenus = document.querySelectorAll('.dropdown-menu, .mega-menu');
    const allTriggers = document.querySelectorAll('.dropdown-trigger');

    if (!dropdownWrapper) {
      allMenus.forEach(menu => menu.classList.remove('active'));
      allTriggers.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
      return;
    }

    if (trigger) {
      e.preventDefault();
      const currentMenu = dropdownWrapper.querySelector('.dropdown-menu, .mega-menu');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      allMenus.forEach(menu => {
        if (menu !== currentMenu) menu.classList.remove('active');
      });
      allTriggers.forEach(btn => {
        if (btn !== trigger) btn.setAttribute('aria-expanded', 'false');
      });

      if (currentMenu) {
        currentMenu.classList.toggle('active');
        trigger.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
      }
    }
  });

  // Keyboard accessibility: Close active menus on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeMenus = document.querySelectorAll('.dropdown-menu.active, .mega-menu.active');
      const activeTriggers = document.querySelectorAll('.dropdown-trigger[aria-expanded="true"]');
      
      activeMenus.forEach(menu => menu.classList.remove('active'));
      activeTriggers.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    }
  });
}
