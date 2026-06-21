"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";
import {
  BEAT,
  EDGES,
  GRAPH,
  edgePath,
  inp,
  nodeById,
  out,
} from "./run-graph-data";

/**
 * The fan-in connector layer: one SVG in graph-body pixel space (1 unit = 1
 * plane px, so the parent's fit-scale handles sizing). Each upstream node's
 * output port curves to the shared e2e input port; the path draws on (Framer's
 * native `pathLength` 0→1) and recolors rail → brand once its source passes.
 */
export function Connectors({ beat, reduce }: { beat: number; reduce: boolean }) {
  const target = inp(nodeById("e2e"));
  const targetLive = beat >= BEAT.upstream;

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${GRAPH.w} ${GRAPH.h}`}
      width={GRAPH.w}
      height={GRAPH.h}
      fill="none"
      className="absolute inset-0 overflow-visible"
    >
      {EDGES.map((edge) => {
        const src = nodeById(edge.from);
        const drawn = beat >= src.passAt;
        return (
          <g key={edge.from}>
            <motion.path
              d={edgePath(out(src), target)}
              fill="none"
              strokeWidth={1.5}
              strokeLinecap="round"
              className={cn(
                "transition-colors duration-500",
                drawn ? "stroke-brand" : "stroke-rail",
              )}
              initial={false}
              animate={{ pathLength: drawn ? 1 : 0 }}
              transition={{
                duration: reduce ? 0 : 0.6,
                ease: EASE,
                delay: !reduce && drawn ? src.delay + 0.15 : 0,
              }}
            />
            <circle
              cx={out(src).x}
              cy={out(src).y}
              r={3}
              className={cn(
                "transition-colors duration-500",
                drawn ? "fill-brand" : "fill-rail",
              )}
            />
          </g>
        );
      })}
      <circle
        cx={target.x}
        cy={target.y}
        r={3.5}
        className={cn(
          "transition-colors duration-500",
          targetLive ? "fill-brand" : "fill-rail",
        )}
      />
    </svg>
  );
}
