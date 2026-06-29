import type { MetadataRoute } from "next";

import { SITE_CONFIG } from "@/lib/site";

/**
 * Web app manifest — basic install metadata + brand theming for mobile browser
 * chrome. Uses the existing brand SVG mark; PNG icons can be added later if a
 * full installable PWA is ever needed.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fafbfb",
    theme_color: "#191f20",
    icons: [
      { src: "/icons/favicon-dark.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
