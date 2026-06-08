import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Mono uppercase label — the design's eyebrow/tag treatment.
 * Used for section eyebrows, metric labels, and shortcut-style nav items.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-eyebrow uppercase text-foreground/70",
        className,
      )}
    >
      {children}
    </span>
  );
}
