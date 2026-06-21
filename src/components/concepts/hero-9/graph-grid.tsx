import { GRID } from "./run-graph-data";

/**
 * Blueprint graph-paper backdrop — a faint full-bleed rail grid behind the run
 * graph, painted with the `--rail` token (so it carries into dark mode) and
 * masked to fade toward the edges. Static; the stage fades it in with the rest.
 */
export function GraphGrid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 opacity-70"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--rail) 1px, transparent 1px), linear-gradient(to bottom, var(--rail) 1px, transparent 1px)",
        backgroundSize: `${GRID.cell}px ${GRID.cell}px`,
        backgroundPosition: "center",
        maskImage:
          "radial-gradient(ellipse 78% 76% at 50% 46%, #000 32%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 78% 76% at 50% 46%, #000 32%, transparent 100%)",
      }}
    />
  );
}
