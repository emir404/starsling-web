"use client";

import { useEffect } from "react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { cn } from "@/lib/utils";

/**
 * Route-segment error boundary (wraps the app below the root layout). Must be a
 * Client Component. Next 16.2 forwards `unstable_retry` to re-render the segment;
 * we fall back to the older `reset` so this stays robust across versions.
 */
export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <section className="w-full px-6 sm:px-[60px]">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1320px] flex-col items-center justify-center gap-6 border-x border-hairline px-6 py-28 text-center sm:px-14">
        <Eyebrow>Something went wrong</Eyebrow>
        <h1 className="text-h2 font-heading font-medium text-balance">
          An unexpected error occurred
        </h1>
        <p className="max-w-md text-pretty text-foreground/70">
          Sorry — something broke on our end. You can try again, or head back home.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-foreground/40">Ref: {error.digest}</p>
        ) : null}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => retry?.()} className={cn(buttonVariants())}>
            Try again
          </button>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
