import { useEffect, useRef } from "react";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = Math.floor(canvas.width / 14);
    const drops: number[] = Array.from({ length: cols }, () => Math.random() * -100);
    const chars = "01";

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "13px 'JetBrains Mono', monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];

        const y = drops[i] * 14;
        const alpha = Math.max(0, 1 - (y / canvas.height) * 2);

        if (alpha <= 0.01 || y < 0) {
          drops[i] += 0.5 + Math.random() * 0.5;
          continue;
        }

        const brightness = Math.floor(180 + Math.random() * 75);
        const isHead = Math.random() < 0.004;

        ctx.fillStyle = isHead
          ? `rgba(200, 255, 200, 0.9)`
          : `rgba(${brightness}, ${brightness}, ${brightness}, ${alpha * 0.6})`;
        ctx.fillText(char, i * 14, y);

        if (Math.random() < 0.005) {
          ctx.fillStyle = `rgba(180, 180, 180, ${alpha * 0.3})`;
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 14, y - 14);
        }

        drops[i] += 0.5 + Math.random() * 0.5;
      }

      requestAnimationFrame(draw);
    };

    const id = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
