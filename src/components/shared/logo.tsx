import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/site";

/** Starsling wordmark (SVG from Figma). Height-driven; width scales with the 169.638×36 ratio. */
export function Logo({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static brand SVG; next/image adds no value for an inline vector
    <img
      src="/starsling-logo.svg"
      alt={SITE_CONFIG.name}
      width={170}
      height={36}
      className={cn("h-8 w-auto lg:h-9 dark:invert", className)}
    />
  );
}
