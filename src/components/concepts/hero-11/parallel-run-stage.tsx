"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/concepts/shared/motion";
import { Reveal } from "@/components/concepts/shared/reveal";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import {
  BEAT,
  BEAT_MS,
  BRACKET_1,
  BRACKET_2,
  CANVAS,
  CAPTION_1,
  CAPTION_2,
  EDGES_IN,
  EDGES_OUT,
  PARALLEL_NODES,
  PARALLEL_TITLE,
  RANDOM_NODE,
  REPORTS_NODE,
  STEP_COUNT,
  sceneOf,
  type ParallelSpec,
} from "./parallel-run-data";
import { TestNode } from "./test-node";
import { FanConnectors } from "./fan-connectors";
import { MeasureBracket } from "./measure-bracket";
import { SceneCaption, TimeSavedChip } from "./scene-caption";

/**
 * Minimum plane scale. Below this the graph stops shrinking and the stage
 * scrolls horizontally instead, so the 14px node labels stay legible on small
 * screens — matching hero-10's behavior.
 */
const MIN_SCALE = 0.72;

const NODE_HIDDEN = { opacity: 0, y: 14, scale: 0.97, filter: "blur(6px)" };

/**
 * The two-scene parallel-run stage: the fixed 1376×762 Figma plane width-scaled
 * to fill the framed panel (clamped to `MIN_SCALE`, horizontally scrollable
 * below it), with the beats driven by `useStepCycle`. The five parallel cards
 * persist across both scenes and slide 542 → 144, so they read as the *same*
 * jobs first being parallelized (scene 1) then feeding the report (scene 2).
 * Reduced motion pins to the scene-1 `timesaved` frame (parallelize + 1M 18S,
 * the primary value prop) with opacity-only reveals.
 */
export function ParallelRunStage({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(0);
  const reduce = useReducedMotion();
  const { index } = useStepCycle({
    count: STEP_COUNT,
    intervals: BEAT_MS,
    ref: stageRef,
  });
  const beat = reduce ? BEAT.timesaved : index;
  const reduceBool = !!reduce;
  const scene = sceneOf(beat);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setStageW(el.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // SSR/first paint falls back to design width (scale 1); corrected before paint.
  const w = stageW || CANVAS.w;
  const scale = Math.min(1, Math.max(MIN_SCALE, w / CANVAS.w));

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
          {/* connectors — behind every card */}
          <FanConnectors
            edges={EDGES_OUT}
            active={scene === 1 && beat >= BEAT.split}
            pulse={beat === BEAT.split}
            reduce={reduceBool}
          />
          <FanConnectors
            edges={EDGES_IN}
            active={beat >= BEAT.reports}
            pulse={beat === BEAT.reports}
            reduce={reduceBool}
          />

          {/* scene-1 source */}
          <Reveal
            shown={scene === 1}
            delay={0.05}
            reduce={reduceBool}
            hidden={NODE_HIDDEN}
            style={{
              left: RANDOM_NODE.x,
              top: RANDOM_NODE.y,
              width: RANDOM_NODE.w,
              height: RANDOM_NODE.h,
            }}
          >
            <TestNode title={RANDOM_NODE.title} pairs={RANDOM_NODE.pairs} ports={{ right: true }} />
          </Reveal>

          {/* the five parallel cards — persistent, slide 542 → 144 */}
          {PARALLEL_NODES.map((card, i) => (
            <ParallelCard
              key={card.id}
              card={card}
              scene={scene}
              shown={beat >= BEAT.split}
              index={i}
              reduce={reduceBool}
            />
          ))}

          {/* scene-2 sink — rows fill in as the report is written */}
          <Reveal
            shown={beat >= BEAT.reports}
            delay={0.05}
            reduce={reduceBool}
            hidden={NODE_HIDDEN}
            style={{
              left: REPORTS_NODE.x,
              top: REPORTS_NODE.y,
              width: REPORTS_NODE.w,
              height: REPORTS_NODE.h,
            }}
          >
            <TestNode
              title={REPORTS_NODE.title}
              pairs={REPORTS_NODE.pairs}
              ports={{ left: true }}
              rowReveal={{ shown: beat >= BEAT.reports, reduce: reduceBool }}
            />
          </Reveal>

          {/* measurement brackets */}
          <MeasureBracket
            bracket={BRACKET_1}
            shown={scene === 1 && beat >= BEAT.timesaved}
            reduce={reduceBool}
          />
          <MeasureBracket
            bracket={BRACKET_2}
            shown={beat >= BEAT.memory}
            reduce={reduceBool}
          />

          {/* captions + payoff chip */}
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: scene === 1 ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
          >
            <SceneCaption caption={CAPTION_1} beat={beat} reduce={reduceBool} />
            <TimeSavedChip beat={beat} reduce={reduceBool} />
          </motion.div>
          <SceneCaption caption={CAPTION_2} beat={beat} reduce={reduceBool} />
        </div>
      </motion.div>
    </div>
  );
}

/**
 * One parallel test card. Rendered once and kept mounted across both scenes; its
 * `left` animates between the scene-1 fan-out position and the scene-2 fan-in
 * position (the core "same jobs" narrative motion), while opacity/scale/blur
 * handle the staggered entrance at the `split` beat.
 */
function ParallelCard({
  card,
  scene,
  shown,
  index,
  reduce,
}: {
  card: ParallelSpec;
  scene: 1 | 2;
  shown: boolean;
  index: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ top: card.y, width: card.w, height: card.h }}
      initial={false}
      animate={{
        left: scene === 1 ? card.scene1X : card.scene2X,
        opacity: shown ? 1 : 0,
        scale: shown ? 1 : 0.97,
        filter: shown ? "blur(0px)" : "blur(6px)",
      }}
      transition={{
        left: { duration: reduce ? 0 : 0.6, ease: EASE },
        default: reduce
          ? { duration: 0.3 }
          : { duration: 0.5, ease: EASE, delay: shown ? 0.05 + index * 0.07 : 0 },
      }}
    >
      <TestNode
        title={PARALLEL_TITLE}
        pairs={1}
        ports={scene === 1 ? { left: true } : { left: true, right: true }}
      />
    </motion.div>
  );
}
