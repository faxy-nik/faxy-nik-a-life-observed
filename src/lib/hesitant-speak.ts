import { speak, stopAll } from "./narrator";

function randomPauseWord(): string {
  const pauses = ["... ", "… ", " — ", ". ", "… ", "... "];
  return pauses[Math.floor(Math.random() * pauses.length)];
}

function maybeInsertHesitation(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  if (sentences.length <= 1) return text;
  const result: string[] = [];
  for (let i = 0; i < sentences.length; i++) {
    result.push(sentences[i]);
    if (i < sentences.length - 1 && Math.random() < 0.15) {
      result.push(randomPauseWord());
    }
  }
  return result.join("");
}

export function speakWithHesitation(text: string, opts?: { rate?: number; pitch?: number; onEnd?: () => void }) {
  const processed = maybeInsertHesitation(text);
  return speak(processed, opts);
}

export function hesitantSpeak(text: string, opts?: { rate?: number; pitch?: number; onEnd?: () => void }) {
  return speakWithHesitation(text, opts);
}

export { stopAll };
