/**
 * Beat + geometry model for hero concept 10 — a 1:1 build of the Figma
 * "Self-driving CI" run (file r77yKmqsK5pQU7jFQfOxTc, frames 239:55 / 246:158 /
 * 246:332 / 246:696). One looping workflow run that passes through the four
 * Figma keyframe scenes:
 *   1. trigger  — the run-summary bar materializes; the graph is empty.
 *   2. running  — three source nodes appear, their agent dials spinning.
 *   3. passed   — the dials tick green, the connectors fan into the merge gate.
 *   4. payoff   — the graph dims and the speed/cost stats overlay reveals.
 *
 * Everything lives on one flat CANVAS plane (the inner #1b2123 graph surface);
 * the stage scales the plane to fit the framed panel. Summary bar, nodes,
 * connectors and the stats overlay all use this single coordinate system.
 */

export type Point = { x: number; y: number };

/** Logical plane — the inner graph canvas (Figma node 246:748), 1376 × 698. */
export const CANVAS = { w: 1376, h: 698 } as const;

/**
 * Figma surface colors. None of these are theme tokens (the project's `.dark`
 * palette differs), so they are hardcoded here to match the artboard exactly.
 * The teal accent is applied via a scoped `--brand` override on the canvas so
 * the reused `Marker`/connectors land on `#30a6bb` without forking them.
 */
export const COLOR = {
  panel: "#191f20",
  panelBorder: "#eff3f4",
  canvas: "#1b2123",
  bar: "#242d2e",
  node: "#374244",
  tab: "#283436",
  cell: "#3e4a4c",
  gate: "#106877",
  gatePort: "#79dbeb",
  teal: "#30a6bb",
} as const;

/** Run beats. Every component reads the current `step` and gates on these. */
export const BEAT = {
  /** The run-summary bar + PR row materialize; the graph is empty. (Scene 1) */
  trigger: 0,
  /** Three source nodes appear; agent dials spin; status → On action. (Scene 2) */
  fanout: 1,
  /** Dials resolve to teal checks; matrix labels flip to "… jobs completed". */
  ticking: 2,
  /** The merge gate appears; the three connectors draw + pulse toward it. */
  connect: 3,
  /** The gate is solid; status → Passed; duration lands on 23s. (Scene 3) */
  passed: 4,
  /** The gate + connectors dim toward the payoff. */
  dim: 5,
  /** The speed/cost stats overlay reveals. (Scene 4) */
  payoff: 6,
  /** Brief settle, then the cycle wraps. */
  hold: 7,
} as const;

export const STEP_COUNT = 8;

/** Per-beat hold durations (ms) for the auto-advance. ≈14.4s/loop. */
export const BEAT_MS: readonly number[] = [
  1700, 1900, 1500, 1600, 1700, 1200, 2600, 2200,
];

/* ------------------------------------------------------------- summary bar */

/** Top run-summary bar content. (It renders above the plane in the text-group
 *  grid — see `run-summary-bar.tsx` — so it carries no canvas geometry.) */
export const SUMMARY = {
  trigger: "Triggered via pull request just now",
  prefix: "emir404 opened #418, ",
  branch: "feat: parallel runners",
  /** Status text per phase. Figma typo'd scenes 3/4 as "Queued"; we use Passed. */
  statusQueued: "Queued",
  statusRunning: "Running",
  statusPassed: "Passed",
  /** Total duration counts up to this and lands at BEAT.passed. */
  totalSeconds: 23,
  /** Build artifacts, revealed as named chips one by one at the passed beat. */
  artifactList: ["coverage.xml", "build.log"],
} as const;

/** Total-duration string. Pluralizes so the live count reads naturally. */
export function fmtSeconds(n: number): string {
  return `${n} second${n === 1 ? "" : "s"}`;
}

/* ------------------------------------------------------------------ nodes */

export type MatrixNodeSpec = {
  id: string;
  /** Reveal order so the source cards enter one by one (0 = first). */
  order: number;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  /** Grid columns for the agent cells. */
  cols: number;
  /** Number of 32px agent cells. */
  count: number;
  /** Running line, e.g. "12 agents". */
  agentsLabel: string;
  /** Running note that follows the agents count, e.g. "cache restored". */
  runningNote: string;
  /** Whether the running note is teal (fleet) or white (cache-warm). */
  noteTeal: boolean;
  /** Completed line, e.g. "12 jobs completed". */
  completedLabel: string;
  /** Output port (right-edge center), canvas space. */
  out: Point;
};

/** The two matrix groups: a 6×2 runner fleet and a 4-wide cache-warm row. */
export const MATRIX_NODES: readonly MatrixNodeSpec[] = [
  {
    id: "fleet",
    order: 0,
    x: 162,
    y: 191,
    w: 248,
    h: 145,
    title: "Matrix: Runner Fleet",
    cols: 6,
    count: 12,
    agentsLabel: "12 agents",
    runningNote: "cache restored",
    noteTeal: true,
    completedLabel: "12 jobs completed",
    out: { x: 410, y: 263.5 },
  },
  {
    id: "cache",
    order: 1,
    x: 92,
    y: 415,
    w: 184,
    h: 120,
    title: "Matrix: Cache-Warm",
    cols: 4,
    count: 4,
    agentsLabel: "4 agents",
    runningNote: "warming cache",
    noteTeal: false,
    completedLabel: "4 jobs completed",
    out: { x: 276, y: 483.5 },
  },
];

/** The single test node (one agent cell). */
export const SINGLE_NODE = {
  id: "suite",
  order: 2,
  x: 378,
  y: 567,
  w: 175,
  h: 86,
  title: "Integration Suite",
  out: { x: 553, y: 618.5 },
} as const;

/** The merge-gate sink: a solid teal bar with the e2e / merge-gate labels. */
export const GATE_NODE = {
  id: "gate",
  x: 919,
  y: 340,
  w: 245,
  h: 48,
  left: "e2e",
  right: "merge gate",
  /** Input port (left-edge center), canvas space. */
  in: { x: 917, y: 364 } as Point,
} as const;

/* ------------------------------------------------------------- connectors */

export type EdgeSpec = {
  id: string;
  from: Point;
  /** Precomputed cubic-Bézier path string. */
  d: string;
  /** Stagger (s) so the three pulses visibly converge. */
  flowDelay: number;
};

/**
 * Near-straight fan-in: leave the source's right port nearly horizontal, sweep
 * gently, enter the gate's left port flat. Short handles (vs. a half-span
 * handle) keep the lines straight like the Figma reference.
 */
export function fanInPath(s: Point, t: Point): string {
  const k = Math.min(140, Math.abs(t.x - s.x) * 0.28);
  return `M ${s.x} ${s.y} C ${s.x + k} ${s.y}, ${t.x - k} ${t.y}, ${t.x} ${t.y}`;
}

/** Three source right-ports → the single merge-gate left-port. */
export const EDGES: readonly EdgeSpec[] = [
  { id: "fleet", from: MATRIX_NODES[0].out, flowDelay: 0 },
  { id: "cache", from: MATRIX_NODES[1].out, flowDelay: 0.08 },
  { id: "suite", from: SINGLE_NODE.out, flowDelay: 0.16 },
].map((e) => ({ ...e, d: fanInPath(e.from, GATE_NODE.in) }));

/* ----------------------------------------------------------- stats overlay */

/** Scene-4 speed/cost payoff overlay, positioned in canvas space. */
export const STATS = {
  /** Teal step bracket framing the stats block (Figma 246:833): a left vertical
   *  down to `mid`, a full-width rule across, then a right vertical to the foot. */
  bracket: { x: 549, y: 194, w: 176, h: 459, mid: 255 },
  /** STARSLING wordmark — text only, no icon (Figma 246:835 / Group 28). */
  wordmark: { x: 592, y: 215, w: 112, h: 17 },
  rows: [
    {
      x: 593,
      valueY: 258,
      value: "1.5 minutes",
      noteY: 307,
      note: "in build time in usual commits",
    },
    {
      x: 593,
      valueY: 361,
      value: "80%",
      noteY: 411,
      note: "cost reduction",
    },
  ],
  trusted: { x: 768, y: 522, label: "Trusted by the best" },
  logos: [
    { src: "/logos/google.svg", x: 768, y: 565, w: 75, h: 25, alt: "Google" },
    { src: "/logos/sim.svg", x: 882, y: 564, w: 49, h: 23, alt: "Sim" },
    { src: "/logos/langchain.svg", x: 970, y: 565, w: 130, h: 24, alt: "LangChain" },
    { src: "/logos/crewai.svg", x: 1140, y: 562, w: 81, h: 27, alt: "crewAI" },
  ],
} as const;
