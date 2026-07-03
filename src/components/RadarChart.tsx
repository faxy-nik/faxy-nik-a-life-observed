import { useMemo } from "react";

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
}

export function RadarChart({ data, size = 300 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 40;
  const sides = data.length;
  const angleStep = (Math.PI * 2) / sides;

  const rings = useMemo(() => [0.25, 0.5, 0.75, 1], []);

  const getPoint = (index: number, ratio: number) => {
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * maxR * ratio,
      y: cy + Math.sin(angle) * maxR * ratio,
    };
  };

  const dataPoints = useMemo(
    () => data.map((d, i) => getPoint(i, d.value / 100)),
    [data, size]
  );

  const dataPath = useMemo(
    () => dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z",
    [dataPoints]
  );

  const gridLines = useMemo(() => {
    const lines: string[][] = [];
    for (let i = 0; i < sides; i++) {
      const end = getPoint(i, 1);
      lines.push([`M ${cx} ${cy}`, `L ${end.x} ${end.y}`]);
    }
    return lines;
  }, [data, size]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full" style={{ maxWidth: size }}>
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(1 0 0 / 0.15)" />
          <stop offset="100%" stopColor="oklch(1 0 0 / 0.05)" />
        </radialGradient>
      </defs>

      {/* Grid rings */}
      {rings.map((r) => {
        const points = Array.from({ length: sides }, (_, i) => {
          const p = getPoint(i, r);
          return `${p.x},${p.y}`;
        }).join(" ");
        return (
          <polygon
            key={r}
            points={points}
            fill="none"
            stroke="oklch(1 0 0 / 0.1)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Grid lines */}
      {gridLines.map((line, i) => (
        <path key={i} d={line.join(" ")} stroke="oklch(1 0 0 / 0.08)" strokeWidth="0.5" fill="none" />
      ))}

      {/* Data polygon */}
      <path d={dataPath} fill="url(#radarFill)" stroke="oklch(1 0 0 / 0.5)" strokeWidth="1.5" />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="oklch(1 0 0 / 0.8)" className="animate-twinkle" style={{ animationDelay: `${i * 0.2}s` }} />
          <circle cx={p.x} cy={p.y} r="6" fill="none" stroke="oklch(1 0 0 / 0.3)" strokeWidth="0.5" className="animate-pulse-ring" style={{ animationDelay: `${i * 0.3}s` }} />
        </g>
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const p = getPoint(i, 1.18);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="mono"
            fill="oklch(1 0 0 / 0.5)"
            fontSize="8"
            letterSpacing="0.1em"
          >
            {d.label.toUpperCase()}
          </text>
        );
      })}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="3" fill="oklch(1 0 0 / 0.6)" className="animate-twinkle" />
    </svg>
  );
}
