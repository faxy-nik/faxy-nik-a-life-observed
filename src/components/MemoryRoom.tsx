import { useEffect, useRef, useState } from "react";
import { MEMORY_OBJECTS } from "@/lib/easter-eggs";
import { speak } from "@/lib/narrator";

type RoomObject = {
  id: string;
  label: string;
  text: string;
  x: number;
  y: number;
  emoji: string;
};

const OBJECT_EMOJIS: Record<string, string> = {
  notebook: "\uD83D\uDCDD", coffee: "\u2615", chair: "\uD83D\uDCBA",
  calculator: "\uD83D\uDCF1", bottle: "\uD83C\uDF7A", hoodie: "\uD83D\uDC55",
  headphones: "\uD83C\uDFA7", usb: "\uD83D\uDDBF", pencil: "\u270F\uFE0F",
};

export function MemoryRoom() {
  const [open, setOpen] = useState(false);
  const [clickedObj, setClickedObj] = useState<string | null>(null);
  const objectsRef = useRef<RoomObject[]>([]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "m" && e.ctrlKey) {
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    objectsRef.current = MEMORY_OBJECTS.map((obj, i) => {
      const angle = (i / MEMORY_OBJECTS.length) * Math.PI * 2;
      const radius = Math.min(vw, vh) * 0.25;
      return {
        ...obj,
        x: vw / 2 + Math.cos(angle) * radius - 20 + Math.random() * 40,
        y: vh / 2 + Math.sin(angle) * radius - 20 + Math.random() * 40,
        emoji: OBJECT_EMOJIS[obj.id] || "\u2753",
      };
    });
  }, [open]);

  if (!open) return null;

  return (
    <div className="memory-room-overlay" onClick={() => { setOpen(false); setClickedObj(null); }}>
      <div className="memory-room-container">
        <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/30 text-center mb-8">Memory Room</p>
        <p className="serif italic text-sm text-white/40 text-center mb-12">Some rooms hold more than furniture. They hold moments.</p>
        {objectsRef.current.map((obj) => (
          <button
            key={obj.id}
            className="memory-object"
            style={{ left: obj.x, top: obj.y }}
            onClick={(e) => {
              e.stopPropagation();
              setClickedObj(obj.id);
              speak(obj.text, { rate: 0.82 });
            }}
          >
            <span className="text-2xl">{obj.emoji}</span>
            <span className="memory-object-label">{obj.label}</span>
          </button>
        ))}
        {clickedObj && (
          <div className="memory-object-narration">
            <p className="serif italic text-sm text-white/60">
              {MEMORY_OBJECTS.find((o) => o.id === clickedObj)?.text}
            </p>
          </div>
        )}
      </div>
      <style>{`
        .memory-room-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .memory-room-container {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 80px;
        }
        .memory-object {
          position: absolute;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.5s;
          animation: float-in 1s ease-out both;
        }
        .memory-object:hover {
          background: rgba(255,255,255,0.1);
          transform: scale(1.1);
          border-color: rgba(255,255,255,0.3);
        }
        .memory-object-label {
          font-family: var(--font-mono);
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.3);
        }
        .memory-object-narration {
          position: fixed;
          bottom: 60px;
          left: 50%;
          transform: translateX(-50%);
          max-width: 400px;
          text-align: center;
          animation: float-up 1s ease-out both;
        }
        @keyframes float-in {
          0% { opacity: 0; transform: translateY(20px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
