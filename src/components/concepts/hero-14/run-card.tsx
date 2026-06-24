"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

import { COLOR, type Tone } from "./run-compare-data";

/**
 * The run card shared by every node in the hero-14 diagram (Figma 342:1165 etc.):
 * a dark body with one or two title tabs straddling its top edge, a lowercase
 * `runs-on:` line, and a single progress bar. The bar tracks a **live progress**
 * value (0–1) — a `MotionValue` that the stage's sped-up wall clock drives, so the
 * fill advances like a real run rather than snapping to a target. A plain number
 * is also accepted for static contexts (mobile recap).
 */
const TAB_TONE: Record<Tone, { bg: string; color: string }> = {
  neutral: { bg: COLOR.tab, color: COLOR.whiteLabel },
  amber: { bg: COLOR.amberTab, color: COLOR.amberValue },
  cyan: { bg: COLOR.cyanTab, color: COLOR.cyanAccent },
};

const clamp01 = (p: number) => Math.max(0, Math.min(1, p));

export function RunCard({
  topTabs,
  runsOn,
  runsOnTone,
  progress,
  fillTone,
  ports,
}: {
  topTabs: { label: string; tone: Tone }[];
  runsOn: string;
  runsOnTone: "amber" | "cyan";
  progress: MotionValue<number> | number;
  fillTone: "amber" | "cyan";
  ports?: { left?: boolean; right?: boolean };
}) {
  const valueColor = runsOnTone === "amber" ? COLOR.amberValue : COLOR.cyanValue;
  const fillColor = fillTone === "amber" ? COLOR.amberFill : COLOR.cyanFill;

  return (
    <div
      className="relative flex size-full flex-col px-2 pt-[31px] pb-2"
      style={{ background: COLOR.node, boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}
    >
      {/* title tabs — straddle the top edge (−15px), each width-hugging its label */}
      <div className="absolute -top-[15px] left-2 flex gap-1">
        {topTabs.map((tab) => (
          <div
            key={tab.label}
            className="flex h-8 items-center overflow-hidden px-2"
            style={{ background: TAB_TONE[tab.tone].bg }}
          >
            <span
              className="font-mono text-[14px] leading-none whitespace-nowrap uppercase"
              style={{ color: TAB_TONE[tab.tone].color }}
            >
              {tab.label}
            </span>
          </div>
        ))}
      </div>

      {/* runs-on: <value> — lowercase code line, indented to 16px like the Figma */}
      <p className="pl-2 font-mono text-[14px] leading-none whitespace-nowrap">
        <span style={{ color: COLOR.whiteLabel }}>runs-on: </span>
        <span style={{ color: valueColor }}>{runsOn}</span>
      </p>

      {/* progress bar — track + a live fill driven by the run's progress value */}
      <div
        className="relative mt-auto h-[14px] w-full overflow-hidden"
        style={{ background: COLOR.barTrack }}
      >
        {typeof progress === "number" ? (
          <div
            className="absolute inset-y-0 left-0"
            style={{ width: `${clamp01(progress) * 100}%`, background: fillColor }}
          />
        ) : (
          <LiveFill progress={progress} color={fillColor} />
        )}
      </div>

      {ports?.left && <Port className="-left-2" />}
      {ports?.right && <Port className="-right-2" />}
    </div>
  );
}

/** Bar fill bound to a 0–1 progress motion value (no React re-render per frame). */
function LiveFill({
  progress,
  color,
}: {
  progress: MotionValue<number>;
  color: string;
}) {
  const width = useTransform(progress, (p) => `${clamp01(p) * 100}%`);
  return (
    <motion.div
      className="absolute inset-y-0 left-0"
      style={{ width, background: color }}
    />
  );
}

function Port({ className }: { className: string }) {
  return (
    <div
      className={`absolute top-1/2 size-3 -translate-y-1/2 ${className}`}
      style={{ background: COLOR.tab, boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}
    />
  );
}
