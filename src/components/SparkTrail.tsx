import { useCallback, useRef } from "react";

export function SparkTrail({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const sparksRef = useRef<HTMLDivElement>(null);

  const createSpark = useCallback((e: React.MouseEvent) => {
    if (!sparksRef.current) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const spark = document.createElement("div");
    spark.className = "spark";
    spark.style.left = `${e.clientX - rect.left}px`;
    spark.style.top = `${e.clientY - rect.top}px`;
    sparksRef.current.appendChild(spark);
    setTimeout(() => spark.remove(), 800);
  }, []);

  return (
    <>
      <div ref={sparksRef} className="absolute inset-0 pointer-events-none z-10 overflow-hidden" />
      <div
        className="absolute inset-0 z-20 cursor-crosshair"
        onMouseMove={(e) => {
          if (Math.random() > 0.85) createSpark(e);
        }}
        onMouseDown={createSpark}
      />
    </>
  );
}
