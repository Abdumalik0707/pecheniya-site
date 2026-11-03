// Melted-chocolate style drip edge. Place directly under a coloured section.
// The outline is a single smooth path: a wavy lower edge with drips that
// flare out of it (wide "shoulders"), narrow into a neck and end in a round
// bulb. Built once at module load from a fixed list, so server and client
// render identical SVG.

const W = 1440;
const BASE = 38; // average height of the solid band

// w = bulb width, h = how far the drip reaches, drop = falling droplet below it
const SPECS: { w: number; h: number; drop?: boolean }[] = [
  { w: 34, h: 92 },
  { w: 24, h: 62, drop: true },
  { w: 44, h: 138 },
  { w: 28, h: 74 },
  { w: 50, h: 112, drop: true },
  { w: 22, h: 58 },
  { w: 40, h: 148 },
  { w: 30, h: 82, drop: true },
  { w: 52, h: 120 },
  { w: 24, h: 66 },
  { w: 42, h: 140, drop: true },
  { w: 30, h: 78 },
  { w: 48, h: 108 },
  { w: 22, h: 60, drop: true },
  { w: 40, h: 130 },
  { w: 30, h: 84 },
];

// relative gap sizes between drips, so spacing looks hand-made
const GAP_PATTERN = [0.7, 1.4, 0.9, 1.2, 0.6, 1.3, 1, 0.8, 1.5, 0.7, 1.1, 0.9, 1.3, 0.8, 1, 1.2, 0.9];

function buildDrip() {
  const shoulder = (w: number) => Math.max(12, w * 0.5);
  const used = SPECS.reduce((sum, s) => sum + s.w + 2 * shoulder(s.w), 0);
  const gapUnits = GAP_PATTERN.slice(0, SPECS.length + 1).reduce((a, b) => a + b, 0);
  const unit = (W - used) / gapUnits;

  let path = `M0,0 L0,${BASE}`;
  let cur = 0;
  const drops: { cx: number; cy: number; r: number }[] = [];

  SPECS.forEach((s, i) => {
    const sh = shoulder(s.w);
    const r = s.w / 2;
    const xL = cur + GAP_PATTERN[i] * unit;
    const x = xL + sh; // left edge of the neck / bulb
    const xR = x + s.w + sh;
    const yb = BASE + (i % 3 === 0 ? 6 : i % 3 === 1 ? -3 : 2); // where the drip leaves the band
    const neckEnd = Math.max(yb + 6, s.h - r);

    // wavy band between drips
    const mid = (cur + xL) / 2;
    path += ` Q${mid.toFixed(1)},${BASE + (i % 2 ? -10 : 9)} ${xL.toFixed(1)},${yb}`;
    // left shoulder flowing into the neck
    path += ` C${(xL + sh * 0.8).toFixed(1)},${yb} ${x.toFixed(1)},${(yb + (neckEnd - yb) * 0.2).toFixed(1)} ${x.toFixed(1)},${neckEnd.toFixed(1)}`;
    // round bulb at the bottom
    path += ` A${r},${r} 0 0 0 ${(x + s.w).toFixed(1)},${neckEnd.toFixed(1)}`;
    // right side back up into the band
    path += ` C${(x + s.w).toFixed(1)},${(yb + (neckEnd - yb) * 0.2).toFixed(1)} ${(xR - sh * 0.8).toFixed(1)},${yb} ${xR.toFixed(1)},${yb}`;

    if (s.drop) drops.push({ cx: x + r, cy: s.h + 12 + r * 0.4, r: Math.max(4, r * 0.38) });
    cur = xR;
  });

  path += ` Q${((cur + W) / 2).toFixed(1)},${BASE + 10} ${W},${BASE} L${W},0 Z`;
  return { path, drops };
}

const { path: DRIP_PATH, drops: DROPS } = buildDrip();

export function Drip({ color = "var(--brand-red)", flip = false }: { color?: string; flip?: boolean }) {
  return (
    <svg
      className="drip"
      viewBox="0 0 1440 175"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <g fill={color}>
        <path d={DRIP_PATH} />
        {DROPS.map((d) => (
          <circle key={d.cx} cx={d.cx} cy={d.cy} r={d.r} />
        ))}
      </g>
    </svg>
  );
}
