"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/components/concepts/shared/motion";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import {
  BEAT_MS,
  CANVAS,
  STEP_COUNT,
} from "@/components/concepts/hero-2/timeline-data";
import { TimelineScene } from "@/components/concepts/hero-2/timeline-scene";

/**
 * Hero concept 7's stage: concept 3's big CI run, but instead of the panning,
 * full-bleed camera the whole 1440×540 canvas is scaled to fit and centered on
 * both axes — a small margin keeps it off the edges. The step cycle still plays
 * in place, so it loops cleanly as a text-free, centered illustration for an X
 * post. Mirrors the transform/scale structure of hero-3's TimelineCameraBand.
 */

/** Fraction of the stage the canvas may fill before centering (leaves margin). */
const FIT_W = 0.92;
const FIT_H = 0.86;

export function CenteredTimeline() {
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

  // SSR/first paint fall back to the design frame; useLayoutEffect corrects
  // them before the first browser paint.
  const w = box.w || 1440;
  const h = box.h || 560;
  // Contain the whole canvas (the timeline is wide and short, so width usually
  // binds), then center the scaled box in the stage.
  const scale = Math.min((w * FIT_W) / CANVAS.w, (h * FIT_H) / CANVAS.h);
  const cw = CANVAS.w * scale;
  const ch = CANVAS.h * scale;
  const x = (w - cw) / 2;
  const y = (h - ch) / 2;

  return (
    <motion.div
      ref={stageRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: reduce ? 0 : 0.2 }}
      className="relative z-10 w-full flex-1 overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{ x, y }}
        transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
        style={{
          width: CANVAS.w,
          height: CANVAS.h,
          scale,
          transformOrigin: "0 0",
        }}
        className="absolute top-0 left-0"
      >
        <motion.div
          className="absolute inset-0"
          initial={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, y: 24, filter: "blur(12px)" }
          }
          animate={
            reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          transition={{
            duration: reduce ? 0.35 : 0.7,
            delay: reduce ? 0 : 0.4,
            ease: EASE,
          }}
        >
          <TimelineScene step={index} reduce={!!reduce} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
