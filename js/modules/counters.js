// ============================================================
// ANIMATED COUNTERS — used in hero stats
// ============================================================
import { $$ } from '../utils/dom.js';

export function startCounters() {
  $$('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (Number.isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const duration = 1800;
    const step = target / (duration / 16);

    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
