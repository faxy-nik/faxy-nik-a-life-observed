import { useEffect } from "react";

export function EmotionWatcher() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[data-emotion]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const emotion = (entry.target as HTMLElement).dataset.emotion || "peace";
            document.documentElement.dataset.currentEmotion = emotion;
            return;
          }
        }
      },
      { threshold: 0.2 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return null;
}
