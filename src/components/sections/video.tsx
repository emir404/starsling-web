import { VideoPlayer } from "@/components/sections/video-player";
import { VIDEO_SECTION } from "@/content/video";

/**
 * Product-demo video section (Figma node 282:879): the StarSling Runners brand
 * film, framed by the blueprint rails (hairline left/right/top, 56px inset) and
 * played through custom player chrome. A server component — only the player
 * itself is client-side.
 */
export function Video() {
  return (
    <section id="video" className="w-full px-6 sm:px-[60px]">
      <div className="mx-auto w-full max-w-[1320px] border-x border-t border-hairline bg-band p-6 sm:p-14">
        <VideoPlayer
          src={VIDEO_SECTION.src}
          poster={VIDEO_SECTION.poster}
          label={VIDEO_SECTION.label}
        />
      </div>
    </section>
  );
}
