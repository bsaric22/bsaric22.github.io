(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let mode = 'orbit';
  let intensity = 0.5;
  let time = 0;
  let previousTime = 0;
  let frame = 0;
  const toggle = document.querySelector('.motion-toggle');
  const canvases = [...document.querySelectorAll('canvas')].map(canvas => ({
    canvas, ctx: canvas.getContext('2d'), width: 0, height: 0, visible: false,
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
      ctx.strokeStyle = hero ? 'rgba(208, 67, 29, 0.68)' : 'rgba(217, 230, 176, 0.65)';
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
      ctx.strokeStyle = `rgba(217, 230, 176, ${0.25 + row / 40})`;
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
        ctx.fillStyle = `rgba(217,230,176,${0.5 + z * 0.7})`;
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

  function tick(now) {
    frame = 0;
    if (paused || document.hidden || !canvases.some(item => item.visible)) { previousTime = 0; return; }
    if (previousTime) time += Math.min((now - previousTime) / 1000, 0.05) * (0.35 + intensity * 1.3);
    previousTime = now;
    canvases.filter(item => item.visible).forEach(draw);
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (!frame && !paused && !document.hidden && canvases.some(item => item.visible)) frame = requestAnimationFrame(tick);
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

  const visibilityObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const item = canvases.find(candidate => candidate.canvas === entry.target);
      item.visible = entry.isIntersecting;
      if (item.visible) draw(item);
    });
    start();
  });

  canvases.forEach(item => {
    resizeObserver.observe(item.canvas);
    visibilityObserver.observe(item.canvas);
    item.canvas.addEventListener('pointermove', event => {
      if (paused) return;
      const rect = item.canvas.getBoundingClientRect();
      item.pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      item.pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    });
    item.canvas.addEventListener('pointerleave', () => { item.pointer.x = 0; item.pointer.y = 0; });
  });

  function updateMotion() {
    document.body.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    const label = paused ? 'Pokreni animacije' : 'Pauziraj animacije';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    toggle.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
    if (paused) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
    else start();
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reducedMotion.addEventListener('change', event => { paused = event.matches; updateMotion(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
    else start();
  });
  updateMotion();

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

  if (!reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.remove('pending'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.about-content, .experiment, .contact-row').forEach(element => {
      element.classList.add('reveal', 'pending');
      revealObserver.observe(element);
    });
  }
})();
