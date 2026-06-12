"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { HERO_CONTENT } from "@/content/hero";
import { EASE } from "@/components/concepts/shared/motion";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import { CYCLE, SCENES } from "@/components/concepts/hero-1/steps";
import { MarginCell } from "./margin-cell";
import { PanelStepper } from "./panel-stepper";

/** Figma's iso projection — one transform so the composition order is exact. */
const ISO_TRANSFORM = "rotate(-30deg) skewX(30deg) scaleY(0.87)";
/** Soft circular fade around the scene, in panel space (Figma 217:609). */
const MASK =
  "radial-gradient(circle var(--mask-r) at 600px 320px, #000 60%, transparent 100%)";
/** Center panel design space — the band's main row at the 1440 frame. */
const CANVAS = { w: 1200, h: 591 } as const;

/**
 * Hero-6's band (Figma 217:595): hero-1's iso step scenes restaged inside a
 * framed center panel — stepper, scene behind the circular fade, and caption
 * all live on a 1200×591 canvas scaled to the panel — flanked by decorated
 * 120px margin cells, over the half-gutter plinth strip. Steps auto-advance
 * every 2s or on scroll-down, looping forever (see useStepCycle).
 */
export function IsoPanelBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const reduce = useReducedMotion();
  const { index } = useStepCycle({ count: CYCLE.length, ref: bandRef });

  const activeId = CYCLE[index];
  const active = SCENES[activeId]!;
  const ActiveScene = active.Scene;

  useLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const measure = () => {
      const fit = Math.min(
        el.clientWidth / CANVAS.w,
        el.clientHeight > 0 ? el.clientHeight / CANVAS.h : 1,
      );
      setScale(Math.min(1, Math.max(0.42, fit)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={bandRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: reduce ? 0 : 0.2 }}
      className="relative z-10 flex min-h-[20rem] w-full flex-1 flex-col border-t border-band-border"
    >
      <div className="min-h-0 w-full flex-1 border-b border-band-border">
        <div className="relative mx-auto h-full w-full max-w-[90rem]">
          <MarginCell
            side="left"
            className="absolute inset-y-0 left-0 hidden w-[7.5rem] lg:block"
          />
          <MarginCell
            side="right"
            className="absolute inset-y-0 right-0 hidden w-[7.5rem] lg:block"
          />
          <div className="h-full px-6 md:px-12 lg:px-[7.5rem]">
            <div
              ref={panelRef}
              className="relative h-full overflow-hidden border-x border-t border-band-border bg-[#f9fafa] dark:bg-band"
            >
              {/* 1200×591 design canvas, scaled to the panel */}
              <div
                style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
                className="absolute top-1/2 left-1/2 h-[591px] w-[1200px]"
              >
                <motion.div
                  style={
                    {
                      "--mask-r": `${active.maskRadius}px`,
                      maskImage: MASK,
                      WebkitMaskImage: MASK,
                    } as CSSProperties
                  }
                  animate={{ "--mask-r": `${active.maskRadius}px` }}
                  transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
                  className="absolute inset-0"
                >
                  {/* Stage entrance, then AnimatePresence swaps scenes along the plane */}
                  <motion.div
                    initial={
                      reduce
                        ? { opacity: 0 }
                        : { opacity: 0, y: 32, filter: "blur(12px)" }
                    }
                    animate={
                      reduce
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, filter: "blur(0px)" }
                    }
                    transition={{
                      duration: reduce ? 0.35 : 0.7,
                      delay: reduce ? 0 : 0.45,
                      ease: EASE,
                    }}
                    className="absolute left-[309.34px] top-[-71.12px] flex h-[608.44px] w-[1053.84px] items-center justify-center"
                  >
                    <div
                      style={{ transform: ISO_TRANSFORM }}
                      className="relative h-[335.63px] w-[881.25px] flex-none"
                    >
                      <AnimatePresence initial={false}>
                        <ActiveScene key={activeId} />
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>

                <PanelStepper steps={HERO_CONTENT.steps} activeId={activeId} />

                {/* Right caption */}
                <motion.p
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : { opacity: 0, y: 16, filter: "blur(6px)" }
                  }
                  animate={
                    reduce
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, filter: "blur(0px)" }
                  }
                  transition={{
                    duration: 0.6,
                    delay: reduce ? 0 : 0.45,
                    ease: EASE,
                  }}
                  className="absolute left-[997px] top-[calc(50%-80px)] font-mono text-base font-medium uppercase leading-[2.5] text-foreground/60"
                >
                  {HERO_CONTENT.caption.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plinth strip: 70px tall, half-gutter inset, side rules only */}
      <div className="h-[4.375rem] w-full shrink-0">
        <div className="mx-auto h-full w-full max-w-[90rem] px-3 md:px-6 lg:px-[3.75rem]">
          <div className="h-full border-x border-band-border" />
        </div>
      </div>
    </motion.div>
  );
}
