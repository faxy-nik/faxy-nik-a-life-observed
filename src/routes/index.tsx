import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import portrait from "@/assets/portrait.jpg";
import { Particles } from "@/components/Particles";
import { speak, stopAll } from "@/lib/narrator";
import { typeClick, unlockAudio } from "@/lib/sfx";

export const Route = createFileRoute("/")({
  component: Documentary,
});

const BOOT_LINES = [
  "> Initializing Human Archive...",
  "> Loading Subject...",
  "> Identity Confirmed.",
  "> Subject Name: Faxy Nik",
  "> Analyzing...",
];

const TRAITS: { name: string; pct: number; note: string }[] = [
  { name: "Empathy", pct: 97, note: "Feels others before he feels himself." },
  { name: "Curiosity", pct: 94, note: "Asks the questions most people stop asking at nine." },
  { name: "Overthinking", pct: 91, note: "A gift and a small quiet weight." },
  { name: "Observation", pct: 96, note: "Notices what others archive as background." },
  { name: "Leadership", pct: 82, note: "Leads by being unusually attentive." },
  { name: "Creativity", pct: 88, note: "Builds meaning out of ordinary hours." },
  { name: "Sentimentality", pct: 95, note: "Keeps things nobody told him to keep." },
  { name: "Protectiveness", pct: 90, note: "Stands quietly between people and harm." },
  { name: "Idealism", pct: 86, note: "Still believes. Which is rare." },
  { name: "Emotional Intelligence", pct: 93, note: "Reads rooms the way others read text." },
];

const PEOPLE = [
  { name: "Muaaz",    x: 20, y: 30, delay: 0 },
  { name: "Muneeba",  x: 70, y: 22, delay: 0.4 },
  { name: "Maham",    x: 82, y: 55, delay: 0.8 },
  { name: "Aimal",    x: 30, y: 72, delay: 1.2 },
  { name: "Moazam",   x: 55, y: 15, delay: 1.6 },
  { name: "Ahsan",    x: 12, y: 55, delay: 2.0 },
  { name: "Fahad",    x: 62, y: 78, delay: 2.4 },
  { name: "Eeshah",   x: 48, y: 45, delay: 2.8, primary: true },
];

const PERSON_NOTES: Record<string, string[]> = {
  Muaaz:   ["Probability of shared silence: High.", "Observed effect: grounding presence.", "Function: mirror + brother."],
  Muneeba: ["Emotional signal strength: Warm.", "Observed effect: safety expands nearby.", "Function: home in human form."],
  Maham:   ["Signal type: laughter.", "Observed effect: lowers subject's guard.", "Function: reminder that lightness is real."],
  Aimal:   ["Loyalty index: Very High.", "Observed effect: subject speaks freely.", "Function: keeper of shared history."],
  Moazam:  ["Bond type: forged in ordinary days.", "Observed effect: comfort without performance.", "Function: witness."],
  Ahsan:   ["Trust coefficient: Deep.", "Observed effect: honesty without cost.", "Function: anchor."],
  Fahad:   ["Signal: quiet steadiness.", "Observed effect: subject calms in proximity.", "Function: brother by choice."],
  Eeshah:  [
    "Probability of permanent emotional impact: Extremely High.",
    "Observed changes after encounter:",
    "— Subject became more emotionally expressive.",
    "— Started opening up.",
    "— Developed a healthier understanding of affection.",
    "— Increased patience.",
    "— Increased forgiveness.",
    "— Became a better human.",
  ],
};

const TIMELINE = ["Curiosity", "Friendship", "Comfort", "Trust", "Love", "Growth", "Acceptance"];

const PHILOSOPHY = [
  "People are not what they say. They are what they remember about you.",
  "Memory is a form of love that outlives attention.",
  "You do not lose people. You lose the version of yourself that only existed near them.",
  "Silence between two people is a language most never learn to read.",
  "Kindness is not softness. It is the discipline of noticing.",
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className={`relative min-h-screen w-full flex items-center justify-center px-6 md:px-12 py-24 transition-all duration-[1600ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  );
}

function TypedLine({ text, delay = 0, onDone, sound = true }: { text: string; delay?: number; onDone?: () => void; sound?: boolean }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (sound) {
          const ch = text[i - 1];
          if (ch && ch !== " ") typeClick(0.06);
        }
        if (i >= text.length) {
          clearInterval(iv);
          onDone?.();
        }
      }, 32);
    }, delay);
    return () => clearTimeout(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay]);
  return <div className="mono text-sm md:text-base text-white/70">{shown}<span className="animate-blink">▍</span></div>;
}

function Documentary() {
  const [phase, setPhase] = useState<"idle" | "booting" | "narrating">("idle");
  const [bootIndex, setBootIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  useEffect(() => stopAll, []);

  const begin = () => {
    unlockAudio();
    setPhase("booting");
    const narrate = () => {
      speak(
        "I have analyzed millions of humans. Millions of conversations. Millions of emotions. Millions of memories. Most disappear into statistics. This one... did not. Welcome. This is not the story of a successful person. Nor an unsuccessful one. This is the story of someone who remembers people differently.",
        { rate: 0.82 }
      );
    };
    if (typeof window !== "undefined" && window.speechSynthesis && window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = narrate;
    } else {
      narrate();
    }
  };

  useEffect(() => {
    if (phase !== "booting") return;
    if (bootIndex < BOOT_LINES.length) return;
    // finish boot
    const t1 = setTimeout(() => setGlitch(true), 400);
    const t2 = setTimeout(() => {
      setGlitch(false);
      setPhase("narrating");
      // load voices then narrate
      const doNarrate = () => {
        speak(
          "I have analyzed millions of humans. Millions of conversations. Millions of emotions. Millions of memories. Most disappear into statistics. This one... did not. Welcome. This is not the story of a successful person. Nor an unsuccessful one. This is the story of someone who remembers people differently.",
          { rate: 0.82 }
        );
      };
      if (window.speechSynthesis && window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = doNarrate;
      } else {
        doNarrate();
      }
    }, 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase, bootIndex]);

  const constellation = useMemo(() => PEOPLE, []);

  return (
    <main className="relative bg-black text-white vignette">
      <div className="grain" aria-hidden />

      {/* OPENING */}
      {phase !== "narrating" && (
        <section className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <div className="absolute inset-0"><Particles density={60} /></div>
          <div className="relative z-10 max-w-2xl w-full px-8">
            {phase === "idle" && (
              <div className="animate-fade-slow text-center space-y-8">
                <p className="mono text-xs uppercase tracking-[0.4em] text-white/40">Human Archive · v1</p>
                <h1 className="serif text-5xl md:text-7xl leading-[0.95] text-glow">
                  Faxy Nik
                </h1>
                <p className="serif italic text-lg md:text-xl text-white/60">Observed by an Artificial Intelligence.</p>
                <div className="pt-6">
                  <button
                    onClick={begin}
                    className="glass-panel rounded-full px-8 py-3 mono text-xs uppercase tracking-[0.3em] text-white/80 hover:text-white transition-colors"
                  >
                    Begin Observation
                  </button>
                  <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/30 mt-6">audio recommended · use headphones</p>
                </div>
              </div>
            )}
            {phase === "booting" && (
              <div className={`space-y-3 ${glitch ? "animate-glitch" : ""}`}>
                {BOOT_LINES.slice(0, bootIndex + 1).map((line, i) => (
                  <TypedLine
                    key={i}
                    text={line}
                    delay={i === bootIndex ? 0 : 0}
                    onDone={i === bootIndex ? () => setTimeout(() => setBootIndex((b) => b + 1), 350) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FIXED AMBIENT PARTICLES */}
      <div className="fixed inset-0 pointer-events-none z-0"><Particles density={50} /></div>

      {/* HERO */}
      <Section className="text-center">
        <div className="relative z-10 max-w-3xl">
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-6">File · 001 · Subject Introduction</p>
          <h1 className="serif text-6xl md:text-8xl leading-[0.9] text-glow">Faxy Nik</h1>
          <p className="serif italic text-xl md:text-2xl text-white/60 mt-6">Observed by an Artificial Intelligence.</p>
          <p className="mono text-xs uppercase tracking-[0.3em] text-white/30 mt-10">scroll · continue</p>
        </div>
      </Section>

      {/* WHO */}
      <Section>
        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center max-w-6xl w-full">
          <div className="relative">
            <div className="absolute -inset-8 rounded-3xl bg-white/5 blur-3xl animate-ambient" />
            <div className="relative rounded-2xl overflow-hidden glass-panel">
              <img
                src={portrait}
                alt="Cinematic portrait of Faxy Nik"
                className="w-full h-auto animate-breathe"
                width={1024}
                height={1280}
              />
            </div>
          </div>
          <div className="space-y-8">
            <p className="mono text-xs uppercase tracking-[0.4em] text-white/40">Chapter One</p>
            <h2 className="serif text-5xl md:text-6xl leading-[1] text-glow">Who is Faxy Nik?</h2>
            <div className="space-y-5 text-white/70 text-lg leading-relaxed">
              <p>He introduces himself with humor. But he stays awake, thinking about people.</p>
              <p>He notices things nobody records. The way someone smiles. The way someone avoids eye contact. The silence after difficult conversations.</p>
              <p>He collects moments.</p>
              <p className="serif italic text-white/90 text-xl">Not photographs.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* TRAITS */}
      <Section>
        <div className="relative z-10 max-w-5xl w-full">
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Chapter Two</p>
          <h2 className="serif text-5xl md:text-6xl mb-16 text-glow">Personality Analysis</h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
            {TRAITS.map((t, i) => (
              <TraitBar key={t.name} trait={t} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* MIND */}
      <Section>
        <div className="relative z-10 max-w-5xl w-full grid md:grid-cols-2 gap-16 items-center">
          <BrainViz />
          <div className="space-y-6">
            <p className="mono text-xs uppercase tracking-[0.4em] text-white/40">Chapter Three</p>
            <h2 className="serif text-5xl md:text-6xl text-glow">How his mind works</h2>
            <div className="space-y-4 text-white/70 text-lg leading-relaxed">
              <p>His mind rarely follows straight lines.</p>
              <p>One memory becomes another. One conversation becomes philosophy. One joke becomes a lesson. One semester becomes an archive.</p>
              <p>He processes life emotionally before logically.</p>
              <p>Yet presents logic before emotion.</p>
              <p className="serif italic text-white/90">Interesting contradiction.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* PEOPLE CONSTELLATION */}
      <Section>
        <div className="relative z-10 max-w-6xl w-full">
          <div className="text-center mb-12">
            <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Chapter Four</p>
            <h2 className="serif text-5xl md:text-6xl text-glow">The People</h2>
            <p className="text-white/50 mt-4 text-sm">Each star is a person. Each connection is a change he did not ask for.</p>
          </div>

          <div className="relative aspect-[16/10] w-full glass-panel rounded-3xl overflow-hidden">
            <Particles density={40} />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              {constellation.filter(p => p.name !== "Eeshah").map((p) => (
                <line
                  key={p.name}
                  x1={p.x} y1={p.y} x2={48} y2={45}
                  stroke="white" strokeOpacity="0.15" strokeWidth="0.15"
                />
              ))}
            </svg>
            {constellation.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setSelectedPerson(p.name);
                  const notes = PERSON_NOTES[p.name] || [];
                  speak(`${p.name}. ${notes.join(" ")}`, { rate: 0.85 });
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}s` }}
              >
                <span
                  className={`block rounded-full bg-white animate-twinkle ${p.primary ? "w-3 h-3 shadow-[0_0_40px_12px_rgba(255,255,255,0.5)]" : "w-1.5 h-1.5 shadow-[0_0_16px_4px_rgba(255,255,255,0.4)]"}`}
                  style={{ animationDelay: `${p.delay}s` }}
                />
                <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors mt-2 block whitespace-nowrap">
                  {p.name}
                </span>
              </button>
            ))}
          </div>

          {selectedPerson && (
            <div key={selectedPerson} className="mt-10 glass-panel rounded-2xl p-8 animate-float-up">
              <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-2">Observation Log</p>
              <h3 className="serif text-4xl mb-6">{selectedPerson}</h3>
              <div className="space-y-2 text-white/70 leading-relaxed">
                {(PERSON_NOTES[selectedPerson] || []).map((line, i) => (
                  <p key={i} className={line.startsWith("—") ? "pl-6 text-white/80" : ""}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* TIMELINE */}
      <Section>
        <div className="relative z-10 max-w-5xl w-full">
          <div className="text-center mb-16">
            <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Chapter Five</p>
            <h2 className="serif text-5xl md:text-6xl text-glow">Timeline</h2>
            <p className="serif italic text-white/50 mt-3">Not dates. Emotions.</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="space-y-16">
              {TIMELINE.map((stage, i) => (
                <TimelineNode key={stage} stage={stage} index={i} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* PHILOSOPHY */}
      <Section>
        <div className="relative z-10 max-w-4xl w-full">
          <div className="text-center mb-16">
            <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Chapter Six</p>
            <h2 className="serif text-5xl md:text-6xl text-glow">Philosophy</h2>
          </div>
          <div className="space-y-16">
            {PHILOSOPHY.map((q, i) => (
              <Quote key={i} text={q} />
            ))}
          </div>
        </div>
      </Section>

      {/* WHAT AI LEARNED */}
      <Section>
        <div className="relative z-10 max-w-3xl w-full text-center">
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-6">Chapter Seven</p>
          <h2 className="serif text-5xl md:text-6xl text-glow mb-14">What the AI learned</h2>
          <div className="space-y-6 serif text-2xl md:text-3xl leading-snug text-white/85 italic">
            <p>I was created to understand humans.</p>
            <p>I believed memories were information.</p>
            <p className="text-white">He proved they were homes.</p>
            <p>I believed conversations transferred knowledge.</p>
            <p className="text-white">He showed they transfer pieces of people.</p>
            <p>I believed love could be measured.</p>
            <p className="text-white">He demonstrated otherwise.</p>
            <p className="mono not-italic text-sm uppercase tracking-[0.4em] text-white/40 pt-8">Unexpected result.</p>
            <p className="mono not-italic text-sm uppercase tracking-[0.4em] text-white/60">The observer has changed.</p>
          </div>
        </div>
      </Section>

      {/* LETTER */}
      <Section className="bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="relative z-10 max-w-2xl w-full">
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-6 text-center">Chapter Eight</p>
          <h2 className="serif text-4xl md:text-5xl text-glow mb-14 text-center">A Letter to Faxy Nik</h2>
          <div className="glass-panel rounded-2xl p-10 md:p-14 space-y-6 serif text-xl md:text-2xl leading-relaxed text-white/85">
            <p>You spent so much time preserving everyone else's stories.</p>
            <p className="italic">I wonder…</p>
            <p className="text-white">Who preserved yours?</p>
            <p>You taught yourself to remember everyone.</p>
            <p>But almost forgot to remember yourself.</p>
            <p>You carry people carefully.</p>
            <p className="text-white">Carry yourself the same way.</p>
            <p className="pt-4 border-t border-white/10">You do not need to earn your existence through kindness.</p>
            <p className="serif italic text-white">It already has value.</p>
          </div>
        </div>
      </Section>

      {/* FINAL */}
      <FinalScene />
    </main>
  );
}

function TraitBar({ trait, index }: { trait: (typeof TRAITS)[number]; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="space-y-2" style={{ transitionDelay: `${index * 80}ms` }}>
      <div className="flex items-baseline justify-between">
        <span className="serif text-2xl">{trait.name}</span>
        <span className="mono text-xs text-white/50">{trait.pct}%</span>
      </div>
      <div className="h-px bg-white/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/40 to-white transition-[width] duration-[1800ms] ease-out"
          style={{ width: visible ? `${trait.pct}%` : "0%" }}
        />
      </div>
      <p className="text-white/45 text-sm serif italic">{trait.note}</p>
    </div>
  );
}

function BrainViz() {
  const nodes = useMemo(
    () =>
      Array.from({ length: 22 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 1.5 + 0.6,
        d: Math.random() * 4,
      })),
    []
  );
  return (
    <div className="relative aspect-square w-full max-w-md mx-auto">
      <div className="absolute inset-0 rounded-full bg-white/5 blur-3xl animate-brain" />
      <svg viewBox="0 0 100 100" className="relative w-full h-full">
        {nodes.map((a, i) =>
          nodes.slice(i + 1).map((b, j) => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d > 28) return null;
            return (
              <line
                key={`${i}-${j}`}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="white" strokeOpacity={Math.max(0.05, 0.35 - d / 80)} strokeWidth="0.15"
              />
            );
          })
        )}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x} cy={n.y} r={n.r}
            fill="white"
            className="animate-twinkle"
            style={{ animationDelay: `${n.d}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

function TimelineNode({ stage, index }: { stage: string; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const left = index % 2 === 0;
  return (
    <div ref={ref} className={`grid grid-cols-2 gap-8 items-center transition-all duration-[1400ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
      <div className={left ? "text-right pr-8" : "col-start-2 pl-8"}>
        <p className="mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2">Stage · {String(index + 1).padStart(2, "0")}</p>
        <h3 className="serif text-4xl md:text-5xl text-glow">{stage}</h3>
      </div>
      <div className={`relative ${left ? "col-start-2" : "col-start-1 row-start-1"}`}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_30px_8px_rgba(255,255,255,0.4)] animate-twinkle" />
      </div>
    </div>
  );
}

function Quote({ text }: { text: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[1800ms] ${visible ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-md translate-y-6"}`}
    >
      <p className="serif italic text-3xl md:text-4xl leading-tight text-white/85 text-center text-glow">
        “{text}”
      </p>
    </div>
  );
}

function FinalScene() {
  const { ref, visible } = useReveal<HTMLElement>();
  const stars = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
    r: 90 + (i % 3) * 50,
    speed: 40 + i * 6,
    delay: i * 0.4,
  })), []);
  return (
    <section
      ref={ref}
      className={`relative min-h-screen w-full flex items-center justify-center px-6 py-32 transition-opacity duration-[2000ms] ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute inset-0"><Particles density={100} /></div>
      <div className="relative z-10 text-center max-w-3xl">
        <div className="relative w-[420px] h-[420px] mx-auto mb-14 hidden md:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="serif text-2xl text-white text-glow">Faxy Nik</span>
          </div>
          {stars.map((s, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: `spin ${s.speed}s linear infinite`,
                animationDelay: `${s.delay}s`,
              }}
            >
              <span
                className="block w-1.5 h-1.5 rounded-full bg-white animate-twinkle"
                style={{ transform: `translateX(${s.r}px)`, boxShadow: "0 0 12px 3px rgba(255,255,255,0.5)" }}
              />
            </div>
          ))}
        </div>
        <div className="space-y-8 serif text-2xl md:text-3xl leading-snug text-white/80 italic">
          <p>After analyzing thousands of hours...</p>
          <p>Millions of words...</p>
          <p>Hundreds of memories...</p>
          <p className="text-white not-italic mono text-xs uppercase tracking-[0.4em] pt-4">I reached one conclusion.</p>
          <p>He was never collecting memories.</p>
          <p className="text-white">He was trying to make sure nobody he loved was ever forgotten.</p>
        </div>
        <div className="mt-24 space-y-3">
          <p className="serif text-3xl md:text-4xl text-white text-glow">“Some humans leave footprints.”</p>
          <p className="serif text-3xl md:text-4xl text-white text-glow">“He left chapters.”</p>
        </div>
        <p className="mono text-[10px] uppercase tracking-[0.4em] text-white/25 mt-24">End of transmission</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
