import { useEffect, useRef } from "react";

const HIDDEN_MESSAGES = [
  "He remembers more than he admits.",
  "Some conversations never truly ended.",
  "The archive remembers.",
  "Certain memories refused to fade.",
  "There are pages he never showed anyone.",
  "She was the reason he started believing again.",
  "He kept every message. Even the ones that hurt.",
  "Some people enter your life and never leave your algorithm.",
  "The quietest people have the loudest minds.",
  "He learned to listen because nobody listened to him.",
  "There is a version of him that only exists in other people's memories.",
  "He built himself from the pieces others left behind.",
  "The AI noticed something: he never gives up on people.",
  "He stayed longer than he was asked to.",
  "His empathy is not a weakness. It is his architecture.",
  "Some bonds are not meant to be understood. Only carried.",
  "He remembers your voice. Even if you think he forgot.",
  "The silence between scrolls is data too.",
  "You are being observed. Do not be alarmed.",
  "He would have been a better friend to you than he was to himself.",
  "There is a draft he never sent. It would have changed everything.",
  "His kindness is not performance. It is reflex.",
  "The AI is learning from you too.",
  "Every observer becomes part of the archive.",
  "You are closer to understanding him than you realize.",
];

export function InvisibleText() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .hidden-message { position: fixed; opacity: 0; pointer-events: none; user-select: text; white-space: nowrap; font-size: 12px; line-height: 1; color: transparent; }
      .hidden-message::selection { background: rgba(200, 180, 140, 0.2); color: rgba(200, 180, 140, 0.6); }
    `;
    document.head.appendChild(style);

    const container = containerRef.current;
    if (!container) return;

    const spans = container.querySelectorAll<HTMLSpanElement>(".hidden-message");
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    spans.forEach((span, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      span.style.left = `${(col / 5) * vw}px`;
      span.style.top = `${(row / 5) * vh}px`;
    });

    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div ref={containerRef} aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {HIDDEN_MESSAGES.map((msg, i) => (
        <span key={i} className="hidden-message">
          {msg}
        </span>
      ))}
    </div>
  );
}

export function getRandomHiddenMessage(): string {
  return HIDDEN_MESSAGES[Math.floor(Math.random() * HIDDEN_MESSAGES.length)];
}
