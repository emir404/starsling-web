"use client";

import { motion } from "motion/react";

import { appearT, HIDE_T } from "@/components/concepts/shared/motion";
import { CANVAS, COLOR, type EdgeSpec } from "./parallel-run-data";

/**
 * The fan-out / fan-in connector layer (Figma 282:1420 / 282:1621). For each
 * branch a faint rail draws in, a teal overlay lights its `pathLength`, and —
 * while `pulse` — a short pulse travels source→target so the branches visibly
 * cascade (scene 1) or converge (scene 2). The pulse direction is intrinsic to
 * each edge's path orientation: scene-1 edges start at RANDOM (pulse flows out),
 * scene-2 edges start at the parallel cards (pulse flows into the report).
 *
 * Drawn in canvas space; mirrors hero-10's `connectors.tsx` idiom.
 */
export function FanConnectors({
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
            transition={active ? appearT(reduce, e.flowDelay, 0.5) : HIDE_T}
          />
          {/* teal overlay — lights as the branch connects */}
          <motion.path
            initial={false}
            d={e.d}
            stroke={COLOR.teal}
            strokeWidth={2}
            strokeLinecap="round"
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
            transition={active ? appearT(reduce, e.flowDelay, 0.6) : HIDE_T}
          />
          {/* traveling pulse — only while the branches animate */}
          {!reduce && pulse && (
            <motion.path
              d={e.d}
              stroke={COLOR.captionTeal}
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
