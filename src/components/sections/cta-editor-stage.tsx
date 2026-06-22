"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

import { EditorCard } from "@/components/sections/how-it-works-illustrations";

/** Natural size of the shared `EditorCard` mockup (how-it-works-illustrations). */
const CARD_W = 950;
/**
 * The CTA card's Figma size (282:883 / 289:4106): the same `EditorCard` at
 * ×1.272 (950→1208 wide, 14→17.8px type), clipped to 386px so only the first
 * ~10 rows show — the trailing `pnpm install/test` lines fall below the edge,
 * exactly as in the design.
 */
const DESIGN_W = 1208;
const DESIGN_H = 386;

/**
 * Eased (smoothstep) vertical fade so the editor dissolves into the bright top of
 * the mesh gradient (the Figma alpha mask): the window chrome + first rows fade in
 * over the top ~third, the rest stays fully opaque down to the 386px clip. The
 * eased alpha curve avoids the banded "line" a plain linear ramp leaves. Same
 * `maskImage` technique as the hero illustration bands (concepts/hero-1, hero-11).
 */
const MASK =
  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 4%, rgba(0,0,0,0.16) 8%, rgba(0,0,0,0.32) 12%, rgba(0,0,0,0.5) 16%, rgba(0,0,0,0.68) 20%, rgba(0,0,0,0.84) 24%, rgba(0,0,0,0.96) 28%, #000 32%, #000 100%)";

/**
 * Renders the runner-swap `EditorCard` at the CTA's size: scaled to fill the
 * column width (so the type stays crisp at any width, mirroring how-it-works'
 * `ScaledStage`), clipped to the Figma 1208×386 box, and masked so its top
 * dissolves into the gradient. The card mounts — and plays its swap reveal —
 * only once scrolled into view (it animates on mount).
 */
export function CtaEditorStage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3, once: true });
  const [width, setWidth] = useState(DESIGN_W);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(Math.min(DESIGN_W, el.clientWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        height: width * (DESIGN_H / DESIGN_W),
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: CARD_W, transform: `scale(${width / CARD_W})` }}
      >
        {inView ? <EditorCard /> : null}
      </div>
    </div>
  );
}
