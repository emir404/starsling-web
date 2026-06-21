"use client";

import { Maximize2, Minus, Plus } from "lucide-react";

import { CARD, GRAPH, NODES, SUMMARY } from "./run-graph-data";
import { Connectors } from "./connectors";
import { GraphNode } from "./graph-node";

/**
 * The bordered e2e.yml card: the workflow title + trigger subtitle, the fan-in
 * connector layer behind the four DAG nodes, and a decorative zoom-control
 * cluster — the whole stage is non-interactive, so the controls are chrome.
 */
export function WorkflowGraphCard({ beat, reduce }: { beat: number; reduce: boolean }) {
  return (
    <div
      className="absolute border border-hairline bg-card shadow-[0_4px_24px_0_rgba(0,0,0,0.02)] dark:border-rail"
      style={{ left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h }}
    >
      <div className="absolute top-5 left-6">
        <div className="font-mono text-[0.9375rem] font-medium text-foreground">
          {SUMMARY.workflow}
        </div>
        <div className="mt-1 font-mono text-[0.75rem] text-foreground/50">
          {SUMMARY.on}
        </div>
      </div>

      <div
        className="absolute"
        style={{ left: GRAPH.x, top: GRAPH.y, width: GRAPH.w, height: GRAPH.h }}
      >
        <Connectors beat={beat} reduce={reduce} />
        {NODES.map((node) => (
          <GraphNode key={node.id} node={node} beat={beat} reduce={reduce} />
        ))}
      </div>

      <div className="absolute right-6 bottom-5 flex items-center gap-1.5 text-foreground/40">
        <span className="grid size-7 place-items-center border border-hairline">
          <Maximize2 className="size-3.5" />
        </span>
        <span className="flex border border-hairline">
          <span className="grid size-7 place-items-center border-r border-hairline">
            <Minus className="size-3.5" />
          </span>
          <span className="grid size-7 place-items-center">
            <Plus className="size-3.5" />
          </span>
        </span>
      </div>
    </div>
  );
}
