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
      className="absolute inset-0 z-10 hidden items-center justify-center lg:flex"
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
  const tablistRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { amount: 0.3 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const steps = [install.tab, speed.tab, agents.tab];
  // The same component drives both the scaled desktop stage and the fluid mobile
  // reflow, so one `active` index stays the single source of truth for both.
  const cards = [EditorCard, TimelineCard, AgentCard];
  const ActiveCard = cards[active];

  // The timeline runs only while the card is on-screen, un-hovered, and motion is
  // allowed; otherwise it freezes — so a frozen bar never silently advances.
  const advancing = inView && !paused && !reduce;
  const goTo = (i: number) =>
    setActive(((i % steps.length) + steps.length) % steps.length);

  // Keep the active tab (and its filling progress bar) centered in the
  // horizontally-scrolling tab bar on narrow screens — scrolls the bar only,
  // never the page (so the section never auto-scrolls into view on mount).
  useEffect(() => {
    const list = tablistRef.current;
    const tab = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!list || !tab) return;
    list.scrollTo({
      left: Math.max(0, tab.offsetLeft - (list.clientWidth - tab.clientWidth) / 2),
      behavior: reduce ? "auto" : "smooth",
    });
  }, [active, reduce]);

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
            ref={tablistRef}
            role="tablist"
            aria-label="How it works steps"
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="relative flex shrink-0 justify-start overflow-x-auto border-y border-hairline bg-header shadow-[0_0_25px_rgba(0,0,0,0.03)] [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden"
          >
            {steps.map((label, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => goTo(i)}
                className={cn(
                  "relative shrink-0 border-r border-hairline px-4 py-4 text-center font-sans text-sm font-medium leading-[1.2] tracking-[-0.01em] whitespace-nowrap transition-colors first:border-l focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset sm:px-8 sm:py-6 sm:text-[18px]",
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

          {/* Stage — solid #191F20 panel + sling-ring motif. Fixed-height scaled
              stage at lg+; below lg it's content-driven (fluid cards) with a floor
              to reserve space before the cards animate in (avoids layout shift). */}
          <div className="dark relative flex min-h-[24rem] w-full items-center justify-center overflow-hidden bg-panel px-4 py-10 text-white lg:block lg:h-[clamp(20rem,46vw,600px)] lg:min-h-0 lg:px-0 lg:py-0">
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
                    <ActiveCard />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </ScaledDiagram>

            {/* Mobile (< lg): the scaled stage is hidden; the active card reflows
                fluidly to fill the width at legible type. `mode="wait"` lets one
                card leave before the next enters so the auto-height stage stays
                tidy through a swap. Same `key={active}` → same replay-on-step. */}
            <div className="relative z-10 mx-auto w-full max-w-[34rem] lg:hidden">
              <AnimatePresence mode="wait">
                {inView ? (
                  <motion.div
                    key={active}
                    variants={sceneSwapVariants(reduce)}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <ActiveCard variant="mobile" />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
