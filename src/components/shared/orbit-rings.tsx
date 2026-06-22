import { cn } from "@/lib/utils";

/**
 * Orbit-rings illustration (Figma `287:2707`) — six tilted ellipse strokes shown
 * at low opacity so they read as faint light rings. Defaults to the white export
 * (`/problem/orbit.svg`) tuned for the teal mesh gradient on the problem-section
 * diagram card; pass `src="/hero/orbits.svg"` for the muted teal-gray strokes
 * that read on a light surface (testimonial cards). (Plain opacity, not
 * `mix-blend-overlay`, which triggered a Chrome compositing bug here.) Static (no
 * spin); position and size via `className` on the wrapper (the `<img>` fills its
 * width), tune brightness via `imgClassName`.
 */
export function OrbitRings({
  className,
  src = "/problem/orbit.svg",
  imgClassName = "opacity-60",
}: {
  className?: string;
  src?: string;
  imgClassName?: string;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static decorative SVG; next/image adds no value for an inline vector */}
      <img src={src} alt="" className={cn("block w-full max-w-none", imgClassName)} />
    </div>
  );
}
