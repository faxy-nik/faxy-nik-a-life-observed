import { useEffect, useRef, useState, useCallback } from "react";

function createAmbient(ctx: AudioContext) {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 300;
  filter.Q.value = 1;
  master.connect(filter);
  filter.connect(ctx.destination);

  const oscs: OscillatorNode[] = [];
  const lfos: OscillatorNode[] = [];
  const gains: GainNode[] = [];

  const freqs = [55, 73.42, 98, 110, 130.81];
  for (const f of freqs) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f + (Math.random() - 0.5) * 2;

    const gain = ctx.createGain();
    gain.gain.value = 0.025 + Math.random() * 0.015;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.05 + Math.random() * 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.3 + Math.random() * 0.3;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(filter);

    osc.start();
    lfo.start();
    oscs.push(osc);
    lfos.push(lfo);
    gains.push(gain);
  }

  const noise = ctx.createBufferSource();
  const bufSize = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.01;
  }
  noise.buffer = buf;
  noise.loop = true;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 150;
  noiseFilter.Q.value = 0.5;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.03;

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start();

  let currentGain = 0;
  let targetGain = 0.6;

  return {
    setVolume(v: number) {
      targetGain = v;
    },
    setDepth(d: number) {
      const freq = 600 - d * 450;
      filter.frequency.setTargetAtTime(Math.max(80, freq), ctx.currentTime, 0.3);
      noiseGain.gain.setTargetAtTime(0.03 + d * 0.04, ctx.currentTime, 0.3);
    },
    ramp(duration = 2000) {
      const start = currentGain;
      const diff = targetGain - start;
      const startTime = performance.now();
      const id = setInterval(() => {
        const t = Math.min((performance.now() - startTime) / duration, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        currentGain = start + diff * ease;
        master.gain.value = currentGain;
        if (t >= 1) clearInterval(id);
      }, 16);
    },
    stop() {
      oscs.forEach((o) => { try { o.stop(); } catch {} });
      lfos.forEach((o) => { try { o.stop(); } catch {} });
      try { noise.stop(); } catch {}
      ctx.close();
    },
  };
}

export function AmbientSound({ depth = 0 }: { depth?: number }) {
  const [active, setActive] = useState(false);
  const ambientRef = useRef<ReturnType<typeof createAmbient> | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const depthRef = useRef(depth);

  useEffect(() => { depthRef.current = depth; }, [depth]);

  const toggle = useCallback(() => {
    if (active && ambientRef.current) {
      ambientRef.current.setVolume(0);
      ambientRef.current.ramp(2000);
      setTimeout(() => {
        if (ambientRef.current) {
          ambientRef.current.stop();
          ambientRef.current = null;
          ctxRef.current = null;
        }
        setActive(false);
      }, 2100);
    } else {
      const ctx = new AudioContext();
      ctxRef.current = ctx;
      const ambient = createAmbient(ctx);
      ambientRef.current = ambient;
      ambient.setVolume(0.6);
      ambient.setDepth(depthRef.current);
      ambient.ramp(3000);
      setActive(true);
    }
  }, [active]);

  useEffect(() => {
    if (active && ambientRef.current) {
      ambientRef.current.setDepth(depth);
    }
  }, [depth, active]);

  useEffect(() => {
    return () => {
      ambientRef.current?.stop();
    };
  }, []);

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 left-6 z-[60] glass-panel rounded-full px-3.5 py-2 mono text-[9px] uppercase tracking-[0.3em] text-white/50 hover:text-white/80 transition-all duration-500 hover:scale-105 flex items-center gap-2"
      title={active ? "Mute ambient" : "Play ambient"}
    >
      <span className={`text-xs transition-opacity ${active ? "opacity-100" : "opacity-50"}`}>
        {active ? "\u25C9" : "\u25CB"}
      </span>
      <span>{active ? "playing" : "ambient"}</span>
      {active && (
        <span className="flex gap-[2px] ml-1">
          {[3, 5, 4, 6, 3].map((h, i) => (
            <span
              key={i}
              className="w-[2px] bg-white/60 rounded-full"
              style={{
                height: `${h}px`,
                animation: `wave-bar ${0.6 + i * 0.1}s ease-in-out infinite`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
}
