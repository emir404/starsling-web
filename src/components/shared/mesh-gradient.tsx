"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * A single soft "blob" — one full-bleed radial-gradient layer. Stacking several
 * translucent teal blobs (lighter ones lighten, deep ones darken) over an opaque
 * base sculpts an organic mesh gradient entirely in CSS, alpha-composited — no
 * `mix-blend-mode` (which triggers a Chrome clip/compositing bug here). Each blob
 * drifts on its own loop and reacts to the pointer.
 */
type Blob = {
  /** radial center, % of the layer */
  x: number;
  y: number;
  /** rgba core color (its alpha controls how strongly the blob reads) */
  color: string;
  /** radius (% to fully-transparent) — controls blob size/softness */
  spread: number;
  /** which ambient-drift keyframe to ride */
  drift: "a" | "b" | "c";
  /** drift loop duration (seconds) */
  duration: number;
  /** drift start offset (seconds) — stagger so blobs don't move in lockstep */
  delay?: number;
  /** pointer-parallax travel at full deflection (px); nearer blobs use more */
  depth: number;
};

type Variant = {
  /** flat fill beneath the blobs (use "transparent" to overlay a surface) */
  base: string;
  blobs: Blob[];
};

export type MeshVariant = "mesh-bright" | "mesh-deep" | "glow-radial";

/**
 * Reusable teal background library — three CSS mesh gradients matching Figma
 * `293:4127` (bright centre), `293:4168` (deep centre) and `293:4147` (corner
 * glow). `mesh-bright` backs the problem-section diagram card; the other two are
 * available presets. Tuned against the brand teal family in globals.css.
 */
export const MESH_VARIANTS: Record<MeshVariant, Variant> = {
  // 293:4127 — bright cyan upper-left/centre, deep teal bottom-right corner.
  "mesh-bright": {
    base: "#1f8ea2",
    blobs: [
      { x: 42, y: 4, color: "rgba(116,214,228,0.85)", spread: 70, drift: "a", duration: 22, depth: 26 },
      { x: 14, y: 26, color: "rgba(86,198,216,0.6)", spread: 56, drift: "b", duration: 26, delay: 3, depth: 20 },
      { x: 78, y: 22, color: "rgba(58,178,198,0.4)", spread: 48, drift: "c", duration: 19, delay: 1, depth: 30 },
      { x: 96, y: 96, color: "rgba(6,46,58,0.92)", spread: 70, drift: "a", duration: 28, delay: 5, depth: 16 },
      { x: 104, y: 58, color: "rgba(9,64,78,0.55)", spread: 46, drift: "b", duration: 30, delay: 2, depth: 12 },
    ],
  },
  // 293:4168 — bright top/left/bottom-left edges around a big deep centre-right.
  "mesh-deep": {
    base: "#177c8e",
    blobs: [
      { x: 45, y: -2, color: "rgba(96,206,222,0.7)", spread: 60, drift: "a", duration: 24, depth: 24 },
      { x: 0, y: 40, color: "rgba(80,196,214,0.6)", spread: 55, drift: "c", duration: 21, delay: 2, depth: 22 },
      { x: 8, y: 102, color: "rgba(70,188,206,0.5)", spread: 46, drift: "b", duration: 27, delay: 4, depth: 18 },
      { x: 62, y: 56, color: "rgba(5,40,50,0.85)", spread: 72, drift: "a", duration: 30, delay: 1, depth: 14 },
      { x: 104, y: 52, color: "rgba(7,46,56,0.6)", spread: 50, drift: "b", duration: 26, delay: 6, depth: 10 },
    ],
  },
  // 293:4147 — deep teal glow anchored top-left, fading out to bottom-right.
  "glow-radial": {
    base: "transparent",
    blobs: [
      { x: 12, y: 6, color: "rgba(12,110,128,0.85)", spread: 60, drift: "a", duration: 26, depth: 18 },
      { x: 2, y: -4, color: "rgba(10,82,96,0.7)", spread: 40, drift: "c", duration: 30, delay: 3, depth: 12 },
      { x: 24, y: 30, color: "rgba(20,130,150,0.4)", spread: 44, drift: "b", duration: 22, delay: 1, depth: 22 },
    ],
  },
};

/** Tiny tiling film-grain (inline SVG noise), composited normally at low opacity. */
const GRAIN = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}`;

export function MeshGradient({
  variant = "mesh-bright",
  interactive = true,
  grain = true,
  className,
}: {
  variant?: MeshVariant;
  /** follow the pointer with a subtle parallax (desktop); off = ambient drift only */
  interactive?: boolean;
  /** overlay subtle film grain */
  grain?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const animate = !reduce;
  const { base, blobs } = MESH_VARIANTS[variant];

  // Pointer parallax: track the cursor (anywhere on the page) and, while it's
  // over this element, ease normalized −1…1 offsets into --mx/--my. Listening on
  // the window keeps it working when content is stacked above the gradient.
  useEffect(() => {
    if (!interactive || reduce) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--mx", cx.toFixed(4));
      el.style.setProperty("--my", cy.toFixed(4));
      raf =
        Math.abs(tx - cx) > 0.0008 || Math.abs(ty - cy) > 0.0008
          ? requestAnimationFrame(tick)
          : 0;
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
      tx = inside ? ((e.clientX - r.left) / r.width) * 2 - 1 : 0;
      ty = inside ? ((e.clientY - r.top) / r.height) * 2 - 1 : 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [interactive, reduce]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none relative overflow-hidden", className)}
      style={{ background: base, "--mx": 0, "--my": 0 } as React.CSSProperties}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute -inset-[20%]"
          style={{
            background: `radial-gradient(circle at ${b.x}% ${b.y}%, ${b.color} 0%, transparent ${b.spread}%)`,
            willChange: "transform",
            ...(animate
              ? {
                  animation: `mesh-drift-${b.drift} ${b.duration}s ease-in-out ${b.delay ?? 0}s infinite`,
                  translate: interactive
                    ? `calc(var(--mx) * ${b.depth}px) calc(var(--my) * ${b.depth}px)`
                    : undefined,
                }
              : {}),
          }}
        />
      ))}

      {grain && (
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("${GRAIN}")`,
            backgroundSize: "180px 180px",
          }}
        />
      )}
    </div>
  );
}
