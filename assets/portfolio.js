(() => {
  'use strict';
  document.querySelectorAll('.contact:not(.contact-social)').forEach(section => {
    section.id = 'kontakt-legacy';
    section.hidden = true;
  });
  const carousel = document.querySelector('[data-portfolio-carousel]');
  if (!carousel) return;
  const track = carousel.querySelector('.portfolio-grid');
  const cards = [...track.querySelectorAll('.project-card')];
  const previous = carousel.querySelector('.portfolio-slider-previous');
  const next = carousel.querySelector('.portfolio-slider-next');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  const gap = 32;
  function measure() {
    const available = Math.max(260, carousel.clientWidth - 104);
    const width = (available - gap * 2) / 3.2;
    carousel.style.setProperty('--portfolio-card-width', width + 'px');
    track.style.setProperty('--portfolio-shift', index * (width + gap) + 'px');
  }
  function render() {
    const width = parseFloat(getComputedStyle(carousel).getPropertyValue('--portfolio-card-width')) || 0;
    track.style.setProperty('--portfolio-shift', index * (width + gap) + 'px');
    cards.forEach((card, cardIndex) => card.classList.toggle('is-departed', index > 0 && cardIndex < index));
    carousel.classList.toggle('has-moved', index > 0);
    previous.disabled = index === 0;
    next.disabled = index >= cards.length - 3;
  }
  function move(delta) {
    index = Math.max(0, Math.min(cards.length - 3, index + delta));
    render();
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  addEventListener('resize', () => { measure(); render(); });
  if (reduced.matches) carousel.classList.add('portfolio-no-motion');
  measure();
  render();
})();
