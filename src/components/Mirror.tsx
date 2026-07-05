import { useEffect, useRef, useState } from "react";
import { speak } from "@/lib/narrator";

export function Mirror() {
  const [found, setFound] = useState(false);
  const [looked, setLooked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.getElementById("letter");
    if (!el) return;
    const mirror = document.createElement("div");
    mirror.className = "hidden-mirror";
    mirror.style.cssText = `
      position: absolute;
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 50px;
      border-radius: 4px;
      background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(200,200,220,0.03));
      border: 1px solid rgba(255,255,255,0.08);
      cursor: pointer;
      z-index: 10;
      transition: all 0.5s;
    `;
    el.appendChild(mirror);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setFound(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    const handleClick = () => {
      setLooked(true);
      mirror.style.transform = "scaleY(-1) scaleX(-1)";
      mirror.style.background = "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(200,200,220,0.05))";
      setTimeout(() => {
        speak("Interesting. You expected to see him.", { rate: 0.82 });
      }, 1500);
    };
    mirror.addEventListener("click", handleClick);

    return () => {
      observer.disconnect();
      mirror.removeEventListener("click", handleClick);
      if (mirror.parentNode) mirror.parentNode.removeChild(mirror);
    };
  }, []);

  return (
    <>
      {found && !looked && (
        <div className="mirror-hint" aria-hidden>
          <style>{`
            .mirror-hint {
              position: fixed;
              bottom: 100px;
              right: 70px;
              z-index: 10;
              opacity: 0;
              animation: fade-slow 3s ease-out 5s forwards;
              pointer-events: none;
            }
            .mirror-hint p {
              font-family: var(--font-mono);
              font-size: 7px;
              text-transform: uppercase;
              letter-spacing: 0.3em;
              color: rgba(255,255,255,0.15);
            }
          `}</style>
          <p>Something reflects here</p>
        </div>
      )}
    </>
  );
}
