"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

/**
 * Interactive "constellation" illustration for the footer (Figma 234:1281).
 * Visitors can DRAG any node (every line attached to it follows in real time)
 * and CLICK two nodes to connect / disconnect them. Pure SVG + pointer events —
 * the node/line idiom mirrors hero-8's `dag-connectors`, but positions live in
 * component state so they respond to the pointer.
 *
 * Colours are fixed across light/dark (literal hex), matching the footer band.
 */

/** Fixed coordinate plane the nodes live on; the SVG scales it to the footer width. */
const PLANE = { w: 1440, h: 680 } as const;

const LINE = "rgba(100,211,230,0.2)";
const ACCENT = "#30a6bb";

type FooterNode = { id: number; x: number; y: number };

/**
 * Seed positions — the Figma node centres translated into band-relative coords
 * (Figma centre − 436px band top). They intentionally bleed toward the edges.
 */
const SEED_NODES: readonly FooterNode[] = [
  { id: 0, x: 192, y: 60 },
  { id: 1, x: 584, y: 193 },
  { id: 2, x: 870, y: 60 },
  { id: 3, x: 286, y: 397 },
  { id: 4, x: 793, y: 498 },
  { id: 5, x: 1044, y: 277 },
  { id: 6, x: 1349, y: 73 },
  { id: 7, x: 1322, y: 534 },
  { id: 8, x: 34, y: 618 },
];

/** Initial links approximating the Figma constellation (visitors can re-wire these). */
const SEED_EDGES: readonly [number, number][] = [
  [0, 2],
  [0, 1],
  [0, 3],
  [0, 8],
  [1, 3],
  [1, 4],
  [1, 5],
  [2, 5],
  [2, 6],
  [3, 4],
  [4, 7],
  [5, 7],
  [5, 6],
];

/** Order-independent key so an edge has one identity regardless of direction. */
const edgeKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/** Movement (px) below which a press is treated as a click (connect) not a drag. */
const DRAG_THRESHOLD = 5;

export function FooterNetwork({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{
    id: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);

  const [nodes, setNodes] = useState<FooterNode[]>(() =>
    SEED_NODES.map((n) => ({ ...n })),
  );
  const [edges, setEdges] = useState<Set<string>>(
    () => new Set(SEED_EDGES.map(([a, b]) => edgeKey(a, b))),
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  const nodeById = (id: number) => nodes.find((n) => n.id === id)!;

  /** Map a client point into the SVG's coordinate plane (robust to scaling). */
  const toPlane = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!ctm) return null;
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  };

  const onNodeDown = (e: ReactPointerEvent<SVGGElement>, id: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id, startX: e.clientX, startY: e.clientY, moved: false };
  };

  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag.current && selected === null) return;
    const loc = toPlane(e.clientX, e.clientY);
    if (!loc) return;

    if (drag.current) {
      const d = drag.current;
      if (!d.moved) {
        const dist = Math.hypot(e.clientX - d.startX, e.clientY - d.startY);
        if (dist > DRAG_THRESHOLD) d.moved = true;
      }
      if (d.moved) {
        const { id } = d;
        setNodes((prev) =>
          prev.map((n) =>
            n.id === id
              ? { ...n, x: clamp(loc.x, 0, PLANE.w), y: clamp(loc.y, 0, PLANE.h) }
              : n,
          ),
        );
      }
    } else if (selected !== null) {
      setHover(loc); // rubber-band preview toward the cursor
    }
  };

  const onNodeUp = (id: number) => {
    const moved = drag.current?.moved ?? false;
    drag.current = null;
    if (moved) return; // a drag, not a click

    // click → connect / disconnect
    if (selected === null) {
      setSelected(id);
    } else if (selected === id) {
      setSelected(null);
      setHover(null);
    } else {
      const key = edgeKey(selected, id);
      setEdges((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
      setSelected(null);
      setHover(null);
    }
  };

  const edgeList = [...edges].map(
    (k) => k.split("-").map(Number) as [number, number],
  );

  // `meet` (fit, not `slice`/cover) so the whole plane always shows and no node
  // ring is ever cropped at the band edges — the footer bg fills the letterbox
  // margin on viewports off the plane's 1440:680 ratio. At ~1440px it's a 1:1 fit.
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${PLANE.w} ${PLANE.h}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={className}
      style={{ height: "clamp(300px, 50vw, 680px)", width: "100%" }}
      onPointerMove={onMove}
      onPointerCancel={() => {
        drag.current = null;
      }}
    >
      {/* edges */}
      {edgeList.map(([a, b]) => {
        const na = nodeById(a);
        const nb = nodeById(b);
        return (
          <line
            key={edgeKey(a, b)}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke={LINE}
            strokeWidth={2}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}

      {/* rubber-band preview from the selected node toward the cursor */}
      {selected !== null && hover && (
        <line
          x1={nodeById(selected).x}
          y1={nodeById(selected).y}
          x2={hover.x}
          y2={hover.y}
          stroke={LINE}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="2 12"
          vectorEffect="non-scaling-stroke"
        />
      )}

      {/* nodes */}
      {nodes.map((n) => {
        const isSelected = selected === n.id;
        return (
          <g
            key={n.id}
            transform={`translate(${n.x} ${n.y})`}
            className="cursor-grab active:cursor-grabbing"
            style={{ touchAction: "none" }}
            onPointerDown={(e) => onNodeDown(e, n.id)}
            onPointerUp={() => onNodeUp(n.id)}
          >
            {/* generous transparent hit target */}
            <circle r={54} fill="transparent" />
            <circle
              r={48}
              fill="none"
              stroke={isSelected ? ACCENT : LINE}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
            <circle
              r={18}
              fill="none"
              stroke={isSelected ? ACCENT : LINE}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
            <circle r={6} fill={ACCENT} />
          </g>
        );
      })}
    </svg>
  );
}
