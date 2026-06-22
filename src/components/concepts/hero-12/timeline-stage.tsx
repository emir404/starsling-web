"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { appearT, HIDE_T } from "@/components/concepts/shared/motion";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import { useCountUp } from "@/components/concepts/hero-9/use-count-up";
import { TimeBar } from "./lane";
import {
  BAR_H,
  BEAT,
  BEAT_MS,
  CANVAS,
  COLOR,
  fmtClock,
  GUTTER_X,
  LANE_H,
  LANES,
  LANES_BOTTOM,
  PARALLEL_RUN,
  PARALLEL_S,
  PARALLEL_X1,
  PLOT_X0,
  PLOT_X1,
  BRACKET_CAP,
  BRACKET_Y,
  SERIAL_RUN,
  SERIAL_S,
  SERIAL_Y,
  SAVED_S,
  STEP_COUNT,
} from "./timeline-data";

/** Below this the plane stops shrinking and the stage scrolls horizontally. */
const MIN_SCALE = 0.6;

/**
 * The time-collapse timeline stage: a fixed 1376×560 plane width-scaled to fill
 * the card. One serial suite bar fills slowly, then splits into five short shard
 * bars that sweep together; a wall-clock counts DOWN from 13M 20S → 1M 18S while
 * a "TIME SAVED" bracket spans the gap between the parallel and serial finishes.
 * Reduced motion pins to the `saved` payoff frame.
 */
export function TimelineStage({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);
  const reduce = useReducedMotion();
  const { index } = useStepCycle({ count: STEP_COUNT, intervals: BEAT_MS, ref: stageRef });
  const beat = reduce ? BEAT.saved : index;
  const reduceBool = !!reduce;

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageW(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const w = stageW || CANVAS.w;
  const scale = Math.min(1, Math.max(MIN_SCALE, w / CANVAS.w));

  // Big clock: holds at the serial time, then collapses to the parallel time.
  const clock = useCountUp(PARALLEL_S, {
    active: beat >= BEAT.saved,
    settled: beat >= BEAT.hold,
    reduce: reduceBool,
    from: SERIAL_S,
    duration: 1.5,
  });
  const collapsed = beat >= BEAT.saved;

  return (
    <div
      ref={stageRef}
      className={cn("relative overflow-x-auto overflow-y-hidden", className)}
      style={{ height: CANVAS.h * scale, touchAction: "pan-x" }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: reduce ? 0 : 0.25 }}
        className="relative mx-auto overflow-hidden"
        style={{ width: CANVAS.w * scale, height: CANVAS.h * scale }}
      >
        <div
          className="absolute left-0 top-0"
          style={{
            width: CANVAS.w,
            height: CANVAS.h,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* big wall-clock readout — counts down as the suite collapses */}
          <div
            className="absolute flex flex-col items-center gap-1 text-center"
            style={{ left: CANVAS.w / 2 - 200, top: 16, width: 400 }}
          >
            <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-white/45">
              Wall-clock time
            </span>
            <span
              className="font-mono text-[46px] leading-none font-bold tabular-nums"
              style={{ color: collapsed ? COLOR.captionTeal : "rgba(255,255,255,0.85)" }}
            >
              {fmtClock(clock)}
            </span>
          </div>

          {/* row labels */}
          <RowLabel y={SERIAL_Y} h={BAR_H} shown={beat >= BEAT.serial} delay={0.05} reduce={reduceBool}>
            TEST SUITE
          </RowLabel>
          {LANES.map((lane, i) => (
            <RowLabel
              key={lane.id}
              y={lane.y}
              h={LANE_H}
              shown={beat >= BEAT.split}
              delay={0.1 + i * 0.08}
              reduce={reduceBool}
            >
              {`SHARD ${i + 1}`}
            </RowLabel>
          ))}

          {/* serial suite bar — long, fills slowly */}
          <TimeBar
            x={PLOT_X0}
            y={SERIAL_Y}
            width={PLOT_X1 - PLOT_X0}
            height={BAR_H}
            shown={beat >= BEAT.serial}
            enterDelay={0.1}
            fill={{ active: beat >= BEAT.serial, delay: 0.3, duration: SERIAL_RUN }}
            reduce={reduceBool}
          />

          {/* parallel shard bars — short, all sweep together */}
          {LANES.map((lane, i) => (
            <TimeBar
              key={lane.id}
              x={PLOT_X0}
              y={lane.y}
              width={PARALLEL_X1 - PLOT_X0}
              height={LANE_H}
              shown={beat >= BEAT.split}
              enterDelay={0.1 + i * 0.08}
              fill={{ active: beat >= BEAT.parallel, delay: 0.15, duration: PARALLEL_RUN }}
              accent
              reduce={reduceBool}
            />
          ))}

          {/* finish guides + time-saved bracket */}
          <svg
            aria-hidden
            viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
            fill="none"
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
          >
            {/* serial finish guide (end of the long bar) */}
            <motion.line
              x1={PLOT_X1}
              y1={SERIAL_Y - 14}
              x2={PLOT_X1}
              y2={LANES_BOTTOM + 8}
              stroke="rgba(215,234,237,0.22)"
              strokeWidth={1.5}
              strokeDasharray="4 5"
              initial={false}
              animate={{ opacity: beat >= BEAT.serial ? 1 : 0 }}
              transition={beat >= BEAT.serial ? appearT(reduceBool, 0.2, 0.4) : HIDE_T}
            />
            {/* parallel finish guide (where all shards end) */}
            <motion.line
              x1={PARALLEL_X1}
              y1={SERIAL_Y - 14}
              x2={PARALLEL_X1}
              y2={LANES_BOTTOM + 8}
              stroke={COLOR.captionTeal}
              strokeWidth={1.5}
              initial={false}
              animate={{ opacity: beat >= BEAT.parallel ? 0.9 : 0 }}
              transition={beat >= BEAT.parallel ? appearT(reduceBool, 0.1, 0.4) : HIDE_T}
            />
            {/* time-saved bracket spanning parallel-finish → serial-finish */}
            <motion.path
              d={`M ${PARALLEL_X1} ${BRACKET_Y - BRACKET_CAP} L ${PARALLEL_X1} ${BRACKET_Y} L ${PLOT_X1} ${BRACKET_Y} L ${PLOT_X1} ${BRACKET_Y - BRACKET_CAP}`}
              stroke="rgba(215,234,237,0.4)"
              strokeWidth={1.5}
              strokeLinejoin="miter"
              initial={false}
              animate={{ pathLength: beat >= BEAT.saved ? 1 : 0, opacity: beat >= BEAT.saved ? 1 : 0 }}
              transition={beat >= BEAT.saved ? appearT(reduceBool, 0, 0.6) : HIDE_T}
            />
          </svg>

          {/* parallel finish time tag */}
          <motion.div
            className="absolute font-mono text-[14px] font-bold uppercase tabular-nums"
            style={{ left: PARALLEL_X1 + 8, top: SERIAL_Y - 34, color: COLOR.captionTeal }}
            initial={false}
            animate={{ opacity: beat >= BEAT.parallel ? 1 : 0, y: beat >= BEAT.parallel ? 0 : 6 }}
            transition={beat >= BEAT.parallel ? appearT(reduceBool, 0.15, 0.4) : HIDE_T}
          >
            {fmtClock(PARALLEL_S)}
          </motion.div>

          {/* time-saved payoff under the bracket */}
          <motion.div
            className="absolute flex items-center justify-center gap-2 text-center"
            style={{ left: (PARALLEL_X1 + PLOT_X1) / 2 - 180, top: BRACKET_Y + 10, width: 360 }}
            initial={false}
            animate={{ opacity: beat >= BEAT.saved ? 1 : 0, y: beat >= BEAT.saved ? 0 : 8 }}
            transition={beat >= BEAT.saved ? appearT(reduceBool, 0.35, 0.5) : HIDE_T}
          >
            <span className="font-mono text-[15px] uppercase tracking-[0.04em] text-white/80">
              Time saved {fmtClock(SAVED_S)}
            </span>
            <span
              className="font-mono text-[15px] font-bold uppercase"
              style={{ color: COLOR.captionTeal }}
            >
              · 10× faster
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/** A mono row label in the left gutter, vertically centered on its bar. */
function RowLabel({
  y,
  h,
  shown,
  delay,
  reduce,
  children,
}: {
  y: number;
  h: number;
  shown: boolean;
  delay: number;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute flex items-center font-mono text-[13px] uppercase tracking-[0.04em] text-white/55"
      style={{ left: GUTTER_X, top: y, height: h, width: PLOT_X0 - GUTTER_X - 16 }}
      initial={false}
      animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -8 }}
      transition={shown ? appearT(reduce, delay, 0.45) : HIDE_T}
    >
      {children}
    </motion.div>
  );
}
