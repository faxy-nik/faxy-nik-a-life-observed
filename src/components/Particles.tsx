import { useEffect, useRef } from "react";

const CONSTELLATION_SHAPES: { x: number; y: number }[][] = [
  [{ x: 0.4, y: 0.2 }, { x: 0.45, y: 0.15 }, { x: 0.55, y: 0.2 }, { x: 0.5, y: 0.3 }, { x: 0.4, y: 0.25 }],
  [{ x: 0.6, y: 0.6 }, { x: 0.65, y: 0.5 }, { x: 0.75, y: 0.55 }, { x: 0.7, y: 0.65 }],
  [{ x: 0.2, y: 0.7 }, { x: 0.3, y: 0.65 }, { x: 0.25, y: 0.8 }],
  [{ x: 0.8, y: 0.2 }, { x: 0.85, y: 0.15 }, { x: 0.9, y: 0.25 }, { x: 0.82, y: 0.3 }],
  [{ x: 0.35, y: 0.5 }, { x: 0.45, y: 0.45 }, { x: 0.55, y: 0.5 }, { x: 0.45, y: 0.58 }],
];

export function Particles({ density = 80, speed = 1, lateNight = false }: { density?: number; speed?: number; lateNight?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let mx = -1000, my = -1000;
    let frame = 0;
    let constellationPhase = 0;
    let visible = true;

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouse);

    const adjustedDensity = lateNight ? Math.floor(density * 0.7) : Math.min(density, 30);
    const adjustedSpeed = lateNight ? speed * 0.6 : speed;

    const particles = Array.from({ length: adjustedDensity }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.5 + 0.2, pa: Math.random() * Math.PI * 2,
      baseA: Math.random() * 0.5 + 0.2,
    }));

    const CONNECTION_DIST = 120;
    const MOUSE_RADIUS = 180;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      frame++;
      if (frame % 2 !== 0) return;
      const effectiveSpeed = lateNight ? Math.max(1, Math.floor(adjustedSpeed)) : speed;
      if (frame % effectiveSpeed !== 0) return;

      const globalAlpha = lateNight ? 0.6 : 1;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = globalAlpha;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      constellationPhase += 0.002;
      const shapeAlpha = Math.sin(constellationPhase) * 0.03 + 0.04;
      for (const shape of CONSTELLATION_SHAPES) {
        ctx.beginPath();
        shape.forEach((p, i) => {
          const px = p.x * w; const py = p.y * h;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.strokeStyle = `rgba(255,255,255,${shapeAlpha})`;
        ctx.lineWidth = 0.3; ctx.stroke();
        for (const p of shape) {
          ctx.beginPath();
          ctx.arc(p.x * w, p.y * h, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${shapeAlpha + 0.03})`; ctx.fill();
        }
      }

      for (const p of particles) {
        const dmx = p.x - mx; const dmy = p.y - my;
        const dm = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < MOUSE_RADIUS && dm > 0) {
          const force = (MOUSE_RADIUS - dm) / MOUSE_RADIUS * 0.3;
          p.x += (dmx / dm) * force; p.y += (dmy / dm) * force;
        }
        p.x += p.vx * (lateNight ? 0.5 : 1); p.y += p.vy * (lateNight ? 0.5 : 1);
        p.pa += 0.02;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.pa));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    tick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMouse); };
  }, [density, speed, lateNight]);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
