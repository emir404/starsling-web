"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";
import { Reveal } from "@/components/concepts/shared/reveal";
import {
  IconCiRing,
  IconMarkerCheck,
} from "@/components/concepts/hero-2/timeline-icons";
import { BEAT, RUNNERS, type RunnerSpec } from "./pipeline-data";

/**
 * PARALLEL EXECUTION panel — the Figma placeholder grid (2×3 in Desktop-28,
 * 2×2 in Desktop-29) as runner cards in hero-2's loader/tick language: each
 * card spins up at the fan-out, resolves to a teal tick on its beat, and the
 * quick third column folds away when OUTPUT opens.
 */
export function RunnersPanel({ step, reduce }: { step: number; reduce: boolean }) {
  return (
    <div className="flex h-full flex-col px-8 pt-[3.75rem] pb-8 lg:px-10">
      <div className="m-auto flex max-h-[23.5rem] min-h-0 w-full max-w-[30rem] flex-1 flex-col gap-3.5">
        {RUNNERS.map((row) => (
          <div key={row[0].name} className="flex min-h-[5.25rem] flex-1 gap-3.5">
            {row.map((spec) => (
              <RunnerCard key={spec.name} spec={spec} step={step} reduce={reduce} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function RunnerCard({
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
  const collapsed = spec.collapseAt !== undefined && step >= spec.collapseAt;

  return (
    <motion.div
      initial={false}
      animate={{
        flexBasis: collapsed ? "0%" : "33.333%",
        flexGrow: collapsed ? 0 : 1,
        opacity: collapsed ? 0 : 1,
        marginLeft: collapsed ? "-0.875rem" : "0rem",
      }}
      transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
      className="min-w-0 overflow-hidden"
    >
      <Reveal
        shown={shown}
        delay={spec.delay}
        reduce={reduce}
        hidden={{ opacity: 0, y: 14, scale: 0.97, filter: "blur(6px)" }}
        className="relative h-full"
      >
        <div className="flex h-full min-w-[6.75rem] flex-col border border-hairline bg-header p-3.5 shadow-[0_0_12px_rgba(8,12,13,0.03)]">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "truncate font-mono text-[0.6875rem] font-medium uppercase transition-colors delay-150 duration-500",
                done ? "text-foreground/50" : "text-foreground/80",
              )}
            >
              {spec.name}
            </span>
            <Marker
              shown={shown}
              ticked={ticked}
              done={done}
              delay={spec.delay + 0.1}
              reduce={reduce}
            />
          </div>
          <div className="my-auto flex flex-col gap-2 py-3">
            {spec.bars.map((width, i) => (
              <motion.div
                key={`${spec.name}-bar-${i}`}
                initial={false}
                animate={
                  shown
                    ? { opacity: 1, scaleX: 1 }
                    : { opacity: 0, scaleX: 0.12 }
                }
                transition={
                  shown
                    ? {
                        duration: reduce ? 0.3 : 0.8,
                        ease: EASE,
                        delay: spec.delay + 0.2 + i * 0.12,
                      }
                    : { duration: 0.3 }
                }
                style={{ width: `${width}%` }}
                className={cn(
                  "h-1.5 origin-left border border-black/5 transition-colors delay-150 duration-500 dark:border-white/5",
                  ticked
                    ? "bg-highlight shadow-[-2px_2px_0_0_rgba(12,144,166,0.15)]"
                    : "bg-field shadow-[-2px_2px_0_0_rgba(12,144,166,0.25)]",
                )}
              />
            ))}
          </div>
          <div className="flex h-3 items-center">
            <motion.span
              initial={false}
              animate={{ opacity: ticked ? 1 : 0 }}
              transition={{ duration: 0.3, delay: ticked ? 0.15 : 0 }}
              className="font-mono text-[0.625rem] leading-none uppercase text-foreground/50"
            >
              {spec.time}
            </motion.span>
          </div>
        </div>
      </Reveal>
    </motion.div>
  );
}

/**
 * Runner state node (hero-2's milestone marker): spins as a loader dial while
 * the runner works, resolves to a teal tick, dims to the done grey at the end.
 * Also reused by hero-5's runner rows.
 */
export function Marker({
  shown,
  ticked,
  done,
  delay,
  reduce,
  tickDelay = 0,
}: {
  shown: boolean;
  ticked: boolean;
  done: boolean;
  delay: number;
  reduce: boolean;
  /** Extra delay before the loader→tick swap, so a bank's checks can cascade. */
  tickDelay?: number;
}) {
  const spinning = !reduce && shown && !ticked;
  const tickT = reduce ? 0 : tickDelay;

  return (
    <Reveal
      shown={shown}
      delay={delay}
      reduce={reduce}
      hidden={{ opacity: 0, scale: 0.5 }}
      className="relative size-[18px] shrink-0"
    >
      <motion.span
        initial={false}
        animate={{ opacity: ticked ? 0 : 1 }}
        transition={{ duration: 0.25, delay: ticked ? tickT : 0 }}
        className="absolute inset-0 block"
      >
        <motion.span
          className="absolute inset-0 block"
          animate={spinning ? { rotate: 360 } : { rotate: 0 }}
          transition={
            spinning
              ? { duration: 1.4, ease: "linear", repeat: Infinity }
              : { duration: 0.2 }
          }
        >
          <IconCiRing className="size-full" />
        </motion.span>
      </motion.span>
      <motion.span
        initial={false}
        animate={ticked ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
        transition={
          ticked ? { duration: 0.35, ease: EASE, delay: tickT } : { duration: 0.2 }
        }
        className="absolute inset-0 block"
      >
        <span
          className={cn(
            "absolute inset-[1.5px] rounded-full transition-colors delay-150 duration-500",
            done ? "bg-[#4e595b]" : "bg-brand",
          )}
        />
        <IconMarkerCheck className="absolute inset-0 size-full text-white" />
      </motion.span>
    </Reveal>
  );
}
