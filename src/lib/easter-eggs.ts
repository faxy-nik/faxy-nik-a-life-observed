const VISIT_KEY = "faxy-nik-visits";
const FRAGMENTS_KEY = "faxy-nik-fragments";
const COMPLETION_KEY = "faxy-nik-completion";

export function getVisitCount(): number {
  try {
    return Number(localStorage.getItem(VISIT_KEY)) || 0;
  } catch { return 0; }
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
  try {
    const raw = localStorage.getItem(FRAGMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
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
  try {
    const raw = localStorage.getItem(SECRETS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function markSecretDiscovered(name: string): string[] {
  const discovered = getDiscoveredSecrets();
  if (discovered.includes(name)) return discovered;
  const updated = [...discovered, name];
  try { localStorage.setItem(SECRETS_KEY, JSON.stringify(updated)); } catch {}
  return updated;
}

export function getCompletionPct(discovered: string[]): number {
  const TOTAL_SECRETS = 12;
  return Math.min(100, Math.round((discovered.length / TOTAL_SECRETS) * 100));
}

export function isFullyComplete(discovered: string[]): boolean {
  return discovered.length >= 12;
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
