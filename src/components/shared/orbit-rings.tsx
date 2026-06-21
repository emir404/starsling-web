import { cn } from "@/lib/utils";

/**
 * Orbit-rings illustration (Figma `287:2707`) — six tilted white ellipse strokes
 * shown at low opacity so they read as faint light rings over the teal mesh
 * gradient on the problem-section diagram card. (Plain opacity, not
 * `mix-blend-overlay`, which triggered a Chrome compositing bug here.) Same
 * geometry as `public/hero/orbits.svg`, exported white. Static (no spin);
 * position and size via `className` on the wrapper (the `<img>` fills its width).
 */
export function OrbitRings({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static decorative SVG; next/image adds no value for an inline vector */}
      <img
        src="/problem/orbit.svg"
        alt=""
        className="block w-full max-w-none opacity-60"
      />
    </div>
  );
}
