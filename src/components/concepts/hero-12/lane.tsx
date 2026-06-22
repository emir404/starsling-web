"use client";

import { motion } from "motion/react";

import { appearT, EASE, HIDE_T } from "@/components/concepts/shared/motion";
import { COLOR } from "./timeline-data";

/**
 * One duration bar on the timeline: a faint track whose WIDTH encodes how long
 * the job takes (the serial suite is long; each parallel shard is short), with a
 * progress fill that sweeps left→right while it "runs". The length contrast
 * between the one serial bar and the five short shard bars is the whole story;
 * the fill adds the live run. Positioned in canvas space by the stage.
 */
export function TimeBar({
  x,
  y,
  width,
  height,
  shown,
  enterDelay,
  fill,
  accent,
  reduce,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  shown: boolean;
  enterDelay: number;
  fill?: { active: boolean; delay: number; duration: number };
  accent?: boolean;
  reduce: boolean;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, width, height, background: COLOR.cell }}
      initial={false}
      animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 10 }}
      transition={shown ? appearT(reduce, enterDelay, 0.5) : HIDE_T}
    >
      {fill && (
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left"
          style={{ background: accent ? COLOR.captionTeal : COLOR.teal }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: fill.active ? 1 : 0 }}
          transition={
            fill.active
              ? { duration: reduce ? 0 : fill.duration, ease: EASE, delay: reduce ? 0 : fill.delay }
              : { duration: 0.2 }
          }
        />
      )}
    </motion.div>
  );
}
