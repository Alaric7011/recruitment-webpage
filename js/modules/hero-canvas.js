// ============================================================
// HERO CANVAS — animated particle grid
// ============================================================
import { $ } from '../utils/dom.js';
import { CANVAS_PARTICLES, CANVAS_LINK_DIST } from '../config.js';

export function initHeroCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function spawn() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.05
    };
  }

  function init() {
    resize();
    particles.length = 0;
    for (let i = 0; i < CANVAS_PARTICLES; i++) particles.push(spawn());
  }

  function drawConnections() {
    const max2 = CANVAS_LINK_DIST * CANVAS_LINK_DIST;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < max2) {
          const alpha = (1 - Math.sqrt(d2) / CANVAS_LINK_DIST) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
      ctx.fill();
    }
    drawConnections();
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', init);
  init();
  tick();
}
