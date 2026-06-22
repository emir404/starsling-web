"use client";

import { motion } from "motion/react";

import { appearT, HIDE_T } from "@/components/concepts/shared/motion";
import { CANVAS, COLOR, type EdgeSpec } from "./parallel-run-data";

/**
 * The fan-out / fan-in connector layer (Figma 282:1420 / 282:1621). Each branch
 * is exactly two strokes of the *same* width so the line never changes weight:
 * a faint rail that draws in once (`pathLength` 0→1, cascaded by `flowDelay`),
 * and — while `active` — a bright highlight dash that marches source→target on a
 * loop, so the branch reads as actively flowing rather than a one-off blip. Sharp
 * butt caps + miter joins keep the blueprint look (no rounded corners).
 *
 * Drawn in canvas space; mirrors hero-10's `connectors.tsx` idiom.
 */
export function FanConnectors({
  edges,
  active,
  reduce,
}: {
  edges: readonly EdgeSpec[];
  active: boolean;
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
          {/* base rail — single consistent width, draws in once */}
          <motion.path
            initial={false}
            d={e.d}
            fill="none"
            stroke={COLOR.teal}
            strokeOpacity={0.3}
            strokeWidth={2}
            strokeLinecap="butt"
            strokeLinejoin="miter"
            animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
            transition={active ? appearT(reduce, e.flowDelay, 0.55) : HIDE_T}
          />
          {/* flowing highlight — SAME 2px width, marches continuously while active */}
          {active && !reduce && (
            <motion.path
              d={e.d}
              fill="none"
              stroke={COLOR.captionTeal}
              strokeWidth={2}
              strokeLinecap="butt"
              strokeLinejoin="miter"
              style={{ pathLength: 0.2 }}
              initial={{ pathOffset: 0, opacity: 0 }}
              animate={{ pathOffset: [0, 1], opacity: 0.95 }}
              transition={{
                pathOffset: {
                  duration: 1.4,
                  ease: "linear",
                  repeat: Infinity,
                  delay: 0.5 + e.flowDelay,
                },
                opacity: { duration: 0.3, delay: 0.5 + e.flowDelay },
              }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
