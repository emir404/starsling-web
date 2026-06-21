"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import { BEAT, BEAT_MS, PLANE, STEP_COUNT } from "./run-graph-data";
import { GraphGrid } from "./graph-grid";
import { RunSummaryBar } from "./run-summary-bar";
import { WorkflowGraphCard } from "./workflow-graph-card";

/**
 * The run-graph stage: the fixed 1200×620 plane (summary bar + e2e.yml card)
 * centered on the container and scaled to fit, over the full-bleed blueprint
 * grid. Owns the beat cycle; reduced motion pins every child to the terminal
 * `success` beat so the run renders settled.
 */
export function RunGraphStage({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const reduce = useReducedMotion();
  const { index } = useStepCycle({
    count: STEP_COUNT,
    intervals: BEAT_MS,
    ref: stageRef,
  });
  const beat = reduce ? BEAT.success : index;

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // SSR/first paint falls back to the design frame; corrected before paint.
  const w = box.w || PLANE.w;
  const h = box.h || PLANE.h;
  const scale = Math.min(1.15, Math.max(0.4, Math.min(w / PLANE.w, h / PLANE.h)));

  return (
    <div
      ref={stageRef}
      className={cn("pointer-events-none relative overflow-hidden", className)}
    >
      <GraphGrid />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: reduce ? 0 : 0.25 }}
        style={{
          width: PLANE.w,
          height: PLANE.h,
          x: "-50%",
          y: "-50%",
          scale,
          transformOrigin: "center",
        }}
        className="absolute top-1/2 left-1/2"
      >
        <RunSummaryBar beat={beat} reduce={!!reduce} />
        <WorkflowGraphCard beat={beat} reduce={!!reduce} />
      </motion.div>
    </div>
  );
}
