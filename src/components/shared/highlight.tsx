import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Inline text marker/highlighter, matching the Figma's translucent swatch
 * behind emphasized phrases. `danger` switches the teal marker to red.
 */
export function Highlight({
  children,
  className,
  danger = false,
}: {
  children: ReactNode;
  className?: string;
  danger?: boolean;
}) {
  return (
    <mark
      className={cn(
        "box-decoration-clone bg-highlight px-0.5 text-foreground",
        danger && "bg-highlight-danger",
        className,
      )}
    >
      {children}
    </mark>
  );
}
