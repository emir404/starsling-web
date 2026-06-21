import { cn } from "@/lib/utils";
import { Section } from "@/components/shared/section";
import { BlueprintStrip } from "@/components/shared/blueprint-strip";
import { INSTALLATION } from "@/content/installation";
import type { DiffLine } from "@/types/content";

/**
 * "Install with a one-line change" (Figma 234:1021) — a dark teal band whose
 * colors stay fixed across light and dark mode, so (like the PRs section) it
 * reuses the shared <Section> only for the blueprint frame geometry, with
 * literal values rather than theme tokens. A faint schematic strip of radar
 * pings linked by line groups sits behind a centered heading and the
 * runner-swap diff card.
 */
export function Installation() {
  const { title, subtitle, filename, diff } = INSTALLATION;
  return (
    <Section
      id="installation"
      className="border-y border-[#eff4f4] bg-[#072227]"
      containerClassName="relative overflow-hidden border-t border-[#164c4c] py-24 sm:py-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2b8d9f] opacity-25"
      >
        <BlueprintStrip />
      </div>
      <div className="relative z-10 mx-auto flex flex-col items-center text-center">
        <h2 className="text-h2 font-heading font-medium text-balance text-white">
          {title}
        </h2>
        <p className="mt-4 text-pretty text-base text-white/80">{subtitle}</p>
        <InstallDiff filename={filename} diff={diff} />
      </div>
    </Section>
  );
}

/** Per-tone treatment for a diff row: full-row tint + inherited line color. */
const TONE: Record<DiffLine["tone"], string> = {
  context: "text-white/50",
  removed: "bg-[rgba(202,39,33,0.1)] text-[#f48582]",
  added: "bg-[rgba(48,166,187,0.1)] text-[#44d3ec]",
};

/** The runner-swap snippet: a filename header row above the YAML diff rows. */
function InstallDiff({
  filename,
  diff,
}: {
  filename: string;
  diff: DiffLine[];
}) {
  return (
    <div className="mt-16 w-full max-w-[27.5rem] border border-[#344b4e] bg-[#1f383c] text-left font-mono text-sm sm:mt-24">
      <div className="border-b border-[#344b4e] px-4 py-3.5 text-white/80">
        {filename}
      </div>
      {diff.map((line, i) => (
        <div
          key={i}
          className={cn("flex items-center gap-3 px-4 py-3.5", TONE[line.tone])}
        >
          <span aria-hidden className="select-none">
            {line.marker}
          </span>
          <span>{line.text}</span>
        </div>
      ))}
    </div>
  );
}
