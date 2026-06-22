"use client";

import { motion } from "motion/react";

import { EASE } from "@/components/concepts/shared/motion";
import { RadarPing } from "@/components/shared/blueprint-strip";
import { COLOR } from "./dispatcher-data";

/**
 * The central StarSling AUTOPILOT hub: concentric radar rings (reused `RadarPing`
 * glyph) that gently pulse while live, a sweep line that rotates around the
 * center while `scanning` (the "self-driving" read), and a labeled core. Sits in
 * canvas space; the stage owns placement and beat gating.
 */
export function DispatcherHub({
  cx,
  cy,
  r,
  shown,
  scanning,
  reduce,
}: {
  cx: number;
  cy: number;
  r: number;
  shown: boolean;
  scanning: boolean;
  reduce: boolean;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ left: cx - r, top: cy - r, width: 2 * r, height: 2 * r }}
      initial={false}
      animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 0.8 }}
      transition={shown ? { duration: reduce ? 0 : 0.6, ease: EASE } : { duration: 0.3 }}
    >
      {/* pulsing radar rings */}
      <motion.div
        className="absolute inset-0"
        style={{ color: COLOR.teal }}
        animate={reduce ? {} : { scale: [1, 1.05, 1], opacity: [0.9, 0.6, 0.9] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <RadarPing className="size-full" />
      </motion.div>

      {/* rotating scan sweep — a point at center spinning a gradient spoke */}
      {scanning && !reduce && (
        <motion.div
          className="absolute left-1/2 top-1/2"
          style={{ width: 0, height: 0 }}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.6, ease: "linear", repeat: Infinity }}
        >
          <div
            className="absolute h-[2px] origin-left"
            style={{
              top: -1,
              left: 0,
              width: r,
              background: `linear-gradient(to right, ${COLOR.captionTeal}, transparent)`,
            }}
          />
        </motion.div>
      )}

      {/* core label */}
      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 px-3 py-2 text-center"
        style={{ background: COLOR.tab }}
      >
        <span className="font-mono text-[13px] font-bold uppercase leading-none text-white">
          StarSling
        </span>
        <span
          className="font-mono text-[10px] uppercase leading-none tracking-[0.08em]"
          style={{ color: COLOR.captionTeal }}
        >
          Autopilot
        </span>
      </div>
    </motion.div>
  );
}
