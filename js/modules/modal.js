// ============================================================
// JOB MODAL — open/close, detail view, application form
// ============================================================
import { $, setBodyLock } from '../utils/dom.js';
import { capitalize, esc } from '../utils/format.js';
import { JOBS } from '../data/jobs.js';
import { PERKS } from '../data/perks.js';
import { buildApplicationForm, handleFormSubmit } from './application-form.js';

let modalOverlay, modalBox;
let currentJobId = null;

// ── Public API ───────────────────────────────────────────────
export function openModal(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job) return;
  currentJobId = jobId;
  showJobDetail(jobId);
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  setBodyLock(true);
}

export function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  setBodyLock(false);
  currentJobId = null;
}

export function isModalOpen() {
  return modalOverlay && modalOverlay.classList.contains('open');
}

// ── Detail view ──────────────────────────────────────────────
function showJobDetail(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job) return;
  currentJobId = jobId;

  const perksHtml = PERKS.map(p =>
    `<div class="modal-perk"><i class="${p.icon}"></i>${esc(p.label)}</div>`
  ).join('');

  modalBox.innerHTML = `
    <button id="modal-close" aria-label="Close modal" data-action="close-modal">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <div class="modal-badges">
      <span class="role-category-badge">${esc(capitalize(job.category))}</span>
      <span class="role-type-badge">${job.type === 'internship' ? 'Internship' : 'Full-time'}</span>
    </div>
    <h2 class="modal-title" id="modal-title">${esc(job.title)}</h2>
    <div class="modal-meta">
      <div class="role-meta-item"><i class="fa-solid fa-location-dot"></i>${esc(job.location)}</div>
      <div class="role-meta-item"><i class="fa-regular fa-clock"></i>${esc(job.duration)}</div>
      <div class="role-meta-item"><i class="fa-solid fa-indian-rupee-sign"></i>${esc(job.stipend)}</div>
    </div>

    <div class="modal-section">
      <h4>About The Role</h4>
      <p>${esc(job.description)}</p>
    </div>

    <div class="modal-section">
      <h4>Responsibilities</h4>
      <ul class="modal-list">
        ${job.responsibilities.map(r => `<li>${esc(r)}</li>`).join('')}
      </ul>
    </div>

    <div class="modal-section">
      <h4>What We're Looking For</h4>
      <ul class="modal-list">
        ${job.requirements.map(r => `<li>${esc(r)}</li>`).join('')}
      </ul>
    </div>

    <div class="modal-section">
      <h4>Skills</h4>
      <div class="modal-skills-wrap">
        ${job.skills.map(s => `<span class="modal-skill-tag">${esc(s)}</span>`).join('')}
      </div>
    </div>

    <div class="modal-section">
      <h4>Perks & Culture</h4>
      <div class="modal-perks-grid">${perksHtml}</div>
    </div>

    <button id="modal-apply" data-action="show-form" data-job-id="${job.id}">
      Apply for ${esc(job.title)} &nbsp;→
    </button>
  `;
  modalBox.scrollTop = 0;
}

function showApplicationForm(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job) return;
  currentJobId = jobId;
  modalBox.innerHTML = buildApplicationForm(job);
  modalBox.scrollTop = 0;

  const form = $('#application-form');
  if (form) {
    form.addEventListener('submit', (e) =>
      handleFormSubmit(e, currentJobId, modalBox)
    );
  }
}

// ── Init ─────────────────────────────────────────────────────
export function initModal() {
  modalOverlay = $('#modal-overlay');
  modalBox     = $('#modal-box');

  // Delegated click handler — single listener covers every dynamic button
  modalBox.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'close-modal') closeModal();
    else if (action === 'back')   showJobDetail(currentJobId);
    else if (action === 'show-form') {
      const id = Number(btn.dataset.jobId) || currentJobId;
      showApplicationForm(id);
    }
  });

  // Close on overlay click
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  // ESC closes modal AND application drawer
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (isModalOpen()) closeModal();
    const drawer = $('#app-detail-drawer');
    if (drawer && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
    }
  });
}
