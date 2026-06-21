"use client";

import type { CSSProperties } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import {
  BEAT,
  BEAT_MS,
  CANVAS,
  COLOR,
  MATRIX_NODES,
  STEP_COUNT,
} from "./ci-run-data";
import { RunSummaryBar } from "./run-summary-bar";
import { MatrixNode } from "./matrix-node";
import { GateNode, SingleNode } from "./graph-node";
import { Connectors } from "./connectors";
import { StatsOverlay } from "./stats-overlay";

/**
 * Scope the exact Figma teal to the canvas subtree so the reused `Marker` and
 * the `stroke-brand`/`text-brand` descendants resolve to `#30a6bb` (the `.dark`
 * palette's brand is a different teal) — no need to fork those primitives.
 */
const BRAND_VARS = {
  "--brand": COLOR.teal,
  "--brand-foreground": "#04181c",
} as CSSProperties;

/**
 * Minimum plane scale. Below this the graph stops shrinking and the stage
 * scrolls horizontally instead, so node labels stay legible on small screens.
 * (At 0.72 the 14px Figma labels render ≈10px.)
 */
const MIN_SCALE = 0.72;

/**
 * The summary bar now renders above the plane (in the text-group grid) rather
 * than on it, so the plane is cropped from the top by the band the bar used to
 * occupy (its old y=0–112). Everything below keeps its canvas coordinates; the
 * plane is just shifted up under a clip, so the graph sits right beneath the bar.
 */
const TOP_CROP = 112;
const GRAPH_H = CANVAS.h - TOP_CROP;

/**
 * The CI-run stage: the fixed 1376×698 graph plane (the inner #1b2123 canvas)
 * width-scaled to fill the framed panel so it renders ≈1:1 with Figma at desktop
 * (clamped to `MIN_SCALE` and horizontally scrollable below ≈1024px), with the
 * run beats driven by `useStepCycle`. Composes the summary bar, the matrix/single nodes,
 * the connector + merge-gate layer (which dims together at the payoff), and the
 * scene-4 stats overlay. Reduced motion pins to the terminal `payoff` beat so
 * the run renders as the settled scene-4 frame.
 */
export function CiRunStage({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);
  const reduce = useReducedMotion();
  const { index } = useStepCycle({
    count: STEP_COUNT,
    intervals: BEAT_MS,
    ref: stageRef,
  });
  const beat = reduce ? BEAT.payoff : index;
  const reduceBool = !!reduce;
  const dimmed = beat >= BEAT.dim;

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageW(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // SSR/first paint falls back to the design width (scale 1); corrected before paint.
  // Width-fit, capped at 1:1: the stage is itself capped to the text group's max-width
  // and centered upstream, so the plane sits at its Figma size on wide screens (never
  // scaling up) and shrinks to MIN_SCALE — below which it scrolls horizontally instead.
  const w = stageW || CANVAS.w;
  const scale = Math.min(1, Math.max(MIN_SCALE, w / CANVAS.w));

  return (
    <div className={cn("flex flex-col", className)}>
      {/* The bar renders above the plane, aligned to the text-group grid. */}
      <RunSummaryBar step={beat} reduce={reduceBool} />

      <div
        ref={stageRef}
        className="relative overflow-x-auto overflow-y-hidden"
        style={{ height: GRAPH_H * scale, touchAction: "pan-x" }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.25 }}
          className="relative mx-auto overflow-hidden"
          style={{ width: CANVAS.w * scale, height: GRAPH_H * scale }}
        >
          {/* Shifted up by the cropped band so canvas-y maps to (y − TOP_CROP)·scale. */}
          <div
            className="pointer-events-none absolute left-0"
            style={{
              top: -TOP_CROP * scale,
              width: CANVAS.w,
              height: CANVAS.h,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <div className="absolute inset-0" style={BRAND_VARS}>
              {MATRIX_NODES.map((node) => (
                <MatrixNode key={node.id} node={node} step={beat} reduce={reduceBool} />
              ))}
              <SingleNode step={beat} reduce={reduceBool} />

              {/* gate + connectors dim together as the payoff arrives */}
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: dimmed ? 0.1 : 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Connectors step={beat} reduce={reduceBool} />
                <GateNode step={beat} reduce={reduceBool} />
              </motion.div>

              <StatsOverlay step={beat} reduce={reduceBool} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
