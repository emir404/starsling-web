"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE, appearT } from "@/components/concepts/shared/motion";
import { useCountUp } from "@/components/concepts/hero-9/use-count-up";
import { BEAT, BEAT_MS, COLOR, SUMMARY, fmtSeconds } from "./ci-run-data";

/**
 * Top run-summary bar (Figma 246:749): the trigger line + the PR row on the
 * left (teal branch name), and the Status / Total duration / Artifacts columns
 * on the right. The run reads as a live workflow: Status steps through an
 * animated pill (Queued → Running → Passed), the duration counts up across the
 * whole running window and lands on 23s, and the artifacts surface as named
 * chips that pop in one by one once the run passes.
 *
 * Rendered above the run graph as a normal responsive block (not on the scaled
 * canvas plane), in the *same* `max-w-[90rem]` + `px-6 md:px-12 lg:px-8` grid as
 * the hero text group — so the trigger/PR line sits under the headline and the
 * stat columns sit under the form at every width. The surface bleeds 20px past
 * that grid (`-mx-5`) and pads its content back onto it (`px-5`), keeping the
 * bar's inset look while the text stays on the page grid.
 */

/**
 * The duration counter climbs across the whole running window (fanout → passed)
 * so it reads as a live clock instead of snapping to 23 in 1.6s and freezing.
 * It lands on 23 just as the status flips to Passed; `settled` still snaps it on
 * a scroll-skip.
 */
const RUN_MS = BEAT_MS[BEAT.fanout] + BEAT_MS[BEAT.ticking] + BEAT_MS[BEAT.connect];

export function RunSummaryBar({ step, reduce }: { step: number; reduce: boolean }) {
  const total = useCountUp(SUMMARY.totalSeconds, {
    active: step >= BEAT.fanout,
    settled: step >= BEAT.passed,
    reduce,
    duration: RUN_MS / 1000,
  });
  const duration = step >= BEAT.fanout ? fmtSeconds(total) : "";

  return (
    // `pt-8` restores the 32px the canvas used to lead the bar with, now that the
    // bar sits above the plane instead of on it.
    <div className="mx-auto w-full max-w-[90rem] px-6 pt-8 md:px-12 lg:px-8">
      <div
        className="-mx-5 flex flex-col gap-4 px-5 py-4 md:flex-row md:items-start md:justify-between md:gap-8"
        style={{ background: COLOR.bar }}
      >
        <div className="flex flex-col gap-2.5">
          <p className="text-[14px] leading-none text-white/80">{SUMMARY.trigger}</p>
          <p className="text-[16px] leading-none font-medium text-white">
            {SUMMARY.prefix}
            <span style={{ color: COLOR.teal }}>{SUMMARY.branch}</span>
          </p>
        </div>

        <div className="flex shrink-0 gap-8 md:gap-12">
          <StatusStat step={step} reduce={reduce} />
          <Stat label="Total duration" className="tabular-nums">
            {duration}
          </Stat>
          <ArtifactsStat step={step} reduce={reduce} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- status pill */

type Phase = "queued" | "running" | "passed";

/** CI-convention colors: neutral queued, amber running, teal passed. */
const PHASE_STYLE: Record<Phase, { label: string; fg: string; bg: string }> = {
  queued: { label: SUMMARY.statusQueued, fg: "rgba(255,255,255,0.55)", bg: "rgba(255,255,255,0.08)" },
  running: { label: SUMMARY.statusRunning, fg: "#e6a93c", bg: "rgba(230,169,60,0.15)" },
  passed: { label: SUMMARY.statusPassed, fg: COLOR.teal, bg: "rgba(48,166,187,0.16)" },
};

function StatusStat({ step, reduce }: { step: number; reduce: boolean }) {
  const phase: Phase =
    step >= BEAT.passed ? "passed" : step >= BEAT.fanout ? "running" : "queued";
  const style = PHASE_STYLE[phase];

  return (
    <div className="flex flex-col gap-3">
      <StatLabel>Status</StatLabel>
      <motion.div
        className="inline-flex h-6 items-center gap-1.5 self-start rounded-full px-2.5 font-mono text-[13px] leading-none uppercase"
        initial={false}
        animate={{ backgroundColor: style.bg, color: style.fg }}
        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
      >
        {phase === "passed" ? (
          <CheckGlyph />
        ) : (
          <StatusDot pulsing={phase === "running" && !reduce} />
        )}
        <motion.span
          key={phase}
          initial={reduce ? false : { opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {style.label}
        </motion.span>
      </motion.div>
    </div>
  );
}

function StatusDot({ pulsing }: { pulsing: boolean }) {
  return (
    <motion.span
      className="block size-2 rounded-full"
      style={{ background: "currentColor" }}
      animate={pulsing ? { opacity: [1, 0.3, 1], scale: [1, 0.82, 1] } : { opacity: 1, scale: 1 }}
      transition={
        pulsing
          ? { duration: 1.3, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.2 }
      }
    />
  );
}

function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="size-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 6.5 5 9l4.5-5.5" />
    </svg>
  );
}

/* ----------------------------------------------------------- artifact chips */

function ArtifactsStat({ step, reduce }: { step: number; reduce: boolean }) {
  const produced = step >= BEAT.passed;

  return (
    <div className="flex flex-col gap-3">
      <StatLabel>Artifacts</StatLabel>
      <div className="flex min-h-6 flex-wrap items-center gap-1.5">
        {step < BEAT.fanout ? (
          <span className="text-[16px] leading-none font-medium text-white/40">—</span>
        ) : !produced ? (
          <span className="text-[16px] leading-none font-medium text-white/60">0</span>
        ) : (
          SUMMARY.artifactList.map((name, i) => (
            <ArtifactChip key={name} name={name} delay={0.1 + i * 0.28} reduce={reduce} />
          ))
        )}
      </div>
    </div>
  );
}

function ArtifactChip({
  name,
  delay,
  reduce,
}: {
  name: string;
  delay: number;
  reduce: boolean;
}) {
  return (
    <motion.span
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={appearT(reduce, delay, 0.4)}
      className="inline-flex items-center gap-1 rounded-sm bg-white/10 px-1.5 py-1 font-mono text-[12px] leading-none whitespace-nowrap text-white/90"
    >
      <svg
        viewBox="0 0 12 12"
        className="size-3 shrink-0 text-white/50"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M3 1.5h3.5L9 4v6.5H3z" />
        <path d="M6.5 1.5V4H9" />
      </svg>
      {name}
    </motion.span>
  );
}

/* ------------------------------------------------------------------- shared */

function StatLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[14px] leading-none whitespace-nowrap text-white/80 uppercase">
      {children}
    </span>
  );
}

function Stat({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <StatLabel>{label}</StatLabel>
      <span
        className={cn(
          "flex h-6 items-center text-[16px] leading-none font-medium text-white",
          className,
        )}
      >
        {children}
      </span>
    </div>
  );
}
