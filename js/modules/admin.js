// ============================================================
// ADMIN PANEL — gate, dashboard, table, drawer, CSV export
// ============================================================
import { $, $$, setBodyLock } from '../utils/dom.js';
import { esc, formatDate } from '../utils/format.js';
import { JOBS } from '../data/jobs.js';
import { ROLE_FORMS } from '../data/role-forms.js';
import { ADMIN_PASSWORD } from '../config.js';
import { getApplications, clearApplications } from '../utils/storage.js';
import { initRoleManagement, rmRefreshCards } from './role-management.js';

// Cached refs (set in initAdmin)
let panel, gate, dashboard, pwInput, errMsg,
    statsRow, tableBody, emptyEl, searchInput, roleFilter, lastRefresh,
    drawer, drawerContent;

// ── Open/close panel ─────────────────────────────────────────
export function openAdminPanel() {
  panel.classList.add('open');
  setBodyLock(true);
  gate.style.display      = 'flex';
  dashboard.style.display = 'none';
  pwInput.value = '';
  errMsg.classList.remove('show');
}

export function closeAdminPanel() {
  panel.classList.remove('open');
  setBodyLock(false);
  closeDrawer();
}

function checkPassword() {
  if (pwInput.value === ADMIN_PASSWORD) {
    gate.style.display      = 'none';
    dashboard.style.display = 'block';
    loadDashboard();
  } else {
    errMsg.classList.add('show');
    pwInput.value = '';
    pwInput.focus();
  }
}

// ── Dashboard ────────────────────────────────────────────────
function loadDashboard() {
  const now = new Date();
  lastRefresh.textContent = 'Last refreshed: ' + now.toLocaleTimeString('en-IN');

  // Populate role filter
  roleFilter.innerHTML = '<option value="all">All Roles</option>';
  JOBS.forEach(j => {
    const opt = document.createElement('option');
    opt.value = j.id;
    opt.textContent = j.title;
    roleFilter.appendChild(opt);
  });

  renderStats(getApplications());
  renderTable();
}

function renderStats(apps) {
  const roleCount = Object.fromEntries(JOBS.map(j => [j.id, 0]));
  apps.forEach(a => { if (roleCount[a.roleId] !== undefined) roleCount[a.roleId]++; });

  let html = `<div class="admin-stat">
    <div class="admin-stat-num">${apps.length}</div>
    <div class="admin-stat-label">Total Applications</div>
  </div>`;
  JOBS.forEach(j => {
    html += `<div class="admin-stat">
      <div class="admin-stat-num">${roleCount[j.id] || 0}</div>
      <div class="admin-stat-label">${esc(j.title)}</div>
    </div>`;
  });
  statsRow.innerHTML = html;
}

export function renderTable() {
  let apps = getApplications();
  const role   = roleFilter.value;
  const search = searchInput.value.toLowerCase();

  if (role !== 'all') apps = apps.filter(a => String(a.roleId) === String(role));
  if (search) {
    apps = apps.filter(a =>
      (a.full_name || '').toLowerCase().includes(search) ||
      (a.email     || '').toLowerCase().includes(search) ||
      (a.college   || '').toLowerCase().includes(search) ||
      (a.city      || '').toLowerCase().includes(search) ||
      (a.roleTitle || '').toLowerCase().includes(search)
    );
  }

  renderStats(getApplications());

  if (apps.length === 0) {
    tableBody.innerHTML = '';
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';

  tableBody.innerHTML = apps.slice().reverse().map((a, i) => `
    <tr>
      <td class="row-num">${apps.length - i}</td>
      <td class="name-cell">${esc(a.full_name || '—')}</td>
      <td><span class="admin-role-badge">${esc(a.roleTitle || '—')}</span></td>
      <td><span class="trunc">${esc(a.email || '—')}</span></td>
      <td>${esc(a.phone || '—')}</td>
      <td><span class="trunc">${esc(a.college || '—')}</span></td>
      <td>${esc(a.city || '—')}</td>
      <td class="applied-at">${formatDate(a.appliedAt)}</td>
      <td><button class="view-btn" data-app-id="${a.id}">View →</button></td>
    </tr>
  `).join('');
}

// ── Drawer ───────────────────────────────────────────────────
function openDrawer(appId) {
  const app = getApplications().find(a => a.id === appId);
  if (!app) return;

  const job    = JOBS.find(j => j.id === app.roleId);
  const extras = job ? (ROLE_FORMS[job.id] || { extras: [] }).extras : [];

  const commonFields = [
    { key: 'email',           label: 'Email' },
    { key: 'phone',           label: 'Phone' },
    { key: 'city',            label: 'City' },
    { key: 'college',         label: 'College / University' },
    { key: 'degree',          label: 'Degree & Branch' },
    { key: 'graduation_year', label: 'Graduation Year' },
    { key: 'current_status',  label: 'Current Status' },
    { key: 'linkedin',        label: 'LinkedIn' },
    { key: 'startup_exp',     label: 'Startup Experience' },
    { key: 'why_tss',         label: 'Why The Startup School' },
  ];

  let html = `
    <div class="drawer-role-badge"><span class="admin-role-badge">${esc(app.roleTitle || '')}</span></div>
    <div class="drawer-name">${esc(app.full_name || '—')}</div>
    <div class="drawer-applied-at">Applied ${formatDate(app.appliedAt)}</div>
    <div class="drawer-divider"></div>
  `;

  commonFields.forEach(f => {
    if (app[f.key]) {
      html += `<div class="drawer-field">
        <div class="drawer-field-label">${esc(f.label)}</div>
        <div class="drawer-field-value">${esc(app[f.key])}</div>
      </div>`;
    }
  });

  if (extras.length > 0) {
    html += `<div class="drawer-divider"></div>
      <div class="drawer-field-label lg">Role-Specific Answers</div>`;
    extras.forEach(f => {
      if (app[f.id]) {
        html += `<div class="drawer-field">
          <div class="drawer-field-label">${esc(f.label)}</div>
          <div class="drawer-field-value">${esc(app[f.id])}</div>
        </div>`;
      }
    });
  }

  if (app.referral) {
    html += `<div class="drawer-divider"></div>
      <div class="drawer-field">
        <div class="drawer-field-label">Heard About Us Via</div>
        <div class="drawer-field-value">${esc(app.referral)}</div>
      </div>`;
  }

  drawerContent.innerHTML = html;
  drawer.classList.add('open');
}

export function closeDrawer() {
  if (drawer) drawer.classList.remove('open');
}

// ── Clear / Export ───────────────────────────────────────────
export function clearAll() {
  if (!confirm('Are you sure you want to permanently delete ALL applications? This cannot be undone.')) return;
  clearApplications();
  renderTable();
  renderStats([]);
}

export function exportCSV() {
  const apps = getApplications();
  if (apps.length === 0) { alert('No applications to export.'); return; }

  const allKeys = new Set();
  apps.forEach(a => Object.keys(a).forEach(k => allKeys.add(k)));
  const keys = [...allKeys].filter(k => k !== 'id');

  const header = keys.join(',');
  const rows = apps.map(a =>
    keys.map(k => {
      const val = a[k] !== undefined ? String(a[k]) : '';
      return '"' + val.replace(/"/g, '""') + '"';
    }).join(',')
  );

  const csv  = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `TSS_Applications_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Tab switching (Applications / Role Management) ───────────
function switchTab(tab, btn) {
  $$('.admin-tab').forEach(t => t.classList.remove('active'));
  $$('.admin-tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  $('#tab-' + tab).classList.add('active');
  if (tab === 'roles') rmRefreshCards();
}

// ── Init ─────────────────────────────────────────────────────
export function initAdmin() {
  panel         = $('#admin-panel');
  gate          = $('#admin-gate');
  dashboard     = $('#admin-dashboard');
  pwInput       = $('#admin-password-input');
  errMsg        = $('#gate-error');
  statsRow      = $('#admin-stats-row');
  tableBody     = $('#admin-table-body');
  emptyEl       = $('#admin-empty');
  searchInput   = $('#admin-search');
  roleFilter    = $('#admin-role-filter');
  lastRefresh   = $('#admin-last-refresh');
  drawer        = $('#app-detail-drawer');
  drawerContent = $('#drawer-content');

  // ── Footer admin trigger ──
  const footerBtn = $('.footer-admin-btn');
  if (footerBtn) footerBtn.addEventListener('click', openAdminPanel);

  // ── Gate ──
  $('[data-action="admin-unlock"]').addEventListener('click', checkPassword);
  $('[data-action="admin-cancel"]').addEventListener('click', closeAdminPanel);
  pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') checkPassword(); });

  // ── Header close ──
  $$('[data-action="admin-close"]').forEach(b =>
    b.addEventListener('click', closeAdminPanel)
  );

  // ── Tabs ──
  $$('.admin-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn));
  });

  // ── Controls ──
  searchInput.addEventListener('input', renderTable);
  roleFilter.addEventListener('change', renderTable);
  $('[data-action="export-csv"]').addEventListener('click', exportCSV);
  $('[data-action="clear-all"]').addEventListener('click', clearAll);

  // ── Table row "View" delegation ──
  tableBody.addEventListener('click', e => {
    const btn = e.target.closest('.view-btn');
    if (btn) openDrawer(Number(btn.dataset.appId));
  });

  // ── Drawer close ──
  $('.drawer-close').addEventListener('click', closeDrawer);

  // ── Role Management module wires itself ──
  initRoleManagement(renderTable);
}
