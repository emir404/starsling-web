"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/components/concepts/shared/motion";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import {
  BEAT,
  BEAT_MS,
  CANVAS,
  STEP_COUNT,
} from "@/components/concepts/hero-2/timeline-data";
import { TimelineScene } from "@/components/concepts/hero-2/timeline-scene";

/**
 * Hero-3's camera band (Figma 217:1249): the same hero-2 scene rendered big —
 * ~1.49× the design scale at a 1440 viewport, full bleed — with the canvas
 * overflowing the right edge. The camera starts anchored on the New PR pill
 * and pans right (and slightly down) as the run reaches the parallel runners
 * and the build verdict, then snaps home when the loop restarts.
 */

/** Scene scale at a 1440-wide viewport, from the Figma frame (1.4903×). */
const FIGMA_SCALE = 1.4903;
/** Vertical slice of the canvas the camera must keep visible (canvas px). */
const FOCUS_H = 400;
/** Figma's left margin to the New PR pill, as a fraction of viewport width. */
const MARGIN_RATIO = 55 / 1440;

type Phase = "intro" | "runners" | "verdict";

function phaseOf(step: number): Phase {
  if (step >= BEAT.build) return "verdict";
  if (step >= BEAT.parallel) return "runners";
  return "intro";
}

/** Horizontal anchor per phase: canvas x pinned near the right edge (or, for
 *  the intro, the New PR pill pinned at the left margin). */
const RIGHT_ANCHOR: Record<Phase, number | null> = {
  intro: null,
  runners: 1290, // through the E2E check + labels
  verdict: 1330, // through the lane running off col 3
};

/** Vertical focus center per phase (canvas y). */
const FOCUS_CY: Record<Phase, number> = {
  intro: 195,
  runners: 285,
  verdict: 195,
};

export function TimelineCameraBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const reduce = useReducedMotion();
  const { index } = useStepCycle({
    count: STEP_COUNT,
    intervals: BEAT_MS,
    ref: bandRef,
  });

  useLayoutEffect(() => {
    const el = bandRef.current;
    if (!el) return;
    const measure = () =>
      setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const phase = phaseOf(index);
  // SSR/first render fall back to design-frame dimensions; useLayoutEffect
  // corrects them before the first paint.
  const w = box.w || 1440;
  const h = box.h || 560;
  const margin = Math.max(24, w * MARGIN_RATIO);
  const scale = Math.max(
    0.42,
    Math.min((FIGMA_SCALE * w) / 1440, h / FOCUS_H),
  );
  const cw = CANVAS.w * scale;
  const ch = CANVAS.h * scale;

  // Camera: pin the New PR pill at the left margin for the intro; pin the
  // phase's right anchor at the right margin once the run moves on. Center
  // outright when the whole canvas fits.
  const introX = margin - 88 * scale;
  let x: number;
  if (cw <= w - 2 * margin) {
    x = (w - cw) / 2;
  } else {
    const anchor = RIGHT_ANCHOR[phase];
    x = anchor === null ? introX : Math.min(w - margin - anchor * scale, introX);
  }
  let y: number;
  if (ch <= h) {
    y = (h - ch) / 2;
  } else {
    y = Math.min(0, Math.max(h - ch, h / 2 - FOCUS_CY[phase] * scale));
  }

  return (
    <motion.div
      ref={bandRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: reduce ? 0 : 0.2 }}
      className="relative z-10 min-h-[15rem] w-full flex-1 overflow-hidden"
    >
      <motion.div
        initial={false}
        animate={{ x, y }}
        transition={{ duration: reduce ? 0 : 1, ease: EASE }}
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
