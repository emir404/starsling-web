import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/shared/eyebrow";
import { cn } from "@/lib/utils";

/**
 * Branded 404. Renders inside the root layout (header + footer wrap it), so it
 * only needs to fill the main column. Next returns a 404 status for this route.
 */
export default function NotFound() {
  return (
    <section className="w-full px-6 sm:px-[60px]">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1320px] flex-col items-center justify-center gap-6 border-x border-hairline px-6 py-28 text-center sm:px-14">
        <Eyebrow>Error 404</Eyebrow>
        <p className="font-mono text-[clamp(3.5rem,12vw,7rem)] font-medium leading-none tracking-[-0.04em] text-foreground">
          404
        </p>
        <h1 className="text-h2 font-heading font-medium text-balance">Page not found</h1>
        <p className="max-w-md text-pretty text-foreground/70">
          The page you’re looking for doesn’t exist or has moved. Let’s get you back on track.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className={cn(buttonVariants())}>
            Back to home
          </Link>
          <Link href="/blog" className={cn(buttonVariants({ variant: "outline" }))}>
            Read the blog
          </Link>
        </div>
      </div>
    </section>
  );
}
