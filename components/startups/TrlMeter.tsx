import type { TRL } from "@/lib/types";

type Scale = { level: TRL; label: string; phase: "Research" | "Development" | "Deployment" }[];

const PHASES = [
  { name: "Research", from: 1, to: 3 },
  { name: "Development", from: 4, to: 6 },
  { name: "Deployment", from: 7, to: 9 },
] as const;

/**
 * Technology Readiness Level drawn as a measurement scale: a ruled axis with nine
 * ticks, a marker at the current level, and bracketed phases beneath.
 */
export function TrlMeter({ trl, scale, compact = false }: { trl: TRL; scale: Scale; compact?: boolean }) {
  const current = scale.find((s) => s.level === trl);

  if (compact) {
    // Inline instrument reading: "TRL 6" + a miniature ruler.
    const W = 72;
    const x = (l: number) => 2 + ((l - 1) * (W - 4)) / 8;
    return (
      <span className="inline-flex items-center gap-2.5" aria-label={`TRL ${trl} of 9${current ? `, ${current.label}` : ""}`}>
        <span className="font-mono text-[0.7rem] tracking-[0.04em] text-ink">TRL {trl}</span>
        <svg aria-hidden width={W} height={12} viewBox={`0 0 ${W} 12`} className="overflow-visible">
          <line x1={x(1)} x2={x(9)} y1={10} y2={10} stroke="#cbd5e1" strokeWidth={1} />
          {scale.map((s) => (
            <line
              key={s.level}
              x1={x(s.level)}
              x2={x(s.level)}
              y1={s.level === trl ? 0 : 6}
              y2={10}
              stroke={s.level === trl ? "#2563eb" : s.level < trl ? "#334155" : "#cbd5e1"}
              strokeWidth={s.level === trl ? 1.5 : 1}
            />
          ))}
        </svg>
      </span>
    );
  }

  const W = 360;
  const pad = 14;
  const x = (l: number) => pad + ((l - 1) * (W - pad * 2)) / 8;
  const axisY = 30;

  return (
    <figure>
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[1.05rem] tracking-[0.02em] text-ink">TRL {trl}</span>
        <span aria-hidden className="text-muted">—</span>
        <span className="text-[0.95rem] text-ink-2">{current?.label}</span>
      </figcaption>

      <svg
        viewBox={`0 0 ${W} 76`}
        className="mt-4 h-auto w-full"
        role="img"
        aria-label={`Technology readiness level ${trl} of 9, ${current?.phase ?? ""} phase`}
      >
        {/* Axis */}
        <line x1={x(1)} x2={x(9)} y1={axisY} y2={axisY} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={x(1)} x2={x(trl)} y1={axisY} y2={axisY} stroke="#111827" strokeWidth={1} />

        {/* Ticks + level numbers */}
        {scale.map((s) => {
          const on = s.level === trl;
          const past = s.level < trl;
          return (
            <g key={s.level}>
              <line
                x1={x(s.level)}
                x2={x(s.level)}
                y1={on ? 12 : axisY - 7}
                y2={axisY}
                stroke={on ? "#2563eb" : past ? "#111827" : "#cbd5e1"}
                strokeWidth={on ? 1.5 : 1}
              />
              <text
                x={x(s.level)}
                y={axisY + 14}
                textAnchor="middle"
                className="font-mono"
                fontSize={9}
                fill={on ? "#2563eb" : past ? "#334155" : "#94a3b8"}
                fontWeight={on ? 600 : 400}
              >
                {s.level}
              </text>
            </g>
          );
        })}

        {/* Marker */}
        <path d={`M ${x(trl) - 4} 4 L ${x(trl) + 4} 4 L ${x(trl)} 10 Z`} fill="#2563eb" />

        {/* Phase brackets */}
        {PHASES.map((p) => {
          const x1 = x(p.from) - 8;
          const x2 = x(p.to) + 8;
          const on = trl >= p.from && trl <= p.to;
          const col = on ? "#111827" : "#cbd5e1";
          return (
            <g key={p.name}>
              <path d={`M ${x1} 54 L ${x1} 58 L ${x2} 58 L ${x2} 54`} fill="none" stroke={col} strokeWidth={1} />
              <text
                x={(x1 + x2) / 2}
                y={72}
                textAnchor="middle"
                className="font-mono"
                fontSize={8}
                letterSpacing="0.12em"
                fill={on ? "#111827" : "#94a3b8"}
              >
                {p.name.toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
