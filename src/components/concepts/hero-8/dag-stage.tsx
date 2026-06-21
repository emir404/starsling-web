"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import { BEAT_MS, CANVAS, STEP_COUNT } from "./dag-data";
import { DagBackdrop } from "./dag-backdrop";
import { DagConnectors } from "./dag-connectors";
import { DagNodes } from "./dag-nodes";
import { SummaryCard } from "./summary-card";
import { WorkflowCard } from "./workflow-card";

/**
 * The workflow-run stage: the fixed CANVAS plane scaled to fit the lower frame
 * (centered horizontally, anchored to the bottom so the cards tuck under the
 * hero text), with the run beats driven by `useStepCycle`. Composes the
 * backdrop, the two cards, the connector layer and the node layer — connectors
 * and nodes draw over the workflow card frame.
 */
export function DagStage({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const reduce = useReducedMotion();
  const { index } = useStepCycle({
    count: STEP_COUNT,
    intervals: BEAT_MS,
    ref: stageRef,
  });

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
  const w = box.w || CANVAS.w;
  const h = box.h || CANVAS.h;
  const scale = Math.min(w / CANVAS.w, h / CANVAS.h);
  const cw = CANVAS.w * scale;
  const ch = CANVAS.h * scale;
  const x = (w - cw) / 2; // center horizontally
  const y = h - ch; // anchor to the bottom

  const reduceBool = !!reduce;

  return (
    <div
      ref={stageRef}
      className={cn("pointer-events-none overflow-hidden", className)}
    >
      <DagBackdrop />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: reduce ? 0 : 0.25 }}
        style={{
          width: CANVAS.w,
          height: CANVAS.h,
          scale,
          x,
          y,
          transformOrigin: "0 0",
        }}
        className="absolute top-0 left-0"
      >
        <WorkflowCard step={index} reduce={reduceBool} />
        <SummaryCard step={index} reduce={reduceBool} />
        <DagConnectors step={index} reduce={reduceBool} />
        <DagNodes step={index} reduce={reduceBool} />
      </motion.div>
    </div>
  );
}
