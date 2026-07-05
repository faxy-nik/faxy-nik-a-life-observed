import { useEffect, useState } from "react";
import { getVisitCount } from "@/lib/easter-eggs";

export function ArchiveAging() {
  const [ageLevel, setAgeLevel] = useState(0);

  useEffect(() => {
    const visits = getVisitCount();
    const level = Math.min(4, Math.floor(visits / 2));
    setAgeLevel(level);

    const style = document.createElement("style");
    const effects: string[] = [];

    if (level >= 1) {
      effects.push(`
        .glass-panel { border-color: rgba(200,180,150,0.08) !important; }
        .grain { opacity: 0.09 !important; }
      `);
    }
    if (level >= 2) {
      effects.push(`
        .stat-card { background: rgba(255,255,255,0.03) !important; }
        .serif { letter-spacing: -0.015em !important; }
      `);
    }
    if (level >= 3) {
      effects.push(`
        .glass-panel { background: rgba(255,255,250,0.03) !important; backdrop-filter: blur(20px) saturate(120%) !important; }
        ::selection { background: rgba(200,180,150,0.15) !important; }
      `);
    }
    if (level >= 4) {
      effects.push(`
        .vignette::before { background: radial-gradient(ellipse at center, transparent 35%, rgba(20,15,10,0.9) 100%) !important; }
        .scroll-progress { background: linear-gradient(90deg, rgba(200,180,150,0.3), rgba(200,180,150,0.6)) !important; }
      `);
    }

    style.textContent = effects.join("\n");
    document.head.appendChild(style);

    const badge = document.createElement("div");
    badge.className = "archive-age-badge";
    badge.textContent = `v${3 + level}.${ageLevel} · archive aged`;
    badge.style.cssText = `
      position: fixed; bottom: 8px; left: 12px;
      z-index: 60; pointer-events: none;
      font-family: var(--font-mono);
      font-size: 6px; text-transform: uppercase;
      letter-spacing: 0.3em;
      color: rgba(255,255,255,0.1);
    `;
    document.body.appendChild(badge);

    return () => {
      document.head.removeChild(style);
      if (badge.parentNode) badge.parentNode.removeChild(badge);
    };
  }, []);

  return null;
}
