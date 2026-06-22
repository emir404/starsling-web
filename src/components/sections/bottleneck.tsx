import { BottleneckDiagram } from "@/components/sections/bottleneck-diagram";
import { Highlight } from "@/components/shared/highlight";
import { SectionHeading } from "@/components/shared/section";
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
 * "CI is the new bottleneck" — Figma 282:336. Built inline (not via `<Section>`)
 * so the diagram card bleeds full-height to the right edge with zero right
 * padding, while the left text column keeps the blueprint gutter + left rail.
 * Heading sits at the top of the left column, the two icon problem rows at the
 * bottom; an animated before/after CI comparison diagram fills the right.
 */
export function Bottleneck() {
  return (
    <section id="bottleneck" className="w-full overflow-x-clip px-6 sm:px-[60px]">
      <div className="mx-auto flex max-w-[1320px] flex-col border-l border-hairline lg:flex-row">
        {/* Left: heading (top) + problem rows (bottom), padded blueprint column */}
        <div className="flex flex-1 flex-col gap-12 px-6 py-16 sm:px-14 lg:min-h-svh lg:justify-between lg:py-[7.5rem] lg:pr-14">
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

        {/* Right: full-height comparison diagram. The negative right margin breaks
            it out of the centered max-w-[1320px] column so it bleeds to the
            viewport's right edge (the left column stays on the blueprint grid).
            Gap to the edge is the 60px gutter up to 1440px, then the growing
            centering margin (50vw − 660px) beyond it — min() picks the right one. */}
        <BottleneckDiagram
          bars={BOTTLENECK.bars}
          className="lg:w-[43.375rem] lg:shrink-0 lg:mr-[min(-60px,calc(660px_-_50vw))]"
        />
      </div>
    </section>
  );
}
