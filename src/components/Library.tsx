import { useState, useEffect, useMemo } from "react";
import { LIBRARY_BOOKS } from "@/lib/easter-eggs";
import { speak } from "@/lib/narrator";

export function Library() {
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "l" && !e.ctrlKey && !e.metaKey) return;
      if ((e.key === "l" || e.key === "L") && e.ctrlKey && e.shiftKey) {
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const visibleBooks = useMemo(() => {
    return LIBRARY_BOOKS.slice(0, Math.floor(Math.random() * 3) + 4);
  }, []);

  if (!open) return null;

  return (
    <div className="library-overlay" onClick={() => { setOpen(false); setSelectedBook(null); }}>
      <div className="library-container" onClick={(e) => e.stopPropagation()}>
        <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/30 text-center mb-8">The Library</p>
        <p className="serif italic text-sm text-white/40 text-center mb-10">Shelves filled with things he learned. He never knew they were lessons.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {visibleBooks.map((book, i) => (
            <button
              key={book.title}
              className="library-book"
              onClick={() => {
                setSelectedBook(i);
                speak(book.lesson, { rate: 0.82 });
              }}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="book-spine-icon">\uD83D\uDCDA</span>
              <span className="library-book-title">{book.title}</span>
            </button>
          ))}
        </div>
        {selectedBook !== null && visibleBooks[selectedBook] && (
          <div className="library-lesson">
            <p className="serif italic text-base text-white/60">
              "{visibleBooks[selectedBook].lesson}"
            </p>
          </div>
        )}
      </div>
      <style>{`
        .library-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.8); backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
        }
        .library-container {
          width: 90%; max-width: 600px; padding: 40px;
        }
        .library-book {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 16px 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.5s;
          animation: float-up 0.8s ease-out both;
        }
        .library-book:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-4px);
        }
        .book-spine-icon { font-size: 24px; display: block; margin-bottom: 6px; filter: sepia(0.5); }
        .library-book-title {
          font-family: var(--font-mono); font-size: 8px;
          text-transform: uppercase; letter-spacing: 0.15em;
          color: rgba(255,255,255,0.4);
        }
        .library-lesson {
          margin-top: 40px; text-align: center;
          animation: float-up 0.8s ease-out both;
        }
      `}</style>
    </div>
  );
}
