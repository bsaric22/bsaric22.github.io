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
    if (previewDialog.open) syncPreview();
  }
  thumbnails.forEach((thumbnail, index) => thumbnail.addEventListener('click', () => showImage(index)));
  const mainButton = gallery.querySelector('.gallery-main');
  const previewDialog = document.querySelector('#image-preview');
  const previewImage = previewDialog.querySelector('.image-preview-image');
  const previewStatus = previewDialog.querySelector('.image-preview-status');
  function syncPreview() {
    previewImage.src = image.src;
    previewImage.alt = image.alt;
    previewStatus.textContent = 'Slika ' + (current + 1) + ' od ' + thumbnails.length;
  }
  mainButton.addEventListener('click', () => {
    syncPreview();
    previewDialog.showModal();
    document.documentElement.classList.add('image-preview-open');
  });
  previewDialog.querySelector('.image-preview-close').addEventListener('click', () => previewDialog.close());
  previewDialog.querySelector('.image-preview-previous').addEventListener('click', () => showImage(current - 1));
  previewDialog.querySelector('.image-preview-next').addEventListener('click', () => showImage(current + 1));
  previewDialog.addEventListener('click', event => {
    if (event.target === previewDialog) previewDialog.close();
  });
  // Native dialog handles Escape and keeps keyboard focus inside the preview.
  previewDialog.addEventListener('close', () => {
    document.documentElement.classList.remove('image-preview-open');
    mainButton.focus({ preventScroll:true });
  });
  gallery.querySelector('.gallery-next').addEventListener('click', () => showImage(current + 1));
  gallery.querySelector('.gallery-previous').addEventListener('click', () => showImage(current - 1));
  function handleGalleryKeys(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showImage(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  }
  gallery.addEventListener('keydown', handleGalleryKeys);
  previewDialog.addEventListener('keydown', handleGalleryKeys);

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
