/**
 * Beat + geometry model for hero concept 11 — a 1:1 build of the Figma
 * "Self-driving CI" two-scene parallel-run diagram (file r77yKmqsK5pQU7jFQfOxTc):
 *   Scene 1 (282:1367 / illustration 282:1419) — one RANDOM TEST card fans out
 *     into five parallel test cards; caption "ANALYZES … SPLITS … PARALLEL …
 *     10X"; payoff chip "TIME SAVED: 1M 18S".
 *   Scene 2 (282:1567 / illustration 282:1619) — the five parallel cards slide
 *     left and fan *in* to a tall TEST REPORTS card; caption "CREATES TEST
 *     REPORTS … MEMORIES … SELF-DRIVES".
 *
 * Everything lives on one flat CANVAS plane (the Figma illustration frame); the
 * stage scales the plane to fit the framed panel. Nodes, connectors, brackets
 * and captions all use this single coordinate system. Colors + the card system
 * are shared 1:1 with hero-10's `ci-run-data.ts`.
 */

export type Point = { x: number; y: number };

/** Logical plane — the Figma illustration frame (282:1419 / 282:1619), 1376 × 762. */
export const CANVAS = { w: 1376, h: 762 } as const;

/**
 * Figma surface colors. None are theme tokens (the project's `.dark` palette
 * differs), so they are hardcoded to match the artboard exactly.
 * `teal` is the connector teal (shared with hero-10); `captionTeal` is the
 * brighter cyan the Figma uses for highlighted caption words + the flow pulse.
 */
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

/** Run beats. Every component reads the current `step` and gates on these. */
export const BEAT = {
  /** Scene 1: RANDOM TEST card + caption line 1 ("ANALYZES … SPLITS"). */
  analyze: 0,
  /** Scene 1: fan-out draws + pulses; the five parallel cards pop in; line 2. */
  split: 1,
  /** Scene 1: bracket draws; TIME SAVED chip reveals + counts up to 1M 18S. */
  timesaved: 2,
  /** Scene 1: brief settle. */
  s1hold: 3,
  /** Transition: scene-1 elements fade; the five cards slide 542 → 144. */
  shift: 4,
  /** Scene 2: fan-in draws + pulses; REPORTS card rows fill; caption line 1. */
  reports: 5,
  /** Scene 2: bracket draws; caption lines 2–3 ("MEMORIES … SELF-DRIVES"). */
  memory: 6,
  /** Scene 2: settle, then the cycle wraps. */
  s2hold: 7,
} as const;

export const STEP_COUNT = 8;

/**
 * Per-beat hold durations (ms) for the auto-advance. ≈15.8s/loop. Beats that
 * carry a cascade (split: fan-out relay + parallel run; timesaved: bracket →
 * count-up) get extra room so the choreography lands before the beat advances.
 */
export const BEAT_MS: readonly number[] = [
  1900, 2500, 2300, 1400, 1400, 2300, 2300, 1700,
];

/** Scene 2 begins at the `shift` beat (when the cards slide left). */
export function sceneOf(beat: number): 1 | 2 {
  return beat < BEAT.shift ? 1 : 2;
}

/* ------------------------------------------------------------- choreography */

/**
 * Per-element entrance timing (seconds), kept here so the scene-1 "speed-up"
 * story reads as one designed sequence rather than each component guessing its
 * own delay. The fan-out is a relay: a connector draws, its card lands at the
 * tip, and only once all five have arrived do they *run together* — that
 * simultaneity is what reads as parallelism, and as the win over the lone
 * serial test (which fills slowly on its own beforehand).
 */
/** Gap between consecutive branches as the fan cascades out / converges in. */
export const BRANCH_STAGGER = 0.1;
/** How long a connector takes to draw — a card lands just as its line arrives. */
export const CONNECTOR_DRAW = 0.55;
/** A parallel card's entrance delay: it pops at the tip of its own connector. */
export function cardLandDelay(index: number): number {
  return CONNECTOR_DRAW + index * BRANCH_STAGGER;
}
/** When the five parallel runs kick off — together, once the last card landed. */
export const PARALLEL_RUN_AT = CONNECTOR_DRAW + 4 * BRANCH_STAGGER + 0.5;
/** Run-sweep durations: the serial test is slow; the parallel shards are quick. */
export const SERIAL_RUN = 1.5;
export const PARALLEL_RUN = 0.8;

/* -------------------------------------------------------------------- nodes */

export type NodeSpec = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  /** Body content rows: each "pair" is a 32px bar above a 22px bar. */
  pairs: number;
};

/** Output port (right-edge center) + input port (left-edge center), canvas space. */
export function outPort(n: { x: number; y: number; w: number; h: number }): Point {
  return { x: n.x + n.w + 2, y: n.y + n.h / 2 };
}
export function inPort(n: { x: number; y: number; h: number }): Point {
  return { x: n.x - 2, y: n.y + n.h / 2 };
}

/**
 * The single serial test (Scene 1 source). `y` is set so its center (y+49 =
 * 381.5) lines up exactly with the middle parallel card's center, making the
 * middle fan-out connector perfectly straight (no 1.5px jog).
 */
export const RANDOM_NODE: NodeSpec = {
  id: "random",
  x: 103,
  y: 332.5,
  w: 184,
  h: 98,
  title: "RANDOM TEST",
  pairs: 1,
};

export type ParallelSpec = {
  id: string;
  /** Card top (canvas y). */
  y: number;
  w: number;
  h: number;
  /** Left edge in scene 1 (fanned out) and scene 2 (slid left as report inputs). */
  scene1X: number;
  scene2X: number;
};

/** The five parallel test cards. Card centers: 109.5 → 652.5 (137px pitch). */
export const PARALLEL_NODES: readonly ParallelSpec[] = [60.5, 197.5, 332.5, 468.5, 603.5].map(
  (y, i) => ({ id: `parallel-${i}`, y, w: 236, h: 98, scene1X: 542, scene2X: 144 }),
);

/** Center y of a parallel card (port + connector anchor). */
export function parallelCenterY(p: ParallelSpec): number {
  return p.y + p.h / 2;
}

export const PARALLEL_TITLE = "STARSLING: PARALLEL TEST";

/** The aggregated report sink (Scene 2). Five content pairs → 378px tall. */
export const REPORTS_NODE: NodeSpec = {
  id: "reports",
  x: 633,
  y: 196,
  w: 267,
  h: 378,
  title: "TEST REPORTS",
  pairs: 5,
};

/* --------------------------------------------------------------- connectors */

export type EdgeSpec = {
  id: string;
  d: string;
  /** Stagger (s) so the branches visibly cascade / converge. */
  flowDelay: number;
};

/**
 * Orthogonal branch (blueprint style): leave the source port horizontally to a
 * shared vertical spine, run along the spine to the target's y, then enter the
 * target port flat. Sharp 90° corners — no curves. `spineX` is the bus: it sits
 * near the source for the fan-out, near the target for the fan-in.
 */
export function edgePath(s: Point, t: Point, spineX: number): string {
  return `M ${s.x} ${s.y} L ${spineX} ${s.y} L ${spineX} ${t.y} L ${t.x} ${t.y}`;
}

/** Vertical bus x for the fan-out — just right of RANDOM's output port (x 289). */
const SPINE_OUT = 380;
/** Vertical bus x for the fan-in — just left of REPORTS' input port (x 631). */
const SPINE_IN = 559;

/** Scene 1: RANDOM right-port → each parallel left-port (scene-1 position). */
export const EDGES_OUT: readonly EdgeSpec[] = PARALLEL_NODES.map((p, i) => ({
  id: `out-${i}`,
  d: edgePath(
    outPort(RANDOM_NODE),
    { x: p.scene1X - 2, y: parallelCenterY(p) },
    SPINE_OUT,
  ),
  flowDelay: i * BRANCH_STAGGER,
}));

/** Scene 2: each parallel right-port (scene-2 position) → REPORTS left-port. */
export const EDGES_IN: readonly EdgeSpec[] = PARALLEL_NODES.map((p, i) => ({
  id: `in-${i}`,
  d: edgePath(
    { x: p.scene2X + p.w + 2, y: parallelCenterY(p) },
    inPort(REPORTS_NODE),
    SPINE_IN,
  ),
  flowDelay: i * BRANCH_STAGGER,
}));

/* ----------------------------------------------------------------- brackets */

/** A vertical measurement bracket (the "[" tick rail) sitting just right of a
 *  block, caps pointing left toward it. Drawn as one continuous polyline. */
export type BracketSpec = { x: number; top: number; height: number; cap: number };

/** Scene 1 — measures the five-card stack. */
export const BRACKET_1: BracketSpec = { x: 812, top: 60.5, height: 641, cap: 12 };
/** Scene 2 — measures the reports card. */
export const BRACKET_2: BracketSpec = { x: 919, top: 187, height: 396, cap: 12 };

/* ----------------------------------------------------------------- captions */

export type Segment = { t: string; teal?: boolean };

export type CaptionSpec = {
  x: number;
  y: number;
  width: number;
  /** Paragraphs (teal-segmented). Each reveals at its `showBeats` entry. */
  paragraphs: Segment[][];
  showBeats: number[];
  /** Per-paragraph entrance delay (s) so each line trails the action it narrates. */
  delays?: number[];
};

/** Scene 1 caption — typo "PARALELL" corrected to "PARALLEL". */
export const CAPTION_1: CaptionSpec = {
  x: 917,
  y: 253,
  width: 355,
  paragraphs: [
    [
      { t: "STARSLING ANALYZES YOUR WORKFLOW AND " },
      { t: "SPLITS", teal: true },
      { t: " YOUR WORKFLOW" },
    ],
    [
      { t: "RUNS THEM " },
      { t: "PARALLEL", teal: true },
      { t: " TO SPEED UP YOUR WORKFLOW BY " },
      { t: "10X", teal: true },
    ],
    [{ t: "TIME SAVED:" }],
  ],
  showBeats: [BEAT.analyze, BEAT.split, BEAT.timesaved],
  // line 1 trails RANDOM appearing; line 2 trails the cards landing; "TIME
  // SAVED:" lands just before the bracket/chip resolve it.
  delays: [0.3, 0.6, 0.2],
};

/** Scene 2 caption — grammar "AGENTS USES" corrected to "AGENTS USE". */
export const CAPTION_2: CaptionSpec = {
  x: 970,
  y: 293,
  width: 355,
  paragraphs: [
    [{ t: "STARSLING CREATES TEST REPORTS" }],
    [
      { t: "AGENTS USE THEIR " },
      { t: "MEMORIES", teal: true },
      { t: " ON NEXT RUNS TO SPEED UP YOUR WORKFLOW" },
    ],
    [{ t: "THIS IS HOW IT " }, { t: "SELF-DRIVES", teal: true }],
  ],
  showBeats: [BEAT.reports, BEAT.memory, BEAT.memory],
  delays: [0.4, 0.3, 0.55],
};

/* -------------------------------------------------------------- time saved */

/** Scene-1 payoff chip, positioned in canvas space. */
export const CHIP = { x: 917, y: 449, width: 281 } as const;

/** Total seconds the chip counts up to: 1m 18s. */
export const TIME_SAVED = 78;

/** Format climbing seconds as the Figma's "1M 18S" (drops a zero minute). */
export function fmtTimeSaved(n: number): string {
  const m = Math.floor(n / 60);
  const s = n % 60;
  return m > 0 ? `${m}M ${s}S` : `${s}S`;
}
