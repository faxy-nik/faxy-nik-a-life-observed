import { useMemo, useRef, useEffect, useState } from "react";

interface DepthIndicatorProps {
  sections: { id: string; label: string; depth: number }[];
}

export function DepthIndicator({ sections }: DepthIndicatorProps) {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? window.scrollY / h : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIdx = useMemo(() => {
    const idx = Math.floor(scrollPct * sections.length);
    return Math.min(idx, sections.length - 1);
  }, [scrollPct, sections.length]);

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[110] hidden lg:flex flex-col items-center gap-1">
      <div className="relative h-48 w-px bg-white/10">
        <div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-white/40 to-white/20 transition-all duration-300"
          style={{ height: `${scrollPct * 100}%` }}
        />
      </div>
      <div className="mono text-[8px] uppercase tracking-[0.3em] text-white/30 mt-2 writing-vertical">
        {sections[activeIdx]?.label || ""}
      </div>
    </div>
  );
}
