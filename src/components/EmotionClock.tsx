import { useEffect, useRef, useState } from "react";
import { EMOTIONAL_STATES } from "@/lib/easter-eggs";

export function EmotionClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState(EMOTIONAL_STATES[0]);
  useEffect(() => {
    const seed = sessionStorage.getItem("faxy-nik-clock");
    if (!seed) { const s = String(Math.floor(Math.random() * EMOTIONAL_STATES.length)); sessionStorage.setItem("faxy-nik-clock", s); }
    setState(EMOTIONAL_STATES[Number(sessionStorage.getItem("faxy-nik-clock") || "0")]);
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

    const stateIndex = EMOTIONAL_STATES.indexOf(state);
    const targetAngle = (stateIndex / EMOTIONAL_STATES.length) * Math.PI * 2 - Math.PI / 2;
    let currentAngle = -Math.PI / 2;

    const tick = () => {
      raf = requestAnimationFrame(tick); frame++;
      if (!visible || frame % 4 !== 0) return;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.35;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 1; ctx.stroke();
      currentAngle += (targetAngle - currentAngle) * 0.05;
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(currentAngle);
      ctx.beginPath(); ctx.moveTo(0, -r + 10); ctx.lineTo(0, r * 0.3);
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
      ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fill();
    };
    tick();
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", resize); };
  }, [state]);

  return (
    <div className="emotion-clock" aria-hidden>
      <canvas ref={canvasRef} />
      <style>{`.emotion-clock{position:fixed;top:100px;right:20px;width:70px;height:70px;pointer-events:none;z-index:2;opacity:0.15}.emotion-clock canvas{width:100%;height:100%;display:block}`}</style>
    </div>
  );
}
