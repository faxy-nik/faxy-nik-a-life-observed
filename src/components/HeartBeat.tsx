import { useEffect, useRef } from "react";

export function HeartBeat() {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .heartbeat-pulse {
        animation: heartbeat-global 0.833s ease-in-out infinite;
      }
      .heartbeat-bg {
        animation: heartbeat-bg-glow 0.833s ease-in-out infinite;
      }
      @keyframes heartbeat-global {
        0%, 100% { transform: scale(1); }
        14% { transform: scale(1.003); }
        28% { transform: scale(1); }
        42% { transform: scale(1.002); }
        56% { transform: scale(1); }
      }
      @keyframes heartbeat-bg-glow {
        0%, 100% { background-color: transparent; }
        14% { background-color: rgba(255,255,255,0.01); }
        28% { background-color: transparent; }
        42% { background-color: rgba(255,255,255,0.005); }
        56% { background-color: transparent; }
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;

    const observer = new MutationObserver(() => {
      const sections = document.querySelectorAll("section[id]");
      let hasEmotional = false;
      const emotionalSections = ["traits", "letter", "mosaic", "learned"];
      sections.forEach((s) => {
        const rect = s.getBoundingClientRect();
        if (
          emotionalSections.includes(s.id) &&
          rect.top < window.innerHeight && rect.bottom > 0
        ) {
          hasEmotional = true;
        }
      });

      const main = document.querySelector("main");
      if (main) {
        if (hasEmotional) {
          main.classList.add("heartbeat-pulse");
        } else {
          main.classList.remove("heartbeat-pulse");
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        const main = document.querySelector("main");
        for (const entry of entries) {
          if (entry.isIntersecting) {
            main?.classList.add("heartbeat-pulse");
            return;
          }
        }
        main?.classList.remove("heartbeat-pulse");
      },
      { threshold: 0.1 }
    );

    const emotionalEls = ["traits", "letter", "mosaic", "learned"].map((id) => document.getElementById(id)).filter(Boolean);
    emotionalEls.forEach((el) => el && scrollObserver.observe(el));

    return () => {
      if (styleRef.current) document.head.removeChild(styleRef.current);
      observer.disconnect();
      scrollObserver.disconnect();
    };
  }, []);

  return null;
}
