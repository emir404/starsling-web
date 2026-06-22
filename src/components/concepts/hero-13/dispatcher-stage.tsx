"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/concepts/shared/reveal";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import { TestNode } from "@/components/concepts/hero-11/test-node";
import { SpokeConnectors } from "./connectors";
import { DispatcherHub } from "./dispatcher-hub";
import {
  BEAT,
  BEAT_MS,
  CANVAS,
  CAPTIONS,
  COLOR,
  HUB,
  PAYOFF_TIME,
  RUNNER_H,
  RUNNER_W,
  RUNNERS,
  SPOKES,
  STEP_COUNT,
  SUITE,
  SUITE_SPOKE,
} from "./dispatcher-data";

const MIN_SCALE = 0.6;
const NODE_HIDDEN = { opacity: 0, y: 14, scale: 0.97, filter: "blur(6px)" };

/**
 * The self-driving dispatcher stage: a fixed 1376×700 plane width-scaled to fill
 * the card. A central autopilot hub reads the suite (left), then a radar sweep
 * fans spokes out to five runners (right) that execute in parallel. A per-beat
 * caption narrates the auto-split; reduced motion pins to the `done` frame.
 */
export function DispatcherStage({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);
  const reduce = useReducedMotion();
  const { index } = useStepCycle({ count: STEP_COUNT, intervals: BEAT_MS, ref: stageRef });
  const beat = reduce ? BEAT.done : index;
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
  const caption = CAPTIONS[Math.min(beat, CAPTIONS.length - 1)];

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
          {/* spokes — behind every card */}
          <SpokeConnectors spokes={[SUITE_SPOKE]} active={beat >= BEAT.ingest} reduce={reduceBool} />
          <SpokeConnectors spokes={SPOKES} active={beat >= BEAT.route} reduce={reduceBool} />

          {/* incoming test suite */}
          <Reveal
            shown={beat >= BEAT.ingest}
            delay={0.1}
            reduce={reduceBool}
            hidden={NODE_HIDDEN}
            style={{ left: SUITE.x, top: SUITE.y, width: SUITE.w, height: SUITE.h }}
          >
            <TestNode title={SUITE.title} pairs={SUITE.pairs} ports={{ right: true }} />
          </Reveal>

          {/* autopilot hub */}
          <DispatcherHub
            cx={HUB.cx}
            cy={HUB.cy}
            r={HUB.r}
            shown={beat >= BEAT.ingest}
            scanning={beat >= BEAT.route && beat <= BEAT.run}
            reduce={reduceBool}
          />

          {/* parallel runners — land at each spoke tip, then run together */}
          {RUNNERS.map((r, i) => (
            <Reveal
              key={r.id}
              shown={beat >= BEAT.route}
              delay={0.55 + i * 0.1}
              reduce={reduceBool}
              hidden={NODE_HIDDEN}
              style={{ left: r.x, top: r.y, width: RUNNER_W, height: RUNNER_H }}
            >
              <TestNode
                title={`SHARD ${i + 1}`}
                pairs={1}
                ports={{ left: true }}
                run={{ active: beat >= BEAT.run, delay: 0.2, duration: 0.8, reduce: reduceBool }}
              />
            </Reveal>
          ))}

          {/* per-beat caption under the hub */}
          <div
            className="absolute text-center"
            style={{ left: HUB.cx - 180, top: HUB.cy + HUB.r + 28, width: 360 }}
          >
            <motion.p
              key={Math.min(beat, CAPTIONS.length - 1)}
              className="font-mono text-[15px] uppercase leading-snug"
              style={{ color: beat >= BEAT.done ? COLOR.captionTeal : "rgba(255,255,255,0.8)" }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.4 }}
            >
              {caption}
            </motion.p>
          </div>

          {/* payoff chip */}
          <motion.div
            className="absolute flex items-center justify-center px-4 py-2"
            style={{
              left: HUB.cx - 90,
              top: HUB.cy + HUB.r + 78,
              width: 180,
              background: COLOR.chipBg,
            }}
            initial={false}
            animate={{
              opacity: beat >= BEAT.done ? 1 : 0,
              scale: beat >= BEAT.done ? 1 : 0.96,
              filter: beat >= BEAT.done ? "blur(0px)" : "blur(6px)",
            }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.15 }}
          >
            <span
              className="font-mono text-[26px] font-bold uppercase tabular-nums"
              style={{ color: COLOR.chipText, letterSpacing: "-0.02em" }}
            >
              {PAYOFF_TIME}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
