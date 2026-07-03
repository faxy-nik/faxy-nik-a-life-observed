import { useEffect, useState } from "react";

const WORDS = [
  "empathy", "memory", "silence", "presence", "trust",
  "connection", "gentleness", "observation", "loyalty", "warmth",
  "patience", "honesty", "curiosity", "devotion", "constellation",
];

export function FloatingWords() {
  const [visible, setVisible] = useState<{ word: string; x: number; y: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    const items = Array.from({ length: 8 }, () => ({
      word: WORDS[Math.floor(Math.random() * WORDS.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 20,
    }));
    setVisible(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden>
      {visible.map((item, i) => (
        <span
          key={i}
          className="absolute mono text-[10px] uppercase tracking-[0.4em] text-white/[0.04] whitespace-nowrap"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animation: `parallax-drift ${item.duration}s ease-in-out infinite`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.word}
        </span>
      ))}
    </div>
  );
}
