/**
 * Beat + geometry model for hero concept 13 — "self-driving dispatcher".
 *
 * The autonomy story: a central StarSling AUTOPILOT hub reads your test suite
 * (left), then auto-routes shards out along radial spokes to five parallel
 * runners fanned in an arc on the right. A radar sweep + pulsing rings sell the
 * "self-driving" read; the spokes use the same polished connector idiom as the
 * live hero. Colors mirror hero-10/11's Figma panel surfaces.
 */

export const CANVAS = { w: 1376, h: 700 } as const;

export const COLOR = {
  node: "#374244",
  tab: "#283436",
  cell: "#3e4a4c",
  teal: "#30a6bb",
  captionTeal: "#21d5ee",
  chipText: "#0c90a6",
  chipBg: "rgba(12,144,166,0.3)",
} as const;

/* -------------------------------------------------------------------- beats */

export const BEAT = {
  /** The hub powers on and reads the incoming test suite. */
  ingest: 0,
  /** It auto-splits: a radar sweep fans spokes out and the runners pop in. */
  route: 1,
  /** Every runner executes at once (parallel run sweeps + flowing spokes). */
  run: 2,
  /** Runners finish; the speed-up payoff lands. */
  done: 3,
  /** Settle, then the cycle wraps. */
  hold: 4,
} as const;

export const STEP_COUNT = 5;
export const BEAT_MS: readonly number[] = [2000, 2200, 2000, 2200, 1700];

/* -------------------------------------------------------------------- nodes */

/** The central autopilot hub. */
export const HUB = { cx: 430, cy: 350, r: 92 } as const;

/** Incoming test-suite card (left), feeding the hub. Center y aligns with hub. */
export const SUITE = { x: 70, y: 230, w: 210, h: 240, title: "TEST SUITE", pairs: 3 } as const;

/** Parallel runner cards, fanned in an arc to the right of the hub. */
export const RUNNER_W = 210;
export const RUNNER_H = 98;
const RUNNER_R = 440;
const RUNNER_ANGLES = [-40, -20, 0, 20, 40];
export const RUNNERS = RUNNER_ANGLES.map((deg, i) => {
  const a = (deg * Math.PI) / 180;
  const cx = HUB.cx + RUNNER_R * Math.cos(a);
  const cy = HUB.cy + RUNNER_R * Math.sin(a);
  // card left edge sits on the arc point, so its left port = the spoke endpoint
  return { id: `runner-${i}`, deg, cx, cy, x: cx, y: cy - RUNNER_H / 2 };
});

/* --------------------------------------------------------------- connectors */

export type Spoke = { id: string; d: string; flowDelay: number };

/** Suite → hub (horizontal feed). */
export const SUITE_SPOKE: Spoke = {
  id: "suite",
  d: `M ${SUITE.x + SUITE.w + 2} ${HUB.cy} L ${HUB.cx - HUB.r - 6} ${HUB.cy}`,
  flowDelay: 0,
};

/** Hub → each runner (straight radial spokes, cascaded). */
export const SPOKES: Spoke[] = RUNNERS.map((r, i) => {
  const a = (r.deg * Math.PI) / 180;
  const sx = HUB.cx + (HUB.r + 6) * Math.cos(a);
  const sy = HUB.cy + (HUB.r + 6) * Math.sin(a);
  return { id: `spoke-${i}`, d: `M ${sx} ${sy} L ${r.cx - 4} ${r.cy}`, flowDelay: i * 0.1 };
});

/* ----------------------------------------------------------------- captions */

/** One line per beat, narrating the self-driving auto-split. */
export const CAPTIONS: readonly string[] = [
  "STARSLING READS YOUR TEST SUITE",
  "AUTO-SPLITS IT INTO PARALLEL SHARDS",
  "RUNS EVERY SHARD AT ONCE",
  "10× FASTER — SELF-DRIVING, NO CONFIG",
];

/** Parallel wall-clock payoff (matches hero-11/12). */
export const PAYOFF_TIME = "1M 18S";
