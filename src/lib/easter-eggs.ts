const VISIT_KEY = "faxy-nik-visits";
const FRAGMENTS_KEY = "faxy-nik-fragments";
const COMPLETION_KEY = "faxy-nik-completion";
const PIANO_KEY = "faxy-nik-piano";
const FOOTPRINTS_KEY = "faxy-nik-footprints";
const BOOK_KEY = "faxy-nik-book-shown";
const CURIOUS_KEY = "faxy-nik-curious-clicks";
const FINAL_MEMORY_KEY = "faxy-nik-final-memory";

export function getVisitCount(): number {
  try { return Number(localStorage.getItem(VISIT_KEY)) || 0; } catch { return 0; }
}

export function incrementVisit(): number {
  const count = getVisitCount() + 1;
  try { localStorage.setItem(VISIT_KEY, String(count)); } catch {}
  return count;
}

export function getVisitMessage(visits: number): string {
  if (visits <= 1) return "Human detected.";
  if (visits === 2) return "Welcome back.";
  if (visits === 3) return "I remember you.";
  if (visits >= 5) return "You came back.";
  return "I have been expecting you.";
}

export const FRAGMENT_DATA = [
  { id: 0, text: "She taught him that love asks 'What happened?' more than it says 'I love you.'" },
  { id: 1, text: "He proved loyalty simply by standing on his words." },
  { id: 2, text: "She understood jokes before they were spoken." },
  { id: 3, text: "A bottle became unforgettable because of who handed it over." },
  { id: 4, text: "He remembered the silence between words better than the words themselves." },
  { id: 5, text: "She saw versions of him he hadn't met yet." },
  { id: 6, text: "He carried others so gently that some forgot they were being carried." },
  { id: 7, text: "She turned ordinary conversations into places he wanted to live." },
  { id: 8, text: "He never knew how many people considered him home." },
];

export function getFoundFragments(): number[] {
  try { const raw = localStorage.getItem(FRAGMENTS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function markFragmentFound(id: number): number[] {
  const found = getFoundFragments();
  if (found.includes(id)) return found;
  const updated = [...found, id];
  try { localStorage.setItem(FRAGMENTS_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

const SECRETS_KEY = "faxy-nik-secrets";

export function getDiscoveredSecrets(): string[] {
  try { const raw = localStorage.getItem(SECRETS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function markSecretDiscovered(name: string): string[] {
  const discovered = getDiscoveredSecrets();
  if (discovered.includes(name)) return discovered;
  const updated = [...discovered, name];
  try { localStorage.setItem(SECRETS_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

export function getCompletionPct(discovered: string[]): number {
  const TOTAL_SECRETS = 20;
  return Math.min(100, Math.round((discovered.length / TOTAL_SECRETS) * 100));
}

export function isFullyComplete(discovered: string[]): boolean {
  return discovered.length >= 20;
}

export function getTimeAwareness(): { isLateNight: boolean; hour: number } {
  const hour = new Date().getHours();
  return { isLateNight: hour >= 23 || hour < 5, hour };
}

export function isAfterMidnight(): boolean {
  const hour = new Date().getHours();
  return hour >= 0 && hour < 5;
}

export function checkAndShowTenMinMessage(): boolean {
  const key = "faxy-nik-ten-min";
  const alreadyShown = sessionStorage.getItem(key);
  if (alreadyShown) return false;
  sessionStorage.setItem(key, "1");
  return true;
}

export function getPianoNotes(): number[] {
  try { const raw = localStorage.getItem(PIANO_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function markPianoNoteFound(id: number): number[] {
  const found = getPianoNotes();
  if (found.includes(id)) return found;
  const updated = [...found, id];
  try { localStorage.setItem(PIANO_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

export function getFootprints(): string[] {
  try { const raw = localStorage.getItem(FOOTPRINTS_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function markFootprint(sectionId: string): string[] {
  const footprints = getFootprints();
  if (footprints.includes(sectionId)) return footprints;
  const updated = [...footprints, sectionId];
  try { localStorage.setItem(FOOTPRINTS_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

export function shouldShowBook(): boolean {
  try {
    const lastShown = Number(localStorage.getItem(BOOK_KEY)) || 0;
    const visits = getVisitCount();
    if (visits - lastShown >= 2) {
      localStorage.setItem(BOOK_KEY, String(visits));
      return true;
    }
    return false;
  } catch { return false; }
}

export function incrementCuriousClicks(): number {
  try {
    const count = Number(localStorage.getItem(CURIOUS_KEY)) || 0;
    const next = count + 1;
    localStorage.setItem(CURIOUS_KEY, String(next));
    return next;
  } catch { return 0; }
}

export function getDreamModeTriggered(): boolean {
  return sessionStorage.getItem("faxy-nik-dream") === "1";
}

export function setDreamModeTriggered() {
  sessionStorage.setItem("faxy-nik-dream", "1");
}

export function markFinalMemoryUnlocked() {
  try { localStorage.setItem(FINAL_MEMORY_KEY, "1"); } catch {}
}

export function isFinalMemoryUnlocked(): boolean {
  try { return localStorage.getItem(FINAL_MEMORY_KEY) === "1"; } catch { return false; }
}

export const MEMORY_OBJECTS = [
  { id: "notebook", label: "Notebook", text: "Pages filled with ideas he never showed anyone. Some thoughts are too personal to share. He wrote them anyway." },
  { id: "coffee", label: "Coffee Cup", text: "Always half full. He believed in refilling. For himself. For others." },
  { id: "chair", label: "Chair", text: "He sat here during every important conversation. The chair remembers the weight of his silence." },
  { id: "calculator", label: "Calculator", text: "He calculated everything except how much he mattered to others." },
  { id: "bottle", label: "Big Apple Bottle", text: "A gift. A reminder. Someone handed him more than a drink that day." },
  { id: "hoodie", label: "Hoodie", text: "Worn more than washed. It carried his warmth. It carried his comfort." },
  { id: "headphones", label: "Headphones", text: "His escape. 53 songs on repeat. Each one mapped to a memory." },
  { id: "usb", label: "USB Drive", text: "Archives. Backups. Letters unsent. Everything he wanted to preserve." },
  { id: "pencil", label: "Broken Pencil", text: "He pressed too hard when writing. Like his thoughts were too heavy for paper." },
];

export const LIBRARY_BOOKS = [
  { title: "How Humans Remember", lesson: "Memory is not storage. It is survival." },
  { title: "Weight Of Small Things", lesson: "The smallest gestures carry the heaviest meaning." },
  { title: "People Who Stayed Quietly", lesson: "Presence without performance is the rarest gift." },
  { title: "The Cost Of Empathy", lesson: "Feeling deeply is not weakness. It is architecture." },
  { title: "The Art Of Letting Go", lesson: "Some bonds do not end. They transform." },
  { title: "Silence As Language", lesson: "What remains unsaid often says the most." },
  { title: "The Observer's Paradox", lesson: "To watch someone closely is to change them." },
  { title: "Memories That Outlive Us", lesson: "We are not gone until the last person who remembers us stops speaking our name." },
];

export const EMOTIONAL_STATES = ["Comfort", "Growth", "Loss", "Acceptance", "Hope", "Curiosity", "Peace", "Melancholy"];

export const PIANO_NOTES_DATA = [
  { freq: 261.63, label: "C4" },
  { freq: 293.66, label: "D4" },
  { freq: 329.63, label: "E4" },
  { freq: 349.23, label: "F4" },
  { freq: 392.00, label: "G4" },
  { freq: 440.00, label: "A4" },
  { freq: 493.88, label: "B4" },
  { freq: 523.25, label: "C5" },
  { freq: 587.33, label: "D5" },
  { freq: 659.25, label: "E5" },
  { freq: 698.46, label: "F5" },
  { freq: 783.99, label: "G5" },
];

export const MELODY = [0, 2, 4, 5, 7, 9, 11, 12];
