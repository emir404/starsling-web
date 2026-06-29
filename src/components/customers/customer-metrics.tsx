import { cn } from "@/lib/utils";
import type { CustomerMetric } from "@/types/customers";

/** Hairline-divided row of headline stats (value · label · before→after detail). */
export function CustomerMetrics({
  metrics,
  className,
}: {
  metrics: CustomerMetric[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid gap-px overflow-hidden border border-hairline bg-hairline sm:grid-cols-3",
        className,
      )}
    >
      {metrics.map((m) => (
        <div key={m.label} className="flex flex-col gap-2 bg-background p-6">
          <dd className="font-heading text-4xl font-medium tracking-[-0.02em] text-brand sm:text-[2.75rem]">
            {m.value}
          </dd>
          <dt className="text-sm font-medium text-foreground">{m.label}</dt>
          {m.detail ? (
            <dd className="font-mono text-xs text-foreground/55">{m.detail}</dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
