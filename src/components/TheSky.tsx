import { useEffect, useRef, useMemo } from "react";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function TheSky() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const seed = useMemo(() => {
    const today = new Date();
    return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  }, []);

  const skyState = useMemo(() => {
    const rng = seededRandom(seed);
    const hour = new Date().getHours();
    return {
      moonPhase: rng(),
      starCount: Math.floor(rng() * 40) + 30,
      cloudCover: rng(),
      constellationCount: Math.floor(rng() * 3) + 2,
      stars: Array.from({ length: 60 }, () => ({
        x: rng() * 100, y: rng() * 40,
        size: rng() * 1.5 + 0.5, brightness: rng() * 0.5 + 0.3,
      })),
      constellations: Array.from({ length: 4 }, () => ({
        points: Array.from({ length: 4 + Math.floor(rng() * 3) }, () => ({
          x: rng() * 80 + 10, y: rng() * 30 + 5,
        })),
      })),
      clouds: Array.from({ length: Math.floor(rng() * 4) + 2 }, () => ({
        x: rng() * 100, y: rng() * 15 + 2, w: rng() * 15 + 10, h: rng() * 4 + 3, speed: rng() * 0.3 + 0.1,
      })),
    };
  }, [seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cloudOffset = 0;

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

      const hour = new Date().getHours();
      const isNight = hour >= 19 || hour < 6;
      const isDawn = hour >= 5 && hour < 7;
      const isDusk = hour >= 17 && hour < 19;

      let bgColor = "#0a0a12";
      if (isDawn) bgColor = "#1a1520";
      else if (isDusk) bgColor = "#1a1220";
      else if (!isNight) bgColor = "#0a0a18";

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      if (isNight || isDawn || isDusk) {
        for (const star of skyState.stars) {
          const starX = (star.x / 100) * w;
          const starY = (star.y / 100) * h;
          ctx.beginPath();
          ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
          const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.02 + star.x * 10);
          ctx.fillStyle = `rgba(255,255,255,${star.brightness * twinkle})`;
          ctx.fill();
        }

        for (const constellation of skyState.constellations) {
          ctx.beginPath();
          constellation.points.forEach((p, i) => {
            const px = (p.x / 100) * w;
            const py = (p.y / 100) * h;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.strokeStyle = `rgba(255,255,255,${0.03 + 0.03 * Math.sin(frame * 0.005)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          for (const p of constellation.points) {
            ctx.beginPath();
            ctx.arc((p.x / 100) * w, (p.y / 100) * h, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.05)";
            ctx.fill();
          }
        }
      }

      if (skyState.cloudCover > 0.3) {
        cloudOffset = (cloudOffset + 0.1) % (w * 2);
        for (const cloud of skyState.clouds) {
          const cx = ((cloud.x / 100) * w + cloudOffset * cloud.speed) % (w + 100) - 50;
          ctx.beginPath();
          ctx.ellipse(cx, (cloud.y / 100) * h, cloud.w, cloud.h, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,200,220,${0.03 + 0.02 * Math.sin(frame * 0.005 + cloud.x)})`;
          ctx.fill();
        }
      }

      if (isNight && skyState.moonPhase > 0.3) {
        ctx.beginPath();
        ctx.arc(w * 0.8, h * 0.1, 12, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,200,220,${0.1 + 0.05 * Math.sin(frame * 0.01)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w * 0.8 - 3, h * 0.1 - 2, 11, 0, Math.PI * 2);
        ctx.fillStyle = bgColor;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [skyState]);

  return (
    <div className="the-sky" aria-hidden>
      <canvas ref={canvasRef} />
      <style>{`
        .the-sky {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 40vh;
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }
        .the-sky canvas { width: 100%; height: 100%; display: block; }
      `}</style>
    </div>
  );
}
