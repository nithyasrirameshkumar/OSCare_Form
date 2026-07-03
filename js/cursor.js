/* ==========================================
   ENTERPRISE HEALTHCARE SAAS - CURSOR INTERACTION
   cursor.js
   ========================================== */

function initCustomCursor() {
  // Create cursor DOM elements dynamically if not present
  if (!document.querySelector('.custom-cursor-dot')) {
    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';
    const follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';
    document.body.appendChild(dot);
    document.body.appendChild(follower);
  }

  const cursorDot = document.querySelector('.custom-cursor-dot');
  const cursorFollower = document.querySelector('.custom-cursor-follower');

  if (!cursorDot || !cursorFollower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Direct update for inner dot
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth trailing animation for outer follower ring
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    requestAnimationFrame(animateFollower);
  }
  requestAnimationFrame(animateFollower);

  // Hover detection for interactive elements
  const interactiveSelectors = 'a, button, input, select, textarea, .feature-card, .pricing-card, .faq-header, .dropdown-trigger';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}
