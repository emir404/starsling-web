"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/concepts/shared/reveal";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import {
  BEAT_MS,
  CARDS,
  FOCUS_H,
  PLANE,
  STEP_COUNT,
  type CardId,
} from "./blueprint-data";
import { GraphGrid } from "./graph-grid";
import { InputCard } from "./input-card";
import { OutputCard } from "./output-card";
import { RunnersCard } from "./runners-card";

const SCENES: Record<CardId, ComponentType<{ step: number; reduce: boolean }>> = {
  input: InputCard,
  parallel: RunnersCard,
  output: OutputCard,
};

/**
 * The blueprint stage (Figma 211:2 → 212:122 → 212:231): the 1440×924 plane
 * holding the graph-paper grid and the materializing cards, anchored to the
 * container's bottom-right and scaled to fit width and the card column's
 * height — the grid bleeds past every edge, the container clips. Beats
 * auto-advance on their own pacing or on scroll-down, looping forever; INPUT
 * persists across loops while the later cards re-materialize.
 */
export function BlueprintStage({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const reduce = useReducedMotion();
  const { index } = useStepCycle({
    count: STEP_COUNT,
    intervals: BEAT_MS,
    ref: stageRef,
  });

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // SSR/first paint falls back to the design frame; corrected before paint.
  const w = box.w || PLANE.w;
  const h = box.h || PLANE.h;
  const scale = Math.max(0.42, Math.min(w / PLANE.w, h / FOCUS_H));

  return (
    <div
      ref={stageRef}
      className={cn("pointer-events-none overflow-hidden", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: reduce ? 0 : 0.25 }}
        style={{
          width: PLANE.w,
          height: PLANE.h,
          scale,
          transformOrigin: "100% 100%",
        }}
        className="absolute right-0 bottom-0"
      >
        <GraphGrid />
        {CARDS.map((card) => {
          const Scene = SCENES[card.id];
          return (
            <Reveal
              key={card.id}
              shown={index >= card.at}
              delay={0.1}
              reduce={!!reduce}
              hidden={{ opacity: 0, y: 18, scale: 0.97, filter: "blur(8px)" }}
              style={{ left: card.x, top: card.y, width: card.w, height: card.h }}
            >
              <div className="relative size-full overflow-hidden border border-[#d0dde1] bg-card shadow-[0_4px_24px_0_rgba(0,0,0,0.02)] dark:border-rail">
                <span className="absolute top-6 left-6 z-10 font-mono text-sm font-medium uppercase whitespace-nowrap text-foreground/80">
                  {card.label}
                </span>
                <Scene step={index} reduce={!!reduce} />
              </div>
            </Reveal>
          );
        })}
      </motion.div>
    </div>
  );
}
