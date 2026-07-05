import { useEffect, useRef } from "react";

export function AmbientLights() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<{ id: string; mood: "warm" | "cool" | "dim" | "bright" }[]>([
    { id: "hero", mood: "dim" },
    { id: "who", mood: "warm" },
    { id: "stats", mood: "cool" },
    { id: "traits", mood: "bright" },
    { id: "mind", mood: "dim" },
    { id: "people", mood: "warm" },
    { id: "timeline", mood: "bright" },
    { id: "philosophy", mood: "cool" },
    { id: "learned", mood: "warm" },
    { id: "letter", mood: "warm" },
    { id: "final", mood: "dim" },
  ]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const observers: IntersectionObserver[] = [];

    for (const section of sectionsRef.current) {
      const el = document.getElementById(section.id);
      if (!el) continue;
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const colors: Record<string, string> = {
                warm: "rgba(255,200,150,0.03)",
                cool: "rgba(150,200,255,0.03)",
                dim: "rgba(0,0,0,0.1)",
                bright: "rgba(255,255,255,0.03)",
              };
              overlay.style.background = colors[section.mood] || "transparent";
            }
          }
        },
        { threshold: 0.3 }
      );
      io.observe(el);
      observers.push(io);
    }

    return () => observers.forEach((io) => io.disconnect());
  }, []);

  return (
    <div
      ref={overlayRef}
      className="ambient-lights"
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        transition: "background 2s ease-in-out",
      }}
    />
  );
}
