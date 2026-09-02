/* ==========================================================================
   FLORAFOCUS — Ambient Canvas Particle System & Celebration Confetti
   ========================================================================== */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.confetti = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.speciesTheme = 'succulent';
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.spawnAmbientParticles(40);
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setTheme(speciesId) {
    this.speciesTheme = speciesId;
  }

  spawnAmbientParticles(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2, // Gentle rising
        alpha: Math.random() * 0.6 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        angle: Math.random() * Math.PI * 2,
        type: Math.random() > 0.85 ? 'petal' : 'spore'
      });
    }
  }

  triggerBloomCelebration() {
    // Burst of colorful botanical confetti & glowing spores from center
    const originX = this.width / 2;
    const originY = this.height / 2;
    const colors = ['#74c69d', '#52b788', '#fcd34d', '#f4a261', '#f472b6', '#fff'];

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.confetti.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
        gravity: 0.15
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render & update ambient spores/petals
    for (let p of this.particles) {
      p.x += p.vx + Math.sin(p.angle) * 0.3;
      p.y += p.vy;
      p.angle += p.pulseSpeed;
      p.alpha = p.baseAlpha + Math.sin(p.angle) * 0.2;

      // Wrap around edges
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      this.ctx.save();
      if (p.type === 'petal' && this.speciesTheme === 'sakura') {
        // Drifting pink sakura petal
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.angle);
        this.ctx.fillStyle = `rgba(244, 114, 182, ${Math.max(0, p.alpha)})`;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.radius * 2.5, p.radius * 1.5, Math.PI / 4, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Glowing bio-spore / sunbeam pollen
        const color = this.speciesTheme === 'sunflower' ? '252, 211, 77' : '116, 198, 157';
        this.ctx.fillStyle = `rgba(${color}, ${Math.max(0, p.alpha)})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Glow ring
        this.ctx.fillStyle = `rgba(${color}, ${Math.max(0, p.alpha * 0.2)})`;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    // Render & update celebration confetti
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const c = this.confetti[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= 0.98;
      c.rotation += c.rotationSpeed;
      c.alpha -= c.decay;

      if (c.alpha <= 0) {
        this.confetti.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = c.alpha;
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}
