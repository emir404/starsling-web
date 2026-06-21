"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Footer theme switcher — a square tile sized to the Figma chip (38px). Like the
 * header `ThemeToggle`, the sun/moon swap is driven purely by the `dark:` CSS
 * variant (hydration-safe); `resolvedTheme` is read only inside the click
 * handler. The tile colours are fixed across themes to match the dark band.
 */
export function FooterThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="relative grid size-[38px] shrink-0 place-items-center bg-[#30a6bb]/10 text-white/80 transition-colors hover:bg-[#30a6bb]/20 hover:text-white"
    >
      <SunIcon className="size-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute size-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
