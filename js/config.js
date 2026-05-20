// ============================================================
// CONFIG — single source for environment-level constants
// ============================================================

// Google Sheets endpoint (Apps Script Web App URL)
export const GOOGLE_SHEET_URL =
  'https://script.google.com/macros/s/AKfycbzB4Kg1mpESO838TSIcp2Wler_SyUJ6MrHdkwstnw30l9osRxeM849yhu4mzz7RSjNQ/exec';

// Admin password (change as required)
export const ADMIN_PASSWORD = 'tss@admin2026';

// localStorage keys
export const STORAGE = Object.freeze({
  applications: 'tss_applications',
  customRoles:  'tss_custom_roles',
});

// Loader timeouts (ms) — primary + fallback
export const LOADER_TIMINGS = Object.freeze({
  primary:    1500,
  ready:      2200,
  hardCap:    4000,
});

// Hero canvas
export const CANVAS_PARTICLES = 60;
export const CANVAS_LINK_DIST = 130;

// Search debounce
export const SEARCH_DEBOUNCE_MS = 220;
