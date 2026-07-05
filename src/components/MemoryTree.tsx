import { useEffect, useRef, useState } from "react";
import { getFootprints } from "@/lib/easter-eggs";

const TOTAL_BRANCHES = 12;

const LEAF_COLORS = [
  "rgba(200,220,180,0.4)",
  "rgba(180,200,160,0.3)",
  "rgba(220,200,170,0.35)",
  "rgba(170,190,150,0.25)",
];

export function MemoryTree() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkProgress = () => {
      const footprints = getFootprints();
      const pct = Math.min(1, footprints.length / TOTAL_BRANCHES);
      setProgress(pct);
    };
    checkProgress();
    const iv = setInterval(checkProgress, 2000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    function drawBranch(x: number, y: number, len: number, angle: number, depth: number, maxDepth: number) {
      if (depth > maxDepth || len < 2) return;
      const endX = x + Math.cos(angle) * len;
      const endY = y + Math.sin(angle) * len;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = `rgba(255,255,255,${0.2 - depth * 0.03})`;
      ctx.lineWidth = Math.max(0.5, 3 - depth * 0.3);
      ctx.stroke();

      if (depth >= maxDepth - 1) {
        const leafAlpha = 0.2 + 0.3 * (1 - depth / maxDepth);
        const leafSize = 3 + Math.random() * 2;
        ctx.beginPath();
        ctx.arc(endX, endY, leafSize, 0, Math.PI * 2);
        ctx.fillStyle = LEAF_COLORS[depth % LEAF_COLORS.length];
        ctx.fill();
      }

      const branches = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < branches; i++) {
        const newAngle = angle + (Math.random() - 0.5) * 1.2;
        const newLen = len * (0.6 + Math.random() * 0.15);
        drawBranch(endX, endY, newLen, newAngle, depth + 1, maxDepth);
      }
    }

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      const maxDepth = Math.max(1, Math.floor(progress * 5));
      const trunkLen = 40 + 20 * progress;

      ctx.beginPath();
      ctx.moveTo(w / 2, h);
      ctx.lineTo(w / 2, h - trunkLen);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 2;
      ctx.stroke();

      if (progress > 0.1) {
        drawBranch(w / 2, h - trunkLen, 25 * progress, -Math.PI / 4, 0, maxDepth);
        drawBranch(w / 2, h - trunkLen, 25 * progress, -Math.PI * 3 / 4, 0, maxDepth);
      }

      if (progress > 0.3) {
        drawBranch(w / 2, h - trunkLen * 0.6, 20 * progress, -Math.PI / 3, 1, maxDepth);
        drawBranch(w / 2, h - trunkLen * 0.6, 20 * progress, -Math.PI * 2 / 3, 1, maxDepth);
      }

      if (progress > 0.6) {
        drawBranch(w / 2, h - trunkLen * 0.3, 15 * progress, -Math.PI / 5, 2, maxDepth);
        drawBranch(w / 2, h - trunkLen * 0.3, 15 * progress, -Math.PI * 4 / 5, 2, maxDepth);
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [progress]);

  return (
    <div className="memory-tree" aria-hidden>
      <canvas ref={canvasRef} />
      <style>{`
        .memory-tree {
          position: fixed;
          bottom: 0;
          right: 20px;
          width: 80px;
          height: 150px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.3;
        }
        .memory-tree canvas { width: 100%; height: 100%; display: block; }
      `}</style>
    </div>
  );
}
