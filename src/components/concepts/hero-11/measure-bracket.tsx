"use client";

import { motion } from "motion/react";

import { appearT, HIDE_T } from "@/components/concepts/shared/motion";
import { CANVAS, type BracketSpec } from "./parallel-run-data";

/**
 * The vertical measurement bracket (Figma 282:1457 / 282:1658): a "[" tick rail
 * sitting just right of a block with its caps pointing left toward it. Drawn as
 * one continuous polyline (top cap → down → bottom cap) so its `pathLength`
 * sweeps in as a single stroke when the scene reaches its payoff.
 */
export function MeasureBracket({
  bracket,
  shown,
  reduce,
}: {
  bracket: BracketSpec;
  shown: boolean;
  reduce: boolean;
}) {
  const { x, top, height, cap } = bracket;
  const bottom = top + height;
  const d = `M ${x - cap} ${top} L ${x} ${top} L ${x} ${bottom} L ${x - cap} ${bottom}`;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
      fill="none"
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
    >
      <motion.path
        initial={false}
        d={d}
        stroke="rgba(215,234,237,0.3)"
        strokeWidth={1.5}
        strokeLinejoin="miter"
        animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
        transition={shown ? appearT(reduce, 0, 0.6) : HIDE_T}
      />
    </svg>
  );
}
