import { HeroTextCenter } from "./hero-text-center";
import { IsoPanelBand } from "./iso-panel-band";

/**
 * Hero concept 6 — Figma 217:527. The hero copy fully centered between
 * vertical rails, over hero-1's isometric step scenes restaged in a framed
 * panel with decorated blueprint margins. Fills the viewport below the
 * sticky header.
 */
export function HeroConcept6() {
  return (
    <div className="relative flex h-[calc(100svh-5rem)] min-h-[48rem] flex-col overflow-hidden bg-header lg:h-[calc(100svh-6.25rem)]">
      <section className="relative flex flex-none flex-col items-center justify-center px-6 py-10 md:px-12 lg:py-12">
        {/* Vertical rails over the text area (Figma 217:631) */}
        <div aria-hidden className="absolute inset-0">
          <div className="mx-auto h-full w-full max-w-[90rem] px-3 md:px-6 lg:px-[3.75rem]">
            <div className="h-full border-x border-band-border" />
          </div>
        </div>
        <HeroTextCenter className="relative z-10" />
      </section>
      <IsoPanelBand />
    </div>
  );
}
