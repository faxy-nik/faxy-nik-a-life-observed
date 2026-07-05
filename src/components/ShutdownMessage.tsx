import { useEffect, useState } from "react";

export function ShutdownMessage() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      try {
        if ("speechSynthesis" in window) {
          const u = new SpeechSynthesisUtterance("Goodbye. Thank you for remembering him.");
          u.rate = 0.82;
          u.volume = 0.7;
          const voices = window.speechSynthesis.getVoices();
          const preferred = voices.find((v) => /Google UK English Male|Daniel|Alex|Samantha/i.test(v.name));
          if (preferred) u.voice = preferred;
          window.speechSynthesis.speak(u);
        }
      } catch {}
      setMessage("Goodbye. Thank you for remembering him.");
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  if (!message) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black flex items-center justify-center animate-fade-slow">
      <p className="serif text-2xl md:text-3xl text-white/70 italic text-center">
        {message}
      </p>
    </div>
  );
}
