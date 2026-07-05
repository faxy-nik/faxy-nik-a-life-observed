import { useEffect, useState } from "react";

interface Entry {
  name: string;
  message: string;
  timestamp: number;
}

const STORAGE_KEY = "faxy-nik-observers";

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: Entry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

const OBSERVER_COUNT_TEMPLATES = [
  "You are observer #%d in the archive.",
  "Observer #%d. Your presence is recorded.",
  "Observation logged. You are #%d.",
  "Index %d. Another observer added.",
  "Entry #%d. The archive grows.",
];

export function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newEntry: Entry = {
      name: name.trim(),
      message: message.trim(),
      timestamp: Date.now(),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setName("");
    setMessage("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const count = entries.length + 1;
  const templateIdx = count % OBSERVER_COUNT_TEMPLATES.length;
  const observerLine = OBSERVER_COUNT_TEMPLATES[templateIdx].replace("%d", String(count));

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-6 md:px-12 py-24">
      <div className="relative z-10 max-w-3xl w-full">
        <div className="text-center mb-12">
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Archive Extension</p>
          <h2 className="serif text-5xl md:text-6xl text-glow">Other Observers</h2>
          <p className="text-white/40 mt-3 text-sm serif italic">
            You are not the first to observe. Leave your mark in the archive.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-8 md:p-10 mb-8">
          {submitted ? (
            <div className="text-center py-6 animate-float-up">
              <p className="serif text-xl text-white/80 italic">"Your observation has been archived."</p>
              <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/30 mt-3">{observerLine}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Your Name</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Observer designation..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 mono text-sm placeholder:text-white/20 outline-none transition-all duration-300 focus:border-white/30 focus:bg-white/[0.06]"
                  maxLength={40}
                />
              </div>
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">Your Observation</p>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What did you observe?"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 mono text-sm placeholder:text-white/20 outline-none transition-all duration-300 focus:border-white/30 focus:bg-white/[0.06] resize-none"
                  rows={3}
                  maxLength={280}
                />
                <p className="mono text-[9px] uppercase tracking-[0.2em] text-white/20 mt-1 text-right">{message.length}/280</p>
              </div>
              <button
                type="submit"
                disabled={!name.trim() || !message.trim()}
                className="w-full glass-panel rounded-xl py-3 mono text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white transition-all duration-500 hover:scale-[1.01] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Log Observation
              </button>
            </form>
          )}
        </div>

        <div className="space-y-3">
          <p className="mono text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4">
            Previous Observers \u00B7 {entries.length} recorded
          </p>
          {entries.length === 0 ? (
            <p className="text-white/20 text-sm serif italic text-center py-6">
              No other observers yet. Be the first.
            </p>
          ) : (
            entries.slice(0, 10).map((entry) => (
              <div
                key={entry.timestamp}
                className="glass-panel rounded-xl p-5 transition-all duration-700 hover:bg-white/[0.06]"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="mono text-[11px] uppercase tracking-[0.2em] text-white/70">{entry.name}</span>
                  <span className="mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                    Observation #{entries.length - entries.indexOf(entry)}
                  </span>
                </div>
                <p className="text-white/50 text-sm serif italic leading-relaxed">"{entry.message}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
