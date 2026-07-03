/* ==========================================
   ENTERPRISE HEALTHCARE SAAS - UTILITIES
   utils.js
   ========================================== */

/**
 * Helper to select DOM elements cleanly
 */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

/**
 * Dynamic Component Loader (HTML injection for navbar and footer)
 */
async function loadComponent(targetSelector, filePath) {
  const target = $(targetSelector);
  if (!target) return;

  try {
    const response = await fetch(filePath);
    if (response.ok) {
      const html = await response.text();
      target.innerHTML = html;
      
      // Re-initialize icons if Lucide is available
      if (window.lucide) {
        window.lucide.createIcons();
      }
      
      // Highlight active navigation link
      highlightActiveNavLink();
    } else {
      console.error(`Failed to load component: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fetching component ${filePath}:`, error);
  }
}

/**
 * Highlight current page in navigation link
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = $$('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Animate Numbers / Counters (for Trusted Section stats)
 */
function animateCounter(element, target, duration = 2000) {
  let startTimestamp = null;
  const startValue = 0;

  function step(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easeOutProgress * (target - startValue) + startValue);
    
    element.textContent = currentValue.toLocaleString();

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  window.requestAnimationFrame(step);
}
