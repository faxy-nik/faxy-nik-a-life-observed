import { useEffect, useRef, useState } from "react";
import { getVisitCount, getFoundFragments } from "@/lib/easter-eggs";

export function CursorEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [evolved, setEvolved] = useState(false);
  useEffect(() => {
    const visits = getVisitCount(); const fragments = getFoundFragments();
    setEvolved(visits > 1 || fragments.length > 0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, w = 0, h = 0, mx = -100, my = -100, prevMx = -100, prevMy = -100;
    let hesitating = false, frame = 0, lastMove = 0;
    let particles: { x: number; y: number; life: number; maxLife: number; size: number }[] = [];

    const resize = () => { w = window.innerWidth; h = window.innerHeight; canvas.width = w; canvas.height = h; };
    resize(); window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      prevMx = mx; prevMy = my; mx = e.clientX; my = e.clientY; lastMove = Date.now();
      if (evolved) {
        const speed = Math.hypot(mx - prevMx, my - prevMy);
        if (speed > 0.5 && Math.random() > 0.7) particles.push({ x: mx + (Math.random() - 0.5) * 4, y: my + (Math.random() - 0.5) * 4, life: 0, maxLife: 20 + Math.random() * 30, size: 1 + Math.random() * 1.5 });
      }
      if (!hesitating && Math.random() > 0.998) { hesitating = true; setTimeout(() => { hesitating = false; }, 400); }
    };
    window.addEventListener("mousemove", onMouse);

    const tick = () => {
      raf = requestAnimationFrame(tick); frame++;
      if (frame % 4 !== 0) return;
      if (Date.now() - lastMove > 2000) return;
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath(); ctx.arc(mx, my, hesitating ? 3 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${hesitating ? 0.3 : 0.6})`; ctx.fill();
      if (evolved) {
        if (particles.length > 50) particles = particles.slice(-50);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]; p.life++; p.y -= 0.2; p.x += (Math.random() - 0.5) * 0.3;
          const a = Math.max(0, 1 - p.life / p.maxLife);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${a * 0.3})`; ctx.fill();
          if (p.life >= p.maxLife) particles.splice(i, 1);
        }
      }
    };
    tick();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMouse); };
  }, [evolved]);

  return (
    <>
      <style>{`*{cursor:none!important}.cursor-overlay{position:fixed;inset:0;pointer-events:none;z-index:9999;}`}</style>
      <canvas ref={canvasRef} className="cursor-overlay" />
    </>
  );
}
