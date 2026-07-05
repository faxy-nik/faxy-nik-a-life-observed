import { useEffect, useRef, useState } from "react";

type Weather = "sunrise" | "day" | "sunset" | "night" | "rain" | "cloudy" | "storm";

function getWeatherByHour(hour: number): Weather {
  if (hour >= 5 && hour < 8) return "sunrise";
  if (hour >= 8 && hour < 17) return Math.random() > 0.6 ? "cloudy" : "day";
  if (hour >= 17 && hour < 20) return "sunset";
  if (hour >= 20 || hour < 5) {
    const r = Math.random();
    if (r < 0.5) return "night";
    if (r < 0.75) return "rain";
    return "storm";
  }
  return "day";
}

const BIRDS = [
  "M0,10 Q5,2 10,10 Q15,18 20,10",
  "M30,15 Q35,7 40,15 Q45,23 50,15",
  "M60,8 Q65,0 70,8 Q75,16 80,8",
];

const CLOUDS = [
  { x: 10, y: 10, w: 40, h: 8 },
  { x: 40, y: 20, w: 50, h: 6 },
  { x: 65, y: 5, w: 30, h: 7 },
];

const STARS = Array.from({ length: 30 }, () => ({ x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 1.5 + 0.5 }));

export function WeatherWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [weather] = useState<Weather>(() => getWeatherByHour(new Date().getHours()));
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raindrops: { x: number; y: number; speed: number; len: number }[] = [];
    let birdOffset = 0;
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

    if (weather === "rain" || weather === "storm") {
      raindrops = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: 4 + Math.random() * 6,
        len: 10 + Math.random() * 15,
      }));
    }

    const drawScene = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, w, h);

      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      switch (weather) {
        case "sunrise": gradient.addColorStop(0, "#1a1a2e"); gradient.addColorStop(0.5, "#e2725b"); gradient.addColorStop(1, "#f4a261"); break;
        case "day": gradient.addColorStop(0, "#87CEEB"); gradient.addColorStop(1, "#B0E0E6"); break;
        case "sunset": gradient.addColorStop(0, "#2d1b3d"); gradient.addColorStop(0.5, "#c76b4a"); gradient.addColorStop(1, "#e8a87c"); break;
        case "night": gradient.addColorStop(0, "#0a0a1a"); gradient.addColorStop(1, "#1a1a2e"); break;
        case "rain": gradient.addColorStop(0, "#4a4a5a"); gradient.addColorStop(1, "#2a2a3a"); break;
        case "cloudy": gradient.addColorStop(0, "#b0b0b0"); gradient.addColorStop(1, "#d0d0c0"); break;
        case "storm": gradient.addColorStop(0, "#1a1a2a"); gradient.addColorStop(1, "#2a2a3a"); break;
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      if (weather === "night" || weather === "storm") {
        for (const star of STARS) {
          ctx.beginPath();
          ctx.arc((star.x / 100) * w, (star.y / 100) * h, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(frameRef.current * 0.02 + star.x) * 0.2})`;
          ctx.fill();
        }
      }

      if (weather === "sunrise") {
        const sunY = h * 0.7;
        ctx.beginPath();
        ctx.arc(w * 0.5, sunY, 25, 0, Math.PI * 2);
        ctx.fillStyle = "#f4a261";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(w * 0.5, sunY + 5, 30, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(244,162,97,0.15)";
        ctx.fill();
      }

      if (weather === "day" || weather === "sunset" || weather === "cloudy") {
        cloudOffset = (cloudOffset + 0.2) % (w * 2);
        for (const cloud of CLOUDS) {
          const cx = ((cloud.x / 100) * w + cloudOffset) % (w + 100) - 50;
          ctx.beginPath();
          ctx.ellipse(cx, (cloud.y / 100) * h, cloud.w, cloud.h, 0, 0, Math.PI * 2);
          ctx.fillStyle = weather === "sunset" ? "rgba(232,168,124,0.2)" : "rgba(255,255,255,0.15)";
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(cx + 15, (cloud.y / 100) * h - 3, cloud.w * 0.7, cloud.h * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (weather === "day" || weather === "sunset") {
        birdOffset = (birdOffset + 0.5) % (w * 2);
        for (let i = 0; i < BIRDS.length; i++) {
          const bx = (birdOffset + i * 80) % (w * 2) - 50;
          const by = 15 + i * 12;
          ctx.beginPath();
          const pathData = BIRDS[i].split(" ");
          const points = pathData.map((s) => {
            const parts = s.split(",");
            return { x: parseFloat(parts[0].replace(/[MQ]/g, "")), y: parseFloat(parts[1]) };
          });
          ctx.moveTo(bx + points[0].x, by + points[0].y);
          for (let j = 1; j < points.length; j += 2) {
            if (points[j + 1]) {
              ctx.quadraticCurveTo(bx + points[j].x, by + points[j].y, bx + points[j + 1].x, by + points[j + 1].y);
            }
          }
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      if (weather === "rain" || weather === "storm") {
        for (const drop of raindrops) {
          drop.y += drop.speed * (weather === "storm" ? 1.8 : 1);
          drop.x += weather === "storm" ? Math.sin(frameRef.current * 0.02 + drop.y * 0.01) * 2 : 0;
          if (drop.y > h) { drop.y = -drop.len; drop.x = Math.random() * w; }
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 1, drop.y + drop.len);
          ctx.strokeStyle = `rgba(200,200,255,${weather === "storm" ? 0.5 : 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      if (weather === "storm") {
        for (let i = 0; i < 3; i++) {
          if (Math.random() > 0.98) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * w, 0);
            ctx.lineTo(Math.random() * w + 20, h * 0.3 + Math.random() * h * 0.2);
            ctx.strokeStyle = `rgba(255,255,200,${0.2 + Math.random() * 0.3})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(drawScene);
    };

    drawScene();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [weather]);

  return (
    <div className="weather-window" aria-hidden>
      <canvas ref={canvasRef} />
      <style>{`
        .weather-window {
          position: fixed;
          bottom: 80px;
          right: 40px;
          width: 180px;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          z-index: 2;
          opacity: 0.15;
          transition: opacity 2s;
          pointer-events: none;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .weather-window::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 12px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
          z-index: 1;
        }
        .weather-window canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
        .weather-window:hover { opacity: 0.3; }
      `}</style>
    </div>
  );
}
