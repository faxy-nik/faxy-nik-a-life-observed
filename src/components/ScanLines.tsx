export function ScanLines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03]" aria-hidden>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(1 0 0 / 0.15) 2px, oklch(1 0 0 / 0.15) 4px)",
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  );
}
