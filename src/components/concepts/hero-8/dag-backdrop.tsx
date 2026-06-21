"use client";

import { OrbitField } from "@/components/concepts/hero-4/orbit-field";

/**
 * Backdrop for the workflow-run stage: a faint blueprint dot-grid over the dark
 * header, with hero-4's slow orbit glow bleeding up behind the cards. The grid
 * is masked to fade toward the edges so it never competes with the chrome.
 */
export function DagBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <OrbitField />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(215,234,237,0.10) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(125% 95% at 50% 100%, #000 38%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(125% 95% at 50% 100%, #000 38%, transparent 80%)",
        }}
      />
    </div>
  );
}
