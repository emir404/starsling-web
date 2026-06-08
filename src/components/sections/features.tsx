import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/shared/section";
import { FEATURES } from "@/content/features";

export function Features() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="AI in your CI"
        title="Everything you need to ship faster, for less"
        subtitle="Self-driving infrastructure that gets better every week."
      />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <CardHeader>
                <Icon className="mb-2 size-6 text-brand" aria-hidden />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
