"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Marker } from "@/components/concepts/hero-4/runners-panel";
import { BEAT, SUMMARY, SUMMARY_BOX, fmt } from "./run-graph-data";
import { useCountUp } from "./use-count-up";

/**
 * The run-summary header bar above the e2e.yml card: the trigger line and the
 * actor/PR row on the left (monogram avatar + handle + branch chip), and the
 * Status / Total duration / Artifacts stat columns on the right. Status flips
 * Queued → Running → Success with the run; the total duration counts up.
 */
export function RunSummaryBar({ beat, reduce }: { beat: number; reduce: boolean }) {
  const total = useCountUp(SUMMARY.totalSeconds, {
    active: beat >= BEAT.running,
    settled: beat >= BEAT.success,
    reduce,
  });
  const initials = SUMMARY.actor.slice(0, 2).toUpperCase();

  return (
    <div
      className="absolute flex items-start justify-between gap-8"
      style={{
        left: SUMMARY_BOX.x,
        top: SUMMARY_BOX.y,
        width: SUMMARY_BOX.w,
        height: SUMMARY_BOX.h,
      }}
    >
      <div className="flex flex-col gap-3.5">
        <p className="font-mono text-[0.8125rem] whitespace-nowrap text-foreground/50">
          {SUMMARY.trigger}
        </p>
        <div className="flex items-center gap-2.5">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand font-mono text-[0.625rem] font-medium text-brand-foreground">
            {initials}
          </span>
          <span className="font-mono text-[0.9375rem] font-medium whitespace-nowrap text-foreground">
            {SUMMARY.actor}{" "}
            <span className="text-foreground/55">{SUMMARY.action}</span>
          </span>
          <span className="bg-highlight px-2 py-1 font-mono text-[0.75rem] font-medium whitespace-nowrap text-brand-dark dark:text-brand-bright">
            {SUMMARY.branch}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 gap-12 pt-0.5">
        <Stat label="Status">
          <Status beat={beat} reduce={reduce} />
        </Stat>
        <Stat label="Total duration">
          <span className="font-mono text-[0.9375rem] font-medium text-foreground tabular-nums">
            {beat >= BEAT.running ? fmt(total) : "—"}
          </span>
        </Stat>
        <Stat label="Artifacts">
          <span className="font-mono text-[0.9375rem] font-medium text-foreground">
            {beat >= BEAT.success ? SUMMARY.artifacts : "—"}
          </span>
        </Stat>
      </div>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[0.6875rem] font-medium uppercase whitespace-nowrap text-foreground/50">
        {label}
      </span>
      <span className="flex h-5 items-center">{children}</span>
    </div>
  );
}

function Status({ beat, reduce }: { beat: number; reduce: boolean }) {
  const success = beat >= BEAT.success;
  const running = beat >= BEAT.running;
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 font-mono text-[0.9375rem] font-medium whitespace-nowrap",
        success ? "text-brand" : "text-foreground",
      )}
    >
      <Marker
        shown={running}
        ticked={success}
        done={false}
        delay={0}
        reduce={reduce}
      />
      {success ? "Success" : running ? "Running" : "Queued"}
    </span>
  );
}
