"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import type { HeroContent, HeroStepId } from "@/types/content";
import { EASE } from "@/components/concepts/shared/motion";

/** Band-space x where the list starts (Figma 198:3581). */
const LIST_LEFT = 140;
/** Gap between the active label and the connector line (Figma: line at 198/230). */
const LABEL_LINE_GAP = 12;
/** Geist Mono advance ≈ 0.6em at 16px — fallback until refs/fonts resolve. */
const estimateWidth = (label: string) => label.length * 9.6;

/**
 * Pipeline stepper: the list slides so the active row stays on the fixed
 * connector line (Figma: list y 320 → 279 between steps, line constant at
 * y≈332–346 ending at x=466). The connector's right end tracks the scaled
 * scene via the `--scene-s` variable set by the band.
 */
export function Stepper({
  steps,
  activeId,
}: {
  steps: HeroContent["steps"];
  activeId: HeroStepId;
}) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<number[]>([]);

  const activeRow = Math.max(
    0,
    steps.findIndex((step) => step.id === activeId),
  );

  useLayoutEffect(() => {
    const measure = () =>
      setWidths(labelRefs.current.map((el) => el?.offsetWidth ?? 0));
    measure();
    document.fonts?.ready.then(measure);
    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [steps]);

  const lineLeft =
    LIST_LEFT +
    (widths[activeRow] || estimateWidth(steps[activeRow].label)) +
    LABEL_LINE_GAP;

  return (
    <>
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, filter: "blur(6px)" }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: reduce ? 0 : 0.35, ease: EASE }}
        className="absolute left-6 top-6 md:left-[8.75rem] md:top-[calc(50%-80px)]"
      >
        <motion.ul
          ref={listRef}
          animate={{ y: `${(-activeRow * 100) / steps.length}%` }}
          transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
        >
          {steps.map((step, i) => (
            <motion.li
              key={step.id}
              animate={{ opacity: i === activeRow ? 1 : 0.6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex h-7 items-center font-mono text-xs font-medium uppercase text-foreground md:h-10 md:text-base dark:[text-shadow:0_4px_4px_rgba(0,0,0,0.25)]"
            >
              <span
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
              >
                {step.label}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      {/* Connector line + end tick, from the active label to the scene edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, left: lineLeft }}
        transition={{
          opacity: { duration: 0.6, delay: reduce ? 0 : 0.35 },
          left: { duration: reduce ? 0 : 0.5, ease: EASE },
        }}
        style={{ right: "calc(50% + 254px * var(--scene-s, 1))" }}
        className="absolute top-[calc(50%-68px)] hidden h-[14px] md:block"
      >
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-foreground/60" />
        <div className="absolute right-0 top-0 h-full w-px bg-foreground/60" />
      </motion.div>
    </>
  );
}
