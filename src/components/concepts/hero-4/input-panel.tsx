"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";
import { TRIGGERS } from "./pipeline-data";

/**
 * INPUT panel — the four placeholder bars from the Figma frames, filled in
 * with hero-1's input-scene language: workflow trigger rows (tag chip, event,
 * right-aligned meta). Rows stay vertically centered in the full panel and
 * narrow with it as the band splits. They persist across beats; the cascade
 * runs once on mount, after the band's entrance.
 */
export function InputPanel() {
  const reduce = useReducedMotion();

  return (
    <div className="flex h-full flex-col items-center gap-6 px-8 pt-16 pb-10 [justify-content:safe_center] lg:px-12">
      {TRIGGERS.map((trigger, i) => (
        <motion.div
          key={trigger.tag}
          initial={
            reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(6px)" }
          }
          animate={
            reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          transition={{
            duration: reduce ? 0.35 : 0.55,
            delay: (reduce ? 0.1 : 0.55) + i * 0.12,
            ease: EASE,
          }}
          className="flex h-12 w-full max-w-[34.125rem] items-center gap-3.5 border border-hairline bg-header py-1.5 pr-4 pl-1.5 shadow-[0_0_12px_rgba(8,12,13,0.03)]"
        >
          <span
            className={cn(
              "flex h-full items-center px-2.5 font-mono text-xs font-medium uppercase whitespace-nowrap",
              trigger.solid
                ? "bg-foreground text-header"
                : "bg-highlight text-brand-dark dark:text-brand-bright",
            )}
          >
            {trigger.tag}
          </span>
          <span className="font-mono text-[0.8125rem] font-medium whitespace-nowrap text-foreground">
            {trigger.codeDim && (
              <span className="text-foreground/50">{trigger.codeDim}</span>
            )}
            {trigger.code}
          </span>
          <span className="ml-auto font-mono text-[0.8125rem] font-medium whitespace-nowrap text-foreground">
            {trigger.metaDim && (
              <span className="text-foreground/50">{trigger.metaDim} </span>
            )}
            {trigger.meta}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
