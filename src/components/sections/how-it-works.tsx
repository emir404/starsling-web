"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";

import { SectionHeading } from "@/components/shared/section";
import { MeshGradient } from "@/components/shared/mesh-gradient";
import { OrbitRings } from "@/components/shared/orbit-rings";
import { sceneSwapVariants } from "@/components/concepts/shared/motion";
import { cn } from "@/lib/utils";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import {
  AgentCard,
  EditorCard,
  TimelineCard,
} from "@/components/sections/how-it-works-illustrations";

/** Per-step dwell before auto-advancing (ms); the agent step reads longest. */
const DWELL = [4500, 5000, 6000];
/** Natural size of the Figma stage (Frame 2147226885); scaled to the column. */
const STAGE_W = 1320;
const STAGE_H = 608;

/**
 * Scales the fixed-size Figma stage down to fit its column at any width, so the
 * pixel-perfect diagrams stay crisp instead of reflowing. (No separate mobile
 * design was provided — "all screens" here means the three step states.)
 */
function ScaledStage({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / STAGE_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden"
      style={{ height: STAGE_H * scale }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * "How it works" (Figma 282:135 / 286:2304 / 286:2386) — a single stage with a
 * tab bar of the three steps. The active step's diagram plays its entrance on a
 * teal mesh-gradient + orbit-rings backdrop (the same pair used on the problem
 * section); steps auto-cycle and each tab jumps to its step. The cycle pauses
 * off-screen / on hidden tabs, and reduced motion disables it (tabs still work).
 */
export function HowItWorks() {
  const { title, subtitle, install, speed, agents } = HOW_IT_WORKS;
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [pageVisible, setPageVisible] = useState(true);

  const steps = [install.tab, speed.tab, agents.tab];
  const diagrams = [
    <EditorCard key="editor" />,
    <TimelineCard key="timeline" />,
    <AgentCard key="agents" />,
  ];

  // Pause the cycle while the page/tab is hidden.
  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Auto-advance 1→2→3→loop. Keyed on `active` so any advance — auto or a tab
  // click — restarts the wait. Skipped when off-screen / hidden / reduced motion.
  useEffect(() => {
    if (reduce || !inView || !pageVisible) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % steps.length),
      DWELL[active] ?? 5000,
    );
    return () => window.clearTimeout(id);
  }, [active, inView, pageVisible, reduce, steps.length]);

  return (
    <section className="w-full px-6 sm:px-[60px]">
      <div
        ref={ref}
        className="mx-auto flex w-full max-w-[1320px] flex-col border-x border-hairline"
      >
        {/* Header */}
        <div className="px-6 pt-16 pb-12 sm:px-14 sm:pt-20 sm:pb-14">
          <SectionHeading align="center" title={title} subtitle={subtitle} />
        </div>

        {/* Tab bar (Figma 286:2030) — clickable, jumps + restarts the cycle. */}
        <div
          role="tablist"
          aria-label="How it works steps"
          className="flex justify-start overflow-x-auto border-y border-hairline bg-header shadow-[0_0_25px_rgba(0,0,0,0.03)] [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden"
        >
          {steps.map((label, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 border-r border-hairline px-8 py-6 text-center font-sans text-[18px] font-medium leading-[1.2] tracking-[-0.01em] whitespace-nowrap transition-colors first:border-l",
                active === i
                  ? "bg-brand/15 text-[#007386] dark:bg-brand/20 dark:text-brand-bright"
                  : "text-foreground hover:bg-foreground/[0.03]",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Stage — teal backdrop + the active step's diagram. */}
        <ScaledStage>
          {/* Backdrop: teal mesh gradient + orbit rings (persistent across steps). */}
          <MeshGradient variant="mesh-bright" className="absolute inset-0" />
          <OrbitRings className="top-[42%] left-[34%] w-[150%] -translate-x-1/2 -translate-y-1/2" />

          <AnimatePresence>
            {inView ? (
              <motion.div
                key={active}
                variants={sceneSwapVariants(reduce)}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 z-10 flex items-center justify-center"
              >
                {diagrams[active]}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </ScaledStage>
      </div>
    </section>
  );
}
