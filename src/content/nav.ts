import type { FooterColumn, NavLink } from "@/types/content";

/** Primary header navigation — maps to the dedicated marketing routes (order + shortcuts from Figma). */
export const NAV_LINKS: NavLink[] = [
  { label: "Customers", href: "/customers", shortcut: "C" },
  { label: "Features", href: "/features", shortcut: "F" },
  { label: "Pricing", href: "/pricing", shortcut: "P" },
];

/** Footer link columns. `#` placeholders are filled in as those pages ship. */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Customers", href: "/customers" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];
