"use client";

import "./globals.css";

/**
 * Last-resort boundary for errors thrown in the root layout itself. It replaces
 * the whole document, so it must render its own <html>/<body> and import global
 * styles. Metadata exports aren't supported here — use a plain <title>.
 */
export default function GlobalError({
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  const retry = unstable_retry ?? reset;

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground antialiased">
        <title>Something went wrong — Starsling</title>
        <p className="font-mono text-sm uppercase tracking-[0.02em] text-foreground/60">
          Something went wrong
        </p>
        <h1 className="text-3xl font-medium tracking-[-0.02em]">
          The app hit an unexpected error
        </h1>
        <p className="max-w-md text-foreground/70">
          Please try again. If the problem persists, come back in a little while.
        </p>
        <button
          type="button"
          onClick={() => retry?.()}
          className="bg-primary px-5 py-3 font-mono text-sm font-bold uppercase tracking-[-0.01em] text-primary-foreground transition-colors hover:bg-brand-dark"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
