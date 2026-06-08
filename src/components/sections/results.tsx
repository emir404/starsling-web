import { Section } from "@/components/shared/section";
import { STATS } from "@/content/stats";

export function Results() {
  return (
    <Section id="results">
      <div className="grid gap-8 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-heading text-5xl font-semibold tracking-tight text-brand">
              {stat.value}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
