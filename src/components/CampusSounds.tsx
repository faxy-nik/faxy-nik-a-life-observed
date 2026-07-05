import { useEffect, useRef } from "react";

function createNoise(ctx: AudioContext, type: "laugh" | "footsteps" | "bell" | "wind" | "cafe" | "motorcycle") {
  const now = ctx.currentTime;

  switch (type) {
    case "laugh": {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.5);
      gain.gain.setValueAtTime(0.008, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
    }
    case "footsteps": {
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.value = 80 + Math.random() * 40;
        gain.gain.setValueAtTime(0.005, now + i * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.25);
        osc.stop(now + i * 0.25 + 0.1);
      }
      break;
    }
    case "bell": {
      const notes = [880, 1108, 880];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.01, now + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.6);
      });
      break;
    }
    case "wind": {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(300, now + 3);
      osc.frequency.linearRampToValueAtTime(150, now + 6);
      gain.gain.setValueAtTime(0.003, now);
      gain.gain.linearRampToValueAtTime(0.006, now + 2);
      gain.gain.linearRampToValueAtTime(0.001, now + 6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 6);
      break;
    }
    case "cafe": {
      const bufSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin(i / bufSize * Math.PI);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.003, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      break;
    }
    case "motorcycle": {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.5);
      osc.frequency.linearRampToValueAtTime(90, now + 1.5);
      gain.gain.setValueAtTime(0.004, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.8);
      break;
    }
  }
}

export function CampusSounds() {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const types: ("laugh" | "footsteps" | "bell" | "wind" | "cafe" | "motorcycle")[] = ["laugh", "footsteps", "bell", "wind", "cafe", "motorcycle"];
    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedule = () => {
      const delay = 30000 + Math.random() * 60000;
      const timer = setTimeout(() => {
        if (!ctxRef.current) ctxRef.current = new AudioContext();
        const type = types[Math.floor(Math.random() * types.length)];
        createNoise(ctxRef.current, type);

        const repeatDelay = 5000 + Math.random() * 10000;
        const repeatTimer = setTimeout(() => {
          if (ctxRef.current) createNoise(ctxRef.current, type);
        }, repeatDelay);
        timers.push(repeatTimer);

        schedule();
      }, delay);
      timers.push(timer);
    };
    schedule();

    return () => timers.forEach(clearTimeout);
  }, []);

  return null;
}
