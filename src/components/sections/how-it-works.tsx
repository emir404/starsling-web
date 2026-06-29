"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";

import { SectionHeading } from "@/components/shared/section";
import { RingConstellation } from "@/components/shared/ring-constellation";
import { sceneSwapVariants } from "@/components/concepts/shared/motion";
import { cn } from "@/lib/utils";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import {
  AgentCard,
  EditorCard,
  TimelineCard,
} from "@/components/sections/how-it-works-illustrations";

/** Natural size of the Figma stage (Frame 2147226885); scaled to fit the panel. */
const STAGE_W = 1320;
const STAGE_H = 608;

/** Seconds each step stays on screen before the timeline auto-advances. */
const STEP_DURATION = 5;

/**
 * Per-step transform for the background motif — it drifts to a new position,
 * scale, and slight rotation as the active step changes, giving the panel life.
 */
const MOTIF_STATES = [
  { x: "-7%", y: "-5%", scale: 1.04, rotate: -2 },
  { x: "6%", y: "4%", scale: 1.12, rotate: 3 },
  { x: "-3%", y: "8%", scale: 1, rotate: -1 },
] as const;

/**
 * Scales the fixed-size Figma stage to fit inside the panel, bounded by both the
 * available width *and* height — so it shrinks on short viewports instead of
 * overflowing — and capped at 1:1 so it never upscales past its crisp native
 * size. The diagram is centered; the dark panel behind it fills independently.
 */
function ScaledDiagram({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () =>
      setScale(Math.min(1, el.clientWidth / STAGE_W, el.clientHeight / STAGE_H));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-10 flex items-center justify-center"
    >
      <div
        className="relative"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * "How it works" — three steps that AUTO-CYCLE on a timeline (replacing the old
 * scroll-pinned stepper, which wasn't legible). A compact card holds the heading,
 * a tab bar that doubles as a progress timeline, and a dark panel where each
 * step's diagram replays its entrance over the sling-ring motif. The active tab's
 * bar fills across the step's dwell and, when it completes, advances to the next
 * step — so the bar *is* the timer: hovering the card or scrolling it off-screen
 * freezes it (via `animation-play-state`), and reduced motion holds on the chosen
 * step. Clicking a tab jumps to it and re-arms the dwell.
 */
export function HowItWorks() {
  const { title, subtitle, install, speed, agents } = HOW_IT_WORKS;
  const reduce = !!useReducedMotion();

  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const steps = [install.tab, speed.tab, agents.tab];
  const diagrams = [
    <EditorCard key="editor" />,
    <TimelineCard key="timeline" />,
    <AgentCard key="agents" />,
  ];

  // The timeline runs only while the card is on-screen, un-hovered, and motion is
  // allowed; otherwise it freezes — so a frozen bar never silently advances.
  const advancing = inView && !paused && !reduce;
  const goTo = (i: number) =>
    setActive(((i % steps.length) + steps.length) % steps.length);

  return (
    <section className="w-full px-6 sm:px-[60px]">
      <div className="mx-auto w-full max-w-[1320px] border-x border-hairline py-14 sm:py-20">
        <div
          ref={cardRef}
          className="flex w-full flex-col overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Header */}
          <div className="shrink-0 px-6 pb-8 sm:px-14 sm:pb-10">
            <SectionHeading align="center" title={title} subtitle={subtitle} />
          </div>

          {/* Tab bar (Figma 286:2030) — doubles as the progress timeline. */}
          <div
            role="tablist"
            aria-label="How it works steps"
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="flex shrink-0 justify-start overflow-x-auto border-y border-hairline bg-header shadow-[0_0_25px_rgba(0,0,0,0.03)] [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden"
          >
            {steps.map((label, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => goTo(i)}
                className={cn(
                  "relative shrink-0 border-r border-hairline px-8 py-6 text-center font-sans text-[18px] font-medium leading-[1.2] tracking-[-0.01em] whitespace-nowrap transition-colors first:border-l",
                  active === i
                    ? "bg-brand/15 text-[#007386] dark:bg-brand/20 dark:text-brand-bright"
                    : "text-foreground hover:bg-foreground/[0.03]",
                )}
              >
                {label}
                {/* timeline track; the active step's bar fills over its dwell */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden bg-foreground/[0.08]"
                >
                  {active === i && (
                    <span
                      key={active}
                      onAnimationEnd={() => goTo(active + 1)}
                      className="block h-full w-full origin-left bg-brand"
                      style={{
                        animationName: "progress-fill",
                        animationDuration: `${STEP_DURATION}s`,
                        animationTimingFunction: "linear",
                        animationFillMode: "forwards",
                        animationPlayState: advancing ? "running" : "paused",
                      }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Stage — solid #191F20 panel + sling-ring motif; the diagram fits within. */}
          <div className="dark relative h-[clamp(20rem,46vw,600px)] w-full overflow-hidden bg-panel text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden text-white/12"
              style={{
                maskImage:
                  "radial-gradient(120% 120% at 50% 50%, #000 78%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(120% 120% at 50% 50%, #000 78%, transparent 100%)",
              }}
            >
              {/* the motif drifts to a new position each step (static under reduced motion) */}
              <motion.div
                className="absolute inset-[-15%]"
                initial={false}
                animate={reduce ? undefined : MOTIF_STATES[active]}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <RingConstellation
                  preset="a"
                  className="absolute inset-0 h-full w-full"
                />
              </motion.div>
            </div>

            <ScaledDiagram>
              <AnimatePresence>
                {inView ? (
                  <motion.div
                    key={active}
                    variants={sceneSwapVariants(reduce)}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {diagrams[active]}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </ScaledDiagram>
          </div>
        </div>
      </div>
    </section>
  );
}
