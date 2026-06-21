"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";
import {
  IconMarkerCheck,
  IconPr,
} from "@/components/concepts/hero-2/timeline-icons";
import { BEAT, SUMMARY, durationAt } from "./dag-data";

/**
 * Top run-summary card: the trigger/actor/branch line on the left, and the
 * Status / Total duration / Artifacts columns on the right. Status flips to
 * Success when the gate passes; Total duration stays blank until it lands on
 * the dramatic low number at the speed beat (with a one-shot pulse) — the
 * card's speed payoff.
 */
export function SummaryCard({ step, reduce }: { step: number; reduce: boolean }) {
  const passed = step >= BEAT.passed;
  const landed = step >= BEAT.speed;

  return (
    <div
      className="absolute border border-rail bg-card shadow-[0_4px_24px_0_rgba(0,0,0,0.25)]"
      style={{ left: SUMMARY.x, top: SUMMARY.y, width: SUMMARY.w, height: SUMMARY.h }}
    >
      <div className="flex size-full items-center justify-between gap-8 px-9">
        <div className="flex min-w-0 flex-col gap-2.5">
          <span className="font-mono text-[0.6875rem] tracking-wide uppercase text-foreground/45">
            {SUMMARY.trigger}
          </span>
          <div className="flex items-center gap-3">
            <span className="grid size-7 shrink-0 place-items-center bg-brand/15 text-brand">
              <IconPr className="size-[18px]" />
            </span>
            <span className="whitespace-nowrap text-[0.9375rem] font-medium text-foreground/90">
              {SUMMARY.actor}{" "}
              <span className="font-normal text-foreground/50">
                {SUMMARY.action} {SUMMARY.pr}
              </span>
            </span>
            <span className="shrink-0 border border-rail bg-field px-2 py-1 font-mono text-[0.6875rem] text-foreground/60">
              {SUMMARY.branch}
            </span>
          </div>
          <span className="truncate font-mono text-[0.6875rem] tracking-wide uppercase text-foreground/35">
            {SUMMARY.title}
          </span>
        </div>

        <div className="flex shrink-0 items-start gap-12">
          <Column label="Status">
            <div className="flex items-center gap-2">
              {passed && (
                <span className="relative grid size-[18px] place-items-center">
                  <span className="absolute inset-[1.5px] rounded-full bg-brand" />
                  <IconMarkerCheck className="absolute inset-0 size-full text-white" />
                </span>
              )}
              <motion.span
                key={passed ? "success" : "queued"}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "text-base font-medium",
                  passed ? "text-foreground/90" : "text-foreground/55",
                )}
              >
                {passed ? SUMMARY.statusSuccess : SUMMARY.statusQueued}
              </motion.span>
            </div>
          </Column>

          <Column label="Total duration">
            <motion.span
              key={landed ? "final" : "pending"}
              initial={false}
              animate={landed && !reduce ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className={cn(
                "text-lg font-medium tabular-nums",
                landed ? "text-brand" : "text-foreground/45",
              )}
            >
              {durationAt(step)}
            </motion.span>
          </Column>

          <Column label="Artifacts">
            <span className="text-lg font-medium text-foreground/70">
              {SUMMARY.artifacts}
            </span>
          </Column>
        </div>
      </div>
    </div>
  );
}

function Column({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[0.6875rem] tracking-wide uppercase text-foreground/45">
        {label}
      </span>
      {children}
    </div>
  );
}
