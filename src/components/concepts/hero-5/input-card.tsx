"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";
import { TRIGGERS } from "./blueprint-data";

/**
 * INPUT card (240×479) — the trigger feed in hero-4's input language, stacked
 * for the narrow card: each entry is tag + meta on one line, the event code
 * below, with a watching pulse pinned to the card's foot. Entries cascade
 * once on mount; the card itself persists across loops.
 */
export function InputCard() {
  const reduce = useReducedMotion();

  return (
    <div className="flex h-full flex-col gap-3 px-6 pt-16 pb-5">
      {TRIGGERS.map((trigger, i) => (
        <motion.div
          key={trigger.tag}
          initial={
            reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(5px)" }
          }
          animate={
            reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          transition={{
            duration: reduce ? 0.35 : 0.5,
            delay: (reduce ? 0.1 : 0.45) + i * 0.12,
            ease: EASE,
          }}
          className="border border-hairline bg-header p-2.5 shadow-[0_0_12px_rgba(8,12,13,0.03)]"
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "px-1.5 py-1 font-mono text-[0.625rem] leading-none font-medium uppercase whitespace-nowrap",
                trigger.solid
                  ? "bg-foreground text-header"
                  : "bg-highlight text-brand-dark dark:text-brand-bright",
              )}
            >
              {trigger.tag}
            </span>
            <span className="truncate font-mono text-[0.625rem] font-medium text-foreground/50">
              {trigger.metaDim && <span>{trigger.metaDim} </span>}
              {trigger.meta}
            </span>
          </div>
          <p className="mt-2 font-mono text-xs font-medium whitespace-nowrap text-foreground">
            {trigger.codeDim && (
              <span className="text-foreground/50">{trigger.codeDim}</span>
            )}
            {trigger.code}
          </p>
        </motion.div>
      ))}
      <div className="mt-auto flex items-center gap-2">
        <span className="size-1.5 animate-pulse rounded-full bg-brand" />
        <span className="font-mono text-[0.625rem] font-medium uppercase text-foreground/50">
          Watching main
        </span>
      </div>
    </div>
  );
}
