import { useEffect, useRef, useMemo } from "react";
import { EMOTIONAL_STATES } from "@/lib/easter-eggs";

export function EmotionClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const state = useMemo(() => {
    const visitSeed = Number(sessionStorage.getItem("faxy-nik-clock") || "0");
    if (!visitSeed) {
      const s = Math.floor(Math.random() * EMOTIONAL_STATES.length);
      sessionStorage.setItem("faxy-nik-clock", String(s));
    }
    const idx = Number(sessionStorage.getItem("faxy-nik-clock") || "0");
    return EMOTIONAL_STATES[idx];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const stateIndex = EMOTIONAL_STATES.indexOf(state);
    const angle = (stateIndex / EMOTIONAL_STATES.length) * Math.PI * 2 - Math.PI / 2;
    let currentAngle = -Math.PI / 2;
    const targetAngle = angle;

    let frame = 0;

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.38;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 4;
      ctx.stroke();

      for (let i = 0; i < EMOTIONAL_STATES.length; i++) {
        const a = (i / EMOTIONAL_STATES.length) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * (r - 8), cy + Math.sin(a) * (r - 8));
        ctx.lineTo(cx + Math.cos(a) * (r + 5), cy + Math.sin(a) * (r + 5));
        ctx.strokeStyle = i === stateIndex ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)";
        ctx.lineWidth = i === stateIndex ? 1.5 : 0.5;
        ctx.stroke();

        const labelAngle = a;
        const labelR = r - 14;
        ctx.save();
        ctx.translate(cx + Math.cos(labelAngle) * labelR, cy + Math.sin(labelAngle) * labelR);
        ctx.rotate(a + Math.PI / 2);
        ctx.fillStyle = i === stateIndex ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)";
        ctx.font = "6px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(EMOTIONAL_STATES[i], 0, 0);
        ctx.restore();
      }

      currentAngle += (targetAngle - currentAngle) * 0.02;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(currentAngle);
      ctx.beginPath();
      ctx.moveTo(0, -r + 12);
      ctx.lineTo(0, r * 0.3);
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, r * 0.15, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fill();

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [state]);

  return (
    <div className="emotion-clock" aria-hidden>
      <canvas ref={canvasRef} />
      <style>{`
        .emotion-clock {
          position: fixed;
          top: 120px;
          right: 30px;
          width: 100px;
          height: 100px;
          pointer-events: none;
          z-index: 2;
          opacity: 0.2;
          transition: opacity 1s;
        }
        .emotion-clock:hover { opacity: 0.5; }
        .emotion-clock canvas { width: 100%; height: 100%; display: block; }
      `}</style>
    </div>
  );
}
