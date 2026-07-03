import { useMemo } from "react";

interface BondMetric {
  label: string;
  value: number;
  max: number;
}

interface ConstellationDetailProps {
  name: string;
  bond: string;
  influence: string;
  metrics: BondMetric[];
  notes: string[];
}

export function ConstellationDetail({ name, bond, influence, metrics, notes }: ConstellationDetailProps) {
  const barWidth = useMemo(() => 200, []);

  return (
    <div className="mt-10 glass-panel rounded-2xl p-8 animate-float-up">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Identity */}
        <div>
          <p className="mono text-xs uppercase tracking-[0.4em] text-white/40 mb-2">Observation Log</p>
          <h3 className="serif text-4xl mb-1">{name}</h3>
          <div className="flex gap-3 mt-3 mb-6">
            <span className="glass-panel rounded-full px-3 py-1 mono text-[9px] uppercase tracking-[0.2em] text-white/50">{bond}</span>
            <span className="glass-panel rounded-full px-3 py-1 mono text-[9px] uppercase tracking-[0.2em] text-white/50">{influence}</span>
          </div>
          <div className="space-y-2 text-white/70 leading-relaxed">
            {notes.map((line, i) => (
              <p key={i} className={line.startsWith("—") ? "pl-6 text-white/80" : ""}>{line}</p>
            ))}
          </div>
        </div>

        {/* Right: Metrics */}
        <div className="space-y-4">
          <p className="mono text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4">Bond Metrics</p>
          {metrics.map((m, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="mono text-[11px] text-white/60">{m.label}</span>
                <span className="mono text-[10px] text-white/40">{m.value}/{m.max}</span>
              </div>
              <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white/30 to-white/60 rounded-full transition-all duration-[1500ms] ease-out"
                  style={{ width: `${(m.value / m.max) * barWidth}px` }}
                />
              </div>
            </div>
          ))}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="serif text-xl text-white">
                  {metrics.reduce((acc, m) => acc + m.value, 0) / metrics.length}
                </p>
                <p className="mono text-[8px] uppercase tracking-[0.2em] text-white/30">Avg Score</p>
              </div>
              <div>
                <p className="serif text-xl text-white">
                  {metrics.filter((m) => m.value >= m.max * 0.9).length}/{metrics.length}
                </p>
                <p className="mono text-[8px] uppercase tracking-[0.2em] text-white/30">Peak Bonds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
