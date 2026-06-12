"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

import {
  EASE,
  sceneRowVariants,
  sceneSwapVariants,
} from "@/components/concepts/shared/motion";

/**
 * PLANNING step (Figma 201:5532): isometric planning card — Starsling
 * wordmark, "PLANNING THE BEST APPROACH", three task bars with a teal print
 * shadow. Same untransformed plane space as the input scene; the bars fill
 * from the left when the scene enters.
 */
export function PlanningScene() {
  const reduce = useReducedMotion();
  const swap = sceneSwapVariants(Boolean(reduce));
  const row = sceneRowVariants(Boolean(reduce));
  const bar: Variants = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.3 } },
      }
    : {
        enter: { opacity: 0, scaleX: 0.12 },
        center: {
          opacity: 1,
          scaleX: 1,
          transition: { duration: 0.8, ease: EASE },
        },
      };

  return (
    <motion.div
      variants={swap}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0 border-[1.875px] border-black/5 bg-[rgba(252,252,252,0.8)] shadow-[0_0_30px_0_rgba(0,0,0,0.03)] dark:bg-[rgba(42,50,50,0.8)]"
    >
      <motion.div variants={row} className="absolute left-[47.78px] top-[47.78px]">
        {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG; next/image adds no value for an inline vector */}
        <img
          src="/starsling-logo.svg"
          alt=""
          width={234}
          height={50}
          className="h-[49.64px] w-auto dark:invert"
        />
      </motion.div>
      <motion.span
        variants={row}
        className="absolute right-[51.55px] top-[60.13px] font-mono text-[26.06px] leading-none text-foreground"
      >
        PLANNING THE BEST APPROACH
      </motion.span>
      {[
        { top: 139.61, width: 781.82 },
        { top: 189.25, width: 697.43 },
        { top: 238.89, width: 727.22 },
      ].map(({ top, width }) => (
        <motion.div
          key={top}
          variants={bar}
          className="absolute left-[47.78px] h-[29.78px] origin-left border-[0.149px] border-black/5 bg-[rgba(8,12,13,0.03)] shadow-[-2.482px_2.482px_0_0_rgba(31,155,139,0.25)] dark:border-white/5 dark:bg-white/[0.03]"
          style={{ top, width }}
        />
      ))}
    </motion.div>
  );
}
