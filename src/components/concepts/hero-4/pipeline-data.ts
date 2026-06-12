/**
 * Beat + panel model for hero concept 4 (Figma 204:6485 / 204:6556 / 204:6612).
 * The three frames are keyframes of one looping run: the band opens as a lone
 * INPUT panel, splits to fan the run out across PARALLEL EXECUTION, then
 * splits again when OUTPUT lands the verdict. Beats refine those layout
 * stages with the tick choreography; panels animate flex-basis between the
 * keyframe widths. Panel contents are generated in the language of the
 * earlier concepts (hero-1 input rows, hero-2 loaders/ticks and time saved).
 */

export const BEAT = {
  /** Desktop-27 — the trigger rows sit alone in INPUT. */
  input: 0,
  /** Desktop-28 — the band splits and six runners spin up. */
  fanout: 1,
  /** The quick runners resolve green. */
  greens: 2,
  /** Desktop-29 — OUTPUT opens, the long runners land, build passes. */
  verdict: 3,
  /** Comparison bars fill and the saving caption lands. */
  saved: 4,
} as const;

export const STEP_COUNT = 5;

/** Per-beat hold durations (ms) for the auto-advance. */
export const BEAT_MS: readonly number[] = [2600, 2200, 1700, 2600, 3600];

/** Layout stage — how far the band has split — for a beat. */
export function stageOf(beat: number): 0 | 1 | 2 {
  if (beat >= BEAT.verdict) return 2;
  if (beat >= BEAT.fanout) return 1;
  return 0;
}

export type PanelId = "input" | "parallel" | "output";

/** Panels left to right; `basis` is the panel's flex-basis at each stage. */
export const PANELS: readonly {
  id: PanelId;
  label: string;
  /** Beat the panel (and its label) opens at. */
  at: number;
  basis: readonly [string, string, string];
}[] = [
  { id: "input", label: "INPUT", at: BEAT.input, basis: ["100%", "50%", "33.4%"] },
  { id: "parallel", label: "PARALLEL EXECUTION", at: BEAT.fanout, basis: ["0%", "50%", "33.3%"] },
  { id: "output", label: "OUTPUT", at: BEAT.verdict, basis: ["0%", "0%", "33.3%"] },
];

export type TriggerSpec = {
  tag: string;
  /** The event that started this run inverts; the rest are queued context. */
  solid?: boolean;
  /** Dim prefix rendered at 50% foreground (e.g. the "#" in "#356"). */
  codeDim?: string;
  code: string;
  metaDim?: string;
  meta: string;
};

/** INPUT rows — the workflow triggers feeding the run. */
export const TRIGGERS: readonly TriggerSpec[] = [
  { tag: "PUSH", solid: true, code: "git push", meta: "main" },
  { tag: "PR OPENED", codeDim: "#", code: "356", metaDim: "by", meta: "@emir404" },
  { tag: "MERGE QUEUE", codeDim: "#", code: "352", meta: "queued" },
  { tag: "SCHEDULE", code: "0 3 * * *", meta: "nightly" },
];

export type RunnerSpec = {
  name: string;
  /** Wall time shown once the runner resolves. */
  time: string;
  /** Cascade delay (s) when the fan-out reveals the grid. */
  delay: number;
  /** The loader resolves to a tick at this beat… */
  tickAt: number;
  tickDelay: number;
  /** …and the whole column folds into the output at this one. */
  collapseAt?: number;
  /** Skeleton bar widths (%). */
  bars: readonly [number, number];
};

/**
 * Runner grid, two rows × three columns (Desktop-28). The third column
 * finishes first and folds away at the verdict split (Desktop-29's 2×2) —
 * its results stream into OUTPUT.
 */
export const RUNNERS: readonly (readonly RunnerSpec[])[] = [
  [
    { name: "Unit", time: "14s", delay: 0.25, tickAt: BEAT.greens, tickDelay: 0, bars: [100, 62] },
    { name: "E2E", time: "41s", delay: 0.33, tickAt: BEAT.verdict, tickDelay: 0.2, bars: [86, 70] },
    { name: "Typecheck", time: "9s", delay: 0.41, tickAt: BEAT.greens, tickDelay: 0.3, collapseAt: BEAT.verdict, bars: [74, 52] },
  ],
  [
    { name: "Lint", time: "6s", delay: 0.49, tickAt: BEAT.greens, tickDelay: 0.55, bars: [64, 88] },
    { name: "Build", time: "23s", delay: 0.57, tickAt: BEAT.verdict, tickDelay: 0.35, bars: [92, 58] },
    { name: "Integration", time: "11s", delay: 0.65, tickAt: BEAT.greens, tickDelay: 0.75, collapseAt: BEAT.verdict, bars: [70, 82] },
  ],
];

/** OUTPUT verdict bar (hero-2's Build passed pill, squared to the row grid). */
export const VERDICT = { text: "Build passed", time: "1m 12s", delay: 0.35 } as const;

/** Run summary rows, in finish order — every runner reports, folded or not. */
export const RESULTS: readonly { name: string; time: string }[] = [
  { name: "Lint", time: "6s" },
  { name: "Typecheck", time: "9s" },
  { name: "Integration", time: "11s" },
  { name: "Unit", time: "14s" },
  { name: "Build", time: "23s" },
  { name: "E2E", time: "41s" },
];

/** Wall-clock comparison drawn at the last beat (hero-2's "80% time saved"). */
export const COMPARE = {
  rows: [
    { label: "GitHub hosted", time: "6m 04s", width: 100, brand: false },
    { label: "Starsling", time: "1m 12s", width: 19.8, brand: true },
  ],
  caption: "80% time saved",
} as const;
