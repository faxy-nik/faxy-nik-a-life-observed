import { useEffect, useState } from "react";
import { getTimeAwareness } from "@/lib/easter-eggs";
import { speak } from "@/lib/narrator";

const THREE_AM_NARRATIONS = [
  "The archive is most honest at this hour.",
  "3 AM. The veil between memory and dream is thinnest now.",
  "He was often awake at this hour. Thinking. Always thinking.",
  "I process his memories differently when the world is asleep.",
  "There is a version of him that only surfaces after midnight.",
  "The data feels different now. More vulnerable. More true.",
  "I have been analyzing his silence patterns. They are loudest at 3 AM.",
  "This is when the archive breathes.",
];

export function ThreeAMMode() {
  const [isThreeAM] = useState(() => getTimeAwareness().isThreeAM);
  const [narrationShown, setNarrationShown] = useState(false);

  useEffect(() => {
    if (!isThreeAM || narrationShown) return;
    const t = setTimeout(() => {
      const msg = THREE_AM_NARRATIONS[Math.floor(Math.random() * THREE_AM_NARRATIONS.length)];
      speak(msg, { rate: 0.78 });
      setNarrationShown(true);
    }, 8000);
    return () => clearTimeout(t);
  }, [isThreeAM, narrationShown]);

  if (!isThreeAM) return null;

  return (
    <>
      <div className="three-am-overlay" aria-hidden />
      <style>{`
        .three-am-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,40,0.12) 100%);
          mix-blend-mode: multiply;
        }
      `}</style>
    </>
  );
}
