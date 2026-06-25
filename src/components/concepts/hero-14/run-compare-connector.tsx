"use client";

import { motion } from "motion/react";

import { appearT, HIDE_T } from "@/components/concepts/shared/motion";
import { CANVAS, COLOR, FORK, type EdgeSpec } from "./run-compare-data";

/**
 * The 1 → 3 fork connector layer (Figma 342:1482). For each branch a faint rail
 * draws in, a cyan overlay lights its `pathLength`, and — while `pulse` — a short
 * pulse travels source → target so the fork visibly cascades into the shards.
 *
 * Modeled on hero-11's `FanConnectors` idiom but bound to hero-14's own CANVAS +
 * colors (Scene B is all-cyan), so the two concepts stay fully decoupled.
 */
export function ForkConnectors({
  edges,
  active,
  pulse,
  reduce,
}: {
  edges: readonly EdgeSpec[];
  active: boolean;
  pulse: boolean;
  reduce: boolean;
}) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
      fill="none"
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
    >
      {edges.map((e) => (
        <g key={e.id}>
          {/* faint rail */}
          <motion.path
            initial={false}
            d={e.d}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1.5}
            strokeLinecap="round"
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
            transition={active ? appearT(reduce, e.flowDelay, FORK.drawDur) : HIDE_T}
          />
          {/* cyan overlay — lights as the branch connects */}
          <motion.path
            initial={false}
            d={e.d}
            stroke={COLOR.cyanFill}
            strokeWidth={2}
            strokeLinecap="round"
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
            transition={active ? appearT(reduce, e.flowDelay, FORK.drawDur) : HIDE_T}
          />
          {/* traveling pulse — only while the branches animate */}
          {!reduce && pulse && (
            <motion.path
              d={e.d}
              stroke={COLOR.cyanAccent}
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
        </g>
      ))}
    </svg>
  );
}
