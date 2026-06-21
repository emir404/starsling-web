"use client";

import { motion } from "motion/react";

import { appearT, HIDE_T } from "@/components/concepts/shared/motion";
import { BEAT, CANVAS, COLOR, EDGES } from "./ci-run-data";

/**
 * The fan-in connector layer (Figma 246:393): three near-straight lines from
 * the source nodes' right ports into the merge gate's left port. A faint rail
 * draws in at the connect beat, a teal overlay lights its `pathLength`, and a
 * short pulse travels source→gate (staggered per edge) so the three branches
 * visibly converge. Drawn in canvas space; the parent dims this layer at the
 * payoff. Mirrors hero-8's `pathLength` connector idiom.
 */
export function Connectors({ step, reduce }: { step: number; reduce: boolean }) {
  const shown = step >= BEAT.connect;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
      fill="none"
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
    >
      {EDGES.map((e) => (
        <g key={e.id}>
          {/* faint rail */}
          <motion.path
            initial={false}
            d={e.d}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={1.5}
            strokeLinecap="round"
            animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
            transition={shown ? appearT(reduce, e.flowDelay, 0.5) : HIDE_T}
          />
          {/* teal overlay — lights as the branch connects */}
          <motion.path
            initial={false}
            d={e.d}
            stroke={COLOR.teal}
            strokeWidth={2}
            strokeLinecap="round"
            animate={{ pathLength: shown ? 1 : 0, opacity: shown ? 1 : 0 }}
            transition={shown ? appearT(reduce, e.flowDelay, 0.6) : HIDE_T}
          />
          {/* traveling pulse — only while the branches converge */}
          {!reduce && step === BEAT.connect && (
            <motion.path
              d={e.d}
              stroke={COLOR.teal}
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
