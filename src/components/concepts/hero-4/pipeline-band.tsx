"use client";

import { useRef, type ComponentType } from "react";
import { motion, useReducedMotion } from "motion/react";

import { EASE } from "@/components/concepts/shared/motion";
import { Reveal } from "@/components/concepts/shared/reveal";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import { BEAT_MS, PANELS, STEP_COUNT, stageOf, type PanelId } from "./pipeline-data";
import { InputPanel } from "./input-panel";
import { OutputPanel } from "./output-panel";
import { RunnersPanel } from "./runners-panel";

const SCENES: Record<PanelId, ComponentType<{ step: number; reduce: boolean }>> = {
  input: InputPanel,
  parallel: RunnersPanel,
  output: OutputPanel,
};

/**
 * The splitting pipeline band (Figma 204:6485 → 204:6556 → 204:6612): a
 * full-bleed top rule, the gutter-inset white panels, and the wider 70px
 * plinth strip below. All three panels stay mounted; the layout stage
 * animates their flex-basis between the keyframe widths, so INPUT narrows as
 * PARALLEL EXECUTION and then OUTPUT slide open. Panels run side by side from
 * `md` and stack vertically below it (flex-basis drives either axis). Beats
 * auto-advance on their own pacing or on scroll-down, looping forever.
 */
export function PipelineBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { index } = useStepCycle({
    count: STEP_COUNT,
    intervals: BEAT_MS,
    ref: bandRef,
  });
  const stage = stageOf(index);

  return (
    <motion.div
      ref={bandRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: reduce ? 0 : 0.2 }}
      className="relative z-10 flex min-h-[15rem] w-full flex-1 flex-col border-t border-band-border"
    >
      <motion.div
        initial={
          reduce ? { opacity: 0 } : { opacity: 0, y: 28, filter: "blur(10px)" }
        }
        animate={
          reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        transition={{
          duration: reduce ? 0.35 : 0.7,
          delay: reduce ? 0 : 0.35,
          ease: EASE,
        }}
        className="mx-auto flex min-h-0 w-full max-w-[90rem] flex-1 px-6 md:px-12 lg:px-[7.5rem]"
      >
        <div className="flex min-h-0 w-full flex-col border-x border-b border-band-border md:flex-row">
          {PANELS.map((panel, i) => {
            const Scene = SCENES[panel.id];
            return (
              <motion.section
                key={panel.id}
                initial={false}
                animate={{ flexBasis: panel.basis[stage] }}
                transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
                style={{ flexGrow: 0, flexShrink: 0 }}
                className="relative min-h-0 min-w-0 overflow-hidden bg-card"
              >
                {i > 0 && (
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ opacity: stage >= i ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: stage >= i ? 0.2 : 0 }}
                    className="absolute inset-x-0 top-0 z-10 h-px bg-band-border md:inset-x-auto md:inset-y-0 md:left-0 md:h-auto md:w-px"
                  />
                )}
                <Reveal
                  shown={index >= panel.at}
                  delay={0.25}
                  reduce={!!reduce}
                  hidden={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  className="absolute top-6 left-6 z-10"
                >
                  <span className="font-mono text-sm font-medium uppercase whitespace-nowrap text-foreground/80">
                    {panel.label}
                  </span>
                </Reveal>
                <Scene step={index} reduce={!!reduce} />
              </motion.section>
            );
          })}
        </div>
      </motion.div>

      {/* Plinth strip: 70px tall, half-gutter inset, side rules only */}
      <div className="h-[4.375rem] w-full shrink-0 border-t border-band-border">
        <div className="mx-auto h-full w-full max-w-[90rem] px-3 md:px-6 lg:px-[3.75rem]">
          <div className="h-full border-x border-band-border" />
        </div>
      </div>
    </motion.div>
  );
}
