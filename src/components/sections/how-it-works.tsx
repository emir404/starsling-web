import { SectionHeading } from "@/components/shared/section";
import { BlueprintStrip } from "@/components/shared/blueprint-strip";
import { HOW_IT_WORKS } from "@/content/how-it-works";
import {
  AgentCard,
  EditorCard,
  TimelineCard,
} from "@/components/sections/how-it-works-illustrations";

/**
 * "How it works" (Figma 234:547 light / 234:4818 dark) — a three-step overview
 * inside a 1px hairline frame, built inline (like Cta/SocialProof) rather than
 * the 3px-rail <Section>. Each step pairs an animated mockup (a client
 * illustration) with a caption; a faint blueprint strip of radar pings sits
 * behind the cards and peeks through the side gutters.
 */
export function HowItWorks() {
  const { title, subtitle, install, speed, agents } = HOW_IT_WORKS;
  const cards = [
    { illustration: <EditorCard />, caption: install.caption },
    { illustration: <TimelineCard />, caption: speed.caption },
    { illustration: <AgentCard />, caption: agents.caption },
  ];

  return (
    <section className="w-full px-6 sm:px-[60px]">
      <div className="relative mx-auto w-full max-w-[1320px] overflow-hidden border-x border-hairline px-6 py-20 sm:px-14 sm:py-[7.5rem]">
        {/* Faint blueprint strip behind the cards (peeks at the side gutters). */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[#334d52]"
        >
          <BlueprintStrip count={7} />
        </div>

        <div className="relative z-10 flex flex-col gap-16">
          <SectionHeading align="start" title={title} subtitle={subtitle} />
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-4">
            {cards.map((card, i) => (
              <div key={i} className="flex flex-col gap-6">
                {card.illustration}
                <div className="flex flex-col gap-2">
                  <h3 className="text-h3 font-medium text-foreground">
                    {card.caption.title}
                  </h3>
                  <p className="text-sm leading-[1.45] text-foreground/80">
                    {card.caption.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
