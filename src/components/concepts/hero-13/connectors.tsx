"use client";

import { motion } from "motion/react";

import { appearT, HIDE_T } from "@/components/concepts/shared/motion";
import { CANVAS, COLOR, type Spoke } from "./dispatcher-data";

/**
 * Radial spoke connectors (hub → runners, suite → hub). Same polished idiom as
 * the live hero's `fan-connectors`: each spoke is two strokes of the *same* 2px
 * width — a faint rail that draws in once, and a bright highlight dash that
 * marches outward continuously while active — so the line never changes weight
 * and reads as actively dispatching. Sharp butt caps + miter joins.
 */
export function SpokeConnectors({
  spokes,
  active,
  reduce,
}: {
  spokes: readonly Spoke[];
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
      {spokes.map((e) => (
        <g key={e.id}>
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
