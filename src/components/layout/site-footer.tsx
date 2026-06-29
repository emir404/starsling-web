import Link from "next/link";

import { FooterNetwork } from "@/components/layout/footer-network";
import { FooterThemeToggle } from "@/components/layout/footer-theme-toggle";
import { FOOTER_COLUMNS, FOOTER_STATUS } from "@/content/nav";
import { SITE_CONFIG } from "@/lib/site";

const isExternal = (href: string) => href.startsWith("http");

/** Shared tile recipe for footer links (mirrors the header nav pills). */
const tileClass =
  "flex items-center bg-[#30a6bb]/15 px-4 py-3 font-mono text-base font-medium uppercase whitespace-nowrap text-white/80 transition-colors hover:bg-[#30a6bb]/25 hover:text-white";

/**
 * Global footer (Figma 234:1281): a fixed dark-teal "island" — identical in
 * light and dark — with the wordmark, an "all systems operational" pill and a
 * theme toggle on the left, three mono link groups on the right, and the
 * interactive node-network filling the lower band.
 */
export function SiteFooter() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#191F20] text-white/80">
      <div className="mx-auto w-full max-w-[1320px] px-6 py-20 sm:px-14 sm:py-28">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          {/* brand + status + theme */}
          <div className="flex flex-col gap-8">
            {/* Always-white wordmark: the shared <Logo> hardcodes dark:invert,
                which would vanish on this dark band in light mode. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG */}
            <img
              src="/starsling-logo.svg"
              alt={SITE_CONFIG.name}
              width={302}
              height={64}
              className="h-12 w-auto invert sm:h-16"
            />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 bg-[#30a6bb]/10 px-3.5 py-2.5">
                <span aria-hidden className="size-4 shrink-0 bg-[#30a6bb]" />
                <span className="font-mono text-sm font-medium uppercase text-white/80">
                  {FOOTER_STATUS}
                </span>
              </div>
              <FooterThemeToggle />
            </div>
          </div>

          {/* link groups — one row per category: [label] [links…] */}
          <nav className="flex flex-col gap-1">
            {FOOTER_COLUMNS.map((column) => (
              <div
                key={column.title}
                className="flex flex-col gap-1 sm:flex-row sm:items-start"
              >
                <span className="flex items-center bg-[#30a6bb]/[0.07] px-4 py-3 font-mono text-base font-medium uppercase text-white/80 sm:w-[100px]">
                  {column.title}
                </span>
                <div className="flex flex-wrap gap-1">
                  {column.links.map((link) => {
                    const label = `${link.shortcut ? `[${link.shortcut}] ` : ""}${link.label}`;
                    return isExternal(link.href) ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={tileClass}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link key={link.label} href={link.href} className={tileClass}>
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <FooterNetwork />
    </footer>
  );
}
