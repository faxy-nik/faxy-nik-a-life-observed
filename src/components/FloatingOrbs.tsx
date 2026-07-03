import { useMemo } from "react";

interface Orb {
  size: number;
  x: string;
  y: string;
  color: string;
  duration: string;
  delay: string;
}

export function FloatingOrbs({ count = 5 }: { count?: number }) {
  const orbs = useMemo<Orb[]>(() => {
    const colors = [
      "oklch(1 0 0 / 0.04)",
      "oklch(1 0 0 / 0.03)",
      "oklch(1 0 0 / 0.05)",
      "oklch(1 0 0 / 0.025)",
      "oklch(1 0 0 / 0.035)",
    ];
    return Array.from({ length: count }, (_, i) => ({
      size: 200 + Math.random() * 400,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      color: colors[i % colors.length],
      duration: `${18 + Math.random() * 14}s`,
      delay: `${i * 2}s`,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="floating-orb"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color}, transparent)`,
            ["--orb-duration" as string]: orb.duration,
            ["--orb-delay" as string]: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
