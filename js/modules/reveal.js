// ============================================================
// REVEAL — IntersectionObserver-based "fade in on scroll"
// Single shared observer for every reveal target.
// ============================================================
import { $, $$ } from '../utils/dom.js';

const SELECTORS = [
  '.why-card',
  '.thrives-panel',
  '.life-card',
  '.process-step',
  '#founder-card',
  '.reveal',
];

export function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  SELECTORS.forEach(sel => $$(sel).forEach(el => observer.observe(el)));

  const timeline = $('#process-timeline');
  if (timeline) observer.observe(timeline);
}
