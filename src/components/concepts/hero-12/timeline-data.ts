/**
 * Beat + geometry model for hero concept 12 — "time-collapse timeline".
 *
 * The efficiency story told as wall-clock duration: one long SERIAL test-suite
 * bar (≈13M 20S) splits into five short parallel shard bars that all start at
 * t=0 and finish together (≈1M 18S). The bar-length contrast is the message; a
 * big clock counts DOWN and a "TIME SAVED" bracket spans the gap between the
 * parallel finish and the serial finish. Colors mirror hero-10/11's Figma panel
 * surfaces (hardcoded — the `.dark` palette differs).
 */

export const CANVAS = { w: 1376, h: 560 } as const;

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
  /** The serial suite bar fills slowly across its full width — the bottleneck. */
  serial: 0,
  /** It splits: the five short shard bars cascade in below it. */
  split: 1,
  /** All five shards sweep together, fast — they finish far earlier. */
  parallel: 2,
  /** The clock collapses to the parallel time; the TIME SAVED bracket draws. */
  saved: 3,
  /** Settle, then the cycle wraps. */
  hold: 4,
} as const;

export const STEP_COUNT = 5;
export const BEAT_MS: readonly number[] = [2200, 1800, 2000, 2400, 1800];

/* --------------------------------------------------------------- durations */

/** Serial baseline — 13m 20s. */
export const SERIAL_S = 800;
/** Parallel wall-clock — 1m 18s (matches hero-11). */
export const PARALLEL_S = 78;
/** Time saved — 12m 02s. */
export const SAVED_S = SERIAL_S - PARALLEL_S;

/** Run-sweep durations: the serial bar fills slowly; the shards fill quick. */
export const SERIAL_RUN = 1.6;
export const PARALLEL_RUN = 0.7;

/* -------------------------------------------------------------------- plot */

/** Time axis: 0..SERIAL_S maps to PLOT_X0..PLOT_X1 (canvas x). */
export const PLOT_X0 = 300;
export const PLOT_X1 = 1080;
export const PX_PER_SEC = (PLOT_X1 - PLOT_X0) / SERIAL_S;
export function secToX(s: number): number {
  return PLOT_X0 + s * PX_PER_SEC;
}
/** Right edge of the parallel shards (where they all finish). */
export const PARALLEL_X1 = secToX(PARALLEL_S);

/** Left label gutter. */
export const GUTTER_X = 40;

/** Serial bar row. */
export const SERIAL_Y = 120;
export const BAR_H = 44;

/** Parallel shard rows. */
export const LANE_H = 38;
export const LANE_GAP = 14;
export const LANE_Y0 = 244;
export const LANE_COUNT = 5;
export const LANES = Array.from({ length: LANE_COUNT }, (_, i) => ({
  id: `shard-${i}`,
  y: LANE_Y0 + i * (LANE_H + LANE_GAP),
}));
/** Bottom of the last shard row (for the finish guides). */
export const LANES_BOTTOM = LANE_Y0 + LANE_COUNT * LANE_H + (LANE_COUNT - 1) * LANE_GAP;

/** Horizontal "time saved" bracket sitting under the plot. */
export const BRACKET_Y = 514;
export const BRACKET_CAP = 10;

/** Format seconds as "13M 20S" / "1M 18S" (drops a zero minute). */
export function fmtClock(n: number): string {
  const m = Math.floor(n / 60);
  const s = n % 60;
  return m > 0 ? `${m}M ${s}S` : `${s}S`;
}
