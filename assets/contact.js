(() => {
  'use strict';
  const section = document.querySelector('.contact-social');
  if (!section) return;
  const reveal = () => section.classList.add('is-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, { threshold: 0.2 });
  observer.observe(section);
})();
