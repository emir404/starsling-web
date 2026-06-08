import { Section } from "@/components/shared/section";
import { CUSTOMER_LOGOS } from "@/content/testimonials";

export function SocialProof() {
  return (
    <Section id="customers" className="py-14">
      <p className="text-center text-sm text-muted-foreground">
        Trusted by fast-moving engineering teams
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {CUSTOMER_LOGOS.map((logo) => (
          <span
            key={logo.name}
            className="text-lg font-medium text-muted-foreground/70"
          >
            {logo.name}
          </span>
        ))}
      </div>
    </Section>
  );
}
