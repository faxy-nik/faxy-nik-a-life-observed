import { useEffect, useState } from "react";

const CHAPTERS = [
  { id: "hero", label: "Introduction" },
  { id: "who", label: "Who" },
  { id: "stats", label: "Analysis" },
  { id: "traits", label: "Traits" },
  { id: "mind", label: "Mind" },
  { id: "people", label: "People" },
  { id: "timeline", label: "Timeline" },
  { id: "philosophy", label: "Philosophy" },
  { id: "learned", label: "AI Learning" },
  { id: "mosaic", label: "Memories" },
  { id: "letter", label: "Letter" },
  { id: "final", label: "Finale" },
];

export function ChapterNav() {
  const [active, setActive] = useState("hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
      const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
      let current = "hero";
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) {
          current = s.id;
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-[110] flex flex-col gap-3 items-end">
      {CHAPTERS.map((ch) => (
        <button
          key={ch.id}
          onClick={() => document.getElementById(ch.id)?.scrollIntoView({ behavior: "smooth" })}
          className="group flex items-center gap-3"
          title={ch.label}
        >
          <span className="mono text-[9px] uppercase tracking-[0.2em] text-white/0 group-hover:text-white/60 transition-colors duration-300 whitespace-nowrap">
            {ch.label}
          </span>
          <span className={`chapter-nav-dot ${active === ch.id ? "active" : ""}`} />
        </button>
      ))}
    </nav>
  );
}
