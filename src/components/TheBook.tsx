import { useEffect, useState } from "react";
import { shouldShowBook } from "@/lib/easter-eggs";

const OBSERVATIONS = [
  "The visitor reads slowly.",
  "The visitor returned.",
  "The visitor paused here.",
  "The visitor seems curious.",
  "The visitor scrolls thoughtfully.",
  "The visitor stayed longer than expected.",
  "The visitor is being observed.",
  "The visitor reminds me of someone.",
  "The visitor has good instincts.",
  "The visitor is learning to remember.",
];

export function TheBook() {
  const [visible, setVisible] = useState(false);
  const [pageContent, setPageContent] = useState<{ line: string; done: boolean }[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (shouldShowBook()) {
      setVisible(true);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
    const totalLines = 5 + Math.floor(Math.random() * 5);
    let idx = 0;
    const lines: { line: string; done: boolean }[] = [];
    const iv = setInterval(() => {
      if (idx >= totalLines) {
        clearInterval(iv);
        return;
      }
      const observation = OBSERVATIONS[Math.floor(Math.random() * OBSERVATIONS.length)];
      lines.push({ line: observation, done: true });
      setPageContent([...lines]);
      idx++;
    }, 800);
  };

  if (!visible) return null;

  return (
    <div className="the-book-container">
      {!open && (
        <button className="the-book-closed" onClick={handleOpen} aria-label="A book floats here">
          <span className="book-icon">\uD83D\uDCD6</span>
        </button>
      )}
      {open && (
        <div className="the-book-open" onClick={() => setOpen(false)}>
          <div className="book-page" onClick={(e) => e.stopPropagation()}>
            <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6">Observation Log</p>
            <div className="space-y-3">
              {pageContent.map((line, i) => (
                <p key={i} className="serif italic text-sm text-white/60 animate-float-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  {line.line}
                </p>
              ))}
              {pageContent.length > 0 && (
                <p className="mono text-[8px] uppercase tracking-[0.3em] text-white/20 mt-6">— AI, documenting the observer</p>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`
        .the-book-container { position: fixed; bottom: 100px; right: 120px; z-index: 30; }
        .the-book-closed {
          background: none;
          border: none;
          cursor: pointer;
          animation: book-float 4s ease-in-out infinite;
          opacity: 0.5;
          transition: opacity 0.5s;
        }
        .the-book-closed:hover { opacity: 1; }
        .book-icon { font-size: 28px; filter: grayscale(0.5); }
        .the-book-open {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .book-page {
          max-width: 400px;
          width: 90%;
          background: rgba(20,18,15,0.95);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 32px;
          cursor: default;
          max-height: 80vh;
          overflow-y: auto;
        }
        @keyframes book-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
