import { cn } from "@/lib/utils";
import type { SpeedupBar } from "@/types/customers";

/** A single blueprint bar: a hairline track with a filled segment + value label. */
function Bar({
  widthPct,
  tone,
  value,
}: {
  widthPct: number;
  tone: "muted" | "brand";
  value?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-7 flex-1 border border-hairline bg-background">
        <div
          className={cn(
            "absolute inset-y-0 left-0",
            tone === "brand" ? "bg-brand" : "bg-foreground/15",
          )}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      {value ? (
        <span className="w-20 shrink-0 text-right font-mono text-xs text-foreground/70">
          {value}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Before/after speedup chart: per workflow, a full-width "before" track and a
 * proportionally-shorter "after" bar (width ≈ 1/factor), with the factor called
 * out — so the improvement reads at a glance.
 */
export function CaseStudySpeedups({ speedups }: { speedups?: SpeedupBar[] }) {
  if (!speedups || speedups.length === 0) return null;

  return (
    <section className="mt-14">
      <h2
        id="speedups"
        className="mb-6 scroll-mt-28 font-heading text-[1.6rem] font-medium tracking-[-0.02em] text-foreground sm:text-[1.875rem]"
      >
        Workflow speedups
      </h2>
      <div className="flex flex-col gap-7 border border-hairline p-6 sm:p-8">
        {speedups.map((s) => {
          const factor = parseFloat(s.factor) || 1;
          const afterPct = Math.max(8, Math.min(100, 100 / factor));
          return (
            <div key={s.label} className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium text-foreground">
                  {s.label}
                </span>
                <span className="font-mono text-sm font-semibold text-brand">
                  {s.factor} faster
                </span>
              </div>
              {s.before || s.after ? (
                <>
                  <Bar widthPct={100} tone="muted" value={s.before} />
                  <Bar widthPct={afterPct} tone="brand" value={s.after} />
                </>
              ) : (
                <Bar widthPct={afterPct} tone="brand" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
