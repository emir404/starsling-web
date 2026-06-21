"use client";

import { motion } from "motion/react";

import { appearT } from "@/components/concepts/shared/motion";
import { COLOR } from "./parallel-run-data";

/**
 * The CI job card shared by every node in the diagram (Figma 282:1421 etc.): a
 * dark body with a title tab straddling its top edge, `pairs` content rows (each
 * a 32px bar above a 22px bar) and optional 12px input/output port squares on
 * its left/right edges. Pure presentation, sized to fill its (absolutely
 * positioned, animated) wrapper — the stage owns placement + motion.
 *
 * Mirrors hero-10's node cards 1:1 (same `#374244` body / `#283436` tab /
 * `#3e4a4c` bars), generalized so RANDOM TEST + the parallel cards (`pairs=1`)
 * and TEST REPORTS (`pairs=5`) all render from one component. Pass `rowReveal`
 * to make the rows sweep in one-by-one as the report is "written".
 */
export function TestNode({
  title,
  pairs = 1,
  ports,
  rowReveal,
}: {
  title: string;
  pairs?: number;
  ports?: { left?: boolean; right?: boolean };
  rowReveal?: { shown: boolean; reduce: boolean };
}) {
  const bars = Array.from({ length: pairs }, (_, i) => [
    { key: `${i}a`, h: "h-8" },
    { key: `${i}b`, h: "h-[22px]" },
  ]).flat();

  return (
    <div
      className="relative flex size-full flex-col gap-2 px-2 pt-6 pb-3"
      style={{ background: COLOR.node, boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}
    >
      {/* title tab — straddles the top edge, width hugs the label */}
      <div
        className="absolute -top-4 left-2 flex h-8 items-center overflow-hidden px-2"
        style={{ background: COLOR.tab }}
      >
        <span className="font-mono text-[14px] leading-none whitespace-nowrap text-white/80 uppercase">
          {title}
        </span>
      </div>

      {/* content rows — flat list so the parent's 8px gap gives a uniform
          rhythm of (32px bar, 22px bar) × pairs */}
      {bars.map((b, i) => (
        <Bar key={b.key} h={b.h} index={i} reveal={rowReveal} />
      ))}

      {ports?.left && <Port className="-left-2" />}
      {ports?.right && <Port className="-right-2" />}
    </div>
  );
}

const BAR_STYLE = {
  background: COLOR.cell,
  boxShadow: "0 0 6.4px rgba(0,0,0,0.05)",
};

function Bar({
  h,
  index,
  reveal,
}: {
  h: string;
  index: number;
  reveal?: { shown: boolean; reduce: boolean };
}) {
  if (!reveal) {
    return <div className={`w-full shrink-0 ${h}`} style={BAR_STYLE} />;
  }
  return (
    <motion.div
      className={`w-full shrink-0 origin-left ${h}`}
      style={BAR_STYLE}
      initial={false}
      animate={{ opacity: reveal.shown ? 1 : 0, scaleX: reveal.shown ? 1 : 0.5 }}
      transition={
        reveal.shown
          ? appearT(reveal.reduce, 0.15 + index * 0.07, 0.4)
          : { duration: 0.2 }
      }
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
