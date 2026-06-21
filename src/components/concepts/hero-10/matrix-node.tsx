"use client";

import { Marker } from "@/components/concepts/hero-4/runners-panel";
import { Reveal } from "@/components/concepts/shared/reveal";
import { BEAT, COLOR, type MatrixNodeSpec } from "./ci-run-data";

/**
 * A matrix group node (Figma 246:394 / 246:436): a dark body with a title tab
 * straddling its top edge, a grid of 32px agent cells each holding a spinning →
 * teal-check `Marker`, a right-edge output port, and a bottom label that reads
 * "N agents · <note>" while running and flips to "N jobs completed" once the
 * dials tick. Positioned in canvas space by its own `Reveal`.
 */
export function MatrixNode({
  node,
  step,
  reduce,
}: {
  node: MatrixNodeSpec;
  step: number;
  reduce: boolean;
}) {
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
      <div
        className="relative flex size-full flex-col px-2 pt-6 pb-3"
        style={{ background: COLOR.node }}
      >
        {/* title tab — straddles the top edge */}
        <div
          className="absolute -top-4 left-2 flex h-8 items-center px-2"
          style={{ background: COLOR.tab }}
        >
          <span className="font-mono text-[14px] leading-none whitespace-nowrap text-white/80 uppercase">
            {node.title}
          </span>
        </div>

        {/* output port — aligned to the connector's start y */}
        <div
          className="absolute -right-2 size-3 -translate-y-1/2"
          style={{ background: COLOR.tab, top: node.out.y - node.y }}
        />

        {/* parallel agent bank */}
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${node.cols}, 2rem)` }}
        >
          {Array.from({ length: node.count }).map((_, i) => (
            <div
              key={`${node.id}-${i}`}
              className="grid size-8 place-items-center"
              style={{ background: COLOR.cell }}
            >
              <Marker
                shown={shown}
                ticked={ticked}
                done={false}
                delay={0.08 + i * 0.02}
                tickDelay={node.order * 0.2 + i * 0.02}
                reduce={reduce}
              />
            </div>
          ))}
        </div>

        {/* status line — agents/note while running, jobs-completed once ticked.
            "cache restored" is teal (fleet); "warming cache" is white and wraps
            to a second line (cache-warm). */}
        <div className="mt-auto flex flex-wrap gap-x-2 font-mono text-[14px] leading-[1.4] uppercase">
          {ticked ? (
            <span className="text-white">{node.completedLabel}</span>
          ) : (
            <>
              <span className="text-white">{node.agentsLabel}</span>
              <span
                className="text-white"
                style={node.noteTeal ? { color: COLOR.teal } : undefined}
              >
                {node.runningNote}
              </span>
            </>
          )}
        </div>
      </div>
    </Reveal>
  );
}
