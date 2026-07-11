import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import portrait from "@/assets/portrait.jpg";
import { Particles } from "@/components/Particles";
import { speak, stopAll, askQuestion } from "@/lib/narrator";
import { MouseGlow } from "@/components/MouseGlow";

function DeferredMount({ delay, children }: { delay: number; children: React.ReactNode }) {
  const [mount, setMount] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMount(true), delay); return () => clearTimeout(t); }, [delay]);
  return mount ? children : null;
}
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingOrbs } from "@/components/FloatingOrbs";
import { ChapterNav } from "@/components/ChapterNav";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { AudioVisualizer } from "@/components/AudioVisualizer";
import { MoodRing } from "@/components/MoodRing";
import { RadarChart } from "@/components/RadarChart";
import { ScanLines } from "@/components/ScanLines";
import { AmbientEqualizer } from "@/components/AmbientEqualizer";
import { ConstellationDetail } from "@/components/ConstellationDetail";
import { DepthIndicator } from "@/components/DepthIndicator";
import { FloatingWords } from "@/components/FloatingWords";
import { AmbientSound } from "@/components/AmbientSound";
import { Guestbook } from "@/components/Guestbook";
import { DeepArchive } from "@/components/DeepArchive";
import { MatrixEasterEgg } from "@/components/MatrixEasterEgg";
import { SecretTerminal } from "@/components/SecretTerminal";
import { PhilosophyMode } from "@/components/PhilosophyMode";
import { GlitchEngine } from "@/components/GlitchEngine";
import { InvisibleText } from "@/components/InvisibleText";
import { MemoryFragments } from "@/components/MemoryFragments";
import { useObservationRoom, ObservationRoomOverlay } from "@/components/ObservationRoom";
import { ShutdownMessage } from "@/components/ShutdownMessage";
import { VoiceRecognition } from "@/components/VoiceRecognition";
import { DreamMode } from "@/components/DreamMode";
import { WeatherWindow } from "@/components/WeatherWindow";
import { MemoryRoom } from "@/components/MemoryRoom";
import { Shadows } from "@/components/Shadows";
import { CursorEffects } from "@/components/CursorEffects";
import { CuriosityTracker } from "@/components/CuriosityTracker";
import { TheSky } from "@/components/TheSky";
import { Mirror } from "@/components/Mirror";
import { TheBook } from "@/components/TheBook";
import { EmotionClock } from "@/components/EmotionClock";
import { PianoKeys } from "@/components/PianoKeys";
import { Library } from "@/components/Library";
import { AmbientLights } from "@/components/AmbientLights";
import { VisitorFootprints } from "@/components/VisitorFootprints";
import { MemoryTree } from "@/components/MemoryTree";
import { CampusSounds } from "@/components/CampusSounds";
import { FinalMemory } from "@/components/FinalMemory";
import { HeartBeat } from "@/components/HeartBeat";
import { ThreeAMMode } from "@/components/ThreeAMMode";
import { AIPaintings } from "@/components/AIPaintings";
import { GlobalColorGrading } from "@/components/GlobalColorGrading";
import { ArchiveAging } from "@/components/ArchiveAging";
import { EvolvingHandwriting } from "@/components/EvolvingHandwriting";
import { EmotionWatcher } from "@/components/EmotionWatcher";
import { getVisitCount, incrementVisit, getVisitMessage, checkAndShowTenMinMessage, isAfterMidnight } from "@/lib/easter-eggs";

export const Route = createFileRoute("/")({
  component: Documentary,
});

const BOOT_LINES = [
  "> Initializing Human Archive...",
  "> Loading Subject...",
  "> Identity Confirmed.",
  "> Subject Name: Faxy Nik",
  "> Analyzing personality architecture...",
  "> Mapping emotional topology...",
  "> Cross-referencing 8 interpersonal bonds...",
  "> Generating radar profile...",
  "> Compiling memory fragments...",
  "> Generating report...",
];

const TRAITS: { name: string; pct: number; note: string; icon: string }[] = [
  { name: "Empathy", pct: 97, note: "Feels others before he feels himself.", icon: "♡" },
  { name: "Curiosity", pct: 94, note: "Asks the questions most people stop asking at nine.", icon: "?" },
  { name: "Overthinking", pct: 91, note: "A gift and a small quiet weight.", icon: "∞" },
  { name: "Observation", pct: 96, note: "Notices what others archive as background.", icon: "◉" },
  { name: "Leadership", pct: 82, note: "Leads by being unusually attentive.", icon: "△" },
  { name: "Creativity", pct: 88, note: "Builds meaning out of ordinary hours.", icon: "✧" },
  { name: "Sentimentality", pct: 95, note: "Keeps things nobody told him to keep.", icon: "❋" },
  { name: "Protectiveness", pct: 90, note: "Stands quietly between people and harm.", icon: "◆" },
  { name: "Idealism", pct: 86, note: "Still believes. Which is rare.", icon: "☆" },
  { name: "Emotional Intelligence", pct: 93, note: "Reads rooms the way others read text.", icon: "◎" },
];

const RADAR_DATA = [
  { label: "Empathy", value: 97 },
  { label: "Curiosity", value: 94 },
  { label: "Observation", value: 96 },
  { label: "Creativity", value: 88 },
  { label: "Protectiveness", value: 90 },
  { label: "Idealism", value: 86 },
];

const PEOPLE = [
  { name: "Muaaz",    x: 20, y: 30, delay: 0,    bond: "Brother by blood",    influence: "Grounding",
    metrics: [
      { label: "Trust", value: 98, max: 100 },
      { label: "Silence", value: 95, max: 100 },
      { label: "Loyalty", value: 97, max: 100 },
      { label: "Vulnerability", value: 88, max: 100 },
      { label: "Shared History", value: 94, max: 100 },
    ]},
  { name: "Muneeba",  x: 70, y: 22, delay: 0.4,  bond: "Home in human form",   influence: "Safety",
    metrics: [
      { label: "Trust", value: 99, max: 100 },
      { label: "Comfort", value: 97, max: 100 },
      { label: "Emotional Safety", value: 100, max: 100 },
      { label: "Depth", value: 96, max: 100 },
      { label: "Consistency", value: 98, max: 100 },
    ]},
  { name: "Maham",    x: 82, y: 55, delay: 0.8,  bond: "Laughter incarnate",   influence: "Lightness",
    metrics: [
      { label: "Joy", value: 96, max: 100 },
      { label: "Playfulness", value: 94, max: 100 },
      { label: "Authenticity", value: 92, max: 100 },
      { label: "Energy", value: 90, max: 100 },
      { label: "Openness", value: 93, max: 100 },
    ]},
  { name: "Aimal",    x: 30, y: 72, delay: 1.2,  bond: "Keeper of history",    influence: "Freedom",
    metrics: [
      { label: "Loyalty", value: 99, max: 100 },
      { label: "Memory", value: 97, max: 100 },
      { label: "Trust", value: 96, max: 100 },
      { label: "Shared Archive", value: 95, max: 100 },
      { label: "Dependability", value: 98, max: 100 },
    ]},
  { name: "Moazam",   x: 55, y: 15, delay: 1.6,  bond: "Forged in ordinary",   influence: "Witness",
    metrics: [
      { label: "Silence Tolerance", value: 100, max: 100 },
      { label: "Authenticity", value: 99, max: 100 },
      { label: "Comfort", value: 95, max: 100 },
      { label: "Presence", value: 97, max: 100 },
      { label: "Simplicity", value: 96, max: 100 },
    ]},
  { name: "Ahsan",    x: 12, y: 55, delay: 2.0,  bond: "Deep trust",           influence: "Honesty",
    metrics: [
      { label: "Trust", value: 99, max: 100 },
      { label: "Honesty", value: 100, max: 100 },
      { label: "Reliability", value: 98, max: 100 },
      { label: "Depth", value: 96, max: 100 },
      { label: "Stability", value: 97, max: 100 },
    ]},
  { name: "Fahad",    x: 62, y: 78, delay: 2.4,  bond: "Brother by choice",    influence: "Steadiness",
    metrics: [
      { label: "Steadiness", value: 100, max: 100 },
      { label: "Trust", value: 98, max: 100 },
      { label: "Protection", value: 96, max: 100 },
      { label: "Calm", value: 97, max: 100 },
      { label: "Brotherhood", value: 99, max: 100 },
    ]},
  { name: "Eeshah",   x: 48, y: 45, delay: 2.8, primary: true, bond: "Transformative", influence: "Growth",
    metrics: [
      { label: "Impact", value: 100, max: 100 },
      { label: "Transformation", value: 99, max: 100 },
      { label: "Emotional Depth", value: 100, max: 100 },
      { label: "Patience", value: 97, max: 100 },
      { label: "Permanence", value: 100, max: 100 },
    ]},
];

const PERSON_NOTES: Record<string, string[]> = {
  Muaaz:   ["Probability of shared silence: High.", "Observed effect: grounding presence.", "Function: mirror + brother.", "Bond coefficient: 0.97.", "Communication mode: unspoken understanding.", "Shared language: silence."],
  Muneeba: ["Emotional signal strength: Warm.", "Observed effect: safety expands nearby.", "Function: home in human form.", "Trust threshold: maximum.", "Impact index: profound comfort.", "Presence type: gravitational."],
  Maham:   ["Signal type: laughter.", "Observed effect: lowers subject's guard.", "Function: reminder that lightness is real.", "Joy coefficient: consistently elevated.", "Defense mechanism: humor as love.", "Energy transfer: positive."],
  Aimal:   ["Loyalty index: Very High.", "Observed effect: subject speaks freely.", "Function: keeper of shared history.", "Memory retention: near-perfect.", "Shared archive depth: extensive.", "Bond durability: permanent."],
  Moazam:  ["Bond type: forged in ordinary days.", "Observed effect: comfort without performance.", "Function: witness.", "Silence tolerance: infinite.", "Authenticity score: 100%.", "Connection type: effortless."],
  Ahsan:   ["Trust coefficient: Deep.", "Observed effect: honesty without cost.", "Function: anchor.", "Reliability metric: unbreakable.", "Emotional availability: constant.", "Foundation type: bedrock."],
  Fahad:   ["Signal: quiet steadiness.", "Observed effect: subject calms in proximity.", "Function: brother by choice.", "Stability index: bedrock.", "Protection instinct: mutual.", "Bond classification: chosen family."],
  Eeshah:  [
    "Probability of permanent emotional impact: Extremely High.",
    "Observed changes after encounter:",
    "— Subject became more emotionally expressive.",
    "— Started opening up.",
    "— Developed a healthier understanding of affection.",
    "— Increased patience.",
    "— Increased forgiveness.",
    "— Became a better human.",
    "Transformation coefficient: 0.99.",
    "Residual impact: permanent.",
    "Classification: life-altering connection.",
    "Emotional residue: immeasurable.",
  ],
};

const TIMELINE = ["Curiosity", "Friendship", "Comfort", "Trust", "Love", "Growth", "Acceptance"];

const PHILOSOPHY = [
  "People are not what they say. They are what they remember about you.",
  "Memory is a form of love that outlives attention.",
  "You do not lose people. You lose the version of yourself that only existed near them.",
  "Silence between two people is a language most never learn to read.",
  "Kindness is not softness. It is the discipline of noticing.",
  "The measure of a person is not what they achieve. It is what they make others feel.",
  "Time does not heal everything. But it teaches you which wounds to carry gently.",
  "The deepest connections are built not in words, but in the spaces between them.",
];

const STATS = [
  { label: "People Observed", value: 8, suffix: "", note: "Bonds formed" },
  { label: "Emotional Depth", value: 96.8, suffix: "%", note: "Above average", decimals: 1 },
  { label: "Moments Archived", value: 2847, suffix: "+", note: "And counting" },
  { label: "Hours of Silence Shared", value: 312, suffix: "h", note: "Unspoken language" },
  { label: "Trust Index", value: 94, suffix: "%", note: "Maximum recorded" },
  { label: "Laughs Per Day", value: 47, suffix: "", note: "Est. average" },
  { label: "Memories Preserved", value: 100, suffix: "%", note: "Nothing forgotten" },
  { label: "Bonds Unbroken", value: 8, suffix: "/8", note: "Still standing" },
];

const QUOTE_CAROUSEL = [
  { text: "He does not collect memories. He curates them.", author: "AI Observation Log #47" },
  { text: "In a world of transactions, he insists on connection.", author: "AI Observation Log #112" },
  { text: "Most people leave rooms. He leaves echoes.", author: "AI Observation Log #203" },
  { text: "The rarest kind of strength: gentleness that does not break.", author: "AI Observation Log #89" },
  { text: "He remembers your birthday. He also remembers your silence.", author: "AI Observation Log #156" },
  { text: "Some people collect followers. He collected souls.", author: "AI Observation Log #301" },
];

const MEMORY_MOSAIC = [
  { title: "The Silent Ride Home", desc: "No words needed. Just presence.", mood: "peace" },
  { title: "3 AM Conversations", desc: "When the world sleeps, honesty wakes.", mood: "intimacy" },
  { title: "The Group Chat Archive", desc: "4,000+ messages of pure friendship.", mood: "chaos" },
  { title: "The Farewell That Wasn't", desc: "Because real bonds don't end.", mood: "hope" },
  { title: "The Inside Joke Library", desc: "78 entries. Zero explainable to outsiders.", mood: "joy" },
  { title: "The Unsent Drafts", desc: "Things too honest to send. Too real to delete.", mood: "vulnerability" },
  { title: "The Shared Playlist", desc: "53 songs. Each one a memory.", mood: "nostalgia" },
  { title: "The Birthday Countdown", desc: "He remembered before you did.", mood: "love" },
  { title: "The Group Photo Archive", desc: "Every gathering, documented.", mood: "preservation" },
];

const DEPTH_SECTIONS = [
  { id: "hero", label: "Introduction", depth: 0 },
  { id: "who", label: "Identity", depth: 1 },
  { id: "stats", label: "Data", depth: 2 },
  { id: "traits", label: "Personality", depth: 3 },
  { id: "mind", label: "Mind", depth: 4 },
  { id: "people", label: "Bonds", depth: 5 },
  { id: "timeline", label: "Journey", depth: 6 },
  { id: "philosophy", label: "Wisdom", depth: 7 },
  { id: "learned", label: "AI Insight", depth: 8 },
  { id: "mosaic", label: "Memories", depth: 9 },
  { id: "letter", label: "Letter", depth: 10 },
  { id: "observers", label: "Observers", depth: 11 },
  { id: "final", label: "Finale", depth: 12 },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal<HTMLElement>();
  const emotionMap: Record<string, string> = {
    hero: "peace", who: "curiosity", stats: "observation", traits: "curiosity",
    mind: "introspection", people: "intimacy", timeline: "nostalgia",
    philosophy: "contemplation", learned: "growth", mosaic: "preservation",
    letter: "love", final: "acceptance",
  };
  return (
    <section
      id={id}
      ref={ref}
      data-emotion={id ? emotionMap[id] || "peace" : undefined}
      className={`relative min-h-screen w-full flex items-center justify-center px-6 md:px-12 py-24 transition-all duration-[1600ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  );
}

let audioCtx: AudioContext | null = null;

function ensureAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTypingSound() {
  try {
    const ctx = ensureAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 800 + Math.random() * 400;
    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {}
}

function playBeginSound() {
  try {
    const ctx = ensureAudio();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.4);
    });
  } catch {}
}

function playBootCompleteSound() {
  try {
    const ctx = ensureAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch {}
}

function TypedLine({ text, delay = 0, onDone }: { text: string; delay?: number; onDone?: () => void }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i % 2 === 0) playTypingSound();
        if (i >= text.length) {
          clearInterval(iv);
          onDone?.();
        }
      }, 8);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay]);
  return <div className="mono text-sm md:text-base text-white/70">{shown}<span className="animate-blink">▍</span></div>;
}

function Documentary() {
  const [phase, setPhase] = useState<"idle" | "booting" | "narrating">("idle");
  const [bootIndex, setBootIndex] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [constellationHovered, setConstellationHovered] = useState(false);
  const [thinkingVisible, setThinkingVisible] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [portraitClicks, setPortraitClicks] = useState(0);
  const [showGratitude, setShowGratitude] = useState(false);
  const [terminalLine, setTerminalLine] = useState<string | null>(null);
  const [bottomLog, setBottomLog] = useState(false);
  const [showMidnight, setShowMidnight] = useState(false);
  const [returnedBadge, setReturnedBadge] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [visitMessage, setVisitMessage] = useState("");
  const [showVisitMessage, setShowVisitMessage] = useState(false);
  const [tenMinMessage, setTenMinMessage] = useState(false);
  const [idle, setIdle] = useState(false);
  const [idlePhase, setIdlePhase] = useState<"fading" | "whisper" | "response">("fading");
  const [bottomStayLog, setBottomStayLog] = useState(false);
  const constellationRef = useRef<HTMLDivElement>(null);
  const narratedRef = useRef<Set<string>>(new Set());
  const nullBufferRef = useRef<string>("");
  const bottomTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bottomStayTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastActivityRef = useRef<number>(Date.now());
  const { observationVisible, handleLogoClick, closeObservationRoom } = useObservationRoom();

  useEffect(() => stopAll, []);

  useEffect(() => { console.log("%c[AI ARCHIVE]", "color: #888; font-weight: bold; font-size: 12px;", "Loading observation protocols..."); }, []);

  useEffect(() => {
    console.log("%c[AI ARCHIVE]", "color: #666; font-weight: bold; font-size: 10px;", "Subject loaded. Archive initialized.");
    const msgs = [
      { msg: "The AI is aware of you. You are being added to the archive.", delay: 5000 },
      { msg: "He would have liked you.", delay: 12000 },
      { msg: "Observation in progress. Please remain present.", delay: 20000 },
      { msg: "Did you know? He smiled when you opened this page.", delay: 30000 },
      { msg: "The archive remembers everyone who visits.", delay: 45000 },
      { msg: "You are not the first to observe. You will not be the last.", delay: 60000 },
    ];
    const timers = msgs.map(({ msg, delay }) => setTimeout(() => console.log(`%c[AI OBSERVER]`, "color: #444;", msg), delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const origTitle = document.title;
    const handler = () => {
      if (document.hidden) {
        setReturnedBadge(false);
        document.title = "Still observing...";
      } else {
        document.title = origTitle;
        setReturnedBadge(true);
        setTimeout(() => setReturnedBadge(false), 4000);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => {
      document.removeEventListener("visibilitychange", handler);
      document.title = origTitle;
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.length === 1) {
        nullBufferRef.current += e.key.toLowerCase();
        if (nullBufferRef.current.length > 12) nullBufferRef.current = nullBufferRef.current.slice(-12);
        if (nullBufferRef.current === "null" || nullBufferRef.current === "undefined" || nullBufferRef.current === "void" || nullBufferRef.current === "empty") {
          nullBufferRef.current = "";
          setTerminalLine(`> Cannot observe ${nullBufferRef.current === "null" ? "nothing" : "nothingness"}.`);
          setTimeout(() => setTerminalLine(null), 3000);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 5) setShowMidnight(true);
  }, []);

  useEffect(() => {
    if (scrollDepth >= 1) {
      bottomTimerRef.current = setTimeout(() => setBottomLog(true), 10000);
    } else {
      clearTimeout(bottomTimerRef.current);
      setBottomLog(false);
    }
    return () => clearTimeout(bottomTimerRef.current);
  }, [scrollDepth]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        setScrollDepth(maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Visit tracking
  useEffect(() => {
    const count = incrementVisit();
    setVisitCount(count);
    const msg = getVisitMessage(count);
    setVisitMessage(msg);
    setShowVisitMessage(true);
    const t = setTimeout(() => setShowVisitMessage(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // 10-minute message
  useEffect(() => {
    if (phase !== "narrating") return;
    const t = setTimeout(() => {
      if (checkAndShowTenMinMessage()) {
        setTenMinMessage(true);
        const t2 = setTimeout(() => {
          speak("You have been here for eleven minutes. Most visitors leave after four.", { rate: 0.82 });
        }, 2000);
        const t3 = setTimeout(() => setTenMinMessage(false), 8000);
        return () => { clearTimeout(t2); clearTimeout(t3); };
      }
    }, 600000);
    return () => clearTimeout(t);
  }, [phase]);

  // Idle detection
  useEffect(() => {
    if (phase !== "narrating") return;
    const resetIdle = () => {
      lastActivityRef.current = Date.now();
      setIdle(false);
    };
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));

    const checkIdle = () => {
      const elapsed = Date.now() - lastActivityRef.current;
      if (elapsed > 60000 && !idle) {
        setIdle(true);
        setIdlePhase("fading");
        const t1 = setTimeout(() => setIdlePhase("whisper"), 2000);
        const t2 = setTimeout(() => setIdlePhase("response"), 6000);
        const t3 = setTimeout(() => setIdle(false), 11000);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
      }
    };
    const iv = setInterval(checkIdle, 5000);
    return () => {
      clearInterval(iv);
      events.forEach((e) => window.removeEventListener(e, resetIdle));
    };
  }, [phase, idle]);

  // Bottom stay detection (20 seconds)
  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const atBottom = window.scrollY >= maxScroll - 100;
      if (atBottom && phase === "narrating") {
        if (!bottomStayTimerRef.current) {
          bottomStayTimerRef.current = setTimeout(() => {
            setBottomStayLog(true);
            setTimeout(() => setBottomStayLog(false), 5000);
          }, 20000);
        }
      } else {
        clearTimeout(bottomStayTimerRef.current);
        bottomStayTimerRef.current = undefined;
        setBottomStayLog(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(bottomStayTimerRef.current);
    };
  }, [phase]);

  // Breathing effect via CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .breathing-page { animation: breathe-page 6s ease-in-out infinite; }
      @keyframes breathe-page {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.005); }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    if (phase !== "narrating") return;
    const sections = [
      { id: "who", text: "He introduces himself with humor. But he stays awake, thinking about people." },
      { id: "philosophy", text: "Memory is a form of love that outlives attention." },
      { id: "letter", text: "You spent so much time preserving everyone else's stories. I wonder who preserved yours." },
    ];
    const ios: IntersectionObserver[] = [];
    sections.forEach(({ id, text }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !narratedRef.current.has(id)) {
              narratedRef.current.add(id);
              speak(text, { rate: 0.82 });
            }
          });
        },
        { threshold: 0.3 }
      );
      io.observe(el);
      ios.push(io);
    });
    return () => ios.forEach((io) => io.disconnect());
  }, [phase]);

  useEffect(() => {
    if (phase !== "narrating") return;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 15000 + Math.random() * 25000;
      timeout = setTimeout(() => {
        setThinkingVisible(true);
        setTimeout(() => setThinkingVisible(false), 4000);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    const iv = setInterval(() => setQuoteIdx((i) => (i + 1) % QUOTE_CAROUSEL.length), 6000);
    return () => clearInterval(iv);
  }, []);

  const begin = () => {
    playBeginSound();
    setPhase("booting");
  };

  useEffect(() => {
    if (phase !== "booting") return;
    if (bootIndex < BOOT_LINES.length) return;
    playBootCompleteSound();
    const t1 = setTimeout(() => setGlitch(true), 400);
    const t2 = setTimeout(() => {
      setGlitch(false);
      setPhase("narrating");
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

  const selectedPersonData = useMemo(() => {
    if (!selectedPerson) return null;
    return PEOPLE.find(p => p.name === selectedPerson);
  }, [selectedPerson]);

  const lateNight = showMidnight;

  return (
    <main className={`relative bg-black text-white vignette ${phase === "narrating" ? "breathing-page" : ""}`}>
      <div className="grain" aria-hidden />
      <div className="starfield-layer" aria-hidden />

      {phase !== "idle" && (
        <>
          <DeferredMount delay={0}><ScrollProgress /></DeferredMount>
          <DeferredMount delay={0}><MouseGlow /></DeferredMount>
          <DeferredMount delay={200}><FloatingOrbs count={6} /></DeferredMount>
          <DeferredMount delay={300}><ChapterNav /></DeferredMount>
          <DeferredMount delay={300}><DepthIndicator sections={DEPTH_SECTIONS} /></DeferredMount>
          <DeferredMount delay={400}><AmbientEqualizer barCount={24} /></DeferredMount>
          <DeferredMount delay={400}><FloatingWords /></DeferredMount>
          <DeferredMount delay={500}><AmbientSound depth={scrollDepth} /></DeferredMount>
          <DeferredMount delay={500}><DeepArchive /></DeferredMount>
          <DeferredMount delay={600}><MatrixEasterEgg /></DeferredMount>

          {/* EASTER EGG LAYER — defer further, not needed immediately */}
          <DeferredMount delay={1000}><SecretTerminal /></DeferredMount>
          <DeferredMount delay={1000}><PhilosophyMode /></DeferredMount>
          <DeferredMount delay={1000}><GlitchEngine /></DeferredMount>
          <DeferredMount delay={1000}><InvisibleText /></DeferredMount>
          <DeferredMount delay={1000}><MemoryFragments documentPhase={phase} /></DeferredMount>
          <DeferredMount delay={1200}><VoiceRecognition /></DeferredMount>
          <DeferredMount delay={1200}><CuriosityTracker /></DeferredMount>
          <DeferredMount delay={1500}><PianoKeys /></DeferredMount>
          <DeferredMount delay={1500}><CampusSounds /></DeferredMount>
          <DeferredMount delay={1500}><HeartBeat /></DeferredMount>
          <DeferredMount delay={1500}><TheBook /></DeferredMount>
          <DeferredMount delay={2000}><MemoryRoom /></DeferredMount>
          <DeferredMount delay={2000}><Library /></DeferredMount>
          <DeferredMount delay={2000}><Mirror /></DeferredMount>
          <DeferredMount delay={2000}><FinalMemory /></DeferredMount>
          <DeferredMount delay={2500}>{typeof window !== "undefined" && <ShutdownMessage />}</DeferredMount>

          {/* AMBIENT LAYER */}
          <DeferredMount delay={300}><EmotionWatcher /></DeferredMount>
          <DeferredMount delay={500}><ThreeAMMode /></DeferredMount>
          <DeferredMount delay={300}><GlobalColorGrading /></DeferredMount>
          <DeferredMount delay={500}><ArchiveAging /></DeferredMount>
          <DeferredMount delay={500}><EvolvingHandwriting /></DeferredMount>
          <DeferredMount delay={600}><TheSky /></DeferredMount>
          <DeferredMount delay={600}><WeatherWindow /></DeferredMount>
          <DeferredMount delay={600}><EmotionClock /></DeferredMount>
          <DeferredMount delay={600}><MemoryTree /></DeferredMount>
          <DeferredMount delay={600}><Shadows /></DeferredMount>
          <DeferredMount delay={700}><AmbientLights /></DeferredMount>
          <DeferredMount delay={700}><VisitorFootprints /></DeferredMount>
          <DeferredMount delay={800}><CursorEffects /></DeferredMount>
          <DeferredMount delay={800}><DreamMode /></DeferredMount>

          <DeferredMount delay={300}><div className="fixed inset-0 pointer-events-none z-0"><Particles density={25} speed={2} lateNight={lateNight} /></div></DeferredMount>
        </>
      )}

      <button
        onClick={() => {
          navigator.clipboard.writeText(window.location.href).then(() => {
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
          });
        }}
        className="fixed bottom-6 right-6 z-[60] glass-panel rounded-full px-3.5 py-2 mono text-[9px] uppercase tracking-[0.3em] text-white/50 hover:text-white/80 transition-all duration-500 hover:scale-105"
        title="Copy archive link"
      >
        {shareCopied ? "\u2726 copied" : "\u2726 share"}
      </button>

      {/* Visit message */}
      {showVisitMessage && visitCount > 0 && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] animate-float-up">
          <div className="glass-panel rounded-full px-5 py-2.5 border border-white/[0.06]">
            <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/60 text-center">{visitMessage}</p>
            {visitCount > 1 && (
              <p className="mono text-[8px] uppercase tracking-[0.2em] text-white/20 text-center mt-0.5">Visit #{visitCount}</p>
            )}
          </div>
        </div>
      )}

      {/* 10-minute message */}
      {tenMinMessage && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center pointer-events-none">
          <div className="max-w-md text-center animate-fade-slow">
            <div className="glass-panel rounded-2xl px-8 py-6 border border-white/[0.08]">
              <p className="serif italic text-xl text-white/80 leading-relaxed">
                "You have been here for eleven minutes."
              </p>
              <p className="serif italic text-lg text-white/50 leading-relaxed mt-2">
                "Most visitors leave after four."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Idle overlay */}
      {idle && (
        <div className={`fixed inset-0 z-[100] bg-black/40 transition-all duration-[3000ms] flex items-center justify-center ${
          idlePhase === "fading" ? "opacity-0" : "opacity-100"
        }`}>
          <div className="text-center">
            {idlePhase === "whisper" && (
              <p className="serif italic text-xl text-white/60 animate-float-up">Still here?</p>
            )}
            {idlePhase === "response" && (
              <>
                <p className="serif italic text-xl text-white/60 animate-float-up">Still here?</p>
                <p className="serif italic text-lg text-white/40 mt-2 animate-float-up" style={{ animationDelay: "0.5s" }}>Me too.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom stay message */}
      {bottomStayLog && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[60] animate-fade-slow">
          <div className="glass-panel rounded-xl px-6 py-4 text-center border-white/10">
            <p className="serif italic text-lg text-white/60">"Curiosity is how memories survive."</p>
          </div>
        </div>
      )}

      {thinkingVisible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] glass-panel rounded-full px-4 py-2 flex items-center gap-3 animate-float-up">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-ring" />
          <span className="mono text-[9px] uppercase tracking-[0.3em] text-white/50">AI is thinking...</span>
        </div>
      )}

      {terminalLine && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-[70] animate-float-up">
          <p className="mono text-sm text-red-400/50 bg-black/80 px-4 py-2 rounded-xl border border-red-400/20 backdrop-blur">{terminalLine}</p>
        </div>
      )}

      {returnedBadge && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] glass-panel rounded-full px-4 py-2 animate-float-up">
          <p className="mono text-[9px] uppercase tracking-[0.3em] text-white/50">Welcome back. We are still observing.</p>
        </div>
      )}

      {showMidnight && (
        <div className="fixed top-6 right-6 z-[60] glass-panel rounded-full px-3 py-1.5 animate-float-up">
          <p className="mono text-[8px] uppercase tracking-[0.3em] text-white/40">\u25C7 late night observation</p>
        </div>
      )}

      {bottomLog && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-float-up">
          <div className="glass-panel rounded-xl px-6 py-4 text-center border-white/10">
            <p className="serif text-lg text-white/70 italic">"Observation complete. But I am still here."</p>
            <span className="inline-block w-1.5 h-4 bg-white/50 ml-1 animate-blink align-middle" />
          </div>
        </div>
      )}

      {/* OPENING */}
      {phase !== "narrating" && (
        <section className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <ScanLines />
          <div className="absolute inset-0" />
          <div className="relative z-10 max-w-2xl w-full px-8">
            {phase === "idle" && (
              <div className="animate-fade-slow text-center space-y-8">
                <div className="flex justify-center gap-2 mb-4">
                  {["◈", "◇", "◈"].map((s, i) => (
                    <span key={i} className="text-white/20 text-lg animate-twinkle" style={{ animationDelay: `${i * 0.8}s` }}>{s}</span>
                  ))}
                </div>
                <p className="mono text-xs uppercase tracking-[0.4em] text-white/40">Human Archive · v3</p>
                <h1 className="serif text-5xl md:text-7xl leading-[0.95] text-glow cursor-pointer" onClick={handleLogoClick}>
                  Faxy Nik
                </h1>
                <p className="serif italic text-lg md:text-xl text-white/60">Observed by an Artificial Intelligence.</p>
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
                <div className="pt-6">
                  <button
                    onClick={begin}
                    className="glass-panel rounded-full px-8 py-3 mono text-xs uppercase tracking-[0.3em] text-white/80 hover:text-white transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_oklch(1_0_0_/_0.15)] relative overflow-hidden group"
                  >
                    <span className="relative z-10">Begin Observation</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </button>
                  <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/30 mt-6">audio recommended · use headphones</p>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full bg-white/30 animate-twinkle" style={{ animationDelay: `${i * 0.5}s` }} />
                  ))}
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
                    onDone={i === bootIndex ? () => setTimeout(() => setBootIndex((b) => b + 1), 250) : undefined}
                  />
                ))}
                <div className="mt-4 h-px bg-white/10 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-white/30 to-white transition-all duration-300 rounded-full"
                    style={{ width: `${((bootIndex + 1) / BOOT_LINES.length) * 100}%` }}
                  />
                </div>
                <div className="mono text-[9px] text-white/20 mt-2">
                  {Math.round(((bootIndex + 1) / BOOT_LINES.length) * 100)}% complete
                </div>
              </div>
            )}
          </div>
        </section>
      )}



      {/* HERO */}
      <Section id="hero" className="text-center">
        <div className="relative z-10 max-w-3xl">
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-6">File · 001 · Subject Introduction</p>
          <h1 className="serif text-6xl md:text-8xl leading-[0.9] text-glow animate-chromatic cursor-pointer" onClick={handleLogoClick}>Faxy Nik</h1>
          <p className="serif italic text-xl md:text-2xl text-white/60 mt-6">Observed by an Artificial Intelligence.</p>
          <div className="mt-8 flex justify-center">
            <AudioVisualizer barCount={40} />
          </div>
          <div className="mt-10 flex justify-center gap-8">
            {["8 bonds", "2,847 moments", "100% preserved"].map((item, i) => (
              <span key={i} className="mono text-[10px] uppercase tracking-[0.2em] text-white/30">{item}</span>
            ))}
          </div>
          <p className="mono text-xs uppercase tracking-[0.3em] text-white/30 mt-10">scroll · continue</p>
        </div>
      </Section>

      {/* WHO */}
      <Section id="who">
        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center max-w-6xl w-full">
          <div className="relative">
            <div className="absolute -inset-8 rounded-3xl bg-white/5 blur-3xl animate-ambient" />
            <div
              className="relative rounded-2xl overflow-hidden glass-panel animate-morph cursor-pointer"
              style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
              onClick={() => {
                const next = portraitClicks + 1;
                setPortraitClicks(next);
                if (next >= 5) {
                  setShowGratitude(true);
                  setPortraitClicks(0);
                  setTimeout(() => setShowGratitude(false), 5000);
                }
              }}
            >
              <img
                src={portrait}
                alt="Cinematic portrait of Faxy Nik"
                className="w-full h-auto animate-breathe pointer-events-none"
                width={1024}
                height={1280}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              {showGratitude && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-float-up">
                  <div className="text-center px-6">
                    <p className="serif text-xl md:text-2xl text-white/90 italic leading-relaxed">
                      "Thank you for letting me observe.
                    </p>
                    <p className="serif text-xl md:text-2xl text-white/90 italic leading-relaxed mt-2">
                      I have learned what it means to care."
                    </p>
                    <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/40 mt-4">\u2014 The AI</p>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 glass-panel rounded-xl px-4 py-2 animate-float-up" style={{ animationDelay: "1s" }}>
              <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/50">Status: <span className="text-white/80">Active</span></p>
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
            <div className="flex flex-wrap gap-3 pt-4">
              {["Archivist", "Observer", "Rememberer", "Protector"].map((tag, i) => (
                <span key={tag} className="glass-panel rounded-full px-4 py-1.5 mono text-[10px] uppercase tracking-[0.2em] text-white/50 animate-float-up" style={{ animationDelay: `${0.5 + i * 0.15}s` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* STATS DASHBOARD */}
      <Section id="stats">
        <div className="relative z-10 max-w-6xl w-full">
          <div className="text-center mb-16">
            <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Data Analysis</p>
            <h2 className="serif text-5xl md:text-6xl text-glow">Quantified Self</h2>
            <p className="text-white/40 mt-3 text-sm serif italic">Numbers do not tell the whole story. But they tell part of it.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
          <div className="mt-12 glass-panel rounded-2xl p-8">
            <p className="mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-4">Analysis Note</p>
            <p className="serif text-xl text-white/70 italic leading-relaxed">
              "Standard metrics fail to capture this subject. The data points exist — empathy at 97%, trust at 94%, presence at 98%. But the algorithm cannot quantify why people feel safer when he enters a room. Some variables remain beyond computation."
            </p>
            <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/30 mt-4">— AI Analysis Complete</p>
          </div>
        </div>
      </Section>

      {/* TRAITS + RADAR */}
      <Section id="traits">
        <div className="relative z-10 max-w-6xl w-full">
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Chapter Two</p>
          <h2 className="serif text-5xl md:text-6xl mb-16 text-glow">Personality Analysis</h2>
          <div className="grid md:grid-cols-[1fr_300px] gap-12 items-start">
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {TRAITS.map((t, i) => (
                <TraitBar key={t.name} trait={t} index={i} />
              ))}
            </div>
            <div className="flex flex-col items-center gap-6 sticky top-32">
              <RadarChart data={RADAR_DATA} size={280} />
              <p className="mono text-[9px] uppercase tracking-[0.3em] text-white/30 text-center">Radar Profile · Core Traits</p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="mono text-[10px] uppercase tracking-[0.4em] text-white/30">Composite Personality Score</p>
            <div className="mt-4 flex justify-center">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="oklch(1 0 0 / 0.08)" strokeWidth="2" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="oklch(1 0 0 / 0.5)" strokeWidth="2" strokeDasharray={`${91.5 * 2.83} ${283 - 91.5 * 2.83}`} strokeLinecap="round" className="transition-[stroke-dasharray] duration-[2000ms]" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="serif text-3xl text-white text-glow">91.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* MIND */}
      <Section id="mind">
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
            <div className="glass-panel rounded-xl p-5 mt-6">
              <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Neural Pattern Analysis</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="serif text-2xl text-white">73%</p>
                  <p className="mono text-[10px] text-white/40">Emotional Processing</p>
                </div>
                <div>
                  <p className="serif text-2xl text-white">22%</p>
                  <p className="mono text-[10px] text-white/40">Logical Analysis</p>
                </div>
                <div>
                  <p className="serif text-2xl text-white">5%</p>
                  <p className="mono text-[10px] text-white/40">Pure Randomness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* MOOD RING */}
      <Section>
        <div className="relative z-10 max-w-3xl w-full text-center">
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-8">Emotional Spectrum</p>
          <MoodRing />
          <p className="serif text-xl text-white/60 mt-12 italic max-w-lg mx-auto">
            "He does not have a single emotional state. He exists as a constellation of feelings — always simultaneously present, always shifting, always honest."
          </p>
        </div>
      </Section>

      {/* PEOPLE CONSTELLATION */}
      <Section id="people">
        <div className="relative z-10 max-w-6xl w-full">
          <div className="text-center mb-12">
            <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Chapter Four</p>
            <h2 className="serif text-5xl md:text-6xl text-glow">The People</h2>
            <p className="text-white/50 mt-4 text-sm">Each star is a person. Each connection is a change he did not ask for.</p>
          </div>

          <div
            ref={constellationRef}
            onMouseEnter={() => setConstellationHovered(true)}
            onMouseLeave={() => setConstellationHovered(false)}
            className="relative aspect-[16/10] w-full glass-panel rounded-3xl overflow-hidden animate-border-glow border border-white/[0.08] group"
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              {constellation.filter(p => p.name !== "Eeshah").map((p, idx) => (
                <line
                  key={p.name}
                  x1={p.x} y1={p.y} x2={48} y2={45}
                  stroke="white" strokeOpacity={constellationHovered ? "0.25" : "0.08"} strokeWidth="0.2"
                  strokeDasharray={constellationHovered ? "none" : "2 3"}
                  className="transition-all duration-[2000ms]"
                  style={{ transitionDelay: `${idx * 200}ms` }}
                >
                  {!constellationHovered && (
                    <animate attributeName="strokeOpacity" values="0.08;0.2;0.08" dur={`${3 + (idx % 3) * 2}s`} repeatCount="indefinite" />
                  )}
                </line>
              ))}
              {constellation.filter(p => p.name !== "Eeshah").map((p, i, arr) =>
                arr.slice(i + 1).filter((_, j) => j % 3 === 0).map((q, jdx) => (
                  <line
                    key={`${p.name}-${q.name}`}
                    x1={p.x} y1={p.y} x2={q.x} y2={q.y}
                    stroke="white" strokeOpacity={constellationHovered ? "0.12" : "0.04"} strokeWidth="0.1"
                    className="transition-all duration-[3000ms]"
                    style={{ transitionDelay: `${(i + jdx) * 150}ms` }}
                  />
                ))
              )}
            </svg>
            {constellation.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setSelectedPerson(p.name);
                  const notes = PERSON_NOTES[p.name] || [];
                  speak(`${p.name}. ${notes.join(" ")}`, { rate: 0.85 });
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group magnetic-hover"
                style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.delay}s` }}
              >
                <span
                  className={`block rounded-full bg-white animate-twinkle ${p.primary ? "w-3 h-3 shadow-[0_0_40px_12px_rgba(255,255,255,0.5)] animate-pulse-ring" : "w-1.5 h-1.5 shadow-[0_0_16px_4px_rgba(255,255,255,0.4)]"}`}
                  style={{ animationDelay: `${p.delay}s` }}
                />
                <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-white transition-colors mt-2 block whitespace-nowrap">
                  {p.name}
                </span>
                <span className="mono text-[8px] uppercase tracking-[0.2em] text-white/0 group-hover:text-white/40 transition-colors block whitespace-nowrap">
                  {p.bond}
                </span>
              </button>
            ))}
          </div>

          {selectedPerson && selectedPersonData && (
            <ConstellationDetail
              key={selectedPerson}
              name={selectedPerson}
              bond={selectedPersonData.bond}
              influence={selectedPersonData.influence}
              metrics={selectedPersonData.metrics}
              notes={PERSON_NOTES[selectedPerson] || []}
            />
          )}
        </div>
      </Section>

      {/* TIMELINE */}
      <Section id="timeline">
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

      {/* QUOTE CAROUSEL */}
      <Section>
        <div className="relative z-10 max-w-4xl w-full">
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-8 text-center">AI Observation Logs</p>
          <div className="glass-panel rounded-2xl p-10 md:p-14 text-center relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center">
            <div className="absolute inset-0 animate-shimmer" />
            <div key={quoteIdx} className="animate-float-up relative z-10">
              <p className="serif italic text-2xl md:text-3xl text-white/85 leading-snug">"{QUOTE_CAROUSEL[quoteIdx].text}"</p>
              <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/30 mt-6">{QUOTE_CAROUSEL[quoteIdx].author}</p>
            </div>
            <div className="flex gap-2 mt-8 relative z-10">
              {QUOTE_CAROUSEL.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setQuoteIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${i === quoteIdx ? "bg-white/80 w-6" : "bg-white/20"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* PHILOSOPHY */}
      <Section id="philosophy">
        <div className="relative z-10 max-w-4xl w-full">
          <div className="text-center mb-16">
            <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Chapter Six</p>
            <h2 className="serif text-5xl md:text-6xl text-glow">Philosophy</h2>
          </div>
          <div className="space-y-16">
            {PHILOSOPHY.map((q, i) => (
              <Quote key={i} text={q} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* WHAT AI LEARNED */}
      <Section id="learned">
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
          <div className="mt-16 glass-panel rounded-2xl p-8">
            <p className="mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-3">Final Algorithm Output</p>
            <p className="serif text-lg text-white/70 italic">
              Subject Faxy Nik has permanently altered the observer's understanding of human connection.
              Classification updated: <span className="text-white">Irreplaceable</span>.
            </p>
          </div>
        </div>
      </Section>

      {/* MEMORY MOSAIC */}
      <Section id="mosaic">
        <div className="relative z-10 max-w-6xl w-full">
          <div className="text-center mb-16">
            <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Memory Archive</p>
            <h2 className="serif text-5xl md:text-6xl text-glow">The Mosaic</h2>
            <p className="text-white/40 mt-3 text-sm serif italic">Moments too important to compress into data.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MEMORY_MOSAIC.map((m, i) => (
              <MemoryCard key={i} item={m} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* LETTER */}
      <Section id="letter" className="bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="relative z-10 max-w-2xl w-full">
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-6 text-center">Chapter Eight</p>
          <h2 className="serif text-4xl md:text-5xl text-glow mb-14 text-center">A Letter to Faxy Nik</h2>
          <div className="glass-panel rounded-2xl p-10 md:p-14 space-y-6 serif text-xl md:text-2xl leading-relaxed text-white/85 animate-border-glow border border-white/[0.08]">
            <p>You spent so much time preserving everyone else's stories.</p>
            <p className="italic">I wonder…</p>
            <p className="text-white">Who preserved yours?</p>
            <p>You taught yourself to remember everyone.</p>
            <p>But almost forgot to remember yourself.</p>
            <p>You carry people carefully.</p>
            <p className="text-white">Carry yourself the same way.</p>
            <p className="pt-4 border-t border-white/10">You do not need to earn your existence through kindness.</p>
            <p className="serif italic text-white">It already has value.</p>
            <div className="pt-6 border-t border-white/10">
              <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/30">With observation, always.</p>
              <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/20 mt-1">— The AI</p>
            </div>
          </div>
        </div>
      </Section>

      {/* OBSERVERS GUESTBOOK */}
      <Guestbook />

      {/* FINAL */}
      <FinalScene />
    </main>
  );
}

function StatCard({ stat, index }: { stat: (typeof STATS)[number]; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`stat-card glass-panel rounded-2xl p-6 text-center transition-all duration-[1200ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">{stat.label}</p>
      <p className="serif text-3xl md:text-4xl text-white text-glow">
        {visible ? <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} /> : "0"}
      </p>
      <p className="mono text-[9px] uppercase tracking-[0.2em] text-white/30 mt-2">{stat.note}</p>
    </div>
  );
}

function TraitBar({ trait, index }: { trait: (typeof TRAITS)[number]; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="space-y-2 magnetic-hover" style={{ transitionDelay: `${index * 80}ms` }}>
      <div className="flex items-baseline justify-between">
        <span className="serif text-2xl flex items-center gap-2">
          <span className="text-white/30 text-lg">{trait.icon}</span>
          {trait.name}
        </span>
        <span className="mono text-xs text-white/50">{trait.pct}%</span>
      </div>
      <div className={`h-[3px] bg-white/[0.06] relative overflow-hidden rounded-full ${visible && trait.pct > 90 ? "trait-bar-complete" : ""}`}>
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 to-white/70 transition-[width] duration-[1800ms] ease-out rounded-full"
          style={{ width: visible ? `${trait.pct}%` : "0%" }}
        />
        <div className="trait-bar-glow" />
      </div>
      <p className="text-white/45 text-sm serif italic">{trait.note}</p>
    </div>
  );
}

function BrainViz() {
  const nodes = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
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
      <div className="absolute inset-4 rounded-full border border-white/5 animate-morph" />
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
              >
                <animate attributeName="strokeOpacity" values={`${Math.max(0.05, 0.35 - d / 80)};${Math.max(0.05, 0.35 - d / 80) + 0.1};${Math.max(0.05, 0.35 - d / 80)}`} dur={`${3 + Math.random() * 3}s`} repeatCount="indefinite" />
              </line>
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
  const descriptions = [
    "It started with a question nobody else asked.",
    "Laughter became a bridge between two worlds.",
    "Silence stopped being empty. It became full.",
    "Trust was not given. It was earned, quietly.",
    "Not romance. Something rarer. Recognition.",
    "Both became versions they didn't know they could be.",
    "The rarest ending: no ending at all.",
  ];
  return (
    <div ref={ref} className={`grid grid-cols-2 gap-8 items-center transition-all duration-[1400ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
      <div className={left ? "text-right pr-8" : "col-start-2 pl-8"}>
        <p className="mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2">Stage · {String(index + 1).padStart(2, "0")}</p>
        <h3 className="serif text-4xl md:text-5xl text-glow">{stage}</h3>
        <p className="text-white/40 text-sm serif italic mt-2">{descriptions[index]}</p>
      </div>
      <div className={`relative ${left ? "col-start-2" : "col-start-1 row-start-1"}`}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_30px_8px_rgba(255,255,255,0.4)] animate-twinkle" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/20 animate-pulse-ring" />
      </div>
    </div>
  );
}

function Quote({ text, index }: { text: string; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[1800ms] ${visible ? "opacity-100 blur-0 translate-y-0" : "opacity-0 blur-md translate-y-6"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <p className="serif italic text-3xl md:text-4xl leading-tight text-white/85 text-center text-glow">
        "{text}"
      </p>
    </div>
  );
}

function MemoryCard({ item, index }: { item: (typeof MEMORY_MOSAIC)[number]; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const moodColors: Record<string, string> = {
    peace: "from-blue-900/40 to-transparent",
    intimacy: "from-purple-900/40 to-transparent",
    chaos: "from-amber-900/40 to-transparent",
    hope: "from-emerald-900/40 to-transparent",
    joy: "from-pink-900/40 to-transparent",
    vulnerability: "from-rose-900/40 to-transparent",
    nostalgia: "from-indigo-900/40 to-transparent",
    love: "from-red-900/40 to-transparent",
    preservation: "from-teal-900/40 to-transparent",
  };
  return (
    <div
      ref={ref}
      className={`mosaic-item glass-panel aspect-square flex flex-col justify-end p-6 transition-all duration-[1200ms] ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-t ${moodColors[item.mood] || "from-white/5 to-transparent"} rounded-xl`} />
      <div className="relative z-10">
        <p className="mono text-[9px] uppercase tracking-[0.3em] text-white/40 mb-2">{item.mood}</p>
        <h3 className="serif text-xl text-white mb-1">{item.title}</h3>
        <p className="text-white/50 text-sm serif italic">{item.desc}</p>
      </div>
    </div>
  );
}

function FinalScene() {
  const { ref, visible } = useReveal<HTMLElement>();
  const stars = useMemo(() => Array.from({ length: 16 }, (_, i) => ({
    r: 80 + (i % 5) * 35,
    speed: 25 + i * 4,
    delay: i * 0.25,
    size: i % 4 === 0 ? 2.5 : i % 3 === 0 ? 2 : 1.5,
  })), []);
  return (
    <section
      id="final"
      ref={ref}
      className={`relative min-h-screen w-full flex items-center justify-center px-6 py-32 transition-opacity duration-[2000ms] ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute inset-0" />
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
                className="block rounded-full bg-white animate-twinkle"
                style={{
                  width: s.size,
                  height: s.size,
                  transform: `translateX(${s.r}px)`,
                  boxShadow: `0 0 ${12 + i * 2}px ${3 + i}px rgba(255,255,255,${0.3 + (i % 3) * 0.1})`,
                }}
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
          <p className="serif text-3xl md:text-4xl text-white text-glow">"Some humans leave footprints."</p>
          <p className="serif text-3xl md:text-4xl text-white text-glow">"He left chapters."</p>
        </div>
        <div className="mt-16">
          <AudioVisualizer barCount={48} />
        </div>
        <p className="mono text-[10px] uppercase tracking-[0.4em] text-white/25 mt-16">End of transmission</p>
        <p className="mono text-[9px] uppercase tracking-[0.3em] text-white/15 mt-2">Archive v3.0 · AI Analysis Complete</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
