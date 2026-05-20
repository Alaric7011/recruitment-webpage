// ============================================================
// ROLE MANAGEMENT — admin module to view, create, edit, archive,
// delete roles. Built-in JOBS act as base; custom roles persist
// in localStorage.
// ============================================================
import { $, $$, setBodyLock } from '../utils/dom.js';
import { esc } from '../utils/format.js';
import { JOBS } from '../data/jobs.js';
import { getApplications, getCustomRoles, saveCustomRoles } from '../utils/storage.js';

let currentEditId = null;
let modalOverlay, modalTitleEl, modalBody, saveIndicator, saveText, cardsContainer;

// ── Merge built-in + custom roles ────────────────────────────
function getAllRoles() {
  const base = JOBS.map(j => ({
    ...j,
    status:           j.status           || 'active',
    postedDate:       j.postedDate       || '2025-01-01',
    lastModified:     j.lastModified     || '2025-01-01',
    interviewRounds:  j.interviewRounds  || [],
    questions:        j.questions        || [],
    hrQuestions:      j.hrQuestions      || [],
    assignment:       j.assignment       || '',
    atsKeywords:      j.atsKeywords      || [],
    workMode:         j.workMode         || j.location || 'Remote',
    experienceLevel:  j.experienceLevel  || 'Entry Level',
    isCustom:         false,
  }));
  return [...base, ...getCustomRoles()];
}

// ── Cards Grid ───────────────────────────────────────────────
export function rmRefreshCards() {
  const roles = getAllRoles();
  if (!roles.length) {
    cardsContainer.innerHTML = `<div class="rm-empty">
      <i class="fa-solid fa-briefcase"></i>
      <h3>No roles yet</h3>
      <p>Click "Create New Role" to add your first role.</p>
    </div>`;
    return;
  }

  const apps = getApplications();
  const labels = { active: 'Active', draft: 'Draft', closed: 'Closed' };

  cardsContainer.innerHTML = `<div class="rm-cards-grid">${roles.map(r => {
    const appCount = apps.filter(a => String(a.roleId) === String(r.id)).length;
    const status   = r.status || 'active';
    return `<div class="rm-role-card" id="rm-card-${r.id}">
      <div class="rm-card-top">
        <div>
          <div class="rm-card-title">${esc(r.title)}</div>
          <div class="rm-card-dept">${esc(r.category || 'General')} &middot; ${esc(r.type || 'internship')}</div>
        </div>
        <span class="rm-status-badge ${status}">${labels[status] || status}</span>
      </div>
      <div class="rm-card-meta">
        <span class="rm-meta-chip"><i class="fa-solid fa-users"></i>${appCount} applicant${appCount !== 1 ? 's' : ''}</span>
        <span class="rm-meta-chip"><i class="fa-solid fa-indian-rupee-sign"></i>${esc(r.stipend || 'TBD')}</span>
        <span class="rm-meta-chip"><i class="fa-solid fa-clock"></i>${esc(r.duration || 'TBD')}</span>
        <span class="rm-meta-chip"><i class="fa-solid fa-wifi"></i>${esc(r.workMode || r.location || 'Remote')}</span>
      </div>
      <div class="rm-card-actions">
        <button class="rm-btn ghost sm"        data-rm-action="edit"      data-id="${r.id}"><i class="fa-solid fa-pen"></i> Edit</button>
        <button class="rm-btn ghost sm"        data-rm-action="duplicate" data-id="${r.id}"><i class="fa-solid fa-copy"></i> Duplicate</button>
        <button class="rm-btn ghost sm"        data-rm-action="toggle"    data-id="${r.id}"><i class="fa-solid fa-toggle-on"></i> ${status === 'active' ? 'Archive' : 'Activate'}</button>
        ${r.isCustom ? `<button class="rm-btn danger-ghost sm" data-rm-action="delete" data-id="${r.id}"><i class="fa-solid fa-trash"></i></button>` : ''}
      </div>
    </div>`;
  }).join('')}</div>`;
}

// ── Modal: Open / Close ──────────────────────────────────────
function openCreateModal() {
  currentEditId = null;
  modalTitleEl.textContent = 'Create New Role';
  modalBody.innerHTML = buildModalBody(null);
  modalOverlay.classList.add('open');
  setBodyLock(true);
}

function openEditModal(id) {
  const role = getAllRoles().find(r => String(r.id) === String(id));
  if (!role) return;
  currentEditId = id;
  modalTitleEl.textContent = 'Edit Role — ' + role.title;
  modalBody.innerHTML = buildModalBody(role);
  modalOverlay.classList.add('open');
  setBodyLock(true);
}

function closeModal() {
  modalOverlay.classList.remove('open');
  setBodyLock(false);
  currentEditId = null;
}

// ── Modal Body Template ──────────────────────────────────────
function buildModalBody(role) {
  const r = role || {};
  const questionItems = (arr) => (arr || []).map(q => `
    <div class="rm-question-item">
      <textarea class="rm-question-text" rows="2">${esc(q)}</textarea>
      <button class="rm-question-del" data-rm-action="del-item"><i class="fa-solid fa-xmark"></i></button>
    </div>`).join('');

  const tagItems = (arr) => (arr || []).map(s => `
    <span class="rm-tag">${esc(s)}<span class="rm-tag-del" data-rm-action="del-tag">✕</span></span>`).join('');

  const categoryOpts = ['growth','content','tech','community','research','operations','design','marketing']
    .map(c => `<option value="${c}" ${(r.category || '') === c ? 'selected' : ''}>${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('');

  const expOpts = ['Entry Level', 'Mid Level', 'Senior Level', 'Any']
    .map(e => `<option value="${e}" ${(r.experienceLevel || 'Entry Level') === e ? 'selected' : ''}>${e}</option>`).join('');

  return `
    <!-- Core Fields -->
    <div class="rm-form-grid" style="margin-bottom:14px">
      <div class="rm-form-group">
        <label class="rm-form-label">Role Title *</label>
        <input class="rm-form-input" id="rmf-title" type="text" value="${esc(r.title || '')}">
      </div>
      <div class="rm-form-group">
        <label class="rm-form-label">Department / Category</label>
        <select class="rm-form-select" id="rmf-category">${categoryOpts}</select>
      </div>
      <div class="rm-form-group">
        <label class="rm-form-label">Type</label>
        <select class="rm-form-select" id="rmf-type">
          <option value="internship" ${(r.type || 'internship') === 'internship' ? 'selected' : ''}>Internship</option>
          <option value="fulltime"   ${r.type === 'fulltime'   ? 'selected' : ''}>Full-time</option>
          <option value="contract"   ${r.type === 'contract'   ? 'selected' : ''}>Contract</option>
        </select>
      </div>
      <div class="rm-form-group">
        <label class="rm-form-label">Status</label>
        <select class="rm-form-select" id="rmf-status">
          <option value="active" ${(r.status || 'active') === 'active' ? 'selected' : ''}>Active</option>
          <option value="draft"  ${r.status === 'draft'  ? 'selected' : ''}>Draft</option>
          <option value="closed" ${r.status === 'closed' ? 'selected' : ''}>Closed</option>
        </select>
      </div>
      <div class="rm-form-group">
        <label class="rm-form-label">Stipend</label>
        <input class="rm-form-input" id="rmf-stipend" type="text" value="${esc(r.stipend || '')}" placeholder="e.g. ₹10,000/mo">
      </div>
      <div class="rm-form-group">
        <label class="rm-form-label">Duration</label>
        <input class="rm-form-input" id="rmf-duration" type="text" value="${esc(r.duration || '')}" placeholder="e.g. 3 Months">
      </div>
      <div class="rm-form-group">
        <label class="rm-form-label">Work Mode</label>
        <select class="rm-form-select" id="rmf-workmode">
          <option value="Remote" ${(r.workMode || r.location || 'Remote') === 'Remote' ? 'selected' : ''}>Remote</option>
          <option value="Hybrid" ${(r.workMode || r.location) === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
          <option value="Onsite" ${(r.workMode || r.location) === 'Onsite' ? 'selected' : ''}>Onsite</option>
        </select>
      </div>
      <div class="rm-form-group">
        <label class="rm-form-label">Experience Level</label>
        <select class="rm-form-select" id="rmf-exp">${expOpts}</select>
      </div>
      <div class="rm-form-group full">
        <label class="rm-form-label">Role Description</label>
        <textarea class="rm-form-textarea" id="rmf-description" rows="3">${esc(r.description || '')}</textarea>
      </div>
      <div class="rm-form-group full">
        <label class="rm-form-label">Skills Required <span class="label-hint">(press Enter to add)</span></label>
        <div class="rm-tags-wrap" id="rmf-skills-wrap" data-field="rmf-skills">
          ${tagItems(r.skills)}
          <input class="rm-tag-input" placeholder="Add skill…" id="rmf-skills-input">
        </div>
      </div>
    </div>

    <!-- Collapsible: Responsibilities -->
    <div class="rm-section open">
      <div class="rm-section-header" data-rm-action="toggle-section">
        <span><i class="fa-solid fa-list-check header-icon"></i>Responsibilities</span>
        <i class="fa-solid fa-chevron-down chevron"></i>
      </div>
      <div class="rm-section-body">
        <div class="rm-questions-list" id="rm-responsibilities-list">
          ${questionItems(r.responsibilities)}
        </div>
        <button class="rm-add-question-btn" data-rm-action="add-item" data-target="rm-responsibilities-list">+ Add Responsibility</button>
      </div>
    </div>

    <!-- Requirements -->
    <div class="rm-section open">
      <div class="rm-section-header" data-rm-action="toggle-section">
        <span><i class="fa-solid fa-star header-icon"></i>Requirements & Eligibility</span>
        <i class="fa-solid fa-chevron-down chevron"></i>
      </div>
      <div class="rm-section-body">
        <div class="rm-questions-list" id="rm-requirements-list">
          ${questionItems(r.requirements)}
        </div>
        <button class="rm-add-question-btn" data-rm-action="add-item" data-target="rm-requirements-list">+ Add Requirement</button>
      </div>
    </div>

    <!-- Screening Questions -->
    <div class="rm-section">
      <div class="rm-section-header" data-rm-action="toggle-section">
        <span><i class="fa-solid fa-comments header-icon"></i>Screening Questions</span>
        <i class="fa-solid fa-chevron-down chevron"></i>
      </div>
      <div class="rm-section-body">
        <p class="rm-section-hint">Role-specific questions shown on the application form</p>
        <div class="rm-questions-list" id="rm-questions-list">
          ${questionItems(r.questions)}
        </div>
        <button class="rm-add-question-btn" data-rm-action="add-item" data-target="rm-questions-list">+ Add Question</button>
      </div>
    </div>

    <!-- HR Questions -->
    <div class="rm-section">
      <div class="rm-section-header" data-rm-action="toggle-section">
        <span><i class="fa-solid fa-user-tie header-icon"></i>HR / Founder Interview Questions</span>
        <i class="fa-solid fa-chevron-down chevron"></i>
      </div>
      <div class="rm-section-body">
        <p class="rm-section-hint">Internal questions for your team during interviews (not shown to candidates)</p>
        <div class="rm-questions-list" id="rm-hr-questions-list">
          ${questionItems(r.hrQuestions)}
        </div>
        <button class="rm-add-question-btn" data-rm-action="add-item" data-target="rm-hr-questions-list">+ Add HR Question</button>
      </div>
    </div>

    <!-- Assignment -->
    <div class="rm-section">
      <div class="rm-section-header" data-rm-action="toggle-section">
        <span><i class="fa-solid fa-pen-ruler header-icon"></i>Suggested Assignment</span>
        <i class="fa-solid fa-chevron-down chevron"></i>
      </div>
      <div class="rm-section-body">
        <textarea class="rm-form-textarea" id="rmf-assignment" rows="3" placeholder="Describe the take-home assignment candidates will complete...">${esc(r.assignment || '')}</textarea>
      </div>
    </div>

    <!-- ATS Keywords -->
    <div class="rm-section">
      <div class="rm-section-header" data-rm-action="toggle-section">
        <span><i class="fa-solid fa-tags header-icon"></i>ATS Keywords</span>
        <i class="fa-solid fa-chevron-down chevron"></i>
      </div>
      <div class="rm-section-body">
        <div class="rm-tags-wrap" id="rmf-ats-wrap" data-field="rmf-ats">
          ${tagItems(r.atsKeywords)}
          <input class="rm-tag-input" placeholder="Add keyword…" id="rmf-ats-input">
        </div>
      </div>
    </div>
  `;
}

// ── Helpers to read modal back into a role object ────────────
function getTagsFromWrap(wrapId) {
  const wrap = $('#' + wrapId);
  if (!wrap) return [];
  return $$('.rm-tag', wrap).map(t => t.textContent.replace('✕', '').trim()).filter(Boolean);
}
function getListItems(listId) {
  const list = $('#' + listId);
  if (!list) return [];
  return $$('.rm-question-text', list).map(t => t.value.trim()).filter(Boolean);
}

// ── Save / Duplicate / Status / Delete ───────────────────────
function saveRole() {
  const title = $('#rmf-title')?.value.trim();
  if (!title) { alert('Role title is required.'); return; }

  const newRole = {
    id:               currentEditId || ('custom_' + Date.now()),
    title,
    category:         $('#rmf-category')?.value || 'growth',
    type:             $('#rmf-type')?.value     || 'internship',
    status:           $('#rmf-status')?.value   || 'active',
    stipend:          $('#rmf-stipend')?.value.trim()   || 'TBD',
    duration:         $('#rmf-duration')?.value.trim()  || 'TBD',
    workMode:         $('#rmf-workmode')?.value || 'Remote',
    location:         $('#rmf-workmode')?.value || 'Remote',
    experienceLevel:  $('#rmf-exp')?.value      || 'Entry Level',
    description:      $('#rmf-description')?.value.trim() || '',
    skills:           getTagsFromWrap('rmf-skills-wrap'),
    atsKeywords:      getTagsFromWrap('rmf-ats-wrap'),
    responsibilities: getListItems('rm-responsibilities-list'),
    requirements:     getListItems('rm-requirements-list'),
    questions:        getListItems('rm-questions-list'),
    hrQuestions:      getListItems('rm-hr-questions-list'),
    assignment:       $('#rmf-assignment')?.value.trim() || '',
    lastModified:     new Date().toISOString().slice(0, 10),
    postedDate:       new Date().toISOString().slice(0, 10),
    isCustom:         true,
  };

  const all = getAllRoles();
  if (currentEditId) {
    const idx = all.findIndex(r => String(r.id) === String(currentEditId));
    if (idx >= 0) all[idx] = { ...all[idx], ...newRole };
    else           all.push(newRole);
  } else {
    all.push(newRole);
  }
  saveCustomRoles(all);

  // Flash save indicator
  saveIndicator.classList.add('saved');
  saveText.textContent = 'Saved!';
  setTimeout(() => {
    saveIndicator.classList.remove('saved');
    saveText.textContent = 'Unsaved';
    closeModal();
    rmRefreshCards();
  }, 800);
}

function duplicateRole(id) {
  const all = getAllRoles();
  const role = all.find(r => String(r.id) === String(id));
  if (!role) return;
  const dupe = {
    ...role,
    id:       'custom_' + Date.now(),
    title:    role.title + ' (Copy)',
    status:   'draft',
    isCustom: true,
  };
  all.push(dupe);
  saveCustomRoles(all);
  rmRefreshCards();
}

function toggleStatus(id) {
  const all = getAllRoles();
  const idx = all.findIndex(r => String(r.id) === String(id));
  if (idx < 0) return;
  all[idx] = {
    ...all[idx],
    isCustom: true,
    status:   all[idx].status === 'active' ? 'closed' : 'active',
  };
  saveCustomRoles(all);
  rmRefreshCards();
}

function deleteRole(id) {
  if (!confirm('Delete this custom role permanently?')) return;
  const remaining = getAllRoles().filter(r => String(r.id) !== String(id));
  saveCustomRoles(remaining);
  rmRefreshCards();
}

// ── Card grid delegation ─────────────────────────────────────
function handleCardClick(e) {
  const btn = e.target.closest('[data-rm-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  switch (btn.dataset.rmAction) {
    case 'edit':      openEditModal(id); break;
    case 'duplicate': duplicateRole(id); break;
    case 'toggle':    toggleStatus(id);  break;
    case 'delete':    deleteRole(id);    break;
  }
}

// ── Modal-body delegation (sections, items, tags) ────────────
function handleModalClick(e) {
  const target = e.target.closest('[data-rm-action]');
  if (!target) return;
  const action = target.dataset.rmAction;

  if (action === 'toggle-section') {
    target.closest('.rm-section').classList.toggle('open');
  } else if (action === 'add-item') {
    const list = $('#' + target.dataset.target);
    if (!list) return;
    const item = document.createElement('div');
    item.className = 'rm-question-item';
    item.innerHTML = `
      <textarea class="rm-question-text" rows="2" placeholder="Type here..."></textarea>
      <button class="rm-question-del" data-rm-action="del-item"><i class="fa-solid fa-xmark"></i></button>`;
    list.appendChild(item);
    item.querySelector('textarea').focus();
  } else if (action === 'del-item') {
    target.parentElement.remove();
  } else if (action === 'del-tag') {
    target.parentElement.remove();
  }
}

// ── Tag input keydown (delegated on overlay) ─────────────────
function handleModalKeydown(e) {
  const input = e.target.closest('.rm-tag-input');
  if (!input) return;
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    const val = input.value.trim().replace(/,$/, '');
    if (!val) return;
    const tag = document.createElement('span');
    tag.className = 'rm-tag';
    tag.innerHTML = `${esc(val)}<span class="rm-tag-del" data-rm-action="del-tag">✕</span>`;
    input.parentElement.insertBefore(tag, input);
    input.value = '';
  }
}

// ── Init (called from admin.js once dashboard is built) ──────
export function initRoleManagement() {
  modalOverlay   = $('#rm-modal-overlay');
  modalTitleEl   = $('#rm-modal-title');
  modalBody      = $('#rm-modal-body');
  saveIndicator  = $('#rm-save-indicator');
  saveText       = $('#rm-save-text');
  cardsContainer = $('#rm-cards-container');

  // Toolbar
  $('[data-rm-action="refresh"]').addEventListener('click', rmRefreshCards);
  $('[data-rm-action="create"]') .addEventListener('click', openCreateModal);

  // Modal — header/footer buttons
  $$('[data-rm-action="close-modal"]').forEach(b => b.addEventListener('click', closeModal));
  $('[data-rm-action="save"]').addEventListener('click', saveRole);

  // Delegated event handlers
  cardsContainer.addEventListener('click', handleCardClick);
  modalBody.addEventListener('click',   handleModalClick);
  modalOverlay.addEventListener('keydown', handleModalKeydown);
}
