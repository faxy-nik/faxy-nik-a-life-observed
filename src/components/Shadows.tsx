import { useEffect, useRef } from "react";

type Shadow = {
  x: number;
  y: number;
  speed: number;
  direction: number;
  height: number;
  opacity: number;
};

export function Shadows() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const shadows: Shadow[] = Array.from({ length: 4 }, () => ({
      x: Math.random() * window.innerWidth,
      y: 0,
      speed: 0.15 + Math.random() * 0.2,
      direction: Math.random() > 0.5 ? 1 : -1,
      height: 30 + Math.random() * 40,
      opacity: 0.02 + Math.random() * 0.03,
    }));

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      for (const s of shadows) {
        s.x += s.speed * s.direction;
        s.y = h * 0.7 + Math.sin(frame * 0.003 + s.x * 0.01) * 10;

        if (s.x < -50) s.x = w + 50;
        if (s.x > w + 50) s.x = -50;

        ctx.beginPath();
        const headY = s.y - s.height;
        ctx.ellipse(s.x, s.y, 3, 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(s.x - 8, s.y - 2);
        ctx.lineTo(s.x, headY);
        ctx.lineTo(s.x + 8, s.y - 2);
        ctx.strokeStyle = `rgba(255,255,255,${s.opacity * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(s.x - 5, headY + 5);
        ctx.lineTo(s.x + 5, headY + 5);
        ctx.strokeStyle = `rgba(255,255,255,${s.opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="shadows-canvas"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.5,
      }}
    />
  );
}
