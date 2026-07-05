import { useEffect, useState, useRef, useCallback } from "react";

const PHILOSOPHICAL_THOUGHTS = [
  "People are not what they say. They are what they remember about you.",
  "Memory is a form of love that outlives attention.",
  "You do not lose people. You lose the version of yourself that only existed near them.",
  "Silence between two people is a language most never learn to read.",
  "Kindness is not softness. It is the discipline of noticing.",
  "The measure of a person is not what they achieve. It is what they make others feel.",
  "Time does not heal everything. But it teaches you which wounds to carry gently.",
  "The deepest connections are built not in words, but in the spaces between them.",
  "He does not collect memories. He curates them.",
  "Some humans leave footprints. He left chapters.",
  "He was never collecting memories. He was making sure nobody he loved was ever forgotten.",
  "Curiosity is how memories survive.",
  "Not romance. Something rarer. Recognition.",
  "The rarest ending: no ending at all.",
  "He remembered before you did.",
];

export function PhilosophyMode() {
  const [active, setActive] = useState(false);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "p" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setActive((a) => !a);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!active || !particlesRef.current) return;
    const canvas = particlesRef.current;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      a: Math.random() * 0.3 + 0.1,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <div
      className={`fixed inset-0 z-[180] transition-all duration-[2000ms] ${
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <canvas ref={particlesRef} className="absolute inset-0 w-full h-full bg-black" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="max-w-4xl w-full px-8 text-center space-y-8">
          {PHILOSOPHICAL_THOUGHTS.map((thought, i) => (
            <p
              key={i}
              className="serif italic text-white/70 text-xl md:text-3xl leading-relaxed"
              style={{
                opacity: active ? 0.3 + Math.random() * 0.5 : 0,
                animation: active ? `float-up ${6 + Math.random() * 4}s ease-in-out infinite` : "none",
                animationDelay: `${i * 0.8}s`,
              }}
            >
              "{thought}"
            </p>
          ))}
          <p
            className="mono text-[10px] uppercase tracking-[0.3em] text-white/20 pt-12"
            style={{ opacity: active ? 0.5 : 0 }}
          >
            Press P to return
          </p>
        </div>
      </div>
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0); opacity: 0.3; }
          50% { transform: translateY(-10px); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
