"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { GitPullRequest } from "lucide-react";

import { EASE } from "@/components/concepts/shared/motion";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import { PRS_CONTENT } from "@/content/prs";
import type { PrsAgent } from "@/types/content";

/** How many cards stay mounted at once (newest on top, oldest receding). */
const WINDOW = 5;
/** New PR every this many ms while the section is in view. */
const TICK_MS = 1200;
/** Per-slot resting transform (slot 0 = newest/top). Slots 3-4 recede into the pile. */
const SLOT_Y = [0, 64, 128, 152, 170];
const SLOT_SCALE = [1, 1, 1, 0.94, 0.88];
const SLOT_OPACITY = [1, 1, 1, 0.55, 0.28];
const SLOT_BLUR = [0, 0, 0, 1.5, 3];
const LAST = WINDOW - 1;

/** Positive modulo, so a negative logical id still maps to a valid agent. */
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** A single PR row: branch glyph + "feature: …" + "Opened by <agent>". */
function PrCard({ agent }: { agent: PrsAgent }) {
  const { pr } = PRS_CONTENT;
  return (
    <div className="flex items-center justify-between gap-3 border border-[#344b4e] bg-[#1f383c] p-4">
      <div className="flex min-w-0 items-center gap-3">
        <GitPullRequest className="size-6 shrink-0 text-white/70" aria-hidden />
        <p className="min-w-0 truncate text-sm font-medium sm:text-base">
          <span className="text-[#37d8f3]">{pr.type}</span>
          <span className="text-white">: </span>
          <span className="text-white/80">{pr.description}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden text-sm font-medium text-white/80 sm:inline">
          Opened by
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG; next/image adds no value for an inline vector */}
        <img
          src={agent.logo}
          alt={agent.name}
          width={agent.width}
          height={agent.height}
          className="h-[1.125rem] w-auto"
        />
      </div>
    </div>
  );
}

/**
 * The animated PR feed (Figma 234:468, annotated "animated section, prs get
 * stacked"). A new PR drops in at the top every {@link TICK_MS}; the list
 * shifts down and older cards recede into a scaled/faded pile, while TIME
 * ELAPSED creeps up far slower than the inflow. The cycle pauses off-screen and
 * on hidden tabs (via {@link useStepCycle}); reduced motion renders it static.
 *
 * Colors are hard-coded so the band looks identical in light and dark mode.
 */
export function PrFeed() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Large count ⇒ a monotonic ticker (no wrap flash); count 1 ⇒ frozen.
  const { index } = useStepCycle({
    count: reduce ? 1 : 9999,
    intervalMs: TICK_MS,
    ref,
  });
  const { agents, timeLabel } = PRS_CONTENT;
  const minutes = 3 + Math.floor(index / 12);

  // Slot j shows logical id (index - j); content is a pure function of the id.
  const cards = Array.from({ length: WINDOW }, (_, slot) => {
    const id = index - slot;
    return { id, slot, agent: agents[mod(id, agents.length)] };
  });

  return (
    <div ref={ref} className="flex w-full flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3 border border-white/10 bg-white/10 px-9 py-4 text-center">
        <span className="font-mono text-lg font-medium uppercase leading-tight text-white/70">
          {timeLabel}
        </span>
        <span className="text-base font-semibold text-white">{minutes}mins</span>
      </div>

      <div className="relative h-60 w-full max-w-[41rem]">
        <AnimatePresence initial={false}>
          {cards.map(({ id, slot, agent }) => (
            <motion.div
              key={id}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: -28, scale: 1, filter: "blur(8px)" }
              }
              animate={
                reduce
                  ? { opacity: SLOT_OPACITY[slot] }
                  : {
                      opacity: SLOT_OPACITY[slot],
                      y: SLOT_Y[slot],
                      scale: SLOT_SCALE[slot],
                      filter: `blur(${SLOT_BLUR[slot]}px)`,
                    }
              }
              exit={
                reduce
                  ? { opacity: 0 }
                  : {
                      opacity: 0,
                      y: SLOT_Y[LAST] + 16,
                      scale: 0.8,
                      filter: "blur(6px)",
                    }
              }
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              style={{ zIndex: WINDOW - slot }}
              className="absolute inset-x-0 top-0 mx-auto w-full"
            >
              <PrCard agent={agent} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
