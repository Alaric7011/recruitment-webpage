// ============================================================
// FAQ ACCORDION
// ============================================================
import { $ } from '../utils/dom.js';
import { esc } from '../utils/format.js';
import { FAQS } from '../data/faqs.js';

export function initFaq() {
  const list = $('#faq-list');
  if (!list) return;

  const frag = document.createDocumentFragment();
  FAQS.forEach((faq, i) => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.setAttribute('role', 'listitem');
    item.innerHTML = `
      <button class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}">
        ${esc(faq.q)}
        <i class="fa-solid fa-plus" aria-hidden="true"></i>
      </button>
      <div class="faq-a" id="faq-a-${i}" role="region">
        <div class="faq-a-inner">${esc(faq.a)}</div>
      </div>
    `;
    frag.appendChild(item);
  });
  list.appendChild(frag);

  // Single delegated listener
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const item = btn.parentElement;
    const isOpen = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });
}
