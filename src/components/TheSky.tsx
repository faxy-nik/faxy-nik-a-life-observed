import { useEffect, useRef, useMemo } from "react";

function seededRandom(seed: number) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

export function TheSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seed = useMemo(() => { const t = new Date(); return t.getFullYear() * 10000 + (t.getMonth() + 1) * 100 + t.getDate(); }, []);
  const skyState = useMemo(() => {
    const rng = seededRandom(seed);
    return {
      stars: Array.from({ length: 40 }, () => ({ x: rng() * 100, y: rng() * 40, size: rng() * 1.5 + 0.5, brightness: rng() * 0.5 + 0.3 })),
      constellations: Array.from({ length: 3 }, () => ({ points: Array.from({ length: 4 + Math.floor(rng() * 3) }, () => ({ x: rng() * 80 + 10, y: rng() * 30 + 5 })) })),
      clouds: Array.from({ length: Math.floor(rng() * 3) + 2 }, () => ({ x: rng() * 100, y: rng() * 12 + 2, w: rng() * 12 + 8, h: rng() * 3 + 2, speed: rng() * 0.2 + 0.05 })),
      moonPhase: rng(),
    };
  }, [seed]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, w = 0, h = 0, frame = 0, cloudOffset = 0;
    const dpr = 1;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    const resize = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr); };
    resize(); window.addEventListener("resize", resize);

    const tick = () => {
      raf = requestAnimationFrame(tick); frame++;
      if (!visible || frame % 3 !== 0) return;
      ctx.clearRect(0, 0, w, h);
      const hour = new Date().getHours();
      const isNight = hour >= 19 || hour < 6;
      ctx.fillStyle = isNight ? "#0a0a12" : "#0a0a18";
      ctx.fillRect(0, 0, w, h);
      if (isNight) {
        for (const s of skyState.stars) {
          const x = s.x / 100 * w, y = s.y / 100 * h;
          ctx.beginPath(); ctx.arc(x, y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${s.brightness * (0.5 + 0.5 * Math.sin(frame * 0.02 + s.x * 10))})`;
          ctx.fill();
        }
        for (const c of skyState.constellations) {
          ctx.beginPath();
          c.points.forEach((p, i) => { const px = p.x / 100 * w, py = p.y / 100 * h; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); });
          ctx.strokeStyle = `rgba(255,255,255,0.03)`; ctx.lineWidth = 0.5; ctx.stroke();
          for (const p of c.points) { ctx.beginPath(); ctx.arc(p.x / 100 * w, p.y / 100 * h, 1.2, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fill(); }
        }
      }
      cloudOffset = (cloudOffset + 0.05) % (w * 2);
      for (const c of skyState.clouds) {
        const cx = (c.x / 100 * w + cloudOffset * c.speed) % (w + 100) - 50;
        ctx.beginPath(); ctx.ellipse(cx, c.y / 100 * h, c.w, c.h, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,200,220,0.03)`; ctx.fill();
      }
      if (isNight && skyState.moonPhase > 0.3) {
        ctx.beginPath(); ctx.arc(w * 0.8, h * 0.1, 10, 0, Math.PI * 2); ctx.fillStyle = "rgba(200,200,220,0.08)"; ctx.fill();
        ctx.beginPath(); ctx.arc(w * 0.8 - 2, h * 0.1 - 1, 9, 0, Math.PI * 2); ctx.fillStyle = "#0a0a12"; ctx.fill();
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); };
  }, [skyState]);

  return (
    <div className="the-sky" aria-hidden>
      <canvas ref={canvasRef} />
      <style>{`.the-sky{position:fixed;top:0;left:0;width:100%;height:30vh;pointer-events:none;z-index:0;opacity:0.3}.the-sky canvas{width:100%;height:100%;display:block}`}</style>
    </div>
  );
}
