import { cn } from "@/lib/utils";

/** Hatch group top edges in the 591px design row (Figma 217:659/664/669). */
const HATCH_GROUPS = [65.5, 252.97, 440.44];
/** Vertical rhythm between hatch lines within a group. */
const HATCH_STEP = 22.09;
/** Reticle top edges (Figma 217:674/678). */
const RETICLES = [165.43, 352.9];

/**
 * Decorated 120px margin cell flanking the band's center panel (Figma
 * 217:657 / 217:632): three groups of four slanted hatch lines with two
 * concentric-circle reticles between them, in the #334D52 blueprint ink at
 * 5%. The right cell mirrors the hatch slant. Art is laid out on the 591px
 * design row, centered vertically and clipped by the band.
 */
export function MarginCell({
  side,
  className,
}: {
  side: "left" | "right";
  className?: string;
}) {
  const mirror = side === "right";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none overflow-hidden text-[rgba(51,77,82,0.05)] dark:text-[rgba(215,234,237,0.08)]",
        className,
      )}
    >
      <div className="absolute top-1/2 left-1/2 h-[591px] w-[7.5rem] -translate-x-1/2 -translate-y-1/2">
        {HATCH_GROUPS.map((groupTop) =>
          Array.from({ length: 4 }, (_, i) => (
            <div
              key={`${groupTop}-${i}`}
              style={{ top: groupTop + i * HATCH_STEP + 8.5 }}
              className={cn(
                "absolute left-[18.8px] h-[1.652px] w-[82.59px] bg-current",
                mirror ? "-rotate-12" : "rotate-12",
              )}
            />
          )),
        )}
        {RETICLES.map((top) => (
          <svg
            key={top}
            viewBox="0 0 72.68 72.68"
            style={{ top }}
            className="absolute left-1/2 size-[72.68px] -translate-x-1/2"
          >
            <circle
              cx="36.34"
              cy="36.34"
              r="35.51"
              stroke="currentColor"
              strokeWidth="1.65"
              fill="none"
            />
            <circle
              cx="36.34"
              cy="36.34"
              r="23.95"
              stroke="currentColor"
              strokeWidth="1.65"
              fill="none"
            />
            <circle cx="36.34" cy="36.34" r="8.26" fill="currentColor" />
          </svg>
        ))}
      </div>
    </div>
  );
}
