import { Section } from "@/components/shared/section";
import { Highlight } from "@/components/shared/highlight";
import { PRS_CONTENT } from "@/content/prs";
import { PrFeed } from "./pr-feed";

/**
 * "The PRs don't stop coming." (Figma 234:468) — a dark teal band where PR
 * cards stream in and stack, framing the volume problem AI agents create. The
 * whole section keeps the same fixed colors in light and dark mode, so it uses
 * literal values / white-alpha rather than theme tokens; it reuses the shared
 * <Section> only for the blueprint frame geometry, with the rail colors
 * overridden to the band's palette.
 */
export function Prs() {
  const { title, subtitle, paragraph } = PRS_CONTENT;
  return (
    <Section
      id="prs"
      className="border-y border-[#eff4f4] bg-[#072227]"
      containerClassName="border-t border-[#164c4c] py-24 sm:py-40"
    >
      <div className="mx-auto flex w-full max-w-[49.625rem] flex-col items-center">
        <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="text-h2 font-heading font-medium text-balance text-white">
            {title}
          </h2>
          <p className="text-pretty text-base text-white/80">{subtitle}</p>
        </div>

        <div className="mt-16 w-full sm:mt-24">
          <PrFeed />
        </div>

        <div className="mt-16 w-full max-w-[31.625rem] border-t border-white/10 pt-8 sm:mt-24">
          <p className="text-center text-sm leading-[1.45] text-white/80">
            {paragraph.map((seg, i) =>
              seg.highlight ? (
                <Highlight
                  key={i}
                  className="bg-[rgba(48,166,187,0.15)] text-white/80"
                >
                  {seg.text}
                </Highlight>
              ) : (
                <span key={i}>{seg.text}</span>
              ),
            )}
          </p>
        </div>
      </div>
    </Section>
  );
}
