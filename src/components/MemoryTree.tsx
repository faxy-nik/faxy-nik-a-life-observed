import { useEffect, useRef, useState } from "react";
import { getFootprints } from "@/lib/easter-eggs";

export function MemoryTree() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const check = () => { setProgress(Math.min(1, getFootprints().length / 12)); };
    check(); const iv = setInterval(check, 5000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0, w = 0, h = 0, frame = 0;
    const dpr = 1;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    const resize = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr); };
    resize(); window.addEventListener("resize", resize);

    function drawBranch(x: number, y: number, len: number, angle: number, depth: number, maxD: number) {
      if (depth > maxD || len < 2) return;
      const ex = x + Math.cos(angle) * len, ey = y + Math.sin(angle) * len;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey);
      ctx.strokeStyle = `rgba(255,255,255,${0.15 - depth * 0.02})`; ctx.lineWidth = Math.max(0.5, 2 - depth * 0.2); ctx.stroke();
      if (depth >= maxD - 1) { ctx.beginPath(); ctx.arc(ex, ey, 2 + Math.random() * 1.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(200,220,180,${0.2 - depth * 0.03})`; ctx.fill(); }
      const branches = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < branches; i++) drawBranch(ex, ey, len * (0.6 + Math.random() * 0.1), angle + (Math.random() - 0.5) * 1.0, depth + 1, maxD);
    }

    const tick = () => {
      raf = requestAnimationFrame(tick); frame++;
      if (!visible || frame % 6 !== 0) return;
      ctx.clearRect(0, 0, w, h);
      const maxDepth = Math.max(1, Math.floor(progress * 4));
      const trunkLen = 30 + 15 * progress;
      ctx.beginPath(); ctx.moveTo(w / 2, h); ctx.lineTo(w / 2, h - trunkLen);
      ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1.5; ctx.stroke();
      if (progress > 0.1) { drawBranch(w / 2, h - trunkLen, 18 * progress, -Math.PI / 4, 0, maxDepth); drawBranch(w / 2, h - trunkLen, 18 * progress, -Math.PI * 3 / 4, 0, maxDepth); }
      if (progress > 0.3) { drawBranch(w / 2, h - trunkLen * 0.6, 14 * progress, -Math.PI / 3, 1, maxDepth); drawBranch(w / 2, h - trunkLen * 0.6, 14 * progress, -Math.PI * 2 / 3, 1, maxDepth); }
    };
    tick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); };
  }, [progress]);

  return (
    <div className="memory-tree" aria-hidden>
      <canvas ref={canvasRef} />
      <style>{`.memory-tree{position:fixed;bottom:0;right:10px;width:60px;height:120px;pointer-events:none;z-index:2;opacity:0.2}.memory-tree canvas{width:100%;height:100%;display:block}`}</style>
    </div>
  );
}
