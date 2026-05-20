// ============================================================
// MAIN — single entry point. Bootstraps every module on DOM ready.
// ============================================================
import { initLoader }     from './modules/loader.js';
import { initHeroCanvas } from './modules/hero-canvas.js';
import { initNavbar }     from './modules/navbar.js';
import { initReveal }     from './modules/reveal.js';
import { initJobs }       from './modules/jobs.js';
import { initModal }      from './modules/modal.js';
import { initFaq }        from './modules/faq.js';
import { initAdmin }      from './modules/admin.js';

function boot() {
  initLoader();       // Loading screen + counters trigger
  initHeroCanvas();   // Animated particle background
  initNavbar();       // Scroll, scrollspy, mobile nav, back-to-top
  initReveal();       // IntersectionObserver fade-ins
  initJobs();         // Role grid + filters + search
  initModal();        // Job detail modal + application form wiring
  initFaq();          // FAQ accordion
  initAdmin();        // Admin gate + dashboard + role management
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
