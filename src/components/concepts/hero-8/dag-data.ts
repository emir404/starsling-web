/**
 * Beat + geometry model for hero concept 8 (Figma 239:55 + the GitHub Actions
 * "workflow run" DAG reference). One looping run, restyled into Starsling's dark
 * blueprint language, authored to *show* the product's values mid-loop:
 *   - OPTIMIZATION — the matrix groups fan their jobs out in parallel and the
 *     three branches converge on a single merge gate.
 *   - SPEED — the jobs tick green in a fast burst and the total duration lands
 *     on a dramatically low number with a "5× faster" callout.
 *
 * All coordinates live on one flat CANVAS (canvas space); the stage scales the
 * plane to fit the lower frame. Nodes, connectors, cards and callout are all
 * positioned absolutely in this space so they share a single coordinate system.
 */

/** Logical plane — 1440 wide to match every other concept's scale math. */
export const CANVAS = { w: 1440, h: 760 } as const;

/** Run beats. Every component reads the current `step` and gates on these. */
export const BEAT = {
  /** The run summary + workflow header materialize; the DAG is empty. */
  trigger: 0,
  /** Matrix groups + the single node appear together; jobs spin in parallel. */
  fanout: 1,
  /** Jobs resolve to teal checks in a fast near-simultaneous burst. */
  ticking: 2,
  /** The three connectors light and a pulse converges on the merge gate. */
  connect: 3,
  /** The gate passes; Status flips to Success; the sources dim. */
  passed: 4,
  /** The total duration lands on the dramatic low number. */
  speed: 5,
  /** The "5× faster / 80% less build time" value callout surfaces. */
  callout: 6,
  /** Brief settle, then the cycle wraps. */
  hold: 7,
} as const;

export const STEP_COUNT = 8;

/** Per-beat hold durations (ms) for the auto-advance. ~13.3s/loop. */
export const BEAT_MS: readonly number[] = [
  1700, 1900, 1500, 1500, 1500, 1600, 2400, 2200,
];

/* ------------------------------------------------------------------ cards */

/** Top run-summary card. */
export const SUMMARY = {
  x: 80,
  y: 0,
  w: 1280,
  h: 150,
  trigger: "Triggered via pull request",
  actor: "emir404",
  action: "opened",
  pr: "#418",
  title: "agent-scheduler: cache-aware job placement",
  branch: "feat/parallel-runners",
  /** Status before / after the gate passes. */
  statusQueued: "Queued",
  statusSuccess: "Success",
  /** The speed payoff — lands at BEAT.speed. */
  duration: "47s",
  artifacts: "2",
} as const;

/** Workflow card + its header. */
export const WORKFLOW = {
  x: 80,
  y: 174,
  w: 1280,
  h: 586,
  file: "starsling-ci.yml",
  on: "on: pull_request",
} as const;

/** Total-duration text for a beat: blank until it lands at BEAT.speed. */
export function durationAt(beat: number): string {
  return beat >= BEAT.speed ? SUMMARY.duration : "—";
}

/* ------------------------------------------------------------------ nodes */

export type NodeKind = "matrix" | "single" | "sink";

export type JobSpec = {
  name: string;
  /** Stagger (s) within the fast tick burst. */
  tickDelay: number;
};

export type NodeSpec = {
  id: string;
  kind: NodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  /** Matrix only — the parallel job bank. */
  jobs?: readonly JobSpec[];
  /** Matrix only — summary line once complete, e.g. "6 jobs completed". */
  jobsLabel?: string;
  /** Matrix only — teal optimization line while running. */
  runningLabel?: string;
  /** Single/sink — wall time shown once resolved. */
  time?: string;
  /** Beat the node reveals at. */
  at: number;
  /** Beat its check(s) resolve at. */
  tickAt: number;
  /** Beat it dims to the done grey at (sources only). */
  doneAt?: number;
};

/**
 * DAG nodes: three sources stacked on the left, one sink on the right. The two
 * matrix groups carry a parallel bank of job dials; the single node and the
 * sink are pills. The sink is the only node that never dims.
 */
export const NODES: readonly NodeSpec[] = [
  {
    id: "matrixA",
    kind: "matrix",
    x: 150,
    y: 272,
    w: 300,
    h: 120,
    title: "Matrix: runner-fleet",
    jobs: [
      { name: "ubuntu-22.04", tickDelay: 0 },
      { name: "ubuntu-24.04", tickDelay: 0.05 },
      { name: "macos-14", tickDelay: 0.1 },
      { name: "windows-2022", tickDelay: 0.06 },
      { name: "arm64-large", tickDelay: 0.12 },
      { name: "gpu-runner", tickDelay: 0.08 },
    ],
    jobsLabel: "6 jobs completed",
    runningLabel: "6 agents · cache restored",
    at: BEAT.fanout,
    tickAt: BEAT.ticking,
    doneAt: BEAT.passed,
  },
  {
    id: "matrixB",
    kind: "matrix",
    x: 150,
    y: 424,
    w: 300,
    h: 96,
    title: "Matrix: cache-warm",
    jobs: [
      { name: "restore-cache", tickDelay: 0 },
      { name: "warm-deps", tickDelay: 0.07 },
    ],
    jobsLabel: "2 jobs completed",
    runningLabel: "2 agents · warming cache",
    at: BEAT.fanout,
    tickAt: BEAT.ticking,
    doneAt: BEAT.passed,
  },
  {
    id: "single",
    kind: "single",
    x: 150,
    y: 552,
    w: 300,
    h: 52,
    title: "Integration suite",
    time: "27s",
    at: BEAT.fanout,
    tickAt: BEAT.ticking,
    doneAt: BEAT.passed,
  },
  {
    id: "sink",
    kind: "sink",
    x: 980,
    y: 404,
    w: 300,
    h: 64,
    title: "e2e · merge-gate",
    time: "6s",
    at: BEAT.connect,
    tickAt: BEAT.passed,
  },
];

/* ------------------------------------------------------------- connectors */

export type Point = readonly [number, number];

export type EdgeSpec = {
  id: string;
  from: Point;
  to: Point;
  /** Precomputed cubic-Bézier path string. */
  d: string;
  /** Beat the connector + flow appear at. */
  at: number;
  /** Stagger (s) so the three pulses visibly converge. */
  flowDelay: number;
};

/**
 * Cubic Bézier with horizontal control handles — the connector leaves the
 * source's right edge flat, sweeps, and enters the sink's left edge flat
 * (the canonical Actions DAG curve).
 */
export function portPath([x1, y1]: Point, [x2, y2]: Point): string {
  const k = Math.max(60, (x2 - x1) * 0.5);
  return `M ${x1} ${y1} C ${x1 + k} ${y1}, ${x2 - k} ${y2}, ${x2} ${y2}`;
}

/** Source right-edge ports → sink left-edge ports, fanned ±16px at the join. */
export const EDGES: readonly EdgeSpec[] = (
  [
    { id: "a", from: [450, 332], to: [980, 420], flowDelay: 0 },
    { id: "b", from: [450, 472], to: [980, 436], flowDelay: 0.08 },
    { id: "c", from: [450, 578], to: [980, 452], flowDelay: 0.16 },
  ] as const
).map((e) => ({ ...e, d: portPath(e.from, e.to), at: BEAT.connect }));

/* --------------------------------------------------------------- callout */

/** Speed/optimization value callout, surfacing under the merge gate. */
export const CALLOUT = {
  at: BEAT.callout,
  x: 980,
  y: 520,
  w: 300,
  primary: "5× faster builds",
  caption: "80% LESS BUILD TIME",
  /** Wall-clock comparison bars (hero-4's COMPARE idiom). */
  rows: [
    { label: "GitHub-hosted", time: "4m 12s", width: 100, brand: false },
    { label: "Starsling", time: "47s", width: 19, brand: true },
  ],
} as const;

/* ----------------------------------------------------------------- chrome */

/** Decorative zoom cluster, bottom-right of the workflow card. */
export const ZOOM = { x: 1220, y: 696, size: 32, gap: 6 } as const;
