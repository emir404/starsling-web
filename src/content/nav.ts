import type { FooterColumn, NavLink } from "@/types/content";
import { SITE_CONFIG } from "@/lib/site";

/** Primary header navigation — maps to the dedicated marketing routes (order + shortcuts from Figma). */
export const NAV_LINKS: NavLink[] = [
  { label: "Case Studies", href: "/customers", shortcut: "C" },
  { label: "Pricing", href: "/pricing", shortcut: "P" },
  { label: "Blog", href: "/blog", shortcut: "B" },
];

/** Decorative status pill shown beside the footer wordmark. */
export const FOOTER_STATUS = "All systems operational";

/**
 * Footer link groups, 1:1 with Figma (234:1281). Each link carries a bracketed
 * `shortcut` rendered as `[X] LABEL` (same treatment as the header nav).
 * `#` placeholders are filled in as those pages ship.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Site",
    links: [
      { label: "Case Studies", href: "/customers", shortcut: "C" },
      { label: "Pricing", href: "/pricing", shortcut: "P" },
      { label: "Blog", href: "/blog", shortcut: "B" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "GitHub", href: SITE_CONFIG.links.github, shortcut: "G" },
      { label: "X (Formerly Twitter)", href: SITE_CONFIG.links.twitter, shortcut: "X" },
      { label: "LinkedIn", href: SITE_CONFIG.links.linkedin, shortcut: "L" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact Us", href: "#", shortcut: "U" },
      { label: "TOS", href: "#", shortcut: "T" },
      { label: "Privacy Policy", href: "#", shortcut: "R" },
    ],
  },
];
