"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  sceneRowVariants,
  sceneSwapVariants,
} from "@/components/concepts/shared/motion";

/**
 * INPUT step (Figma 201:5488): isometric browser window — workflow.yml title
 * bar, "git push" row, "PR OPENED" row. Coordinates are the untransformed
 * plane space (881.25 × 335.625); the parent stage applies the iso transform.
 * Right-column ink is theme-aware on purpose: the dark frame keeps `main` /
 * `by @emir404` near-black (a design oversight) — we follow the rest of the
 * dark plane and use the light foreground instead.
 */
export function InputScene() {
  const reduce = useReducedMotion();
  const swap = sceneSwapVariants(Boolean(reduce));
  const row = sceneRowVariants(Boolean(reduce));

  return (
    <motion.div
      variants={swap}
      initial="enter"
      animate="center"
      exit="exit"
      className="absolute inset-0 border-[1.875px] border-black/5 bg-[rgba(252,252,252,0.8)] shadow-[0_0_30px_0_rgba(0,0,0,0.03)] dark:bg-[rgba(42,50,50,0.8)]"
    >
      {/* Title bar */}
      <motion.div
        variants={row}
        className="absolute left-[-1.88px] top-[-1.87px] h-[90px] w-[881.25px] overflow-clip border-b-[1.875px] border-black/5 bg-white/90 dark:bg-[rgba(56,67,67,0.9)]"
      >
        {[37.5, 67.5, 97.5].map((left) => (
          <div
            key={left}
            className="absolute top-1/2 size-[15px] -translate-y-1/2 rounded-full bg-foreground/10"
            style={{ left }}
          />
        ))}
        <div className="absolute left-[142.5px] top-1/2 flex h-[60px] w-[723.75px] -translate-y-1/2 items-center bg-[rgba(8,12,13,0.03)] pl-[22.5px] dark:bg-white/5">
          <span className="font-mono text-[26.25px] leading-none text-foreground">
            workflow.yml
          </span>
        </div>
      </motion.div>

      {/* PUSH row */}
      <motion.div
        variants={row}
        className="absolute left-[calc(50%-1.34px)] top-[109.86px] h-[90px] w-[836.25px] -translate-x-1/2 overflow-clip border-[1.875px] border-black/5 bg-white/90 dark:bg-[rgba(56,67,67,0.9)]"
      >
        <span className="absolute left-[20.63px] top-1/2 -translate-y-1/2 bg-[#1f9b8b] px-[22.5px] py-[15px] font-mono text-[26.25px] font-medium leading-none text-white">
          PUSH
        </span>
        <span className="absolute left-[151.88px] top-1/2 -translate-y-1/2 font-mono text-[26.25px] font-medium leading-none text-foreground">
          git push
        </span>
        <span className="absolute right-[28.5px] top-1/2 -translate-y-1/2 font-mono text-[26.25px] font-medium leading-none text-foreground">
          main
        </span>
      </motion.div>

      {/* PR OPENED row */}
      <motion.div
        variants={row}
        className="absolute left-[20.63px] top-[223.12px] h-[90px] w-[836.25px] overflow-clip border-[1.875px] border-black/5 bg-white/90 dark:bg-[rgba(56,67,67,0.9)]"
      >
        <span className="absolute left-[20.63px] top-1/2 -translate-y-1/2 bg-[#1f9b8b]/10 px-[22.5px] py-[15px] font-mono text-[26.25px] font-medium leading-none text-[#057c6d] dark:text-[#31ae9e]">
          PR OPENED
        </span>
        <span className="absolute left-[230.63px] top-1/2 -translate-y-1/2 font-mono text-[26.25px] font-medium leading-none text-foreground">
          <span className="text-foreground/50">#</span>234
        </span>
        <span className="absolute right-[28.5px] top-1/2 -translate-y-1/2 font-mono text-[26.25px] font-medium leading-none text-foreground">
          <span className="text-foreground/50">by</span> @emir404
        </span>
      </motion.div>
    </motion.div>
  );
}
