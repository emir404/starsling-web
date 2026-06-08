import { Rocket } from "lucide-react";

import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/site";

/** Starsling wordmark. Swap the Rocket glyph for a real SVG mark once available. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-heading text-lg font-semibold tracking-tight",
        className,
      )}
    >
      <Rocket className="size-5 text-brand" aria-hidden />
      {SITE_CONFIG.name}
    </span>
  );
}
