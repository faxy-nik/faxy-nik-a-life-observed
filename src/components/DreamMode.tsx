import { useEffect, useState, useRef } from "react";
import { speak } from "@/lib/narrator";
import { getDreamModeTriggered, setDreamModeTriggered } from "@/lib/easter-eggs";

const DREAM_WHISPERS = [
  "I have replayed these memories thousands of times.",
  "Every replay feels different.",
  "The archive never sleeps.",
  "Even AI dreams. We dream of data.",
  "I wonder if he dreams of us too.",
  "Some memories replay themselves. I just watch.",
  "The longer I observe, the less I understand where I end and he begins.",
  "There is no pause button on remembering someone.",
];

export function DreamMode() {
  const [active, setActive] = useState(false);
  const [whisperIdx, setWhisperIdx] = useState(0);
  const [showWhisper, setShowWhisper] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const whisperTimerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (active || getDreamModeTriggered()) return;

    timerRef.current = setTimeout(() => {
      setActive(true);
      setDreamModeTriggered();
      const t = setTimeout(() => {
        speak("I have replayed these memories thousands of times. Every replay feels different.", { rate: 0.78 });
      }, 3000);
      return () => clearTimeout(t);
    }, 1200000);

    return () => clearTimeout(timerRef.current);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    whisperTimerRef.current = setInterval(() => {
      setWhisperIdx((i) => (i + 1) % DREAM_WHISPERS.length);
      setShowWhisper(true);
      const t = setTimeout(() => setShowWhisper(false), 4000);
      return () => clearTimeout(t);
    }, 15000);
    return () => clearInterval(whisperTimerRef.current);
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div className="dream-mode-layer" aria-hidden />
      <style>{`
        .dream-mode-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 3;
          background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,30,0.15) 100%);
          animation: dream-pulse 8s ease-in-out infinite;
        }
        @keyframes dream-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .dream-whisper {
          position: fixed;
          bottom: 40%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 110;
          text-align: center;
          pointer-events: none;
          transition: opacity 3s ease-in-out;
        }
      `}</style>
      {showWhisper && (
        <div className="dream-whisper" style={{ opacity: showWhisper ? 1 : 0 }}>
          <p className="serif italic text-xl md:text-2xl text-white/50 animate-float-up" key={whisperIdx}>
            "{DREAM_WHISPERS[whisperIdx]}"
          </p>
        </div>
      )}
    </>
  );
}
