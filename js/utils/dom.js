// ============================================================
// DOM Helpers — short selectors, simple delegation
// ============================================================

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Single-handler delegated click — saves duplicate listeners
export function on(root, event, sel, handler) {
  root.addEventListener(event, e => {
    const target = e.target.closest(sel);
    if (target && root.contains(target)) handler(e, target);
  });
}

// Toggle body scroll-lock (used by modals, drawers, mobile nav)
export function setBodyLock(locked) {
  document.body.style.overflow = locked ? 'hidden' : '';
}

// Lazy memoized getter to dodge "element may not exist yet" errors
export function lazy(getter) {
  let cached;
  return () => (cached || (cached = getter()));
}
