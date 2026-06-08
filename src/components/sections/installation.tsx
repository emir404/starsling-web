import { Section, SectionHeading } from "@/components/shared/section";
import { CodeBlock } from "@/components/shared/code-block";

const SNIPPET = `# .github/workflows/ci.yml
jobs:
  build:
-   runs-on: ubuntu-latest
+   runs-on: starsling-ubuntu-24.04`;

export function Installation() {
  return (
    <Section id="installation">
      <SectionHeading
        eyebrow="Get started in one line"
        title="Swap your runner. That's it."
        subtitle="No migration, no new config — change a single label."
      />
      <div className="mx-auto mt-10 max-w-2xl">
        <CodeBlock code={SNIPPET} />
      </div>
    </Section>
  );
}
