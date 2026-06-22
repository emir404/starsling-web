"use client";

import { motion } from "motion/react";

import { useCountUp } from "@/components/concepts/hero-9/use-count-up";
import { appearT } from "@/components/concepts/shared/motion";
import {
  BEAT,
  CHIP,
  COLOR,
  TIME_SAVED,
  fmtTimeSaved,
  type CaptionSpec,
} from "./parallel-run-data";

/**
 * The right-side caption block (Figma 282:1458 / 282:1660): mono uppercase copy
 * with teal-highlighted keywords, positioned in canvas space. Each paragraph
 * fades up as the run reaches its beat, so the copy narrates the animation
 * (SPLITS → PARALLEL/10X → TIME SAVED, then CREATES REPORTS → MEMORIES →
 * SELF-DRIVES) rather than dumping all at once.
 */
export function SceneCaption({
  caption,
  beat,
  reduce,
}: {
  caption: CaptionSpec;
  beat: number;
  reduce: boolean;
}) {
  return (
    <div
      className="absolute flex flex-col gap-[1.4em] font-mono text-[18px] leading-[1.4] uppercase text-white/80"
      style={{ left: caption.x, top: caption.y, width: caption.width }}
    >
      {caption.paragraphs.map((segments, i) => {
        const shown = beat >= caption.showBeats[i];
        return (
          <motion.p
            key={i}
            initial={false}
            animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 8 }}
            transition={
              shown
                ? appearT(reduce, caption.delays?.[i] ?? 0, 0.5)
                : { duration: 0.2 }
            }
          >
            {segments.map((seg, j) => (
              <span key={j} style={seg.teal ? { color: COLOR.captionTeal } : undefined}>
                {seg.t}
              </span>
            ))}
          </motion.p>
        );
      })}
    </div>
  );
}

/**
 * The scene-1 "TIME SAVED" payoff chip (Figma 282:1461): a translucent teal box
 * whose value counts up to 1m 18s as the bracket lands — the literal time/cost
 * win for a visitor shopping for a faster CI. Geist Mono bold, per the Figma.
 */
export function TimeSavedChip({ beat, reduce }: { beat: number; reduce: boolean }) {
  const shown = beat >= BEAT.timesaved;
  const seconds = useCountUp(TIME_SAVED, {
    active: shown,
    settled: beat >= BEAT.s1hold,
    reduce,
    duration: 1.3,
  });

  return (
    <motion.div
      className="absolute flex items-center px-4 py-3"
      style={{ left: CHIP.x, top: CHIP.y, width: CHIP.width, background: COLOR.chipBg }}
      initial={false}
      animate={{
        opacity: shown ? 1 : 0,
        scale: shown ? 1 : 0.96,
        filter: shown ? "blur(0px)" : "blur(6px)",
      }}
      transition={shown ? appearT(reduce, 0.35, 0.5) : { duration: 0.2 }}
    >
      <span
        className="font-mono text-[32px] font-bold uppercase tabular-nums"
        style={{ color: COLOR.chipText, letterSpacing: "-0.32px" }}
      >
        {fmtTimeSaved(seconds)}
      </span>
    </motion.div>
  );
}
