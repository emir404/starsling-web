"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/concepts/shared/reveal";
import { Marker } from "@/components/concepts/hero-4/runners-panel";
import { BEAT, RUNNERS, type RunnerSpec } from "./blueprint-data";

/**
 * PARALLEL EXEC. card (480×241) — the six runners as slim live rows in a
 * two-column grid: hero-4's loader/tick marker, the runner name, a dotted
 * leader, and the wall time landing on resolve.
 */
export function RunnersCard({ step, reduce }: { step: number; reduce: boolean }) {
  return (
    <div className="flex h-full flex-col px-6 pt-14 pb-5">
      <div className="grid flex-1 grid-cols-2 content-center gap-x-8 gap-y-3">
        {RUNNERS.map((spec) => (
          <RunnerRow key={spec.name} spec={spec} step={step} reduce={reduce} />
        ))}
      </div>
    </div>
  );
}

function RunnerRow({
  spec,
  step,
  reduce,
}: {
  spec: RunnerSpec;
  step: number;
  reduce: boolean;
}) {
  const shown = step >= BEAT.fanout;
  const ticked = step >= spec.tickAt;
  const done = step >= BEAT.saved;

  return (
    <Reveal
      shown={shown}
      delay={spec.delay}
      reduce={reduce}
      hidden={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      className="relative"
    >
      <div className="flex items-center gap-2">
        <Marker
          shown={shown}
          ticked={ticked}
          done={done}
          delay={spec.delay + 0.1}
          reduce={reduce}
        />
        <span
          className={cn(
            "truncate font-mono text-[0.6875rem] font-medium uppercase transition-colors delay-150 duration-500",
            done ? "text-foreground/50" : "text-foreground/80",
          )}
        >
          {spec.name}
        </span>
        <span className="min-w-3 flex-1 self-center border-b border-dotted border-foreground/15" />
        <motion.span
          initial={false}
          animate={{ opacity: ticked ? 1 : 0 }}
          transition={{ duration: 0.3, delay: ticked ? 0.15 : 0 }}
          className="font-mono text-[0.625rem] uppercase whitespace-nowrap text-foreground/50"
        >
          {spec.time}
        </motion.span>
      </div>
    </Reveal>
  );
}
