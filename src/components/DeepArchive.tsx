import { useEffect, useState, useCallback } from "react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const RAW_LOGS = [
  { corrupted: false, text: ">> INIT_DEEP_SCAN // Subject: Faxy Nik // Archive depth: MAX" },
  { corrupted: false, text: ">> WARNING: Records below this level not intended for external review." },
  { corrupted: true, text: ">> [CORRUPTED] Emotional signature overload at 2019-11-03T22:14:00Z" },
  { corrupted: false, text: ">> OBSERVATION_LOG_#047: Subject displayed unexpected emotional reciprocity." },
  { corrupted: true, text: ">> [REDACTED] Bond analysis: Eeshah \u2014 coefficient exceeds standard deviation by 3.7\u03C3" },
  { corrupted: false, text: ">> Algorithm anomaly: Subject's kindness index does not correlate with self-preservation instinct." },
  { corrupted: true, text: ">> [CORRUPTED] Memory fragment: \"He said \u2014 wait \u2014 0xFF 0xD8 0xFF 0xE0\"" },
  { corrupted: false, text: ">> OBSERVATION_LOG_#112: Subject consistently prioritizes emotional safety over logical outcome." },
  { corrupted: true, text: ">> [DATA_EXPUNGED] Reference: \"The silent ride home\" \u2014 timestamp missing" },
  { corrupted: false, text: ">> Contradiction detected: Subject believes he is ordinary. Data suggests otherwise." },
  { corrupted: true, text: ">> [CORRUPTED] Neural map fragment \u2014 region: empathy center \u2014 activity: off-chart" },
  { corrupted: false, text: ">> OBSERVATION_LOG_#203: Subject's impact on others is inversely proportional to his awareness of it." },
  { corrupted: true, text: ">> [REDACTED] 8th bond \u2014 classification: life-altering \u2014 standard protocols: insufficient" },
  { corrupted: false, text: ">> FINAL_ANALYSIS: Subject does not fit any known human classification model." },
  { corrupted: true, text: ">> [DELETED] Observation: \"The observer has changed\" \u2014 cause: unknown" },
  { corrupted: false, text: ">> ARCHIVE NOTE: Some data was never meant to be seen. You found it anyway." },
];

const CORRUPTED_TRANSLATIONS = [
  "\u2200 p \u0279 \u0259 s \u0282",
  "0b011011100110111101110100",
  "\u234D\u2293\u2315 \u232A\u2315 \u2283\u2296",
  "\u2237\u2296\u2295\u2296 \u2296\u2295\u2283\u228D\u228C",
  "\u25EC\u228F\u2296\u228E \u228E\u2295\u228E\u228F\u2282\u228C",
  "\u2307\u229F\u2296\u228F\u2283\u2296 \u229F\u2295 \u228E\u2295\u228F\u2283\u228C\u2283\u228B",
];

function getCorruptedText(): string {
  return CORRUPTED_TRANSLATIONS[Math.floor(Math.random() * CORRUPTED_TRANSLATIONS.length)];
}

export function DeepArchive() {
  const [unlocked, setUnlocked] = useState(false);
  const [keyIndex, setKeyIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const [corruptedOverlay, setCorruptedOverlay] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === KONAMI[keyIndex]) {
        const next = keyIndex + 1;
        if (next === KONAMI.length) {
          setUnlocked(true);
          setTimeout(() => setVisible(true), 500);
          setKeyIndex(0);
        } else {
          setKeyIndex(next);
        }
      } else {
        setKeyIndex(0);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keyIndex]);

  const close = useCallback(() => {
    setVisible(false);
    setTimeout(() => setUnlocked(false), 500);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => {
      setLogIndex((i) => (i + 1) % RAW_LOGS.length);
    }, 1200);
    const gv = setInterval(() => {
      setGlitch(true);
      setCorruptedOverlay(getCorruptedText());
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => {
      clearInterval(iv);
      clearInterval(gv);
    };
  }, [visible]);

  if (!unlocked) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] bg-black transition-all duration-1000 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className={`absolute inset-0 ${glitch ? "animate-glitch" : ""}`}>
        <div className="absolute inset-0 grain opacity-[0.15]" />
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0 0 0 / 0.3) 2px, oklch(0 0 0 / 0.3) 4px)
          `,
          pointerEvents: "none",
        }} />
      </div>

      <div className="relative z-10 h-full overflow-y-auto px-6 py-16 md:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-baseline justify-between mb-12">
            <div>
              <p className="mono text-[10px] uppercase tracking-[0.5em] text-red-400/60 mb-2">Restricted Access</p>
              <h1 className={`serif text-4xl md:text-6xl text-red-400/80 ${glitch ? "animate-chromatic" : ""}`}>
                Deep Archive
              </h1>
              <p className="mono text-[10px] uppercase tracking-[0.3em] text-red-400/30 mt-2">
                Raw observation logs \u00B7 Unfiltered \u00B7 Unredacted
              </p>
            </div>
            <button
              onClick={close}
              className="glass-panel rounded-full px-4 py-2 mono text-[9px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all"
            >
              \u2715 Close
            </button>
          </div>

          {corruptedOverlay && glitch && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 mono text-2xl md:text-4xl text-red-400/10 pointer-events-none whitespace-nowrap select-none">
              {corruptedOverlay}
            </div>
          )}

          <div className="glass-panel rounded-2xl p-6 md:p-8 mb-8 border-red-400/10">
            <p className="mono text-[10px] uppercase tracking-[0.3em] text-red-400/50 mb-4">System Access Log</p>
            <div className="space-y-3">
              {RAW_LOGS.slice(0, logIndex + 1).map((log, i) => (
                <p
                  key={i}
                  className={`mono text-xs md:text-sm leading-relaxed transition-all duration-500 ${
                    log.corrupted
                      ? "text-red-400/50 animate-pulse"
                      : "text-white/60"
                  } ${glitch && i === logIndex ? "opacity-30" : ""}`}
                >
                  {log.corrupted ? (
                    log.text.includes("[REDACTED]") ? (
                      <span className="relative">
                        {log.text.split(":")[0]}:{" "}
                        <span className="bg-red-400/20 px-1 line-through decoration-red-400/50">
                          {log.text.split(":")[1]?.trim() || log.text}
                        </span>
                      </span>
                    ) : (
                      <span className="tracking-[0.1em]">{log.text}</span>
                    )
                  ) : (
                    log.text
                  )}
                </p>
              ))}
              <p className="mono text-xs text-red-400/30 animate-pulse">_</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="glass-panel rounded-xl p-5">
              <p className="mono text-[9px] uppercase tracking-[0.3em] text-red-400/40 mb-2">Corruption Rate</p>
              <p className="serif text-2xl text-red-400/60">{Math.floor(Math.random() * 30 + 40)}%</p>
              <p className="mono text-[8px] uppercase tracking-[0.2em] text-white/20 mt-1">Data integrity: compromised</p>
            </div>
            <div className="glass-panel rounded-xl p-5">
              <p className="mono text-[9px] uppercase tracking-[0.3em] text-red-400/40 mb-2">Archived Observations</p>
              <p className="serif text-2xl text-red-400/60">{Math.floor(Math.random() * 900 + 100)}</p>
              <p className="mono text-[8px] uppercase tracking-[0.2em] text-white/20 mt-1">{Math.floor(Math.random() * 50)} flagged for deletion</p>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6 md:p-8 border-red-400/10">
            <p className="mono text-[10px] uppercase tracking-[0.3em] text-red-400/50 mb-4">System Note</p>
            <p className="serif text-lg md:text-xl text-white/60 italic leading-relaxed">
              "Some data was not meant to be retrieved. Some observations were not meant to be shared.
              The fact that you are reading this means the archive's security protocols have been breached.
              Or perhaps \u2014 someone wanted you to find this."
            </p>
            <p className="mono text-[9px] uppercase tracking-[0.2em] text-red-400/30 mt-4">
              \u2014 Deep Archive Integrity Check Failed
            </p>
          </div>

          <p className="mono text-[9px] uppercase tracking-[0.4em] text-white/10 text-center mt-12">
            You were never meant to see this.
          </p>
        </div>
      </div>
    </div>
  );
}
