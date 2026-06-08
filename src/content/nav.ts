import type { FooterColumn, NavLink } from "@/types/content";

/** Primary header navigation — maps to the dedicated marketing routes. */
export const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "/features" },
  { label: "Customers", href: "/customers" },
  { label: "Pricing", href: "/pricing" },
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
