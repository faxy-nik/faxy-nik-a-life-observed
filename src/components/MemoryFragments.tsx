import { useEffect, useState, useRef, useCallback } from "react";
import { FRAGMENT_DATA, getFoundFragments, markFragmentFound } from "../lib/easter-eggs";
import { speakWithHesitation } from "../lib/hesitant-speak";

const fragmentPositions = [
  { top: "15%", left: "10%" },
  { top: "30%", left: "75%" },
  { top: "55%", left: "15%" },
  { top: "70%", left: "80%" },
  { top: "85%", left: "25%" },
  { top: "20%", left: "50%" },
  { top: "45%", left: "85%" },
  { top: "65%", left: "5%" },
  { top: "90%", left: "60%" },
];

export function MemoryFragments({ documentPhase }: { documentPhase: string }) {
  const [found, setFound] = useState<number[]>([]);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    setFound(getFoundFragments());
  }, []);

  useEffect(() => {
    if (found.length === 9 && !showCompletion) {
      setShowCompletion(true);
      setTimeout(() => {
        speakWithHesitation(
          "This was never a story about one person. It was about nine people quietly building one another.",
          { rate: 0.8 }
        );
      }, 500);
    }
  }, [found.length, showCompletion]);

  if (documentPhase !== "narrating") return null;

  return (
    <>
      {FRAGMENT_DATA.map((fragment, i) => {
        const isFound = found.includes(fragment.id);
        return (
          <div
            key={fragment.id}
            className="fixed z-[55]"
            style={{
              top: fragmentPositions[i].top,
              left: fragmentPositions[i].left,
              opacity: isFound ? 0 : 0.6,
            }}
          >
            <button
              onClick={() => {
                if (isFound) return;
                const updated = markFragmentFound(fragment.id);
                setFound(updated);
                speakWithHesitation(fragment.text, { rate: 0.82 });
              }}
              className="group relative"
            >
              <span
                className={`block transition-all duration-700 ${
                  isFound ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              >
                <span className="block w-3 h-3 rounded-full bg-white/20 hover:bg-white/40 cursor-pointer animate-twinkle transition-all duration-500 shadow-[0_0_10px_2px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_6px_rgba(255,255,255,0.4)] hover:scale-150" />
              </span>
              {!isFound && (
                <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full border border-white/20 animate-pulse-ring pointer-events-none" />
              )}
            </button>
          </div>
        );
      })}

      {showCompletion && (
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center animate-fade-slow">
          <div className="max-w-xl mx-6 text-center">
            <p className="serif italic text-2xl md:text-3xl text-white/85 leading-relaxed">
              "This was never a story about one person."
            </p>
            <p className="serif italic text-2xl md:text-3xl text-white/85 leading-relaxed mt-4">
              "It was about nine people quietly building one another."
            </p>
            <button
              onClick={() => setShowCompletion(false)}
              className="mt-10 glass-panel rounded-full px-6 py-3 mono text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white/80 transition-all"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
