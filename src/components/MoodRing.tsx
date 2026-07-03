import { useMemo } from "react";

const MOODS = [
  { label: "Contemplative", color: "oklch(0.6 0.15 280)", size: 120 },
  { label: "Nostalgic", color: "oklch(0.55 0.12 260)", size: 100 },
  { label: "Hopeful", color: "oklch(0.7 0.1 140)", size: 90 },
  { label: "Guarded", color: "oklch(0.4 0.08 300)", size: 80 },
  { label: "Tender", color: "oklch(0.65 0.14 340)", size: 70 },
];

export function MoodRing() {
  const orbs = useMemo(
    () => MOODS.map((m, i) => ({
      ...m,
      x: 50 + (Math.cos(i * 1.26) * 30),
      y: 50 + (Math.sin(i * 1.26) * 30),
      delay: i * 0.5,
    })),
    []
  );

  return (
    <div className="mood-ring w-64 h-64 mx-auto relative">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="mood-ring-orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: orb.color,
            opacity: 0.3,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
      <div className="relative z-10 text-center">
        <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/50">Current Mood</p>
        <p className="serif text-2xl text-white/80 mt-1">Everywhere at once</p>
      </div>
    </div>
  );
}
