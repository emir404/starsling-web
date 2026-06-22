"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";

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

/** Natural size of the Figma stage (Frame 2147226885); scaled to fit the panel. */
const STAGE_W = 1320;
const STAGE_H = 608;

/**
 * Scroll distance (in svh) the track allots per step. The card stays pinned while
 * the track scrolls past it, so a larger value makes each step dwell longer — i.e.
 * the steps advance more slowly as you scroll. (At 100 they felt too fast.)
 */
const STEP_SCROLL_VH = 150;

/**
 * Scales the fixed-size Figma stage to fit inside the pinned panel, bounded by
 * both the available width *and* height — so it shrinks on short viewports
 * instead of overflowing — and capped at 1:1 so it never upscales past its
 * crisp native size. The diagram is centered; the teal backdrop behind it fills
 * the panel independently.
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
 * "How it works" (Figma 282:135 / 286:2304 / 286:2386) — a scroll-driven stage.
 * The blueprint rails run the full height of a tall scroll track while a compact
 * card (heading, tab bar, diagram) pins to the centre of the viewport, just under
 * the sticky header, with rail-framed breathing room above and below; the three
 * steps then advance one-by-one as you scroll through the track. Each step's
 * diagram replays its entrance on the teal mesh-gradient + orbit-rings backdrop,
 * and the tab bar doubles as a progress indicator — clicking a tab scrolls to
 * that step. Reduced motion keeps the scroll mapping and swaps via a plain fade.
 */
export function HowItWorks() {
  const { title, subtitle, install, speed, agents } = HOW_IT_WORKS;
  const reduce = !!useReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { amount: 0.3 });
  const [active, setActive] = useState(0);

  const steps = [install.tab, speed.tab, agents.tab];
  const diagrams = [
    <EditorCard key="editor" />,
    <TimelineCard key="timeline" />,
    <AgentCard key="agents" />,
  ];

  // The track is `steps.length` viewport-heights tall; as it scrolls past, the
  // pinned stage advances through the steps in equal segments. `useScroll`
  // clamps progress to [0, 1], so the first/last steps hold at the ends.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(
      Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length))),
    );
  });

  // Tab click → smooth-scroll so that step's segment lands centred in the pin.
  const scrollToStep = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const trackTop = el.getBoundingClientRect().top + window.scrollY;
    const distance = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: trackTop + ((i + 0.5) / steps.length) * distance,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section className="w-full px-6 sm:px-[60px]">
      {/* Tall scroll track — the blueprint rails span its full height. */}
      <div
        ref={trackRef}
        className="relative mx-auto w-full max-w-[1320px] border-x border-hairline"
        style={{ height: `${steps.length * STEP_SCROLL_VH}svh` }}
      >
        {/* The card pins centred in the viewport, just below the sticky header. */}
        <div className="sticky top-20 flex h-[calc(100svh-5rem)] w-full items-center justify-center lg:top-[6.25rem] lg:h-[calc(100svh-6.25rem)]">
          <div ref={cardRef} className="flex h-[min(780px,100%)] w-full flex-col overflow-hidden">
            {/* Header */}
            <div className="shrink-0 px-6 pt-12 pb-8 sm:px-14 sm:pt-14 sm:pb-10">
              <SectionHeading align="center" title={title} subtitle={subtitle} />
            </div>

            {/* Tab bar (Figma 286:2030) — progress indicator; click scrolls to its step. */}
            <div
              role="tablist"
              aria-label="How it works steps"
              className="flex shrink-0 justify-start overflow-x-auto border-y border-hairline bg-header shadow-[0_0_25px_rgba(0,0,0,0.03)] [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden"
            >
              {steps.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => scrollToStep(i)}
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

            {/* Stage — teal backdrop fills the panel; the active diagram scales to fit. */}
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <MeshGradient variant="mesh-bright" className="absolute inset-0" />
              <OrbitRings className="top-[42%] left-[34%] w-[95%] -translate-x-1/2 -translate-y-1/2" />

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
      </div>

      {/* Bottom pad inside the rails so they run continuously into the next
          section, like a regular section's vertical padding. */}
      <div
        aria-hidden
        className="mx-auto h-20 w-full max-w-[1320px] border-x border-hairline sm:h-28"
      />
    </section>
  );
}
