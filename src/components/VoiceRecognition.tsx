import { useEffect, useState, useRef, useCallback } from "react";
import { speakWithHesitation } from "../lib/hesitant-speak";

const RESPONSES: Record<string, string> = {
  "who are you": "Someone who stayed after everyone else left.",
  "who is faxy nik": "A collector of people disguised as a student.",
  "what is this": "An archive. A memory. A letter that kept growing.",
  "hello": "Hello. I have been expecting you.",
  "hi": "Hello. I have been expecting you.",
  "thank you": "You are welcome. The archive appreciates your presence.",
  "goodbye": "Goodbye. The archive will remember you.",
};

export function VoiceRecognition() {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        for (const [phrase, response] of Object.entries(RESPONSES)) {
          if (transcript.includes(phrase)) {
            speakWithHesitation(response, { rate: 0.82 });
            break;
          }
        }
      };

      recognition.onend = () => {
        if (listening) {
          try { recognition.start(); } catch {}
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggle = useCallback(() => {
    if (!recognitionRef.current) return;
    if (listening) {
      try { recognitionRef.current.stop(); } catch {}
      setListening(false);
    } else {
      try { recognitionRef.current.start(); } catch {}
      setListening(true);
    }
  }, [listening]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      className={`fixed bottom-6 left-20 z-[60] glass-panel rounded-full px-3 py-2 mono text-[9px] uppercase tracking-[0.3em] transition-all duration-500 hover:scale-105 ${
        listening ? "text-emerald-400/80 border-emerald-400/20" : "text-white/50 hover:text-white/80"
      }`}
      title={listening ? "Microphone active" : "Activate microphone"}
    >
      <span className="flex items-center gap-1.5">
        <span className={`text-xs ${listening ? "animate-pulse-ring" : ""}`}>
          {listening ? "\u25C9" : "\u25CB"}
        </span>
        <span>{listening ? "listening" : "voice"}</span>
      </span>
    </button>
  );
}
