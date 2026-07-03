import { useMemo } from "react";

export function AmbientEqualizer({ barCount = 64 }: { barCount?: number }) {
  const bars = useMemo(
    () => Array.from({ length: barCount }, (_, i) => ({
      height: 8 + Math.random() * 30,
      delay: i * 0.05,
      duration: 1 + Math.random() * 2,
    })),
    [barCount]
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 flex items-end justify-center gap-[1px] pointer-events-none z-[1] opacity-[0.15]" aria-hidden>
      {bars.map((bar, i) => (
        <div
          key={i}
          className="audio-bar"
          style={{
            height: bar.height,
            animationDelay: `${bar.delay}s`,
            animationDuration: `${bar.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
