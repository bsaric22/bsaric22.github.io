(() => {
  'use strict';
  const gallery = document.querySelector('.project-gallery');
  const image = gallery.querySelector('#project-main-image');
  const thumbnails = [...gallery.querySelectorAll('.gallery-thumbnail')];
  const status = gallery.querySelector('.gallery-status');
  let current = 0;

  function showImage(index) {
    current = (index + thumbnails.length) % thumbnails.length;
    const preview = thumbnails[current].querySelector('img');
    image.src = preview.getAttribute('src');
    image.alt = preview.alt;
    thumbnails.forEach((thumbnail, i) => thumbnail.setAttribute('aria-pressed', String(i === current)));
    status.textContent = 'Slika ' + (current + 1) + ' od ' + thumbnails.length;
  }
  thumbnails.forEach((thumbnail, index) => thumbnail.addEventListener('click', () => showImage(index)));
  gallery.querySelector('.gallery-main').addEventListener('click', () => showImage(current + 1));
  gallery.querySelector('.gallery-next').addEventListener('click', () => showImage(current + 1));
  gallery.querySelector('.gallery-previous').addEventListener('click', () => showImage(current - 1));
  gallery.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  const header = document.querySelector('.header');
  const toggle = header.querySelector('.menu-toggle');
  const mobile = window.matchMedia('(max-width: 760px)');
  function closeMenu(returnFocus = false) {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Otvori izbornik');
    if (returnFocus) toggle.focus();
  }
  header.classList.add('nav-enhanced');
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Zatvori izbornik' : 'Otvori izbornik');
  });
  header.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('nav-open')) closeMenu(true);
  });
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('focusin', event => { if (!header.contains(event.target)) closeMenu(); });
  mobile.addEventListener('change', () => closeMenu());
})();
