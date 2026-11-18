(() => {
  'use strict';
  const section = document.querySelector('.clients');
  if (!section) return;
  const track = section.querySelector('.clients-track');
  const list = section.querySelector('.clients-list');
  if (!track || !list) return;
  // This is intentionally the same setup as the skills carousel: one exact
  // visual copy and the same 50 second translateX(-50%) animation.
  const copy = list.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.setAttribute('inert', '');
  track.append(copy);
  section.classList.add('clients-ready');
})();
