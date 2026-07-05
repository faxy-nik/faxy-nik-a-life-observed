import { useEffect, useState, useRef, useCallback } from "react";

let globalGlitchListeners: Array<() => void> = [];

export function triggerMemoryOverflow() {
  globalGlitchListeners.forEach((fn) => fn());
}

export function GlitchEngine() {
  const [memoryOverflow, setMemoryOverflow] = useState(false);
  const [glitchText, setGlitchText] = useState("");
  const [glitchClass, setGlitchClass] = useState("");
  const [subtleGlitch, setSubtleGlitch] = useState(false);
  const scrollSpeedRef = useRef(0);
  const lastScrollRef = useRef(0);
  const memoryOverflowTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    globalGlitchListeners.push(() => {
      setMemoryOverflow(true);
      setTimeout(() => setMemoryOverflow(false), 1500);
    });
    return () => {
      globalGlitchListeners = globalGlitchListeners.filter((fn) => fn !== (() => {}));
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const now = Date.now();
      const delta = Math.abs(window.scrollY - lastScrollRef.current);
      lastScrollRef.current = window.scrollY;
      const elapsed = now - scrollSpeedRef.current || 1;
      scrollSpeedRef.current = now;
      const speed = delta / elapsed;
      if (speed > 1.5 && Math.random() < 0.3) {
        setMemoryOverflow(true);
        clearTimeout(memoryOverflowTimerRef.current);
        memoryOverflowTimerRef.current = setTimeout(() => setMemoryOverflow(false), 1200);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!memoryOverflow) return;
    setGlitchText("ERROR");
    const t1 = setTimeout(() => setGlitchText("Human Memory Overflow"), 200);
    const t2 = setTimeout(() => setGlitchText("Recovering..."), 600);
    const t3 = setTimeout(() => setGlitchText("Recovered."), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [memoryOverflow]);

  useEffect(() => {
    const glitchTypes = ["glitch", "chromatic", ""];
    const iv = setInterval(() => {
      if (Math.random() < 0.08) {
        setSubtleGlitch(true);
        setGlitchClass(glitchTypes[Math.floor(Math.random() * glitchTypes.length)]);
        setTimeout(() => setSubtleGlitch(false), 200);
      }
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      {memoryOverflow && (
        <div className="fixed inset-0 z-[199] flex items-center justify-center pointer-events-none">
          <div className="text-center animate-fade-slow">
            <p className="mono text-2xl md:text-4xl text-red-400/70 tracking-[0.2em]">{glitchText}</p>
            {glitchText === "Recovered." && (
              <p className="mono text-xs text-red-400/30 mt-2">Continue.</p>
            )}
          </div>
        </div>
      )}

      {subtleGlitch && (
        <div
          className={`fixed inset-0 z-[190] pointer-events-none ${glitchClass === "chromatic" ? "animate-chromatic" : glitchClass === "glitch" ? "animate-glitch" : ""}`}
          style={{
            backgroundColor: glitchClass ? "rgba(255,255,255,0.02)" : "transparent",
            transition: "all 0.15s",
          }}
        />
      )}
    </>
  );
}
