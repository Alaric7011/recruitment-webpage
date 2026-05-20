// ============================================================
// localStorage wrappers — applications + custom roles
// ============================================================
import { STORAGE } from '../config.js';

// ── Applications ─────────────────────────────────────────────
export function getApplications() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.applications)) || [];
  } catch {
    return [];
  }
}

export function saveApplication(data) {
  const apps = getApplications();
  data.id = Date.now();
  apps.push(data);
  localStorage.setItem(STORAGE.applications, JSON.stringify(apps));
}

export function clearApplications() {
  localStorage.removeItem(STORAGE.applications);
}

// ── Custom roles (created via Role Management) ───────────────
export function getCustomRoles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.customRoles)) || [];
  } catch {
    return [];
  }
}

export function saveCustomRoles(rolesArr) {
  // Only persist roles marked as custom
  const custom = rolesArr.filter(r => r.isCustom);
  localStorage.setItem(STORAGE.customRoles, JSON.stringify(custom));
}
