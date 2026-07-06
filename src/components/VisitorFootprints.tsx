import { useEffect, useRef, useState } from "react";
import { getFootprints, markFootprint } from "@/lib/easter-eggs";

const SECTION_IDS = ["hero", "who", "stats", "traits", "mind", "people", "timeline", "philosophy", "learned", "mosaic", "letter", "final"];

export function VisitorFootprints() {
  const [footprints, setFootprints] = useState<string[]>([]);
  useEffect(() => { setFootprints(getFootprints()); }, []);

  useEffect(() => {
    const handlers: { id: string; io: IntersectionObserver }[] = [];

    for (const sectionId of SECTION_IDS) {
      const el = document.getElementById(sectionId);
      if (!el) continue;

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const updated = markFootprint(sectionId);
              setFootprints(updated);
            }
          }
        },
        { threshold: 0.1 }
      );
      io.observe(el);
      handlers.push({ id: sectionId, io });
    }

    return () => handlers.forEach((h) => h.io.disconnect());
  }, []);

  if (footprints.length === 0) return null;

  return (
    <>
      {footprints.map((id, i) => (
        <div
          key={id}
          className="visitor-footprint"
          style={{
            left: `${20 + (i * 37) % 60}%`,
            top: `${30 + (i * 53) % 50}%`,
            opacity: 0.03 + (i / SECTION_IDS.length) * 0.07,
            animationDelay: `${i * 0.5}s`,
          }}
          aria-hidden
        />
      ))}
      <style>{`
        .visitor-footprint {
          position: fixed;
          width: 16px;
          height: 24px;
          border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
          border: 1px solid rgba(255,255,255,0.15);
          pointer-events: none;
          z-index: 1;
          animation: footprint-glow 4s ease-in-out infinite;
        }
        @keyframes footprint-glow {
          0%, 100% { opacity: 0.03; transform: scale(1); }
          50% { opacity: 0.08; transform: scale(1.1); }
        }
      `}</style>
    </>
  );
}
