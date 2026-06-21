import { CenteredTimeline } from "./centered-timeline";

/**
 * Hero concept 7 — concept 3's big CI timeline with the hero text group removed
 * and the canvas centered in the frame (no camera pan). A clean, text-free
 * stage for capturing the run animation as an X post.
 */
export function HeroConcept7() {
  return (
    <div className="relative flex h-[calc(100svh-5rem)] min-h-[44rem] flex-col overflow-hidden bg-header lg:h-[calc(100svh-6.25rem)]">
      <CenteredTimeline />
    </div>
  );
}
