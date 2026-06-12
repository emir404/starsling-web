"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/components/concepts/shared/motion";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import { BEAT_MS, CANVAS, STEP_COUNT } from "./timeline-data";
import { TimelineScene } from "./timeline-scene";

/**
 * The CI timeline band. Fills whatever space the hero leaves it (the hero is
 * viewport-height), scaling the fixed 1440×540 canvas to fit both width and
 * height — floored at 0.42 so the scene stays legible on small screens, where
 * the band clips its edges instead. Beats auto-advance on their own pacing
 * (BEAT_MS) or on scroll-down, looping forever (see useStepCycle).
 */
export function TimelineBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const reduce = useReducedMotion();
  const { index } = useStepCycle({
    count: STEP_COUNT,
    intervals: BEAT_MS,
    ref: bandRef,
  });

  useLayoutEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    const measure = () => {
      const fit = Math.min(
        el.clientWidth / CANVAS.w,
        el.clientHeight > 0 ? el.clientHeight / CANVAS.h : 1,
      );
      setScale(Math.min(1, Math.max(0.42, fit)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={bandRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: reduce ? 0 : 0.2 }}
      className="relative z-10 min-h-[15rem] w-full flex-1 overflow-hidden"
    >
      {/* 1440×540 design canvas, scaled to fit the band */}
      <div
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          width: CANVAS.w,
          height: CANVAS.h,
        }}
        className="absolute top-1/2 left-1/2"
      >
        <motion.div
          className="absolute inset-0"
          initial={
            reduce ? { opacity: 0 } : { opacity: 0, y: 32, filter: "blur(12px)" }
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
      </div>
    </motion.div>
  );
}
