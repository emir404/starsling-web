"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";
import { Reveal } from "@/components/concepts/shared/reveal";
import {
  IconBuildCheck,
  IconMarkerCheck,
} from "@/components/concepts/hero-2/timeline-icons";
import { BEAT, COMPARE, RESULTS, VERDICT } from "./blueprint-data";

/**
 * OUTPUT card (240×479) — hero-4's verdict column compressed for the narrow
 * card: the solid teal Build passed bar, the run summary with dotted leaders,
 * and the wall-clock comparison landing "80% time saved" on the last beat.
 */
export function OutputCard({ step, reduce }: { step: number; reduce: boolean }) {
  const shown = step >= BEAT.verdict;
  const saved = step >= BEAT.saved;

  return (
    <div className="flex h-full flex-col px-6 pt-16 pb-6">
      <Reveal
        shown={shown}
        delay={VERDICT.delay}
        reduce={reduce}
        hidden={{ opacity: 0, y: 12, filter: "blur(6px)" }}
        className="relative shrink-0"
      >
        <div className="flex h-10 items-center gap-1.5 bg-brand px-3 text-brand-foreground">
          <IconBuildCheck className="size-4" />
          <span className="font-mono text-[0.6875rem] font-medium uppercase whitespace-nowrap">
            {VERDICT.text}
          </span>
          <span className="ml-auto font-mono text-[0.625rem] uppercase whitespace-nowrap opacity-80">
            {VERDICT.time}
          </span>
        </div>
      </Reveal>

      <Reveal
        shown={shown}
        delay={VERDICT.delay + 0.15}
        reduce={reduce}
        hidden={{ opacity: 0, y: 14, filter: "blur(6px)" }}
        className="relative mt-2.5 min-h-0 flex-1"
      >
        <div className="flex h-full flex-col overflow-hidden border border-hairline bg-header p-4 shadow-[0_0_12px_rgba(8,12,13,0.03)]">
          <div className="flex items-center justify-between font-mono text-[0.625rem] font-medium uppercase text-foreground/50">
            <span>Run summary</span>
            <span>#356</span>
          </div>

          <ul className="mt-3 flex flex-col gap-1.5">
            {RESULTS.map((row, i) => (
              <motion.li
                key={row.name}
                initial={false}
                animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                transition={
                  shown
                    ? {
                        duration: reduce ? 0.3 : 0.45,
                        ease: EASE,
                        delay: VERDICT.delay + 0.3 + i * 0.07,
                      }
                    : { duration: 0.25 }
                }
                className="flex items-center gap-2"
              >
                <span className="grid size-3 shrink-0 place-items-center rounded-full bg-brand">
                  <IconMarkerCheck className="size-3 text-white" />
                </span>
                <span className="font-mono text-[0.625rem] font-medium uppercase whitespace-nowrap text-foreground/80">
                  {row.name}
                </span>
                <span className="min-w-2 flex-1 self-center border-b border-dotted border-foreground/15" />
                <span className="font-mono text-[0.625rem] uppercase whitespace-nowrap text-foreground/50">
                  {row.time}
                </span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-2 border-t border-hairline pt-3">
            {COMPARE.rows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-center justify-between font-mono text-[0.625rem] font-medium uppercase">
                  <span
                    className={
                      row.brand ? "text-foreground/80" : "text-foreground/50"
                    }
                  >
                    {row.label}
                  </span>
                  <span className="text-foreground/50">{row.time}</span>
                </div>
                <motion.div
                  initial={false}
                  animate={
                    saved
                      ? { scaleX: 1, opacity: 1 }
                      : { scaleX: 0.05, opacity: 0 }
                  }
                  transition={
                    saved
                      ? {
                          duration: reduce ? 0.3 : 0.8,
                          ease: EASE,
                          delay: 0.15 + i * 0.2,
                        }
                      : { duration: 0.25 }
                  }
                  style={{ width: `${row.width}%` }}
                  className={cn(
                    "mt-1 h-1.5 origin-left",
                    row.brand
                      ? "bg-brand"
                      : "border border-black/5 bg-field dark:border-white/5",
                  )}
                />
              </div>
            ))}
            <motion.p
              initial={false}
              animate={
                saved
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 5, filter: "blur(4px)" }
              }
              transition={
                saved
                  ? { duration: reduce ? 0.3 : 0.5, ease: EASE, delay: 0.6 }
                  : { duration: 0.25 }
              }
              className="pt-0.5 text-right font-mono text-[0.6875rem] font-medium uppercase text-brand"
            >
              {COMPARE.caption}
            </motion.p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
