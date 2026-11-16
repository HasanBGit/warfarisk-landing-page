import { DAYS, SLOTS, slotXZ, spread } from "../lib/pillbox";

// Flat top-down pillbox for phones, reduced motion and browsers without WebGL. Same counts as the 3D scene.
export function Pillbox2D({ dose, high }: { dose: number; high: number }) {
  const s = spread(dose);
  const h = spread(Math.max(high, dose));
  const W = 76, G = 8, X0 = 10, Y0 = 40;
  return (
    <svg viewBox="0 0 600 260" className="pillbox-flat" aria-hidden="true">
      {DAYS.map((d, i) => {
        const x = X0 + i * (W + G);
        return (
          <g key={i}>
            <text x={x + W / 2} y={26} textAnchor="middle" className="pb-day">
              {d}
            </text>
            <rect x={x} y={Y0} width={W} height={200} rx={12} className="pb-cell" />
            {Array.from({ length: SLOTS }, (_, k) => {
              const [sx, sz] = slotXZ(k);
              const cx = x + W / 2 + sx * 36;
              const cy = Y0 + 100 + sz * 44;
              if (k < s[i]) return <circle key={k} cx={cx} cy={cy} r={15} className="pb-tablet" />;
              if (k < h[i]) return <circle key={k} cx={cx} cy={cy} r={15} className="pb-ghost" />;
              return null;
            })}
          </g>
        );
      })}
    </svg>
  );
}
