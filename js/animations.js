/* ==========================================
   ENTERPRISE HEALTHCARE SAAS - GSAP ANIMATIONS
   animations.js
   ========================================== */

function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded. Animations disabled.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // 1. Reveal animations for headings and cards
  const revealElements = document.querySelectorAll('.gsap-reveal');
  revealElements.forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  });

  // 2. Scale up reveals
  const scaleElements = document.querySelectorAll('.gsap-scale-up');
  scaleElements.forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'back.out(1.4)',
    });
  });

  // 3. Trusted Section Statistics Counter Trigger
  const statItems = document.querySelectorAll('.stat-counter');
  if (statItems.length > 0) {
    ScrollTrigger.create({
      trigger: '.trusted-section',
      start: 'top 80%',
      onEnter: () => {
        statItems.forEach((stat) => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          if (target) {
            animateCounter(stat, target, 2200);
          }
        });
      },
      once: true,
    });
  }

  // 4. Timeline Progress Bar Animation
  const timelineProgress = document.querySelector('.timeline-progress');
  const timelineContainer = document.querySelector('.timeline-container');
  if (timelineProgress && timelineContainer) {
    gsap.to(timelineProgress, {
      scrollTrigger: {
        trigger: timelineContainer,
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: true,
      },
      height: '100%',
      ease: 'none',
    });
  }

  // 5. Mouse Parallax for Hero Dashboard Mockup Cards
  const heroMockup = document.querySelector('.dashboard-preview');
  const widgetCards = document.querySelectorAll('.widget-card');

  if (heroMockup && widgetCards.length > 0) {
    heroMockup.addEventListener('mousemove', (e) => {
      const rect = heroMockup.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      widgetCards.forEach((card, index) => {
        const depth = (index + 1) * 12;
        gsap.to(card, {
          x: (x / rect.width) * depth,
          y: (y / rect.height) * depth,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    });

    heroMockup.addEventListener('mouseleave', () => {
      widgetCards.forEach((card) => {
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      });
    });
  }
}
