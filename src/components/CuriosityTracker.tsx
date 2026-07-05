import { useEffect, useRef } from "react";
import { speak } from "@/lib/narrator";
import { incrementCuriousClicks } from "@/lib/easter-eggs";

export function CuriosityTracker() {
  const clickCountRef = useRef(0);
  const lastSpokenRef = useRef(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isInteractive = target.closest("a, button, input, textarea, select, [role=button]");
      if (!isInteractive) return;
      clickCountRef.current++;
      if (clickCountRef.current % 12 === 0) {
        const elapsed = Date.now() - lastSpokenRef.current;
        if (elapsed > 60000) {
          lastSpokenRef.current = Date.now();
          const phrase = Math.random() > 0.5
            ? "You are curious. He was too."
            : "Curiosity is how memories survive.";
          setTimeout(() => speak(phrase, { rate: 0.82 }), 800);
        }
      }
      incrementCuriousClicks();
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return null;
}
