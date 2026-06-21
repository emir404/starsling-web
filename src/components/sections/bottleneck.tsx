import { BottleneckDiagram } from "@/components/sections/bottleneck-diagram";
import { Highlight } from "@/components/shared/highlight";
import { Section, SectionHeading } from "@/components/shared/section";
import { BOTTLENECK } from "@/content/bottleneck";

/** Splits `title` on `highlight` and wraps the matched phrase in the teal marker. */
function TitleWithHighlight({
  title,
  highlight,
}: {
  title: string;
  highlight: string;
}) {
  const index = title.indexOf(highlight);
  if (index === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, index)}
      <Highlight>{highlight}</Highlight>
      {title.slice(index + highlight.length)}
    </>
  );
}

/**
 * "CI is the new bottleneck" — Figma 234:395. Heading + two icon problem rows on
 * the left; an animated before/after CI comparison diagram on the right.
 */
export function Bottleneck() {
  return (
    <Section id="bottleneck">
      <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,36rem)] lg:gap-14">
        {/* Left: heading at top, problem rows pushed to the bottom */}
        <div className="flex flex-col gap-12 lg:justify-between">
          <SectionHeading
            align="start"
            title={BOTTLENECK.title}
            subtitle={BOTTLENECK.subtitle}
          />
          <div className="flex flex-col">
            {BOTTLENECK.rows.map((row) => {
              const Icon = row.icon;
              return (
                <article
                  key={row.title}
                  className="flex flex-col gap-5 border-b border-hairline py-8"
                >
                  <Icon className="size-7 text-foreground" aria-hidden />
                  <div className="flex flex-col gap-3">
                    <h3 className="text-h3 font-heading font-medium text-foreground">
                      <TitleWithHighlight
                        title={row.title}
                        highlight={row.highlight}
                      />
                    </h3>
                    <p className="max-w-[30rem] text-sm leading-[1.45] text-foreground/80">
                      {row.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Right: animated comparison diagram */}
        <BottleneckDiagram bars={BOTTLENECK.bars} />
      </div>
    </Section>
  );
}
