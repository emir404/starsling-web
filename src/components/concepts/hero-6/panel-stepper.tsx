"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import type { HeroContent, HeroStepId } from "@/types/content";
import { EASE } from "@/components/concepts/shared/motion";

/** Panel-space x where the list starts (Figma 217:607). */
const LIST_LEFT = 84;
/** Gap between the active label and the connector line. */
const LABEL_LINE_GAP = 12;
/** Panel-space x where the connector meets the scene's edge (Figma 217:608). */
const LINE_RIGHT = 410;
/** Geist Mono advance ≈ 0.6em at 16px — fallback until refs/fonts resolve. */
const estimateWidth = (label: string) => label.length * 9.6;

/**
 * Hero-1's pipeline stepper restaged in panel space (Figma 217:607/608): the
 * whole 1200×591 canvas scales, so positions are plain canvas pixels — the
 * list slides to keep the active row on the fixed connector line, whose right
 * end sits at the scene's edge.
 */
export function PanelStepper({
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
        className="absolute left-[84px] top-[calc(50%-80px)]"
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
              className="flex h-10 items-center font-mono text-base font-medium uppercase text-foreground"
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
        style={{ right: 1200 - LINE_RIGHT }}
        className="absolute top-[calc(50%-66px)] h-[14px]"
      >
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-foreground/60" />
        <div className="absolute right-0 top-0 h-full w-px bg-foreground/60" />
      </motion.div>
    </>
  );
}
