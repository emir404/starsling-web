/**
 * Route-level loading fallback (shown during navigation/streaming). On-brand,
 * minimal, and motion-safe — the pulse stops under reduced-motion preferences.
 */
export default function Loading() {
  return (
    <section className="w-full px-6 sm:px-[60px]">
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1320px] items-center justify-center border-x border-hairline px-6 py-28 sm:px-14">
        <div className="flex items-center gap-3 font-mono text-sm uppercase tracking-[0.02em] text-foreground/50">
          <span
            aria-hidden
            className="size-3 animate-pulse bg-brand motion-reduce:animate-none"
          />
          Loading
        </div>
      </div>
    </section>
  );
}
