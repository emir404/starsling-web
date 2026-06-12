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
import { Orbits } from "./orbits";
import { Stepper } from "./stepper";
import { CYCLE, SCENES } from "./steps";
import { useStepCycle } from "./use-step-cycle";

/** Figma's iso projection — one transform so the composition order is exact. */
const ISO_TRANSFORM = "rotate(-30deg) skewX(30deg) scaleY(0.87)";
/** Soft circular fade around the scene (Figma "Ellipse 27", centered at 720,400). */
const MASK =
  "radial-gradient(circle var(--mask-r) at 720px 400px, #000 60%, transparent 100%)";

/**
 * Full-bleed illustration band (Figma 197:3574 / 199:3886): a fixed 1440×800
 * design canvas scaled to the container, holding the iso scene behind a
 * circular mask, with the stepper and caption outside the canvas so their
 * text stays crisp. Steps auto-advance every 2s or on scroll-down, looping
 * forever — see useStepCycle.
 */
export function IllustrationBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const reduce = useReducedMotion();
  const { index } = useStepCycle({ count: CYCLE.length, ref: bandRef });

  const activeId = CYCLE[index];
  const active = SCENES[activeId]!;
  const ActiveScene = active.Scene;

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () =>
      setScale(Math.min(1, Math.max(0.42, el.clientWidth / 1440)));
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
      className="relative w-full overflow-hidden border-y border-band-border bg-band"
    >
      <div
        ref={innerRef}
        style={{ "--scene-s": scale } as CSSProperties}
        className="relative mx-auto h-[min(50rem,55.56vw)] min-h-[26rem] w-full max-w-[90rem]"
      >
        {/* 1440×800 design canvas, scaled to the container width */}
        <div
          aria-hidden
          style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
          className="absolute left-1/2 top-1/2 h-[800px] w-[1440px]"
        >
          <Orbits />
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
              className="absolute left-[429.34px] top-[-14.63px] flex h-[608.44px] w-[1053.84px] items-center justify-center"
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
        </div>

        <Stepper steps={HERO_CONTENT.steps} activeId={activeId} />

        {/* Right caption */}
        <motion.p
          initial={
            reduce ? { opacity: 0 } : { opacity: 0, y: 16, filter: "blur(6px)" }
          }
          animate={
            reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
          }
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.45, ease: EASE }}
          className="absolute right-[8.75rem] top-[calc(50%-5rem)] hidden font-mono text-base font-medium uppercase leading-[2.5] text-foreground/60 md:block dark:[text-shadow:0_4px_4px_rgba(0,0,0,0.25)]"
        >
          {HERO_CONTENT.caption.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.p>
      </div>
    </motion.div>
  );
}
