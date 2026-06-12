import { cn } from "@/lib/utils";
import { GRID } from "./blueprint-data";

/**
 * Graph-paper backdrop (Figma 212:71), replicated structurally: a rotated
 * column of bordered 120px squares whose first (6-cell, centered) row becomes
 * the partial left column. Border overlaps render exactly like the Figma
 * stack. Static — the stage fades it in with everything else.
 */
export function GraphGrid() {
  return (
    <div
      aria-hidden
      style={{ left: GRID.x, top: GRID.y, width: GRID.w, height: GRID.h }}
      className="absolute flex items-center justify-center"
    >
      <div className="flex flex-none -rotate-90 flex-col items-center">
        {GRID.rows.map((count, r) => (
          <div
            key={r}
            className={cn("flex items-center", r === 0 && "justify-center", "w-full")}
          >
            {Array.from({ length: count }, (_, i) => (
              <div
                key={i}
                style={{ width: GRID.cell, height: GRID.cell }}
                className="shrink-0 border-[1.2px] border-[#d0dde1] dark:border-rail"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
