"use client";

import { motion } from "motion/react";

import { appearT, HIDE_T } from "@/components/concepts/shared/motion";
import { BEAT, CANVAS, EDGES } from "./dag-data";

/**
 * The curved connector layer: three Béziers from the source nodes' right edges
 * into the merge gate's left edge. A faint rail draws in when the gate appears;
 * a brand-colored overlay lights its `pathLength` on the connect beat, and a
 * short pulse travels source→sink (staggered per edge) so the three branches
 * visibly converge. Mirrors the `pathLength` idiom from hero-2's timeline.
 */
export function DagConnectors({
  step,
  reduce,
}: {
  step: number;
  reduce: boolean;
}) {
  const lit = step >= BEAT.connect;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
      fill="none"
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
    >
      {EDGES.map((e) => {
        const shown = step >= e.at;
        return (
          <g key={e.id}>
            {/* faint rail */}
            <motion.path
              initial={false}
              d={e.d}
              className="stroke-rail"
              strokeWidth={1.5}
              strokeLinecap="round"
              animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
              transition={shown ? appearT(reduce, e.flowDelay, 0.5) : HIDE_T}
            />
            {/* brand overlay — lights as the branch connects */}
            <motion.path
              initial={false}
              d={e.d}
              className="stroke-brand"
              strokeWidth={2}
              strokeLinecap="round"
              animate={{ pathLength: lit ? 1 : 0, opacity: lit ? 1 : 0 }}
              transition={lit ? appearT(reduce, e.flowDelay, 0.6) : HIDE_T}
            />
            {/* traveling pulse — only while the branches converge */}
            {!reduce && step === BEAT.connect && (
              <motion.path
                d={e.d}
                className="stroke-brand"
                strokeWidth={3}
                strokeLinecap="round"
                style={{ pathLength: 0.14 }}
                initial={{ pathOffset: -0.14, opacity: 0.9 }}
                animate={{ pathOffset: 1 }}
                transition={{
                  duration: 0.95,
                  ease: "linear",
                  repeat: Infinity,
                  delay: e.flowDelay,
                }}
              />
            )}
            {/* ports */}
            <motion.circle
              initial={false}
              cx={e.from[0]}
              cy={e.from[1]}
              r={3.5}
              className="fill-rail"
              animate={{ opacity: shown ? 1 : 0 }}
              transition={shown ? appearT(reduce, e.flowDelay, 0.4) : HIDE_T}
            />
            <motion.circle
              initial={false}
              cx={e.to[0]}
              cy={e.to[1]}
              r={3.5}
              className={lit ? "fill-brand" : "fill-rail"}
              animate={{ opacity: shown ? 1 : 0 }}
              transition={shown ? appearT(reduce, e.flowDelay, 0.4) : HIDE_T}
            />
          </g>
        );
      })}
    </svg>
  );
}
