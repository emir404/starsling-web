/**
 * Beat + geometry model for hero concept 8 — "Self-driving CI" run graph
 * (Figma 234:6277). A GitHub Actions workflow-run DAG restaged in the blueprint
 * language: two matrix groups and an integration test fan into a final `e2e`
 * gate. The run animates one looping pass driven by the shared `useStepCycle`:
 * queued → running → upstream passed (connectors draw) → e2e running → success.
 *
 * Geometry lives on a fixed 1200×620 plane (summary bar above the e2e.yml card),
 * centered on the stage and scaled to fit. Node + connector coordinates share
 * the card's graph-body space so the fan-in paths route off literal constants.
 */

// ---- Beats -----------------------------------------------------------------

export const BEAT = {
  /** Cards mounted, jobs queued — no status glyphs, no lines. */
  queued: 0,
  /** The three upstream jobs spin up; their duration counters start ticking. */
  running: 1,
  /** Upstream jobs pass (teal tick); their fan-in connectors draw into e2e. */
  upstream: 2,
  /** The e2e gate runs. */
  e2e: 3,
  /** e2e passes; summary Status flips to Success and the total settles. */
  success: 4,
} as const;

export const STEP_COUNT = 5;

/** Per-beat hold durations (ms) for the auto-advance. */
export const BEAT_MS: readonly number[] = [1300, 2400, 1900, 1800, 3400];

// ---- Plane / region geometry ----------------------------------------------

export const PLANE = { w: 1200, h: 620 } as const;

/** Run-summary bar, plane-relative (above the card). */
export const SUMMARY_BOX = { x: 0, y: 0, w: 1200, h: 96 } as const;

/** The e2e.yml workflow card on the plane. */
export const CARD = { x: 0, y: 140, w: 1200, h: 470 } as const;

/** Graph body inside the card — the node + connector coordinate space. */
export const GRAPH = { x: 24, y: 96, w: 1152, h: 348 } as const;

/** Blueprint graph-paper cell size (screen px) for the full-bleed backdrop. */
export const GRID = { cell: 60 } as const;

// ---- Run content (Starsling-branded) --------------------------------------

export type SummarySpec = {
  trigger: string;
  /** PR author handle (also seeds the monogram avatar). */
  actor: string;
  /** The triggering event, e.g. "synchronize #482". */
  action: string;
  /** Branch chip text (truncated with an ellipsis). */
  branch: string;
  /** Count-up target for "Total duration" (seconds). */
  totalSeconds: number;
  /** "Artifacts" column value. */
  artifacts: string;
  /** Card title + subtitle. */
  workflow: string;
  on: string;
};

export const SUMMARY: SummarySpec = {
  trigger: "Triggered via pull request 3 days ago",
  actor: "emir404",
  action: "synchronize #482",
  branch: "starsling:fix/runner-warm-pool…",
  totalSeconds: 794, // 13m 14s
  artifacts: "2",
  workflow: "e2e.yml",
  on: "on: pull_request",
};

// ---- Nodes -----------------------------------------------------------------

export type NodeId = "adapter" | "smoke" | "integ" | "e2e";
export type NodeKind = "matrix" | "job";

export type NodeSpec = {
  id: NodeId;
  kind: NodeKind;
  label: string;
  /** Matrix nodes only — the job-count shown in "N jobs completed". */
  jobs?: number;
  /** Duration count-up target (seconds). */
  target: number;
  /** Beat the node starts running / finishes. */
  runAt: number;
  passAt: number;
  /** Stagger (s) so the three upstream nodes don't flip on the same frame. */
  delay: number;
  /** Position in the graph-body space. */
  x: number;
  y: number;
  w: number;
  h: number;
};

/** Three upstream nodes stacked at the left; the e2e gate centered at the right. */
export const NODES: readonly NodeSpec[] = [
  { id: "adapter", kind: "matrix", label: "Matrix: adapter-integration", jobs: 6, target: 226, runAt: BEAT.running, passAt: BEAT.upstream, delay: 0.0, x: 40, y: 6, w: 300, h: 96 },
  { id: "smoke", kind: "matrix", label: "Matrix: smoke", jobs: 2, target: 92, runAt: BEAT.running, passAt: BEAT.upstream, delay: 0.12, x: 40, y: 126, w: 300, h: 96 },
  { id: "integ", kind: "job", label: "Integration test", target: 216, runAt: BEAT.running, passAt: BEAT.upstream, delay: 0.24, x: 40, y: 246, w: 300, h: 64 },
  { id: "e2e", kind: "job", label: "e2e", target: 3, runAt: BEAT.e2e, passAt: BEAT.success, delay: 0.0, x: 812, y: 137, w: 300, h: 64 },
];

export function nodeById(id: NodeId): NodeSpec {
  const node = NODES.find((n) => n.id === id);
  if (!node) throw new Error(`unknown node ${id}`);
  return node;
}

/** Every upstream node fans into the e2e gate. */
export const EDGES: readonly { from: NodeId }[] = [
  { from: "adapter" },
  { from: "smoke" },
  { from: "integ" },
];

// ---- Port + path geometry --------------------------------------------------

export type Point = { x: number; y: number };

/** Output port — a node's right-center. */
export function out(n: NodeSpec): Point {
  return { x: n.x + n.w, y: n.y + n.h / 2 };
}

/** Input port — a node's left-center. */
export function inp(n: NodeSpec): Point {
  return { x: n.x, y: n.y + n.h / 2 };
}

/**
 * Fan-in path from source `s` to target `t`: two cubic béziers sharing a
 * vertical bus at the horizontal midpoint, giving the rounded right-angle elbow
 * the GitHub run graph uses. Pure function of the endpoints.
 */
export function edgePath(s: Point, t: Point): string {
  const xMid = (s.x + t.x) / 2;
  const k = 0.5; // control-handle softness
  const bend = 0.15;
  return [
    `M ${s.x} ${s.y}`,
    `C ${s.x + (xMid - s.x) * k} ${s.y}, ${xMid} ${s.y}, ${xMid} ${s.y + (t.y - s.y) * bend}`,
    `C ${xMid} ${t.y - (t.y - s.y) * bend}, ${xMid + (t.x - xMid) * k} ${t.y}, ${t.x} ${t.y}`,
  ].join(" ");
}

/** Format seconds as `Ns` / `Mm Ns` / `Mm`. */
export function fmt(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const r = seconds % 60;
  return r ? `${m}m ${r}s` : `${m}m`;
}
