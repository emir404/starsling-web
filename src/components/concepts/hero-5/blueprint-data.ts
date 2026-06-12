import {
  BEAT,
  BEAT_MS,
  COMPARE,
  RESULTS,
  RUNNERS as PIPELINE_RUNNERS,
  STEP_COUNT,
  TRIGGERS,
  VERDICT,
  type RunnerSpec,
} from "@/components/concepts/hero-4/pipeline-data";

/**
 * Layout model for hero concept 5 (Figma 211:2 / 212:122 / 212:231). The
 * three frames are keyframes of one looping run again, but staged on graph
 * paper: white cards materialize on a 120px blueprint grid — INPUT (2×4
 * cells), PARALLEL EXEC. (4×2) below it, OUTPUT (2×4) beside it. The beat
 * model and panel contents are hero-4's, recomposed for the card sizes.
 *
 * Geometry lives on a fixed 1440×924 plane (the Figma frame minus the 100px
 * header), anchored to the hero's bottom-right and scaled to fit.
 */

export { BEAT, BEAT_MS, COMPARE, RESULTS, STEP_COUNT, TRIGGERS, VERDICT };
export type { RunnerSpec };

/** Runner list for the PARALLEL EXEC. card rows (hero-4's grid, flattened). */
export const RUNNERS: readonly RunnerSpec[] = PIPELINE_RUNNERS.flat();

export const PLANE = { w: 1440, h: 924 } as const;

/** Height (plane px) the camera must keep visible when fitting the plane. */
export const FOCUS_H = 870;

export type CardId = "input" | "parallel" | "output";

/** Cards in plane space, snapped to the 120px grid (Figma card frames). */
export const CARDS: readonly {
  id: CardId;
  label: string;
  /** Beat the card materializes at. */
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
}[] = [
  { id: "input", label: "INPUT", at: BEAT.input, x: 850, y: 96, w: 240, h: 479 },
  { id: "parallel", label: "PARALLEL EXEC.", at: BEAT.fanout, x: 850, y: 575, w: 480, h: 241 },
  { id: "output", label: "OUTPUT", at: BEAT.verdict, x: 1090, y: 96, w: 240, h: 479 },
];

/**
 * Graph-paper grid (Figma 212:71): a 600×1200 box at plane (850, −144.5)
 * holding a −90°-rotated stack of 120px square rows — 6 centered, then 4×10 —
 * so the first row becomes the partial left column.
 */
export const GRID = {
  x: 850,
  y: -144.5,
  w: 600,
  h: 1200,
  rows: [6, 10, 10, 10, 10],
  cell: 120,
} as const;
