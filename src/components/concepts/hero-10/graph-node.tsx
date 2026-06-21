"use client";

import { Marker } from "@/components/concepts/hero-4/runners-panel";
import { Reveal } from "@/components/concepts/shared/reveal";
import { BEAT, COLOR, GATE_NODE, SINGLE_NODE } from "./ci-run-data";

/**
 * The single test node (Figma 246:453): a dark body with a title tab and one
 * centered agent cell. Appears with the other sources at fanout, ticks at the
 * ticking beat.
 */
export function SingleNode({ step, reduce }: { step: number; reduce: boolean }) {
  const node = SINGLE_NODE;
  const shown = step >= BEAT.fanout;
  const ticked = step >= BEAT.ticking;

  return (
    <Reveal
      shown={shown}
      delay={0.05 + node.order * 0.28}
      reduce={reduce}
      hidden={{ opacity: 0, y: 14, scale: 0.97, filter: "blur(6px)" }}
      style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
    >
      <div className="relative size-full" style={{ background: COLOR.node }}>
        <div
          className="absolute -top-4 left-2 flex h-8 items-center px-2"
          style={{ background: COLOR.tab }}
        >
          <span className="font-mono text-[14px] leading-none whitespace-nowrap text-white/80 uppercase">
            {node.title}
          </span>
        </div>
        <div
          className="absolute -right-2 size-3 -translate-y-1/2"
          style={{ background: COLOR.tab, top: node.out.y - node.y }}
        />
        <div className="grid size-full place-items-center pt-1">
          <div
            className="grid size-8 place-items-center"
            style={{ background: COLOR.cell }}
          >
            <Marker
              shown={shown}
              ticked={ticked}
              done={false}
              delay={0.12}
              tickDelay={node.order * 0.2}
              reduce={reduce}
            />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * The merge-gate sink (Figma 246:511): a solid teal bar with "e2e" / "merge
 * gate" labels and a bright input port on its left edge. Reveals at the connect
 * beat as the three branches converge on it.
 */
export function GateNode({ step, reduce }: { step: number; reduce: boolean }) {
  const node = GATE_NODE;
  const shown = step >= BEAT.connect;

  return (
    <Reveal
      shown={shown}
      delay={0.1}
      reduce={reduce}
      hidden={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
      style={{ left: node.x, top: node.y, width: node.w, height: node.h }}
    >
      <div
        className="relative flex size-full items-center justify-between pr-4 pl-5"
        style={{ background: COLOR.gate }}
      >
        <span className="font-mono text-[14px] leading-none whitespace-nowrap text-white/80 uppercase">
          {node.left}
        </span>
        <span className="font-mono text-[14px] leading-none whitespace-nowrap text-white/80 uppercase">
          {node.right}
        </span>
        {/* bright input port */}
        <div
          className="absolute -left-2 top-1/2 size-3 -translate-y-1/2"
          style={{ background: COLOR.gatePort }}
        />
      </div>
    </Reveal>
  );
}
