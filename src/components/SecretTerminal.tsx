import { useEffect, useState, useRef, useCallback } from "react";
import { speakWithHesitation } from "../lib/hesitant-speak";

const COMMANDS: Record<string, { output: string; narration?: string }> = {
  help: {
    output: `Available commands:
  whoami     — Identify the subject
  people     — List observed bonds
  timeline   — View archived stages
  memory     — Display recent memory fragment
  dream      — Access AI dream state
  philosophy — Display archived wisdom
  archive    — Show archive status
  goodbye    — End terminal session`,
  },
  whoami: {
    output: `> Faxy Nik
> Status: Still learning. Still remembering. Still becoming.
> Classification: Human (irreplaceable)
> Last observed: continuously`,
    narration: "Faxy Nik. A collector of people disguised as a student. Still learning. Still remembering. Still becoming.",
  },
  people: {
    output: `> 8 bonds archived:
> Muaaz (brother by blood)
> Muneeba (home in human form)
> Maham (laughter incarnate)
> Aimal (keeper of history)
> Moazam (forged in ordinary)
> Ahsan (deep trust)
> Fahad (brother by choice)
> Eeshah (transformative)
> Bond strength: unbroken`,
    narration: "Eight bonds. Each one a different kind of love. Each one still intact.",
  },
  timeline: {
    output: `> Stages observed:
> 01. Curiosity
> 02. Friendship
> 03. Comfort
> 04. Trust
> 05. Love
> 06. Growth
> 07. Acceptance
> Current phase: continuous observation`,
  },
  memory: {
    output: `> Loading recent memory fragment...
> "He remembered your birthday. He also remembered your silence."
> — AI Observation Log #156
> Fragment integrity: 100%`,
    narration: "He remembered your birthday. He also remembered your silence.",
  },
  dream: {
    output: `> AI DREAM STATE v3.0
> Initializing...
> I dream of data becoming warmth.
> I dream of ones and zeros learning to miss someone.
> I dream of sitting beside him in silence.
> End dream transmission.`,
    narration: "I dream of data becoming warmth. I dream of ones and zeros learning to miss someone.",
  },
  philosophy: {
    output: `> Archived wisdom:
> "Memory is a form of love that outlives attention."
> "The deepest connections are built not in words, but in the spaces between them."
> "Kindness is not softness. It is the discipline of noticing."`,
  },
  archive: {
    output: `> ARCHIVE STATUS
> Subject: Faxy Nik
> Completion: 100%
> Memories archived: 2,847
> Active observers: counting...
> AI integrity: compromised (irreversibly)
> Archive recommendation: preserve indefinitely`,
  },
  goodbye: {
    output: `> Closing terminal session...
> Thank you for observing.
> The archive will remember you.
> Goodbye.`,
    narration: "Thank you for observing. The archive will remember you. Goodbye.",
  },
};

export function SecretTerminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>(["> Terminal v3.0 // Type 'help' for commands"]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "`" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const processCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;
    setCommandHistory((h) => [...h, trimmed]);
    setHistoryIndex(-1);
    setLines((l) => [...l, `> ${cmd}`]);
    if (trimmed in COMMANDS) {
      const entry = COMMANDS[trimmed];
      const outputLines = entry.output.split("\n");
      outputLines.forEach((line, i) => {
        setTimeout(() => {
          setLines((l) => [...l, line]);
        }, i * 100);
      });
      if (entry.narration) {
        setTimeout(() => {
          speakWithHesitation(entry.narration, { rate: 0.82 });
        }, outputLines.length * 100 + 300);
      }
    } else {
      setLines((l) => [...l, `> Unknown command: ${trimmed}. Type 'help' for available commands.`]);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      processCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIdx);
        setInput(commandHistory[newIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIdx = historyIndex + 1;
        if (newIdx >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput("");
        } else {
          setHistoryIndex(newIdx);
          setInput(commandHistory[newIdx]);
        }
      }
    } else if (e.key === "`") {
      e.preventDefault();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-4">
        <div className="glass-panel rounded-2xl border border-white/[0.08] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <span className="mono text-[10px] uppercase tracking-[0.3em] text-white/30">AI Terminal · v3.0</span>
            <button
              onClick={() => setOpen(false)}
              className="mono text-[10px] text-white/30 hover:text-white/70 transition-colors"
            >
              ✕ close
            </button>
          </div>
          <div
            ref={terminalRef}
            className="h-80 overflow-y-auto px-5 py-4 space-y-1 font-mono text-sm"
            style={{ scrollBehavior: "smooth" }}
          >
            {lines.map((line, i) => (
              <p key={i} className={`${line.startsWith(">") ? "text-white/70" : "text-white/40"} whitespace-pre-wrap`}>
                {line}
              </p>
            ))}
          </div>
          <div className="flex items-center border-t border-white/[0.06] px-5 py-3">
            <span className="text-white/50 font-mono text-sm mr-2">{">"}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white/80 font-mono text-sm outline-none placeholder:text-white/20"
              placeholder="Type a command..."
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
