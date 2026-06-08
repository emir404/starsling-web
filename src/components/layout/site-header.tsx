"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useScrolled } from "@/hooks/use-scrolled";
import { NAV_LINKS } from "@/content/nav";
import { SITE_CONFIG } from "@/lib/site";

/** Sticky site header. Gains a blurred background once the page scrolls. */
export function SiteHeader() {
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link href="/" aria-label={`${SITE_CONFIG.name} home`}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={SITE_CONFIG.links.waitlist}
            className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
          >
            Join the Waitlist
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
