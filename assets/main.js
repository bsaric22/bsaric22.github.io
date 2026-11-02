(() => {
  'use strict';
  // Duplicate only the visual strip; edit the original list in index.html.
  const skills = document.querySelector('.skills');
  if (skills) {
    const track = skills.querySelector('.skills-track');
    const copy = skills.querySelector('.skills-list').cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.setAttribute('inert', '');
    track.append(copy);
    skills.classList.add('skills-ready');
    const toggle = skills.querySelector('.skills-toggle');
    // The pause button is optional; removing it must not stop hero initialization.
    toggle?.removeAttribute('hidden');
    toggle?.addEventListener('click', () => {
      const paused = skills.classList.toggle('skills-paused');
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'Pokreni pomicanje' : 'Pauziraj pomicanje';
    });
  }
  // The name and welcome animate once per page load. The complete welcome remains
  // available to assistive technology and without JavaScript.
  const intro = document.querySelector('#naslovna');
  const introText = intro.querySelector('.intro-text');
  const welcome = introText.textContent;
  const nameLines = [...intro.querySelectorAll('.name-line')];
  // This intro explicitly uses the same animation on desktop and mobile.
  // The visible pause control remains available on both.
  const ambient = intro.querySelector('.hero-ambient');
  const motifs = [...ambient.querySelectorAll('.ambient-motif')];
  let backgroundAnimations = [];
  const ambientToggle = intro.querySelector('.ambient-toggle');
  ambientToggle.hidden = false;
  ambientToggle.addEventListener('click', () => {
    const paused = intro.classList.toggle('background-paused');
    ambientToggle.setAttribute('aria-pressed', String(paused));
    ambientToggle.textContent = paused ? 'Pokreni pozadinu' : 'Pauziraj pozadinu';
    if (paused) finishIntro();
    syncBackgroundVisibility();
  });
  let introVisible = true;
  function syncBackgroundVisibility() {
    const idle = document.hidden || !introVisible;
    intro.classList.toggle('background-idle', idle);
    const paused = idle || intro.classList.contains('background-paused');
    backgroundAnimations.forEach(animation => paused ? animation.pause() : animation.play());
  }
  function randomBackgroundPaths() {
    backgroundAnimations.forEach(animation => animation.cancel());
    backgroundAnimations = [];
    const width = ambient.clientWidth;
    const height = ambient.clientHeight;
    if (!width || !height) return;
    motifs.forEach((motif, index) => {
      const maxX = Math.max(0, width - motif.clientWidth);
      const maxY = Math.max(0, height - motif.clientHeight);
      // Distribute the starting positions; every motif then follows its own path.
      let x = ((index % 4) + Math.random() * .6) / 4 * maxX;
      let y = (Math.floor(index / 4) + Math.random() * .5) / 2 * maxY;
      const points = [];
      for (let step = 0; step < 5; step++) {
        const angle = Math.random() * 24 - 12;
        points.push({ transform:`translate(${x}px, ${y}px) rotate(${angle}deg)` });
        x = Math.max(0, Math.min(maxX, x + (Math.random() - .5) * width * .55));
        y = Math.max(0, Math.min(maxY, y + (Math.random() - .5) * height * .45));
      }
      motif.style.transform = points[0].transform;
      if (typeof motif.animate === 'function') {
        backgroundAnimations.push(motif.animate(points, {
          duration:28000 + Math.random() * 18000,
          iterations:Infinity,
          direction:'alternate',
          easing:'ease-in-out'
        }));
      }
    });
    syncBackgroundVisibility();
  }
  new ResizeObserver(randomBackgroundPaths).observe(ambient);
  new IntersectionObserver(entries => {
    introVisible = entries[0].isIntersecting;
    syncBackgroundVisibility();
  }).observe(intro);
  document.addEventListener('visibilitychange', syncBackgroundVisibility);
  syncBackgroundVisibility();
  let introTimer;
  let introFinished = false;
  const nameAnimations = [];

  function finishIntro() {
    introFinished = true;
    clearTimeout(introTimer);
    nameAnimations.forEach(animation => animation.cancel());
    nameLines.forEach(line => { line.style.opacity = ''; });
    introText.textContent = welcome;
    intro.classList.remove('intro-typing');
    intro.classList.add('intro-complete');
  }

  async function playIntro() {
    if (typeof nameLines[0].animate !== 'function') {
      finishIntro();
      return;
    }
    const layout = introText.cloneNode(true);
    layout.className = 'intro-layout';
    layout.setAttribute('aria-hidden', 'true');
    const accessibleText = introText.cloneNode(true);
    accessibleText.className = 'sr-only';
    introText.setAttribute('aria-hidden', 'true');
    introText.after(layout, accessibleText);
    introText.textContent = '';
    nameLines.forEach(line => { line.style.opacity = '0'; });
    // Avoid waiting indefinitely on a font CDN before showing the introduction.
    await Promise.race([
      document.fonts.ready,
      new Promise(resolve => setTimeout(resolve, 1200))
    ]);
    if (introFinished) return;
    nameLines.forEach((line, index) => {
      nameAnimations.push(line.animate([
        { opacity:0, transform:`translateY(${index === 0 ? '110%' : '-110%'})` },
        { opacity:1, transform:'translateY(0)' }
      ], { duration:1700, delay:index * 260, easing:'cubic-bezier(.22,.65,.2,1)', fill:'both' }));
    });
    await Promise.all(nameAnimations.map(animation => animation.finished.catch(() => {})));
    if (introFinished) return;
    nameLines.forEach(line => { line.style.opacity = ''; });
    nameAnimations.forEach(animation => animation.cancel());
    intro.classList.add('intro-typing');
    const characters = Array.from(welcome);
    let position = 0;
    function typeNext() {
      if (introFinished) return;
      introText.textContent = characters.slice(0, ++position).join('');
      if (position >= characters.length) { finishIntro(); return; }
      const character = characters[position - 1];
      const delay = character === '\n' ? 380 : /[.!?]/.test(character) ? 180 : 29;
      introTimer = setTimeout(typeNext, delay);
    }
    typeNext();
  }
  window.addEventListener('pagehide', finishIntro);
  playIntro().catch(finishIntro);

  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navigationLinks = [...header.querySelectorAll('nav a')];
  const navigationSections = navigationLinks.map(link => document.querySelector(link.hash));
  const mobileNavigation = window.matchMedia('(max-width: 760px)');

  function closeMenu(returnFocus = false) {
    header.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Otvori izbornik');
    if (returnFocus) menuToggle.focus();
  }

  header.classList.add('nav-enhanced');
  menuToggle.hidden = false;
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('nav-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Zatvori izbornik' : 'Otvori izbornik');
  });
  header.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    // Avoid leaving keyboard focus inside the collapsed mobile panel.
    closeMenu(mobileNavigation.matches && link.closest('nav') !== null);
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('nav-open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  document.addEventListener('focusin', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  mobileNavigation.addEventListener('change', () => closeMenu());

  // Track the section crossing the area below the floating bar. The playground
  // belongs to Portfolio; the introductory hero has no selected navigation item.
  function updateActiveSection() {
    const threshold = mobileNavigation.matches ? 120 : 136;
    let active = -1;
    navigationSections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= threshold) active = index;
    });
    if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      active = navigationLinks.length - 1;
    }
    navigationLinks.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let navigationFrame = 0;
  function scheduleNavigationUpdate() {
    if (navigationFrame) return;
    navigationFrame = requestAnimationFrame(() => {
      navigationFrame = 0;
      updateActiveSection();
    });
  }
  window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
  window.addEventListener('resize', scheduleNavigationUpdate);
  window.addEventListener('pageshow', scheduleNavigationUpdate);
  window.addEventListener('hashchange', scheduleNavigationUpdate);
  document.fonts.ready.then(scheduleNavigationUpdate);
  updateActiveSection();

  // Shapes are static: redraw only on resize or explicit control changes.
  let mode = 'orbit';
  let intensity = 0.5;
  const time = 0;
  const canvases = [...document.querySelectorAll('canvas')].map(canvas => ({
    canvas, ctx: canvas.getContext('2d'), width: 0, height: 0,
    pointer: { x: 0, y: 0 }, hero: canvas.id === 'hero-canvas'
  })).filter(item => item.ctx);

  function project(x, y, z, t, item) {
    const rotation = t * 0.18 + item.pointer.x * 0.45;
    const tilt = -0.5 + item.pointer.y * 0.35;
    const rx = x * Math.cos(rotation) - z * Math.sin(rotation);
    const rz = x * Math.sin(rotation) + z * Math.cos(rotation);
    const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
    const depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
    const perspective = 3.8 / (3.8 + depth);
    const size = Math.min(item.width, item.height) * (item.hero ? 0.29 : 0.28);
    return [item.width / 2 + rx * size * perspective, item.height / 2 + ry * size * perspective];
  }

  function drawOrbit(item, t) {
    const { ctx, hero } = item;
    const rings = hero ? 42 : 30;
    for (let ring = 0; ring < rings; ring++) {
      const u = ring / rings * Math.PI * 2;
      ctx.beginPath();
      for (let step = 0; step <= 100; step++) {
        const v = step / 100 * Math.PI * 2;
        const ripple = 0.055 * Math.sin(v * 3 + u * 2 + t) * (hero ? 1 : intensity * 2);
        const radius = 0.94 + (0.35 + ripple) * Math.cos(v);
        const point = project(radius * Math.cos(u), radius * Math.sin(u), (0.35 + ripple) * Math.sin(v), t, item);
        if (step === 0) ctx.moveTo(point[0], point[1]); else ctx.lineTo(point[0], point[1]);
      }
      ctx.strokeStyle = hero ? 'rgba(35, 169, 242, 0.85)' : 'rgba(137, 210, 255, 0.65)';
      ctx.lineWidth = hero ? 0.85 : 0.8;
      ctx.stroke();
    }
  }

  function drawWave(item, t) {
    const { ctx, width, height, pointer } = item;
    for (let row = 0; row < 25; row++) {
      ctx.beginPath();
      for (let step = 0; step <= 110; step++) {
        const x = width * (0.08 + step / 110 * 0.84);
        const wave = Math.sin(step / 110 * 9 + t + row * 0.13 + pointer.x) * (24 + intensity * 36);
        const y = height * 0.22 + row * height * 0.021 + wave * Math.sin(step / 110 * Math.PI);
        if (step === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(137, 210, 255, ${0.25 + row / 40})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawGrid(item, t) {
    const { ctx } = item;
    for (let x = -8; x <= 8; x++) {
      for (let y = -8; y <= 8; y++) {
        const distance = Math.hypot(x, y);
        const z = Math.sin(distance * 0.55 - t * 1.7) * (0.08 + intensity * 0.27);
        const point = project(x * 0.13, y * 0.13, z, 1.2, item);
        ctx.beginPath();
        ctx.arc(point[0], point[1], 1.5 + (z + 0.4) * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(137,210,255,${0.5 + z * 0.7})`;
        ctx.fill();
      }
    }
  }

  function draw(item) {
    if (!item.width || !item.height) return;
    item.ctx.clearRect(0, 0, item.width, item.height);
    if (item.hero || mode === 'orbit') drawOrbit(item, time);
    else if (mode === 'wave') drawWave(item, time);
    else drawGrid(item, time);
  }

  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const item = canvases.find(candidate => candidate.canvas === entry.target);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      item.width = entry.contentRect.width;
      item.height = entry.contentRect.height;
      item.canvas.width = Math.round(item.width * ratio);
      item.canvas.height = Math.round(item.height * ratio);
      item.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(item);
      item.canvas.classList.add('canvas-ready');
    }
  });

  canvases.forEach(item => resizeObserver.observe(item.canvas));

  const labels = { orbit: '001 — ORBITA', wave: '002 — VALOVI', grid: '003 — MREŽA' };
  function selectMode(next) {
    if (!labels[next]) return;
    mode = next;
    document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    document.querySelector('#mode-label').textContent = labels[mode];
    canvases.forEach(draw);
  }
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => selectMode(button.dataset.mode)));
  document.querySelectorAll('[data-preset]').forEach(link => link.addEventListener('click', () => selectMode(link.dataset.preset)));
  document.querySelector('#intensity').addEventListener('input', event => {
    intensity = Number(event.target.value) / 100;
    document.querySelector('#intensity-value').value = `${event.target.value}%`;
    canvases.forEach(draw);
  });
  document.querySelector('#year').textContent = new Date().getFullYear();

})();
