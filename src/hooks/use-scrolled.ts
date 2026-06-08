"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` once the window has scrolled past `threshold` pixels.
 * Used to give the sticky header a background/blur on scroll.
 */
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
