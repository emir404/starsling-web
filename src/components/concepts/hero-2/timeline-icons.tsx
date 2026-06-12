import { cn } from "@/lib/utils";
import {
  BUILD_CHECK_PATH,
  CHECK_PATH,
  CI_ARC_PATH,
  CI_DISC_PATH,
  CODE_PATH,
  MARK_PATHS,
  PARALLEL_PATH,
  PR_PATH,
} from "./icon-paths";

/**
 * Timeline glyphs, 1:1 from the Figma frames. Path data lives in frame-absolute
 * coordinates (see icon-paths.ts); each svg windows its glyph with a viewBox,
 * and single-color glyphs paint with currentColor so pill/label state colors
 * cascade into them.
 */

function glyph(viewBox: string, d: string) {
  return function Glyph({ className }: { className?: string }) {
    return (
      <svg
        aria-hidden
        viewBox={viewBox}
        className={cn("size-[18px] shrink-0", className)}
      >
        <path d={d} fill="currentColor" />
      </svg>
    );
  };
}

/** Pull-request glyph (New PR pill, node 204:5796). */
export const IconPr = glyph("104 643 18 18", PR_PATH);
/** Code glyph (Analyzing pill, node 204:5800). */
export const IconCode = glyph("496 501.913 18 18", CODE_PATH);
/** Fork glyph (Parallel runners pill, node 204:6031). */
export const IconParallel = glyph("793.961 785.087 18 18", PARALLEL_PATH);
/** Check glyph (Build passed pill, node 204:6254). */
export const IconBuildCheck = glyph("1096.25 501.913 18 18", BUILD_CHECK_PATH);
/** Check glyph inside timeline markers (node 204:5803). */
export const IconMarkerCheck = glyph("711 501.913 18 18", CHECK_PATH);

/** "CI starting" marker — foreground disc with a background dial arc (204:5793). */
export function IconCiRing({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="860.875 501.913 18 18"
      className={cn("size-[18px] shrink-0", className)}
    >
      <path d={CI_DISC_PATH} className="fill-foreground" />
      <path d={CI_ARC_PATH} className="fill-header" />
    </svg>
  );
}

/** Starsling mark inside the scan reticle (Figma group 54/55/56). */
export function ReticleMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="404.25 550.005 32 32"
      className={cn("size-8", className)}
    >
      {MARK_PATHS.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}
