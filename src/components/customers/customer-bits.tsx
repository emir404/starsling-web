import { cn } from "@/lib/utils";
import type { Customer } from "@/types/customers";

/** Two-letter monogram fallback when an avatar asset is missing. */
export function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Company wordmark — the brand SVG when available, else the name as text. */
export function CustomerWordmark({
  customer,
  className,
}: {
  customer: Pick<Customer, "company" | "logoSrc">;
  className?: string;
}) {
  if (customer.logoSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static brand wordmark SVG
      <img
        src={customer.logoSrc}
        alt={`${customer.company} logo`}
        className={cn("h-7 w-auto dark:invert", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        "font-sans text-2xl font-medium tracking-tight text-foreground",
        className,
      )}
    >
      {customer.company}
    </span>
  );
}

/** Avatar (or initials chip) + name/role lockup for a case-study quote. */
export function AuthorLockup({ quote }: { quote: Customer["quote"] }) {
  return (
    <div className="flex items-center gap-3">
      {quote.avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- small fixed-size avatar
        <img
          src={quote.avatarSrc}
          alt={quote.author}
          width={40}
          height={40}
          className="size-10 shrink-0 border border-hairline object-cover"
        />
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center bg-brand/15 font-mono text-sm font-medium text-brand">
          {initials(quote.author)}
        </span>
      )}
      <div className="leading-tight">
        <p className="text-sm font-medium text-foreground">{quote.author}</p>
        <p className="text-sm text-foreground/60">{quote.role}</p>
      </div>
    </div>
  );
}
