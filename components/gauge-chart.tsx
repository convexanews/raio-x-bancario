'use client';

interface GaugeChartProps {
  value: number;
  title: string;
  unit?: string;
  zones: { min: number; max: number; color: string }[];
  scaleMax?: number;
  classificacao: string;
  classificacaoCor: 'green' | 'yellow' | 'red';
}

export function GaugeChart({
  value,
  title,
  unit = '%',
  zones,
  scaleMax = 100,
  classificacao,
  classificacaoCor,
}: GaugeChartProps) {
  const cx = 110;
  const cy = 100;
  const r = 75;
  const strokeW = 16;

  // Semicírculo: de 180° a 0° (esquerda para direita, passando pelo topo)
  function polarToXY(angleDeg: number, radius: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: parseFloat((cx + radius * Math.cos(rad)).toFixed(4)),
      y: parseFloat((cy + radius * Math.sin(rad)).toFixed(4)),
    };
  }

  function describeArc(startDeg: number, endDeg: number, radius: number) {
    const start = polarToXY(startDeg, radius);
    const end = polarToXY(endDeg, radius);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  // Mapeia valor (0–scaleMax) para ângulo (180°–360°)
  function valueToAngle(v: number) {
    const clamped = Math.min(Math.max(v, 0), scaleMax);
    return 180 + (clamped / scaleMax) * 180;
  }

  // Zonas coloridas do arco
  const arcs = zones.map((z) => ({
    path: describeArc(
      180 + (z.min / scaleMax) * 180,
      180 + (z.max / scaleMax) * 180,
      r
    ),
    color: z.color,
  }));

  // Ponteiro
  const needleAngle = valueToAngle(value);
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLen = r - 6;
  const nx = cx + needleLen * Math.cos(needleRad);
  const ny = cy + needleLen * Math.sin(needleRad);

  // Ticks e labels da escala (0, 20, 40, 60, 80, 100)
  const ticks = [0, 20, 40, 60, 80, 100];

  const badgeColors = {
    green: { bg: '#dcfce7', text: '#16a34a', border: '#bbf7d0' },
    yellow: { bg: '#fef9c3', text: '#ca8a04', border: '#fef08a' },
    red: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' },
  };
  const badge = badgeColors[classificacaoCor];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Título */}
      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <span className="inline-block h-4 w-1 rounded-full bg-primary" />
        {title.toUpperCase()}
      </div>

      <svg viewBox="0 0 220 155" className="w-full max-w-[260px]">
        {/* Trilho cinza de fundo */}
        <path
          d={describeArc(180, 360, r)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeW}
          strokeLinecap="butt"
        />

        {/* Zonas coloridas */}
        {arcs.map((a, i) => (
          <path
            key={i}
            d={a.path}
            fill="none"
            stroke={a.color}
            strokeWidth={strokeW}
            strokeLinecap="butt"
          />
        ))}

        {/* Ticks e labels */}
        {ticks.map((t) => {
          const angle = 180 + (t / scaleMax) * 180;
          const outer = polarToXY(angle, r + strokeW / 2 + 4);
          const inner = polarToXY(angle, r - strokeW / 2 - 2);
          const label = polarToXY(angle, r + strokeW / 2 + 14);
          return (
            <g key={t}>
              <line
                x1={inner.x} y1={inner.y}
                x2={outer.x} y2={outer.y}
                stroke="#9ca3af" strokeWidth={1}
              />
              <text
                x={label.x} y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fill="#6b7280"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Ponteiro */}
        <line
          x1={cx} y1={cy}
          x2={nx} y2={ny}
          stroke="#1e293b"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Pivô */}
        <circle cx={cx} cy={cy} r={5} fill="#3b82f6" />

        {/* Valor central */}
        <text
          x={cx} y={cy + 32}
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill="currentColor"
          className="fill-foreground"
        >
          {value}{unit}
        </text>
      </svg>

      {/* Badge classificação */}
      <div
        className="rounded-full px-5 py-1 text-sm font-semibold"
        style={{ background: badge.bg, color: badge.text, border: `1px solid ${badge.border}` }}
      >
        {classificacao}
      </div>

      {/* Label */}
      <p className="text-xs text-muted-foreground">{title}</p>
    </div>
  );
}

