import { Fragment } from "react";

import { cn } from "@/lib/utils";

/**
 * Concentric-ring "radar ping" schematic glyph (Figma's recurring blueprint
 * decoration). Draws from `currentColor`, so the caller sets the color via a
 * `text-*` class on this element or an ancestor.
 */
export function RadarPing({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 88 88"
      className={cn("size-[88px] shrink-0", className)}
    >
      <circle cx="44" cy="44" r="43" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="44" cy="44" r="29" fill="none" stroke="currentColor" strokeOpacity="0.5" />
      <circle cx="44" cy="44" r="15" fill="none" stroke="currentColor" strokeOpacity="0.7" />
      <circle cx="44" cy="44" r="6" fill="currentColor" />
    </svg>
  );
}

/**
 * Four stacked schematic lines linking the pings (drawn from `currentColor` @ 35%).
 * `tilt` rakes each line ~12° for the vertical-strip variant (Figma 102:11).
 */
function LineGroup({ tilt = false }: { tilt?: boolean }) {
  return (
    <div className="flex shrink-0 flex-col gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-[2px] w-[100px] bg-current opacity-[0.35]",
            tilt && "rotate-[12deg]",
          )}
        />
      ))}
    </div>
  );
}

/**
 * Horizontal blueprint strip: radar pings linked by short line groups, repeated
 * to span a width (Figma's "How it works" 234:549 backdrop and the "Install"
 * 234:1023 backdrop are the same glyph). Color is `currentColor`; the caller
 * owns positioning, clipping, and any overall opacity via the wrapper.
 */
export function BlueprintStrip({
  count = 6,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex w-max items-center gap-8", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Fragment key={i}>
          <LineGroup />
          <RadarPing />
        </Fragment>
      ))}
      <LineGroup />
    </div>
  );
}

/**
 * Vertical blueprint strip: radar pings stacked between groups of raked schematic
 * lines (Figma 102:11). The column counterpart to {@link BlueprintStrip} — used as
 * a side rail / column accent. Color is `currentColor`; the caller owns
 * positioning, clipping, and any overall opacity via the wrapper.
 */
export function BlueprintColumn({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex w-max flex-col items-center gap-8", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Fragment key={i}>
          <LineGroup tilt />
          <RadarPing />
        </Fragment>
      ))}
      <LineGroup tilt />
    </div>
  );
}
