/**
 * Geometry + beat model for hero concept 2. Geometry is 1:1 from the Figma
 * keyframes 204:5607 / 204:5805 / 204:6034 on a fixed 1440×540 logical canvas
 * (canvas y = Figma frame y − 395).
 *
 * The run plays as a narrative of BEATS rather than the three coarse frames:
 * the PR lands alone, the Analyzing chip follows, each milestone appears as a
 * spinning loader and resolves to a tick, the parallel runners repeat that one
 * by one, and Build passed closes the loop. Elements carry the beat they
 * appear at (`at`); loaders carry `tickAt`; state dims derive from the beat.
 */

export const CANVAS = { w: 1440, h: 540 } as const;

/** Narrative beats, in order. */
export const BEAT = {
  pr: 0,
  analyzing: 1,
  diffLoad: 2,
  diffTick: 3, // CI starting begins loading on the same beat
  parallel: 4, // CI ticks; progress reaches col 2; runners pill lands
  unitLoad: 5,
  unitTick: 6, // Typecheck begins loading
  typeTick: 7, // E2E begins loading
  e2eTick: 8,
  build: 9,
} as const;

export const STEP_COUNT = 10;

/** Per-beat hold durations (ms) for the auto-advance. */
export const BEAT_MS: readonly number[] = [
  1600, 1600, 1100, 1100, 1700, 950, 950, 950, 1000, 2600,
];

/** Blueprint columns: 17 rules, 74.9375px apart; every 4th is stronger. */
export const GRID = { x: 120, w: 1200, top: 4, h: 507, step: 74.9375 } as const;

/** Central time axis (full width at 10% teal; solid teal up to the run head). */
export const AXIS = { y: 257, x1: 120, x2: 1320 } as const;

/** Teal progress line right edge per beat (Figma Rectangle 85 spans). */
export const PROGRESS_END: readonly number[] = [
  120, 420.75, 420.75, 420.75, 719.5, 719.5, 719.5, 719.5, 719.5, 1019.25,
];

/**
 * Tick ruler: minor tick every 24.9792px starting at the 7th slot, a long tick
 * every 12th slot, two rows flanking the axis.
 */
export const TICKS = {
  originX: 120,
  gap: 24.979166,
  first: 6,
  last: 48,
  longEvery: 12,
  top: { long: 221, minor: 233.28 },
  bottom: { long: 270, minor: 283.28 },
  longLen: 24,
  minorLen: 11.724,
} as const;

export type Dash = {
  at: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Choreography delay (s) when revealed or grown. */
  delay: number;
  /** Staged growth: [beat, x2] pairs — the lane extends as the story reaches it. */
  stops?: readonly (readonly [number, number])[];
};

/** Dashed connectors (#79A9B1, stroke 0.5, dash 4 4), in canvas space. */
export const DASHES: Dash[] = [
  // scan lane: col 1 → Diff analyzed → CI starting, growing with the story
  {
    at: BEAT.analyzing, x1: 420, y1: 115.66, x2: 870.13, y2: 115.66, delay: 0.15,
    stops: [[BEAT.analyzing, 622], [BEAT.diffLoad, 720], [BEAT.diffTick, 870.13]],
  },
  // drop col 1: lane down to the square above the axis
  { at: BEAT.analyzing, x1: 420.25, y1: 115.66, x2: 420.25, y2: 220, delay: 0.35 },
  // label stubs above Diff analyzed / CI starting
  { at: BEAT.diffLoad, x1: 720, y1: 76.81, x2: 720, y2: 95.75, delay: 0.15 },
  { at: BEAT.diffTick, x1: 869.88, y1: 76.81, x2: 869.88, y2: 95.75, delay: 0.15 },
  // parallel lane: col 2 drop out to the E2E check, growing per runner
  {
    at: BEAT.parallel, x1: 719.5, y1: 398.59, x2: 1245.06, y2: 398.59, delay: 0.3,
    stops: [
      [BEAT.parallel, 985],
      [BEAT.unitLoad, 1094.7],
      [BEAT.unitTick, 1170.13],
      [BEAT.typeTick, 1245.06],
    ],
  },
  // drop col 2: square below the axis down to the parallel lane
  { at: BEAT.parallel, x1: 720, y1: 295, x2: 720, y2: 398.59, delay: 0.25 },
  // runner label stubs
  { at: BEAT.unitLoad, x1: 1094.69, y1: 418.09, x2: 1094.69, y2: 437.53, delay: 0.25 },
  { at: BEAT.unitTick, x1: 1169.63, y1: 418.09, x2: 1169.63, y2: 437.53, delay: 0.25 },
  { at: BEAT.typeTick, x1: 1244.56, y1: 418.09, x2: 1244.56, y2: 437.53, delay: 0.25 },
  // scan lane extension: col 3 to the right edge
  { at: BEAT.build, x1: 1019.25, y1: 115.66, x2: 1320, y2: 115.66, delay: 0.35 },
  // drop col 3: lane down to the square above the axis
  { at: BEAT.build, x1: 1019.75, y1: 115.66, x2: 1019.75, y2: 220, delay: 0.2 },
];

/** Effective right/bottom end of a staged dash at the given beat. */
export function dashEnd(d: Dash, beat: number): number {
  if (!d.stops) return d.y1 === d.y2 ? d.x2 : d.y2;
  let end = d.stops[0][1];
  for (const [b, x] of d.stops) if (beat >= b) end = x;
  return end;
}

/** 8×8 squares where a scan column meets the ruler (bg header, #79A9B1 border). */
export const SQUARES = [
  { at: BEAT.analyzing, cx: 420.25, cy: 224.65, delay: 0.45 },
  { at: BEAT.parallel, cx: 720, cy: 290, delay: 0.4 },
  { at: BEAT.build, cx: 1019.75, cy: 224.65, delay: 0.35 },
] as const;

/** 32×32 scan reticles (#2F4242, 0.5px white border, Starsling mark). Persist. */
export const RETICLES: readonly {
  at: number;
  x: number;
  y: number;
  delay: number;
  /** Mark spins from `at` through this beat (omit = never spins). */
  spinTo?: number;
}[] = [
  { at: BEAT.analyzing, x: 404.25, y: 155, delay: 0.55, spinTo: BEAT.diffTick },
  { at: BEAT.parallel, x: 704.5, y: 327, delay: 0.5, spinTo: BEAT.e2eTick },
  { at: BEAT.build, x: 1003.75, y: 154.23, delay: 0.5 },
];

export type MarkerSpec = {
  /** Appears as a spinning loader at this beat… */
  at: number;
  /** …and resolves to a teal tick at this one. */
  tickAt: number;
  /** Beat at which a tick dims to the done grey (#4E595B). */
  doneAt?: number;
  cx: number;
  cy: number;
  delay: number;
};

export const MARKERS: MarkerSpec[] = [
  { at: BEAT.diffLoad, tickAt: BEAT.diffTick, cx: 720, cy: 115.91, delay: 0.3 },
  { at: BEAT.diffTick, tickAt: BEAT.parallel, cx: 869.88, cy: 115.91, delay: 0.3 },
  { at: BEAT.unitLoad, tickAt: BEAT.unitTick, doneAt: BEAT.build, cx: 1094.7, cy: 399.09, delay: 0.3 },
  { at: BEAT.unitTick, tickAt: BEAT.typeTick, doneAt: BEAT.build, cx: 1170.13, cy: 399.09, delay: 0.3 },
  { at: BEAT.typeTick, tickAt: BEAT.e2eTick, doneAt: BEAT.build, cx: 1244.06, cy: 399.09, delay: 0.3 },
];

export type LabelSpec = {
  at: number;
  cx: number;
  /** Text top edge in canvas space. */
  y: number;
  text: string;
  /** Base tone; "dim" renders at 50% foreground. */
  tone: "full" | "dim";
  /** Beat at which a full label drops to 50% (runner names at Build passed). */
  dimAt?: number;
  delay: number;
};

export const LABELS: LabelSpec[] = [
  { at: BEAT.diffLoad, cx: 720.5, y: 52.56, text: "Diff analyzed", tone: "full", delay: 0.45 },
  { at: BEAT.diffTick, cx: 868.88, y: 52.56, text: "CI starting", tone: "full", delay: 0.45 },
  { at: BEAT.analyzing, cx: 419.5, y: 318, text: "12s elapsed", tone: "dim", delay: 0.7 },
  { at: BEAT.parallel, cx: 720.5, y: 197, text: "20s elapsed", tone: "dim", delay: 0.75 },
  { at: BEAT.unitLoad, cx: 1093.69, y: 449.53, text: "Unit tests", tone: "full", dimAt: BEAT.build, delay: 0.45 },
  { at: BEAT.unitTick, cx: 1169.63, y: 449.53, text: "Typecheck", tone: "full", dimAt: BEAT.build, delay: 0.45 },
  { at: BEAT.typeTick, cx: 1244.56, y: 449.53, text: "E2E", tone: "full", dimAt: BEAT.build, delay: 0.45 },
  { at: BEAT.build, cx: 1019.75, y: 318, text: "1m 12s elapsed", tone: "dim", delay: 0.75 },
];

export type PillKind = "anchor" | "flow" | "success";

export type PillSpec = {
  at: number;
  x: number;
  y: number;
  text: string;
  icon: "pr" | "code" | "parallel" | "build";
  kind: PillKind;
  /** Beat at which a flow pill goes from active (inverted) to done (#343434). */
  doneAt?: number;
  delay: number;
};

/** Timeline pills, top-left in canvas space (frame minus the 8px outer ring). */
export const PILLS: PillSpec[] = [
  { at: BEAT.pr, x: 88, y: 240, text: "New PR: #356", icon: "pr", kind: "anchor", delay: 0 },
  { at: BEAT.analyzing, x: 480, y: 98.91, text: "Analyzing", icon: "code", kind: "flow", doneAt: BEAT.parallel, delay: 0 },
  { at: BEAT.parallel, x: 777.96, y: 382.09, text: "Parallel runners", icon: "parallel", kind: "flow", doneAt: BEAT.build, delay: 0.55 },
  { at: BEAT.build, x: 1080.25, y: 98.91, text: "Build passed", icon: "build", kind: "success", delay: 0.6 },
];

/** "80% time saved" brace + caption under the Build passed pill. */
export const SAVED = {
  at: BEAT.build,
  brace: { x: 1096.25, y: 142.56, w: 127, h: 13.75 },
  label: { cx: 1159.75, y: 165.84, text: "80% time saved" },
  delay: 0.9,
} as const;
