"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { Hourglass } from "lucide-react";

import { cn } from "@/lib/utils";
import { EASE, appearT, HIDE_T } from "@/components/concepts/shared/motion";
import { Reveal } from "@/components/concepts/shared/reveal";
import { useStepCycle } from "@/components/concepts/shared/use-step-cycle";
import { RunCard } from "./run-card";
import { ForkConnectors } from "./run-compare-connector";
import {
  BADGE_TEXT,
  BEAT,
  BEAT_MS,
  BOT_TEXT,
  CANVAS,
  COLOR,
  FOOTER,
  FORK_EDGES,
  NEW_CARD_A,
  NEW_CARD_B,
  NEW_SOURCE_TOTAL,
  NEW_TIMER_A,
  NEW_TIMER_B,
  NEW_TOTAL,
  OLD_CARD,
  OLD_TIMER,
  OLD_TOTAL,
  PRS_TEXT,
  RACE_ELAPSED,
  RUNS_ON_NEW,
  RUNS_ON_OLD,
  SHARDS,
  SHARD_RUN_MAX,
  SHARD_TIMERS,
  SHARD_TOTALS,
  STEP_COUNT,
  TOP_SLOT,
  WHY_TEXT,
  fmtRunTime,
  sceneOf,
  type Rect,
} from "./run-compare-data";

const NODE_HIDDEN = { opacity: 0, y: 14, scale: 0.97, filter: "blur(6px)" };
const NODE_VISIBLE = { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" };

/** Card tab sets (the long status labels straddle the card's top edge). */
const OLD_TABS = [
  { label: "E2E TESTS", tone: "neutral" as const },
  { label: "OLD HARDWARE + JOB QUEUE", tone: "amber" as const },
];
const NEW_TABS = [
  { label: "E2E TESTS", tone: "neutral" as const },
  { label: "NEW HARDWARE + UNLIMITED CONCURRENCY", tone: "cyan" as const },
];
const shardTabs = (i: number) => [{ label: `SHARD ${i + 1}/3`, tone: "neutral" as const }];

function rectStyle(r: Rect): CSSProperties {
  return { left: r.x, top: r.y, width: r.w, height: r.h };
}

/**
 * The live compare/shard stage. Two sped-up wall clocks drive it: `elapsedA` (the
 * Scene-A race — both bars + timers tick on the same time base so Starsling
 * visibly wins) and `elapsedB` (the Scene-B shards filling in parallel). Desktop
 * renders the fixed CANVAS plane, *contain*-scaled to the dark panel on both axes;
 * mobile renders a stacked recap. `useStepCycle` drives the high-level beats;
 * reduced motion pins to the post-race highlight frame.
 */
export function RunCompareStage({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const reduce = useReducedMotion();
  const reduceBool = !!reduce;
  const { index } = useStepCycle({
    count: STEP_COUNT,
    intervals: BEAT_MS,
    ref: stageRef,
  });
  const beat = reduce ? BEAT.badge : index;
  const scene = sceneOf(beat);

  // Sped-up wall clocks (simulated seconds). Bars/timers derive from these.
  const elapsedA = useMotionValue(0);
  const elapsedB = useMotionValue(0);

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Race clock — ease elapsedA to each Scene-A beat's target (linear, so both
  // cards share a true wall time). Starsling completes at the raceRun target
  // (NEW_TOTAL); the clock then creeps so the regular runner keeps ticking.
  useEffect(() => {
    if (reduce) {
      elapsedA.set(NEW_TOTAL);
      return;
    }
    if (scene !== "A") return; // frozen during Scene B; resets next loop
    if (beat === BEAT.raceRun) elapsedA.set(0);
    const controls = animate(elapsedA, RACE_ELAPSED[beat], {
      duration: BEAT_MS[beat] / 1000,
      ease: "linear",
    });
    return () => controls.stop();
  }, [beat, scene, reduce, elapsedA]);

  // Shard clock — fill 0 → slowest-shard total during shardsRun (parallel runs).
  useEffect(() => {
    if (reduce) {
      elapsedB.set(SHARD_RUN_MAX);
      return;
    }
    if (scene !== "B") {
      elapsedB.set(0);
      return;
    }
    if (beat === BEAT.shardsRun) {
      elapsedB.set(0);
      const controls = animate(elapsedB, SHARD_RUN_MAX, {
        duration: BEAT_MS[beat] / 1000,
        ease: "linear",
      });
      return () => controls.stop();
    }
    if (beat < BEAT.shardsRun) elapsedB.set(0);
    return;
  }, [beat, scene, reduce, elapsedB]);

  // SSR/first paint: box is 0 → scale 1 (design size); useLayoutEffect corrects
  // it before paint. CONTAIN fit — bounded on both axes, so it can't overflow.
  const w = box.w || CANVAS.w;
  const h = box.h || CANVAS.h;
  const scale = Math.min(1, w / CANVAS.w, h / CANVAS.h);

  // Live progress (0–1) for the two race cards.
  const oldProgress = useTransform(elapsedA, (e) => Math.min(1, e / OLD_TOTAL));
  const newProgressA = useTransform(elapsedA, (e) => Math.min(1, e / NEW_TOTAL));

  return (
    <div ref={stageRef} className={cn("relative", className)}>
      {/* ---------- desktop: contain-scaled CANVAS plane ---------- */}
      <div className="absolute inset-0 hidden overflow-hidden lg:block">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.25 }}
        >
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              width: CANVAS.w,
              height: CANVAS.h,
              transform: `translate(-50%, -50%) scale(${scale})`,
              transformOrigin: "center",
            }}
          >
            {/* fork — behind the cards */}
            <ForkConnectors
              edges={FORK_EDGES}
              active={scene === "B" && beat >= BEAT.forkDraw}
              pulse={beat === BEAT.forkDraw}
              reduce={reduceBool}
            />

            {/* top-center chip slot — race badge, then Scene-B title */}
            <CenterReveal
              cx={TOP_SLOT.cx}
              top={TOP_SLOT.top}
              shown={scene === "A" && beat >= BEAT.badge}
              delay={0.05}
              reduce={reduceBool}
            >
              <PanelChip bg={COLOR.cyanTab} color={COLOR.cyanAccent}>
                {BADGE_TEXT}
              </PanelChip>
            </CenterReveal>
            <CenterReveal
              cx={TOP_SLOT.cx}
              top={TOP_SLOT.top}
              shown={scene === "B"}
              delay={0.05}
              reduce={reduceBool}
            >
              <PanelChip bg={COLOR.node} color={COLOR.whiteLabel}>
                {WHY_TEXT}
              </PanelChip>
            </CenterReveal>

            {/* Scene A — regular-CI card (live, amber) */}
            <Reveal
              shown={scene === "A"}
              delay={0.05}
              reduce={reduceBool}
              hidden={NODE_HIDDEN}
              style={rectStyle(OLD_CARD)}
            >
              <RunCard
                topTabs={OLD_TABS}
                runsOn={RUNS_ON_OLD}
                runsOnTone="amber"
                progress={oldProgress}
                fillTone="amber"
              />
            </Reveal>

            {/* shared Starsling card — persists, slides Scene-A → Scene-B */}
            <motion.div
              className="absolute"
              style={{ width: NEW_CARD_A.w, height: NEW_CARD_A.h }}
              initial={false}
              animate={{
                left: scene === "A" ? NEW_CARD_A.x : NEW_CARD_B.x,
                top: scene === "A" ? NEW_CARD_A.y : NEW_CARD_B.y,
              }}
              transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
            >
              <RunCard
                topTabs={NEW_TABS}
                runsOn={RUNS_ON_NEW}
                runsOnTone="cyan"
                progress={scene === "A" ? newProgressA : 1}
                fillTone="cyan"
                ports={scene === "B" ? { right: true } : undefined}
              />
            </motion.div>

            {/* Scene B — three shard cards (live) */}
            {SHARDS.map((shard, i) => (
              <ShardLive
                key={i}
                clock={elapsedB}
                total={SHARD_TOTALS[i]}
                index={i}
                shown={scene === "B" && beat >= BEAT.forkDraw}
                delay={0.1 + i * 0.08}
                reduce={reduceBool}
                rect={shard}
              />
            ))}

            {/* race timers — count live on the shared clock */}
            <CenterReveal
              cx={OLD_TIMER.cx}
              cy={OLD_TIMER.cy}
              shown={scene === "A"}
              delay={0.05}
              reduce={reduceBool}
            >
              <LiveTimer clock={elapsedA} total={OLD_TOTAL} />
            </CenterReveal>
            <CenterReveal
              cx={NEW_TIMER_A.cx}
              cy={NEW_TIMER_A.cy}
              shown={scene === "A"}
              delay={0.08}
              reduce={reduceBool}
            >
              <LiveTimer clock={elapsedA} total={NEW_TOTAL} />
            </CenterReveal>
            <CenterReveal
              cx={NEW_TIMER_B.cx}
              cy={NEW_TIMER_B.cy}
              shown={scene === "B"}
              delay={0.1}
              reduce={reduceBool}
            >
              <TimerChip time={fmtRunTime(NEW_SOURCE_TOTAL)} />
            </CenterReveal>

            {/* Scene B — small live timer chips to the right of each shard */}
            {SHARD_TIMERS.map((t, i) => (
              <CenterReveal
                key={i}
                cx={t.cx}
                cy={t.cy}
                shown={scene === "B" && beat >= BEAT.shardsRun}
                delay={0.15 + i * 0.08}
                reduce={reduceBool}
              >
                <LiveTimer clock={elapsedB} total={SHARD_TOTALS[i]} small />
              </CenterReveal>
            ))}

            {/* Scene B footer — @starsling-bot · AUTONOMOUS PRS */}
            <CenterReveal
              cx={FOOTER.cx}
              top={FOOTER.top}
              shown={scene === "B" && beat >= BEAT.shardsRun}
              delay={0.1}
              reduce={reduceBool}
            >
              <BotFooter />
            </CenterReveal>
          </div>
        </motion.div>
      </div>

      {/* ---------- mobile: stacked recap (legible; may scroll) ---------- */}
      <MobileStack scene={scene} reduce={reduceBool} />
    </div>
  );
}

/* ----------------------------------------------------------------- desktop bits */

/** A shard card whose bar fills off the shared shard clock. */
function ShardLive({
  clock,
  total,
  index,
  shown,
  delay,
  reduce,
  rect,
}: {
  clock: MotionValue<number>;
  total: number;
  index: number;
  shown: boolean;
  delay: number;
  reduce: boolean;
  rect: Rect;
}) {
  const progress = useTransform(clock, (e) => Math.min(1, e / total));
  return (
    <Reveal
      shown={shown}
      delay={delay}
      reduce={reduce}
      hidden={NODE_HIDDEN}
      style={rectStyle(rect)}
    >
      <RunCard
        topTabs={shardTabs(index)}
        runsOn={RUNS_ON_NEW}
        runsOnTone="cyan"
        progress={progress}
        fillTone="cyan"
        ports={{ left: true, right: true }}
      />
    </Reveal>
  );
}

/**
 * Hug-width element centered on a canvas anchor: the outer div carries the static
 * centering transform; the inner motion node owns the beat-driven appear/hide so
 * the two transforms never fight.
 */
function CenterReveal({
  cx,
  cy,
  top,
  shown,
  delay,
  reduce,
  children,
}: {
  cx: number;
  cy?: number;
  top?: number;
  shown: boolean;
  delay: number;
  reduce: boolean;
  children: ReactNode;
}) {
  const centered = cy !== undefined;
  return (
    <div
      className="absolute"
      style={{
        left: cx,
        top: centered ? cy : top,
        transform: centered ? "translate(-50%, -50%)" : "translateX(-50%)",
      }}
    >
      <motion.div
        initial={false}
        animate={shown ? NODE_VISIBLE : reduce ? { opacity: 0 } : NODE_HIDDEN}
        transition={shown ? appearT(reduce, delay) : HIDE_T}
      >
        {children}
      </motion.div>
    </div>
  );
}

function PanelChip({
  children,
  bg,
  color,
}: {
  children: ReactNode;
  bg: string;
  color: string;
}) {
  return (
    <div
      className="flex h-[60px] items-center justify-center px-8"
      style={{ background: bg }}
    >
      <span
        className="font-mono text-[20px] leading-none font-medium whitespace-nowrap uppercase"
        style={{ color }}
      >
        {children}
      </span>
    </div>
  );
}

/** Timer chip. `time` may be a live `MotionValue<string>` (renders without a React
 * re-render) or a static string. */
function TimerChip({
  time,
  small,
}: {
  time: string | MotionValue<string>;
  small?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center",
        small ? "gap-1.5 px-[10.5px] py-[9px]" : "gap-2 px-3.5 py-3",
      )}
      style={{ background: COLOR.node }}
    >
      <Hourglass
        className={small ? "size-[13.5px]" : "size-[18px]"}
        style={{ color: COLOR.whiteLabel }}
      />
      <motion.span
        className={cn(
          "font-mono leading-none uppercase tabular-nums",
          small ? "text-[12px]" : "text-[16px]",
        )}
        style={{ color: COLOR.whiteLabel }}
      >
        {time}
      </motion.span>
    </div>
  );
}

/** Drives a TimerChip's text from a clock, capped at the run's total (freeze). */
function LiveTimer({
  clock,
  total,
  small,
}: {
  clock: MotionValue<number>;
  total: number;
  small?: boolean;
}) {
  const text = useTransform(clock, (e) => fmtRunTime(Math.min(total, e)));
  return <TimerChip time={text} small={small} />;
}

function BotFooter() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="flex items-center px-3 py-2"
        style={{ background: COLOR.cyanTab }}
      >
        <span
          className="font-mono text-[12px] leading-none font-medium uppercase"
          style={{ color: COLOR.cyanAccent }}
        >
          {BOT_TEXT}
        </span>
      </div>
      <span
        className="font-mono text-[12px] leading-none font-medium uppercase"
        style={{ color: COLOR.whiteLabel }}
      >
        {PRS_TEXT}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ mobile bits */

/**
 * Mobile recap — a roomy vertical stack (the wide desktop fork can't shrink to a
 * phone legibly). Each card keeps the label *inside* (no straddling tab to collide
 * with neighbours), folds the timer into the header row, and runs a full-width
 * bar, so nothing overflows or crowds. Scene A is the hardware compare; Scene B is
 * the shard fan-out.
 */
function MobileStack({ scene, reduce }: { scene: "A" | "B"; reduce: boolean }) {
  const variants: Variants = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        enter: { opacity: 0, y: 16 },
        center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
        exit: { opacity: 0, y: -16, transition: { duration: 0.35, ease: EASE } },
      };

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:hidden">
      <AnimatePresence mode="wait" initial={false}>
        {scene === "A" ? (
          <motion.div
            key="A"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex w-full max-w-[21rem] flex-col items-stretch gap-5"
          >
            <MobileCard
              tag="E2E TESTS"
              label="OLD HARDWARE + JOB QUEUE"
              tone="amber"
              runsOn={RUNS_ON_OLD}
              progress={0.7}
              time={fmtRunTime(OLD_TOTAL)}
            />
            <MobileCard
              tag="E2E TESTS"
              label="NEW HARDWARE + UNLIMITED CONCURRENCY"
              tone="cyan"
              runsOn={RUNS_ON_NEW}
              progress={1}
              time={fmtRunTime(NEW_TOTAL)}
            />
            <MobileChip tone="cyan" className="mt-1 self-center">
              {BADGE_TEXT}
            </MobileChip>
          </motion.div>
        ) : (
          <motion.div
            key="B"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex w-full max-w-[21rem] flex-col items-stretch gap-4"
          >
            <MobileChip tone="neutral" className="mb-1 self-center">
              {WHY_TEXT}
            </MobileChip>
            <MobileCard
              tag="E2E TESTS"
              label="NEW HARDWARE + UNLIMITED CONCURRENCY"
              tone="cyan"
              runsOn={RUNS_ON_NEW}
              progress={1}
              time={fmtRunTime(NEW_SOURCE_TOTAL)}
            />
            <ForkTick />
            {[0, 1, 2].map((i) => (
              <MobileCard
                key={i}
                tag={`SHARD ${i + 1}/3`}
                tone="cyan"
                runsOn={RUNS_ON_NEW}
                progress={1}
                time={fmtRunTime(SHARD_TOTALS[i])}
              />
            ))}
            <MobileFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A self-contained mobile run card: label inside, timer in the header, full bar. */
function MobileCard({
  tag,
  label,
  tone,
  runsOn,
  progress,
  time,
}: {
  tag: string;
  label?: string;
  tone: "amber" | "cyan";
  runsOn: string;
  progress: number;
  time: string;
}) {
  const accent = tone === "amber" ? COLOR.amberValue : COLOR.cyanAccent;
  const value = tone === "amber" ? COLOR.amberValue : COLOR.cyanValue;
  const fill = tone === "amber" ? COLOR.amberFill : COLOR.cyanFill;
  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <div className="w-full px-4 py-3.5" style={{ background: COLOR.node }}>
      <div className="flex items-center justify-between gap-3">
        <span
          className="shrink-0 px-2 py-1 font-mono text-[11px] leading-none uppercase"
          style={{ background: COLOR.tab, color: COLOR.whiteLabel }}
        >
          {tag}
        </span>
        <span
          className="flex shrink-0 items-center gap-1.5 font-mono text-[12px] leading-none uppercase tabular-nums"
          style={{ color: COLOR.whiteLabel }}
        >
          <Hourglass className="size-3.5" />
          {time}
        </span>
      </div>
      {label && (
        <p
          className="mt-2.5 truncate font-mono text-[11px] leading-none uppercase"
          style={{ color: accent }}
        >
          {label}
        </p>
      )}
      <p className="mt-2.5 font-mono text-[12px] leading-none">
        <span style={{ color: COLOR.whiteLabel }}>runs-on: </span>
        <span style={{ color: value }}>{runsOn}</span>
      </p>
      <div
        className="mt-3 h-2.5 w-full overflow-hidden"
        style={{ background: COLOR.barTrack }}
      >
        <div className="h-full" style={{ width: `${pct}%`, background: fill }} />
      </div>
    </div>
  );
}

/** Short vertical tick implying the Scene-B fork (one job → parallel shards). */
function ForkTick() {
  return (
    <div
      className="-my-1 h-5 w-px self-center"
      style={{ background: COLOR.cyanFill, opacity: 0.5 }}
    />
  );
}

function MobileChip({
  children,
  tone,
  className,
}: {
  children: ReactNode;
  tone: "cyan" | "neutral";
  className?: string;
}) {
  const cyan = tone === "cyan";
  return (
    <div
      className={cn("px-4 py-2.5", className)}
      style={{ background: cyan ? COLOR.cyanTab : COLOR.node }}
    >
      <span
        className="font-mono text-[13px] leading-none font-medium uppercase"
        style={{ color: cyan ? COLOR.cyanAccent : COLOR.whiteLabel }}
      >
        {children}
      </span>
    </div>
  );
}

function MobileFooter() {
  return (
    <div className="mt-2 flex flex-col items-center gap-2">
      <div className="px-3 py-1.5" style={{ background: COLOR.cyanTab }}>
        <span
          className="font-mono text-[12px] leading-none font-medium uppercase"
          style={{ color: COLOR.cyanAccent }}
        >
          {BOT_TEXT}
        </span>
      </div>
      <span
        className="font-mono text-[12px] leading-none font-medium uppercase"
        style={{ color: COLOR.whiteLabel }}
      >
        {PRS_TEXT}
      </span>
    </div>
  );
}
