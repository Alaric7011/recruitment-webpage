// ============================================================
// APPLICATION FORM — build HTML, validate, submit
// ============================================================
import { $, $$ } from '../utils/dom.js';
import { esc, isValidEmail } from '../utils/format.js';
import { JOBS } from '../data/jobs.js';
import { ROLE_FORMS } from '../data/role-forms.js';
import { saveApplication } from '../utils/storage.js';
import { submitToSheets } from './sheets.js';

// ── HTML builders ────────────────────────────────────────────
function fieldHtml(f) {
  const req = f.required ? '<span class="req">*</span>' : '';
  if (f.type === 'select') {
    const opts = f.options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');
    return `<div class="form-field" data-field="${f.id}">
      <label>${esc(f.label)} ${req}</label>
      <select name="${f.id}">
        <option value="">— Select —</option>
        ${opts}
      </select>
      <span class="field-error-msg">Please select an option</span>
    </div>`;
  }
  if (f.type === 'textarea') {
    return `<div class="form-field" data-field="${f.id}">
      <label>${esc(f.label)} ${req}</label>
      <textarea name="${f.id}" placeholder="${esc(f.placeholder || '')}" rows="4"></textarea>
      <span class="field-error-msg">This field is required</span>
    </div>`;
  }
  return `<div class="form-field" data-field="${f.id}">
    <label>${esc(f.label)} ${req}</label>
    <input type="text" name="${f.id}" placeholder="${esc(f.placeholder || '')}" />
    <span class="field-error-msg">This field is required</span>
  </div>`;
}

export function buildApplicationForm(job) {
  const extras = (ROLE_FORMS[job.id] || { extras: [] }).extras;
  const extraFieldsHtml = extras.map(fieldHtml).join('');
  const extrasSection   = extras.length
    ? `<div class="form-section-label">Role-Specific Questions</div>${extraFieldsHtml}` : '';

  return `
    <div class="app-form-header">
      <button class="app-form-back" data-action="back" title="Back to role details">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div class="app-form-title">
        <span class="role-tag">Applying for</span>
        <h3>${esc(job.title)}</h3>
      </div>
    </div>

    <div class="app-success" id="app-success-state">
      <div class="success-icon"><i class="fa-solid fa-check"></i></div>
      <h3>Application Submitted!</h3>
      <p>Thanks for applying for <strong>${esc(job.title)}</strong>. We'll review your application and get back to you within 5–7 working days.</p>
      <button class="success-close-btn" data-action="close-modal">Close</button>
    </div>

    <form class="app-form" id="application-form" novalidate>
      <div class="form-section-label">Personal Details</div>

      <div class="form-row">
        <div class="form-field" data-field="full_name">
          <label>Full Name <span class="req">*</span></label>
          <input type="text" name="full_name" placeholder="Your full name" autocomplete="name" />
          <span class="field-error-msg">Please enter your full name</span>
        </div>
        <div class="form-field" data-field="phone">
          <label>Phone Number <span class="req">*</span></label>
          <input type="tel" name="phone" placeholder="+91 98765 43210" autocomplete="tel" />
          <span class="field-error-msg">Please enter a valid phone number</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-field" data-field="email">
          <label>Email Address <span class="req">*</span></label>
          <input type="email" name="email" placeholder="you@email.com" autocomplete="email" />
          <span class="field-error-msg">Please enter a valid email</span>
        </div>
        <div class="form-field" data-field="city">
          <label>City <span class="req">*</span></label>
          <input type="text" name="city" placeholder="e.g. Mumbai, Delhi, Bengaluru…" />
          <span class="field-error-msg">Please enter your city</span>
        </div>
      </div>

      <div class="form-section-label">Academic Background</div>

      <div class="form-row">
        <div class="form-field" data-field="college">
          <label>College / University <span class="req">*</span></label>
          <input type="text" name="college" placeholder="e.g. IIT Delhi, DU, BITS Pilani…" />
          <span class="field-error-msg">Please enter your college</span>
        </div>
        <div class="form-field" data-field="degree">
          <label>Degree & Branch <span class="req">*</span></label>
          <input type="text" name="degree" placeholder="e.g. B.Tech CSE, MBA, BBA…" />
          <span class="field-error-msg">Please enter your degree</span>
        </div>
      </div>

      <div class="form-row">
        <div class="form-field" data-field="graduation_year">
          <label>Graduation Year <span class="req">*</span></label>
          <select name="graduation_year">
            <option value="">— Select Year —</option>
            <option>2024</option><option>2025</option><option>2026</option>
            <option>2027</option><option>2028</option><option>Already Graduated</option>
          </select>
          <span class="field-error-msg">Please select your graduation year</span>
        </div>
        <div class="form-field" data-field="current_status">
          <label>Current Status <span class="req">*</span></label>
          <select name="current_status">
            <option value="">— Select —</option>
            <option>Student (actively studying)</option>
            <option>Student (final year)</option>
            <option>Recent graduate (&lt; 1 year)</option>
            <option>Working professional</option>
            <option>Freelancer / Independent</option>
          </select>
          <span class="field-error-msg">Please select your status</span>
        </div>
      </div>

      <div class="form-section-label">About You</div>

      <div class="form-row single">
        <div class="form-field" data-field="linkedin">
          <label>LinkedIn Profile URL</label>
          <input type="text" name="linkedin" placeholder="https://linkedin.com/in/yourname" />
        </div>
      </div>

      <div class="form-row single">
        <div class="form-field" data-field="startup_exp">
          <label>Any prior startup / freelance experience? <span class="req">*</span></label>
          <select name="startup_exp">
            <option value="">— Select —</option>
            <option>No prior experience</option>
            <option>Side project / personal project</option>
            <option>Freelance work</option>
            <option>Interned at a startup</option>
            <option>Founded or co-founded a startup</option>
            <option>Worked full-time at a startup</option>
          </select>
          <span class="field-error-msg">Please select an option</span>
        </div>
      </div>

      <div class="form-row single">
        <div class="form-field" data-field="why_tss">
          <label>Why do you want to join The Startup School? <span class="req">*</span></label>
          <textarea name="why_tss" placeholder="Be honest. What draws you here? What are you hoping to build, learn or achieve?" rows="3"></textarea>
          <span class="field-error-msg">Please tell us why you want to join</span>
        </div>
      </div>

      ${extrasSection}

      <div class="form-row single">
        <div class="form-field" data-field="referral">
          <label>How did you hear about this role?</label>
          <select name="referral">
            <option value="">— Select —</option>
            <option>LinkedIn</option><option>Instagram</option>
            <option>WhatsApp Group</option><option>Friend / Referral</option>
            <option>The Startup School website</option><option>College Notice Board</option><option>Other</option>
          </select>
        </div>
      </div>

      <button type="submit" class="form-submit-btn" id="form-submit-btn">
        <span class="spinner"></span>
        <span class="btn-text">Submit Application &nbsp;→</span>
      </button>
    </form>
  `;
}

// ── Validation + Submit ──────────────────────────────────────
export function handleFormSubmit(e, currentJobId, modalBox, onAfter) {
  e.preventDefault();
  const form = e.target;
  let valid = true;

  $$('.form-field', form).forEach(fieldWrap => {
    const input = fieldWrap.querySelector('input, select, textarea');
    if (!input) return;
    const isRequired = !!fieldWrap.querySelector('label .req');
    fieldWrap.classList.remove('error');

    if (!isRequired) return;
    if (input.type === 'email') {
      if (!isValidEmail(input.value)) { fieldWrap.classList.add('error'); valid = false; }
    } else if (!input.value.trim()) {
      fieldWrap.classList.add('error'); valid = false;
    }
  });

  if (!valid) {
    const firstErr = form.querySelector('.form-field.error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const submitBtn = $('#form-submit-btn');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  // Gather fields
  const job = JOBS.find(j => j.id === currentJobId);
  const data = {
    roleId:    currentJobId,
    roleTitle: job ? job.title : 'Unknown',
    appliedAt: new Date().toISOString(),
  };
  $$('input, select, textarea', form).forEach(el => {
    if (el.name) data[el.name] = el.value.trim();
  });

  // Backup locally first
  saveApplication(data);

  // Best-effort send to Sheets, then show success regardless
  submitToSheets(data).finally(() => {
    submitBtn.classList.remove('loading');
    form.style.display = 'none';
    const success = $('#app-success-state');
    if (success) success.classList.add('show');
    modalBox.scrollTop = 0;
    if (typeof onAfter === 'function') onAfter();
  });
}
