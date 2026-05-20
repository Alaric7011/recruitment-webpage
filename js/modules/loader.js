// ============================================================
// LOADING SCREEN — single dismissal entry; multiple timers
// preserved as in original (primary, fallback, hard cap).
// ============================================================
import { $ } from '../utils/dom.js';
import { LOADER_TIMINGS } from '../config.js';
import { startCounters } from './counters.js';

const loadingScreen = $('#loading-screen');

let dismissed = false;
function dismiss() {
  if (dismissed) return;
  dismissed = true;
  loadingScreen.classList.add('hidden');
  startCounters();
}

export function initLoader() {
  // Primary — fires on full window load
  window.addEventListener('load', () => setTimeout(dismiss, LOADER_TIMINGS.primary));
  // Fallback — DOMContentLoaded + delay (in case 'load' is slow)
  document.addEventListener('DOMContentLoaded', () => setTimeout(dismiss, LOADER_TIMINGS.ready));
  // Hard cap — never stay stuck beyond hardCap
  setTimeout(dismiss, LOADER_TIMINGS.hardCap);
}
