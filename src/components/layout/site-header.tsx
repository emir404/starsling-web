"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useScrolled } from "@/hooks/use-scrolled";
import { NAV_LINKS } from "@/content/nav";
import { SITE_CONFIG } from "@/lib/site";

/**
 * Sticky site header, 1:1 with Figma (nodes 117:174 / 117:1087).
 * - At the top: transparent, logo left, mono nav pills pushed right, no CTA.
 * - Once scrolled: solid `bg-header`, logo + nav cluster left, "Join Waitlist" CTA right.
 * Responsive: rem-based sizing, centered max-width column, nav collapses to a Sheet below `lg`.
 */
export function SiteHeader() {
  const scrolled = useScrolled(24);

  return (
    <header
      className={cn(
        "sticky inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-header" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1920px] items-center px-6 md:px-12 lg:h-[6.25rem]">
        <Link
          href="/"
          aria-label={`${SITE_CONFIG.name} home`}
          className="shrink-0"
        >
          <Logo />
        </Link>

        {/* Desktop nav — slides from right (top) to beside the logo (scrolled) */}
        <motion.nav
          layout
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "hidden items-center gap-1 lg:flex",
            scrolled ? "ml-6" : "ml-auto",
          )}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-brand-bright/5 px-4 py-3 font-mono text-base font-medium uppercase text-foreground/80 transition-colors hover:bg-brand-bright/10 hover:text-foreground"
            >
              {link.shortcut ? `[${link.shortcut}] ` : ""}
              {link.label}
            </Link>
          ))}
        </motion.nav>

        {/* Desktop CTA — appears on scroll */}
        <AnimatePresence initial={false}>
          {scrolled ? (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="ml-auto hidden lg:block"
            >
              <Link
                href={SITE_CONFIG.links.waitlist}
                className={cn(buttonVariants(), "h-auto px-4 py-3 text-base")}
              >
                Join Waitlist
              </Link>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Mobile menu trigger */}
        <div className="ml-auto lg:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
