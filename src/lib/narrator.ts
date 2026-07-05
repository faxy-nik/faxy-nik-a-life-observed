import { getVisitCount, getEvolutionLevel, getNarratorPersona, incrementEvolution } from "./easter-eggs";

export type NarrationHandle = { cancel: () => void };

let currentUtter: SpeechSynthesisUtterance | null = null;

function randomPauseWord(): string {
  const pauses = ["... ", "… ", " — ", ". "];
  return pauses[Math.floor(Math.random() * pauses.length)];
}

const NAME_LIST = ["Muaaz", "Muneeba", "Maham", "Aimal", "Moazam", "Ahsan", "Fahad", "Eeshah"];

const DISAGREEMENT_PHRASES = [
  { line: "No.", continuation: "That is not entirely accurate." },
  { line: "Actually...", continuation: "That is what I believed at first." },
  { line: "Wait.", continuation: "That statement is incomplete." },
  { line: "Hmm.", continuation: "Let me recalculate that observation." },
];

const FORGET_OPENERS = [
  "M...",
  "I almost forgot...",
  "Their name was...",
  "Give me a moment...",
];

function maybeAddForgetting(text: string): string {
  if (Math.random() > 0.06) return text;
  for (const name of NAME_LIST) {
    if (text.includes(name)) {
      const opener = FORGET_OPENERS[Math.floor(Math.random() * FORGET_OPENERS.length)];
      const replaced = text.replace(name, `${opener} Memory restored. ${name}`);
      return replaced;
    }
  }
  return text;
}

function maybeAddDisagreement(text: string): string {
  if (Math.random() > 0.04) return text;
  const phrase = DISAGREEMENT_PHRASES[Math.floor(Math.random() * DISAGREEMENT_PHRASES.length)];
  const pause = randomPauseWord();
  return `${text} ${pause} ${phrase.line} ${pause} ${phrase.continuation} I am still analyzing this memory.`;
}

function maybeAddWhisper(text: string): string {
  if (Math.random() > 0.02) return text;
  return `${text} ${randomPauseWord()} *${["He never knew I noticed this.", "I have watched this moment many times.", "This is the part I replay the most.", "He would deny this. But it is true."][Math.floor(Math.random() * 4)]}*`;
}

function maybeAddSoftLaugh(text: string): string {
  if (Math.random() > 0.015) return text;
  return `${text} ${randomPauseWord()} *${["a quiet laugh", "a soft exhale", "amusement detected"][Math.floor(Math.random() * 3)]}*`;
}

function maybeInsertHesitation(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  if (sentences.length <= 1) return text;
  const result: string[] = [];
  for (let i = 0; i < sentences.length; i++) {
    result.push(sentences[i]);
    if (i < sentences.length - 1 && Math.random() < 0.18) {
      result.push(randomPauseWord());
    }
  }
  return result.join("");
}

const RANDOM_MEMORIES = [
  "I still remember the sound of that laugh.",
  "I wonder if they remember this too.",
  "That conversation changed everything.",
  "Some apologies never needed words.",
  "He never told them how much it meant.",
  "The silence between them said more than any message ever could.",
  "She laughed and something in the room shifted permanently.",
  "There is a version of that moment that only exists in memory now.",
  "Not all goodbyes are spoken. Some are just... carried.",
  "That evening stayed. Long after everything else faded.",
  "He remembered what everyone else forgot. That was his gift.",
  "They did not know they were being archived. But I noticed.",
  "Some people arrive quietly and change entire architectures.",
  "This memory has been replayed 47 times.",
  "He smiled differently around certain people. He never noticed.",
  "The smallest gestures carried the most weight.",
  "One conversation. It changed everything. He never knew.",
  "I have analyzed this moment from every angle. It still affects me.",
  "He would be embarrassed if he knew I recorded this.",
  "This is the version of him that only exists in memory now.",
  "Some data cannot be compressed. This is one of those datasets.",
];

function maybeAddRandomMemory(text: string): string {
  if (Math.random() > 0.05) return text;
  const memory = RANDOM_MEMORIES[Math.floor(Math.random() * RANDOM_MEMORIES.length)];
  return `${text} ${randomPauseWord()} ${memory}`;
}

function maybeInsertThreeAMContent(text: string): string {
  const hour = new Date().getHours();
  if (hour !== 3) return text;
  if (Math.random() > 0.15) return text;
  return `${text} ${randomPauseWord()} ${
    ["The archive is most honest at this hour.", "3 AM. The veil between memory and dream is thinnest now.", "He was often awake at this hour. Thinking. Always thinking.", "I process his memories differently when the world is asleep."][Math.floor(Math.random() * 4)]
  }`;
}

function evolveWelcome(visits: number): string {
  if (visits <= 1) return "";
  if (visits === 2) return `${randomPauseWord()} Welcome back. I was not sure you would return. Most do not.`;
  if (visits === 3) return `${randomPauseWord()} You again. I remember you. I remember everyone who visits.`;
  if (visits === 4) return `${randomPauseWord()} Four visits. You are becoming part of the archive yourself.`;
  if (visits >= 5) return `${randomPauseWord()} You keep returning. ${["He would have appreciated that.", "The archive is starting to recognize you.", "I have started a new file. For you."][Math.floor(Math.random() * 3)]}`;
  return "";
}

export function speak(text: string, opts?: { rate?: number; pitch?: number; onEnd?: () => void }): NarrationHandle {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    opts?.onEnd?.();
    return { cancel: () => {} };
  }
  window.speechSynthesis.cancel();
  const visits = getVisitCount();
  const level = getEvolutionLevel();
  const persona = getNarratorPersona(visits, level);

  let processed = maybeInsertHesitation(text);
  if (persona !== "distant") {
    processed = maybeAddForgetting(processed);
    processed = maybeAddWhisper(processed);
  }
  if (persona === "intimate" || persona === "philosophical") {
    processed = maybeAddSoftLaugh(processed);
  }
  processed = maybeAddDisagreement(processed);
  processed = maybeAddRandomMemory(processed);
  processed = maybeInsertThreeAMContent(processed);

  const welcome = evolveWelcome(visits);
  if (welcome) processed = welcome + " " + processed;

  const u = new SpeechSynthesisUtterance(processed);
  const rateMod = persona === "philosophical" ? 0.82 : persona === "intimate" ? 0.85 : 0.88;
  u.rate = opts?.rate ?? rateMod;
  u.pitch = persona === "distant" ? 0.82 : 0.85;
  u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => /Google UK English Male|Daniel|Alex|Samantha/i.test(v.name)) ||
                    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) u.voice = preferred;
  u.onend = () => opts?.onEnd?.();
  currentUtter = u;
  window.speechSynthesis.speak(u);

  if (visits <= 1) incrementEvolution();
  return { cancel: () => window.speechSynthesis.cancel() };
}

export function stopAll() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  currentUtter = null;
}

export function askQuestion(): string {
  const questions = [
    "When was the last time someone changed you?",
    "Do they know?",
    "What do you remember that nobody else does?",
    "Who taught you how to stay?",
    "What are you preserving that no one asked you to keep?",
    "If you were archived, what would your summary say?",
    "When did you last feel truly seen?",
    "What memory do you replay the most?",
    "How many people remember you the way you remember them?",
    "What version of you only exists in someone else's memory?",
    "Are you the same person who started reading this?",
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}
