import { useEffect, useRef } from "react";

type Shadow = { x: number; y: number; speed: number; direction: number; height: number; opacity: number; };

export function Shadows() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, w = 0, h = 0, frame = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);
    const dpr = 1;

    const shadows: Shadow[] = Array.from({ length: 3 }, () => ({
      x: Math.random() * window.innerWidth, y: 0, speed: 0.1 + Math.random() * 0.12,
      direction: Math.random() > 0.5 ? 1 : -1, height: 25 + Math.random() * 30, opacity: 0.015 + Math.random() * 0.02,
    }));

    const resize = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr); };
    resize(); window.addEventListener("resize", resize);

    const tick = () => {
      raf = requestAnimationFrame(tick); frame++;
      if (!visible || frame % 4 !== 0) return;
      ctx.clearRect(0, 0, w, h);
      for (const s of shadows) {
        s.x += s.speed * s.direction;
        s.y = h * 0.7 + Math.sin(frame * 0.003 + s.x * 0.01) * 10;
        if (s.x < -50) s.x = w + 50; if (s.x > w + 50) s.x = -50;
        ctx.beginPath(); ctx.ellipse(s.x, s.y, 3, 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`; ctx.fill();
        ctx.beginPath(); ctx.moveTo(s.x - 8, s.y - 2); ctx.lineTo(s.x, s.y - s.height); ctx.lineTo(s.x + 8, s.y - 2);
        ctx.strokeStyle = `rgba(255,255,255,${s.opacity * 0.5})`; ctx.lineWidth = 1.5; ctx.stroke();
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="shadows-canvas" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, opacity: 0.3 }} />;
}
