/**
 * Beat + geometry model for hero concept 14 — a live build of the Figma
 * "Self-driving CI" hero diagram (file r77yKmqsK5pQU7jFQfOxTc):
 *   Scene A (race)   — a regular-CI run card next to a Starsling run card; both
 *     timers count up on one sped-up wall clock and both bars fill live. Starsling
 *     finishes first (5M 28S) while the regular runner is still going (~70%); the
 *     "30% FASTER ON STARSLING" badge then highlights the win.
 *   Scene B (shards) — the Starsling card slides left and forks (sharp orthogonal
 *     connector) into three parallel SHARD cards that fill/​count live to 4M 18S /
 *     3M 50S / 3M 50S, under a "WHY IS IT FASTER?" title and an "@starsling-bot ·
 *     AUTONOMOUS PRS" footer.
 *
 * Everything lives on one flat CANVAS plane sized to the Figma panel (1376×663);
 * the stage *contain*-scales the plane to fit the dark panel on both axes. Colors
 * are the hardcoded Figma surface values, not theme tokens.
 */

export type Point = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };
/** A centered anchor for hug-width chips (badge / timers / footer). */
export type Anchor = { cx: number; cy: number };

/** Logical plane — the Figma dark panel's own coordinate space. */
export const CANVAS = { w: 1376, h: 663 } as const;
const CENTER = { x: CANVAS.w / 2, y: CANVAS.h / 2 } as const; // 688, 331.5

/** Compare/new card size and shard card size (Figma 434×85 / 311×85). */
export const CARD = { w: 434, h: 85 } as const;
export const SHARD = { w: 311, h: 85 } as const;

function centeredRect(cx: number, cy: number, w: number, h: number): Rect {
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

/* ------------------------------------------------------------------- colors */

export const COLOR = {
  panel: "#1e2527",
  node: "#374244",
  tab: "#283436",
  barTrack: "#3e4a4c",
  amberValue: "rgba(253,203,137,0.8)",
  amberFill: "#a48a68",
  amberTab: "#363028",
  cyanValue: "rgba(71,214,238,0.8)",
  cyanAccent: "#47d6ee",
  cyanFill: "#64d3e6",
  cyanTab: "#36565c",
  whiteLabel: "rgba(255,255,255,0.8)",
} as const;

export type Tone = "neutral" | "amber" | "cyan";

/* ---------------------------------------------------------- run times (sec) */

/** Each run's full (simulated) duration. The race shares one sped-up wall clock,
 * so the bars/timers stay on the same time base and Starsling visibly wins. */
export const OLD_TOTAL = 468; // 7m 48s — regular CI
export const NEW_TOTAL = 328; // 5m 28s — Starsling hardware (30% faster)
export const NEW_SOURCE_TOTAL = 468; // 7m 48s — the un-sharded job in Scene B
export const SHARD_TOTALS = [258, 230, 230] as const; // 4m18s / 3m50s / 3m50s

/** mm:ss → "5M 28S" (minutes unpadded, seconds zero-padded, uppercase). */
export function fmtRunTime(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  return `${m}M ${String(s % 60).padStart(2, "0")}S`;
}

/* -------------------------------------------------------------------- beats */

/** Run beats. Every component reads the current `step` and gates on these. */
export const BEAT = {
  /** Scene A: both bars/timers run live on the shared wall clock. */
  raceRun: 0,
  /** Scene A: Starsling has finished; "30% FASTER ON STARSLING" badge highlights
   * while the regular runner keeps creeping/ticking. */
  badge: 1,
  /** Scene A: hold — regular runner still ticking (never completes on screen). */
  aHold: 2,
  /** Transition: regular card fades; Starsling card slides left; title → WHY. */
  shift: 3,
  /** Scene B: fork draws + pulses; the three shard cards pop in (bars empty). */
  forkDraw: 4,
  /** Scene B: shard bars fill + timers count live; footer reveals. */
  shardsRun: 5,
  /** Scene B: settle, then the cycle wraps. */
  bHold: 6,
} as const;

export const STEP_COUNT = 7;

/** Per-beat hold durations (ms) for the auto-advance. ≈13.5s/loop. The forkDraw
 * beat is long enough for the three connectors to trace in one by one. */
export const BEAT_MS: readonly number[] = [
  2600, 1700, 1300, 1100, 2100, 3000, 1700,
];

/** Wall-clock targets (sec) the race clock eases to on beats raceRun/badge/aHold.
 * Starsling completes exactly at the raceRun target (NEW_TOTAL); afterwards the
 * clock creeps so the regular runner keeps ticking without ever completing. */
export const RACE_ELAPSED: readonly number[] = [NEW_TOTAL, 370, 395];

/** Scene-B shard clock target — the slowest shard's total, so all complete. */
export const SHARD_RUN_MAX = Math.max(...SHARD_TOTALS);

/** Scene B (shards) begins at the `shift` beat (when the new card slides left). */
export function sceneOf(beat: number): "A" | "B" {
  return beat < BEAT.shift ? "A" : "B";
}

/* ----------------------------------------------------------- choreography */

/**
 * One-time mount entrance for the diagram — a staggered blur-in that picks up
 * where the headline/form entrance (`HeroTextGroup`) leaves off, so the whole
 * hero reads as a single timeline. All entrance timing lives here so it stays
 * tunable in one place; `EASE` (shared/motion) is the easing language.
 */
export const ENTRANCE = {
  /** Lead-in before the first node lands — overlaps the text band's settle. */
  leadIn: 0.45,
  /** Gap between consecutive nodes (matches HeroTextGroup's cadence). */
  stagger: 0.09,
  /** Per-node settle. */
  duration: 0.6,
  /** Blur-in keyframe each Scene-A node starts from (reduced motion → opacity). */
  from: { opacity: 0, y: 16, scale: 0.98, filter: "blur(8px)" } as Record<
    string,
    number | string
  >,
};

/** Reading-order slot (0-based) → absolute mount-entrance delay (sec). */
export const enterDelay = (slot: number): number =>
  ENTRANCE.leadIn + slot * ENTRANCE.stagger;

/** Scene-B shard reveal delay — single source shared with the stage. */
export const shardEnterDelay = (i: number): number => 0.1 + i * 0.08;

/** Fork connector cascade — the three branches trace to their shards ONE BY ONE
 * (each begins ~as the previous connects), once the shards have landed. */
export const FORK = {
  /** First branch begins — after the top shard has settled (~0.6s). */
  start: 0.65,
  /** Gap between consecutive branches — wide enough to read as sequential. */
  step: 0.42,
  /** How long each branch takes to trace from the source to its shard. */
  drawDur: 0.4,
};

/** Fork branch i's start delay — staggered so the lines connect one by one. */
export const forkFlowDelay = (i: number): number => FORK.start + i * FORK.step;

/* ----------------------------------------------------------------- geometry */

/** Output port (right-edge center) + input port (left-edge center), canvas space. */
export function outPort(n: Rect): Point {
  return { x: n.x + n.w + 2, y: n.y + n.h / 2 };
}
export function inPort(n: Rect): Point {
  return { x: n.x - 2, y: n.y + n.h / 2 };
}

/* ----- Scene A: two cards centered side by side (centers ±279) ----- */

export const OLD_CARD: Rect = centeredRect(CENTER.x - 279, CENTER.y, CARD.w, CARD.h);
/** The shared NEW card — Scene-A position (right of OLD). */
export const NEW_CARD_A: Rect = centeredRect(CENTER.x + 279, CENTER.y, CARD.w, CARD.h);

/** Timers sit centered under each card (94.5px below the card center). */
export const OLD_TIMER: Anchor = { cx: CENTER.x - 279, cy: CENTER.y + 94.5 };
export const NEW_TIMER_A: Anchor = { cx: CENTER.x + 279, cy: CENTER.y + 94.5 };

/** Top-center chip slot — shared by the badge and the Scene-B title. Raised to
 * 44 (from the Figma's 80) so the title clears the top shard card. */
export const TOP_SLOT = { cx: CENTER.x, top: 44 } as const;

/* ----- Scene B: new card (left) → fork → three shards (right) ----- */

/** The shared NEW card — Scene-B position (left, feeding the fork). */
export const NEW_CARD_B: Rect = centeredRect(CENTER.x - 334.28, CENTER.y, CARD.w, CARD.h);
/** New-card timer in Scene B (under the slid card) — "7M 48S". */
export const NEW_TIMER_B: Anchor = { cx: CENTER.x - 334.28, cy: CENTER.y + 94.5 };

/** Three shard cards, right column (centers at panel-center ±135.64 and center). */
const SHARD_DX = [287.34, 291.34, 291.34];
const SHARD_PITCH = 135.64;
export const SHARDS: readonly Rect[] = [-1, 0, 1].map((k, i) =>
  centeredRect(CENTER.x + SHARD_DX[i], CENTER.y + k * SHARD_PITCH, SHARD.w, SHARD.h),
);
/** Small timer chips sitting to the right of each shard (panel-center + 509). */
export const SHARD_TIMERS: readonly Anchor[] = [-1, 0, 1].map((k) => ({
  cx: CENTER.x + 509.03,
  cy: CENTER.y + k * SHARD_PITCH,
}));

/** "@starsling-bot · AUTONOMOUS PRS" footer, centered near the panel bottom. */
export const FOOTER = { cx: CENTER.x, top: 541 } as const;

/* --------------------------------------------------------------- connectors */

export type EdgeSpec = { id: string; d: string; flowDelay: number };

/**
 * Sharp orthogonal branch (0 corner radius, matching the project's radius-0
 * system): leave the source port horizontal to a shared mid-x bus, run vertical
 * to the target row, then horizontal into the target port. The middle branch
 * (same y) collapses to a straight line.
 */
export function edgePath(s: Point, t: Point): string {
  const midX = s.x + (t.x - s.x) / 2;
  return `M ${s.x} ${s.y} L ${midX} ${s.y} L ${midX} ${t.y} L ${t.x} ${t.y}`;
}

/** Fork: the new card's right port → each shard's left port (Scene-B positions).
 * `flowDelay` (see `forkFlowDelay`) holds each branch until its target shard has
 * landed, so the line traces into a node that is already on screen. */
export const FORK_EDGES: readonly EdgeSpec[] = SHARDS.map((shard, i) => ({
  id: `fork-${i}`,
  d: edgePath(outPort(NEW_CARD_B), inPort(shard)),
  flowDelay: forkFlowDelay(i),
}));

/* --------------------------------------------------------------------- copy */

export const BADGE_TEXT = "30% FASTER ON STARSLING";
export const WHY_TEXT = "WHY IS IT FASTER?";
export const BOT_TEXT = "@STARSLING-BOT";
export const PRS_TEXT = "AUTONOMOUS PRS";

export const RUNS_ON_OLD = "ubuntu-latest";
export const RUNS_ON_NEW = "starsling-ubuntu-latest";
