import { cn } from "@/lib/utils";

/**
 * Static "sling ring" constellation — the footer's node/line motif
 * (`FooterNetwork`, Figma 350:2) frozen into a decorative background for the hero
 * and the dark diagram panels. Concentric-ring nodes joined by straight lines,
 * all drawn from `currentColor`, so a surface sets the look with a `text-*` class
 * (+ `mix-blend-overlay` / opacity on the wrapper). Two seed layouts give the
 * variations the design calls for. Sharp strokes only — no rounded line caps —
 * per the blueprint aesthetic. Purely decorative (`aria-hidden`).
 */

type Pt = { x: number; y: number };
type Edge = readonly [number, number];
type Layout = { w: number; h: number; nodes: readonly Pt[]; edges: readonly Edge[] };

/** Preset A — dense spread echoing the footer constellation (hero / large panels). */
const LAYOUT_A: Layout = {
  w: 1376,
  h: 663,
  nodes: [
    { x: 150, y: 92 },
    { x: 560, y: 150 },
    { x: 920, y: 70 },
    { x: 1240, y: 132 },
    { x: 338, y: 384 },
    { x: 762, y: 440 },
    { x: 1082, y: 300 },
    { x: 1300, y: 470 },
    { x: 182, y: 560 },
    { x: 642, y: 602 },
  ],
  edges: [
    [0, 1], [0, 4], [0, 8], [1, 2], [1, 5],
    [2, 6], [2, 3], [3, 6], [4, 5], [4, 8],
    [5, 9], [5, 6], [6, 7], [7, 9], [8, 9],
  ],
};

/** Preset B — sparser scatter for secondary surfaces (a quieter variation). */
const LAYOUT_B: Layout = {
  w: 1376,
  h: 663,
  nodes: [
    { x: 220, y: 128 },
    { x: 700, y: 86 },
    { x: 1150, y: 180 },
    { x: 430, y: 470 },
    { x: 900, y: 520 },
    { x: 1244, y: 472 },
  ],
  edges: [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5],
  ],
};

const LAYOUTS = { a: LAYOUT_A, b: LAYOUT_B } as const;

export function RingConstellation({
  preset = "a",
  className,
  strokeWidth = 1.5,
}: {
  preset?: keyof typeof LAYOUTS;
  className?: string;
  /** hairline weight; kept constant on screen via non-scaling-stroke */
  strokeWidth?: number;
}) {
  const { w, h, nodes, edges } = LAYOUTS[preset];

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("pointer-events-none text-current", className)}
    >
      {/* edges — drawn first so nodes sit on top */}
      {edges.map(([a, b]) => {
        const na = nodes[a];
        const nb = nodes[b];
        return (
          <line
            key={`${a}-${b}`}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke="currentColor"
            strokeOpacity={0.5}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}

      {/* ring nodes — two concentric strokes + a filled core (the footer glyph) */}
      {nodes.map((n, i) => (
        <g key={i} transform={`translate(${n.x} ${n.y})`}>
          <circle
            r={38}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.45}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
          <circle
            r={14}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.7}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
          />
          <circle r={5} fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}
