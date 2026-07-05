import { useEffect, useState } from "react";
import { speak } from "@/lib/narrator";
import { isFinalMemoryUnlocked, markFinalMemoryUnlocked, getDiscoveredSecrets, getFootprints, getFoundFragments, getPianoNotes } from "@/lib/easter-eggs";

export function FinalMemory() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"initial" | "chair" | "speech" | "silence">("initial");

  useEffect(() => {
    if (isFinalMemoryUnlocked()) return;

    const checkUnlock = () => {
      const secrets = getDiscoveredSecrets();
      const footprints = getFootprints();
      const fragments = getFoundFragments();
      const piano = getPianoNotes();

      const hasEnoughSecrets = secrets.length >= 8;
      const hasEnoughFootprints = footprints.length >= 6;
      const hasAllFragments = fragments.length >= 9;
      const hasAllPiano = piano.length >= 12;

      if ((hasEnoughSecrets && hasAllFragments) || (hasAllPiano && hasAllFragments) || (hasEnoughFootprints && hasEnoughSecrets && hasAllPiano)) {
        markFinalMemoryUnlocked();
        setShow(true);
      }
    };

    const iv = setInterval(checkUnlock, 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!show) return;
    const t1 = setTimeout(() => setPhase("chair"), 1000);
    const t2 = setTimeout(() => {
      setPhase("speech");
      speak(
        "I have replayed this semester more times than he ever will. I still cannot decide which memory mattered the most. Perhaps... It was not any single memory. It was the fact that someone cared enough to remember them.",
        { rate: 0.8, onEnd: () => setPhase("silence") }
      );
    }, 4000);
    const t3 = setTimeout(() => {
      const finalSpeak = () => speak("The people we remember never truly leave.", { rate: 0.78 });
      setTimeout(finalSpeak, 12000);
    }, 10000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [show]);

  if (!show) return null;

  return (
    <div className={`final-memory ${phase}`}>
      <div className="final-memory-bg" />
      {phase === "chair" && (
        <div className="final-memory-chair">
          <div className="chair-icon">\uD83D\uDCBA</div>
        </div>
      )}
      {phase === "silence" && (
        <div className="final-memory-end">
          <p className="serif italic text-xl text-white/50 animate-fade-slow">
            "The people we remember never truly leave."
          </p>
        </div>
      )}
      <style>{`
        .final-memory {
          position: fixed;
          inset: 0;
          z-index: 300;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .final-memory-bg {
          position: absolute;
          inset: 0;
          background: black;
          transition: opacity 4s;
        }
        .final-memory.initial .final-memory-bg { opacity: 0; }
        .final-memory.chair .final-memory-bg, .final-memory.speech .final-memory-bg, .final-memory.silence .final-memory-bg { opacity: 1; }
        .final-memory-chair {
          position: relative;
          z-index: 1;
          animation: fade-slow 3s ease-out both;
        }
        .chair-icon { font-size: 48px; filter: grayscale(0.8); opacity: 0.4; }
        .final-memory-end {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 40px;
          animation: fade-slow 4s ease-out both;
        }
        .final-memory.silence {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
