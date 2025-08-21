/*
  Global Text FX system
  - Split text into spans but keep original text for screen readers via aria-label
  - Auto-applies to .fx-text and headings with [data-fx]
  - IntersectionObserver triggers reveal
  - MutationObserver processes new content
  - window.__FX_DISABLE__ disables everything
*/

declare global {
  interface Window { __FX_DISABLE__?: boolean; FX?: any }
}

const SELECTOR = 'h1, h2, h3, .lead, .hero-title, .fx-text, [data-fx]';

function splitElement(el: HTMLElement) {
  if (el.dataset.fxProcessed === '1') return;
  const text = el.textContent || '';
  if (!text.trim()) return;
  el.setAttribute('aria-label', text);
  const frag = document.createDocumentFragment();
  const chunks = text.split(/(\s+)/); // preserve spaces as chunks
  chunks.forEach((chunk) => {
    const span = document.createElement('span');
    span.textContent = chunk;
    span.setAttribute('aria-hidden', 'true');
    span.setAttribute('data-fx-chunk', '');
    frag.appendChild(span);
  });
  el.textContent = '';
  el.appendChild(frag);
  el.dataset.fxProcessed = '1';
}

function process(root: Document | HTMLElement = document) {
  if (window.__FX_DISABLE__) return 0;
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR));
  nodes.forEach((el) => splitElement(el));
  return nodes.length;
}

function bootstrapIO() {
  if (window.__FX_DISABLE__) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        el.setAttribute('data-fx-ready', '');
        io.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => io.observe(el));
}

function bootstrapMO() {
  if (window.__FX_DISABLE__) return;
  const mo = new MutationObserver((mut) => {
    mut.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          const count = process(node);
          if (count > 0) bootstrapIO();
        }
      });
    });
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
}

export function init({ auto = true } = {}) {
  if (window.__FX_DISABLE__) return;
  const count = process();
  if (auto) {
    bootstrapIO();
    bootstrapMO();
  }
  // eslint-disable-next-line no-console
  console.log('[FX] init, processed count=', count);
}

// Public API
window.FX = {
  init,
  process,
  disable() { window.__FX_DISABLE__ = true; },
  enable() { window.__FX_DISABLE__ = false; },
};


