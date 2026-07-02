// Minimal browser TTS wrapper. Falls back gracefully if unavailable.
export type NarrationHandle = { cancel: () => void };

let currentUtter: SpeechSynthesisUtterance | null = null;

export function speak(text: string, opts?: { rate?: number; pitch?: number; onEnd?: () => void }): NarrationHandle {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    opts?.onEnd?.();
    return { cancel: () => {} };
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts?.rate ?? 0.88;
  u.pitch = opts?.pitch ?? 0.85;
  u.volume = 1;
  // Prefer a calm, low voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => /Google UK English Male|Daniel|Alex|Samantha/i.test(v.name)) ||
                    voices.find((v) => v.lang.startsWith("en"));
  if (preferred) u.voice = preferred;
  u.onend = () => opts?.onEnd?.();
  currentUtter = u;
  window.speechSynthesis.speak(u);
  return { cancel: () => window.speechSynthesis.cancel() };
}

export function stopAll() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  currentUtter = null;
}
