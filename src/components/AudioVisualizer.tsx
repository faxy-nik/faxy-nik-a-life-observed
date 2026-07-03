import { useMemo } from "react";

export function AudioVisualizer({ barCount = 32 }: { barCount?: number }) {
  const bars = useMemo(
    () => Array.from({ length: barCount }, (_, i) => ({
      delay: i * 0.08,
      height: 20 + Math.random() * 60,
    })),
    [barCount]
  );

  return (
    <div className="flex items-end justify-center gap-[2px] h-20 opacity-40">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="audio-bar"
          style={{
            height: bar.height,
            animationDelay: `${bar.delay}s`,
            animationDuration: `${0.8 + Math.random() * 0.8}s`,
          }}
        />
      ))}
    </div>
  );
}
