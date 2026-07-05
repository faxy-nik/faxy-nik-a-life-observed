import { useEffect, useState, useRef } from "react";
import { PIANO_NOTES_DATA, MELODY, getPianoNotes, markPianoNoteFound } from "@/lib/easter-eggs";
import { speak } from "@/lib/narrator";

export function PianoKeys() {
  const [foundNotes, setFoundNotes] = useState<number[]>(() => getPianoNotes());
  const [showMelody, setShowMelody] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (foundNotes.length >= MELODY.length && !showMelody) {
      setShowMelody(true);
      playMelody();
      setTimeout(() => {
        speak("You found the song. He would have liked that.", { rate: 0.82 });
      }, 3000);
    }
  }, [foundNotes]);

  function playNote(freq: number) {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {}
  }

  function playMelody() {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    MELODY.forEach((noteIdx, i) => {
      const freq = PIANO_NOTES_DATA[noteIdx]?.freq || 440;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.2);
      osc.stop(ctx.currentTime + i * 0.2 + 0.8);
    });
  }

  const hiddenNotes = PIANO_NOTES_DATA.filter((_, i) => !foundNotes.includes(i));
  if (hiddenNotes.length === 0 && showMelody) return null;

  return (
    <>
      {hiddenNotes.map((note, i) => {
        const angle = (i / hiddenNotes.length) * Math.PI * 2;
        const r = Math.min(window.innerWidth, window.innerHeight) * 0.3;
        const x = 50 + Math.cos(angle) * 25;
        const y = 50 + Math.sin(angle) * 25;
        return (
          <button
            key={note.label}
            className="piano-note"
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={() => {
              const updated = markPianoNoteFound(i);
              setFoundNotes(updated);
              playNote(note.freq);
            }}
            aria-label="Hidden note"
          />
        );
      })}
      {showMelody && (
        <div className="piano-melody-found">
          <p className="serif italic text-lg text-white/60">"You found the song."</p>
        </div>
      )}
      <style>{`
        .piano-note {
          position: fixed;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.02);
          cursor: pointer;
          pointer-events: all;
          z-index: 5;
          transition: all 1s;
        }
        .piano-note:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 0 20px rgba(255,255,255,0.05);
          transform: scale(2);
        }
        .piano-melody-found {
          position: fixed;
          bottom: 40%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 110;
          text-align: center;
          animation: float-up 2s ease-out both;
        }
      `}</style>
    </>
  );
}
