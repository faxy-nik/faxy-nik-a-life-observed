import { useEffect, useRef } from "react";

const MEMORY_PAINTINGS = [
  { id: "peace", colors: ["#1a2a3a", "#2a4a5a", "#3a5a6a", "#4a6a7a"], title: "The Silent Ride Home" },
  { id: "intimacy", colors: ["#2a1a3a", "#3a2a5a", "#4a3a6a", "#5a4a7a"], title: "3 AM Conversations" },
  { id: "chaos", colors: ["#3a2a1a", "#5a3a2a", "#7a4a3a", "#9a5a4a"], title: "The Group Chat Archive" },
  { id: "hope", colors: ["#1a3a2a", "#2a5a3a", "#3a7a4a", "#4a9a5a"], title: "The Farewell That Wasn't" },
  { id: "joy", colors: ["#3a1a2a", "#5a2a4a", "#7a3a6a", "#9a4a8a"], title: "The Inside Joke Library" },
  { id: "vulnerability", colors: ["#3a1a1a", "#5a2a2a", "#7a3a3a", "#9a4a4a"], title: "The Unsent Drafts" },
  { id: "nostalgia", colors: ["#2a2a1a", "#4a4a2a", "#6a6a3a", "#8a8a4a"], title: "The Shared Playlist" },
  { id: "love", colors: ["#2a1a2a", "#4a2a4a", "#6a3a6a", "#8a4a8a"], title: "The Birthday Countdown" },
  { id: "preservation", colors: ["#1a2a2a", "#2a4a4a", "#3a6a6a", "#4a8a8a"], title: "The Group Photo Archive" },
];

export function AIPaintings({ moodId }: { moodId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const painting = MEMORY_PAINTINGS.find((p) => p.id === moodId);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !painting) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let frame = 0;
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number }[] = [];
    let phase = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 40; i++) {
      const colorIdx = Math.floor(Math.random() * painting.colors.length);
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: painting.colors[colorIdx],
        size: Math.random() * 40 + 10,
      });
    }

    const tick = () => {
      frame++;
      phase += 0.005;
      ctx.fillStyle = "rgba(0,0,0,0.02)";
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -p.size) p.x = w + p.size;
        if (p.x > w + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = h + p.size;
        if (p.y > h + p.size) p.y = -p.size;

        const alpha = 0.15 + 0.1 * Math.sin(phase + p.x * 0.01 + p.y * 0.01);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.03 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [painting]);

  if (!painting) return null;

  return (
    <div className="ai-painting-container">
      <canvas ref={canvasRef} className="ai-painting-canvas" />
      <p className="ai-painting-label">{painting.title}</p>
      <style>{`
        .ai-painting-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .ai-painting-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }
        .ai-painting-label {
          position: absolute;
          bottom: 12px;
          left: 12px;
          font-family: var(--font-mono);
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}

export function getMoodIdForSection(sectionId: string): string {
  const map: Record<string, string> = {
    mosaic: "preservation",
    letter: "love",
    learned: "hope",
    philosophy: "peace",
    people: "intimacy",
    timeline: "nostalgia",
    mind: "vulnerability",
    traits: "chaos",
    stats: "chaos",
    final: "peace",
  };
  return map[sectionId] || "peace";
}
