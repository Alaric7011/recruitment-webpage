// ============================================================
// JOB SYSTEM — render, filter, search role cards
// ============================================================
import { $, $$ } from '../utils/dom.js';
import { capitalize, esc } from '../utils/format.js';
import { JOBS } from '../data/jobs.js';
import { openModal } from './modal.js';
import { SEARCH_DEBOUNCE_MS } from '../config.js';

// ── State ────────────────────────────────────────────────────
const state = {
  category: 'all',
  type:     'all',
  query:    '',
};

let rolesGrid, emptyState, searchInput;

// ── Render ───────────────────────────────────────────────────
function buildRoleCard(job, i) {
  const card = document.createElement('article');
  card.className = 'role-card';
  card.tabIndex  = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View details for ${job.title}`);

  const visible = job.skills.slice(0, 4)
    .map(s => `<span class="skill-tag">${esc(s)}</span>`).join('');
  const extra   = job.skills.length > 4
    ? `<span class="skill-tag">+${job.skills.length - 4}</span>` : '';

  card.innerHTML = `
    <div class="role-card-top">
      <span class="role-category-badge">${esc(capitalize(job.category))}</span>
      <span class="role-type-badge">${job.type === 'internship' ? 'Internship' : 'Full-time'}</span>
    </div>
    <h3 class="role-title">${esc(job.title)}</h3>
    <div class="role-meta">
      <div class="role-meta-item"><i class="fa-solid fa-location-dot"></i>${esc(job.location)}</div>
      <div class="role-meta-item"><i class="fa-regular fa-clock"></i>${esc(job.duration)}</div>
    </div>
    <div class="role-skills">${visible}${extra}</div>
    <div class="role-card-footer">
      <span class="role-stipend">${esc(job.stipend)}</span>
      <div class="role-arrow"><i class="fa-solid fa-arrow-right"></i></div>
    </div>
  `;

  const open = () => openModal(job.id);
  card.addEventListener('click', open);
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });

  // Stagger reveal
  setTimeout(() => card.classList.add('revealed'), i * 60 + 40);
  return card;
}

export function renderJobs() {
  const q = state.query.toLowerCase();
  const filtered = JOBS.filter(job => {
    const matchCat  = state.category === 'all' || job.category === state.category;
    const matchType = state.type     === 'all' || job.type     === state.type;
    const matchQ    = !q ||
      job.title.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.skills.some(s => s.toLowerCase().includes(q)) ||
      job.category.toLowerCase().includes(q);
    return matchCat && matchType && matchQ;
  });

  // Clear previous cards (keep .empty-state node)
  rolesGrid.querySelectorAll('.role-card').forEach(c => c.remove());
  emptyState.classList.toggle('show', filtered.length === 0);

  filtered.forEach((job, i) => rolesGrid.appendChild(buildRoleCard(job, i)));
}

// ── Init ─────────────────────────────────────────────────────
export function initJobs() {
  rolesGrid   = $('#roles-grid');
  emptyState  = $('#empty-state');
  searchInput = $('#role-search');

  // Filter pills — category
  $$('.pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      $$('.pill[data-filter]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.category = pill.dataset.filter;
      renderJobs();
    });
  });

  // Filter pills — type
  $$('.pill[data-type]').forEach(pill => {
    pill.addEventListener('click', () => {
      $$('.pill[data-type]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.type = pill.dataset.type;
      renderJobs();
    });
  });

  // Debounced search
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.query = e.target.value;
      renderJobs();
    }, SEARCH_DEBOUNCE_MS);
  });

  renderJobs();
}
