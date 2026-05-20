// ============================================================
// NAVBAR — scroll behaviour, scrollspy, mobile nav, back-to-top
// Single passive scroll listener for all three effects.
// ============================================================
import { $, $$, setBodyLock } from '../utils/dom.js';

export function initNavbar() {
  const navbar    = $('#navbar');
  const backTop   = $('#back-top');
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobile-nav');
  const navLinks  = $$('#nav-links a');
  const sections  = $$('section[id]');

  // ── Scroll handler (passive + RAF for jitter-free updates) ──
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      navbar.classList.toggle('scrolled', scrollY > 40);
      backTop.classList.toggle('show',  scrollY > 400);

      // Scrollspy
      let current = '';
      for (const sec of sections) {
        if (scrollY >= sec.offsetTop - 120) current = sec.id;
      }
      for (const link of navLinks) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  // Set initial state immediately
  onScroll();

  // ── Hamburger / Mobile drawer ──
  function closeMobileNav() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    setBodyLock(false);
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileNav.classList.toggle('open', isOpen);
    setBodyLock(isOpen);
  });

  $$('.mobile-nav-link', mobileNav).forEach(a =>
    a.addEventListener('click', closeMobileNav)
  );

  // ── Back-to-top ──
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
