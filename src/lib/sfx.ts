// Lightweight synthesized SFX using WebAudio. No assets required.
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

/** Short mechanical key click. */
export function typeClick(volume = 0.08) {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;

  // Noise burst (the "tick")
  const bufferSize = Math.floor(c.sampleRate * 0.03);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2200 + Math.random() * 800;
  bp.Q.value = 1.2;

  const g = c.createGain();
  g.gain.setValueAtTime(volume, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

  noise.connect(bp).connect(g).connect(c.destination);
  noise.start(now);
  noise.stop(now + 0.05);
}

/** Prime audio context on a user gesture. */
export function unlockAudio() {
  getCtx();
}
