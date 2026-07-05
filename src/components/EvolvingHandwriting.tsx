import { useEffect } from "react";
import { getVisitCount } from "@/lib/easter-eggs";

export function EvolvingHandwriting() {
  useEffect(() => {
    const visits = getVisitCount();
    const style = document.createElement("style");

    let fontStyle = "";
    if (visits <= 2) {
      fontStyle = `
        .serif { font-weight: 400 !important; letter-spacing: -0.01em !important; }
      `;
    } else if (visits <= 4) {
      fontStyle = `
        .serif { font-weight: 400 !important; letter-spacing: -0.015em !important; }
        .quote-text { font-style: italic !important; }
      `;
    } else if (visits <= 7) {
      fontStyle = `
        .serif { font-weight: 350 !important; letter-spacing: -0.02em !important; }
        .serif-soft { font-family: "Times New Roman", serif !important; }
      `;
    } else {
      fontStyle = `
        .serif { font-weight: 300 !important; letter-spacing: -0.025em !important; }
        .serif-soft { font-family: "Georgia", serif !important; }
        .aged-text { opacity: 0.85 !important; }
      `;
    }

    style.textContent = `
      .serif { transition: all 2s ease-in-out; }
      ${fontStyle}
      .handwriting-evolution {
        position: fixed;
        bottom: 8px;
        right: 120px;
        z-index: 60;
        pointer-events: none;
        font-family: var(--font-mono);
        font-size: 6px;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        color: rgba(255,255,255,0.08);
      }
    `;
    document.head.appendChild(style);

    const badge = document.createElement("div");
    badge.className = "handwriting-evolution";
    badge.textContent = `session ${visits} · ${visits <= 2 ? "initializing" : visits <= 4 ? "adapting" : visits <= 7 ? "familiar" : "intimate"} tone`;
    document.body.appendChild(badge);

    return () => {
      document.head.removeChild(style);
      if (badge.parentNode) badge.parentNode.removeChild(badge);
    };
  }, []);

  return null;
}
