import { useEffect, useRef, useState } from "react";
import { getTimeAwareness } from "@/lib/easter-eggs";

export function GlobalColorGrading() {
  const [timeOfDay] = useState(() => getTimeAwareness().timeOfDay);

  useEffect(() => {
    const style = document.createElement("style");
    const grades: Record<string, string> = {
      dawn: `
        html { filter: sepia(0.15) hue-rotate(-5deg) brightness(1.05); }
      `,
      morning: `
        html { filter: none; }
      `,
      afternoon: `
        html { filter: brightness(1.08) contrast(1.02); }
      `,
      evening: `
        html { filter: sepia(0.2) hue-rotate(10deg) brightness(0.95); }
      `,
      night: `
        html { filter: brightness(0.9) contrast(0.95) sepia(0.05); }
      `,
      deepnight: `
        html { filter: brightness(0.8) contrast(0.9) saturate(0.7) hue-rotate(5deg); }
        .vignette::before { background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,20,0.9) 100%) !important; }
      `,
    };
    style.textContent = `
      html { transition: filter 4s ease-in-out; }
      ${grades[timeOfDay] || ""}
      .global-time-indicator {
        position: fixed;
        top: 8px;
        right: 12px;
        z-index: 60;
        font-family: var(--font-mono);
        font-size: 7px;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: rgba(255,255,255,0.15);
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [timeOfDay]);

  return (
    <div className="global-time-indicator" aria-hidden>
      {timeOfDay}
    </div>
  );
}
